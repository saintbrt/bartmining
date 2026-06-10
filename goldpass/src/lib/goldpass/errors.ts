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
*/
export const GP_ERRORS: Record<string, string> = {
  'GP-2314': 'Supabase is not connected — NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are missing or invalid.',

  'GP-2101': 'Sign-in failed — credentials rejected or auth service unreachable.',
  'GP-2102': 'Google sign-in failed — OAuth provider error (check Google provider config in Supabase).',
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

  'GP-2401': 'AI service unreachable — gold-ai edge function not deployed or network error.',
  'GP-2402': 'AI returned an unusable response.',
  'GP-2403': 'AI is not configured — ANTHROPIC_API_KEY secret missing on the edge function.',

  'GP-2501': 'Export failed — output has no rows.',
  'GP-2502': 'Output download failed — stored data could not be fetched.',
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
