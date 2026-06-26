// location-update — receives a GPS ping from a paired field device and
// writes it to device_positions. Supabase Realtime then pushes the new
// row to any browser subscribed to that table (the Live Map page).
//
// Deploy:  supabase functions deploy location-update
//
// Request:
//   POST { lat, lng, accuracy_m?, altitude_m?, source? }
//   Authorization: Bearer <device_access_token>
//
// Response:
//   { ok: true, id: "<uuid>" }   — on success
//   { error: "..." }             — on failure

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    // ── 1. Verify the device JWT ───────────────────────────────────────────
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return Response.json({ error: 'Missing authorization header' }, { status: 401, headers: CORS })
    }

    const userSb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { authorization: authHeader } } },
    )
    const { data: { user }, error: authErr } = await userSb.auth.getUser()
    if (authErr || !user) {
      return Response.json({ error: 'Unauthorized — invalid or expired token' }, { status: 401, headers: CORS })
    }

    // ── 2. Parse and validate the body ────────────────────────────────────
    const body = await req.json().catch(() => null)
    if (!body) {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400, headers: CORS })
    }

    const { lat, lng, accuracy_m, altitude_m, source = 'gps' } = body

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return Response.json({ error: 'lat and lng are required numbers' }, { status: 400, headers: CORS })
    }
    if (lat < -90 || lat > 90) {
      return Response.json({ error: 'lat must be between -90 and 90' }, { status: 400, headers: CORS })
    }
    if (lng < -180 || lng > 180) {
      return Response.json({ error: 'lng must be between -180 and 180' }, { status: 400, headers: CORS })
    }
    if (!['gps', 'network', 'fused'].includes(source)) {
      return Response.json({ error: 'source must be gps, network, or fused' }, { status: 400, headers: CORS })
    }

    // ── 3. Look up the device's team_id from its profile ──────────────────
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: profile } = await sb
      .from('profiles')
      .select('team_id')
      .eq('id', user.id)
      .single()

    // ── 4. Insert the GPS position ─────────────────────────────────────────
    // Supabase Realtime picks this up and broadcasts to the Live Map browser.
    const { data: pos, error: insertErr } = await sb
      .from('device_positions')
      .insert({
        profile_id: user.id,
        team_id:    profile?.team_id ?? null,
        lat,
        lng,
        accuracy_m:  accuracy_m  ?? null,
        altitude_m:  altitude_m  ?? null,
        source,
      })
      .select('id')
      .single()

    if (insertErr) {
      return Response.json({ error: insertErr.message }, { status: 500, headers: CORS })
    }

    // ── 5. Update last_seen_at on the registered device ───────────────────
    await sb
      .from('registered_devices')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('profile_id', user.id)

    return Response.json({ ok: true, id: pos.id }, { headers: CORS })

  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500, headers: CORS })
  }
})
