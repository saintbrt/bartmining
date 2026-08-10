import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import { EQUIP } from '@/data/equipment'

export default function EquipGrid({
  variant = 'light',
  showLink = true,
  eyebrow = 'Mining Machinery & Processing Plants',
  heading = 'From exploration kit to complete gold-recovery systems.',
  subheading = 'We source, specify, supply and commission specialised mineral-processing machinery tailored to site conditions and production targets.',
}: {
  variant?: 'dark' | 'light'
  showLink?: boolean
  eyebrow?: string
  heading?: string
  subheading?: string
}) {
  const dark = variant === 'dark'
  return (
    <section className={`sec-gap${dark ? ' on-dark' : ''}`} style={{ background: dark ? 'var(--slate)' : 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {dark && (
        <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(207,160,85,.22),transparent 65%)', top: -200, right: -160, pointerEvents: 'none' }} />
      )}
      <div className="px-site">
        <Reveal className="sec-head">
          <span className="eyebrow" style={dark ? { color: 'var(--gold-2)' } : {}}>{eyebrow}</span>
          <h2 style={dark ? { color: '#fff' } : {}}>{heading}</h2>
          <p style={dark ? { color: 'rgba(255,255,255,.6)' } : {}}>{subheading}</p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="equip-grid-responsive">
          {EQUIP.map((e, i) => (
            <Reveal key={e.t} delay={i % 4} style={{
              borderRadius: 'var(--r-md)',
              border: dark ? '1px solid rgba(255,255,255,.09)' : '1px solid var(--line-2)',
              background: dark ? 'rgba(255,255,255,.04)' : 'var(--bg-3)',
              padding: '22px 20px',
              backdropFilter: dark ? 'blur(8px)' : undefined,
            }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: dark ? '#fff' : 'var(--ink)', marginBottom: 8, lineHeight: 1.3 }}>{e.t}</h4>
              <p style={{ fontSize: 15, color: dark ? 'rgba(255,255,255,.55)' : 'var(--ink-2)', lineHeight: 1.6, marginBottom: 14 }}>{e.d}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {e.apps.map(app => (
                  <div key={app} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold-2)', flexShrink: 0 }} />
                    <span style={{ color: dark ? 'rgba(255,255,255,.4)' : 'var(--ink-3)' }}>{app}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {showLink && (
          <Reveal style={{ marginTop: 34 }}>
            <Link href="/equipment" className="btn btn-gold">
              Browse the full product range
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 16, height: 16 }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </Reveal>
        )}
      </div>
      <style>{`
        .equip-grid-responsive { grid-template-columns: repeat(4,1fr) !important; }
        @media (max-width: 1080px) { .equip-grid-responsive { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px)  { .equip-grid-responsive { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
