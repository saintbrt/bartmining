-- ============================================================================
-- 0018_pits_machinery.sql
-- Chemical plant build, phase C: pits and machinery.
-- Run manually in the Supabase Dashboard, SQL Editor (same as 0014-0017).
--
-- Per BUILD.md sections 3.1 and 4.6:
--   Many pits per mine_location, all connected to one project. A pit is
--   registered as a cost_centre so pit costs land in the ledger with no
--   extra plumbing: create_pit() creates the cost_centres row and the pits
--   row together, atomically.
--   pit_machinery: which equipment is assigned to a pit, and the team notes.
--   Fuel logging reuses the existing equipment_events table (fuel event_type
--   already present), no new fuel table.
-- ============================================================================

CREATE TABLE IF NOT EXISTS pits (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mine_location_id  UUID REFERENCES mine_locations(id),
  project_id        UUID REFERENCES projects(id),
  cost_centre_id    UUID REFERENCES cost_centres(id),
  name              TEXT NOT NULL,
  code              TEXT,
  active            BOOLEAN NOT NULL DEFAULT true,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pit_machinery (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pit_id        UUID NOT NULL REFERENCES pits(id) ON DELETE CASCADE,
  equipment_id  UUID NOT NULL REFERENCES equipment(id),
  team_notes    TEXT,
  active        BOOLEAN NOT NULL DEFAULT true,
  assigned_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE pits ENABLE ROW LEVEL SECURITY;
ALTER TABLE pit_machinery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pits_select" ON pits;
CREATE POLICY "pits_select" ON pits FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "pits_insert" ON pits;
CREATE POLICY "pits_insert" ON pits FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "pits_update" ON pits;
CREATE POLICY "pits_update" ON pits FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "pits_delete" ON pits;
CREATE POLICY "pits_delete" ON pits FOR DELETE
  USING (is_admin());

DROP POLICY IF EXISTS "pit_machinery_select" ON pit_machinery;
CREATE POLICY "pit_machinery_select" ON pit_machinery FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "pit_machinery_insert" ON pit_machinery;
CREATE POLICY "pit_machinery_insert" ON pit_machinery FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "pit_machinery_update" ON pit_machinery;
CREATE POLICY "pit_machinery_update" ON pit_machinery FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "pit_machinery_delete" ON pit_machinery;
CREATE POLICY "pit_machinery_delete" ON pit_machinery FOR DELETE
  USING (is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON pits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON pit_machinery TO authenticated;

-- Create a pit and its matching cost_centres row in one transaction, so a
-- pit can never exist without a place for its costs to roll up to.
DROP FUNCTION IF EXISTS create_pit(TEXT, TEXT, UUID, UUID);
CREATE FUNCTION create_pit(
  p_name TEXT,
  p_code TEXT,
  p_mine_location_id UUID,
  p_project_id UUID
) RETURNS UUID AS $$
DECLARE
  v_cost_centre_id UUID;
  v_pit_id UUID;
BEGIN
  INSERT INTO cost_centres (name, code) VALUES (p_name, p_code)
  RETURNING id INTO v_cost_centre_id;

  INSERT INTO pits (name, code, mine_location_id, project_id, cost_centre_id)
  VALUES (p_name, p_code, p_mine_location_id, p_project_id, v_cost_centre_id)
  RETURNING id INTO v_pit_id;

  RETURN v_pit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Monthly cost per pit from the cost_events ledger (last N months), one row
-- per pit per month, for the pit cost comparison chart.
DROP FUNCTION IF EXISTS get_pits_monthly_cost(INTEGER);
CREATE FUNCTION get_pits_monthly_cost(p_months INTEGER DEFAULT 6)
RETURNS TABLE (pit_id UUID, pit_name TEXT, month DATE, total_cost_tsh NUMERIC) AS $$
  SELECT
    p.id AS pit_id,
    p.name AS pit_name,
    date_trunc('month', ce.event_date)::DATE AS month,
    SUM(ce.amount_tsh) AS total_cost_tsh
  FROM pits p
  JOIN cost_events ce ON ce.cost_centre_id = p.cost_centre_id
  WHERE ce.event_date >= date_trunc('month', CURRENT_DATE) - (p_months || ' months')::INTERVAL
    AND p.active = true
  GROUP BY p.id, p.name, date_trunc('month', ce.event_date)
  ORDER BY p.name, month;
$$ LANGUAGE sql STABLE;
