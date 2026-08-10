import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LOCATIONS, LOCATION_BY_SLUG } from '@/data/locations'
import { EQUIPMENT_BY_SLUG } from '@/data/equipment-catalogue'
import EquipmentThumb from '@/components/equipment/EquipmentThumb'
import { SITE, serviceSchema, faqSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'

export async function generateStaticParams() {
  return LOCATIONS.map(l => ({ city: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params
  const l = LOCATION_BY_SLUG.get(city)
  if (!l) return {}
  const url = `${SITE.url}/equipment/supply/${l.slug}`
  return {
    title: l.title,
    description: l.description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: l.title, description: l.description },
  }
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const loc = LOCATION_BY_SLUG.get(city)
  if (!loc) notFound()

  const kit = loc.buys
    .map(s => EQUIPMENT_BY_SLUG.get(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  const others = LOCATIONS.filter(l => l.slug !== loc.slug)

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            slug: loc.slug, name: loc.title, description: loc.description,
            city: loc.city, region: loc.region,
          }),
          faqSchema(loc.faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Equipment', path: '/equipment' },
            { name: loc.city, path: `/equipment/supply/${loc.slug}` },
          ]),
        ]}
      />

      <section className="subhero" style={{ paddingBottom: 32 }}>
        <div className="px-site">
          <nav className="crumb" style={{ marginBottom: 24 }} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/equipment">Equipment</Link><span className="sep">/</span>
            <span>{loc.city}</span>
          </nav>
          <span className="eyebrow">{loc.region}</span>
          <h1 style={{ marginTop: 14 }}>Mining equipment supply in {loc.city}.</h1>
          <p className="lead">{loc.summary}</p>
        </div>
      </section>

      <div className="px-site" style={{ paddingBottom: 72 }}>
        <div className="loc-layout">
          <article className="art-body">
            <h2 id="geology">Geology and Mining in {loc.city}</h2>
            <p>{loc.geology}</p>

            <h2 id="operators">Who Operates Here</h2>
            <ul>{loc.operators.map(o => <li key={o}>{o}</li>)}</ul>

            <h2 id="delivery">Getting Equipment to {loc.city}</h2>
            <ul>{loc.logistics.map(x => <li key={x}>{x}</li>)}</ul>

            <h2 id="equipment">What {loc.city} Operations Buy</h2>
            <p>{loc.buysNote}</p>
            <div className="loc-grid">
              {kit.map(item => (
                <Link key={item.slug} href={`/equipment/${item.slug}`} className="eq-card">
                  <EquipmentThumb
                    slug={item.slug} alt={item.name} category={item.category}
                    sizes="(max-width: 640px) 50vw, 30vw"
                  />
                  <div className="eq-cardbody">
                    <h3>{item.name}</h3>
                    <span className="eq-more">View specifications &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
            <p style={{ marginTop: 18 }}>
              This is what the district buys most, not the full range.{' '}
              <Link href="/equipment" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                Browse the full catalogue
              </Link>{' '}
              for winches, processing plant, pumps, safety equipment, software and power.
            </p>

            <h2 id="faq">Frequently Asked Questions</h2>
            {loc.faqs.map(f => (
              <div key={f.q} className="eq-faq">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <div className="on-dark" style={{ marginTop: 56, background: 'var(--slate)', borderRadius: 'var(--r-lg)', padding: '36px 32px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 12 }}>Supply to {loc.city}</p>
              <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>Need equipment delivered to {loc.city}?</h3>
              <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
                Tell us the duty, the site conditions and your power supply. We quote landed
                in {loc.city}, with freight, duty and inland transport included, so the figure
                you approve is the figure you pay.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-gold">WhatsApp us &rarr;</a>
                <Link href="/contact" className="btn btn-ghost">Send an enquiry</Link>
              </div>
            </div>
          </article>

          <aside className="loc-aside">
            <div className="loc-card">
              <div className="loc-label">On this page</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[['geology','Geology'],['operators','Who operates here'],['delivery','Getting equipment here'],['equipment','What they buy'],['faq','FAQ']].map(([id,label]) => (
                  <a key={id} href={`#${id}`} style={{ fontSize: 15, color: 'var(--ink-2)' }}>{label}</a>
                ))}
              </nav>
            </div>
            <div style={{ background: 'var(--slate)', borderRadius: 'var(--r-md)', padding: '20px 18px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 10 }}>Get a price</p>
              <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 15.5, lineHeight: 1.6, marginBottom: 16 }}>
                Quoted landed in {loc.city}, not ex-works.
              </p>
              <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-2)' }}>+255 759 141 705 &rarr;</a>
            </div>
            <div className="loc-card">
              <div className="loc-label">Other districts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {others.map(o => (
                  <Link key={o.slug} href={`/equipment/supply/${o.slug}`}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 3 }}>{o.region}</div>
                    <p style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 600 }}>{o.city}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .loc-layout { display: grid; grid-template-columns: 1fr 280px; gap: 56px; align-items: start; }
        .loc-layout > * { min-width: 0; }
        .loc-aside { position: sticky; top: 96px; display: flex; flex-direction: column; gap: 24px; }
        .loc-card { background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-md); padding: 20px 18px; }
        .loc-label { font-family: var(--font-mono); font-size: 12px; letter-spacing: .14em;
          text-transform: uppercase; color: var(--ink-3); margin-bottom: 14px; }

        .art-body h2 { font-size: clamp(20px,2.2vw,26px); font-weight: 700; margin: 44px 0 14px; color: var(--ink); line-height: 1.3; }
        .art-body h2:first-child { margin-top: 0; }
        .art-body h3 { font-size: clamp(16px,1.6vw,19px); font-weight: 700; margin: 26px 0 8px; color: var(--ink); }
        .art-body p { font-size: 16px; line-height: 1.75; color: var(--ink-2); margin-bottom: 18px; }
        .art-body ul { margin: 0 0 18px; padding-left: 20px; }
        .art-body li { font-size: 16px; line-height: 1.75; color: var(--ink-2); margin-bottom: 8px; }
        .art-body strong { color: var(--ink); font-weight: 600; }

        .loc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 22px 0 4px; }
        .eq-card { display: flex; flex-direction: column; border: 1px solid var(--line);
          border-radius: var(--r-lg); overflow: hidden; background: var(--bg-3); transition: border-color .2s; }
        .eq-card:hover { border-color: var(--ink-3); }
        .eq-cardbody { padding: 14px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .eq-card h3 { font-size: 15.5px; margin: 0; color: var(--ink); line-height: 1.3; }
        .eq-more { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .06em;
          text-transform: uppercase; color: var(--gold); margin-top: auto; }
        .eq-thumb { position: relative; aspect-ratio: 4 / 3; width: 100%;
          border-bottom: 1px solid var(--line); background: var(--paper); }
        .eq-thumb-empty { display: grid; place-items: center;
          background-image: repeating-linear-gradient(45deg, transparent 0 7px, rgba(94,104,109,.055) 7px 8px); }
        .eq-thumb-empty svg { width: 42%; max-width: 84px; height: auto; color: var(--ink-3); opacity: .45; }

        .eq-faq { border-top: 1px solid var(--line-2); padding-top: 18px; margin-bottom: 20px; }
        .eq-faq h3 { margin-top: 0; }
        .eq-faq p { margin-bottom: 0; }

        @media (max-width: 900px) {
          .loc-layout { grid-template-columns: 1fr; }
          .loc-aside { display: none; }
        }
        @media (max-width: 600px) {
          .loc-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .art-body h2 { margin-top: 36px; }
        }
      `}</style>
    </>
  )
}
