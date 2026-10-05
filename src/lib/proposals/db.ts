'use client'

import { createClient } from '@/lib/goldpass/supabase/client'
import { gpError } from '@/lib/goldpass/errors'
import type { Project } from './types'
import type { DealType, Stage } from './deal'

/* Reads and writes for the Projects tab (supabase/0024_bm_projects.sql).
   Admin only: RLS refuses everyone else, so a failed read shows as empty. */

function sb() { return createClient() }

export type PartyKind = 'client' | 'supplier' | 'principal' | 'self'

export interface PartyRow {
  id: string
  kind: PartyKind
  name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  country: string | null
  address: string | null
  tax_id: string | null
  bank_details: string | null
  notes: string | null
}

export interface ProjectCard {
  id: string
  name: string
  stage: Stage
  deal_type: DealType
  client_id: string | null
  principal_id: string | null
  value_usd: number
  archived: boolean
  lost_reason: string | null
  updated_at: string
  created_at: string
  meta: Project['meta'] | null
}

export interface ProjectRow extends Omit<ProjectCard, 'meta'> {
  data: Project
  version: number
}

export interface ProposalRow {
  id: string
  project_id: string
  number: string
  revision: string
  status: 'sent' | 'accepted' | 'declined' | 'superseded' | 'expired'
  title: string | null
  total_usd: number | null
  valid_until: string | null
  pdf_path: string | null
  sent_at: string
  decided_at: string | null
}

export interface RfqRow {
  id: string
  project_id: string
  supplier_id: string | null
  package_key: string | null
  number: string | null
  subject: string | null
  status: 'draft' | 'sent' | 'quoted' | 'declined' | 'accepted'
  quote_amount: number | null
  quote_currency: string
  quote_ref: string | null
  quote_valid_until: string | null
  quote_path: string | null
  notes: string | null
  sent_at: string | null
  quoted_at: string | null
  created_at: string
}

export interface ProformaRow {
  id: string
  project_id: string
  milestone_key: string | null
  number: string
  payee_id: string | null
  description: string
  amount: number
  currency: string
  issued_on: string
  due_date: string | null
  status: 'draft' | 'sent' | 'confirmed' | 'cancelled'
  sent_at: string | null
  confirmed_at: string | null
  pdf_path: string | null
  notes: string | null
}

export interface PaymentRow {
  id: string
  project_id: string
  proforma_id: string | null
  amount: number
  currency: string
  received_on: string
  method: string | null
  reference: string | null
  notes: string | null
}

export interface MessageRow {
  id: string
  project_id: string | null
  kind: 'proposal' | 'rfq' | 'proforma' | 'reminder' | 'general'
  related_id: string | null
  from_email: string
  reply_to: string | null
  to_emails: string[]
  cc_emails: string[]
  subject: string
  body: string
  attachments: { name: string; path?: string }[]
  status: 'sent' | 'failed'
  error: string | null
  sent_at: string
}

const num = (v: unknown) => (v === null || v === undefined ? 0 : Number(v))

function fail(code: string, e: { message: string } | null) {
  if (e) gpError(code, e.message)
  return !!e
}

// ── Projects ────────────────────────────────────────────────────────────────

const CARD_COLS = 'id, name, stage, deal_type, client_id, principal_id, value_usd, archived, lost_reason, updated_at, created_at, meta:data->meta'

export async function listProjects(): Promise<ProjectCard[]> {
  const { data, error } = await sb().from('bm_projects').select(CARD_COLS).order('updated_at', { ascending: false })
  if (fail('GP-2701', error)) return []
  return (data ?? []).map(r => ({ ...(r as unknown as ProjectCard), value_usd: num((r as { value_usd: unknown }).value_usd) }))
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const { data, error } = await sb().from('bm_projects').select('*').eq('id', id).maybeSingle()
  if (fail('GP-2702', error) || !data) return null
  return { ...(data as ProjectRow), value_usd: num(data.value_usd) }
}

export async function createProject(row: { name: string; data: Project; stage?: Stage; deal_type?: DealType; client_id?: string | null; value_usd: number }): Promise<string | null> {
  const { data, error } = await sb().from('bm_projects').insert(row).select('id').single()
  if (fail('GP-2703', error) || !data) return null
  return data.id as string
}

export type SaveResult = { ok: true; version: number } | { ok: false; conflict: boolean }

/** Saves the planner data only if nobody else saved since `version`. */
export async function saveProjectData(id: string, data: Project, version: number, value_usd: number): Promise<SaveResult> {
  const { data: rows, error } = await sb().from('bm_projects')
    .update({ data, version: version + 1, value_usd, name: data.meta.name })
    .eq('id', id).eq('version', version)
    .select('version')
  if (fail('GP-2704', error)) return { ok: false, conflict: false }
  if (!rows?.length) return { ok: false, conflict: true }
  return { ok: true, version: rows[0].version as number }
}

export async function updateProject(id: string, fields: Partial<Pick<ProjectRow, 'stage' | 'deal_type' | 'client_id' | 'principal_id' | 'archived' | 'lost_reason'>>): Promise<boolean> {
  const { error } = await sb().from('bm_projects').update(fields).eq('id', id)
  return !fail('GP-2705', error)
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await sb().from('bm_projects').delete().eq('id', id)
  return !fail('GP-2706', error)
}

// ── Parties ─────────────────────────────────────────────────────────────────

