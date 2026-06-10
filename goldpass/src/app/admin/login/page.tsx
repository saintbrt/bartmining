'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { DB } from '@/lib/goldpass/db'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await DB.signIn(email, password)
    if (err) { setError(err); setLoading(false); return }
    await DB.bootstrap()
    router.push('/admin/dashboard')
  }

  async function handleGoogle() {
    setLoading(true); setError('')
    const { error: err } = await DB.signInWithGoogle()
    if (err) { setError(err); setLoading(false) }
    // on success the browser redirects to Google, then back to /admin/dashboard
  }

  return (
    <div style={{ minHeight: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 380, maxWidth: '92vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
          <div className="sb-diamond" style={{ width: 28, height: 28 }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--label-1)' }}>Bart Mining</div>
            <div style={{ fontSize: 10, color: 'var(--label-4)', letterSpacing: '.06em' }}>GOLDPASS · INTERNAL</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--sep)', borderRadius: 16, padding: '32px 28px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: 'var(--label-1)' }}>Sign in</h1>
          <p style={{ fontSize: 13, color: 'var(--label-3)', marginBottom: 24 }}>Authorised personnel only.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: 'var(--label-3)', display: 'block', marginBottom: 5 }}>Email</label>
              <input className="input" style={{ width: '100%' }} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@bartmining.com" required autoComplete="email" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'var(--label-3)', display: 'block', marginBottom: 5 }}>Password</label>
              <input className="input" style={{ width: '100%' }} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
            </div>
            {error && <p style={{ fontSize: 13, color: 'var(--red)', marginBottom: 14, padding: '8px 12px', background: 'rgba(255,59,48,.08)', borderRadius: 6 }}>{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? .6 : 1 }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--sep)' }} />
            <span style={{ fontSize: 11, color: 'var(--label-4)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--sep)' }} />
          </div>

          <button type="button" className="btn btn-secondary" onClick={handleGoogle} disabled={loading}
            style={{ width: '100%', justifyContent: 'center', gap: 10, opacity: loading ? .6 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.1V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16A11 11 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
