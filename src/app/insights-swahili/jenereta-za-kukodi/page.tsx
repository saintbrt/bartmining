import { SW_GENERATOR_RENTAL_FAQS as FAQS } from '@/data/service-faqs'
import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import GeneratorSizer from '@/components/sections/GeneratorSizer'
import JsonLd from '@/components/seo/JsonLd'
import { RentalHero } from '@/components/sections/GeneratorRental'
import { SITE, breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/seo'
import { PHONE_DISPLAY, PHONE_HREF, whatsappLink } from '@/data/generator-rental'
import { heroImage } from '@/lib/rental-images'

const HERO = heroImage()

/**
 * Jenereta za kukodi: the Swahili counterpart of /generator-rental, cross-linked
 * with hreflang. Facts match src/data/generator-rental.ts (300 to 2,500 kVA,
 * delivery, installation, operator and servicing included, prices on request).
 */

const URL = `${SITE.url}/insights-swahili/jenereta-za-kukodi`
const TITLE = 'Jenereta za Kukodi Tanzania: kVA 300 hadi 2,500'
const DESCRIPTION = 'Jenereta za kukodi Tanzania, kVA 300 hadi 2,500. Tunaleta, tunafunga na kuwasha, pamoja na mwendeshaji na matengenezo. Piga simu au WhatsApp upate bei.'
const MESSAGE = 'Habari Bart Mining, naomba bei ya kukodi jenereta. Ukubwa au mzigo: ... Eneo: ... Tarehe: ...'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL, languages: { 'sw-TZ': URL, en: `${SITE.url}/generator-rental`, 'x-default': `${SITE.url}/generator-rental` } },
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESCRIPTION, locale: 'sw_TZ', ...(HERO ? { images: [{ url: HERO.src, alt: HERO.alt }] } : {}) },
}

const SIZES = [
  { range: 'kVA 300 hadi 500', kazi: 'Mitambo midogo ya kuosha dhahabu, vinu vidogo vya kusaga, maeneo ya ujenzi, hoteli, ofisi na hospitali (umeme wa akiba)' },
  { range: 'kVA 500 hadi 1,000', kazi: 'Mashine za kuponda na kusaga mawe, mitambo mikubwa ya kuchenjua, viwanda na miradi mikubwa ya ujenzi' },
  { range: 'kVA 1,000 hadi 2,500', kazi: 'Mitambo kamili ya kuchenjua, umeme wa mgodi mzima na viwanda vikubwa. Mara nyingi jenereta mbili au zaidi hufanya kazi pamoja (synchronised)' },
]

const INCLUDED = [
  { t: 'Kuleta na kurudisha', d: 'Tunaleta jenereta hadi eneo lako na kuichukua kukodi kukiisha, popote Tanzania.' },
  { t: 'Kufunga na kuwasha', d: 'Tunaifunga kwenye ubao wako wa umeme na kuijaribu ikiwa na mzigo kabla ya kukukabidhi.' },
  { t: 'Mwendeshaji eneo la kazi', d: 'Mwendeshaji anabaki na jenereta muda wote wa kukodi, akiiendesha na kuikagua ili hitilafu zigundulike mapema.' },
  { t: 'Matengenezo wakati wa kukodi', d: 'Oili, filta na huduma za kawaida kwa ratiba, pamoja na msaada jenereta ikiharibika.' },
]



