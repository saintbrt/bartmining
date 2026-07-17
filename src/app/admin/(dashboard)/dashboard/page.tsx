'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getOperationsKpis, getFinancialSummary, projectNextMonthProfit,
  getTanks, getLatestTankColors, getTankRoundStatus, getPits, getPitMachinery,
  getExpansionSignal, getRoundFaultFlags,
  type OperationsKpis, type FinancialSummaryRow, type TankRow, type TankLatestColor,
  type TankRoundStatusRow, type PitRow, type PitMachineryRow, type ExpansionSignalRow, type RoundFaultFlagRow,
} from '@/lib/goldpass/erp'
import { LineTrendChart, MetricStrip, GOLD_OVERLAY, type MetricStripItem, type ChartGoldOverlay } from '@/components/goldpass/charts'
import { alignGoldToMonths, scaleToPrimaryBand, type GoldPricePoint } from '@/lib/goldpass/goldPrice'

function monthLabel(month: string): string {
  // month is 'YYYY-MM' from the RPC; anchor to day 01 for a stable short label.
  return new Date(month + '-01T00:00:00').toLocaleDateString(undefined, { month: 'short' })
}

function pctDelta(series: number[]): number | undefined {
  if (series.length < 2) return undefined
  const last = series[series.length - 1], prev = series[series.length - 2]
  if (prev === 0) return undefined
  return ((last - prev) / Math.abs(prev)) * 100
}

