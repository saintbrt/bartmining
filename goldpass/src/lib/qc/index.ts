import type { TableRow } from '../db/types'

type InvMap = Record<string, string>

function getCol(invMap: InvMap, type: string): string | null { return invMap[type] ?? null }
function num(v: unknown): number | null { const n = parseFloat(String(v ?? '')); return isNaN(n) ? null : n }
function mean(arr: number[]): number { return arr.reduce((a, b) => a + b, 0) / arr.length }
function stddev(arr: number[]): number {
  const m = mean(arr)
  return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length)
}

export interface QcDef {
  id: string
  label: string
  desc: string
  category: string
  tableTypes?: string[]
  needsCols?: string[]
  needsOneOf?: string[]
  needsCompare?: boolean
  fixable: boolean
  fixLabel?: string
}

export interface QcResult {
  issues: TableRow[]
  count: number
  summary: string
  cols: string[]
  coordInfo?: Record<string, unknown>
  error?: string
}

export const QC_DEFS: QcDef[] = [
  { id: 'missing_hole_ids', label: 'Missing Hole IDs', desc: 'Rows with empty or null Hole ID values.', category: 'validation', tableTypes: ['collar','assay','survey','lithology'], needsCols: ['hole_id'], fixable: true, fixLabel: 'Remove rows with missing Hole IDs' },
  { id: 'from_greater_than_to', label: 'From >= To errors', desc: 'Intervals where the From depth is greater than or equal to the To depth.', category: 'validation', tableTypes: ['assay','survey'], needsCols: ['from','to'], fixable: false },
  { id: 'from_to_overlaps', label: 'Interval overlaps', desc: 'Consecutive intervals that overlap within the same hole.', category: 'validation', tableTypes: ['assay','survey'], needsCols: ['hole_id','from','to'], fixable: false },
  { id: 'from_to_gaps', label: 'Interval gaps', desc: 'Gaps between consecutive intervals in the same hole.', category: 'validation', tableTypes: ['assay','survey'], needsCols: ['hole_id','from','to'], fixable: false },
  { id: 'duplicate_intervals', label: 'Duplicate intervals', desc: 'Exact duplicate From–To pairs for the same Hole ID.', category: 'validation', tableTypes: ['assay','survey'], needsCols: ['hole_id','from','to'], fixable: true, fixLabel: 'Remove duplicates (keep first occurrence)' },
  { id: 'negative_grades', label: 'Negative grade values', desc: 'Au, Cu or Ag values below zero.', category: 'validation', tableTypes: ['assay'], needsOneOf: ['au','cu','ag'], fixable: true, fixLabel: 'Set all negative grade values to 0' },
  { id: 'coordinate_outliers', label: 'Coordinate outliers', desc: 'Collar coordinates more than 3 standard deviations from the mean.', category: 'spatial', tableTypes: ['collar'], needsCols: ['easting','northing'], fixable: false },
  { id: 'find_undrilled', label: 'Undrilled holes', desc: 'Collar holes that have no matching intervals in the comparison table.', category: 'validation', tableTypes: ['collar'], needsCols: ['hole_id'], needsCompare: true, fixable: false },
  { id: 'find_orphan_assays', label: 'Orphan assays', desc: 'Hole IDs in this interval table that have no matching collar.', category: 'validation', tableTypes: ['assay','survey','lithology'], needsCols: ['hole_id'], needsCompare: true, fixable: false },
  { id: 'find_null_placeholders', label: 'Null placeholders', desc: 'Disguised nulls — N/A, -, -99, 9999, NULL etc.', category: 'validation', tableTypes: ['collar','assay','survey','lithology'], fixable: false },
  { id: 'check_collar_completeness', label: 'Collar completeness', desc: 'Collar rows missing easting, northing or elevation.', category: 'validation', tableTypes: ['collar'], needsCols: ['easting','northing'], fixable: false },
]

