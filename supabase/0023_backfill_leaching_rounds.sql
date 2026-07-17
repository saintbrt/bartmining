-- ============================================================================
-- 0023_backfill_leaching_rounds.sql
-- One-time backfill of historical leaching_rounds, transcribed from the
-- paper/Excel tracking sheet (two snapshots: Dec 2025-Feb 2026, and
-- Apr-Jul 2026), so the Plant page has real data to test against.
--
-- THE SOURCE DATA WAS INCONSISTENT. Specifically:
--   - START was almost never recorded, only CLEARING and DAYS. Where START
--     is missing below, this script computes it as CLEARING - DAYS.
--   - Several DAYS cells contained Excel date-serial numbers (values like
--     46024, 46037, -46045) that leaked in from a formula/fill error, not
--     real day counts. These are rejected below (`days_raw` left NULL for
--     those cells; see the per-row comments) rather than decoded into a
--     guessed date.
--   - Where BOTH start and days are missing for a round, this script falls
--     back to that tank's own average round length across its other
--     recorded rounds (rounded to the nearest day), and flags the round's
--     notes column so it's visible which rounds are estimates.
--   - Rounds are clamped so a tank's next round never starts before its
--     previous round's recorded end (leaching_rounds only allows one open
--     round per tank at a time; overlaps would fail to insert anyway).
--   - A handful of source rows had no clearing date and were superseded by
--     a later, unambiguous round for the same tank (i.e. the tank clearly
--     moved on) - those were dropped rather than guessing a close date.
--
-- This is a best-effort reconstruction for TESTING, not a certified
-- historical record. Review any row with a non-null note before treating
-- it as ground truth.
--
-- Run this AFTER 0022_leaching_rounds.sql. Safe to re-run: rows are only
-- inserted if a round with the same tank + start_date doesn't already exist.
-- ============================================================================

