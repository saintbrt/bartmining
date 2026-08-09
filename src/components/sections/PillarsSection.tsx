import Reveal from '@/components/ui/Reveal'
import { PILLARS } from '@/data/pillars'

export default function PillarsSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginTop: 0 }} className="pillars-grid-responsive">
      {PILLARS.map((p, i) => (
        <Reveal key={p.t} delay={i} style={{
          background: 'var(--bg-3)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--line)', padding: '28px 24px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 14, opacity: .7 }}>{p.std}</div>
          <h4 style={{ fontSize: 17, marginBottom: 10 }}>{p.t}</h4>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.6 }}>{p.d}</p>
        </Reveal>
      ))}
      <style>{`
        .pillars-grid-responsive { grid-template-columns: repeat(4,1fr) !important; }
        @media (max-width: 1080px) { .pillars-grid-responsive { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px)  { .pillars-grid-responsive { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