function compactTsh(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e9) return 'TSh ' + (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
  if (abs >= 1e6) return 'TSh ' + (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (abs >= 1e3) return 'TSh ' + (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
  return 'TSh ' + Math.round(n).toLocaleString()
}

const RANGES = [{ id: 3, label: '3M' }, { id: 6, label: '6M' }, { id: 12, label: '12M' }] as const

const METRIC_LABELS: Record<string, string> = {
  revenue: 'Sales',
  cost: 'Cost',
  profit: 'Profit',
  projected: 'Profit',
}

export default function DashboardPage() {
  const router = useRouter()
  const [opsKpis, setOpsKpis] = useState<OperationsKpis | null>(null)
  const [opsFinancials, setOpsFinancials] = useState<FinancialSummaryRow[]>([])
  const [activeMetric, setActiveMetric] = useState('revenue')
  const [rangeMonths, setRangeMonths] = useState<number>(6)
  const [goldOn, setGoldOn] = useState(true)
  const [goldPoints, setGoldPoints] = useState<GoldPricePoint[]>([])
  const [goldError, setGoldError] = useState<string | null>(null)

  const [tanks, setTanks] = useState<TankRow[]>([])
  const [tankColors, setTankColors] = useState<Record<string, TankLatestColor>>({})
  const [roundStatus, setRoundStatus] = useState<TankRoundStatusRow[]>([])
  const [pits, setPits] = useState<PitRow[]>([])
  const [pitMachinery, setPitMachinery] = useState<PitMachineryRow[]>([])

  const [expansionSignal, setExpansionSignal] = useState<ExpansionSignalRow | null>(null)
  const [faultFlags, setFaultFlags] = useState<RoundFaultFlagRow[]>([])

  useEffect(() => {
    let alive = true
    Promise.all([
      getOperationsKpis(), getFinancialSummary(12),
      getTanks(), getLatestTankColors(), getTankRoundStatus(), getPits(), getPitMachinery(),
      getExpansionSignal(), getRoundFaultFlags(),
    ]).then(([k, f, tk, tc, rs, pt, pm, es, ff]) => {
      if (!alive) return
      setOpsKpis(k); setOpsFinancials(f)
      setTanks(tk); setTankColors(tc); setRoundStatus(rs); setPits(pt); setPitMachinery(pm)
      setExpansionSignal(es); setFaultFlags(ff)
    })
    return () => { alive = false }
  }, [])

  /* Fetch 12 months of market gold once; slice client-side for 3M/6M/12M.
     Server caches heavily (free tier is 10 req/hour). Send the browser
     session access token so the API route can auth without relying only on
     cookies (admin UI restores session via the Supabase browser client). */
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const { createClient } = await import('@/lib/goldpass/supabase/client')
        const { data: { session } } = await createClient().auth.getSession()
        const headers: HeadersInit = {}
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`
        }
        /* Monthly rollup for overlay (sales axis stays one point per month). */
        const res = await fetch('/api/gold/history?months=12', {
          headers,
          credentials: 'same-origin',
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({})) as { error?: string }
          throw new Error(body.error || `Gold history ${res.status}`)
        }
        const body = await res.json() as { points?: GoldPricePoint[]; months?: GoldPricePoint[] }
        if (!alive) return
        /* Prefer monthly series so gold aligns 1:1 with sales months. */
        setGoldPoints(body.months?.length ? body.months : (body.points ?? []))
        setGoldError(null)
      } catch (err) {
        if (!alive) return
        setGoldPoints([])
        setGoldError(err instanceof Error ? err.message : 'Gold price unavailable')
      }
    })()
    return () => { alive = false }
  }, [])

  const current = opsFinancials[opsFinancials.length - 1]
  const revSeries = opsFinancials.map(f => f.revenue_tsh)
  const costSeries = opsFinancials.map(f => f.cost_tsh)
  const profitSeries = opsFinancials.map(f => f.profit_tsh)
  const projectedProfit = opsFinancials.length > 0 ? projectNextMonthProfit(opsFinancials) : 0

  const metricField: Record<string, (f: FinancialSummaryRow) => number> = {
    revenue: f => f.revenue_tsh, cost: f => f.cost_tsh, profit: f => f.profit_tsh, projected: f => f.profit_tsh,
  }
  const pick = metricField[activeMetric] ?? metricField.revenue

  const valueName = METRIC_LABELS[activeMetric] ?? 'Sales'

  /* Sales/revenue/cost/profit: one point per month — unchanged from pre-gold chart. */
  const windowStart = Math.max(0, opsFinancials.length - rangeMonths)
  const activeRows = opsFinancials.slice(windowStart)
  const heroData = activeRows.map(f => ({ label: monthLabel(f.month), value: pick(f) }))

  const goldOverlay: ChartGoldOverlay | null = useMemo(() => {
    if (!goldOn || goldPoints.length === 0 || opsFinancials.length === 0) return null
    const start = Math.max(0, opsFinancials.length - rangeMonths)
    const rows = opsFinancials.slice(start)
    if (rows.length === 0) return null
    const field = metricField[activeMetric] ?? metricField.revenue
    const raw = alignGoldToMonths(rows.map(r => r.month), goldPoints, 'price_tsh_g')
    if (!raw.some(v => v != null)) return null
    const primary = rows.map(field)
    const scaled = scaleToPrimaryBand(primary, raw)
    return {
      values: scaled,
      rawValues: raw,
      name: 'Gold',
      color: GOLD_OVERLAY,
      strokeOpacity: 0.42,
    }
  }, [goldOn, goldPoints, opsFinancials, rangeMonths, activeMetric])

  const heroMetrics: MetricStripItem[] = [
    { key: 'revenue', label: 'Revenue (this month)', value: compactTsh(current?.revenue_tsh ?? 0), delta: pctDelta(revSeries), goodWhenUp: true },
    { key: 'cost', label: 'Cost (this month)', value: compactTsh(current?.cost_tsh ?? 0), delta: pctDelta(costSeries), goodWhenUp: false },
    { key: 'profit', label: 'Profit (this month)', value: compactTsh(current?.profit_tsh ?? 0), delta: pctDelta(profitSeries), goodWhenUp: true },
    { key: 'projected', label: 'Projected profit (next month)', value: compactTsh(projectedProfit) },
  ]

  const clearCount = tanks.filter(t => tankColors[t.id]?.result === 'clear').length
  const greyCount = tanks.filter(t => tankColors[t.id]?.result === 'grey').length
  const blackCount = tanks.filter(t => tankColors[t.id]?.result === 'black').length
  const openRoundCount = roundStatus.filter(r => r.round_id).length

  const machineryCount = pitMachinery.length

  const overdueFault = faultFlags.length > 0
    ? faultFlags.reduce((worst, f) => f.days_open > worst.days_open ? f : worst, faultFlags[0])
    : null

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 20 }}>
        <h2 className="page-title">Dashboard</h2>
        <p className="page-sub">Operations and financial overview at a glance.</p>
      </div>

      {overdueFault && (
        <div className="card card-link" style={{ marginBottom: 20, borderColor: 'var(--orange)' }}
          onClick={() => router.push('/admin/plant')}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--orange)' }}>Round taking too long</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>
            {overdueFault.tank_code} round {overdueFault.round_number} (started {overdueFault.start_date}) has run{' '}
            {overdueFault.days_open} days, past the {overdueFault.threshold_days.toFixed(0)} day threshold
            {overdueFault.avg_closed_round_days ? ` (average closed round: ${overdueFault.avg_closed_round_days.toFixed(0)} days)` : ''}
            {faultFlags.length > 1 ? ` — ${faultFlags.length} tanks overdue.` : '.'}
          </div>
        </div>
      )}

      {expansionSignal?.signal && (
        <div className="card card-link" style={{ marginBottom: 20, borderColor: 'var(--green)' }}
          onClick={() => router.push('/admin/plant')}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>Room to expand</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>
            {expansionSignal.utilization_pct}% of tanks are actively leaching and cost per gram recovered
            (TSh {expansionSignal.current_cost_per_gram_tsh?.toLocaleString()}) is at or below the trailing
            average (TSh {expansionSignal.trailing_avg_cost_per_gram_tsh?.toLocaleString()}). Capacity is being
            used well, this may be a good time to consider adding tanks or pits.
          </div>
        </div>
      )}

      {/* Hero: one trend chart, the KPI metrics attached below as tabs.
          Clicking a metric switches the charted series. Gold overlays market
          price (TSh/g, proportionally scaled) as a faint context line. */}
      <div className="card" style={{ marginBottom: 20, paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <div className="section-title" style={{ marginBottom: 0, flex: 1 }}>Performance trend</div>
          <div className="seg">
            {RANGES.map(r => (
              <button key={r.id} className={`seg-btn${rangeMonths === r.id ? ' active' : ''}`} onClick={() => setRangeMonths(r.id)}>{r.label}</button>
            ))}
          </div>
          <button
            className={`chip-toggle${goldOn ? ' on' : ''}`}
            onClick={() => setGoldOn(v => !v)}
            title={goldError ?? 'Overlay market gold price (TSh/g, scaled)'}
          >
            <span className="dot" style={goldOn ? { background: GOLD_OVERLAY } : undefined} /> Gold
          </button>
          <button className="btn-text" onClick={() => router.push('/admin/operations/overview')}>View Operations →</button>
        </div>
        <LineTrendChart
          data={heroData}
          gold={goldOverlay}
          valueName={valueName}
          prefix="TSh "
          height={260}
          emptyLabel="No financial data yet, run the operations financial summary migration to populate this."
        />
        {goldOn && (
          <div style={{ fontSize: 11, color: 'var(--label-4)', marginTop: 8 }}>
            {goldOverlay
              ? 'Gold: market avg TSh/g (scaled onto chart · hover for real values)'
              : goldError
                ? `Gold price unavailable: ${goldError}`
                : 'Loading gold price…'}
          </div>
        )}
        <div style={{ margin: '12px -20px 0' }}>
          <MetricStrip metrics={heroMetrics} active={activeMetric} onSelect={setActiveMetric} />
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card card-link" onClick={() => router.push('/admin/plant')}>
          <div className="section-title" style={{ marginBottom: 4 }}>Plant status</div>
          {tanks.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--label-4)', lineHeight: 1.6 }}>No tanks configured yet.</div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--label-3)', lineHeight: 1.6 }}>
              <span className="num">{clearCount}</span> clear · <span className="num">{greyCount}</span> grey ·{' '}
              <span className="num">{blackCount}</span> black of <span className="num">{tanks.length}</span> tanks.
              {' '}<span className="num">{openRoundCount}</span> round{openRoundCount === 1 ? '' : 's'} in progress.
            </div>
          )}
        </div>
        <div className="card card-link" onClick={() => router.push('/admin/plant')}>
          <div className="section-title" style={{ marginBottom: 4 }}>Pit status</div>
          {pits.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--label-4)', lineHeight: 1.6 }}>No pits registered yet.</div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--label-3)', lineHeight: 1.6 }}>
              <span className="num">{pits.length}</span> pit{pits.length === 1 ? '' : 's'},{' '}
              <span className="num">{machineryCount}</span> machine{machineryCount === 1 ? '' : 's'} assigned.
            </div>
          )}
        </div>
      </div>

      <div className="card card-link" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}
        onClick={() => router.push('/admin/maxgold')}>
        <div style={{ fontSize: 28 }}>⛏</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Max Gold Finder</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 2 }}>Upload a CSV/Excel file and instantly find the highest-grade interval per hole, no project needed.</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--gold)' }}>Open →</div>
      </div>
    </div>
  )
}
