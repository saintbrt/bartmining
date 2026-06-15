'use client'

import type { TableMeta } from '@/lib/goldpass/db'
import { typeColor } from '@/lib/goldpass/db/helpers'

/* Layout constants shared with the connection-line layer so line endpoints
   can be computed from card position + column index without DOM measuring. */
export const CARD_W = 232
export const CARD_HEADER_H = 52
export const COL_ROW_H = 22
export const MAX_COLS_SHOWN = 8

export function cardHeight(t: TableMeta): number {
  const n = Math.min(Object.keys(t.columns).length, MAX_COLS_SHOWN)
  const extra = Object.keys(t.columns).length > MAX_COLS_SHOWN ? 18 : 0
  return CARD_HEADER_H + n * COL_ROW_H + extra + 10
}

interface Props {
  table: TableMeta
  x: number
  y: number
  selected: boolean
  isNew?: boolean
  highlightCols: Set<string>   // raw column names that have a connection line
  onPointerDown: (e: React.PointerEvent) => void
  onToggleSelect: () => void
  onOpen: () => void
  onRemove: () => void
  onDelete: () => void
}

export default function FileCard({ table, x, y, selected, isNew, highlightCols, onPointerDown, onToggleSelect, onOpen, onRemove, onDelete }: Props) {
  const cols = Object.entries(table.columns)
  const shown = cols.slice(0, MAX_COLS_SHOWN)
  const color = typeColor(table.type)
  return (
    <div
      className={isNew ? 'gp-appear' : undefined}
      style={{
        position: 'absolute', left: x, top: y, width: CARD_W,
        background: 'var(--bg-2)', borderRadius: 10, overflow: 'hidden',
        border: selected ? '2px solid var(--blue)' : '1px solid var(--sep-o)',
        boxShadow: selected ? '0 0 0 3px rgba(0,122,255,.18), var(--s-md)' : 'var(--s-sm)',
        cursor: 'grab', userSelect: 'none',
      }}
      onPointerDown={onPointerDown}
      onClick={e => { e.stopPropagation(); onToggleSelect() }}
    >
      <div style={{ height: CARD_HEADER_H, padding: '8px 10px', background: `${color}22`, borderBottom: `2px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ flex: 1, fontSize: 12.5, fontWeight: 700, color: 'var(--label-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{table.name}</div>
          <button className="btn-icon" style={{ fontSize: 9, padding: '1px 6px' }} onClick={e => { e.stopPropagation(); onOpen() }}>Open</button>
          <button className="btn-icon" style={{ fontSize: 9, padding: '1px 6px' }} title="Remove from workbench" onClick={e => { e.stopPropagation(); onRemove() }}>✕</button>
          <button className="btn-icon" style={{ fontSize: 9, padding: '1px 6px', color: 'var(--red)' }} title="Delete file permanently" onClick={e => { e.stopPropagation(); onDelete() }}>🗑</button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--label-3)', marginTop: 3 }}>
          <span style={{ color, fontWeight: 600, textTransform: 'capitalize' }}>{table.type === 'child' ? 'result file' : table.type}</span>
          {' · '}{table.row_count.toLocaleString()} rows
        </div>
      </div>
      <div style={{ padding: '5px 0' }}>
        {shown.map(([col, role]) => (
          <div key={col} style={{ height: COL_ROW_H, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', fontSize: 10.5, background: highlightCols.has(col) ? 'rgba(0,122,255,.08)' : undefined }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: highlightCols.has(col) ? 'var(--gold)' : 'var(--label-4)', flexShrink: 0 }} />
            <span style={{ color: 'var(--label-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{col}</span>
            {role && role !== 'other' && <span style={{ color: 'var(--label-4)', fontSize: 9 }}>{role}</span>}
          </div>
        ))}
        {cols.length > MAX_COLS_SHOWN && (
          <div style={{ fontSize: 9.5, color: 'var(--label-4)', padding: '2px 10px' }}>+ {cols.length - MAX_COLS_SHOWN} more columns</div>
        )}
      </div>
    </div>
  )
}
