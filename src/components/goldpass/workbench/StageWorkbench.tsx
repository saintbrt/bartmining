'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { DB, invertColMapping } from '@/lib/goldpass/db'
import { executeSQL } from '@/lib/goldpass/sqlEngine'
import { notify } from '@/lib/goldpass/notify'
import { confirmDialog } from '@/lib/goldpass/confirm'
import { CHECK_DEFS, CLEAN_DEFS, ANALYSIS_DEFS } from '@/lib/goldpass/dataChecks'
import type { CheckDef } from '@/lib/goldpass/dataChecks'
import type { Project, TableMeta, TableRow } from '@/lib/goldpass/db'
import FileCard, { CARD_W, CARD_HEADER_H, COL_ROW_H, MAX_COLS_SHOWN } from './FileCard'
import { findConnections } from './findConnections'
import WorkspacePage from '../WorkspacePage'
import UploadModal from '../UploadModal'
import TableEditorPage from '../TableEditorPage'

interface Props {
  stage: 'cleaning' | 'analysis'
  project: Project
  user: { email: string }
  tables: TableMeta[]
  onRefresh: () => void
  stageDone: boolean
  onApprove: () => void
}

interface CardPos { x: number; y: number }

/* ── Analysis report types ── */
type CheckStatus = 'ok' | 'warn' | 'error'
interface FileCheckResult { label: string; summary: string; count: number; status: CheckStatus }
interface FileAnalysis { tableId: string; tableName: string; checks: FileCheckResult[] }
interface AnalysisReport {
  files: FileAnalysis[]
  crossFile: FileCheckResult[]
  overallStatus: CheckStatus
  ranAt: Date
}

/* ── Stage actions ──
   Cleaning: fix actions + manual check actions (auto-analyse covers diagnostics)
   Analysis: produce result files from clean data                                  */
const STAGE_ACTIONS: Record<Props['stage'], { id: string; label: string; minFiles: number }[]> = {
  cleaning: [
    { id: '_combine_dedupe',        label: 'Combine & Dedupe',    minFiles: 1 },
    { id: '_fix_formatting',        label: 'Fix Formatting',       minFiles: 1 },
    { id: '_join',                  label: 'Join Files',           minFiles: 2 },
    { id: '_merge',                 label: 'Stack Files',          minFiles: 2 },
    { id: '_data_health',           label: 'Data Health',          minFiles: 1 },
    { id: '_intervals',             label: 'Check Intervals',      minFiles: 1 },
    { id: 'missing_hole_ids',       label: 'Missing Hole IDs',    minFiles: 1 },
    { id: 'find_null_placeholders', label: 'Null Values',          minFiles: 1 },
    { id: '_compare_files',         label: 'Compare Files',        minFiles: 2 },
    { id: '_undrilled_orphans',     label: 'Undrilled / Orphans',  minFiles: 2 },
  ],
  analysis: [
    { id: '_analysis', label: 'Run Analysis',    minFiles: 1 },
    { id: '_distance', label: 'Distance Filter', minFiles: 1 },
  ],
}

