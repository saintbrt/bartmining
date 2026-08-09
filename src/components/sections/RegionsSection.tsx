import Reveal from '@/components/ui/Reveal'
import { EAST_AFRICA, SOUTHERN_AFRICA } from '@/data/regions'

export default function RegionsSection() {
  return (
    <section className="sec-gap" style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div className="px-site">
        <Reveal className="sec-head">
          <span className="eyebrow">Coverage</span>
          <h2>Operating across Africa&apos;s mining belt.</h2>
          <p>18 countries across East and Southern Africa, from the Geita goldfields to the Bushveld Complex.</p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }} className="regions-grid-responsive">
          {/* East Africa */}
          <Reveal>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 24 }}>East Africa</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {EAST_AFRICA.map(r => (
                <div key={r.c} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                  <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: 15.5, color: 'var(--gold-deep)', width: 80, flexShrink: 0 }}>{r.c}</div>
                  <div style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.7 }}>{r.cities.join(', ')}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Southern Africa */}
          <Reveal delay={1}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 24 }}>Southern Africa</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SOUTHERN_AFRICA.slice(0, 8).map(r => (
                <div key={r.c} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                  <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 600, fontSize: 15.5, color: 'var(--gold-deep)', width: 80, flexShrink: 0 }}>{r.c}</div>
                  <div style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.7 }}>{r.cities.join(', ')}</div>
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
