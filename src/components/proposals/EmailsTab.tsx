'use client'

import { Fragment, useState } from 'react'
import type { MessageRow, PartyRow, ProjectRow } from '@/lib/proposals/db'
import type { Project } from '@/lib/proposals/types'
import type { ComposeRequest } from './EmailComposer'
import { STATE_BADGE, shortDate } from './format'

const KIND: Record<MessageRow['kind'], string> = {
  proposal: 'Proposal',
  rfq: 'Supplier request',
  proforma: 'Pro forma',
  reminder: 'Reminder',
  general: 'Email',
}

/** Every email sent from this project, newest first. */
export function EmailsTab({ row, project, messages, client, compose }: {
  row: ProjectRow
  project: Project
  messages: MessageRow[]
  client: PartyRow | null | undefined
  compose: (r: ComposeRequest) => void
}) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="bm-tab">
      <div className="bm-tab-head">
        <div>
          <div className="section-title" style={{ margin: 0 }}>Emails</div>
          <div className="page-sub">Sent from Bart Mining&apos;s address through the app. Replies go to the inbox of whoever sent them.</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => compose({
          kind: 'general', projectId: row.id, title: 'New email', to: client?.email ?? '',
          subject: project.proposal.title, body: `Dear ${client?.contact_name?.split(/\s+/)[0] ?? 'Sir or Madam'},\n\n\n\nKind regards,\n${project.meta.preparedBy || 'Allan Bartholomew'}\nBart Mining\n+255 759 141 705`,
        })}>New email</button>
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="tbl tbl-card">
          <thead><tr><th>Sent</th><th>Type</th><th>To</th><th>Subject</th><th>Attached</th><th>Status</th></tr></thead>
          <tbody>
            {messages.map(m => (
              <Fragment key={m.id}>
                <tr onClick={() => setOpen(o => (o === m.id ? null : m.id))} style={{ cursor: 'pointer' }}>
                  <td data-label="Sent">{shortDate(m.sent_at)}</td>
                  <td data-label="Type">{KIND[m.kind]}</td>
                  <td data-label="To">{m.to_emails.join(', ')}{m.cc_emails.length ? <div className="bm-cell-sub">cc {m.cc_emails.join(', ')}</div> : null}</td>
                  <td data-label="Subject">{m.subject}</td>
                  <td data-label="Attached">{m.attachments.map(a => a.name).join(', ') || '–'}</td>
                  <td data-label="Status"><span className={`badge ${STATE_BADGE[m.status]}`}>{m.status}</span>{m.error && <div className="bm-cell-sub">{m.error}</div>}</td>
                </tr>
                {open === m.id && (
                  <tr className="bm-msg-body"><td colSpan={6}><pre>{m.body}</pre></td></tr>
                )}
              </Fragment>
            ))}
            {messages.length === 0 && <tr><td colSpan={6} style={{ color: 'var(--label-3)' }}>Nothing sent from this project yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
