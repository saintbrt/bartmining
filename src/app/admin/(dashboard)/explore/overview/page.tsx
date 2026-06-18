'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/goldpass/supabase/client'
import { notify } from '@/lib/goldpass/notify'

type Site = { id: string; name: string; total_rows: number; total_cols: number; origin_lat: number; origin_lng: number; row_spacing_m: number; col_spacing_m: number }
type Team = { id: string; name: string; color_hex: string; site_id: string }
type Stats = { activeTeams: number; holesThisWeek: number; photosPending: number; alertsSent: number }
type TeamRow = { id: string; name: string; color_hex: string; completed: number; total: number }
type Alert = { id: string; message: string; priority: string; created_at: string; target_type: string }

const TEAM_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

function SiteSetupCard({ onCreated }: { onCreated: (site: Site) => void }) {
  const [name, setName] = useState('')
  const [originLat, setOriginLat] = useState('')
  const [originLng, setOriginLng] = useState('')
  const [rows, setRows] = useState('100')
  const [cols, setCols] = useState('100')
  const [rowSpacing, setRowSpacing] = useState('100')
  const [colSpacing, setColSpacing] = useState('100')
  const [saving, setSaving] = useState(false)

  async function create() {
    if (!name.trim() || !originLat || !originLng) { notify('warn', 'Site name, origin latitude and longitude are required.'); return }
    setSaving(true)
    try {
      const sb = createClient()
      const { data: me } = await sb.auth.getUser()
      const { data, error } = await sb.from('sites').insert({
        name: name.trim(),
        origin_lat: parseFloat(originLat),
        origin_lng: parseFloat(originLng),
        total_rows: parseInt(rows) || 100,
        total_cols: parseInt(cols) || 100,
        row_spacing_m: parseFloat(rowSpacing) || 100,
        col_spacing_m: parseFloat(colSpacing) || 100,
        created_by: me.user?.id,
      }).select().single()
      if (error) throw error
      notify('success', `Site "${name.trim()}" created.`)
      onCreated(data as Site)
    } catch (e) {
      notify('error', e instanceof Error ? e.message : String(e))
    } finally { setSaving(false) }
  }

  return (
    <div className="card" style={{ maxWidth: 600, marginBottom: 24, borderColor: 'var(--gold)', borderWidth: 1 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>◎</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Create your first site</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 2 }}>A site defines the exploration grid — origin coordinates, row/column count and spacing.</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Site name</div>
          <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Singida Block A" />
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Origin latitude</div>
          <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={originLat} onChange={e => setOriginLat(e.target.value)} placeholder="-6.400000" />
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Origin longitude</div>
          <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={originLng} onChange={e => setOriginLng(e.target.value)} placeholder="34.800000" />
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Rows × Cols</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input className="input" style={{ flex: 1 }} value={rows} onChange={e => setRows(e.target.value)} placeholder="100" />
            <span style={{ lineHeight: '36px', color: 'var(--label-4)', fontSize: 13 }}>×</span>
            <input className="input" style={{ flex: 1 }} value={cols} onChange={e => setCols(e.target.value)} placeholder="100" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Spacing (m): row / col</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input className="input" style={{ flex: 1 }} value={rowSpacing} onChange={e => setRowSpacing(e.target.value)} placeholder="100" />
            <input className="input" style={{ flex: 1 }} value={colSpacing} onChange={e => setColSpacing(e.target.value)} placeholder="100" />
          </div>
        </div>
      </div>
      <button className="btn btn-primary btn-sm" onClick={create} disabled={saving}>{saving ? 'Creating…' : 'Create site'}</button>
    </div>
  )
}

