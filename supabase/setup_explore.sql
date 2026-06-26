-- ============================================================================
-- GoldPass — Explore module schema
-- Run this in Supabase Dashboard → SQL Editor.
-- Safe to re-run: all statements use IF NOT EXISTS / OR REPLACE.
-- Run AFTER setup.sql (the workbench schema must exist first).
-- ============================================================================

-- ── 1. profiles ──────────────────────────────────────────────────────────────
-- One row per auth user (both admin users and field devices).
-- The claim-device edge function creates rows here automatically.

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  role       text not null default 'field_team'
               check (role in ('admin', 'supervisor', 'field_team')),
  team_id    uuid,                                -- filled in after team exists
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email      text;
alter table public.profiles add column if not exists role       text not null default 'field_team';
alter table public.profiles add column if not exists team_id    uuid;
alter table public.profiles add column if not exists created_at timestamptz not null default now();

alter table public.profiles enable row level security;

drop policy if exists profiles_self   on public.profiles;
drop policy if exists profiles_insert on public.profiles;

-- any authenticated user can read their own profile
create policy profiles_self on public.profiles
  for select using (id = auth.uid());

-- edge functions write via service role (bypasses RLS); this covers direct inserts
create policy profiles_insert on public.profiles
  for insert with check (id = auth.uid());

-- ── 2. sites ─────────────────────────────────────────────────────────────────

create table if not exists public.sites (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text,
  origin_lat    double precision not null default 0,
  origin_lng    double precision not null default 0,
  total_rows    integer not null default 0,
  total_cols    integer not null default 0,
  row_spacing_m real not null default 500,
  col_spacing_m real not null default 500,
  created_by    uuid references auth.users(id),
  created_at    timestamptz not null default now()
);

alter table public.sites enable row level security;

drop policy if exists sites_select on public.sites;
drop policy if exists sites_insert on public.sites;
drop policy if exists sites_update on public.sites;
drop policy if exists sites_delete on public.sites;

create policy sites_select on public.sites for select using (auth.role() = 'authenticated');
create policy sites_insert on public.sites for insert with check (auth.role() = 'authenticated');
create policy sites_update on public.sites for update using (auth.role() = 'authenticated');
create policy sites_delete on public.sites for delete using (created_by = auth.uid());

-- ── 3. site_vertices ─────────────────────────────────────────────────────────
-- The polygon boundary points that define a site's area.

create table if not exists public.site_vertices (
  id      uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  seq     integer not null,
  lat     double precision not null,
  lng     double precision not null,
  label   text not null default ''
);

create index if not exists idx_site_vertices_site on public.site_vertices(site_id, seq);

alter table public.site_vertices enable row level security;

drop policy if exists site_vertices_select on public.site_vertices;
drop policy if exists site_vertices_insert on public.site_vertices;
drop policy if exists site_vertices_delete on public.site_vertices;

create policy site_vertices_select on public.site_vertices for select using (auth.role() = 'authenticated');
create policy site_vertices_insert on public.site_vertices for insert with check (auth.role() = 'authenticated');
create policy site_vertices_delete on public.site_vertices for delete using (auth.role() = 'authenticated');

-- ── 4. site_grid_config ───────────────────────────────────────────────────────
-- Grid spacing and hole ID prefix per site.

create table if not exists public.site_grid_config (
  id             uuid primary key default gen_random_uuid(),
  site_id        uuid not null unique references public.sites(id) on delete cascade,
  h_interval_m   real not null default 500,
  v_interval_m   real not null default 500,
  hole_id_prefix text not null default 'XX'
);

alter table public.site_grid_config enable row level security;

drop policy if exists site_grid_config_select on public.site_grid_config;
drop policy if exists site_grid_config_insert on public.site_grid_config;

create policy site_grid_config_select on public.site_grid_config for select using (auth.role() = 'authenticated');
create policy site_grid_config_insert on public.site_grid_config for insert with check (auth.role() = 'authenticated');

-- ── 5. explore_teams ─────────────────────────────────────────────────────────

create table if not exists public.explore_teams (
  id         uuid primary key default gen_random_uuid(),
  site_id    uuid not null references public.sites(id) on delete cascade,
  name       text not null,
  color_hex  text not null default '#3B82F6',
  created_at timestamptz not null default now()
);

create index if not exists idx_explore_teams_site on public.explore_teams(site_id);

alter table public.explore_teams enable row level security;

