'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOperationsKpis, type OperationsKpis } from '@/lib/goldpass/erp'

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

export default function OperationsOverviewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<OperationsKpis>({ pendingApprovals: 0, spendMtd: 0, lowStockCount: 0, openAlertsCount: 0 })

  useEffect(() => {
    let alive = true
    getOperationsKpis().then(k => { if (alive) { setKpis(k); setLoading(false) } })
    return () => { alive = false }
  }, [])

  const tiles: { label: string; value: number; color: string; suffix?: string; prefix?: string; href: string }[] = [
    { label: 'Pending approvals', value: kpis.pendingApprovals, color: 'var(--blue)', href: '/admin/operations/expenses' },
    { label: 'Spend (month-to-date)', value: Math.round(kpis.spendMtd), color: 'var(--green)', prefix: 'TSh ', href: '/admin/operations/expenses' },
    { label: 'Low-stock items', value: kpis.lowStockCount, color: 'var(--orange)', href: '/admin/operations/inventory' },
    { label: 'Open inventory alerts', value: kpis.openAlertsCount, color: 'var(--red)', href: '/admin/operations/inventory' },
  ]

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Operations</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>
          Oversight of expenses and inventory captured by field managers and supervisors in the GoldPass mobile app.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
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

      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
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
