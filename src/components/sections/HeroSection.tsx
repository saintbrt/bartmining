'use client'

import Link from 'next/link'
import Image from 'next/image'
import Counter from '@/components/ui/Counter'
import Reveal from '@/components/ui/Reveal'
import { useEffect, useRef } from 'react'

export default function HeroSection() {
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const onMove = (e: MouseEvent) => {
      const r = frame.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width / 2) / r.width
      const y = (e.clientY - r.top - r.height / 2) / r.height
      frame.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg)`
    }
    const onLeave = () => { frame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)' }
    frame.addEventListener('mousemove', onMove)
    frame.addEventListener('mouseleave', onLeave)
    return () => { frame.removeEventListener('mousemove', onMove); frame.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <section style={{ position: 'relative', padding: '168px 0 90px', overflow: 'hidden' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
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
          <Reveal delay={3} style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
            <Link href="/services" className="btn btn-gold">
              Explore our services
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link href="#method" className="btn btn-ghost">How we work</Link>
          </Reveal>
          <Reveal delay={4} style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 40, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
                <Counter target={25} suffix="+" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: 4 }}>Years in the field</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
                <Counter target={12} suffix="+" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: 4 }}>Countries worked</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: 'var(--ink)' }}>
                <Counter target={6} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: 4 }}>Continents</div>
            </div>
          </Reveal>
        </div>

        {/* Visual */}
        <Reveal delay={2}>
          <div
            ref={frameRef}
            style={{
              position: 'relative',
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              aspectRatio: '4/3',
              boxShadow: 'var(--shadow-lg), var(--shadow-gold)',
              transition: 'transform .3s var(--ease)',
              willChange: 'transform',
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
              background: 'rgba(252,251,249,.92)', backdropFilter: 'blur(12px)',
              border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)',
              padding: '12px 16px', boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Now advising</div>
              <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 14, color: 'var(--ink)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34C759', boxShadow: '0 0 6px #34C759', display: 'inline-block', flexShrink: 0 }} />
                3 live projects
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          section > .px-site { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
