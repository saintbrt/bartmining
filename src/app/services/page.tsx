import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import ServiceGrid from '@/components/sections/ServiceGrid'
import PhasesSection from '@/components/sections/PhasesSection'
import RegionsSection from '@/components/sections/RegionsSection'
import CtaSection from '@/components/sections/CtaSection'

export const metadata: Metadata = {
  title: 'Mining & Exploration Services in Tanzania & Africa | Bart Mining',
  description: 'Mining services across East & Southern Africa: geological survey, mineral exploration, drilling, mine planning & design, processing plants and safety equipment. Principal-led, JORC-compliant, ICMM-aligned.',
  alternates: { canonical: 'https://www.bartmining.com/services' },
  openGraph: { type: 'website', url: 'https://www.bartmining.com/services', title: 'Mining & Exploration Services in Tanzania & Africa | Bart Mining', description: 'Geological survey, exploration, mine planning, processing plants and safety equipment across East & Southern Africa.' },
}

export default function Services() {
  return (
    <>
      {/* Subhero */}
      <section className="subhero">
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>Services</span></div></Reveal>
          <Reveal delay={1}><h1>Five capabilities, <span className="grad">one principal.</span></h1></Reveal>
          <Reveal delay={2}><p className="lead">Bart Mining advises across the entire mining lifecycle - exploration to closure. Every engagement is led by the principal, with the same operator&apos;s judgement applied whether we&apos;re mapping an outcrop or commissioning a gold plant.</p></Reveal>
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
      <section className="sec-gap" style={{ paddingTop: 40 }}>
        <div className="px-site">
          <ServiceGrid showAll />
        </div>
      </section>

      <PhasesSection title="How an engagement actually runs." subtitle="A disciplined path from discovery to closure - every phase shipping concrete deliverables, not just reports." />
      <RegionsSection />

      <CtaSection
        eyebrow="Ready when you are"
        heading={<>Tell us about <span className="grad">your deposit.</span></>}
        body="Share the stage, location and commodity - we'll map the right scope and put you in front of the principal."
        primaryLabel="Start a project"
        primaryHref="/contact"
        secondaryLabel="See equipment"
        secondaryHref="/products"
      />
    </>
  )
}
