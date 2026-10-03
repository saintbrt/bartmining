import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import PlantFlow from '@/components/sections/PlantFlow'
import CtaSection from '@/components/sections/CtaSection'
import { SITE } from '@/lib/seo'

/**
 * Alluvial plant proposal: the animated process flow of the clay-bearing
 * alluvial gold plant proposed for Mbeya Region.
 *
 * Unlisted on purpose. It's a page to send to a client alongside the PDF
 * proposal, so it is noindex, and it's not in the sitemap or the nav.
 * It shows no prices: the commercial figures live only in the PDF.
 * Data: src/data/alluvial-plant.ts (a snapshot of projects/plant-planner).
 */

const URL = `${SITE.url}/alluvial`

export const metadata: Metadata = {
  title: 'Alluvial Gold Plant Proposal | Bart Mining',
  description: 'How the proposed clay-bearing alluvial gold plant for Mbeya Region works, from the feed hopper to the gold room.',
  alternates: { canonical: URL },
  robots: { index: false, follow: false },
}

export default function AlluvialPlantProposalPage() {
  return (
    <>
      <section className="subhero" style={{ paddingBottom: 40 }}>
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>Alluvial plant proposal</span></div></Reveal>
          <Reveal delay={1}><h1>Clay-bearing alluvial gold plant for Mbeya Region</h1></Reveal>
          <Reveal delay={2}>
            <p className="lead">
              A mercury-free gravity plant built around a rotary scrubber, which breaks down the clay that traps fine gold. Press
              Show ore flow to follow the gravel through the plant, one step at a time.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="sec-gap" style={{ paddingTop: 30 }}>
        <div className="px-site">
          <PlantFlow />
        </div>
      </section>

      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Two ways to build it</span>
            <h2>Reaching 150 m³/h</h2>
          </Reveal>
          <div className="split2" style={{ alignItems: 'flex-start' }}>
            <Reveal>
              <h3 style={{ fontSize: 19, marginBottom: 10 }}>Full Scale Plant, built at once</h3>
              <p style={{ color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.7 }}>
                Build the full 150 m³/h plant in a single line with a larger scrubber, three centrifuges and two shaking
                tables. It is the lower cost per cubic metre and the simpler operation, and it suits a deposit whose grade and
                free-gold behaviour have already been confirmed by a bulk sample.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h3 style={{ fontSize: 19, marginBottom: 10 }}>Starter Modular Plant, then a second line</h3>
              <p style={{ color: 'var(--ink-2)', fontSize: 16, lineHeight: 1.7 }}>
                Start with a 75 m³/h line and prove the grade on real production. Once the deposit is confirmed, add an
                identical second line beside it. The ponds, gold room and control container are built at full size from day
                one, so the second line connects without disturbing the first. Two independent lines also keep half the plant
                running while the other is being serviced.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="Next step"
        heading={<>Talk through the plant <span className="grad">with our team</span></>}
        body="We can walk you through the flowsheet, the equipment list and the delivery schedule, and confirm the option that fits your deposit."
        primaryLabel="Contact us"
        primaryHref="/contact"
        secondaryLabel="Browse equipment"
        secondaryHref="/equipment"
      />
    </>
  )
}