export const CLEAN_DEFS: QcDef[] = [
  { id: 'trim_whitespace', label: 'Trim whitespace', desc: 'Remove leading/trailing whitespace from all text values.', category: 'cleaning', fixable: true, fixLabel: 'Trim all text columns' },
  { id: 'standardise_hole_ids', label: 'Standardise Hole IDs', desc: 'Uppercase all Hole ID values and strip internal spaces.', category: 'cleaning', fixable: true, fixLabel: 'Standardise Hole ID column' },
  { id: 'remove_empty_rows', label: 'Remove empty rows', desc: 'Delete rows where every column is empty or null.', category: 'cleaning', fixable: true, fixLabel: 'Delete empty rows' },
  { id: 'resolve_unit_conflicts', label: 'Resolve unit conflicts (ppm/ppb)', desc: 'Detect grade values likely recorded in ppb.', category: 'cleaning', needsOneOf: ['au','cu','ag'], fixable: false },
]

export const ANALYSIS_DEFS: QcDef[] = [
  { id: 'find_duplicates', label: 'Find duplicates', desc: 'Rows that are completely identical across all columns.', category: 'analysis', tableTypes: ['collar','assay','survey','lithology','other'], fixable: true, fixLabel: 'Remove duplicate rows (keep first)' },
  { id: 'find_missing_rows', label: 'Holes missing from other table', desc: 'Hole IDs present in this table but absent in the comparison table.', category: 'analysis', tableTypes: ['collar','assay','survey','lithology'], needsCols: ['hole_id'], fixable: false, needsCompare: true },
  { id: 'detect_coord_system', label: 'Detect coordinate system', desc: 'Heuristic check for Arc1960 UTM, WGS84 or unknown.', category: 'analysis', tableTypes: ['collar'], needsCols: ['easting','northing'], fixable: false },
  { id: 'best_intercept', label: 'Find best intercept', desc: 'Highest grade-thickness intersection per hole.', category: 'analysis', tableTypes: ['assay'], needsCols: ['hole_id','from','to'], needsOneOf: ['au','cu','ag'], fixable: false },
  { id: 'rank_by_grade', label: 'Rank holes by grade', desc: 'Rank every hole by its peak grade value, highest first.', category: 'analysis', tableTypes: ['assay'], needsCols: ['hole_id'], needsOneOf: ['au','cu','ag'], fixable: false },
  { id: 'find_correlation', label: 'Grade correlation', desc: 'Pearson correlation between two grade columns.', category: 'analysis', tableTypes: ['assay'], needsOneOf: ['au','cu','ag'], fixable: false },
]

