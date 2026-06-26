// validate-survey-photo
// Called by field app after photographing a drill hole.
// Creates the hole_survey row, calculates deviation from planned position,
// auto-approves/flags/rejects, and marks hole completed if approved.
//
// POST { hole_id, lat, lng, accuracy_m, photo_uri }
// Auth: Bearer <device_access_token>
// Response: { survey_id, status, deviation_m }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return Response.json({ error: 'Missing authorization header' }, { status: 401, headers: CORS })

    // Service client for writes
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // User client to verify JWT and get profile_id
    const sbUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user }, error: authErr } = await sbUser.auth.getUser()
    if (authErr || !user) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })

    const { hole_id, lat, lng, accuracy_m, photo_uri } = await req.json()
    if (!hole_id || lat == null || lng == null) {
      return Response.json({ error: 'hole_id, lat, lng are required' }, { status: 400, headers: CORS })
    }

    // Get hole planned coordinates
    const { data: hole, error: holeErr } = await sb
      .from('holes')
      .select('id, lat, lng, status')
      .eq('id', hole_id)
      .single()

    if (holeErr || !hole) return Response.json({ error: 'Hole not found' }, { status: 404, headers: CORS })
    if (hole.status === 'completed') return Response.json({ error: 'Hole already completed' }, { status: 409, headers: CORS })

    // Get profile_id from registered_devices
    const { data: device } = await sb
      .from('registered_devices')
      .select('profile_id')
      .eq('profile_id', user.id)
      .maybeSingle()

    const profileId = device?.profile_id ?? user.id

    // Calculate deviation
    const deviationM = Math.round(haversineM(hole.lat, hole.lng, lat, lng))

    let status: 'approved' | 'pending' | 'rejected'
    if (deviationM <= 30)       status = 'approved'
    else if (deviationM <= 100) status = 'pending'
    else                        status = 'rejected'

    // Insert survey record
    const { data: survey, error: surveyErr } = await sb
      .from('hole_surveys')
      .insert({
        hole_id,
        photo_lat:   lat,
        photo_lng:   lng,
        accuracy_m:  accuracy_m ?? null,
        photo_uri:   photo_uri ?? null,
        deviation_m: deviationM,
        status,
        surveyed_by: profileId,
      })
      .select('id')
      .single()

    if (surveyErr) return Response.json({ error: surveyErr.message }, { status: 500, headers: CORS })

    // Mark hole completed if approved or pending (field work is done)
    if (status !== 'rejected') {
      await sb.from('holes').update({ status: 'completed' }).eq('id', hole_id)
    }

    return Response.json({ survey_id: survey.id, status, deviation_m: deviationM }, { headers: CORS })

  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500, headers: CORS })
  }
})
