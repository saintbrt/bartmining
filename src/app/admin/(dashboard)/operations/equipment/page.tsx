'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import { listEquipment, insertEquipment, getEquipmentUtilization, type EquipmentRow, type EquipmentUtilizationRow } from '@/lib/goldpass/erp'
import DynamicTable from '@/components/goldpass/DynamicTable'

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentRow[]>([])
  const [utilization, setUtilization] = useState<EquipmentUtilizationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [eq, util] = await Promise.all([listEquipment(), getEquipmentUtilization()])
    setEquipment(eq)
    setUtilization(util)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function add() {
    if (!name.trim()) { notify('warn', 'Enter an equipment name.'); return }
    setSaving(true)
    const ok = await insertEquipment({ name: name.trim(), equipment_type: type.trim() || undefined })
    setSaving(false)
    if (!ok) return
    notify('success', `"${name.trim()}" added to the registry.`)
    setName(''); setType('')
    load()
  }

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Equipment</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Equipment registry and 30-day utilization from field-logged fuel/breakdown/meter events.</p>
      </div>

      <div className="card" style={{ maxWidth: 520, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Add equipment</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input className="input" style={{ flex: 2, fontSize: 12 }} placeholder="Name *" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
          <input className="input" style={{ flex: 1, fontSize: 12 }} placeholder="Type (e.g. excavator)" value={type} onChange={e => setType(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        </div>
        <button className="btn btn-primary btn-sm" disabled={saving} onClick={add}>{saving ? 'Saving…' : '+ Add'}</button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Registry</div>
        {loading ? <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div> : (
          <DynamicTable rows={equipment} emptyLabel="No equipment registered yet." />
        )}
      </div>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Utilization (30-day)</div>
        {loading ? <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div> : (
          <DynamicTable rows={utilization} emptyLabel="No utilization data for the last 30 days." />
        )}
      </div>
    </div>
  )
}
