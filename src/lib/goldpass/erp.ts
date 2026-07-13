'use client'

import { createClient } from './supabase/client'
import { gpError } from './errors'

/* Read/write helpers for the goldpass-field ERP schema (expenses, inventory,
   procurement, operations, sales, payroll, executive, see
   goldpass-field/supabase/migrations/0001-0008). Column/RPC-param names here
   are taken directly from those migration files, not guessed. Shared across
   the Operations sub-pages so the names live in one place instead of N. */

function sb() { return createClient() }

export type ExpenseOversightRow = {
  id: string
  workflow_instance_id: string | null
  status: string
  amount_tsh: number
  category_name: string | null
  cost_centre_name: string | null
  entered_by_name: string | null
  payee_name: string | null
  payee_role: string | null
  reference_no: string | null
  notes: string | null
  proof_image_url: string | null
  created_at: string
}

/* get_stock_levels() (0002_erp_inventory.sql) */
export type StockLevelRow = {
  warehouse_id: string
  warehouse_name: string
  item_id: string
  item_name: string
  uom_code: string | null
  quantity: number
  effective_minimum_qty: number
  is_below_minimum: boolean
}

/* inventory_alerts (0002_erp_inventory.sql) */
export type InventoryAlertRow = {
  id: string
  item_id: string
  item_name: string | null
  alert_type: string
  message: string | null
  status: string
  created_at: string
  acknowledged_at: string | null
}

export type OperationsKpis = {
  pendingApprovals: number
  spendMtd: number
  lowStockCount: number
  openAlertsCount: number
}

export async function getOperationsKpis(): Promise<OperationsKpis> {
  const client = sb()
  const empty: OperationsKpis = { pendingApprovals: 0, spendMtd: 0, lowStockCount: 0, openAlertsCount: 0 }

  const [approvals, alerts, levels, spend] = await Promise.all([
    client.rpc('count_pending_workflow_approvals'),
    client.rpc('count_open_inventory_alerts'),
    client.rpc('get_stock_levels'),
    client.from('v_expense_oversight')
      .select('amount_tsh')
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ])

  if (approvals.error) gpError('GP-2601', approvals.error.message)
  if (alerts.error) gpError('GP-2602', alerts.error.message)
  if (levels.error) gpError('GP-2603', levels.error.message)
  if (spend.error) gpError('GP-2604', spend.error.message)

  return {
    pendingApprovals: typeof approvals.data === 'number' ? approvals.data : empty.pendingApprovals,
    openAlertsCount: typeof alerts.data === 'number' ? alerts.data : empty.openAlertsCount,
    lowStockCount: ((levels.data ?? []) as StockLevelRow[]).filter(r => r.is_below_minimum).length,
    spendMtd: ((spend.data ?? []) as { amount_tsh: number }[]).reduce((a, r) => a + (r.amount_tsh ?? 0), 0),
  }
}

export async function getExpenseOversight(filters?: { status?: string; limit?: number }): Promise<ExpenseOversightRow[]> {
  const client = sb()
  let q = client.from('v_expense_oversight').select('*').order('created_at', { ascending: false }).limit(filters?.limit ?? 200)
  if (filters?.status) q = q.eq('status', filters.status)
  const { data, error } = await q
  if (error) { gpError('GP-2605', error.message); return [] }
  return (data ?? []) as ExpenseOversightRow[]
}

/* workflow_transition(p_workflow_instance_id, p_decision, p_comment) (0003_erp_procurement.sql).
   p_decision: submit | approve | reject | return | cancel | void. */
export async function workflowTransition(instanceId: string, action: 'approve' | 'reject', comment: string): Promise<boolean> {
  const client = sb()
  const { error } = await client.rpc('workflow_transition', {
    p_workflow_instance_id: instanceId,
    p_decision: action,
    p_comment: comment,
  })
  if (error) { gpError('GP-2606', `${action}: ${error.message}`); return false }
  return true
}

export async function getStockLevels(): Promise<StockLevelRow[]> {
  const client = sb()
  const { data, error } = await client.rpc('get_stock_levels')
  if (error) { gpError('GP-2603', error.message); return [] }
  return (data ?? []) as StockLevelRow[]
}

