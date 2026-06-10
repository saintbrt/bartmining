'use client'

import { useEffect, useRef } from 'react'
import { useAppContext } from '@/lib/goldpass/AppContext'
import { DB } from '@/lib/goldpass/db'
import { invertColMapping } from '@/lib/goldpass/db/helpers'

interface CollarPoint { id: string; e: number; n: number; z: number; maxAu: number }

function parseCollar(project: { id: string }): CollarPoint[] {
  const tables = DB.getTables(project.id)
  const collar = tables.find(t => t.type === 'collar')
  const assay = tables.find(t => t.type === 'assay')
  if (!collar) return []
  const cRows = DB.getRows(collar.id, 0)
  const aRows = assay ? DB.getRows(assay.id, 0) : []
  const cInv = invertColMapping(collar.columns)
  const aInv = assay ? invertColMapping(assay.columns) : {}
  const maxAu: Record<string, number> = {}
  if (aInv.hole_id && aInv.au) {
    aRows.forEach(r => {
      const id = String(r[aInv.hole_id] ?? '').trim()
      const v = parseFloat(String(r[aInv.au] ?? ''))
      if (id && !isNaN(v)) maxAu[id] = id in maxAu ? Math.max(maxAu[id], v) : v
    })
  }
  return cRows.map(r => {
    const id = String(r[cInv.hole_id ?? ''] ?? '').trim()
    const e = parseFloat(String(r[cInv.easting ?? ''] ?? ''))
    const n = parseFloat(String(r[cInv.northing ?? ''] ?? ''))
    const z = parseFloat(String(r[cInv.elevation ?? ''] ?? ''))
    if (!id || isNaN(e) || isNaN(n)) return null
    return { id, e, n, z: isNaN(z) ? 0 : z, maxAu: maxAu[id] ?? 0 }
  }).filter(Boolean) as CollarPoint[]
}

function CollarMap({ points }: { points: CollarPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas || !points.length) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    ctx.fillStyle = '#0B0C0E'; ctx.fillRect(0, 0, W, H)
    const es = points.map(p => p.e), ns = points.map(p => p.n)
    const minE = Math.min(...es), maxE = Math.max(...es)
    const minN = Math.min(...ns), maxN = Math.max(...ns)
    const pad = 30
    const maxAu = Math.max(...points.map(p => p.maxAu), 1)
    points.forEach(p => {
      const x = pad + ((p.e - minE) / (maxE - minE || 1)) * (W - pad * 2)
      const y = H - pad - ((p.n - minN) / (maxN - minN || 1)) * (H - pad * 2)
      const t = p.maxAu / maxAu
      const r = 3 + t * 5
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${Math.round(200 + t * 55)},${Math.round(151 - t * 100)},59,${0.5 + t * 0.5})`
      ctx.fill()
    })
    ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2)
  }, [points])
  return <canvas ref={canvasRef} style={{ width: '100%', height: 320, borderRadius: 10 }} />
}

function GradeHistogram({ points }: { points: CollarPoint[] }) {
  if (!points.length) return null
  const auVals = points.map(p => p.maxAu).filter(v => v > 0)
  if (!auVals.length) return <div style={{ padding: 20, color: 'var(--label-4)', fontSize: 13, textAlign: 'center' }}>No Au grades available.</div>
  const max = Math.max(...auVals)
  const bins = 10
  const binSize = max / bins
  const hist = Array(bins).fill(0)
  auVals.forEach(v => { const i = Math.min(Math.floor(v / binSize), bins - 1); hist[i]++ })
  const maxCount = Math.max(...hist)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100, padding: '8px 4px' }}>
      {hist.map((count, i) => (
        <div key={i} title={`${(i * binSize).toFixed(2)}–${((i + 1) * binSize).toFixed(2)} g/t: ${count} holes`}
          style={{ flex: 1, background: `rgba(200,151,59,${0.3 + (count / maxCount) * 0.7})`, height: maxCount > 0 ? `${(count / maxCount) * 100}%` : 4, borderRadius: 3, minHeight: 4 }} />
      ))}
    </div>
  )
}

export default function VisualizationPage() {
  const ctx = useAppContext()
  if (!ctx) return null
  const { project } = ctx
  const points = project ? parseCollar(project) : []

  return (
    <div className="content content-pad">
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Visualisation</h2>
      {!project ? (
        <div style={{ textAlign: 'center', color: 'var(--label-4)', fontSize: 13, padding: 40 }}>Select a project to visualise.</div>
      ) : points.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--label-4)', fontSize: 13, padding: 40 }}>No collar data with coordinates available.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 10 }}>2D Collar Map · {points.length} holes</div>
            <CollarMap points={points} />
          </div>
          <div className="card">
            <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 4 }}>Au Grade Distribution (g/t)</div>
            <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 8 }}>{points.filter(p => p.maxAu > 0).length} holes with grade data</div>
            <GradeHistogram points={points} />
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Max Au (g/t)', val: Math.max(...points.map(p => p.maxAu)).toFixed(3) },
                { label: 'Mean Au (g/t)', val: (points.reduce((a, p) => a + p.maxAu, 0) / (points.length || 1)).toFixed(3) },
              ].map(s => (
                <div key={s.label} style={{ padding: '10px 12px', background: 'var(--bg-3)', borderRadius: 6 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)' }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--label-3)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
