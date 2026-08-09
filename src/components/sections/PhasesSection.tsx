import Reveal from '@/components/ui/Reveal'
import { PHASES } from '@/data/phases'

export default function PhasesSection({ title = 'Four phases. One principal accountable end to end.', subtitle = 'A disciplined path from discovery to closure - every phase shipping concrete deliverables, not just reports.' }: { title?: string, subtitle?: string }) {
  return (
    <section className="sec-gap" id="method" style={{ background: 'var(--paper)' }}>
      <div className="px-site">
        <Reveal className="sec-head">
          <span className="eyebrow">Operating methodology</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }} className="phases-grid-responsive">
          {PHASES.map((p, i) => (
            <Reveal key={p.k} delay={i} style={{
              background: 'var(--bg-3)',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--line)',
              padding: '28px 24px',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 14 }}>{p.k}</div>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>{p.t}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 15.5, color: 'var(--ink-2)' }}>
                    <span style={{ color: 'var(--gold)', marginTop: 3, flexShrink: 0 }}>&#8250;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ paddingTop: 16, borderTop: '1px solid var(--line-2)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.06em', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                {p.deliver}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        .phases-grid-responsive { grid-template-columns: repeat(4,1fr) !important; }
        @media (max-width: 1080px) { .phases-grid-responsive { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px)  { .phases-grid-responsive { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
