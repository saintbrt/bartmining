/**
 * Government mineral market pages (/soko-la-madini/[town]).
 *
 * Swahili, because the people selling gold search in Swahili. Each entry
 * carries facts specific to that market; exact street locations are not
 * published here because they move, so readers are sent to the Resident
 * Mines Officer.
 *
 * NOTE FOR REVIEW: native Swahili review before shipping.
 */

export interface Market {
  slug: string
  town: string
  region: string
  /** English supply page slug for the same district. */
  supplySlug: string
  title: string
  description: string
  summary: string
  facts: string[]
  /** Named buying centres. Left empty rather than guessed where no reliable list exists. */
  buyingCentres: string[]
  faqs: { q: string; a: string }[]
}

export const MARKETS: Market[] = [
  {
    slug: 'geita',
    town: 'Geita',
    region: 'Mkoa wa Geita',
    supplySlug: 'geita',
    title: 'Soko la Madini Geita: Bei ya Dhahabu Leo',
    description:
      'Soko la madini Geita: bei ya dhahabu leo kwa gramu, vituo vya ununuzi Bukombe, Chato, Mbogwe na Nyang’hwale, jinsi ya kuuza kihalali na mrabaha.',
    summary:
      'Geita ndilo soko la kwanza la madini Tanzania, lililofunguliwa tarehe 17 Machi 2019. Ni kitovu cha biashara ya dhahabu kwa wachimbaji wadogo wa mkoa wenye shughuli nyingi zaidi za dhahabu nchini, likisaidiwa na vituo vidogo vya ununuzi katika wilaya zote za mkoa.',
    facts: [
      'Soko la kwanza la madini nchini, lilifunguliwa tarehe 17 Machi 2019',
      'Wafanyabiashara wakubwa wa madini wamesajiliwa kufanya kazi kupitia soko hili, pamoja na madalali wadogo kwenye vituo vya ununuzi',
      'Vituo vidogo vya ununuzi viko Geita, Bukombe, Chato, Mbogwe na Nyang’hwale',
      'Serikali imejenga kituo cha mfano cha kuchakata dhahabu Rwamgasa (Lwamgasa) kuwasaidia wachimbaji wadogo',
      'Maeneo makuu ya wachimbaji wadogo ni pamoja na Nyarugusu, Mgusu, Rwamgasa na Katente',
    ],
    buyingCentres: ['Geita Mjini', 'Bukombe', 'Chato', 'Mbogwe', 'Nyang’hwale'],
    faqs: [
      { q: 'Soko la madini Geita liko wapi?', a: 'Soko kuu liko Geita Mjini, na kuna vituo vidogo vya ununuzi katika wilaya za Bukombe, Chato, Mbogwe na Nyang’hwale. Kwa mahali halisi na saa za kazi za sasa, wasiliana na ofisi ya Afisa Madini Mkazi Geita.' },
      { q: 'Nahitaji nini kuuza dhahabu Geita?', a: 'Kitambulisho, na kwa mchimbaji, nakala ya leseni yako ya uchimbaji (PML) au nyaraka zinazoonyesha chanzo halali cha dhahabu. Dhahabu hupimwa uzito na usafi sokoni kabla ya bei kukubaliwa.' },
      { q: 'Kwa nini bei ya soko ni chini ya bei ya dunia?', a: 'Bei elekezi ya Tume ya Madini huzingatia makato kama mrabaha na ada ya ukaguzi, na bei halisi hutegemea usafi uliopimwa. Kwa hiyo bei unayolipwa huwa chini kidogo ya bei ya dunia iliyobadilishwa kwa shilingi.' },
      { q: 'Kituo cha Rwamgasa kinasaidiaje wachimbaji?', a: 'Ni kituo cha mfano cha serikali cha kuchakata dhahabu, kilichojengwa kuonyesha wachimbaji wadogo teknolojia bora ya uchenjuaji na kuwasaidia kujua thamani halisi ya dhahabu wanayochimba.' },
    ],
  },
  {
    slug: 'chunya',
    town: 'Chunya',
    region: 'Mkoa wa Mbeya',
    supplySlug: 'chunya',
    title: 'Soko la Madini Chunya: Bei ya Dhahabu Leo',
    description:
      'Soko la madini Chunya: bei ya dhahabu leo kwa gramu, vituo vya ununuzi Makongolosi, Matundasi, Itumbi na Sangambi, jinsi ya kuuza dhahabu kihalali na mrabaha.',
    summary:
      'Chunya ni soko la pili la madini kufunguliwa Tanzania, Mei 2019, likihudumia uwanja wa dhahabu wa Lupa, mojawapo ya maeneo ya zamani na yenye shughuli nyingi za wachimbaji wadogo nchini. Uchimbaji wa madini ndio shughuli kuu ya kiuchumi ya wilaya.',
    facts: [
      'Soko la pili la madini nchini, lilifunguliwa Mei 2019',
      'Zaidi ya leseni 2,000 za uchimbaji zimetolewa wilayani, zikihusisha zaidi ya watu 100,000',
      'Vituo vidogo vya ununuzi viko Makongolosi, Matundasi, Itumbi, Chunya Mjini, Sangambi, Godima, Igundu na Shoga',
      'Vituo vingine vya karibu viko Mkwajuni na Saza, wilayani Songwe',
      'Serikali imejenga kituo cha mfano cha kuchakata dhahabu Itumbi',
    ],
    buyingCentres: ['Makongolosi', 'Matundasi', 'Itumbi', 'Chunya Mjini', 'Sangambi', 'Godima', 'Igundu', 'Shoga'],
    faqs: [
      { q: 'Soko la madini Chunya liko wapi?', a: 'Soko kuu liko Chunya, na kuna vituo vidogo vya ununuzi Makongolosi, Matundasi, Itumbi, Chunya Mjini, Sangambi, Godima, Igundu na Shoga. Kwa mahali halisi na saa za kazi za sasa, wasiliana na ofisi ya Afisa Madini Mkazi Chunya.' },
      { q: 'Nauza wapi dhahabu karibu na Makongolosi?', a: 'Makongolosi ina kituo cha ununuzi kilichosajiliwa kinachofanya kazi chini ya soko la madini Chunya. Kuuza nje ya masoko na vituo rasmi ni kinyume cha sheria na dhahabu inaweza kutaifishwa.' },
      { q: 'Kwa nini wachimbaji wengi Chunya wanatumia CIP?', a: 'Uwanja wa Lupa umechimbwa tangu miaka ya 1920, na miaka mingi ya kutumia zebaki imeacha marudio yenye dhahabu. Matanki ya CIP na vat huokoa dhahabu hiyo, na kuongeza kiasi kinachouzwa sokoni.' },
      { q: 'Kituo cha Itumbi ni cha nini?', a: 'Ni kituo cha mfano cha serikali cha kuchakata dhahabu, kinachowaonyesha wachimbaji wadogo njia bora za uchenjuaji na kupunguza matumizi ya zebaki.' },
    ],
  },
  {
    slug: 'kahama',
    town: 'Kahama',
    region: 'Mkoa wa Shinyanga',
    supplySlug: 'kahama',
    title: 'Soko la Madini Kahama: Bei ya Dhahabu Leo',
    description:
      'Soko la madini Kahama: bei ya dhahabu leo kwa gramu, jinsi wachimbaji wadogo wa Kahama na Msalala wanavyouza dhahabu kihalali, nyaraka na mrabaha.',
    summary:
      'Kahama ina soko la madini linalohudumia wachimbaji wadogo wa wilaya za Kahama na Msalala, eneo la migodi ya chini ya ardhi ya mkoa wa Shinyanga. Katika wiki za mwanzo baada ya kufunguliwa, zaidi ya gramu 30,000 za dhahabu zenye thamani ya karibu shilingi bilioni 2.9 ziliuzwa kupitia soko hili.',
    facts: [
      'Soko la pili la madini mkoani Shinyanga',
      'Muda mfupi baada ya kufunguliwa, gramu 30,924 za dhahabu zenye thamani ya takribani TSh bilioni 2.9 ziliuzwa sokoni',
      'Linahudumia wachimbaji wa Kahama na Msalala, eneo lenye mgodi wa chini ya ardhi wa Bulyanhulu',
      'Serikali imeonya kuwa madini yanayouzwa nje ya masoko rasmi yanaweza kutaifishwa na wahusika kushtakiwa',
    ],
    buyingCentres: ['Kahama Mjini', 'Msalala'],
    faqs: [
      { q: 'Soko la madini Kahama liko wapi?', a: 'Soko liko Kahama. Kwa mahali halisi, vituo vya ununuzi vilivyo karibu na eneo lako, na saa za kazi za sasa, wasiliana na ofisi ya Afisa Madini Mkazi Kahama.' },
      { q: 'Nini kinatokea nikiuza dhahabu nje ya soko?', a: 'Ni kinyume cha sheria. Serikali imeonya kuwa madini yanayouzwa nje ya masoko na vituo rasmi yanaweza kutaifishwa na wahusika kufikishwa mahakamani. Kuuza sokoni pia kunakupa bei ya uwazi na stakabadhi.' },
      { q: 'Wachimbaji wa Kahama wanahitaji vifaa gani?', a: 'Kahama ina mashimo marefu kuliko maeneo mengi ya Kanda ya Ziwa, hivyo mahitaji makuu ni winchi na hoist, feni za kuingiza hewa, pampu za kutoa maji kwa hatua, vipima gesi na vifaa vya kujiokoa.' },
    ],
  },
  {
    slug: 'mwanza',
    town: 'Mwanza',
    region: 'Mkoa wa Mwanza',
    supplySlug: 'mwanza',
    title: 'Soko la Madini Mwanza: Bei ya Dhahabu Leo',
    description:
      'Soko la madini Mwanza: bei ya dhahabu leo, jinsi wachimbaji wa Sengerema, Misungwi, Buchosa na Kwimba wanavyouza kihalali, kiwanda cha kusafisha na mrabaha.',
    summary:
      'Mwanza ni mji mkuu wa biashara wa Kanda ya Ziwa na kitovu cha wachimbaji wadogo wa Sengerema, Misungwi, Buchosa, Kwimba na Magu. Mbali na soko la madini, Mwanza ina kiwanda cha kusafisha dhahabu, jambo linalowapa wachimbaji wa eneo hili fursa ya kuuza kwa mnunuzi anayelipa mrabaha wa kiwango cha chini.',
    facts: [
      'Mwanza ni sehemu ya mtandao wa kitaifa wa masoko ya madini na vituo vya ununuzi vilivyo chini ya Tume ya Madini',
      'Mwanza ina kiwanda cha kusafisha dhahabu (Mwanza Precious Metals Refinery). Dhahabu inayouzwa kwa kiwanda cha kusafisha nchini hulipiwa mrabaha wa asilimia 2',
      'Wachimbaji wadogo wako Sengerema, Misungwi, Buchosa, Kwimba na Magu, wengi wakichimba mashimo mafupi',
      'Mradi mkubwa wa dhahabu wa Nyanzaga, wilayani Sengerema, unatekelezwa kwa ubia kati ya Serikali na Perseus Mining',
    ],
    buyingCentres: [],
    faqs: [
      { q: 'Soko la madini Mwanza liko wapi?', a: 'Kwa mahali halisi pa soko, vituo vya ununuzi vilivyo karibu na eneo lako na saa za kazi za sasa, wasiliana na ofisi ya Afisa Madini Mkazi Mwanza.' },
      { q: 'Naweza kuuza dhahabu kwa kiwanda cha kusafisha Mwanza?', a: 'Viwanda vya kusafisha dhahabu vilivyoidhinishwa hununua dhahabu, na dhahabu inayouzwa kwao hulipiwa mrabaha wa asilimia 2 badala ya asilimia 6. Thibitisha na kiwanda na Tume ya Madini masharti ya sasa ya kuuza moja kwa moja kwao.' },
      { q: 'Wachimbaji wa Mwanza hununua vifaa gani zaidi?', a: 'Kwa sababu wengi huchimba mashimo mafupi ya dhahabu ya mishipa, mahitaji makuu ni winchi za tani moja na mbili, pampu za kutoa maji wakati wa mvua, na concentrator na meza za kutingisha zinazochukua nafasi ya zebaki.' },
    ],
  },
  {
    slug: 'songwe',
    town: 'Songwe',
    region: 'Mkoa wa Songwe',
    supplySlug: 'chunya',
    title: 'Soko la Madini Songwe: Bei ya Dhahabu Leo',
    description:
      'Soko la madini Songwe: bei ya dhahabu leo kwa gramu, vituo vya ununuzi Mkwajuni na Saza, leseni mpya za wachimbaji Saza na jinsi ya kuuza kihalali.',
    summary:
      'Wilaya ya Songwe iko kwenye uwanja ule ule wa dhahabu wa Lupa unaopakana na Chunya, na uchimbaji wa madini huchangia zaidi ya asilimia 70 ya mapato ya wilaya. Vituo vya ununuzi vya Mkwajuni na Saza vinawahudumia wachimbaji wadogo, ambao idadi yao imeongezeka baada ya Serikali kugawa leseni ndogo mpya eneo la Saza.',
    facts: [
      'Uchimbaji wa madini huchangia zaidi ya asilimia 70 ya mapato ya Wilaya ya Songwe',
      'Vituo vya ununuzi wa madini viko Mkwajuni na Saza',
      'Serikali iligawa leseni ndogo 37 eneo la Saza kutoka leseni iliyokuwa ikishikiliwa na kampuni moja; leseni 19 zilitolewa Machi 2024 na mchakato uliendelea',
      'Eneo liko kwenye uwanja wa dhahabu wa Lupa, pamoja na Mgodi wa Dhahabu wa New Luika',
    ],
    buyingCentres: ['Mkwajuni', 'Saza'],
    faqs: [
      { q: 'Nauza wapi dhahabu Songwe?', a: 'Kwenye vituo vya ununuzi vilivyosajiliwa vya Mkwajuni na Saza, au kwenye soko la madini Chunya lililo karibu. Kwa maelezo ya sasa, wasiliana na ofisi ya Afisa Madini Mkazi.' },
      { q: 'Leseni mpya za Saza zilitolewaje?', a: 'Serikali iligawa leseni ndogo 37 eneo la Saza kutoka leseni iliyokuwa ikishikiliwa awali na kampuni. Leseni 19 za kwanza zilitolewa Machi 2024 kwa kikundi cha wachimbaji na wachimbaji wengine wadogo, na mchakato wa kutoa leseni zaidi uliendelea.' },
      { q: 'Wachimbaji wapya wa Saza wanahitaji vifaa gani kwanza?', a: 'Seti ya kuponda na kusaga mawe inayosaga laini vya kutosha, concentrator na meza ya kutingisha ili kupata dhahabu bila zebaki, na pampu na winchi kwa mashimo. Matanki ya CIP yanaweza kuongezwa baadaye kama majaribio yataonyesha dhahabu imebaki kwenye mabaki.' },
    ],
  },
  {
    slug: 'katavi',
    town: 'Katavi (Mpanda)',
    region: 'Mkoa wa Katavi',
    supplySlug: 'mpanda',
    title: 'Soko la Madini Katavi (Mpanda): Bei ya Dhahabu Leo',
    description:
      'Soko la madini Katavi: bei ya dhahabu leo kwa gramu, masoko ya Mpanda na Karema, wachimbaji wa Ibindi, Kapanda na Katuma, na kuongeza dhahabu inayopatikana.',
    summary:
      'Mkoa wa Katavi una masoko mawili ya madini, katika Manispaa ya Mpanda na Karema, yanayohudumia wachimbaji wadogo wa uwanja wa madini wa Mpanda. Soko la madini Katavi limeuza dhahabu yenye thamani ya makumi ya mabilioni ya shilingi. Changamoto kubwa ya eneo hili ni kiasi kidogo cha dhahabu kinachopatikana kwenye plant za vat.',
    facts: [
      'Masoko mawili ya madini: Manispaa ya Mpanda na Karema',
      'Soko la madini Katavi limeripotiwa kuuza dhahabu yenye thamani ya takribani shilingi bilioni 50',
      'Plant za wachimbaji wadogo Ibindi, Kapanda na Katuma hutumia vat kuchenjua dhahabu',
      'Utafiti ulionyesha plant hizo hupata wastani wa chini ya asilimia 57 ya dhahabu iliyo kwenye mawe',
      'Dhahabu pia inapatikana Ugalla, Singililwa, Msagiya na eneo la Mpanda Mjini',
    ],
    buyingCentres: ['Mpanda', 'Karema'],
    faqs: [
      { q: 'Masoko ya madini Katavi yako wapi?', a: 'Kuna masoko mawili, katika Manispaa ya Mpanda na Karema. Kwa mahali halisi na saa za kazi, wasiliana na ofisi ya Afisa Madini Mkazi Katavi.' },
      { q: 'Kwa nini plant za vat Katavi zinapata dhahabu kidogo?', a: 'Utafiti kwenye plant za Ibindi, Katuma na Kapanda ulionyesha wastani wa chini ya asilimia 57. Sababu zinaweza kuwa kusaga kusiko laini, madini ya shaba na mengine yanayotumia sianidi, na mipaka ya vat yenyewe. Kupima mawe yako kunaonyesha tatizo ni lipi.' },
      { q: 'Ninawezaje kuongeza dhahabu ninayopata?', a: 'Pima mawe na mabaki yako, kisha fikiria kusaga laini zaidi, kuweka concentrator kabla ya kuchenjua ili kunasa dhahabu huru, na kuhamia matanki ya kukoroga badala ya vat. Kila gramu inayookolewa inaongeza kiasi unachouza sokoni.' },
    ],
  },
]

export const MARKET_BY_SLUG = new Map(MARKETS.map(m => [m.slug, m]))
