// send-fcm-notification
// Sends a Firebase Cloud Messaging push notification to one or more devices.
// Called internally by other edge functions or via Supabase Database Webhooks.
//
// Requires secret: FCM_SERVER_KEY (Firebase project Settings → Cloud Messaging → Server Key)
//
// POST { tokens: string[], title: string, body: string, data?: Record<string, string> }
// Response: { sent: number, failed: number }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const FCM_KEY = Deno.env.get('FCM_SERVER_KEY')
    if (!FCM_KEY) return Response.json({ error: 'FCM_SERVER_KEY not configured' }, { status: 500, headers: CORS })

    const { tokens, title, body, data } = await req.json() as {
      tokens: string[]
      title:  string
      body:   string
      data?:  Record<string, string>
    }

    if (!tokens?.length || !title || !body) {
      return Response.json({ error: 'tokens, title, body are required' }, { status: 400, headers: CORS })
    }

    // FCM allows max 500 tokens per request — batch if needed
    const BATCH = 500
    let sent = 0, failed = 0

    for (let i = 0; i < tokens.length; i += BATCH) {
      const batch = tokens.slice(i, i + BATCH)

      const payload = {
        registration_ids: batch,
        notification: { title, body, sound: 'default' },
        priority: 'high',
        ...(data ? { data } : {}),
      }

      const res = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${FCM_KEY}`,
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const result = await res.json()
        sent   += result.success  ?? 0
        failed += result.failure  ?? 0
      } else {
        failed += batch.length
      }
    }

    return Response.json({ sent, failed }, { headers: CORS })

  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500, headers: CORS })
  }
})
