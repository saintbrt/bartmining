import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LOCATIONS_SW, LOCATIONS_SW_BY_SLUG } from '@/data/locations-sw'
import { LOCATION_BY_SLUG } from '@/data/locations'
import { MARKET_BY_SLUG } from '@/data/markets'
import { EQUIPMENT_BY_SLUG } from '@/data/equipment-catalogue'
import EquipmentThumb from '@/components/equipment/EquipmentThumb'
import { SITE, faqSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import SwahiliArticle from '@/components/sw/SwahiliArticle'

export async function generateStaticParams() {
  return LOCATIONS_SW.map(l => ({ town: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ town: string }> }): Promise<Metadata> {
  const { town } = await params
  const l = LOCATIONS_SW_BY_SLUG.get(town)
  if (!l) return {}
  const url = `${SITE.url}/vifaa-vya-uchimbaji/${l.slug}`
  const en = `${SITE.url}/equipment/supply/${l.slug}`
  return {
    title: l.title,
    description: l.description,
    alternates: { canonical: url, languages: { 'sw-TZ': url, en } },
    openGraph: { type: 'website', url, locale: 'sw_TZ', title: l.title, description: l.description },
  }
}

export default async function SwahiliTownPage({ params }: { params: Promise<{ town: string }> }) {
  const { town } = await params
  const l = LOCATIONS_SW_BY_SLUG.get(town)
  if (!l) notFound()

  const kit = (LOCATION_BY_SLUG.get(l.slug)?.buys ?? [])
    .map(s => EQUIPMENT_BY_SLUG.get(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
  const market = MARKET_BY_SLUG.get(l.slug)
  const others = LOCATIONS_SW.filter(x => x.slug !== l.slug)

  return (
    <>
      <JsonLd data={[
        faqSchema(l.faqs),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Vifaa vya Uchimbaji', path: '/vifaa-vya-uchimbaji' },
          { name: l.town, path: `/vifaa-vya-uchimbaji/${l.slug}` },
        ]),
      ]} />
      <SwahiliArticle
        crumbs={[{ name: 'Mwanzo', href: '/' }, { name: 'Vifaa vya uchimbaji', href: '/vifaa-vya-uchimbaji' }, { name: l.town }]}
        eyebrow={l.region}
        h1={`Vifaa vya uchimbaji madini ${l.town}`}
        lead={l.summary}
        enHref={`/equipment/supply/${l.slug}`}
        faqs={l.faqs}
        ctaTitle={`Unahitaji vifaa ${l.town}?`}
        ctaBody={`Tuambie kazi unayotaka kufanya, hali ya eneo na umeme uliopo. Tunakupa bei ya kufikisha ${l.town}, ikijumuisha usafirishaji, ushuru na usafiri wa ndani.`}
      >
        <h2 id="jiolojia">Madini na Miamba ya {l.town}</h2>
        <p>{l.jiolojia}</p>

        <h2 id="usafirishaji">Kufikisha Vifaa {l.town}</h2>
        <ul>{l.usafirishaji.map(x => <li key={x}>{x}</li>)}</ul>

        <h2 id="vifaa">Vifaa Vinavyonunuliwa {l.town}</h2>
        <p>{l.manunuzi}</p>
        <div className="loc-grid">
          {kit.map(item => (
            <Link key={item.slug} href={`/equipment/${item.slug}`} className="eq-card">
              <EquipmentThumb slug={item.slug} alt={item.name} category={item.category} sizes="(max-width: 640px) 50vw, 30vw" />
              <div className="eq-cardbody">
                <h3>{item.name}</h3>
                <span className="eq-more">Tazama maelezo &rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {market && (
          <>
            <h2 id="soko">Kuuza Dhahabu {l.town}</h2>
            <p>
              Tazama <Link href={`/soko-la-madini/${market.slug}`}>soko la madini {market.town}</Link> kwa
              bei ya dhahabu leo, vituo vya ununuzi na jinsi ya kuuza kihalali.
            </p>
          </>
        )}

        <h2 id="maeneo-mengine">Maeneo Mengine</h2>
        <ul>
          {others.map(o => (
            <li key={o.slug}><Link href={`/vifaa-vya-uchimbaji/${o.slug}`}>Vifaa vya uchimbaji {o.town}</Link></li>
          ))}
        </ul>
      </SwahiliArticle>

      <style>{`
        .loc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 22px 0 4px; }
        .eq-card { display: flex; flex-direction: column; border: 1px solid var(--line);
          border-radius: var(--r-lg); overflow: hidden; background: var(--bg-3); transition: border-color .2s; font-weight: 400 !important; }
        .eq-card:hover { border-color: var(--ink-3); }
        .eq-cardbody { padding: 14px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .eq-card h3 { font-size: 15.5px; margin: 0; color: var(--ink); line-height: 1.3; }
        .eq-more { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--gold); margin-top: auto; }
        .eq-thumb { position: relative; aspect-ratio: 4 / 3; width: 100%; border-bottom: 1px solid var(--line); background: var(--paper); }
        .eq-thumb-empty { display: grid; place-items: center;
          background-image: repeating-linear-gradient(45deg, transparent 0 7px, rgba(94,104,109,.055) 7px 8px); }
        .eq-thumb-empty svg { width: 42%; max-width: 84px; height: auto; color: var(--ink-3); opacity: .45; }
        @media (max-width: 600px) { .loc-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
      `}</style>
    </>
  )
}
