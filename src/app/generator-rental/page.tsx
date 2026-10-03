import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import GeneratorSizer from '@/components/sections/GeneratorSizer'
import { Faqs, Included, QuoteSteps, RentalContact, SizeBands } from '@/components/sections/GeneratorRental'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/seo'
import { RENTAL_FAQS, RENTAL_TOWNS, whatsappLink } from '@/data/generator-rental'

/**
 * Generator rental, 300 to 2,500 kVA. Content and confirmed facts live in
 * src/data/generator-rental.ts. Town pages: ./[town]. Swahili: /jenereta-za-kukodi.
 */

const URL = `${SITE.url}/generator-rental`
const TITLE = 'Generator Rental in Tanzania: 300 to 2,500 kVA'
const DESCRIPTION = 'Generator rental in Tanzania from 300 kVA to 2,500 kVA. Delivered, installed and commissioned, with an operator and servicing included. Call or WhatsApp for a quote.'
const MESSAGE = 'Hello Bart Mining, I am enquiring about generator rental. Size or load: ... Site: ... Dates: ...'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL, languages: { en: URL, 'sw-TZ': `${SITE.url}/jenereta-za-kukodi`, 'x-default': URL } },
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESCRIPTION },
}

export default function GeneratorRentalPage() {
  return (
    <>
      <JsonLd data={[
        serviceSchema({
          slug: 'generator-rental',
          path: '/generator-rental',
          name: 'Generator rental, 300 to 2,500 kVA',
          description: DESCRIPTION,
          serviceType: 'Generator rental',
          catalog: { name: 'Generator rental, 300 to 2,500 kVA', path: '/generator-rental' },
        }),
        faqSchema(RENTAL_FAQS),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Generator Rental', path: '/generator-rental' },
        ]),
      ]} />

      <section className="subhero" style={{ paddingBottom: 40 }}>
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>Generator Rental</span></div></Reveal>
          <Reveal delay={1}><h1>{TITLE}</h1></Reveal>
          <Reveal delay={2}>
            <p className="lead">
              We rent diesel generators from 300 kVA to 2,500 kVA anywhere in Tanzania, for mines, processing plants,
              construction sites, factories, events and standby during power cuts. Every hire includes delivery,
              installation and commissioning, an operator or technician, and servicing for as long as the set is on hire.
            </p>
          </Reveal>
          <Reveal delay={3}><RentalContact message={MESSAGE} /></Reveal>
          <Reveal delay={3}>
            <div className="subhero-meta">
              <div><div className="num">300–2,500 kVA</div><div className="lbl">Single or synchronised sets</div></div>
              <div className="div" />
              <div><div className="num">Installed</div><div className="lbl">And commissioned on site</div></div>
              <div className="div" />
              <div><div className="num">Operator</div><div className="lbl">And servicing included</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sec-gap" style={{ paddingTop: 40 }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Sizes</span>
            <h2>Which generator size for which job</h2>
            <p>Generators are sized on the total running load and on the largest motor and how it starts. These bands are a starting point; the calculator below gives a figure for your own loads.</p>
          </Reveal>
          <Reveal delay={1}><SizeBands /></Reveal>
        </div>
      </section>

      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Sizing calculator</span>
            <h2>What size generator do I need?</h2>
            <p>List what the generator will run. The calculator allows for motor starting surge and keeps the set below 80% load, the same way we size a hire.</p>
          </Reveal>
          <Reveal delay={1}><GeneratorSizer source="generator rental page" /></Reveal>
        </div>
      </section>

      <section className="sec-gap">
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Included in every hire</span>
            <h2>Delivered, installed, run and serviced</h2>
          </Reveal>
          <Included />
        </div>
      </section>

      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <div className="split2" style={{ alignItems: 'flex-start' }}>
            <Reveal>
              <span className="eyebrow">Prime or standby</span>
              <h2 style={{ marginTop: 16 }}>Main power or backup</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 16.5, marginTop: 18, lineHeight: 1.7 }}>
                A <strong>prime</strong> hire is the site&apos;s main power source, running long hours at varying load. That is what a
                mine, plant or construction site off the grid needs. A <strong>standby</strong> hire backs up the grid and takes over
                during power cuts, which suits factories, hotels, hospitals and offices.
              </p>
              <p style={{ color: 'var(--ink-2)', fontSize: 16.5, marginTop: 14, lineHeight: 1.7 }}>
                For running mills, crushers and pumps every day, size on the prime rating. See our guide to{' '}
                <Link href="/insights/off-grid-mine-power" style={{ color: 'var(--gold)' }}>powering an off-grid mine site</Link>.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <span className="eyebrow">Large loads</span>
              <h2 style={{ marginTop: 16 }}>Above 1,000 kVA</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 16.5, marginTop: 18, lineHeight: 1.7 }}>
                Large loads are usually carried by two or more generators running synchronised. The sets share the load, one can
                be serviced while the others keep running, and capacity can be added later without replacing what is already on site.
              </p>
              <p style={{ color: 'var(--ink-2)', fontSize: 16.5, marginTop: 14, lineHeight: 1.7 }}>
                Large sets are heavy and need space for a truck and lifting on site. We check access before delivery.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec-gap">
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Where we deliver</span>
            <h2>Generator rental across Tanzania</h2>
            <p>
              We deliver anywhere in Tanzania. Realistic road times by district are on our{' '}
              <Link href="/delivery-shipping" style={{ color: 'var(--gold)' }}>delivery and shipping page</Link>.
            </p>
          </Reveal>
          <div className="gr-towns">
            {RENTAL_TOWNS.map((t, i) => (
              <Reveal key={t.slug} delay={i}>
                <Link href={`/generator-rental/${t.slug}`} className="gr-town">
                  <span className="gr-town-name">Generator rental in {t.town}</span>
                  <span className="gr-town-text">{t.demand.map(d => d.title).join(' · ')}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Getting a quote</span>
            <h2>How to rent a generator</h2>
          </Reveal>
          <QuoteSteps />
          <Reveal delay={1} style={{ marginTop: 28 }}><RentalContact message={MESSAGE} /></Reveal>
        </div>
      </section>

      <section className="sec-gap">
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">FAQ</span>
            <h2>Generator rental questions</h2>
          </Reveal>
          <Faqs faqs={RENTAL_FAQS} />
          <p style={{ marginTop: 24, fontSize: 15 }}>
            <Link href="/jenereta-za-kukodi" style={{ color: 'var(--gold)' }}>Soma kwa Kiswahili: Jenereta za kukodi</Link>
          </p>
        </div>
      </section>

      <CtaSection
        eyebrow="Need power on site?"
        heading={<>Tell us the load and <span className="grad">we&apos;ll size the generator</span></>}
        body="Send the size or your load list, the site and the dates, and we'll come back with a quote for the whole hire."
        primaryLabel="WhatsApp for a quote"
        primaryHref={whatsappLink(MESSAGE)}
        secondaryLabel="Diesel generator guide"
        secondaryHref="/equipment/diesel-generator-mining"
      />
    </>
  )
}