export function runQC(def: QcDef, rows: TableRow[], invMap: InvMap): QcResult {
  const h = getCol(invMap, 'hole_id')
  const f = getCol(invMap, 'from')
  const t = getCol(invMap, 'to')

  switch (def.id) {
    case 'missing_hole_ids': {
      const issues = rows.filter(r => !String(r[h!] ?? '').trim())
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No missing Hole IDs found.' : `${issues.length} row${issues.length > 1 ? 's' : ''} have empty Hole IDs.`, cols: h ? [h] : [] }
    }
    case 'from_greater_than_to': {
      const issues = rows.filter(r => { const fv = num(r[f!]), tv = num(r[t!]); return fv !== null && tv !== null && fv >= tv })
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No From >= To errors found.' : `${issues.length} interval${issues.length > 1 ? 's' : ''} where From >= To.`, cols: [f, t].filter(Boolean) as string[] }
    }
    case 'from_to_overlaps': {
      const byHole: Record<string, TableRow[]> = {}
      rows.forEach(r => { const id = String(r[h!] ?? '').trim(); if (!id) return; if (!byHole[id]) byHole[id] = []; byHole[id].push(r) })
      const issues: TableRow[] = []
      Object.values(byHole).forEach(group => {
        const sorted = [...group].sort((a, b) => (num(a[f!]) ?? 0) - (num(b[f!]) ?? 0))
        for (let i = 1; i < sorted.length; i++) {
          const prevTo = num(sorted[i - 1][t!]), curFrom = num(sorted[i][f!])
          if (prevTo !== null && curFrom !== null && curFrom < prevTo) issues.push(sorted[i])
        }
      })
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No overlapping intervals found.' : `${issues.length} overlap${issues.length > 1 ? 's' : ''} detected.`, cols: [h, f, t].filter(Boolean) as string[] }
    }
    case 'from_to_gaps': {
      const byHole: Record<string, TableRow[]> = {}
      rows.forEach(r => { const id = String(r[h!] ?? '').trim(); if (!id) return; if (!byHole[id]) byHole[id] = []; byHole[id].push(r) })
      const issues: TableRow[] = []
      Object.values(byHole).forEach(group => {
        const sorted = [...group].sort((a, b) => (num(a[f!]) ?? 0) - (num(b[f!]) ?? 0))
        for (let i = 1; i < sorted.length; i++) {
          const prevTo = num(sorted[i - 1][t!]), curFrom = num(sorted[i][f!])
          if (prevTo !== null && curFrom !== null && curFrom > prevTo + 0.001) issues.push({ ...sorted[i], _gap: (curFrom - prevTo).toFixed(3) + 'm' })
        }
      })
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No gaps between intervals found.' : `${issues.length} gap${issues.length > 1 ? 's' : ''} found.`, cols: [h, f, t].filter(Boolean) as string[] }
    }
    case 'duplicate_intervals': {
      const seen = new Set<string>(); const issues: TableRow[] = []
      rows.forEach(r => { const key = [String(r[h!] ?? ''), String(r[f!] ?? ''), String(r[t!] ?? '')].join('|'); if (seen.has(key)) issues.push(r); else seen.add(key) })
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No duplicate intervals found.' : `${issues.length} duplicate interval${issues.length > 1 ? 's' : ''} found.`, cols: [h, f, t].filter(Boolean) as string[] }
    }
    case 'negative_grades': {
      const gradeCols = ['au', 'cu', 'ag'].map(k => getCol(invMap, k)).filter(Boolean) as string[]
      const issues = rows.filter(r => gradeCols.some(c => num(r[c]) !== null && (num(r[c]) ?? 0) < 0))
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No negative grade values found.' : `${issues.length} row${issues.length > 1 ? 's' : ''} with negative grades.`, cols: gradeCols }
    }
    case 'coordinate_outliers': {
      const ec = getCol(invMap, 'easting'), nc = getCol(invMap, 'northing')
      const es = rows.map(r => num(r[ec!])).filter(v => v !== null) as number[]
      const ns = rows.map(r => num(r[nc!])).filter(v => v !== null) as number[]
      if (es.length < 4) return { issues: [], count: 0, summary: 'Not enough rows to compute outliers.', cols: [] }
      const em = mean(es), es2 = stddev(es), nm = mean(ns), ns2 = stddev(ns)
      const issues = rows.filter(r => { const e = num(r[ec!]), n = num(r[nc!]); if (e === null || n === null) return false; return Math.abs(e - em) > 3 * es2 || Math.abs(n - nm) > 3 * ns2 })
      return { issues, count: issues.length, summary: issues.length === 0 ? `No outliers (mean E:${Math.round(em)}, N:${Math.round(nm)}).` : `${issues.length} coordinate outlier${issues.length > 1 ? 's' : ''} (>3σ).`, cols: [ec, nc].filter(Boolean) as string[] }
    }
    case 'trim_whitespace': {
      let count = 0
      rows.forEach(r => { Object.keys(r).forEach(k => { if (typeof r[k] === 'string' && r[k] !== (r[k] as string).trim()) count++ }) })
      return { issues: [], count, summary: count === 0 ? 'No whitespace to trim.' : `${count} cell${count > 1 ? 's' : ''} have leading/trailing whitespace.`, cols: [] }
    }
    case 'standardise_hole_ids': {
      const nonStd = rows.filter(r => { const v = String(r[h!] ?? '').trim(); return v && (v !== v.toUpperCase() || v.includes(' ')) })
      return { issues: nonStd, count: nonStd.length, summary: nonStd.length === 0 ? 'All Hole IDs are already standardised.' : `${nonStd.length} Hole ID${nonStd.length > 1 ? 's' : ''} need standardisation.`, cols: h ? [h] : [] }
    }
    case 'remove_empty_rows': {
      const empty = rows.filter(r => Object.values(r).every(v => v == null || String(v).trim() === ''))
      return { issues: empty, count: empty.length, summary: empty.length === 0 ? 'No empty rows found.' : `${empty.length} completely empty row${empty.length > 1 ? 's' : ''}.`, cols: [] }
    }
    case 'find_null_placeholders': {
      const PLACEHOLDERS = new Set(['n/a','na','null','-','--','none','nil','9999','-99','-9999','#n/a','tbd','.'])
      const issues = rows.filter(r => Object.values(r).some(v => { const s = String(v == null ? '' : v).trim().toLowerCase(); return s !== '' && PLACEHOLDERS.has(s) }))
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No disguised null placeholders found.' : `${issues.length} row${issues.length > 1 ? 's' : ''} contain placeholder values.`, cols: [] }
    }
    case 'check_collar_completeness': {
      const ec = getCol(invMap, 'easting'), nc = getCol(invMap, 'northing'), zc = getCol(invMap, 'elevation')
      const issues = rows.filter(r => (ec ? num(r[ec]) === null : true) || (nc ? num(r[nc]) === null : true) || (zc ? num(r[zc]) === null : false))
      return { issues, count: issues.length, summary: issues.length === 0 ? 'All collar rows have complete coordinates.' : `${issues.length} collar row${issues.length > 1 ? 's' : ''} missing coordinates.`, cols: [ec, nc, zc].filter(Boolean) as string[] }
    }
    case 'resolve_unit_conflicts': {
      const gradeCols = ['au', 'cu', 'ag'].map(k => getCol(invMap, k)).filter(Boolean) as string[]
      const issues = rows.filter(r => gradeCols.some(c => { const v = num(r[c]); return v !== null && v > 1000 }))
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No unit conflicts detected.' : `${issues.length} row${issues.length > 1 ? 's' : ''} have grade values > 1000 (likely ppb in ppm column).`, cols: gradeCols }
    }
    case 'find_duplicates': {
      const seen = new Set<string>(); const issues: TableRow[] = []
      rows.forEach(r => { const key = JSON.stringify(r); if (seen.has(key)) issues.push(r); else seen.add(key) })
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No duplicate rows found.' : `${issues.length} duplicate row${issues.length > 1 ? 's' : ''} found.`, cols: [] }
    }
    case 'detect_coord_system': {
      const ec = getCol(invMap, 'easting'), nc = getCol(invMap, 'northing')
      const es = rows.map(r => num(r[ec!])).filter(v => v !== null) as number[]
      const ns = rows.map(r => num(r[nc!])).filter(v => v !== null) as number[]
      if (!es.length) return { issues: [], count: 0, summary: 'No easting values found.', cols: [] }
      const avgE = mean(es), avgN = mean(ns)
      let system = 'Unknown', confidence = 'Low', notes = ''
      if (Math.abs(avgN) < 90 && Math.abs(avgE) < 180) { system = 'WGS84 (decimal degrees)'; confidence = 'High'; notes = 'Import into QGIS as EPSG:4326.' }
      else if (avgE > 100000 && avgE < 1000000 && avgN > 7000000 && avgN < 11000000) { system = 'Arc1960 / UTM Zone 36S (probable)'; confidence = 'High'; notes = 'WARNING: Arc1960 and WGS84 differ by up to 300 m in Tanzania. Do NOT silently reproject.' }
      else if (avgE > 100000 && avgE < 1000000 && avgN > 1000000) { system = 'UTM (zone unknown)'; confidence = 'Medium'; notes = 'Confirm the zone and datum before use in QGIS.' }
      return { issues: [], count: 0, summary: `Detected: ${system} (${confidence}). Avg E: ${Math.round(avgE)}, N: ${Math.round(avgN)}.`, coordInfo: { system, confidence, notes, avgE: Math.round(avgE), avgN: Math.round(avgN) }, cols: [ec, nc].filter(Boolean) as string[] }
    }
    case 'best_intercept': {
      const gc = ['au', 'cu', 'ag'].map(k => getCol(invMap, k)).find(Boolean) as string | null
      if (!gc) return { issues: [], count: 0, summary: 'No grade column mapped.', cols: [] }
      const byHole: Record<string, TableRow & { _gt: number; _interval: string; _grade: number }> = {}
      rows.forEach(r => { const id = String(r[h!] ?? '').trim(); if (!id) return; const fv = num(r[f!]), tv = num(r[t!]), gv = num(r[gc]); if (fv === null || tv === null || gv === null) return; const gt = gv * (tv - fv); if (!byHole[id] || gt > byHole[id]._gt) byHole[id] = { ...r, _gt: gt, _interval: (tv - fv).toFixed(2) + 'm', _grade: gv } })
      const issues = Object.values(byHole).sort((a, b) => b._gt - a._gt)
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No valid intervals.' : `Best intercept per hole across ${issues.length} hole${issues.length > 1 ? 's' : ''} (grade × thickness).`, cols: [h, f, t, gc].filter(Boolean) as string[] }
    }
    case 'rank_by_grade': {
      const gc = ['au', 'cu', 'ag'].map(k => getCol(invMap, k)).find(Boolean) as string | null
      if (!gc) return { issues: [], count: 0, summary: 'No grade column mapped.', cols: [] }
      const byHole: Record<string, TableRow & { _grade: number }> = {}
      rows.forEach(r => { const id = String(r[h!] ?? '').trim(); if (!id) return; const gv = num(r[gc]); if (gv === null) return; if (!byHole[id] || gv > byHole[id]._grade) byHole[id] = { ...r, _grade: gv } })
      const issues = Object.values(byHole).sort((a, b) => b._grade - a._grade)
      return { issues, count: issues.length, summary: issues.length === 0 ? 'No grade values to rank.' : `${issues.length} hole${issues.length > 1 ? 's' : ''} ranked by peak grade.`, cols: [h, gc].filter(Boolean) as string[] }
    }
    case 'find_correlation': {
      const gcs = ['au', 'cu', 'ag'].map(k => getCol(invMap, k)).filter(Boolean) as string[]
      if (gcs.length < 2) return { issues: [], count: 0, summary: 'Need at least two grade columns to correlate.', cols: [] }
      const [ca, cb] = gcs
      const pairs = rows.map(r => [num(r[ca]), num(r[cb])]).filter(([a, b]) => a !== null && b !== null) as [number, number][]
      if (pairs.length < 3) return { issues: [], count: 0, summary: 'Not enough paired values.', cols: [] }
      const xs = pairs.map(p => p[0]), ys = pairs.map(p => p[1])
      const mx = mean(xs), my = mean(ys)
      let cov = 0, vx = 0, vy = 0
      pairs.forEach(([x, y]) => { cov += (x - mx) * (y - my); vx += (x - mx) ** 2; vy += (y - my) ** 2 })
      const r = (vx && vy) ? cov / Math.sqrt(vx * vy) : 0
      const strength = Math.abs(r) > 0.7 ? 'strong' : Math.abs(r) > 0.4 ? 'moderate' : 'weak'
      return { issues: [], count: 0, summary: `Pearson r = ${r.toFixed(3)} between ${ca} and ${cb} (${strength} ${r >= 0 ? 'positive' : 'negative'}, n=${pairs.length}).`, cols: [ca, cb] }
    }
    default:
      return { issues: [], count: 0, summary: 'Function not implemented.', cols: [] }
  }
}

