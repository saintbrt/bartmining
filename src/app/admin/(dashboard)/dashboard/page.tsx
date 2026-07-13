'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/lib/goldpass/AppContext'
import { DB } from '@/lib/goldpass/db'
import type { Project } from '@/lib/goldpass/db'
import { getOperationsKpis, getFinancialSummary, type OperationsKpis, type FinancialSummaryRow } from '@/lib/goldpass/erp'
import { MultiLineChart } from '@/components/goldpass/charts'

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const start = performance.now()
      const dur = 1200
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
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

function monthLabel(month: string): string {
  // month is 'YYYY-MM' from the RPC; anchor to day 01 for a stable short label.
  return new Date(month + '-01T00:00:00').toLocaleDateString(undefined, { month: 'short' })
}

export default function DashboardPage() {
  const ctx = useAppContext()
  const router = useRouter()
  if (!ctx) return null
  const { projects, setProject } = ctx
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [opsKpis, setOpsKpis] = useState<OperationsKpis | null>(null)
  const [opsFinancials, setOpsFinancials] = useState<FinancialSummaryRow[]>([])

  useEffect(() => {
    let alive = true
    Promise.all([getOperationsKpis(), getFinancialSummary(6)]).then(([k, f]) => {
      if (alive) { setOpsKpis(k); setOpsFinancials(f) }
    })
    return () => { alive = false }
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    const proj = DB.createProject(newName.trim())
    ctx!.refresh()
    setNewName(''); setCreating(false)
    await DB.loadProjectRows(proj.id)
    ctx!.setProject(proj)
  }

  const totalRows = projects.reduce((acc, p) => acc + DB.getTables(p.id).reduce((a, t) => a + t.row_count, 0), 0)

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>Dashboard</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Operations and financial overview at a glance.</p>
      </div>

      {(() => {
        const current = opsFinancials[opsFinancials.length - 1]
        const profit = current?.profit_tsh ?? 0
        // Values wear text ink, not colour (minimum-colour system). Only the
        // small mark/emphasis carries meaning: profit turns red when negative.
        const tiles = [
          { label: 'Revenue (this month)', value: current?.revenue_tsh ?? 0, prefix: 'TSh ', muted: false },
          { label: 'Cost (this month)', value: current?.cost_tsh ?? 0, prefix: 'TSh ', muted: false },
          { label: 'Profit (this month)', value: profit, prefix: 'TSh ', negative: profit < 0 },
          { label: 'Pending approvals', value: opsKpis?.pendingApprovals ?? 0, prefix: '', muted: false },
        ]
        const chartData = opsFinancials.map(f => ({
          label: monthLabel(f.month), revenue: f.revenue_tsh, cost: f.cost_tsh, profit: f.profit_tsh,
        }))
        const series = [
          { key: 'revenue', name: 'Revenue' },
          { key: 'cost', name: 'Cost' },
          { key: 'profit', name: 'Profit' },
        ]
        return (
          <>
            <div className="grid-kpi" style={{ marginBottom: 20 }}>
              {tiles.map(t => (
                <div key={t.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: t.negative ? 'var(--red)' : 'var(--label-1)' }}>
                    {t.prefix}{Math.round(t.value).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--label-3)', marginTop: 4 }}>{t.label}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginBottom: 24, cursor: 'pointer', transition: 'border-color .15s' }}
              onClick={() => router.push('/admin/operations/overview')}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--chart-accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sep)' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                  Revenue, cost &amp; profit{opsFinancials.length > 0 ? ` — last ${opsFinancials.length} months` : ''}
                </div>
                <div style={{ fontSize: 12, color: 'var(--label-3)' }}>View Operations →</div>
              </div>
              <MultiLineChart data={chartData} series={series} prefix="TSh " height={260}
                emptyLabel="No financial data yet — run the operations financial summary migration to populate this." />
            </div>
          </>
        )
      })()}

      <div className="grid-kpi" style={{ marginTop: 24 }}>
        {[
          { label: 'Projects', value: projects.length },
          { label: 'Data rows', value: totalRows },
          { label: 'Tables', value: projects.reduce((a, p) => a + DB.getTables(p.id).length, 0) },
          { label: 'Outputs', value: projects.reduce((a, p) => a + DB.getOutputs(p.id).length, 0) },
        ].map(k => (
          <div key={k.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--label-1)' }}><Counter target={k.value} /></div>
            <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
        onClick={() => router.push('/admin/maxgold')}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sep)' }}>
        <div style={{ fontSize: 28 }}>⛏</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Max Gold Finder</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 2 }}>Upload a CSV/Excel file and instantly find the highest-grade interval per hole — no project needed.</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--gold)' }}>Open →</div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New project</div>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8 }}>
          <input className="input" style={{ flex: 1 }} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Project name…" disabled={creating} />
          <button className="btn btn-primary btn-sm" type="submit" disabled={!newName.trim() || creating}>{creating ? 'Creating…' : 'Create'}</button>
        </form>
      </div>

      {projects.length > 0 && (() => {
        const recent = projects.flatMap(p => DB.getAuditLog(p.id).map(a => ({ ...a, _proj: p.name })))
          .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? '')).slice(0, 8)
        return recent.length > 0 ? (
          <div className="card" style={{ marginTop: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Recent activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map(a => (
                <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 12 }}>
                  <span style={{ color: 'var(--gold)', fontFamily: 'monospace', flexShrink: 0 }}>{a.operation}</span>
                  <span style={{ color: 'var(--label-2)', flex: 1 }}>{a.details}</span>
                  <span style={{ color: 'var(--label-4)', flexShrink: 0 }}>{a._proj}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null
      })()}

      {projects.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Projects</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {projects.map((p: Project) => {
              const tables = DB.getTables(p.id)
              const rows = tables.reduce((a, t) => a + t.row_count, 0)
              const ss = DB.getStageStatus(p.id)
              const stages: { key: 'validation' | 'cleaning' | 'analysis'; label: string }[] = [
                { key: 'validation', label: 'Validation' }, { key: 'cleaning', label: 'Cleaning' }, { key: 'analysis', label: 'Analysis' },
              ]
              const nextStage = stages.find(s => ss[s.key] !== 'done')
              return (
                <div key={p.id} className="card" style={{ cursor: 'pointer', borderColor: 'var(--sep)', transition: 'border-color .15s' }}
                  onClick={() => setProject(p)}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sep)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)' }} />
                    <div style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{p.name}</div>
                    <button className="btn-icon" style={{ fontSize: 10, padding: '2px 7px' }} title="Rename project"
                      onClick={e => { e.stopPropagation(); const n = window.prompt('Rename project:', p.name); if (n?.trim()) { DB.renameProject(p.id, n); ctx!.refresh() } }}>✎</button>
                    <button className="btn-icon" style={{ fontSize: 10, padding: '2px 7px', color: 'var(--red)' }} title="Delete project"
                      onClick={e => {
                        e.stopPropagation()
                        const typed = window.prompt(`This permanently deletes "${p.name}" and ALL its files, versions and outputs.\n\nType the project name to confirm:`)
                        if (typed !== p.name) { if (typed !== null) window.alert('Name did not match — nothing was deleted.'); return }
                        DB.deleteProject(p.id); ctx!.refresh()
                      }}>✕</button>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ fontSize: 12, color: 'var(--label-3)' }}>{tables.length} file{tables.length !== 1 ? 's' : ''}</div>
                    <div style={{ fontSize: 12, color: 'var(--label-3)' }}>{rows.toLocaleString()} rows</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    {stages.map(s => (
                      <span key={s.key} title={`${s.label}: ${ss[s.key]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: ss[s.key] === 'done' ? 'var(--green)' : 'var(--label-4)' }}>
                        <span style={{ width: 7, height: 7, borderRadius: 4, background: ss[s.key] === 'done' ? 'var(--green)' : 'var(--label-4)' }} />{s.label}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: 'var(--gold)' }}>
                    {nextStage ? `Continue: ${nextStage.label} →` : 'All stages done — Outputs →'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
