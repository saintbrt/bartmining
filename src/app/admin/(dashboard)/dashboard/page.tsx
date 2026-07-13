'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOperationsKpis, getFinancialSummary, type OperationsKpis, type FinancialSummaryRow } from '@/lib/goldpass/erp'
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

  useEffect(() => {
    let alive = true
    Promise.all([getOperationsKpis(), getFinancialSummary(6)]).then(([k, f]) => {
      if (alive) { setOpsKpis(k); setOpsFinancials(f) }
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

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>Dashboard</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Operations and financial overview at a glance.</p>
      </div>

      <div className="grid-kpi" style={{ marginBottom: 20 }}>
        <StatTile label="Revenue (this month)" value={current?.revenue_tsh ?? 0} prefix="TSh " delta={pctDelta(revSeries)} spark={revSeries} goodWhenUp />
        <StatTile label="Cost (this month)" value={current?.cost_tsh ?? 0} prefix="TSh " delta={pctDelta(costSeries)} spark={costSeries} goodWhenUp={false} />
        <StatTile label="Profit (this month)" value={current?.profit_tsh ?? 0} prefix="TSh " delta={pctDelta(profitSeries)} spark={profitSeries} goodWhenUp />
        <StatTile label="Pending approvals" value={opsKpis?.pendingApprovals ?? 0} />
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
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Plant status</div>
          <div style={{ fontSize: 12, color: 'var(--label-4)', lineHeight: 1.6 }}>
            Tank map, leaching rounds and color tests will appear here once the Plant module is built.
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Pit status</div>
          <div style={{ fontSize: 12, color: 'var(--label-4)', lineHeight: 1.6 }}>
            Pit activity, assigned machinery and fuel usage will appear here once the Pits module is built.
          </div>
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
