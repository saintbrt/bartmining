'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '@/lib/goldpass/AppContext'
import { DB } from '@/lib/goldpass/db'
import { invertColMapping } from '@/lib/goldpass/db/helpers'
import type { TableMeta } from '@/lib/goldpass/db'

interface CollarPoint { id: string; e: number; n: number; z: number; grade: number }
type Metal = 'au' | 'cu' | 'ag'

function buildPoints(projectId: string, collarTable: TableMeta, metal: Metal): CollarPoint[] {
  const tables = DB.getTables(projectId)
  const cInv = invertColMapping(collarTable.columns)
  // grade per hole: from the collar file itself if it has the column,
  // otherwise the max from any interval file with hole_id + that metal
  const grade: Record<string, number> = {}
  const sources = [collarTable, ...tables.filter(t => t.id !== collarTable.id)]
  for (const t of sources) {
    const inv = invertColMapping(t.columns)
    if (!inv.hole_id || !inv[metal]) continue
    DB.getRows(t.id, 0).forEach(r => {
      const id = String(r[inv.hole_id] ?? '').trim().toUpperCase()
      const v = parseFloat(String(r[inv[metal]] ?? ''))
      if (id && !isNaN(v)) grade[id] = id in grade ? Math.max(grade[id], v) : v
    })
    break // first file that has the metal wins
  }
  return DB.getRows(collarTable.id, 0).map(r => {
    const id = String(r[cInv.hole_id ?? ''] ?? '').trim()
    const e = parseFloat(String(r[cInv.easting ?? ''] ?? ''))
    const n = parseFloat(String(r[cInv.northing ?? ''] ?? ''))
    const z = parseFloat(String(r[cInv.elevation ?? ''] ?? ''))
    if (!id || isNaN(e) || isNaN(n)) return null
    return { id, e, n, z: isNaN(z) ? 0 : z, grade: grade[id.toUpperCase()] ?? 0 }
  }).filter(Boolean) as CollarPoint[]
}

