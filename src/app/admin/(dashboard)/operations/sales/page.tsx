'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import {
  getSalesRegister, submitSale, CUSTOMERS_ENTITY,
  listSimpleTable, type SalesRegisterRow, type SimpleRow,
} from '@/lib/goldpass/erp'
import EntityCrudCard from '@/components/goldpass/EntityCrudCard'

export default function SalesPage() {
  const [rows, setRows] = useState<SalesRegisterRow[]>([])
  const [loading, setLoading] = useState(true)

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
    if (!paymentTerms.trim()) { notify('warn', 'Enter payment terms (e.g. COD, Net 30): the database rejects sales without it.'); return }
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
    notify('success', 'Sale recorded.')
    setCustomerId(''); setWeightG(''); setPurityPct(''); setPriceTsh(''); setPaymentTerms(''); setNotes('')
    load()
  }

  const totalWeightG = rows.reduce((a, r) => a + (r.weight_g ?? 0), 0)
  const totalRevenueTsh = rows.reduce((a, r) => a + (r.price_tsh ?? 0), 0)

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 20 }}>
        <h2 className="page-title">Sales</h2>
        <p className="page-sub">Gold sales register: recorded sales with weight and revenue totals.</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 4 }}>Total weight (all rows shown)</div>
          <div className="stat-value-sm">{totalWeightG.toLocaleString()} g</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 4 }}>Total revenue (all rows shown)</div>
          <div className="stat-value-sm">TSh {totalRevenueTsh.toLocaleString()}</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 680, marginBottom: 20 }}>
        <div className="section-title">Record sale</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <select className="input input-sm" style={{ flex: 1, minWidth: 140 }} value={siteId} onChange={e => setSiteId(e.target.value)}>
            <option value="">Site (optional)</option>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name as string}</option>)}
          </select>
          <select className="input input-sm" style={{ flex: 1, minWidth: 140 }} value={customerId} onChange={e => setCustomerId(e.target.value)}>
            <option value="">Select customer…</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name as string}</option>)}
          </select>
          <input className="input input-sm" style={{ width: 140 }} type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <input className="input input-sm" style={{ flex: 1, minWidth: 110 }} type="number" placeholder="Weight (g) *" value={weightG} onChange={e => setWeightG(e.target.value)} />
          <input className="input input-sm" style={{ flex: 1, minWidth: 110 }} type="number" placeholder="Purity % (optional)" value={purityPct} onChange={e => setPurityPct(e.target.value)} />
          <input className="input input-sm" style={{ flex: 1, minWidth: 110 }} type="number" placeholder="Price (TSh) *" value={priceTsh} onChange={e => setPriceTsh(e.target.value)} />
          <input className="input input-sm" style={{ flex: 1, minWidth: 130 }} placeholder="Payment terms * (e.g. COD, Net 30)" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input className="input input-sm" style={{ flex: 1 }} placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-sm" disabled={recording} onClick={recordSale}>{recording ? 'Recording…' : 'Record sale'}</button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl tbl-card" style={{ fontSize: 12 }}>
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
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No sales recorded yet.</td></tr>
                ) : rows.map(r => (
                  <tr key={r.id}>
                    <td data-label="Date" className="num" style={{ color: 'var(--label-4)' }}>{new Date(r.sale_date).toLocaleDateString()}</td>
                    <td data-label="Sale #" className="num">{r.sale_number ?? '-'}</td>
                    <td data-label="Customer">{r.customer_name}</td>
                    <td data-label="Weight (g)" className="num">{r.weight_g.toLocaleString()}</td>
                    <td data-label="Purity %" className="num">{r.purity_pct ?? '-'}</td>
                    <td data-label="Fine gold (g)" className="num">{r.fine_gold_g.toLocaleString()}</td>
                    <td data-label="Price (TSh)" className="num" style={{ fontWeight: 600 }}>{r.price_tsh.toLocaleString()}</td>
                    <td data-label="TSh/g" className="num">{r.price_per_gram_tsh.toLocaleString()}</td>
                    <td data-label="Recorded by">{r.recorded_by_name ?? '-'}</td>
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
