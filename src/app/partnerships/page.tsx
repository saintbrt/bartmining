import { PARTNERSHIP_FAQS as FAQS } from '@/data/service-faqs'
import type { Metadata } from 'next'
import Image from 'next/image'
import Reveal from '@/components/ui/Reveal'
import Counter from '@/components/ui/Counter'
import CtaSection from '@/components/sections/CtaSection'
import PartnershipTimeline from '@/components/sections/PartnershipTimeline'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, faqSchema, breadcrumbSchema } from '@/lib/seo'
import { PARTNERSHIP_PRICE, PARTNERSHIP_PRICE_USD, PLACES_LEFT, PLACES_PER_YEAR, PARTNERSHIP_IMAGES as IMG, INCLUDED } from '@/data/partnership'

/**
 * Local market partnership for mining equipment manufacturers.
 *
 * Built from the home page's own patterns (hero with inline stats and photo
 * chip, marquee strip, hairline cards, founder-style split, phase cards, one
 * dark block at the end) so the two pages read as one site.
 *
 * Sales flow: hook, the supplier's problem, our proof, the solution, the
 * deliverables timeline, sales targets, the offer with limited places,
 * objections, call to action. Price, places and timeline live in
 * src/data/partnership.ts. Sales are guaranteed for screened products, with
 * replanning at no extra cost if they arrive late (see the FAQ); the commission
 * rate stays in the partner contract.
 */

const URL = `${SITE.url}/partnerships`
const TITLE = 'Local Market Partnership for Mining Equipment Suppliers | Bart Mining'
const DESC = `Bart Mining’s local partnership for mining equipment manufacturers entering East Africa: a fixed ${PARTNERSHIP_PRICE} six-month package covering branding, social media, catalogue pages, advertising, TAMISA membership, engineer training and twelve presentation trips, then commission on sales.`

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESC, images: [IMG.hero.src] },
}

const PAINS = [
  { t: 'Buyers are days apart', d: 'Mining towns are spread across the region, and every meeting means intercity travel, lodging and time away.' },
  { t: 'Miners buy from people they know', d: 'An overseas website and an email address rarely win an order. Buyers want to meet someone local and see the machine explained.' },
  { t: 'Decisions are made in Kiswahili', d: 'Brochures and pitches written for other markets do not land with site owners and operators.' },
  { t: 'Months of spending before the first order', d: 'Meetings, presentations, advertising and travel all have to be paid for long before any revenue arrives.' },
  { t: 'Clearing and registration slow everything', d: 'Missing registrations and badly documented imports cause delays, penalties and charges a local team would have avoided.' },
  { t: 'No local support, no repeat orders', d: 'Without trained engineers and spare parts in the country, the first machine sold is often the last.' },
]

const TAKEOVER = [
  { t: 'Presence', d: 'Your brand, pages and social media run locally, in Kiswahili and English.' },
  { t: 'Reach', d: 'Advertising, collaborative posts and introductions to the mining community.' },
  { t: 'Selling', d: 'Meetings, travel, presentations, quotations and follow-up by our team.' },
  { t: 'Delivery', d: 'Registrations, clearing, forwarding, delivery and trained local engineers.' },
]

const TARGETS = [
  { k: 'Months 0–6', n: 50, pre: '$', suf: 'K', d: 'First sales from launch activity, presentations and advertising.' },
  { k: 'Months 6–12', n: 200, pre: '$', suf: 'K+', d: 'Repeat orders, referrals and new towns across the region.' },
  { k: 'Year 2 onward', n: 0, pre: '', suf: '', d: 'An established brand expanding across East and Southern Africa, where sales can grow far faster than in the first year.' },
]

const statNum = { fontFamily: 'var(--font-sora)', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: 'var(--ink)' } as const
const statLbl = { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: 4 } as const
const rule = <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
const card = { background: 'var(--bg-3)', borderRadius: 'var(--r-md)', border: '1px solid var(--line-2)', padding: '22px 20px', height: '100%' } as const
const arrow = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>

