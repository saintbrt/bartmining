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
  /** Axis tick text — month short / sale day; '' elsewhere. */
  label: string
  /** Hover label (real bucket or sale date) for decision-making along the gold river. */
  tooltipLabel: string
  /**
   * Sales "village": real sale_date anchors (or monthly fallback);
   * null on pure gold weeks so connectNulls draws legs between villages (not steps).
   */
  value: number | null
  /** Sale amount at this village (or month total for fallback); null if no sale here. */
  salesTooltip: number | null
  /** Market gold TSh/g on every river sample (not only at sales villages). */
  goldRaw: number | null
}

/** One recorded sale for chart villages — use real `sale_date`, not month rollups. */
export type SaleEvent = {
  /** ISO date YYYY-MM-DD from sales.sale_date */
  saleDate: string
  /** price_tsh (or other metric value for that sale) */
  value: number
}

function formatBucketLabel(date: string): string {
  const d = new Date(date + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function isoDate(raw: string): string {
  const s = String(raw).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const t = Date.parse(s)
  if (!Number.isFinite(t)) return s.slice(0, 10)
  return new Date(t).toISOString().slice(0, 10)
}

/** Nearest gold-river index for a calendar day (sale_date → market bucket). */
function nearestGoldIndex(goldDates: string[], saleDate: string): number {
  const target = Date.parse(saleDate + 'T00:00:00')
  if (!Number.isFinite(target) || goldDates.length === 0) return 0
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < goldDates.length; i++) {
    const t = Date.parse(goldDates[i] + 'T00:00:00')
    const dist = Math.abs(t - target)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return best
}

/**
 * Gold = continuous river (every market bucket in the window).
 * Sales villages = real `sale_date` events from the sales register (preferred).
 * Fallback = monthly financial rollups only when no sale events are passed.
 */
export function buildGoldDenseSeries(
  financials: { month: string; value: number }[],
  gold: GoldPricePoint[],
  rangeMonths: number,
  saleEvents?: SaleEvent[],
): DenseHeroRow[] {
  if (financials.length === 0 && (!saleEvents || saleEvents.length === 0)) return []

  const windowStart = Math.max(0, financials.length - rangeMonths)
  const active = financials.slice(windowStart)
  const byMonth = new Map(active.map(f => [f.month, f.value]))

  /* Calendar window: prefer financial months; else from sale_date span. */
  let firstMonth: string
  let lastMonth: string
  if (active.length > 0) {
    firstMonth = active[0].month
    lastMonth = active[active.length - 1].month
  } else {
    const dates = saleEvents!.map(s => isoDate(s.saleDate)).sort()
    firstMonth = monthKeyFromDate(dates[0])
    lastMonth = monthKeyFromDate(dates[dates.length - 1])
  }

  /* River: all unique gold buckets in the calendar window. */
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
    /* No gold: plot sale_date events if present, else monthly rollups. */
    if (saleEvents && saleEvents.length > 0) {
      const byDay = new Map<string, number>()
      for (const s of saleEvents) {
        const d = isoDate(s.saleDate)
        if (monthKeyFromDate(d) < firstMonth || monthKeyFromDate(d) > lastMonth) continue
        byDay.set(d, (byDay.get(d) ?? 0) + s.value)
      }
      return [...byDay.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([d, v]) => ({
          xKey: d,
          label: formatBucketLabel(d),
          tooltipLabel: formatBucketLabel(d),
          value: v,
          salesTooltip: v,
          goldRaw: null,
        }))
    }
    return active.map(f => ({
      xKey: f.month,
      label: monthShort(f.month),
      tooltipLabel: monthShort(f.month),
      value: f.value,
      salesTooltip: f.value,
      goldRaw: null,
    }))
  }

  const goldDates = inWindow.map(g => g.date)
  const firstIdxByMonth = new Map<string, number>()
  inWindow.forEach((g, i) => {
    const m = monthKeyFromDate(g.date)
    if (!firstIdxByMonth.has(m)) firstIdxByMonth.set(m, i)
  })

  /* Villages from real sale_date (sum same-day sales → one village). */
  const villageAt = new Map<number, number>()
  const useSaleDates = !!(saleEvents && saleEvents.length > 0)

  if (useSaleDates) {
    const byDay = new Map<string, number>()
    for (const s of saleEvents!) {
      if (!Number.isFinite(s.value)) continue
      const d = isoDate(s.saleDate)
      const m = monthKeyFromDate(d)
      if (m < firstMonth || m > lastMonth) continue
      byDay.set(d, (byDay.get(d) ?? 0) + s.value)
    }
    for (const [d, total] of byDay) {
      const idx = nearestGoldIndex(goldDates, d)
      villageAt.set(idx, (villageAt.get(idx) ?? 0) + total)
    }
  } else {
    /* Fallback only: monthly totals at month-end gold week (no sale_date available). */
    const lastIdxByMonth = new Map<string, number>()
    inWindow.forEach((g, i) => {
      lastIdxByMonth.set(monthKeyFromDate(g.date), i)
    })
    for (const [m, sales] of byMonth) {
      const idx = lastIdxByMonth.get(m)
      if (idx != null) villageAt.set(idx, sales)
    }
  }

  const labelAt = new Set<number>(villageAt.keys())
  for (const [m, idx] of firstIdxByMonth) {
    if (m >= firstMonth && m <= lastMonth) labelAt.add(idx)
  }

  let lastLabeledMonth = ''
  return inWindow.map((g, i) => {
    const m = monthKeyFromDate(g.date)
    const village = villageAt.has(i) ? villageAt.get(i)! : null
    /* Tooltip: village amount when on a sale; else monthly context only in fallback mode. */
    const salesTip = village != null
      ? village
      : (!useSaleDates && byMonth.has(m) ? byMonth.get(m)! : null)
    const showLabel = labelAt.has(i) && (village != null || m !== lastLabeledMonth)
    if (showLabel && m !== lastLabeledMonth) lastLabeledMonth = m
    return {
      xKey: g.date,
      label: showLabel
        ? (village != null && useSaleDates ? formatBucketLabel(g.date) : monthShort(m))
        : '',
      tooltipLabel: formatBucketLabel(g.date),
      value: village,
      salesTooltip: salesTip,
      goldRaw: g.price_tsh_g,
    }
  })
}
