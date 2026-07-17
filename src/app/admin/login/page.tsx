'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/goldpass/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await signIn(email, password)
    if (err) { setError(err); setLoading(false); return }
    router.push('/admin/dashboard')
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

        <div className="card" style={{ padding: '32px 28px' }}>
          <h1 className="page-title" style={{ marginBottom: 6 }}>Sign in</h1>
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
            {error && <p style={{ fontSize: 13, color: 'var(--red)', marginBottom: 14, padding: '8px 12px', background: 'rgba(255,59,48,.08)', borderRadius: 'var(--r-sm)' }}>{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? .6 : 1 }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
