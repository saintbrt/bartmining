import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, faqSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import SwahiliArticle, { type SwFaq } from '@/components/sw/SwahiliArticle'

/**
 * Primary Mining Licence (PML) guide in Swahili.
 *
 * Facts from the Mining Commission FAQ and application procedures, and the
 * Mining Act Cap 123. Fee amounts are deliberately not stated because they
 * change; readers are sent to the Resident Mines Officer and the portal.
 *
 * NOTE FOR REVIEW: native Swahili review before shipping.
 */

const URL = `${SITE.url}/jinsi-ya-kupata-leseni-ya-pml`

export const metadata: Metadata = {
  title: 'Jinsi ya Kupata Leseni ya Uchimbaji Mdogo (PML) Tanzania',
  description:
    'Jinsi ya kupata leseni ya uchimbaji mdogo (PML) Tanzania hatua kwa hatua: nani anastahili, nyaraka, kuomba kwenye Mining Cadastre Portal na masharti.',
  // No English counterpart, so no hreflang: a self-only annotation does nothing.
  alternates: { canonical: URL },
  openGraph: { type: 'article', url: URL, locale: 'sw_TZ', title: 'Jinsi ya Kupata Leseni ya PML Tanzania' },
}

const FAQS: SwFaq[] = [
  { q: 'Leseni ya PML inadumu muda gani?', a: 'Leseni ya uchimbaji mdogo (PML) hutolewa kwa miaka saba na inaweza kuhuishwa kwa mujibu wa Sheria ya Madini Sura ya 123.' },
  { q: 'Mgeni anaweza kupata PML?', a: 'Hapana. PML hutolewa kwa raia wa Tanzania au kampuni inayomilikiwa kikamilifu na Watanzania. Wawekezaji wa kigeni hushiriki kwa njia nyingine, kama leseni za uchimbaji wa kati (ML) au ubia kwa kufuata sheria.' },
  { q: 'Eneo la PML ni kubwa kiasi gani?', a: 'Eneo la PML ni dogo, kwa kawaida lisizidi hekta 10. Wamiliki wa PML kadhaa zinazopakana wanaweza kuziunganisha na kuomba kuzibadilisha kuwa leseni ya uchimbaji wa kati (ML) kadiri mtaji, akiba ya madini na teknolojia vinavyokua.' },
  { q: 'Ada ya maombi ni kiasi gani?', a: 'Ada hubadilika mara kwa mara, hivyo thibitisha kiasi cha sasa kwa Afisa Madini Mkazi au kwenye Mining Cadastre Portal. Kumbuka kuwa ada ya maombi hairudishwi hata ombi likikataliwa.' },
  { q: 'Naweza kuomba PML ndani ya leseni ya mtu mwingine?', a: 'Inawezekana chini ya masharti: mmiliki wa leseni ya utafutaji (PL) au ya uchimbaji (ML) atoe ridhaa kwa maandishi, na PML iwe kwa madini tofauti na yale yaliyo kwenye leseni yake.' },
  { q: 'Nikipata PML, naweza kuuza dhahabu moja kwa moja?', a: 'Ndiyo. Mmiliki wa PML anaweza kuuza madini anayochimba kwenye masoko ya madini, vituo vya ununuzi au kwa wafanyabiashara wenye leseni, bila kuhitaji leseni tofauti ya biashara ya madini.' },
]

