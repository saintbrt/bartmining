'use client'

import { useMemo, useState } from 'react'
import { DB, exportCsv } from '@/lib/goldpass/db'
import { exportExcel, detectColType } from '@/lib/goldpass/db/helpers'
import { notify } from '@/lib/goldpass/notify'
import type { Project, TableMeta, TableRow } from '@/lib/goldpass/db'

interface Props { table: TableMeta; project: Project; user: { email: string }; onBack: () => void; onRefresh: () => void }

const PAGE = 500
const FILE_TYPES = ['collar', 'assay', 'survey', 'lithology', 'child', 'merged', 'other']
const COL_MEANINGS: { value: string; label: string }[] = [
  { value: 'hole_id', label: 'Hole ID' }, { value: 'easting', label: 'East' }, { value: 'northing', label: 'North' },
  { value: 'elevation', label: 'Elevation' }, { value: 'from', label: 'From depth' }, { value: 'to', label: 'To depth' },
  { value: 'au', label: 'Gold grade' }, { value: 'cu', label: 'Copper grade' }, { value: 'ag', label: 'Silver grade' },
  { value: 'depth', label: 'Depth' }, { value: 'dip', label: 'Dip' }, { value: 'azimuth', label: 'Azimuth' },
  { value: 'lithology', label: 'Rock type' }, { value: 'other', label: '(no special meaning)' },
]

