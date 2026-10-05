// Deal-level logic shared by the Projects board, the project page and the
// proposal: what the client pays, to whom and when, and where each deal stands.

import { projectModel, type PackageModel } from './model'
import type { PaymentMilestone, Project } from './types'

// ── Stages ──────────────────────────────────────────────────────────────────

export type Stage = 'lead' | 'proposal' | 'negotiation' | 'won' | 'delivery' | 'completed' | 'lost'
export type DealType = 'direct' | 'agent' | 'mixed'

export const STAGES: { id: Stage; label: string; lane: 'sales' | 'delivery' | 'closed' }[] = [
  { id: 'lead', label: 'Lead', lane: 'sales' },
  { id: 'proposal', label: 'Preparing proposal', lane: 'sales' },
  { id: 'negotiation', label: 'Proposal sent', lane: 'sales' },
  { id: 'won', label: 'Won', lane: 'delivery' },
  { id: 'delivery', label: 'In delivery', lane: 'delivery' },
  { id: 'completed', label: 'Completed', lane: 'closed' },
  { id: 'lost', label: 'Lost', lane: 'closed' },
]
export const stageLabel = (s: string) => STAGES.find(x => x.id === s)?.label ?? s

export const DEAL_TYPES: { id: DealType; label: string; hint: string }[] = [
  { id: 'direct', label: 'Bart Mining sells', hint: 'The client contracts with and pays Bart Mining.' },
  { id: 'agent', label: 'For another company', hint: 'The client pays the company Bart Mining acts for; Bart Mining earns a commission or fee.' },
  { id: 'mixed', label: 'Mixed', hint: 'Part is paid to another company (often the equipment), part to Bart Mining.' },
]
export const dealTypeLabel = (d: string) => DEAL_TYPES.find(x => x.id === d)?.label ?? d

// ── Contract value ──────────────────────────────────────────────────────────

/** The option the deal is priced on: the one chosen, else the first in the proposal. */
export function dealPackageId(project: Project): string | undefined {
  const ids = project.packages.map(p => p.id)
  if (project.selectedPackageId && ids.includes(project.selectedPackageId)) return project.selectedPackageId
  return project.proposal.packageIds.find(id => ids.includes(id)) ?? project.packages.find(p => !p.isExpansion)?.id
}

/** Client contract value of the deal option, for the board and tracking. */
export function contractValue(project: Project): number {
  const id = dealPackageId(project)
  if (!id) return 0
  const m = projectModel(project).byId.get(id)
  return m ? Math.round(m.contract * 100) / 100 : 0
}

// ── Payment schedule ────────────────────────────────────────────────────────

/** The figures a milestone's percentage can be taken of, for one option. */
export interface PriceBase { contract: number; equipment: number; services: number }

export const priceBase = (m: Pick<PackageModel, 'contract' | 'clientEquipment' | 'servicesBilled'>): PriceBase =>
  ({ contract: m.contract, equipment: m.clientEquipment, services: m.servicesBilled })

export const OF_LABEL: Record<NonNullable<PaymentMilestone['of']>, string> = {
  contract: 'of the balance',
  equipment: 'of the equipment price',
  services: 'of the services price',
}

/**
 * Amount of one milestone. Percent of the contract is a share of the balance:
 * the contract less the fixed client milestones (a fee paid on signing, say),
 * so fixed and percentage rows together come to the contract.
 */
export function milestoneAmount(m: PaymentMilestone, schedule: PaymentMilestone[], base: PriceBase): number {
  if (m.basis === 'fixed') return m.value
  const of = m.of ?? 'contract'
  if (of === 'equipment') return m.value * base.equipment
  if (of === 'services') return m.value * base.services
  if (m.internal) return m.value * base.contract
  const fixed = schedule.filter(x => !x.internal && x.basis === 'fixed').reduce((a, x) => a + x.value, 0)
  return m.value * Math.max(0, base.contract - fixed)
}

/** Client milestones' total against the contract, to flag a schedule that doesn't add up. */
export function scheduleCheck(schedule: PaymentMilestone[], base: PriceBase) {
  const client = schedule.filter(m => !m.internal)
  const total = client.reduce((a, m) => a + milestoneAmount(m, schedule, base), 0)
  return { total, gap: base.contract - total }
}

const id = () => Math.random().toString(36).slice(2, 9)

