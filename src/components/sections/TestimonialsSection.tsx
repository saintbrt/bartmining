'use client'

import { useState, useEffect } from 'react'
import Reveal from '@/components/ui/Reveal'
import { TESTI } from '@/data/testimonials'

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTI.length), 5000)
    return () => clearInterval(t)
  }, [])

  const t = TESTI[active]
  return (
    <section className="sec-gap" style={{ background: 'var(--bg-2)' }}>
      <div className="px-site">
        <Reveal className="sec-head center">
          <span className="eyebrow center">Trusted by</span>
          <h2>Mining companies, governments and investors.</h2>
        </Reveal>
        <Reveal delay={1} style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div key={active} style={{ animation: 'fadeIn .4s ease' }}>
            <blockquote style={{
              fontFamily: 'var(--font-sora)', fontSize: 'clamp(18px,2.4vw,24px)',
              fontWeight: 500, lineHeight: 1.55, color: 'var(--ink)',
              letterSpacing: '-0.015em', fontStyle: 'italic',
              quotes: '"\\201C""\\201D"',
            }}>
              &ldquo;{t.q}&rdquo;
            </blockquote>
            <div style={{ marginTop: 28 }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{t.who}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: 4 }}>{t.role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 32 }}>
            {TESTI.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                width: i === active ? 28 : 8, height: 8,
                borderRadius: 'var(--r-sm)', border: 'none', cursor: 'pointer',
                background: i === active ? 'var(--gold)' : 'var(--line)',
                transition: 'all .3s var(--ease)',
                padding: 0,
              }} aria-label={`Testimonial ${i + 1}`} />
            ))}
          </div>
        </Reveal>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      `}</style>
    </section>
  )
}
