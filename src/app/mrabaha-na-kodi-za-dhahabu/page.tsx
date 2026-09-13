import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, faqSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import SwahiliArticle, { type SwFaq } from '@/components/sw/SwahiliArticle'
import { INDICATIVE_EXAMPLE } from '@/lib/gold-spot'

/**
 * Gold royalties and fees in Swahili.
 *
 * Rates per the Mining Commission royalty and inspection fee schedule, the
 * Bank of Tanzania domestic gold purchase programme and the Finance Act
 * 2025. These move every budget cycle: re-check each July.
 *
 * NOTE FOR REVIEW: native Swahili review, and a check of the rates against
 * the current Finance Act, before shipping.
 */

const URL = `${SITE.url}/mrabaha-na-kodi-za-dhahabu`

export const metadata: Metadata = {
  title: 'Mrabaha na Kodi za Dhahabu Tanzania 2026',
  description:
    'Mrabaha wa dhahabu Tanzania 2026: asilimia 6, 4 kwa Benki Kuu na 2 kwa viwanda vya kusafisha, ada ya ukaguzi, tozo ya UKIMWI, sharti la asilimia 20 kuuzwa nchini, na mfano wa hesabu.',
  alternates: { canonical: URL, languages: { 'sw-TZ': URL } },
  openGraph: { type: 'article', url: URL, locale: 'sw_TZ', title: 'Mrabaha na Kodi za Dhahabu Tanzania' },
}

const FAQS: SwFaq[] = [
  { q: 'Mrabaha wa dhahabu Tanzania ni asilimia ngapi?', a: 'Kiwango cha kawaida ni asilimia 6 ya thamani ya dhahabu. Kinapungua hadi asilimia 4 dhahabu ikiuzwa kwa Benki Kuu ya Tanzania, na asilimia 2 ikiuzwa kwa kiwanda cha kusafisha dhahabu hapa nchini.' },
  { q: 'Ada ya ukaguzi ni kiasi gani?', a: 'Ada ya ukaguzi na uthibitisho ni asilimia 1 kwa madini mengi. Chini ya mpango wa Benki Kuu wa kununua dhahabu nchini, ada hii imeondolewa kwa dhahabu inayouzwa kupitia mpango huo.' },
  { q: 'Sharti la asilimia 20 ni nini?', a: 'Kwa mujibu wa kanuni za biashara ya madini za 2024 na Sheria ya Fedha 2025, si chini ya asilimia 20 ya dhahabu inayochimbwa inapaswa kutengwa kwa ajili ya kuuzwa ndani ya nchi. Benki Kuu ina haki ya kwanza ya kununua, na ikikataa, Tume ya Madini huruhusu kuuza kwa wanunuzi wengine walioidhinishwa.' },
  { q: 'Mrabaha unalipwa wapi?', a: 'Ukiuza kwenye soko la madini au kituo cha ununuzi, mrabaha na ada hukatwa na kuwasilishwa wakati wa mauzo, na unapewa stakabadhi. Hifadhi stakabadhi zote kwa ajili ya kumbukumbu za leseni na kodi.' },
  { q: 'Kuna kodi nyingine zaidi ya mrabaha?', a: 'Ndiyo. Kuna tozo ya UKIMWI ya asilimia 0.1 ya thamani ya madini iliyoongezwa na Sheria ya Fedha 2025, ushuru wa huduma wa halmashauri, na kodi ya mapato kulingana na aina ya biashara yako. Wasiliana na mshauri wa kodi au TRA kwa hali yako mahususi.' },
]

const tzs = (n: number) => `TSh ${Math.round(n).toLocaleString('en-US')}`

