-- ============================================================================
-- 0019_elution_recovery.sql
-- Chemical plant build, phase D: elution and recovery reconciliation.
-- Run manually in the Supabase Dashboard, SQL Editor (same as 0014-0018).
--
-- Per BUILD.md sections 3.3 and 4.7:
--   elution_batches holds physical gold recovery, the source of truth for
--   grams actually recovered. sales holds money. The two are reconciled,
--   never conflated: get_recovery_reconciliation() compares monthly grams
--   recovered (elution) against monthly fine gold grams sold (v_sales_register,
--   already computes fine_gold_g = weight_g * purity_pct / 100).
-- ============================================================================

CREATE TABLE IF NOT EXISTS elution_batches (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_date          DATE NOT NULL DEFAULT CURRENT_DATE,
  gold_recovered_g    NUMERIC(10, 3) NOT NULL CHECK (gold_recovered_g >= 0),
  carbon_stage_notes  TEXT,
  leaching_period_id  UUID REFERENCES leaching_periods(id),
  created_by          UUID REFERENCES auth.users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE elution_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "elution_batches_select" ON elution_batches;
CREATE POLICY "elution_batches_select" ON elution_batches FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "elution_batches_insert" ON elution_batches;
CREATE POLICY "elution_batches_insert" ON elution_batches FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "elution_batches_update" ON elution_batches;
CREATE POLICY "elution_batches_update" ON elution_batches FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "elution_batches_delete" ON elution_batches;
CREATE POLICY "elution_batches_delete" ON elution_batches FOR DELETE
  USING (is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON elution_batches TO authenticated;

-- Monthly recovered (elution) vs sold (sales) fine gold grams, for the last
-- N months. Variance is recovered minus sold: positive means gold recovered
-- has not yet been sold (stock on hand), negative flags a shortfall to check.
DROP FUNCTION IF EXISTS get_recovery_reconciliation(INTEGER);
CREATE FUNCTION get_recovery_reconciliation(p_months INTEGER DEFAULT 6)
RETURNS TABLE (month DATE, recovered_g NUMERIC, sold_g NUMERIC, variance_g NUMERIC) AS $$
  WITH months AS (
    SELECT generate_series(
      date_trunc('month', CURRENT_DATE) - ((p_months - 1) || ' months')::INTERVAL,
      date_trunc('month', CURRENT_DATE),
      INTERVAL '1 month'
    )::DATE AS month
  ),
  recovered AS (
    SELECT date_trunc('month', batch_date)::DATE AS month, SUM(gold_recovered_g) AS recovered_g
    FROM elution_batches
    GROUP BY 1
  ),
  sold AS (
    SELECT date_trunc('month', sale_date)::DATE AS month, SUM(fine_gold_g) AS sold_g
    FROM v_sales_register
    GROUP BY 1
  )
  SELECT
    m.month,
    COALESCE(r.recovered_g, 0) AS recovered_g,
    COALESCE(s.sold_g, 0) AS sold_g,
    COALESCE(r.recovered_g, 0) - COALESCE(s.sold_g, 0) AS variance_g
  FROM months m
  LEFT JOIN recovered r ON r.month = m.month
  LEFT JOIN sold s ON s.month = m.month
  ORDER BY m.month;
$$ LANGUAGE sql STABLE;
