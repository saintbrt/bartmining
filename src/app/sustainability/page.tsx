import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import PillarsSection from '@/components/sections/PillarsSection'
import CtaSection from '@/components/sections/CtaSection'

export const metadata: Metadata = {
  title: 'Sustainability & ESG in Mining | Bart Mining, Africa',
  description: 'Responsible mining across East & Southern Africa: land & water stewardship, local schools, local hiring, and Free, Prior & Informed Consent aligned to ICMM PE-09. The ground you mine belongs to someone.',
  alternates: { canonical: 'https://www.bartmining.com/sustainability' },
}

export default function Sustainability() {
  return (
    <>
      {/* Subhero */}
      <section className="subhero">
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>Sustainability</span></div></Reveal>
          <Reveal delay={1}><h1>The ground you mine <span className="grad">belongs to someone.</span></h1></Reveal>
          <Reveal delay={2}><p className="lead">We remember that. Responsible mining means land that recovers, water that stays clean, workers who go home healthy, and communities that are genuinely better off, long after the last truck leaves.</p></Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="sec-gap" style={{ paddingTop: 70 }}>
        <div className="px-site">
          <div className="split2">
            <Reveal>
              <div className="about-img">
                <Image src="https://images.pexels.com/photos/5487075/pexels-photo-5487075.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Volunteers planting trees as part of a reforestation initiative" fill style={{ objectFit: 'cover' }} sizes="(max-width: 860px) 100vw, 50vw" />
              </div>
            </Reveal>
            <Reveal delay={1}>
              <span className="eyebrow">Our philosophy</span>
              <h2 style={{ fontSize: 'clamp(28px,3.4vw,42px)', marginTop: 16 }}>Closure is a day-one decision.</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 18 }}>
                Responsible mining isn&apos;t a report filed at the end. It&apos;s designed in from the first survey. That means rehabilitation planned before the first blast, water managed before it&apos;s a problem, and communities consulted before commitments are made, not after.
              </p>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 16 }}>
                Done well, it means land rehabilitation, clean water management, healthy workers, long-term community benefit, and a sustainable project closure that leaves a place better than a balance sheet alone would.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Four pillars</span>
            <h2>How responsibility shows up on site.</h2>
            <p>Concrete commitments, aligned to international standards, not slogans.</p>
          </Reveal>
          <PillarsSection />
        </div>
      </section>

      {/* Community */}
      <section className="sec-gap">
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">In the community</span>
            <h2>Benefits that outlast the mine.</h2>
          </Reveal>
          <div className="value-grid">
            {[
              { src: 'https://images.pexels.com/photos/28593055/pexels-photo-28593055.jpeg?auto=compress&cs=tinysrgb&w=900', alt: 'Schoolchildren in classroom', title: 'Supporting local schools', body: 'Classrooms, teachers, scholarships and STEM.' },
              { src: 'https://images.pexels.com/photos/6572780/pexels-photo-6572780.jpeg?auto=compress&cs=tinysrgb&w=900', alt: 'Schoolchildren at community sports day', title: 'Local hiring & youth', body: 'Workforce development and vocational training.' },
              { src: 'https://images.pexels.com/photos/5487075/pexels-photo-5487075.jpeg?auto=compress&cs=tinysrgb&w=900', alt: 'Community tree planting', title: 'Land rehabilitation', body: 'Progressive rehab and post-closure monitoring.' },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i} style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                  <Image src={c.src} alt={c.alt} fill style={{ objectFit: 'cover' }} sizes="(max-width: 860px) 100vw, 33vw" />
                </div>
                <div style={{ background: 'var(--bg-3)', padding: '20px 22px', border: '1px solid var(--line)', borderTop: 'none' } as React.CSSProperties}>
                  <h4 style={{ fontSize: 18 }}>{c.title}</h4>
                  <p style={{ color: 'var(--ink-2)', fontSize: 16, marginTop: 6 }}>{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FPIC callout */}
      <section className="sec-gap on-dark" style={{ background: 'var(--slate)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'none', pointerEvents: 'none' }} />
        <div className="px-site" style={{ position: 'relative', textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
          <Reveal><span className="eyebrow center" style={{ color: 'var(--gold-2)', justifyContent: 'center' }}>Free, Prior &amp; Informed Consent</span></Reveal>
          <Reveal delay={1}><h2 style={{ color: '#fff', fontSize: 'clamp(28px,3.8vw,46px)', marginTop: 18 }}>We do not support projects without genuine community consent.</h2></Reveal>
          <Reveal delay={2}><p style={{ color: '#B8B0A2', fontSize: 18, marginTop: 18 }}>We assist clients through the consultation process and hold our work to ICMM Performance Expectation 09. Consent isn&apos;t a hurdle to clear. It&apos;s the foundation a responsible project is built on.</p></Reveal>
        </div>
      </section>

      <CtaSection
        eyebrow="Responsible by design"
        heading={<>Build it <span className="grad">worth leaving behind.</span></>}
        body="Let's design your project so the land, the water and the community come out ahead."
        primaryLabel="Talk to us"
        primaryHref="https://wa.me/255759141705"
        secondaryLabel="Our services"
        secondaryHref="/services"
      />
    </>
  )
}