export default function RoyaltyPage() {
  const grams = 100
  const value = grams * INDICATIVE_EXAMPLE.market
  const rows = [
    { label: 'Mrabaha wa kawaida (6%)', rate: 0.06 },
    { label: 'Ukiuza kwa Benki Kuu (4%)', rate: 0.04 },
    { label: 'Ukiuza kwa kiwanda cha kusafisha nchini (2%)', rate: 0.02 },
  ]

  return (
    <>
      <JsonLd data={[
        faqSchema(FAQS),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Mrabaha na Kodi za Dhahabu', path: '/mrabaha-na-kodi-za-dhahabu' },
        ]),
      ]} />
      <SwahiliArticle
        crumbs={[{ name: 'Mwanzo', href: '/' }, { name: 'Bei ya dhahabu', href: '/bei-ya-dhahabu-leo' }, { name: 'Mrabaha na kodi' }]}
        eyebrow="Kodi · 2026"
        h1="Mrabaha na kodi za dhahabu Tanzania"
        lead="Kila gramu ya dhahabu inayouzwa Tanzania hulipiwa mrabaha na ada kadhaa. Kiwango unacholipa kinategemea unamuuzia nani. Ukurasa huu unaeleza viwango vya 2026 na unatoa mfano wa hesabu."
        faqs={FAQS}
        ctaTitle="Pata dhahabu zaidi kutoka kwenye mawe yako"
        ctaBody="Mrabaha hauwezi kuepukwa, lakini dhahabu inayopotea kwenye mabaki inaweza kuokolewa. Tunasambaza concentrator, matanki ya CIP na plant za elution zinazoongeza kiasi unachopata."
      >
        <h2 id="viwango">Viwango vya 2026</h2>
        <div className="tbl">
          <table>
            <thead><tr><th>Tozo</th><th>Kiwango</th><th>Maelezo</th></tr></thead>
            <tbody>
              <tr><td>Mrabaha wa kawaida</td><td>6%</td><td>Kwa mauzo ya kawaida na kusafirisha nje</td></tr>
              <tr><td>Mrabaha, ukiuza kwa Benki Kuu</td><td>4%</td><td>Chini ya mpango wa Benki Kuu wa kununua dhahabu nchini</td></tr>
              <tr><td>Mrabaha, ukiuza kwa kiwanda cha kusafisha nchini</td><td>2%</td><td>Kwa viwanda vilivyoidhinishwa</td></tr>
              <tr><td>Ada ya ukaguzi</td><td>1%</td><td>Imeondolewa kwa dhahabu ya mpango wa Benki Kuu na inayouzwa kwa viwanda vya kusafisha</td></tr>
              <tr><td>Tozo ya UKIMWI</td><td>0.1%</td><td>Iliongezwa na Sheria ya Fedha 2025</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="mfano">Mfano wa Hesabu</h2>
        <p>Tuseme unauza <strong>gramu {grams}</strong> za dhahabu kwa bei elekezi ya soko la madini ya tarehe {INDICATIVE_EXAMPLE.date}, yaani <strong>{tzs(INDICATIVE_EXAMPLE.market)} kwa gramu</strong>. Thamani ni <strong>{tzs(value)}</strong>. Mrabaha peke yake ungekuwa:</p>
        <div className="tbl">
          <table>
            <thead><tr><th>Unauza kwa</th><th>Mrabaha</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.label}><td>{r.label}</td><td>{tzs(value * r.rate)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Huu ni mfano tu wa kuonyesha tofauti kati ya viwango. Ada nyingine na makato ya mnunuzi hutegemea mahali na namna unavyouza.</p>

        <h2 id="asilimia-20">Sharti la Asilimia 20 Kuuzwa Nchini</h2>
        <p>Si chini ya asilimia 20 ya dhahabu inayochimbwa inapaswa kutengwa kwa ajili ya kuuzwa ndani ya nchi. Benki Kuu ya Tanzania ina haki ya kwanza ya kuinunua. Kwa wachimbaji wadogo, kuuza kwenye masoko ya madini na vituo vya ununuzi vilivyoidhinishwa ndiyo njia rahisi ya kutimiza sharti hili na kupata mrabaha wa kiwango cha chini.</p>

        <h2 id="wapi">Wapi Kuuza</h2>
        <p>Uza kwenye masoko ya madini na vituo vya ununuzi vilivyosajiliwa. Tazama maelezo ya masoko ya{' '}
          <Link href="/soko-la-madini/geita">Geita</Link>,{' '}
          <Link href="/soko-la-madini/chunya">Chunya</Link> na{' '}
          <Link href="/soko-la-madini/kahama">Kahama</Link>, na{' '}
          <Link href="/bei-ya-dhahabu-leo">bei ya dhahabu leo</Link>.
        </p>

        <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>
          Viwango hubadilika kupitia Sheria ya Fedha kila mwaka. Ukurasa huu si ushauri wa kodi. Thibitisha viwango vya sasa na Tume ya Madini au TRA.
        </p>
      </SwahiliArticle>
    </>
  )
}