drop policy if exists explore_teams_select on public.explore_teams;
drop policy if exists explore_teams_insert on public.explore_teams;
drop policy if exists explore_teams_delete on public.explore_teams;

create policy explore_teams_select on public.explore_teams for select using (auth.role() = 'authenticated');
create policy explore_teams_insert on public.explore_teams for insert with check (auth.role() = 'authenticated');
create policy explore_teams_delete on public.explore_teams for delete using (auth.role() = 'authenticated');

-- Add the FK from profiles.team_id now that explore_teams exists
do $$ begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'profiles_team_id_fk' and table_name = 'profiles'
  ) then
    alter table public.profiles
      add constraint profiles_team_id_fk
      foreign key (team_id) references public.explore_teams(id) on delete set null;
  end if;
end $$;

-- ── 6. holes ─────────────────────────────────────────────────────────────────
-- Every survey point generated from the grid. Status tracks drilling progress.

create table if not exists public.holes (
  id      uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  hole_id text not null,                                -- e.g. GTA-A001
  lat     double precision not null,
  lng     double precision not null,
  grid_x  integer not null default 0,
  grid_y  integer not null default 0,
  status  text not null default 'pending'
            check (status in ('pending', 'assigned', 'completed')),
  unique (site_id, hole_id)
);

create index if not exists idx_holes_site   on public.holes(site_id);
create index if not exists idx_holes_status on public.holes(site_id, status);

alter table public.holes enable row level security;

drop policy if exists holes_select on public.holes;
drop policy if exists holes_insert on public.holes;
drop policy if exists holes_update on public.holes;

create policy holes_select on public.holes for select using (auth.role() = 'authenticated');
create policy holes_insert on public.holes for insert with check (auth.role() = 'authenticated');
create policy holes_update on public.holes for update using (auth.role() = 'authenticated');

-- ── 7. assignments ────────────────────────────────────────────────────────────
-- Which team is responsible for which hole in a given week.

create table if not exists public.assignments (
  id         uuid primary key default gen_random_uuid(),
  hole_id    uuid not null references public.holes(id) on delete cascade,
  team_id    uuid not null references public.explore_teams(id) on delete cascade,
  week_start date not null,
  unique (hole_id, week_start)
);

create index if not exists idx_assignments_team on public.assignments(team_id, week_start);
create index if not exists idx_assignments_week on public.assignments(week_start);

alter table public.assignments enable row level security;

drop policy if exists assignments_select on public.assignments;
drop policy if exists assignments_insert on public.assignments;
drop policy if exists assignments_delete on public.assignments;

create policy assignments_select on public.assignments for select using (auth.role() = 'authenticated');
create policy assignments_insert on public.assignments for insert with check (auth.role() = 'authenticated');
create policy assignments_delete on public.assignments for delete using (auth.role() = 'authenticated');

-- ── 8. hole_surveys ───────────────────────────────────────────────────────────
-- Photo submissions from the field. The validate-survey-photo edge function
-- writes here; admins approve or reject from the Survey Photos page.

create table if not exists public.hole_surveys (
  id               uuid primary key default gen_random_uuid(),
  hole_id          uuid not null references public.holes(id) on delete cascade,
  team_id          uuid references public.explore_teams(id) on delete set null,
  photo_url        text not null,
  photo_lat        double precision,
  photo_lng        double precision,
  photo_accuracy_m real,
  notes            text,
  status           text not null default 'pending'
                     check (status in ('pending', 'approved', 'rejected')),
  submitted_at     timestamptz not null default now()
);

create index if not exists idx_hole_surveys_hole   on public.hole_surveys(hole_id);
create index if not exists idx_hole_surveys_status on public.hole_surveys(status, submitted_at desc);

alter table public.hole_surveys enable row level security;

drop policy if exists hole_surveys_select on public.hole_surveys;
drop policy if exists hole_surveys_insert on public.hole_surveys;
drop policy if exists hole_surveys_update on public.hole_surveys;

create policy hole_surveys_select on public.hole_surveys for select using (auth.role() = 'authenticated');
create policy hole_surveys_insert on public.hole_surveys for insert with check (auth.role() = 'authenticated');
create policy hole_surveys_update on public.hole_surveys for update using (auth.role() = 'authenticated');

-- ── 9. explore_alerts ────────────────────────────────────────────────────────
-- Radio call / broadcast alerts sent from the dashboard to field teams.