export async function getInventoryAlerts(): Promise<InventoryAlertRow[]> {
  const client = sb()
  const { data, error } = await client.from('inventory_alerts')
    .select('id, item_id, alert_type, message, status, created_at, acknowledged_at, inventory_items(name)')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) { gpError('GP-2607', error.message); return [] }
  return ((data ?? []) as unknown[]).map(raw => {
    const r = raw as Record<string, unknown>
    const item = (Array.isArray(r.inventory_items) ? r.inventory_items[0] : r.inventory_items) as { name: string } | null
    return {
      id: r.id, item_id: r.item_id, alert_type: r.alert_type, message: r.message,
      status: r.status, created_at: r.created_at, acknowledged_at: r.acknowledged_at,
      item_name: item?.name ?? null,
    }
  }) as InventoryAlertRow[]
}

/* acknowledge_inventory_alert(p_alert_id) (0002_erp_inventory.sql) */
export async function acknowledgeInventoryAlert(id: string): Promise<boolean> {
  const client = sb()
  const { error } = await client.rpc('acknowledge_inventory_alert', { p_alert_id: id })
  if (error) { gpError('GP-2608', error.message); return false }
  return true
}

/* ── SIMPLE-TABLE CRUD (inventory_items, warehouses, suppliers, customers) ──
   All "id + name (+ a few fields)" shaped, so one generic list/insert/delete
   trio covers every one of these instead of near-duplicate functions. */
export type SimpleRow = Record<string, unknown> & { id: string }

export type EntityField = { key: string; label: string; required?: boolean; numeric?: boolean }
export type SimpleEntity = { id: string; label: string; table: string; fields: EntityField[] }

/* Column names below are taken from 0002_erp_inventory.sql (§A inventory_items/
   warehouses), 0003_erp_procurement.sql (suppliers), and 0006_erp_sales.sql
   (customers). */
export const INVENTORY_ITEMS_ENTITY: SimpleEntity = {
  id: 'inventory_items', label: 'Items', table: 'inventory_items',
  fields: [
    { key: 'name', label: 'Name', required: true },
    { key: 'sku', label: 'SKU' },
    { key: 'minimum_qty', label: 'Minimum Qty', numeric: true },
  ],
}
export const WAREHOUSES_ENTITY: SimpleEntity = {
  id: 'warehouses', label: 'Warehouses', table: 'warehouses',
  fields: [{ key: 'name', label: 'Name', required: true }, { key: 'code', label: 'Code' }],
}
export const SUPPLIERS_ENTITY: SimpleEntity = {
  id: 'suppliers', label: 'Suppliers', table: 'suppliers',
  fields: [
    { key: 'name', label: 'Name', required: true },
    { key: 'contact_name', label: 'Contact' },
    { key: 'phone', label: 'Phone' },
    { key: 'payment_terms', label: 'Payment Terms' },
  ],
}
export const CUSTOMERS_ENTITY: SimpleEntity = {
  id: 'customers', label: 'Customers', table: 'customers',
  fields: [
    { key: 'name', label: 'Name', required: true },
    { key: 'contact_name', label: 'Contact' },
    { key: 'phone', label: 'Phone' },
    { key: 'payment_terms', label: 'Payment Terms' },
  ],
}

export async function listSimpleTable(table: string, orderBy = 'name'): Promise<SimpleRow[]> {
  const { data, error } = await sb().from(table).select('*').order(orderBy)
  if (error) { gpError('GP-2609', `${table}: ${error.message}`); return [] }
  return (data ?? []) as SimpleRow[]
}

export async function insertSimpleRow(table: string, payload: Record<string, unknown>): Promise<boolean> {
  const { error } = await sb().from(table).insert(payload)
  if (error) { gpError('GP-2610', `${table}: ${error.message}`); return false }
  return true
}

export async function deleteRow(table: string, id: string): Promise<boolean> {
  const { error } = await sb().from(table).delete().eq('id', id)
  if (error) { gpError('GP-2611', `${table}: ${error.message}`); return false }
  return true
}

/* SYNC CONFLICTS (0004_erp_expenses_hardening.sql) */
export type SyncConflictRow = Record<string, unknown> & { id: string }

export async function getSyncConflicts(): Promise<SyncConflictRow[]> {
  const { data, error } = await sb().from('sync_conflicts').select('*').order('created_at', { ascending: false }).limit(200)
  if (error) { gpError('GP-2612', error.message); return [] }
  return (data ?? []) as SyncConflictRow[]
}

