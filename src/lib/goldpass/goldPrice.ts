/* Market gold helpers for the dashboard overlay.
   Drawing uses a proportional band (not dual-axis); tooltips use real TSh.
   Gold uses weekly (TV-leaning density); sales stays sparse monthly vertices. */

export type GoldPricePoint = {
  /** ISO calendar date for the bucket start (week/day/month), YYYY-MM-DD */
  date: string
  price_usd_oz: number
  price_tsh_oz: number
  price_tsh_g: number
}

/** @deprecated alias */
export type GoldMonthPrice = GoldPricePoint & { month?: string }

/** Troy ounce → grams (industry standard). */
export const GRAMS_PER_TROY_OZ = 31.1034768

/**
 * Map gold into a visual band inside the primary domain so both series share
 * one Y-axis without 1:1 unit confusion. Band: 15%–85% of primary min–max.
 * `primary` is only used for domain (e.g. monthly sales); length need not match
 * `secondary` (e.g. weekly gold).
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

export function monthKeyFromDate(date: string): string {
  return date.slice(0, 7)
}

function monthShort(month: string): string {
  return new Date(month + '-01T00:00:00').toLocaleDateString(undefined, { month: 'short' })
}

export type DenseHeroRow = {
  /** X tick label — month short name only on the sales vertex for that month */
  label: string
  /**
   * Sales/revenue vertex: set on ONE bucket per month only; null elsewhere
   * so Recharts linear+connectNulls draws month-to-month legs (not steps).
   */
  value: number | null
  /** Always the month's sales total for tooltip (even on gold-only weeks). */
  salesTooltip: number
  goldRaw: number | null
}

/**
 * Weekly (or denser) gold path + sparse monthly sales vertices.
 * Does NOT repeat sales on every bucket (that created the broken step chart).
 */
export function buildGoldDenseSeries(
  financials: { month: string; value: number }[],
  gold: GoldPricePoint[],
  rangeMonths: number,
): DenseHeroRow[] {
  if (financials.length === 0) return []

  const windowStart = Math.max(0, financials.length - rangeMonths)
  const active = financials.slice(windowStart)
  const byMonth = new Map(active.map(f => [f.month, f.value]))
  const firstMonth = active[0].month
  const lastMonth = active[active.length - 1].month

  const inWindow = gold
    .filter(g => {
      const m = monthKeyFromDate(g.date)
      return m >= firstMonth && m <= lastMonth
    })
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))

  if (inWindow.length === 0) {
    return active.map(f => ({
      label: monthShort(f.month),
      value: f.value,
      salesTooltip: f.value,
      goldRaw: null,
    }))
  }

  /* Last bucket index per month → sales vertex (month-end-ish). */
  const lastIdxByMonth = new Map<string, number>()
  inWindow.forEach((g, i) => {
    lastIdxByMonth.set(monthKeyFromDate(g.date), i)
  })
  const salesVertex = new Set(lastIdxByMonth.values())

  let lastLabeledMonth = ''
  return inWindow.map((g, i) => {
    const m = monthKeyFromDate(g.date)
    const sales = byMonth.get(m) ?? 0
    const isVertex = salesVertex.has(i)
    /* Label once per month on the sales vertex so X-axis stays readable. */
    const showLabel = isVertex && m !== lastLabeledMonth
    if (showLabel) lastLabeledMonth = m
    return {
      label: showLabel ? monthShort(m) : '',
      value: isVertex ? sales : null,
      salesTooltip: sales,
      goldRaw: g.price_tsh_g,
    }
  })
}