function TeamSetupCard({ site, teams, onTeamAdded }: { site: Site; teams: Team[]; onTeamAdded: (t: Team) => void }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(TEAM_COLORS[0])
  const [saving, setSaving] = useState(false)

  async function addTeam() {
    if (!name.trim()) { notify('warn', 'Enter a team name.'); return }
    setSaving(true)
    try {
      const sb = createClient()
      const { data, error } = await sb.from('explore_teams').insert({ site_id: site.id, name: name.trim(), color_hex: color }).select().single()
      if (error) throw error
      notify('success', `Team "${name.trim()}" added.`)
      setName('')
      onTeamAdded(data as Team)
    } catch (e) {
      notify('error', e instanceof Error ? e.message : String(e))
    } finally { setSaving(false) }
  }

  async function deleteTeam(id: string, teamName: string) {
    if (!window.confirm(`Delete team "${teamName}"? This will also remove all their assignments.`)) return
    const sb = createClient()
    const { error } = await sb.from('explore_teams').delete().eq('id', id)
    if (error) { notify('error', error.message); return }
    notify('info', `Team "${teamName}" deleted.`)
  }

  return (
    <div className="card" style={{ maxWidth: 600, marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Teams — {site.name}</div>
      <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 14 }}>Add field teams. Each team gets assigned holes per week and appears on the Live Map.</div>

      {teams.filter(t => t.site_id === site.id).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {teams.filter(t => t.site_id === site.id).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: 'var(--bg-3)', borderRadius: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.color_hex, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13 }}>{t.name}</span>
              <button className="btn-icon" style={{ fontSize: 10, color: 'var(--red)' }} onClick={() => deleteTeam(t.id, t.name)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input className="input" style={{ flex: 1, minWidth: 140 }} value={name} onChange={e => setName(e.target.value)} placeholder="Team name…" />
        <div style={{ display: 'flex', gap: 4 }}>
          {TEAM_COLORS.map(c => (
            <div key={c} onClick={() => setColor(c)} style={{ width: 18, height: 18, borderRadius: '50%', background: c, cursor: 'pointer', border: color === c ? '2px solid #fff' : '2px solid transparent', boxSizing: 'border-box' }} />
          ))}
        </div>
        <button className="btn btn-primary btn-sm" onClick={addTeam} disabled={saving || !name.trim()}>{saving ? 'Adding…' : '+ Add team'}</button>
      </div>
    </div>
  )
}

export default function ExploreOverviewPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [teamRows, setTeamRows] = useState<TeamRow[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sb = createClient()
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekStartStr = weekStart.toISOString().slice(0, 10)

      const [sitesRes, teamsRes, photosRes, alertsRes, assignmentsRes, holesRes] = await Promise.all([
        sb.from('sites').select('id, name, total_rows, total_cols, origin_lat, origin_lng, row_spacing_m, col_spacing_m'),
        sb.from('explore_teams').select('id, name, color_hex, site_id'),
        sb.from('hole_surveys').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        sb.from('explore_alerts').select('id, message, priority, created_at, target_type').order('created_at', { ascending: false }).limit(5),
        sb.from('assignments').select('hole_id, team_id').gte('week_start', weekStartStr),
        sb.from('holes').select('id, status'),
      ])

      const teamList = teamsRes.data ?? []
      setSites(sitesRes.data ?? [])
      setTeams(teamList)

      const rows: TeamRow[] = teamList.map((t: Team) => {
        const assigned = (assignmentsRes.data ?? []).filter((a: { team_id: string }) => a.team_id === t.id)
        const assignedIds = new Set(assigned.map((a: { hole_id: string }) => a.hole_id))
        const completed = (holesRes.data ?? []).filter((h: { id: string; status: string }) => assignedIds.has(h.id) && h.status === 'completed').length
        return { id: t.id, name: t.name, color_hex: t.color_hex, completed, total: assignedIds.size }
      })
      setTeamRows(rows)
      setAlerts(alertsRes.data ?? [])
      setStats({
        activeTeams: rows.filter(r => r.total > 0).length,
        holesThisWeek: (assignmentsRes.data ?? []).length,
        photosPending: photosRes.count ?? 0,
        alertsSent: (alertsRes.data ?? []).length,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const activeSite = sites[0] ?? null

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Explore — Overview</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Field exploration tracking. Monitor teams, holes, alerts and devices.</p>
      </div>

      {error && <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 16 }}>{error}</div>}

      {/* Setup section — shown when no site exists */}
      {!loading && sites.length === 0 && (
        <SiteSetupCard onCreated={site => { setSites([site]); load() }} />
      )}
      {!loading && sites.length > 0 && (
        <TeamSetupCard site={activeSite!} teams={teams} onTeamAdded={t => { setTeams(prev => [...prev, t]); load() }} />
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Active teams',    value: stats?.activeTeams,   color: 'var(--blue)' },
          { label: 'Holes this week', value: stats?.holesThisWeek, color: 'var(--green)' },
          { label: 'Photos pending',  value: stats?.photosPending, color: 'var(--orange)' },
          { label: 'Alerts sent',     value: stats?.alertsSent,    color: 'var(--purple)' },
        ].map(k => (
          <div key={k.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color }}>{loading ? '…' : (k.value ?? 0).toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Site info strip */}
      {activeSite && (
        <div className="card" style={{ marginBottom: 16, display: 'flex', gap: 24, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 2 }}>Active site</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{activeSite.name}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--label-3)' }}>{activeSite.total_rows} × {activeSite.total_cols} grid</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)' }}>{activeSite.row_spacing_m} m row spacing</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)' }}>{activeSite.origin_lat.toFixed(5)}, {activeSite.origin_lng.toFixed(5)}</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginLeft: 'auto' }}>{teams.filter(t => t.site_id === activeSite.id).length} teams</div>
        </div>
      )}

      {/* Team progress */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Team progress this week</div>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)' }}>Loading…</div>
        ) : teamRows.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '24px 0', textAlign: 'center' }}>
            {sites.length === 0 ? 'Create a site above to get started.' : 'No teams yet — add teams above, then assign holes from the Assignments tab.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {teamRows.map(t => {
              const pct = t.total > 0 ? Math.round((t.completed / t.total) * 100) : 0
              return (
                <div key={t.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500 }}>{t.name}</span>
                    <span style={{ color: 'var(--label-4)' }}>{t.completed}/{t.total} holes · {pct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-3)' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: t.color_hex, width: `${pct}%`, transition: 'width .4s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent alerts */}
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Recent alerts</div>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)' }}>Loading…</div>
        ) : alerts.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '24px 0', textAlign: 'center' }}>No alerts yet. Send one from the Radio Call tab.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map(a => (
              <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 12 }}>
                <span style={{ color: a.priority === 'urgent' ? 'var(--red)' : 'var(--gold)', flexShrink: 0, fontWeight: 600 }}>
                  {a.priority === 'urgent' ? '🚨' : '📢'} {a.target_type}
                </span>
                <span style={{ flex: 1, color: 'var(--label-2)' }}>{a.message}</span>
                <span style={{ color: 'var(--label-4)', flexShrink: 0 }}>{new Date(a.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
