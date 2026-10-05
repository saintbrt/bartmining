'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/goldpass/Modal'
import { notify } from '@/lib/goldpass/notify'
import { confirmDialog } from '@/lib/goldpass/confirm'
import { addPayment, deletePayment, deleteProforma, saveProforma, type PartyRow, type PaymentRow, type ProjectRow } from '@/lib/proposals/db'
import {
  addDaysIso, dealPackageId, DEAL_TYPES, isoToday, milestoneAmount, newMilestone, PROFORMA_LABEL, priceBase, scheduleCheck, schedulePreset,
  type DealType,
} from '@/lib/proposals/deal'
import type { ProjectModel } from '@/lib/proposals/model'
import type { PaymentMilestone, Project } from '@/lib/proposals/types'
import type { ProformaView } from '@/lib/proposals/tracking'
import type { Update } from './planner/store'
import { downloadPdf, type ComposeRequest } from './EmailComposer'
import { STATE_BADGE, money, shortDate } from './format'

/* Who the client pays, when and how much; the pro formas raised against it;
   and the money received. Nothing about payment is fixed in code: each
   milestone names its payee, which may be another company Bart Mining acts for. */

type Basis = 'percent:contract' | 'percent:equipment' | 'percent:services' | 'fixed'
const BASIS_LABEL: Record<Basis, string> = {
  'percent:contract': '% of the balance',
  'percent:equipment': '% of equipment',
  'percent:services': '% of services',
  fixed: 'Fixed USD',
}
const basisOf = (m: PaymentMilestone): Basis => (m.basis === 'fixed' ? 'fixed' : `percent:${m.of ?? 'contract'}`)

const firstName = (p?: PartyRow | null) => p?.contact_name?.trim().split(/\s+/)[0]

