import Reveal from '@/components/ui/Reveal'
import { EAST_AFRICA, SOUTHERN_AFRICA } from '@/data/regions'

export default function RegionsSection() {
  return (
    <section className="sec-gap" style={{ background: 'var(--slate)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(174,138,76,.12), transparent 60%)', pointerEvents: 'none' }} />
      <div className="px-site" style={{ position: 'relative' }}>
        <Reveal className="sec-head">
          <span className="eyebrow" style={{ color: 'var(--gold-2)' }}>Coverage</span>
          <h2 style={{ color: '#fff' }}>Operating across Africa&apos;s mining belt.</h2>
          <p style={{ color: 'rgba(255,255,255,.6)' }}>18 countries across East and Southern Africa, from the Geita goldfields to the Bushveld Complex.</p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }} className="regions-grid-responsive">
          {/* East Africa */}
          <Reveal>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 24 }}>East Africa</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {EAST_AFRICA.map(r => (
                <div key={r.c} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                  <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: 14, color: 'var(--gold-2)', width: 80, flexShrink: 0 }}>{r.c}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>{r.cities.join(', ')}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Southern Africa */}
          <Reveal delay={1}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 24 }}>Southern Africa</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SOUTHERN_AFRICA.slice(0, 8).map(r => (
                <div key={r.c} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                  <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: 14, color: 'var(--gold-2)', width: 80, flexShrink: 0 }}>{r.c}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>{r.cities.join(', ')}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        .regions-grid-responsive { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 860px) { .regions-grid-responsive { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