function CollarMap({ points, metal }: { points: CollarPoint[]; metal: Metal }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [view, setView] = useState({ zoom: 1, ox: 0, oy: 0 })
  const [hover, setHover] = useState<{ p: CollarPoint; x: number; y: number } | null>(null)
  const panRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  const screenPos = useRef<{ p: CollarPoint; x: number; y: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas || !points.length) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    const isLight = document.querySelector('.gp-root')?.getAttribute('data-theme') === 'light'
    ctx.fillStyle = isLight ? '#FFFFFF' : '#0B0C0E'; ctx.fillRect(0, 0, W, H)
    const es = points.map(p => p.e), ns = points.map(p => p.n)
    const minE = Math.min(...es), maxE = Math.max(...es)
    const minN = Math.min(...ns), maxN = Math.max(...ns)
    const pad = 30
    const maxG = Math.max(...points.map(p => p.grade), 1e-9)
    screenPos.current = []
    points.forEach(p => {
      const bx = pad + ((p.e - minE) / (maxE - minE || 1)) * (W - pad * 2)
      const by = H - pad - ((p.n - minN) / (maxN - minN || 1)) * (H - pad * 2)
      const x = (bx - W / 2) * view.zoom + W / 2 + view.ox
      const y = (by - H / 2) * view.zoom + H / 2 + view.oy
      screenPos.current.push({ p, x, y })
      if (x < -10 || x > W + 10 || y < -10 || y > H + 10) return
      const t = p.grade / maxG
      ctx.beginPath(); ctx.arc(x, y, 3 + t * 5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${Math.round(200 + t * 55)},${Math.round(151 - t * 100)},59,${0.5 + t * 0.5})`
      ctx.fill()
    })
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.05)'
    ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2)
  }, [points, view, metal])

  function onWheel(e: React.WheelEvent) {
    setView(v => ({ ...v, zoom: Math.min(20, Math.max(0.5, v.zoom * (e.deltaY < 0 ? 1.15 : 0.87))) }))
  }
  function onPointerDown(e: React.PointerEvent) {
    panRef.current = { x: e.clientX, y: e.clientY, ox: view.ox, oy: view.oy }
  }
  function onPointerMove(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect()
    if (panRef.current) {
      const { x, y, ox, oy } = panRef.current
      setView(v => ({ ...v, ox: ox + e.clientX - x, oy: oy + e.clientY - y }))
      return
    }
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const hit = screenPos.current.find(s => (s.x - mx) ** 2 + (s.y - my) ** 2 < 64)
    setHover(hit ? { p: hit.p, x: mx, y: my } : null)
  }

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: 320, borderRadius: 10, cursor: panRef.current ? 'grabbing' : 'crosshair', touchAction: 'none' }}
        onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={() => { panRef.current = null }} onPointerLeave={() => { panRef.current = null; setHover(null) }} />
      {hover && (
        <div style={{ position: 'absolute', left: hover.x + 12, top: hover.y - 10, background: 'var(--bg-3)', border: '1px solid var(--sep-o)', borderRadius: 6, padding: '6px 10px', fontSize: 11, pointerEvents: 'none', boxShadow: 'var(--s-sm)', whiteSpace: 'nowrap', zIndex: 5 }}>
          <div style={{ fontWeight: 700 }}>{hover.p.id}</div>
          <div style={{ color: 'var(--label-3)' }}>E {hover.p.e.toLocaleString()} · N {hover.p.n.toLocaleString()}{hover.p.z ? ` · Z ${hover.p.z}` : ''}</div>
          {hover.p.grade > 0 && <div style={{ color: 'var(--gold)' }}>{metal.toUpperCase()}: {hover.p.grade.toFixed(3)}</div>}
        </div>
      )}
      <div style={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 6 }}>
        <button className="btn-icon" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => setView({ zoom: 1, ox: 0, oy: 0 })}>Reset view</button>
        <button className="btn-icon" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => {
          const a = document.createElement('a')
          a.download = 'collar-map.png'
          a.href = canvasRef.current!.toDataURL('image/png')
          a.click()
        }}>⬇ PNG</button>
      </div>
    </div>
  )
}

function GradeHistogram({ points, metal }: { points: CollarPoint[]; metal: Metal }) {
  const vals = points.map(p => p.grade).filter(v => v > 0)
  if (!vals.length) return <div style={{ padding: 20, color: 'var(--label-4)', fontSize: 13, textAlign: 'center' }}>No {metal.toUpperCase()} grades available.</div>
  const max = Math.max(...vals)
  const bins = 10, binSize = max / bins
  const hist = Array(bins).fill(0)
  vals.forEach(v => { hist[Math.min(Math.floor(v / binSize), bins - 1)]++ })
  const maxCount = Math.max(...hist)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100, padding: '8px 4px' }}>
      {hist.map((count, i) => (
        <div key={i} title={`${(i * binSize).toFixed(2)}–${((i + 1) * binSize).toFixed(2)}: ${count} holes`}
          style={{ flex: 1, background: `rgba(200,151,59,${0.3 + (count / maxCount) * 0.7})`, height: maxCount > 0 ? `${(count / maxCount) * 100}%` : 4, borderRadius: 3, minHeight: 4 }} />
      ))}
    </div>
  )
}

export default function VisualizationPage() {
  const ctx = useAppContext()
  const [tableId, setTableId] = useState('')
  const [metal, setMetal] = useState<Metal>('au')
  if (!ctx) return null
  const { project } = ctx

  if (!project) return (
    <div className="content content-pad" style={{ textAlign: 'center', color: 'var(--label-4)', fontSize: 13, paddingTop: 80 }}>Select a project to visualise.</div>
  )

  const tables = DB.getTables(project.id)
  // any file with East+North mapped can be plotted (incl. Result Files)
  const plottable = tables.filter(t => { const inv = invertColMapping(t.columns); return inv.easting && inv.northing })
  const active = plottable.find(t => t.id === tableId) ?? plottable.find(t => t.type === 'collar') ?? plottable[0]
  const points = active ? buildPoints(project.id, active, metal) : []

  return (
    <div className="content content-pad">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, flex: 1 }}>Visualisation</h2>
        <select className="input" style={{ fontSize: 12 }} value={active?.id ?? ''} onChange={e => setTableId(e.target.value)}>
          {plottable.length === 0 && <option value="">No files with coordinates</option>}
          {plottable.map(t => <option key={t.id} value={t.id}>{t.name} ({t.row_count.toLocaleString()} rows)</option>)}
        </select>
        <select className="input" style={{ fontSize: 12 }} value={metal} onChange={e => setMetal(e.target.value as Metal)}>
          <option value="au">Gold (Au)</option>
          <option value="cu">Copper (Cu)</option>
          <option value="ag">Silver (Ag)</option>
        </select>
      </div>
      {points.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--label-4)', fontSize: 13, padding: 40 }}>No rows with valid coordinates in the selected file.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 10 }}>2D Collar Map · {points.length} holes · scroll to zoom, drag to pan, hover for details</div>
            <CollarMap points={points} metal={metal} />
          </div>
          <div className="card">
            <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 4 }}>{metal.toUpperCase()} Grade Distribution</div>
            <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 8 }}>{points.filter(p => p.grade > 0).length} holes with grade data</div>
            <GradeHistogram points={points} metal={metal} />
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: `Max ${metal.toUpperCase()}`, val: Math.max(...points.map(p => p.grade), 0).toFixed(3) },
                { label: `Mean ${metal.toUpperCase()}`, val: (points.reduce((a, p) => a + p.grade, 0) / (points.length || 1)).toFixed(3) },
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
