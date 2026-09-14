import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, faqSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import SwahiliArticle, { type SwFaq } from '@/components/sw/SwahiliArticle'

/**
 * Swahili counterpart of /insights/gold-plant-setup-cost, paired by hreflang.
 * USD bands match the English article; TZS figures use roughly 2,650 TZS per
 * USD and are rounded, so they must move together if the English bands change.
 *
 * NOTE FOR REVIEW: native Swahili review before shipping.
 */

const URL = `${SITE.url}/gharama-ya-plant-ya-dhahabu`
const EN = `${SITE.url}/insights/gold-plant-setup-cost`

export const metadata: Metadata = {
  title: 'Gharama ya Kujenga Plant ya Dhahabu Tanzania (CIP na Elution)',
  description:
    'Gharama ya kujenga plant ya dhahabu Tanzania: plant ya concentrator, CIP/CIL na elution kwa tani 10 hadi 100 kwa siku, gharama zilizo nje ya bei ya mashine, na gharama za kuendesha.',
  alternates: { canonical: URL, languages: { 'sw-TZ': URL, en: EN } },
  openGraph: { type: 'article', url: URL, locale: 'sw_TZ', title: 'Gharama ya Kujenga Plant ya Dhahabu' },
}

const FAQS: SwFaq[] = [
  { q: 'Plant ndogo ya dhahabu inagharimu kiasi gani?', a: 'Plant ya concentrator ya tani 10 hadi 30 kwa siku inagharimu takribani dola 60,000 hadi 200,000 (karibu TSh milioni 160 hadi 530) kwa mashine pekee. Ongeza asilimia 25 hadi 45 kwa usafiri, ushuru na ufungaji.' },
  { q: 'Plant ya CIP ya tani 50 kwa siku ni bei gani?', a: 'Plant ya concentrator pamoja na CIL au CIP ya tani 50 kwa siku inagharimu takribani dola 400,000 hadi 900,000 (karibu TSh bilioni 1.1 hadi 2.4) kwa mashine, bila kujumuisha usafiri, ujenzi, umeme na bwawa la mabaki.' },
  { q: 'Ni kiasi gani cha chini cha mawe kinachofaa kwa CIP?', a: 'Chini ya takribani tani 20 hadi 30 kwa siku, matanki ya CIP mara nyingi hayalipi. Kwa kiwango hicho, concentrator pamoja na kuchenjua marudio kwa vat au kuuza mabaki kwa plant kubwa huwa na faida zaidi.' },
  { q: 'Kujenga plant kunachukua muda gani?', a: 'Kwa plant ya modular, panga miezi mitatu hadi sita kutoka kuagiza hadi dhahabu ya kwanza, ukihesabu utengenezaji, usafiri, ujenzi wa eneo na kuwasha. Mara nyingi kuchelewa husababishwa na vibali na maandalizi ya eneo, si mashine.' },
  { q: 'Kwa nini bei za plant zinatofautiana sana?', a: 'Kwa sababu plant hubuniwa kulingana na mawe, si tani pekee. Ugumu wa mawe, ulaini unaohitajika, aina ya dhahabu na eneo la mradi huamua ukubwa wa kinu, idadi ya matanki na gharama nyingine. Plant ya bei nafuu mara nyingi ina kinu kidogo au liners nyembamba.' },
]