/** Starting points for the schedule builder. Every row stays editable. */
export function schedulePreset(kind: DealType, project: Project, principal?: { id: string; name: string }): PaymentMilestone[] {
  const t = project.inputs.clientTerms
  const fee = project.inputs.pmFee
  const bart = { payeeId: '', payeeName: 'Bart Mining' }
  const them = { payeeId: principal?.id ?? '', payeeName: principal?.name ?? 'Bart Mining' }
  const signing: PaymentMilestone[] = fee > 0
    ? [{ id: id(), label: 'Project management fee', trigger: 'On signing', ...bart, basis: 'fixed', value: fee, dueDays: 7 }]
    : []
  if (kind === 'direct') {
    return [
      ...signing,
      { id: id(), label: 'Down-payment', trigger: 'On confirmation of the project scope', ...bart, basis: 'percent', of: 'contract', value: t.deposit, dueDays: 7 },
      { id: id(), label: 'Shipment payment', trigger: 'Against the bill of lading', ...bart, basis: 'percent', of: 'contract', value: t.bl, dueDays: 7 },
      { id: id(), label: 'Final payment', trigger: 'After the commissioning certificate', ...bart, basis: 'percent', of: 'contract', value: t.final, dueDays: 14 },
    ]
  }
  if (kind === 'agent') {
    return [
      { id: id(), label: 'Deposit', trigger: 'On order', ...them, basis: 'percent', of: 'contract', value: 0.3, dueDays: 7 },
      { id: id(), label: 'Balance', trigger: 'Before shipment', ...them, basis: 'percent', of: 'contract', value: 0.7, dueDays: 7 },
      { id: id(), label: 'Commission', trigger: 'When the client’s deposit is received', ...bart, basis: 'percent', of: 'contract', value: project.inputs.commission, dueDays: 14, internal: true },
    ]
  }
  // The project management fee sits inside the services price here, so it isn't a row of its own.
  return [
    { id: id(), label: 'Equipment deposit', trigger: 'On order', ...them, basis: 'percent', of: 'equipment', value: 0.3, dueDays: 7 },
    { id: id(), label: 'Equipment balance', trigger: 'Before shipment', ...them, basis: 'percent', of: 'equipment', value: 0.7, dueDays: 7 },
    { id: id(), label: 'Services, mobilisation', trigger: 'When the equipment arrives in Dar es Salaam', ...bart, basis: 'percent', of: 'services', value: 0.5, dueDays: 7 },
    { id: id(), label: 'Services, completion', trigger: 'After the commissioning certificate', ...bart, basis: 'percent', of: 'services', value: 0.5, dueDays: 14 },
  ]
}

export const newMilestone = (): PaymentMilestone =>
  ({ id: id(), label: '', trigger: '', payeeId: '', payeeName: 'Bart Mining', basis: 'percent', of: 'contract', value: 0, dueDays: 7 })

// ── Pro formas and payments ─────────────────────────────────────────────────

export type ProformaState = 'draft' | 'sent' | 'confirmed' | 'part_paid' | 'paid' | 'overdue' | 'cancelled'

export const PROFORMA_LABEL: Record<ProformaState, string> = {
  draft: 'Draft',
  sent: 'Sent',
  confirmed: 'Confirmed',
  part_paid: 'Part paid',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

export interface ProformaLike { status: string; amount: number; due_date: string | null }

/** Paperwork status plus what the payments say. Overdue only once it's been sent. */
export function proformaState(pf: ProformaLike, paid: number, today = isoToday()): ProformaState {
  if (pf.status === 'cancelled') return 'cancelled'
  if (paid >= pf.amount - 0.005 && pf.amount > 0) return 'paid'
  if (pf.status !== 'draft' && pf.due_date && pf.due_date < today) return 'overdue'
  if (paid > 0) return 'part_paid'
  return pf.status as ProformaState
}

export function isoToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function addDaysIso(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** "BM-P-2026-001, Rev A"; empty until a number is set. */
export function proposalRef(no?: string, rev?: string) {
  const n = no?.trim()
  if (!n) return ''
  return rev?.trim() ? `${n}, Rev ${rev.trim()}` : n
}

export const nextRevision = (rev: string) => (rev ? String.fromCharCode(Math.min(90, rev.toUpperCase().charCodeAt(0) + 1)) : 'A')
