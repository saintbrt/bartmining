/* Market gold helpers for the dashboard overlay.
   Drawing uses a proportional band (not dual-axis); tooltips use real TSh. */

export type GoldMonthPrice = {
  month: string          // 'YYYY-MM'
  price_usd_oz: number
  price_tsh_oz: number
  price_tsh_g: number
}

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

/** Align gold months onto financial month keys; missing months → null. */
export function alignGoldToMonths(
  months: string[],
  gold: GoldMonthPrice[],
  field: keyof Pick<GoldMonthPrice, 'price_tsh_g' | 'price_tsh_oz' | 'price_usd_oz'> = 'price_tsh_g',
): (number | null)[] {
  const byMonth = new Map(gold.map(g => [g.month, g[field]]))
  return months.map(m => {
    const v = byMonth.get(m)
    return v != null && Number.isFinite(v) ? v : null
  })
}
