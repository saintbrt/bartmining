import type { TableMeta, TableRow } from '@/lib/goldpass/db'

/* Detects matching columns between files placed on the workbench canvas, so
   connection lines can be drawn between them (ER-diagram style). Two files
   with nothing in common produce no connections at all. */

export interface Connection {
  tableA: string        // table id
  colA: string          // raw column name in A
  tableB: string        // table id
  colB: string          // raw column name in B
  role: string          // shared meaning, e.g. hole_id, easting
  confidence: 'high' | 'medium'
}

/* Column roles that meaningfully link two drill-data files together. */
const LINKING_ROLES = new Set(['hole_id', 'easting', 'northing', 'elevation', 'utm_e', 'utm_n', 'lat', 'long', 'from', 'to'])

function norm(v: unknown): string { return String(v ?? '').trim().toUpperCase() }

/** Share of sampled values in A that also appear in B (0..1). */
function valueOverlap(rowsA: TableRow[], colA: string, rowsB: TableRow[], colB: string): number {
  const a = rowsA.slice(0, 200).map(r => norm(r[colA])).filter(Boolean)
  if (!a.length) return 0
  const b = new Set(rowsB.slice(0, 200).map(r => norm(r[colB])).filter(Boolean))
  if (!b.size) return 0
  let hit = 0
  a.forEach(v => { if (b.has(v)) hit++ })
  return hit / a.length
}

export function findConnections(
  tables: TableMeta[],
  getRows: (tableId: string) => TableRow[],
): Connection[] {
  const out: Connection[] = []
  for (let i = 0; i < tables.length; i++) {
    for (let j = i + 1; j < tables.length; j++) {
      const A = tables[i], B = tables[j]
      const rowsA = getRows(A.id), rowsB = getRows(B.id)
      const seenRoles = new Set<string>()

      // 1. Same semantic role on both sides (HOLEID ↔ hole_id etc.)
      Object.entries(A.columns).forEach(([colA, roleA]) => {
        if (!LINKING_ROLES.has(roleA)) return
        const colB = Object.keys(B.columns).find(c => B.columns[c] === roleA)
        if (!colB || seenRoles.has(roleA)) return
        seenRoles.add(roleA)
        // ID columns get sanity-checked against real values; coordinates
        // always connect (same role is meaning enough).
        if (roleA === 'hole_id') {
          const ov = valueOverlap(rowsA, colA, rowsB, colB)
          out.push({ tableA: A.id, colA, tableB: B.id, colB, role: roleA, confidence: ov >= 0.3 ? 'high' : 'medium' })
        } else {
          out.push({ tableA: A.id, colA, tableB: B.id, colB, role: roleA, confidence: 'high' })
        }
      })

      // 2. Identical raw column names not already matched by role
      Object.keys(A.columns).forEach(colA => {
        const roleA = A.columns[colA]
        if (LINKING_ROLES.has(roleA) && seenRoles.has(roleA)) return
        const colB = Object.keys(B.columns).find(c => c.toUpperCase() === colA.toUpperCase())
        if (!colB) return
        if (out.some(c => c.tableA === A.id && c.colA === colA && c.tableB === B.id)) return
        const ov = valueOverlap(rowsA, colA, rowsB, colB)
        if (ov >= 0.3) out.push({ tableA: A.id, colA, tableB: B.id, colB, role: roleA || 'shared column', confidence: 'medium' })
      })
    }
  }
  return out
}
