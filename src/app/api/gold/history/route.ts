import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/goldpass/supabase/server'
import { GRAMS_PER_TROY_OZ, type GoldMonthPrice } from '@/lib/goldpass/goldPrice'

/* Monthly market gold (XAU) for the dashboard overlay.
   - Key stays server-side (GOLD_API_KEY).
   - Free gold-api.com history tier is 10 req/hour → long cache is mandatory.
   - Prices converted to TSh via USD/TZS so tooltips match company currency. */

const GOLD_API = 'https://api.gold-api.com'
const FX_URLS = [
  'https://open.er-api.com/v6/latest/USD',
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
]
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours (monthly averages; spare the free tier)
/** Last-resort USD→TZS if every FX feed fails (approx; better than blank overlay). */
const FALLBACK_USD_TO_TZS = 2600

type CacheEntry = {
  expires: number
  months: GoldMonthPrice[]
  usdToTzs: number
  asOf: string
}

// Module-scope cache survives across warm serverless invocations in the same isolate.
const cache = new Map<string, CacheEntry>()
let stale: CacheEntry | null = null

function clampMonths(raw: string | null): number {
  const n = Number(raw ?? 12)
  if (!Number.isFinite(n)) return 12
  return Math.min(24, Math.max(1, Math.round(n)))
}

/** First day of the month `months` ago (UTC), as unix seconds. */
function startOfWindow(months: number): number {
  const d = new Date()
  d.setUTCDate(1)
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCMonth(d.getUTCMonth() - (months - 1))
  return Math.floor(d.getTime() / 1000)
}

async function fetchUsdToTzs(): Promise<number> {
  for (const url of FX_URLS) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) continue
      const body = await res.json() as {
        rates?: { TZS?: number; tzs?: number }
        usd?: { tzs?: number }
      }
      const rate = body.rates?.TZS ?? body.rates?.tzs ?? body.usd?.tzs
      if (rate && Number.isFinite(rate) && rate > 0) return rate
    } catch {
      // try next feed
    }
  }
  console.warn('[gold/history] FX feeds failed; using fallback USD→TZS', FALLBACK_USD_TO_TZS)
  return FALLBACK_USD_TO_TZS
}

type HistoryRow = { year_month?: string; month?: string; avg_price?: string | number }

async function fetchGoldHistory(months: number, apiKey: string): Promise<{ month: string; price_usd_oz: number }[]> {
  const startTimestamp = startOfWindow(months)
  const endTimestamp = Math.floor(Date.now() / 1000)
  const url = new URL(`${GOLD_API}/history`)
  url.searchParams.set('symbol', 'XAU')
  url.searchParams.set('startTimestamp', String(startTimestamp))
  url.searchParams.set('endTimestamp', String(endTimestamp))
  url.searchParams.set('groupBy', 'month')
  url.searchParams.set('aggregation', 'avg')
  url.searchParams.set('orderBy', 'asc')

  const res = await fetch(url.toString(), {
    headers: { 'x-api-key': apiKey },
    // Bypass Next fetch cache; we own TTL ourselves.
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`gold-api history ${res.status}: ${text.slice(0, 200)}`)
  }
  const rows = await res.json() as HistoryRow[]
  if (!Array.isArray(rows)) throw new Error('gold-api history: unexpected body')

  return rows.map(r => {
    const month = String(r.year_month ?? r.month ?? '').slice(0, 7)
    const price = Number(r.avg_price)
    return { month, price_usd_oz: price }
  }).filter(r => /^\d{4}-\d{2}$/.test(r.month) && Number.isFinite(r.price_usd_oz))
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const months = clampMonths(req.nextUrl.searchParams.get('months'))
    const cacheKey = `m${months}`
    const hit = cache.get(cacheKey)
    if (hit && hit.expires > Date.now()) {
      return NextResponse.json({
        months: hit.months,
        usd_to_tzs: hit.usdToTzs,
        asOf: hit.asOf,
        cached: true,
      })
    }

    const apiKey = process.env.GOLD_API_KEY
    if (!apiKey) {
      if (stale) {
        return NextResponse.json({
          months: stale.months,
          usd_to_tzs: stale.usdToTzs,
          asOf: stale.asOf,
          cached: true,
          stale: true,
        })
      }
      return NextResponse.json({ error: 'GOLD_API_KEY is not configured' }, { status: 503 })
    }

    try {
      const [history, usdToTzs] = await Promise.all([
        fetchGoldHistory(months, apiKey),
        fetchUsdToTzs(),
      ])

      const converted: GoldMonthPrice[] = history.map(h => {
        const price_tsh_oz = h.price_usd_oz * usdToTzs
        const price_tsh_g = price_tsh_oz / GRAMS_PER_TROY_OZ
        return {
          month: h.month,
          price_usd_oz: h.price_usd_oz,
          price_tsh_oz,
          price_tsh_g,
        }
      })

      const entry: CacheEntry = {
        expires: Date.now() + CACHE_TTL_MS,
        months: converted,
        usdToTzs,
        asOf: new Date().toISOString(),
      }
      cache.set(cacheKey, entry)
      stale = entry

      return NextResponse.json({
        months: converted,
        usd_to_tzs: usdToTzs,
        asOf: entry.asOf,
        cached: false,
      })
    } catch (upstream) {
      console.error('[gold/history] upstream failed:', upstream)
      if (stale) {
        return NextResponse.json({
          months: stale.months,
          usd_to_tzs: stale.usdToTzs,
          asOf: stale.asOf,
          cached: true,
          stale: true,
        })
      }
      return NextResponse.json(
        { error: upstream instanceof Error ? upstream.message : 'Gold price unavailable' },
        { status: 502 },
      )
    }
  } catch (err) {
    console.error('[gold/history]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