/* resolve_sync_conflict(p_conflict_id, p_resolution, p_note).
   p_resolution: keep_server | keep_client | dismissed. */
export async function resolveSyncConflict(id: string, resolution: 'keep_server' | 'keep_client' | 'dismissed', note: string): Promise<boolean> {
  const { error } = await sb().rpc('resolve_sync_conflict', { p_conflict_id: id, p_resolution: resolution, p_note: note })
  if (error) { gpError('GP-2613', error.message); return false }
  return true
}

/* EQUIPMENT (0004_erp_expenses_hardening.sql: registry, 0005: utilization) */
export type EquipmentRow = { id: string; name: string; equipment_type: string | null; active: boolean }
export type EquipmentUtilizationRow = Record<string, unknown> & { equipment_id?: string }

export async function listEquipment(): Promise<EquipmentRow[]> {
  const { data, error } = await sb().from('equipment').select('*').order('name')
  if (error) { gpError('GP-2615', error.message); return [] }
  return (data ?? []) as EquipmentRow[]
}

export async function insertEquipment(payload: { name: string; equipment_type?: string }): Promise<boolean> {
  const { error } = await sb().from('equipment').insert(payload)
  if (error) { gpError('GP-2616', error.message); return false }
  return true
}

export async function getEquipmentUtilization(): Promise<EquipmentUtilizationRow[]> {
  const { data, error } = await sb().from('v_equipment_utilization').select('*')
  if (error) { gpError('GP-2617', error.message); return [] }
  return (data ?? []) as EquipmentUtilizationRow[]
}

/* PROCUREMENT (0003_erp_procurement.sql).
   v_procurement_pipeline is one row per PR (with joined PO/GRN columns), not
   one row per document: pr_id/pr_status, po_id/po_status, grn_id/grn_status. */
export type ProcurementPipelineRow = {
  pr_id: string
  pr_number: string | null
  pr_status: string | null
  total_estimated_tsh: number | null
  pr_created_at: string
  po_id: string | null
  po_number: string | null
  po_status: string | null
  total_amount_tsh: number | null
  supplier_name: string | null
  grn_id: string | null
  grn_number: string | null
  grn_status: string | null
  variance_flag: boolean | null
  received_at: string | null
}

export async function getProcurementPipeline(): Promise<ProcurementPipelineRow[]> {
  const { data, error } = await sb().from('v_procurement_pipeline').select('*').order('pr_created_at', { ascending: false }).limit(200)
  if (error) { gpError('GP-2621', error.message); return [] }
  return (data ?? []) as ProcurementPipelineRow[]
}

/* convert_pr_to_po(p_pr_id) (0003_erp_procurement.sql) */
export async function convertPrToPo(prId: string): Promise<boolean> {
  const { error } = await sb().rpc('convert_pr_to_po', { p_pr_id: prId })
  if (error) { gpError('GP-2622', error.message); return false }
  return true
}

/* AUDIT LOG (0001_erp_foundation.sql) */
export type AuditLogRow = {
  id: string
  entity_type: string
  entity_id: string
  action: string
  before: unknown
  after: unknown
  actor: string | null
  created_at: string
}

export async function getAuditLog(filters?: { entityType?: string }): Promise<AuditLogRow[]> {
  let q = sb().from('audit_log').select('*').order('created_at', { ascending: false }).limit(200)
  if (filters?.entityType) q = q.eq('entity_type', filters.entityType)
  const { data, error } = await q
  if (error) { gpError('GP-2623', error.message); return [] }
  return (data ?? []) as AuditLogRow[]
}

/* SALES (0006_erp_sales.sql) */
export type SalesRegisterRow = {
  id: string
  sale_number: string | null
  sale_date: string
  site_id: string | null
  customer_name: string
  weight_g: number
  purity_pct: number | null
  fine_gold_g: number
  price_tsh: number
  price_per_gram_tsh: number
  payment_terms: string | null
  status: string | null
  journal_entry_id: string | null
  recorded_by_name: string | null
  created_at: string
}

export async function getSalesRegister(): Promise<SalesRegisterRow[]> {
  const { data, error } = await sb().from('v_sales_register').select('*').order('sale_date', { ascending: false }).limit(200)
  if (error) { gpError('GP-2624', error.message); return [] }
  return (data ?? []) as SalesRegisterRow[]
}

