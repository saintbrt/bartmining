import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MARKETS, MARKET_BY_SLUG } from '@/data/markets'
import { LOCATIONS_SW_BY_SLUG } from '@/data/locations-sw'
import { LOCATION_BY_SLUG } from '@/data/locations'
import { SITE, faqSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import SwahiliArticle from '@/components/sw/SwahiliArticle'
import { getGoldQuote, formatTzs, formatSwDateTime, INDICATIVE_EXAMPLE } from '@/lib/gold-spot'

export const revalidate = 3600

export async function generateStaticParams() {
  return MARKETS.map(m => ({ town: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ town: string }> }): Promise<Metadata> {
  const { town } = await params
  const m = MARKET_BY_SLUG.get(town)
  if (!m) return {}
  const url = `${SITE.url}/insights-swahili/soko-la-madini/${m.slug}`
  return {
    title: m.title,
    description: m.description,
    // No English counterpart, so no hreflang: a self-only annotation does nothing.
    alternates: { canonical: url },
    openGraph: { type: 'website', url, locale: 'sw_TZ', title: m.title, description: m.description },
  }
}

export default async function MarketPage({ params }: { params: Promise<{ town: string }> }) {
  const { town } = await params
  const m = MARKET_BY_SLUG.get(town)
  if (!m) notFound()

  const q = await getGoldQuote(revalidate)
  const others = MARKETS.filter(x => x.slug !== m.slug)
  const swTown = LOCATIONS_SW_BY_SLUG.get(m.supplySlug)

  return (
    <>
      <JsonLd data={[
        faqSchema(m.faqs, 'sw'),
        breadcrumbSchema([
          { name: 'Mwanzo', path: '/' },
          { name: 'Kurasa kwa Kiswahili', path: '/insights-swahili' },
          { name: 'Bei ya Dhahabu Leo', path: '/insights-swahili/bei-ya-dhahabu-leo' },
          { name: `Soko la Madini ${m.town}`, path: `/insights-swahili/soko-la-madini/${m.slug}` },
        ]),
      ]} />
      <SwahiliArticle
        crumbs={[{ name: 'Mwanzo', href: '/' }, { name: 'Kurasa kwa Kiswahili', href: '/insights-swahili' }, { name: `Soko la madini ${m.town}` }]}
        eyebrow={m.region}
        h1={`Soko la madini ${m.town}`}
        lead={m.summary}
        faqs={m.faqs}
        conclusion={{ title: 'Thibitisha njia na hesabu ya mauzo', body: `Kabla ya kupeleka dhahabu ${m.town}, thibitisha mnunuzi na nyaraka zinazohusika, kisha kubaliana uzito, usafi, uthamini, makato na muda wa malipo. Hifadhi hesabu na stakabadhi pamoja na kumbukumbu za chanzo cha mzigo. Salio unaloweza kufuatilia ndilo la kutumia kwenye mpango wa fedha; bei elekezi pekee haiwezi kukamilisha hesabu ya mauzo.` }}
        basis={<p>Tumia <a href="https://tumemadini.go.tz/statistics/list-of-mineral-markets/">orodha rasmi ya masoko ya madini</a> na <a href="https://www.tumemadini.go.tz/pages/licenseservice/">maelezo ya leseni ya Tume</a> kuthibitisha njia ya mauzo. <Link href="/insights-swahili/mrabaha-na-kodi-za-dhahabu">Mwongozo wa mrabaha na makato</Link> unaeleza namna ya kusoma masharti ya mauzo na vyanzo vyake. Majibu ya maswali haya hayachapishi bei, saa za kazi au makato kama taarifa iliyothibitishwa kwa kila mzigo.</p>}
        ctaTitle={`Vifaa vya uchimbaji hadi ${m.town}`}
        ctaBody={`Tunasambaza mashine za kusaga, concentrator, matanki ya CIP, plant za elution, winchi na vifaa vya usalama hadi ${m.town}, na bei tunayokupa inajumuisha usafirishaji.`}
      >
        <h2 id="bei">Bei ya Dhahabu Leo</h2>
        {q ? (
          <div className="mk-price">
            <div>
              <div className="mk-label">Bei ya dunia, gramu 1 (24K)</div>
              <div className="mk-big">{formatTzs(q.tzsGram)}</div>
              <div className="mk-sub">Imesasishwa {formatSwDateTime(q.updatedAt)}</div>
            </div>
            <div>
              <div className="mk-label">Mfano wa bei elekezi sokoni</div>
              <div className="mk-mid">{formatTzs(INDICATIVE_EXAMPLE.market)}</div>
              <div className="mk-sub">Soko la madini, {INDICATIVE_EXAMPLE.date}</div>
            </div>
          </div>
        ) : (
          <p>Bei ya leo haipatikani kwa sasa. Tazama <Link href="/insights-swahili/bei-ya-dhahabu-leo">bei ya dhahabu leo</Link> baadaye.</p>
        )}
        <p>
          Bei ya dunia iliyo juu imebadilishwa kuwa shilingi. Angalia tarehe ya kila
          takwimu: mfano wa bei elekezi ni wa tarehe iliyoandikwa, si bei ya leo.
          Kiasi cha kulipwa kwa mzigo wako kinahitaji uzito, usafi, uthamini na
          makato yanayohusika. Usitoe tena tozo iliyojumuishwa kwenye msingi wa bei
          unaotumika. Soma <Link href="/insights-swahili/mrabaha-na-kodi-za-dhahabu">mrabaha na makato ya dhahabu</Link>.
        </p>

        <h2 id="kuhusu">Kuhusu Soko la {m.town}</h2>
        <ul>{m.facts.map(f => <li key={f}>{f}</li>)}</ul>

        <h2 id="vituo">Vituo vya Ununuzi</h2>
        {m.buyingCentres.length > 0 && (
          <div className="region-chips">
            {m.buyingCentres.map(c => <span key={c} className="region-chip">{c}</span>)}
          </div>
        )}
        <p>Kwa mahali halisi pa soko na vituo vya ununuzi, na saa za kazi za sasa, wasiliana na ofisi ya Afisa Madini Mkazi {m.town}.</p>

        <h2 id="jinsi">Jinsi ya Kuuza Dhahabu Sokoni</h2>
        <ol>
          <li><strong>Thibitisha nyaraka za aina yako ya shughuli</strong> kwa Tume, ukiandaa kitambulisho, haki au leseni inayohusika na ushahidi wa chanzo halali cha mzigo</li>
          <li><strong>Dhahabu hupimwa uzito</strong> mbele yako</li>
          <li><strong>Usafi hupimwa</strong> ili kujua karati halisi</li>
          <li><strong>Bei hukubaliwa</strong> kulingana na bei elekezi ya siku na usafi uliopimwa</li>
          <li><strong>Mrabaha na ada hukatwa</strong>, na unapewa stakabadhi</li>
          <li><strong>Unalipwa</strong>, na unahifadhi stakabadhi kwa kumbukumbu zako</li>
        </ol>
        <p>Huna leseni bado? Soma <Link href="/insights-swahili/jinsi-ya-kupata-leseni-ya-pml">jinsi ya kupata leseni ya PML</Link>.</p>

        <h2 id="vifaa">Vifaa vya Uchimbaji {m.town}</h2>
        <p>
          Dhahabu inayopotea kwenye mabaki haifiki sokoni. Tazama vifaa vinavyonunuliwa zaidi{' '}
          {swTown
            ? <Link href={`/insights-swahili/vifaa-vya-uchimbaji/${swTown.slug}`}>{swTown.town}</Link>
            : <Link href={`/equipment/supply/${m.supplySlug}`}>{LOCATION_BY_SLUG.get(m.supplySlug)?.city ?? m.town}</Link>}
          , au soma <Link href="/insights-swahili/bei-ya-mashine-ya-kusaga-mawe">bei ya mashine ya kusaga mawe</Link>.
        </p>

        <h2 id="masoko-mengine">Masoko Mengine</h2>
        <ul>
          {others.map(o => (
            <li key={o.slug}><Link href={`/insights-swahili/soko-la-madini/${o.slug}`}>Soko la madini {o.town}</Link> ({o.region})</li>
          ))}
        </ul>
      </SwahiliArticle>

      <style>{`
        .mk-price { display: grid; grid-template-columns: 1.3fr 1fr; gap: 20px; background: var(--bg-3);
          border: 1px solid var(--line); border-radius: var(--r-md); padding: 22px 26px; margin-bottom: 18px; }
        .mk-label { font-family: var(--font-mono); font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
        .mk-big { font-size: clamp(28px,3.6vw,40px); font-weight: 800; color: var(--gold-deep); line-height: 1.1; }
        .mk-mid { font-size: 24px; font-weight: 700; color: var(--ink); }
        .mk-sub { font-size: 14px; color: var(--ink-3); margin-top: 4px; }
        @media (max-width: 640px) { .mk-price { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