create table if not exists public.explore_alerts (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid references public.sites(id) on delete cascade,
  message     text not null,
  priority    text not null default 'normal'
                check (priority in ('normal', 'urgent')),
  target_type text not null default 'all',   -- 'all' | team name | hole_id
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

create index if not exists idx_explore_alerts_site on public.explore_alerts(site_id, created_at desc);

alter table public.explore_alerts enable row level security;

drop policy if exists explore_alerts_select on public.explore_alerts;
drop policy if exists explore_alerts_insert on public.explore_alerts;

create policy explore_alerts_select on public.explore_alerts for select using (auth.role() = 'authenticated');
create policy explore_alerts_insert on public.explore_alerts for insert with check (auth.role() = 'authenticated');

-- ── 10. device_invitations ────────────────────────────────────────────────────
-- GOLD-XXXX pairing codes generated by admins for field devices.

create table if not exists public.device_invitations (
  id           uuid primary key default gen_random_uuid(),
  site_id      uuid not null references public.sites(id) on delete cascade,
  team_id      uuid not null references public.explore_teams(id),
  device_code  text not null unique,           -- e.g. GOLD-7KR3
  device_key   text not null,                   -- bcrypt hash of the raw 32-char key
  label        text not null,                   -- e.g. "Abdi's phone"
  role         text not null default 'field_team'
                 check (role in ('field_team', 'supervisor')),
  status       text not null default 'pending'
                 check (status in ('pending', 'active', 'revoked')),
  created_by   uuid references auth.users(id),
  claimed_by   uuid references auth.users(id),
  claimed_at   timestamptz,
  expires_at   timestamptz not null,
  created_at   timestamptz not null default now()
);

create index if not exists idx_device_inv_code on public.device_invitations(device_code);
create index if not exists idx_device_inv_site on public.device_invitations(site_id);

alter table public.device_invitations enable row level security;

drop policy if exists device_inv_select on public.device_invitations;
drop policy if exists device_inv_insert on public.device_invitations;
drop policy if exists device_inv_update on public.device_invitations;

-- admin/supervisor can see and create invitations they own
create policy device_inv_select on public.device_invitations
  for select using (created_by = auth.uid());
create policy device_inv_insert on public.device_invitations
  for insert with check (created_by = auth.uid());
create policy device_inv_update on public.device_invitations
  for update using (created_by = auth.uid());

-- ── 11. registered_devices ────────────────────────────────────────────────────
-- One row per physical phone that has been claimed.

create table if not exists public.registered_devices (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null references auth.users(id) on delete cascade,
  invitation_id  uuid references public.device_invitations(id) on delete set null,
  android_id     text not null unique,
  device_model   text,
  app_version    text,
  fcm_token      text,
  bt_mac         text,
  status         text not null default 'active'
                   check (status in ('active', 'suspended')),
  last_seen_at   timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists idx_registered_devices_profile on public.registered_devices(profile_id);

alter table public.registered_devices enable row level security;

drop policy if exists reg_devices_self on public.registered_devices;

-- device can only see its own row
create policy reg_devices_self on public.registered_devices
  for select using (profile_id = auth.uid());

-- ── 12. device_positions ─────────────────────────────────────────────────────
-- GPS pings from field devices. Supabase Realtime broadcasts each INSERT
-- to the Live Map so dots update instantly without polling.

create table if not exists public.device_positions (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references auth.users(id) on delete cascade,
  team_id      uuid references public.explore_teams(id) on delete set null,
  lat          double precision not null,
  lng          double precision not null,
  accuracy_m   real,
  altitude_m   real,
  source       text not null default 'gps'
                 check (source in ('gps', 'network', 'fused')),
  recorded_at  timestamptz not null default now()
);

create index if not exists idx_device_pos_profile on public.device_positions(profile_id, recorded_at desc);
create index if not exists idx_device_pos_time    on public.device_positions(recorded_at desc);
create index if not exists idx_device_pos_team    on public.device_positions(team_id, recorded_at desc);

alter table public.device_positions enable row level security;

drop policy if exists device_pos_insert on public.device_positions;
drop policy if exists device_pos_select on public.device_positions;

-- device can insert its own position
create policy device_pos_insert on public.device_positions
  for insert with check (profile_id = auth.uid());

-- any authenticated user can read positions (live map needs all teams)
create policy device_pos_select on public.device_positions
  for select using (auth.role() = 'authenticated');

-- ── 13. Realtime ─────────────────────────────────────────────────────────────
-- This makes Supabase push each new device_positions row to subscribed browsers.
-- The Live Map page subscribes to this channel.

alter publication supabase_realtime add table public.device_positions;
