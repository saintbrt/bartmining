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

/* ── SIMPLE-TABLE CRUD (sites, mine_locations, departments, cost_centres,
   employees, inventory_items, warehouses, suppliers, customers) ──
   All "id + name (+ a few fields)" shaped, so one generic list/insert/delete
   trio covers every one of these instead of near-duplicate functions. */
export type SimpleRow = Record<string, unknown> & { id: string }

export type EntityField = { key: string; label: string; required?: boolean; numeric?: boolean }
export type SimpleEntity = { id: string; label: string; table: string; fields: EntityField[] }

/* Column names below are taken from 0001_erp_foundation.sql (§B master data),
   0002_erp_inventory.sql (§A inventory_items/warehouses), 0003_erp_procurement.sql
   (suppliers), and 0006_erp_sales.sql (customers). */
export const MASTER_DATA_ENTITIES: SimpleEntity[] = [
  { id: 'sites',        label: 'Sites',        table: 'sites',         fields: [{ key: 'name', label: 'Name', required: true }] },
  { id: 'locations',    label: 'Locations',    table: 'mine_locations', fields: [{ key: 'name', label: 'Name', required: true }, { key: 'site_id', label: 'Site ID' }] },
  { id: 'departments',  label: 'Departments',  table: 'departments',   fields: [{ key: 'name', label: 'Name', required: true }] },
  { id: 'cost_centres', label: 'Cost Centres', table: 'cost_centres',  fields: [{ key: 'name', label: 'Name', required: true }] },
  { id: 'employees',    label: 'Employees',    table: 'employees',     fields: [{ key: 'full_name', label: 'Full Name', required: true }, { key: 'role_title', label: 'Role' }, { key: 'phone', label: 'Phone' }] },
]

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

/* USERS (profiles + role).
   Role reassignment only: creating brand-new auth accounts needs a
   service-role key/edge function this codebase doesn't have. Not needed:
   this is a private-company deployment, not self-service signup. */
export type ProfileRow = { id: string; name: string | null; email: string | null; role: string; site_id: string | null }

export async function listProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await sb().from('profiles').select('id, name, email, role, site_id').order('name')
  if (error) { gpError('GP-2619', error.message); return [] }
  return (data ?? []) as ProfileRow[]
}

export async function updateProfileRole(id: string, role: string): Promise<boolean> {
  const { error } = await sb().from('profiles').update({ role }).eq('id', id)
  if (error) { gpError('GP-2620', error.message); return false }
  return true
}

