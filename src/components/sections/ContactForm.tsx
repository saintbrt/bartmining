'use client'

import { useState, FormEvent } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    const fd = new FormData(e.currentTarget)
    const data = Object.fromEntries(fd.entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Unknown error')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', padding: '52px 40px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 'var(--r-sm)', background: '#FFFFFF', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#2E6A4F" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}><path d="m5 13 4 4L19 7"/></svg>
        </div>
        <h3 style={{ fontSize: 22, marginBottom: 10 }}>Thank you. Message received.</h3>
        <p style={{ color: 'var(--ink-2)', fontSize: 16 }}>We&apos;ll be in touch shortly. For anything urgent, message on WhatsApp: <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-deep)', fontWeight: 600 }}>+255 759 141 705</a>.</p>
      </div>
    )
  }

  const fieldStyle = {
    width: '100%', fontFamily: 'var(--font-manrope)', fontSize: 15,
    padding: '14px 14px', border: '1px solid var(--line)',
    borderRadius: 'var(--r-sm)', background: 'var(--bg)', color: 'var(--ink)',
    outline: 'none', transition: 'border-color .2s',
  }
  const labelStyle = { display: 'block', fontSize: 15, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }

  return (
    <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', padding: '40px' }} className="cf-card">
      <form onSubmit={handleSubmit} noValidate>
        <h3 style={{ fontSize: 22, marginBottom: 6 }}>Tell us about your project</h3>
        <p style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 28 }}>We typically reply within one business day.</p>

        <div className="cf-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Full name <span style={{ color: 'var(--gold)' }}>*</span></label>
            <input type="text" name="name" required placeholder="Jane Mwakasa" style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email <span style={{ color: 'var(--gold)' }}>*</span></label>
            <input type="email" name="email" required placeholder="you@company.com" style={fieldStyle} />
          </div>
        </div>

        <div className="cf-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Organisation</label>
            <input type="text" name="org" placeholder="Company / government / fund" style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>I am a&hellip;</label>
            <select name="type" style={fieldStyle}>
              <option>Mining company</option>
              <option>Government / regulator</option>
              <option>Investor</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="cf-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Interested in</label>
            <select name="interest" style={fieldStyle}>
              <option>Geological Survey</option>
              <option>Exploration</option>
              <option>Mine Planning &amp; Design</option>
              <option>Machinery &amp; Processing Plants</option>
              <option>Safety Equipment &amp; Gear</option>
              <option>Technical due diligence</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Project location</label>
            <input type="text" name="location" placeholder="Country / region" style={fieldStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Project details <span style={{ color: 'var(--gold)' }}>*</span></label>
          <textarea name="message" required placeholder="Commodity, stage, what you need help with&hellip;" style={{ ...fieldStyle, minHeight: 120, resize: 'vertical' }} />
        </div>

        {status === 'error' && (
          <p style={{ color: '#c0392b', fontSize: 15.5, marginBottom: 16, padding: '10px 14px', background: 'rgba(192,57,43,.07)', borderRadius: 8, border: '1px solid rgba(192,57,43,.2)' }}>{errorMsg}</p>
        )}

        <button type="submit" className="btn btn-gold" disabled={status === 'submitting'} style={{ opacity: status === 'submitting' ? .6 : 1, cursor: status === 'submitting' ? 'not-allowed' : 'pointer' }}>
          {status === 'submitting' ? 'Sending&hellip;' : 'Send enquiry'}
          {status !== 'submitting' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 16, height: 16 }}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          )}
        </button>
      </form>

      <style>{`
        @media (max-width: 600px) {
          .cf-card { padding: 26px 20px !important; }
          .cf-row  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