export function applyFix(def: QcDef, rows: TableRow[], invMap: InvMap): TableRow[] {
  const h = getCol(invMap, 'hole_id')
  const f = getCol(invMap, 'from')
  const t = getCol(invMap, 'to')

  switch (def.id) {
    case 'missing_hole_ids':
      return rows.filter(r => String(r[h!] ?? '').trim())
    case 'duplicate_intervals': {
      const seen = new Set<string>(); const out: TableRow[] = []
      rows.forEach(r => { const key = [String(r[h!] ?? ''), String(r[f!] ?? ''), String(r[t!] ?? '')].join('|'); if (!seen.has(key)) { seen.add(key); out.push(r) } })
      return out
    }
    case 'negative_grades': {
      const gradeCols = ['au', 'cu', 'ag'].map(k => getCol(invMap, k)).filter(Boolean) as string[]
      return rows.map(r => { const nr = { ...r }; gradeCols.forEach(c => { if (num(nr[c]) !== null && (num(nr[c]) ?? 0) < 0) nr[c] = '0' }); return nr })
    }
    case 'trim_whitespace':
      return rows.map(r => { const nr: TableRow = {}; Object.keys(r).forEach(k => { nr[k] = typeof r[k] === 'string' ? (r[k] as string).trim() : r[k] }); return nr })
    case 'standardise_hole_ids':
      return rows.map(r => { const nr = { ...r }; if (h && nr[h]) nr[h] = String(nr[h]).trim().toUpperCase().replace(/\s+/g, ''); return nr })
    case 'remove_empty_rows':
      return rows.filter(r => !Object.values(r).every(v => v == null || String(v).trim() === ''))
    case 'find_duplicates': {
      const seen = new Set<string>(); const out: TableRow[] = []
      rows.forEach(r => { const key = JSON.stringify(r); if (!seen.has(key)) { seen.add(key); out.push(r) } })
      return out
    }
    default: return rows
  }
}