export default function JeneretaZaKukodiPage() {
  return (
    <>
      <JsonLd data={[
        serviceSchema({
          slug: 'jenereta-za-kukodi',
          path: '/insights-swahili/jenereta-za-kukodi',
          name: 'Jenereta za kukodi, kVA 300 hadi 2,500',
          description: DESCRIPTION,
          serviceType: 'Generator rental',
          catalog: { name: 'Jenereta za kukodi', path: '/insights-swahili/jenereta-za-kukodi' },
        }),
        faqSchema(FAQS, 'sw'),
        breadcrumbSchema([
          { name: 'Nyumbani', path: '/' },
          { name: 'Kurasa kwa Kiswahili', path: '/insights-swahili' },
          { name: 'Jenereta za Kukodi', path: '/insights-swahili/jenereta-za-kukodi' },
        ]),
      ]} />

      {/* lang is set here because the root layout declares lang="en". */}
      <div lang="sw">
        <section className="subhero" style={{ paddingBottom: 40 }}>
          <div className="orb orb-1" /><div className="orb orb-2" />
          <div className="px-site">
            <Reveal><div className="crumb"><Link href="/">Nyumbani</Link><span className="sep">/</span><Link href="/insights-swahili">Kurasa kwa Kiswahili</Link><span className="sep">/</span><span>Jenereta za Kukodi</span></div></Reveal>
            <RentalHero image={HERO}>
            <Reveal delay={1}><h1>{TITLE}</h1></Reveal>
            <Reveal delay={2}>
              <p className="lead">
                Tunakodisha jenereta za dizeli kuanzia kVA 300 hadi 2,500 popote Tanzania, kwa migodi, mitambo ya kuchenjua,
                maeneo ya ujenzi, viwanda, matukio na umeme wa akiba wakati wa kukatika kwa umeme. Kila ukodishaji unajumuisha
                kuleta, kufunga na kuwasha jenereta, mwendeshaji anayebaki na jenereta eneo la kazi, na matengenezo kwa muda wote wa kukodi.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="gr-contact">
                <a className="btn btn-gold" href={whatsappLink(MESSAGE)} target="_blank" rel="noopener noreferrer">WhatsApp upate bei</a>
                <a className="btn btn-ghost" href={PHONE_HREF}>Piga {PHONE_DISPLAY}</a>
              </div>
            </Reveal>
            </RentalHero>
          </div>
        </section>

        <section className="sec-gap" style={{ paddingTop: 40 }}>
          <div className="px-site">
            <Reveal className="sec-head">
              <span className="eyebrow">Ukubwa</span>
              <h2>Jenereta ya ukubwa gani kwa kazi gani</h2>
            </Reveal>
            <Reveal delay={1}>
              <div className="gr-table-wrap">
                <table className="gr-table">
                  <thead><tr><th>Ukubwa</th><th>Kwa kawaida huendesha</th></tr></thead>
                  <tbody>{SIZES.map(s => <tr key={s.range}><td className="gr-strong">{s.range}</td><td>{s.kazi}</td></tr>)}</tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="kikokotoo-cha-jenereta" className="sec-gap" style={{ background: 'var(--paper)' }}>
          <div className="px-site">
            <Reveal className="sec-head">
              <span className="eyebrow">Kikokotoo</span>
              <h2>Nahitaji jenereta ya ukubwa gani?</h2>
              <p>Andika vitu ambavyo jenereta itaendesha. Kikokotoo kinazingatia mvuto wa kuwasha mota na kuacha nafasi ya asilimia 20.</p>
            </Reveal>
            <Reveal delay={1}><GeneratorSizer lang="sw" source="ukurasa wa jenereta za kukodi" /></Reveal>
          </div>
        </section>

        <section className="sec-gap">
          <div className="px-site">
            <Reveal className="sec-head">
              <span className="eyebrow">Kilichojumuishwa</span>
              <h2>Tunaleta, tunafunga, tunaendesha na kutengeneza</h2>
            </Reveal>
            <div className="gr-grid4">
              {INCLUDED.map((x, i) => (
                <Reveal key={x.t} delay={i % 3} className="gr-card"><h3>{x.t}</h3><p>{x.d}</p></Reveal>
              ))}
            </div>
            <dl className="gr-terms">
              <div><dt>Mafuta</dt><dd>Yanaletwa na wewe, mteja anayetumia jenereta. Tunakadiria matumizi ya mafuta kulingana na saa za kazi ili upange jinsi ya kuyafikisha eneo la kazi.</dd></div>
              <div><dt>Muda wa chini wa kukodi</dt><dd>Wiki moja kwa kazi za viwanda, migodi na ujenzi. Siku mbili kwa matukio.</dd></div>
            </dl>
          </div>
        </section>

        <section className="sec-gap" style={{ background: 'var(--paper)' }}>
          <div className="px-site">
            <Reveal className="sec-head">
              <span className="eyebrow">Maswali</span>
              <h2>Maswali kuhusu kukodi jenereta</h2>
            </Reveal>
            <div style={{ maxWidth: 760 }}>
              {FAQS.map(f => (
                <Reveal key={f.q} style={{ borderTop: '1px solid var(--line-2)', padding: '20px 0' }}>
                  <h3 style={{ fontSize: 17, marginBottom: 8 }}>{f.q}</h3>
                  <p style={{ color: 'var(--ink-2)', fontSize: 15.5, lineHeight: 1.7 }}>{f.a}</p>
                </Reveal>
              ))}
            </div>
            <p style={{ marginTop: 24, fontSize: 15 }}>
              <Link href="/generator-rental" lang="en" style={{ color: 'var(--gold)' }}>Read in English: generator rental in Tanzania</Link>
            </p>
          </div>
        </section>

        <CtaSection
          lang="sw"
          eyebrow="Unahitaji umeme?"
          heading={<>Tuambie mzigo wako, <span className="grad">tutakushauri ukubwa</span></>}
          body="Tutumie ukubwa au orodha ya mizigo, eneo na tarehe, tutakupa bei ya ukodishaji wote."
          primaryLabel="WhatsApp upate bei"
          primaryHref={whatsappLink(MESSAGE)}
          secondaryLabel="Vifaa vya uchimbaji"
          secondaryHref="/equipment-swahili"
        />
      </div>
    </>
  )
}
