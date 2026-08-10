import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import Counter from '@/components/ui/Counter'
import CtaSection from '@/components/sections/CtaSection'

export const metadata: Metadata = {
  title: 'About & Founder Bartholomew Ambrose | Bart Mining, Tanzania',
  description: 'Bart Mining is a principal-led mining consultancy founded by Bartholomew Ambrose, with 25+ years across 6 continents including Resolute Mine and Barrick Gold. Based in Dar es Salaam, serving East & Southern Africa.',
  alternates: { canonical: 'https://www.bartmining.com/about' },
  openGraph: { type: 'website', url: 'https://www.bartmining.com/about', title: 'About & Founder | Bart Mining', description: 'Principal-led mining consultancy built on decades of real operating experience across East & Southern Africa.' },
}

export default function About() {
  return (
    <>
      {/* Subhero */}
      <section className="subhero">
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>About</span></div></Reveal>
          <Reveal delay={1}><h1>Hands in the rock, <span className="grad">not just theory</span></h1></Reveal>
          <Reveal delay={2}><p className="lead">Bart Mining Consultancy advises mining companies, governments and investors across the full mine lifecycle, built on decades of real operating experience and a simple commitment: resource development done responsibly.</p></Reveal>
        </div>
      </section>

      {/* Founder */}
      <section className="sec-gap">
        <div className="px-site">
          <div className="split2">
            <Reveal style={{ aspectRatio: '3/4', position: 'relative' }}>
              <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', width: '100%', height: '100%', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
                <Image
                  src="https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Bartholomew Ambrose on an exploration site"
                  fill style={{ objectFit: 'cover' }}
                  sizes="(max-width: 860px) 100vw, 50vw"
                />
              </div>
              <div className="tagchip"><div className="q">&ldquo;Hands in the rock, not just theory on a slide deck.&rdquo;</div></div>
            </Reveal>
            <Reveal delay={1}>
              <span className="eyebrow">The founder</span>
              <h2 style={{ fontSize: 'clamp(30px,3.6vw,46px)', marginTop: 16 }}>Bartholomew Ambrose</h2>
              <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-deep)', fontSize: 15, letterSpacing: '.06em', marginTop: 10 }}>EXPLORATION MANAGER &middot; GENERAL MANAGER &middot; MINING OPERATOR</p>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 22 }}>
                Bart has led exploration programs and operated producing mines for some of the industry&apos;s major names, working deposits from Brazilian rainforest to the Canadian shield, across West and Central Africa, and through the Australian outback. That breadth means he has made the hard calls in person: where to drill, when to stop, how to close responsibly.
              </p>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 16 }}>
                Bart Mining is built around that judgement. Engagements are principal-led. The person advising you is the person who has stood on the bench and signed off the plan, not a junior with a template.
              </p>
              <div className="career">
                {['Resolute Mine', 'Barrick Gold', 'Brazil', 'Liberia', 'DRC', 'Australia', 'Canada', 'Tanzania'].map(c => (
                  <span key={c} className="c">{c}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="sec-gap" style={{ background: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
        <div className="px-site">
          <div className="stats-band" style={{ background: 'transparent', padding: 0 }}>
            {[
              { target: 25, suffix: '+', label: 'Years mining experience' },
              { target: 12, suffix: '+', label: 'Countries worked in' },
              { target: 6,  suffix: '',  label: 'Continents worked on' },
              { target: 0,  suffix: '',  label: 'Safety corners cut', gold: true },
            ].map(s => (
              <Reveal key={s.label} style={{ textAlign: 'center', padding: '0 20px' }}>
                <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 'clamp(36px,4vw,52px)', letterSpacing: '-0.04em', lineHeight: 1, color: s.gold ? 'var(--gold-deep)' : 'var(--ink)' }}>
                  <Counter target={s.target} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: 8 }}>{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="sec-gap">
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Who we work with</span>
            <h2>Three audiences, one standard of rigour</h2>
          </Reveal>
          <div className="value-grid">
            <Reveal style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', padding: '28px 26px', boxShadow: 'var(--shadow-sm)' }}>
              <div className="vn" style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--gold)', marginBottom: 14 }}>01</div>
              <h4 style={{ fontSize: 17, marginBottom: 8 }}>Mining Companies</h4>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6 }}>Support throughout mine development and operation, from resource definition to commissioning and production advisory.</p>
            </Reveal>
            <Reveal delay={1} style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', padding: '28px 26px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--gold)', marginBottom: 14 }}>02</div>
              <h4 style={{ fontSize: 17, marginBottom: 8 }}>Governments</h4>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6 }}>Mining advisory and development planning, balancing resource value with environmental and community outcomes.</p>
            </Reveal>
            <Reveal delay={2} style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', padding: '28px 26px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--gold)', marginBottom: 14 }}>03</div>
              <h4 style={{ fontSize: 17, marginBottom: 8 }}>Investors</h4>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6 }}>Technical due diligence and resource-project evaluation that survives scrutiny, so capital is committed with eyes open.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">What we stand for</span>
            <h2>Principles we don&apos;t bend</h2>
          </Reveal>
          <div className="value-grid">
            {[
              { dot: '·', title: 'Principal-led', body: 'The decision-maker is on site. Advice is never delegated to a template.' },
              { dot: '·', title: 'Safety-first', body: 'Safety corners cut: zero, always. It is the precondition, not a trade-off.' },
              { dot: '·', title: 'Responsible', body: 'The ground you mine belongs to someone. Closure is a day-one decision.' },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i} style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', padding: '28px 26px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--gold)', marginBottom: 14 }}>{v.dot}</div>
                <h4 style={{ fontSize: 17, marginBottom: 8 }}>{v.title}</h4>
                <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6 }}>{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="Work with the principal"
        heading={<>Let&apos;s build something <span className="grad">worth leaving behind</span></>}
        body="Start with a direct conversation about your project, your stage and what responsible looks like for your site."
        primaryLabel="Get in touch"
        primaryHref="https://wa.me/255759141705"
        secondaryLabel="Explore services"
        secondaryHref="/services"
      />
    </>
  )
}
