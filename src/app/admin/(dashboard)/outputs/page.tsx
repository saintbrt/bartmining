'use client'

import { useState } from 'react'
import { useAppContext } from '@/lib/goldpass/AppContext'
import { DB } from '@/lib/goldpass/db'
import { invertColMapping } from '@/lib/goldpass/db/helpers'
import { buildCollarOutput } from '@/lib/goldpass/dataChecks'
import { notify } from '@/lib/goldpass/notify'

export default function OutputsPage() {
  const ctx = useAppContext()
  const [collarId, setCollarId] = useState('')
  const [intervalId, setIntervalId] = useState('')
  if (!ctx || !ctx.user) return null
  const { project, user, refresh } = ctx

  if (!project) return (
    <div className="content content-pad" style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--label-3)', fontSize: 13 }}>Select a project to view outputs.</div>
    </div>
  )

  const outputs = DB.getOutputs(project.id)
  const tables = DB.getTables(project.id)
  const collar = tables.find(t => t.id === collarId) ?? tables.find(t => t.type === 'collar')
  const interval = tables.find(t => t.id === intervalId) ?? tables.find(t => t.type === 'assay')

  function buildAndExport() {
    if (!collar || !interval) { notify('warn', 'Pick a collar table and an interval (assay/survey) table first.'); return }
    const res = buildCollarOutput(
      DB.getRows(collar.id, 0), DB.getRows(interval.id, 0),
      invertColMapping(collar.columns), invertColMapping(interval.columns),
    )
    if (res.error) { notify('error', res.error, 'GP-2303'); return }
    if (!res.rows.length) { notify('info', 'Collar output produced no rows — check the Hole ID mapping on both tables.'); return }
    const o = DB.addOutput(project!.id, `collar_output_${new Date().toISOString().slice(0, 10)}`, res.rows, 'csv', user!.email)
    if (o) notify('success', `Output "${o.name}" built and saved — ${o.row_count.toLocaleString()} rows.`)
    refresh()
  }

  return (
    <div className="content content-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Outputs</h2>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Build collar output</div>
        <p style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 14 }}>One row per collar hole, joined with per-hole grade statistics (max/avg Au, Cu, Ag), interval counts and max depth from the chosen interval table.</p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select className="input" style={{ fontSize: 12 }} value={collar?.id ?? ''} onChange={e => setCollarId(e.target.value)}>
            <option value="">Collar table…</option>
            {tables.map(t => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
          </select>
          <span style={{ fontSize: 12, color: 'var(--label-4)' }}>joined with</span>
          <select className="input" style={{ fontSize: 12 }} value={interval?.id ?? ''} onChange={e => setIntervalId(e.target.value)}>
            <option value="">Interval table…</option>
            {tables.map(t => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={buildAndExport} disabled={!collar || !interval}>Build &amp; save output</button>
        </div>
      </div>

      {outputs.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--label-4)', fontSize: 13 }}>No outputs yet. Built outputs are stored in the database and can be re-downloaded any time.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {outputs.map(o => (
            <div key={o.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{o.name}</div>
                <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 3 }}>{o.format?.toUpperCase()} · {(o.row_count ?? 0).toLocaleString()} rows · {new Date(o.created_at).toLocaleString()}</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => DB.downloadOutput(o)}>⬇ Download</button>
              <span className="badge badge-green">{o.format}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
