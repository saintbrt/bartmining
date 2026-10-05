'use client'

import { useState } from 'react'
import { Modal } from '@/components/goldpass/Modal'
import { notify } from '@/lib/goldpass/notify'
import { confirmDialog } from '@/lib/goldpass/confirm'
import { deleteRfq, fileUrl, nextNumber, saveRfq, uploadFile, type PartyRow, type ProjectRow, type RfqRow } from '@/lib/proposals/db'
import type { Package, Project } from '@/lib/proposals/types'
import type { Update } from './planner/store'
import { PartyModal, PartySelect } from './Parties'
import type { ComposeRequest } from './EmailComposer'
import { STATE_BADGE, money, shortDate } from './format'

/* Requests for quotation to suppliers, and the quotes that come back. A
   quote can become the package price in the Budget with one click. The
   request never names the client or the price the client pays. */

const firstName = (p?: PartyRow | null) => p?.contact_name?.trim().split(/\s+/)[0]

export function rfqEmail(project: Project, pkg: Package, supplier: PartyRow | null | undefined, number: string, me: string) {
  const items = pkg.equipment.map((e, k) =>
    `${k + 1}. ${e.item}. Quantity: ${e.qty}${e.kw && e.kw !== '-' ? `. Power: ${e.kw} kW` : ''}${e.optional ? ' (optional, please price separately)' : ''}`)
  return {
    subject: `Request for quotation ${number}: ${pkg.capacity} m³/h ${pkg.name.toLowerCase()}`,
    body: [
      `Dear ${firstName(supplier) ?? 'Sir or Madam'},`,
      `Bart Mining requests your quotation for the equipment below, for a ${pkg.capacity} m³/h ${pkg.name.toLowerCase()} on a gold project in Tanzania. Our reference is ${number}.`,
      items.join('\n'),
      [
        'Please include in your quotation:',
        '- unit and total prices in USD, and whether they are EXW or FOB (and which port)',
        '- manufacturing lead time and how long the offer is valid',
        '- your payment terms',
        '- the packing list: how many 40 ft containers, and any item that needs a flat rack',
        '- motor power and voltage for each item (the site runs 380-415 V, 50 Hz)',
      ].join('\n'),
      `Kind regards,\n${project.meta.preparedBy || 'Allan Bartholomew'}\nBart Mining\n+255 759 141 705\n${me}`,
    ].join('\n\n'),
  }
}

