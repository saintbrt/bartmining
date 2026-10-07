import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import LeachTankCalculator from '@/components/tools/LeachTankCalculator'
import LeachTankPlantIllustration from '@/components/tools/LeachTankPlantIllustration'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, breadcrumbSchema } from '@/lib/seo'

/**
 * Leach tank volume calculator (SEO checklist Phase G, search-demand plan
 * Phase 6). Same method as the leaching tank FAQ and the small CIP plant
 * guide. Kiswahili: /insights-swahili/kikokotoo-cha-tanki-la-leaching.
 */

const URL = `${SITE.url}/tools/leach-tank-calculator`
const SW_URL = `${SITE.url}/insights-swahili/kikokotoo-cha-tanki-la-leaching`
const TITLE = 'Leach Tank Volume Calculator for CIL and CIP Plants'
const DESCRIPTION = 'Work out the slurry flow, working volume and volume per tank for a small CIL or CIP gold plant from tonnes per day, slurry density and leach time.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL, languages: { en: URL, 'sw-TZ': SW_URL, 'x-default': URL } },
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESCRIPTION },
}

export default function LeachTankCalculatorPage() {
  return (
    <>
      <JsonLd data={[
        {
          '@context': 'https://schema.org', '@type': 'WebApplication', name: TITLE, url: URL, description: DESCRIPTION,
          applicationCategory: 'CalculatorApplication', operatingSystem: 'Any', isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Equipment', path: '/equipment' },
          { name: 'Leach tank calculator', path: '/tools/leach-tank-calculator' },
        ]),
      ]} />

      <section className="subhero" style={{ paddingBottom: 32 }}>
        <div className="px-site">
          <Reveal>
            <nav className="crumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span className="sep">/</span><Link href="/equipment">Equipment</Link><span className="sep">/</span><span>Leach tank calculator</span>
            </nav>
          </Reveal>
          <Reveal delay={1}><h1 style={{ marginTop: 14 }}>{TITLE}</h1></Reveal>
          <Reveal delay={2}>
            <p className="lead">
              How big do the leach tanks need to be for your plant? The volume comes from the slurry flow and the
              time your ore needs to leach. Enter your tonnes per day, slurry density, ore specific gravity and the
              residence time from your leach test, and the calculator gives the working volume and the volume of each tank.
            </p>
          </Reveal>
          <p style={{ marginTop: 16, fontSize: 15 }} lang="sw">
            Unasoma Kiswahili? <Link href="/insights-swahili/kikokotoo-cha-tanki-la-leaching" style={{ color: 'var(--gold)', fontWeight: 600 }}>Tumia kikokotoo kwa Kiswahili</Link>
          </p>
          <LeachTankPlantIllustration />
        </div>
      </section>

      <section className="sec-gap-sm" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <LeachTankCalculator />
        </div>
      </section>

      <section className="sec-gap-sm">
        <div className="px-site tool-prose">
          <h2>How the calculation works</h2>
          <p>
            The calculator first converts your daily tonnage into tonnes of solids per hour over the plant’s operating hours.
            It then works out the slurry volume those solids make up with their water: the solids volume is the tonnage divided
            by the ore’s specific gravity, and the water volume follows from the percentage of solids by mass. Multiplying the
            slurry flow by the residence time gives the working volume the tank train must hold. A planning allowance is added,
            and the total is divided by the number of tanks.
          </p>
          <h2>A worked example</h2>
          <p>
            The default values show a plant treating 50 tonnes a day over 24 hours at 45% solids, with ore of specific gravity 2.7
            and a 24-hour leach. The slurry flow is about 3.3 m³ per hour, so the working volume is about 79.6 m³. With a 10%
            allowance that becomes about 87.6 m³, or six tanks of about 14.6 m³ each. These inputs are assumptions to show the
            method; use your own tonnage and the residence time from a leach test on your ore.
          </p>
          <h2>What the result does not include</h2>
          <p>
            The figure is a working volume for planning. It does not include freeboard above the slurry, the volume taken by
            carbon and screens, or the margins a designer applies. Agitator power, screen size, air supply and tank shape all
            need a process design based on your test results. The <Link href="/equipment/leaching-tank">leaching tank page</Link> explains
            tank construction and maintenance, and the <Link href="/insights/small-cip-plant-guide">small CIP and CIL plant guide</Link> covers
            the rest of the circuit.
          </p>
        </div>
      </section>

      <CtaSection
        eyebrow="Size your leach train"
        heading={<>Send us your <span className="grad">tonnage &amp; leach test</span></>}
        body="Share your tonnes per day, slurry density, leach test results and site power, and we will help you specify the tanks, agitators and screens together."
        primaryLabel="WhatsApp us"
        primaryHref="https://wa.me/255759141705"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
      />

      <style>{`
        .tool-prose h2 { font-size: clamp(22px, 2.6vw, 28px); margin: 28px 0 12px; }
        .tool-prose h2:first-child { margin-top: 0; }
        .tool-prose p { color: var(--ink-2); font-size: 17px; line-height: 1.7; }
        .tool-prose a { color: var(--gold); font-weight: 600; }
      `}</style>
    </>
  )
}
