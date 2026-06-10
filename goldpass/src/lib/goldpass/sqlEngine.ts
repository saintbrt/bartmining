import type { TableRow } from './db/types'

/* GoldPass workbench SQL engine.
   Executes the SQL the AI (or the user) writes against the in-memory project
   tables — no `new Function`, no eval. Supported dialect:

     SELECT [DISTINCT] * | col [AS alias], AGG(col) [AS alias], ...
       FROM table [, table2 ...]            -- multiple tables = rows concatenated
       [WHERE <expr>]                       -- =, !=, <>, >, <, >=, <=, LIKE,
                                            -- IS [NOT] NULL, AND, OR, NOT, ( )
       [GROUP BY col, ...]
       [ORDER BY col|alias [ASC|DESC]]
       [LIMIT n]

     DELETE FROM table WHERE <expr>         -- returns kept + removed rows;
                                            -- the caller decides whether to apply

   Aggregates: MAX, MIN, AVG, SUM, COUNT, COUNT(*), COUNT(DISTINCT col)
   Errors carry GoldPass error codes (GP-23xx). */

export interface SqlSelectResult {
  action: 'select'
  rows: TableRow[]
  total: number
  sources: string[]
}
export interface SqlDeleteResult {
  action: 'delete'
  tableId: string
  tableName: string
  kept: TableRow[]
  removed: number
}
export interface SqlError { error: string; code: string }
export type SqlResult = SqlSelectResult | SqlDeleteResult | SqlError

interface TableRef { id: string; name: string }
type GetRows = (id: string) => TableRow[]

/* ── tokenizer ── */
interface Tok { t: 'id' | 'num' | 'str' | 'op' | 'punc'; v: string }

function tokenize(src: string): Tok[] | SqlError {
  const toks: Tok[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (/\s/.test(c)) { i++; continue }
    if (c === "'" || c === '"') {
      const q = c; let j = i + 1, s = ''
      while (j < src.length && src[j] !== q) { s += src[j]; j++ }
      if (j >= src.length) return { error: `Unterminated string starting at "${src.slice(i, i + 12)}…"`, code: 'GP-2301' }
      toks.push({ t: q === "'" ? 'str' : 'id', v: s }); i = j + 1; continue
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      let j = i; while (j < src.length && /[0-9.]/.test(src[j])) j++
      toks.push({ t: 'num', v: src.slice(i, j) }); i = j; continue
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i; while (j < src.length && /[A-Za-z0-9_$.]/.test(src[j])) j++
      toks.push({ t: 'id', v: src.slice(i, j) }); i = j; continue
    }
    const two = src.slice(i, i + 2)
    if (['>=', '<=', '!=', '<>'].includes(two)) { toks.push({ t: 'op', v: two === '<>' ? '!=' : two }); i += 2; continue }
    if ('=><'.includes(c)) { toks.push({ t: 'op', v: c }); i++; continue }
    if ('(),*;'.includes(c)) { toks.push({ t: 'punc', v: c }); i++; continue }
    return { error: `Unexpected character "${c}" in SQL.`, code: 'GP-2301' }
  }
  return toks
}

/* ── WHERE expression parser → predicate ── */
type Pred = (row: TableRow, col: (name: string) => unknown) => boolean

class P {
  toks: Tok[]; pos = 0
  constructor(toks: Tok[]) { this.toks = toks }
  peek(): Tok | undefined { return this.toks[this.pos] }
  next(): Tok | undefined { return this.toks[this.pos++] }
  isKw(kw: string): boolean { const t = this.peek(); return !!t && t.t === 'id' && t.v.toUpperCase() === kw }
  eatKw(kw: string): boolean { if (this.isKw(kw)) { this.pos++; return true } return false }
}

function cmp(a: unknown, b: unknown, op: string): boolean {
  const an = parseFloat(String(a)), bn = parseFloat(String(b))
  const numeric = !isNaN(an) && !isNaN(bn)
  const as = String(a ?? '').toLowerCase(), bs = String(b ?? '').toLowerCase()
  switch (op) {
    case '=': return numeric ? an === bn : as === bs
    case '!=': return numeric ? an !== bn : as !== bs
    case '>': return numeric ? an > bn : as > bs
    case '<': return numeric ? an < bn : as < bs
    case '>=': return numeric ? an >= bn : as >= bs
    case '<=': return numeric ? an <= bn : as <= bs
    default: return false
  }
}

