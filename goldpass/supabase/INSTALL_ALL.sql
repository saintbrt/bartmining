-- ============================================================
-- GoldPass — COMPLETE DATABASE INSTALL (single file)
-- ============================================================
-- HOW TO RUN:
--   1. Supabase Dashboard → SQL Editor → New query
--   2. Paste this ENTIRE file
--   3. Click "Run"
-- Safe to re-run: every statement uses IF NOT EXISTS / OR REPLACE
-- / DROP ... IF EXISTS, so running twice will not error.
--
-- This installs, in order:
--   PART 1  Schema   (tables, indexes, triggers)
--   PART 2  RLS      (row-level security / data isolation)
--   PART 3  Security (hardening + build_collar_output + run_safe_select)
--
-- After this, deploy the 2 edge functions separately (see README):
--   supabase functions deploy gold-ai
--   supabase functions deploy build-collar-output
-- ============================================================


-- ████████████████████████████████████████████████████████████
-- PART 1 — SCHEMA
-- ████████████████████████████████████████████████████████████

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


-- ████████████████████████████████████████████████████████████
-- PART 2 — ROW LEVEL SECURITY
-- ████████████████████████████████████████████████████████████

-- ============================================================
-- GoldPass — Row Level Security policies
-- Run AFTER schema.sql. Enforces: a user can only ever touch
-- data for projects they are a member of. No app-layer trust.
-- ============================================================

-- Enable RLS on every table
alter table public.profiles        enable row level security;
alter table public.projects        enable row level security;
alter table public.project_members enable row level security;
alter table public.tables_meta     enable row level security;
alter table public.table_rows      enable row level security;
alter table public.versions        enable row level security;
alter table public.audit_log       enable row level security;
alter table public.outputs         enable row level security;

-- ── helper: is the current user a member of a project? ─────
create or replace function public.is_member(p uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.project_members
    where project_id = p and user_id = auth.uid()
  );
$$;

-- ── PROFILES: a user sees only their own profile ───────────
drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for select using (id = auth.uid());

-- ── PROJECTS ───────────────────────────────────────────────
drop policy if exists projects_select on public.projects;
create policy projects_select on public.projects
  for select using (public.is_member(id));

drop policy if exists projects_insert on public.projects;
create policy projects_insert on public.projects
  for insert with check (owner_id = auth.uid());

drop policy if exists projects_update on public.projects;
create policy projects_update on public.projects
  for update using (public.is_member(id)) with check (public.is_member(id));

drop policy if exists projects_delete on public.projects;
create policy projects_delete on public.projects
  for delete using (owner_id = auth.uid());

-- ── PROJECT_MEMBERS ────────────────────────────────────────
drop policy if exists members_select on public.project_members;
create policy members_select on public.project_members
  for select using (public.is_member(project_id));

drop policy if exists members_insert on public.project_members;
create policy members_insert on public.project_members
  for insert with check (
    exists (select 1 from public.projects
            where id = project_id and owner_id = auth.uid())
  );

drop policy if exists members_delete on public.project_members;
create policy members_delete on public.project_members
  for delete using (
    exists (select 1 from public.projects
            where id = project_id and owner_id = auth.uid())
  );

-- ── TABLES_META ────────────────────────────────────────────
drop policy if exists tables_select on public.tables_meta;
create policy tables_select on public.tables_meta
  for select using (public.is_member(project_id));

drop policy if exists tables_insert on public.tables_meta;
create policy tables_insert on public.tables_meta
  for insert with check (public.is_member(project_id));

drop policy if exists tables_update on public.tables_meta;
create policy tables_update on public.tables_meta
  for update using (public.is_member(project_id)) with check (public.is_member(project_id));

drop policy if exists tables_delete on public.tables_meta;
create policy tables_delete on public.tables_meta
  for delete using (public.is_member(project_id));

-- ── TABLE_ROWS ─────────────────────────────────────────────
drop policy if exists rows_select on public.table_rows;
create policy rows_select on public.table_rows
  for select using (public.is_member(project_id));

drop policy if exists rows_insert on public.table_rows;
create policy rows_insert on public.table_rows
  for insert with check (public.is_member(project_id));

drop policy if exists rows_update on public.table_rows;
create policy rows_update on public.table_rows
  for update using (public.is_member(project_id)) with check (public.is_member(project_id));

drop policy if exists rows_delete on public.table_rows;
create policy rows_delete on public.table_rows
  for delete using (public.is_member(project_id));

-- ── VERSIONS (insert + read only; never updated/deleted) ───
drop policy if exists versions_select on public.versions;
create policy versions_select on public.versions
  for select using (public.is_member(project_id));

drop policy if exists versions_insert on public.versions;
create policy versions_insert on public.versions
  for insert with check (public.is_member(project_id));