export default function PmlGuidePage() {
  return (
    <>
      <JsonLd data={[
        faqSchema(FAQS),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Leseni ya PML', path: '/jinsi-ya-kupata-leseni-ya-pml' },
        ]),
      ]} />
      <SwahiliArticle
        crumbs={[{ name: 'Mwanzo', href: '/' }, { name: 'Leseni ya PML' }]}
        eyebrow="Leseni · Tume ya Madini"
        h1="Jinsi ya kupata leseni ya uchimbaji mdogo (PML)"
        lead="Leseni ya Uchimbaji Mdogo (Primary Mining Licence, PML) ndiyo inayomruhusu Mtanzania kuchimba madini kihalali kwa kiwango kidogo. Ukurasa huu unaeleza nani anastahili, nyaraka unazohitaji, hatua za kuomba na masharti unayopaswa kutimiza baada ya kupata leseni."
        faqs={FAQS}
        ctaTitle="Umepata leseni? Anza na vifaa sahihi"
        ctaBody="Tunasambaza mashine za kusaga, concentrator, winchi, pampu na vifaa vya usalama kwa wamiliki wa PML kote Tanzania, na tunakushauri kulingana na mawe yako na umeme uliopo."
      >
        <h2 id="pml-ni-nini">PML ni Nini</h2>
        <ul>
          <li><strong>Ni leseni ya uchimbaji mdogo</strong> unaotumia mashine na teknolojia kidogo, na mtaji wa awali usiozidi dola milioni 5 za Marekani au kiasi sawa kwa shilingi</li>
          <li><strong>Hutolewa kwa miaka 7</strong> na inaweza kuhuishwa</li>
          <li><strong>Eneo ni dogo</strong>, kwa kawaida lisizidi hekta 10</li>
          <li><strong>Hutolewa na Tume ya Madini</strong> kupitia ofisi za Afisa Madini Mkazi</li>
        </ul>

        <h2 id="nani">Nani Anastahili</h2>
        <ul>
          <li>Raia wa Tanzania mwenye umri wa mtu mzima</li>
          <li>Kampuni au kikundi kinachomilikiwa kikamilifu na Watanzania</li>
        </ul>

        <h2 id="nyaraka">Nyaraka na Maandalizi</h2>
        <ul>
          <li><strong>Fomu ya maombi</strong> iliyojazwa, yenye jina, anuani ya posta na anuani ya makazi</li>
          <li><strong>Nakala ya kitambulisho</strong> na picha ya pasipoti</li>
          <li><strong>Ramani ya eneo</strong> unaloomba, pamoja na <strong>kuratibu (coordinates)</strong> za eneo kwa mfumo wa Arc 1960</li>
          <li><strong>Ridhaa ya mmiliki halali wa ardhi</strong> ya kuingia na kufanya kazi kwenye eneo</li>
          <li><strong>Mpango wa huduma kwa jamii</strong>, unaoandaliwa kwa kushirikiana na halmashauri ya eneo</li>
          <li><strong>Ada ya maombi</strong>, ambayo hairudishwi hata ombi likikataliwa</li>
        </ul>
        <div className="art-callout">
          <p><strong>Kagua eneo kwanza.</strong> Kabla ya kulipa ada, hakikisha eneo halijaombwa au kutolewa kwa mtu mwingine. Afisa Madini Mkazi na portal ya Tume ya Madini wanaweza kukuonyesha hali ya eneo.</p>
        </div>

        <h2 id="hatua">Hatua za Kuomba</h2>
        <ol>
          <li><strong>Jisajili kwenye Mining Cadastre Portal</strong> (Online Mining Cadastre Transactional Portal) ya Tume ya Madini</li>
          <li><strong>Tambua eneo na kuratibu zake</strong>, na hakikisha liko wazi</li>
          <li><strong>Jaza ombi mtandaoni</strong> na pakia nyaraka zinazohitajika</li>
          <li><strong>Wasilisha nakala ngumu</strong> kwa ofisi ya Afisa Madini Mkazi wa eneo lako</li>
          <li><strong>Lipa ada ya maombi</strong> kwa njia inayoelekezwa na portal</li>
          <li><strong>Subiri uhakiki</strong> wa eneo na nyaraka zako</li>
          <li><strong>Pokea leseni na lipa ada ya mwaka</strong> kama inavyoelekezwa</li>
        </ol>

        <h2 id="baada">Baada ya Kupata Leseni</h2>
        <p>Leseni si mwisho wa safari. Ukaguzi wa Tume ya Madini mwaka 2026 uliwapa wamiliki wa miradi midogo muda mfupi kurekebisha mapungufu. Hakikisha una:</p>
        <ul>
          <li><strong>Mpango wa usimamizi wa mazingira</strong></li>
          <li><strong>Mpango wa uchimbaji na mpango wa kufungua mgodi</strong></li>
          <li><strong>Mpango wa huduma kwa jamii (CSR)</strong> na <strong>mpango wa uhamishaji teknolojia</strong></li>
          <li><strong>Kulipa ada ya mwaka</strong> kwa wakati</li>
          <li><strong>Kulipa mrabaha</strong> na kuuza madini kwenye masoko rasmi. Soma <Link href="/mrabaha-na-kodi-za-dhahabu">mrabaha na kodi za dhahabu</Link></li>
          <li><strong>Usalama kazini</strong>: kofia ngumu, winchi salama, uingizaji hewa na kipima gesi kwenye mashimo marefu</li>
        </ul>
        <p>Ukitumia sianidi kuchenjua, unahitaji vibali vya ziada vya mazingira na kemikali. Soma <Link href="/insights/activated-carbon-cyanide-tanzania">kuhusu sianidi na kaboni</Link> (kwa Kiingereza).</p>

        <h2 id="kukua">Kukua kutoka PML hadi ML</h2>
        <p>Kadiri mradi unavyokua, wamiliki wa PML zinazopakana wanaweza kuziunganisha na kupata cheti cha kuunganisha kutoka kwa Afisa Madini Mkazi, kisha kuomba kubadilisha kuwa leseni ya uchimbaji wa kati (ML). Uamuzi huzingatia ukuaji wa mtaji, akiba ya madini iliyothibitishwa na teknolojia inayotumika.</p>

        <p style={{ color: 'var(--ink-3)', fontSize: 14 }}>
          Ukurasa huu unaeleza utaratibu kwa ujumla na si ushauri wa kisheria. Sheria na ada hubadilika. Thibitisha na Tume ya Madini au Afisa Madini Mkazi kabla ya kuomba.
        </p>
      </SwahiliArticle>
    </>
  )
}
