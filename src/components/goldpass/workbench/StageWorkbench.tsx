'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { DB } from '@/lib/goldpass/db'
import { executeSQL } from '@/lib/goldpass/sqlEngine'
import { notify } from '@/lib/goldpass/notify'
import { confirmDialog } from '@/lib/goldpass/confirm'
import { CHECK_DEFS, CLEAN_DEFS, ANALYSIS_DEFS } from '@/lib/goldpass/dataChecks'
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
    { id: '_data_health',              label: 'Check Data Health',       minFiles: 1 },
    { id: '_intervals',                label: 'Check Intervals',         minFiles: 1 },
    { id: '_compare_files',            label: 'Check Files Match',       minFiles: 2 },
    { id: '_undrilled_orphans',        label: 'Find Undrilled/Orphan Data', minFiles: 2 },
  ],
  cleaning: [
    { id: '_combine_dedupe',      label: 'Combine & Remove Duplicates', minFiles: 1 },
    { id: '_fix_formatting',     label: 'Clean Up Formatting',  minFiles: 1 },
    { id: '_merge',              label: 'Merge Matching Files',  minFiles: 2 },
  ],
  analysis: [
    { id: '_analysis',           label: 'Run Analysis',            minFiles: 1 },
    { id: '_distance',           label: 'Distance Filter',         minFiles: 1 },
  ],
}

const ALL_DEFS: CheckDef[] = [...CHECK_DEFS, ...CLEAN_DEFS, ...ANALYSIS_DEFS]
const FIXING_IDS = new Set(['remove_empty_rows', 'standardise_hole_ids', 'trim_whitespace'])

/* Shape returned by the gp_run_check RPC (mirrors dataChecks CheckResult). */
type CheckJson = { issues: TableRow[]; count: number; summary: string; cols: string[]; coordInfo?: Record<string, unknown>; error?: string }

