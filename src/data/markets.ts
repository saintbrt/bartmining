/**
 * Government mineral market pages (/insights-swahili/soko-la-madini/[town]).
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
      {
        "q": "Nipateje mahali na saa za kazi za soko la madini Geita?",
        "a": "Thibitisha taarifa za sasa kwa ofisi ya Afisa Madini Mkazi Geita au Tume ya Madini. Uliza pia kituo kinachohudumia eneo lako na kama mnunuzi ana leseni inayofaa. Orodha ya maeneo kwenye ukurasa huu ni sehemu ya kuanzia, lakini haithibitishi mahali pa kupokelea mzigo au saa za kazi za siku unayotaka kwenda."
      },
      {
        "q": "Nahitaji nyaraka gani kuuza dhahabu Geita?",
        "a": "Omba orodha inayohusu aina yako ya shughuli kabla ya kupeleka dhahabu. Andaa kitambulisho, taarifa ya haki au leseni inayohusika na kumbukumbu za chanzo halali cha mzigo kwa maelekezo ya Tume. Kitambulisho pekee hakithibitishi ruhusa ya kufanya biashara; hifadhi pia upimaji na stakabadhi za mauzo."
      },
      {
        "q": "Kwa nini kiasi cha kulipwa kinaweza kutofautiana na bei ya dunia?",
        "a": "Bei ya dunia kwa dhahabu safi na fedha za mzigo yako si vipimo vilevile. Thibitisha uzito, usafi, msingi wa bei, kiwango cha ubadilishaji na makato yanayohusika. Omba hesabu iliyoandikwa ili usitoe tena tozo ambayo tayari imejumuishwa kwenye bei elekezi inayotumika."
      },
      {
        "q": "Naweza kupanga kutumia huduma za kituo cha Rwamgasa?",
        "a": "Pata taarifa za huduma zinazotolewa sasa, malighafi inayopokelewa, gharama na nafasi iliyopo kwa mwendeshaji na mamlaka husika. Maelezo ya kituo cha mfano hayathibitishi huduma ya biashara au nafasi ya kuchakata mzigo yako. Tumia taarifa zilizothibitishwa kupanga usafiri, uchakataji na muda wa mauzo."
      }
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
      {
        "q": "Nithibitisheje kituo cha kuuza dhahabu kinachohudumia eneo langu Chunya?",
        "a": "Wasiliana na Afisa Madini Mkazi Chunya au Tume ya Madini kuhusu soko na vituo vilivyoidhinishwa vinavyopokea mzigo za aina yako. Uliza mahali, saa za kazi na nyaraka kabla ya safari. Majina yaliyotajwa kwenye mwongozo hayachukui nafasi ya kuthibitisha hali ya sasa ya kituo na leseni ya mnunuzi."
      },
      {
        "q": "Nithibitishe nini kabla ya kuuza karibu na Makongolosi?",
        "a": "Thibitisha kituo na mnunuzi kwa Tume, pamoja na haki yako ya kuuza na nyaraka za chanzo cha dhahabu. Kubaliana namna uzito, assay, makato na malipo yatakavyorekodiwa. Kutambulishwa kwa mnunuzi wa karibu hakuthibitishi kuwa ana leseni au kwamba utaratibu wa mauzo unatimiza masharti yanayohusika."
      },
      {
        "q": "Dhahabu iliyobaki kwenye marudio inaweza kuhesabiwa kama mauzo yajayo?",
        "a": "Assay inaonyesha maudhui ya sampuli, lakini kiasi kitakachopatikana kinahitaji majaribio yanayowakilisha marudio na njia ya kupata bidhaa ya mwisho. Chunguza pia historia ya uchakataji na uchafuzi. Mabaki yenye zebaki yasichukuliwe kama malighafi ya kawaida ya sianidi; mtaalamu aweke njia inayofaa kabla ya kununua vifaa au kemikali."
      },
      {
        "q": "Nithibitishe nini ikiwa nataka kutumia huduma za kituo cha Itumbi?",
        "a": "Uliza mwendeshaji na mamlaka husika kuhusu hali ya kituo, huduma za sasa, malighafi inayopokelewa, gharama na ratiba. Kuwepo kwa kituo cha mfano hakuhakikishi nafasi ya kuchakata au malipo ya mzigo yako. Weka mpango wa mauzo kwa huduma na masharti yaliyothibitishwa."
      }
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
      {
        "q": "Nipateje mahali na saa za kazi za soko la madini Kahama?",
        "a": "Wasiliana na Afisa Madini Mkazi Kahama au Tume ya Madini kwa taarifa za sasa za soko na vituo vinavyohudumia eneo lako. Uliza nyaraka za muuzaji na leseni ya mnunuzi kabla ya kupeleka mzigo. Mwongozo huu hauchapishi mahali pa kupokelea au ratiba kama taarifa iliyothibitishwa kwa siku ya safari yako."
      },
      {
        "q": "Nijueje kama njia ya mauzo ninayopewa imeidhinishwa?",
        "a": "Thibitisha leseni ya mnunuzi, shughuli inayoruhusiwa na mahali pa kununua kwa Tume ya Madini. Masharti hutegemea pia aina ya muuzaji na nyaraka za chanzo cha dhahabu. Usichukulie kila mauzo ya nje ya jengo la soko kuwa na hali moja; pata maelekezo ya utaratibu unaohusika kabla ya kukabidhi mzigo."
      },
      {
        "q": "Ni kumbukumbu gani nibaki nazo baada ya kuuza?",
        "a": "Hifadhi kitambulisho cha mzigo, uzito, assay au kipimo cha usafi kilichotumika, uthamini, makato, taarifa za mnunuzi na stakabadhi ya malipo. Linganisha salio kwenye hesabu na fedha zilizopokelewa. Kumbukumbu hizo hukusaidia kufuatilia mauzo na kutofautisha makato ya soko na gharama za biashara yako."
      }
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
      'Mwanza ni kitovu cha biashara cha Kanda ya Ziwa kinachohudumia wachimbaji wa Sengerema, Misungwi, Buchosa, Kwimba na Magu. Unapolinganisha soko, kituo cha ununuzi au kiwanda cha kusafisha, thibitisha leseni ya mnunuzi na masharti ya mauzo yako. Jina la huduma pekee halithibitishi makato au kiasi kitakacholipwa.',
    facts: [
      'Mwanza ni sehemu ya mtandao wa kitaifa wa masoko ya madini na vituo vya ununuzi vilivyo chini ya Tume ya Madini',
      'Kwa mauzo yanayohusisha kiwanda cha kusafisha, thibitisha ruhusa ya mnunuzi na kiwango cha mrabaha na tozo zinazohusika kwa Tume ya Madini; usitumie kiwango kimoja kwa kila kiwanda au mauzo',
      'Wachimbaji wadogo wako Sengerema, Misungwi, Buchosa, Kwimba na Magu, wengi wakichimba mashimo mafupi',
      'Mradi mkubwa wa dhahabu wa Nyanzaga, wilayani Sengerema, unatekelezwa kwa ubia kati ya Serikali na Perseus Mining',
    ],
    buyingCentres: [],
    faqs: [
      {
        "q": "Nipateje kituo cha kuuza dhahabu karibu na eneo langu Mwanza?",
        "a": "Pata taarifa za sasa za soko au kituo kilichoidhinishwa kwa Afisa Madini Mkazi Mwanza au Tume ya Madini. Thibitisha leseni ya mnunuzi, mahali pa kupokelea mzigo, saa za kazi na nyaraka. Usipange safari kwa kutegemea jina la soko au taarifa za mnunuzi ambazo hazijahakikiwa."
      },
      {
        "q": "Kuuza kwa kiwanda cha kusafisha Mwanza kunahakikisha makato madogo?",
        "a": "Thibitisha ruhusa na masharti ya kiwanda hicho kwa mauzo yako, pamoja na msingi wa kiwango cha mrabaha na tozo nyingine. Jina la refinery pekee halithibitishi kiwango kinachotumika. Omba hesabu ya uzito, usafi, uthamini, makato na muda wa malipo ili kulinganisha salio halisi na njia nyingine ya mauzo."
      },
      {
        "q": "Nilinganisheje mapendekezo mawili ya bei za dhahabu Mwanza?",
        "a": "Ziwe kwenye msingi uleule wa uzito na usafi wa mzigo. Kisha linganisha assay, uthamini, makato, gharama za mnunuzi na tukio linaloanzisha malipo. Bei kubwa kwa gramu inaweza kutoa salio dogo au malipo ya baadaye, hivyo omba hesabu iliyoandikwa kwa kila pendekezo la bei kabla ya kuamua."
      }
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
      {
        "q": "Nithibitisheje mahali pa kuuza dhahabu Songwe?",
        "a": "Uliza Afisa Madini Mkazi au Tume kuhusu soko au kituo kilichoidhinishwa kinachohudumia eneo lako, ikiwemo taarifa za sasa za Mkwajuni na Saza. Thibitisha leseni ya mnunuzi na nyaraka za mzigo kabla ya safari. Orodha ya eneo haithibitishi kuwa kila mnunuzi anayepatikana hapo ameruhusiwa kufanya mauzo yako."
      },
      {
        "q": "Taarifa ya kugawiwa leseni Saza inathibitisha haki ya mzigo yangu?",
        "a": "Taarifa ya kihistoria inaeleza tukio la eneo, lakini mzigo yako inahitaji kumbukumbu zake za chanzo halali na haki au leseni inayohusika. Thibitisha mwenye leseni, eneo, uhalali na shughuli inayoruhusiwa kwa Tume. Usitumie tangazo la jumla kama mbadala wa nyaraka za dhahabu unayotaka kuuza."
      },
      {
        "q": "Ninawezaje kuunganisha majaribio ya recovery na mpango wa mauzo?",
        "a": "Pima malighafi na mabaki kwa namna inayowakilisha uzalishaji, kisha hesabu bidhaa ya mwisho inayoweza kupatikana na kulipwa. Linganisha thamani hiyo baada ya makato na gharama za uchakataji na malipo. Concentrate au kaboni yenye dhahabu bado si fedha zilizopatikana mpaka njia ya recovery na malipo ikamilike."
      }
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
      {
        "q": "Nipateje taarifa za sasa za masoko yanayohudumia Mpanda na Karema?",
        "a": "Wasiliana na Afisa Madini Mkazi Katavi au Tume ya Madini kuhusu soko na vituo vinavyopokea mzigo kutoka eneo lako. Thibitisha mahali, saa za kazi, leseni ya mnunuzi na nyaraka. Panga safari kwa taarifa hizo za sasa badala ya kuchukulia orodha ya mwongozo kuwa ratiba ya huduma."
      },
      {
        "q": "Takwimu za recovery za plant nyingine zinaonyesha kiasi nitakachouza?",
        "a": "Takwimu hizo zinahusu sampuli na hali za utafiti husika. Malighafi yako inahitaji uchukuaji wa sampuli na majaribio yanayoonyesha maandalizi, namna suluhisho linavyopita kwenye vat na bidhaa ya mwisho. Tumia hesabu inayofuatilia dhahabu inayoingia na kutoka kwenye plant yako kutambua upotevu kabla ya kupanga mauzo kwa asilimia iliyopimwa kwenye eneo jingine."
      },
      {
        "q": "Nihesabuje kama kuboresha recovery kutaongeza fedha zinazobaki?",
        "a": "Linganisha dhahabu ya ziada inayoweza kulipwa baada ya makato na gharama za ziada za vifaa, umeme, kemikali, wafanyakazi, mabaki na mtaji unaofungwa. Muda wa kupata bidhaa na malipo nao uwe kwenye hesabu. Recovery kubwa inaweza kuwa faida ya kiufundi bila kuhalalisha uwekezaji kwa mzigo na ratiba yako."
      }
    ],
  },
]

export const MARKET_BY_SLUG = new Map(MARKETS.map(m => [m.slug, m]))
