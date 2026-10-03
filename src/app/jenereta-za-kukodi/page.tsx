import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import GeneratorSizer from '@/components/sections/GeneratorSizer'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/seo'
import { PHONE_DISPLAY, PHONE_HREF, whatsappLink } from '@/data/generator-rental'

/**
 * Jenereta za kukodi: the Swahili counterpart of /generator-rental, cross-linked
 * with hreflang. Facts match src/data/generator-rental.ts (300 to 2,500 kVA,
 * delivery, installation, operator and servicing included, prices on request).
 */

const URL = `${SITE.url}/jenereta-za-kukodi`
const TITLE = 'Jenereta za Kukodi Tanzania: kVA 300 hadi 2,500'
const DESCRIPTION = 'Jenereta za kukodi Tanzania kuanzia kVA 300 hadi 2,500. Tunaleta, tunafunga na kuwasha, pamoja na mwendeshaji na huduma ya matengenezo. Piga simu au WhatsApp upate bei.'
const MESSAGE = 'Habari Bart Mining, naomba bei ya kukodi jenereta. Ukubwa au mzigo: ... Eneo: ... Tarehe: ...'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL, languages: { 'sw-TZ': URL, en: `${SITE.url}/generator-rental`, 'x-default': `${SITE.url}/generator-rental` } },
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESCRIPTION, locale: 'sw_TZ' },
}

const SIZES = [
  { range: 'kVA 300 hadi 500', kazi: 'Mitambo midogo ya kuosha dhahabu, vinu vidogo vya kusaga, maeneo ya ujenzi, hoteli, ofisi na hospitali (umeme wa akiba)' },
  { range: 'kVA 500 hadi 1,000', kazi: 'Mashine za kuponda na kusaga mawe, mitambo mikubwa ya kuchenjua, viwanda na miradi mikubwa ya ujenzi' },
  { range: 'kVA 1,000 hadi 2,500', kazi: 'Mitambo kamili ya kuchenjua, umeme wa mgodi mzima na viwanda vikubwa. Mara nyingi jenereta mbili au zaidi hufanya kazi pamoja (synchronised)' },
]

const INCLUDED = [
  { t: 'Kuleta na kurudisha', d: 'Tunaleta jenereta hadi eneo lako na kuichukua kukodi kukiisha, popote Tanzania.' },
  { t: 'Kufunga na kuwasha', d: 'Tunaifunga kwenye ubao wako wa umeme na kuijaribu ikiwa na mzigo kabla ya kukukabidhi.' },
  { t: 'Mwendeshaji au fundi', d: 'Mtu anayeijua jenereta anaiendesha au kuikagua, ili hitilafu zigundulike mapema.' },
  { t: 'Matengenezo wakati wa kukodi', d: 'Oili, filta na huduma za kawaida kwa ratiba, pamoja na msaada jenereta ikiharibika.' },
]

