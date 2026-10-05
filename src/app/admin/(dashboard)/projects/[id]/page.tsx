'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppContext } from '@/lib/goldpass/AppContext'
import { notify } from '@/lib/goldpass/notify'
import { confirmDialog } from '@/lib/goldpass/confirm'
import {
  deleteProject, listMessages, listParties, listPayments, listProformas, listProposals, listRfqs, updateProject,
  type MessageRow, type PartyRow, type PaymentRow, type ProposalRow, type RfqRow,
} from '@/lib/proposals/db'
import { DEAL_TYPES, STAGES, type DealType, type Stage } from '@/lib/proposals/deal'
import { projectModel } from '@/lib/proposals/model'
import { proformaViews, type ProformaView } from '@/lib/proposals/tracking'
import { useProjectDoc, type SaveState } from '@/components/proposals/useProjectDoc'
import { useLocal } from '@/components/proposals/planner/store'
import { Overview } from '@/components/proposals/planner/views/Overview'
import { Budget } from '@/components/proposals/planner/views/Budget'
import { Expenses } from '@/components/proposals/planner/views/Expenses'
import { Schedule } from '@/components/proposals/planner/views/Schedule'
import { Cashflow } from '@/components/proposals/planner/views/Cashflow'
import { Plant } from '@/components/proposals/planner/views/Plant'
import { Proposal } from '@/components/proposals/planner/views/Proposal'
import { ProposalActions } from '@/components/proposals/ProposalActions'
import { SuppliersTab } from '@/components/proposals/SuppliersTab'
import { PaymentsTab } from '@/components/proposals/PaymentsTab'
import { EmailsTab } from '@/components/proposals/EmailsTab'
import { EmailComposer, type ComposeRequest } from '@/components/proposals/EmailComposer'
import { PartyModal, PartySelect } from '@/components/proposals/Parties'
import { money } from '@/components/proposals/format'
import { contractValue } from '@/lib/proposals/deal'

/* One project: the planner's tabs for the plant and its costs, the
   proposal, and the deal itself (supplier quotes, payments, email). */

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'budget', label: 'Budget' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'cashflow', label: 'Cashflow' },
  { id: 'plant', label: 'Plant' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'suppliers', label: 'Suppliers' },
  { id: 'payments', label: 'Payments' },
  { id: 'emails', label: 'Emails' },
] as const
type Tab = (typeof TABS)[number]['id']

