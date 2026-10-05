'use client'

import { useState } from 'react'
import { Modal } from '@/components/goldpass/Modal'
import { notify } from '@/lib/goldpass/notify'
import { confirmDialog } from '@/lib/goldpass/confirm'
import { updateProject, updateProposal, type PartyRow, type ProjectRow, type ProposalRow } from '@/lib/proposals/db'
import { addDaysIso, nextRevision, proposalRef } from '@/lib/proposals/deal'
import type { Project } from '@/lib/proposals/types'
import type { Update } from './planner/store'
import { downloadPdf, type ComposeRequest } from './EmailComposer'
import { STATE_BADGE, shortDate } from './format'

/** What the next send will be called: the current revision, or the next letter if it already went out. */
export function nextIssue(project: Project, proposals: ProposalRow[]) {
  const no = project.meta.proposalNo?.trim()
  if (!no) return { label: 'a new proposal number', ref: '' }
  let rev = project.meta.revision?.trim() || 'A'
  const used = new Set(proposals.filter(p => p.number === no).map(p => p.revision))
  while (used.has(rev)) rev = nextRevision(rev)
  const ref = proposalRef(no, rev)
  return { label: ref, ref }
}

const firstName = (p?: PartyRow | null) => p?.contact_name?.trim().split(/\s+/)[0]

export function proposalEmail(project: Project, client: PartyRow | null | undefined, ref: string) {
  const m = project.meta
  const valid = m.date ? shortDate(addDaysIso(m.date, m.validityDays || 0)) : ''
  return {
    subject: `${ref ? `Proposal ${ref}` : 'Proposal'}: ${project.proposal.title}`,
    body: [
      `Dear ${firstName(client) ?? 'Sir or Madam'},`,
      `Please find attached our proposal for the ${project.proposal.title}${m.site ? `, ${m.site}` : ''}.`,
      `It sets out the plant and its equipment, the project costs, the delivery schedule and the payment terms.${valid ? ` The proposal is valid until ${valid}.` : ''}`,
      'We would be glad to take you through it on a call or at your site, and to answer any questions.',
      `Kind regards,\n${m.preparedBy || 'Allan Bartholomew'}\nBart Mining\n+255 759 141 705`,
    ].join('\n\n'),
  }
}

/**
 * The buttons beside the proposal: download the draft as PDF, send it, and
 * every revision that has gone out with what the client said.
 */
export function ProposalActions({ row, project, update, flush, proposals, client, compose, reload }: {
  row: ProjectRow
  project: Project
  update: Update
  flush: () => Promise<boolean>
  proposals: ProposalRow[]
  client: PartyRow | null | undefined
  compose: (r: ComposeRequest) => void
  reload: () => void
}) {
  const [accepting, setAccepting] = useState<ProposalRow | null>(null)
  const issue = nextIssue(project, proposals)
  const mine = proposals.filter(p => p.project_id === row.id)

  async function download() {
    if (!(await flush())) { notify('error', 'The project has changes that did not save. Reload before downloading.'); return }
    await downloadPdf(`kind=proposal&id=${row.id}`, project.meta.name)
  }

  function send() {
    const mail = proposalEmail(project, client, issue.ref)
    compose({
      kind: 'proposal',
      projectId: row.id,
      title: 'Send proposal',
      to: client?.email ?? '',
      subject: mail.subject,
      body: mail.body,
      attachmentNote: `the proposal as PDF, issued as ${issue.label}`,
      proposal: { mode: 'issue' },
      beforeSend: flush,
    })
  }

  function resend(p: ProposalRow) {
    const mail = proposalEmail(project, client, `${p.number}, Rev ${p.revision}`)
    compose({
      kind: 'proposal',
      projectId: row.id,
      title: `Resend ${p.number}, Rev ${p.revision}`,
      to: client?.email ?? '',
      subject: mail.subject,
      body: mail.body,
      attachmentNote: `${p.number}, Rev ${p.revision} exactly as it was sent on ${shortDate(p.sent_at)}`,
      proposal: { mode: 'resend', proposalId: p.id },
    })
  }

  async function decline(p: ProposalRow) {
    const lose = await confirmDialog(`Mark ${p.number}, Rev ${p.revision} as declined?\n\nThe project moves to Lost. Choose Cancel to keep it open.`)
    if (!lose) return
    await updateProposal(p.id, { status: 'declined', decided_at: new Date().toISOString() })
    await updateProject(row.id, { stage: 'lost' })
    reload()
  }

  return (
    <div className="bm-prop-actions">
      <button className="btn primary block" onClick={send}>Send to client</button>
      <button className="btn block" onClick={download}>Download PDF</button>
      <p className="hint">The download is the file the client receives. Next send: {issue.label}.</p>

      {mine.length > 0 && (
        <div className="tool-group">
          <h3>Sent</h3>
          {mine.map(p => (
            <div key={p.id} className="bm-issued">
              <div className="bm-issued-top">
                <strong>Rev {p.revision}</strong>
                <span className={`badge ${STATE_BADGE[p.status] ?? 'badge-gray'}`}>{p.status}</span>
              </div>
              <div className="bm-issued-date">{shortDate(p.sent_at)}</div>
              <div className="bm-issued-links">
                <button className="link" onClick={() => downloadPdf(`kind=issued&id=${p.id}`, `${p.number} Rev ${p.revision}`)}>PDF</button>
                <button className="link" onClick={() => resend(p)}>Resend</button>
                {p.status === 'sent' && <button className="link" onClick={() => setAccepting(p)}>Accepted</button>}
                {p.status === 'sent' && <button className="link" onClick={() => decline(p)}>Declined</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {accepting && (
        <AcceptModal p={accepting} project={project} onClose={() => setAccepting(null)} onDone={async pkgId => {
          await updateProposal(accepting.id, { status: 'accepted', decided_at: new Date().toISOString() })
          update(d => { d.selectedPackageId = pkgId })
          await updateProject(row.id, { stage: 'won' })
          notify('success', 'Marked as won. Raise the first pro forma from Payments.')
          setAccepting(null)
          reload()
        }} />
      )}
    </div>
  )
}

function AcceptModal({ p, project, onClose, onDone }: { p: ProposalRow; project: Project; onClose: () => void; onDone: (pkgId: string) => void }) {
  const options = project.packages.filter(x => project.proposal.packageIds.includes(x.id))
  const [pkg, setPkg] = useState(options[0]?.id ?? '')
  return (
    <Modal title={`${p.number}, Rev ${p.revision} accepted`} onClose={onClose}>
      <div className="bm-form">
        {options.length > 1 ? (
          <label><span>Which option did the client choose?</span>
            <select className="input" value={pkg} onChange={e => setPkg(e.target.value)}>
              {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </label>
        ) : <p className="bm-note">The project moves to Won, priced on {options[0]?.name ?? 'the proposal option'}.</p>}
        <div className="bm-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onDone(pkg)}>Mark as won</button>
        </div>
      </div>
    </Modal>
  )
}
