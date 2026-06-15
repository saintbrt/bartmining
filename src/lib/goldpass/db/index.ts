'use client'

import { createClient } from '../supabase/client'
import { gpError } from '../errors'
import { notify } from '../notify'
import { AI_MODEL, AI_PRICE_IN_PER_1M, AI_PRICE_OUT_PER_1M } from '../aiConfig'
import type { Project, TableMeta, TableRow, AuditEntry, Output, Version, StageStatus } from './types'
import { detectColType, invertColMapping, newId, ts, exportCsv } from './helpers'

export type { Project, TableMeta, TableRow, AuditEntry, Output, Version, StageStatus }
export { detectColType, invertColMapping, exportCsv }

/* ── In-memory cache (mirror of Supabase state for instant UI) ── */
const _c: {
  user: { id: string; email: string } | null
  projects: Project[]
  tables: Record<string, TableMeta[]>
  meta: Record<string, TableMeta>
  rows: Record<string, TableRow[]>
  versions: Record<string, Version[]>
  audit: Record<string, AuditEntry[]>
  outputs: Record<string, Output[]>
  stages: Record<string, StageStatus>
} = { user: null, projects: [], tables: {}, meta: {}, rows: {}, versions: {}, audit: {}, outputs: {}, stages: {} }

function sb() { return createClient() }

const CHUNK = 1000
async function insertRowsChunked(tableId: string, projectId: string, rows: TableRow[]) {
  const client = sb()
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK).map((data, k) => ({ table_id: tableId, project_id: projectId, row_index: i + k, data }))
    const { error } = await client.from('table_rows').insert(slice)
    if (error) throw error
  }
}

/* Background persistence: UI stays optimistic, but every failure raises a
   coded notification so nothing fails silently. */
function bg(fn: () => Promise<void>, errorCode: string, label: string) {
  Promise.resolve().then(fn).catch(e => {
    gpError(errorCode, `${label}: ${e?.message ?? e}`)
  })
}

const DEFAULT_STAGES: StageStatus = { validation: 'pending', cleaning: 'pending', analysis: 'pending' }

