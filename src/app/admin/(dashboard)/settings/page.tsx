'use client'

import { useAppContext } from '@/lib/goldpass/AppContext'
import { useRouter } from 'next/navigation'
import { ready, signOut } from '@/lib/goldpass/auth'

export default function SettingsPage() {
  const ctx = useAppContext()
  const router = useRouter()
  if (!ctx || !ctx.user) return null
  const { user } = ctx
  const connected = ready()

  function handleSignOut() { signOut(); router.push('/admin/login') }

  return (
    <div className="content content-pad" style={{ maxWidth: 600 }}>
      <h2 className="page-title" style={{ marginBottom: 24 }}>Settings</h2>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Account</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="sb-av" style={{ width: 40, height: 40, fontSize: 14 }}>{user.email.slice(0, 2).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{user.email}</div>
            <div style={{ fontSize: 12, color: 'var(--label-3)' }}>Bart Mining GoldPass</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-danger btn-sm" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-label" style={{ marginBottom: 12 }}>Backend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? 'var(--green)' : 'var(--red)', }} />
          <div style={{ fontSize: 13 }}>{connected ? 'Supabase connected' : 'Supabase not configured'}</div>
        </div>
        {!connected && <p style={{ fontSize: 12, color: 'var(--label-4)', marginTop: 8, lineHeight: 1.6 }}>Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON environment variables.</p>}
      </div>
    </div>
  )
}