export function findMissingRows(rowsA: TableRow[], rowsB: TableRow[], invMapA: InvMap, invMapB: InvMap) {
  const hA = getCol(invMapA, 'hole_id'), hB = getCol(invMapB, 'hole_id')
  if (!hA || !hB) return { error: 'Both tables need a Hole ID column mapped.' }
  const setB = new Set(rowsB.map(r => String(r[hB] ?? '').trim()))
  const missing = rowsA.filter(r => !setB.has(String(r[hA] ?? '').trim()) && String(r[hA] ?? '').trim())
  return { missing, count: missing.length, summary: missing.length === 0 ? 'All holes in table A are present in table B.' : `${missing.length} hole${missing.length > 1 ? 's' : ''} in table A not found in table B.` }
}

export function findUndrilled(rowsA: TableRow[], rowsB: TableRow[], invMapA: InvMap, invMapB: InvMap) {
  const hA = getCol(invMapA, 'hole_id'), hB = getCol(invMapB, 'hole_id')
  if (!hA || !hB) return { error: 'Both tables need a Hole ID column mapped.' }
  const drilled = new Set(rowsB.map(r => String(r[hB] ?? '').trim()))
  const issues = rowsA.filter(r => { const id = String(r[hA] ?? '').trim(); return id && !drilled.has(id) })
  return { issues, count: issues.length, summary: issues.length === 0 ? 'Every collar hole has matching interval data.' : `${issues.length} collar hole${issues.length > 1 ? 's' : ''} have no interval data.` }
}

