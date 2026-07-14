-- ============================================================================
-- 0020_financial_summary_no_payroll.sql
-- Fix get_operations_financial_summary(): it still joined payroll_runs, which
-- the operations strip-down migration dropped (Payroll page removed; workers
-- are paid daily/part time through expense_entries as a category, per
-- BUILD.md section 4.1, not a payroll run). Left as-is, every call to this
-- function errors once payroll_runs is gone, breaking the dashboard and
-- operations overview financial tiles.
--
-- Run manually in the Supabase Dashboard, SQL Editor. Safe to run whether or
-- not payroll_runs has actually been dropped yet on your instance.
-- ============================================================================

DROP FUNCTION IF EXISTS get_operations_financial_summary(uuid, integer);

CREATE FUNCTION get_operations_financial_summary(p_site_id uuid DEFAULT NULL, p_months integer DEFAULT 6)
RETURNS TABLE (
  month text,
  revenue_tsh numeric,
  expense_tsh numeric,
  procurement_tsh numeric,
  cost_tsh numeric,
  profit_tsh numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  WITH months AS (
    SELECT date_trunc('month', d)::date AS month_start
    FROM generate_series(
      date_trunc('month', now()) - ((GREATEST(p_months, 1) - 1) || ' months')::interval,
      date_trunc('month', now()),
      interval '1 month'
    ) AS d
  ),
  revenue AS (
    SELECT date_trunc('month', sale_date)::date AS month_start, SUM(price_tsh) AS total
    FROM sales
    WHERE (p_site_id IS NULL OR site_id = p_site_id)
    GROUP BY 1
  ),
  expenses AS (
    -- Every expense category, including worker payments (entered with the
    -- worker's name in the description, per the "workers are not fixed
    -- employees" decision), rolls up here.
    SELECT date_trunc('month', created_at)::date AS month_start, SUM(amount_tsh) AS total
    FROM v_expense_oversight
    WHERE status = 'approved'
    GROUP BY 1
  ),
  procurement AS (
    SELECT date_trunc('month', received_at)::date AS month_start, SUM(total_amount_tsh) AS total
    FROM v_procurement_pipeline
    WHERE grn_status = 'approved'
    GROUP BY 1
  )
  SELECT
    to_char(m.month_start, 'YYYY-MM'),
    COALESCE(r.total, 0),
    COALESCE(e.total, 0),
    COALESCE(pc.total, 0),
    COALESCE(e.total, 0) + COALESCE(pc.total, 0),
    COALESCE(r.total, 0) - (COALESCE(e.total, 0) + COALESCE(pc.total, 0))
  FROM months m
  LEFT JOIN revenue r ON r.month_start = m.month_start
  LEFT JOIN expenses e ON e.month_start = m.month_start
  LEFT JOIN procurement pc ON pc.month_start = m.month_start
  ORDER BY m.month_start;
END;
$$;

GRANT EXECUTE ON FUNCTION get_operations_financial_summary(uuid, integer) TO authenticated;
