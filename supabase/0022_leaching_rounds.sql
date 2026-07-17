-- ============================================================================
-- 0022_leaching_rounds.sql
-- Chemical plant build, phase F: per-tank leaching rounds.
-- Run manually in the Supabase Dashboard, SQL Editor (same as 0014-0021).
--
-- Phase B's leaching_periods (0017) is a single plant-wide open/closed
-- switch, one row for the whole plant at a time. The real process runs one
-- independent round per tank (ATK1-4, BTK1-5, CTK1-6), each with its own
-- start date and clearing (end) date, several tanks mid-round at once.
-- leaching_rounds fixes that: one row per tank per round.
--
-- leaching_periods is left in place, untouched (not dropped, not migrated)
-- for historical/audit integrity, since it may already carry real rows.
-- Tanks are not cost centres (0016: "This table is not itself a cost
-- centre"), so rounds carry timing only, not cost: plant-wide cost keeps
-- living in get_operations_financial_summary / get_pits_monthly_cost / the
-- expansion-signal cost-per-gram calc, none of which change here.
--
-- get_leaching_period_cost(UUID) becomes dead code once nothing calls it
-- (dropped below). get_fault_flags() depended on the retired global-period
-- shape and is replaced by get_round_fault_flags(); get_expansion_signal()
-- has no dependency on leaching_periods and is untouched.
-- ============================================================================

CREATE TABLE IF NOT EXISTS leaching_rounds (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tank_id       UUID NOT NULL REFERENCES tanks(id),
  round_number  INTEGER NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE,
  status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  closed_by     UUID REFERENCES auth.users(id),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

-- A tank runs one round at a time (START -> CLEARING -> next round).
CREATE UNIQUE INDEX IF NOT EXISTS uq_leaching_rounds_one_open_per_tank
  ON leaching_rounds (tank_id) WHERE status = 'open';
CREATE UNIQUE INDEX IF NOT EXISTS uq_leaching_rounds_tank_round_number
  ON leaching_rounds (tank_id, round_number);
CREATE INDEX IF NOT EXISTS idx_leaching_rounds_tank_start ON leaching_rounds (tank_id, start_date DESC);

ALTER TABLE leaching_rounds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leaching_rounds_select" ON leaching_rounds;
CREATE POLICY "leaching_rounds_select" ON leaching_rounds FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "leaching_rounds_insert" ON leaching_rounds;
CREATE POLICY "leaching_rounds_insert" ON leaching_rounds FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "leaching_rounds_update" ON leaching_rounds;
CREATE POLICY "leaching_rounds_update" ON leaching_rounds FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "leaching_rounds_delete" ON leaching_rounds;
CREATE POLICY "leaching_rounds_delete" ON leaching_rounds FOR DELETE
  USING (is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON leaching_rounds TO authenticated;

-- Attach color tests to the tank's currently-open round automatically, so
-- logColorTest()'s call shape does not change. A test logged with no open
-- round on that tank just leaves round_id null, same as today's behavior.
ALTER TABLE color_tests ADD COLUMN IF NOT EXISTS round_id UUID REFERENCES leaching_rounds(id);

CREATE OR REPLACE FUNCTION color_tests_fill_round_id() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.round_id IS NULL THEN
    SELECT id INTO NEW.round_id FROM leaching_rounds
    WHERE tank_id = NEW.tank_id AND status = 'open' LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_color_tests_fill_round_id ON color_tests;
CREATE TRIGGER trg_color_tests_fill_round_id BEFORE INSERT ON color_tests
FOR EACH ROW EXECUTE FUNCTION color_tests_fill_round_id();

-- Start a round: rejects a second concurrent open round on the same tank,
-- computes the next round_number for that tank. Mirrors create_pit's
-- SECURITY DEFINER pattern (0018).
DROP FUNCTION IF EXISTS start_leaching_round(UUID, DATE, TEXT);
CREATE FUNCTION start_leaching_round(p_tank_id UUID, p_start_date DATE, p_notes TEXT DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
  v_round_id UUID;
  v_next_number INTEGER;
BEGIN
  IF EXISTS (SELECT 1 FROM leaching_rounds WHERE tank_id = p_tank_id AND status = 'open') THEN
    RAISE EXCEPTION 'Tank already has an open round';
  END IF;

  SELECT COALESCE(MAX(round_number), 0) + 1 INTO v_next_number
  FROM leaching_rounds WHERE tank_id = p_tank_id;

  INSERT INTO leaching_rounds (tank_id, round_number, start_date, notes)
  VALUES (p_tank_id, v_next_number, p_start_date, p_notes)
  RETURNING id INTO v_round_id;

  RETURN v_round_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION start_leaching_round(UUID, DATE, TEXT) TO authenticated;

-- One row per active tank: current round (if any), days open, latest color
-- test + days since, average closed-round length, an overdue threshold, and
-- is_overdue. Backs the status board, the Start/End-round button state, and
-- the 5-day-since-last-test staleness flag (computed here, not a gate -
-- ad-hoc logging any time still works).
DROP FUNCTION IF EXISTS get_tank_round_status();
CREATE FUNCTION get_tank_round_status()
RETURNS TABLE (
  tank_id UUID,
  tank_code TEXT,
  line TEXT,
  sort_order INTEGER,
  round_id UUID,
  round_number INTEGER,
  start_date DATE,
  days_open INTEGER,
  latest_color TEXT,
  latest_test_date DATE,
  days_since_last_test INTEGER,
  avg_closed_round_days NUMERIC,
  threshold_days NUMERIC,
  is_overdue BOOLEAN
) AS $$
  WITH closed AS (
    SELECT AVG(end_date - start_date) AS avg_days
    FROM leaching_rounds
    WHERE status = 'closed' AND end_date IS NOT NULL
  )
  SELECT
    t.id,
    t.tank_code,
    t.line,
    t.sort_order,
    r.id,
    r.round_number,
    r.start_date,
    CASE WHEN r.id IS NOT NULL THEN (CURRENT_DATE - r.start_date)::INTEGER ELSE NULL END,
    v.result,
    v.test_date,
    CASE WHEN v.test_date IS NOT NULL THEN (CURRENT_DATE - v.test_date)::INTEGER ELSE NULL END,
    ROUND((SELECT avg_days FROM closed), 1),
    COALESCE((SELECT avg_days FROM closed) * 1.5, 21),
    CASE WHEN r.id IS NOT NULL
      THEN (CURRENT_DATE - r.start_date) > COALESCE((SELECT avg_days FROM closed) * 1.5, 21)
      ELSE false
    END
  FROM tanks t
  LEFT JOIN leaching_rounds r ON r.tank_id = t.id AND r.status = 'open'
  LEFT JOIN v_tank_latest_color v ON v.tank_id = t.id
  WHERE t.active = true
  ORDER BY t.sort_order;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_tank_round_status() TO authenticated;

-- Per-tank round history (start, end/today-if-open, status), for the
-- Overview timeline/Gantt.
DROP FUNCTION IF EXISTS get_leaching_rounds_timeline(INTEGER);
CREATE FUNCTION get_leaching_rounds_timeline(p_days INTEGER DEFAULT 90)
RETURNS TABLE (
  tank_id UUID,
  tank_code TEXT,
  line TEXT,
  sort_order INTEGER,
  round_id UUID,
  round_number INTEGER,
  start_date DATE,
  end_date DATE,
  status TEXT
) AS $$
  SELECT
    t.id, t.tank_code, t.line, t.sort_order,
    r.id, r.round_number, r.start_date,
    COALESCE(r.end_date, CURRENT_DATE),
    r.status
  FROM leaching_rounds r
  JOIN tanks t ON t.id = r.tank_id
  WHERE r.start_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL OR r.status = 'open'
  ORDER BY t.sort_order, r.round_number;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_leaching_rounds_timeline(INTEGER) TO authenticated;

-- Average closed-round length per month, for the Overview cycle-time trend.
DROP FUNCTION IF EXISTS get_round_cycle_times(INTEGER);
CREATE FUNCTION get_round_cycle_times(p_months INTEGER DEFAULT 6)
RETURNS TABLE (month DATE, avg_days NUMERIC, rounds_closed INTEGER) AS $$
  WITH months AS (
    SELECT generate_series(
      date_trunc('month', CURRENT_DATE) - ((p_months - 1) || ' months')::INTERVAL,
      date_trunc('month', CURRENT_DATE),
      INTERVAL '1 month'
    )::DATE AS month
  ),
  closed AS (
    SELECT date_trunc('month', end_date)::DATE AS month, (end_date - start_date) AS days
    FROM leaching_rounds
    WHERE status = 'closed' AND end_date IS NOT NULL
  )
  SELECT m.month, ROUND(AVG(c.days), 1), COUNT(c.days)::INTEGER
  FROM months m
  LEFT JOIN closed c ON c.month = m.month
  GROUP BY m.month
  ORDER BY m.month;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_round_cycle_times(INTEGER) TO authenticated;

-- Overdue rounds only, replaces get_fault_flags() (retired below: it read
-- the single global open leaching_periods row, which no longer exists as
-- a concept here).
DROP FUNCTION IF EXISTS get_round_fault_flags();
CREATE FUNCTION get_round_fault_flags()
RETURNS TABLE (
  tank_id UUID,
  tank_code TEXT,
  round_id UUID,
  round_number INTEGER,
  start_date DATE,
  days_open INTEGER,
  avg_closed_round_days NUMERIC,
  threshold_days NUMERIC,
  is_overdue BOOLEAN
) AS $$
  SELECT tank_id, tank_code, round_id, round_number, start_date, days_open,
         avg_closed_round_days, threshold_days, is_overdue
  FROM get_tank_round_status()
  WHERE round_id IS NOT NULL AND is_overdue = true;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_round_fault_flags() TO authenticated;

-- Dead code once nothing calls it: plant-wide period cost pro-ration, no
-- longer meaningful now that rounds are per-tank and carry no cost centre.
DROP FUNCTION IF EXISTS get_leaching_period_cost(UUID);

-- Retired: depended on the single global open leaching_periods row.
-- Superseded by get_round_fault_flags() above.
DROP FUNCTION IF EXISTS get_fault_flags();
