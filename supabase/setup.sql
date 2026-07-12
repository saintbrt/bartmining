-- ============================================================================
-- GoldPass — Supabase schema, indexes and Row Level Security
-- Run this file manually in the Supabase Dashboard → SQL Editor.
-- ============================================================================

-- ── 0. CLEAN SLATE: drop all old GoldPass tables ────────────────────────────
-- WARNING: this permanently deletes ALL existing GoldPass data (projects,
-- imported tables, rows, versions, audit history, outputs, stage status).
-- Drop order doesn't matter thanks to CASCADE.

drop table if exists public.workbench_state cascade;
drop table if exists public.ai_usage        cascade;
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
  data        jsonb not null default '[]'::jsonb,  -- full row snapshot so any version can be restored
  created_at  timestamptz not null default now()
);
-- If versions pre-existed without the snapshot column:
alter table public.versions add column if not exists data jsonb not null default '[]'::jsonb;

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

-- Per-stage workbench layout, so a session resumes exactly where it left off:
-- which files are on the canvas, their x/y positions, and the current selection.
create table if not exists public.workbench_state (
  project_id  uuid not null references public.projects(id) on delete cascade,
  stage       text not null,                          -- validation | cleaning | analysis
  layout      jsonb not null default '[]'::jsonb,     -- [{ "table_id": "...", "x": 40, "y": 120 }, ...]
  selection   uuid[] not null default '{}',           -- currently selected table ids
  updated_at  timestamptz not null default now(),
  primary key (project_id, stage)
);

