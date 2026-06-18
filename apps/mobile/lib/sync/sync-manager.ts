// SyncManager — Sprint 8
// Batches local SQLite records → Supabase.
// Called on app foreground, every 30s via background-fetch, and after any submission.
import { getUnsynced, markSynced } from '../offline/local-db'
import { supabase } from '../supabase/client'
import * as FileSystem from 'expo-file-system'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!

let syncing = false

export async function sync(): Promise<{ positions: number; surveys: number; holeStatus: number }> {
  if (syncing) return { positions: 0, surveys: 0, holeStatus: 0 }
  syncing = true
  const result = { positions: 0, surveys: 0, holeStatus: 0 }

  try {
    const { positions, surveys, holeStatus } = await getUnsynced()

    // --- Positions ---
    if (positions.length) {
      const rows = positions.map(p => ({
        profile_id: p.profile_id as string,
        team_id: p.team_id as string | null,
        lat: p.lat as number,
        lng: p.lng as number,
        accuracy_m: p.accuracy_m as number | null,
        altitude_m: p.altitude_m as number | null,
        source: p.source as string,
        recorded_at: p.recorded_at as string,
      }))
      const { error } = await supabase.from('device_positions').insert(rows)
      if (!error) {
        await markSynced('local_positions', positions.map(p => p.id as number))
        result.positions = positions.length
      }
    }

    // --- Surveys (one by one — photo upload then row insert) ---
    for (const s of surveys) {
      try {
        const localPath = s.local_path as string
        const fileName = `survey_${s.hole_id}_${Date.now()}.jpg`
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) break

        // Upload photo to Supabase Storage
        const fileContent = await FileSystem.readAsStringAsync(localPath, { encoding: 'base64' })
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/survey-photos/${fileName}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'image/jpeg',
            'x-upsert': 'false',
          },
          body: Uint8Array.from(atob(fileContent), c => c.charCodeAt(0)),
        })
        if (!res.ok) continue

        const photoUrl = `${SUPABASE_URL}/storage/v1/object/public/survey-photos/${fileName}`

        // Insert hole_surveys row
        const { data: row, error: survErr } = await supabase.from('hole_surveys').insert({
          hole_id: s.hole_id,
          team_id: s.team_id,
          submitted_by: session.user.id,
          photo_url: photoUrl,
          photo_lat: s.photo_lat,
          photo_lng: s.photo_lng,
          photo_accuracy_m: s.accuracy_m,
          notes: s.notes,
          synced_offline: true,
        }).select('id').single()

        if (!survErr && row) {
          // Call validate-survey-photo Edge Function
          fetch(`${SUPABASE_URL}/functions/v1/validate-survey-photo`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ survey_id: row.id }),
          })
          await markSynced('local_surveys', [s.id as number])
          result.surveys++
        }
      } catch { /* continue to next survey */ }
    }

    // --- Hole status changes ---
    if (holeStatus.length) {
      for (const h of holeStatus) {
        const { error } = await supabase.from('holes')
          .update({ status: h.status })
          .eq('id', h.hole_id)
        if (!error) {
          await markSynced('local_hole_status', [h.id as number])
          result.holeStatus++
        }
      }
    }
  } finally {
    syncing = false
  }

  return result
}