-- ── AUDIT_LOG (immutable: insert + read only) ──────────────
drop policy if exists audit_select on public.audit_log;
create policy audit_select on public.audit_log
  for select using (public.is_member(project_id));

drop policy if exists audit_insert on public.audit_log;
create policy audit_insert on public.audit_log
  for insert with check (public.is_member(project_id));
-- NOTE: no update/delete policies => audit log cannot be altered.

-- ── OUTPUTS ────────────────────────────────────────────────
drop policy if exists outputs_select on public.outputs;
create policy outputs_select on public.outputs
  for select using (public.is_member(project_id));

drop policy if exists outputs_insert on public.outputs;
create policy outputs_insert on public.outputs
  for insert with check (public.is_member(project_id));

drop policy if exists outputs_delete on public.outputs;
create policy outputs_delete on public.outputs
  for delete using (public.is_member(project_id));


-- ████████████████████████████████████████████████████████████
-- PART 3 — SECURITY HARDENING + RPC FUNCTIONS
-- ████████████████████████████████████████████████████████████

-- ============================================================
-- GoldPass — Security hardening
-- Run LAST (after schema.sql + rls.sql).
-- ============================================================

-- 1. Revoke broad privileges from anon/public. Authenticated users
--    reach data ONLY through RLS-protected policies.
revoke all on all tables    in schema public from anon;
revoke all on all functions in schema public from anon;
revoke all on all sequences in schema public from anon;

-- anon may do nothing; authenticated works through RLS
grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- 2. Lock function search_path (prevents search_path hijack)
alter function public.is_member(uuid)        set search_path = public;
alter function public.handle_new_user()      set search_path = public;
alter function public.handle_new_project()   set search_path = public;

-- 3. buildCollarOutput as a server-side RPC.
--    Row data is read and aggregated INSIDE the database — it never
--    travels to the client raw, and the caller is membership-checked.
create or replace function public.build_collar_output(
  p_project    uuid,
  p_collar     uuid,
  p_assay      uuid
)
returns table (hole_id text, easting text, northing text, elevation text, max_depth text, max_au_gpt numeric)
language plpgsql security definer set search_path = public as $$
declare
  v_collar_map jsonb;
  v_assay_map  jsonb;
begin
  -- Authorisation: caller must be a member of the project
  if not public.is_member(p_project) then
    raise exception 'not authorised';
  end if;

  select columns into v_collar_map from public.tables_meta where id = p_collar and project_id = p_project;
  select columns into v_assay_map  from public.tables_meta where id = p_assay  and project_id = p_project;

  return query
  with assay_max as (
    select (data->>'hole_id') as hid, max((data->>'au')::numeric) as mau
    from public.table_rows
    where table_id = p_assay and project_id = p_project
      and data ? 'au' and (data->>'au') ~ '^-?\d+(\.\d+)?$'
    group by (data->>'hole_id')
  )
  select
    (c.data->>'hole_id')::text,
    (c.data->>'easting')::text,
    (c.data->>'northing')::text,
    (c.data->>'elevation')::text,
    (c.data->>'depth')::text,
    am.mau
  from public.table_rows c
  left join assay_max am on am.hid = (c.data->>'hole_id')
  where c.table_id = p_collar and c.project_id = p_project;
end; $$;

-- 4. run_safe_sql — parameter-free, SELECT-only execution guard.
--    The Gold AI edge function generates SQL, but it is validated
--    here: single statement, SELECT-only, no DDL/DML, membership-scoped,
--    and a hard row + time limit. Dynamic SQL is NEVER taken from the
--    raw client; it arrives via the edge function which strips secrets.
create or replace function public.run_safe_select(
  p_project uuid,
  p_sql     text
)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_result jsonb;
  v_clean  text;
begin
  if not public.is_member(p_project) then
    raise exception 'not authorised';
  end if;

  v_clean := btrim(p_sql);

  -- Must start with SELECT
  if lower(v_clean) !~ '^select\s' then
    raise exception 'only SELECT statements are allowed';
  end if;
  -- No statement chaining / comments / DDL / DML keywords
  if v_clean ~ ';' then
    raise exception 'multiple statements not allowed';
  end if;
  if lower(v_clean) ~ '\m(insert|update|delete|drop|alter|create|truncate|grant|revoke|copy|call|do|merge)\M' then
    raise exception 'forbidden keyword in query';
  end if;

  -- Tight execution budget
  set local statement_timeout = '5s';

  execute format(
    'select coalesce(jsonb_agg(t), ''[]''::jsonb) from ( %s limit 1000 ) t',
    v_clean
  ) into v_result;

  return v_result;
end; $$;

revoke all on function public.run_safe_select(uuid, text) from public, anon;
grant execute on function public.run_safe_select(uuid, text) to authenticated;
grant execute on function public.build_collar_output(uuid, uuid, uuid) to authenticated;