/* Sales are recorded directly by admins: there is no approval step (the admin
   entering the sale would only be approving themselves). submitSale() inserts
   the sale and it counts as revenue immediately; no workflow_transition. */
export type NewSaleInput = {
  siteId: string | null
  customerId: string
  saleDate: string
  weightG: number
  purityPct: number | null
  priceTsh: number
  paymentTerms: string | null
  notes: string | null
}

/* submit_sale(...) (0006_erp_sales.sql), widened in 0013 to also allow admin
   accounts (originally manager-only, since sale entry was mobile-only). */
export async function submitSale(input: NewSaleInput): Promise<string | null> {
  const { data, error } = await sb().rpc('submit_sale', {
    p_site_id: input.siteId,
    p_customer_id: input.customerId,
    p_sale_date: input.saleDate,
    p_weight_g: input.weightG,
    p_purity_pct: input.purityPct,
    p_price_tsh: input.priceTsh,
    p_payment_terms: input.paymentTerms,
    p_notes: input.notes,
  })
  if (error) { gpError('GP-2644', error.message); return null }
  return data as string
}

/* FINANCIAL SUMMARY (0014_operations_financial_summary.sql).
   "Cost" = expenses + payroll + approved procurement. There's no unified
   cost ledger in the schema to just query (cost_events only ever got wired
   up for expenses, see the migration's own comment), so this is three
   sources aggregated server-side per month. */
export type FinancialSummaryRow = {
  month: string
  revenue_tsh: number
  expense_tsh: number
  payroll_tsh: number
  procurement_tsh: number
  cost_tsh: number
  profit_tsh: number
}

export async function getFinancialSummary(months = 6, siteId?: string): Promise<FinancialSummaryRow[]> {
  const { data, error } = await sb().rpc('get_operations_financial_summary', { p_site_id: siteId ?? null, p_months: months })
  if (error) { gpError('GP-2645', error.message); return [] }
  return (data ?? []) as FinancialSummaryRow[]
}

/* Simple trailing-trend projection: no RPC involved, kept here so the logic
   is visible/auditable rather than buried in SQL. Flat projection (= last
   actual) if there isn't enough history to compute a trend from. */
export function projectNextMonth(rows: FinancialSummaryRow[]): number {
  if (rows.length === 0) return 0
  if (rows.length === 1) return rows[0].revenue_tsh
  const first = rows[0].revenue_tsh
  const last = rows[rows.length - 1].revenue_tsh
  const avgDelta = (last - first) / (rows.length - 1)
  return Math.max(0, last + avgDelta)
}

/* PLANT: TANKS (0016_plant_tanks.sql).
   Static reference data for phase A (code, line, volume, reference cost).
   Live fill state from color_tests is phase B, not read here yet. */
export type TankRow = {
  id: string
  tank_code: string
  line: 'A' | 'B' | 'C'
  volume_m3: number
  ref_cost_tsh: number
  sort_order: number
  active: boolean
}

export async function getTanks(): Promise<TankRow[]> {
  const { data, error } = await sb().from('tanks').select('*').eq('active', true).order('sort_order')
  if (error) { gpError('GP-2646', error.message); return [] }
  return (data ?? []) as TankRow[]
}

/* PLANT: LEACHING PERIODS + COLOR TESTS (0017_leaching_periods_color_tests.sql). */
export type LeachingPeriodRow = {
  id: string
  period_start: string
  period_end: string | null
  status: 'open' | 'closed'
  closed_by: string | null
  notes: string | null
  created_at: string
}

export async function getLeachingPeriods(): Promise<LeachingPeriodRow[]> {
  const { data, error } = await sb().from('leaching_periods').select('*').order('period_start', { ascending: false })
  if (error) { gpError('GP-2647', error.message); return [] }
  return (data ?? []) as LeachingPeriodRow[]
}

export async function openLeachingPeriod(periodStart: string, notes?: string): Promise<boolean> {
  const { error } = await sb().from('leaching_periods').insert({ period_start: periodStart, notes: notes ?? null })
  if (error) { gpError('GP-2648', error.message); return false }
  return true
}

export async function closeLeachingPeriod(id: string, periodEnd: string): Promise<boolean> {
  const { data: auth } = await sb().auth.getUser()
  const { error } = await sb().from('leaching_periods')
    .update({ status: 'closed', period_end: periodEnd, closed_by: auth.user?.id ?? null })
    .eq('id', id)
  if (error) { gpError('GP-2649', error.message); return false }
  return true
}