export default function TableEditorPage({ table: initialTable, project, user, onBack, onRefresh }: Props) {
  const [table, setTable] = useState(initialTable)
  const [filter, setFilter] = useState('')
  const [colFilters, setColFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<{ col: string; dir: 'asc' | 'desc' } | null>(null)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [editing, setEditing] = useState<{ row: number; col: string; value: string } | null>(null)
  const [shown, setShown] = useState(PAGE)
  const [panel, setPanel] = useState<'none' | 'columns' | 'versions'>('none')
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => void } | null>(null)
  const [tick, setTick] = useState(0)
  const bump = () => { setTick(t => t + 1); onRefresh() }

  const allRows = DB.getRows(table.id, 0) as TableRow[]
  const headers = useMemo(() => {
    const set = new Set<string>(Object.keys(table.columns))
    allRows.slice(0, 50).forEach(r => Object.keys(r).forEach(k => set.add(k)))
    return [...set]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.id, tick, allRows.length])
  const visible = headers.filter(h => !hidden.has(h))

  /* filtering keeps the ORIGINAL row index so edits/deletes hit the right row */
  const indexed = useMemo(() => {
    let out = allRows.map((r, i) => ({ r, i }))
    const f = filter.trim().toLowerCase()
    if (f) out = out.filter(({ r }) => Object.values(r).some(v => String(v ?? '').toLowerCase().includes(f)))
    Object.entries(colFilters).forEach(([col, val]) => {
      const cf = val.trim().toLowerCase()
      if (cf) out = out.filter(({ r }) => String(r[col] ?? '').toLowerCase().includes(cf))
    })
    if (sort) {
      const { col, dir } = sort
      out = [...out].sort((a, b) => {
        const av = a.r[col], bv = b.r[col]
        const an = parseFloat(String(av)), bn = parseFloat(String(bv))
        const cmp = !isNaN(an) && !isNaN(bn) ? an - bn : String(av ?? '').localeCompare(String(bv ?? ''))
        return dir === 'asc' ? cmp : -cmp
      })
    }
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRows, filter, colFilters, sort, tick])

  const display = indexed.slice(0, shown)

  function save(newRows: TableRow[], op: string, detail: string) {
    DB.replaceRows(table.id, newRows, user.email, op, detail)
    setChecked(new Set()); bump()
  }

  function commitCell() {
    if (!editing) return
    const { row, col, value } = editing
    const rows = allRows.slice()
    if (String(rows[row]?.[col] ?? '') !== value) {
      rows[row] = { ...rows[row], [col]: value }
      save(rows, 'edit_cell', `Edited ${col} on row ${row + 1} of "${table.name}"`)
      notify('success', 'Cell updated.')
    }
    setEditing(null)
  }

  function deleteChecked() {
    const rows = allRows.filter((_, i) => !checked.has(i))
    save(rows, 'delete_rows', `Deleted ${checked.size} row(s) from "${table.name}"`)
    notify('success', `Deleted ${checked.size} row(s).`)
  }

  function addRow() {
    const blank: TableRow = {}
    headers.forEach(h => { blank[h] = '' })
    save([...allRows, blank], 'add_row', `Added a row to "${table.name}"`)
    setShown(s => Math.max(s, allRows.length + 1))
    notify('info', 'Empty row added at the bottom — double-click its cells to fill it in.')
  }

  function renameColumn(oldName: string, newName: string) {
    const n = newName.trim()
    if (!n || n === oldName || headers.includes(n)) { if (headers.includes(n)) notify('warn', `A column called "${n}" already exists.`); return }
    const cols: Record<string, string> = {}
    Object.entries(table.columns).forEach(([c, role]) => { cols[c === oldName ? n : c] = role })
    if (!(oldName in table.columns)) cols[n] = detectColType(n)
    const rows = allRows.map(r => { const nr: TableRow = {}; Object.keys(r).forEach(k => { nr[k === oldName ? n : k] = r[k] }); return nr })
    DB.setTableColumns(table.id, cols, rows, user.email, `Renamed column "${oldName}" to "${n}" in "${table.name}"`)
    setTable(t => ({ ...t, columns: cols })); bump()
  }

  function setMeaning(col: string, role: string) {
    const cols = { ...table.columns, [col]: role }
    DB.setTableColumns(table.id, cols, null, user.email, `Set meaning of "${col}" to ${role} in "${table.name}"`)
    setTable(t => ({ ...t, columns: cols })); bump()
  }

  function renameFile() {
    const n = window.prompt('Rename file:', table.name)
    if (!n?.trim() || n.trim() === table.name) return
    DB.renameTable(table.id, n.trim(), user.email)
    setTable(t => ({ ...t, name: n.trim() })); bump()
  }

  async function restore(versionId: string, when: string) {
    const ok = await DB.restoreVersion(table.id, versionId, user.email)
    if (ok) { notify('success', `Restored the version from ${when}.`); bump() }
  }

  const versions = DB.getVersions(table.id)

  return (
    <div className="content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* header */}
      <div style={{ padding: '10px 20px', background: 'var(--bg-2)', borderBottom: '1px solid var(--sep)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
        <div style={{ fontWeight: 600, fontSize: 14, cursor: 'pointer' }} title="Click to rename" onClick={renameFile}>{table.name} ✎</div>
        <select className="input" style={{ fontSize: 11, padding: '3px 8px' }} value={table.type}
          onChange={e => { DB.setTableType(table.id, e.target.value, user.email); setTable(t => ({ ...t, type: e.target.value })); bump() }}>
          {FILE_TYPES.map(t => <option key={t} value={t}>{t === 'child' ? 'result file' : t}</option>)}
        </select>
        <div style={{ fontSize: 12, color: 'var(--label-3)' }}>{allRows.length.toLocaleString()} rows</div>
        <div style={{ flex: 1 }} />
        <input className="input" style={{ width: 170, fontSize: 12, padding: '5px 10px' }} placeholder="Search all columns…" value={filter} onChange={e => setFilter(e.target.value)} />
        <button className="btn btn-secondary btn-sm" onClick={() => setPanel(panel === 'columns' ? 'none' : 'columns')}>Columns</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setPanel(panel === 'versions' ? 'none' : 'versions')}>History ({versions.length})</button>
        <button className="btn btn-secondary btn-sm" onClick={addRow}>+ Row</button>
        {checked.size > 0 && (
          <button className="btn btn-sm btn-danger" onClick={() => setConfirm({ msg: `Delete ${checked.size} selected row(s)? A version is saved first — you can restore.`, fn: deleteChecked })}>
            Delete {checked.size} selected
          </button>
        )}
        <button className="btn btn-secondary btn-sm" onClick={() => exportCsv(allRows as Record<string, unknown>[], table.name + '.csv')}>CSV</button>
        <button className="btn btn-secondary btn-sm" onClick={() => exportExcel(allRows as Record<string, unknown>[], table.name)}>Excel</button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* table */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {display.length > 0 ? (
            <>
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 30 }}>
                      <input type="checkbox" checked={display.length > 0 && display.every(({ i }) => checked.has(i))}
                        onChange={e => setChecked(e.target.checked ? new Set(display.map(({ i }) => i)) : new Set())} />
                    </th>
                    {visible.map(h => (
                      <th key={h} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                        onClick={() => setSort(s => s?.col !== h ? { col: h, dir: 'asc' } : s.dir === 'asc' ? { col: h, dir: 'desc' } : null)}>
                        {h}{sort?.col === h ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
                        {table.columns[h] && table.columns[h] !== 'other' && <span style={{ fontSize: 9, color: 'var(--gold)', marginLeft: 4 }}>{table.columns[h]}</span>}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th />
                    {visible.map(h => (
                      <th key={h} style={{ padding: '2px 6px' }}>
                        <input className="input" style={{ width: '100%', minWidth: 60, fontSize: 10, padding: '2px 6px' }} placeholder="filter"
                          value={colFilters[h] ?? ''} onChange={e => setColFilters(p => ({ ...p, [h]: e.target.value }))} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {display.map(({ r, i }) => (
                    <tr key={i} style={checked.has(i) ? { background: 'rgba(0,122,255,.06)' } : undefined}>
                      <td><input type="checkbox" checked={checked.has(i)} onChange={() => setChecked(p => { const n = new Set(p); if (n.has(i)) n.delete(i); else n.add(i); return n })} /></td>
                      {visible.map(h => (
                        <td key={h} onDoubleClick={() => setEditing({ row: i, col: h, value: String(r[h] ?? '') })} style={{ cursor: 'text' }}>
                          {editing?.row === i && editing.col === h ? (
                            <input className="input" autoFocus style={{ fontSize: 11, padding: '2px 6px', minWidth: 80 }}
                              value={editing.value}
                              onChange={e => setEditing({ ...editing, value: e.target.value })}
                              onBlur={commitCell}
                              onKeyDown={e => { if (e.key === 'Enter') commitCell(); if (e.key === 'Escape') setEditing(null) }} />
                          ) : String(r[h] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {indexed.length > shown && (
                <div style={{ padding: 12, textAlign: 'center' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShown(s => s + PAGE)}>Show next {Math.min(PAGE, indexed.length - shown).toLocaleString()} rows ({(indexed.length - shown).toLocaleString()} remaining)</button>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--label-4)' }}>No rows match your filters.</div>
          )}
        </div>

        {/* side panels */}
        {panel === 'columns' && (
          <div style={{ width: 300, borderLeft: '1px solid var(--sep)', overflowY: 'auto', padding: 14, background: 'var(--bg-2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Columns</div>
            <p style={{ fontSize: 10.5, color: 'var(--label-4)', marginBottom: 12, lineHeight: 1.5 }}>The meaning tells GoldPass what each column is — it powers connection lines, checks and outputs.</p>
            {headers.map(h => (
              <div key={h} style={{ marginBottom: 12, padding: 10, background: 'var(--bg-3)', borderRadius: 8, border: '1px solid var(--sep)' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                  <input className="input" style={{ flex: 1, fontSize: 11, padding: '3px 8px' }} defaultValue={h} key={h}
                    onKeyDown={e => { if (e.key === 'Enter') renameColumn(h, (e.target as HTMLInputElement).value) }}
                    onBlur={e => renameColumn(h, e.target.value)} />
                  <button className="btn-icon" style={{ fontSize: 10, padding: '2px 7px' }} title={hidden.has(h) ? 'Show column' : 'Hide column'}
                    onClick={() => setHidden(p => { const n = new Set(p); if (n.has(h)) n.delete(h); else n.add(h); return n })}>{hidden.has(h) ? '◌' : '👁'}</button>
                </div>
                <select className="input" style={{ width: '100%', fontSize: 11, padding: '3px 8px' }} value={table.columns[h] ?? 'other'} onChange={e => setMeaning(h, e.target.value)}>
                  {COL_MEANINGS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}

        {panel === 'versions' && (
          <div style={{ width: 300, borderLeft: '1px solid var(--sep)', overflowY: 'auto', padding: 14, background: 'var(--bg-2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>History</div>
            <p style={{ fontSize: 10.5, color: 'var(--label-4)', marginBottom: 12, lineHeight: 1.5 }}>Every change is saved as a version. Restoring brings the rows back exactly as they were (and is itself a new version, so nothing is ever lost).</p>
            {versions.length === 0 && <div style={{ fontSize: 11, color: 'var(--label-4)' }}>No versions yet.</div>}
            {versions.map(v => {
              const when = new Date(v.created_at).toLocaleString()
              return (
                <div key={v.id} style={{ marginBottom: 8, padding: 10, background: 'var(--bg-3)', borderRadius: 8, border: '1px solid var(--sep)' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600 }}>{v.operation.replace(/_/g, ' ')}</div>
                  <div style={{ fontSize: 10, color: 'var(--label-4)', margin: '3px 0 8px' }}>{when} · {v.row_count.toLocaleString()} rows</div>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: 10, padding: '2px 9px' }}
                    onClick={() => setConfirm({ msg: `Restore "${table.name}" to the version from ${when}? Current rows are saved as a version first.`, fn: () => restore(v.id, when) })}>
                    Restore this version
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {confirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'grid', placeItems: 'center', zIndex: 999 }}
          onKeyDown={e => { if (e.key === 'Escape') setConfirm(null) }}>
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--sep)', borderRadius: 12, padding: 28, width: 360, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Confirm</div>
            <div style={{ fontSize: 13, color: 'var(--label-2)', marginBottom: 20, lineHeight: 1.5 }}>{confirm.msg}</div>
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
