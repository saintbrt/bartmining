// generate-device-invitation — Sprint 5
// Generates a GOLD-XXXX device code and a 32-char random key.
// The raw key is returned ONCE to the caller; only the bcrypt hash is stored.
//
// Deploy: supabase functions deploy generate-device-invitation
//
// POST { site_id, team_id, label, role: 'field_team'|'supervisor', expires_hours?: number }
// Response: { device_code, device_key, invitation_id, expires_at }  or { error }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(4))
  return 'GOLD-' + Array.from(bytes).map(b => chars[b % chars.length]).join('')
}

function randomKey(len = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.getRandomValues(new Uint8Array(len))
  return Array.from(bytes).map(b => chars[b % chars.length]).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return Response.json({ error: 'Missing authorization header' }, { status: 401, headers: CORS })

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Verify caller is admin
    const userSb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { authorization: authHeader } } },
    )
    const { data: { user }, error: authErr } = await userSb.auth.getUser()
    if (authErr || !user) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })

    const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') {
      return Response.json({ error: 'Forbidden — admin role required' }, { status: 403, headers: CORS })
    }

    const body = await req.json()
    const { site_id, team_id, label, role = 'field_team', expires_hours = 168 } = body

    if (!site_id || !team_id || !label) {
      return Response.json({ error: 'site_id, team_id and label are required' }, { status: 400, headers: CORS })
    }

    // Generate code — retry up to 5 times on collision
    let device_code = ''
    for (let i = 0; i < 5; i++) {
      const candidate = randomCode()
      const { data: existing } = await sb.from('device_invitations').select('id').eq('device_code', candidate).single()
      if (!existing) { device_code = candidate; break }
    }
    if (!device_code) return Response.json({ error: 'Could not generate unique code — try again' }, { status: 500, headers: CORS })

    const rawKey = randomKey(32)
    const keyHash = await bcrypt.hash(rawKey)
    const expiresAt = new Date(Date.now() + expires_hours * 3600 * 1000).toISOString()

    const { data: inv, error: insertErr } = await sb.from('device_invitations').insert({
      site_id, team_id, device_code, device_key: keyHash,
      label, role, created_by: user.id, expires_at: expiresAt,
    }).select('id').single()

    if (insertErr) return Response.json({ error: insertErr.message }, { status: 500, headers: CORS })

    return Response.json({
      device_code,
      device_key: rawKey,   // raw key returned ONCE — never stored again
      invitation_id: inv.id,
      expires_at: expiresAt,
    }, { headers: CORS })

  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500, headers: CORS })
  }
})
