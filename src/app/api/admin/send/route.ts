import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { MAIL_FROM, emailHtml, emailList, oneLine, renderPdf, requireAdmin, safeFileName, type AdminContext } from '@/lib/proposals/server'
import { addDaysIso, contractValue, nextRevision } from '@/lib/proposals/deal'
import type { Project } from '@/lib/proposals/types'
import { SITE } from '@/lib/seo'

/**
 * Sends one email from a project, with its attachment, and logs it in
 * bm_messages. Admins only.
 *
 *   kind 'proposal'  issue the proposal (numbered on first send; a new
 *                    revision letter if this one already went out), or resend
 *                    an issued revision's stored PDF unchanged
 *   kind 'proforma'  print and attach a pro forma; marks it sent
 *   kind 'rfq'       request for quotation to a supplier; marks it sent
 *   kind 'reminder'  a payment reminder; with a pro forma it attaches it again
 *   kind 'general'   plain email, optional files
 *
 * Files the user attached are uploaded to the bm-files bucket first and
 * passed here by path.
 */

export const runtime = 'nodejs'
export const maxDuration = 60

const BUCKET = 'bm-files'
const UUID = /^[0-9a-f-]{36}$/i

interface Body {
  kind: 'proposal' | 'proforma' | 'rfq' | 'reminder' | 'general'
  projectId: string
  relatedId?: string
  to: string
  cc?: string
  bcc?: string
  replyTo?: string
  subject: string
  body: string
  proposal?: { mode: 'issue' | 'resend'; proposalId?: string }
  files?: { path: string; name: string }[]
}

interface Attachment { filename: string; content: Buffer; path?: string }

const LIMIT = { subject: 300, body: 20000 }

