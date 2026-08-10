import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import RegionsSection from '@/components/sections/RegionsSection'
import CtaSection from '@/components/sections/CtaSection'
import EquipmentThumb from '@/components/equipment/EquipmentThumb'
import { EQUIPMENT, equipmentByCategory } from '@/data/equipment-catalogue'
import { LOCATIONS } from '@/data/locations'
import { SITE, SERVICE_AREAS, itemListSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'

/**
 * Single catalogue section for everything Bart Mining supplies.
 *
 * This absorbed the former /products page, which covered the same intent in
 * different words. /products now permanently redirects here (see
 * next.config.ts) so there is one canonical URL per product concept and no
 * split ranking signal between two competing sections.
 */

export const metadata: Metadata = {
  title: 'Mining Equipment Supply Tanzania: Specifications & Price Guides',
  description:
    'Mining equipment supplied across Mwanza, Kahama, Geita and Shinyanga: winches, gold processing plants, drilling rigs, pumps, safety equipment and mine management software.',
  alternates: {
    canonical: `${SITE.url}/equipment`,
    languages: { en: `${SITE.url}/equipment`, 'sw-TZ': `${SITE.url}/vifaa-vya-uchimbaji` },
  },
  openGraph: {
    title: 'Mining Equipment Supply Tanzania: Specifications & Price Guides',
    description: `Specifications, applications and maintenance guides for ${EQUIPMENT.length} categories of mining equipment supplied across Tanzania.`,
    url: `${SITE.url}/equipment`,
  },
}

export default function EquipmentHub() {
  const groups = equipmentByCategory()

  return (
    <>
      <JsonLd
        data={[
          itemListSchema(EQUIPMENT.map(e => ({ name: e.name, path: `/equipment/${e.slug}` }))),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Equipment', path: '/equipment' },
          ]),
        ]}
      />

      <section className="subhero" style={{ paddingBottom: 32 }}>
        <div className="px-site">
          <Reveal>
            <nav className="crumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span className="sep">/</span><span>Equipment</span>
            </nav>
          </Reveal>
          <Reveal delay={1}><h1 style={{ marginTop: 14 }}>Machinery, plant and safety equipment</h1></Reveal>
          <Reveal delay={2}>
            <p className="lead">
              From exploration support gear to complete gold-recovery systems, we source,
              specify, supply and commission mining equipment across Tanzania. Every item
              below has a specification page so you can scope a requirement before you enquire.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="subhero-meta">
              <div><div className="num">Source</div><div className="lbl">Vendor-neutral selection</div></div>
              <div className="div" />
              <div><div className="num">Supply</div><div className="lbl">Procurement &amp; logistics</div></div>
              <div className="div" />
              <div><div className="num">Commission</div><div className="lbl">Install &amp; handover</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why source through us. Carried over from the former /products page. */}
      <section className="sec-gap-sm">
        <div className="px-site">
          <div className="split2">
            <Reveal>
              <div className="about-img">
                <Image
                  src="https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Mining processing equipment on site"
                  fill style={{ objectFit: 'cover' }} sizes="(max-width: 860px) 100vw, 50vw"
                />
              </div>
            </Reveal>
            <Reveal delay={1}>
              <span className="eyebrow">Why source through us</span>
              <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', marginTop: 16 }}>
                The right plant for the orebody, not the catalogue
              </h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 18, lineHeight: 1.7 }}>
                Equipment decisions made on a spreadsheet fail in the field. We size and select
                against real metallurgy, grade and remoteness, manage procurement and logistics,
                then stand the plant up and hand it to a trained crew. Vendor-neutral, and
                accountable to you.
              </p>
              <div className="src-grid">
                {[
                  { n: '01', t: 'Spec & size', b: 'Matched to ore, throughput and recovery targets.' },
                  { n: '02', t: 'Commission', b: 'Installed, tuned and handed over to your operators.' },
                ].map(v => (
                  <div key={v.n} className="src-card">
                    <div className="src-n">{v.n}</div>
                    <h3>{v.t}</h3>
                    <p>{v.b}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <div className="px-site" style={{ paddingBottom: 72 }}>
        {groups.map((group, gi) => (
          <section key={group.category} style={{ marginTop: gi === 0 ? 8 : 56 }}>
            <div className="eq-grouphead">
              <h2>{group.label}</h2>
              <span>{group.items.length} {group.items.length === 1 ? 'item' : 'items'}</span>
            </div>
            <div className="eq-grid">
              {group.items.map((item, i) => (
                <Link key={item.slug} href={`/equipment/${item.slug}`} className="eq-card">
                  <EquipmentThumb
                    slug={item.slug}
                    alt={item.name}
                    category={item.category}
                    sizes="(max-width: 640px) 50vw, (max-width: 1080px) 33vw, 25vw"
                    priority={gi === 0 && i < 2}
                  />
                  <div className="eq-cardbody">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="eq-more">View specifications &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section style={{ marginTop: 56 }}>
          <div className="eq-grouphead"><h2>Supply by district</h2></div>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 680, marginBottom: 18, lineHeight: 1.7 }}>
            Delivery routes, local geology and the equipment each goldfield district
            actually buys.
          </p>
          <div className="dist-row">
            {LOCATIONS.map(l => (
              <Link key={l.slug} href={`/equipment/supply/${l.slug}`} className="dist-card">
                <span className="dist-region">{l.region}</span>
                <span className="dist-city">{l.city}</span>
                <span className="eq-more">Supply details &rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 56 }}>
          <div className="eq-grouphead"><h2>Regions we supply</h2></div>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 680, marginBottom: 18, lineHeight: 1.7 }}>
            Equipment is delivered nationwide from Dar es Salaam, with the heaviest coverage
            across the Lake Victoria Goldfields where most of Tanzania&apos;s gold mining sits.
          </p>
          <div className="region-chips">
            {SERVICE_AREAS.map(r => <span key={r} className="region-chip">{r}</span>)}
          </div>
          <p style={{ marginTop: 22, fontSize: 16, color: 'var(--ink-2)' }} lang="sw">
            Unasoma Kiswahili?{' '}
            <Link href="/vifaa-vya-uchimbaji" style={{ color: 'var(--gold)', fontWeight: 600 }}>
              Tazama vifaa vya uchimbaji madini kwa Kiswahili
            </Link>
          </p>
        </section>
      </div>

      <RegionsSection />

      <CtaSection
        eyebrow="Spec a plant"
        heading={<>Tell us your <span className="grad">throughput &amp; grade</span></>}
        body="We'll come back with a recommended configuration, indicative budget and a commissioning plan."
        primaryLabel="Request a quote"
        primaryHref="https://wa.me/255759141705"
        secondaryLabel="Talk to us"
        secondaryHref="/contact"
      />

      <style>{`
        .eq-grouphead { display: flex; align-items: baseline; justify-content: space-between;
          gap: 16px; padding-bottom: 14px; margin-bottom: 22px; border-bottom: 1px solid var(--line); }
        .eq-grouphead h2 { font-size: clamp(19px,2vw,24px); }
        .eq-grouphead span { font-family: var(--font-mono); font-size: 12px; letter-spacing: .1em;
          text-transform: uppercase; color: var(--ink-3); flex-shrink: 0; }

        .eq-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .eq-card { display: flex; flex-direction: column; border: 1px solid var(--line);
          border-radius: var(--r-lg); overflow: hidden; background: var(--bg-3);
          transition: border-color .2s; }
        .eq-card:hover { border-color: var(--ink-3); }
        .eq-card:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .eq-cardbody { padding: 16px 16px 18px; display: flex; flex-direction: column; flex: 1; }
        .eq-card h3 { font-size: 16.5px; margin-bottom: 7px; color: var(--ink); line-height: 1.3; }
        .eq-card p { font-size: 15px; color: var(--ink-2); line-height: 1.55; margin-bottom: 14px; flex: 1; }
        .eq-more { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em;
          text-transform: uppercase; color: var(--gold); }

        /* Thumbnail slot. Fixed ratio so the grid stays even whether a real
           photo has been uploaded or the drawn placeholder is showing. */
        .eq-thumb { position: relative; aspect-ratio: 4 / 3; width: 100%;
          border-bottom: 1px solid var(--line); background: var(--paper); }

        /* Empty state. The faint hatch is what does the work here: category
           marks repeat across a row, and without it four identical icons
           read as a rendering fault rather than as slots awaiting a photo. */
        .eq-thumb-empty { display: grid; place-items: center;
          background-image: repeating-linear-gradient(
            45deg, transparent 0 7px, rgba(94,104,109,.055) 7px 8px); }
        .eq-thumb-empty svg { width: 42%; max-width: 84px; height: auto;
          color: var(--ink-3); opacity: .45; }

        .src-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; }
        .src-card { background: var(--bg-3); border: 1px solid var(--line);
          border-radius: var(--r-md); padding: 20px 18px; }
        .src-n { font-family: var(--font-mono); font-size: 13px; color: var(--gold); margin-bottom: 8px; }
        .src-card h3 { font-size: 16px; margin-bottom: 6px; }
        .src-card p { color: var(--ink-2); font-size: 15px; line-height: 1.6; }

        .dist-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .dist-card { display: flex; flex-direction: column; gap: 6px; border: 1px solid var(--line);
          border-radius: var(--r-lg); padding: 20px 18px; background: var(--bg-3); transition: border-color .2s; }
        .dist-card:hover { border-color: var(--ink-3); }
        .dist-region { font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em;
          text-transform: uppercase; color: var(--gold); }
        .dist-city { font-size: 19px; font-weight: 700; color: var(--ink); font-family: var(--font-sora); }
        @media (max-width: 700px) { .dist-row { grid-template-columns: 1fr; } }

        .region-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .region-chip { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em;
          padding: 5px 12px; border-radius: var(--r-sm); background: var(--bg-3);
          border: 1px solid var(--line); color: var(--ink-2); }

        @media (max-width: 1080px) { .eq-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 860px)  { .eq-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  {
          .eq-grid { gap: 14px; }
          .src-grid { grid-template-columns: 1fr; }
          .eq-card h3 { font-size: 16px; }
          .eq-card p { font-size: 14.5px; }
        }
      `}</style>
    </>
  )
}
