'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import {
  getAttendanceRecords, confirmAttendanceRecord,
  getPayrollAdjustments, workflowTransition,
  getPayrollRuns, generatePayrollPreview, lockPayrollRun,
  getLaborCostByCostCentre, listSimpleTable,
  type AttendanceRecordRow, type PayrollAdjustmentRow, type PayrollRunRow, type LaborCostRow, type SimpleRow,
} from '@/lib/goldpass/erp'
import DynamicTable from '@/components/goldpass/DynamicTable'

export default function PayrollPage() {
  const [attendance, setAttendance] = useState<AttendanceRecordRow[]>([])
  const [adjustments, setAdjustments] = useState<PayrollAdjustmentRow[]>([])
  const [runs, setRuns] = useState<PayrollRunRow[]>([])
  const [laborCost, setLaborCost] = useState<LaborCostRow[]>([])
  const [sites, setSites] = useState<SimpleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [siteId, setSiteId] = useState('')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [runLabel, setRunLabel] = useState('')
  const [generating, setGenerating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [a, p, r, l, s] = await Promise.all([
      getAttendanceRecords({ status: 'pending_confirmation' }),
      getPayrollAdjustments(),
      getPayrollRuns(),
      getLaborCostByCostCentre(),
      listSimpleTable('sites'),
    ])
    setAttendance(a); setAdjustments(p); setRuns(r); setLaborCost(l); setSites(s)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function confirmAttendance(id: string) {
    setBusyId(id)
    const ok = await confirmAttendanceRecord(id)
    setBusyId(null)
    if (!ok) return
    notify('success', 'Attendance confirmed.')
    load()
  }

  async function actAdjustment(row: PayrollAdjustmentRow, action: 'approve' | 'reject') {
    if (!row.workflow_instance_id) { notify('warn', 'No workflow instance on this adjustment.'); return }
    let comment = ''
    if (action === 'reject') {
      const typed = window.prompt('Reason for rejection (required):')
      if (!typed?.trim()) { if (typed !== null) notify('warn', 'A rejection reason is required.'); return }
      comment = typed.trim()
    }
    setBusyId(row.id)
    const ok = await workflowTransition(row.workflow_instance_id, action, comment)
    setBusyId(null)
    if (!ok) return
    notify('success', `Adjustment ${action === 'approve' ? 'approved' : 'rejected'}.`)
    load()
  }

  async function actRun(row: PayrollRunRow, action: 'approve' | 'reject') {
    if (!row.workflow_instance_id) { notify('warn', 'No workflow instance on this run.'); return }
    let comment = ''
    if (action === 'reject') {
      const typed = window.prompt('Reason for rejection (required):')
      if (!typed?.trim()) { if (typed !== null) notify('warn', 'A rejection reason is required.'); return }
      comment = typed.trim()
    }
    setBusyId(row.id)
    const ok = await workflowTransition(row.workflow_instance_id, action, comment)
    setBusyId(null)
    if (!ok) return
    notify('success', `Payroll run ${action === 'approve' ? 'approved' : 'rejected'}.`)
    load()
  }

  async function lockRun(id: string) {
    if (!window.confirm('Lock this payroll run and post it to the journal? This is irreversible.')) return
    setBusyId(id)
    const ok = await lockPayrollRun(id)
    setBusyId(null)
    if (!ok) return
    notify('success', 'Payroll run locked and posted.')
    load()
  }

  async function generate() {
    if (!periodStart || !periodEnd) { notify('warn', 'Set both period start and end dates.'); return }
    setGenerating(true)
    const id = await generatePayrollPreview(siteId || null, periodStart, periodEnd, runLabel.trim() || undefined)
    setGenerating(false)
    if (!id) return
    notify('success', 'Payroll preview generated.')
    setRunLabel('')
    load()
  }

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Payroll</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Attendance confirmation, payroll adjustments, and payroll runs derived from shift logs.</p>
      </div>

      <div className="card" style={{ marginBottom: 20, background: 'var(--bg-3)' }}>
        <div style={{ fontSize: 12, color: 'var(--label-3)' }}>
          Known gap in the current backend: approving a payroll run here updates its workflow
          state, but the underlying <span style={{ fontFamily: 'monospace' }}>payroll_runs.status</span> column
          isn&apos;t synced by the workflow engine for payroll (unlike expenses/shift logs). Locking
          a run may fail with &quot;must be approved before locking&quot; even right after approval —
          that&apos;s a real backend issue, not a UI bug. This page shows the workflow state
          alongside the raw status so it&apos;s visible either way.
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          Attendance — pending confirmation {attendance.length > 0 && <span className="badge badge-orange" style={{ marginLeft: 8 }}>{attendance.length}</span>}
        </h3>
        <div className="card">
          {loading ? <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl" style={{ fontSize: 12 }}>
                <thead><tr><th>Date</th><th>Employee</th><th>Hours</th><th>Source</th><th></th></tr></thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>Nothing pending confirmation.</td></tr>
                  ) : attendance.map(a => (
                    <tr key={a.id}>
                      <td style={{ color: 'var(--label-4)' }}>{new Date(a.work_date).toLocaleDateString()}</td>
                      <td>{a.employee_name ?? '—'}</td>
                      <td>{a.hours_worked}</td>
                      <td>{a.source}</td>
                      <td>
                        <button className="btn-icon" style={{ fontSize: 10, color: 'var(--green)' }} disabled={busyId === a.id}
                          onClick={() => confirmAttendance(a.id)}>Confirm</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Payroll Adjustments (bonus / deduction)</h3>
        <div className="card">
          {loading ? <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl" style={{ fontSize: 12 }}>
                <thead><tr><th>Date</th><th>Employee</th><th>Type</th><th>Amount (TSh)</th><th>Reason</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {adjustments.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No adjustments submitted yet.</td></tr>
                  ) : adjustments.map(r => (
                    <tr key={r.id}>
                      <td style={{ color: 'var(--label-4)' }}>{new Date(r.effective_date).toLocaleDateString()}</td>
                      <td>{r.employee_name ?? '—'}</td>
                      <td>{r.adjustment_type}</td>
                      <td style={{ fontWeight: 600 }}>{r.amount_tsh.toLocaleString()}</td>
                      <td>{r.reason}</td>
                      <td>{r.workflow_state ?? '—'}</td>
                      <td>
                        {r.workflow_state === 'submitted' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn-icon" style={{ fontSize: 10, color: 'var(--green)' }} disabled={busyId === r.id}
                              onClick={() => actAdjustment(r, 'approve')}>Approve</button>
                            <button className="btn-icon" style={{ fontSize: 10, color: 'var(--red)' }} disabled={busyId === r.id}
                              onClick={() => actAdjustment(r, 'reject')}>Reject</button>
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

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Payroll Runs</h3>
        <div className="card" style={{ maxWidth: 620, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Generate preview</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <select className="input" style={{ flex: 1, minWidth: 140, fontSize: 12 }} value={siteId} onChange={e => setSiteId(e.target.value)}>
              <option value="">All sites</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name as string}</option>)}
            </select>
            <input className="input" style={{ flex: 1, minWidth: 130, fontSize: 12 }} type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} />
            <input className="input" style={{ flex: 1, minWidth: 130, fontSize: 12 }} type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} />
            <input className="input" style={{ flex: 1, minWidth: 140, fontSize: 12 }} placeholder="Run label (optional)" value={runLabel} onChange={e => setRunLabel(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" disabled={generating} onClick={generate}>{generating ? 'Generating…' : 'Generate preview'}</button>
        </div>

        <div className="card">
          {loading ? <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl" style={{ fontSize: 12 }}>
                <thead><tr><th>Period</th><th>Label</th><th>Employees</th><th>Gross (TSh)</th><th>Net (TSh)</th><th>Raw status</th><th>Workflow state</th><th></th></tr></thead>
                <tbody>
                  {runs.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No payroll runs yet.</td></tr>
                  ) : runs.map(r => (
                    <tr key={r.id}>
                      <td style={{ color: 'var(--label-4)' }}>{new Date(r.period_start).toLocaleDateString()} – {new Date(r.period_end).toLocaleDateString()}</td>
                      <td>{r.run_label ?? '—'}</td>
                      <td>{r.employee_count}</td>
                      <td style={{ fontWeight: 600 }}>{r.total_gross_tsh.toLocaleString()}</td>
                      <td>{r.total_net_tsh.toLocaleString()}</td>
                      <td>{r.status}</td>
                      <td>{r.workflow_state ?? '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {r.workflow_state === 'submitted' && (
                            <>
                              <button className="btn-icon" style={{ fontSize: 10, color: 'var(--green)' }} disabled={busyId === r.id}
                                onClick={() => actRun(r, 'approve')}>Approve</button>
                              <button className="btn-icon" style={{ fontSize: 10, color: 'var(--red)' }} disabled={busyId === r.id}
                                onClick={() => actRun(r, 'reject')}>Reject</button>
                            </>
                          )}
                          {r.workflow_state === 'approved' && (
                            <button className="btn-icon" style={{ fontSize: 10, color: 'var(--blue)' }} disabled={busyId === r.id}
                              onClick={() => lockRun(r.id)}>Lock</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Labor Cost by Cost Centre</h3>
        <div className="card">
          {loading ? <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div> : (
            <DynamicTable rows={laborCost} emptyLabel="No approved/locked payroll runs yet." />
          )}
        </div>
      </div>
    </div>
  )
}