export async function POST(req: NextRequest) {
  const ctx = await requireAdmin(req)
  if (!ctx) return NextResponse.json({ error: 'Admins only' }, { status: 403 })
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: 'RESEND_API_KEY is not set on this deployment' }, { status: 500 })

  let b: Body
  try { b = (await req.json()) as Body } catch { return NextResponse.json({ error: 'Bad request' }, { status: 400 }) }
  const to = emailList(b.to)
  const cc = emailList(b.cc)
  const bcc = emailList(b.bcc)
  const replyTo = emailList(b.replyTo)[0] ?? ctx.user.email ?? undefined
  const subject = oneLine(String(b.subject ?? '')).slice(0, LIMIT.subject)
  const text = String(b.body ?? '').slice(0, LIMIT.body)
  if (!UUID.test(b.projectId ?? '')) return NextResponse.json({ error: 'Bad project' }, { status: 400 })
  if (!to.length) return NextResponse.json({ error: 'Add at least one recipient' }, { status: 400 })
  if (!subject) return NextResponse.json({ error: 'Add a subject' }, { status: 400 })
  if (b.relatedId && !UUID.test(b.relatedId)) return NextResponse.json({ error: 'Bad reference' }, { status: 400 })

  try {
    const attachments: Attachment[] = []
    let after: (() => Promise<void>) | null = null
    let relatedId = b.relatedId ?? null

    if (b.kind === 'proposal') {
      const issued = await proposalAttachment(req, ctx, b)
      if ('error' in issued) return NextResponse.json({ error: issued.error }, { status: issued.status })
      attachments.push(issued.attachment)
      after = issued.after
      relatedId = issued.relatedId
    } else if (b.kind === 'proforma' || (b.kind === 'reminder' && relatedId)) {
      // A reminder carries the pro forma again but leaves its status alone.
      if (!relatedId) return NextResponse.json({ error: 'No pro forma' }, { status: 400 })
      const { data: pf } = await ctx.sb.from('bm_proformas').select('id, number, status, project_id').eq('id', relatedId).maybeSingle()
      if (!pf || pf.project_id !== b.projectId) return NextResponse.json({ error: 'Pro forma not found' }, { status: 404 })
      const content = await renderPdf(req, `/admin/print/proforma/${pf.id}`)
      const path = `proformas/${b.projectId}/${safeFileName(pf.number)}.pdf`
      await ctx.sb.storage.from(BUCKET).upload(path, content, { upsert: true, contentType: 'application/pdf' })
      attachments.push({ filename: `${safeFileName(pf.number)}.pdf`, content, path })
      after = async () => {
        await ctx.sb.from('bm_proformas').update({
          pdf_path: path,
          ...(b.kind === 'proforma' && pf.status === 'draft' ? { status: 'sent', sent_at: new Date().toISOString() } : {}),
        }).eq('id', pf.id)
      }
    } else if (b.kind === 'rfq') {
      if (!relatedId) return NextResponse.json({ error: 'No supplier request' }, { status: 400 })
      const { data: rfq } = await ctx.sb.from('bm_rfqs').select('id, status, project_id').eq('id', relatedId).maybeSingle()
      if (!rfq || rfq.project_id !== b.projectId) return NextResponse.json({ error: 'Supplier request not found' }, { status: 404 })
      after = async () => {
        await ctx.sb.from('bm_rfqs').update({
          sent_at: new Date().toISOString(),
          ...(rfq.status === 'draft' ? { status: 'sent' } : {}),
        }).eq('id', rfq.id)
      }
    }

    for (const f of (b.files ?? []).slice(0, 10)) {
      if (typeof f?.path !== 'string' || !f.path.startsWith('uploads/')) continue
      const { data } = await ctx.sb.storage.from(BUCKET).download(f.path)
      if (data) attachments.push({ filename: safeFileName(f.name || f.path.split('/').pop() || 'file'), content: Buffer.from(await data.arrayBuffer()), path: f.path })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: MAIL_FROM,
      to,
      cc: cc.length ? cc : undefined,
      bcc: bcc.length ? bcc : undefined,
      reply_to: replyTo,
      subject,
      text,
      html: emailHtml(text, SITE.url),
      attachments: attachments.map(a => ({ filename: a.filename, content: a.content })),
    })

    await ctx.sb.from('bm_messages').insert({
      project_id: b.projectId,
      kind: b.kind,
      related_id: relatedId,
      from_email: MAIL_FROM,
      reply_to: replyTo ?? null,
      to_emails: to,
      cc_emails: cc,
      bcc_emails: bcc,
      subject,
      body: text,
      attachments: attachments.map(a => ({ name: a.filename, path: a.path })),
      status: error ? 'failed' : 'sent',
      provider_id: data?.id ?? null,
      error: error?.message ?? null,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 502 })
    if (after) await after()
    return NextResponse.json({ ok: true, id: data?.id })
  } catch (e) {
    console.error('[admin/send]', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

/**
 * Issue: give the proposal its number (or the next revision letter if this
 * revision already went out), print it, keep the PDF. Resend: attach the
 * stored PDF of an issued revision. The bm_proposals row and stage change
 * are written only once the email has gone.
 */
async function proposalAttachment(req: NextRequest, ctx: AdminContext, b: Body):
  Promise<{ attachment: Attachment; after: () => Promise<void>; relatedId: string | null } | { error: string; status: number }> {
  if (b.proposal?.mode === 'resend') {
    const pid = b.proposal.proposalId ?? ''
    if (!UUID.test(pid)) return { error: 'Choose the revision to resend', status: 400 }
    const { data: p } = await ctx.sb.from('bm_proposals').select('id, number, revision, pdf_path, project_id').eq('id', pid).maybeSingle()
    if (!p?.pdf_path || p.project_id !== b.projectId) return { error: 'That revision has no stored PDF', status: 404 }
    const { data: file } = await ctx.sb.storage.from(BUCKET).download(p.pdf_path)
    if (!file) return { error: 'Stored PDF is missing', status: 404 }
    return {
      attachment: { filename: `${safeFileName(`${p.number} Rev ${p.revision}`)}.pdf`, content: Buffer.from(await file.arrayBuffer()), path: p.pdf_path },
      after: async () => {},
      relatedId: p.id,
    }
  }

  const { data: row } = await ctx.sb.from('bm_projects').select('id, stage, data, version').eq('id', b.projectId).maybeSingle()
  if (!row) return { error: 'Project not found', status: 404 }
  const data = row.data as Project
  let number = data.meta.proposalNo?.trim() ?? ''
  let revision = data.meta.revision?.trim() || 'A'
  if (!number) {
    const { data: n, error } = await ctx.sb.rpc('bm_next_number', { prefix: 'P' })
    if (error || !n) return { error: error?.message ?? 'No proposal number', status: 500 }
    number = n as string
    revision = 'A'
  } else {
    const { data: existing } = await ctx.sb.from('bm_proposals').select('revision').eq('number', number)
    const used = new Set((existing ?? []).map(r => r.revision as string))
    while (used.has(revision)) revision = nextRevision(revision)
  }

  if (number !== data.meta.proposalNo || revision !== data.meta.revision) {
    data.meta.proposalNo = number
    data.meta.revision = revision
    const { data: saved } = await ctx.sb.from('bm_projects')
      .update({ data, version: row.version + 1 }).eq('id', row.id).eq('version', row.version).select('id')
    if (!saved?.length) return { error: 'The project was changed in another window. Reload it and send again.', status: 409 }
  }

  const content = await renderPdf(req, `/admin/print/proposal/${row.id}`)
  const name = `${number} Rev ${revision}`
  const path = `proposals/${row.id}/${safeFileName(name)}.pdf`
  const up = await ctx.sb.storage.from(BUCKET).upload(path, content, { upsert: true, contentType: 'application/pdf' })
  if (up.error) return { error: `PDF made but not stored: ${up.error.message}`, status: 500 }

  return {
    attachment: { filename: `${safeFileName(name)}.pdf`, content, path },
    relatedId: null,
    after: async () => {
      const now = new Date().toISOString()
      await ctx.sb.from('bm_proposals').update({ status: 'superseded' }).eq('number', number).eq('status', 'sent')
      await ctx.sb.from('bm_proposals').insert({
        project_id: row.id,
        number,
        revision,
        status: 'sent',
        title: data.proposal.title,
        total_usd: contractValue(data),
        valid_until: data.meta.date ? addDaysIso(data.meta.date, data.meta.validityDays || 0) : null,
        snapshot: data,
        pdf_path: path,
        sent_at: now,
      })
      if (row.stage === 'lead' || row.stage === 'proposal') {
        await ctx.sb.from('bm_projects').update({ stage: 'negotiation' }).eq('id', row.id)
      }
    },
  }
}
