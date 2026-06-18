'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/goldpass/supabase/client'
import { notify } from '@/lib/goldpass/notify'

type Site = { id: string; name: string; total_rows: number; total_cols: number; origin_lat: number; origin_lng: number; row_spacing_m: number; col_spacing_m: number; description: string | null }

export default function ExploreSettingsPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editOriginLat, setEditOriginLat] = useState('')
  const [editOriginLng, setEditOriginLng] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const sb = createClient()
    const { data } = await sb.from('sites').select('id, name, description, total_rows, total_cols, origin_lat, origin_lng, row_spacing_m, col_spacing_m').order('created_at')
    setSites(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function startEdit(s: Site) {
    setEditing(s.id)
    setEditName(s.name)
    setEditDesc(s.description ?? '')
    setEditOriginLat(s.origin_lat.toString())
    setEditOriginLng(s.origin_lng.toString())
  }

  async function saveEdit(id: string) {
    setSaving(true)
    const sb = createClient()
    const { error } = await sb.from('sites').update({
      name: editName.trim(),
      description: editDesc.trim() || null,
      origin_lat: parseFloat(editOriginLat),
      origin_lng: parseFloat(editOriginLng),
    }).eq('id', id)
    if (error) { notify('error', error.message); setSaving(false); return }
    notify('success', 'Site updated.')
    setEditing(null)
    setSaving(false)
    await load()
  }

  async function deleteSite(id: string, name: string) {
    const typed = window.prompt(`This permanently deletes "${name}" and ALL its holes, assignments, surveys and alerts.\n\nType the site name to confirm:`)
    if (typed !== name) { if (typed !== null) window.alert('Name did not match — nothing was deleted.'); return }
    const sb = createClient()
    const { error } = await sb.from('sites').delete().eq('id', id)
    if (error) { notify('error', error.message); return }
    notify('info', `Site "${name}" deleted.`)
    await load()
  }

  async function deleteAllHoles(siteId: string, siteName: string) {
    if (!window.confirm(`Delete ALL holes for "${siteName}"? This will also remove all assignments. You can regenerate the grid afterwards.`)) return
    const sb = createClient()
    const { error } = await sb.from('holes').delete().eq('site_id', siteId)
    if (error) { notify('error', error.message); return }
    notify('info', 'All holes deleted. Regenerate from the Assignments tab.')
  }

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Explore Settings</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Manage sites, edit grid parameters, and delete data.</p>
      </div>

      {loading ? (
        <div style={{ fontSize: 12, color: 'var(--label-4)' }}>Loading…</div>
      ) : sites.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--label-4)', fontSize: 13 }}>
          No sites yet. Create one from the Overview tab.
        </div>
      ) : sites.map(s => (
        <div key={s.id} className="card" style={{ marginBottom: 16 }}>
          {editing === s.id ? (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Edit site</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Name</div>
                  <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Description</div>
                  <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Optional" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Origin latitude</div>
                  <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={editOriginLat} onChange={e => setEditOriginLat(e.target.value)} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Origin longitude</div>
                  <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={editOriginLng} onChange={e => setEditOriginLng(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={() => saveEdit(s.id)} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</div>
                  {s.description && <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 2 }}>{s.description}</div>}
                </div>
                <button className="btn-icon" style={{ fontSize: 10, padding: '2px 7px' }} onClick={() => startEdit(s)}>✎</button>
                <button className="btn-icon" style={{ fontSize: 10, padding: '2px 7px', color: 'var(--red)' }} onClick={() => deleteSite(s.id, s.name)}>✕</button>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--label-3)', marginBottom: 12 }}>
                <span>{s.total_rows} rows × {s.total_cols} cols</span>
                <span>{s.row_spacing_m} m row spacing · {s.col_spacing_m} m col spacing</span>
                <span>{s.origin_lat.toFixed(6)}, {s.origin_lng.toFixed(6)}</span>
                <span>{(s.total_rows * s.total_cols).toLocaleString()} total holes</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" style={{ fontSize: 11, color: 'var(--red)' }}
                  onClick={() => deleteAllHoles(s.id, s.name)}>Delete all holes</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
