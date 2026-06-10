'use client'

import { useState } from 'react'
import { DB, exportCsv } from '@/lib/goldpass/db'
import type { Project, TableMeta, TableRow } from '@/lib/goldpass/db'

interface Props { table: TableMeta; project: Project; user: { email: string }; onBack: () => void; onRefresh: () => void }

export default function TableEditorPage({ table, project, user, onBack, onRefresh }: Props) {
  const [filter, setFilter] = useState('')
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => void } | null>(null)

  const allRows = DB.getRows(table.id, 0) as TableRow[]
  const filtered = filter
    ? allRows.filter(r => Object.values(r).some(v => String(v ?? '').toLowerCase().includes(filter.toLowerCase())))
    : allRows
  const display = filtered.slice(0, 500)
  const headers = allRows.length ? Object.keys(allRows[0]) : []

  function removeDuplicates() {
    const seen = new Set<string>(); const out: TableRow[] = []
    allRows.forEach(r => { const k = JSON.stringify(r); if (!seen.has(k)) { seen.add(k); out.push(r) } })
    DB.replaceRows(table.id, out, user.email, 'remove_duplicates', `Removed ${allRows.length - out.length} duplicate rows from "${table.name}"`)
    onRefresh(); onBack()
  }

  function removeEmptyRows() {
    const out = allRows.filter(r => !Object.values(r).every(v => v == null || String(v).trim() === ''))
    DB.replaceRows(table.id, out, user.email, 'remove_empty', `Removed ${allRows.length - out.length} empty rows from "${table.name}"`)
    onRefresh(); onBack()
  }

  return (
    <div className="content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '10px 20px', background: 'var(--bg-2)', borderBottom: '1px solid var(--sep)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{table.name}</div>
        <div style={{ fontSize: 12, color: 'var(--label-3)' }}>{allRows.length.toLocaleString()} rows</div>
        <div style={{ fontSize: 11, color: 'var(--label-4)', fontFamily: 'monospace' }}>v{DB.getVersions(table.id).length + 1}</div>
        <div style={{ flex: 1 }} />
        <input className="input" style={{ width: 180, fontSize: 12, padding: '5px 10px' }} placeholder="Filter rows…" value={filter} onChange={e => setFilter(e.target.value)} />
        <button className="btn btn-secondary btn-sm" onClick={() => setConfirm({ msg: 'Remove all duplicate rows?', fn: removeDuplicates })}>Remove duplicates</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setConfirm({ msg: 'Remove all completely empty rows?', fn: removeEmptyRows })}>Remove empty</button>
        <button className="btn btn-secondary btn-sm" onClick={() => exportCsv(allRows as Record<string, unknown>[], table.name + '.csv')}>Export CSV</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {display.length > 0 ? (
          <>
            {filtered.length > 500 && <div style={{ padding: '6px 16px', fontSize: 11, color: 'var(--label-4)', background: 'var(--bg-2)', borderBottom: '1px solid var(--sep)' }}>Showing 500 of {filtered.length.toLocaleString()} rows</div>}
            <table className="tbl">
              <thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{display.map((row, i) => <tr key={i}>{headers.map(h => <td key={h}>{String(row[h] ?? '')}</td>)}</tr>)}</tbody>
            </table>
          </>
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--label-4)' }}>No rows match your filter.</div>
        )}
      </div>

      {confirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'grid', placeItems: 'center', zIndex: 999 }}>
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--sep)', borderRadius: 12, padding: 28, width: 340, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Confirm</div>
            <div style={{ fontSize: 13, color: 'var(--label-2)', marginBottom: 20 }}>{confirm.msg}</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="btn btn-sm btn-danger" onClick={() => { confirm.fn(); setConfirm(null) }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