const FAQS = [
  { q: 'Mna jenereta za ukubwa gani za kukodi?', a: 'Tunakodisha jenereta kuanzia kVA 300 hadi kVA 2,500. Kwa mzigo mkubwa zaidi, jenereta mbili au zaidi hufanya kazi pamoja kama chanzo kimoja cha umeme.' },
  { q: 'Nitajuaje ukubwa wa jenereta ninaohitaji?', a: 'Jumlisha mzigo wote, kisha angalia mota kubwa zaidi na jinsi inavyowashwa. Mota inayowashwa direct on line huvuta umeme mara sita hadi saba ya kawaida kwa sekunde chache, na mvuto huo mara nyingi ndio unaoamua ukubwa wa jenereta. Tumia kikokotoo kilicho kwenye ukurasa huu, kisha tutumie orodha ya mizigo tukuthibitishie.' },
  { q: 'Nani analeta mafuta?', a: 'Mafuta yanaletwa na mteja anayetumia jenereta. Tuambie itafanya kazi saa ngapi kwa siku, tutakadiria matumizi ya mafuta ili upange jinsi ya kuyafikisha eneo la kazi.' },
  { q: 'Muda wa chini wa kukodi ni upi?', a: 'Wiki moja kwa kazi za viwanda, migodi na ujenzi, na siku mbili kwa matukio (events).' },
  { q: 'Bei ya kukodi jenereta ni kiasi gani?', a: 'Inategemea ukubwa, muda wa kukodi, eneo la kazi na saa ngapi kwa siku itafanya kazi. Hatuweki bei kwenye tovuti kwa sababu kila kazi ni tofauti. Tutumie ukubwa au orodha ya mizigo, eneo na tarehe kwa simu au WhatsApp, tutakupa bei kamili.' },
  { q: 'Nini kimejumuishwa kwenye kukodi?', a: 'Kila ukodishaji unajumuisha kuleta na kurudisha jenereta, kuifunga na kuiwasha, mwendeshaji au fundi, na matengenezo kwa muda wote wa kukodi.' },
  { q: 'Jenereta ni za wazi au ziko kwenye kontena?', a: 'Jenereta ndogo huja zikiwa wazi (open-frame). Jenereta kubwa huja ndani ya kontena, ambalo huzilinda dhidi ya vumbi na mvua, hupunguza kelele na hurahisisha ulinzi wake eneo la kazi.' },
  { q: 'Kuna tofauti gani kati ya prime na standby?', a: 'Jenereta ya prime ndiyo chanzo kikuu cha umeme, inayofanya kazi saa nyingi kila siku, kama inavyohitajika kwenye mgodi au mtambo usio na umeme wa TANESCO. Standby ni ya akiba, inayowaka pale umeme wa gridi unapokatika. Kama jenereta itaendesha eneo lako kila siku, omba prime.' },
  { q: 'Je, jenereta ya kukodi inaweza kuendesha ball mill au mashine ya kuponda mawe?', a: 'Ndiyo, ikiwa imechaguliwa kwa kuzingatia mvuto wa kuwasha mota. Soft starter au VFD kwenye mota kubwa zaidi mara nyingi hupunguza ukubwa wa jenereta unaohitajika kwa kiasi kikubwa kuliko gharama ya starter yenyewe.' },
  { q: 'Mnaleta jenereta nje ya Dar es Salaam na Mwanza?', a: 'Ndiyo, popote Tanzania, ikiwemo Geita, Kahama, Shinyanga, Chunya na Mbeya. Tuambie eneo la kazi na hali ya barabara unapoomba bei.' },
]

export default function JeneretaZaKukodiPage() {
  return (
    <>
      <JsonLd data={[
        serviceSchema({
          slug: 'jenereta-za-kukodi',
          path: '/jenereta-za-kukodi',
          name: 'Jenereta za kukodi, kVA 300 hadi 2,500',
          description: DESCRIPTION,
          serviceType: 'Generator rental',
          catalog: { name: 'Jenereta za kukodi', path: '/jenereta-za-kukodi' },
        }),
        faqSchema(FAQS),
        breadcrumbSchema([
          { name: 'Nyumbani', path: '/' },
          { name: 'Jenereta za Kukodi', path: '/jenereta-za-kukodi' },
        ]),
      ]} />

      {/* lang is set here because the root layout declares lang="en". */}
      <div lang="sw">
        <section className="subhero" style={{ paddingBottom: 40 }}>
          <div className="orb orb-1" /><div className="orb orb-2" />
          <div className="px-site">
            <Reveal><div className="crumb"><Link href="/">Nyumbani</Link><span className="sep">/</span><span>Jenereta za Kukodi</span></div></Reveal>
            <Reveal delay={1}><h1>{TITLE}</h1></Reveal>
            <Reveal delay={2}>
              <p className="lead">
                Tunakodisha jenereta za dizeli kuanzia kVA 300 hadi 2,500 popote Tanzania, kwa migodi, mitambo ya kuchenjua,
                maeneo ya ujenzi, viwanda, matukio na umeme wa akiba wakati wa kukatika kwa umeme. Kila ukodishaji unajumuisha
                kuleta, kufunga na kuwasha jenereta, mwendeshaji au fundi, na matengenezo kwa muda wote wa kukodi.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="gr-contact">
                <a className="btn btn-gold" href={whatsappLink(MESSAGE)} target="_blank" rel="noopener noreferrer">WhatsApp upate bei</a>
                <a className="btn btn-ghost" href={PHONE_HREF}>Piga {PHONE_DISPLAY}</a>
              </div>
            </Reveal>
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

        <section className="sec-gap" style={{ background: 'var(--paper)' }}>
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
          eyebrow="Unahitaji umeme?"
          heading={<>Tuambie mzigo wako, <span className="grad">tutakushauri ukubwa</span></>}
          body="Tutumie ukubwa au orodha ya mizigo, eneo na tarehe, tutakupa bei ya ukodishaji wote."
          primaryLabel="WhatsApp upate bei"
          primaryHref={whatsappLink(MESSAGE)}
          secondaryLabel="Vifaa vya uchimbaji"
          secondaryHref="/vifaa-vya-uchimbaji"
        />
      </div>
    </>
  )
}
