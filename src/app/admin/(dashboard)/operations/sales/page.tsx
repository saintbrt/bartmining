'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import {
  getSalesRegister, getSaleWorkflowInstanceId, workflowTransition, submitSale, CUSTOMERS_ENTITY,
  listSimpleTable, type SalesRegisterRow, type SimpleRow,
} from '@/lib/goldpass/erp'
import EntityCrudCard from '@/components/goldpass/EntityCrudCard'

const STATUS_BADGE: Record<string, string> = {
  submitted: 'badge-blue',
  approved: 'badge-green',
  rejected: 'badge-red',
  voided: 'badge-gray',
  cancelled: 'badge-gray',
}

export default function SalesPage() {
  const [rows, setRows] = useState<SalesRegisterRow[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)

  const [sites, setSites] = useState<SimpleRow[]>([])
  const [customers, setCustomers] = useState<SimpleRow[]>([])
  const [siteId, setSiteId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [saleDate, setSaleDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [weightG, setWeightG] = useState('')
  const [purityPct, setPurityPct] = useState('')
  const [priceTsh, setPriceTsh] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [notes, setNotes] = useState('')
  const [recording, setRecording] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [salesData, sitesData, customersData] = await Promise.all([
      getSalesRegister(), listSimpleTable('sites'), listSimpleTable('customers'),
    ])
    setRows(salesData); setSites(sitesData); setCustomers(customersData)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function recordSale() {
    if (!customerId) { notify('warn', 'Select a customer.'); return }
    if (!weightG || Number(weightG) <= 0) { notify('warn', 'Enter a weight in grams.'); return }
    if (!priceTsh || Number(priceTsh) < 0) { notify('warn', 'Enter a price.'); return }
    setRecording(true)
    const id = await submitSale({
      siteId: siteId || null,
      customerId,
      saleDate,
      weightG: Number(weightG),
      purityPct: purityPct ? Number(purityPct) : null,
      priceTsh: Number(priceTsh),
      paymentTerms: paymentTerms.trim() || null,
      notes: notes.trim() || null,
    })
    setRecording(false)
    if (!id) return
    notify('success', 'Sale recorded and submitted for approval.')
    setCustomerId(''); setWeightG(''); setPurityPct(''); setPriceTsh(''); setPaymentTerms(''); setNotes('')
    load()
  }

  async function act(row: SalesRegisterRow, action: 'approve' | 'reject') {
    let comment = ''
    if (action === 'reject') {
      const typed = window.prompt('Reason for rejection (required):')
      if (!typed?.trim()) { if (typed !== null) notify('warn', 'A rejection reason is required.'); return }
      comment = typed.trim()
    }
    setActingId(row.id)
    const instanceId = await getSaleWorkflowInstanceId(row.id)
    if (!instanceId) { setActingId(null); notify('warn', 'This sale has no workflow instance — cannot act on it.'); return }
    const ok = await workflowTransition(instanceId, action, comment)
    setActingId(null)
    if (!ok) return
    notify('success', `Sale ${action === 'approve' ? 'approved' : 'rejected'}.`)
    load()
  }

  const totalWeightG = rows.reduce((a, r) => a + (r.weight_g ?? 0), 0)
  const totalRevenueTsh = rows.reduce((a, r) => a + (r.price_tsh ?? 0), 0)

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Sales</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Gold sales register captured from the field, with approval and revenue totals.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gold)' }}>{totalWeightG.toLocaleString()} g</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>Total weight (all rows shown)</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>TSh {totalRevenueTsh.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>Total revenue (all rows shown)</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 680, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Record sale</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <select className="input" style={{ flex: 1, minWidth: 140, fontSize: 12 }} value={siteId} onChange={e => setSiteId(e.target.value)}>
            <option value="">Site (optional)</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name as string}</option>)}
          </select>
          <select className="input" style={{ flex: 1, minWidth: 140, fontSize: 12 }} value={customerId} onChange={e => setCustomerId(e.target.value)}>
            <option value="">Select customer…</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name as string}</option>)}
          </select>
          <input className="input" style={{ width: 140, fontSize: 12 }} type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <input className="input" style={{ flex: 1, minWidth: 110, fontSize: 12 }} type="number" placeholder="Weight (g) *" value={weightG} onChange={e => setWeightG(e.target.value)} />
          <input className="input" style={{ flex: 1, minWidth: 110, fontSize: 12 }} type="number" placeholder="Purity % (optional)" value={purityPct} onChange={e => setPurityPct(e.target.value)} />
          <input className="input" style={{ flex: 1, minWidth: 110, fontSize: 12 }} type="number" placeholder="Price (TSh) *" value={priceTsh} onChange={e => setPriceTsh(e.target.value)} />
          <input className="input" style={{ flex: 1, minWidth: 130, fontSize: 12 }} placeholder="Payment terms" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input className="input" style={{ flex: 1, fontSize: 12 }} placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-sm" disabled={recording} onClick={recordSale}>{recording ? 'Recording…' : 'Record sale'}</button>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sale #</th>
                  <th>Customer</th>
                  <th>Weight (g)</th>
                  <th>Purity %</th>
                  <th>Fine gold (g)</th>
                  <th>Price (TSh)</th>
                  <th>TSh/g</th>
                  <th>Recorded by</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={11} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No sales recorded yet.</td></tr>
                ) : rows.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--label-4)' }}>{new Date(r.sale_date).toLocaleDateString()}</td>
                    <td style={{ fontFamily: 'monospace' }}>{r.sale_number ?? '—'}</td>
                    <td>{r.customer_name}</td>
                    <td>{r.weight_g.toLocaleString()}</td>
                    <td>{r.purity_pct ?? '—'}</td>
                    <td>{r.fine_gold_g.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>{r.price_tsh.toLocaleString()}</td>
                    <td>{r.price_per_gram_tsh.toLocaleString()}</td>
                    <td>{r.recorded_by_name ?? '—'}</td>
                    <td><span className={`badge ${STATUS_BADGE[r.status ?? ''] ?? 'badge-gray'}`}>{r.status ?? '—'}</span></td>
                    <td>
                      {r.status === 'submitted' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-icon" style={{ fontSize: 10, color: 'var(--green)' }} disabled={actingId === r.id}
                            onClick={() => act(r, 'approve')}>Approve</button>
                          <button className="btn-icon" style={{ fontSize: 10, color: 'var(--red)' }} disabled={actingId === r.id}
                            onClick={() => act(r, 'reject')}>Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Customers</h3>
        <EntityCrudCard entity={CUSTOMERS_ENTITY} />
      </div>
    </div>
  )
}
