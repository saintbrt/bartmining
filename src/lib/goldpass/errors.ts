'use client'

import { notify } from './notify'

/* GoldPass error-code registry.
   Every failure surfaced to the user carries one of these codes so it can be
   traced back here (and in ARCHITECTURE.md) when debugging.

   20xx — configuration / environment
   21xx — authentication
   22xx — data persistence (Supabase writes/reads)
   23xx — SQL workbench engine
   24xx — AI (gold-ai edge function)
   25xx — outputs / export
   26xx — Operations/ERP oversight (expenses, inventory — goldpass-field schema)
*/
export const GP_ERRORS: Record<string, string> = {
  'GP-2314': 'Supabase is not connected — NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON are missing or invalid.',

  'GP-2101': 'Sign-in failed — credentials rejected or auth service unreachable.',
  'GP-2103': 'Session restore failed — stored session is invalid or Supabase unreachable.',
  'GP-2104': 'Sign-out failed to reach Supabase (local session was cleared anyway).',
  'GP-2105': 'Signed in, but no access to GoldPass tables — check RLS policies (run supabase/setup.sql).',

  'GP-2201': 'Project failed to save to the database.',
  'GP-2202': 'Table import failed to save to the database.',
  'GP-2203': 'Row update failed to save to the database.',
  'GP-2204': 'Table delete failed to reach the database.',
  'GP-2205': 'Audit log entry failed to save.',
  'GP-2206': 'Output failed to save to the database.',
  'GP-2207': 'Stage status failed to save to the database.',
  'GP-2208': 'Bootstrap failed — could not load projects/tables from the database.',
  'GP-2209': 'Version record failed to save.',

  'GP-2301': 'SQL could not be parsed — unsupported syntax.',
  'GP-2302': 'Table named in the query does not exist on this workbench.',
  'GP-2303': 'Column named in the query does not exist in the table.',
  'GP-2304': 'WHERE clause is invalid.',
  'GP-2305': 'Backend data check failed — RPC returned an error (check supabase/setup.sql RPCs are installed).',
  'GP-2306': 'Data anomaly flagged during combine & dedupe — manual review recommended.',

  'GP-2401': 'AI service unreachable — gold-ai edge function not deployed or network error.',
  'GP-2402': 'AI returned an unusable response.',
  'GP-2403': 'AI is not configured — ANTHROPIC_API_KEY secret missing on the edge function.',
  'GP-2410': 'AI usage record failed to save (token meter may be incomplete).',
  'GP-2411': 'Workbench layout failed to save — session resume may be out of date.',

  'GP-2501': 'Export failed — output has no rows.',
  'GP-2502': 'Output download failed — stored data could not be fetched.',

  'GP-2601': 'Pending approvals count failed to load.',
  'GP-2602': 'Open inventory alerts count failed to load.',
  'GP-2603': 'Stock levels failed to load.',
  'GP-2604': 'Expense spend (month-to-date) failed to load.',
  'GP-2605': 'Expense oversight list failed to load.',
  'GP-2606': 'Approval decision failed to reach the workflow engine.',
  'GP-2607': 'Inventory alerts failed to load.',
  'GP-2608': 'Failed to acknowledge inventory alert.',
  'GP-2609': 'Master data list failed to load.',
  'GP-2610': 'Master data row failed to save.',
  'GP-2611': 'Master data row failed to delete.',
  'GP-2612': 'Sync conflicts failed to load.',
  'GP-2613': 'Failed to resolve sync conflict.',
  'GP-2614': 'Shift log oversight list failed to load.',
  'GP-2615': 'Equipment registry failed to load.',
  'GP-2616': 'Equipment failed to save.',
  'GP-2617': 'Equipment utilization failed to load.',
  'GP-2618': 'Daily ops summary failed to load.',
  'GP-2619': 'User/profile list failed to load.',
  'GP-2620': 'Failed to update user role.',
  'GP-2621': 'Procurement pipeline failed to load.',
  'GP-2622': 'Failed to convert purchase request to purchase order.',
  'GP-2623': 'Audit log failed to load.',
  'GP-2624': 'Sales register failed to load.',
  'GP-2625': 'Attendance records failed to load.',
  'GP-2626': 'Failed to confirm attendance record.',
  'GP-2627': 'Payroll adjustments failed to load.',
  'GP-2628': 'Payroll runs failed to load.',
  'GP-2629': 'Failed to generate payroll preview.',
  'GP-2630': 'Failed to lock payroll run.',
  'GP-2631': 'Labor cost by cost centre failed to load.',
  'GP-2632': 'Executive KPIs failed to load.',
  'GP-2633': 'Failed to refresh executive reporting views.',
  'GP-2634': 'Manager scorecard failed to load.',
  'GP-2635': 'Month-end closes failed to load.',
  'GP-2636': 'Failed to initiate month-end close.',
  'GP-2637': 'Failed to create monthly snapshot.',
  'GP-2638': 'Failed to finalize month-end close.',
  'GP-2639': 'Monthly snapshots failed to load.',
  'GP-2640': 'Failed to amend monthly snapshot.',
  'GP-2641': 'Site report config failed to load.',
  'GP-2642': 'Site report config failed to save.',
  'GP-2643': 'Failed to update user name.',
  'GP-2644': 'Failed to record sale.',
}

/** Log + toast a coded error. Returns the human-readable meaning. */
export function gpError(code: string, detail?: string): string {
  const meaning = GP_ERRORS[code] ?? 'Unknown error code.'
  notify('error', detail ? `${meaning} (${detail})` : meaning, code)
  return meaning
}

export function gpWarn(code: string, detail?: string): string {
  const meaning = GP_ERRORS[code] ?? 'Unknown error code.'
  notify('warn', detail ? `${meaning} (${detail})` : meaning, code)
  return meaning
}
