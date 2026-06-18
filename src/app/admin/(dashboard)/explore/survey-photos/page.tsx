'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/goldpass/supabase/client'
import { notify } from '@/lib/goldpass/notify'

type Survey = {
  id: string
  photo_url: string
  photo_lat: number
  photo_lng: number
  photo_accuracy_m: number | null
  notes: string | null
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  hole_id: string
  hole_label: string
  team_name: string
  gps_offset_m: number | null
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function offsetColor(m: number | null) {
  if (m === null) return 'var(--label-4)'
  if (m <= 30) return 'var(--green)'
  if (m <= 100) return 'var(--orange)'
  return 'var(--red)'
}

export default function SurveyPhotosPage() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [updating, setUpdating] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const sb = createClient()
      const { data, error } = await sb
        .from('hole_surveys')
        .select(`
          id, photo_url, photo_lat, photo_lng, photo_accuracy_m, notes, status, submitted_at,
          hole_id,
          holes(hole_id, lat, lng),
          explore_teams(name)
        `)
        .order('submitted_at', { ascending: false })
        .limit(100)

      if (error) throw error

      setSurveys((data ?? []).map((raw: Record<string, unknown>) => {
        const s = raw as {
          id: string; photo_url: string; photo_lat: number; photo_lng: number;
          photo_accuracy_m: number | null; notes: string | null; status: string;
          submitted_at: string; hole_id: string; holes: unknown; explore_teams: unknown
        }
        const holes = (Array.isArray(s.holes) ? s.holes[0] : s.holes) as { hole_id: string; lat: number; lng: number } | null
        const team = (Array.isArray(s.explore_teams) ? s.explore_teams[0] : s.explore_teams) as { name: string } | null
        const holeLat = holes?.lat
        const holeLng = holes?.lng
        const offset = holeLat != null && holeLng != null
          ? haversineM(holeLat, holeLng, s.photo_lat, s.photo_lng)
          : null
        return {
          id: s.id,
          photo_url: s.photo_url,
          photo_lat: s.photo_lat,
          photo_lng: s.photo_lng,
          photo_accuracy_m: s.photo_accuracy_m,
          notes: s.notes,
          status: s.status as Survey['status'],
          submitted_at: s.submitted_at,
          hole_id: s.hole_id,
          hole_label: holes?.hole_id ?? '—',
          team_name: team?.name ?? '—',
          gps_offset_m: offset != null ? Math.round(offset) : null,
        }
      }))
    } catch (e) {
      notify('error', e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setUpdating(id)
    const sb = createClient()
    const { data: me } = await sb.auth.getUser()
    const { error } = await sb.from('hole_surveys').update({
      status, reviewed_by: me.user?.id, reviewed_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) { notify('error', error.message); setUpdating(null); return }
    setSurveys(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    setUpdating(null)
    notify('success', `Survey ${status}.`)
  }

  const visible = surveys.filter(s => statusFilter === 'all' || s.status === statusFilter)

  return (
    <div className="content content-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Survey Photos</h2>
          <p style={{ fontSize: 12, color: 'var(--label-3)' }}>
            Auto-approved ≤30 m · Flagged 30–100 m · Auto-rejected &gt;100 m from hole center.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all','pending','approved','rejected'] as StatusFilter[]).map(s => (
            <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 32, textAlign: 'center' }}>Loading photos…</div>
      ) : visible.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--label-4)', fontSize: 12 }}>
          {surveys.length === 0 ? 'No photos submitted yet.' : 'No photos match this filter.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {visible.map(s => (
            <div key={s.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', background: 'var(--bg-3)', height: 180 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.photo_url} alt={`Survey ${s.hole_label}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <span style={{
                  position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 600, padding: '2px 8px',
                  borderRadius: 6, background: s.status === 'approved' ? 'var(--green)' : s.status === 'rejected' ? 'var(--red)' : 'var(--orange)',
                  color: '#fff',
                }}>{s.status}</span>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>{s.hole_label}</span>
                  <span style={{ fontSize: 11, color: 'var(--label-4)' }}>{s.team_name}</span>
                </div>
                <div style={{ fontSize: 11, color: offsetColor(s.gps_offset_m), marginBottom: 6 }}>
                  GPS offset: {s.gps_offset_m != null ? `${s.gps_offset_m} m` : '—'}
                  {s.photo_accuracy_m != null && ` (±${Math.round(s.photo_accuracy_m)} m)`}
                </div>
                {s.notes && <div style={{ fontSize: 11, color: 'var(--label-3)', marginBottom: 8 }}>{s.notes}</div>}
                <div style={{ fontSize: 10, color: 'var(--label-4)', marginBottom: 10 }}>{new Date(s.submitted_at).toLocaleString()}</div>
                {s.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} disabled={updating === s.id}
                      onClick={() => updateStatus(s.id, 'approved')}>Approve</button>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1, color: 'var(--red)' }} disabled={updating === s.id}
                      onClick={() => updateStatus(s.id, 'rejected')}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