export async function updateProfileName(id: string, name: string): Promise<boolean> {
  const { error } = await sb().from('profiles').update({ name }).eq('id', id)
  if (error) { gpError('GP-2643', error.message); return false }
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

/* SHIFT LOGS (0005_erp_operations.sql).
   v_shift_log_oversight doesn't expose workflow_instance_id directly, so it's
   fetched separately from shift_logs and merged in. */
export type ShiftLogOversightRow = Record<string, unknown> & { id: string; status: string; workflow_instance_id: string | null }

export async function getShiftLogOversight(filters?: { status?: string }): Promise<ShiftLogOversightRow[]> {
  const client = sb()
  let q = client.from('v_shift_log_oversight').select('*').order('shift_date', { ascending: false }).limit(200)
  if (filters?.status) q = q.eq('status', filters.status)
  const { data, error } = await q
  if (error) { gpError('GP-2614', error.message); return [] }
  const rows = (data ?? []) as Record<string, unknown>[]
  if (rows.length === 0) return []

  const ids = rows.map(r => r.id as string)
  const { data: wfRows, error: wfError } = await client.from('shift_logs').select('id, workflow_instance_id').in('id', ids)
  if (wfError) gpError('GP-2614', wfError.message)
  const wfMap = new Map((wfRows ?? []).map(r => [r.id as string, r.workflow_instance_id as string | null]))

  return rows.map(r => ({ ...r, workflow_instance_id: wfMap.get(r.id as string) ?? null })) as ShiftLogOversightRow[]
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

/* DAILY OPS (0005_erp_operations.sql; no "target" column exists yet,
   this is actual vs. pending/approved shift log counts, not actual vs. plan) */
export type DailyOpsSummaryRow = Record<string, unknown>

export async function getDailyOpsSummary(): Promise<DailyOpsSummaryRow[]> {
  const { data, error } = await sb().from('v_daily_ops_summary').select('*').order('shift_date', { ascending: false }).limit(60)
  if (error) { gpError('GP-2618', error.message); return [] }
  return (data ?? []) as DailyOpsSummaryRow[]
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

/* PAYROLL (0007_erp_payroll.sql).
   IMPORTANT GAP found in the migration itself: sync_workflow_to_document()
   (0003/0004/0005) never got a 'payroll_run' or 'payroll_adjustment' case
   added in 0007. That means workflow_transition('approve') only flips
   workflow_instances.current_state, it does NOT set payroll_runs.status to
   'approved'. lock_payroll_run() then checks payroll_runs.status = 'approved'
   literally and will raise "Payroll run must be approved before locking"
   even after a real approval. This is a backend gap, not a web bug: the
   functions below surface whatever the RPC actually returns rather than
   pretending the lock step always works. */

export type AttendanceRecordRow = {
  id: string
  employee_id: string
  employee_name: string | null
  work_date: string
  hours_worked: number
  status: string
  source: string
  created_at: string
}

export async function getAttendanceRecords(filters?: { status?: string }): Promise<AttendanceRecordRow[]> {
  let q = sb().from('attendance_records').select('id, employee_id, work_date, hours_worked, status, source, created_at, employees(full_name)').order('work_date', { ascending: false }).limit(200)
  if (filters?.status) q = q.eq('status', filters.status)
  const { data, error } = await q
  if (error) { gpError('GP-2625', error.message); return [] }
  return ((data ?? []) as unknown[]).map(raw => {
    const r = raw as Record<string, unknown>
    const emp = (Array.isArray(r.employees) ? r.employees[0] : r.employees) as { full_name: string } | null
    return { ...r, employee_name: emp?.full_name ?? null }
  }) as AttendanceRecordRow[]
}

/* confirm_attendance_record(p_attendance_id): supervisor/admin only */
export async function confirmAttendanceRecord(id: string): Promise<boolean> {
  const { error } = await sb().rpc('confirm_attendance_record', { p_attendance_id: id })
  if (error) { gpError('GP-2626', error.message); return false }
  return true
}

export type PayrollAdjustmentRow = {
  id: string
  employee_id: string
  employee_name: string | null
  adjustment_type: string
  amount_tsh: number
  effective_date: string
  reason: string
  workflow_instance_id: string | null
  workflow_state: string | null
  created_at: string
}

export async function getPayrollAdjustments(): Promise<PayrollAdjustmentRow[]> {
  const { data, error } = await sb().from('payroll_adjustments')
    .select('id, employee_id, adjustment_type, amount_tsh, effective_date, reason, workflow_instance_id, created_at, employees(full_name), workflow_instances(current_state)')
    .order('created_at', { ascending: false }).limit(200)
  if (error) { gpError('GP-2627', error.message); return [] }
  return ((data ?? []) as unknown[]).map(raw => {
    const r = raw as Record<string, unknown>
    const emp = (Array.isArray(r.employees) ? r.employees[0] : r.employees) as { full_name: string } | null
    const wf = (Array.isArray(r.workflow_instances) ? r.workflow_instances[0] : r.workflow_instances) as { current_state: string } | null
    return { ...r, employee_name: emp?.full_name ?? null, workflow_state: wf?.current_state ?? null }
  }) as PayrollAdjustmentRow[]
}

export type PayrollRunRow = {
  id: string
  site_id: string | null
  period_start: string
  period_end: string
  run_label: string | null
  status: string
  workflow_state: string | null
  workflow_instance_id: string | null
  total_gross_tsh: number
  total_net_tsh: number
  employee_count: number
  created_at: string
}

export async function getPayrollRuns(): Promise<PayrollRunRow[]> {
  const { data, error } = await sb().from('payroll_runs')
    .select('id, site_id, period_start, period_end, run_label, status, workflow_instance_id, total_gross_tsh, total_net_tsh, employee_count, created_at, workflow_instances(current_state)')
    .order('period_start', { ascending: false }).limit(100)
  if (error) { gpError('GP-2628', error.message); return [] }
  return ((data ?? []) as unknown[]).map(raw => {
    const r = raw as Record<string, unknown>
    const wf = (Array.isArray(r.workflow_instances) ? r.workflow_instances[0] : r.workflow_instances) as { current_state: string } | null
    return { ...r, workflow_state: wf?.current_state ?? null }
  }) as PayrollRunRow[]
}

/* generate_payroll_preview(p_site_id, p_period_start, p_period_end, p_run_label): admin only */
export async function generatePayrollPreview(siteId: string | null, periodStart: string, periodEnd: string, runLabel?: string): Promise<string | null> {
  const { data, error } = await sb().rpc('generate_payroll_preview', {
    p_site_id: siteId, p_period_start: periodStart, p_period_end: periodEnd, p_run_label: runLabel ?? null,
  })
  if (error) { gpError('GP-2629', error.message); return null }
  return data as string
}

/* lock_payroll_run(p_run_id): admin only; requires payroll_runs.status = 'approved'
   (see gap note above, this may fail even after a real workflow approval). */
export async function lockPayrollRun(runId: string): Promise<boolean> {
  const { error } = await sb().rpc('lock_payroll_run', { p_run_id: runId })
  if (error) { gpError('GP-2630', error.message); return false }
  return true
}

export type LaborCostRow = Record<string, unknown>

export async function getLaborCostByCostCentre(): Promise<LaborCostRow[]> {
  const { data, error } = await sb().from('v_labor_cost_by_cost_centre').select('*').order('period_start', { ascending: false }).limit(200)
  if (error) { gpError('GP-2631', error.message); return [] }
  return (data ?? []) as LaborCostRow[]
}

/* EXECUTIVE (0008_erp_executive.sql) */
export type ExecutiveKpis = {
  period_start: string
  period_end: string
  site_id: string | null
  generated_at: string
  production: { gold_output_g: number; ore_tonnes: number; approved_shift_logs: number; production_plan_g: number; cost_per_gram: number | null; cost_per_tonne: number | null }
  spend: { total_spend_tsh: number; approved_count: number; monthly_budget_tsh: number; budget_variance_pct: number | null }
  sales: { revenue_tsh: number; fine_gold_g: number; sale_count: number }
  payroll: { labor_cost_tsh: number; employee_count: number }
  inventory: { below_minimum_count: number; total_skus: number; low_stock_items: { item: string; warehouse: string; qty: number }[] }
  fuel: { fuel_litres_30d: number; breakdown_count_30d: number }
  pending_approvals: number
}

/* get_executive_kpis(p_site_id default null): current-month live KPIs, but
   reads from materialized views (mv_monthly_*) which are only refreshed by
   refresh_executive_mviews() or the month-end snapshot job. Call
   refreshExecutiveMviews() first if the numbers look stale. */
export async function getExecutiveKpis(siteId?: string): Promise<ExecutiveKpis | null> {
  const { data, error } = await sb().rpc('get_executive_kpis', { p_site_id: siteId ?? null })
  if (error) { gpError('GP-2632', error.message); return null }
  return data as ExecutiveKpis
}

export async function refreshExecutiveMviews(): Promise<boolean> {
  const { error } = await sb().rpc('refresh_executive_mviews')
  if (error) { gpError('GP-2633', error.message); return false }
  return true
}

export type ManagerScorecard = {
  manager_id: string
  period_start: string
  period_end: string
  expense_entries_submitted: number
  expense_entries_approved: number
  shift_logs_submitted: number
  shift_logs_approved: number
  sales_recorded: number
  payroll_adjustments_submitted: number
  approval_rate_pct: number | null
}

export async function getManagerScorecard(managerId: string): Promise<ManagerScorecard | null> {
  const { data, error } = await sb().rpc('get_manager_scorecard', { p_manager_id: managerId })
  if (error) { gpError('GP-2634', error.message); return null }
  return data as ManagerScorecard
}

export type MonthEndCloseRow = {
  id: string
  site_id: string
  site_name: string | null
  period_year: number
  period_month: number
  period_start: string
  period_end: string
  status: string
  snapshot_id: string | null
  initiated_at: string
  closed_at: string | null
}

export async function getMonthEndCloses(): Promise<MonthEndCloseRow[]> {
  const { data, error } = await sb().from('month_end_closes')
    .select('id, site_id, period_year, period_month, period_start, period_end, status, snapshot_id, initiated_at, closed_at, sites(name)')
    .order('period_start', { ascending: false }).limit(100)
  if (error) { gpError('GP-2635', error.message); return [] }
  return ((data ?? []) as unknown[]).map(raw => {
    const r = raw as Record<string, unknown>
    const site = (Array.isArray(r.sites) ? r.sites[0] : r.sites) as { name: string } | null
    return { ...r, site_name: site?.name ?? null }
  }) as MonthEndCloseRow[]
}

/* initiate_month_end_close(p_site_id, p_year, p_month): admin only */
export async function initiateMonthEndClose(siteId: string, year: number, month: number): Promise<string | null> {
  const { data, error } = await sb().rpc('initiate_month_end_close', { p_site_id: siteId, p_year: year, p_month: month })
  if (error) { gpError('GP-2636', error.message); return null }
  return data as string
}

/* create_monthly_snapshot(p_close_id): admin only; freezes the period */
export async function createMonthlySnapshot(closeId: string): Promise<string | null> {
  const { data, error } = await sb().rpc('create_monthly_snapshot', { p_close_id: closeId })
  if (error) { gpError('GP-2637', error.message); return null }
  return data as string
}

/* finalize_month_end_close(p_close_id): admin only; requires a snapshot to exist */
export async function finalizeMonthEndClose(closeId: string): Promise<boolean> {
  const { error } = await sb().rpc('finalize_month_end_close', { p_close_id: closeId })
  if (error) { gpError('GP-2638', error.message); return false }
  return true
}

export type MonthlySnapshotRow = {
  id: string
  site_id: string | null
  site_name: string | null
  period_start: string
  period_end: string
  snapshot_version: number
  status: string
  parent_snapshot_id: string | null
  created_at: string
  frozen_at: string | null
}

export async function getMonthlySnapshots(): Promise<MonthlySnapshotRow[]> {
  const { data, error } = await sb().from('monthly_snapshots')
    .select('id, site_id, period_start, period_end, snapshot_version, status, parent_snapshot_id, created_at, frozen_at, sites(name)')
    .order('created_at', { ascending: false }).limit(100)
  if (error) { gpError('GP-2639', error.message); return [] }
  return ((data ?? []) as unknown[]).map(raw => {
    const r = raw as Record<string, unknown>
    const site = (Array.isArray(r.sites) ? r.sites[0] : r.sites) as { name: string } | null
    return { ...r, site_name: site?.name ?? null }
  }) as MonthlySnapshotRow[]
}

/* amend_monthly_snapshot(p_snapshot_id, p_reason): admin only; only frozen snapshots */
export async function amendMonthlySnapshot(snapshotId: string, reason: string): Promise<string | null> {
  const { data, error } = await sb().rpc('amend_monthly_snapshot', { p_snapshot_id: snapshotId, p_reason: reason })
  if (error) { gpError('GP-2640', error.message); return null }
  return data as string
}

export type SiteReportConfigRow = {
  site_id: string
  site_name: string | null
  close_day_of_month: number
  monthly_budget_tsh: number
  production_plan_g: number
}

export async function getSiteReportConfigs(): Promise<SiteReportConfigRow[]> {
  const { data, error } = await sb().from('site_report_config')
    .select('site_id, close_day_of_month, monthly_budget_tsh, production_plan_g, sites(name)')
  if (error) { gpError('GP-2641', error.message); return [] }
  return ((data ?? []) as unknown[]).map(raw => {
    const r = raw as Record<string, unknown>
    const site = (Array.isArray(r.sites) ? r.sites[0] : r.sites) as { name: string } | null
    return { ...r, site_name: site?.name ?? null }
  }) as SiteReportConfigRow[]
}

/* Upsert since site_id is the primary key (one config row per site) */
export async function upsertSiteReportConfig(siteId: string, payload: { close_day_of_month: number; monthly_budget_tsh: number; production_plan_g: number }): Promise<boolean> {
  const { error } = await sb().from('site_report_config').upsert({ site_id: siteId, ...payload })
  if (error) { gpError('GP-2642', error.message); return false }
  return true
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
