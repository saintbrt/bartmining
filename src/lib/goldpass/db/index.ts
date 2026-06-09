'use client'

import { createClient } from '../supabase/client'
import type { Project, TableMeta, TableRow, AuditEntry, Output, Version } from './types'
import { detectColType, invertColMapping, newId, ts, exportCsv } from './helpers'

export type { Project, TableMeta, TableRow, AuditEntry, Output, Version }
export { detectColType, invertColMapping, exportCsv }

/* ── In-memory cache ── */
const _c: {
  user: { id: string; email: string } | null
  projects: Project[]
  tables: Record<string, TableMeta[]>
  meta: Record<string, TableMeta>
  rows: Record<string, TableRow[]>
  versions: Record<string, Version[]>
  audit: Record<string, AuditEntry[]>
  outputs: Record<string, Output[]>
} = { user: null, projects: [], tables: {}, meta: {}, rows: {}, versions: {}, audit: {}, outputs: {} }

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

function bg(fn: () => Promise<void>, label: string) {
  Promise.resolve().then(fn).catch(e => {
    console.error('[DB persist] ' + label + ':', e?.message ?? e)
  })
}

/* ── Auth cookie sync ── */
function setAuthCookie(token: string, expiresInSec: number) {
  const maxAge = Math.max(60, Math.min(expiresInSec || 3600, 3600))
  document.cookie = `gp-auth=${token}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`
}
function clearAuthCookie() {
  document.cookie = 'gp-auth=; Path=/; Max-Age=0; SameSite=Lax; Secure'
}

