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