function parseExpr(p: P): Pred | SqlError {
  let left = parseAnd(p)
  if ('error' in (left as SqlError) && (left as SqlError).error) return left
  while (p.eatKw('OR')) {
    const right = parseAnd(p)
    if ('error' in (right as SqlError) && (right as SqlError).error) return right
    const l = left as Pred, r = right as Pred
    left = (row, col) => l(row, col) || r(row, col)
  }
  return left
}
function parseAnd(p: P): Pred | SqlError {
  let left = parseNot(p)
  if (typeof left !== 'function') return left
  while (p.eatKw('AND')) {
    const right = parseNot(p)
    if (typeof right !== 'function') return right
    const l = left as Pred, r = right
    left = (row, col) => l(row, col) && r(row, col)
  }
  return left
}
function parseNot(p: P): Pred | SqlError {
  if (p.eatKw('NOT')) {
    const inner = parseNot(p)
    if (typeof inner !== 'function') return inner
    return (row, col) => !inner(row, col)
  }
  return parseAtom(p)
}
function parseAtom(p: P): Pred | SqlError {
  const t = p.peek()
  if (!t) return { error: 'Unexpected end of WHERE clause.', code: 'GP-2304' }
  if (t.t === 'punc' && t.v === '(') {
    p.next()
    const inner = parseExpr(p)
    if (typeof inner !== 'function') return inner
    const close = p.next()
    if (!close || close.v !== ')') return { error: 'Missing ")" in WHERE clause.', code: 'GP-2304' }
    return inner
  }
  if (t.t !== 'id') return { error: `Expected a column name, got "${t.v}".`, code: 'GP-2304' }
  const colName = t.v; p.next()
  if (p.eatKw('IS')) {
    const not = p.eatKw('NOT')
    if (!p.eatKw('NULL')) return { error: 'Expected NULL after IS.', code: 'GP-2304' }
    return (row, col) => {
      const v = col(colName)
      const isNull = v == null || String(v).trim() === ''
      return not ? !isNull : isNull
    }
  }
  if (p.eatKw('LIKE')) {
    const v = p.next()
    if (!v || v.t !== 'str') return { error: 'LIKE requires a quoted string pattern.', code: 'GP-2304' }
    const re = new RegExp('^' + v.v.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i')
    return (row, col) => re.test(String(col(colName) ?? ''))
  }
  const op = p.next()
  if (!op || op.t !== 'op') return { error: `Expected an operator after "${colName}".`, code: 'GP-2304' }
  const val = p.next()
  if (!val || (val.t !== 'num' && val.t !== 'str' && val.t !== 'id')) return { error: `Expected a value after "${colName} ${op.v}".`, code: 'GP-2304' }
  if (val.t === 'id') {
    // column-to-column comparison
    return (row, col) => cmp(col(colName), col(val.v), op.v)
  }
  const literal = val.v
  return (row, col) => cmp(col(colName), literal, op.v)
}

/* ── select-list parsing ── */
const AGGS = new Set(['MAX', 'MIN', 'AVG', 'SUM', 'COUNT'])
interface SelItem { kind: 'col' | 'agg' | 'star'; col?: string; agg?: string; distinct?: boolean; alias: string }

function parseSelectList(p: P): SelItem[] | SqlError {
  const items: SelItem[] = []
  for (;;) {
    const t = p.peek()
    if (!t) return { error: 'Unexpected end of SELECT list.', code: 'GP-2301' }
    if (t.t === 'punc' && t.v === '*') { p.next(); items.push({ kind: 'star', alias: '*' }) }
    else if (t.t === 'id' && AGGS.has(t.v.toUpperCase()) && p.toks[p.pos + 1]?.v === '(') {
      const agg = t.v.toUpperCase(); p.next(); p.next()
      let distinct = false, col = '*'
      if (p.eatKw('DISTINCT')) distinct = true
      const ct = p.next()
      if (!ct) return { error: `Missing argument for ${agg}().`, code: 'GP-2301' }
      if (ct.v !== '*') col = ct.v
      const close = p.next()
      if (!close || close.v !== ')') return { error: `Missing ")" after ${agg}(.`, code: 'GP-2301' }
      let alias = `${agg.toLowerCase()}_${col === '*' ? 'all' : col}`
      if (p.eatKw('AS')) { const a = p.next(); if (a) alias = a.v }
      items.push({ kind: 'agg', agg, col, distinct, alias })
    } else if (t.t === 'id') {
      const col = t.v; p.next()
      let alias = col
      if (p.eatKw('AS')) { const a = p.next(); if (a) alias = a.v }
      items.push({ kind: 'col', col, alias })
    } else return { error: `Unexpected "${t.v}" in SELECT list.`, code: 'GP-2301' }
    if (p.peek()?.v === ',') { p.next(); continue }
    break
  }
  return items
}

/* ── helpers ── */
function colGetter(row: TableRow): (name: string) => unknown {
  const keys = Object.keys(row)
  const lower: Record<string, string> = {}
  keys.forEach(k => { lower[k.toLowerCase()] = k })
  return (name: string) => {
    if (name in row) return row[name]
    const k = lower[name.toLowerCase()]
    return k !== undefined ? row[k] : undefined
  }
}

function resolveCol(rows: TableRow[], name: string): string | null {
  if (!rows.length) return null
  if (name in rows[0]) return name
  const k = Object.keys(rows[0]).find(k => k.toLowerCase() === name.toLowerCase())
  return k ?? null
}

function aggCompute(agg: string, vals: unknown[], distinct?: boolean): unknown {
  if (agg === 'COUNT') {
    const present = vals.filter(v => v != null && String(v).trim() !== '')
    return distinct ? new Set(present.map(v => String(v).toLowerCase())).size : present.length
  }
  const nums = vals.map(v => parseFloat(String(v))).filter(n => !isNaN(n))
  if (!nums.length) return null
  if (agg === 'MAX') return Math.max(...nums)
  if (agg === 'MIN') return Math.min(...nums)
  if (agg === 'SUM') return Number(nums.reduce((a, b) => a + b, 0).toFixed(6))
  if (agg === 'AVG') return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(6))
  return null
}

