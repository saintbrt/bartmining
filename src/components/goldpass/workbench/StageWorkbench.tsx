'use client'

import { useMemo, useRef, useState } from 'react'
import { DB } from '@/lib/goldpass/db'
import { invertColMapping } from '@/lib/goldpass/db/helpers'
import { executeSQL } from '@/lib/goldpass/sqlEngine'
import { notify } from '@/lib/goldpass/notify'
import { CHECK_DEFS, CLEAN_DEFS, ANALYSIS_DEFS, runCheck, applyFix } from '@/lib/goldpass/dataChecks'
import type { CheckDef } from '@/lib/goldpass/dataChecks'
import type { Project, TableMeta, TableRow } from '@/lib/goldpass/db'
import FileCard, { CARD_W, CARD_HEADER_H, COL_ROW_H, MAX_COLS_SHOWN, cardHeight } from './FileCard'
import { findConnections, type Connection } from './findConnections'
import WorkspacePage from '../WorkspacePage'
import UploadModal from '../UploadModal'
import TableEditorPage from '../TableEditorPage'

interface Props {
  stage: 'validation' | 'cleaning' | 'analysis'
  project: Project
  user: { email: string }
  tables: TableMeta[]
  onRefresh: () => void
  stageDone: boolean
  onApprove: () => void
}

interface CardPos { x: number; y: number }

/* Plain-English actions per stage, mapped onto the data-check functions. */
const STAGE_ACTIONS: Record<Props['stage'], { id: string; label: string; minFiles: number }[]> = {
  validation: [
    { id: 'missing_hole_ids',          label: 'Find Missing Hole IDs',   minFiles: 1 },
    { id: 'find_null_placeholders',    label: 'Find Missing Values',     minFiles: 1 },
    { id: 'check_collar_completeness', label: 'Check Coordinates',       minFiles: 1 },
    { id: '_files_match',              label: 'Check Files Match',       minFiles: 2 },
  ],
  cleaning: [
    { id: 'find_duplicates',     label: 'Remove Duplicate Rows', minFiles: 1 },
    { id: 'remove_empty_rows',   label: 'Remove Empty Rows',     minFiles: 1 },
    { id: 'standardise_hole_ids', label: 'Fix Hole ID Format',   minFiles: 1 },
    { id: 'trim_whitespace',     label: 'Trim Extra Spaces',     minFiles: 1 },
    { id: '_merge',              label: 'Merge Matching Files',  minFiles: 2 },
  ],
  analysis: [
    { id: 'best_intercept', label: 'Find Best Holes',      minFiles: 1 },
    { id: 'rank_by_grade',  label: 'Rank Holes by Grade',  minFiles: 1 },
    { id: '_diff',          label: 'Compare Files',        minFiles: 2 },
  ],
}

const ALL_DEFS: CheckDef[] = [...CHECK_DEFS, ...CLEAN_DEFS, ...ANALYSIS_DEFS]
const FIXING_IDS = new Set(['find_duplicates', 'remove_empty_rows', 'standardise_hole_ids', 'trim_whitespace'])

