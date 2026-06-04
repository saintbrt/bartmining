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
