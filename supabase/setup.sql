-- ============================================================================
-- GoldPass — Supabase schema, indexes and Row Level Security
-- Run this file manually in the Supabase Dashboard → SQL Editor.
-- ============================================================================

-- ── 0. CLEAN SLATE: drop all old GoldPass tables ────────────────────────────
-- WARNING: this permanently deletes ALL existing GoldPass data (projects,
-- imported tables, rows, versions, audit history, outputs, stage status).
-- Drop order doesn't matter thanks to CASCADE.

drop table if exists public.project_stages cascade;
drop table if exists public.outputs        cascade;
drop table if exists public.audit_log      cascade;
drop table if exists public.versions       cascade;
drop table if exists public.table_rows     cascade;
drop table if exists public.tables_meta    cascade;
drop table if exists public.projects       cascade;
drop function if exists public.owns_project(uuid) cascade;
drop function if exists public.touch_updated_at() cascade;

-- ── 1. Tables ───────────────────────────────────────────────────────────────

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  owner_id    uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.tables_meta (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  name        text not null,
  type        text not null default 'other',          -- collar | assay | survey | lithology | child | merged | other
  columns     jsonb not null default '{}'::jsonb,     -- { "HOLEID": "hole_id", "AU_GPT": "au", ... }
  row_count   integer not null default 0,
  parent_ids  uuid[] default null,                    -- source tables for derived/merged tables
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.table_rows (
  id          bigint generated always as identity primary key,
  table_id    uuid not null references public.tables_meta(id) on delete cascade,
  project_id  uuid not null references public.projects(id) on delete cascade,
  row_index   integer not null,
  data        jsonb not null
);

create table if not exists public.versions (
  id          uuid primary key default gen_random_uuid(),
  table_id    uuid not null references public.tables_meta(id) on delete cascade,
  project_id  uuid not null references public.projects(id) on delete cascade,
  operation   text not null,
  row_count   integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  table_id    uuid,
  operation   text not null,
  details     text not null default '',
  user_id     uuid default auth.uid(),
  created_at  timestamptz not null default now()
);

-- Outputs now persist the full result rows (data jsonb), so every generated
-- file can be re-downloaded later — not just during the session that built it.
create table if not exists public.outputs (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  name        text not null,
  format      text not null default 'csv',
  row_count   integer not null default 0,
  data        jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now()
);
-- If the outputs table pre-existed without the data column:
alter table public.outputs add column if not exists data jsonb not null default '[]'::jsonb;

-- Server-persisted workflow stage status (replaces localStorage).
create table if not exists public.project_stages (
  project_id  uuid primary key references public.projects(id) on delete cascade,
  validation  text not null default 'pending' check (validation in ('pending','done')),
  cleaning    text not null default 'pending' check (cleaning   in ('pending','done')),
  analysis    text not null default 'pending' check (analysis   in ('pending','done')),
  updated_at  timestamptz not null default now()
);

-- ── 2. Indexes ──────────────────────────────────────────────────────────────

create index if not exists idx_tables_meta_project on public.tables_meta(project_id);
create index if not exists idx_table_rows_table    on public.table_rows(table_id, row_index);
create index if not exists idx_table_rows_project  on public.table_rows(project_id);
create index if not exists idx_versions_table      on public.versions(table_id);
create index if not exists idx_audit_project       on public.audit_log(project_id, created_at desc);
create index if not exists idx_outputs_project     on public.outputs(project_id, created_at desc);

-- ── 3. updated_at trigger ───────────────────────────────────────────────────

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_projects_touch on public.projects;
create trigger trg_projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_tables_meta_touch on public.tables_meta;
create trigger trg_tables_meta_touch before update on public.tables_meta
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_project_stages_touch on public.project_stages;
create trigger trg_project_stages_touch before update on public.project_stages
  for each row execute function public.touch_updated_at();

-- ── 4. Row Level Security ───────────────────────────────────────────────────
-- The browser talks to these tables directly with the anon key, so RLS is the
-- data perimeter: every row is scoped to the authenticated project owner.

alter table public.projects        enable row level security;
alter table public.tables_meta     enable row level security;
alter table public.table_rows      enable row level security;
alter table public.versions       enable row level security;
alter table public.audit_log       enable row level security;
alter table public.outputs         enable row level security;
alter table public.project_stages  enable row level security;

-- helper: does the current user own this project?
create or replace function public.owns_project(pid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.projects p where p.id = pid and p.owner_id = auth.uid());
$$;

-- projects
drop policy if exists gp_projects_select on public.projects;
create policy gp_projects_select on public.projects for select using (owner_id = auth.uid());
drop policy if exists gp_projects_insert on public.projects;
create policy gp_projects_insert on public.projects for insert with check (owner_id = auth.uid());
drop policy if exists gp_projects_update on public.projects;
create policy gp_projects_update on public.projects for update using (owner_id = auth.uid());
drop policy if exists gp_projects_delete on public.projects;
create policy gp_projects_delete on public.projects for delete using (owner_id = auth.uid());

-- project-scoped tables: one policy set each, all delegating to owns_project()
do $$
declare t text;
begin
  foreach t in array array['tables_meta','table_rows','versions','audit_log','outputs','project_stages'] loop
    execute format('drop policy if exists gp_%s_select on public.%s', t, t);
    execute format('create policy gp_%s_select on public.%s for select using (public.owns_project(project_id))', t, t);
    execute format('drop policy if exists gp_%s_insert on public.%s', t, t);
    execute format('create policy gp_%s_insert on public.%s for insert with check (public.owns_project(project_id))', t, t);
    execute format('drop policy if exists gp_%s_update on public.%s', t, t);
    execute format('create policy gp_%s_update on public.%s for update using (public.owns_project(project_id))', t, t);
    execute format('drop policy if exists gp_%s_delete on public.%s', t, t);
    execute format('create policy gp_%s_delete on public.%s for delete using (public.owns_project(project_id))', t, t);
  end loop;
end $$;

-- ── 5. Edge function secret (run via CLI, not SQL) ──────────────────────────
-- The gold-ai edge function needs an Anthropic API key:
--   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
--   supabase functions deploy gold-ai
