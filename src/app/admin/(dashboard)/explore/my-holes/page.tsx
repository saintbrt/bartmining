'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/goldpass/supabase/client'

type Hole = {
  id: string
  hole_id: string
  row_num: number
  col_num: number
  lat: number
  lng: number
  status: 'pending' | 'in_progress' | 'completed' | 'flagged'
  team_name: string | null
  last_survey: string | null
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'var(--label-4)',
  in_progress: 'var(--blue)',
  completed: 'var(--green)',
  flagged: 'var(--orange)',
}

export default function MyHolesPage() {
  const [holes, setHoles] = useState<Hole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const sb = createClient()
        const { data: holesData, error: holesErr } = await sb
          .from('holes')
          .select('id, hole_id, row_num, col_num, lat, lng, status')
          .order('row_num').order('col_num')

        if (holesErr) throw holesErr

        const { data: assignData } = await sb
          .from('assignments')
          .select('hole_id, explore_teams(name)')

        const { data: surveyData } = await sb
          .from('hole_surveys')
          .select('hole_id, submitted_at')
          .order('submitted_at', { ascending: false })

        if (!alive) return

        const teamMap = new Map<string, string>()
        ;(assignData ?? []).forEach((a: { hole_id: string; explore_teams: unknown }) => {
          const t = a.explore_teams as { name: string } | null
          if (t && !Array.isArray(t)) teamMap.set(a.hole_id, t.name)
        })

        const surveyMap = new Map<string, string>()
        ;(surveyData ?? []).forEach((s: { hole_id: string; submitted_at: string }) => {
          if (!surveyMap.has(s.hole_id)) surveyMap.set(s.hole_id, s.submitted_at)
        })

        setHoles((holesData ?? []).map((h: { id: string; hole_id: string; row_num: number; col_num: number; lat: number; lng: number; status: string }) => ({
          ...h,
          status: h.status as Hole['status'],
          team_name: teamMap.get(h.id) ?? null,
          last_survey: surveyMap.get(h.id) ?? null,
        })))
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : String(e))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const visible = holes.filter(h => {
    if (statusFilter !== 'all' && h.status !== statusFilter) return false
    if (filter && !h.hole_id.toLowerCase().includes(filter.toLowerCase())) return false
    return true
  })

  return (
    <div className="content content-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>My Holes</h2>
          <p style={{ fontSize: 12, color: 'var(--label-3)' }}>{holes.length.toLocaleString()} holes total.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="input" style={{ fontSize: 12 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="flagged">Flagged</option>
          </select>
          <input className="input" style={{ width: 180, fontSize: 12 }} placeholder="Search hole ID…"
            value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
      </div>

      {error && <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 16 }}>{error}</div>}

      <div className="card">
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 32, textAlign: 'center' }}>Loading holes…</div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: 600 }}>
            <table className="tbl tbl-card" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Hole ID</th>
                  <th>Row</th>
                  <th>Col</th>
                  <th>Lat</th>
                  <th>Lng</th>
                  <th>Team</th>
                  <th>Status</th>
                  <th>Last Survey</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>
                    {holes.length === 0 ? 'No holes yet. Generate the hole grid from the Assignments tab.' : 'No holes match the current filter.'}
                  </td></tr>
                ) : visible.map(h => (
                  <tr key={h.id}>
                    <td data-label="Hole ID" style={{ fontFamily: 'monospace', fontWeight: 600 }}>{h.hole_id}</td>
                    <td data-label="Row">{h.row_num}</td>
                    <td data-label="Col">{h.col_num}</td>
                    <td data-label="Lat" style={{ fontFamily: 'monospace' }}>{h.lat.toFixed(6)}</td>
                    <td data-label="Lng" style={{ fontFamily: 'monospace' }}>{h.lng.toFixed(6)}</td>
                    <td data-label="Team">{h.team_name ?? <span style={{ color: 'var(--label-4)' }}>Unassigned</span>}</td>
                    <td data-label="Status">
                      <span style={{ color: STATUS_COLOR[h.status], fontWeight: 500 }}>
                        {h.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td data-label="Last Survey" style={{ color: 'var(--label-4)' }}>
                      {h.last_survey ? new Date(h.last_survey).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
