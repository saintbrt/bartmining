'use client'

import { useState } from 'react'
import { Modal } from '@/components/goldpass/Modal'
import { notify } from '@/lib/goldpass/notify'
import { uploadFile } from '@/lib/proposals/db'

export interface ComposeRequest {
  kind: 'proposal' | 'proforma' | 'rfq' | 'reminder' | 'general'
  projectId: string
  relatedId?: string
  title: string
  to: string
  cc?: string
  subject: string
  body: string
  /** What goes with it, described for the user ("BM-P-2026-001, Rev B (PDF)"). */
  attachmentNote?: string
  proposal?: { mode: 'issue' | 'resend'; proposalId?: string }
  /** Runs before sending, e.g. saving unsaved edits so the PDF has them. */
  beforeSend?: () => Promise<boolean>
}

/**
 * Writes and sends one email through /api/admin/send. The server attaches
 * the document, sends it with Resend and logs it on the project.
 */
export function EmailComposer({ req, me, onClose, onSent }: {
  req: ComposeRequest
  me: string
  onClose: () => void
  onSent: () => void
}) {
  const [to, setTo] = useState(req.to)
  const [cc, setCc] = useState(req.cc ?? '')
  const [copyMe, setCopyMe] = useState(true)
  const [subject, setSubject] = useState(req.subject)
  const [body, setBody] = useState(req.body)
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState('')

  async function send() {
    if (!to.trim()) { notify('warn', 'Add a recipient.'); return }
    if (!subject.trim()) { notify('warn', 'Add a subject.'); return }
    if (req.beforeSend) {
      setBusy('Saving…')
      if (!(await req.beforeSend())) { setBusy(''); notify('error', 'Save the project first: it has changes that did not save.'); return }
    }
    const uploaded: { path: string; name: string }[] = []
    for (const f of files) {
      setBusy(`Uploading ${f.name}…`)
      const path = `uploads/${req.projectId}/${Date.now()}-${f.name.replace(/[^\w.\-]+/g, '_')}`
      if (!(await uploadFile(path, f, f.type || undefined))) { setBusy(''); return }
      uploaded.push({ path, name: f.name })
    }
    setBusy(req.kind === 'proposal' || req.kind === 'proforma' ? 'Making the PDF and sending…' : 'Sending…')
    try {
      const r = await fetch('/api/admin/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: req.kind,
          projectId: req.projectId,
          relatedId: req.relatedId,
          to, cc,
          bcc: copyMe ? me : '',
          replyTo: me,
          subject, body,
          proposal: req.proposal,
          files: uploaded,
        }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) { notify('error', `Not sent: ${j.error ?? r.statusText}`, 'GP-2792'); setBusy(''); return }
      notify('success', `Sent to ${to}.`)
      onSent()
      onClose()
    } catch (e) {
      notify('error', `Not sent: ${e instanceof Error ? e.message : String(e)}`, 'GP-2792')
      setBusy('')
    }
  }

  return (
    <Modal title={req.title} onClose={() => { if (!busy) onClose() }}>
      <div className="bm-form">
        <label><span>To</span><input className="input" value={to} onChange={e => setTo(e.target.value)} placeholder="name@company.com, second@company.com" /></label>
        <label><span>Cc</span><input className="input" value={cc} onChange={e => setCc(e.target.value)} /></label>
        <label className="bm-check"><input type="checkbox" checked={copyMe} onChange={e => setCopyMe(e.target.checked)} /> Send me a copy ({me})</label>
        <label><span>Subject</span><input className="input" value={subject} onChange={e => setSubject(e.target.value)} /></label>
        <label><span>Message</span><textarea className="input" rows={11} value={body} onChange={e => setBody(e.target.value)} /></label>
        {req.attachmentNote && <div className="bm-attach">Attached: {req.attachmentNote}</div>}
        <label>
          <span>Other files</span>
          <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files ?? []))} />
        </label>
        <p className="bm-note">Sent from Bart Mining&apos;s address. Replies come to {me}.</p>
        <div className="bm-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={!!busy}>Cancel</button>
          <button className="btn btn-primary" onClick={send} disabled={!!busy}>{busy || 'Send'}</button>
        </div>
      </div>
    </Modal>
  )
}

/** Downloads a PDF from /api/admin/pdf, showing progress while Chrome prints it. */
export async function downloadPdf(query: string, fallbackName: string) {
  notify('info', 'Making the PDF…')
  try {
    const r = await fetch(`/api/admin/pdf?${query}`)
    if (!r.ok) {
      const j = await r.json().catch(() => ({}))
      notify('error', `PDF not made: ${j.error ?? r.statusText}`, 'GP-2791')
      return
    }
    const blob = await r.blob()
    const name = /filename="([^"]+)"/.exec(r.headers.get('Content-Disposition') ?? '')?.[1] ?? `${fallbackName}.pdf`
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 10000)
  } catch (e) {
    notify('error', `PDF not made: ${e instanceof Error ? e.message : String(e)}`, 'GP-2791')
  }
}
