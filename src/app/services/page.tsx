import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import ServiceGrid from '@/components/sections/ServiceGrid'
import PhasesSection from '@/components/sections/PhasesSection'
import RegionsSection from '@/components/sections/RegionsSection'
import CtaSection from '@/components/sections/CtaSection'
import { SITE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Mining & Exploration Services in Tanzania & Africa',
  description: 'Mining services across East & Southern Africa: geological survey, exploration, drilling, mine planning, processing plants and safety equipment. JORC-compliant.',
  alternates: { canonical: `${SITE.url}/services` },
  openGraph: { type: 'website', url: `${SITE.url}/services`, title: 'Mining & Exploration Services in Tanzania & Africa | Bart Mining', description: 'Geological survey, exploration, mine planning, processing plants and safety equipment across East & Southern Africa.' },
}

export default function Services() {
  return (
    <>
      {/* Subhero */}
      <section className="subhero">
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>Services</span></div></Reveal>
          <Reveal delay={1}><h1>Five capabilities, <span className="grad">one principal</span></h1></Reveal>
          <Reveal delay={2}><p className="lead">Bart Mining advises across the entire mining lifecycle, from exploration to closure. Every engagement is led by the principal, with the same operator&apos;s judgement applied whether we&apos;re mapping an outcrop or commissioning a gold plant.</p></Reveal>
          <Reveal delay={3}>
            <div className="subhero-meta">
              <div><div className="num">Discover</div><div className="lbl">&#8594; Define &#8594; Build &#8594; Close</div></div>
              <div className="div" />
              <div><div className="num">JORC</div><div className="lbl">Compliant reporting</div></div>
              <div className="div" />
              <div><div className="num">ICMM</div><div className="lbl">Aligned standards</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Service detail list */}
      <section className="sec-gap" style={{ paddingTop: 80 }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Capabilities</span>
            <h2>What we do, in detail</h2>
          </Reveal>
          <ServiceGrid showAll />
        </div>
      </section>

      {/* Technical consulting. The detailed page is the site's largest
          impression source, so it gets a direct, descriptive link here. */}
      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <div className="split2" style={{ alignItems: 'center' }}>
            <Reveal>
              <span className="eyebrow">Technical consulting</span>
              <h2 style={{ marginTop: 16 }}>Due diligence, resource estimation and mining studies</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 18 }}>
                Independent technical advice for owners, investors and lenders: JORC and NI 43-101 resource estimates signed by a Competent Person, scoping to feasibility studies, technical due diligence, and underground and coal mining advisory.
              </p>
              <div style={{ marginTop: 26 }}>
                <Link href="/insights/mining-consulting-africa" className="btn btn-ink">
                  Mining technical consulting
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 16, height: 16 }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <ul style={{ display: 'grid', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Technical due diligence for investors and acquirers',
                  'JORC and NI 43-101 resource estimation',
                  'Scoping, pre-feasibility and feasibility studies',
                  'Underground and coal mining advisory',
                  'Exploration programme design and management',
                ].map(t => (
                  <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--bg-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', padding: '12px 16px', fontSize: 15.5, color: 'var(--ink-2)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <PhasesSection title="How an engagement actually runs" subtitle="A disciplined path from discovery to closure, every phase shipping concrete deliverables, not just reports." />
      <RegionsSection />

      <CtaSection
        eyebrow="Ready when you are"
        heading={<>Tell us about <span className="grad">your deposit</span></>}
        body="Share the stage, location and commodity, and we'll map the right scope and put you in front of the principal."
        primaryLabel="Start a project"
        primaryHref="/contact"
        secondaryLabel="See equipment"
        secondaryHref="/equipment"
      />
    </>
  )
}
