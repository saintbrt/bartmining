'use client'

import { useState } from 'react'
import { useAppContext } from '@/lib/goldpass/AppContext'
import { useRouter } from 'next/navigation'
import { DB } from '@/lib/goldpass/db'

export default function SettingsPage() {
  const ctx = useAppContext()
  const router = useRouter()
  const [gradeUnit, setGradeUnit] = useState('g/t')
  const [depthUnit, setDepthUnit] = useState('metres')
  const [auThreshold, setAuThreshold] = useState('0.1')
  const [nullValues, setNullValues] = useState('-99, 9999, N/A')

  if (!ctx || !ctx.user) return null
  const { user } = ctx

  function handleSignOut() { DB.signOut(); router.push('/admin/login') }

  const ready = DB.ready()

  return (
    <div className="content content-pad" style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Settings</h2>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Account</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{user.email.slice(0, 2).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{user.email}</div>
            <div style={{ fontSize: 12, color: 'var(--label-3)' }}>Bart Mining GoldPass</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-danger btn-sm" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 16 }}>Data defaults</div>
        {[
          { label: 'Grade unit', value: gradeUnit, onChange: setGradeUnit, options: ['g/t', 'ppm', 'ppb', '%'] },
          { label: 'Depth unit', value: depthUnit, onChange: setDepthUnit, options: ['metres', 'feet'] },
        ].map(f => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: 'var(--label-2)', width: 120 }}>{f.label}</label>
            <select className="input" style={{ flex: 1 }} value={f.value} onChange={e => f.onChange(e.target.value)}>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: 'var(--label-2)', width: 120 }}>Au threshold</label>
          <input className="input" style={{ flex: 1 }} value={auThreshold} onChange={e => setAuThreshold(e.target.value)} placeholder="0.1" />
          <span style={{ fontSize: 12, color: 'var(--label-4)' }}>g/t</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 13, color: 'var(--label-2)', width: 120 }}>Null values</label>
          <input className="input" style={{ flex: 1 }} value={nullValues} onChange={e => setNullValues(e.target.value)} placeholder="-99, 9999, N/A" />
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Backend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: ready ? 'var(--green)' : 'var(--red)', boxShadow: ready ? '0 0 6px var(--green)' : undefined }} />
          <div style={{ fontSize: 13 }}>{ready ? 'Supabase connected' : 'Supabase not configured'}</div>
        </div>
        {!ready && <p style={{ fontSize: 12, color: 'var(--label-4)', marginTop: 8, lineHeight: 1.6 }}>Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.</p>}
      </div>
    </div>
  )
}