export function findOrphanAssays(rowsA: TableRow[], rowsB: TableRow[], invMapA: InvMap, invMapB: InvMap) {
  const hA = getCol(invMapA, 'hole_id'), hB = getCol(invMapB, 'hole_id')
  if (!hA || !hB) return { error: 'Both tables need a Hole ID column mapped.' }
  const collars = new Set(rowsB.map(r => String(r[hB] ?? '').trim()))
  const seen = new Set<string>(); const issues: TableRow[] = []
  rowsA.forEach(r => { const id = String(r[hA] ?? '').trim(); if (id && !collars.has(id) && !seen.has(id)) { seen.add(id); issues.push(r) } })
  return { issues, count: issues.length, summary: issues.length === 0 ? 'Every interval hole has a matching collar.' : `${issues.length} hole${issues.length > 1 ? 's' : ''} have assays but no collar (orphans).` }
}

export function runSimpleSQL(sql: string, tables: { id: string; name: string }[], getRowsFn: (id: string) => TableRow[]) {
  const cleaned = sql.trim().replace(/\s+/g, ' ')
  const m = cleaned.match(/^SELECT\s+(.*?)\s+FROM\s+["']?(\w[\w\s]*)["']?(?:\s+WHERE\s+(.+?))?(?:\s+LIMIT\s+(\d+))?;?$/i)
  if (!m) return { error: 'Only SELECT ... FROM table [WHERE ...] [LIMIT n] is supported in prototype mode.' }
  const [, cols, rawName, whereClause, limitStr] = m
  const tblName = rawName.trim()
  const tbl = tables.find(t => t.name.toLowerCase() === tblName.toLowerCase() || t.name.replace(/\s+/g, '_').toLowerCase() === tblName.toLowerCase())
  if (!tbl) return { error: `Table "${tblName}" not found. Available: ${tables.map(t => t.name).join(', ')}` }
  let rows = getRowsFn(tbl.id)
  if (whereClause) {
    try {
      const js = whereClause
        .replace(/(\w+)\s+IS\s+NOT\s+NULL/gi, '(row["$1"]!=null&&row["$1"]!="")')
        .replace(/(\w+)\s+IS\s+NULL/gi, '(row["$1"]==null||row["$1"]=="")')
        .replace(/(\w+)\s*=\s*'([^']*)'/g, '(String(row["$1"])==="$2")')
        .replace(/(\w+)\s*!=\s*'([^']*)'/g, '(String(row["$1"])!=="$2")')
        .replace(/(\w+)\s*>=\s*([\d.]+)/g, '(parseFloat(row["$1"])>=$2)')
        .replace(/(\w+)\s*<=\s*([\d.]+)/g, '(parseFloat(row["$1"])<=$2)')
        .replace(/(\w+)\s*>\s*([\d.]+)/g, '(parseFloat(row["$1"])>$2)')
        .replace(/(\w+)\s*<\s*([\d.]+)/g, '(parseFloat(row["$1"])<$2)')
        .replace(/\bAND\b/gi, ' && ').replace(/\bOR\b/gi, ' || ')
      rows = rows.filter(row => { try { return new Function('row', 'return ' + js)(row) } catch { return false } })
    } catch (e) { return { error: 'WHERE error: ' + (e as Error).message } }
  }
  const limit = limitStr ? parseInt(limitStr) : 500
  const total = rows.length
  rows = rows.slice(0, limit)
  if (cols.trim() !== '*') {
    const selected = cols.split(',').map(c => c.trim())
    rows = rows.map(row => { const r: TableRow = {}; selected.forEach(c => { r[c] = row[c] }); return r })
  }
  return { rows, tableName: tbl.name, total, showing: rows.length }
}