const ALL_DEFS: CheckDef[] = [...CHECK_DEFS, ...CLEAN_DEFS, ...ANALYSIS_DEFS]
const FIXING_IDS = new Set(['remove_empty_rows', 'standardise_hole_ids', 'trim_whitespace'])

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
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null)
  const [analysisRunning, setAnalysisRunning] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null)
  const hydrated = useRef(false)

  /* ── session resume ── */
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

  /* auto-select newly added files */
  useEffect(() => {
    if (!hydrated.current) return
    if (onCanvas.length) setSelected(prev => Array.from(new Set([...prev, ...onCanvas])).slice(0, 4))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCanvas])

  /* persist canvas state (debounced) */
  useEffect(() => {
    if (!hydrated.current) return
    const h = setTimeout(() => {
      const layout = onCanvas.map(id => ({ table_id: id, x: positions[id]?.x ?? 60, y: positions[id]?.y ?? 60 }))
      DB.saveWorkbenchState(project.id, stage, layout, selected)
    }, 600)
    return () => clearTimeout(h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCanvas, positions, selected])

  /* run a single RPC check */
  async function check(checkId: string, tableId: string, compareId?: string): Promise<CheckJson | null> {
    const r = await DB.rpcRunCheck(checkId, tableId, compareId)
    return r ? (r as unknown as CheckJson) : null
  }

  const canvasTables = onCanvas.map(id => tables.find(t => t.id === id)).filter(Boolean) as TableMeta[]
  const selectedTables = selected.map(id => tables.find(t => t.id === id)).filter(Boolean) as TableMeta[]

  const connections = useMemo(
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
    const parents = (near ?? []).map(id => positions[id]).filter(Boolean)
    const x = parents.length ? parents.reduce((a, p) => a + p.x, 0) / parents.length + 30 : 120
    const y = parents.length ? Math.max(...parents.map(p => p.y)) + 300 : 120
    setPositions(p => ({ ...p, [meta.id]: { x, y } }))
    setOnCanvas(prev => [...prev, meta.id])
    setNewCardId(meta.id)
    setTimeout(() => setNewCardId(null), 1600)
  }

  function startDrag(id: string, e: React.PointerEvent) {
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

  function colAnchor(tableId: string, col: string, side: 'left' | 'right'): { x: number; y: number } | null {
    const pos = positions[tableId]; const t = tables.find(tb => tb.id === tableId)
    if (!pos || !t) return null
    const idx = Object.keys(t.columns).indexOf(col)
    const shownIdx = idx >= 0 && idx < MAX_COLS_SHOWN ? idx : MAX_COLS_SHOWN - 1
    return { x: pos.x + (side === 'right' ? CARD_W : 0), y: pos.y + CARD_HEADER_H + 5 + shownIdx * COL_ROW_H + COL_ROW_H / 2 }
  }

  /* ── Auto-Analyse: runs all diagnostic checks across canvas files ── */
  async function runAutoAnalysis() {
    if (!canvasTables.length) return
    setAnalysisRunning(true)
    setAnalysisReport(null)
    try {
      /* Per-file checks run in parallel across all canvas files */
      const fileResults: FileAnalysis[] = await Promise.all(
        canvasTables.map(async (table) => {
          const [dh, iv, mh, np] = await Promise.all([
            DB.rpcCheckDataHealth([table.id]),
            table.type !== 'collar' ? DB.rpcCheckIntervals([table.id]) : Promise.resolve(null),
            DB.rpcRunCheck('missing_hole_ids', table.id),
            DB.rpcRunCheck('find_null_placeholders', table.id),
          ])

          const checks: FileCheckResult[] = []

          if (dh) {
            const cs = dh.coord_system
            const csNote = cs?.system && cs.system !== 'Unknown' ? ` Coordinate system: ${cs.system}.` : ''
            checks.push({
              label: 'Data Health',
              summary: dh.error ? dh.error : `${dh.summary}${csNote}`,
              count: dh.count,
              status: dh.error ? 'error' : dh.count === 0 ? 'ok' : 'warn',
            })
          }

          if (iv) {
            const issueCount = (iv.order_issues?.length ?? 0) + (iv.overlaps?.length ?? 0) + (iv.gaps?.length ?? 0)
            checks.push({
              label: 'Interval Integrity',
              summary: iv.error ? iv.error : iv.summary,
              count: issueCount,
              status: iv.error ? 'error' : issueCount === 0 ? 'ok' : 'warn',
            })
          }

          if (mh) {
            const r = mh as unknown as CheckJson
            checks.push({ label: 'Missing Hole IDs', summary: r.summary, count: r.count, status: r.count === 0 ? 'ok' : 'error' })
          }

          if (np) {
            const r = np as unknown as CheckJson
            checks.push({ label: 'Null Placeholders', summary: r.summary, count: r.count, status: r.count === 0 ? 'ok' : 'warn' })
          }

          return { tableId: table.id, tableName: table.name, checks }
        })
      )

      /* Cross-file checks when 2+ files are on canvas */
      const crossFile: FileCheckResult[] = []
      if (canvasTables.length >= 2) {
        const collarIds  = canvasTables.filter(t => t.type === 'collar').map(t => t.id)
        const intervalIds = canvasTables.filter(t => t.type !== 'collar' && t.type !== 'child').map(t => t.id)

        const [uo, cf] = await Promise.all([
          collarIds.length && intervalIds.length
            ? DB.rpcFindUndrilledOrphans(collarIds, intervalIds)
            : Promise.resolve(null),
          DB.rpcCompareFiles(canvasTables.map(t => t.id)),
        ])

        if (uo) {
          const u = uo.undrilled?.length ?? 0
          const o = uo.orphans?.length ?? 0
          crossFile.push({
            label: 'Undrilled Holes',
            summary: u === 0 ? 'All collar holes have interval data.' : `${u} collar hole${u !== 1 ? 's' : ''} have no interval data.`,
            count: u,
            status: u === 0 ? 'ok' : 'warn',
          })
          crossFile.push({
            label: 'Orphan Intervals',
            summary: o === 0 ? 'All intervals have a matching collar.' : `${o} interval hole${o !== 1 ? 's' : ''} have no collar entry.`,
            count: o,
            status: o === 0 ? 'ok' : 'warn',
          })
        }

        if (cf) {
          crossFile.push({
            label: 'Hole ID Coverage',
            summary: cf.error ? cf.error : cf.summary,
            count: cf.count,
            status: cf.error ? 'error' : cf.count === 0 ? 'ok' : 'warn',
          })
        }
      }

      const allChecks = [...fileResults.flatMap(f => f.checks), ...crossFile]
      const overallStatus: CheckStatus = allChecks.some(c => c.status === 'error') ? 'error'
        : allChecks.some(c => c.status === 'warn') ? 'warn' : 'ok'

      setAnalysisReport({ files: fileResults, crossFile, overallStatus, ranAt: new Date() })
    } finally {
      setAnalysisRunning(false)
    }
  }

  /* ── Smart JOIN: collar × intervals joined on Hole ID ── */
  async function handleJoin() {
    const collarTables  = selectedTables.filter(t => t.type === 'collar')
    const intervalTables = selectedTables.filter(t => t.type !== 'collar' && t.type !== 'child' && t.type !== 'other')

    if (!collarTables.length || !intervalTables.length) {
      setMessage('Select at least one collar file and at least one interval file (assay/survey/lithology) to join.')
      return
    }
    if (collarTables.length > 1) {
      setMessage('Select exactly one collar file. Use "Stack Files" to combine multiple collar files first, then join.')
      return
    }

    const collar = collarTables[0]
    const collarInv = invertColMapping(collar.columns)
    const collarHoleCol = collarInv['hole_id']

    if (!collarHoleCol) {
      setMessage(`"${collar.name}" needs a Hole ID column mapped before joining.`)
      return
    }

    const collarRows = DB.getRows(collar.id, 0)
    const collarOnlyCols = Object.keys(collar.columns).filter(k => k !== collarHoleCol)

    /* Build collar lookup: normalised HoleID → row */
    const collarByHole = new Map<string, TableRow>()
    collarRows.forEach(r => {
      const id = String(r[collarHoleCol] ?? '').trim().toUpperCase()
      if (id) collarByHole.set(id, r)
    })

    /* Join each interval table to the collar */
    const joinedRows: TableRow[] = []
    for (const interval of intervalTables) {
      const intervalInv = invertColMapping(interval.columns)
      const intervalHoleCol = intervalInv['hole_id']
      if (!intervalHoleCol) {
        setMessage(`"${interval.name}" needs a Hole ID column mapped before joining.`)
        return
      }

      const intervalRows = DB.getRows(interval.id, 0)
      const intervalOtherCols = Object.keys(interval.columns).filter(k => k !== intervalHoleCol)

      for (const iRow of intervalRows) {
        const holeId = String(iRow[intervalHoleCol] ?? '').trim().toUpperCase()
        const cRow = collarByHole.get(holeId)

        /* Output: HoleID first, then collar columns, then interval columns */
        const out: TableRow = { [intervalHoleCol]: iRow[intervalHoleCol] }
        for (const k of collarOnlyCols) {
          /* Prefix collar column if the interval table already has that name */
          const outKey = intervalOtherCols.includes(k) ? `${k}_collar` : k
          out[outKey] = cRow ? cRow[k] : ''
        }
        for (const k of intervalOtherCols) {
          out[k] = iRow[k]
        }
        joinedRows.push(out)
      }
    }

    if (!joinedRows.length) {
      setMessage('No matching rows found — check that Hole ID values match between the collar and interval files.')
      return
    }

    const matched = new Set(
      joinedRows.map(r => String(r[Object.keys(intervalTables[0].columns)[0]] ?? '').trim().toUpperCase()).filter(Boolean)
    ).size
    const summary = `${joinedRows.length.toLocaleString()} interval rows joined with ${matched} hole${matched !== 1 ? 's' : ''} from "${collar.name}".`

    if (!await confirmDialog(`${summary}\n\nSave as a new Result File on the workbench?`)) return

    const names = `${collar.name} ↔ ${intervalTables.map(t => t.name).join(' + ')}`
    const meta = await DB.createChildTable(project.id, `Join · ${names}`.slice(0, 60), joinedRows, selected, user.email)
    spawnResultCard(meta, selected)
    notify('success', `${summary} — saved as "${meta.name}".`)
    onRefresh()
  }

  /* ── Action dispatcher ── */
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
    if (actionId === '_join') {
      await handleJoin()
      return
    }

    if (actionId === '_combine_dedupe') {
      const res = await DB.rpcCombineAndDedupe(selectedTables.map(t => t.id))
      if (!res) return
      if (res.error) { setMessage(res.error); return }
      setMessage(res.summary)
      for (const a of res.anomalies) notify('warn', a.message, 'GP-2306')
      if (!await confirmDialog(`${res.summary}\n\nSave the cleaned (and, if any, duplicates) Result File(s) on the workbench?`)) return
      const names = selectedTables.map(t => t.name).join(' + ')
      const cleanMeta = await DB.createChildTable(project.id, `Clean · ${names}`.slice(0, 60), res.clean, selected, user.email)
      spawnResultCard(cleanMeta, selected)
      if (res.duplicates.length) {
        const dupMeta = await DB.createChildTable(project.id, `Duplicates · ${names}`.slice(0, 60), res.duplicates, selected, user.email)
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
      const name = window.prompt(`Stack ${selectedTables.length} files into one (appends all rows). Name for the new file:`, `${project.name} stacked`)
      if (!name?.trim()) return
      const meta = await DB.mergeTables(project.id, selectedTables.map(t => t.id), name.trim(), user.email)
      spawnResultCard(meta, selected)
      notify('success', `Stacked ${selectedTables.length} files into "${meta.name}" — ${meta.row_count.toLocaleString()} rows.`)
      onRefresh()
      return
    }

    if (actionId === '_intervals') {
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
        const meta = await DB.createChildTable(project.id, `Interval problems · ${names}`.slice(0, 60), issues, selected, user.email)
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
        const meta = await DB.createChildTable(project.id, `Data health · ${names}`.slice(0, 60), res.issues, selected, user.email)
        spawnResultCard(meta, selected)
      }
      onRefresh(); return
    }

    if (actionId === '_undrilled_orphans') {
      const collars   = selectedTables.filter(t => t.type === 'collar')
      const intervals = selectedTables.filter(t => t.type !== 'collar')
      if (!collars.length || !intervals.length) { setMessage('Select at least one collar file and one interval file (assay/survey/lithology).'); return }
      const res = await DB.rpcFindUndrilledOrphans(collars.map(t => t.id), intervals.map(t => t.id))
      if (!res) return
      if (res.error) { setMessage(res.error); return }
      setMessage(res.summary)
      if (res.count === 0) { notify('success', res.summary); return }
      if (await confirmDialog(`${res.summary}\n\nSave these as Result Files on the workbench?`)) {
        if (res.undrilled.length) {
          const meta = await DB.createChildTable(project.id, `Undrilled holes · ${collars.map(t => t.name).join(' + ')}`.slice(0, 60), res.undrilled, selected, user.email)
          spawnResultCard(meta, selected)
        }
        if (res.orphans.length) {
          const meta = await DB.createChildTable(project.id, `Orphan data · ${intervals.map(t => t.name).join(' + ')}`.slice(0, 60), res.orphans, selected, user.email)
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
      if (res.grade_summary.length) { spawnResultCard(await DB.createChildTable(project.id, `Grade summary · ${names}`.slice(0, 60), res.grade_summary, selected, user.email), selected); created++ }
      if (res.best_intercept.length) { spawnResultCard(await DB.createChildTable(project.id, `Best intercepts · ${names}`.slice(0, 60), res.best_intercept, selected, user.email), selected); created++ }
      if (res.rank_by_grade.length) { spawnResultCard(await DB.createChildTable(project.id, `Ranked by grade · ${names}`.slice(0, 60), res.rank_by_grade, selected, user.email), selected); created++ }
      if (res.ppm_table.length) { spawnResultCard(await DB.createChildTable(project.id, `Analysis (HOLEID-MFRO-MTO-MAXIMUMPPM) · ${names}`.slice(0, 60), res.ppm_table, selected, user.email), selected); created++ }
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
        const res = await DB.rpcDistanceFilterPooled(A.id, refs.map(t => t.id), maxDist)
        if (!res) return
        if (res.error) { setMessage(`${A.name}: ${res.error}`); return }
        resRows = res.rows
        refLabel = `holes in ${refs.map(t => t.name).join(' + ')}`
      } else {
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
      const meta = await DB.createChildTable(project.id, `Within ${maxDist.toLocaleString()}m · ${A.name}`.slice(0, 60), resRows, selected, user.email)
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
        const meta = await DB.createChildTable(project.id, `Differences · ${names}`.slice(0, 60), res.issues, selected, user.email)
        spawnResultCard(meta, selected); onRefresh()
      }
      return
    }

    /* Generic check / fix fallthrough */
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
          const meta = await DB.createChildTable(project.id, `${def.label} · ${t.name}`.slice(0, 60), res.issues, [t.id], user.email)
          spawnResultCard(meta, [t.id])
        }
      }
    }
    onRefresh()
  }

  async function askAi() {
    const q = aiPrompt.trim()
    if (!q || !selectedTables.length) { setMessage('Select 1-4 files on the workbench first, then describe what you want.'); return }
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
      const meta = await DB.createChildTable(project.id, `AI · ${q.slice(0, 48)}`, exec.rows, selectedTables.map(t => t.id), user.email)
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
    cleaning: "Add files to the workbench. Click \"Analyse Files\" to scan for issues — missing IDs, null values, interval problems, and orphan data. Fix what's flagged, then join or merge your files when clean.",
    analysis: 'Work with cleaned, validated files. Run Analysis to produce grade summaries, best intercepts, and ranked tables. Use Distance Filter to scope results to an area of interest.',
  }

  /* Analyse button appearance reflects current report status */
  const reportStatus = analysisReport?.overallStatus
  const analyseLabel = analysisRunning ? '… Analysing'
    : reportStatus === 'ok'   ? '✓ All Clear'
    : reportStatus === 'warn' ? '⚠ Issues Found'
    : reportStatus === 'error' ? '✗ Errors Found'
    : '◈ Analyse Files'
  const analyseColor = reportStatus === 'ok' ? 'var(--green)' : reportStatus === 'warn' ? 'var(--orange)' : reportStatus === 'error' ? 'var(--red)' : undefined

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
        {stage === 'cleaning' && (
          <button
            className="btn btn-sm"
            disabled={!canvasTables.length || analysisRunning}
            onClick={runAutoAnalysis}
            style={{
              background: analyseColor ?? 'var(--blue)',
              color: analyseColor ? '#fff',
              fontWeight: 600,
              border: 'none',
            }}
          >
            {analyseLabel}
          </button>
        )}
        {!stageDone && <button className="btn btn-primary btn-sm" onClick={onApprove}>Approve &amp; Continue →</button>}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* file tray */}
        <div style={{ width: 200, borderRight: '1px solid var(--sep)', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px 6px', fontSize: 10, color: 'var(--label-4)', letterSpacing: '.1em', textTransform: 'uppercase', fontFamily: 'monospace' }}>Project files</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px' }}>
            {offCanvas.length === 0 && (
              <div style={{ fontSize: 11, color: 'var(--label-4)', padding: 8 }}>
                {tables.length ? 'All files are on the workbench.' : 'Upload files to begin.'}
              </div>
            )}
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
        <div ref={canvasRef} data-canvas
          style={{ flex: 1, position: 'relative', overflow: 'auto', backgroundImage: 'radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
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
            {canvasTables.filter(t => t.parent_ids?.length).flatMap(t =>
              (t.parent_ids ?? []).filter(pid => onCanvas.includes(pid)).map(pid => {
                const a = positions[pid], b = positions[t.id]
                if (!a || !b) return null
                const x1 = a.x + CARD_W / 2, y1 = a.y + CARD_HEADER_H, x2 = b.x + CARD_W / 2, y2 = b.y
                return <path key={`lin-${t.id}-${pid}`} d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`} stroke="var(--gold)" strokeWidth={1.5} strokeDasharray="5 4" fill="none" opacity={.7} />
              })
            )}
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

        {/* ── Analysis Report Panel ── */}
        {analysisReport && (
          <div style={{ width: 300, flexShrink: 0, borderLeft: '1px solid var(--sep)', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* panel header */}
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--sep)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 12 }}>File Analysis</div>
              <button className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}
                onClick={runAutoAnalysis} disabled={analysisRunning}>
                {analysisRunning ? '…' : 'Re-run'}
              </button>
              <button className="btn-icon" style={{ fontSize: 16, lineHeight: 1 }}
                onClick={() => setAnalysisReport(null)}>×</button>
            </div>

            {/* overall status banner */}
            <div style={{
              padding: '7px 14px',
              background: analysisReport.overallStatus === 'ok' ? 'var(--green)' : analysisReport.overallStatus === 'warn' ? 'var(--orange)' : 'var(--red)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '.02em',
            }}>
              {analysisReport.overallStatus === 'ok'
                ? '✓ All clear — files ready to continue'
                : analysisReport.overallStatus === 'warn'
                  ? '⚠ Issues found — review and fix below'
                  : '✗ Errors found — must fix before continuing'}
            </div>

            {/* per-file results */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
              {analysisReport.files.map(file => (
                <div key={file.tableId} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--label-2)', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {file.tableName}
                  </div>
                  {file.checks.map((ck, i) => (
                    <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 5, fontSize: 11 }}>
                      <span style={{
                        color: ck.status === 'ok' ? 'var(--green)' : ck.status === 'warn' ? 'var(--orange)' : 'var(--red)',
                        fontWeight: 700, minWidth: 12, marginTop: 1,
                      }}>
                        {ck.status === 'ok' ? '✓' : ck.status === 'warn' ? '⚠' : '✗'}
                      </span>
                      <div>
                        <div style={{ color: 'var(--label-1)', fontWeight: 500 }}>{ck.label}</div>
                        <div style={{ color: 'var(--label-3)', fontSize: 10, marginTop: 1, lineHeight: 1.4 }}>{ck.summary}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {analysisReport.crossFile.length > 0 && (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 10, color: 'var(--label-4)', textTransform: 'uppercase', letterSpacing: '.08em', borderTop: '1px solid var(--sep)', paddingTop: 12, marginBottom: 8 }}>
                    Cross-file
                  </div>
                  {analysisReport.crossFile.map((ck, i) => (
                    <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 5, fontSize: 11 }}>
                      <span style={{
                        color: ck.status === 'ok' ? 'var(--green)' : ck.status === 'warn' ? 'var(--orange)' : 'var(--red)',
                        fontWeight: 700, minWidth: 12, marginTop: 1,
                      }}>
                        {ck.status === 'ok' ? '✓' : ck.status === 'warn' ? '⚠' : '✗'}
                      </span>
                      <div>
                        <div style={{ color: 'var(--label-1)', fontWeight: 500 }}>{ck.label}</div>
                        <div style={{ color: 'var(--label-3)', fontSize: 10, marginTop: 1, lineHeight: 1.4 }}>{ck.summary}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontSize: 9.5, color: 'var(--label-4)', marginTop: 14 }}>
                Last run: {analysisReport.ranAt.toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
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
              onClick={() => runAction(a.id)}>
              {busyAction === a.id ? '…' : a.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" style={{ flex: 1, fontSize: 13 }}
            value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
            placeholder='Ask AI about the selected files… e.g. "find holes with gold above 2 g/t" or "list holes missing coordinates"'
            onKeyDown={e => { if (e.key === 'Enter') askAi() }} />
          <button className="btn btn-primary btn-sm" onClick={askAi}
            disabled={aiBusy || !selected.length}
            title={!selected.length ? 'Select 1-4 files on the workbench first' : undefined}>
            {aiBusy ? '…' : 'Ask AI'}
          </button>
        </div>
        {message && <div style={{ fontSize: 12, color: 'var(--label-2)', padding: '4px 2px' }}>{message}</div>}
      </div>

      {showUpload && (
        <UploadModal project={project} user={user}
          onClose={() => setShowUpload(false)}
          onImported={() => { setShowUpload(false); onRefresh() }} />
      )}
    </div>
  )
}
