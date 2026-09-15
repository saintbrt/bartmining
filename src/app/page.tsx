import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import HeroSection from '@/components/sections/HeroSection'
import MarqueeSection from '@/components/sections/MarqueeSection'
import ServiceGrid from '@/components/sections/ServiceGrid'
import PhasesSection from '@/components/sections/PhasesSection'
import PillarsSection from '@/components/sections/PillarsSection'
import RegionsSection from '@/components/sections/RegionsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CtaSection from '@/components/sections/CtaSection'
import Reveal from '@/components/ui/Reveal'
import { SITE } from '@/lib/seo'
import { getGoldQuote, formatTzs } from '@/lib/gold-spot'

// The Kiswahili block shows the live gold price, refreshed on the same
// hourly cycle as /bei-ya-dhahabu-leo.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Bart Mining: Mining Consultancy & Gold Processing Equipment, Tanzania',
  description: 'Mining consultancy and gold processing equipment supplier in Dar es Salaam, Tanzania: technical consulting, elution and CIP plants, winches and safety kit.',
  alternates: { canonical: `${SITE.url}/` },
  openGraph: {
    type: 'website', url: `${SITE.url}/`,
    title: 'Bart Mining: Mining Consultancy & Gold Processing Equipment, Tanzania',
    description: 'Technical consulting, gold processing plants, winches and mine safety equipment supplied across East & Southern Africa.',
    images: ['https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
}

/**
 * Ordered by Search Console impressions (3-month export, Sep 2026), so the
 * homepage passes link weight to the pages Google is already testing.
 */
const MOST_REQUESTED: { href: string; t: string; d: string; also?: { href: string; label: string }[] }[] = [
  { href: '/insights/mining-consulting-africa', t: 'Mining technical consulting', d: 'Due diligence, JORC and NI 43-101 resource estimation, scoping to feasibility studies.' },
  { href: '/equipment/gold-elution-electrowinning-plant', t: 'Gold elution & electrowinning plant', d: 'AARL and Zadra circuits, batch sizes and the elution process explained.' },
  { href: '/equipment/cil-cip-plant', t: 'CIP & CIL gold plants', d: 'Plant design, tank sizing, residence time and recovery.' },
  { href: '/equipment/gold-metal-detector', t: 'PI vs VLF gold detectors', d: 'Which detector works in mineralised Tanzanian soils.' },
  { href: '/equipment/centrifugal-gold-concentrator', t: 'Centrifugal gold concentrator', d: 'Mercury-free gravity recovery down to about 20 microns.' },
  { href: '/equipment/self-contained-self-rescuer', t: 'SCSR self-rescuers', d: 'Duration ratings, standards and cache planning for underground mines.' },
  { href: '/equipment/rc-drilling-rig', t: 'RC drilling rig', d: 'Specifications, depth capacity and sample quality for gold exploration.' },
  {
    href: '/equipment/1-ton-winch', t: 'Mining winches', d: 'Shaft hoisting for small-scale mines, by load and depth.',
    also: [
      { href: '/equipment/1-ton-winch', label: '1 ton' },
      { href: '/equipment/2-ton-winch', label: '2 ton' },
      { href: '/equipment/5-ton-mine-winch', label: '5 ton' },
    ],
  },
]

const SW_PAGES = [
  { href: '/vifaa-vya-uchimbaji', t: 'Vifaa vya uchimbaji', d: 'Mashine na vifaa vya migodi Tanzania' },
  { href: '/bei-ya-vifaa-vya-uchimbaji', t: 'Bei ya vifaa vya uchimbaji', d: 'Gharama za mashine na usafirishaji' },
  { href: '/jinsi-ya-kupata-leseni-ya-pml', t: 'Leseni ya PML', d: 'Jinsi ya kupata leseni ya uchimbaji mdogo' },
  { href: '/gharama-ya-plant-ya-dhahabu', t: 'Gharama ya plant ya dhahabu', d: 'Bei ya kujenga plant ndogo ya dhahabu' },
]

const cardStyle = {
  display: 'block', borderRadius: 'var(--r-md)', border: '1px solid var(--line-2)',
  background: 'var(--bg-3)', padding: '22px 20px', height: '100%',
} as const

export default async function Home() {
  const quote = await getGoldQuote(revalidate)
  return (
    <>
      <HeroSection />
      <MarqueeSection />

      {/* Most requested */}
      <section className="sec-gap" style={{ background: 'var(--bg)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Most requested</span>
            <h2>What mining teams come to us for</h2>
            <p>Consulting, gold recovery plants, exploration kit and underground safety, specified for Tanzanian ore, power and logistics.</p>
          </Reveal>
          <div className="home-grid-4">
            {MOST_REQUESTED.map((m, i) => (
              <Reveal key={m.href} delay={i % 4}>
                <div style={cardStyle}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
                    <Link href={m.href} style={{ color: 'var(--ink)' }}>{m.t}</Link>
                  </h3>
                  <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.6 }}>{m.d}</p>
                  {m.also && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                      {m.also.map(a => (
                        <Link key={a.href} href={a.href} style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', padding: '3px 10px' }}>
                          {a.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 34 }}>
            <Link href="/equipment" className="btn btn-gold">
              Browse all equipment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 16, height: 16 }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Kwa Kiswahili */}
      <section className="sec-gap" lang="sw" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <div className="split2" style={{ alignItems: 'center' }}>
            <Reveal>
              <span className="eyebrow">Kwa Kiswahili</span>
              <h2 style={{ marginTop: 16 }}>Kwa wachimbaji wadogo Tanzania</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 18 }}>
                Bei ya dhahabu leo, vifaa vya uchimbaji, gharama za plant na leseni ya PML, kwa lugha yako.
              </p>
              <Link href="/bei-ya-dhahabu-leo" hrefLang="sw" style={{ ...cardStyle, marginTop: 24, background: '#FFFFFF' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                  Bei ya dhahabu leo · gramu 1, 24K
                </div>
                <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--ink)', marginTop: 6 }}>
                  {quote ? formatTzs(quote.tzsGram) : 'Angalia bei ya leo'}
                </div>
                <div style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 600, marginTop: 6 }}>
                  Bei kwa karati zote &rarr;
                </div>
              </Link>
            </Reveal>
            <Reveal delay={1}>
              <div className="home-grid-2">
                {SW_PAGES.map(p => (
                  <div key={p.href} style={{ ...cardStyle, background: '#FFFFFF' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>
                      <Link href={p.href} hrefLang="sw" style={{ color: 'var(--ink)' }}>{p.t}</Link>
                    </h3>
                    <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>{p.d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <style>{`
        .home-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .home-grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; }
        @media (max-width: 1080px) { .home-grid-4 { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 600px)  { .home-grid-4, .home-grid-2 { grid-template-columns: 1fr; } }
      `}</style>

      <ServiceGrid />

      {/* Methodology */}
      <PhasesSection />

      {/* Founder */}
      <section className="sec-gap" id="founder" style={{ background: 'var(--bg)' }}>
        <div className="px-site">
          <div className="split2">
            <div className="founder-img" style={{ aspectRatio: '3/4' }}>
              <Image
                src="https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Exploration site in the field"
                fill
                style={{ objectFit: 'cover', borderRadius: 'var(--r-lg)' }}
                sizes="(max-width: 860px) 100vw, 50vw"
              />
              <div className="tagchip">
                <div className="q">&ldquo;Hands in the rock, not just theory on a slide deck.&rdquo;</div>
              </div>
            </div>
            <Reveal delay={1}>
              <span className="eyebrow">The founder</span>
              <blockquote style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2, marginTop: 18, color: 'var(--ink)' }}>
                Decades on the ground across <span className="grad">six continents</span>, exploration, operations and the hard calls between them
              </blockquote>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 22 }}>
                Bartholomew Ambrose has led exploration and operated mines for major producers, working deposits from Brazilian rainforest to Canadian shield. He brings that operator&apos;s judgement to every client engagement, principal-led and never delegated to a junior.
              </p>
              <div className="career">
                {['Resolute Mine', 'Barrick Gold', 'Brazil', 'Liberia', 'DRC', 'Australia', 'Canada'].map(c => (
                  <span key={c} className="c">{c}</span>
                ))}
              </div>
              <div style={{ marginTop: 28 }}>
                <Link href="/about" className="btn btn-ghost">
                  More about Bart
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 16, height: 16 }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="sec-gap" id="sustainability" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <div className="split2" style={{ alignItems: 'center' }}>
            <Reveal>
              <span className="eyebrow">Sustainability &amp; ESG</span>
              <p style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 'clamp(28px,3.4vw,42px)', letterSpacing: '-0.03em', lineHeight: 1.2, marginTop: 16, color: 'var(--ink)' }}>
                The ground you mine <span className="grad">belongs to someone.</span> We remember that
              </p>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 22 }}>
                Responsible mining means land that recovers, water that stays clean, workers who go home healthy, and communities that are better off long after the last truck leaves.
              </p>
              <div style={{ marginTop: 26 }}>
                <Link href="/sustainability" className="btn btn-ink">
                  Our ESG approach
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 16, height: 16 }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="about-img">
                <Image
                  src="https://images.pexels.com/photos/5487075/pexels-photo-5487075.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Volunteers planting trees as part of a reforestation initiative"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 860px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          </div>
          <div style={{ marginTop: 56 }}>
            <PillarsSection />
          </div>
        </div>
      </section>

      <RegionsSection />
      <TestimonialsSection />

      <CtaSection
        eyebrow="Let's talk"
        heading={<>Let&apos;s build something <span className="grad">worth leaving behind</span></>}
        body="Whether you're proving a deposit, planning a mine, sourcing a processing plant or evaluating a project, start with a conversation with the principal."
        primaryLabel="Start a project"
        primaryHref="https://wa.me/255759141705"
        secondaryLabel="View services"
        secondaryHref="/services"
      />
    </>
  )
}
