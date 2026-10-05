import { NextRequest, NextResponse } from 'next/server'
import { renderPdf, requireAdmin, safeFileName } from '@/lib/proposals/server'

/**
 * PDF download for the Projects tab.
 *   ?kind=proposal&id=<project id>             the proposal as it stands now
 *   ?kind=issued&id=<bm_proposals id>          the PDF that was sent, unchanged
 *   ?kind=proforma&id=<bm_proformas id>        a pro forma
 * Admins only. Drafts are printed by Chrome from the same print page the
 * email attachment uses, so the download is the layout the client gets.
 */

export const runtime = 'nodejs'
export const maxDuration = 60

const pdf = (body: Buffer | Blob, name: string) =>
  new NextResponse(body as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeFileName(name)}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })

export async function GET(req: NextRequest) {
  const ctx = await requireAdmin(req)
  if (!ctx) return NextResponse.json({ error: 'Admins only' }, { status: 403 })
  const kind = req.nextUrl.searchParams.get('kind')
  const id = req.nextUrl.searchParams.get('id') ?? ''
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Bad id' }, { status: 400 })

  try {
    if (kind === 'issued') {
      const { data: p } = await ctx.sb.from('bm_proposals').select('number, revision, pdf_path').eq('id', id).maybeSingle()
      if (!p?.pdf_path) return NextResponse.json({ error: 'No stored PDF for that proposal' }, { status: 404 })
      const { data: file, error } = await ctx.sb.storage.from('bm-files').download(p.pdf_path)
      if (error || !file) return NextResponse.json({ error: error?.message ?? 'Missing file' }, { status: 404 })
      return pdf(file, `${p.number} Rev ${p.revision}`)
    }
    if (kind === 'proposal') {
      const { data: row } = await ctx.sb.from('bm_projects').select('name, data->meta').eq('id', id).maybeSingle()
      if (!row) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      const meta = (row as { meta?: { proposalNo?: string; revision?: string } }).meta ?? {}
      const name = meta.proposalNo ? `${meta.proposalNo} Rev ${meta.revision ?? 'A'} DRAFT` : `${row.name} proposal DRAFT`
      return pdf(await renderPdf(req, `/admin/print/proposal/${id}`), name)
    }
    if (kind === 'proforma') {
      const { data: pf } = await ctx.sb.from('bm_proformas').select('number').eq('id', id).maybeSingle()
      if (!pf) return NextResponse.json({ error: 'Pro forma not found' }, { status: 404 })
      return pdf(await renderPdf(req, `/admin/print/proforma/${id}`), pf.number)
    }
    return NextResponse.json({ error: 'Unknown kind' }, { status: 400 })
  } catch (e) {
    console.error('[admin/pdf]', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
