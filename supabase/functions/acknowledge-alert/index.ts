// acknowledge-alert
// Field device confirms receipt of a supervisor announcement.
// Idempotent — safe to call multiple times.
//
// POST { alert_id }
// Auth: Bearer <device_access_token>
// Response: { acknowledged: true }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return Response.json({ error: 'Missing authorization header' }, { status: 401, headers: CORS })

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const sbUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user }, error: authErr } = await sbUser.auth.getUser()
    if (authErr || !user) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS })

    const { alert_id } = await req.json()
    if (!alert_id) return Response.json({ error: 'alert_id is required' }, { status: 400, headers: CORS })

    // Upsert — ignore duplicate (idempotent)
    const { error } = await sb
      .from('alert_acknowledgments')
      .upsert(
        { alert_id, profile_id: user.id },
        { onConflict: 'alert_id,profile_id', ignoreDuplicates: true },
      )

    if (error) return Response.json({ error: error.message }, { status: 500, headers: CORS })

    return Response.json({ acknowledged: true }, { headers: CORS })

  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500, headers: CORS })
  }
})
