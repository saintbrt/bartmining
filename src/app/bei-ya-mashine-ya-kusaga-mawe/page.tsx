import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, faqSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import SwahiliArticle, { type SwFaq } from '@/components/sw/SwahiliArticle'

/**
 * "Bei ya mashine ya kusaga mawe" is one of the most searched Swahili
 * equipment queries, and the results are mostly Facebook videos.
 *
 * NOTE FOR REVIEW: the TZS figures are prices advertised by local sellers
 * in 2026, not Bart Mining quotations. Replace with our own ranges if we
 * want to publish them. Native Swahili review before shipping.
 */

const URL = `${SITE.url}/bei-ya-mashine-ya-kusaga-mawe`

export const metadata: Metadata = {
  title: 'Bei ya Mashine ya Kusaga Mawe ya Dhahabu (Ball Mill) Tanzania',
  description:
    'Bei ya mashine ya kusaga mawe ya dhahabu Tanzania: ball mill, jaw crusher na hammer mill. Kinachoamua bei, ukubwa sahihi kwa kiasi cha mawe yako, na gharama za kuendesha.',
  alternates: { canonical: URL, languages: { 'sw-TZ': URL, en: `${SITE.url}/equipment/ball-mill-gold-ore` } },
  openGraph: { type: 'article', url: URL, locale: 'sw_TZ', title: 'Bei ya Mashine ya Kusaga Mawe ya Dhahabu' },
}

const FAQS: SwFaq[] = [
  { q: 'Mashine ya kusaga mawe ya tani moja ni bei gani?', a: 'Kwa mwaka 2026, wauzaji wa ndani wanatangaza ball mill ndogo kwa takribani TSh milioni 20 kwa uwezo wa robo tani, milioni 25 kwa nusu tani na milioni 30 kwa tani moja. Bei hizi hazijumuishi mota au injini, msingi, usafiri na ufungaji kila mara, hivyo uliza muuzaji anachojumuisha.' },
  { q: 'Nichague ball mill au hammer mill?', a: 'Hammer mill ni nafuu na husaga haraka lakini chembe zake si laini sana, na nyundo zake huisha haraka kwenye mawe magumu. Ball mill husaga laini zaidi, jambo linaloongeza dhahabu inayopatikana kwenye concentrator au CIP. Kama unapanga kuchenjua kwa CIP baadaye, ball mill ni chaguo bora.' },
  { q: 'Mashine ya kusaga inahitaji umeme kiasi gani?', a: 'Ball mill ndogo kwa kawaida hutumia mota ya kilowati 7.5 hadi 37 kutegemea ukubwa. Kama huna umeme wa TANESCO, unahitaji jenereta yenye uwezo mkubwa kuliko mota kwa sababu mota huvuta umeme mwingi wakati wa kuwasha.' },
  { q: 'Mashine iliyotumika inafaa?', a: 'Inaweza kufaa ikiwa ukaguzi umefanyika vizuri. Angalia ganda la kinu kama lina nyufa, hali ya liners, gia na bearing, na hakikisha mota ni ya 50 Hz. Mashine iliyofanya kazi kwenye mawe laini inaweza kuwa ndogo kwa mawe yako magumu.' },
  { q: 'Ninawezaje kujua ukubwa wa mashine ninaohitaji?', a: 'Anza na tani za mawe unazochimba kwa siku, ugumu wa mawe yako na ulaini unaohitajika. Tutumie taarifa hizi na tutakushauri ukubwa sahihi. Mashine ndogo kupita kiasi hufanya kazi saa nyingi na kuisha haraka; kubwa kupita kiasi ni mtaji uliofungwa.' },
]

