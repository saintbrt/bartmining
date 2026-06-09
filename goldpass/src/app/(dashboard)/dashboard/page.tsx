'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import { useAppContext } from '@/lib/AppContext'
import { DB } from '@/lib/db'
import type { Project } from '@/lib/db'

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
    ctx.fillStyle = '#0B0C0E'; ctx.fillRect(0, 0, W, H)
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

      {/* KPIs */}
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

      {/* Create project */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New project</div>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8 }}>
          <input className="input" style={{ flex: 1 }} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Project name…" disabled={creating} />
          <button className="btn btn-primary btn-sm" type="submit" disabled={!newName.trim() || creating}>{creating ? 'Creating…' : 'Create'}</button>
        </form>
      </div>

      {/* Project list */}
      {projects.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Projects</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {projects.map((p: Project, i: number) => {
              const tables = DB.getTables(p.id)
              const rows = tables.reduce((a, t) => a + t.row_count, 0)
              const colors = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30']
              return (
                <div key={p.id} className="card" style={{ cursor: 'pointer', borderColor: 'var(--sep)', transition: 'border-color .15s' }}
                  onClick={() => setProject(p)}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = colors[i % 5] }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--sep)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[i % 5] }} />
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ fontSize: 12, color: 'var(--label-3)' }}>{tables.length} table{tables.length !== 1 ? 's' : ''}</div>
                    <div style={{ fontSize: 12, color: 'var(--label-3)' }}>{rows.toLocaleString()} rows</div>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: colors[i % 5] }}>Open →</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
