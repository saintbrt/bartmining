'use client'

import { createClient } from './supabase/client'
import { gpError } from './errors'

/* Slim auth for the admin panel. Extracted from the old drill db module so the
   drill code can be deleted. Supabase email/password only. */

export type AuthUser = { id: string; email: string } | null

function sb() { return createClient() }

export function ready(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON)
}

export async function signIn(email: string, password: string): Promise<{ user: AuthUser; error: string | null }> {
  if (!ready()) return { user: null, error: gpError('GP-2314', 'Unable to log in') }
  try {
    const { data, error } = await sb().auth.signInWithPassword({ email: email.trim(), password })
    if (error) { gpError('GP-2101', error.message); return { user: null, error: error.message } }
    return { user: { id: data.user.id, email: data.user.email! }, error: null }
  } catch (e) {
    return { user: null, error: gpError('GP-2101', e instanceof Error ? e.message : String(e)) }
  }
}

export async function restoreSession(): Promise<AuthUser> {
  if (!ready()) { gpError('GP-2314', 'Session restore skipped'); return null }
  try {
    const { data, error } = await sb().auth.getSession()
    if (error) { gpError('GP-2103', error.message); return null }
    const u = data?.session?.user
    return u ? { id: u.id, email: u.email! } : null
  } catch (e) {
    gpError('GP-2103', e instanceof Error ? e.message : String(e))
    return null
  }
}

export async function signOut(): Promise<void> {
  try { await sb().auth.signOut() } catch (e) { gpError('GP-2104', e instanceof Error ? e.message : String(e)) }
}