export function PaymentsTab({ row, project, model, update, parties, proformas, payments, reload, compose, client }: {
  row: ProjectRow
  project: Project
  model: ProjectModel
  update: Update
  parties: PartyRow[]
  proformas: ProformaView[]
  payments: PaymentRow[]
  reload: () => void
  compose: (r: ComposeRequest) => void
  client: PartyRow | null | undefined
}) {
  const schedule = project.paymentSchedule ?? []
  const pkgId = dealPackageId(project)
  const pm = pkgId ? model.byId.get(pkgId) : undefined
  const base = pm ? priceBase(pm) : { contract: 0, equipment: 0, services: 0 }
  const check = scheduleCheck(schedule, base)
  const payees = parties.filter(p => p.kind === 'principal' || p.kind === 'supplier')
  const principal = parties.find(p => p.id === row.principal_id)
  const [editing, setEditing] = useState<Partial<ProformaView> | null>(null)
  const [paying, setPaying] = useState<ProformaView | null>(null)

  const setRow = (k: number, fn: (m: PaymentMilestone) => void) => update(d => {
    const m = d.paymentSchedule?.[k]
    if (m) fn(m)
  })

  async function preset(kind: DealType) {
    if (schedule.length && !(await confirmDialog('Replace the payment schedule with this starting point?'))) return
    update(d => { d.paymentSchedule = schedulePreset(kind, d, principal ? { id: principal.id, name: principal.name } : undefined) })
  }

  async function raise(m: PaymentMilestone) {
    const amount = Math.round(milestoneAmount(m, schedule, base) * 100) / 100
    const pf = await saveProforma({
      project_id: row.id,
      milestone_key: m.id,
      payee_id: m.payeeId || null,
      description: `${m.label}: ${project.proposal.title}`,
      amount,
      currency: 'USD',
      issued_on: isoToday(),
      due_date: addDaysIso(isoToday(), m.dueDays ?? 7),
      status: 'draft',
    })
    if (pf) { notify('success', `${pf.number} raised as a draft.`); reload() }
  }

  function send(pf: ProformaView, reminder = false) {
    const payee = parties.find(p => p.id === pf.payee_id)
    const payTo = payee ? ` Payment is made directly to ${payee.name}, to the account shown on the pro forma.` : ''
    const body = reminder
      ? [
          `Dear ${firstName(client) ?? 'Sir or Madam'},`,
          `This is a reminder that pro forma ${pf.number} for ${pf.description}, ${money(pf.outstanding, pf.currency)}, was due on ${shortDate(pf.due_date)}.${payTo} A copy is attached.`,
          'If the payment has already been made, please send us the transfer reference and we will match it. Thank you.',
          `Kind regards,\n${project.meta.preparedBy || 'Allan Bartholomew'}\nBart Mining\n+255 759 141 705`,
        ]
      : [
          `Dear ${firstName(client) ?? 'Sir or Madam'},`,
          `Please find attached pro forma ${pf.number} for ${pf.description}: ${money(pf.amount, pf.currency)}${pf.due_date ? `, due by ${shortDate(pf.due_date)}` : ''}.${payTo}`,
          'Please confirm the pro forma, and let us know the transfer reference once the payment is made.',
          `Kind regards,\n${project.meta.preparedBy || 'Allan Bartholomew'}\nBart Mining\n+255 759 141 705`,
        ]
    compose({
      kind: reminder ? 'reminder' : 'proforma',
      projectId: row.id,
      relatedId: pf.id,
      title: reminder ? `Payment reminder, ${pf.number}` : `Send ${pf.number}`,
      to: client?.email ?? '',
      subject: reminder ? `Payment reminder: pro forma ${pf.number}` : `Pro forma ${pf.number}: ${project.proposal.title}`,
      body: body.join('\n\n'),
      attachmentNote: `${pf.number} as PDF`,
    })
  }

  async function confirm(pf: ProformaView) {
    if (await saveProforma({ id: pf.id, project_id: row.id, status: 'confirmed', confirmed_at: new Date().toISOString() })) reload()
  }

  async function cancel(pf: ProformaView) {
    if (!(await confirmDialog(`Cancel ${pf.number}? It stays on record as cancelled and drops out of the figures.`))) return
    if (await saveProforma({ id: pf.id, project_id: row.id, status: 'cancelled' })) reload()
  }

  const payeeName = (id: string | null) => (id ? parties.find(p => p.id === id)?.name ?? 'Other company' : 'Bart Mining')

  return (
    <div className="bm-tab">
      {/* ── Schedule ── */}
      <div className="bm-tab-head">
        <div>
          <div className="section-title" style={{ margin: 0 }}>Payment schedule</div>
          <div className="page-sub">
            {DEAL_TYPES.find(d => d.id === row.deal_type)?.hint} The proposal&apos;s payment terms print from this table.
            Amounts are for {pm?.pkg.name ?? 'the first option'}.
          </div>
        </div>
        <div className="bm-presets">
          <span className="page-sub">Start from</span>
          {DEAL_TYPES.map(d => <button key={d.id} className="btn btn-secondary btn-sm" onClick={() => preset(d.id)}>{d.label}</button>)}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="tbl bm-schedule">
          <thead>
            <tr><th>Milestone</th><th>When</th><th>Paid to</th><th>Basis</th><th>Value</th><th className="r">Amount</th><th>Pay within</th><th>Internal</th><th /></tr>
          </thead>
          <tbody>
            {schedule.map((m, k) => {
              const raised = proformas.filter(pf => pf.milestone_key === m.id && pf.state !== 'cancelled')
              return (
                <tr key={m.id} className={m.internal ? 'bm-internal' : ''}>
                  <td><TextIn value={m.label} onChange={v => setRow(k, x => { x.label = v })} placeholder="Deposit" /></td>
                  <td><TextIn value={m.trigger} onChange={v => setRow(k, x => { x.trigger = v })} placeholder="On signing" /></td>
                  <td>
                    <select className="input input-sm" value={m.payeeId} onChange={e => {
                      const p = payees.find(x => x.id === e.target.value)
                      setRow(k, x => { x.payeeId = p?.id ?? ''; x.payeeName = p?.name ?? 'Bart Mining' })
                    }}>
                      <option value="">Bart Mining</option>
                      {payees.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </td>
                  <td>
                    <select className="input input-sm" value={basisOf(m)} onChange={e => {
                      const b = e.target.value as Basis
                      setRow(k, x => {
                        if (b === 'fixed') { x.value = Math.round(milestoneAmount(x, schedule, base)); x.basis = 'fixed'; delete x.of }
                        else { if (x.basis === 'fixed') x.value = 0; x.basis = 'percent'; x.of = b.split(':')[1] as PaymentMilestone['of'] }
                      })
                    }}>
                      {(Object.keys(BASIS_LABEL) as Basis[]).map(b => <option key={b} value={b}>{BASIS_LABEL[b]}</option>)}
                    </select>
                  </td>
                  <td>
                    <NumIn value={m.basis === 'percent' ? m.value * 100 : m.value} suffix={m.basis === 'percent' ? '%' : ''}
                      onChange={v => setRow(k, x => { x.value = x.basis === 'percent' ? v / 100 : v })} />
                  </td>
                  <td className="r num">{money(milestoneAmount(m, schedule, base))}</td>
                  <td><NumIn value={m.dueDays ?? 7} suffix="days" onChange={v => setRow(k, x => { x.dueDays = v })} /></td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="checkbox" checked={!!m.internal} title="Not shown to the client, e.g. commission the company we act for pays us"
                      onChange={e => setRow(k, x => { x.internal = e.target.checked || undefined })} />
                  </td>
                  <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                    {raised.length
                      ? raised.map(pf => <span key={pf.id} className={`badge ${STATE_BADGE[pf.state]}`} style={{ marginRight: 4 }}>{pf.number}</span>)
                      : !m.internal && <button className="btn-text btn-text-accent" onClick={() => raise(m)}>Raise pro forma</button>}
                    <button className="btn-text btn-text-danger" aria-label="Remove" onClick={() => update(d => { d.paymentSchedule = (d.paymentSchedule ?? []).filter(x => x.id !== m.id) })}>✕</button>
                  </td>
                </tr>
              )
            })}
            {schedule.length === 0 && (
              <tr><td colSpan={9} style={{ color: 'var(--label-3)' }}>No schedule yet. Start from one of the three deal types above, or add rows. Until then the proposal uses the percentages in Budget.</td></tr>
            )}
          </tbody>
        </table>
        <div className="bm-schedule-foot">
          <button className="btn btn-secondary btn-sm" onClick={() => update(d => { d.paymentSchedule = [...(d.paymentSchedule ?? []), newMilestone()] })}>Add milestone</button>
          {schedule.length > 0 && (
            <span className={Math.abs(check.gap) > 1 ? 'bm-warn' : 'page-sub'}>
              Client payments come to {money(check.total)} of the {money(base.contract)} contract
              {Math.abs(check.gap) > 1 ? `: ${money(Math.abs(check.gap))} ${check.gap > 0 ? 'not yet scheduled' : 'more than the contract'}.` : '.'}
            </span>
          )}
        </div>
      </div>

      <label className="bm-form" style={{ marginTop: 14 }}>
        <span className="section-label">How the deal works, printed above the payment terms (optional)</span>
        <textarea className="input" rows={2} value={project.proposal.dealNote ?? ''}
          placeholder={row.deal_type === 'direct' ? 'For example: Bart Mining supplies the plant and is the client’s single contract.' : `For example: The equipment is supplied and invoiced by ${(principal?.name ?? 'the manufacturer').replace(/\.$/, '')}. Bart Mining manages the project, logistics and installation.`}
          onChange={e => update(d => { d.proposal.dealNote = e.target.value })} />
      </label>
      <p className="page-sub" style={{ marginTop: 6 }}>
        A percentage of the balance shares out the contract after any fixed payments. Percentages of equipment and of services
        split those two parts of the contract separately, for deals where they are paid to different companies. Internal rows stay out of the proposal.
      </p>

      {/* ── Pro formas ── */}
      <div className="bm-tab-head" style={{ marginTop: 32 }}>
        <div>
          <div className="section-title" style={{ margin: 0 }}>Pro formas</div>
          <div className="page-sub">Raised from the schedule or by hand. Part paid, paid and overdue follow from the payments below and the due date.</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setEditing({ amount: 0, currency: 'USD', due_date: addDaysIso(isoToday(), 7) })}>New pro forma</button>
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="tbl tbl-card">
          <thead><tr><th>Number</th><th>For</th><th>Paid to</th><th className="r">Amount</th><th className="r">Received</th><th>Due</th><th>Status</th><th /></tr></thead>
          <tbody>
            {proformas.map(pf => (
              <tr key={pf.id}>
                <td data-label="Number"><strong>{pf.number}</strong><div className="bm-cell-sub">{shortDate(pf.issued_on)}</div></td>
                <td data-label="For">{pf.description}</td>
                <td data-label="Paid to">{payeeName(pf.payee_id)}</td>
                <td data-label="Amount" className="r num">{money(pf.amount, pf.currency)}</td>
                <td data-label="Received" className="r num">{pf.paid ? money(pf.paid, pf.currency) : '–'}</td>
                <td data-label="Due">{shortDate(pf.due_date)}</td>
                <td data-label="Status"><span className={`badge ${STATE_BADGE[pf.state]}`}>{PROFORMA_LABEL[pf.state]}</span></td>
                <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <button className="btn-text" onClick={() => downloadPdf(`kind=proforma&id=${pf.id}`, pf.number)}>PDF</button>
                  {pf.state !== 'cancelled' && pf.state !== 'paid' && <button className="btn-text btn-text-accent" onClick={() => send(pf)}>{pf.status === 'draft' ? 'Send' : 'Resend'}</button>}
                  {pf.state === 'overdue' && <button className="btn-text btn-text-danger" onClick={() => send(pf, true)}>Remind</button>}
                  {(pf.status === 'draft' || pf.status === 'sent') && pf.state !== 'paid' && <button className="btn-text" onClick={() => confirm(pf)}>Confirmed</button>}
                  {pf.state !== 'cancelled' && pf.state !== 'paid' && <button className="btn-text btn-text-success" onClick={() => setPaying(pf)}>Payment</button>}
                  {pf.status === 'draft' && <button className="btn-text" onClick={() => setEditing(pf)}>Edit</button>}
                  {pf.status === 'draft' && !pf.paid
                    ? <button className="btn-text btn-text-danger" onClick={async () => { if (await confirmDialog(`Delete draft ${pf.number}?`) && await deleteProforma(pf.id)) reload() }}>Delete</button>
                    : pf.state !== 'cancelled' && pf.state !== 'paid' && <button className="btn-text btn-text-danger" onClick={() => cancel(pf)}>Cancel</button>}
                </td>
              </tr>
            ))}
            {proformas.length === 0 && <tr><td colSpan={8} style={{ color: 'var(--label-3)' }}>No pro formas yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* ── Payments received ── */}
      <div className="bm-tab-head" style={{ marginTop: 32 }}>
        <div>
          <div className="section-title" style={{ margin: 0 }}>Payments received</div>
          <div className="page-sub">Record each payment once it shows in the account. Payments made to another company are recorded here too, so the project shows what the client has paid in all.</div>
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="tbl tbl-card">
          <thead><tr><th>Date</th><th>Pro forma</th><th>Paid to</th><th className="r">Amount</th><th>Method</th><th>Reference</th><th /></tr></thead>
          <tbody>
            {payments.map(p => {
              const pf = proformas.find(x => x.id === p.proforma_id)
              return (
                <tr key={p.id}>
                  <td data-label="Date">{shortDate(p.received_on)}</td>
                  <td data-label="Pro forma">{pf?.number ?? '–'}</td>
                  <td data-label="Paid to">{pf ? payeeName(pf.payee_id) : '–'}</td>
                  <td data-label="Amount" className="r num">{money(p.amount, p.currency)}</td>
                  <td data-label="Method">{p.method ?? '–'}</td>
                  <td data-label="Reference">{p.reference ?? '–'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-text btn-text-danger" onClick={async () => { if (await confirmDialog('Delete this payment?') && await deletePayment(p.id)) reload() }}>Delete</button>
                  </td>
                </tr>
              )
            })}
            {payments.length === 0 && <tr><td colSpan={7} style={{ color: 'var(--label-3)' }}>No payments recorded.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <ProformaModal pf={editing} row={row} parties={payees} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload() }} />}
      {paying && <PaymentModal pf={paying} row={row} onClose={() => setPaying(null)} onSaved={() => { setPaying(null); reload() }} />}
    </div>
  )
}

