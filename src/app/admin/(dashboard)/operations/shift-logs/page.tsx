'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import { getShiftLogOversight, workflowTransition, type ShiftLogOversightRow } from '@/lib/goldpass/erp'
import DynamicTable from '@/components/goldpass/DynamicTable'

const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected'] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

export default function ShiftLogsPage() {
  const [rows, setRows] = useState<ShiftLogOversightRow[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [actingId, setActingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setRows(await getShiftLogOversight(statusFilter === 'all' ? undefined : { status: statusFilter }))
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  async function act(row: ShiftLogOversightRow, action: 'approve' | 'reject') {
    if (!row.workflow_instance_id) { notify('warn', 'This shift log has no workflow instance — cannot act on it.'); return }
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
    notify('success', `Shift log ${action === 'approve' ? 'approved' : 'rejected'}.`)
    load()
  }

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Shift Logs</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Review shift logs submitted from the field (production, issues, equipment hours).</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {STATUS_FILTERS.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={statusFilter === s ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}>
            {s === 'all' ? 'All' : s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <DynamicTable
            rows={rows}
            emptyLabel="No shift logs found for this filter."
            hideColumns={['workflow_instance_id']}
            actions={row => row.status === 'pending' ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-icon" style={{ fontSize: 10, color: 'var(--green)' }} disabled={actingId === row.id}
                  onClick={() => act(row as ShiftLogOversightRow, 'approve')}>Approve</button>
                <button className="btn-icon" style={{ fontSize: 10, color: 'var(--red)' }} disabled={actingId === row.id}
                  onClick={() => act(row as ShiftLogOversightRow, 'reject')}>Reject</button>
              </div>
            ) : null}
          />
        )}
      </div>
    </div>
  )
}
