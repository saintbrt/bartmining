'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/goldpass/supabase/client'
import { notify } from '@/lib/goldpass/notify'

type Team = { id: string; name: string }
type Alert = { id: string; message: string; priority: string; target_type: string; created_at: string; delivery_status: Record<string, unknown> }

const QUICK_PHRASES = [
  'All teams: return to base.',
  'Weather alert — suspend operations immediately.',
  'Safety check — confirm your status.',
  'Resume operations.',
  'Emergency — call supervisor now.',
]

export default function RadioCallPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [target, setTarget] = useState<'all' | 'team' | 'individual'>('all')
  const [targetId, setTargetId] = useState('')
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const sb = createClient()
      const [teamsRes, alertsRes] = await Promise.all([
        sb.from('explore_teams').select('id, name'),
        sb.from('explore_alerts').select('id, message, priority, target_type, created_at, delivery_status')
          .order('created_at', { ascending: false }).limit(20),
      ])
      if (!alive) return
      setTeams(teamsRes.data ?? [])
      setAlerts(alertsRes.data ?? [])
      setLoading(false)
    })()
    return () => { alive = false }
  }, [])

  async function send() {
    if (!message.trim()) return
    if ((target === 'team' || target === 'individual') && !targetId) {
      notify('warn', 'Select a target team or individual first.')
      return
    }
    setSending(true)
    try {
      const sb = createClient()
      const { data: me } = await sb.auth.getUser()

      // Get first site_id available — alerts are scoped to a site
      const { data: sites } = await sb.from('sites').select('id').limit(1)
      const siteId = sites?.[0]?.id
      if (!siteId) { notify('warn', 'No site configured yet. Create a site first.'); setSending(false); return }

      const { data, error } = await sb.from('explore_alerts').insert({
        site_id: siteId,
        sent_by: me.user?.id,
        target_type: target,
        target_id: targetId || null,
        message: message.trim(),
        priority,
        delivery_status: {},
      }).select().single()

      if (error) throw error

      // Trigger FCM push via Edge Function (fire-and-forget — alert is saved regardless)
      const { data: session } = await sb.auth.getSession()
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session?.access_token}`,
        },
        body: JSON.stringify({ alert_id: data.id }),
      }).catch(() => { /* FCM errors are non-fatal — alert row already saved */ })

      notify('success', `Alert sent${priority === 'urgent' ? ' 🚨' : ''}.`)
      setMessage('')
      if (data) setAlerts(prev => [data as Alert, ...prev])
    } catch (e) {
      notify('error', e instanceof Error ? e.message : String(e))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Radio Call</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Send alerts to all teams, a specific team, or an individual device.</p>
      </div>

      <div className="card" style={{ maxWidth: 560, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Compose alert</div>

        <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Send to</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {(['all','team','individual'] as const).map(t => (
            <button key={t} className={`btn btn-sm ${target === t ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setTarget(t); setTargetId('') }}>
              {t === 'all' ? 'All teams' : t === 'team' ? 'Team' : 'Individual'}
            </button>
          ))}
        </div>

        {target === 'team' && (
          <select className="input" style={{ fontSize: 12, marginBottom: 12, width: '100%' }} value={targetId} onChange={e => setTargetId(e.target.value)}>
            <option value="">Select team…</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        )}

        <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Priority</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {(['normal','urgent'] as const).map(p => (
            <button key={p} className={`btn btn-sm ${priority === p ? 'btn-primary' : 'btn-secondary'}`}
              style={priority === p && p === 'urgent' ? { background: 'var(--red)', borderColor: 'var(--red)' } : {}}
              onClick={() => setPriority(p)}>
              {p === 'normal' ? '📢 Normal' : '🚨 Urgent'}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 6 }}>Quick phrases</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {QUICK_PHRASES.map(q => (
            <button key={q} className="btn btn-secondary btn-sm" style={{ fontSize: 11 }}
              onClick={() => setMessage(q)}>{q}</button>
          ))}
        </div>

        <textarea className="input" style={{ width: '100%', minHeight: 80, resize: 'vertical', marginBottom: 12, boxSizing: 'border-box' }}
          placeholder="Message…" value={message} onChange={e => setMessage(e.target.value)} />

        <button className="btn btn-primary btn-sm" disabled={!message.trim() || sending}
          onClick={send}>{sending ? 'Sending…' : 'Send alert'}</button>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Alert history</div>
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)' }}>Loading…</div>
        ) : alerts.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '24px 0', textAlign: 'center' }}>No alerts sent yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map(a => (
              <div key={a.id} style={{ display: 'flex', gap: 10, fontSize: 12, alignItems: 'baseline' }}>
                <span style={{ color: a.priority === 'urgent' ? 'var(--red)' : 'var(--gold)', flexShrink: 0 }}>
                  {a.priority === 'urgent' ? '🚨' : '📢'}
                </span>
                <span style={{ flex: 1 }}>{a.message}</span>
                <span style={{ color: 'var(--label-4)', flexShrink: 0 }}>{a.target_type}</span>
                <span style={{ color: 'var(--label-4)', flexShrink: 0 }}>{new Date(a.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
