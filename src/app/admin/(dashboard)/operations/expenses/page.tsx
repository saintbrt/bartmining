'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import { getExpenseOversight, workflowTransition, type ExpenseOversightRow } from '@/lib/goldpass/erp'

const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected', 'voided'] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-blue',
  approved: 'badge-green',
  rejected: 'badge-red',
  voided: 'badge-gray',
}

export default function ExpensesOversightPage() {
  const [rows, setRows] = useState<ExpenseOversightRow[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [actingId, setActingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getExpenseOversight(statusFilter === 'all' ? undefined : { status: statusFilter })
    setRows(data)
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  async function act(row: ExpenseOversightRow, action: 'approve' | 'reject') {
    if (!row.workflow_instance_id) { notify('warn', 'This entry has no workflow instance — cannot act on it.'); return }
    let comment = ''
    if (action === 'reject') {
      const typed = window.prompt('Reason for rejection (required):')
      if (!typed?.trim()) { if (typed !== null) notify('warn', 'A rejection reason is required.'); return }
      comment = typed.trim()
    }
    setActingId(row.id)
    const ok = await workflowTransition(row.workflow_instance_id, action, comment)
    setActingId(null)
    if (!ok) return
    notify('success', `Expense ${action === 'approve' ? 'approved' : 'rejected'}.`)
    load()
  }

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Expenses</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Oversight of expense entries submitted from the field.</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={statusFilter === s ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
          >
            {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Payee</th>
                  <th>Details</th>
                  <th>Cost centre</th>
                  <th>Submitted by</th>
                  <th>Amount (TSh)</th>
                  <th>Status</th>
                  <th>Proof</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={10} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No expenses found for this filter.</td></tr>
                ) : rows.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--label-4)' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>{r.category_name ?? '—'}</td>
                    <td>{r.payee_name ?? '—'}{r.payee_role ? <span style={{ color: 'var(--label-4)' }}> ({r.payee_role})</span> : null}</td>
                    <td style={{ maxWidth: 220 }} title={r.notes ?? ''}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.notes ?? '—'}</div>
                      {r.reference_no && <div style={{ fontSize: 10, color: 'var(--label-4)' }}>Ref: {r.reference_no}</div>}
                    </td>
                    <td>{r.cost_centre_name ?? '—'}</td>
                    <td>{r.entered_by_name ?? '—'}</td>
                    <td style={{ fontWeight: 600 }}>{r.amount_tsh.toLocaleString()}</td>
                    <td><span className={`badge ${STATUS_BADGE[r.status] ?? 'badge-gray'}`}>{r.status}</span></td>
                    <td>
                      {r.proof_image_url ? (
                        <a href={r.proof_image_url} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)' }}>View</a>
                      ) : '—'}
                    </td>
                    <td>
                      {r.status === 'pending' && (
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
    </div>
  )
}
