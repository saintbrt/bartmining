// claim-device — Sprint 6
// Field device submits GOLD-XXXX code + key + android_id on first launch.
// Validates credentials, creates Supabase auth user + profile, returns JWT.
//
// Deploy: supabase functions deploy claim-device
//
// POST { device_code, device_key, android_id, device_model?, app_version?, fcm_token?, bt_mac? }
// Response: { access_token, refresh_token, profile_id, team_id }  or { error }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { compareSync } from 'https://deno.land/x/bcrypt@v0.4.1/src/main.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { device_code, device_key, android_id, device_model, app_version, fcm_token, bt_mac } = await req.json()

    if (!device_code || !device_key || !android_id) {
      return Response.json({ error: 'device_code, device_key and android_id are required' }, { status: 400, headers: CORS })
    }

    // Load invitation
    const { data: inv, error: invErr } = await sb
      .from('device_invitations')
      .select('id, device_key, status, team_id, site_id, role, expires_at, claimed_by')
      .eq('device_code', device_code)
      .single()

    if (invErr || !inv) return Response.json({ error: 'Invalid device code' }, { status: 401, headers: CORS })
    if (inv.status === 'revoked') return Response.json({ error: 'Device code has been revoked' }, { status: 401, headers: CORS })
    if (new Date(inv.expires_at) < new Date()) return Response.json({ error: 'Device code has expired' }, { status: 401, headers: CORS })

    // Validate key against bcrypt hash
    const keyValid = compareSync(device_key, inv.device_key)
    if (!keyValid) return Response.json({ error: 'Invalid device key' }, { status: 401, headers: CORS })

    // Check if android_id already registered to a different invitation
    const { data: existingDevice } = await sb
      .from('registered_devices')
      .select('id, profile_id')
      .eq('android_id', android_id)
      .single()

    let profileId: string

    if (existingDevice) {
      // Device already registered — just return fresh JWT for the profile
      profileId = existingDevice.profile_id
    } else {
      // First claim — create auth user + profile
      if (inv.claimed_by) {
        // Invitation already claimed by another device
        return Response.json({ error: 'Device code already claimed by another device' }, { status: 409, headers: CORS })
      }

      const email = `device-${device_code.toLowerCase()}@goldpass.internal`
      const password = device_key + android_id  // deterministic but only known to device

      const { data: newUser, error: createErr } = await sb.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { device_code, android_id, role: inv.role },
      })
      if (createErr || !newUser.user) {
        return Response.json({ error: createErr?.message ?? 'Failed to create user' }, { status: 500, headers: CORS })
      }

      profileId = newUser.user.id

      // Create profile row
      await sb.from('profiles').upsert({
        id: profileId,
        email,
        role: inv.role,
        team_id: inv.team_id,
      })

      // Register device
      await sb.from('registered_devices').insert({
        profile_id: profileId,
        invitation_id: inv.id,
        android_id,
        device_model: device_model ?? null,
        app_version: app_version ?? null,
        fcm_token: fcm_token ?? null,
        bt_mac: bt_mac ?? null,
        status: 'active',
      })

      // Mark invitation as claimed
      await sb.from('device_invitations').update({
        status: 'active',
        claimed_by: profileId,
        claimed_at: new Date().toISOString(),
      }).eq('id', inv.id)
    }

    // Update last_seen and optional fields if provided
    await sb.from('registered_devices').update({
      last_seen_at: new Date().toISOString(),
      ...(fcm_token ? { fcm_token } : {}),
      ...(app_version ? { app_version } : {}),
    }).eq('profile_id', profileId).eq('android_id', android_id)

    // Sign in to get session tokens
    const email = `device-${device_code.toLowerCase()}@goldpass.internal`
    const password = device_key + android_id
    const { data: session, error: signInErr } = await sb.auth.signInWithPassword({ email, password })

    if (signInErr || !session.session) {
      return Response.json({ error: 'Authentication failed after registration' }, { status: 500, headers: CORS })
    }

    return Response.json({
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
      profile_id: profileId,
      team_id: inv.team_id,
    }, { headers: CORS })

  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500, headers: CORS })
  }
})
