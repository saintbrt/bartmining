-- ============================================================================
-- 0017_leaching_periods_color_tests.sql
-- Chemical plant, phase B: leaching periods and color tests.
-- Run manually in the Supabase Dashboard, SQL Editor (same as 0014/0015/0016).
--
-- Per BUILD.md section 4.7:
--   leaching_periods bounds a leaching cycle by date. No cost centre per cycle;
--   period cost comes from date filtering cost_events, pro rated to months when
--   a period crosses a month boundary.
--   color_tests records the daily color reading per tank, on no fixed schedule.
--   black = gold still present (start), grey = partial with resistance,
--   clear = fully extracted. Latest test per tank drives the plant map state.
-- ============================================================================

CREATE TABLE IF NOT EXISTS leaching_periods (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start  DATE NOT NULL,
  period_end    DATE,
  status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  closed_by     UUID REFERENCES auth.users(id),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (period_end IS NULL OR period_end >= period_start)
);

CREATE TABLE IF NOT EXISTS color_tests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  tank_id     UUID NOT NULL REFERENCES tanks(id),
  result      TEXT NOT NULL CHECK (result IN ('black', 'grey', 'clear')),
  notes       TEXT,
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_color_tests_tank_date ON color_tests (tank_id, test_date DESC);

ALTER TABLE leaching_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_tests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leaching_periods_select" ON leaching_periods;
CREATE POLICY "leaching_periods_select" ON leaching_periods FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "leaching_periods_insert" ON leaching_periods;
CREATE POLICY "leaching_periods_insert" ON leaching_periods FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "leaching_periods_update" ON leaching_periods;
CREATE POLICY "leaching_periods_update" ON leaching_periods FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "leaching_periods_delete" ON leaching_periods;
CREATE POLICY "leaching_periods_delete" ON leaching_periods FOR DELETE
  USING (is_admin());

DROP POLICY IF EXISTS "color_tests_select" ON color_tests;
CREATE POLICY "color_tests_select" ON color_tests FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "color_tests_insert" ON color_tests;
CREATE POLICY "color_tests_insert" ON color_tests FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "color_tests_update" ON color_tests;
CREATE POLICY "color_tests_update" ON color_tests FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "color_tests_delete" ON color_tests;
CREATE POLICY "color_tests_delete" ON color_tests FOR DELETE
  USING (is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON leaching_periods TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON color_tests TO authenticated;

-- Latest color test per tank, used by the plant map for live fill state.
DROP VIEW IF EXISTS v_tank_latest_color;
CREATE VIEW v_tank_latest_color AS
SELECT DISTINCT ON (tank_id)
  tank_id, result, test_date
FROM color_tests
ORDER BY tank_id, test_date DESC, created_at DESC;

GRANT SELECT ON v_tank_latest_color TO authenticated;

-- Cost of a leaching period, pro rated across the months it spans, from the
-- cost_events ledger (no per-cycle cost centre exists, per BUILD.md section 3).
DROP FUNCTION IF EXISTS get_leaching_period_cost(UUID);
CREATE FUNCTION get_leaching_period_cost(p_period_id UUID)
RETURNS TABLE (month DATE, total_cost_tsh NUMERIC) AS $$
  WITH period AS (
    SELECT period_start, COALESCE(period_end, CURRENT_DATE) AS period_end
    FROM leaching_periods WHERE id = p_period_id
  ),
  days AS (
    SELECT generate_series(period_start, period_end, INTERVAL '1 day')::DATE AS d
    FROM period
  ),
  total AS (
    SELECT COALESCE(SUM(amount_tsh), 0) AS total_cost_tsh, COUNT(*) OVER () AS n
    FROM cost_events, period
    WHERE event_date BETWEEN period.period_start AND period.period_end
  )
  SELECT date_trunc('month', d)::DATE AS month,
         ROUND((SELECT total_cost_tsh FROM total LIMIT 1) / (SELECT COUNT(*) FROM days), 2) AS total_cost_tsh
  FROM days
  GROUP BY date_trunc('month', d)::DATE
  ORDER BY 1;
$$ LANGUAGE sql STABLE;
