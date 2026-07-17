'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getOperationsKpis, getFinancialSummary, projectNextMonthProfit,
  getTanks, getLatestTankColors, getTankRoundStatus, getPits, getPitMachinery,
  getExpansionSignal, getRoundFaultFlags,
  type OperationsKpis, type FinancialSummaryRow, type TankRow, type TankLatestColor,
  type TankRoundStatusRow, type PitRow, type PitMachineryRow, type ExpansionSignalRow, type RoundFaultFlagRow,
} from '@/lib/goldpass/erp'
import { MultiLineChart, StatTile } from '@/components/goldpass/charts'

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

export default function DashboardPage() {
  const router = useRouter()
  const [opsKpis, setOpsKpis] = useState<OperationsKpis | null>(null)
  const [opsFinancials, setOpsFinancials] = useState<FinancialSummaryRow[]>([])

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
      getOperationsKpis(), getFinancialSummary(6),
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

  const current = opsFinancials[opsFinancials.length - 1]
  const revSeries = opsFinancials.map(f => f.revenue_tsh)
  const costSeries = opsFinancials.map(f => f.cost_tsh)
  const profitSeries = opsFinancials.map(f => f.profit_tsh)
  const chartData = opsFinancials.map(f => ({
    label: monthLabel(f.month), revenue: f.revenue_tsh, cost: f.cost_tsh, profit: f.profit_tsh,
  }))
  const series = [
    { key: 'revenue', name: 'Revenue' },
    { key: 'cost', name: 'Cost' },
    { key: 'profit', name: 'Profit' },
  ]
  const projectedProfit = opsFinancials.length > 0 ? projectNextMonthProfit(opsFinancials) : 0

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
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>Dashboard</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Operations and financial overview at a glance.</p>
      </div>

      {overdueFault && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--orange)', cursor: 'pointer' }}
          onClick={() => router.push('/admin/plant/overview')}>
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
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--green)', cursor: 'pointer' }}
          onClick={() => router.push('/admin/plant/overview')}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>Room to expand</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>
            {expansionSignal.utilization_pct}% of tanks are actively leaching and cost per gram recovered
            (TSh {expansionSignal.current_cost_per_gram_tsh?.toLocaleString()}) is at or below the trailing
            average (TSh {expansionSignal.trailing_avg_cost_per_gram_tsh?.toLocaleString()}). Capacity is being
            used well, this may be a good time to consider adding tanks or pits.
          </div>
        </div>
      )}

      <div className="grid-kpi" style={{ marginBottom: 20 }}>
        <StatTile label="Revenue (this month)" value={current?.revenue_tsh ?? 0} prefix="TSh " delta={pctDelta(revSeries)} spark={revSeries} goodWhenUp />
        <StatTile label="Cost (this month)" value={current?.cost_tsh ?? 0} prefix="TSh " delta={pctDelta(costSeries)} spark={costSeries} goodWhenUp={false} />
        <StatTile label="Profit (this month)" value={current?.profit_tsh ?? 0} prefix="TSh " delta={pctDelta(profitSeries)} spark={profitSeries} goodWhenUp />
        <StatTile label="Projected profit (next month)" value={projectedProfit} prefix="TSh " />
      </div>

      <div className="card" style={{ marginBottom: 24, cursor: 'pointer', transition: 'border-color .15s' }}
        onClick={() => router.push('/admin/operations/overview')}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--chart-accent)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sep)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
            Revenue, cost &amp; profit{opsFinancials.length > 0 ? ` (last ${opsFinancials.length} months)` : ''}
          </div>
          <div style={{ fontSize: 12, color: 'var(--label-3)' }}>View Operations →</div>
        </div>
        <MultiLineChart data={chartData} series={series} prefix="TSh " height={260}
          emptyLabel="No financial data yet, run the operations financial summary migration to populate this." />
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => router.push('/admin/plant/overview')}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Plant status</div>
          {tanks.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--label-4)', lineHeight: 1.6 }}>No tanks configured yet.</div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--label-3)', lineHeight: 1.6 }}>
              {clearCount} clear · {greyCount} grey · {blackCount} black of {tanks.length} tanks.
              {' '}{openRoundCount} round{openRoundCount === 1 ? '' : 's'} in progress.
            </div>
          )}
        </div>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => router.push('/admin/plant/overview')}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Pit status</div>
          {pits.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--label-4)', lineHeight: 1.6 }}>No pits registered yet.</div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--label-3)', lineHeight: 1.6 }}>
              {pits.length} pit{pits.length === 1 ? '' : 's'}, {machineryCount} machine{machineryCount === 1 ? '' : 's'} assigned.
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
        onClick={() => router.push('/admin/maxgold')}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sep)' }}>
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
