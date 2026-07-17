-- ============================================================================
-- 0021_decisioning.sql
-- Chemical plant build, phase E: expansion signal and first fault flag.
-- Run manually in the Supabase Dashboard, SQL Editor (same as 0014-0020).
--
-- Per BUILD.md sections 4.8 and 10, both thresholds were open questions,
-- resolved as follows:
--   Expansion signal = "cost ratio vs capacity": tank utilization (share of
--   the 15 tanks currently mid-leach, i.e. not reading clear) crossed with
--   cost efficiency (this month's cost per gram recovered vs the trailing
--   average). High utilization + at-or-better-than-average cost per gram
--   means the plant is both busy and efficient, a reasonable first-cut signal
--   that there is room to add capacity rather than just push the existing
--   plant harder. Thresholds (80% utilization, avg-or-better cost) are a
--   starting point, adjust once real data accumulates.
--   First fault flag = "round taking too long": the currently open leaching
--   period compared against the average length of past closed periods. No
--   history yet falls back to a fixed 21 day placeholder.
-- ============================================================================

DROP FUNCTION IF EXISTS get_expansion_signal();
CREATE FUNCTION get_expansion_signal()
RETURNS TABLE (
  tanks_total INTEGER,
  tanks_clear INTEGER,
  utilization_pct NUMERIC,
  current_cost_per_gram_tsh NUMERIC,
  trailing_avg_cost_per_gram_tsh NUMERIC,
  signal BOOLEAN
) AS $$
  WITH tank_state AS (
    SELECT
      COUNT(*)::INTEGER AS tanks_total,
      COUNT(*) FILTER (WHERE v.result = 'clear')::INTEGER AS tanks_clear
    FROM tanks t
    LEFT JOIN v_tank_latest_color v ON v.tank_id = t.id
    WHERE t.active = true
  ),
  monthly_recovered AS (
    SELECT date_trunc('month', batch_date)::DATE AS month, SUM(gold_recovered_g) AS recovered_g
    FROM elution_batches
    GROUP BY 1
  ),
  monthly_cost AS (
    SELECT to_date(month, 'YYYY-MM') AS month, cost_tsh
    FROM get_operations_financial_summary(NULL, 6)
  ),
  monthly_efficiency AS (
    SELECT
      c.month,
      CASE WHEN COALESCE(r.recovered_g, 0) > 0 THEN c.cost_tsh / r.recovered_g ELSE NULL END AS cost_per_gram_tsh
    FROM monthly_cost c
    LEFT JOIN monthly_recovered r ON r.month = c.month
  ),
  current_month AS (
    SELECT cost_per_gram_tsh FROM monthly_efficiency ORDER BY month DESC LIMIT 1
  ),
  trailing_avg AS (
    SELECT AVG(cost_per_gram_tsh) AS avg_cost_per_gram_tsh
    FROM monthly_efficiency
    WHERE month < (SELECT MAX(month) FROM monthly_efficiency) AND cost_per_gram_tsh IS NOT NULL
  )
  SELECT
    ts.tanks_total,
    ts.tanks_clear,
    ROUND(100.0 * (ts.tanks_total - ts.tanks_clear) / NULLIF(ts.tanks_total, 0), 1) AS utilization_pct,
    ROUND((SELECT cost_per_gram_tsh FROM current_month), 2) AS current_cost_per_gram_tsh,
    ROUND((SELECT avg_cost_per_gram_tsh FROM trailing_avg), 2) AS trailing_avg_cost_per_gram_tsh,
    (
      (100.0 * (ts.tanks_total - ts.tanks_clear) / NULLIF(ts.tanks_total, 0)) >= 80
      AND (SELECT cost_per_gram_tsh FROM current_month) IS NOT NULL
      AND (SELECT avg_cost_per_gram_tsh FROM trailing_avg) IS NOT NULL
      AND (SELECT cost_per_gram_tsh FROM current_month) <= (SELECT avg_cost_per_gram_tsh FROM trailing_avg)
    ) AS signal
  FROM tank_state ts;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_expansion_signal() TO authenticated;

DROP FUNCTION IF EXISTS get_fault_flags();
CREATE FUNCTION get_fault_flags()
RETURNS TABLE (
  open_period_id UUID,
  period_start DATE,
  days_open INTEGER,
  avg_closed_period_days NUMERIC,
  threshold_days NUMERIC,
  is_overdue BOOLEAN
) AS $$
  WITH closed AS (
    SELECT AVG(period_end - period_start) AS avg_days
    FROM leaching_periods
    WHERE status = 'closed' AND period_end IS NOT NULL
  ),
  open_period AS (
    SELECT id, period_start
    FROM leaching_periods
    WHERE status = 'open'
    ORDER BY period_start DESC
    LIMIT 1
  )
  SELECT
    op.id,
    op.period_start,
    (CURRENT_DATE - op.period_start)::INTEGER AS days_open,
    ROUND((SELECT avg_days FROM closed), 1) AS avg_closed_period_days,
    COALESCE((SELECT avg_days FROM closed) * 1.5, 21) AS threshold_days,
    (CURRENT_DATE - op.period_start) > COALESCE((SELECT avg_days FROM closed) * 1.5, 21) AS is_overdue
  FROM open_period op;
$$ LANGUAGE sql STABLE;

GRANT EXECUTE ON FUNCTION get_fault_flags() TO authenticated;