const SAVE_TEXT: Record<SaveState, string> = {
  saved: 'Saved',
  saving: 'Saving…',
  unsaved: 'Unsaved',
  error: 'Not saved',
  conflict: 'Changed in another window. Reload before editing.',
}

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const me = useAppContext()?.user?.email ?? ''
  const { row, project, error, save, update, flush, reload, setRow } = useProjectDoc(id)
  const model = useMemo(() => (project ? projectModel(project) : null), [project])
  const [tab, setTab] = useLocal<Tab>('project-tab', 'overview')

  const [parties, setParties] = useState<PartyRow[]>([])
  const [proposals, setProposals] = useState<ProposalRow[]>([])
  const [rfqs, setRfqs] = useState<RfqRow[]>([])
  const [proformas, setProformas] = useState<ProformaView[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [composing, setComposing] = useState<ComposeRequest | null>(null)
  const [newParty, setNewParty] = useState<'client' | 'principal' | null>(null)

  const loadDeal = useCallback(async () => {
    const [pa, ps, rq, pf, pm, ms] = await Promise.all([
      listParties(), listProposals(id), listRfqs(id), listProformas(id), listPayments(id), listMessages(id),
    ])
    setParties(pa); setProposals(ps); setRfqs(rq); setProformas(proformaViews(pf, pm)); setPayments(pm); setMessages(ms)
  }, [id])
  useEffect(() => { loadDeal() }, [loadDeal])

  const client = parties.find(p => p.id === row?.client_id)

  async function setField(fields: Parameters<typeof updateProject>[1]) {
    if (!row) return
    if (await updateProject(row.id, fields)) setRow({ ...row, ...fields })
  }

  async function setClient(cid: string | null, party?: PartyRow) {
    await setField({ client_id: cid })
    const p = party ?? parties.find(x => x.id === cid)
    if (p) update(d => { d.meta.client = p.name })
  }

  async function remove() {
    if (!row) return
    if (!(await confirmDialog(`Delete ${row.name}?\n\nIts proposals, supplier requests, pro formas, payments and email log are deleted with it. This can't be undone.`))) return
    if (await deleteProject(row.id)) { notify('success', 'Project deleted.'); router.push('/admin/projects') }
  }

  if (error) return <div className="content"><div className="content-pad"><div className="card">{error}</div></div></div>
  if (!row || !project || !model) return <div className="content"><div className="content-pad page-sub">Loading project…</div></div>

  const value = contractValue(project)
  const view = { project, model, update }

  return (
    <div className="content">
      <div className="content-pad bm-page">
        <div className="bm-project-head">
          <button className="btn-text" onClick={() => router.push('/admin/projects')}>← Projects</button>
          <div className="bm-project-title">
            <div className="page-title">{project.meta.name || row.name}</div>
            <div className="page-sub">{client?.name ?? 'No client yet'}{value ? ` · ${money(value)} contract` : ''}</div>
          </div>
          <div className={`bm-save bm-save-${save}`}>{SAVE_TEXT[save]}{save === 'conflict' && <button className="btn-text btn-text-accent" onClick={reload}>Reload</button>}</div>
        </div>

        <div className="bm-deal">
          <label><span>Stage</span>
            <select className="input input-sm" value={row.stage} onChange={e => setField({ stage: e.target.value as Stage })}>
              {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
          <label><span>Client</span>
            <PartySelect className="input input-sm" parties={parties} kinds={['client']} value={row.client_id} onChange={setClient} onNew={() => setNewParty('client')} empty="None yet" />
          </label>
          <label><span>Deal</span>
            <select className="input input-sm" value={row.deal_type} onChange={e => setField({ deal_type: e.target.value as DealType })}>
              {DEAL_TYPES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
          </label>
          {row.deal_type !== 'direct' && (
            <label><span>Acting for</span>
              <PartySelect className="input input-sm" parties={parties} kinds={['principal', 'supplier']} value={row.principal_id} onChange={v => setField({ principal_id: v })} onNew={() => setNewParty('principal')} empty="Choose…" />
            </label>
          )}
          <button className="btn-text btn-text-danger bm-delete" onClick={remove}>Delete project</button>
        </div>

        <div className="bm-tabs" role="tablist">
          {TABS.map(t => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
              {t.label}
              {t.id === 'payments' && proformas.some(p => p.state === 'overdue') && <span className="bm-dot" />}
            </button>
          ))}
        </div>

        <div className="pp bm-pp">
          {tab === 'overview' && <Overview {...view} />}
          {tab === 'budget' && <Budget {...view} />}
          {tab === 'expenses' && <Expenses {...view} />}
          {tab === 'schedule' && <Schedule {...view} />}
          {tab === 'cashflow' && <Cashflow {...view} />}
          {tab === 'plant' && <Plant project={project} model={model} />}
          {tab === 'proposal' && (
            <Proposal {...view} actions={
              <ProposalActions row={row} project={project} update={update} flush={flush} proposals={proposals} client={client}
                compose={setComposing} reload={() => { reload(); loadDeal() }} />
            } />
          )}
        </div>
        {tab === 'suppliers' && (
          <SuppliersTab row={row} project={project} update={update} parties={parties} setParties={setParties} rfqs={rfqs}
            reload={loadDeal} compose={setComposing} me={me} />
        )}
        {tab === 'payments' && (
          <PaymentsTab row={row} project={project} model={model} update={update} parties={parties} proformas={proformas}
            payments={payments} reload={loadDeal} compose={setComposing} client={client} />
        )}
        {tab === 'emails' && <EmailsTab row={row} project={project} messages={messages} client={client} compose={setComposing} />}
      </div>

      {composing && (
        <EmailComposer req={composing} me={me} onClose={() => setComposing(null)}
          onSent={() => { if (composing.kind === 'proposal') reload(); loadDeal() }} />
      )}
      {newParty && (
        <PartyModal kind={newParty} onClose={() => setNewParty(null)} onSaved={p => {
          setParties(ps => [...ps, p])
          if (newParty === 'client') setClient(p.id, p)
          else setField({ principal_id: p.id })
        }} />
      )}
    </div>
  )
}