export const DB = {
  ready() {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  },

  /* ── AUTH ── */
  async signIn(email: string, password: string): Promise<{ user: typeof _c.user; error: string | null }> {
    const client = sb()
    const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password })
    if (error) return { user: null, error: error.message }
    _c.user = { id: data.user.id, email: data.user.email! }
    if (data.session) setAuthCookie(data.session.access_token, data.session.expires_in)
    return { user: _c.user, error: null }
  },

  async restoreSession(): Promise<typeof _c.user> {
    const client = sb()
    client.auth.onAuthStateChange((_, session) => {
      if (session?.access_token) setAuthCookie(session.access_token, session.expires_in)
      else clearAuthCookie()
    })
    const { data } = await client.auth.getSession()
    const u = data?.session?.user
    _c.user = u ? { id: u.id, email: u.email! } : null
    if (data?.session?.access_token) setAuthCookie(data.session.access_token, data.session.expires_in)
    return _c.user
  },

  signOut() {
    const client = sb()
    bg(async () => { await client.auth.signOut() }, 'signOut')
    clearAuthCookie()
    _c.user = null; _c.projects = []; _c.tables = {}; _c.meta = {}
    _c.rows = {}; _c.versions = {}; _c.audit = {}; _c.outputs = {}
  },

  /* ── BOOTSTRAP ── */
  async bootstrap() {
    const client = sb()
    const { data: projects } = await client.from('projects').select('*').order('created_at', { ascending: false })
    _c.projects = (projects as Project[]) ?? []
    for (const p of _c.projects) {
      const { data: tables } = await client.from('tables_meta').select('*').eq('project_id', p.id).order('created_at')
      _c.tables[p.id] = (tables as TableMeta[]) ?? []
      ;(_c.tables[p.id] ?? []).forEach(t => { _c.meta[t.id] = t })
      const { data: audit } = await client.from('audit_log').select('*').eq('project_id', p.id).order('created_at', { ascending: false }).limit(200)
      _c.audit[p.id] = ((audit ?? []) as AuditEntry[]).map(a => ({ ...a, timestamp: a.created_at }))
      const { data: outputs } = await client.from('outputs').select('*').eq('project_id', p.id).order('created_at', { ascending: false })
      _c.outputs[p.id] = ((outputs ?? []) as Output[]).map(o => ({ ...o, rows: o.row_count }))
    }
    return _c.projects
  },

  async loadProjectRows(projectId: string) {
    const client = sb()
    const tables = _c.tables[projectId] ?? []
    for (const t of tables) {
      const { data: rows } = await client.from('table_rows').select('data').eq('table_id', t.id).order('row_index')
      _c.rows[t.id] = ((rows ?? []) as { data: TableRow }[]).map(r => r.data)
      const { data: vers } = await client.from('versions').select('*').eq('table_id', t.id).order('created_at', { ascending: false })
      _c.versions[t.id] = (vers as Version[]) ?? []
    }
  },

  /* ── PROJECTS ── */
  getProjects(): Project[] { return _c.projects.slice() },
  createProject(name: string): Project {
    const id = newId()
    const proj: Project = { id, name: name.trim(), owner_id: _c.user?.id ?? '', created_at: ts(), updated_at: ts() }
    _c.projects.unshift(proj)
    _c.tables[id] = []; _c.audit[id] = []; _c.outputs[id] = []
    const client = sb()
    bg(async () => {
      const { error } = await client.from('projects').insert({ id, name: proj.name, owner_id: _c.user!.id })
      if (error) throw error
    }, 'createProject')
    return proj
  },

  /* ── TABLES ── */
  getTables(projectId: string): TableMeta[] { return (_c.tables[projectId] ?? []).slice() },
  getRows(tableId: string, limit = 5000): TableRow[] {
    const r = _c.rows[tableId] ?? []
    return limit ? r.slice(0, limit) : r
  },

  insertTable(projectId: string, name: string, type: string, colMapping: Record<string, string>, rows: TableRow[], userId?: string): TableMeta {
    const id = newId()
    const meta: TableMeta = { id, project_id: projectId, name: name.trim(), type, columns: colMapping, row_count: rows.length, created_at: ts(), updated_at: ts() }
    _c.tables[projectId] = [...(_c.tables[projectId] ?? []), meta]
    _c.meta[id] = meta; _c.rows[id] = rows.slice(); _c.versions[id] = []
    const client = sb()
    bg(async () => {
      const { error: me } = await client.from('tables_meta').insert({ id, project_id: projectId, name: meta.name, type, columns: colMapping, row_count: rows.length })
      if (me) throw me
      await insertRowsChunked(id, projectId, rows)
      await client.from('versions').insert({ table_id: id, project_id: projectId, operation: 'import', row_count: rows.length })
    }, 'insertTable')
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
      await client.from('versions').insert({ table_id: tableId, project_id: projectId, operation, row_count: newRows.length })
    }, 'replaceRows')
    this.log(projectId, tableId, operation, detail, userId)
  },

  deleteTable(tableId: string, projectId: string, userId?: string) {
    const meta = _c.meta[tableId]
    _c.tables[projectId] = (_c.tables[projectId] ?? []).filter(t => t.id !== tableId)
    delete _c.rows[tableId]; delete _c.versions[tableId]; delete _c.meta[tableId]
    const client = sb()
    bg(async () => { const { error } = await client.from('tables_meta').delete().eq('id', tableId); if (error) throw error }, 'deleteTable')
    this.log(projectId, tableId, 'delete', `Deleted table "${meta?.name ?? tableId}"`, userId)
  },

  createChildTable(projectId: string, name: string, rows: TableRow[], parentIds: string[], userId?: string): TableMeta {
    const id = newId()
    const colMapping: Record<string, string> = {}
    if (rows.length) Object.keys(rows[0]).forEach(k => { colMapping[k] = detectColType(k) })
    const meta: TableMeta = { id, project_id: projectId, name: name.trim(), type: 'child', columns: colMapping, row_count: rows.length, parent_ids: parentIds, created_at: ts(), updated_at: ts() }
    _c.tables[projectId] = [...(_c.tables[projectId] ?? []), meta]
    _c.meta[id] = meta; _c.rows[id] = rows.slice(); _c.versions[id] = []
    const client = sb()
    bg(async () => {
      const { error: me } = await client.from('tables_meta').insert({ id, project_id: projectId, name: meta.name, type: 'child', columns: colMapping, row_count: rows.length, parent_ids: parentIds })
      if (me) throw me
      await insertRowsChunked(id, projectId, rows)
      await client.from('versions').insert({ table_id: id, project_id: projectId, operation: 'sql_child', row_count: rows.length })
    }, 'createChildTable')
    this.log(projectId, id, 'sql_child', `Created child table "${meta.name}" — ${rows.length.toLocaleString()} rows`, userId)
    return meta
  },

  mergeTables(projectId: string, tableIds: string[], newName: string, userId?: string): TableMeta {
    const allRows: TableRow[] = []
    tableIds.forEach(id => { allRows.push(...this.getRows(id, 0)) })
    const tables = this.getTables(projectId).filter(t => tableIds.includes(t.id))
    const colMapping = tables[0]?.columns ?? {}
    return this.insertTable(projectId, newName, 'other', colMapping, allRows, userId)
  },

  /* ── AUDIT ── */
  log(projectId: string, tableId: string | null, operation: string, details: string, userId?: string) {
    const entry: AuditEntry = { id: newId(), project_id: projectId, table_id: tableId, operation, details, user_id: userId ?? _c.user?.id ?? '', timestamp: ts(), created_at: ts() }
    _c.audit[projectId] = [entry, ...(_c.audit[projectId] ?? [])].slice(0, 200)
    const client = sb()
    bg(async () => { const { error } = await client.from('audit_log').insert({ project_id: projectId, table_id: tableId, operation, details }); if (error) throw error }, 'audit')
  },
  getAuditLog(projectId: string): AuditEntry[] { return (_c.audit[projectId] ?? []).slice(0, 200) },

  /* ── OUTPUTS ── */
  addOutput(projectId: string, name: string, rows: TableRow[], format: string, userId?: string): Output {
    const id = newId()
    const o: Output = { id, project_id: projectId, name, row_count: rows.length, rows: rows.length, format, created_at: ts() }
    _c.outputs[projectId] = [o, ...(_c.outputs[projectId] ?? [])]
    const client = sb()
    bg(async () => { const { error } = await client.from('outputs').insert({ id, project_id: projectId, name, format, row_count: rows.length }); if (error) throw error }, 'addOutput')
    this.log(projectId, null, `export_${format}`, `Exported "${name}" — ${rows.length.toLocaleString()} rows`, userId)
    exportCsv(rows as Record<string, unknown>[], name + '.csv')
    return o
  },
  getOutputs(projectId: string): Output[] { return (_c.outputs[projectId] ?? []).slice() },

  getVersions(tableId: string): Version[] { return (_c.versions[tableId] ?? []).slice() },

  /* ── EDGE FUNCTIONS ── */
  async goldAI(projectId: string, question: string) {
    const client = sb()
    const { data: { session } } = await client.auth.getSession()
    const r = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/gold-ai`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session?.access_token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, question }),
    })
    return r.json()
  },
}

export { invertColMapping as invertMap }
