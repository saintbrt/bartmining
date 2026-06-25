'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/lib/goldpass/AppContext'
import { DB } from '@/lib/goldpass/db'
import type { Project } from '@/lib/goldpass/db'

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

function PitHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    ctx.clearRect(0, 0, W, H)
    const cx = W * 0.5, cy = H * 0.6
    for (let i = 12; i >= 1; i--) {
      const rx = (W * 0.38) * (i / 12), ry = (H * 0.18) * (i / 12)
      const alpha = 0.04 + (i / 12) * 0.06
      ctx.strokeStyle = `rgba(200,151,59,${alpha})`
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke()
    }
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * W, y = Math.random() * H
      const r = Math.random() * 1.5
      ctx.fillStyle = `rgba(200,151,59,${Math.random() * 0.4 + 0.1})`
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }
  }, [])
  return <canvas ref={canvasRef} style={{ width: '100%', height: 200, borderRadius: 12 }} />
}

export default function DashboardPage() {
  const ctx = useAppContext()
  const router = useRouter()
  if (!ctx) return null
  const { projects, setProject } = ctx
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

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
      <PitHero />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: 24 }}>
        {[
          { label: 'Projects', value: projects.length, color: 'var(--blue)' },
          { label: 'Data rows', value: totalRows, color: 'var(--green)' },
          { label: 'Tables', value: projects.reduce((a, p) => a + DB.getTables(p.id).length, 0), color: 'var(--orange)' },
          { label: 'Outputs', value: projects.reduce((a, p) => a + DB.getOutputs(p.id).length, 0), color: 'var(--purple)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}><Counter target={k.value} /></div>
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
            {projects.map((p: Project, i: number) => {
              const tables = DB.getTables(p.id)
              const rows = tables.reduce((a, t) => a + t.row_count, 0)
              const colors = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30']
              const ss = DB.getStageStatus(p.id)
              const stages: { key: 'validation' | 'cleaning' | 'analysis'; label: string }[] = [
                { key: 'validation', label: 'Validation' }, { key: 'cleaning', label: 'Cleaning' }, { key: 'analysis', label: 'Analysis' },
              ]
              const nextStage = stages.find(s => ss[s.key] !== 'done')
              return (
                <div key={p.id} className="card" style={{ cursor: 'pointer', borderColor: 'var(--sep)', transition: 'border-color .15s' }}
                  onClick={() => setProject(p)}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = colors[i % 5] }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sep)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[i % 5] }} />
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
                  <div style={{ marginTop: 12, fontSize: 12, color: colors[i % 5] }}>
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
