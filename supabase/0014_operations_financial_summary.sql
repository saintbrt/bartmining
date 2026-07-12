-- ============================================================================
-- 0014_operations_financial_summary.sql
-- get_operations_financial_summary(p_site_id, p_months) — backs
-- src/lib/goldpass/erp.ts:getFinancialSummary(). Run manually in the
-- Supabase Dashboard → SQL Editor (same as supabase/setup.sql).
--
-- "Cost" = expenses + payroll + approved procurement, aggregated per
-- calendar month over the trailing p_months window (current month
-- inclusive). There's no unified cost ledger (cost_events only ever got
-- wired up for expenses), so this pulls from the three source tables/views
-- directly:
--   revenue_tsh     — sales, status = 'approved'
--   expense_tsh     — v_expense_oversight, status = 'approved'
--   payroll_tsh     — payroll_runs (total_net_tsh), status = 'approved'
--   procurement_tsh — v_procurement_pipeline (total_amount_tsh), grn_status = 'approved'
--
-- ASSUMPTIONS TO VERIFY against the live DB before trusting the numbers:
--   * The 'approved' literal is the correct terminal status string for each
--     of sales.status / v_expense_oversight.status / payroll_runs.status /
--     v_procurement_pipeline.grn_status — erp.ts only gives us the TS shape,
--     not the enum values.
--   * v_expense_oversight and v_procurement_pipeline don't expose a site_id
--     column (per ExpenseOversightRow / ProcurementPipelineRow in erp.ts),
--     so expense_tsh and procurement_tsh are NOT filtered by p_site_id —
--     only revenue_tsh (sales.site_id) and payroll_tsh (payroll_runs.site_id)
--     are. If those views do carry a site_id underneath, add the filter.
--   * payroll_runs.status may never actually reach 'approved' today — see
--     the GAP note in erp.ts above getAttendanceRecords: workflow approval
--     doesn't flip payroll_runs.status. payroll_tsh will read 0 until that's
--     fixed; that's a pre-existing backend gap, not something this function
--     should paper over.
-- ============================================================================

DROP FUNCTION IF EXISTS get_operations_financial_summary(uuid, integer);

CREATE FUNCTION get_operations_financial_summary(p_site_id uuid DEFAULT NULL, p_months integer DEFAULT 6)
RETURNS TABLE (
  month text,
  revenue_tsh numeric,
  expense_tsh numeric,
  payroll_tsh numeric,
  procurement_tsh numeric,
  cost_tsh numeric,
  profit_tsh numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT is_admin_or_supervisor() THEN
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
    WHERE status = 'approved'
      AND (p_site_id IS NULL OR site_id = p_site_id)
    GROUP BY 1
  ),
  expenses AS (
    SELECT date_trunc('month', created_at)::date AS month_start, SUM(amount_tsh) AS total
    FROM v_expense_oversight
    WHERE status = 'approved'
    GROUP BY 1
  ),
  payroll AS (
    SELECT date_trunc('month', period_start)::date AS month_start, SUM(total_net_tsh) AS total
    FROM payroll_runs
    WHERE status = 'approved'
      AND (p_site_id IS NULL OR site_id = p_site_id)
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
    COALESCE(p.total, 0),
    COALESCE(pc.total, 0),
    COALESCE(e.total, 0) + COALESCE(p.total, 0) + COALESCE(pc.total, 0),
    COALESCE(r.total, 0) - (COALESCE(e.total, 0) + COALESCE(p.total, 0) + COALESCE(pc.total, 0))
  FROM months m
  LEFT JOIN revenue r ON r.month_start = m.month_start
  LEFT JOIN expenses e ON e.month_start = m.month_start
  LEFT JOIN payroll p ON p.month_start = m.month_start
  LEFT JOIN procurement pc ON pc.month_start = m.month_start
  ORDER BY m.month_start;
END;
$$;

GRANT EXECUTE ON FUNCTION get_operations_financial_summary(uuid, integer) TO authenticated;
