'use client'

import type { ReactNode } from 'react'

/* Renders whatever columns a row actually has. Used for oversight views
   (shift logs, equipment utilization, daily ops, procurement pipeline, sync
   conflicts) where the exact column set comes from a Supabase view this repo
   doesn't have direct visibility into yet — safer than hardcoding column
   names we can't verify against the live schema. */

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return value.toLocaleString()
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const d = new Date(value)
    if (!isNaN(d.getTime())) return d.toLocaleString()
  }
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function humanizeHeader(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function DynamicTable({
  rows,
  emptyLabel = 'No rows found.',
  hideColumns = [],
  actions,
}: {
  rows: Record<string, unknown>[]
  emptyLabel?: string
  hideColumns?: string[]
  actions?: (row: Record<string, unknown>) => ReactNode
}) {
  const columns = rows.length > 0
    ? Object.keys(rows[0]).filter(k => !hideColumns.includes(k))
    : []

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="tbl" style={{ fontSize: 12 }}>
        <thead>
          <tr>
            {columns.map(c => <th key={c}>{humanizeHeader(c)}</th>)}
            {actions && <th></th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length + (actions ? 1 : 0) || 1} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>{emptyLabel}</td></tr>
          ) : rows.map((r, i) => (
            <tr key={(r.id as string) ?? i}>
              {columns.map(c => <td key={c}>{formatCell(r[c])}</td>)}
              {actions && <td>{actions(r)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
