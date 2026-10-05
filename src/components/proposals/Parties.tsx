'use client'

import { useState } from 'react'
import { Modal } from '@/components/goldpass/Modal'
import { notify } from '@/lib/goldpass/notify'
import { saveParty, type PartyKind, type PartyRow } from '@/lib/proposals/db'

export const KIND_LABEL: Record<PartyKind, string> = {
  client: 'Client',
  supplier: 'Supplier',
  principal: 'Company we act for',
  self: 'Bart Mining',
}

/** Create or edit a client, supplier or company Bart Mining acts for. */
export function PartyModal({ party, kind, onClose, onSaved }: {
  party?: PartyRow | null
  kind?: PartyKind
  onClose: () => void
  onSaved: (p: PartyRow) => void
}) {
  const [p, setP] = useState<Partial<PartyRow>>(party ?? { kind: kind ?? 'client', name: '' })
  const [busy, setBusy] = useState(false)
  const set = (k: keyof PartyRow) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setP(x => ({ ...x, [k]: e.target.value }))
  const isSelf = p.kind === 'self'

  async function submit() {
    if (!p.name?.trim()) { notify('warn', 'Add a name.'); return }
    setBusy(true)
    const saved = await saveParty({ ...p, kind: p.kind as PartyKind, name: p.name.trim() })
    setBusy(false)
    if (saved) { notify('success', `${saved.name} saved.`); onSaved(saved); onClose() }
  }

  return (
    <Modal title={party ? `Edit ${party.name}` : `New ${KIND_LABEL[p.kind as PartyKind].toLowerCase()}`} onClose={onClose}>
      <div className="bm-form">
        {!isSelf && (
          <label><span>Type</span>
            <select className="input" value={p.kind} onChange={set('kind')}>
              <option value="client">Client</option>
              <option value="supplier">Supplier</option>
              <option value="principal">Company we act for</option>
            </select>
          </label>
        )}
        <label><span>Company name</span><input className="input" value={p.name ?? ''} onChange={set('name')} /></label>
        <div className="bm-form-row">
          <label><span>Contact person</span><input className="input" value={p.contact_name ?? ''} onChange={set('contact_name')} /></label>
          <label><span>Email</span><input className="input" value={p.email ?? ''} onChange={set('email')} placeholder="for proposals, requests and pro formas" /></label>
        </div>
        <div className="bm-form-row">
          <label><span>Phone</span><input className="input" value={p.phone ?? ''} onChange={set('phone')} /></label>
          <label><span>Country</span><input className="input" value={p.country ?? ''} onChange={set('country')} /></label>
        </div>
        <label><span>Address</span><textarea className="input" rows={2} value={p.address ?? ''} onChange={set('address')} /></label>
        <label><span>Tax ID (TIN / VAT)</span><input className="input" value={p.tax_id ?? ''} onChange={set('tax_id')} /></label>
        {(p.kind !== 'client') && (
          <label>
            <span>Bank details</span>
            <textarea className="input" rows={5} value={p.bank_details ?? ''} onChange={set('bank_details')}
              placeholder={'Bank, branch, account name, account number, SWIFT.\nPrinted on pro formas payable to this company.'} />
          </label>
        )}
        <label><span>Notes</span><textarea className="input" rows={2} value={p.notes ?? ''} onChange={set('notes')} /></label>
        <div className="bm-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  )
}

/** A select of parties of the given kinds, with "New…" at the bottom. */
export function PartySelect({ parties, kinds, value, onChange, onNew, empty = 'None', className = 'input' }: {
  parties: PartyRow[]
  kinds: PartyKind[]
  value: string | null
  onChange: (id: string | null) => void
  onNew?: () => void
  empty?: string
  className?: string
}) {
  const list = parties.filter(p => kinds.includes(p.kind))
  return (
    <select className={className} value={value ?? ''} onChange={e => {
      if (e.target.value === '__new') { onNew?.(); return }
      onChange(e.target.value || null)
    }}>
      <option value="">{empty}</option>
      {list.map(p => <option key={p.id} value={p.id}>{p.name}{kinds.length > 1 ? ` (${KIND_LABEL[p.kind]})` : ''}</option>)}
      {onNew && <option value="__new">New…</option>}
    </select>
  )
}
