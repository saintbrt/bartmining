'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOperationsKpis, getFinancialSummary, projectNextMonth, type OperationsKpis, type FinancialSummaryRow } from '@/lib/goldpass/erp'
import { LineTrendChart, BarCompareChart } from '@/components/goldpass/charts'

function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const start = performance.now()
      const dur = 1000
      function frame(now: number) {
        const t = Math.min((now - start) / dur, 1)
        const ease = 1 - Math.pow(1 - t, 3)
        setVal(Math.round(ease * target))
        if (t < 1) requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

function monthLabel(month: string): string {
  return new Date(month + 'T00:00:00').toLocaleDateString(undefined, { month: 'short' })
}

export default function OperationsOverviewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<OperationsKpis>({ pendingApprovals: 0, spendMtd: 0, lowStockCount: 0, openAlertsCount: 0 })
  const [financials, setFinancials] = useState<FinancialSummaryRow[]>([])

  useEffect(() => {
    let alive = true
    Promise.all([getOperationsKpis(), getFinancialSummary(6)]).then(([k, f]) => {
      if (!alive) return
      setKpis(k); setFinancials(f); setLoading(false)
    })
    return () => { alive = false }
  }, [])

  // Attention tiles: value is ink; low-stock / open-alerts turn amber only when
  // there's actually something to act on (> 0), a reserved status use, not decoration.
  const tiles: { label: string; value: number; suffix?: string; prefix?: string; href: string; alert?: boolean }[] = [
    { label: 'Pending approvals', value: kpis.pendingApprovals, href: '/admin/operations/expenses' },
    { label: 'Spend (month-to-date)', value: Math.round(kpis.spendMtd), prefix: 'TSh ', href: '/admin/operations/expenses' },
    { label: 'Low-stock items', value: kpis.lowStockCount, href: '/admin/operations/inventory', alert: true },
    { label: 'Open inventory alerts', value: kpis.openAlertsCount, href: '/admin/operations/inventory', alert: true },
  ]

  const current = financials[financials.length - 1]
  const projectedRevenue = financials.length > 0 ? projectNextMonth(financials) : 0

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Operations</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>
          Oversight of expenses and inventory captured by field managers and supervisors in the GoldPass mobile app.
        </p>
      </div>

      <div className="grid-kpi" style={{ marginBottom: 24 }}>
        {tiles.map(t => {
          const attention = t.alert && t.value > 0
          return (
            <div key={t.label} className="card" style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => router.push(t.href)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--chart-accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sep)' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: attention ? 'var(--orange)' : 'var(--label-1)' }}>
                {loading ? '-' : <Counter target={t.value} prefix={t.prefix} suffix={t.suffix} />}
              </div>
              <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>{t.label}</div>
            </div>
          )
        })}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Financial Summary: This Month</h3>
        <p style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 12 }}>
          Cost = expenses + payroll + approved procurement.
        </p>

        {loading ? (
          <div className="card" style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : !current ? (
          <div className="card" style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>No financial data yet.</div>
        ) : (
          <>
            <div className="grid-3" style={{ marginBottom: 16 }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--label-1)' }}>TSh {current.revenue_tsh.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>Revenue</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--label-1)' }}>TSh {current.cost_tsh.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>Total Cost</div>
                <div style={{ fontSize: 10, color: 'var(--label-4)', marginTop: 6 }}>
                  Expenses {current.expense_tsh.toLocaleString()} · Procurement {current.procurement_tsh.toLocaleString()}
                </div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: current.profit_tsh >= 0 ? 'var(--label-1)' : 'var(--red)' }}>
                  TSh {current.profit_tsh.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>Profit</div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Revenue vs Cost vs Profit (this month)</div>
              <BarCompareChart
                data={[
                  { label: 'Revenue', value: current.revenue_tsh },
                  { label: 'Cost', value: current.cost_tsh },
                  { label: 'Profit', value: current.profit_tsh },
                ]}
                prefix="TSh " height={200}
              />
            </div>

            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Revenue Trend &amp; Projection</div>
              <div style={{ fontSize: 11, color: 'var(--label-3)', marginBottom: 8 }}>
                Last {financials.length} months actual, next month projected from the trailing trend.
              </div>
              <LineTrendChart
                data={[
                  ...financials.map(f => ({ label: monthLabel(f.month), value: f.revenue_tsh })),
                  { label: 'Proj.', value: projectedRevenue },
                ]}
                prefix="TSh " height={200}
              />
            </div>
          </>
        )}
      </div>

      <div className="grid-2">
        <div className="card" style={{ flex: 1, cursor: 'pointer' }} onClick={() => router.push('/admin/operations/expenses')}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Expenses</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)' }}>Review submitted expenses, approve or reject with a comment.</div>
        </div>
        <div className="card" style={{ flex: 1, cursor: 'pointer' }} onClick={() => router.push('/admin/operations/inventory')}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Inventory</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)' }}>Current stock levels against minimums, and open stock alerts.</div>
        </div>
      </div>
    </div>
  )
}
