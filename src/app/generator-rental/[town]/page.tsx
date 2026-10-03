import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Reveal from '@/components/ui/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import GeneratorSizer from '@/components/sections/GeneratorSizer'
import { Faqs, Included, QuoteSteps, RentalContact, SizeBands } from '@/components/sections/GeneratorRental'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/seo'
import { RENTAL_TOWNS, whatsappLink } from '@/data/generator-rental'

/**
 * Generator rental in one town. Only towns in RENTAL_TOWNS get a page, and
 * each carries content true of that town alone (see src/data/generator-rental.ts).
 */

export const dynamicParams = false

export function generateStaticParams() {
  return RENTAL_TOWNS.map(t => ({ town: t.slug }))
}

const find = (slug: string) => RENTAL_TOWNS.find(t => t.slug === slug)

export async function generateMetadata({ params }: { params: Promise<{ town: string }> }): Promise<Metadata> {
  const t = find((await params).town)
  if (!t) return {}
  const url = `${SITE.url}/generator-rental/${t.slug}`
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: t.title, description: t.description },
  }
}

export default async function GeneratorRentalTownPage({ params }: { params: Promise<{ town: string }> }) {
  const t = find((await params).town)
  if (!t) notFound()
  const message = `Hello Bart Mining, I am enquiring about generator rental in ${t.town}. Size or load: ... Site: ... Dates: ...`
  const others = RENTAL_TOWNS.filter(x => x.slug !== t.slug)

  return (
    <>
      <JsonLd data={[
        serviceSchema({
          slug: t.slug,
          path: `/generator-rental/${t.slug}`,
          name: `Generator rental in ${t.town}`,
          description: t.description,
          city: t.town,
          region: t.region,
          serviceType: 'Generator rental',
          catalog: { name: 'Generator rental, 300 to 2,500 kVA', path: '/generator-rental' },
        }),
        faqSchema(t.faqs),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Generator Rental', path: '/generator-rental' },
          { name: t.town, path: `/generator-rental/${t.slug}` },
        ]),
      ]} />

      <section className="subhero" style={{ paddingBottom: 40 }}>
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal>
            <div className="crumb">
              <Link href="/">Home</Link><span className="sep">/</span>
              <Link href="/generator-rental">Generator Rental</Link><span className="sep">/</span>
              <span>{t.town}</span>
            </div>
          </Reveal>
          <Reveal delay={1}><h1>{t.title}</h1></Reveal>
          <Reveal delay={2}><p className="lead">{t.summary}</p></Reveal>
          <Reveal delay={3}><RentalContact message={message} /></Reveal>
        </div>
      </section>

      <section className="sec-gap" style={{ paddingTop: 40 }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">{t.town}</span>
            <h2>What generators are hired for in {t.town}</h2>
          </Reveal>
          <div className="value-grid">
            {t.demand.map((d, i) => (
              <Reveal key={d.title} delay={i} className="gr-card">
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <div className="split2" style={{ alignItems: 'flex-start' }}>
            <Reveal>
              <span className="eyebrow">Getting it there</span>
              <h2 style={{ marginTop: 16 }}>Delivery to sites in and around {t.town}</h2>
              <ul className="gr-list">
                {t.logistics.map(l => <li key={l}>{l}</li>)}
              </ul>
              {t.supplyPage && (
                <p style={{ color: 'var(--ink-2)', fontSize: 15.5, marginTop: 16 }}>
                  We also supply mining equipment in {t.town}: see{' '}
                  <Link href={t.supplyPage} style={{ color: 'var(--gold)' }}>mining equipment in {t.town}</Link>.
                </p>
              )}
            </Reveal>
            <Reveal delay={1}>
              <span className="eyebrow">Sizes</span>
              <h2 style={{ marginTop: 16 }}>300 to 2,500 kVA</h2>
              <SizeBands />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec-gap">
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Sizing calculator</span>
            <h2>What size generator do I need?</h2>
            <p>List what the generator will run. The calculator allows for motor starting surge and keeps the set below 80% load.</p>
          </Reveal>
          <Reveal delay={1}><GeneratorSizer source={`generator rental ${t.town} page`} /></Reveal>
        </div>
      </section>

      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Included in every hire</span>
            <h2>Delivered, installed, run and serviced</h2>
          </Reveal>
          <Included />
        </div>
      </section>

      <section className="sec-gap">
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Getting a quote</span>
            <h2>How to rent a generator in {t.town}</h2>
          </Reveal>
          <QuoteSteps />
          <Reveal delay={1} style={{ marginTop: 28 }}><RentalContact message={message} /></Reveal>
        </div>
      </section>

      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">FAQ</span>
            <h2>Generator rental in {t.town}: questions</h2>
          </Reveal>
          <Faqs faqs={t.faqs} />
          <p style={{ marginTop: 24, fontSize: 15, color: 'var(--ink-2)' }}>
            More on sizes, prime and standby power and large loads:{' '}
            <Link href="/generator-rental" style={{ color: 'var(--gold)' }}>generator rental in Tanzania</Link>. Also in{' '}
            {others.map((o, i) => (
              <span key={o.slug}>
                {i > 0 && ' and '}
                <Link href={`/generator-rental/${o.slug}`} style={{ color: 'var(--gold)' }}>{o.town}</Link>
              </span>
            ))}.
          </p>
        </div>
      </section>

      <CtaSection
        eyebrow={`Generator rental, ${t.town}`}
        heading={<>Tell us the load and <span className="grad">we&apos;ll size the generator</span></>}
        body="Send the size or your load list, the site and the dates, and we'll come back with a quote for the whole hire."
        primaryLabel="WhatsApp for a quote"
        primaryHref={whatsappLink(message)}
        secondaryLabel="All generator sizes"
        secondaryHref="/generator-rental"
      />
    </>
  )
}
