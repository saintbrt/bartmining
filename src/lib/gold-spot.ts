import { GRAMS_PER_TROY_OZ } from '@/lib/goldpass/goldPrice'

/**
 * Public gold spot quote for the Swahili price pages.
 *
 * gold-api.com's spot endpoint and open.er-api.com both work without a key,
 * unlike the admin history route. Callers should set `revalidate` on the
 * page so the fetch is cached. Returns null on any failure so pages can
 * render without numbers instead of erroring.
 */

export type GoldQuote = {
  usdOz: number
  usdToTzs: number
  tzsGram: number
  updatedAt: string
}

export async function getGoldQuote(revalidateSeconds = 3600): Promise<GoldQuote | null> {
  try {
    const [goldRes, fxRes] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAU', { next: { revalidate: revalidateSeconds } }),
      fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: revalidateSeconds } }),
    ])
    if (!goldRes.ok || !fxRes.ok) return null
    const gold = await goldRes.json() as { price?: number; updatedAt?: string }
    const fx = await fxRes.json() as { rates?: { TZS?: number } }
    const usdOz = Number(gold.price)
    const usdToTzs = Number(fx.rates?.TZS)
    if (!(usdOz > 0) || !(usdToTzs > 0)) return null
    return {
      usdOz,
      usdToTzs,
      tzsGram: (usdOz * usdToTzs) / GRAMS_PER_TROY_OZ,
      updatedAt: gold.updatedAt ?? new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export const formatTzs = (n: number) => `TSh ${Math.round(n).toLocaleString('en-US')}`

export const formatSwDateTime = (iso: string) =>
  new Date(iso).toLocaleString('sw-TZ', { timeZone: 'Africa/Dar_es_Salaam', dateStyle: 'long', timeStyle: 'short' })

/** Mining Commission indicative prices, quoted as a dated example. */
export const INDICATIVE_EXAMPLE = {
  date: '5 Septemba 2026',
  market: 341008,
  buyingCentre: 333430,
}