export async function listParties(): Promise<PartyRow[]> {
  const { data, error } = await sb().from('bm_parties').select('*').order('name')
  if (fail('GP-2711', error)) return []
  return (data ?? []) as PartyRow[]
}

export async function saveParty(p: Partial<PartyRow> & { kind: PartyKind; name: string }): Promise<PartyRow | null> {
  const q = p.id
    ? sb().from('bm_parties').update(p).eq('id', p.id).select('*').single()
    : sb().from('bm_parties').insert(p).select('*').single()
  const { data, error } = await q
  if (fail('GP-2712', error)) return null
  return data as PartyRow
}

export async function deleteParty(id: string): Promise<boolean> {
  const { error } = await sb().from('bm_parties').delete().eq('id', id)
  return !fail('GP-2713', error)
}

// ── Proposals, RFQs, pro formas, payments, messages ─────────────────────────

async function list<T>(table: string, code: string, projectId?: string, order = 'created_at'): Promise<T[]> {
  let q = sb().from(table).select('*')
  if (projectId) q = q.eq('project_id', projectId)
  const { data, error } = await q.order(order, { ascending: false })
  if (fail(code, error)) return []
  return (data ?? []) as T[]
}

const numeric = <T extends object>(rows: T[], keys: (keyof T)[]) =>
  rows.map(r => { const x = { ...r }; for (const k of keys) if (x[k] !== null) (x[k] as unknown) = Number(x[k]); return x })

export const listProposals = async (projectId?: string) =>
  numeric(await list<ProposalRow>('bm_proposals', 'GP-2721', projectId, 'sent_at'), ['total_usd'])

export async function updateProposal(id: string, fields: Partial<Pick<ProposalRow, 'status' | 'decided_at'>>) {
  const { error } = await sb().from('bm_proposals').update(fields).eq('id', id)
  return !fail('GP-2722', error)
}

export const listRfqs = async (projectId?: string) =>
  numeric(await list<RfqRow>('bm_rfqs', 'GP-2731', projectId), ['quote_amount'])

export async function saveRfq(r: Partial<RfqRow> & { project_id: string }): Promise<RfqRow | null> {
  const q = r.id
    ? sb().from('bm_rfqs').update(r).eq('id', r.id).select('*').single()
    : sb().from('bm_rfqs').insert(r).select('*').single()
  const { data, error } = await q
  if (fail('GP-2732', error)) return null
  return data as RfqRow
}

export async function deleteRfq(id: string) {
  const { error } = await sb().from('bm_rfqs').delete().eq('id', id)
  return !fail('GP-2733', error)
}

export const listProformas = async (projectId?: string) =>
  numeric(await list<ProformaRow>('bm_proformas', 'GP-2741', projectId), ['amount'])

export async function saveProforma(p: Partial<ProformaRow> & { project_id: string }): Promise<ProformaRow | null> {
  const row = { ...p }
  if (!row.id && !row.number) {
    const n = await nextNumber('PF')
    if (!n) return null
    row.number = n
  }
  const q = row.id
    ? sb().from('bm_proformas').update(row).eq('id', row.id).select('*').single()
    : sb().from('bm_proformas').insert(row).select('*').single()
  const { data, error } = await q
  if (fail('GP-2742', error)) return null
  return { ...(data as ProformaRow), amount: Number(data.amount) }
}

export async function getProforma(id: string): Promise<ProformaRow | null> {
  const { data, error } = await sb().from('bm_proformas').select('*').eq('id', id).maybeSingle()
  if (fail('GP-2741', error) || !data) return null
  return { ...(data as ProformaRow), amount: Number(data.amount) }
}

export async function deleteProforma(id: string) {
  const { error } = await sb().from('bm_proformas').delete().eq('id', id)
  return !fail('GP-2743', error)
}

export const listPayments = async (projectId?: string) =>
  numeric(await list<PaymentRow>('bm_payments', 'GP-2751', projectId, 'received_on'), ['amount'])

export async function addPayment(p: Omit<PaymentRow, 'id' | 'currency'> & { currency?: string }) {
  const { error } = await sb().from('bm_payments').insert(p)
  return !fail('GP-2752', error)
}

export async function deletePayment(id: string) {
  const { error } = await sb().from('bm_payments').delete().eq('id', id)
  return !fail('GP-2753', error)
}

export const listMessages = (projectId?: string) => list<MessageRow>('bm_messages', 'GP-2761', projectId, 'sent_at')

// ── Numbers and files ───────────────────────────────────────────────────────

/** Next running number: 'P' → BM-P-2026-002. */
export async function nextNumber(prefix: 'P' | 'PF' | 'RFQ'): Promise<string | null> {
  const { data, error } = await sb().rpc('bm_next_number', { prefix })
  if (fail('GP-2771', error)) return null
  return data as string
}

/** Tells the counter about a number given elsewhere, so it is never issued twice. */
export async function noteNumber(num: string) {
  const { error } = await sb().rpc('bm_note_number', { num })
  fail('GP-2772', error)
}

export const FILES_BUCKET = 'bm-files'

export async function uploadFile(path: string, file: Blob, contentType?: string): Promise<boolean> {
  const { error } = await sb().storage.from(FILES_BUCKET).upload(path, file, { upsert: true, contentType })
  return !fail('GP-2781', error)
}

export async function fileUrl(path: string): Promise<string | null> {
  const { data, error } = await sb().storage.from(FILES_BUCKET).createSignedUrl(path, 300)
  if (fail('GP-2782', error) || !data) return null
  return data.signedUrl
}