export default function BallMillPricePage() {
  return (
    <>
      <JsonLd data={[
        faqSchema(FAQS),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Vifaa vya Uchimbaji', path: '/vifaa-vya-uchimbaji' },
          { name: 'Bei ya Mashine ya Kusaga Mawe', path: '/bei-ya-mashine-ya-kusaga-mawe' },
        ]),
      ]} />
      <SwahiliArticle
        crumbs={[{ name: 'Mwanzo', href: '/' }, { name: 'Vifaa vya uchimbaji', href: '/vifaa-vya-uchimbaji' }, { name: 'Mashine ya kusaga mawe' }]}
        eyebrow="Bei · Septemba 2026"
        h1="Bei ya mashine ya kusaga mawe ya dhahabu"
        lead="Mashine ya kusaga mawe ndiyo moyo wa plant ya dhahabu. Isiposaga vizuri, dhahabu hubaki ndani ya mchanga na kupotea. Ukurasa huu unaeleza bei zinazotangazwa sokoni, kinachoamua bei, na jinsi ya kuchagua mashine inayolingana na mawe yako."
        enHref="/equipment/ball-mill-gold-ore"
        faqs={FAQS}
        ctaTitle="Unahitaji mashine ya kusaga mawe?"
      >
        <h2 id="aina">Aina za Mashine za Kusaga na Kuponda</h2>
        <ul>
          <li><strong>Mashine ya kuponda mawe (<Link href="/equipment/jaw-crusher">jaw crusher</Link>).</strong> Huponda mawe makubwa kuwa vipande vidogo kabla ya kusagwa</li>
          <li><strong>Hammer mill.</strong> Husaga kwa nyundo zinazozunguka kwa kasi. Ni nafuu na maarufu kwa wachimbaji wadogo, lakini nyundo huisha haraka kwenye mawe magumu</li>
          <li><strong>Kinu cha kusaga (<Link href="/equipment/ball-mill-gold-ore">ball mill</Link>).</strong> Ngoma inayozunguka ikiwa na mipira ya chuma ndani. Husaga laini zaidi na hufaa kwa concentrator na CIP</li>
        </ul>

        <h2 id="bei">Bei Zinazotangazwa Sokoni</h2>
        <p>Bei zifuatazo ni za ball mill ndogo zinazotangazwa na wauzaji wa ndani Tanzania mwaka 2026. Ni mwongozo tu, si bei yetu rasmi:</p>
        <div className="tbl">
          <table>
            <thead><tr><th>Uwezo</th><th>Bei inayotangazwa</th></tr></thead>
            <tbody>
              <tr><td>Robo tani</td><td>Takribani TSh milioni 20</td></tr>
              <tr><td>Nusu tani</td><td>Takribani TSh milioni 25</td></tr>
              <tr><td>Tani moja</td><td>Takribani TSh milioni 30</td></tr>
            </tbody>
          </table>
        </div>
        <div className="art-callout">
          <p><strong>Uliza kinachojumuishwa.</strong> Bei mbili zinazoonekana sawa zinaweza kuwa tofauti sana: moja ikiwa na mota, liners, mipira ya chuma na ufungaji, nyingine ikiwa ni ngoma tupu. Linganisha bei kwa orodha kamili.</p>
        </div>

        <h2 id="kinachoamua">Kinachoamua Bei</h2>
        <ul>
          <li><strong>Ukubwa wa kinu</strong> (kipenyo na urefu), unaoamua tani kwa saa</li>
          <li><strong>Mota au injini</strong>: mota ya umeme au injini ya dizeli, na ukubwa wake</li>
          <li><strong>Liners na mipira ya chuma</strong>: unene na aina ya chuma huamua itadumu muda gani</li>
          <li><strong>Imetengenezwa wapi</strong>: nchini au imeagizwa nje, na ubora wa uchomeleaji</li>
          <li><strong>Mpya au iliyotumika</strong></li>
          <li><strong>Usafiri hadi eneo lako</strong> na msingi wa zege</li>
        </ul>

        <h2 id="gharama-za-kuendesha">Gharama za Kuendesha</h2>
        <p>Bei ya kununua unailipa mara moja. Gharama hizi unazilipa kila siku:</p>
        <ul>
          <li><strong>Umeme au dizeli</strong>, gharama kubwa kuliko zote kwenye kusaga</li>
          <li><strong>Mipira ya chuma</strong> inayoisha kadiri inavyosaga</li>
          <li><strong>Liners na nyundo</strong> zinazohitaji kubadilishwa</li>
          <li><strong>Mafuta ya gia na bearing</strong>, na matengenezo</li>
        </ul>

        <h2 id="kuchagua">Jinsi ya Kuchagua</h2>
        <ol>
          <li>Pima tani za mawe unazochimba kwa siku</li>
          <li>Jua ugumu wa mawe yako. Mawe ya Geita, kwa mfano, ni magumu na huchakaza mashine haraka</li>
          <li>Amua kama utatumia concentrator pekee au utaongeza <Link href="/equipment/leaching-tank">matanki ya CIP</Link> baadaye</li>
          <li>Hakikisha umeme au jenereta inatosha kuwasha mota</li>
          <li>Omba bei ya kufikisha eneo lako, si bei ya kiwandani</li>
        </ol>
        <p>Kwa gharama kamili ya plant nzima, soma <Link href="/gharama-ya-plant-ya-dhahabu">gharama ya kujenga plant ya dhahabu</Link>.</p>
      </SwahiliArticle>
    </>
  )
}
