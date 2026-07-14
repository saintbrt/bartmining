-- ============================================================================
-- 0016_plant_tanks.sql
-- Chemical plant, phase A: the 15 leaching tanks as master/reference data.
-- Run manually in the Supabase Dashboard, SQL Editor (same as 0014/0015).
--
-- Three lines, per BUILD.md section 5:
--   Line A: ATK1..ATK4  (4 tanks)
--   Line B: BTK1..BTK5  (5 tanks)
--   Line C: CTK1..CTK6  (6 tanks)
--
-- ref_cost_tsh is a REFERENCE value only (one figure per tank, used for both
-- load and offload). The actual charge per round changes and is captured
-- separately as cost_events against a cost_centre, per the ledger spine in
-- BUILD.md section 2. This table is not itself a cost_centre.
--
-- Live tank state (fill colour driven by the latest color_tests row) is
-- Phase B, not this migration. Phase A ships tanks as static reference data
-- only, the map renders code + volume with no dynamic colour yet.
-- ============================================================================

CREATE TABLE IF NOT EXISTS tanks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tank_code      TEXT NOT NULL UNIQUE,
  line           TEXT NOT NULL CHECK (line IN ('A', 'B', 'C')),
  volume_m3      NUMERIC(6, 2) NOT NULL CHECK (volume_m3 > 0),
  ref_cost_tsh   NUMERIC(12, 2) NOT NULL CHECK (ref_cost_tsh >= 0),
  sort_order     INTEGER NOT NULL DEFAULT 0,
  active         BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE tanks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tanks_select" ON tanks;
CREATE POLICY "tanks_select" ON tanks FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "tanks_insert" ON tanks;
CREATE POLICY "tanks_insert" ON tanks FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "tanks_update" ON tanks;
CREATE POLICY "tanks_update" ON tanks FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "tanks_delete" ON tanks;
CREATE POLICY "tanks_delete" ON tanks FOR DELETE
  USING (is_admin());

-- Seed the 15 tanks. ON CONFLICT makes this safe to re-run (updates the
-- reference cost/volume in place rather than erroring on a second run).
INSERT INTO tanks (tank_code, line, volume_m3, ref_cost_tsh, sort_order) VALUES
  ('ATK1', 'A', 17.25, 44000, 1),
  ('ATK2', 'A', 21.01, 48000, 2),
  ('ATK3', 'A', 16.90, 44000, 3),
  ('ATK4', 'A', 18.04, 44000, 4),
  ('BTK1', 'B', 11.63, 40000, 5),
  ('BTK2', 'B', 15.83, 44000, 6),
  ('BTK3', 'B', 13.68, 40000, 7),
  ('BTK4', 'B', 16.23, 44000, 8),
  ('BTK5', 'B', 12.37, 40000, 9),
  ('CTK1', 'C', 10.50, 24000, 10),
  ('CTK2', 'C', 12.78, 30000, 11),
  ('CTK3', 'C', 11.03, 24000, 12),
  ('CTK4', 'C', 13.18, 30000, 13),
  ('CTK5', 'C', 12.21, 30000, 14),
  ('CTK6', 'C', 12.65, 30000, 15)
ON CONFLICT (tank_code) DO UPDATE SET
  line = EXCLUDED.line,
  volume_m3 = EXCLUDED.volume_m3,
  ref_cost_tsh = EXCLUDED.ref_cost_tsh,
  sort_order = EXCLUDED.sort_order;

GRANT SELECT, INSERT, UPDATE, DELETE ON tanks TO authenticated;
