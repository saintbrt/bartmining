'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/goldpass/supabase/client'
import { notify } from '@/lib/goldpass/notify'

type Team = { id: string; name: string; color_hex: string }
type Hole = { id: string; hole_id: string; row_num: number; col_num: number }
type Assignment = { id: string; hole_id: string; team_id: string; week_start: string }
type Site = { id: string; name: string; total_rows: number; total_cols: number; origin_lat: number; origin_lng: number; row_spacing_m: number; col_spacing_m: number }

function weekStartDate(offset = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + offset * 7)
  return d.toISOString().slice(0, 10)
}

function holeCoords(originLat: number, originLng: number, rowSpacingM: number, colSpacingM: number, row: number, col: number) {
  const latPerM = 1 / 111320
  const lngPerM = 1 / (111320 * Math.cos(originLat * Math.PI / 180))
  return {
    lat: originLat - row * rowSpacingM * latPerM,
    lng: originLng + col * colSpacingM * lngPerM,
  }
}

export default function AssignmentsPage() {
  const [site, setSite] = useState<Site | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [holes, setHoles] = useState<Hole[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedTeam, setSelectedTeam] = useState('')
  const [selectedHoles, setSelectedHoles] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const weekStart = weekStartDate(weekOffset)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sb = createClient()
      const [siteRes, teamsRes, holesRes, assignRes] = await Promise.all([
        sb.from('sites').select('id, name, total_rows, total_cols, origin_lat, origin_lng, row_spacing_m, col_spacing_m').limit(1).single(),
        sb.from('explore_teams').select('id, name, color_hex'),
        sb.from('holes').select('id, hole_id, row_num, col_num').order('row_num').order('col_num'),
        sb.from('assignments').select('id, hole_id, team_id, week_start').eq('week_start', weekStart),
      ])
      setSite(siteRes.data ?? null)
      setTeams(teamsRes.data ?? [])
      setHoles(holesRes.data ?? [])
      setAssignments(assignRes.data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally { setLoading(false) }
  }, [weekStart])

  useEffect(() => { load() }, [load])

  async function generateGrid() {
    if (!site) { notify('warn', 'No site found. Create a site on the Overview tab first.'); return }
    if (!window.confirm(`Generate ${site.total_rows * site.total_cols} holes for "${site.name}"? This cannot be undone.`)) return
    setGenerating(true)
    try {
      const sb = createClient()
      const batch: { site_id: string; hole_id: string; row_num: number; col_num: number; lat: number; lng: number }[] = []
      for (let r = 1; r <= site.total_rows; r++) {
        for (let c = 1; c <= site.total_cols; c++) {
          const coords = holeCoords(site.origin_lat, site.origin_lng, site.row_spacing_m, site.col_spacing_m, r - 1, c - 1)
          batch.push({
            site_id: site.id,
            hole_id: `H${String(r).padStart(3, '0')}-${String(c).padStart(3, '0')}`,
            row_num: r,
            col_num: c,
            lat: coords.lat,
            lng: coords.lng,
          })
        }
      }
      // Insert in chunks of 500 to avoid payload limits
      for (let i = 0; i < batch.length; i += 500) {
        const { error } = await sb.from('holes').insert(batch.slice(i, i + 500))
        if (error) throw error
      }
      notify('success', `${batch.length.toLocaleString()} holes generated for ${site.name}.`)
      await load()
    } catch (e) {
      notify('error', e instanceof Error ? e.message : String(e))
    } finally { setGenerating(false) }
  }

  async function assign() {
    if (!selectedTeam || !selectedHoles.length) return
    if (selectedHoles.length > 20) { notify('warn', 'Maximum 20 holes per team per week.'); return }
    setSaving(true)
    try {
      const sb = createClient()
      const { data: me } = await sb.auth.getUser()
      const rows = selectedHoles.map(hid => ({
        site_id: site?.id,
        team_id: selectedTeam,
        hole_id: hid,
        week_start: weekStart,
        assigned_by: me.user?.id,
      }))
      const { error } = await sb.from('assignments').upsert(rows, { onConflict: 'hole_id,week_start' })
      if (error) throw error
      notify('success', `${selectedHoles.length} hole${selectedHoles.length !== 1 ? 's' : ''} assigned.`)
      setSelectedHoles([])
      await load()
    } catch (e) {
      notify('error', e instanceof Error ? e.message : String(e))
    } finally { setSaving(false) }
  }

  async function unassign(assignmentId: string) {
    const sb = createClient()
    const { error } = await sb.from('assignments').delete().eq('id', assignmentId)
    if (error) { notify('error', error.message); return }
    setAssignments(prev => prev.filter(a => a.id !== assignmentId))
  }

  async function copyLastWeek() {
    const lastWeek = weekStartDate(weekOffset - 1)
    const sb = createClient()
    const { data: lastAssignments } = await sb.from('assignments').select('site_id, team_id, hole_id').eq('week_start', lastWeek)
    if (!lastAssignments?.length) { notify('info', 'No assignments found for last week.'); return }
    const { data: me } = await sb.auth.getUser()
    const rows = lastAssignments.map((a: { site_id: string; team_id: string; hole_id: string }) => ({ ...a, week_start: weekStart, assigned_by: me.user?.id }))
    const { error } = await sb.from('assignments').upsert(rows, { onConflict: 'hole_id,week_start' })
    if (error) { notify('error', error.message); return }
    notify('success', `Copied ${rows.length} assignments from last week.`)
    await load()
  }

  function exportCsv() {
    const rows = assignments.map(a => {
      const h = holes.find(x => x.id === a.hole_id)
      const t = teams.find(x => x.id === a.team_id)
      return `${h?.hole_id ?? ''},${t?.name ?? ''},${a.week_start}`
    })
    const csv = ['hole_id,team,week_start', ...rows].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a'); a.href = url; a.download = `assignments_${weekStart}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const assignedHoleIds = new Set(assignments.map(a => a.hole_id))
  const unassigned = holes.filter(h => !assignedHoleIds.has(h.id))

  return (
    <div className="content content-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Assignments</h2>
          <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Assign holes to teams by week. Max 20 holes per team.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setWeekOffset(w => w - 1)}>← Prev</button>
          <span style={{ fontSize: 12, fontWeight: 600, minWidth: 90, textAlign: 'center' }}>{weekStart}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setWeekOffset(w => w + 1)}>Next →</button>
          <button className="btn btn-secondary btn-sm" onClick={copyLastWeek}>Copy last week</button>
          <button className="btn btn-secondary btn-sm" onClick={exportCsv} disabled={!assignments.length}>⬇ CSV</button>
        </div>
      </div>

      {error && <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 16 }}>{error}</div>}

      {/* Grid generation */}
      {!loading && site && holes.length === 0 && (
        <div className="card" style={{ marginBottom: 16, borderColor: 'var(--gold)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Generate hole grid</div>
          <p style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 12 }}>
            Site "{site.name}" has {site.total_rows} × {site.total_cols} = {(site.total_rows * site.total_cols).toLocaleString()} holes. Generate the full grid to start assigning.
          </p>
          <button className="btn btn-primary btn-sm" onClick={generateGrid} disabled={generating}>
            {generating ? 'Generating…' : `Generate ${(site.total_rows * site.total_cols).toLocaleString()} holes`}
          </button>
        </div>
      )}

      {/* Assign form */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Assign holes for week of {weekStart}</div>
        {teams.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)' }}>No teams yet. Add teams on the Overview tab first.</div>
        ) : holes.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)' }}>No holes yet. {site ? 'Generate the grid above.' : 'Create a site on the Overview tab first.'}</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
              <select className="input" style={{ fontSize: 12 }} value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
                <option value="">Select team…</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <span style={{ fontSize: 12, color: 'var(--label-4)' }}>{selectedHoles.length}/20 selected</span>
              <button className="btn btn-primary btn-sm" disabled={!selectedTeam || !selectedHoles.length || saving || selectedHoles.length > 20} onClick={assign}>
                {saving ? 'Saving…' : `Assign ${selectedHoles.length || ''} hole${selectedHoles.length !== 1 ? 's' : ''}`}
              </button>
              {selectedHoles.length > 0 && (
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedHoles([])}>Clear</button>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 8 }}>
              {unassigned.length} unassigned holes — click to select (max 20)
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', maxHeight: 200, overflowY: 'auto' }}>
              {unassigned.map(h => {
                const selected = selectedHoles.includes(h.id)
                return (
                  <div key={h.id}
                    onClick={() => {
                      if (selected) setSelectedHoles(prev => prev.filter(x => x !== h.id))
                      else if (selectedHoles.length < 20) setSelectedHoles(prev => [...prev, h.id])
                      else notify('warn', 'Maximum 20 holes per team per week.')
                    }}
                    style={{
                      fontSize: 10, fontFamily: 'monospace', padding: '3px 7px', borderRadius: 5, cursor: 'pointer',
                      background: selected ? 'var(--blue)' : 'var(--bg-3)',
                      color: selected ? '#fff' : 'var(--label-2)',
                      border: `1px solid ${selected ? 'var(--blue)' : 'var(--sep)'}`,
                      userSelect: 'none',
                    }}>
                    {h.hole_id}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Current week assignments */}
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
          Week of {weekStart} — {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
        </div>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : assignments.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '24px 0', textAlign: 'center' }}>No assignments for this week.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl" style={{ fontSize: 12 }}>
              <thead><tr><th>Hole ID</th><th>Row</th><th>Col</th><th>Team</th><th></th></tr></thead>
              <tbody>
                {assignments.map(a => {
                  const h = holes.find(x => x.id === a.hole_id)
                  const t = teams.find(x => x.id === a.team_id)
                  return (
                    <tr key={a.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{h?.hole_id ?? '—'}</td>
                      <td>{h?.row_num ?? '—'}</td>
                      <td>{h?.col_num ?? '—'}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: t?.color_hex ?? '#888', display: 'inline-block' }} />
                          {t?.name ?? '—'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-icon" style={{ fontSize: 10, color: 'var(--red)' }} onClick={() => unassign(a.id)}>✕</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
