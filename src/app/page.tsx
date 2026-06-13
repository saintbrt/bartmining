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

export const metadata: Metadata = {
  title: 'Bart Mining - Mining Consultancy & Gold Processing Plants | Tanzania & Africa',
  description: 'Bart Mining is a principal-led mining consultancy and equipment supplier in Dar es Salaam, Tanzania. Mineral exploration, geological survey, mine planning, gold processing plants and safety equipment across East & Southern Africa.',
  alternates: { canonical: 'https://www.bartmining.com/' },
  openGraph: {
    type: 'website', url: 'https://www.bartmining.com/',
    title: 'Bart Mining - Mining Consultancy & Gold Processing Plants',
    description: 'Principal-led mining consultancy and equipment supply across East & Southern Africa. Resource development done responsibly.',
    images: ['https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  },
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
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
                Decades on the ground across <span className="grad">six continents</span> - exploration, operations and the hard calls between them.
              </blockquote>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 22 }}>
                Bartholomew Ambrose has led exploration and operated mines for major producers, working deposits from Brazilian rainforest to Canadian shield. He brings that operator&apos;s judgement to every client engagement - principal-led, never delegated to a junior.
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
                The ground you mine <span className="grad">belongs to someone.</span> We remember that.
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
        heading={<>Let&apos;s build something <span className="grad">worth leaving behind.</span></>}
        body="Whether you're proving a deposit, planning a mine, sourcing a processing plant or evaluating a project - start with a conversation with the principal."
        primaryLabel="Start a project"
        primaryHref="/contact"
        secondaryLabel="View services"
        secondaryHref="/services"
      />
    </>
  )
}
