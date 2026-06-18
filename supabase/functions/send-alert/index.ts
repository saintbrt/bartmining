// send-alert — Sprint 12
// Sends a Radio Call push notification to target devices via FCM HTTP v1 API.
// Called after explore_alerts row is inserted by the dashboard.
//
// Deploy: supabase functions deploy send-alert
// Secrets: FCM_PROJECT_ID, FCM_SERVICE_ACCOUNT_JSON (full service account JSON string)
//
// POST { alert_id }  — fetches the alert row and dispatches FCM to target devices
// Response: { sent: number, failed: number, delivery_status }  or { error }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function getFcmAccessToken(serviceAccountJson: string): Promise<string> {
  const sa = JSON.parse(serviceAccountJson)
  const now = Math.floor(Date.now() / 1000)
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const payload = btoa(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  // Import private key
  const keyData = sa.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '')
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0))
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )
  const sigData = new TextEncoder().encode(`${header}.${payload}`)
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, sigData)
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const jwt = `${header}.${payload}.${sigB64}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })
  const tokenData = await tokenRes.json()
  return tokenData.access_token
}

async function sendFcmMessage(
  accessToken: string,
  projectId: string,
  fcmToken: string,
  title: string,
  body: string,
  priority: 'normal' | 'urgent',
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: {
        token: fcmToken,
        notification: { title, body },
        android: {
          priority: priority === 'urgent' ? 'high' : 'normal',
          notification: {
            channel_id: 'explore_alerts',
            sound: priority === 'urgent' ? 'radio_call' : 'default',
            notification_priority: priority === 'urgent' ? 'PRIORITY_HIGH' : 'PRIORITY_DEFAULT',
          },
        },
        data: { priority, type: 'explore_alert' },
      },
    }),
  })
  if (res.ok) return { success: true }
  const err = await res.json()
  return { success: false, error: err.error?.message ?? 'FCM error' }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return Response.json({ error: 'Missing authorization' }, { status: 401, headers: CORS })

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const fcmProjectId = Deno.env.get('FCM_PROJECT_ID')
    const fcmServiceAccount = Deno.env.get('FCM_SERVICE_ACCOUNT_JSON')
    if (!fcmProjectId || !fcmServiceAccount) {
      return Response.json({ error: 'FCM not configured — set FCM_PROJECT_ID and FCM_SERVICE_ACCOUNT_JSON secrets' }, { status: 500, headers: CORS })
    }

    const { alert_id } = await req.json()
    if (!alert_id) return Response.json({ error: 'alert_id is required' }, { status: 400, headers: CORS })

    // Load alert
    const { data: alert, error: alertErr } = await sb
      .from('explore_alerts')
      .select('id, message, priority, target_type, target_id, site_id')
      .eq('id', alert_id)
      .single()
    if (alertErr || !alert) return Response.json({ error: 'Alert not found' }, { status: 404, headers: CORS })

    // Collect target FCM tokens
    let query = sb
      .from('registered_devices')
      .select('id, fcm_token, profile_id')
      .eq('status', 'active')
      .not('fcm_token', 'is', null)

    if (alert.target_type === 'team' && alert.target_id) {
      // Get profile_ids for that team
      const { data: invs } = await sb
        .from('device_invitations')
        .select('claimed_by')
        .eq('team_id', alert.target_id)
        .eq('status', 'active')
      const profileIds = (invs ?? []).map((i: { claimed_by: string | null }) => i.claimed_by).filter(Boolean)
      query = query.in('profile_id', profileIds)
    } else if (alert.target_type === 'individual' && alert.target_id) {
      query = query.eq('profile_id', alert.target_id)
    }
    // 'all' — no additional filter

    const { data: devices } = await query
    const targets = devices ?? []

    const accessToken = await getFcmAccessToken(fcmServiceAccount)
    const title = alert.priority === 'urgent' ? '🚨 URGENT ALERT' : '📢 Radio Call'
    const deliveryStatus: Record<string, string> = {}
    let sent = 0, failed = 0

    await Promise.all(targets.map(async (d: { id: string; fcm_token: string }) => {
      const result = await sendFcmMessage(accessToken, fcmProjectId, d.fcm_token, title, alert.message, alert.priority as 'normal' | 'urgent')
      deliveryStatus[d.id] = result.success ? 'delivered' : (result.error ?? 'failed')
      if (result.success) sent++; else failed++
    }))

    // Update delivery_status on the alert row
    await sb.from('explore_alerts').update({ delivery_status: deliveryStatus }).eq('id', alert_id)

    return Response.json({ sent, failed, delivery_status: deliveryStatus }, { headers: CORS })

  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500, headers: CORS })
  }
})
