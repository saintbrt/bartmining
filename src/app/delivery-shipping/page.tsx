import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import DeliveryMap from '@/components/sections/DeliveryMap'
import CtaSection from '@/components/sections/CtaSection'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, faqSchema, breadcrumbSchema } from '@/lib/seo'

/**
 * Delivery & Shipping.
 *
 * Every buyer who enquires asks some version of "how long will it take to
 * get here, and what does it cost to ship?" This page answers that in one
 * place instead of it being re-explained in every quotation.
 *
 * The route times come from src/data/delivery-routes.ts. Only Dar->Morogoro
 * and Dar->Nzega (and the Nzega->Mwanza leg) are Allan's own confirmed
 * figures (Sep 2026); everything else is an estimate pending confirmation,
 * and the page is explicit about which is which.
 *
 * NOTE FOR REVIEW: the international freight and after-sales sections
 * describe the general shape of the process, not confirmed Bart Mining
 * policy (real transit-time ranges, warranty terms, parts stocked). Replace
 * the flagged lines with Allan's actual figures before relying on this page
 * in a quotation.
 */

const URL = `${SITE.url}/delivery-shipping`

export const metadata: Metadata = {
  title: 'Delivery & Shipping | Bart Mining',
  description: 'How Bart Mining delivers mining equipment across Tanzania: route times by district, international freight, cargo insurance, and spare parts support.',
  alternates: { canonical: URL },
  openGraph: { type: 'website', url: URL, title: 'Delivery & Shipping | Bart Mining', description: 'Route times across Tanzania, international freight, cargo insurance and after-sales support.' },
}

const FAQS = [
  {
    q: 'How long does delivery take from Dar es Salaam?',
    a: 'It depends on the district and the cargo. Use the map above for a planning estimate: pick your district and the type of cargo, and it shows a realistic range including a buffer for checkpoints and weather. Confirmed dates come with your quotation.',
  },
  {
    q: 'Why is heavy cargo so much slower than a passenger car?',
    a: 'A loaded truck is heavier, stops longer at weighbridges and checkpoints, and drives slower on the sections of road that are not sealed. An abnormal load such as an excavator or dozer on a lowboy is slower again, and also needs permits and a pilot vehicle arranged before it can move.',
  },
  {
    q: 'Do you insure equipment in transit?',
    a: 'Insurance is arranged for imported equipment from the moment it leaves the supplier until it clears the port, and can be extended to cover the inland journey to your site. Ask for this to be included when you request a quotation, particularly for high-value or abnormal-load equipment.',
  },
  {
    q: 'Do you supply spare parts after the sale?',
    a: 'Yes. Tell us the equipment model and the part you need, and we will source it and confirm a lead time. For equipment we supply new, we can also advise which wear parts are worth holding on site from day one, so a routine failure does not stop production.',
  },
]

