-- ============================================================================
-- 0015_admin_only_pc_access.sql
-- Retires the 'supervisor' role (never actually assigned to any account —
-- current roster is 2 admins, 3 managers, 0 supervisors) and restricts the
-- GoldPass Admin PC panel to admin accounts only. Managers work the mobile
-- app; only admins get PC access. Run manually in the Supabase Dashboard →
-- SQL Editor, same as supabase/setup.sql and 0014.
--
-- Renaming (rather than dropping + recreating) is_admin_or_supervisor()
-- keeps all 19 existing RLS policies that reference it intact — Postgres
-- tracks policy dependencies by function OID, not by name, so the rename
-- propagates automatically. Re-running this script is safe: the DO block
-- below swallows "function does not exist" on a second run (already
-- renamed), and CREATE OR REPLACE / DROP POLICY + CREATE POLICY replace
-- cleanly rather than erroring.
--
-- Scope: only profiles.role (PC/web access). device_invitations.role
-- ('field_team' / 'supervisor') is untouched — that's a mobile field-crew
-- device type, unrelated to who can log into the PC panel.
-- ============================================================================

DO $$
BEGIN
  ALTER FUNCTION is_admin_or_supervisor() RENAME TO is_admin();
EXCEPTION
  WHEN undefined_function THEN
    NULL; -- already renamed (or this is a fresh DB that never had the old name)
END $$;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
  LANGUAGE sql SECURITY DEFINER AS $$
    SELECT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  $$;

-- The 5 SELECT policies below predate the helper function and inline the
-- role check instead of calling it — bring them in line so 'supervisor'
-- doesn't linger in a second place.
DROP POLICY IF EXISTS "positions_admin_read" ON device_positions;
CREATE POLICY "positions_admin_read" ON device_positions FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "surveys_admin" ON hole_surveys;
CREATE POLICY "surveys_admin" ON hole_surveys FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "alerts_admin" ON explore_alerts;
CREATE POLICY "alerts_admin" ON explore_alerts USING (is_admin());

DROP POLICY IF EXISTS "invitations_admin" ON device_invitations;
CREATE POLICY "invitations_admin" ON device_invitations USING (is_admin());

DROP POLICY IF EXISTS "devices_admin" ON registered_devices;
CREATE POLICY "devices_admin" ON registered_devices FOR SELECT USING (is_admin());
