-- ============================================================
-- GoldPass — Production schema (Supabase / Postgres)
-- Run in Supabase SQL editor BEFORE rls.sql and security.sql
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ── profiles (mirrors auth.users) ──────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text,
  created_at  timestamptz not null default now()
);

-- ── projects ───────────────────────────────────────────────
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── project_members (access control) ───────────────────────
create table if not exists public.project_members (
  project_id  uuid not null references public.projects(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'editor' check (role in ('owner','editor','viewer')),
  added_at    timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- ── tables_meta (one row per imported table) ───────────────
create table if not exists public.tables_meta (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 200),
  type        text not null default 'other'
              check (type in ('collar','assay','survey','lithology','child','other')),
  columns     jsonb not null default '{}'::jsonb,  -- { "HOLEID": "hole_id", ... }
  row_count   integer not null default 0 check (row_count >= 0),
  parent_ids  uuid[] default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── table_rows (row data — JSONB, one row per record) ──────
create table if not exists public.table_rows (
  id          bigserial primary key,
  table_id    uuid not null references public.tables_meta(id) on delete cascade,
  project_id  uuid not null references public.projects(id) on delete cascade,
  row_index   integer not null,
  data        jsonb not null
);

-- ── versions (immutable snapshots metadata) ────────────────
create table if not exists public.versions (
  id          uuid primary key default gen_random_uuid(),
  table_id    uuid not null references public.tables_meta(id) on delete cascade,
  project_id  uuid not null references public.projects(id) on delete cascade,
  operation   text not null,
  row_count   integer not null default 0,
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

-- ── audit_log (immutable) ──────────────────────────────────
create table if not exists public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references public.projects(id) on delete cascade,
  table_id    uuid,
  operation   text not null,
  details     text,
  user_id     uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

-- ── outputs ────────────────────────────────────────────────
create table if not exists public.outputs (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  name        text not null,
  format      text not null default 'csv',
  row_count   integer not null default 0,
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

-- ── indexes (performance) ──────────────────────────────────
create index if not exists idx_projects_owner    on public.projects(owner_id);
create index if not exists idx_members_user       on public.project_members(user_id);
create index if not exists idx_tables_project     on public.tables_meta(project_id);
create index if not exists idx_rows_table         on public.table_rows(table_id);
create index if not exists idx_rows_project       on public.table_rows(project_id);
create index if not exists idx_rows_holeid        on public.table_rows((data->>'hole_id'));
create index if not exists idx_versions_table     on public.versions(table_id);
create index if not exists idx_audit_project      on public.audit_log(project_id, created_at desc);
create index if not exists idx_outputs_project    on public.outputs(project_id);

-- ── auto-create profile + owner membership ─────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── owner auto-membership on project create ────────────────
create or replace function public.handle_new_project()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.project_members (project_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict do nothing;
  return new;
end; $$;

drop trigger if exists on_project_created on public.projects;
create trigger on_project_created
  after insert on public.projects
  for each row execute function public.handle_new_project();