export type ColorTestRow = {
  id: string
  test_date: string
  tank_id: string
  result: 'black' | 'grey' | 'clear'
  notes: string | null
}

export async function getColorTests(tankId?: string): Promise<ColorTestRow[]> {
  let q = sb().from('color_tests').select('id, test_date, tank_id, result, notes').order('test_date', { ascending: false })
  if (tankId) q = q.eq('tank_id', tankId)
  const { data, error } = await q
  if (error) { gpError('GP-2650', error.message); return [] }
  return (data ?? []) as ColorTestRow[]
}

export async function logColorTest(input: { tankId: string; testDate: string; result: 'black' | 'grey' | 'clear'; notes?: string }): Promise<boolean> {
  const { data: auth } = await sb().auth.getUser()
  const { error } = await sb().from('color_tests').insert({
    tank_id: input.tankId,
    test_date: input.testDate,
    result: input.result,
    notes: input.notes ?? null,
    created_by: auth.user?.id ?? null,
  })
  if (error) { gpError('GP-2651', error.message); return false }
  return true
}

export type TankLatestColor = { tank_id: string; result: 'black' | 'grey' | 'clear'; test_date: string }

export async function getLatestTankColors(): Promise<Record<string, TankLatestColor>> {
  const { data, error } = await sb().from('v_tank_latest_color').select('*')
  if (error) { gpError('GP-2652', error.message); return {} }
  const out: Record<string, TankLatestColor> = {}
  for (const row of (data ?? []) as TankLatestColor[]) out[row.tank_id] = row
  return out
}

export type PeriodCostRow = { month: string; total_cost_tsh: number }

export async function getLeachingPeriodCost(periodId: string): Promise<PeriodCostRow[]> {
  const { data, error } = await sb().rpc('get_leaching_period_cost', { p_period_id: periodId })
  if (error) { gpError('GP-2653', error.message); return [] }
  return (data ?? []) as PeriodCostRow[]
}

/* PITS + MACHINERY (0018_pits_machinery.sql). */
export type PitRow = {
  id: string
  mine_location_id: string | null
  project_id: string | null
  cost_centre_id: string | null
  name: string
  code: string | null
  active: boolean
  sort_order: number
}

export async function getPits(): Promise<PitRow[]> {
  const { data, error } = await sb().from('pits').select('*').eq('active', true).order('sort_order')
  if (error) { gpError('GP-2654', error.message); return [] }
  return (data ?? []) as PitRow[]
}

export async function createPit(input: { name: string; code?: string; mineLocationId?: string; projectId?: string }): Promise<string | null> {
  const { data, error } = await sb().rpc('create_pit', {
    p_name: input.name,
    p_code: input.code ?? null,
    p_mine_location_id: input.mineLocationId ?? null,
    p_project_id: input.projectId ?? null,
  })
  if (error) { gpError('GP-2655', error.message); return null }
  return data as string
}

export type PitMachineryRow = {
  id: string
  pit_id: string
  equipment_id: string
  team_notes: string | null
  active: boolean
}

export async function getPitMachinery(pitId?: string): Promise<PitMachineryRow[]> {
  let q = sb().from('pit_machinery').select('*').eq('active', true)
  if (pitId) q = q.eq('pit_id', pitId)
  const { data, error } = await q
  if (error) { gpError('GP-2656', error.message); return [] }
  return (data ?? []) as PitMachineryRow[]
}

export async function assignMachinery(input: { pitId: string; equipmentId: string; teamNotes?: string }): Promise<boolean> {
  const { error } = await sb().from('pit_machinery').insert({
    pit_id: input.pitId, equipment_id: input.equipmentId, team_notes: input.teamNotes ?? null,
  })
  if (error) { gpError('GP-2657', error.message); return false }
  return true
}

export type PitMonthlyCostRow = { pit_id: string; pit_name: string; month: string; total_cost_tsh: number }

export async function getPitsMonthlyCost(months = 6): Promise<PitMonthlyCostRow[]> {
  const { data, error } = await sb().rpc('get_pits_monthly_cost', { p_months: months })
  if (error) { gpError('GP-2658', error.message); return [] }
  return (data ?? []) as PitMonthlyCostRow[]
}
