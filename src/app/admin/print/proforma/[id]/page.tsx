'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { getProforma, getProject, listParties, listProposals, type PartyRow, type ProformaRow, type ProjectRow, type ProposalRow } from '@/lib/proposals/db'
import { proposalRef } from '@/lib/proposals/deal'
import { BrandMark } from '@/components/proposals/planner/components/BrandMark'
import { useImagesReady } from '@/components/proposals/useImagesReady'
import { money, shortDate } from '@/components/proposals/format'

/* A pro forma as the client receives it. When the client pays another
   company directly (Bart Mining acting for it), this is a payment request
   naming that company and carrying its bank details. */
export default function ProformaPrint() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<{ pf: ProformaRow; row: ProjectRow; parties: PartyRow[]; proposals: ProposalRow[] } | null | undefined>(undefined)
  useEffect(() => {
    (async () => {
      const pf = await getProforma(id)
      if (!pf) { setData(null); return }
      const [row, parties, proposals] = await Promise.all([getProject(pf.project_id), listParties(), listProposals(pf.project_id)])
      setData(row ? { pf, row, parties, proposals } : null)
    })()
  }, [id])
  const ref = useRef<HTMLDivElement>(null)
  const ready = useImagesReady(ref, !!data)
  useEffect(() => { if (data) document.title = data.pf.number }, [data])

  if (data === null) return <p className="bm-print-msg">Pro forma not found, or this account can&apos;t open it.</p>
  if (!data) return <div ref={ref} />

  const { pf, row, parties, proposals } = data
  const self = parties.find(p => p.kind === 'self')
  const client = parties.find(p => p.id === row.client_id)
  const payee = pf.payee_id ? parties.find(p => p.id === pf.payee_id) : self
  const onBehalf = !!pf.payee_id
  const meta = row.data.meta
  const milestone = row.data.paymentSchedule?.find(m => m.id === pf.milestone_key)
  // The revision the client accepted, else the last one sent; never an unsent draft.
  const issued = proposals.find(p => p.status === 'accepted') ?? proposals.find(p => p.status === 'sent') ?? proposals[0]
  const ref_ = issued ? proposalRef(issued.number, issued.revision) : ''
  // In the page margin, so it sits at the foot of the page however long the body runs.
  const footer = `Bart Mining · ${self?.address || 'Dar es Salaam'}, ${self?.country || 'Tanzania'} · ${self?.phone || '+255 759 141 705'} · ${self?.email || 'hello@bartmining.com'} · bartmining.com${self?.tax_id ? ` · TIN ${self.tax_id}` : ''}`

  return (
    <div ref={ref} className="pp pp-print" {...(ready ? { 'data-print-ready': '' } : {})}>
      <style>{`@page {
  @top-left { content: none; } @top-right { content: none; } @bottom-right { content: none; }
  @bottom-left { content: ${cssString(footer)}; }
}`}</style>
      <article className="doc pf">
        <div className="doc-masthead">
          <div className="doc-brand">
            <BrandMark size={44} />
            <div>
              <div className="doc-brand-name">Bart Mining</div>
              <div className="doc-brand-line">Mining equipment, plant and services</div>
            </div>
          </div>
          <div className="doc-ref">
            <span>{onBehalf ? 'Payment request' : 'Pro forma invoice'}</span>
            <strong>{pf.number}</strong>
          </div>
        </div>

        {onBehalf && (
          <p className="pf-behalf">
            Issued by Bart Mining on behalf of {(payee?.name ?? 'the supplier').replace(/\.$/, '')}. Please pay {payee?.name ?? 'the supplier'} directly, to the account below.
          </p>
        )}

        <dl className="doc-meta">
          <div><dt>Date</dt><dd>{shortDate(pf.issued_on)}</dd></div>
          {pf.due_date && <div><dt>Payment due</dt><dd>{shortDate(pf.due_date)}</dd></div>}
          {ref_ && <div><dt>Proposal</dt><dd>{ref_}</dd></div>}
          <div><dt>Project</dt><dd>{row.data.proposal.title || meta.name}</dd></div>
        </dl>

        <div className="two pf-parties">
          <div>
            <h3>Bill to</h3>
            <Party p={client} fallback={meta.client || 'Client'} />
          </div>
          <div>
            <h3>Payable to</h3>
            <Party p={payee} fallback="Bart Mining" />
          </div>
        </div>

        <table className="doc-table pf-lines">
          <thead><tr><th>Description</th><th className="n">Amount ({pf.currency})</th></tr></thead>
          <tbody>
            <tr>
              <td>
                <strong>{pf.description}</strong>
                {milestone?.trigger && <div className="doc-sub">{milestone.trigger}</div>}
                {meta.site && <div className="doc-sub">Site: {meta.site}</div>}
              </td>
              <td className="n">{money(pf.amount, pf.currency)}</td>
            </tr>
            <tr className="total"><td>Total due</td><td className="n">{money(pf.amount, pf.currency)}</td></tr>
          </tbody>
        </table>

        <section className="pf-bank">
          <h3>Payment details</h3>
          {payee?.bank_details
            ? <pre>{payee.bank_details}</pre>
            : <p>Bank details follow separately.</p>}
          <p className="small">Please quote {pf.number} as the payment reference, and send the transfer confirmation to {self?.email ?? 'hello@bartmining.com'}.</p>
        </section>

        {pf.notes && <section className="pf-notes"><h3>Notes</h3><p>{pf.notes}</p></section>}

      </article>
    </div>
  )
}

const cssString = (v: string) => `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\r\n]+/g, ' ')}"`

function Party({ p, fallback }: { p?: PartyRow | null; fallback: string }) {
  if (!p) return <p><strong>{fallback}</strong></p>
  return (
    <p>
      <strong>{p.name}</strong>
      {p.contact_name && <><br />{p.contact_name}</>}
      {p.address && <><br />{p.address}</>}
      {p.country && <><br />{p.country}</>}
      {p.tax_id && <><br />TIN {p.tax_id}</>}
      {p.email && <><br />{p.email}</>}
    </p>
  )
}