export default function StageWorkbench(props: Props) {
  const { stage, project, user, tables, onRefresh, stageDone, onApprove } = props
  const [view, setView] = useState<'canvas' | 'list'>('canvas')
  const [onCanvas, setOnCanvas] = useState<string[]>([])
  const [positions, setPositions] = useState<Record<string, CardPos>>({})
  const [selected, setSelected] = useState<string[]>([])
  const [newCardId, setNewCardId] = useState<string | null>(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiBusy, setAiBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [openTable, setOpenTable] = useState<TableMeta | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null)

  const canvasTables = onCanvas.map(id => tables.find(t => t.id === id)).filter(Boolean) as TableMeta[]
  const selectedTables = selected.map(id => tables.find(t => t.id === id)).filter(Boolean) as TableMeta[]

  const connections: Connection[] = useMemo(
    () => findConnections(canvasTables, id => DB.getRows(id, 200)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCanvas.join(','), tables.map(t => t.updated_at).join(',')]
  )

  const highlightByTable = useMemo(() => {
    const m: Record<string, Set<string>> = {}
    connections.forEach(c => {
      ;(m[c.tableA] ??= new Set()).add(c.colA)
      ;(m[c.tableB] ??= new Set()).add(c.colB)
    })
    return m
  }, [connections])

  /* ── canvas helpers ── */

  function addToCanvas(t: TableMeta) {
    if (onCanvas.includes(t.id)) return
    const i = onCanvas.length
    setPositions(p => ({ ...p, [t.id]: p[t.id] ?? { x: 60 + (i % 3) * (CARD_W + 90), y: 40 + Math.floor(i / 3) * 280 } }))
    setOnCanvas(prev => [...prev, t.id])
  }

  function spawnResultCard(meta: TableMeta, near?: string[]) {
    // place the result file below its parents, centred between them
    const parents = (near ?? []).map(id => positions[id]).filter(Boolean)
    const x = parents.length ? parents.reduce((a, p) => a + p.x, 0) / parents.length + 30 : 120
    const y = parents.length ? Math.max(...parents.map(p => p.y)) + 300 : 120
    setPositions(p => ({ ...p, [meta.id]: { x, y } }))
    setOnCanvas(prev => [...prev, meta.id])
    setNewCardId(meta.id)
    setTimeout(() => setNewCardId(null), 1600)
  }

  function startDrag(id: string, e: React.PointerEvent) {
    const pos = positions[id]; if (!pos) return
    dragRef.current = { id, dx: e.clientX - pos.x, dy: e.clientY - pos.y }
    ;(e.target as HTMLElement).closest('[data-canvas]')?.setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current; if (!d) return
    setPositions(p => ({ ...p, [d.id]: { x: Math.max(0, e.clientX - d.dx), y: Math.max(0, e.clientY - d.dy) } }))
  }
  function endDrag() { dragRef.current = null }

  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : prev.length >= 4 ? prev : [...prev, id])
  }

  /* line endpoint: right or left edge of the matching column row */
  function colAnchor(tableId: string, col: string, side: 'left' | 'right'): { x: number; y: number } | null {
    const pos = positions[tableId]; const t = tables.find(tb => tb.id === tableId)
    if (!pos || !t) return null
    const idx = Object.keys(t.columns).indexOf(col)
    const shownIdx = idx >= 0 && idx < MAX_COLS_SHOWN ? idx : MAX_COLS_SHOWN - 1
    return { x: pos.x + (side === 'right' ? CARD_W : 0), y: pos.y + CARD_HEADER_H + 5 + shownIdx * COL_ROW_H + COL_ROW_H / 2 }
  }

  /* ── actions ── */

  function runAction(actionId: string) {
    if (!selectedTables.length) return
    setMessage(null)

    if (actionId === '_merge') {
      const name = window.prompt(`Merge ${selectedTables.length} files into one. Name for the new file:`, `${project.name} merged`)
      if (!name?.trim()) return
      const meta = DB.mergeTables(project.id, selectedTables.map(t => t.id), name.trim(), user.email)
      spawnResultCard(meta, selected)
      notify('success', `Merged ${selectedTables.length} files into "${meta.name}" — ${meta.row_count.toLocaleString()} rows.`)
      onRefresh()
      return
    }

    if (actionId === '_files_match' || actionId === '_diff') {
      const [A, B] = selectedTables
      if (!A || !B) { setMessage('Select two files first.'); return }
      const def = ALL_DEFS.find(d => d.id === 'diff_tables')!
      const res = runCheck(def, DB.getRows(A.id, 0), invertColMapping(A.columns), { rows: DB.getRows(B.id, 0), invMap: invertColMapping(B.columns), columns: B.columns }, A.columns)
      setMessage(`${A.name} vs ${B.name}: ${res.summary}`)
      if (res.count > 0 && window.confirm(`${res.summary}\n\nSave the differing rows as a Result File on the workbench?`)) {
        const meta = DB.createChildTable(project.id, `Differences · ${A.name} vs ${B.name}`.slice(0, 60), res.issues, [A.id, B.id], user.email)
        spawnResultCard(meta, [A.id, B.id]); onRefresh()
      }
      return
    }

    const def = ALL_DEFS.find(d => d.id === actionId)
    if (!def) return

    selectedTables.forEach(t => {
      const rows = DB.getRows(t.id, 0)
      const invMap = invertColMapping(t.columns)
      const res = runCheck(def, rows, invMap, undefined, t.columns)
      if (FIXING_IDS.has(actionId)) {
        if (res.count === 0) { notify('info', `${t.name}: ${res.summary}`); return }
        if (!window.confirm(`${t.name}: ${res.summary}\n\nApply the fix now? (A new version is recorded — nothing is lost.)`)) return
        const fixed = applyFix(def, rows, invMap)
        DB.replaceRows(t.id, fixed, user.email, def.id, `${def.label} on "${t.name}"`)
        notify('success', `${t.name}: done — ${def.label.toLowerCase()}.`)
      } else {
        setMessage(`${t.name}: ${res.summary}`)
        if (res.issues.length > 0 && window.confirm(`${t.name}: ${res.summary}\n\nSave these rows as a Result File on the workbench?`)) {
          const meta = DB.createChildTable(project.id, `${def.label} · ${t.name}`.slice(0, 60), res.issues, [t.id], user.email)
          spawnResultCard(meta, [t.id])
        }
      }
    })
    onRefresh()
  }

  async function askAi() {
    const q = aiPrompt.trim()
    if (!q || !selectedTables.length) { setMessage('Select 1-4 files, then describe what you want.'); return }
    setAiBusy(true)
    setMessage('Working on it…')
    try {
      const scoped = `Using only these files: ${selectedTables.map(t => t.name).join(', ')}. ${q}`
      const res = await DB.goldAI(project.id, scoped)
      if (res.error || !res.sql) { setMessage(res.error ?? 'The AI could not build that request.'); return }
      const exec = executeSQL(res.sql, tables, (id) => DB.getRows(id, 0))
      if ('error' in exec) { setMessage(exec.error); notify('error', exec.error, exec.code); return }
      if (exec.action === 'delete') { setMessage('That request would remove rows — please use the cleaning actions for removals.'); return }
      if (!exec.rows.length) { setMessage('Nothing matched that request — no Result File created.'); return }
      const meta = DB.createChildTable(project.id, `AI · ${q.slice(0, 48)}`, exec.rows, selectedTables.map(t => t.id), user.email)
      spawnResultCard(meta, selected)
      setMessage(`Created "${meta.name}" — ${exec.rows.length.toLocaleString()} rows.`)
      notify('success', `Result File "${meta.name}" added to the workbench.`)
      setAiPrompt('')
      onRefresh()
    } finally { setAiBusy(false) }
  }

  /* ── render ── */

  if (openTable) {
    return <TableEditorPage table={openTable} project={project} user={user} onBack={() => { setOpenTable(null); onRefresh() }} onRefresh={onRefresh} />
  }

  if (view === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '8px 24px', borderBottom: '1px solid var(--sep)', background: 'var(--bg-2)' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setView('canvas')}>← Back to workbench</button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <WorkspacePage stage={stage} project={project} user={user} tables={tables} onRefresh={onRefresh} stageDone={stageDone} onApprove={onApprove} />
        </div>
      </div>
    )
  }

  const offCanvas = tables.filter(t => !onCanvas.includes(t.id))
  const stageTips: Record<Props['stage'], string> = {
    validation: 'Drag files onto the workbench. Lines appear between files that belong together (matching Hole IDs, coordinates). Files with nothing in common stay unconnected.',
    cleaning: 'Put 1-4 related files on the workbench, select them, then use the actions below to clean them together.',
    analysis: 'Combine cleaned files, compare them, or ask the AI in plain language. Every result becomes a new file on the workbench.',
  }

  return (
    <div className="content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* top bar */}
      <div style={{ padding: '10px 24px', background: 'var(--bg-2)', borderBottom: '1px solid var(--sep)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, fontSize: 13, color: 'var(--label-2)' }}>
          Stage: <strong style={{ textTransform: 'capitalize' }}>{stage}</strong>
          {stageDone && <span className="badge badge-green" style={{ marginLeft: 8 }}>Done</span>}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setView('list')}>Table view</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowUpload(true)}>+ Upload</button>
        {!stageDone && <button className="btn btn-primary btn-sm" onClick={onApprove}>Approve &amp; Continue →</button>}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* file tray */}
        <div style={{ width: 200, borderRight: '1px solid var(--sep)', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px 6px', fontSize: 10, color: 'var(--label-4)', letterSpacing: '.1em', textTransform: 'uppercase', fontFamily: 'monospace' }}>Project files</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px' }}>
            {offCanvas.length === 0 && <div style={{ fontSize: 11, color: 'var(--label-4)', padding: 8 }}>{tables.length ? 'All files are on the workbench.' : 'Upload files to begin.'}</div>}
            {offCanvas.map(t => (
              <div key={t.id} onClick={() => addToCanvas(t)}
                style={{ padding: '8px 10px', marginBottom: 6, background: 'var(--bg-3)', borderRadius: 8, border: '1px solid var(--sep)', cursor: 'pointer', fontSize: 12 }}>
                <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                <div style={{ fontSize: 10, color: 'var(--label-4)', marginTop: 2, textTransform: 'capitalize' }}>{t.type === 'child' ? 'result file' : t.type} · {t.row_count.toLocaleString()} rows</div>
                <div style={{ fontSize: 9.5, color: 'var(--blue)', marginTop: 3 }}>＋ Add to workbench</div>
              </div>
            ))}
          </div>
        </div>

        {/* canvas */}
        <div ref={canvasRef} data-canvas style={{ flex: 1, position: 'relative', overflow: 'auto', backgroundImage: 'radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
          onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerLeave={endDrag}
          onClick={() => setSelected([])}>
          {canvasTables.length === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
              <div style={{ textAlign: 'center', maxWidth: 380 }}>
                <div style={{ fontSize: 34, opacity: .12, marginBottom: 12 }}>◇ ◈ ◇</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Empty workbench</div>
                <p style={{ fontSize: 12, color: 'var(--label-3)', lineHeight: 1.6 }}>{stageTips[stage]}</p>
              </div>
            </div>
          )}

          {/* connection lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
            {/* "Made From" lineage lines */}
            {canvasTables.filter(t => t.parent_ids?.length).flatMap(t =>
              (t.parent_ids ?? []).filter(pid => onCanvas.includes(pid)).map(pid => {
                const a = positions[pid], b = positions[t.id]
                if (!a || !b) return null
                const x1 = a.x + CARD_W / 2, y1 = a.y + CARD_HEADER_H, x2 = b.x + CARD_W / 2, y2 = b.y
                return <path key={`lin-${t.id}-${pid}`} d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`} stroke="var(--gold)" strokeWidth={1.5} strokeDasharray="5 4" fill="none" opacity={.7} />
              })
            )}
            {/* matching-column lines */}
            {connections.map((c, i) => {
              const pa = positions[c.tableA], pb = positions[c.tableB]
              if (!pa || !pb) return null
              const aRight = pa.x < pb.x
              const p1 = colAnchor(c.tableA, c.colA, aRight ? 'right' : 'left')
              const p2 = colAnchor(c.tableB, c.colB, aRight ? 'left' : 'right')
              if (!p1 || !p2) return null
              const mx = (p1.x + p2.x) / 2
              const color = c.confidence === 'high' ? 'var(--green)' : 'var(--teal)'
              return (
                <g key={i}>
                  <path d={`M ${p1.x} ${p1.y} C ${mx} ${p1.y}, ${mx} ${p2.y}, ${p2.x} ${p2.y}`} stroke={color} strokeWidth={1.6} fill="none" opacity={.85} />
                  <circle cx={p1.x} cy={p1.y} r={3} fill={color} />
                  <circle cx={p2.x} cy={p2.y} r={3} fill={color} />
                  <text x={mx} y={(p1.y + p2.y) / 2 - 5} textAnchor="middle" fill={color} fontSize={9} fontFamily="monospace" opacity={.9}>{c.role.replace('_', ' ')}</text>
                </g>
              )
            })}
          </svg>

          {canvasTables.map(t => (
            <FileCard key={t.id} table={t} x={positions[t.id]?.x ?? 60} y={positions[t.id]?.y ?? 60}
              selected={selected.includes(t.id)} isNew={t.id === newCardId}
              highlightCols={highlightByTable[t.id] ?? new Set()}
              onPointerDown={e => startDrag(t.id, e)}
              onToggleSelect={() => toggleSelect(t.id)}
              onOpen={() => setOpenTable(t)}
              onRemove={() => { setOnCanvas(prev => prev.filter(id => id !== t.id)); setSelected(prev => prev.filter(id => id !== t.id)) }} />
          ))}
        </div>
      </div>

      {/* action bar */}
      <div style={{ borderTop: '1px solid var(--sep)', background: 'var(--bg-2)', padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--label-3)', minWidth: 130 }}>
            {selected.length ? `${selected.length} file${selected.length > 1 ? 's' : ''} selected` : 'Click files to select (up to 4)'}
          </span>
          {STAGE_ACTIONS[stage].map(a => (
            <button key={a.id} className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}
              disabled={selected.length < a.minFiles}
              title={selected.length < a.minFiles ? `Select at least ${a.minFiles} file${a.minFiles > 1 ? 's' : ''}` : undefined}
              onClick={() => runAction(a.id)}>{a.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" style={{ flex: 1, fontSize: 13 }} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
            placeholder='Ask AI about the selected files… e.g. "find the best holes among these files" or "remove holes with duplicate values"'
            onKeyDown={e => { if (e.key === 'Enter') askAi() }} />
          <button className="btn btn-primary btn-sm" onClick={askAi} disabled={aiBusy || !selected.length}>{aiBusy ? '…' : 'Ask AI'}</button>
        </div>
        {message && <div style={{ fontSize: 12, color: 'var(--label-2)', padding: '4px 2px' }}>{message}</div>}
      </div>

      {showUpload && <UploadModal project={project} user={user} onClose={() => setShowUpload(false)} onImported={() => { setShowUpload(false); onRefresh() }} />}
    </div>
  )
}
