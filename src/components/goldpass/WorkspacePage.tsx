'use client'

import { useState } from 'react'
import { DB } from '@/lib/goldpass/db'
import { typeColor } from '@/lib/goldpass/db/helpers'
import { executeSQL } from '@/lib/goldpass/sqlEngine'
import { notify } from '@/lib/goldpass/notify'
import type { Project, TableMeta, TableRow } from '@/lib/goldpass/db'
import DataChecksPanel from './DataChecksPanel'
import UploadModal from './UploadModal'
import TableEditorPage from './TableEditorPage'

interface Props {
  stage: 'validation' | 'cleaning' | 'analysis'
  project: Project
  user: { email: string }
  tables: TableMeta[]
  onRefresh: () => void
  stageDone: boolean
  onApprove: () => void
}

export default function WorkspacePage({ stage, project, user, tables, onRefresh, stageDone, onApprove }: Props) {
  const [activeTable, setActiveTable] = useState<TableMeta | null>(tables[0] ?? null)
  const [showUpload, setShowUpload] = useState(false)
  const [editingTable, setEditingTable] = useState<TableMeta | null>(null)
  const [sqlText, setSqlText] = useState('')
  const [sqlResult, setSqlResult] = useState<{ rows?: TableRow[]; error?: string; summary?: string } | null>(null)
  const [activePanel, setActivePanel] = useState<'qc' | 'sql' | 'files'>('qc')
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiBusy, setAiBusy] = useState(false)
  const [newTableId, setNewTableId] = useState<string | null>(null)

  const rows = activeTable ? DB.getRows(activeTable.id, 500) : []

  /** Runs a statement through the workbench engine. AI-originated runs that
      return rows are saved as a new table that appears on the workbench. */
  function runStatement(sql: string, opts?: { fromAI?: boolean; note?: string; label?: string }) {
    const res = executeSQL(sql, tables, (id) => DB.getRows(id, 0))
    if ('error' in res) {
      setSqlResult({ error: `${res.error} [${res.code}]` })
      notify('error', res.error, res.code)
      return
    }
    if (res.action === 'delete') {
      if (res.removed === 0) {
        setSqlResult({ summary: `No rows matched — nothing was removed from "${res.tableName}".` })
        notify('info', `No rows matched the DELETE condition on "${res.tableName}".`)
        return
      }
      if (!window.confirm(`Remove ${res.removed.toLocaleString()} row(s) from "${res.tableName}"? A new version will be recorded.`)) {
        setSqlResult({ summary: 'Delete cancelled.' })
        return
      }
      DB.replaceRows(res.tableId, res.kept, user.email, 'sql_delete', `SQL delete removed ${res.removed.toLocaleString()} rows from "${res.tableName}"`)
      setSqlResult({ summary: `Removed ${res.removed.toLocaleString()} rows from "${res.tableName}". ${res.kept.length.toLocaleString()} remain.` })
      notify('success', `Removed ${res.removed.toLocaleString()} rows from "${res.tableName}".`)
      onRefresh()
      return
    }
    // SELECT
    if (res.rows.length === 0) {
      setSqlResult({ rows: [], summary: 'No matching values exist for this query.' })
      notify('info', opts?.note ? `No results — ${opts.note}` : 'Query ran successfully but no matching values exist.')
      return
    }
    setSqlResult({ rows: res.rows, summary: `${res.rows.length.toLocaleString()} of ${res.total.toLocaleString()} rows from ${res.sources.join(' + ')}` })
    if (opts?.fromAI) {
      const name = (opts.label ?? 'AI result').slice(0, 60)
      const meta = DB.createChildTable(project.id, name, res.rows, tables.filter(t => res.sources.includes(t.name)).map(t => t.id), user.email)
      setNewTableId(meta.id)
      setTimeout(() => setNewTableId(null), 1600)
      setActivePanel('files')
      notify('success', `File "${name}" created on the workbench — ${res.rows.length.toLocaleString()} rows.`)
      onRefresh()
    }
  }

  function runSQL() {
    if (!sqlText.trim()) return
    runStatement(sqlText)
  }

  async function askAI() {
    const q = aiQuestion.trim()
    if (!q) return
    setAiBusy(true)
    setSqlResult({ summary: 'Asking the AI driver…' })
    try {
      const res = await DB.goldAI(project.id, q)
      if (res.error || !res.sql) {
        setSqlResult({ error: res.error ?? 'AI returned no SQL.' })
        return
      }
      setSqlText(res.sql)
      const isDelete = res.sql.trim().toUpperCase().startsWith('DELETE')
      runStatement(res.sql, { fromAI: !isDelete, note: res.note, label: `AI · ${q.slice(0, 48)}` })
    } finally { setAiBusy(false) }
  }

  function handleMerge() {
    const name = window.prompt(`Merge ${tables.length} tables into a new table. Name:`, `${project.name} merged`)
    if (!name?.trim()) return
    const meta = DB.mergeTables(project.id, tables.map(t => t.id), name.trim(), user.email)
    setNewTableId(meta.id)
    setTimeout(() => setNewTableId(null), 1600)
    notify('success', `Merged ${tables.length} tables into "${meta.name}" — ${meta.row_count.toLocaleString()} rows.`)
    onRefresh()
  }

  if (editingTable) {
    return <TableEditorPage table={editingTable} project={project} user={user} onBack={() => { setEditingTable(null); onRefresh() }} onRefresh={onRefresh} />
  }

  if (tables.length === 0) {
    return (
      <div className="content content-pad" style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 380 }}>
          <div style={{ fontSize: 36, opacity: .15, marginBottom: 16 }}>◆</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>No tables yet</div>
          <p style={{ fontSize: 13, color: 'var(--label-3)', marginBottom: 24, lineHeight: 1.6 }}>Upload your drill data files to begin {stage}. Supported: collar, assay, survey, lithology.</p>
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>Upload drill data</button>
        </div>
        {showUpload && <UploadModal project={project} user={user} onClose={() => setShowUpload(false)} onImported={() => { setShowUpload(false); onRefresh() }} />}
      </div>
    )
  }

  return (
    <div className="content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '10px 24px', background: 'var(--bg-2)', borderBottom: '1px solid var(--sep)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, fontSize: 13, color: 'var(--label-2)' }}>
          Stage: <strong style={{ textTransform: 'capitalize' }}>{stage}</strong>
          {stageDone && <span className="badge badge-green" style={{ marginLeft: 8 }}>Done</span>}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowUpload(true)}>+ Upload</button>
        {!stageDone && <button className="btn btn-primary btn-sm" onClick={onApprove}>Approve &amp; Continue →</button>}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 4, padding: '8px 16px', borderBottom: '1px solid var(--sep)', overflowX: 'auto' }}>
            {tables.map(t => (
              <button key={t.id} onClick={() => setActiveTable(t)} className={t.id === newTableId ? 'gp-appear' : undefined} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: activeTable?.id === t.id ? 'var(--bg-3)' : 'transparent', color: activeTable?.id === t.id ? 'var(--label-1)' : 'var(--label-3)', whiteSpace: 'nowrap' }}>
                {t.name} <span style={{ opacity: .5 }}>({t.row_count.toLocaleString()})</span>
              </button>
            ))}
          </div>

          {activeTable && (
            <div style={{ padding: '6px 16px', borderBottom: '1px solid var(--sep)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Object.entries(activeTable.columns).map(([col, type]) => (
                <span key={col} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,.04)', color: typeColor(type), border: `1px solid ${typeColor(type)}33` }}>{col} <span style={{ opacity: .5 }}>→ {type}</span></span>
              ))}
              <button className="btn-icon" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => activeTable && setEditingTable(activeTable)}>Edit table</button>
            </div>
          )}

          <div style={{ flex: 1, overflow: 'auto' }}>
            {activeTable && rows.length > 0 && (
              <table className="tbl">
                <thead>
                  <tr>{Object.keys(rows[0]).slice(0, 12).map(k => <th key={k}>{k}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>{Object.keys(rows[0]).slice(0, 12).map(k => <td key={k}>{String(row[k] ?? '')}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ width: 320, borderLeft: '1px solid var(--sep)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--sep)' }}>
            {(['qc', 'sql', 'files'] as const).map(p => (
              <button key={p} onClick={() => setActivePanel(p)} style={{ flex: 1, padding: '9px 0', fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: activePanel === p ? 'var(--blue)' : 'var(--label-4)', borderBottom: activePanel === p ? '2px solid var(--blue)' : '2px solid transparent' }}>{p === 'sql' ? 'Ask AI' : p === 'qc' ? 'Checks' : p}</button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            {activePanel === 'qc' && <DataChecksPanel stage={stage} table={activeTable} tables={tables} project={project} user={user} onRefresh={onRefresh} />}
            {activePanel === 'sql' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input className="input" style={{ flex: 1, fontSize: 12 }} value={aiQuestion} onChange={e => setAiQuestion(e.target.value)}
                    placeholder="Ask the AI… e.g. max gold value for each hole in these files"
                    onKeyDown={e => { if (e.key === 'Enter') askAI() }} />
                  <button className="btn btn-primary btn-sm" onClick={askAI} disabled={aiBusy}>{aiBusy ? '…' : 'Ask'}</button>
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--label-4)', lineHeight: 1.5 }}>
                  The AI writes the SQL, runs it, and saves the result as a new file on the workbench. The generated SQL appears below so you can inspect or tweak it.
                </div>
                <textarea className="input" style={{ minHeight: 100, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} value={sqlText} onChange={e => setSqlText(e.target.value)} placeholder={`SELECT * FROM ${activeTable?.name ?? 'collar'} LIMIT 20`} />
                <button className="btn btn-secondary btn-sm" onClick={runSQL}>Run SQL</button>
                {sqlResult && (
                  <div style={{ marginTop: 8 }}>
                    {sqlResult.error && <div style={{ color: 'var(--red)', fontSize: 12 }}>{sqlResult.error}</div>}
                    {sqlResult.summary && <div style={{ fontSize: 11, color: 'var(--label-3)', marginBottom: 6 }}>{sqlResult.summary}</div>}
                    {sqlResult.rows && sqlResult.rows.length > 0 && (
                      <>
                        <button className="btn btn-secondary btn-sm" style={{ fontSize: 10, padding: '2px 8px', marginBottom: 6 }}
                          onClick={() => {
                            const name = window.prompt('Save result as a new file. Name:', 'SQL result')
                            if (!name?.trim()) return
                            const meta = DB.createChildTable(project.id, name.trim(), sqlResult.rows!, activeTable ? [activeTable.id] : [], user.email)
                            setNewTableId(meta.id); setTimeout(() => setNewTableId(null), 1600)
                            notify('success', `File "${meta.name}" created — ${meta.row_count.toLocaleString()} rows.`)
                            onRefresh()
                          }}>
                          ⊕ Save as file
                        </button>
                        <div style={{ overflowX: 'auto', maxHeight: 200 }}>
                          <table className="tbl" style={{ fontSize: 11 }}>
                            <thead><tr>{Object.keys(sqlResult.rows[0]).map(k => <th key={k}>{k}</th>)}</tr></thead>
                            <tbody>{sqlResult.rows.slice(0, 50).map((r, i) => <tr key={i}>{Object.keys(sqlResult.rows![0]).map(k => <td key={k}>{String(r[k] ?? '')}</td>)}</tr>)}</tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            {activePanel === 'files' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tables.length >= 2 && (
                  <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }} onClick={handleMerge}>⊕ Merge all tables into one</button>
                )}
                {tables.map(t => (
                  <div key={t.id} className={t.id === newTableId ? 'gp-appear' : undefined} style={{ padding: '10px 12px', background: 'var(--bg-3)', borderRadius: 8, border: '1px solid var(--sep)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--label-3)', marginTop: 2 }}>{t.type} · {t.row_count.toLocaleString()} rows</div>
                    </div>
                    <button className="btn-icon" style={{ fontSize: 11 }} onClick={() => setEditingTable(t)}>Edit</button>
                    <button className="btn-icon" style={{ fontSize: 11, color: 'var(--red)' }} onClick={() => { if (window.confirm(`Delete "${t.name}"?`)) { DB.deleteTable(t.id, project.id, user.email); notify('info', `Deleted table "${t.name}".`); onRefresh() } }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showUpload && <UploadModal project={project} user={user} onClose={() => setShowUpload(false)} onImported={() => { setShowUpload(false); onRefresh() }} />}
    </div>
  )
}
