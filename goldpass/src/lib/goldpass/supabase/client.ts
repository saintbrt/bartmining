import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  if (!url || !key) throw new Error('GP-2314: Supabase env vars are not configured.')
  return createBrowserClient(url, key)
}