WITH raw(tank_code, end_date, days_raw, start_given) AS (
  VALUES
    -- ATK1
    ('ATK1', DATE '2025-12-24', 8,    NULL::DATE),
    ('ATK1', DATE '2026-01-05', 7,    NULL::DATE),
    ('ATK1', DATE '2026-01-14', 7,    NULL::DATE),
    ('ATK1', DATE '2026-01-27', 9,    DATE '2026-01-17'),
    ('ATK1', DATE '2026-05-01', 9,    NULL::DATE),
    ('ATK1', DATE '2026-06-06', 6,    NULL::DATE),
    ('ATK1', DATE '2026-07-04', 7,    DATE '2026-06-21'),
    ('ATK1', NULL,              NULL, DATE '2026-07-08'),  -- still open

    -- ATK2
    ('ATK2', DATE '2025-12-26', 10,   NULL::DATE),
    ('ATK2', DATE '2026-01-17', 8,    NULL::DATE),
    ('ATK2', DATE '2026-01-29', 9,    DATE '2026-01-19'),
    ('ATK2', DATE '2026-05-01', 9,    NULL::DATE),
    ('ATK2', DATE '2026-06-21', 9,    NULL::DATE),
    ('ATK2', DATE '2026-06-25', 9,    NULL::DATE),
    ('ATK2', DATE '2026-07-13', 11,   NULL::DATE),

    -- ATK3
    ('ATK3', DATE '2025-12-24', 8,    NULL::DATE),
    ('ATK3', DATE '2026-01-05', 7,    NULL::DATE),
    ('ATK3', DATE '2026-01-17', 9,    NULL::DATE),
    -- source had an open-ended round (start 21/Jan/26, no clearing) here,
    -- superseded by the 1/May/26 round below with no recorded close date,
    -- dropped rather than guessed
    ('ATK3', DATE '2026-05-01', 9,    NULL::DATE),

    -- ATK4
    ('ATK4', DATE '2025-12-24', 8,    NULL::DATE),
    ('ATK4', DATE '2026-01-19', NULL, NULL::DATE),          -- days cell was "1" with no consistent pairing, rejected
    ('ATK4', DATE '2026-02-16', 22,   DATE '2026-01-25'),   -- sheet said days=8, but 25/Jan->16/Feb is 22 days; trusted the two dates over the digit
    ('ATK4', DATE '2026-05-01', 9,    NULL::DATE),

    -- BTK1
    ('BTK1', DATE '2026-01-01', NULL, NULL::DATE),          -- days cell was 46024 (Excel serial junk), rejected
    ('BTK1', DATE '2026-01-14', 7,    NULL::DATE),
    ('BTK1', DATE '2026-01-27', 9,    DATE '2026-01-17'),
    ('BTK1', DATE '2026-02-09', 10,   NULL::DATE),
    ('BTK1', DATE '2026-04-25', 8,    NULL::DATE),

    -- BTK2
    ('BTK2', DATE '2026-01-05', 19,   NULL::DATE),
    ('BTK2', DATE '2026-01-19', NULL, NULL::DATE),          -- days blank in source
    ('BTK2', DATE '2026-04-25', 8,    NULL::DATE),
    ('BTK2', DATE '2026-06-28', 13,   NULL::DATE),
    ('BTK2', DATE '2026-07-13', 11,   NULL::DATE),

    -- BTK3
    ('BTK3', DATE '2026-01-14', NULL, NULL::DATE),          -- days cell was 46037 (junk), rejected
    ('BTK3', DATE '2026-01-24', 6,    DATE '2026-01-17'),
    ('BTK3', DATE '2026-04-25', 8,    NULL::DATE),
    ('BTK3', DATE '2026-06-21', 10,   NULL::DATE),
    ('BTK3', DATE '2026-06-28', 13,   NULL::DATE),

    -- BTK4
    ('BTK4', DATE '2026-01-17', NULL, NULL::DATE),          -- days cell was 46040 (junk), rejected
    ('BTK4', DATE '2026-01-29', 9,    DATE '2026-01-19'),
    ('BTK4', DATE '2026-02-15', NULL, NULL::DATE),          -- days blank in source
    ('BTK4', DATE '2026-05-03', 11,   NULL::DATE),
    ('BTK4', DATE '2026-06-21', 10,   NULL::DATE),
    ('BTK4', DATE '2026-06-25', 10,   NULL::DATE),

    -- BTK5
    ('BTK5', DATE '2025-12-24', 8,    NULL::DATE),
    ('BTK5', DATE '2026-01-14', 9,    NULL::DATE),
    ('BTK5', DATE '2026-01-27', 9,    DATE '2026-01-17'),
    ('BTK5', DATE '2026-02-09', NULL, NULL::DATE),          -- days blank in source
    ('BTK5', DATE '2026-06-21', 10,   NULL::DATE),
    ('BTK5', DATE '2026-06-25', 10,   NULL::DATE),

    -- CTK1
    ('CTK1', DATE '2025-12-24', 8,    NULL::DATE),
    ('CTK1', DATE '2026-02-13', NULL, DATE '2026-01-24'),   -- days cell was -46045 (junk), rejected
    ('CTK1', DATE '2026-05-08', 14,   NULL::DATE),
    ('CTK1', DATE '2026-07-10', 8,    NULL::DATE),

    -- CTK2
    ('CTK2', DATE '2026-01-14', NULL, NULL::DATE),          -- days cell was 46037 (junk), rejected
    ('CTK2', DATE '2026-01-25', 7,    DATE '2026-01-17'),
    ('CTK2', DATE '2026-02-16', NULL, DATE '2026-01-27'),   -- days cell was -46048 (junk), rejected
    ('CTK2', DATE '2026-05-03', 10,   NULL::DATE),
    ('CTK2', DATE '2026-06-28', 12,   NULL::DATE),
    ('CTK2', DATE '2026-07-10', 8,    NULL::DATE),

    -- CTK3
    ('CTK3', DATE '2026-01-14', NULL, NULL::DATE),          -- days cell was 46037 (junk), rejected
    ('CTK3', DATE '2026-01-24', 6,    DATE '2026-01-17'),
    ('CTK3', DATE '2026-05-03', 10,   NULL::DATE),
    ('CTK3', DATE '2026-06-28', 12,   NULL::DATE),
    ('CTK3', DATE '2026-07-10', 8,    NULL::DATE),

    -- CTK4
    ('CTK4', DATE '2025-12-26', 10,   NULL::DATE),
    ('CTK4', DATE '2026-01-19', 10,   NULL::DATE),
    ('CTK4', DATE '2026-02-15', NULL, DATE '2026-01-25'),   -- days cell was -46046 (junk), rejected
    ('CTK4', DATE '2026-06-28', 12,   NULL::DATE),

    -- CTK5
    ('CTK5', DATE '2026-01-05', 19,   NULL::DATE),
    ('CTK5', DATE '2026-01-24', 6,    DATE '2026-01-17'),
    ('CTK5', DATE '2026-02-16', 11,   DATE '2026-01-27'),
    ('CTK5', DATE '2026-06-21', 9,    NULL::DATE),
    ('CTK5', DATE '2026-06-25', 9,    NULL::DATE),
    ('CTK5', DATE '2026-07-10', 8,    NULL::DATE),

    -- CTK6 (only one round visible across both snapshots)
    ('CTK6', DATE '2026-01-05', 15,   NULL::DATE)
),

