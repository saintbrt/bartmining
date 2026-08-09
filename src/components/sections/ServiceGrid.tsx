import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import { SERVICES } from '@/data/services'

export default function ServiceGrid({ showAll = false }: { showAll?: boolean }) {
  return (
    <section className="sec-gap" style={{ background: 'var(--bg)' }}>
      <div className="px-site">
        <Reveal className="sec-head">
          <span className="eyebrow">What we do</span>
          <h2>Full-lifecycle mining expertise, under one principal.</h2>
          <p>Five integrated capabilities that carry a deposit from the first geological hunch through to a responsibly closed mine.</p>
        </Reveal>

        {showAll ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.n} delay={i % 3} className="svc-row" style={{
                display: 'grid', gridTemplateColumns: '80px 1fr auto',
                gap: 32, padding: '36px 0', borderBottom: '1px solid var(--line-2)',
                alignItems: 'start',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--gold)' }}>{s.n}</div>
                <div>
                  <h3 style={{ fontSize: 22, marginBottom: 12 }}>{s.t}</h3>
                  <p style={{ color: 'var(--ink-2)', fontSize: 16, marginBottom: 18 }}>{s.long}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    {s.includes.map(item => (
                      <span key={item} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', color: 'var(--ink-3)', background: 'var(--bg-3)' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="svc-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {s.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 'var(--r-sm)', background: '#FFFFFF', color: 'var(--gold)', border: '1px solid var(--line)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="svc-grid-responsive">
            {SERVICES.map((s, i) => (
              <Reveal key={s.n} delay={i % 3} style={{
                background: 'var(--bg-3)', borderRadius: 'var(--r-lg)',
                border: '1px solid var(--line)', padding: '28px 26px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginBottom: 14 }}>{s.n}</div>
                <h3 style={{ fontSize: 17, marginBottom: 10 }}>{s.t}</h3>
                <p style={{ color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.6 }}>{s.d}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
                  {s.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 'var(--r-sm)', background: '#FFFFFF', color: 'var(--gold)', border: '1px solid var(--line)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {!showAll && (
          <Reveal style={{ marginTop: 34 }}>
            <Link href="/services" className="btn btn-ink">
              All services in detail
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 16, height: 16 }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </Reveal>
        )}
      </div>
      <style>{`
        .svc-grid-responsive { grid-template-columns: repeat(3,1fr) !important; }
        @media (max-width: 860px) { .svc-grid-responsive { grid-template-columns: 1fr !important; } }
        /* The detail rows had no breakpoint at all: a 80px/1fr/auto grid was
           still three columns at 390px, crushing the copy and pushing the
           tag column off-screen. */
        @media (max-width: 860px) {
          .svc-row { grid-template-columns: 1fr !important; gap: 14px !important; }
          .svc-row > .svc-tags { margin-top: 2px; }
        }
      `}</style>
    </section>
  )
}