function TextIn({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className="input input-sm" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
}

/** Number box that keeps what you type until you leave it. */
function NumIn({ value, onChange, suffix }: { value: number; onChange: (v: number) => void; suffix?: string }) {
  const shown = String(Math.round(value * 1000) / 1000)
  const [text, setText] = useState(shown)
  const [focus, setFocus] = useState(false)
  useEffect(() => { if (!focus) setText(shown) }, [shown, focus])
  return (
    <span className="bm-num">
      <input className="input input-sm" inputMode="decimal" value={text}
        onFocus={e => { setFocus(true); e.target.select() }}
        onBlur={() => setFocus(false)}
        onChange={e => {
          setText(e.target.value)
          const n = Number(e.target.value.replace(/,/g, ''))
          if (e.target.value.trim() !== '' && Number.isFinite(n)) onChange(n)
        }} />
      {suffix && <span>{suffix}</span>}
    </span>
  )
}

function ProformaModal({ pf, row, parties, onClose, onSaved }: {
  pf: Partial<ProformaView>; row: ProjectRow; parties: PartyRow[]; onClose: () => void; onSaved: () => void
}) {
  const [description, setDescription] = useState(pf.description ?? '')
  const [amount, setAmount] = useState(pf.amount ? String(pf.amount) : '')
  const [currency, setCurrency] = useState(pf.currency ?? 'USD')
  const [payee, setPayee] = useState(pf.payee_id ?? '')
  const [due, setDue] = useState(pf.due_date ?? '')
  const [notes, setNotes] = useState(pf.notes ?? '')
  const [busy, setBusy] = useState(false)

  async function save() {
    const n = Number(amount.replace(/,/g, ''))
    if (!description.trim()) { notify('warn', 'Describe what the pro forma is for.'); return }
    if (!Number.isFinite(n) || n <= 0) { notify('warn', 'Enter the amount.'); return }
    setBusy(true)
    const ok = await saveProforma({
      ...(pf.id ? { id: pf.id } : {}),
      project_id: row.id, description: description.trim(), amount: n, currency: currency.toUpperCase(),
      payee_id: payee || null, due_date: due || null, notes: notes || null,
      ...(pf.id ? {} : { status: 'draft', issued_on: isoToday() }),
    })
    setBusy(false)
    if (ok) onSaved()
  }

  return (
    <Modal title={pf.id ? `Edit ${pf.number}` : 'New pro forma'} onClose={onClose}>
      <div className="bm-form">
        <label><span>For</span><input className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Down-payment: 150 m³/h washing and sluice plant" /></label>
        <div className="bm-form-row">
          <label><span>Amount</span><input className="input" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} /></label>
          <label><span>Currency</span><input className="input" value={currency} onChange={e => setCurrency(e.target.value)} /></label>
        </div>
        <div className="bm-form-row">
          <label><span>Paid to</span>
            <select className="input" value={payee} onChange={e => setPayee(e.target.value)}>
              <option value="">Bart Mining</option>
              {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label><span>Due</span><input className="input" type="date" value={due} onChange={e => setDue(e.target.value)} /></label>
        </div>
        <label><span>Notes on the pro forma</span><textarea className="input" rows={2} value={notes} onChange={e => setNotes(e.target.value)} /></label>
        <div className="bm-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  )
}

function PaymentModal({ pf, row, onClose, onSaved }: { pf: ProformaView; row: ProjectRow; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState(String(Math.round(pf.outstanding * 100) / 100))
  const [date, setDate] = useState(isoToday())
  const [method, setMethod] = useState('Bank transfer')
  const [reference, setReference] = useState('')
  const [busy, setBusy] = useState(false)

  async function save() {
    const n = Number(amount.replace(/,/g, ''))
    if (!Number.isFinite(n) || n <= 0) { notify('warn', 'Enter the amount received.'); return }
    setBusy(true)
    const ok = await addPayment({ project_id: row.id, proforma_id: pf.id, amount: n, currency: pf.currency, received_on: date, method, reference: reference || null, notes: null })
    setBusy(false)
    if (ok) { notify('success', `${money(n, pf.currency)} recorded against ${pf.number}.`); onSaved() }
  }

  return (
    <Modal title={`Payment against ${pf.number}`} onClose={onClose}>
      <div className="bm-form">
        <p className="bm-note">{money(pf.outstanding, pf.currency)} outstanding of {money(pf.amount, pf.currency)}.</p>
        <div className="bm-form-row">
          <label><span>Amount received</span><input className="input" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} /></label>
          <label><span>Date</span><input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
        </div>
        <div className="bm-form-row">
          <label><span>Method</span>
            <select className="input" value={method} onChange={e => setMethod(e.target.value)}>
              <option>Bank transfer</option><option>Mobile money</option><option>Cash</option><option>Cheque</option><option>Other</option>
            </select>
          </label>
          <label><span>Reference</span><input className="input" value={reference} onChange={e => setReference(e.target.value)} placeholder="Bank or transfer reference" /></label>
        </div>
        <div className="bm-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Record payment'}</button>
        </div>
      </div>
    </Modal>
  )
}