function findTable(tables: TableRef[], name: string): TableRef | null {
  const n = name.toLowerCase()
  return tables.find(t => t.name.toLowerCase() === n || t.name.replace(/\s+/g, '_').toLowerCase() === n) ?? null
}

/* ── main entry ── */
export function executeSQL(sql: string, tables: TableRef[], getRows: GetRows): SqlResult {
  const toksOr = tokenize(sql.trim().replace(/;\s*$/, ''))
  if (!Array.isArray(toksOr)) return toksOr
  const p = new P(toksOr)

  if (p.eatKw('DELETE')) {
    if (!p.eatKw('FROM')) return { error: 'Expected FROM after DELETE.', code: 'GP-2301' }
    const tn = p.next()
    if (!tn || tn.t !== 'id') return { error: 'Expected a table name after DELETE FROM.', code: 'GP-2301' }
    const tbl = findTable(tables, tn.v)
    if (!tbl) return { error: `Table "${tn.v}" does not exist. Available: ${tables.map(t => t.name).join(', ')}`, code: 'GP-2302' }
    if (!p.eatKw('WHERE')) return { error: 'DELETE requires a WHERE clause (refusing to delete every row without one).', code: 'GP-2301' }
    const pred = parseExpr(p)
    if (typeof pred !== 'function') return pred
    const rows = getRows(tbl.id)
    const kept = rows.filter(r => !pred(r, colGetter(r)))
    return { action: 'delete', tableId: tbl.id, tableName: tbl.name, kept, removed: rows.length - kept.length }
  }

  if (!p.eatKw('SELECT')) return { error: 'Only SELECT and DELETE statements are supported on the workbench.', code: 'GP-2301' }
  const distinct = p.eatKw('DISTINCT')
  const sel = parseSelectList(p)
  if (!Array.isArray(sel)) return sel
  if (!p.eatKw('FROM')) return { error: 'Expected FROM after the SELECT list.', code: 'GP-2301' }

  const sources: TableRef[] = []
  for (;;) {
    const tn = p.next()
    if (!tn || tn.t !== 'id') return { error: 'Expected a table name after FROM.', code: 'GP-2301' }
    const tbl = findTable(tables, tn.v)
    if (!tbl) return { error: `Table "${tn.v}" does not exist. Available: ${tables.map(t => t.name).join(', ')}`, code: 'GP-2302' }
    sources.push(tbl)
    if (p.peek()?.v === ',') { p.next(); continue }
    break
  }

  let rows: TableRow[] = sources.flatMap(s => getRows(s.id))

  if (p.eatKw('WHERE')) {
    const pred = parseExpr(p)
    if (typeof pred !== 'function') return pred
    rows = rows.filter(r => pred(r, colGetter(r)))
  }

  let groupBy: string[] = []
  if (p.eatKw('GROUP')) {
    if (!p.eatKw('BY')) return { error: 'Expected BY after GROUP.', code: 'GP-2301' }
    for (;;) {
      const g = p.next()
      if (!g || g.t !== 'id') return { error: 'Expected a column in GROUP BY.', code: 'GP-2301' }
      groupBy.push(g.v)
      if (p.peek()?.v === ',') { p.next(); continue }
      break
    }
  }

  let orderBy: { col: string; desc: boolean } | null = null
  if (p.eatKw('ORDER')) {
    if (!p.eatKw('BY')) return { error: 'Expected BY after ORDER.', code: 'GP-2301' }
    const o = p.next()
    if (!o || o.t !== 'id') return { error: 'Expected a column in ORDER BY.', code: 'GP-2301' }
    const desc = p.eatKw('DESC') ? true : (p.eatKw('ASC'), false)
    orderBy = { col: o.v, desc }
  }

  let limit = 0
  if (p.eatKw('LIMIT')) {
    const l = p.next()
    if (!l || l.t !== 'num') return { error: 'LIMIT requires a number.', code: 'GP-2301' }
    limit = parseInt(l.v)
  }

  const hasAgg = sel.some(s => s.kind === 'agg')

  // validate plain column references early for a clear GP-2303
  if (rows.length) {
    for (const s of sel) {
      if (s.kind === 'col' && !resolveCol(rows, s.col!))
        return { error: `Column "${s.col}" does not exist. Columns: ${Object.keys(rows[0]).join(', ')}`, code: 'GP-2303' }
    }
  }

  let out: TableRow[]
  if (hasAgg || groupBy.length) {
    const groups = new Map<string, TableRow[]>()
    if (groupBy.length) {
      rows.forEach(r => {
        const g = colGetter(r)
        const key = groupBy.map(c => String(g(c) ?? '').trim().toLowerCase()).join('|')
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(r)
      })
    } else groups.set('', rows)

    out = [...groups.values()].map(group => {
      const g0 = colGetter(group[0] ?? {})
      const row: TableRow = {}
      sel.forEach(s => {
        if (s.kind === 'star') Object.assign(row, group[0] ?? {})
        else if (s.kind === 'col') row[s.alias] = g0(s.col!)
        else {
          const vals = s.col === '*' ? group.map(() => 1) : group.map(r => colGetter(r)(s.col!))
          row[s.alias] = aggCompute(s.agg!, vals, s.distinct)
        }
      })
      return row
    })
  } else {
    out = rows.map(r => {
      if (sel.length === 1 && sel[0].kind === 'star') return r
      const g = colGetter(r); const nr: TableRow = {}
      sel.forEach(s => { if (s.kind === 'star') Object.assign(nr, r); else nr[s.alias] = g(s.col!) })
      return nr
    })
  }

  if (distinct) {
    const seen = new Set<string>()
    out = out.filter(r => { const k = JSON.stringify(r); if (seen.has(k)) return false; seen.add(k); return true })
  }

  if (orderBy) {
    const { col, desc } = orderBy
    out = [...out].sort((a, b) => {
      const ga = colGetter(a)(col), gb = colGetter(b)(col)
      const na = parseFloat(String(ga)), nb = parseFloat(String(gb))
      const c = (!isNaN(na) && !isNaN(nb)) ? na - nb : String(ga ?? '').localeCompare(String(gb ?? ''))
      return desc ? -c : c
    })
  }

  const total = out.length
  if (limit > 0) out = out.slice(0, limit)
  return { action: 'select', rows: out, total, sources: sources.map(s => s.name) }
}
