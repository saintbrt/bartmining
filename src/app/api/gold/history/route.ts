import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/goldpass/supabase/server'
import { GRAMS_PER_TROY_OZ, type GoldPricePoint } from '@/lib/goldpass/goldPrice'

/* Market gold (XAU) for the dashboard overlay.
   - Key stays server-side (GOLD_API_KEY).
   - Free gold-api.com history tier is 10 req/hour → long cache is mandatory.
   - Weekly (or daily for short windows) so the line is not a flat monthly average.
   - Prices converted to TSh via USD/TZS so tooltips match company currency. */

const GOLD_API = 'https://api.gold-api.com'
const FX_URLS = [
  'https://open.er-api.com/v6/latest/USD',
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
]
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours
/** Last-resort USD→TZS if every FX feed fails (approx; better than blank overlay). */
const FALLBACK_USD_TO_TZS = 2600

type CacheEntry = {
  expires: number
  points: GoldPricePoint[]
  /** Monthly rollup (avg of weekly/daily buckets) for callers that still want months. */
  months: GoldPricePoint[]
  usdToTzs: number
  asOf: string
  groupBy: 'week' | 'day'
}

const cache = new Map<string, CacheEntry>()
let stale: CacheEntry | null = null

function clampMonths(raw: string | null): number {
  const n = Number(raw ?? 12)
  if (!Number.isFinite(n)) return 12
  return Math.min(24, Math.max(1, Math.round(n)))
}

/** Day for ≤3M (more realistic short-window path); week for longer ranges. */
function pickGroupBy(months: number): 'week' | 'day' {
  return months <= 3 ? 'day' : 'week'
}

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

type HistoryRow = {
  year_month?: string
  month?: string
  week?: string
  day?: string
  avg_price?: string | number
}

function parseBucketDate(r: HistoryRow): string | null {
  const raw = r.day ?? r.week ?? r.year_month ?? r.month
  if (!raw) return null
  // API returns "2026-01-12 00:00:00" or "2026-01"
  const iso = String(raw).trim().replace(' ', 'T').slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso
  if (/^\d{4}-\d{2}$/.test(iso)) return `${iso}-01`
  return null
}

async function fetchGoldHistory(
  months: number,
  groupBy: 'week' | 'day',
  apiKey: string,
): Promise<{ date: string; price_usd_oz: number }[]> {
  const startTimestamp = startOfWindow(months)
  const endTimestamp = Math.floor(Date.now() / 1000)
  const url = new URL(`${GOLD_API}/history`)
  url.searchParams.set('symbol', 'XAU')
  url.searchParams.set('startTimestamp', String(startTimestamp))
  url.searchParams.set('endTimestamp', String(endTimestamp))
  url.searchParams.set('groupBy', groupBy)
  url.searchParams.set('aggregation', 'avg')
  url.searchParams.set('orderBy', 'asc')

  const res = await fetch(url.toString(), {
    headers: { 'x-api-key': apiKey },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`gold-api history ${res.status}: ${text.slice(0, 200)}`)
  }
  const rows = await res.json() as HistoryRow[]
  if (!Array.isArray(rows)) throw new Error('gold-api history: unexpected body')

  return rows.map(r => {
    const date = parseBucketDate(r)
    const price = Number(r.avg_price)
    return date && Number.isFinite(price) ? { date, price_usd_oz: price } : null
  }).filter((r): r is { date: string; price_usd_oz: number } => r != null)
}

/** Average weekly/daily points into YYYY-MM monthly rollups. */
function rollupMonths(points: GoldPricePoint[]): GoldPricePoint[] {
  const buckets = new Map<string, GoldPricePoint[]>()
  for (const p of points) {
    const m = p.date.slice(0, 7)
    const arr = buckets.get(m) ?? []
    arr.push(p)
    buckets.set(m, arr)
  }
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, rows]) => {
      const n = rows.length
      const price_usd_oz = rows.reduce((s, r) => s + r.price_usd_oz, 0) / n
      const price_tsh_oz = rows.reduce((s, r) => s + r.price_tsh_oz, 0) / n
      const price_tsh_g = rows.reduce((s, r) => s + r.price_tsh_g, 0) / n
      return { date: `${month}-01`, price_usd_oz, price_tsh_oz, price_tsh_g }
    })
}

async function requireAdminUser(req: NextRequest) {
  const supabase = await createClient()
  const auth = req.headers.get('authorization')
  const bearer = auth?.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : null
  if (bearer) {
    const { data: { user }, error } = await supabase.auth.getUser(bearer)
    if (user && !error) return user
  }
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAdminUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Sign in again' }, { status: 401 })
    }

    const months = clampMonths(req.nextUrl.searchParams.get('months'))
    const groupBy = pickGroupBy(months)
    const cacheKey = `m${months}:${groupBy}`
    const hit = cache.get(cacheKey)
    if (hit && hit.expires > Date.now()) {
      return NextResponse.json({
        points: hit.points,
        months: hit.months,
        groupBy: hit.groupBy,
        usd_to_tzs: hit.usdToTzs,
        asOf: hit.asOf,
        cached: true,
      })
    }

    const apiKey = process.env.GOLD_API_KEY
    if (!apiKey) {
      if (stale) {
        return NextResponse.json({
          points: stale.points,
          months: stale.months,
          groupBy: stale.groupBy,
          usd_to_tzs: stale.usdToTzs,
          asOf: stale.asOf,
          cached: true,
          stale: true,
        })
      }
      return NextResponse.json({
        error: 'GOLD_API_KEY is not configured on the server (set it in Vercel env, not GitHub)',
      }, { status: 503 })
    }

    try {
      const [history, usdToTzs] = await Promise.all([
        fetchGoldHistory(months, groupBy, apiKey),
        fetchUsdToTzs(),
      ])

      const points: GoldPricePoint[] = history.map(h => {
        const price_tsh_oz = h.price_usd_oz * usdToTzs
        return {
          date: h.date,
          price_usd_oz: h.price_usd_oz,
          price_tsh_oz,
          price_tsh_g: price_tsh_oz / GRAMS_PER_TROY_OZ,
        }
      })

      const monthsRollup = rollupMonths(points)

      const entry: CacheEntry = {
        expires: Date.now() + CACHE_TTL_MS,
        points,
        months: monthsRollup,
        usdToTzs,
        asOf: new Date().toISOString(),
        groupBy,
      }
      cache.set(cacheKey, entry)
      stale = entry

      return NextResponse.json({
        points,
        months: monthsRollup,
        groupBy,
        usd_to_tzs: usdToTzs,
        asOf: entry.asOf,
        cached: false,
      })
    } catch (upstream) {
      console.error('[gold/history] upstream failed:', upstream)
      if (stale) {
        return NextResponse.json({
          points: stale.points,
          months: stale.months,
          groupBy: stale.groupBy,
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