export default function DeliveryShippingPage() {
  return (
    <>
      <JsonLd data={[
        faqSchema(FAQS),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Delivery & Shipping', path: '/delivery-shipping' },
        ]),
      ]} />

      <section className="subhero" style={{ paddingBottom: 40 }}>
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>Delivery &amp; Shipping</span></div></Reveal>
          <Reveal delay={1}><h1>Delivery &amp; shipping</h1></Reveal>
          <Reveal delay={2}><p className="lead">Bart Mining ships equipment from Dar es Salaam to sites across Tanzania, and imports equipment from overseas suppliers. This page explains how that actually works: route times, international freight, cargo insurance and after-sales support.</p></Reveal>
        </div>
      </section>

      <section className="sec-gap" style={{ paddingTop: 30 }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Route planner</span>
            <h2>Estimated delivery time to your district</h2>
            <p>A planning tool, not a quotation. Pick your district and cargo type for a realistic range.</p>
          </Reveal>
          <Reveal delay={1}><DeliveryMap /></Reveal>
        </div>
      </section>

      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">How it works</span>
            <h2>From quotation to your site</h2>
          </Reveal>
          <div className="value-grid">
            {[
              { n: '01', t: 'Quotation confirms the route', d: 'Once you accept a quotation, we confirm the exact route, the vehicle needed for that cargo, and a delivery window.' },
              { n: '02', t: 'Dispatch from Dar es Salaam', d: 'Equipment is loaded and dispatched from our yard. For abnormal loads, permits and a pilot vehicle are arranged before dispatch, not after.' },
              { n: '03', t: 'Weighbridges and checkpoints', d: 'Heavier cargo stops longer at weighbridges and police checkpoints along the way. This is the main reason cargo transit is slower than a passenger vehicle, and it is built into the route planner above.' },
              { n: '04', t: 'Arrival and offloading', d: 'We confirm arrival with you in advance. Offloading arrangements (crane, ramps, site access) are agreed as part of the quotation for anything beyond a standard delivery.' },
            ].map(s => (
              <Reveal key={s.n} style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', padding: '28px 26px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--gold)', marginBottom: 14 }}>{s.n}</div>
                <h4 style={{ fontSize: 17, marginBottom: 8 }}>{s.t}</h4>
                <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6 }}>{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-gap">
        <div className="px-site">
          <div className="split2" style={{ alignItems: 'flex-start' }}>
            <Reveal>
              <span className="eyebrow">Importing equipment</span>
              <h2 style={{ marginTop: 16 }}>International freight to Dar es Salaam</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 18 }}>
                Most of the equipment we supply is imported. The overall lead time has three parts, and the first two happen before the equipment is anywhere near Tanzania:
              </p>
              <ul style={{ marginTop: 18, paddingLeft: 20, color: 'var(--ink-2)', fontSize: 15.5, lineHeight: 1.8 }}>
                <li><strong>Manufacturing or sourcing.</strong> Stock items ship fastest; equipment built to order takes longer. We confirm this per item at quotation stage.</li>
                <li><strong>Sea or air freight to Dar es Salaam.</strong> Sea freight is standard for the equipment we supply and is planned in weeks, not days; air freight is faster but reserved for small, urgent items where the cost is justified.</li>
                <li><strong>Port clearance.</strong> Customs clearance and inland transport to your site follow, on top of the domestic route time shown above.</li>
              </ul>
              <p style={{ color: 'var(--ink-2)', fontSize: 15.5, marginTop: 16 }}>
                We give a specific lead time with every quotation once we have confirmed stock and sailing schedules with the supplier — general shipping timetables are not a substitute for that confirmed date.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <span className="eyebrow">Protecting your shipment</span>
              <h2 style={{ marginTop: 16 }}>Insurance for large and imported cargo</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 18 }}>
                Equipment worth insuring usually needs cover in two stages, because the risks are different:
              </p>
              <ul style={{ marginTop: 18, paddingLeft: 20, color: 'var(--ink-2)', fontSize: 15.5, lineHeight: 1.8 }}>
                <li><strong>Marine cargo insurance</strong> covers the equipment from the supplier to the port of Dar es Salaam: loss, damage and the usual risks of sea freight.</li>
                <li><strong>Inland transit insurance</strong> covers the road journey from Dar es Salaam to your site, which matters most for high-value equipment and for abnormal loads, where an accident or a rollover is the highest-consequence risk on the route.</li>
              </ul>
              <p style={{ color: 'var(--ink-2)', fontSize: 15.5, marginTop: 16 }}>
                Ask for insurance to be included when you request a quotation, and tell us the declared value you want covered. For a complete plant shipped in several loads, insure each load, not only the most expensive item.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">After the sale</span>
            <h2>Spare parts and support</h2>
            <p>Delivery is not where the relationship ends. Two things matter most once equipment is running on your site.</p>
          </Reveal>
          <div className="value-grid">
            <Reveal style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', padding: '28px 26px', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ fontSize: 17, marginBottom: 8 }}>Spare parts</h4>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6 }}>Tell us the equipment model and the part that has failed or needs replacing, and we will source it and confirm a lead time. When you buy equipment from us, ask which wear parts are worth holding on site from day one, so a routine failure does not stop production while a part is sourced.</p>
            </Reveal>
            <Reveal delay={1} style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', padding: '28px 26px', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ fontSize: 17, marginBottom: 8 }}>Installation and commissioning</h4>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.6 }}>For plant-level equipment, installation and commissioning support is discussed and agreed as part of the quotation, alongside delivery. Raise it early so it is scoped and priced with the equipment, not added afterwards.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec-gap">
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">FAQ</span>
            <h2>Common questions</h2>
          </Reveal>
          <div style={{ maxWidth: 760 }}>
            {FAQS.map(f => (
              <Reveal key={f.q} style={{ borderTop: '1px solid var(--line-2)', padding: '20px 0' }}>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{f.q}</h3>
                <p style={{ color: 'var(--ink-2)', fontSize: 15.5, lineHeight: 1.7 }}>{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="Planning a delivery"
        heading={<>Tell us your site and <span className="grad">we&apos;ll confirm the route</span></>}
        body="Share your district, the equipment you need, and your site access, and we'll come back with a real delivery date and quotation."
        primaryLabel="Contact us"
        primaryHref="/contact"
        secondaryLabel="Browse equipment"
        secondaryHref="/equipment"
      />
    </>
  )
}
