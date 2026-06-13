import type { TableRow } from '../db/types'

type InvMap = Record<string, string>

function getCol(invMap: InvMap, type: string): string | null { return invMap[type] ?? null }
function num(v: unknown): number | null { const n = parseFloat(String(v ?? '')); return isNaN(n) ? null : n }
function mean(arr: number[]): number { return arr.reduce((a, b) => a + b, 0) / arr.length }
function stddev(arr: number[]): number {
  const m = mean(arr)
  return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length)
}

export interface CheckDef {
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

export interface CheckResult {
  issues: TableRow[]
  count: number
  summary: string
  cols: string[]
  coordInfo?: Record<string, unknown>
  error?: string
}

export const CHECK_DEFS: CheckDef[] = [
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

export const CLEAN_DEFS: CheckDef[] = [
  { id: 'trim_whitespace', label: 'Trim whitespace', desc: 'Remove leading/trailing whitespace from all text values.', category: 'cleaning', fixable: true, fixLabel: 'Trim all text columns' },
  { id: 'standardise_hole_ids', label: 'Standardise Hole IDs', desc: 'Uppercase all Hole ID values and strip internal spaces.', category: 'cleaning', fixable: true, fixLabel: 'Standardise Hole ID column' },
  { id: 'remove_empty_rows', label: 'Remove empty rows', desc: 'Delete rows where every column is empty or null.', category: 'cleaning', fixable: true, fixLabel: 'Delete empty rows' },
  { id: 'resolve_unit_conflicts', label: 'Resolve unit conflicts (ppm/ppb)', desc: 'Detect grade values likely recorded in ppb.', category: 'cleaning', needsOneOf: ['au','cu','ag'], fixable: false },
]

export const ANALYSIS_DEFS: CheckDef[] = [
  { id: 'find_duplicates', label: 'Find duplicates', desc: 'Rows that are completely identical across all columns.', category: 'analysis', tableTypes: ['collar','assay','survey','lithology','other'], fixable: true, fixLabel: 'Remove duplicate rows (keep first)' },
  { id: 'find_missing_rows', label: 'Holes missing from other table', desc: 'Hole IDs present in this table but absent in the comparison table.', category: 'analysis', tableTypes: ['collar','assay','survey','lithology'], needsCols: ['hole_id'], fixable: false, needsCompare: true },
  { id: 'detect_coord_system', label: 'Detect coordinate system', desc: 'Heuristic check for Arc1960 UTM, WGS84 or unknown.', category: 'analysis', tableTypes: ['collar'], needsCols: ['easting','northing'], fixable: false },
  { id: 'best_intercept', label: 'Find best intercept', desc: 'Highest grade-thickness intersection per hole.', category: 'analysis', tableTypes: ['assay'], needsCols: ['hole_id','from','to'], needsOneOf: ['au','cu','ag'], fixable: false },
  { id: 'rank_by_grade', label: 'Rank holes by grade', desc: 'Rank every hole by its peak grade value, highest first.', category: 'analysis', tableTypes: ['assay'], needsCols: ['hole_id'], needsOneOf: ['au','cu','ag'], fixable: false },
  { id: 'find_correlation', label: 'Grade correlation', desc: 'Pearson correlation between two grade columns.', category: 'analysis', tableTypes: ['assay'], needsOneOf: ['au','cu','ag'], fixable: false },
  { id: 'diff_tables', label: 'Diff two tables', desc: 'Rows that exist only in this table or only in the comparison table.', category: 'comparison', needsCompare: true, fixable: false },
  { id: 'duplicates_across', label: 'Duplicates across tables', desc: 'Identical hole/interval rows that appear in both tables (e.g. two lab batches).', category: 'comparison', needsCompare: true, fixable: false },
  { id: 'reconcile_columns', label: 'Reconcile columns', desc: 'Column-name and role differences between this table and the comparison table.', category: 'comparison', needsCompare: true, fixable: false },
]

export function runCheck(def: CheckDef, rows: TableRow[], invMap: InvMap, compare?: { rows: TableRow[]; invMap: InvMap; columns?: Record<string, string> }, columns?: Record<string, string>): CheckResult {
  const h = getCol(invMap, 'hole_id')
  const f = getCol(invMap, 'from')
  const t = getCol(invMap, 'to')

  switch (def.id) {
    case 'find_undrilled': {
      if (!compare) return { issues: [], count: 0, summary: 'Select a comparison table (intervals) to run this check.', cols: [], error: 'needs_compare' }
      const r = findUndrilled(rows, compare.rows, invMap, compare.invMap)
      if ('error' in r && r.error) return { issues: [], count: 0, summary: r.error, cols: [], error: r.error }
      return { issues: r.issues ?? [], count: r.count ?? 0, summary: r.summary ?? '', cols: h ? [h] : [] }
    }
    case 'find_orphan_assays': {
      if (!compare) return { issues: [], count: 0, summary: 'Select a comparison table (collar) to run this check.', cols: [], error: 'needs_compare' }
      const r = findOrphanAssays(rows, compare.rows, invMap, compare.invMap)
      if ('error' in r && r.error) return { issues: [], count: 0, summary: r.error, cols: [], error: r.error }
      return { issues: r.issues ?? [], count: r.count ?? 0, summary: r.summary ?? '', cols: h ? [h] : [] }
    }
    case 'find_missing_rows': {
      if (!compare) return { issues: [], count: 0, summary: 'Select a comparison table to run this check.', cols: [], error: 'needs_compare' }
      const r = findMissingRows(rows, compare.rows, invMap, compare.invMap)
      if ('error' in r && r.error) return { issues: [], count: 0, summary: r.error, cols: [], error: r.error }
      return { issues: r.missing ?? [], count: r.count ?? 0, summary: r.summary ?? '', cols: h ? [h] : [] }
    }
    case 'diff_tables': {
      if (!compare) return { issues: [], count: 0, summary: 'Select a comparison table to diff against.', cols: [], error: 'needs_compare' }
      const r = diffTables(rows, compare.rows)
      return { issues: r.issues, count: r.count, summary: r.summary, cols: [] }
    }
    case 'duplicates_across': {
      if (!compare) return { issues: [], count: 0, summary: 'Select a comparison table to check against.', cols: [], error: 'needs_compare' }
      const r = findDuplicatesAcrossTables(rows, compare.rows, invMap, compare.invMap)
      return { issues: r.issues, count: r.count, summary: r.summary, cols: h ? [h] : [] }
    }
    case 'reconcile_columns': {
      if (!compare?.columns || !columns) return { issues: [], count: 0, summary: 'Select a comparison table to reconcile columns against.', cols: [], error: 'needs_compare' }
      const r = reconcileColumns(columns, compare.columns)
      return { issues: r.issues, count: r.count, summary: r.summary, cols: ['column', 'status', 'role'] }
    }
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

export function applyFix(def: CheckDef, rows: TableRow[], invMap: InvMap): TableRow[] {
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
    case 'find_null_placeholders': {
      const PLACEHOLDERS = new Set(['n/a','na','null','-','--','none','nil','9999','-99','-9999','#n/a','tbd','.'])
      return rows.map(r => {
        const nr: TableRow = {}
        Object.keys(r).forEach(k => {
          const sv = String(r[k] == null ? '' : r[k]).trim().toLowerCase()
          nr[k] = sv !== '' && PLACEHOLDERS.has(sv) ? '' : r[k]
        })
        return nr
      })
    }
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

/* ── Cross-file comparison suite (spec fns 15–20) ── */

/** diffFiles: rows present in A but not in B, and vice versa (full-row comparison). */
export function diffTables(rowsA: TableRow[], rowsB: TableRow[]) {
  const key = (r: TableRow) => JSON.stringify(Object.keys(r).sort().map(k => [k, String(r[k] ?? '').trim()]))
  const setB = new Set(rowsB.map(key)), setA = new Set(rowsA.map(key))
  const onlyA = rowsA.filter(r => !setB.has(key(r))).map(r => ({ _side: 'only in A', ...r }))
  const onlyB = rowsB.filter(r => !setA.has(key(r))).map(r => ({ _side: 'only in B', ...r }))
  const issues = [...onlyA, ...onlyB]
  return { issues, count: issues.length, summary: issues.length === 0 ? 'Tables are identical row-for-row.' : `${onlyA.length} row${onlyA.length !== 1 ? 's' : ''} only in A, ${onlyB.length} only in B.` }
}

/** findDuplicatesAcrossFiles: identical hole_id+from+to (or full row) appearing in both tables. */
export function findDuplicatesAcrossTables(rowsA: TableRow[], rowsB: TableRow[], invMapA: InvMap, invMapB: InvMap) {
  const hA = getCol(invMapA, 'hole_id'), hB = getCol(invMapB, 'hole_id')
  const fA = getCol(invMapA, 'from'), fB = getCol(invMapB, 'from')
  const tA = getCol(invMapA, 'to'), tB = getCol(invMapB, 'to')
  const key = (r: TableRow, h: string | null, f: string | null, t: string | null) =>
    h ? [String(r[h] ?? '').trim().toUpperCase(), f ? String(r[f] ?? '').trim() : '', t ? String(r[t] ?? '').trim() : ''].join('|') : JSON.stringify(r)
  const setB = new Set(rowsB.map(r => key(r, hB, fB, tB)))
  const issues = rowsA.filter(r => setB.has(key(r, hA, fA, tA)))
  return { issues, count: issues.length, summary: issues.length === 0 ? 'No rows duplicated across the two tables.' : `${issues.length} row${issues.length > 1 ? 's' : ''} appear in both tables (cross-file duplicates).` }
}

/** reconcileColumns: column-name / role differences between two tables. */
export function reconcileColumns(colsA: Record<string, string>, colsB: Record<string, string>) {
  const issues: TableRow[] = []
  Object.keys(colsA).forEach(c => { if (!(c in colsB)) issues.push({ column: c, status: 'missing in B', role: colsA[c] }) })
  Object.keys(colsB).forEach(c => { if (!(c in colsA)) issues.push({ column: c, status: 'missing in A', role: colsB[c] }) })
  Object.keys(colsA).forEach(c => { if (c in colsB && colsA[c] !== colsB[c]) issues.push({ column: c, status: 'role mismatch', role: `A:${colsA[c]} vs B:${colsB[c]}` }) })
  return { issues, count: issues.length, summary: issues.length === 0 ? 'Column structures match exactly.' : `${issues.length} column difference${issues.length > 1 ? 's' : ''} between the tables.` }
}

/* ── Output builders (spec fns 21, 25) ── */

/** buildCollarOutput: one row per collar hole, joined with per-hole stats from an interval table. */
export function buildCollarOutput(
  collarRows: TableRow[], intervalRows: TableRow[],
  collarInv: InvMap, intervalInv: InvMap,
): { rows: TableRow[]; error?: string } {
  const hC = getCol(collarInv, 'hole_id'), hI = getCol(intervalInv, 'hole_id')
  if (!hC || !hI) return { rows: [], error: 'Both tables need a Hole ID column mapped.' }
  const gradeKeys = ['au', 'cu', 'ag'] as const
  const gradeCols = gradeKeys.map(k => ({ k, col: getCol(intervalInv, k) })).filter(g => g.col)
  const f = getCol(intervalInv, 'from'), t = getCol(intervalInv, 'to')
  const stats: Record<string, { n: number; grades: Record<string, number[]>; maxDepth: number }> = {}
  intervalRows.forEach(r => {
    const id = String(r[hI] ?? '').trim().toUpperCase(); if (!id) return
    if (!stats[id]) stats[id] = { n: 0, grades: {}, maxDepth: 0 }
    const s = stats[id]; s.n++
    gradeCols.forEach(g => { const v = num(r[g.col!]); if (v !== null) { (s.grades[g.k] ??= []).push(v) } })
    const tv = num(t ? r[t] : null); if (tv !== null && tv > s.maxDepth) s.maxDepth = tv
    const fv = num(f ? r[f] : null); if (fv !== null && fv > s.maxDepth) s.maxDepth = fv
  })
  const rows = collarRows.map(r => {
    const id = String(r[hC] ?? '').trim(); if (!id) return null
    const s = stats[id.toUpperCase()]
    const out: TableRow = { HoleID: id, Intervals: s?.n ?? 0, MaxDepth_m: s ? s.maxDepth.toFixed(2) : '' }
    const e = getCol(collarInv, 'easting'), n2 = getCol(collarInv, 'northing'), z = getCol(collarInv, 'elevation')
    if (e) out.Easting = r[e]; if (n2) out.Northing = r[n2]; if (z) out.Elevation = r[z]
    gradeCols.forEach(g => {
      const vals = s?.grades[g.k] ?? []
      const label = g.k.toUpperCase()
      out[`Max${label}`] = vals.length ? Math.max(...vals).toFixed(3) : ''
      out[`Avg${label}`] = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(3) : ''
    })
    return out
  }).filter(Boolean) as TableRow[]
  return { rows }
}


/* ── Workbench composite helpers ── */

/** Per-file grade summary: one row per grade column with min/avg/max. */
export function gradeSummary(rows: TableRow[], invMap: InvMap, fileName: string): TableRow[] {
  const out: TableRow[] = []
  ;(['au', 'cu', 'ag'] as const).forEach(k => {
    const col = getCol(invMap, k); if (!col) return
    const vals = rows.map(r => num(r[col])).filter(v => v !== null) as number[]
    if (!vals.length) return
    out.push({
      File: fileName, Column: col, Metal: k.toUpperCase(), Values: vals.length,
      Min: Math.min(...vals).toFixed(3), Avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(3), Max: Math.max(...vals).toFixed(3),
    })
  })
  return out
}

/** Keep rows of A whose coordinates fall within maxDist metres of any
    reference point. Reference points come from a second file's collar
    coordinates, or a single typed E/N point. */
export function distanceFilter(
  rowsA: TableRow[], invA: InvMap,
  refPoints: { e: number; n: number }[], maxDist: number,
): { rows: TableRow[]; error?: string } {
  const ec = getCol(invA, 'easting'), nc = getCol(invA, 'northing')
  if (!ec || !nc) return { rows: [], error: 'This file needs East and North columns mapped.' }
  if (!refPoints.length) return { rows: [], error: 'No reference coordinates available.' }
  const d2 = maxDist * maxDist
  const rows = rowsA.filter(r => {
    const e = num(r[ec]), n = num(r[nc])
    if (e === null || n === null) return false
    return refPoints.some(p => (e - p.e) ** 2 + (n - p.n) ** 2 <= d2)
  })
  return { rows }
}

/** Extract collar coordinate points from a file (for distanceFilter refs). */
export function coordPoints(rows: TableRow[], invMap: InvMap): { e: number; n: number }[] {
  const ec = getCol(invMap, 'easting'), nc = getCol(invMap, 'northing')
  if (!ec || !nc) return []
  return rows.map(r => ({ e: num(r[ec]), n: num(r[nc]) }))
    .filter(p => p.e !== null && p.n !== null) as { e: number; n: number }[]
}
