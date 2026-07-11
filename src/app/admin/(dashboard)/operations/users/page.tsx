'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import { listProfiles, updateProfileRole, updateProfileName, type ProfileRow } from '@/lib/goldpass/erp'

const ROLES = ['admin', 'manager', 'supervisor'] as const

export default function UsersPage() {
  const [rows, setRows] = useState<ProfileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setRows(await listProfiles())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function changeRole(row: ProfileRow, role: string) {
    if (role === row.role) return
    if (!window.confirm(`Change ${row.name ?? row.email ?? row.id}'s role to "${role}"?`)) return
    setSavingId(row.id)
    const ok = await updateProfileRole(row.id, role)
    setSavingId(null)
    if (!ok) return
    notify('success', 'Role updated.')
    load()
  }

  async function renameUser(row: ProfileRow) {
    const typed = window.prompt('New name:', row.name ?? '')
    if (typed === null) return
    if (!typed.trim()) { notify('warn', 'Name cannot be empty.'); return }
    setSavingId(row.id)
    const ok = await updateProfileName(row.id, typed.trim())
    setSavingId(null)
    if (!ok) return
    notify('success', 'Name updated.')
    load()
  }

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Users</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Reassign roles for existing accounts. Role determines whether someone lands on this web admin panel or the mobile app.</p>
      </div>

      <div className="card" style={{ marginBottom: 20, background: 'var(--bg-3)' }}>
        <div style={{ fontSize: 12, color: 'var(--label-3)' }}>
          Creating brand-new accounts isn&apos;t available here yet — it needs a service-role
          edge function (similar to <span style={{ fontFamily: 'monospace' }}>generate-device-invitation</span>)
          so a new user can be created without signing the admin out of their own session.
          Ask if you want that built next.
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No users found.</td></tr>
                ) : rows.map(r => (
                  <tr key={r.id}>
                    <td>
                      <span>{r.name ?? '—'}</span>
                      <button className="btn-icon" style={{ fontSize: 10, marginLeft: 8, padding: '2px 7px' }} disabled={savingId === r.id}
                        onClick={() => renameUser(r)}>✎</button>
                    </td>
                    <td style={{ color: 'var(--label-4)' }}>{r.email ?? '—'}</td>
                    <td>
                      <select
                        className="input"
                        style={{ fontSize: 12, padding: '4px 8px' }}
                        value={r.role}
                        disabled={savingId === r.id}
                        onChange={e => changeRole(r, e.target.value)}
                      >
                        {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                      </select>
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
