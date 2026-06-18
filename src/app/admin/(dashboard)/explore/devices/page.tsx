'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/goldpass/supabase/client'
import { notify } from '@/lib/goldpass/notify'

type Team = { id: string; name: string }
type Device = {
  id: string
  device_code: string
  label: string | null
  role: string
  status: string
  claimed_at: string | null
  expires_at: string
  team_name: string | null
  last_seen_at: string | null
}


export default function DevicesPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [label, setLabel] = useState('')
  const [role, setRole] = useState<'field_team' | 'supervisor'>('field_team')
  const [teamId, setTeamId] = useState('')
  const [revealed, setRevealed] = useState<{ code: string; key: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const sb = createClient()
      const [teamsRes, devRes] = await Promise.all([
        sb.from('explore_teams').select('id, name'),
        sb.from('device_invitations')
          .select('id, device_code, label, role, status, claimed_at, expires_at, team_id, explore_teams(name), registered_devices(last_seen_at)')
          .order('created_at', { ascending: false }),
      ])
      setTeams(teamsRes.data ?? [])
      setDevices((devRes.data ?? []).map((raw: Record<string, unknown>) => {
        const d = raw as {
          id: string; device_code: string; label: string | null; role: string;
          status: string; claimed_at: string | null; expires_at: string; team_id: string;
          explore_teams: unknown; registered_devices: unknown
        }
        const teamObj = (Array.isArray(d.explore_teams) ? d.explore_teams[0] : d.explore_teams) as { name: string } | null
        const regArr = (Array.isArray(d.registered_devices) ? d.registered_devices : []) as { last_seen_at: string | null }[]
        return ({
        id: d.id,
        device_code: d.device_code,
        label: d.label,
        role: d.role,
        status: d.status,
        claimed_at: d.claimed_at,
        expires_at: d.expires_at,
        team_name: teamObj?.name ?? null,
        last_seen_at: regArr[0]?.last_seen_at ?? null,
      })}))
    } catch (e) {
      notify('error', e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function generate() {
    if (!label.trim() || !teamId) { notify('warn', 'Enter a device label and select a team.'); return }
    setGenerating(true)
    setRevealed(null)
    try {
      const sb = createClient()
      const { data: sites } = await sb.from('sites').select('id').limit(1)
      const siteId = sites?.[0]?.id
      if (!siteId) { notify('warn', 'No site configured yet. Create a site before generating device codes.'); setGenerating(false); return }

      // Call Edge Function — bcrypt hashing runs server-side, raw key returned once
      const { data: session } = await sb.auth.getSession()
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-device-invitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session?.access_token}`,
        },
        body: JSON.stringify({ site_id: siteId, team_id: teamId, label: label.trim(), role }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Edge Function error')

      setRevealed({ code: json.device_code, key: json.device_key })
      setLabel('')
      notify('success', `Device code ${json.device_code} generated. Copy the key before closing.`)
      await load()
    } catch (e) {
      notify('error', e instanceof Error ? e.message : String(e))
    } finally {
      setGenerating(false)
    }
  }

  async function revoke(id: string) {
    if (!window.confirm('Revoke this device? It will be force-logged-out on next sync.')) return
    const sb = createClient()
    const { error } = await sb.from('device_invitations').update({ status: 'revoked' }).eq('id', id)
    if (error) { notify('error', error.message); return }
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status: 'revoked' } : d))
    notify('info', 'Device revoked.')
  }

  const statusColor: Record<string, string> = { pending: 'var(--label-4)', active: 'var(--green)', revoked: 'var(--red)' }

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Devices</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Generate GOLD-XXXX codes for field tablets. Device key is shown once — never stored in plaintext.</p>
      </div>

      <div className="card" style={{ maxWidth: 520, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Generate device invitation</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <input className="input" style={{ flex: 1, minWidth: 160, fontSize: 12 }} placeholder="Device label (e.g. Team A – Tablet 1)"
            value={label} onChange={e => setLabel(e.target.value)} />
          <select className="input" style={{ fontSize: 12 }} value={teamId} onChange={e => setTeamId(e.target.value)}>
            <option value="">Select team…</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select className="input" style={{ fontSize: 12 }} value={role}
            onChange={e => setRole(e.target.value as 'field_team' | 'supervisor')}>
            <option value="field_team">Field team</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>
        <button className="btn btn-primary btn-sm" disabled={generating || !label.trim() || !teamId}
          onClick={generate}>{generating ? 'Generating…' : 'Generate code'}</button>

        {revealed && (
          <div style={{ marginTop: 14, background: 'var(--bg-3)', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 600, marginBottom: 8 }}>
              ⚠ Copy this key now — it will never be shown again.
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--label-4)', marginBottom: 4 }}>Device code</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--gold)', fontSize: 18, letterSpacing: 2 }}>{revealed.code}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: 'var(--label-4)', marginBottom: 4 }}>Device key (copy now)</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--label-2)', wordBreak: 'break-all',
                  background: 'var(--bg-2)', padding: '6px 8px', borderRadius: 6, cursor: 'pointer' }}
                  onClick={() => { navigator.clipboard.writeText(revealed.key); notify('info', 'Key copied.') }}>
                  {revealed.key}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Device registry</div>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Label</th>
                  <th>Team</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last seen</th>
                  <th>Expires</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {devices.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No devices generated yet.</td></tr>
                ) : devices.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--gold)' }}>{d.device_code}</td>
                    <td>{d.label ?? '—'}</td>
                    <td>{d.team_name ?? '—'}</td>
                    <td>{d.role}</td>
                    <td><span style={{ color: statusColor[d.status] ?? 'var(--label-4)', fontWeight: 500 }}>{d.status}</span></td>
                    <td style={{ color: 'var(--label-4)' }}>{d.last_seen_at ? new Date(d.last_seen_at).toLocaleString() : '—'}</td>
                    <td style={{ color: 'var(--label-4)' }}>{new Date(d.expires_at).toLocaleDateString()}</td>
                    <td>
                      {d.status !== 'revoked' && (
                        <button className="btn-icon" style={{ fontSize: 10, color: 'var(--red)' }} title="Revoke"
                          onClick={() => revoke(d.id)}>Revoke</button>
                      )}
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
