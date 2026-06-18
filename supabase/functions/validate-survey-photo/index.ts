// validate-survey-photo — Sprint 11
// Called after hole_surveys row is inserted by the mobile app.
// Computes GPS offset from hole center and auto-sets status.
//
// Deploy: supabase functions deploy validate-survey-photo
//
// POST { survey_id }
// Response: { status: 'approved'|'pending'|'rejected', offset_m: number }  or { error }
//
// Rules:
//   offset ≤ 30 m  → approved automatically
//   offset 30-100m → pending (flagged for manual review)
//   offset > 100 m → rejected automatically

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { survey_id } = await req.json()
    if (!survey_id) return Response.json({ error: 'survey_id is required' }, { status: 400, headers: CORS })

    // Load survey with hole coordinates
    const { data: survey, error: survErr } = await sb
      .from('hole_surveys')
      .select('id, photo_lat, photo_lng, hole_id, holes(lat, lng)')
      .eq('id', survey_id)
      .single()

    if (survErr || !survey) return Response.json({ error: 'Survey not found' }, { status: 404, headers: CORS })

    const hole = Array.isArray(survey.holes) ? survey.holes[0] : survey.holes as { lat: number; lng: number } | null
    if (!hole) return Response.json({ error: 'Hole coordinates not found' }, { status: 422, headers: CORS })

    const offsetM = haversineM(hole.lat, hole.lng, survey.photo_lat, survey.photo_lng)
    let status: 'approved' | 'pending' | 'rejected'
    if (offsetM <= 30) status = 'approved'
    else if (offsetM <= 100) status = 'pending'
    else status = 'rejected'

    await sb.from('hole_surveys').update({ status }).eq('id', survey_id)

    // If approved, mark hole as completed
    if (status === 'approved') {
      await sb.from('holes').update({ status: 'completed' }).eq('id', survey.hole_id)
    }

    return Response.json({ status, offset_m: Math.round(offsetM) }, { headers: CORS })

  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500, headers: CORS })
  }
})
