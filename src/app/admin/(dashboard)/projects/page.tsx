'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/goldpass/Modal'
import { notify } from '@/lib/goldpass/notify'
import { confirmDialog } from '@/lib/goldpass/confirm'
import {
  createProject, deleteParty, getProject, listParties, listPayments, listProformas, listProjects, listProposals, listRfqs, noteNumber,
  type PartyRow, type PaymentRow, type ProjectCard, type ProposalRow, type RfqRow,
} from '@/lib/proposals/db'
import { contractValue, dealTypeLabel, isoToday, proposalRef, STAGES, type Stage } from '@/lib/proposals/deal'
import { proformaViews, tracking, type ProformaView, type Tracking } from '@/lib/proposals/tracking'
import { blankProject } from '@/lib/proposals/blank'
import type { Project } from '@/lib/proposals/types'
import { KIND_LABEL, PartyModal, PartySelect } from '@/components/proposals/Parties'
import { ago, money, moneyShort, shortDate } from '@/components/proposals/format'

/* Projects: every project as a card, from first enquiry to final payment,
   with the sales and payment figures across all of them at the top. */

const BOARD: Stage[] = ['lead', 'proposal', 'negotiation', 'won', 'delivery', 'completed']

export default function ProjectsPage() {
  const router = useRouter()
  const [view, setView] = useState<'board' | 'contacts'>('board')
  const [projects, setProjects] = useState<ProjectCard[]>([])
  const [parties, setParties] = useState<PartyRow[]>([])
  const [proposals, setProposals] = useState<ProposalRow[]>([])
  const [proformas, setProformas] = useState<ProformaView[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [rfqs, setRfqs] = useState<RfqRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showLost, setShowLost] = useState(false)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    const [pr, pa, ps, pf, pm, rq] = await Promise.all([listProjects(), listParties(), listProposals(), listProformas(), listPayments(), listRfqs()])
    setProjects(pr); setParties(pa); setProposals(ps); setProformas(proformaViews(pf, pm)); setPayments(pm); setRfqs(rq)
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const t = useMemo(() => tracking(projects, proposals, proformas, payments), [projects, proposals, proformas, payments])
  const live = projects.filter(p => !p.archived)
  const lost = live.filter(p => p.stage === 'lost')

  return (
    <div className="content">
      <div className="content-pad bm-page">
        <div className="bm-head">
          <div>
            <div className="page-title">Projects</div>
            <div className="page-sub">Every project from first enquiry to final payment. Proposals, supplier requests and pro formas are sent from each project.</div>
          </div>
          <div className="bm-head-actions">
            <div className="seg">
              <button className={`seg-btn${view === 'board' ? ' active' : ''}`} onClick={() => setView('board')}>Board</button>
              <button className={`seg-btn${view === 'contacts' ? ' active' : ''}`} onClick={() => setView('contacts')}>Contacts</button>
            </div>
            <button className="btn btn-primary" onClick={() => setCreating(true)}>New project</button>
          </div>
        </div>

        <TrackingStrip t={t} />

        {view === 'board' ? (
          <>
            <div className="bm-board">
              {BOARD.map(stage => {
                const cards = live.filter(p => p.stage === stage)
                const meta = STAGES.find(s => s.id === stage)!
                return (
                  <div className="bm-col" key={stage}>
                    <div className="bm-col-head">
                      <span>{meta.label}</span>
                      <span className="bm-col-count">{cards.length}{cards.length > 0 && ` · ${moneyShort(cards.reduce((a, c) => a + c.value_usd, 0))}`}</span>
                    </div>
                    {cards.map(p => (
                      <ProjectCardView key={p.id} p={p} parties={parties} proposals={proposals} proformas={proformas} rfqs={rfqs}
                        onOpen={() => router.push(`/admin/projects/${p.id}`)} />
                    ))}
                    {!loading && cards.length === 0 && <div className="bm-col-empty">None</div>}
                  </div>
                )
              })}
            </div>
            {lost.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <button className="btn-text" onClick={() => setShowLost(s => !s)}>{showLost ? 'Hide' : 'Show'} lost projects ({lost.length})</button>
                {showLost && (
                  <div className="grid-cards" style={{ marginTop: 10 }}>
                    {lost.map(p => (
                      <ProjectCardView key={p.id} p={p} parties={parties} proposals={proposals} proformas={proformas} rfqs={rfqs}
                        onOpen={() => router.push(`/admin/projects/${p.id}`)} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {!loading && live.length === 0 && (
              <div className="card bm-empty">
                <div className="section-title">No projects yet</div>
                <p>Start one from the washing and sluice template, or bring in a file from the local Plant Planner (projects/plant-planner/data) with New project.</p>
              </div>
            )}
          </>
        ) : (
          <Contacts parties={parties} reload={load} />
        )}
      </div>

      {creating && (
        <NewProjectModal projects={live} parties={parties} onClose={() => setCreating(false)}
          onPartySaved={p => setParties(ps => [...ps.filter(x => x.id !== p.id), p])}
          onCreated={id => router.push(`/admin/projects/${id}`)} />
      )}
    </div>
  )
}

function TrackingStrip({ t }: { t: Tracking }) {
  const tiles = [
    { label: `Proposals sent, ${t.year}`, value: String(t.proposals.numbers), sub: `${t.proposals.revisions} issue${t.proposals.revisions === 1 ? '' : 's'} including revisions` },
    { label: 'Open proposals', value: moneyShort(t.open.value), sub: `${t.open.count} waiting for an answer` },
    { label: 'Sales won', value: moneyShort(t.sales.value), sub: `${t.sales.count} project${t.sales.count === 1 ? '' : 's'}${t.winRate !== null ? ` · ${Math.round(t.winRate * 100)}% win rate` : ''}` },
    { label: 'Pro formas pending', value: moneyShort(t.pending.value), sub: `${t.pending.count} not yet confirmed` },
    { label: 'Awaiting payment', value: moneyShort(t.awaiting.value), sub: `${t.awaiting.count} confirmed, not fully paid` },
    { label: 'Overdue', value: moneyShort(t.overdue.value), sub: `${t.overdue.count} past due date`, alert: t.overdue.count > 0 },
    { label: 'Received this month', value: moneyShort(t.received.month), sub: `${moneyShort(t.received.year)} this year` },
  ]
  return (
    <div className="bm-tiles">
      {tiles.map(x => (
        <div key={x.label} className={`card bm-tile${x.alert ? ' alert' : ''}`}>
          <div className="section-label">{x.label}</div>
          <div className="stat-value-sm">{x.value}</div>
          <div className="bm-tile-sub">{x.sub}</div>
        </div>
      ))}
    </div>
  )
}

function ProjectCardView({ p, parties, proposals, proformas, rfqs, onOpen }: {
  p: ProjectCard; parties: PartyRow[]; proposals: ProposalRow[]; proformas: ProformaView[]; rfqs: RfqRow[]; onOpen: () => void
}) {
  const client = parties.find(x => x.id === p.client_id)
  const last = proposals.find(x => x.project_id === p.id)
  const mine = proformas.filter(x => x.project_id === p.id)
  const overdue = mine.filter(x => x.state === 'overdue').reduce((a, x) => a + x.outstanding, 0)
  const awaiting = mine.filter(x => x.state === 'confirmed' || x.state === 'part_paid').reduce((a, x) => a + x.outstanding, 0)
  const pending = mine.filter(x => x.state === 'draft' || x.state === 'sent').reduce((a, x) => a + x.outstanding, 0)
  const quotes = rfqs.filter(r => r.project_id === p.id)
  const quoted = quotes.filter(r => r.status === 'quoted' || r.status === 'accepted').length
  const ref = proposalRef(p.meta?.proposalNo, p.meta?.revision)
  return (
    <div className="card card-link bm-card" onClick={onOpen} role="link" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') onOpen() }}>
      <div className="bm-card-name">{p.meta?.name || p.name}</div>
      <div className="bm-card-client">
        {client?.name ?? p.meta?.client ?? 'No client yet'}
        {p.deal_type !== 'direct' && <span className="badge badge-purple" style={{ marginLeft: 6 }}>{dealTypeLabel(p.deal_type)}</span>}
      </div>
      <div className="bm-card-value num">{p.value_usd ? money(p.value_usd) : '–'}</div>
      {(ref || last) && (
        <div className="bm-card-line">
          {last ? `${last.number} Rev ${last.revision} · ${last.status === 'sent' ? `sent ${shortDate(last.sent_at)}` : last.status}` : `${ref} · not sent`}
        </div>
      )}
      <div className="bm-chips">
        {overdue > 0 && <span className="badge badge-red">{moneyShort(overdue)} overdue</span>}
        {awaiting > 0 && <span className="badge badge-orange">{moneyShort(awaiting)} awaiting payment</span>}
        {pending > 0 && <span className="badge badge-gray">{moneyShort(pending)} pro forma pending</span>}
        {quotes.length > 0 && <span className="badge badge-blue">{quoted}/{quotes.length} quotes in</span>}
      </div>
      <div className="bm-card-foot">Updated {ago(p.updated_at)}</div>
    </div>
  )
}

function NewProjectModal({ projects, parties, onClose, onCreated, onPartySaved }: {
  projects: ProjectCard[]
  parties: PartyRow[]
  onClose: () => void
  onCreated: (id: string) => void
  onPartySaved: (p: PartyRow) => void
}) {
  const [name, setName] = useState('')
  const [clientId, setClientId] = useState<string | null>(null)
  const [from, setFrom] = useState<'blank' | 'copy' | 'file'>('blank')
  const [copyId, setCopyId] = useState(projects[0]?.id ?? '')
  const [file, setFile] = useState<Project | null>(null)
  const [busy, setBusy] = useState(false)
  const [newParty, setNewParty] = useState(false)

  async function readFile(f: File | undefined) {
    if (!f) { setFile(null); return }
    try {
      const p = JSON.parse(await f.text()) as Project
      if (!p?.meta || !Array.isArray(p.packages) || !p.proposal || !p.inputs) throw new Error('not a planner project file')
      setFile(p)
      if (!name) setName(p.meta.name)
    } catch (e) {
      notify('error', `That file can't be used: ${e instanceof Error ? e.message : String(e)}`)
      setFile(null)
    }
  }

  async function create() {
    if (!name.trim()) { notify('warn', 'Give the project a name.'); return }
    setBusy(true)
    let data: Project | null = null
    if (from === 'blank') data = blankProject(name.trim(), isoToday())
    if (from === 'file') data = file
    if (from === 'copy') {
      const src = await getProject(copyId)
      if (src) {
        data = structuredClone(src.data)
        data.meta.proposalNo = undefined
        data.meta.revision = undefined
        data.meta.date = isoToday()
        data.expenses = []
        data.selectedPackageId = undefined
      }
    }
    if (!data) { setBusy(false); notify('warn', from === 'file' ? 'Choose a planner file.' : 'Choose a project to copy.'); return }
    data.meta.name = name.trim()
    const client = parties.find(p => p.id === clientId)
    if (client) data.meta.client = client.name
    if (from === 'file' && data.meta.proposalNo) await noteNumber(data.meta.proposalNo)
    const id = await createProject({
      name: data.meta.name,
      data,
      client_id: clientId,
      stage: from === 'file' && data.meta.proposalNo ? 'proposal' : 'lead',
      value_usd: contractValue(data),
    })
    setBusy(false)
    if (id) { notify('success', 'Project created.'); onCreated(id) }
  }

  return (
    <>
      <Modal title="New project" onClose={onClose}>
        <div className="bm-form">
          <label><span>Project name</span><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="150 m³/h washing and sluice plant, Chunya" /></label>
          <label><span>Client</span>
            <PartySelect parties={parties} kinds={['client']} value={clientId} onChange={setClientId} onNew={() => setNewParty(true)} empty="Add later" />
          </label>
          <div className="bm-radio">
            <span>Start from</span>
            <label><input type="radio" checked={from === 'blank'} onChange={() => setFrom('blank')} /> Washing and sluice template, without prices</label>
            <label><input type="radio" checked={from === 'copy'} onChange={() => setFrom('copy')} disabled={!projects.length} /> A copy of another project, with its prices</label>
            {from === 'copy' && (
              <select className="input" value={copyId} onChange={e => setCopyId(e.target.value)}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.meta?.name || p.name}</option>)}
              </select>
            )}
            <label><input type="radio" checked={from === 'file'} onChange={() => setFrom('file')} /> A file from the local Plant Planner</label>
            {from === 'file' && <input type="file" accept="application/json,.json" onChange={e => readFile(e.target.files?.[0])} />}
          </div>
          <div className="bm-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={create} disabled={busy}>{busy ? 'Creating…' : 'Create project'}</button>
          </div>
        </div>
      </Modal>
      {newParty && <PartyModal kind="client" onClose={() => setNewParty(false)} onSaved={p => { onPartySaved(p); setClientId(p.id) }} />}
    </>
  )
}

function Contacts({ parties, reload }: { parties: PartyRow[]; reload: () => void }) {
  const [editing, setEditing] = useState<PartyRow | null | 'new'>(null)
  const self = parties.find(p => p.kind === 'self')
  const others = parties.filter(p => p.kind !== 'self').sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name))

  async function remove(p: PartyRow) {
    if (!(await confirmDialog(`Delete ${p.name}? Projects and pro formas that name it keep their own copy of the name.`))) return
    if (await deleteParty(p.id)) { notify('success', `${p.name} deleted.`); reload() }
  }

  return (
    <div className="bm-contacts">
      {self && (
        <div className="card bm-self">
          <div>
            <div className="section-title">Bart Mining on pro formas</div>
            <div className="page-sub">{self.bank_details ? 'Bank details are set and print on pro formas paid to Bart Mining.' : 'Add Bart Mining’s bank details: they print on every pro forma paid to Bart Mining.'}</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(self)}>Edit details</button>
        </div>
      )}
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <div className="bm-table-head">
          <div className="section-title" style={{ margin: 0 }}>Clients, suppliers and companies we act for</div>
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing('new')}>Add contact</button>
        </div>
        <table className="tbl tbl-card">
          <thead><tr><th>Company</th><th>Type</th><th>Contact</th><th>Email</th><th>Phone</th><th /></tr></thead>
          <tbody>
            {others.map(p => (
              <tr key={p.id}>
                <td data-label="Company"><strong>{p.name}</strong></td>
                <td data-label="Type">{KIND_LABEL[p.kind]}</td>
                <td data-label="Contact">{p.contact_name ?? '–'}</td>
                <td data-label="Email">{p.email ?? '–'}</td>
                <td data-label="Phone">{p.phone ?? '–'}</td>
                <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <button className="btn-text btn-text-accent" onClick={() => setEditing(p)}>Edit</button>
                  <button className="btn-text btn-text-danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
            {others.length === 0 && <tr><td colSpan={6} style={{ color: 'var(--label-3)' }}>No contacts yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {editing && (
        <PartyModal party={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => reload()} />
      )}
    </div>
  )
}