export function SuppliersTab({ row, project, update, parties, setParties, rfqs, reload, compose, me }: {
  row: ProjectRow
  project: Project
  update: Update
  parties: PartyRow[]
  setParties: (fn: (p: PartyRow[]) => PartyRow[]) => void
  rfqs: RfqRow[]
  reload: () => void
  compose: (r: ComposeRequest) => void
  me: string
}) {
  const [creating, setCreating] = useState(false)
  const [quoting, setQuoting] = useState<RfqRow | null>(null)
  const name = (id: string | null) => parties.find(p => p.id === id)?.name ?? 'No supplier'

  function send(r: RfqRow) {
    const supplier = parties.find(p => p.id === r.supplier_id)
    const pkg = project.packages.find(p => p.id === r.package_key) ?? project.packages[0]
    const mail = rfqEmail(project, pkg, supplier, r.number ?? '', me)
    compose({
      kind: 'rfq', projectId: row.id, relatedId: r.id,
      title: `Send ${r.number} to ${supplier?.name ?? 'supplier'}`,
      to: supplier?.email ?? '',
      subject: r.subject || mail.subject,
      body: mail.body,
      attachmentNote: 'none, unless you add drawings or a specification below',
    })
  }

  async function useAsPrice(r: RfqRow) {
    if (r.quote_amount === null) return
    const pkg = project.packages.find(p => p.id === r.package_key) ?? project.packages[0]
    if (r.quote_currency !== 'USD') { notify('warn', `The quote is in ${r.quote_currency}. Convert it to USD and enter it in Budget.`); return }
    if (!(await confirmDialog(`Use ${money(r.quote_amount)} from ${name(r.supplier_id)} as the supplier price for ${pkg.name}?\n\nIt replaces the package price in Budget. Equipment lines keep their own figures, so set any lines the quote covers to 0.`))) return
    update(d => {
      const p = d.packages.find(x => x.id === pkg.id)
      if (!p) return
      p.packageCost = r.quote_amount ?? 0
      p.packageBasis = `${name(r.supplier_id)}${r.quote_ref ? `, quote ${r.quote_ref}` : ''}${r.quote_valid_until ? `, valid to ${r.quote_valid_until}` : ''}`
    })
    await saveRfq({ id: r.id, project_id: row.id, status: 'accepted' })
    notify('success', 'Package price updated. The proposal and figures recalculate from it.')
    reload()
  }

  async function open(r: RfqRow) {
    if (!r.quote_path) return
    const url = await fileUrl(r.quote_path)
    if (url) window.open(url, '_blank', 'noopener')
  }

  return (
    <div className="bm-tab">
      <div className="bm-tab-head">
        <div>
          <div className="section-title" style={{ margin: 0 }}>Supplier requests and quotes</div>
          <div className="page-sub">Requests go out from Bart Mining with the equipment list for one option. They never name the client or the client&apos;s price.</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>New request</button>
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="tbl tbl-card">
          <thead><tr><th>Request</th><th>Supplier</th><th>Status</th><th>Sent</th><th>Quote</th><th>Valid to</th><th /></tr></thead>
          <tbody>
            {rfqs.map(r => (
              <tr key={r.id}>
                <td data-label="Request"><strong>{r.number}</strong><div className="bm-cell-sub">{r.subject}</div></td>
                <td data-label="Supplier">{name(r.supplier_id)}</td>
                <td data-label="Status"><span className={`badge ${STATE_BADGE[r.status] ?? 'badge-gray'}`}>{r.status}</span></td>
                <td data-label="Sent">{shortDate(r.sent_at)}</td>
                <td data-label="Quote" className="num">
                  {r.quote_amount !== null ? money(r.quote_amount, r.quote_currency) : '–'}
                  {r.quote_ref && <div className="bm-cell-sub">{r.quote_ref}</div>}
                </td>
                <td data-label="Valid to">{shortDate(r.quote_valid_until)}</td>
                <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <button className="btn-text btn-text-accent" onClick={() => send(r)}>{r.sent_at ? 'Resend' : 'Send'}</button>
                  <button className="btn-text" onClick={() => setQuoting(r)}>{r.quote_amount !== null ? 'Edit quote' : 'Record quote'}</button>
                  {r.quote_path && <button className="btn-text" onClick={() => open(r)}>Quote file</button>}
                  {r.quote_amount !== null && r.status !== 'accepted' && <button className="btn-text btn-text-success" onClick={() => useAsPrice(r)}>Use as price</button>}
                  <button className="btn-text btn-text-danger" onClick={async () => {
                    if (await confirmDialog(`Delete ${r.number}?`) && await deleteRfq(r.id)) reload()
                  }}>Delete</button>
                </td>
              </tr>
            ))}
            {rfqs.length === 0 && <tr><td colSpan={7} style={{ color: 'var(--label-3)' }}>No requests yet. New request writes one from an option&apos;s equipment list.</td></tr>}
          </tbody>
        </table>
      </div>

      {creating && (
        <NewRfqModal row={row} project={project} parties={parties} setParties={setParties} me={me}
          onClose={() => setCreating(false)}
          onCreated={r => { reload(); send(r) }} />
      )}
      {quoting && <QuoteModal r={quoting} onClose={() => setQuoting(null)} onSaved={() => { setQuoting(null); reload() }} />}
    </div>
  )
}