export const DB = {
  ready() {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON)
  },

  /* ── AUTH ── */
  async signIn(email: string, password: string): Promise<{ user: typeof _c.user; error: string | null }> {
    if (!this.ready()) return { user: null, error: gpError('GP-2314', 'Unable to log in') }
    try {
      const client = sb()
      const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password })
      if (error) { gpError('GP-2101', error.message); return { user: null, error: error.message } }
      _c.user = { id: data.user.id, email: data.user.email! }
      return { user: _c.user, error: null }
    } catch (e) {
      return { user: null, error: gpError('GP-2101', e instanceof Error ? e.message : String(e)) }
    }
  },

  async signInWithGoogle(): Promise<{ error: string | null }> {
    if (!this.ready()) return { error: gpError('GP-2314', 'Unable to start Google sign-in') }
    const client = sb()
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin/dashboard` },
    })
    if (error) return { error: gpError('GP-2102', error.message) }
    return { error: null }
  },

  async restoreSession(): Promise<typeof _c.user> {
    if (!this.ready()) { gpError('GP-2314', 'Session restore skipped'); return null }
    try {
      const client = sb()
      const { data, error } = await client.auth.getSession()
      if (error) { gpError('GP-2103', error.message); return null }
      const u = data?.session?.user
      _c.user = u ? { id: u.id, email: u.email! } : null
      return _c.user
    } catch (e) {
      gpError('GP-2103', e instanceof Error ? e.message : String(e))
      return null
    }
  },

  signOut() {
    const client = sb()
    bg(async () => { await client.auth.signOut() }, 'GP-2104', 'signOut')
    _c.user = null; _c.projects = []; _c.tables = {}; _c.meta = {}
    _c.rows = {}; _c.versions = {}; _c.audit = {}; _c.outputs = {}; _c.stages = {}
  },

  /* ── BOOTSTRAP ── */
  async bootstrap() {
    const client = sb()
    const { data: projects, error } = await client.from('projects').select('*').order('created_at', { ascending: false })
    if (error) { gpError(error.code === '42501' ? 'GP-2105' : 'GP-2208', error.message); return [] }
    _c.projects = (projects as Project[]) ?? []
    for (const p of _c.projects) {
      const { data: tables } = await client.from('tables_meta').select('*').eq('project_id', p.id).order('created_at')
      _c.tables[p.id] = (tables as TableMeta[]) ?? []
      ;(_c.tables[p.id] ?? []).forEach(t => { _c.meta[t.id] = t })
      const { data: audit } = await client.from('audit_log').select('*').eq('project_id', p.id).order('created_at', { ascending: false }).limit(200)
      _c.audit[p.id] = ((audit ?? []) as AuditEntry[]).map(a => ({ ...a, timestamp: a.created_at }))
      const { data: outputs } = await client.from('outputs').select('id,project_id,name,format,row_count,created_at').eq('project_id', p.id).order('created_at', { ascending: false })
      _c.outputs[p.id] = (outputs ?? []) as Output[]
      const { data: stage } = await client.from('project_stages').select('*').eq('project_id', p.id).maybeSingle()
      _c.stages[p.id] = stage
        ? { validation: stage.validation, cleaning: stage.cleaning, analysis: stage.analysis }
        : { ...DEFAULT_STAGES }
    }
    return _c.projects
  },

  async loadProjectRows(projectId: string) {
    const client = sb()
    const tables = _c.tables[projectId] ?? []
    for (const t of tables) {
      const { data: rows, error } = await client.from('table_rows').select('data').eq('table_id', t.id).order('row_index')
      if (error) { gpError('GP-2208', `rows for "${t.name}": ${error.message}`); continue }
      _c.rows[t.id] = ((rows ?? []) as { data: TableRow }[]).map(r => r.data)
      const { data: vers } = await client.from('versions').select('*').eq('table_id', t.id).order('created_at', { ascending: false })
      _c.versions[t.id] = (vers as Version[]) ?? []
    }
  },

  /* Lazy single-file row loader — fetch one file's rows on demand (medium data:
     10k–100k rows/file). Refreshes the cache so getRows() stays synchronous for
     the UI. Returns the rows it loaded. */
  async loadTableRows(tableId: string): Promise<TableRow[]> {
    const client = sb()
    const meta = _c.meta[tableId]
    const { data: rows, error } = await client.from('table_rows').select('data').eq('table_id', tableId).order('row_index')
    if (error) { gpError('GP-2208', `rows for "${meta?.name ?? tableId}": ${error.message}`); return _c.rows[tableId] ?? [] }
    _c.rows[tableId] = ((rows ?? []) as { data: TableRow }[]).map(r => r.data)
    if (!_c.versions[tableId]) {
      const { data: vers } = await client.from('versions').select('*').eq('table_id', tableId).order('created_at', { ascending: false })
      _c.versions[tableId] = (vers as Version[]) ?? []
    }
    return _c.rows[tableId]
  },
  rowsLoaded(tableId: string): boolean { return Array.isArray(_c.rows[tableId]) },

  /* ── PROJECTS ── */
  getProjects(): Project[] { return _c.projects.slice() },
  createProject(name: string): Project {
    const id = newId()
    const proj: Project = { id, name: name.trim(), owner_id: _c.user?.id ?? '', created_at: ts(), updated_at: ts() }
    _c.projects.unshift(proj)
    _c.tables[id] = []; _c.audit[id] = []; _c.outputs[id] = []; _c.stages[id] = { ...DEFAULT_STAGES }
    const client = sb()
    bg(async () => {
      const { error } = await client.from('projects').insert({ id, name: proj.name, owner_id: _c.user!.id })
      if (error) throw error
    }, 'GP-2201', `project "${proj.name}"`)
    return proj
  },

  /* ── STAGES (server-persisted workflow state) ── */
  getStageStatus(projectId: string): StageStatus {
    return _c.stages[projectId] ?? { ...DEFAULT_STAGES }
  },
  setStageStatus(projectId: string, next: StageStatus, userId?: string) {
    _c.stages[projectId] = next
    const client = sb()
    bg(async () => {
      const { error } = await client.from('project_stages').upsert({ project_id: projectId, ...next, updated_at: ts() })
      if (error) throw error
    }, 'GP-2207', `stages for project ${projectId}`)
    this.log(projectId, null, 'stage_update', `Stages → validation:${next.validation} cleaning:${next.cleaning} analysis:${next.analysis}`, userId)
  },

  /* ── TABLES ── */
  getTables(projectId: string): TableMeta[] { return (_c.tables[projectId] ?? []).slice() },
  getRows(tableId: string, limit = 0): TableRow[] {
    const r = _c.rows[tableId] ?? []
    return limit ? r.slice(0, limit) : r
  },

  /* Persists tables_meta + rows BEFORE resolving, so the returned TableMeta's id
     is immediately usable in gp_* RPC calls (which look it up via tables_meta).
     Versions are written in the background — not needed for the row to "exist". */
  async insertTable(projectId: string, name: string, type: string, colMapping: Record<string, string>, rows: TableRow[], userId?: string): Promise<TableMeta> {
    const id = newId()
    const meta: TableMeta = { id, project_id: projectId, name: name.trim(), type, columns: colMapping, row_count: rows.length, created_at: ts(), updated_at: ts() }
    const client = sb()
    try {
      const { error: me } = await client.from('tables_meta').insert({ id, project_id: projectId, name: meta.name, type, columns: colMapping, row_count: rows.length })
      if (me) throw me
      await insertRowsChunked(id, projectId, rows)
    } catch (e) {
      gpError('GP-2202', `table "${meta.name}" (${rows.length} rows): ${e instanceof Error ? e.message : String(e)}`)
    }
    _c.tables[projectId] = [...(_c.tables[projectId] ?? []), meta]
    _c.meta[id] = meta; _c.rows[id] = rows.slice(); _c.versions[id] = []
    bg(async () => {
      await client.from('versions').insert({ table_id: id, project_id: projectId, operation: 'import', row_count: rows.length, data: rows })
    }, 'GP-2202', `table "${meta.name}" version snapshot`)
    this.log(projectId, id, 'import', `Imported "${meta.name}" (${type}) — ${rows.length.toLocaleString()} rows`, userId)
    return meta
  },

  replaceRows(tableId: string, newRows: TableRow[], userId: string | undefined, operation: string, detail: string) {
    _c.rows[tableId] = newRows.slice()
    const meta = _c.meta[tableId]
    const projectId = meta?.project_id ?? ''
    if (meta) {
      meta.row_count = newRows.length; meta.updated_at = ts()
      _c.tables[projectId] = (_c.tables[projectId] ?? []).map(t => t.id === tableId ? { ...t, row_count: newRows.length, updated_at: meta.updated_at } : t)
    }
    const client = sb()
    bg(async () => {
      const { error: de } = await client.from('table_rows').delete().eq('table_id', tableId); if (de) throw de
      await insertRowsChunked(tableId, projectId, newRows)
      await client.from('tables_meta').update({ row_count: newRows.length, updated_at: ts() }).eq('id', tableId)
      await client.from('versions').insert({ table_id: tableId, project_id: projectId, operation, row_count: newRows.length, data: newRows })
    }, 'GP-2203', `"${meta?.name ?? tableId}" (${operation})`)
    this.log(projectId, tableId, operation, detail, userId)
  },

  deleteTable(tableId: string, projectId: string, userId?: string) {
    const meta = _c.meta[tableId]
    _c.tables[projectId] = (_c.tables[projectId] ?? []).filter(t => t.id !== tableId)
    delete _c.rows[tableId]; delete _c.versions[tableId]; delete _c.meta[tableId]
    const client = sb()
    bg(async () => { const { error } = await client.from('tables_meta').delete().eq('id', tableId); if (error) throw error }, 'GP-2204', `table "${meta?.name ?? tableId}"`)
    this.log(projectId, tableId, 'delete', `Deleted table "${meta?.name ?? tableId}"`, userId)
  },

  /* See insertTable() comment — same "persist before resolving" rationale, so
     a result/derived table can be selected and used in a follow-up RPC
     immediately after creation. */
  async createChildTable(projectId: string, name: string, rows: TableRow[], parentIds: string[], userId?: string): Promise<TableMeta> {
    const id = newId()
    const colMapping: Record<string, string> = {}
    if (rows.length) Object.keys(rows[0]).forEach(k => { colMapping[k] = detectColType(k) })
    const meta: TableMeta = { id, project_id: projectId, name: name.trim(), type: 'child', columns: colMapping, row_count: rows.length, parent_ids: parentIds, created_at: ts(), updated_at: ts() }
    const client = sb()
    try {
      const { error: me } = await client.from('tables_meta').insert({ id, project_id: projectId, name: meta.name, type: 'child', columns: colMapping, row_count: rows.length, parent_ids: parentIds })
      if (me) throw me
      await insertRowsChunked(id, projectId, rows)
    } catch (e) {
      gpError('GP-2202', `derived table "${meta.name}": ${e instanceof Error ? e.message : String(e)}`)
    }
    _c.tables[projectId] = [...(_c.tables[projectId] ?? []), meta]
    _c.meta[id] = meta; _c.rows[id] = rows.slice(); _c.versions[id] = []
    bg(async () => {
      await client.from('versions').insert({ table_id: id, project_id: projectId, operation: 'derived', row_count: rows.length, data: rows })
    }, 'GP-2202', `derived table "${meta.name}" version snapshot`)
    this.log(projectId, id, 'derived', `Created derived table "${meta.name}" — ${rows.length.toLocaleString()} rows`, userId)
    return meta
  },

  async mergeTables(projectId: string, tableIds: string[], newName: string, userId?: string): Promise<TableMeta> {
    // column-aware union: the merged table carries every column seen in any source
    const allRows: TableRow[] = []
    const colMapping: Record<string, string> = {}
    const tables = this.getTables(projectId).filter(t => tableIds.includes(t.id))
    tables.forEach(t => { Object.entries(t.columns).forEach(([c, ty]) => { if (!(c in colMapping)) colMapping[c] = ty }) })
    const allCols = Object.keys(colMapping)
    tableIds.forEach(id => {
      this.getRows(id, 0).forEach(r => {
        const nr: TableRow = {}
        allCols.forEach(c => { nr[c] = r[c] ?? '' })
        allRows.push(nr)
      })
    })
    return await this.insertTable(projectId, newName, 'merged', colMapping, allRows, userId)
  },

  /* ── AUDIT ── */
  log(projectId: string, tableId: string | null, operation: string, details: string, userId?: string) {
    const entry: AuditEntry = { id: newId(), project_id: projectId, table_id: tableId, operation, details, user_id: userId ?? _c.user?.id ?? '', timestamp: ts(), created_at: ts() }
    _c.audit[projectId] = [entry, ...(_c.audit[projectId] ?? [])].slice(0, 200)
    const client = sb()
    bg(async () => { const { error } = await client.from('audit_log').insert({ project_id: projectId, table_id: tableId, operation, details }); if (error) throw error }, 'GP-2205', operation)
  },
  getAuditLog(projectId: string): AuditEntry[] { return (_c.audit[projectId] ?? []).slice(0, 200) },

  /* ── OUTPUTS (rows stored in the database, downloadable any time) ── */
  addOutput(projectId: string, name: string, rows: TableRow[], format: string, userId?: string): Output | null {
    if (!rows.length) { gpError('GP-2501', name); return null }
    const id = newId()
    const o: Output = { id, project_id: projectId, name, row_count: rows.length, format, created_at: ts() }
    _c.outputs[projectId] = [o, ...(_c.outputs[projectId] ?? [])]
    const client = sb()
    bg(async () => {
      const { error } = await client.from('outputs').insert({ id, project_id: projectId, name, format, row_count: rows.length, data: rows })
      if (error) throw error
    }, 'GP-2206', `output "${name}"`)
    this.log(projectId, null, `export_${format}`, `Built output "${name}" — ${rows.length.toLocaleString()} rows`, userId)
    exportCsv(rows as Record<string, unknown>[], name + '.csv')
    return o
  },
  getOutputs(projectId: string): Output[] { return (_c.outputs[projectId] ?? []).slice() },

  async downloadOutput(output: Output) {
    const client = sb()
    const { data, error } = await client.from('outputs').select('data').eq('id', output.id).single()
    if (error || !data?.data?.length) { gpError('GP-2502', `"${output.name}": ${error?.message ?? 'no stored rows'}`); return }
    exportCsv(data.data as Record<string, unknown>[], output.name + '.csv')
    notify('success', `Downloaded "${output.name}" (${output.row_count.toLocaleString()} rows).`)
  },

  getVersions(tableId: string): Version[] { return (_c.versions[tableId] ?? []).slice() },

  /* Restore a table to the row snapshot stored with a version. */
  async restoreVersion(tableId: string, versionId: string, userId?: string): Promise<boolean> {
    const client = sb()
    const { data, error } = await client.from('versions').select('data,operation,created_at').eq('id', versionId).single()
    if (error || !Array.isArray(data?.data)) { gpError('GP-2209', error?.message ?? 'version has no stored rows'); return false }
    const when = new Date(data.created_at).toLocaleString()
    this.replaceRows(tableId, data.data as TableRow[], userId, 'restore', `Restored version from ${when} (${data.operation})`)
    return true
  },

  renameTable(tableId: string, name: string, userId?: string) {
    const meta = _c.meta[tableId]; if (!meta || !name.trim()) return
    meta.name = name.trim(); meta.updated_at = ts()
    _c.tables[meta.project_id] = (_c.tables[meta.project_id] ?? []).map(t => t.id === tableId ? { ...t, name: meta.name } : t)
    const client = sb()
    bg(async () => { const { error } = await client.from('tables_meta').update({ name: meta.name, updated_at: ts() }).eq('id', tableId); if (error) throw error }, 'GP-2203', `rename "${meta.name}"`)
    this.log(meta.project_id, tableId, 'rename', `Renamed file to "${meta.name}"`, userId)
  },

  setTableType(tableId: string, type: string, userId?: string) {
    const meta = _c.meta[tableId]; if (!meta) return
    meta.type = type; meta.updated_at = ts()
    _c.tables[meta.project_id] = (_c.tables[meta.project_id] ?? []).map(t => t.id === tableId ? { ...t, type } : t)
    const client = sb()
    bg(async () => { const { error } = await client.from('tables_meta').update({ type, updated_at: ts() }).eq('id', tableId); if (error) throw error }, 'GP-2203', `type of "${meta.name}"`)
    this.log(meta.project_id, tableId, 'retype', `Changed file type of "${meta.name}" to ${type}`, userId)
  },

  setTableColumns(tableId: string, columns: Record<string, string>, rows: TableRow[] | null, userId?: string, detail = 'Updated columns') {
    const meta = _c.meta[tableId]; if (!meta) return
    meta.columns = columns; meta.updated_at = ts()
    _c.tables[meta.project_id] = (_c.tables[meta.project_id] ?? []).map(t => t.id === tableId ? { ...t, columns } : t)
    const client = sb()
    bg(async () => { const { error } = await client.from('tables_meta').update({ columns, updated_at: ts() }).eq('id', tableId); if (error) throw error }, 'GP-2203', `columns of "${meta.name}"`)
    if (rows) this.replaceRows(tableId, rows, userId, 'columns', detail)
    else this.log(meta.project_id, tableId, 'columns', detail, userId)
  },

  renameProject(projectId: string, name: string, userId?: string) {
    const p = _c.projects.find(x => x.id === projectId); if (!p || !name.trim()) return
    p.name = name.trim(); p.updated_at = ts()
    const client = sb()
    bg(async () => { const { error } = await client.from('projects').update({ name: p.name, updated_at: ts() }).eq('id', projectId); if (error) throw error }, 'GP-2201', `rename project`)
    this.log(projectId, null, 'rename', `Renamed project to "${p.name}"`, userId)
  },

  deleteProject(projectId: string, userId?: string) {
    const p = _c.projects.find(x => x.id === projectId)
    _c.projects = _c.projects.filter(x => x.id !== projectId)
    ;(_c.tables[projectId] ?? []).forEach(t => { delete _c.rows[t.id]; delete _c.versions[t.id]; delete _c.meta[t.id] })
    delete _c.tables[projectId]; delete _c.audit[projectId]; delete _c.outputs[projectId]; delete _c.stages[projectId]
    const client = sb()
    bg(async () => { const { error } = await client.from('projects').delete().eq('id', projectId); if (error) throw error }, 'GP-2204', `project "${p?.name ?? projectId}"`)
  },

  renameOutput(outputId: string, projectId: string, name: string) {
    if (!name.trim()) return
    _c.outputs[projectId] = (_c.outputs[projectId] ?? []).map(o => o.id === outputId ? { ...o, name: name.trim() } : o)
    const client = sb()
    bg(async () => { const { error } = await client.from('outputs').update({ name: name.trim() }).eq('id', outputId); if (error) throw error }, 'GP-2206', 'rename output')
  },

  deleteOutput(outputId: string, projectId: string) {
    const o = (_c.outputs[projectId] ?? []).find(x => x.id === outputId)
    _c.outputs[projectId] = (_c.outputs[projectId] ?? []).filter(x => x.id !== outputId)
    const client = sb()
    bg(async () => { const { error } = await client.from('outputs').delete().eq('id', outputId); if (error) throw error }, 'GP-2206', `delete output "${o?.name ?? outputId}"`)
  },

  /* ── AI (gold-ai edge function — schema-aware NL → SQL) ── */
  async goldAI(projectId: string, question: string): Promise<{ sql?: string; note?: string; error?: string; code?: string }> {
    if (!this.ready()) return { error: gpError('GP-2314', 'AI request blocked'), code: 'GP-2314' }
    const client = sb()
    const { data: { session } } = await client.auth.getSession()
    const schemas = (_c.tables[projectId] ?? []).map(t => ({
      name: t.name, type: t.type, row_count: t.row_count,
      columns: Object.entries(t.columns).map(([col, role]) => ({ col, role })),
    }))
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/gold-ai`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, question, schemas }),
      })
      if (!r.ok) {
        const body = await r.text().catch(() => '')
        const code = r.status === 404 ? 'GP-2401' : body.includes('ANTHROPIC_API_KEY') ? 'GP-2403' : 'GP-2401'
        return { error: gpError(code, `HTTP ${r.status}`), code }
      }
      const json = await r.json()
      if (json?.usage) this.logAiUsage(projectId, json.model ?? AI_MODEL, json.usage.input_tokens ?? 0, json.usage.output_tokens ?? 0)
      if (!json?.sql || typeof json.sql !== 'string') return { error: gpError('GP-2402', JSON.stringify(json).slice(0, 120)), code: 'GP-2402' }
      return { sql: json.sql, note: json.note }
    } catch (e) {
      return { error: gpError('GP-2401', e instanceof Error ? e.message : String(e)), code: 'GP-2401' }
    }
  },

  /* ── AI USAGE (token + $ budget tracking for the Settings meter) ── */
  logAiUsage(projectId: string, model: string, tokensIn: number, tokensOut: number) {
    const client = sb()
    bg(async () => {
      const { error } = await client.from('ai_usage').insert({ project_id: projectId, model, tokens_in: tokensIn, tokens_out: tokensOut })
      if (error) throw error
    }, 'GP-2410', 'AI usage logging')
  },
  /* Sum this calendar month's tokens across all of the user's projects. */
  async getAiUsageThisMonth(): Promise<{ tokensIn: number; tokensOut: number; requests: number; cost: number }> {
    const client = sb()
    const since = new Date(); since.setDate(1); since.setHours(0, 0, 0, 0)
    const { data, error } = await client.from('ai_usage').select('tokens_in,tokens_out').gte('created_at', since.toISOString())
    if (error || !data) return { tokensIn: 0, tokensOut: 0, requests: 0, cost: 0 }
    const tokensIn = data.reduce((a, r) => a + (r.tokens_in ?? 0), 0)
    const tokensOut = data.reduce((a, r) => a + (r.tokens_out ?? 0), 0)
    const cost = (tokensIn * AI_PRICE_IN_PER_1M + tokensOut * AI_PRICE_OUT_PER_1M) / 1_000_000
    return { tokensIn, tokensOut, requests: data.length, cost }
  },

  /* ── WORKBENCH STATE (per project+stage canvas layout, for session resume) ── */
  saveWorkbenchState(projectId: string, stage: string, layout: { table_id: string; x: number; y: number }[], selection: string[]) {
    const client = sb()
    bg(async () => {
      const { error } = await client.from('workbench_state').upsert({ project_id: projectId, stage, layout, selection, updated_at: ts() })
      if (error) throw error
    }, 'GP-2411', `workbench layout (${stage})`)
  },
  async getWorkbenchState(projectId: string, stage: string): Promise<{ layout: { table_id: string; x: number; y: number }[]; selection: string[] } | null> {
    const client = sb()
    const { data, error } = await client.from('workbench_state').select('layout,selection').eq('project_id', projectId).eq('stage', stage).maybeSingle()
    if (error || !data) return null
    return { layout: (data.layout ?? []) as { table_id: string; x: number; y: number }[], selection: (data.selection ?? []) as string[] }
  },

  /* ── BACKEND CHECK RPCs (Step 2 parity port; run where the rows live) ──
     Each returns the same shape as runCheck()/applyFix() in dataChecks, so the
     thin client wrappers (Step 7) can swap to these without UI changes. */
  async rpcRunCheck(checkId: string, tableId: string, compareId?: string): Promise<Record<string, unknown> | null> {
    const { data, error } = await sb().rpc('gp_run_check', { p_check: checkId, p_table: tableId, p_compare: compareId ?? null })
    if (error) { gpError('GP-2305', `${checkId}: ${error.message}`); return null }
    return data as Record<string, unknown>
  },
  async rpcApplyFix(checkId: string, tableId: string): Promise<TableRow[] | null> {
    const { data, error } = await sb().rpc('gp_apply_fix', { p_check: checkId, p_table: tableId })
    if (error) { gpError('GP-2305', `${checkId} fix: ${error.message}`); return null }
    const d = data as { rows?: TableRow[]; error?: string }
    if (d?.error) { gpError('GP-2305', d.error); return null }
    return (d?.rows ?? []) as TableRow[]
  },
  async rpcBuildCollarOutput(collarId: string, intervalId: string): Promise<{ rows: TableRow[]; error?: string } | null> {
    const { data, error } = await sb().rpc('gp_build_collar_output', { p_collar: collarId, p_interval: intervalId })
    if (error) { gpError('GP-2303', error.message); return null }
    return data as { rows: TableRow[]; error?: string }
  },
  async rpcBuildPpmOutput(tableIds: string[]): Promise<{ rows: TableRow[]; error?: string } | null> {
    const { data, error } = await sb().rpc('gp_build_ppm_output', { p_tables: tableIds })
    if (error) { gpError('GP-2303', error.message); return null }
    return data as { rows: TableRow[]; error?: string }
  },
  async rpcCombineAndDedupe(tableIds: string[]): Promise<{ clean: TableRow[]; duplicates: TableRow[]; anomalies: { type: string; message: string }[]; summary: string; error?: string } | null> {
    const { data, error } = await sb().rpc('gp_combine_and_dedupe', { p_tables: tableIds })
    if (error) { gpError('GP-2305', `combine & dedupe: ${error.message}`); return null }
    return data as { clean: TableRow[]; duplicates: TableRow[]; anomalies: { type: string; message: string }[]; summary: string; error?: string }
  },
  async rpcFixFormatting(tableIds: string[]): Promise<{ files: { table_id: string; rows: TableRow[]; trimmed: number; standardised: number; removed_empty: number; placeholders_cleared: number }[]; error?: string } | null> {
    const { data, error } = await sb().rpc('gp_fix_formatting', { p_tables: tableIds })
    if (error) { gpError('GP-2305', `fix formatting: ${error.message}`); return null }
    return data as { files: { table_id: string; rows: TableRow[]; trimmed: number; standardised: number; removed_empty: number; placeholders_cleared: number }[]; error?: string }
  },
  async rpcCheckIntervals(tableIds: string[]): Promise<{ order_issues: TableRow[]; overlaps: TableRow[]; gaps: TableRow[]; count: number; summary: string; error?: string } | null> {
    const { data, error } = await sb().rpc('gp_check_intervals', { p_tables: tableIds })
    if (error) { gpError('GP-2305', `check intervals: ${error.message}`); return null }
    return data as { order_issues: TableRow[]; overlaps: TableRow[]; gaps: TableRow[]; count: number; summary: string; error?: string }
  },
  async rpcCheckDataHealth(tableIds: string[]): Promise<{ issues: TableRow[]; negative_grades: number; coord_outliers: number; incomplete_collars: number; count: number; coord_system: { system: string; confidence: string; notes: string; avg_e: number; avg_n: number }; summary: string; error?: string } | null> {
    const { data, error } = await sb().rpc('gp_check_data_health', { p_tables: tableIds })
    if (error) { gpError('GP-2305', `check data health: ${error.message}`); return null }
    return data as { issues: TableRow[]; negative_grades: number; coord_outliers: number; incomplete_collars: number; count: number; coord_system: { system: string; confidence: string; notes: string; avg_e: number; avg_n: number }; summary: string; error?: string }
  },
  async rpcFindUndrilledOrphans(collarIds: string[], intervalIds: string[]): Promise<{ undrilled: TableRow[]; orphans: TableRow[]; count: number; summary: string; error?: string } | null> {
    const { data, error } = await sb().rpc('gp_find_undrilled_orphans', { p_collars: collarIds, p_intervals: intervalIds })
    if (error) { gpError('GP-2305', `find undrilled/orphans: ${error.message}`); return null }
    return data as { undrilled: TableRow[]; orphans: TableRow[]; count: number; summary: string; error?: string }
  },
  async rpcCompareFiles(tableIds: string[]): Promise<{ issues: TableRow[]; count: number; summary: string; error?: string } | null> {
    const { data, error } = await sb().rpc('gp_compare_files', { p_tables: tableIds })
    if (error) { gpError('GP-2305', `compare files: ${error.message}`); return null }
    return data as { issues: TableRow[]; count: number; summary: string; error?: string }
  },
  async rpcAnalysisPool(tableIds: string[]): Promise<{ grade_summary: TableRow[]; best_intercept: TableRow[]; rank_by_grade: TableRow[]; ppm_table: TableRow[]; summary: string; error?: string } | null> {
    const { data, error } = await sb().rpc('gp_analysis_pool', { p_tables: tableIds })
    if (error) { gpError('GP-2305', `analysis: ${error.message}`); return null }
    return data as { grade_summary: TableRow[]; best_intercept: TableRow[]; rank_by_grade: TableRow[]; ppm_table: TableRow[]; summary: string; error?: string }
  },
  async rpcDistanceFilterPooled(tableId: string, refIds: string[], maxDist: number, point?: [number, number]): Promise<{ rows: TableRow[]; error?: string } | null> {
    const { data, error } = await sb().rpc('gp_distance_filter_pooled', { p_table: tableId, p_refs: refIds, p_max: maxDist, p_point: point ?? null })
    if (error) { gpError('GP-2305', `distance filter: ${error.message}`); return null }
    return data as { rows: TableRow[]; error?: string }
  },
}