-- Reject any days value outside a sane round length as a defensive net,
-- even though the corrupted cells above were already nulled by hand.
enriched AS (
  SELECT
    tank_code, end_date, start_given,
    CASE WHEN days_raw BETWEEN 1 AND 60 THEN days_raw ELSE NULL END AS days
  FROM raw
),

-- Per-tank average round length, from rounds where a duration can be
-- determined, used as the last-resort fallback.
tank_avg AS (
  SELECT tank_code, ROUND(AVG(COALESCE(days, end_date - start_given)))::INT AS avg_days
  FROM enriched
  WHERE end_date IS NOT NULL AND (days IS NOT NULL OR start_given IS NOT NULL)
  GROUP BY tank_code
),

resolved AS (
  SELECT
    e.tank_code,
    e.end_date,
    COALESCE(
      e.start_given,
      CASE WHEN e.end_date IS NOT NULL AND e.days IS NOT NULL THEN e.end_date - e.days END,
      CASE WHEN e.end_date IS NOT NULL THEN e.end_date - COALESCE(ta.avg_days, 9) END
    ) AS start_date,
    (e.start_given IS NULL AND e.days IS NULL AND e.end_date IS NOT NULL) AS is_fallback_estimate
  FROM enriched e
  LEFT JOIN tank_avg ta USING (tank_code)
  WHERE e.end_date IS NOT NULL OR e.start_given IS NOT NULL
),

-- Clamp each round's start to be no earlier than the same tank's previous
-- round's end, so chronologically adjacent backfilled rounds never overlap.
-- Flag it when the clamp actually moved the date, since that means the
-- source's recorded round length for this row couldn't be honoured as-is.
clamped AS (
  SELECT
    tank_code, end_date, is_fallback_estimate,
    start_date AS original_start_date,
    GREATEST(
      start_date,
      COALESCE(LAG(end_date) OVER (PARTITION BY tank_code ORDER BY start_date), start_date)
    ) AS start_date
  FROM resolved
),

numbered AS (
  SELECT
    tank_code, start_date, end_date, is_fallback_estimate,
    (start_date <> original_start_date) AS was_clamped,
    ROW_NUMBER() OVER (PARTITION BY tank_code ORDER BY start_date) AS round_number
  FROM clamped
)

INSERT INTO leaching_rounds (tank_id, round_number, start_date, end_date, status, notes)
SELECT
  t.id,
  n.round_number,
  n.start_date,
  n.end_date,
  CASE WHEN n.end_date IS NULL THEN 'open' ELSE 'closed' END,
  CASE
    WHEN n.is_fallback_estimate
      THEN 'Backfill: start date estimated from this tank''s average round length, source data was missing or corrupted for this round.'
    WHEN n.was_clamped
      THEN 'Backfill: start date pushed forward to avoid overlapping the previous round, source dates implied an earlier, overlapping start.'
    ELSE NULL
  END
FROM numbered n
JOIN tanks t ON t.tank_code = n.tank_code
WHERE NOT EXISTS (
  SELECT 1 FROM leaching_rounds lr WHERE lr.tank_id = t.id AND lr.start_date = n.start_date
);