export function mockAIQuery(question: string, tables: { id: string; name: string }[], activeTable?: { name: string } | null) {
  const q = question.toLowerCase()
  const tname = activeTable ? activeTable.name : (tables[0]?.name ?? 'collar')
  if (/missing|empty|null|blank/.test(q) && /hole|id/.test(q)) return { sql: `SELECT * FROM ${tname} WHERE HOLEID IS NULL`, note: 'Finds rows where the Hole ID column is empty or null.' }
  if (/negative|below zero/.test(q) && /au|gold|grade/.test(q)) return { sql: `SELECT * FROM ${tname} WHERE AU < 0`, note: 'Finds rows with negative Au values.' }
  if (/duplicate/.test(q)) return { sql: `SELECT HOLEID, FROM_M, TO_M, COUNT(*) FROM ${tname} GROUP BY HOLEID, FROM_M, TO_M HAVING COUNT(*) > 1`, note: 'Finds duplicate interval combinations.' }
  if (/max|highest|best/.test(q) && /au|gold/.test(q)) return { sql: `SELECT HOLEID, MAX(AU) as MaxAu FROM ${tname} GROUP BY HOLEID ORDER BY MaxAu DESC`, note: 'Best Au intercept per hole.' }
  if (/count|how many|total/.test(q) && /hole/.test(q)) return { sql: `SELECT COUNT(DISTINCT HOLEID) as HoleCount FROM ${tname}`, note: 'Counts unique drill holes.' }
  return { sql: `SELECT * FROM ${tname} LIMIT 50`, note: "Showing a preview of the table. Try the SQL editor or QC Functions panel for specific checks." }
}
