'use client'

import { useState } from 'react'
import { useAppContext } from '@/lib/goldpass/AppContext'
import { DB } from '@/lib/goldpass/db'
import { invertColMapping, exportExcel } from '@/lib/goldpass/db/helpers'
import { notify } from '@/lib/goldpass/notify'
import type { TableRow } from '@/lib/goldpass/db'

export default function OutputsPage() {
  const ctx = useAppContext()
  const [collarId, setCollarId] = useState('')
  const [intervalId, setIntervalId] = useState('')
  const [preview, setPreview] = useState<TableRow[] | null>(null)
  const [previewName, setPreviewName] = useState('collar_output')
  const [saveAsId, setSaveAsId] = useState('')
  const [ppmIds, setPpmIds] = useState<string[]>([])
  if (!ctx || !ctx.user) return null
  const { project, user, refresh } = ctx

  if (!project) return (
    <div className="content content-pad" style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--label-3)', fontSize: 13 }}>Select a project to view outputs.</div>
    </div>
  )

  const outputs = DB.getOutputs(project.id)
  const tables = DB.getTables(project.id)
  const collarTables = tables.filter(t => t.type === 'collar')
  const intervalTables = tables.filter(t => t.type === 'assay')
  const collar = tables.find(t => t.id === collarId) ?? (collarTables.length === 1 ? collarTables[0] : undefined)
  const interval = tables.find(t => t.id === intervalId) ?? (intervalTables.length === 1 ? intervalTables[0] : undefined)

  async function buildPreview() {
    if (!collarId && collarTables.length > 1) { notify('warn', 'Multiple collar files found — pick which one to use.'); return }
    if (!intervalId && intervalTables.length > 1) { notify('warn', 'Multiple interval files found — pick which one to use.'); return }
    if (!collar || !interval) { notify('warn', 'Pick a collar file and an interval file first.'); return }
    const intInv = invertColMapping(interval.columns)
    if (!intInv.from || !intInv.to) { notify('warn', `"${interval.name}" has no From/To depth columns mapped — pick an interval file (assay, survey or lithology) or fix its column meanings in Open → Columns.`); return }
    const res = await DB.rpcBuildCollarOutput(collar.id, interval.id)
    if (!res) return
    if (res.error) { notify('error', res.error, 'GP-2303'); return }
    if (!res.rows.length) { notify('info', 'Collar output produced no rows — check the Hole ID mapping on both files.'); return }
    setPreviewName('collar_output')
    setPreview(res.rows)
  }

  function togglePpm(id: string) {
    setPpmIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function buildPpmPreview() {
    if (!ppmIds.length) { notify('warn', 'Pick one or more cleaned files with Hole ID, From, To and a grade column mapped.'); return }
    const res = await DB.rpcBuildPpmOutput(ppmIds)
    if (!res) return
    if (res.error) { notify('error', res.error, 'GP-2303'); return }
    if (!res.rows.length) { notify('info', 'No rows produced — check Hole ID/From/To/grade column mappings on the selected files.'); return }
    setPreviewName('ppm_summary')
    setPreview(res.rows)
  }

  function saveOutput(rows: TableRow[], name: string) {
    const o = DB.addOutput(project!.id, name, rows, 'csv', user!.email)
    if (o) notify('success', `Output "${o.name}" built and saved — ${o.row_count.toLocaleString()} rows.`)
    setPreview(null)
    refresh()
  }

  function saveResultFileAsOutput() {
    const t = tables.find(x => x.id === saveAsId)
    if (!t) return
    const rows = DB.getRows(t.id, 0)
    if (!rows.length) { notify('warn', `"${t.name}" has no rows.`); return }
    saveOutput(rows, t.name)
  }

  return (
    <div className="content content-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Outputs</h2>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Build collar output</div>
        <p style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 14 }}>One row per collar hole, joined with per-hole grade statistics (max/avg Au, Cu, Ag), interval counts and max depth from the chosen interval file. You'll see a preview before anything is saved.</p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select className="input" style={{ fontSize: 12 }} value={collar?.id ?? ''} onChange={e => setCollarId(e.target.value)}>
            <option value="">Collar file…</option>
            {tables.map(t => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
          </select>
          <span style={{ fontSize: 12, color: 'var(--label-4)' }}>joined with</span>
          <select className="input" style={{ fontSize: 12 }} value={interval?.id ?? ''} onChange={e => setIntervalId(e.target.value)}>
            <option value="">Interval file…</option>
            {tables.map(t => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={buildPreview} disabled={!collar || !interval}>Preview output</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Build PPM summary (HOLEID / MFRO / MTO / MAXIMUMPPM)</div>
        <p style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 14 }}>One row per hole, peak-grade interval, pooled across the cleaned files you select below.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
          {tables.map(t => (
            <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, background: 'var(--bg-3)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={ppmIds.includes(t.id)} onChange={() => togglePpm(t.id)} />
              {t.name} ({t.type === 'child' ? 'result file' : t.type})
            </label>
          ))}
        </div>
        <button className="btn btn-primary btn-sm" onClick={buildPpmPreview} disabled={!ppmIds.length}>Preview PPM summary</button>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Save a workbench file as an output</div>
        <p style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 14 }}>Any file — including Result Files made on the workbench — can be stored as a downloadable output.</p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select className="input" style={{ fontSize: 12 }} value={saveAsId} onChange={e => setSaveAsId(e.target.value)}>
            <option value="">Choose a file…</option>
            {tables.map(t => <option key={t.id} value={t.id}>{t.name} ({t.type === 'child' ? 'result file' : t.type} · {t.row_count.toLocaleString()} rows)</option>)}
          </select>
          <button className="btn btn-secondary btn-sm" onClick={saveResultFileAsOutput} disabled={!saveAsId}>Save as output</button>
        </div>
      </div>

      {preview && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>Preview — {preview.length.toLocaleString()} rows, {Object.keys(preview[0]).length} columns (showing first 20)</div>
            <button className="btn btn-secondary btn-sm" onClick={() => setPreview(null)}>Discard</button>
            <button className="btn btn-primary btn-sm" onClick={() => saveOutput(preview, `${previewName}_${new Date().toISOString().slice(0, 10)}`)}>Save output</button>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 320 }}>
            <table className="tbl tbl-card" style={{ fontSize: 11 }}>
              <thead><tr>{Object.keys(preview[0]).map(k => <th key={k}>{k}</th>)}</tr></thead>
              <tbody>{preview.slice(0, 20).map((r, i) => <tr key={i}>{Object.keys(preview[0]).map(k => <td key={k} data-label={k}>{String(r[k] ?? '')}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {outputs.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--label-4)', fontSize: 13 }}>No outputs yet. Built outputs are stored in the database and can be re-downloaded any time.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {outputs.map(o => (
            <div key={o.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{o.name}</div>
                <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 3 }}>{(o.row_count ?? 0).toLocaleString()} rows · {new Date(o.created_at).toLocaleString()}</div>
              </div>
              <button className="btn-icon" style={{ fontSize: 11 }} title="Rename"
                onClick={() => { const n = window.prompt('Rename output:', o.name); if (n?.trim()) { DB.renameOutput(o.id, project.id, n); refresh() } }}>✎</button>
              <button className="btn btn-secondary btn-sm" onClick={() => DB.downloadOutput(o)}>⬇ CSV</button>
              <button className="btn btn-secondary btn-sm" onClick={async () => {
                const { createClient } = await import('@/lib/goldpass/supabase/client')
                const { data, error } = await createClient().from('outputs').select('data').eq('id', o.id).single()
                if (error || !data?.data?.length) { notify('error', `Could not load rows for "${o.name}".`, 'GP-2502'); return }
                exportExcel(data.data as Record<string, unknown>[], o.name)
              }}>⬇ Excel</button>
              <button className="btn-icon" style={{ fontSize: 11, color: 'var(--red)' }} title="Delete"
                onClick={() => { if (window.confirm(`Delete output "${o.name}"? This cannot be undone.`)) { DB.deleteOutput(o.id, project.id); notify('info', `Deleted output "${o.name}".`); refresh() } }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