function NewRfqModal({ row, project, parties, setParties, onClose, onCreated, me }: {
  row: ProjectRow; project: Project; parties: PartyRow[]; setParties: (fn: (p: PartyRow[]) => PartyRow[]) => void
  onClose: () => void; onCreated: (r: RfqRow) => void; me: string
}) {
  const [supplierId, setSupplierId] = useState<string | null>(null)
  const [pkgId, setPkgId] = useState(project.packages[0]?.id ?? '')
  const [busy, setBusy] = useState(false)
  const [newParty, setNewParty] = useState(false)

  async function create() {
    if (!supplierId) { notify('warn', 'Choose the supplier.'); return }
    setBusy(true)
    const number = await nextNumber('RFQ')
    if (!number) { setBusy(false); return }
    const pkg = project.packages.find(p => p.id === pkgId) ?? project.packages[0]
    const mail = rfqEmail(project, pkg, parties.find(p => p.id === supplierId), number, me)
    const r = await saveRfq({ project_id: row.id, supplier_id: supplierId, number, subject: mail.subject, package_key: pkg.id, status: 'draft' })
    setBusy(false)
    if (r) { onClose(); onCreated(r) }
  }

  return (
    <>
      <Modal title="New supplier request" onClose={onClose}>
        <div className="bm-form">
          <label><span>Supplier</span>
            <PartySelect parties={parties} kinds={['supplier', 'principal']} value={supplierId} onChange={setSupplierId} onNew={() => setNewParty(true)} empty="Choose…" />
          </label>
          <label><span>Equipment list from</span>
            <select className="input" value={pkgId} onChange={e => setPkgId(e.target.value)}>
              {project.packages.map(p => <option key={p.id} value={p.id}>{p.name} ({p.equipment.length} items)</option>)}
            </select>
          </label>
          <p className="bm-note">Next you can read and edit the email before it goes.</p>
          <div className="bm-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={create} disabled={busy}>{busy ? 'Creating…' : 'Write the request'}</button>
          </div>
        </div>
      </Modal>
      {newParty && <PartyModal kind="supplier" onClose={() => setNewParty(false)} onSaved={p => { setParties(ps => [...ps, p]); setSupplierId(p.id) }} />}
    </>
  )
}

function QuoteModal({ r, onClose, onSaved }: { r: RfqRow; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState(r.quote_amount?.toString() ?? '')
  const [currency, setCurrency] = useState(r.quote_currency || 'USD')
  const [ref, setRef] = useState(r.quote_ref ?? '')
  const [valid, setValid] = useState(r.quote_valid_until ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<RfqRow['status']>(r.status === 'draft' || r.status === 'sent' ? 'quoted' : r.status)
  const [busy, setBusy] = useState(false)

  async function save() {
    const n = Number(amount.replace(/,/g, ''))
    if (status !== 'declined' && (!amount || !Number.isFinite(n))) { notify('warn', 'Enter the quoted amount.'); return }
    setBusy(true)
    let quote_path = r.quote_path
    if (file) {
      const path = `quotes/${r.project_id}/${r.number ?? r.id}-${file.name.replace(/[^\w.\-]+/g, '_')}`
      if (!(await uploadFile(path, file, file.type || undefined))) { setBusy(false); return }
      quote_path = path
    }
    const ok = await saveRfq({
      id: r.id, project_id: r.project_id, status,
      quote_amount: amount ? n : null, quote_currency: currency.toUpperCase(), quote_ref: ref || null,
      quote_valid_until: valid || null, quote_path, quoted_at: r.quoted_at ?? new Date().toISOString(),
    })
    setBusy(false)
    if (ok) onSaved()
  }

  return (
    <Modal title={`Quote for ${r.number}`} onClose={onClose}>
      <div className="bm-form">
        <div className="bm-form-row">
          <label><span>Amount</span><input className="input" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} /></label>
          <label><span>Currency</span><input className="input" value={currency} onChange={e => setCurrency(e.target.value)} /></label>
        </div>
        <div className="bm-form-row">
          <label><span>Their reference</span><input className="input" value={ref} onChange={e => setRef(e.target.value)} /></label>
          <label><span>Valid until</span><input className="input" type="date" value={valid} onChange={e => setValid(e.target.value)} /></label>
        </div>
        <label><span>Status</span>
          <select className="input" value={status} onChange={e => setStatus(e.target.value as RfqRow['status'])}>
            <option value="quoted">Quoted</option>
            <option value="accepted">Accepted (we are using it)</option>
            <option value="declined">Declined to quote</option>
          </select>
        </label>
        <label><span>Quote file (PDF)</span><input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label>
        {r.quote_path && !file && <p className="bm-note">A file is already stored. Choosing one replaces it.</p>}
        <div className="bm-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save quote'}</button>
        </div>
      </div>
    </Modal>
  )
}