export default function StageWorkbench(props: Props) {
  const { stage, project, user, tables, onRefresh, stageDone, onApprove } = props
  const [view, setView] = useState<'canvas' | 'list'>('canvas')
  const [onCanvas, setOnCanvas] = useState<string[]>([])
  const [positions, setPositions] = useState<Record<string, CardPos>>({})
  const [selected, setSelected] = useState<string[]>([])
  const [newCardId, setNewCardId] = useState<string | null>(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiBusy, setAiBusy] = useState(false)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [openTable, setOpenTable] = useState<TableMeta | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null)
  const hydrated = useRef(false)

  /* ── session resume: restore this stage's canvas from workbench_state ── */
  useEffect(() => {
    let cancelled = false
    hydrated.current = false
    DB.getWorkbenchState(project.id, stage).then(st => {
      if (cancelled) return
      if (st) {
        const valid = st.layout.filter(l => tables.some(t => t.id === l.table_id))
        setOnCanvas(valid.map(l => l.table_id))
        setPositions(Object.fromEntries(valid.map(l => [l.table_id, { x: l.x, y: l.y }])))
        setSelected(st.selection.filter(id => tables.some(t => t.id === id)))
      }
      hydrated.current = true
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, stage])

  /* auto-select files placed on the canvas so actions/AI work without manual clicking */
  useEffect(() => {
    if (!hydrated.current) return
    if (onCanvas.length) setSelected(prev => Array.from(new Set([...prev, ...onCanvas])).slice(0, 4))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCanvas])

  /* persist the canvas (debounced) whenever it changes after hydration */
  useEffect(() => {
    if (!hydrated.current) return
    const h = setTimeout(() => {
      const layout = onCanvas.map(id => ({ table_id: id, x: positions[id]?.x ?? 60, y: positions[id]?.y ?? 60 }))
      DB.saveWorkbenchState(project.id, stage, layout, selected)
    }, 600)
    return () => clearTimeout(h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCanvas, positions, selected])

  /* run a backend data-check RPC; null means it errored (toast already shown) */
  async function check(checkId: string, tableId: string, compareId?: string): Promise<CheckJson | null> {
    const r = await DB.rpcRunCheck(checkId, tableId, compareId)
    return r ? (r as unknown as CheckJson) : null
  }

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
    // Don't hijack clicks on the card's buttons (Open / ✕) into a drag —
    // pointer capture would swallow their click events entirely.
    if ((e.target as HTMLElement).closest('button')) return
    const pos = positions[id]; if (!pos) return
    dragRef.current = { id, dx: e.clientX - pos.x, dy: e.clientY - pos.y }
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current; if (!d) return
    setPositions(p => ({ ...p, [d.id]: { x: Math.max(0, e.clientX - d.dx), y: Math.max(0, e.clientY - d.dy) } }))
  }
  function endDrag() { dragRef.current = null }

  function toggleSelect(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id)
      if (prev.length >= 4) { notify('info', 'Max 4 files selected — deselect one first.'); return prev }
      return [...prev, id]
    })
  }

  async function deleteFile(t: TableMeta) {
    if (!await confirmDialog(`Permanently delete "${t.name}" and all its versions/rows? This cannot be undone.`)) return
    DB.deleteTable(t.id, project.id, user.email)
    setOnCanvas(prev => prev.filter(id => id !== t.id))
    setSelected(prev => prev.filter(id => id !== t.id))
    notify('success', `"${t.name}" deleted.`)
    onRefresh()
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

  async function runAction(actionId: string) {
    if (!selectedTables.length || busyAction) return
    console.info('[GoldPass] Action:', actionId, '→ files:', selectedTables.map(t => t.name))
    setMessage(null)
    setBusyAction(actionId)
    try {
      await runActionInner(actionId)
    } finally {
      setBusyAction(null)
    }
  }

  async function runActionInner(actionId: string) {
    if (actionId === '_combine_dedupe') {
      const res = await DB.rpcCombineAndDedupe(selectedTables.map(t => t.id))
      if (!res) return
      if (res.error) { setMessage(res.error); return }
      setMessage(res.summary)
      for (const a of res.anomalies) notify('warn', a.message, 'GP-2306')
      if (!await confirmDialog(`${res.summary}\n\nSave the cleaned (and, if any, duplicates) Result File(s) on the workbench?`)) return
      const names = selectedTables.map(t => t.name).join(' + ')
      const cleanMeta = DB.createChildTable(project.id, `Clean · ${names}`.slice(0, 60), res.clean, selected, user.email)
      spawnResultCard(cleanMeta, selected)
      if (res.duplicates.length) {
        const dupMeta = DB.createChildTable(project.id, `Duplicates · ${names}`.slice(0, 60), res.duplicates, selected, user.email)
        spawnResultCard(dupMeta, selected)
      }
      notify('success', `Created "${cleanMeta.name}"${res.duplicates.length ? ` and a Duplicates file` : ''} — ${res.summary}`)
      onRefresh()
      return
    }

    if (actionId === '_fix_formatting') {
      const res = await DB.rpcFixFormatting(selectedTables.map(t => t.id))
      if (!res) return
      if (res.error) { setMessage(res.error); return }
      const changed = res.files.filter(f => f.trimmed || f.standardised || f.removed_empty || f.placeholders_cleared)
      if (!changed.length) { notify('success', 'No formatting issues found — all clear.'); return }
      const parts = changed.map(f => {
        const t = selectedTables.find(x => x.id === f.table_id)!
        const bits: string[] = []
        if (f.trimmed) bits.push(`${f.trimmed} cell(s) trimmed`)
        if (f.standardised) bits.push(`${f.standardised} Hole ID(s) standardised`)
        if (f.placeholders_cleared) bits.push(`${f.placeholders_cleared} placeholder value(s) cleared`)
        if (f.removed_empty) bits.push(`${f.removed_empty} empty row(s) removed`)
        return `${t.name}: ${bits.join(', ')}`
      })
      if (!await confirmDialog(`${parts.join('\n')}\n\nApply these fixes now? A new version is recorded per file — nothing is lost.`)) return
      for (const f of changed) {
        const t = selectedTables.find(x => x.id === f.table_id)!
        DB.replaceRows(t.id, f.rows, user.email, '_fix_formatting', `Cleaned up formatting in "${t.name}"`)
      }
      notify('success', `Formatting cleaned up — ${parts.join(' · ')}`)
      onRefresh()
      return
    }

    if (actionId === '_merge') {
      const name = window.prompt(`Merge ${selectedTables.length} files into one. Name for the new file:`, `${project.name} merged`)
      if (!name?.trim()) return
      const meta = DB.mergeTables(project.id, selectedTables.map(t => t.id), name.trim(), user.email)
      spawnResultCard(meta, selected)
      notify('success', `Merged ${selectedTables.length} files into "${meta.name}" — ${meta.row_count.toLocaleString()} rows.`)
      onRefresh()
      return
    }

    if (actionId === '_intervals') {
      // pooled From≥To, overlap and gap check across ALL selected interval files
      const res = await DB.rpcCheckIntervals(selectedTables.map(t => t.id))
      if (!res) return
      if (res.error) { setMessage(res.error); return }
      setMessage(res.summary)
      if (res.count === 0) { notify('success', res.summary); return }
      const issues = [
        ...res.order_issues.map(row => ({ Problem: 'From >= To', ...row })),
        ...res.overlaps.map(row => ({ Problem: 'Overlap', ...row })),
        ...res.gaps.map(row => ({ Problem: 'Gap', ...row })),
      ]
      if (await confirmDialog(`${res.summary}\n\nSave these as a Result File on the workbench?`)) {
        const names = selectedTables.map(t => t.name).join(' + ')
        const meta = DB.createChildTable(project.id, `Interval problems · ${names}`.slice(0, 60), issues, selected, user.email)
        spawnResultCard(meta, selected)
      }
      onRefresh(); return
    }

    if (actionId === '_data_health') {
      const res = await DB.rpcCheckDataHealth(selectedTables.map(t => t.id))
      if (!res) return
      if (res.error) { setMessage(res.error); return }
      const cs = res.coord_system
      const csMsg = cs ? ` Coordinate system: ${cs.system} (${cs.confidence} confidence) — ${cs.notes}` : ''
      setMessage(`${res.summary}${csMsg}`)
      if (res.count === 0) { notify('success', `${res.summary}${csMsg}`); return }
      if (await confirmDialog(`${res.summary}${csMsg}\n\nSave these issues as a Result File on the workbench?`)) {
        const names = selectedTables.map(t => t.name).join(' + ')
        const meta = DB.createChildTable(project.id, `Data health · ${names}`.slice(0, 60), res.issues, selected, user.email)
        spawnResultCard(meta, selected)
      }
      onRefresh(); return
    }

    if (actionId === '_undrilled_orphans') {
      // pooled: every collar-type file in selection vs every interval-type file in selection
      const collars = selectedTables.filter(t => t.type === 'collar')
      const intervals = selectedTables.filter(t => t.type !== 'collar')
      if (!collars.length || !intervals.length) { setMessage('Select at least one collar file and one interval file (assay/survey/lithology).'); return }
      const res = await DB.rpcFindUndrilledOrphans(collars.map(t => t.id), intervals.map(t => t.id))
      if (!res) return
      if (res.error) { setMessage(res.error); return }
      setMessage(res.summary)
      if (res.count === 0) { notify('success', res.summary); return }
      if (await confirmDialog(`${res.summary}\n\nSave these as Result Files on the workbench?`)) {
        if (res.undrilled.length) {
          const meta = DB.createChildTable(project.id, `Undrilled holes · ${collars.map(t => t.name).join(' + ')}`.slice(0, 60), res.undrilled, selected, user.email)
          spawnResultCard(meta, selected)
        }
        if (res.orphans.length) {
          const meta = DB.createChildTable(project.id, `Orphan data · ${intervals.map(t => t.name).join(' + ')}`.slice(0, 60), res.orphans, selected, user.email)
          spawnResultCard(meta, selected)
        }
        onRefresh()
      }
      return
    }

    if (actionId === '_analysis') {
      const res = await DB.rpcAnalysisPool(selectedTables.map(t => t.id))
      if (!res) return
      if (res.error) { setMessage(res.error); return }
      setMessage(res.summary)
      const names = selectedTables.map(t => t.name).join(' + ')
      let created = 0
      if (res.grade_summary.length) { spawnResultCard(DB.createChildTable(project.id, `Grade summary · ${names}`.slice(0, 60), res.grade_summary, selected, user.email), selected); created++ }
      if (res.best_intercept.length) { spawnResultCard(DB.createChildTable(project.id, `Best intercepts · ${names}`.slice(0, 60), res.best_intercept, selected, user.email), selected); created++ }
      if (res.rank_by_grade.length) { spawnResultCard(DB.createChildTable(project.id, `Ranked by grade · ${names}`.slice(0, 60), res.rank_by_grade, selected, user.email), selected); created++ }
      if (res.ppm_table.length) { spawnResultCard(DB.createChildTable(project.id, `Analysis (HOLEID-MFRO-MTO-MAXIMUMPPM) · ${names}`.slice(0, 60), res.ppm_table, selected, user.email), selected); created++ }
      if (!created) { setMessage('No grade columns (gold/copper/silver) and Hole ID/From/To mapped in the selected files.'); return }
      notify('success', `${res.summary} — ${created} Result File(s) created.`)
      onRefresh(); return
    }

    if (actionId === '_distance') {
      const distStr = window.prompt('Keep holes within how many metres? (e.g. 8000 ≈ 5 miles)', '1000')
      const maxDist = parseFloat(distStr ?? '')
      if (isNaN(maxDist) || maxDist <= 0) return
      const [A, ...refs] = selectedTables
      let resRows: TableRow[]
      let refLabel: string
      if (refs.length) {
        // backend distance filter against ALL other selected files' coordinates, pooled
        const res = await DB.rpcDistanceFilterPooled(A.id, refs.map(t => t.id), maxDist)
        if (!res) return
        if (res.error) { setMessage(`${A.name}: ${res.error}`); return }
        resRows = res.rows
        refLabel = `holes in ${refs.map(t => t.name).join(' + ')}`
      } else {
        // single file, no reference: typed point, runs server-side via p_point
        const pt = window.prompt('Reference point as "East, North" (e.g. 412345, 9567890):')
        const [e, n] = (pt ?? '').split(',').map(v => parseFloat(v.trim()))
        if (isNaN(e) || isNaN(n)) return
        const res = await DB.rpcDistanceFilterPooled(A.id, [], maxDist, [e, n])
        if (!res) return
        if (res.error) { setMessage(`${A.name}: ${res.error}`); return }
        resRows = res.rows
        refLabel = `point ${e}, ${n}`
      }
      if (!resRows.length) { setMessage(`${A.name}: no holes within ${maxDist.toLocaleString()} m of ${refLabel}.`); return }
      const meta = DB.createChildTable(project.id, `Within ${maxDist.toLocaleString()}m · ${A.name}`.slice(0, 60), resRows, selected, user.email)
      spawnResultCard(meta, selected)
      notify('success', `${resRows.length.toLocaleString()} hole(s) within ${maxDist.toLocaleString()} m of ${refLabel}.`)
      onRefresh(); return
    }

    if (actionId === '_compare_files') {
      const res = await DB.rpcCompareFiles(selectedTables.map(t => t.id))
      if (!res) return
      if (res.error) { setMessage(res.error); return }
      setMessage(res.summary)
      if (res.count === 0) { notify('success', res.summary); return }
      if (await confirmDialog(`${res.summary}\n\nSave the differing rows as a Result File on the workbench?`)) {
        const names = selectedTables.map(t => t.name).join(' vs ')
        const meta = DB.createChildTable(project.id, `Differences · ${names}`.slice(0, 60), res.issues, selected, user.email)
        spawnResultCard(meta, selected); onRefresh()
      }
      return
    }

    const def = ALL_DEFS.find(d => d.id === actionId)
    if (!def) return

    for (const t of selectedTables) {
      const res = await check(def.id, t.id)
      if (!res) continue
      if (FIXING_IDS.has(actionId)) {
        if (res.count === 0) { notify('info', `${t.name}: ${res.summary}`); continue }
        if (!await confirmDialog(`${t.name}: ${res.summary}\n\nApply the fix now? (A new version is recorded — nothing is lost.)`)) continue
        const fixed = await DB.rpcApplyFix(def.id, t.id)
        if (!fixed) continue
        DB.replaceRows(t.id, fixed, user.email, def.id, `${def.label} on "${t.name}"`)
        notify('success', `${t.name}: done — ${def.label.toLowerCase()}.`)
      } else {
        setMessage(`${t.name}: ${res.summary}`)
        if (res.issues.length === 0) notify('success', `${t.name}: all clear — ${res.summary}`)
        if (res.issues.length > 0 && await confirmDialog(`${t.name}: ${res.summary}\n\nSave these rows as a Result File on the workbench?`)) {
          const meta = DB.createChildTable(project.id, `${def.label} · ${t.name}`.slice(0, 60), res.issues, [t.id], user.email)
          spawnResultCard(meta, [t.id])
        }
      }
    }
    onRefresh()
  }

  async function askAi() {
    const q = aiPrompt.trim()
    if (!q || !selectedTables.length) { setMessage('Select 1-4 files on the workbench first (click a card), then describe what you want.'); return }
    setAiBusy(true)
    setMessage('Working on it…')
    console.info('[GoldPass] Ask AI →', { files: selectedTables.map(t => t.name), question: q })
    try {
      const scoped = `Using only these files: ${selectedTables.map(t => t.name).join(', ')}. ${q}`
      const res = await DB.goldAI(project.id, scoped)
      if (res.error || !res.sql) {
        console.error('[GoldPass] Ask AI failed at the AI step:', res.error, res.code)
        setMessage(res.error ?? 'The AI could not build that request.'); return
      }
      console.info('[GoldPass] AI SQL ←', res.sql, res.note ? `(${res.note})` : '')
      const exec = executeSQL(res.sql, tables, (id) => DB.getRows(id, 0))
      if ('error' in exec) {
        console.error('[GoldPass] Ask AI failed running the SQL:', exec.error, exec.code)
        setMessage(exec.error); notify('error', exec.error, exec.code); return
      }
      if (exec.action === 'delete') { setMessage('That request would remove rows — please use the cleaning actions for removals.'); return }
      if (!exec.rows.length) { console.info('[GoldPass] Ask AI: query ran, 0 rows.'); setMessage('Nothing matched that request — no Result File created.'); return }
      console.info('[GoldPass] Ask AI: query ran,', exec.rows.length, 'rows → creating Result File.')
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
              onRemove={() => { setOnCanvas(prev => prev.filter(id => id !== t.id)); setSelected(prev => prev.filter(id => id !== t.id)) }}
              onDelete={() => deleteFile(t)} />
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
              disabled={selected.length < a.minFiles || !!busyAction}
              title={selected.length < a.minFiles ? `Select at least ${a.minFiles} file${a.minFiles > 1 ? 's' : ''}` : undefined}
              onClick={() => runAction(a.id)}>{busyAction === a.id ? '…' : a.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" style={{ flex: 1, fontSize: 13 }} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
            placeholder='Ask AI about the selected files… e.g. "find the best holes among these files" or "remove holes with duplicate values"'
            onKeyDown={e => { if (e.key === 'Enter') askAi() }} />
          <button className="btn btn-primary btn-sm" onClick={askAi} disabled={aiBusy || !selected.length}
            title={!selected.length ? 'Select 1-4 files on the workbench first' : undefined}>{aiBusy ? '…' : 'Ask AI'}</button>
        </div>
        {message && <div style={{ fontSize: 12, color: 'var(--label-2)', padding: '4px 2px' }}>{message}</div>}
      </div>

      {showUpload && <UploadModal project={project} user={user} onClose={() => setShowUpload(false)} onImported={() => { setShowUpload(false); onRefresh() }} />}
    </div>
  )
}