-- One row per Claude call, so AI token usage / spend can be summed for the
-- monthly $50 budget meter on the Settings page. Counts come straight from the
-- Anthropic response inside the gold-ai edge function (exact, not estimated).
create table if not exists public.ai_usage (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  model       text not null default 'claude-sonnet-4-6',
  tokens_in   integer not null default 0,
  tokens_out  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ── 2. Indexes ──────────────────────────────────────────────────────────────

create index if not exists idx_tables_meta_project on public.tables_meta(project_id);
create index if not exists idx_table_rows_table    on public.table_rows(table_id, row_index);
create index if not exists idx_table_rows_project  on public.table_rows(project_id);
create index if not exists idx_versions_table      on public.versions(table_id);
create index if not exists idx_audit_project       on public.audit_log(project_id, created_at desc);
create index if not exists idx_outputs_project     on public.outputs(project_id, created_at desc);
create index if not exists idx_ai_usage_project     on public.ai_usage(project_id, created_at desc);
-- GIN index on the row payload so the cross-file checks (orphan/undrilled/
-- duplicate hole lookups) can probe values inside data jsonb without a full
-- scan. Column key names vary per file, so a generic GIN beats a fixed
-- expression index here.
create index if not exists idx_table_rows_data_gin  on public.table_rows using gin (data jsonb_path_ops);

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
alter table public.workbench_state enable row level security;
alter table public.ai_usage        enable row level security;

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
  foreach t in array array['tables_meta','table_rows','versions','audit_log','outputs','project_stages','workbench_state','ai_usage'] loop
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

-- ============================================================================
-- ── 5. Data-check / analysis / output RPCs (Step 2: full SQL port) ──────────
-- ============================================================================
-- These reproduce src/lib/goldpass/dataChecks/index.ts on the server so the
-- heavy work runs where the rows live. All are SECURITY DEFINER and therefore
-- BYPASS RLS — every one re-checks project ownership via gp_assert_owner().
--
-- PARITY CAVEATS (documented, audited against the TS source):
--  * gp_num() mirrors JS parseFloat (leading-number extraction, NaN -> null).
--  * gp_fixed() mirrors Number.toFixed (half-up rounding; JS toFixed is
--    effectively the same for the magnitudes here).
--  * Population stddev (stddev_pop) matches the TS stddev() (divide by n).
--  * Row order uses row_index; ties in per-hole sorts add row_index as a
--    stable tiebreak to match the stable JS sort.
--  * gp_col() "first column wins" relies on jsonb key order, which Postgres
--    does not strictly guarantee; only matters when two source columns map to
--    the SAME role (rare). Behaviour matches invertColMapping otherwise.
--  * find_duplicates uses canonical jsonb text rather than JS JSON.stringify —
--    the SET of duplicate rows is identical; only the internal key differs.
--  * The AI free-text SQL runner is intentionally NOT ported: that dialect's
--    "FROM a, b" means CONCATENATE rows (not a SQL cross join), so executing it
--    as real Postgres would change results. It stays in sqlEngine.ts, fed by
--    rows loaded from Supabase.

-- helper: raise unless the caller owns the project (RLS substitute for DEFINER)
create or replace function public.gp_assert_owner(pid uuid)
returns void language plpgsql security definer set search_path = public as $func$
begin
  if not public.owns_project(pid) then
    raise exception 'GP-1403: not authorised for project %', pid using errcode = '42501';
  end if;
end $func$;

-- helper: original column name mapped to a role (first match wins)
create or replace function public.gp_col(p_table uuid, p_role text)
returns text language sql stable set search_path = public as $func$
  select key from jsonb_each_text((select columns from public.tables_meta where id = p_table))
  where value = p_role limit 1;
$func$;

-- helper: JS parseFloat-equivalent (leading numeric, else null)
create or replace function public.gp_num(val text)
returns numeric language sql immutable as $func$
  select case
    when val ~ '^\s*[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?'
    then (substring(val from '^\s*([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)'))::numeric
    else null end;
$func$;

-- helper: Number.toFixed(n) equivalent as text
create or replace function public.gp_fixed(val numeric, places int)
returns text language sql immutable as $func$
  select trim(to_char(round(val, places), 'FM999999999990.' || repeat('0', places)));
$func$;

-- helper: normalised full-row key (sorted keys, trimmed text values)
create or replace function public.gp_rowkey(d jsonb)
returns text language sql immutable as $func$
  select coalesce(string_agg(key || '=' || btrim(coalesce(value, '')), '|' order by key), '')
  from jsonb_each_text(d);
$func$;

-- helper: jsonb array of the non-null column names (mirrors TS .filter(Boolean))
create or replace function public.gp_cols(variadic cols text[])
returns jsonb language sql immutable as $func$
  select coalesce(jsonb_agg(c), '[]'::jsonb) from unnest(cols) c where c is not null;
$func$;

-- ── gp_run_check: parity port of runCheck() ─────────────────────────────────
-- Returns { issues: jsonb[], count: int, summary: text, cols: text[], error?: text }
create or replace function public.gp_run_check(
  p_check text, p_table uuid, p_compare uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $func$
declare
  v_pid uuid; v_cpid uuid;
  v_h text; v_f text; v_t text; v_e text; v_n text; v_z text;
  v_au text; v_cu text; v_ag text; v_hb text; v_gc text; v_ca text; v_cb text;
  v_issues jsonb := '[]'::jsonb; v_count int := 0; v_summary text := '';
  v_cols jsonb := '[]'::jsonb; v_a int; v_b int; v_r numeric; v_npairs int;
  v_em numeric; v_es numeric; v_nm numeric; v_ns numeric; v_ecount int;
  v_avge numeric; v_avgn numeric; v_sys text; v_conf text; v_notes text;
  v_colsA jsonb; v_colsB jsonb; v_fname text;
begin
  select project_id into v_pid from public.tables_meta where id = p_table;
  if v_pid is null then return jsonb_build_object('error','GP-2302: file not found'); end if;
  perform public.gp_assert_owner(v_pid);
  if p_compare is not null then
    select project_id into v_cpid from public.tables_meta where id = p_compare;
    perform public.gp_assert_owner(v_cpid);
  end if;

  v_h := gp_col(p_table,'hole_id'); v_f := gp_col(p_table,'from'); v_t := gp_col(p_table,'to');
  v_e := gp_col(p_table,'easting'); v_n := gp_col(p_table,'northing'); v_z := gp_col(p_table,'elevation');
  v_au := gp_col(p_table,'au'); v_cu := gp_col(p_table,'cu'); v_ag := gp_col(p_table,'ag');
  v_gc := coalesce(v_au, v_cu, v_ag);

  if p_check = 'missing_hole_ids' then
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
    from public.table_rows where table_id = p_table and btrim(coalesce(data->>v_h,'')) = '';
    v_summary := case when v_count = 0 then 'No missing Hole IDs found.'
      else v_count || ' row' || (case when v_count>1 then 's' else '' end) || ' have empty Hole IDs.' end;
    v_cols := case when v_h is not null then jsonb_build_array(v_h) else '[]'::jsonb end;

  elsif p_check = 'from_greater_than_to' then
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
    from public.table_rows where table_id = p_table
      and gp_num(data->>v_f) is not null and gp_num(data->>v_t) is not null
      and gp_num(data->>v_f) >= gp_num(data->>v_t);
    v_summary := case when v_count = 0 then 'No From >= To errors found.'
      else v_count || ' interval' || (case when v_count>1 then 's' else '' end) || ' where From >= To.' end;
    v_cols := gp_cols(v_f, v_t);

  elsif p_check = 'from_to_overlaps' then
    with base as (
      select data, gp_num(data->>v_f) fn, gp_num(data->>v_t) tn,
             btrim(coalesce(data->>v_h,'')) hid, row_index
      from public.table_rows where table_id = p_table),
    ord as (
      select *, lag(tn) over w prev_to from base where hid <> ''
      window w as (partition by hid order by coalesce(fn,0), row_index))
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
    from ord where prev_to is not null and fn is not null and fn < prev_to;
    v_summary := case when v_count = 0 then 'No overlapping intervals found.'
      else v_count || ' overlap' || (case when v_count>1 then 's' else '' end) || ' detected.' end;
    v_cols := gp_cols(v_h, v_f, v_t);

  elsif p_check = 'from_to_gaps' then
    with base as (
      select data, gp_num(data->>v_f) fn, gp_num(data->>v_t) tn,
             btrim(coalesce(data->>v_h,'')) hid, row_index
      from public.table_rows where table_id = p_table),
    ord as (
      select *, lag(tn) over w prev_to from base where hid <> ''
      window w as (partition by hid order by coalesce(fn,0), row_index))
    select coalesce(jsonb_agg((data || jsonb_build_object('_gap', gp_fixed(fn - prev_to, 3) || 'm')) order by row_index),'[]'), count(*)
    into v_issues, v_count
    from ord where prev_to is not null and fn is not null and fn > prev_to + 0.001;
    v_summary := case when v_count = 0 then 'No gaps between intervals found.'
      else v_count || ' gap' || (case when v_count>1 then 's' else '' end) || ' found.' end;
    v_cols := gp_cols(v_h, v_f, v_t);

  elsif p_check = 'duplicate_intervals' then
    with k as (select data, row_index,
      row_number() over (partition by concat_ws('|', coalesce(data->>v_h,''), coalesce(data->>v_f,''), coalesce(data->>v_t,'')) order by row_index) rn
      from public.table_rows where table_id = p_table)
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count from k where rn > 1;
    v_summary := case when v_count = 0 then 'No duplicate intervals found.'
      else v_count || ' duplicate interval' || (case when v_count>1 then 's' else '' end) || ' found.' end;
    v_cols := gp_cols(v_h, v_f, v_t);

  elsif p_check = 'negative_grades' then
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
    from public.table_rows where table_id = p_table and (
      (v_au is not null and gp_num(data->>v_au) < 0) or
      (v_cu is not null and gp_num(data->>v_cu) < 0) or
      (v_ag is not null and gp_num(data->>v_ag) < 0));
    v_summary := case when v_count = 0 then 'No negative grade values found.'
      else v_count || ' row' || (case when v_count>1 then 's' else '' end) || ' with negative grades.' end;
    v_cols := (select coalesce(jsonb_agg(c),'[]') from unnest(array[v_au,v_cu,v_ag]) c where c is not null);

  elsif p_check = 'coordinate_outliers' then
    select avg(gp_num(data->>v_e)), stddev_pop(gp_num(data->>v_e)), count(gp_num(data->>v_e))
      into v_em, v_es, v_ecount from public.table_rows where table_id = p_table;
    select avg(gp_num(data->>v_n)), stddev_pop(gp_num(data->>v_n))
      into v_nm, v_ns from public.table_rows where table_id = p_table;
    if v_ecount < 4 then
      v_summary := 'Not enough rows to compute outliers.';
    else
      select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
      from public.table_rows where table_id = p_table
        and gp_num(data->>v_e) is not null and gp_num(data->>v_n) is not null
        and (abs(gp_num(data->>v_e) - v_em) > 3*v_es or abs(gp_num(data->>v_n) - v_nm) > 3*v_ns);
      v_summary := case when v_count = 0
        then 'No outliers (mean E:' || round(v_em) || ', N:' || round(v_nm) || ').'
        else v_count || ' coordinate outlier' || (case when v_count>1 then 's' else '' end) || ' (>3σ).' end;
    end if;
    v_cols := gp_cols(v_e, v_n);

  elsif p_check = 'find_null_placeholders' then
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
    from public.table_rows tr where table_id = p_table and exists (
      select 1 from jsonb_each_text(tr.data) e
      where btrim(coalesce(e.value,'')) <> ''
        and lower(btrim(e.value)) = any(array['n/a','na','null','-','--','none','nil','9999','-99','-9999','#n/a','tbd','.']));
    v_summary := case when v_count = 0 then 'No disguised null placeholders found.'
      else v_count || ' row' || (case when v_count>1 then 's' else '' end) || ' contain placeholder values.' end;

  elsif p_check = 'check_collar_completeness' then
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
    from public.table_rows where table_id = p_table and (
      (case when v_e is not null then gp_num(data->>v_e) is null else true end) or
      (case when v_n is not null then gp_num(data->>v_n) is null else true end) or
      (case when v_z is not null then gp_num(data->>v_z) is null else false end));
    v_summary := case when v_count = 0 then 'All collar rows have complete coordinates.'
      else v_count || ' collar row' || (case when v_count>1 then 's' else '' end) || ' missing coordinates.' end;
    v_cols := gp_cols(v_e, v_n, v_z);

  elsif p_check = 'trim_whitespace' then
    select count(*) into v_count from public.table_rows tr, jsonb_each(tr.data) kv
    where table_id = p_table and jsonb_typeof(kv.value) = 'string'
      and (kv.value #>> '{}') <> btrim(kv.value #>> '{}');
    v_summary := case when v_count = 0 then 'No whitespace to trim.'
      else v_count || ' cell' || (case when v_count>1 then 's' else '' end) || ' have leading/trailing whitespace.' end;

  elsif p_check = 'standardise_hole_ids' then
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
    from public.table_rows where table_id = p_table
      and btrim(coalesce(data->>v_h,'')) <> ''
      and (btrim(data->>v_h) <> upper(btrim(data->>v_h)) or position(' ' in btrim(data->>v_h)) > 0);
    v_summary := case when v_count = 0 then 'All Hole IDs are already standardised.'
      else v_count || ' Hole ID' || (case when v_count>1 then 's' else '' end) || ' need standardisation.' end;
    v_cols := case when v_h is not null then jsonb_build_array(v_h) else '[]'::jsonb end;

  elsif p_check = 'remove_empty_rows' then
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
    from public.table_rows tr where table_id = p_table and not exists (
      select 1 from jsonb_each_text(tr.data) e where btrim(coalesce(e.value,'')) <> '');
    v_summary := case when v_count = 0 then 'No empty rows found.'
      else v_count || ' completely empty row' || (case when v_count>1 then 's' else '' end) || '.' end;

  elsif p_check = 'resolve_unit_conflicts' then
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
    from public.table_rows where table_id = p_table and (
      (v_au is not null and gp_num(data->>v_au) > 1000) or
      (v_cu is not null and gp_num(data->>v_cu) > 1000) or
      (v_ag is not null and gp_num(data->>v_ag) > 1000));
    v_summary := case when v_count = 0 then 'No unit conflicts detected.'
      else v_count || ' row' || (case when v_count>1 then 's' else '' end) || ' have grade values > 1000 (likely ppb in ppm column).' end;
    v_cols := (select coalesce(jsonb_agg(c),'[]') from unnest(array[v_au,v_cu,v_ag]) c where c is not null);

  elsif p_check = 'find_duplicates' then
    with k as (select data, row_index,
      row_number() over (partition by data::text order by row_index) rn
      from public.table_rows where table_id = p_table)
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count from k where rn > 1;
    v_summary := case when v_count = 0 then 'No duplicate rows found.'
      else v_count || ' duplicate row' || (case when v_count>1 then 's' else '' end) || ' found.' end;

  elsif p_check = 'detect_coord_system' then
    select avg(gp_num(data->>v_e)), avg(gp_num(data->>v_n)), count(gp_num(data->>v_e))
      into v_avge, v_avgn, v_ecount from public.table_rows where table_id = p_table;
    if v_ecount = 0 then
      v_summary := 'No easting values found.';
    else
      if abs(v_avgn) < 90 and abs(v_avge) < 180 then
        v_sys := 'WGS84 (decimal degrees)'; v_conf := 'High'; v_notes := 'Import into QGIS as EPSG:4326.';
      elsif v_avge > 100000 and v_avge < 1000000 and v_avgn > 7000000 and v_avgn < 11000000 then
        v_sys := 'Arc1960 / UTM Zone 36S (probable)'; v_conf := 'High';
        v_notes := 'WARNING: Arc1960 and WGS84 differ by up to 300 m in Tanzania. Do NOT silently reproject.';
      elsif v_avge > 100000 and v_avge < 1000000 and v_avgn > 1000000 then
        v_sys := 'UTM (zone unknown)'; v_conf := 'Medium'; v_notes := 'Confirm the zone and datum before use in QGIS.';
      else v_sys := 'Unknown'; v_conf := 'Low'; v_notes := ''; end if;
      v_summary := 'Detected: ' || v_sys || ' (' || v_conf || '). Avg E: ' || round(v_avge) || ', N: ' || round(v_avgn) || '.';
      return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary',v_summary,
        'cols', gp_cols(v_e, v_n),
        'coordInfo', jsonb_build_object('system',v_sys,'confidence',v_conf,'notes',v_notes,'avgE',round(v_avge),'avgN',round(v_avgn)));
    end if;
    v_cols := gp_cols(v_e, v_n);

  elsif p_check = 'best_intercept' then
    if v_gc is null then return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary','No grade column mapped.','cols','[]'::jsonb); end if;
    with base as (
      select data, btrim(coalesce(data->>v_h,'')) hid, gp_num(data->>v_f) fn, gp_num(data->>v_t) tn, gp_num(data->>v_gc) gn, row_index
      from public.table_rows where table_id = p_table),
    valid as (select *, gn*(tn-fn) gt from base where hid <> '' and fn is not null and tn is not null and gn is not null),
    ranked as (select *, row_number() over (partition by hid order by gn*(tn-fn) desc, row_index) rn from valid)
    select coalesce(jsonb_agg((data || jsonb_build_object('_gt',gt,'_interval',gp_fixed(tn-fn,2)||'m','_grade',gn)) order by gt desc),'[]'), count(*)
    into v_issues, v_count from ranked where rn = 1;
    v_summary := case when v_count = 0 then 'No valid intervals.'
      else 'Best intercept per hole across ' || v_count || ' hole' || (case when v_count>1 then 's' else '' end) || ' (grade × thickness).' end;
    v_cols := gp_cols(v_h, v_f, v_t, v_gc);

  elsif p_check = 'rank_by_grade' then
    if v_gc is null then return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary','No grade column mapped.','cols','[]'::jsonb); end if;
    with base as (
      select data, btrim(coalesce(data->>v_h,'')) hid, gp_num(data->>v_gc) gn, row_index
      from public.table_rows where table_id = p_table),
    ranked as (select *, row_number() over (partition by hid order by gn desc, row_index) rn from base where hid <> '' and gn is not null)
    select coalesce(jsonb_agg((data || jsonb_build_object('_grade',gn)) order by gn desc),'[]'), count(*)
    into v_issues, v_count from ranked where rn = 1;
    v_summary := case when v_count = 0 then 'No grade values to rank.'
      else v_count || ' hole' || (case when v_count>1 then 's' else '' end) || ' ranked by peak grade.' end;
    v_cols := gp_cols(v_h, v_gc);

  elsif p_check = 'find_correlation' then
    v_ca := (array_remove(array[v_au,v_cu,v_ag], null))[1];
    v_cb := (array_remove(array[v_au,v_cu,v_ag], null))[2];
    if v_ca is null or v_cb is null then
      return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary','Need at least two grade columns to correlate.','cols','[]'::jsonb);
    end if;
    select corr(gp_num(data->>v_ca), gp_num(data->>v_cb)), count(*) into v_r, v_npairs
    from public.table_rows where table_id = p_table
      and gp_num(data->>v_ca) is not null and gp_num(data->>v_cb) is not null;
    if v_npairs < 3 then
      return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary','Not enough paired values.','cols','[]'::jsonb);
    end if;
    v_summary := 'Pearson r = ' || gp_fixed(v_r,3) || ' between ' || v_ca || ' and ' || v_cb || ' ('
      || (case when abs(v_r)>0.7 then 'strong' when abs(v_r)>0.4 then 'moderate' else 'weak' end)
      || ' ' || (case when v_r>=0 then 'positive' else 'negative' end) || ', n=' || v_npairs || ').';
    v_cols := jsonb_build_array(v_ca, v_cb);

  elsif p_check in ('find_undrilled','find_orphan_assays','find_missing_rows') then
    if p_compare is null then
      return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary','Select a comparison table to run this check.','cols','[]'::jsonb,'error','needs_compare');
    end if;
    v_hb := gp_col(p_compare,'hole_id');
    if v_h is null or v_hb is null then
      return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary','Both tables need a Hole ID column mapped.','cols','[]'::jsonb,'error','Both tables need a Hole ID column mapped.');
    end if;
    if p_check = 'find_undrilled' then
      select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
      from public.table_rows a where a.table_id = p_table and btrim(coalesce(a.data->>v_h,'')) <> ''
        and btrim(a.data->>v_h) not in (select btrim(coalesce(b.data->>v_hb,'')) from public.table_rows b where b.table_id = p_compare);
      v_summary := case when v_count = 0 then 'Every collar hole has matching interval data.'
        else v_count || ' collar hole' || (case when v_count>1 then 's' else '' end) || ' have no interval data.' end;
    elsif p_check = 'find_missing_rows' then
      select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
      from public.table_rows a where a.table_id = p_table and btrim(coalesce(a.data->>v_h,'')) <> ''
        and btrim(a.data->>v_h) not in (select btrim(coalesce(b.data->>v_hb,'')) from public.table_rows b where b.table_id = p_compare);
      v_summary := case when v_count = 0 then 'All holes in table A are present in table B.'
        else v_count || ' hole' || (case when v_count>1 then 's' else '' end) || ' in table A not found in table B.' end;
    else -- find_orphan_assays: unique first occurrence per orphan hole id
      with a as (select data, btrim(coalesce(data->>v_h,'')) id, row_index from public.table_rows where table_id = p_table),
      f as (select *, row_number() over (partition by id order by row_index) rn from a
            where id <> '' and id not in (select btrim(coalesce(b.data->>v_hb,'')) from public.table_rows b where b.table_id = p_compare))
      select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count from f where rn = 1;
      v_summary := case when v_count = 0 then 'Every interval hole has a matching collar.'
        else v_count || ' hole' || (case when v_count>1 then 's' else '' end) || ' have assays but no collar (orphans).' end;
    end if;
    v_cols := case when v_h is not null then jsonb_build_array(v_h) else '[]'::jsonb end;

  elsif p_check = 'diff_tables' then
    if p_compare is null then
      return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary','Select a comparison table to diff against.','cols','[]'::jsonb,'error','needs_compare');
    end if;
    with bk as (select gp_rowkey(data) k from public.table_rows where table_id = p_compare),
    ak as (select gp_rowkey(data) k from public.table_rows where table_id = p_table),
    onlya as (select data, row_index from public.table_rows where table_id = p_table and gp_rowkey(data) not in (select k from bk)),
    onlyb as (select data, row_index from public.table_rows where table_id = p_compare and gp_rowkey(data) not in (select k from ak))
    select
      (select coalesce(jsonb_agg((data || jsonb_build_object('_only_in','A','_missing_from','B')) order by row_index),'[]') from onlya)
      || (select coalesce(jsonb_agg((data || jsonb_build_object('_only_in','B','_missing_from','A')) order by row_index),'[]') from onlyb),
      (select count(*) from onlya), (select count(*) from onlyb)
    into v_issues, v_a, v_b;
    v_count := v_a + v_b;
    v_summary := case when v_count = 0 then 'Tables are identical row-for-row.'
      else v_a || ' row' || (case when v_a<>1 then 's' else '' end) || ' only in A, ' || v_b || ' only in B.' end;

  elsif p_check = 'duplicates_across' then
    if p_compare is null then
      return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary','Select a comparison table to check against.','cols','[]'::jsonb,'error','needs_compare');
    end if;
    v_hb := gp_col(p_compare,'hole_id');
    declare v_fb text := gp_col(p_compare,'from'); v_tb text := gp_col(p_compare,'to'); begin
    with bk as (
      select case when v_hb is not null
        then concat_ws('|', upper(btrim(coalesce(data->>v_hb,''))), btrim(coalesce(data->>v_fb,'')), btrim(coalesce(data->>v_tb,'')))
        else data::text end k
      from public.table_rows where table_id = p_compare)
    select coalesce(jsonb_agg(data order by row_index),'[]'), count(*) into v_issues, v_count
    from public.table_rows a where a.table_id = p_table and (
      case when v_h is not null
        then concat_ws('|', upper(btrim(coalesce(a.data->>v_h,''))), btrim(coalesce(a.data->>v_f,'')), btrim(coalesce(a.data->>v_t,'')))
        else a.data::text end) in (select k from bk);
    end;
    v_summary := case when v_count = 0 then 'No rows duplicated across the two tables.'
      else v_count || ' row' || (case when v_count>1 then 's' else '' end) || ' appear in both tables (cross-file duplicates).' end;
    v_cols := case when v_h is not null then jsonb_build_array(v_h) else '[]'::jsonb end;

  elsif p_check = 'reconcile_columns' then
    if p_compare is null then
      return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary','Select a comparison table to reconcile columns against.','cols','[]'::jsonb,'error','needs_compare');
    end if;
    select columns into v_colsA from public.tables_meta where id = p_table;
    select columns into v_colsB from public.tables_meta where id = p_compare;
    with diffs as (
      select ka as col, 'missing in B' as status, (v_colsA->>ka) as role
        from jsonb_object_keys(v_colsA) as ka where not v_colsB ? ka
      union all
      select kb, 'missing in A', (v_colsB->>kb)
        from jsonb_object_keys(v_colsB) as kb where not v_colsA ? kb
      union all
      select ka, 'role mismatch', 'A:' || (v_colsA->>ka) || ' vs B:' || (v_colsB->>ka)
        from jsonb_object_keys(v_colsA) as ka where v_colsB ? ka and (v_colsA->>ka) <> (v_colsB->>ka))
    select coalesce(jsonb_agg(jsonb_build_object('column',col,'status',status,'role',role)),'[]'), count(*)
    into v_issues, v_count from diffs;
    v_summary := case when v_count = 0 then 'Column structures match exactly.'
      else v_count || ' column difference' || (case when v_count>1 then 's' else '' end) || ' between the tables.' end;
    v_cols := jsonb_build_array('column','status','role');

  else
    return jsonb_build_object('issues','[]'::jsonb,'count',0,'summary','Function not implemented.','cols','[]'::jsonb);
  end if;

  return jsonb_build_object('issues',v_issues,'count',v_count,'summary',v_summary,'cols',v_cols);
end $func$;

-- ── gp_apply_fix: parity port of applyFix() — returns the NEW full row set ───
-- Returns { rows: jsonb[], count: int }. Caller (DB layer) replaces the table's
-- rows with these and snapshots a version.
create or replace function public.gp_apply_fix(p_check text, p_table uuid)
returns jsonb language plpgsql security definer set search_path = public as $func$
declare
  v_pid uuid; v_h text; v_f text; v_t text; v_au text; v_cu text; v_ag text;
  v_rows jsonb := '[]'::jsonb;
begin
  select project_id into v_pid from public.tables_meta where id = p_table;
  if v_pid is null then return jsonb_build_object('error','GP-2302: file not found'); end if;
  perform public.gp_assert_owner(v_pid);
  v_h := gp_col(p_table,'hole_id'); v_f := gp_col(p_table,'from'); v_t := gp_col(p_table,'to');
  v_au := gp_col(p_table,'au'); v_cu := gp_col(p_table,'cu'); v_ag := gp_col(p_table,'ag');

  if p_check = 'missing_hole_ids' then
    select coalesce(jsonb_agg(data order by row_index),'[]') into v_rows
    from public.table_rows where table_id = p_table and btrim(coalesce(data->>v_h,'')) <> '';

  elsif p_check = 'duplicate_intervals' then
    with k as (select data, row_index,
      row_number() over (partition by concat_ws('|', coalesce(data->>v_h,''), coalesce(data->>v_f,''), coalesce(data->>v_t,'')) order by row_index) rn
      from public.table_rows where table_id = p_table)
    select coalesce(jsonb_agg(data order by row_index),'[]') into v_rows from k where rn = 1;

  elsif p_check = 'negative_grades' then
    select coalesce(jsonb_agg(
      (case when v_au is not null and gp_num(data->>v_au) < 0 then jsonb_set(data, array[v_au], '"0"') else data end)
      || (case when v_cu is not null and gp_num(data->>v_cu) < 0 then jsonb_build_object(v_cu,'0') else '{}'::jsonb end)
      || (case when v_ag is not null and gp_num(data->>v_ag) < 0 then jsonb_build_object(v_ag,'0') else '{}'::jsonb end)
      order by row_index),'[]') into v_rows
    from public.table_rows where table_id = p_table;

  elsif p_check = 'trim_whitespace' then
    select coalesce(jsonb_agg(
      (select jsonb_object_agg(key, case when jsonb_typeof(value)='string' then to_jsonb(btrim(value #>> '{}')) else value end)
       from jsonb_each(data)) order by row_index),'[]') into v_rows
    from public.table_rows where table_id = p_table;

  elsif p_check = 'standardise_hole_ids' then
    select coalesce(jsonb_agg(
      (case when v_h is not null and coalesce(data->>v_h,'') <> ''
        then jsonb_set(data, array[v_h], to_jsonb(regexp_replace(upper(btrim(data->>v_h)), '\s+', '', 'g')))
        else data end) order by row_index),'[]') into v_rows
    from public.table_rows where table_id = p_table;

  elsif p_check = 'remove_empty_rows' then
    select coalesce(jsonb_agg(data order by row_index),'[]') into v_rows
    from public.table_rows tr where table_id = p_table and exists (
      select 1 from jsonb_each_text(tr.data) e where btrim(coalesce(e.value,'')) <> '');

  elsif p_check = 'find_null_placeholders' then
    select coalesce(jsonb_agg(
      (select jsonb_object_agg(key,
        case when lower(btrim(coalesce(value #>> '{}',''))) = any(array['n/a','na','null','-','--','none','nil','9999','-99','-9999','#n/a','tbd','.'])
              and btrim(coalesce(value #>> '{}','')) <> '' then '""'::jsonb else value end)
       from jsonb_each(data)) order by row_index),'[]') into v_rows
    from public.table_rows where table_id = p_table;

  elsif p_check = 'find_duplicates' then
    with k as (select data, row_index, row_number() over (partition by data::text order by row_index) rn
      from public.table_rows where table_id = p_table)
    select coalesce(jsonb_agg(data order by row_index),'[]') into v_rows from k where rn = 1;

  else
    return jsonb_build_object('error', format('GP-2301: unsupported fix "%s"', p_check));
  end if;

  return jsonb_build_object('rows', v_rows, 'count', jsonb_array_length(v_rows));
end $func$;

-- ── gp_build_collar_output: parity port of buildCollarOutput() ──────────────
create or replace function public.gp_build_collar_output(p_collar uuid, p_interval uuid)
returns jsonb language plpgsql security definer set search_path = public as $func$
declare
  v_pid uuid; v_hc text; v_hi text; v_f text; v_t text;
  v_iau text; v_icu text; v_iag text; v_ec text; v_nc text; v_zc text; v_rows jsonb;
begin
  select project_id into v_pid from public.tables_meta where id = p_collar;
  if v_pid is null then return jsonb_build_object('rows','[]'::jsonb,'error','GP-2302: collar file not found'); end if;
  perform public.gp_assert_owner(v_pid);
  v_hc := gp_col(p_collar,'hole_id'); v_hi := gp_col(p_interval,'hole_id');
  if v_hc is null or v_hi is null then return jsonb_build_object('rows','[]'::jsonb,'error','Both tables need a Hole ID column mapped.'); end if;
  v_f := gp_col(p_interval,'from'); v_t := gp_col(p_interval,'to');
  v_iau := gp_col(p_interval,'au'); v_icu := gp_col(p_interval,'cu'); v_iag := gp_col(p_interval,'ag');
  v_ec := gp_col(p_collar,'easting'); v_nc := gp_col(p_collar,'northing'); v_zc := gp_col(p_collar,'elevation');

  with stats as (
    select upper(btrim(coalesce(data->>v_hi,''))) id,
      count(*) n,
      max(gp_num(data->>v_iau)) maxau, avg(gp_num(data->>v_iau)) avgau,
      max(gp_num(data->>v_icu)) maxcu, avg(gp_num(data->>v_icu)) avgcu,
      max(gp_num(data->>v_iag)) maxag, avg(gp_num(data->>v_iag)) avgag,
      greatest(coalesce(max(gp_num(data->>v_t)),0), coalesce(max(gp_num(data->>v_f)),0)) maxdepth
    from public.table_rows where table_id = p_interval and upper(btrim(coalesce(data->>v_hi,''))) <> ''
    group by 1)
  select coalesce(jsonb_agg(
    jsonb_build_object('HoleID', btrim(c.data->>v_hc), 'Intervals', coalesce(s.n,0),
      'MaxDepth_m', case when s.id is not null then gp_fixed(s.maxdepth,2) else '' end)
    || (case when v_ec is not null then jsonb_build_object('Easting', c.data->v_ec) else '{}'::jsonb end)
    || (case when v_nc is not null then jsonb_build_object('Northing', c.data->v_nc) else '{}'::jsonb end)
    || (case when v_zc is not null then jsonb_build_object('Elevation', c.data->v_zc) else '{}'::jsonb end)
    || (case when v_iau is not null then jsonb_build_object('MaxAU', case when s.maxau is not null then gp_fixed(s.maxau,3) else '' end, 'AvgAU', case when s.avgau is not null then gp_fixed(s.avgau,3) else '' end) else '{}'::jsonb end)
    || (case when v_icu is not null then jsonb_build_object('MaxCU', case when s.maxcu is not null then gp_fixed(s.maxcu,3) else '' end, 'AvgCU', case when s.avgcu is not null then gp_fixed(s.avgcu,3) else '' end) else '{}'::jsonb end)
    || (case when v_iag is not null then jsonb_build_object('MaxAG', case when s.maxag is not null then gp_fixed(s.maxag,3) else '' end, 'AvgAG', case when s.avgag is not null then gp_fixed(s.avgag,3) else '' end) else '{}'::jsonb end)
    order by c.row_index),'[]') into v_rows
  from public.table_rows c left join stats s on s.id = upper(btrim(coalesce(c.data->>v_hc,'')))
  where c.table_id = p_collar and btrim(coalesce(c.data->>v_hc,'')) <> '';

  return jsonb_build_object('rows', v_rows);
end $func$;

-- ── gp_build_ppm_output: pooled HOLEID/MFRO/MTO/MAXIMUMPPM output table ──────
-- one row per hole, peak-grade interval, pooled across N selected files.
-- Returns { rows: [{HOLEID,MFRO,MTO,MAXIMUMPPM}], error? }
create or replace function public.gp_build_ppm_output(p_tables uuid[])
returns jsonb language plpgsql security definer set search_path = public as $func$
declare v_pid uuid; v_tid uuid; v_rows jsonb;
begin
  if p_tables is null or array_length(p_tables,1) is null then
    return jsonb_build_object('rows','[]'::jsonb,'error','GP-2302: no files selected');
  end if;
  foreach v_tid in array p_tables loop
    select project_id into v_pid from public.tables_meta where id = v_tid;
    if v_pid is null then return jsonb_build_object('rows','[]'::jsonb,'error','GP-2302: file not found'); end if;
    perform public.gp_assert_owner(v_pid);
  end loop;

  create temp table _ppool on commit drop as
  select r.row_index,
    upper(regexp_replace(coalesce(r.data->>gp_col(t.id,'hole_id'),''), '\s+', '', 'g')) as hid,
    gp_num(r.data->>gp_col(t.id,'from')) as fn,
    gp_num(r.data->>gp_col(t.id,'to')) as tn,
    gp_num(r.data->>coalesce(gp_col(t.id,'au'),gp_col(t.id,'cu'),gp_col(t.id,'ag'))) as gn
  from public.table_rows r join public.tables_meta t on t.id = r.table_id
  where r.table_id = any(p_tables);

  with valid as (select * from _ppool where hid <> '' and fn is not null and tn is not null and gn is not null),
  ranked as (select *, row_number() over (partition by hid order by gn desc, row_index) rn from valid)
  select coalesce(jsonb_agg(jsonb_build_object(
    'HOLEID', hid, 'MFRO', gp_fixed(fn,2), 'MTO', gp_fixed(tn,2), 'MAXIMUMPPM', gp_fixed(gn,3)
  ) order by gn desc),'[]')
  into v_rows from ranked where rn = 1;

  return jsonb_build_object('rows', v_rows);
end $func$;

-- ── gp_combine_and_dedupe: pool rows from N selected files, dedupe by hole identity ─
-- Returns { clean: jsonb[], duplicates: jsonb[], anomalies: jsonb[], summary: text, error?: text }
create or replace function public.gp_combine_and_dedupe(p_tables uuid[])
returns jsonb language plpgsql security definer set search_path = public as $func$
declare
  v_pid uuid; v_tid uuid;
  v_clean jsonb := '[]'::jsonb; v_dups jsonb := '[]'::jsonb; v_anom jsonb := '[]'::jsonb;
  v_dup_count int := 0; v_anom_count int := 0; v_total int := 0;
begin
  if p_tables is null or array_length(p_tables,1) is null then
    return jsonb_build_object('error','GP-2302: no files selected');
  end if;
  foreach v_tid in array p_tables loop
    select project_id into v_pid from public.tables_meta where id = v_tid;
    if v_pid is null then return jsonb_build_object('error','GP-2302: file not found'); end if;
    perform public.gp_assert_owner(v_pid);
  end loop;

  -- pool: every row from every selected file, with its identity key + value key + source info
  create temp table _pool on commit drop as
  select
    r.data,
    t.id as table_id,
    t.name as table_name,
    t.updated_at,
    coalesce(gp_col(t.id,'hole_id'), '') as h_col,
    coalesce(gp_col(t.id,'from'), '') as f_col,
    coalesce(gp_col(t.id,'to'), '') as t_col
  from public.table_rows r
  join public.tables_meta t on t.id = r.table_id
  where r.table_id = any(p_tables);

  select count(*) into v_total from _pool;

  -- identity key: normalised Hole ID (+ From/To for interval-type files)
  create temp table _keyed on commit drop as
  select
    *,
    upper(regexp_replace(coalesce(data->>h_col,''), '\s+', '', 'g')) as norm_id,
    btrim(coalesce(data->>h_col,'')) as raw_id,
    case when f_col <> '' and t_col <> '' then gp_fixed(gp_num(data->>f_col),2) else null end as f_val,
    case when f_col <> '' and t_col <> '' then gp_fixed(gp_num(data->>t_col),2) else null end as t_val
  from _pool;

  create temp table _id on commit drop as
  select *,
    case when f_col <> '' and t_col <> '' then norm_id || '|' || coalesce(f_val,'') || '|' || coalesce(t_val,'')
         else norm_id end as ident_key,
    -- value key = full row signature excluding the hole-id/from/to identity fields, for collision detection
    gp_rowkey(data - h_col - f_col - t_col) as val_key
  from _keyed
  where norm_id <> '';

  -- per identity-key group: keep the row from the most-recently-updated file; rest -> duplicates
  create temp table _grpstats on commit drop as
  select ident_key, count(*) as grp_n,
    count(distinct val_key) as grp_distinct_vals,
    count(distinct raw_id) as grp_distinct_raw
  from _id group by ident_key;

  create temp table _ranked on commit drop as
  select i.*, row_number() over (
    partition by i.ident_key order by i.updated_at desc, i.table_name
  ) as rnk,
  g.grp_n, g.grp_distinct_vals, g.grp_distinct_raw
  from _id i join _grpstats g on g.ident_key = i.ident_key;

  select coalesce(jsonb_agg(data order by ident_key),'[]') into v_clean
  from _ranked where rnk = 1;

  select coalesce(jsonb_agg(data || jsonb_build_object('_source_file', table_name) order by ident_key),'[]'), count(*)
    into v_dups, v_dup_count
  from _ranked where rnk > 1;

  -- anomaly: same identity key, but rows disagree on other field values (kept the latest, flag for review)
  with grp as (
    select ident_key, min(table_name) as fa, max(table_name) as fb, min(updated_at) as ta, max(updated_at) as tb, grp_n, grp_distinct_vals
    from _ranked where grp_n > 1 and grp_distinct_vals > 1
    group by ident_key, grp_n, grp_distinct_vals
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'type', 'value_conflict',
    'message', ident_key || ': ' || grp_n || ' records found with differing values across files (kept the most recent) — please verify.'
  )),'[]')
  into v_anom from grp;

  -- anomaly: same Hole ID but inconsistent raw formatting across files (e.g. "KSBH 01" vs "KSBH01")
  with fmt as (
    select ident_key, jsonb_agg(distinct raw_id) as variants
    from _ranked where grp_n > 1 and grp_distinct_raw > 1
    group by ident_key
  )
  select v_anom || coalesce(jsonb_agg(jsonb_build_object(
    'type', 'format_mismatch',
    'message', 'Hole ID written inconsistently: ' || (select string_agg(v, ' / ') from jsonb_array_elements_text(variants) v) || ' — treated as the same hole.'
  )),'[]')
  into v_anom from fmt;

  -- anomaly: different identity keys but otherwise identical row data (possible naming/duplication error)
  with collide as (
    select val_key, jsonb_agg(distinct ident_key) as keys, count(distinct ident_key) as nkeys
    from _id
    where val_key <> ''
    group by val_key
    having count(distinct ident_key) > 1
  )
  select v_anom || coalesce(jsonb_agg(jsonb_build_object(
    'type', 'possible_duplicate_hole',
    'message', 'Holes ' || (select string_agg(k, ' and ' order by k) from jsonb_array_elements_text(keys) k) ||
      ' report identical data but have different Hole IDs — possible naming/recording error, please verify.'
  )),'[]')
  into v_anom from collide;

  select jsonb_array_length(v_anom) into v_anom_count;

  return jsonb_build_object(
    'clean', v_clean,
    'duplicates', v_dups,
    'anomalies', v_anom,
    'summary', format('Pooled %s row(s) from %s file(s) → %s unique, %s duplicate(s) removed, %s anomal%s flagged.',
      v_total, array_length(p_tables,1), jsonb_array_length(v_clean), v_dup_count, v_anom_count,
      case when v_anom_count = 1 then 'y' else 'ies' end)
  );
end $func$;

-- ── gp_fix_formatting: pooled formatting cleanup across N selected files ───
-- Per file: trim whitespace, standardise Hole IDs, remove empty rows, clear placeholder values.
-- Returns { files: [{ table_id, rows: jsonb[], trimmed, standardised, removed_empty, placeholders_cleared }], summary }
create or replace function public.gp_fix_formatting(p_tables uuid[])
returns jsonb language plpgsql security definer set search_path = public as $func$
declare
  v_pid uuid; v_tid uuid; v_h text;
  v_files jsonb := '[]'::jsonb;
  v_rows jsonb; v_before int; v_after int;
  v_trimmed int; v_standardised int; v_removed int; v_placeholders int;
begin
  if p_tables is null or array_length(p_tables,1) is null then
    return jsonb_build_object('error','GP-2302: no files selected');
  end if;
  foreach v_tid in array p_tables loop
    select project_id into v_pid from public.tables_meta where id = v_tid;
    if v_pid is null then return jsonb_build_object('error','GP-2302: file not found'); end if;
    perform public.gp_assert_owner(v_pid);

    v_h := gp_col(v_tid,'hole_id');

    -- count rows that will change for each fix, before applying
    select count(*) into v_trimmed from public.table_rows where table_id = v_tid
      and exists (select 1 from jsonb_each(data) e where jsonb_typeof(e.value)='string' and e.value #>> '{}' <> btrim(e.value #>> '{}'));

    select count(*) into v_standardised from public.table_rows where table_id = v_tid
      and v_h is not null and coalesce(data->>v_h,'') <> '' and (data->>v_h) <> regexp_replace(upper(btrim(data->>v_h)), '\s+', '', 'g');

    select count(*) into v_placeholders from public.table_rows where table_id = v_tid
      and exists (select 1 from jsonb_each(data) e
        where lower(btrim(coalesce(e.value #>> '{}',''))) = any(array['n/a','na','null','-','--','none','nil','9999','-99','-9999','#n/a','tbd','.'])
          and btrim(coalesce(e.value #>> '{}','')) <> '');

    select count(*) into v_before from public.table_rows where table_id = v_tid;

    -- apply trim + standardise hole id + clear placeholders, then drop empty rows
    select coalesce(jsonb_agg(fixed order by row_index),'[]')
    into v_rows
    from (
      select row_index,
        (select jsonb_object_agg(
            key,
            case
              when key = v_h and btrim(coalesce(value #>> '{}','')) <> ''
                then to_jsonb(regexp_replace(upper(btrim(value #>> '{}')), '\s+', '', 'g'))
              when jsonb_typeof(value) = 'string'
                   and lower(btrim(value #>> '{}')) = any(array['n/a','na','null','-','--','none','nil','9999','-99','-9999','#n/a','tbd','.'])
                   and btrim(value #>> '{}') <> ''
                then '""'::jsonb
              when jsonb_typeof(value) = 'string'
                then to_jsonb(btrim(value #>> '{}'))
              else value
            end)
         from jsonb_each(data)) as fixed
      from public.table_rows where table_id = v_tid
    ) f
    where exists (select 1 from jsonb_each_text(f.fixed) e where btrim(coalesce(e.value,'')) <> '');

    v_after := jsonb_array_length(v_rows);
    v_removed := v_before - v_after;

    v_files := v_files || jsonb_build_object(
      'table_id', v_tid, 'rows', v_rows,
      'trimmed', v_trimmed, 'standardised', v_standardised,
      'removed_empty', v_removed, 'placeholders_cleared', v_placeholders
    );
  end loop;

  return jsonb_build_object('files', v_files);
end $func$;

-- ── gp_check_intervals: pooled From/To order, overlap and gap check across N files ─
-- Pools interval rows from all selected files by normalised Hole ID, so overlaps/gaps
-- between e.g. two different survey files for the same hole are caught too.
-- Returns { order_issues, overlaps, gaps: jsonb[], count, summary }
create or replace function public.gp_check_intervals(p_tables uuid[])
returns jsonb language plpgsql security definer set search_path = public as $func$
declare
  v_pid uuid; v_tid uuid;
  v_order jsonb := '[]'::jsonb; v_overlaps jsonb := '[]'::jsonb; v_gaps jsonb := '[]'::jsonb;
  v_total int;
begin
  if p_tables is null or array_length(p_tables,1) is null then
    return jsonb_build_object('error','GP-2302: no files selected');
  end if;
  foreach v_tid in array p_tables loop
    select project_id into v_pid from public.tables_meta where id = v_tid;
    if v_pid is null then return jsonb_build_object('error','GP-2302: file not found'); end if;
    perform public.gp_assert_owner(v_pid);
  end loop;

  create temp table _ipool on commit drop as
  select
    r.data, t.id as table_id, t.name as table_name,
    upper(regexp_replace(coalesce(r.data->>gp_col(t.id,'hole_id'),''), '\s+', '', 'g')) as hid,
    gp_num(r.data->>gp_col(t.id,'from')) as fn,
    gp_num(r.data->>gp_col(t.id,'to')) as tn,
    r.row_index
  from public.table_rows r
  join public.tables_meta t on t.id = r.table_id
  where r.table_id = any(p_tables)
    and gp_col(t.id,'from') is not null and gp_col(t.id,'to') is not null;

  -- From >= To
  select coalesce(jsonb_agg((data || jsonb_build_object('_source_file', table_name)) order by table_name, row_index),'[]')
  into v_order
  from _ipool where hid <> '' and fn is not null and tn is not null and fn >= tn;

  -- overlaps & gaps: order pooled intervals per hole across files
  create temp table _ord on commit drop as
  select *, lag(tn) over w as prev_to, lag(table_name) over w as prev_file
  from _ipool where hid <> '' and fn is not null and tn is not null
  window w as (partition by hid order by fn, row_index);

  select coalesce(jsonb_agg((data || jsonb_build_object('_source_file', table_name, '_overlaps_with', prev_file)) order by hid, fn),'[]')
  into v_overlaps
  from _ord where prev_to is not null and fn < prev_to;

  select coalesce(jsonb_agg((data || jsonb_build_object('_source_file', table_name, '_gap', gp_fixed(fn - prev_to, 3) || 'm', '_after_file', prev_file)) order by hid, fn),'[]')
  into v_gaps
  from _ord where prev_to is not null and fn > prev_to + 0.001;

  v_total := jsonb_array_length(v_order) + jsonb_array_length(v_overlaps) + jsonb_array_length(v_gaps);

  return jsonb_build_object(
    'order_issues', v_order, 'overlaps', v_overlaps, 'gaps', v_gaps, 'count', v_total,
    'summary', case when v_total = 0 then 'Intervals look good — no From/To errors, overlaps or gaps across the pooled files.'
      else format('%s From/To error(s), %s overlap(s), %s gap(s) found across %s file(s).',
        jsonb_array_length(v_order), jsonb_array_length(v_overlaps), jsonb_array_length(v_gaps), array_length(p_tables,1)) end
  );
end $func$;

-- ── gp_check_data_health: pooled negative grades, coord outliers, collar
-- completeness and coord-system detection across N selected files.
-- Returns { issues: jsonb[], negative_grades, coord_outliers, incomplete_collars, count, coord_system, summary }
create or replace function public.gp_check_data_health(p_tables uuid[])
returns jsonb language plpgsql security definer set search_path = public as $func$
declare
  v_pid uuid; v_tid uuid;
  v_issues jsonb := '[]'::jsonb;
  v_neg int := 0; v_outliers int := 0; v_incomplete int := 0;
  v_em numeric; v_es numeric; v_nm numeric; v_ns numeric; v_ecount int;
  v_avge numeric; v_avgn numeric; v_sys text; v_conf text; v_notes text;
begin
  if p_tables is null or array_length(p_tables,1) is null then
    return jsonb_build_object('error','GP-2302: no files selected');
  end if;
  foreach v_tid in array p_tables loop
    select project_id into v_pid from public.tables_meta where id = v_tid;
    if v_pid is null then return jsonb_build_object('error','GP-2302: file not found'); end if;
    perform public.gp_assert_owner(v_pid);
  end loop;

  create temp table _hpool on commit drop as
  select r.data, t.id as table_id, t.name as table_name, r.row_index,
    gp_col(t.id,'au') as au_c, gp_col(t.id,'cu') as cu_c, gp_col(t.id,'ag') as ag_c,
    gp_col(t.id,'easting') as e_c, gp_col(t.id,'northing') as n_c, gp_col(t.id,'elevation') as z_c
  from public.table_rows r join public.tables_meta t on t.id = r.table_id
  where r.table_id = any(p_tables);

  -- negative grades
  with neg as (
    select (data || jsonb_build_object('_source_file', table_name, '_issue', 'Negative grade value')) as d
    from _hpool where
      (au_c is not null and gp_num(data->>au_c) < 0) or
      (cu_c is not null and gp_num(data->>cu_c) < 0) or
      (ag_c is not null and gp_num(data->>ag_c) < 0))
  select coalesce(jsonb_agg(d),'[]'), count(*) into v_issues, v_neg from neg;

  -- coordinate outliers (>3σ across the pooled set)
  select avg(gp_num(data->>e_c)), stddev_pop(gp_num(data->>e_c)), count(gp_num(data->>e_c))
    into v_em, v_es, v_ecount from _hpool where e_c is not null;
  select avg(gp_num(data->>n_c)), stddev_pop(gp_num(data->>n_c))
    into v_nm, v_ns from _hpool where n_c is not null;
  if v_ecount >= 4 then
    with out_rows as (
      select (data || jsonb_build_object('_source_file', table_name, '_issue', 'Coordinate outlier (>3 sigma)')) as d
      from _hpool where e_c is not null and n_c is not null
        and gp_num(data->>e_c) is not null and gp_num(data->>n_c) is not null
        and (abs(gp_num(data->>e_c) - v_em) > 3*v_es or abs(gp_num(data->>n_c) - v_nm) > 3*v_ns))
    select v_issues || coalesce(jsonb_agg(d),'[]'), count(*) into v_issues, v_outliers from out_rows;
  end if;

  -- collar completeness (rows that look like collars, i.e. have easting/northing mapped)
  with inc as (
    select (data || jsonb_build_object('_source_file', table_name, '_issue', 'Missing collar coordinates')) as d
    from _hpool where e_c is not null and n_c is not null and (
      gp_num(data->>e_c) is null or gp_num(data->>n_c) is null or
      (z_c is not null and gp_num(data->>z_c) is null)))
  select v_issues || coalesce(jsonb_agg(d),'[]'), count(*) into v_issues, v_incomplete from inc;

  -- coordinate system detection across the pool
  select avg(gp_num(data->>e_c)), avg(gp_num(data->>n_c)), count(gp_num(data->>e_c))
    into v_avge, v_avgn, v_ecount from _hpool where e_c is not null;
  if coalesce(v_ecount,0) = 0 then
    v_sys := 'Unknown'; v_notes := 'No easting/northing columns mapped.';
  elsif abs(v_avgn) < 90 and abs(v_avge) < 180 then
    v_sys := 'WGS84 (decimal degrees)'; v_conf := 'High'; v_notes := 'Import into QGIS as EPSG:4326.';
  elsif v_avge > 100000 and v_avge < 1000000 and v_avgn > 7000000 and v_avgn < 11000000 then
    v_sys := 'Arc1960 / UTM Zone 36S (probable)'; v_conf := 'High';
    v_notes := 'WARNING: Arc1960 and WGS84 differ by up to 300 m in Tanzania. Do NOT silently reproject.';
  elsif v_avge > 100000 and v_avge < 1000000 and v_avgn > 1000000 then
    v_sys := 'UTM (zone unknown)'; v_conf := 'Medium'; v_notes := 'Confirm the zone and datum before use in QGIS.';
  else v_sys := 'Unknown'; v_conf := 'Low'; v_notes := ''; end if;

  return jsonb_build_object(
    'issues', v_issues,
    'negative_grades', v_neg, 'coord_outliers', v_outliers, 'incomplete_collars', v_incomplete,
    'count', jsonb_array_length(v_issues),
    'coord_system', jsonb_build_object('system', v_sys, 'confidence', coalesce(v_conf,''), 'notes', v_notes,
      'avg_e', round(coalesce(v_avge,0)), 'avg_n', round(coalesce(v_avgn,0))),
    'summary', case when jsonb_array_length(v_issues) = 0
      then format('Data health looks good across %s file(s) — no negative grades, coordinate outliers or incomplete collars. Detected coordinate system: %s.', array_length(p_tables,1), v_sys)
      else format('%s negative grade(s), %s coordinate outlier(s), %s incomplete collar row(s) across %s file(s). Detected coordinate system: %s.',
        v_neg, v_outliers, v_incomplete, array_length(p_tables,1), v_sys) end
  );
end $func$;

-- ── gp_find_undrilled_orphans: pooled collar-vs-interval check across N+M files ─
-- p_collars: collar-type files (Hole ID + coords). p_intervals: assay/survey/lithology files.
-- Returns { undrilled: jsonb[], orphans: jsonb[], count, summary }
create or replace function public.gp_find_undrilled_orphans(p_collars uuid[], p_intervals uuid[])
returns jsonb language plpgsql security definer set search_path = public as $func$
declare
  v_pid uuid; v_tid uuid;
  v_undrilled jsonb := '[]'::jsonb; v_orphans jsonb := '[]'::jsonb;
  v_uc int; v_oc int;
begin
  if coalesce(array_length(p_collars,1),0) = 0 or coalesce(array_length(p_intervals,1),0) = 0 then
    return jsonb_build_object('error','GP-2302: select at least one collar file and one interval file');
  end if;
  foreach v_tid in array (p_collars || p_intervals) loop
    select project_id into v_pid from public.tables_meta where id = v_tid;
    if v_pid is null then return jsonb_build_object('error','GP-2302: file not found'); end if;
    perform public.gp_assert_owner(v_pid);
  end loop;

  create temp table _cpool on commit drop as
  select r.data, t.name as table_name, r.row_index,
    upper(regexp_replace(coalesce(r.data->>gp_col(t.id,'hole_id'),''), '\s+', '', 'g')) as hid
  from public.table_rows r join public.tables_meta t on t.id = r.table_id
  where r.table_id = any(p_collars);

  create temp table _ipool2 on commit drop as
  select r.data, t.name as table_name, r.row_index,
    upper(regexp_replace(coalesce(r.data->>gp_col(t.id,'hole_id'),''), '\s+', '', 'g')) as hid
  from public.table_rows r join public.tables_meta t on t.id = r.table_id
  where r.table_id = any(p_intervals);

  select coalesce(jsonb_agg((data || jsonb_build_object('_source_file', table_name)) order by table_name, row_index),'[]'), count(*)
  into v_undrilled, v_uc
  from _cpool where hid <> '' and hid not in (select hid from _ipool2 where hid <> '');

  with f as (
    select *, row_number() over (partition by hid order by row_index) rn from _ipool2
    where hid <> '' and hid not in (select hid from _cpool where hid <> ''))
  select coalesce(jsonb_agg((data || jsonb_build_object('_source_file', table_name)) order by table_name, row_index),'[]'), count(*)
  into v_orphans, v_oc from f where rn = 1;

  return jsonb_build_object(
    'undrilled', v_undrilled, 'orphans', v_orphans, 'count', v_uc + v_oc,
    'summary', format('%s collar hole(s) with no interval data, %s hole(s) with interval data but no collar — pooled across %s collar file(s) and %s interval file(s).',
      v_uc, v_oc, array_length(p_collars,1), array_length(p_intervals,1))
  );
end $func$;

-- ── gp_compare_files: pooled row-for-row diff across ALL pairs of selected files ─
-- Returns { issues: jsonb[], count, summary }
create or replace function public.gp_compare_files(p_tables uuid[])
returns jsonb language plpgsql security definer set search_path = public as $func$
declare
  v_pid uuid; v_tid uuid; v_issues jsonb := '[]'::jsonb;
  v_n int; v_i int; v_j int; v_a uuid; v_b uuid; v_an text; v_bn text;
  v_onlya jsonb; v_onlyb jsonb; v_ca int; v_cb int;
begin
  v_n := coalesce(array_length(p_tables,1),0);
  if v_n < 2 then return jsonb_build_object('error','GP-2302: select at least two files to compare'); end if;
  foreach v_tid in array p_tables loop
    select project_id into v_pid from public.tables_meta where id = v_tid;
    if v_pid is null then return jsonb_build_object('error','GP-2302: file not found'); end if;
    perform public.gp_assert_owner(v_pid);
  end loop;

  for v_i in 1..v_n-1 loop
    for v_j in v_i+1..v_n loop
      v_a := p_tables[v_i]; v_b := p_tables[v_j];
      select name into v_an from public.tables_meta where id = v_a;
      select name into v_bn from public.tables_meta where id = v_b;

      with bk as (select gp_rowkey(data) k from public.table_rows where table_id = v_b),
      ak as (select gp_rowkey(data) k from public.table_rows where table_id = v_a),
      onlya as (select data, row_index from public.table_rows where table_id = v_a and gp_rowkey(data) not in (select k from bk)),
      onlyb as (select data, row_index from public.table_rows where table_id = v_b and gp_rowkey(data) not in (select k from ak))
      select
        (select coalesce(jsonb_agg((data || jsonb_build_object('_only_in', v_an, '_missing_from', v_bn)) order by row_index),'[]') from onlya),
        (select coalesce(jsonb_agg((data || jsonb_build_object('_only_in', v_bn, '_missing_from', v_an)) order by row_index),'[]') from onlyb),
        (select count(*) from onlya), (select count(*) from onlyb)
      into v_onlya, v_onlyb, v_ca, v_cb;

      if v_ca + v_cb > 0 then
        v_issues := v_issues || v_onlya || v_onlyb;
      end if;
    end loop;
  end loop;

  return jsonb_build_object('issues', v_issues, 'count', jsonb_array_length(v_issues),
    'summary', case when jsonb_array_length(v_issues) = 0
      then format('All %s files match row-for-row.', v_n)
      else format('%s row(s) differ across the %s selected files (see _only_in / _missing_from).', jsonb_array_length(v_issues), v_n) end);
end $func$;

-- ── gp_analysis_pool: pooled grade summary, best intercept and rank-by-grade ───
-- across N selected files (e.g. assay files from different survey rounds).
-- Returns { grade_summary: jsonb[], best_intercept: jsonb[], rank_by_grade: jsonb[], summary }
create or replace function public.gp_analysis_pool(p_tables uuid[])
returns jsonb language plpgsql security definer set search_path = public as $func$
declare
  v_pid uuid; v_tid uuid;
  v_best jsonb := '[]'::jsonb; v_rank jsonb := '[]'::jsonb; v_grades jsonb := '[]'::jsonb; v_ppm jsonb := '[]'::jsonb;
  v_holes int;
begin
  if p_tables is null or array_length(p_tables,1) is null then
    return jsonb_build_object('error','GP-2302: no files selected');
  end if;
  foreach v_tid in array p_tables loop
    select project_id into v_pid from public.tables_meta where id = v_tid;
    if v_pid is null then return jsonb_build_object('error','GP-2302: file not found'); end if;
    perform public.gp_assert_owner(v_pid);
  end loop;

  create temp table _apool on commit drop as
  select r.data, t.id as table_id, t.name as table_name, r.row_index,
    upper(regexp_replace(coalesce(r.data->>gp_col(t.id,'hole_id'),''), '\s+', '', 'g')) as hid,
    gp_num(r.data->>gp_col(t.id,'from')) as fn,
    gp_num(r.data->>gp_col(t.id,'to')) as tn,
    gp_num(r.data->>coalesce(gp_col(t.id,'au'),gp_col(t.id,'cu'),gp_col(t.id,'ag'))) as gn
  from public.table_rows r join public.tables_meta t on t.id = r.table_id
  where r.table_id = any(p_tables);

  select count(distinct hid) into v_holes from _apool where hid <> '';

  -- best intercept per hole (grade x thickness), pooled across files
  with valid as (select *, gn*(tn-fn) gt from _apool where hid <> '' and fn is not null and tn is not null and gn is not null),
  ranked as (select *, row_number() over (partition by hid order by gn*(tn-fn) desc, row_index) rn from valid)
  select coalesce(jsonb_agg((data || jsonb_build_object('_source_file', table_name, '_gt', gt, '_interval', gp_fixed(tn-fn,2)||'m', '_grade', gn)) order by gt desc),'[]')
  into v_best from ranked where rn = 1;

  -- rank by peak grade per hole, pooled across files
  with ranked2 as (select *, row_number() over (partition by hid order by gn desc, row_index) rn from _apool where hid <> '' and gn is not null)
  select coalesce(jsonb_agg((data || jsonb_build_object('_source_file', table_name, '_grade', gn)) order by gn desc),'[]')
  into v_rank from ranked2 where rn = 1;

  -- grade summary per hole across the pool (max/avg/min grade, total holes/intervals)
  with stats as (
    select hid, count(*) n, max(gn) mx, avg(gn) av, min(gn) mn
    from _apool where hid <> '' and gn is not null group by hid)
  select coalesce(jsonb_agg(jsonb_build_object(
    'hole_id', hid, 'intervals', n, 'max_grade', gp_fixed(mx,3), 'avg_grade', gp_fixed(av,3), 'min_grade', gp_fixed(mn,3)
  ) order by mx desc),'[]')
  into v_grades from stats;

  -- standard report table: one row per hole, peak-grade interval (HOLEID, MFRO, MTO, MAXIMUMPPM)
  with valid3 as (select *, gn*(tn-fn) gt from _apool where hid <> '' and fn is not null and tn is not null and gn is not null),
  ranked3 as (select *, row_number() over (partition by hid order by gn desc, row_index) rn from valid3)
  select coalesce(jsonb_agg(jsonb_build_object(
    'HOLEID', hid, 'MFRO', gp_fixed(fn,2), 'MTO', gp_fixed(tn,2), 'MAXIMUMPPM', gp_fixed(gn,3)
  ) order by gn desc),'[]')
  into v_ppm from ranked3 where rn = 1;

  return jsonb_build_object(
    'grade_summary', v_grades, 'best_intercept', v_best, 'rank_by_grade', v_rank, 'ppm_table', v_ppm,
    'summary', format('Analysed %s hole(s) across %s file(s) — best intercepts and grade ranking computed from the pooled intervals.', v_holes, array_length(p_tables,1))
  );
end $func$;

-- ── gp_distance_filter_pooled: keep holes within p_max of ANY reference point
-- pooled from N reference files (extends gp_distance_filter to multiple refs).
-- Returns { rows: jsonb[], error? }
create or replace function public.gp_distance_filter_pooled(p_table uuid, p_refs uuid[], p_max numeric, p_point numeric[] default null)
returns jsonb language plpgsql security definer set search_path = public as $func$
declare v_pid uuid; v_tid uuid; v_e text; v_n text; v_rows jsonb;
begin
  select project_id into v_pid from public.tables_meta where id = p_table;
  if v_pid is null then return jsonb_build_object('rows','[]'::jsonb,'error','GP-2302: file not found'); end if;
  perform public.gp_assert_owner(v_pid);
  v_e := gp_col(p_table,'easting'); v_n := gp_col(p_table,'northing');
  if v_e is null or v_n is null then return jsonb_build_object('rows','[]'::jsonb,'error','This file needs East and North columns mapped.'); end if;

  foreach v_tid in array p_refs loop
    select project_id into v_pid from public.tables_meta where id = v_tid;
    if v_pid is null then return jsonb_build_object('rows','[]'::jsonb,'error','GP-2302: reference file not found'); end if;
    perform public.gp_assert_owner(v_pid);
  end loop;

  create temp table _refpts on commit drop as
  select gp_num(r.data->>gp_col(t.id,'easting')) as re, gp_num(r.data->>gp_col(t.id,'northing')) as rn
  from public.table_rows r join public.tables_meta t on t.id = r.table_id
  where r.table_id = any(p_refs);

  if p_point is not null and array_length(p_point,1) = 2 then
    insert into _refpts (re, rn) values (p_point[1], p_point[2]);
  end if;

  select coalesce(jsonb_agg(a.data order by a.row_index),'[]') into v_rows
  from public.table_rows a where a.table_id = p_table
    and gp_num(a.data->>v_e) is not null and gp_num(a.data->>v_n) is not null
    and exists (select 1 from _refpts b where b.re is not null and b.rn is not null
      and power(gp_num(a.data->>v_e) - b.re,2) + power(gp_num(a.data->>v_n) - b.rn,2) <= p_max*p_max);
  return jsonb_build_object('rows', v_rows);
end $func$;

-- ── 6. Edge function secret (run via CLI, not SQL) ──────────────────────────
-- The gold-ai edge function needs an Anthropic API key:
--   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
--   supabase functions deploy gold-ai

-- ── 7. Explore Module — additive schema ─────────────────────────────────────
-- All tables are new; nothing existing is modified.

CREATE TABLE IF NOT EXISTS sites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  total_rows      INT NOT NULL DEFAULT 100,
  total_cols      INT NOT NULL DEFAULT 100,
  origin_lat      DOUBLE PRECISION NOT NULL,
  origin_lng      DOUBLE PRECISION NOT NULL,
  row_spacing_m   DOUBLE PRECISION NOT NULL,
  col_spacing_m   DOUBLE PRECISION NOT NULL,
  created_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sites_owner" ON sites USING (created_by = auth.uid());

CREATE TABLE IF NOT EXISTS holes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  hole_id         TEXT NOT NULL,
  row_num         INT NOT NULL,
  col_num         INT NOT NULL,
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  elevation_m     DOUBLE PRECISION,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','in_progress','completed','flagged')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, hole_id)
);
ALTER TABLE holes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "holes_site_owner" ON holes USING (
  EXISTS (SELECT 1 FROM sites s WHERE s.id = holes.site_id AND s.created_by = auth.uid())
);

CREATE TABLE IF NOT EXISTS explore_teams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         UUID NOT NULL REFERENCES sites(id),
  name            TEXT NOT NULL,
  color_hex       TEXT NOT NULL DEFAULT '#3B82F6',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE explore_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teams_site_owner" ON explore_teams USING (
  EXISTS (SELECT 1 FROM sites s WHERE s.id = explore_teams.site_id AND s.created_by = auth.uid())
);

CREATE TABLE IF NOT EXISTS assignments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         UUID NOT NULL REFERENCES sites(id),
  team_id         UUID NOT NULL REFERENCES explore_teams(id),
  hole_id         UUID NOT NULL REFERENCES holes(id),
  week_start      DATE NOT NULL,
  assigned_by     UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hole_id, week_start)
);
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignments_site_owner" ON assignments USING (
  EXISTS (SELECT 1 FROM sites s WHERE s.id = assignments.site_id AND s.created_by = auth.uid())
);

CREATE TABLE IF NOT EXISTS device_positions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id),
  team_id         UUID REFERENCES explore_teams(id),
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  accuracy_m      DOUBLE PRECISION,
  altitude_m      DOUBLE PRECISION,
  source          TEXT DEFAULT 'gps'
                    CHECK (source IN ('gps','bluetooth_gnss','manual')),
  recorded_at     TIMESTAMPTZ NOT NULL,
  synced_at       TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE device_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "positions_own" ON device_positions USING (profile_id = auth.uid());
CREATE POLICY "positions_admin_read" ON device_positions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE TABLE IF NOT EXISTS hole_surveys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hole_id         UUID NOT NULL REFERENCES holes(id),
  team_id         UUID NOT NULL REFERENCES explore_teams(id),
  submitted_by    UUID NOT NULL REFERENCES profiles(id),
  photo_url       TEXT NOT NULL,
  photo_lat       DOUBLE PRECISION NOT NULL,
  photo_lng       DOUBLE PRECISION NOT NULL,
  photo_accuracy_m DOUBLE PRECISION,
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected')),
  reviewed_by     UUID REFERENCES profiles(id),
  reviewed_at     TIMESTAMPTZ,
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  synced_offline  BOOLEAN DEFAULT FALSE
);
ALTER TABLE hole_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "surveys_own" ON hole_surveys USING (submitted_by = auth.uid());
CREATE POLICY "surveys_admin" ON hole_surveys FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE TABLE IF NOT EXISTS explore_alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         UUID NOT NULL REFERENCES sites(id),
  sent_by         UUID NOT NULL REFERENCES profiles(id),
  target_type     TEXT NOT NULL CHECK (target_type IN ('team','all','individual')),
  target_id       UUID,
  message         TEXT NOT NULL,
  priority        TEXT DEFAULT 'normal' CHECK (priority IN ('normal','urgent')),
  delivery_status JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE explore_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alerts_admin" ON explore_alerts USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE TABLE IF NOT EXISTS device_invitations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         UUID NOT NULL REFERENCES sites(id),
  team_id         UUID NOT NULL REFERENCES explore_teams(id),
  device_code     TEXT NOT NULL UNIQUE,
  device_key      TEXT NOT NULL,
  label           TEXT,
  role            TEXT NOT NULL DEFAULT 'field_team'
                    CHECK (role IN ('field_team', 'supervisor')),
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'active', 'revoked')),
  created_by      UUID NOT NULL REFERENCES profiles(id),
  claimed_by      UUID REFERENCES profiles(id),
  claimed_at      TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE device_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invitations_admin" ON device_invitations USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

CREATE TABLE IF NOT EXISTS registered_devices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id),
  invitation_id   UUID NOT NULL REFERENCES device_invitations(id),
  android_id      TEXT NOT NULL UNIQUE,
  device_model    TEXT,
  app_version     TEXT,
  fcm_token       TEXT,
  bt_mac          TEXT,
  last_seen_at    TIMESTAMPTZ,
  registered_at   TIMESTAMPTZ DEFAULT NOW(),
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'suspended', 'deregistered'))
);
ALTER TABLE registered_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "devices_own" ON registered_devices USING (profile_id = auth.uid());
CREATE POLICY "devices_admin" ON registered_devices FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ── 8. Explore Module — INSERT / UPDATE / DELETE RLS policies ──────────────
-- Additive: the SELECT policies from section 7 remain; these add write access.

-- Helper: check if caller is admin. GoldPass Admin PC access is admin-only —
-- 'supervisor' was never actually assigned to any account and has been
-- retired; 'manager' accounts use the mobile app, not this panel.
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
  LANGUAGE sql SECURITY DEFINER AS $$
    SELECT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  $$;

-- SITES
CREATE POLICY "sites_insert" ON sites FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "sites_update" ON sites FOR UPDATE
  USING (created_by = auth.uid() OR is_admin());
CREATE POLICY "sites_delete" ON sites FOR DELETE
  USING (created_by = auth.uid() OR is_admin());

-- HOLES
CREATE POLICY "holes_insert" ON holes FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "holes_update" ON holes FOR UPDATE
  USING (is_admin() OR auth.uid() IS NOT NULL);
CREATE POLICY "holes_delete" ON holes FOR DELETE
  USING (is_admin());

-- EXPLORE_TEAMS
CREATE POLICY "teams_insert" ON explore_teams FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "teams_update" ON explore_teams FOR UPDATE
  USING (is_admin());
CREATE POLICY "teams_delete" ON explore_teams FOR DELETE
  USING (is_admin());

-- ASSIGNMENTS
CREATE POLICY "assignments_insert" ON assignments FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "assignments_update" ON assignments FOR UPDATE
  USING (is_admin());
CREATE POLICY "assignments_delete" ON assignments FOR DELETE
  USING (is_admin());

-- DEVICE_POSITIONS (field devices insert their own; admins can delete)
CREATE POLICY "positions_insert" ON device_positions FOR INSERT
  WITH CHECK (profile_id = auth.uid());
CREATE POLICY "positions_delete" ON device_positions FOR DELETE
  USING (is_admin());

-- HOLE_SURVEYS (field devices insert; admins update status)
CREATE POLICY "surveys_insert" ON hole_surveys FOR INSERT
  WITH CHECK (submitted_by = auth.uid());
CREATE POLICY "surveys_update" ON hole_surveys FOR UPDATE
  USING (is_admin());

-- EXPLORE_ALERTS
CREATE POLICY "alerts_insert" ON explore_alerts FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "alerts_update" ON explore_alerts FOR UPDATE
  USING (is_admin());

-- DEVICE_INVITATIONS
CREATE POLICY "invitations_insert" ON device_invitations FOR INSERT
  WITH CHECK (is_admin());
CREATE POLICY "invitations_update" ON device_invitations FOR UPDATE
  USING (is_admin() OR claimed_by = auth.uid());

-- REGISTERED_DEVICES
CREATE POLICY "devices_insert" ON registered_devices FOR INSERT
  WITH CHECK (profile_id = auth.uid());
CREATE POLICY "devices_update" ON registered_devices FOR UPDATE
  USING (profile_id = auth.uid() OR is_admin());

-- profiles role column (needed by is_admin helper)
-- If your profiles table doesn't have a role column yet, add it:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
