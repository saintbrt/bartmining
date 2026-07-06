'use client'

import { createClient } from './supabase/client'
import { gpError } from './errors'

/* Read/write helpers for the goldpass-field ERP schema (expenses, inventory —
   see goldpass-field/supabase/SCHEMA_CROSS_REFERENCE.md). Shared by the
   Operations Overview/Expenses/Inventory pages so RPC/view names live in one
   place instead of three. */

function sb() { return createClient() }

export type ExpenseOversightRow = {
  id: string
  workflow_instance_id: string | null
  status: string
  amount_tsh: number
  category_name: string | null
  location_name: string | null
  cost_centre_name: string | null
  submitted_by_name: string | null
  proof_image_url: string | null
  created_at: string
}

export type StockLevelRow = {
  item_id: string
  item_name: string
  warehouse_name: string
  quantity: number
  minimum_qty: number
  is_below_minimum: boolean
}

export type InventoryAlertRow = {
  id: string
  item_name: string | null
  alert_type: string
  message: string | null
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

export async function getExpenseOversight(filters?: { status?: string }): Promise<ExpenseOversightRow[]> {
  const client = sb()
  let q = client.from('v_expense_oversight').select('*').order('created_at', { ascending: false }).limit(200)
  if (filters?.status) q = q.eq('status', filters.status)
  const { data, error } = await q
  if (error) { gpError('GP-2605', error.message); return [] }
  return (data ?? []) as ExpenseOversightRow[]
}

export async function workflowTransition(instanceId: string, action: 'approve' | 'reject', comment: string): Promise<boolean> {
  const client = sb()
  const { error } = await client.rpc('workflow_transition', {
    p_instance: instanceId,
    p_action: action,
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
    .select('id, item_name, alert_type, message, created_at, acknowledged_at')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) { gpError('GP-2607', error.message); return [] }
  return (data ?? []) as InventoryAlertRow[]
}

export async function acknowledgeInventoryAlert(id: string): Promise<boolean> {
  const client = sb()
  const { error } = await client.rpc('acknowledge_inventory_alert', { p_alert: id })
  if (error) { gpError('GP-2608', error.message); return false }
  return true
}
