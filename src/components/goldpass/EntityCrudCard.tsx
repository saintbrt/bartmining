'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import { listSimpleTable, insertSimpleRow, deleteRow, type SimpleEntity, type SimpleRow } from '@/lib/goldpass/erp'
import DynamicTable from './DynamicTable'

/* List + add + delete card for the "id + name (+ a few fields)" tables
   (Master Data, Inventory items/warehouses, Suppliers, Customers). One
   implementation instead of a near-duplicate per entity. */
export default function EntityCrudCard({ entity, title }: { entity: SimpleEntity; title?: string }) {
  const [rows, setRows] = useState<SimpleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setLoading(true)
    setRows(await listSimpleTable(entity.table))
    setLoading(false)
  }, [entity.table])

  useEffect(() => { setForm({}); load() }, [load])

  async function add() {
    const missing = entity.fields.find(f => f.required && !form[f.key]?.trim())
    if (missing) { notify('warn', `${missing.label} is required.`); return }
    setSaving(true)
    const payload: Record<string, unknown> = {}
    entity.fields.forEach(f => {
      const raw = form[f.key]?.trim()
      if (!raw) return
      payload[f.key] = f.numeric ? Number(raw) : raw
    })
    const ok = await insertSimpleRow(entity.table, payload)
    setSaving(false)
    if (!ok) return
    notify('success', `${entity.label.replace(/s$/, '')} added.`)
    setForm({})
    load()
  }

  async function remove(id: string) {
    if (!window.confirm(`Delete this ${entity.label.replace(/s$/, '').toLowerCase()}?`)) return
    const ok = await deleteRow(entity.table, id)
    if (!ok) return
    notify('info', 'Deleted.')
    load()
  }

  return (
    <div>
      <div className="card" style={{ maxWidth: 560, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Add {(title ?? entity.label).replace(/s$/, '').toLowerCase()}</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          {entity.fields.map(f => (
            <input
              key={f.key}
              className="input"
              style={{ flex: 1, minWidth: 130, fontSize: 12 }}
              type={f.numeric ? 'number' : 'text'}
              placeholder={f.label + (f.required ? ' *' : '')}
              value={form[f.key] ?? ''}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && add()}
            />
          ))}
        </div>
        <button className="btn btn-primary btn-sm" disabled={saving} onClick={add}>{saving ? 'Saving…' : '+ Add'}</button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <DynamicTable
            rows={rows}
            emptyLabel={`No ${(title ?? entity.label).toLowerCase()} yet.`}
            actions={row => (
              <button className="btn-icon" style={{ fontSize: 10, color: 'var(--red)' }}
                onClick={() => remove(row.id as string)}>Delete</button>
            )}
          />
        )}
      </div>
    </div>
  )
}
