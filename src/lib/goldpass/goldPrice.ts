/* Market gold helpers for the dashboard overlay.
   Drawing uses a proportional band (not dual-axis); tooltips use real TSh.
   History is weekly (or daily for short windows) so the line tracks real
   market moves instead of a near-linear monthly average. */

export type GoldPricePoint = {
  /** ISO calendar date for the bucket start (week or day), YYYY-MM-DD */
  date: string
  price_usd_oz: number
  price_tsh_oz: number
  price_tsh_g: number
}

/** @deprecated alias kept for older call sites; same shape as a monthly rollup */
export type GoldMonthPrice = GoldPricePoint & { month?: string }

/** Troy ounce → grams (industry standard). */
export const GRAMS_PER_TROY_OZ = 31.1034768

/**
 * Map gold (or any secondary series) into a visual band inside the primary
 * domain so both series share one Y-axis without 1:1 unit confusion.
 * Band defaults to 15%–85% of the primary min–max range.
 */
export function scaleToPrimaryBand(
  primary: number[],
  secondary: (number | null)[],
  bandLoFrac = 0.15,
  bandHiFrac = 0.85,
): (number | null)[] {
  if (primary.length === 0) return secondary.map(() => null)

  let pMin = Infinity
  let pMax = -Infinity
  for (const v of primary) {
    if (!Number.isFinite(v)) continue
    if (v < pMin) pMin = v
    if (v > pMax) pMax = v
  }
  if (!Number.isFinite(pMin) || !Number.isFinite(pMax)) {
    return secondary.map(() => null)
  }

  const pRange = pMax - pMin
  const span = pRange > 0 ? pRange : Math.max(Math.abs(pMax), 1)
  const bandLo = pMin + bandLoFrac * span
  const bandHi = pMin + bandHiFrac * span
  const mid = (bandLo + bandHi) / 2

  const nums = secondary.filter((v): v is number => v != null && Number.isFinite(v))
  if (nums.length === 0) return secondary.map(() => null)

  let gMin = Infinity
  let gMax = -Infinity
  for (const v of nums) {
    if (v < gMin) gMin = v
    if (v > gMax) gMax = v
  }
  const gRange = gMax - gMin

  return secondary.map(v => {
    if (v == null || !Number.isFinite(v)) return null
    if (gRange < 1e-9) return mid
    const n = (v - gMin) / gRange
    return bandLo + n * (bandHi - bandLo)
  })
}

/** YYYY-MM from a date string or Date. */
export function monthKeyFromDate(date: string): string {
  return date.slice(0, 7)
}

/**
 * Build denser chart rows for the hero: one point per gold bucket (week/day).
 * Primary metric is held as a step (same month total across that month's
 * buckets) so sales stay monthly while gold shows real path.
 */
export function buildDenseHeroSeries(
  financials: { month: string; value: number }[],
  gold: GoldPricePoint[],
  rangeMonths: number,
): {
  label: string
  value: number
  goldRaw: number | null
  tick: boolean
}[] {
  if (financials.length === 0) return []

  const windowStart = Math.max(0, financials.length - rangeMonths)
  const active = financials.slice(windowStart)
  const byMonth = new Map(active.map(f => [f.month, f.value]))
  const firstMonth = active[0].month
  const lastMonth = active[active.length - 1].month

  const inWindow = gold.filter(g => {
    const m = monthKeyFromDate(g.date)
    return m >= firstMonth && m <= lastMonth
  })

  /* Fallback: no gold points → monthly-only chart (same as before). */
  if (inWindow.length === 0) {
    return active.map(f => ({
      label: monthShort(f.month),
      value: f.value,
      goldRaw: null,
      tick: true,
    }))
  }

  let lastMonthSeen = ''
  return inWindow.map(g => {
    const m = monthKeyFromDate(g.date)
    const isNewMonth = m !== lastMonthSeen
    lastMonthSeen = m
    return {
      label: isNewMonth ? monthShort(m) : '',
      value: byMonth.get(m) ?? 0,
      goldRaw: g.price_tsh_g,
      tick: isNewMonth,
    }
  })
}

function monthShort(month: string): string {
  return new Date(month + '-01T00:00:00').toLocaleDateString(undefined, { month: 'short' })
}
