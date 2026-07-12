'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOperationsKpis, getFinancialSummary, projectNextMonth, type OperationsKpis, type FinancialSummaryRow } from '@/lib/goldpass/erp'

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

  const tiles: { label: string; value: number; color: string; suffix?: string; prefix?: string; href: string }[] = [
    { label: 'Pending approvals', value: kpis.pendingApprovals, color: 'var(--blue)', href: '/admin/operations/expenses' },
    { label: 'Spend (month-to-date)', value: Math.round(kpis.spendMtd), color: 'var(--green)', prefix: 'TSh ', href: '/admin/operations/expenses' },
    { label: 'Low-stock items', value: kpis.lowStockCount, color: 'var(--orange)', href: '/admin/operations/inventory' },
    { label: 'Open inventory alerts', value: kpis.openAlertsCount, color: 'var(--red)', href: '/admin/operations/inventory' },
  ]

  const current = financials[financials.length - 1]
  const projectedRevenue = financials.length > 0 ? projectNextMonth(financials) : 0
  const maxRCP = current ? Math.max(current.revenue_tsh, current.cost_tsh, Math.abs(current.profit_tsh), 1) : 1
  const maxTrend = financials.length > 0 ? Math.max(...financials.map(f => Math.max(f.revenue_tsh, f.cost_tsh)), projectedRevenue, 1) : 1

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Operations</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>
          Oversight of expenses and inventory captured by field managers and supervisors in the GoldPass mobile app.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {tiles.map(t => (
          <div key={t.label} className="card" style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => router.push(t.href)}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.color }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sep)' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: t.color }}>
              {loading ? '—' : <Counter target={t.value} prefix={t.prefix} suffix={t.suffix} />}
            </div>
            <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>{t.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Financial Summary — This Month</h3>
        <p style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 12 }}>
          Cost = expenses + payroll + approved procurement. Numbers come from monthly reporting views —
          use the &quot;Refresh&quot; button on the Executive page if these look stale.
        </p>

        {loading ? (
          <div className="card" style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : !current ? (
          <div className="card" style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>No financial data yet.</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--green)' }}>TSh {current.revenue_tsh.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>Revenue</div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--red)' }}>TSh {current.cost_tsh.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>Total Cost</div>
                <div style={{ fontSize: 10, color: 'var(--label-4)', marginTop: 6 }}>
                  Expenses {current.expense_tsh.toLocaleString()} · Payroll {current.payroll_tsh.toLocaleString()} · Procurement {current.procurement_tsh.toLocaleString()}
                </div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: current.profit_tsh >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  TSh {current.profit_tsh.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>Profit</div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Revenue vs Cost vs Profit</div>
              {[
                { label: 'Revenue', value: current.revenue_tsh, color: 'var(--green)' },
                { label: 'Cost', value: current.cost_tsh, color: 'var(--red)' },
                { label: 'Profit', value: current.profit_tsh, color: current.profit_tsh >= 0 ? 'var(--blue)' : 'var(--red)' },
              ].map(bar => (
                <div key={bar.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--label-3)', marginBottom: 3 }}>
                    <span>{bar.label}</span>
                    <span>TSh {bar.value.toLocaleString()}</span>
                  </div>
                  <div style={{ background: 'var(--bg-3)', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, Math.abs(bar.value) / maxRCP * 100)}%`,
                      background: bar.color, height: '100%', borderRadius: 4, transition: 'width .6s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Revenue Trend & Projection</div>
              <div style={{ fontSize: 11, color: 'var(--label-3)', marginBottom: 14 }}>
                Last {financials.length} months actual, next month projected from the trailing trend.
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
                {financials.map(f => (
                  <div key={f.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--label-4)' }}>{Math.round(f.revenue_tsh).toLocaleString()}</div>
                    <div style={{
                      width: '100%', maxWidth: 32,
                      height: `${Math.max(4, f.revenue_tsh / maxTrend * 100)}px`,
                      background: 'var(--green)', borderRadius: '4px 4px 0 0',
                    }} />
                    <div style={{ fontSize: 10, color: 'var(--label-3)' }}>{monthLabel(f.month)}</div>
                  </div>
                ))}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 10, color: 'var(--label-4)' }}>{Math.round(projectedRevenue).toLocaleString()}</div>
                  <div style={{
                    width: '100%', maxWidth: 32,
                    height: `${Math.max(4, projectedRevenue / maxTrend * 100)}px`,
                    background: 'transparent', border: '2px dashed var(--green)', borderRadius: '4px 4px 0 0', boxSizing: 'border-box',
                  }} />
                  <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600 }}>Projected</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
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
