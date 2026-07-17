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
  /** Unique category key (ISO date) so gold river never collapses onto sales labels. */
  xKey: string
  /** Axis tick text — month short name on villages / month starts; '' elsewhere. */
  label: string
  /** Hover label (real bucket date) for decision-making along the gold river. */
  tooltipLabel: string
  /**
   * Sales "village": set only on sparse anchors (edge-pinned + interior months);
   * null on pure gold weeks so connectNulls draws month-to-month legs (not steps).
   */
  value: number | null
  /** Month sales total for tooltip when that month has sales; null if none. */
  salesTooltip: number | null
  /** Market gold TSh/g on every river sample (not only at sales villages). */
  goldRaw: number | null
}

function formatBucketLabel(date: string): string {
  const d = new Date(date + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Gold = continuous river (every market bucket in the window).
 * Sales = sparse villages (edge-pinned to range ends + one interior vertex/month).
 *
 * X is driven by unique gold dates, not sales month labels — so market price
 * stays visible between and outside sales points for decision-making.
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

  /* River: all unique gold buckets in the calendar window (not only sales dates). */
  const seenDates = new Set<string>()
  const inWindow = gold
    .filter(g => {
      const m = monthKeyFromDate(g.date)
      return m >= firstMonth && m <= lastMonth
    })
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter(g => {
      if (seenDates.has(g.date)) return false
      seenDates.add(g.date)
      return true
    })

  if (inWindow.length === 0) {
    return active.map(f => ({
      xKey: f.month,
      label: monthShort(f.month),
      tooltipLabel: monthShort(f.month),
      value: f.value,
      salesTooltip: f.value,
      goldRaw: null,
    }))
  }

  const n = inWindow.length
  const lastIdxByMonth = new Map<string, number>()
  const firstIdxByMonth = new Map<string, number>()
  inWindow.forEach((g, i) => {
    const m = monthKeyFromDate(g.date)
    lastIdxByMonth.set(m, i)
    if (!firstIdxByMonth.has(m)) firstIdxByMonth.set(m, i)
  })

  /* Villages: index → sales total.
     - Edge-pin first/last row so the sales line spans the full plot width.
     - Interior months with sales: one vertex at month-end (last gold week).
     - Months without sales: no village; gold still flows through. */
  const villageAt = new Map<number, number>()

  for (const [m, sales] of byMonth) {
    if (m === firstMonth || m === lastMonth) continue
    const idx = lastIdxByMonth.get(m)
    if (idx != null) villageAt.set(idx, sales)
  }

  const firstSales = byMonth.get(firstMonth)
  if (firstSales != null) villageAt.set(0, firstSales)

  const lastSales = byMonth.get(lastMonth)
  if (lastSales != null) villageAt.set(n - 1, lastSales)

  /* Axis labels: prefer village indices; otherwise first bucket of each month
     so the timeline stays readable along pure gold stretches. */
  const labelAt = new Set<number>()
  for (const idx of villageAt.keys()) labelAt.add(idx)
  for (const [m, idx] of firstIdxByMonth) {
    if (m >= firstMonth && m <= lastMonth) labelAt.add(idx)
  }

  let lastLabeledMonth = ''
  return inWindow.map((g, i) => {
    const m = monthKeyFromDate(g.date)
    const sales = byMonth.has(m) ? byMonth.get(m)! : null
    const village = villageAt.has(i) ? villageAt.get(i)! : null
    const showLabel = labelAt.has(i) && m !== lastLabeledMonth
    if (showLabel) lastLabeledMonth = m
    return {
      xKey: g.date,
      label: showLabel ? monthShort(m) : '',
      tooltipLabel: formatBucketLabel(g.date),
      value: village,
      salesTooltip: sales,
      goldRaw: g.price_tsh_g,
    }
  })
}
