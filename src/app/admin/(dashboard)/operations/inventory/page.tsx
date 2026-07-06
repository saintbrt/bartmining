'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import {
  getStockLevels, getInventoryAlerts, acknowledgeInventoryAlert,
  type StockLevelRow, type InventoryAlertRow,
} from '@/lib/goldpass/erp'

export default function InventoryOversightPage() {
  const [levels, setLevels] = useState<StockLevelRow[]>([])
  const [alerts, setAlerts] = useState<InventoryAlertRow[]>([])
  const [loading, setLoading] = useState(true)
  const [ackingId, setAckingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [l, a] = await Promise.all([getStockLevels(), getInventoryAlerts()])
    setLevels(l)
    setAlerts(a)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function acknowledge(id: string) {
    setAckingId(id)
    const ok = await acknowledgeInventoryAlert(id)
    setAckingId(null)
    if (!ok) return
    notify('success', 'Alert acknowledged.')
    load()
  }

  const openAlerts = alerts.filter(a => !a.acknowledged_at)

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Inventory</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Stock levels against minimum thresholds, and open stock alerts from the field.</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Stock levels</div>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Warehouse</th>
                  <th>Quantity</th>
                  <th>Minimum</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {levels.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No stock levels found.</td></tr>
                ) : levels.map(r => (
                  <tr key={`${r.item_id}-${r.warehouse_name}`}>
                    <td>{r.item_name}</td>
                    <td>{r.warehouse_name}</td>
                    <td style={{ fontWeight: 600 }}>{r.quantity.toLocaleString()}</td>
                    <td style={{ color: 'var(--label-4)' }}>{r.minimum_qty.toLocaleString()}</td>
                    <td>
                      {r.is_below_minimum
                        ? <span className="badge badge-orange">Below minimum</span>
                        : <span className="badge badge-green">OK</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
          Alerts {openAlerts.length > 0 && <span className="badge badge-red" style={{ marginLeft: 8 }}>{openAlerts.length} open</span>}
        </div>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {alerts.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No alerts yet.</td></tr>
                ) : alerts.map(a => (
                  <tr key={a.id}>
                    <td style={{ color: 'var(--label-4)' }}>{new Date(a.created_at).toLocaleDateString()}</td>
                    <td>{a.item_name ?? '—'}</td>
                    <td>{a.alert_type}</td>
                    <td>{a.message ?? '—'}</td>
                    <td>
                      {a.acknowledged_at
                        ? <span className="badge badge-gray">Acknowledged</span>
                        : <span className="badge badge-orange">Open</span>}
                    </td>
                    <td>
                      {!a.acknowledged_at && (
                        <button className="btn-icon" style={{ fontSize: 10 }} disabled={ackingId === a.id}
                          onClick={() => acknowledge(a.id)}>Acknowledge</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
