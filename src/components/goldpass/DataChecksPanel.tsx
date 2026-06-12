'use client'

import { useState } from 'react'
import { DB } from '@/lib/goldpass/db'
import { invertColMapping } from '@/lib/goldpass/db/helpers'
import { CHECK_DEFS, CLEAN_DEFS, ANALYSIS_DEFS, runCheck, applyFix } from '@/lib/goldpass/dataChecks'
import type { TableMeta, TableRow } from '@/lib/goldpass/db'
import type { CheckDef, CheckResult } from '@/lib/goldpass/dataChecks'

interface Props {
  stage: 'validation' | 'cleaning' | 'analysis'
  table: TableMeta | null
  tables?: TableMeta[]
  project: { id: string }
  user: { email: string }
  onRefresh: () => void
}

export default function DataChecksPanel({ stage, table, tables = [], project, user, onRefresh }: Props) {
  const [results, setResults] = useState<Record<string, CheckResult>>({})
  const [running, setRunning] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [compareIds, setCompareIds] = useState<Record<string, string>>({})

  const defs: CheckDef[] = stage === 'validation' ? CHECK_DEFS : stage === 'cleaning' ? CLEAN_DEFS : ANALYSIS_DEFS
  const otherTables = tables.filter(t => t.id !== table?.id)

  async function handleRun(def: CheckDef) {
    if (!table) return
    setRunning(def.id)
    const rows = DB.getRows(table.id, 0) as TableRow[]
    const invMap = invertColMapping(table.columns)
    let compare: { rows: TableRow[]; invMap: Record<string, string>; columns?: Record<string, string> } | undefined
    if (def.needsCompare) {
      const cmpId = compareIds[def.id] ?? otherTables[0]?.id
      const cmpMeta = tables.find(tm => tm.id === cmpId)
      if (cmpMeta) compare = { rows: DB.getRows(cmpMeta.id, 0) as TableRow[], invMap: invertColMapping(cmpMeta.columns), columns: cmpMeta.columns }
    }
    const result = runCheck(def, rows, invMap, compare, table.columns)
    setResults(prev => ({ ...prev, [def.id]: result }))
    setRunning(null)
    setExpanded(def.id)
  }

  async function handleFix(def: CheckDef) {
    if (!table) return
    const rows = DB.getRows(table.id, 0) as TableRow[]
    const invMap = invertColMapping(table.columns)
    const fixed = applyFix(def, rows, invMap)
    DB.replaceRows(table.id, fixed, user.email, def.id, `Applied fix: ${def.fixLabel ?? def.label}`)
    onRefresh()
    const newResult = runCheck(def, fixed, invMap)
    setResults(prev => ({ ...prev, [def.id]: newResult }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {!table && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--label-4)', fontSize: 13 }}>Select a file to run data checks.</div>
      )}
      {defs.map(def => {
        const res = results[def.id]
        const isExpanded = expanded === def.id
        return (
          <div key={def.id} style={{ background: 'var(--bg-3)', borderRadius: 8, border: '1px solid var(--sep)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', cursor: 'pointer' }} onClick={() => setExpanded(isExpanded ? null : def.id)}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{def.label}</div>
                {def.needsCompare && otherTables.length > 0 && (
                  <select className="input" style={{ fontSize: 11, padding: '3px 6px', marginTop: 4 }}
                    value={compareIds[def.id] ?? otherTables[0].id}
                    onClick={e => e.stopPropagation()}
                    onChange={e => setCompareIds(prev => ({ ...prev, [def.id]: e.target.value }))}>
                    {otherTables.map(tm => <option key={tm.id} value={tm.id}>vs {tm.name}</option>)}
                  </select>
                )}
                {def.needsCompare && otherTables.length === 0 && (
                  <div style={{ fontSize: 11, color: 'var(--label-4)', marginTop: 2 }}>Needs a second table to compare against.</div>
                )}
                {res && <div style={{ fontSize: 11, color: res.count > 0 ? 'var(--orange)' : 'var(--green)', marginTop: 2 }}>{res.summary}</div>}
              </div>
              {table && (
                <button className="btn btn-secondary btn-sm" style={{ padding: '3px 10px', fontSize: 11 }}
                  onClick={e => { e.stopPropagation(); handleRun(def) }} disabled={running === def.id}>
                  {running === def.id ? '…' : 'Run'}
                </button>
              )}
              {res && def.fixable && res.count > 0 && (
                <button className="btn btn-sm" style={{ padding: '3px 10px', fontSize: 11, background: 'var(--orange)', color: '#fff', border: 'none' }}
                  onClick={e => { e.stopPropagation(); handleFix(def) }}>
                  Fix
                </button>
              )}
            </div>
            {isExpanded && res && res.issues.length > 0 && (
              <div style={{ borderTop: '1px solid var(--sep)', padding: 12, maxHeight: 200, overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 11, color: 'var(--label-4)', flex: 1 }}>First {Math.min(res.issues.length, 50)} of {res.issues.length} issues</div>
                  {stage === 'analysis' && table && (
                    <button className="btn btn-secondary btn-sm" style={{ fontSize: 10, padding: '2px 8px' }}
                      onClick={() => {
                        const clean = res.issues.map(r => { const nr: TableRow = {}; Object.keys(r).filter(k => !k.startsWith('_')).forEach(k => { nr[k] = r[k] }); return nr })
                        DB.createChildTable(project.id, `${def.label} – ${table.name}`, clean, [table.id], user.email)
                        onRefresh()
                      }}>
                      Save as table
                    </button>
                  )}
                </div>
                <table className="tbl" style={{ fontSize: 11 }}>
                  <thead>
                    <tr>{Object.keys(res.issues[0]).filter(k => !k.startsWith('_')).slice(0, 6).map(k => <th key={k}>{k}</th>)}</tr>
                  </thead>
                  <tbody>
                    {res.issues.slice(0, 50).map((row, i) => (
                      <tr key={i}>{Object.keys(res.issues[0]).filter(k => !k.startsWith('_')).slice(0, 6).map(k => <td key={k}>{String(row[k] ?? '')}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
