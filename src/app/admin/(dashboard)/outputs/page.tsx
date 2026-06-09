'use client'

import { useAppContext } from '@/lib/goldpass/AppContext'
import { DB, exportCsv } from '@/lib/goldpass/db'

export default function OutputsPage() {
  const ctx = useAppContext()
  if (!ctx || !ctx.user) return null
  const { project, user, refresh } = ctx

  if (!project) return (
    <div className="content content-pad" style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--label-3)', fontSize: 13 }}>Select a project to view outputs.</div>
    </div>
  )

  const outputs = DB.getOutputs(project.id)
  const tables = DB.getTables(project.id)

  function buildAndExport() {
    const collar = tables.find(t => t.type === 'collar')
    const assay = tables.find(t => t.type === 'assay')
    if (!collar || !assay) { alert('Need both a collar and assay table to build collar output.'); return }
    const cRows = DB.getRows(collar.id, 0)
    const aRows = DB.getRows(assay.id, 0)
    const hC = Object.entries(collar.columns).find(([, v]) => v === 'hole_id')?.[0]
    const hA = Object.entries(assay.columns).find(([, v]) => v === 'hole_id')?.[0]
    const auC = Object.entries(assay.columns).find(([, v]) => v === 'au')?.[0]
    if (!hC || !hA || !auC) { alert('Map Hole ID and Au columns in collar and assay tables first.'); return }
    const maxAu: Record<string, number> = {}
    aRows.forEach(r => { const id = String(r[hA] ?? '').trim(); if (!id) return; const v = parseFloat(String(r[auC] ?? '')); if (!isNaN(v)) maxAu[id] = id in maxAu ? Math.max(maxAu[id], v) : v })
    const out = cRows.map(r => { const id = String(r[hC] ?? '').trim(); if (!id) return null; return { HoleID: id, MaxAu_gpt: id in maxAu ? Number(maxAu[id]).toFixed(3) : '' } }).filter(Boolean) as Record<string, unknown>[]
    DB.addOutput(project!.id, `collar_output_${new Date().toISOString().slice(0, 10)}`, out as { [k: string]: unknown }[], 'csv', user!.email)
    refresh()
  }

  return (
    <div className="content content-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Outputs</h2>
        <button className="btn btn-primary btn-sm" onClick={buildAndExport}>Build collar output</button>
      </div>
      {outputs.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--label-4)', fontSize: 13 }}>No outputs yet. Approve all 3 stages then build a collar output here.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {outputs.map(o => (
            <div key={o.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{o.name}</div>
                <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 3 }}>{o.format?.toUpperCase()} · {(o.row_count ?? o.rows ?? 0).toLocaleString()} rows · {new Date(o.created_at).toLocaleString()}</div>
              </div>
              <span className="badge badge-green">{o.format}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