export default function PlantCostSwPage() {
  return (
    <>
      <JsonLd data={[
        faqSchema(FAQS),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Vifaa vya Uchimbaji', path: '/vifaa-vya-uchimbaji' },
          { name: 'Gharama ya Plant ya Dhahabu', path: '/gharama-ya-plant-ya-dhahabu' },
        ]),
      ]} />
      <SwahiliArticle
        crumbs={[{ name: 'Mwanzo', href: '/' }, { name: 'Vifaa vya uchimbaji', href: '/vifaa-vya-uchimbaji' }, { name: 'Gharama ya plant' }]}
        eyebrow="Gharama · Plant ya dhahabu"
        h1="Gharama ya kujenga plant ya dhahabu"
        lead="Hakuna bei moja ya plant ya dhahabu. Plant mbili za tani sawa zinaweza kutofautiana mara tatu kwa gharama, kwa sababu plant hubuniwa kulingana na mawe yako. Ukurasa huu unatoa viwango vya makadirio, gharama zilizofichika na gharama za kuendesha."
        enHref="/insights/gold-plant-setup-cost"
        faqs={FAQS}
        ctaTitle="Tunabuni plant kulingana na mawe yako"
        ctaBody="Tutumie matokeo ya assay, tani kwa siku na hali ya eneo lako. Tutakupa mchoro wa plant unaofaa, gharama ya kufikisha eneo lako na gharama ya kuendesha kwa tani, na tutakuambia wazi kama concentrator pekee inatosha."
      >
        <h2 id="maswali-manne">Maswali Manne Yanayoamua Bei</h2>
        <ul>
          <li><strong>Dhahabu ni huru au imefungwa?</strong> Dhahabu huru hupatikana kwa concentrator. Dhahabu iliyofungwa ndani ya madini mengine inahitaji kuchenjuliwa kwa sianidi</li>
          <li><strong>Mawe ni magumu kiasi gani?</strong> Kusaga ndiyo gharama kubwa zaidi ya mashine na umeme</li>
          <li><strong>Unahitaji kusaga laini kiasi gani?</strong> Kusaga laini huongeza dhahabu lakini huongeza gharama</li>
          <li><strong>Eneo liko wapi?</strong> Umeme wa TANESCO au jenereta, maji, barabara na umbali kutoka Dar es Salaam</li>
        </ul>
        <p>Bila majaribio ya maabara kwenye sampuli ya mawe yako, bei yoyote ni kubahatisha. Soma <Link href="/insights/plant-test-work-guide">majaribio ya kufanya kabla ya kununua plant</Link> (kwa Kiingereza).</p>

        <h2 id="viwango">Viwango vya Makadirio</h2>
        <p>Viwango hivi ni makadirio ya mashine pekee kwa mawe yenye dhahabu huru. Havijumuishi usafiri, ushuru, ujenzi, jenereta wala bwawa la mabaki. Shilingi zimekadiriwa kwa takribani TSh 2,650 kwa dola moja.</p>
        <div className="tbl">
          <table>
            <thead><tr><th>Aina ya plant</th><th>Tani kwa siku</th><th>Dola (USD)</th><th>Takribani shilingi</th></tr></thead>
            <tbody>
              <tr><td>Concentrator pekee (kuponda, kusaga, concentrator, meza)</td><td>10 hadi 30</td><td>60,000 hadi 200,000</td><td>TSh milioni 160 hadi 530</td></tr>
              <tr><td>Concentrator pamoja na CIL/CIP na elution</td><td>50</td><td>400,000 hadi 900,000</td><td>TSh bilioni 1.1 hadi 2.4</td></tr>
              <tr><td>Plant kamili ya CIL</td><td>100 na zaidi</td><td>800,000 hadi 2,000,000+</td><td>TSh bilioni 2.1 hadi 5.3+</td></tr>
            </tbody>
          </table>
        </div>
        <p>Kwa elution pekee, soma <Link href="/insights/gold-elution-plant-price">bei ya plant ya elution</Link>. Kwa matanki, soma <Link href="/insights/small-cip-plant-guide">mwongozo wa plant ndogo ya CIP</Link> (kwa Kiingereza).</p>

        <h2 id="zilizofichika">Gharama Zilizo Nje ya Bei ya Mashine</h2>
        <ul>
          <li><strong>Usafiri, ushuru na usafiri wa ndani:</strong> kwa kawaida asilimia 25 hadi 45 juu ya bei ya kiwandani. Soma <Link href="/bei-ya-vifaa-vya-uchimbaji">bei ya vifaa vya uchimbaji</Link></li>
          <li><strong>Ujenzi:</strong> msingi wa zege, sakafu na mifereji</li>
          <li><strong>Umeme:</strong> jenereta inayoweza kuwasha kinu, na dizeli ya kila siku</li>
          <li><strong>Maji:</strong> kisima, pampu, matanki na mfumo wa kurudisha maji</li>
          <li><strong>Bwawa la mabaki (tailings)</strong> lililojengwa na kupata kibali</li>
          <li><strong>Vibali:</strong> mazingira na matumizi ya sianidi</li>
          <li><strong>Mtaji wa kuendesha:</strong> kemikali, mipira ya chuma, dizeli na mishahara hadi mauzo ya kwanza</li>
        </ul>

        <h2 id="kuendesha">Gharama za Kuendesha</h2>
        <p>Gharama ya kujenga inaamua kama unaweza kuanza. Gharama ya kuendesha kwa kila tani inaamua kama mradi una faida:</p>
        <ul>
          <li><strong>Umeme au dizeli</strong>, hasa kwa kusaga</li>
          <li><strong>Mipira ya chuma na liners</strong></li>
          <li><strong>Kemikali:</strong> sianidi, chokaa na kaboni</li>
          <li><strong>Wafanyakazi, maabara na ulinzi</strong></li>
          <li><strong>Matengenezo na vipuri</strong></li>
        </ul>

        <h2 id="modular">Plant ya Modular au ya Kujenga Eneo Husika</h2>
        <p>Kwa miradi mingi chini ya tani 200 kwa siku Tanzania, plant ya modular ni bora. Inafika ikiwa imeunganishwa kwa sehemu kubwa, inawashwa ndani ya wiki 3 hadi 10, inahitaji ujenzi mdogo, na inaweza kuhamishwa kama mawe yataisha mapema kuliko ilivyotarajiwa.</p>
      </SwahiliArticle>
    </>
  )
}
