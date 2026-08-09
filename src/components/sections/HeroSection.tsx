'use client'

import Link from 'next/link'
import Image from 'next/image'
import Counter from '@/components/ui/Counter'
import Reveal from '@/components/ui/Reveal'

export default function HeroSection() {
  return (
    <section className="hero" style={{ position: 'relative', padding: '168px 0 90px', overflow: 'hidden' }}>
      <div className="px-site" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        {/* Copy */}
        <div>
          <Reveal delay={1}>
            <h1 style={{ fontSize: 'clamp(40px,5.2vw,68px)' }}>
              Responsible <span className="grad">resource<br />development.</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p style={{ fontSize: 18, color: 'var(--ink-2)', marginTop: 22, lineHeight: 1.7, maxWidth: 500 }}>
              End-to-end mining consultancy and equipment supply - principal-led from first outcrop to final rehabilitation. Hands in the rock, not just theory on a slide deck.
            </p>
          </Reveal>
          <Reveal delay={3} className="hero-actions" style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
            <Link href="/services" className="btn btn-gold">
              Explore our services
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link href="#method" className="btn btn-ghost">How we work</Link>
          </Reveal>
          <Reveal delay={4} className="hero-stats" style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 40, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
                <Counter target={25} suffix="+" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: 4 }}>Years in the field</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
                <Counter target={12} suffix="+" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: 4 }}>Countries worked</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
                <Counter target={6} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: 4 }}>Continents</div>
            </div>
          </Reveal>
        </div>

        {/* Visual */}
        <Reveal delay={2}>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--r-lg)',
              overflow: 'hidden',
              aspectRatio: '4/3',
              border: '1px solid var(--line)',
            }}
          >
            <Image
              src="https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Mining operation"
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 860px) 100vw, 50vw"
            />
            <div style={{
              position: 'absolute', bottom: 18, right: 18,
              background: '#FFFFFF',
              border: '1px solid var(--line)', borderRadius: 'var(--r-sm)',
              padding: '12px 16px',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Now advising</div>
              <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 7, height: 7, background: '#2E6A4F', display: 'inline-block', flexShrink: 0 }} />
                3 live projects
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hero > .px-site { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          /* Desktop hero padding leaves a dead screen-height of white on a phone. */
          .hero { padding: 116px 0 56px !important; }
          /* Buttons wrapped to unequal widths, which reads as accidental. */
          .hero-actions { flex-direction: column; align-items: stretch; gap: 10px; }
          .hero-actions .btn { justify-content: center; width: 100%; }
          /* The flex row wrapped 3 stats to 2+1 and orphaned a divider.
             Children are stat/rule/stat/rule/stat — drop the rule divs and
             let a border carry the separation in an even 3-up. */
          .hero-stats { display: grid !important; grid-template-columns: repeat(3, 1fr);
                        gap: 0 !important; margin-top: 32px !important; }
          .hero-stats > div:nth-child(even) { display: none; }
          .hero-stats > div:nth-child(3),
          .hero-stats > div:nth-child(5) { border-left: 1px solid var(--line); padding-left: 14px; }
          .hero-stats > div:nth-child(odd) { padding-right: 10px; }
          .hero-stats > div > div:last-child { letter-spacing: .06em !important; font-size: 12px !important; }
        }
      `}</style>
    </section>
  )
}