export default function PartnershipsPage() {
  return (
    <>
      <JsonLd data={[
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${URL}#service`,
          name: 'Local market partnership for mining equipment suppliers',
          description: DESC,
          serviceType: 'Market entry, sales representation and distribution partnership',
          provider: { '@id': `${SITE.url}/#organization` },
          areaServed: [{ '@type': 'Place', name: 'East Africa' }, { '@type': 'Country', name: 'Tanzania' }],
          offers: {
            '@type': 'Offer',
            name: 'Six-month partnership package',
            price: PARTNERSHIP_PRICE_USD,
            priceCurrency: 'USD',
            description: 'Fixed fee for the first six months, paid at signing; commission on facilitated sales thereafter.',
            url: URL,
          },
        },
        faqSchema(FAQS, 'en'),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Partnerships', path: '/partnerships' },
        ]),
      ]} />

      {/* Hook: same structure as the home hero */}
      <section className="hero" style={{ position: 'relative', padding: '168px 0 90px', overflow: 'hidden' }}>
        <div className="px-site" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <Reveal delay={1}>
              <h1 style={{ fontSize: 'clamp(34px,4.4vw,56px)' }}>
                Don&apos;t leave your sales to chance
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ fontSize: 18, color: 'var(--ink-2)', marginTop: 22, lineHeight: 1.7, maxWidth: 500 }}>
                Join Bart Mining as a local partner. We build your presence across East Africa, put your machines in front of real buyers and handle every sale through to delivery.
              </p>
            </Reveal>
            <Reveal delay={3} className="hero-actions" style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
              <a href="#apply" className="btn btn-gold">Apply for a partnership {arrow}</a>
              <a href="#deliverables" className="btn btn-ghost">See what you get</a>
            </Reveal>
            <Reveal delay={4} className="hero-stats" style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 40, flexWrap: 'wrap' }}>
              <div><div style={statNum}>$<Counter target={20} />M+</div><div style={statLbl}>Machinery sales</div></div>
              {rule}
              <div><div style={statNum}><Counter target={3} /></div><div style={statLbl}>Live projects</div></div>
              {rule}
              <div><div style={statNum}><Counter target={25} suffix="+" /></div><div style={statLbl}>Years in the field</div></div>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <div style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', aspectRatio: '4/3', border: '1px solid var(--line)' }}>
              <Image src={IMG.hero.src} alt={IMG.hero.alt} fill priority quality={85} style={{ objectFit: 'cover' }} sizes="(max-width: 860px) 100vw, 50vw" />
              <div style={{ position: 'absolute', bottom: 18, right: 18, background: '#FFFFFF', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', padding: '12px 16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Partner places</div>
                <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 7, height: 7, background: '#2E6A4F', display: 'inline-block', flexShrink: 0 }} />
                  {PLACES_LEFT} of {PLACES_PER_YEAR} left this year
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <style>{`
          @media (max-width: 860px) { .hero > .px-site { grid-template-columns: 1fr !important; } }
          @media (max-width: 600px) {
            .hero { padding: 116px 0 56px !important; }
            .hero-actions { flex-direction: column; align-items: stretch; gap: 10px; }
            .hero-actions .btn { justify-content: center; width: 100%; }
            .hero-stats { display: grid !important; grid-template-columns: repeat(3, 1fr); gap: 0 !important; margin-top: 32px !important; }
            .hero-stats > div:nth-child(even) { display: none; }
            .hero-stats > div:nth-child(3), .hero-stats > div:nth-child(5) { border-left: 1px solid var(--line); padding-left: 14px; }
            .hero-stats > div:nth-child(odd) { padding-right: 10px; }
            .hero-stats > div > div:last-child { letter-spacing: .06em !important; font-size: 12px !important; }
          }
        `}</style>
      </section>

      {/* The problem */}
      <section className="sec-gap" style={{ background: 'var(--bg)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">The problem</span>
            <h2>A good machine does not sell itself in East Africa</h2>
            <p>Most manufacturers who contact us have the right product. What stops them is everything around the sale, and many spend a year and a large budget learning that before the first real order arrives.</p>
          </Reveal>
          <div className="pt-grid-3">
            {PAINS.map((p, i) => (
              <Reveal key={p.t} delay={i % 3}>
                <div style={card}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>{p.t}</h3>
                  <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.6 }}>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Proof: same layout as the home founder section */}
      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <div className="split2">
            <div className="founder-img" style={{ aspectRatio: '3/4' }}>
              <Image src={IMG.proof.src} alt={IMG.proof.alt} fill quality={85} style={{ objectFit: 'cover', objectPosition: 'center', borderRadius: 'var(--r-lg)' }} sizes="(max-width: 860px) 100vw, 50vw" />
              <div className="tagchip">
                <div className="q">&ldquo;The obstacles that stop new suppliers are routine work for us.&rdquo;</div>
              </div>
            </div>
            <Reveal delay={1}>
              <span className="eyebrow">Why Bart Mining</span>
              <p style={{ fontFamily: 'var(--font-sora)', fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2, marginTop: 18, color: 'var(--ink)' }}>
                Our experience in the field is the reason our partners win
              </p>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 22, lineHeight: 1.7 }}>
                We have spent decades building, advising and managing mining projects in the region, and supplying the machines they run on. We know the buyers, the towns, the port and the offices, so your products start with a network rather than a cold introduction.
              </p>
              <div className="pt-proof">
                <div><div style={statNum}>$<Counter target={20} />M+</div><div style={statLbl}>Machinery sales handled</div></div>
                <div><div style={statNum}><Counter target={3} /></div><div style={statLbl}>Projects we manage</div></div>
                <div><div style={statNum}><Counter target={4} /> kg+</div><div style={statLbl}>Gold produced monthly</div></div>
                <div><div style={statNum}><Counter target={25} suffix="+" /></div><div style={statLbl}>Years in the industry</div></div>
              </div>
              <div className="career">
                {['Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'DRC', 'Zambia', 'TAMISA network'].map(c => <span key={c} className="c">{c}</span>)}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The solution */}
      <section className="sec-gap" style={{ background: 'var(--bg)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">The solution</span>
            <h2>We push your products across the region and take the hustle off your hands</h2>
            <p>As your local partner, Bart Mining becomes your presence on the ground. Buyers contact us directly, and our team does the work that normally keeps a foreign supplier stuck.</p>
          </Reveal>
          <div className="pt-grid-4">
            {TAKEOVER.map((x, i) => (
              <Reveal key={x.t} delay={i}>
                <div style={card}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 12 }}>0{i + 1}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>{x.t}</h3>
                  <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.6 }}>{x.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="sec-gap" id="deliverables" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Deliverables</span>
            <h2>Your partnership, step by step</h2>
            <p>Setup comes first, so that every buyer who responds to an advert can be quoted, supplied and supported. Then we go on the road.</p>
          </Reveal>
          <PartnershipTimeline />
        </div>
      </section>

      {/* Targets */}
      <section className="sec-gap" style={{ background: 'var(--bg)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Sales targets</span>
            <h2>Built to grow every year</h2>
            <p>Each stage builds on the last. Targets are agreed for each partner in the month-three market plan and depend on product price, stock and demand.</p>
          </Reveal>
          <div className="pt-grid-3">
            {TARGETS.map((t, i) => (
              <Reveal key={t.k} delay={i}>
                <div style={{ ...card, padding: '28px 24px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold-deep)' }}>{t.k}</div>
                  <div style={{ ...statNum, fontSize: 40, marginTop: 14 }}>{t.n ? <>{t.pre}<Counter target={t.n} />{t.suf}</> : 'Growth'}</div>
                  <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.6, marginTop: 12, paddingTop: 14, borderTop: '1px solid var(--line-2)' }}>{t.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Offer */}
      <section className="sec-gap" id="apply" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <div className="split2" style={{ alignItems: 'start' }}>
            <Reveal>
              <span className="eyebrow">The partnership</span>
              <h2 style={{ fontSize: 'clamp(30px,3.6vw,44px)', marginTop: 16 }}>One fixed fee. Then we earn only when you sell</h2>
              <div style={{ ...statNum, fontSize: 'clamp(44px,5vw,60px)', marginTop: 26 }}>${PARTNERSHIP_PRICE_USD.toLocaleString('en-US')}</div>
              <div style={statLbl}>First six months · paid at signing</div>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 20, lineHeight: 1.7, maxWidth: 480 }}>
                One fee covers everything in the first six months, with no monthly charges and no expense claims. From month seven there is no fixed fee, only commission on the sales we facilitate.
              </p>
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--line)', maxWidth: 480 }}>
                <div style={statLbl}>Limited to {PLACES_PER_YEAR} companies a year</div>
                <div className="pt-seats" aria-label={`${PLACES_LEFT} of ${PLACES_PER_YEAR} places open`}>
                  {Array.from({ length: PLACES_PER_YEAR }, (_, i) => <i key={i} className={i < PLACES_PER_YEAR - PLACES_LEFT ? 'taken' : ''} />)}
                </div>
                <p style={{ color: 'var(--ink-2)', fontSize: 15.5, lineHeight: 1.6 }}>
                  We take on only {PLACES_PER_YEAR} partners a year so each one gets real attention on the ground. <strong style={{ color: 'var(--ink)' }}>{PLACES_LEFT} places remain.</strong>
                </p>
              </div>
              <div className="hero-actions" style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
                <a href="https://wa.me/255759141705?text=Hello%20Bart%20Mining%2C%20we%20would%20like%20to%20apply%20for%20a%20local%20market%20partnership." target="_blank" rel="noopener noreferrer" className="btn btn-gold">Apply on WhatsApp {arrow}</a>
                <a href="/contact" className="btn btn-ghost">Contact us</a>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div style={{ ...card, padding: '28px 24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 14 }}>Included</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {INCLUDED.map(x => (
                    <li key={x} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 15.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--gold)', flexShrink: 0 }}>&#8250;</span>{x}
                    </li>
                  ))}
                </ul>
                <div style={{ paddingTop: 16, borderTop: '1px solid var(--line-2)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.06em', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                  Import duties, freight and clearing are charged per shipment
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Objections */}
      <section className="sec-gap" style={{ background: 'var(--bg)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">FAQ</span>
            <h2>Before you apply</h2>
          </Reveal>
          <div style={{ maxWidth: 760 }}>
            {FAQS.map(f => (
              <Reveal key={f.q} style={{ borderTop: '1px solid var(--line-2)', padding: '20px 0' }}>
                <h3 style={{ fontSize: 17, marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{f.q}</h3>
                <p style={{ color: 'var(--ink-2)', fontSize: 15.5, lineHeight: 1.7 }}>{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow={`${PLACES_LEFT} places left this year`}
        heading={<>Let&apos;s build your presence and <span className="grad">grow your sales</span></>}
        body="Send your product range, specifications, export prices, stock or lead times and the countries you want to reach. We'll reply with an initial market view and the partnership agreement."
        primaryLabel="Apply on WhatsApp"
        primaryHref="https://wa.me/255759141705?text=Hello%20Bart%20Mining%2C%20we%20would%20like%20to%20apply%20for%20a%20local%20market%20partnership."
        secondaryLabel="Contact us"
        secondaryHref="/contact"
      />

      <style>{`
        .pt-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .pt-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .pt-proof { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 22px 28px; margin-top: 30px; padding-top: 24px; border-top: 1px solid var(--line); }
        .pt-seats { display: flex; gap: 6px; margin: 12px 0 14px; flex-wrap: wrap; }
        .pt-seats i { width: 18px; height: 18px; border: 1px solid var(--line); background: var(--bg-3); }
        .pt-seats i.taken { background: var(--ink); border-color: var(--ink); }
        @media (max-width: 1080px) { .pt-grid-4 { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 860px) { .pt-grid-3 { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .pt-grid-4 { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
