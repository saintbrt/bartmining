'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import { getProcurementPipeline, convertPrToPo, SUPPLIERS_ENTITY, type ProcurementPipelineRow } from '@/lib/goldpass/erp'
import EntityCrudCard from '@/components/goldpass/EntityCrudCard'

export default function ProcurementPage() {
  const [rows, setRows] = useState<ProcurementPipelineRow[]>([])
  const [loading, setLoading] = useState(true)
  const [convertingId, setConvertingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setRows(await getProcurementPipeline())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function convert(prId: string) {
    if (!window.confirm('Create a Purchase Order from this approved Purchase Request?')) return
    setConvertingId(prId)
    const ok = await convertPrToPo(prId)
    setConvertingId(null)
    if (!ok) return
    notify('success', 'Purchase Order created.')
    load()
  }

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Procurement</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Purchase Request → Purchase Order → Goods Received Note pipeline, one row per request.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>PR</th>
                  <th>PR status</th>
                  <th>Est. amount</th>
                  <th>Supplier</th>
                  <th>PO</th>
                  <th>PO status</th>
                  <th>GRN</th>
                  <th>GRN status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No procurement activity yet.</td></tr>
                ) : rows.map(r => (
                  <tr key={r.pr_id}>
                    <td style={{ fontFamily: 'monospace' }}>{r.pr_number ?? '—'}</td>
                    <td>{r.pr_status ?? '—'}</td>
                    <td>{r.total_estimated_tsh?.toLocaleString() ?? '—'}</td>
                    <td>{r.supplier_name ?? '—'}</td>
                    <td style={{ fontFamily: 'monospace' }}>{r.po_number ?? '—'}</td>
                    <td>{r.po_status ?? '—'}</td>
                    <td style={{ fontFamily: 'monospace' }}>{r.grn_number ?? '—'}</td>
                    <td>
                      {r.grn_status ?? '—'}
                      {r.variance_flag && <span className="badge badge-orange" style={{ marginLeft: 6 }}>Variance</span>}
                    </td>
                    <td>
                      {r.pr_status === 'approved' && !r.po_id && (
                        <button className="btn-icon" style={{ fontSize: 10, color: 'var(--blue)' }} disabled={convertingId === r.pr_id}
                          onClick={() => convert(r.pr_id)}>Create PO</button>
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
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Suppliers</h3>
        <EntityCrudCard entity={SUPPLIERS_ENTITY} />
      </div>
    </div>
  )
}
