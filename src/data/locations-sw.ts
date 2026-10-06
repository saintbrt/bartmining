/**
 * Swahili district pages (/insights-swahili/vifaa-vya-uchimbaji/[town]).
 *
 * Swahili counterparts of selected /equipment/supply/[city] pages, paired by
 * hreflang. The equipment list is taken from the English entry's `buys` so
 * the two pages never disagree about what a district buys. Wording is
 * written for Swahili readers, not translated line by line.
 *
 * NOTE FOR REVIEW: native Swahili review before shipping.
 */

export interface LocationSw {
  /** Same slug as the English location. */
  slug: string
  town: string
  region: string
  title: string
  description: string
  summary: string
  jiolojia: string
  usafirishaji: string[]
  manunuzi: string
  faqs: { q: string; a: string }[]
}

export const LOCATIONS_SW: LocationSw[] = [
  {
    slug: 'geita',
    town: 'Geita',
    region: 'Mkoa wa Geita',
    title: 'Vifaa vya Uchimbaji Madini Geita',
    description:
      'Vifaa vya uchimbaji Geita: mashine za kuponda na kusaga mawe, concentrator, matanki ya CIP na pampu kwa wachimbaji wa Nyarugusu, Mgusu, Rwamgasa na Katente.',
    summary:
      'Geita ndiyo yenye shughuli nyingi zaidi za dhahabu Tanzania. Kuna Mgodi wa Dhahabu wa Geita, mmoja wa mikubwa Afrika, na maelfu ya wachimbaji wadogo wanaofanya kazi kwenye ukanda ule ule wa mawe ya dhahabu. Soko la kwanza la madini nchini lilifunguliwa hapa mwaka 2019.',
    jiolojia:
      'Dhahabu ya Geita iko kwenye ukanda wa mawe wa Sukumaland, hasa ndani ya mawe ya chuma yenye mikanda (BIF) na maeneo yaliyopasuka. Mawe haya ni magumu na huchakaza mashine haraka, hivyo ubora wa mashine ya kuponda, liners za kinu na mipira ya chuma ni muhimu zaidi hapa kuliko maeneo yenye mawe laini.',
    usafirishaji: [
      'Takribani kilomita 1,250 kutoka Dar es Salaam, kwa kawaida kupitia Mwanza',
      'Karibu kilomita 120 kutoka Mwanza; mizigo mizito huvuka Ghuba ya Mwanza, hivyo panga mapema',
      'Umeme wa TANESCO upo kwenye miji mikuu; maeneo ya nje hutumia jenereta',
    ],
    manunuzi:
      'Mawe magumu au yanayokwaruza yanahitaji uchaguzi wa crusher, kinu na vipuri unaotegemea majaribio na ulaini unaolengwa. Ikiwa unafikiria kuongeza uchenjuaji, pima dhahabu ya ziada inayoweza kupatikana na linganisha gharama za mfumo mzima. Maudhui ya sampuli au idadi ya plant za karibu haithibitishi kuwa matanki yanafaa kwa mradi wako.',
    faqs: [
      {
        "q": "Kwa nini crusher na kinu vinaweza kuchakaa haraka kwenye eneo langu?",
        "a": "Mawe magumu au yanayokwaruza yanaweza kuongeza uchakavu, lakini kasi yake hutegemea pia kazi na hali ya mashine. Pima mawe yanayowakilisha malighafi yako na kagua kumbukumbu za vipuri kabla ya kuchagua liners au meno mapya. Linganisha matumizi ya vipuri na tani pamoja na saa za kazi, badala ya kutumia kiwango kimoja kwa Geita nzima."
      },
      {
        "q": "Nitajua vipi kama kuongeza CIP au CIL kunafaa kwenye plant yangu?",
        "a": "Pima malighafi na mabaki ya hatua ya gravity, kisha linganisha thamani ya dhahabu ya ziada inayoweza kulipwa na gharama za mfumo mzima. Hesabu maji, umeme, wafanyakazi, mabaki, vibali na njia ya kupata dhahabu kutoka kwenye kaboni. Assay ya mabaki pekee haithibitishi kuwa kuongeza matanki kutalipa."
      },
      {
        "q": "Nithibitishe nini kabla ya kuuza dhahabu Geita?",
        "a": "Wasiliana na Tume ya Madini au Afisa Madini Mkazi kuhusu njia ya mauzo iliyoidhinishwa na leseni ya mnunuzi. Omba maelezo ya nyaraka zinazohusika, upimaji, makato na muda wa malipo. Hifadhi kumbukumbu za mzigo na stakabadhi; bei elekezi haithibitishi kiasi kitakacholipwa kwa dhahabu yako."
      }
    ],
  },
  {
    slug: 'kahama',
    town: 'Kahama',
    region: 'Mkoa wa Shinyanga',
    title: 'Vifaa vya Uchimbaji Madini Kahama',
    description:
      'Vifaa vya uchimbaji madini Kahama na Msalala: winchi, hoist, feni za hewa, pampu za kutoa maji, vipima gesi na vifaa vya usalama kwa mashimo marefu.',
    summary:
      'Kahama ni kitovu cha uchimbaji wa chini ya ardhi katika Kanda ya Ziwa. Mgodi wa Bulyanhulu uko wilayani Msalala, na wachimbaji wadogo wa eneo hili huchimba mashimo marefu kuliko maeneo mengi. Kahama pia ina usafiri bora zaidi kwa sababu iko kwenye Ukanda wa Kati karibu na bandari kavu ya Isaka.',
    jiolojia:
      'Kahama iko kusini mwa ukanda wa Sukumaland. Dhahabu yake iko zaidi kwenye mifumo ya ndani inayofuata mipasuko ya miamba, badala ya mawe ya juu kama ilivyo Mwanza. Ndiyo sababu uchimbaji wa chini ya ardhi unatawala, na vifaa vinavyohitajika ni tofauti na maeneo mengine.',
    usafirishaji: [
      'Takribani kilomita 1,000 kutoka Dar es Salaam kwenye Ukanda wa Kati, umbali mfupi kuliko Mwanza au Geita',
      'Bandari kavu ya Isaka iko karibu kilomita 60; makontena yanaweza kusafirishwa kwa reli hadi Isaka',
      'Malori ya mizigo yanapatikana kwa urahisi kwa sababu Kahama iko njia kuu ya kwenda Rwanda na Burundi',
    ],
    manunuzi:
      'Kahama ndiyo eneo pekee katika Kanda ya Ziwa ambapo vifaa vya chini ya ardhi vinaongoza. Mashimo marefu yanahitaji hoist badala ya winchi ndogo, feni za kuingiza hewa, pampu za kutoa maji kwa hatua, vipima gesi na vifaa vya kujiokoa. Vifaa vya shimo fupi la Mwanza mara nyingi si salama hapa.',
    faqs: [
      {
        "q": "Nilinganisheje usafiri kupitia Isaka na lori la moja kwa moja?",
        "a": "Omba bei kwa mzigo na eneo lilelile, zikionyesha huduma ya reli inayopatikana, kushughulikia mzigo, kutoa mzigo na lori la mwisho hadi eneo lako. Linganisha pia muda na majukumu ya kila upande. Ukaribu wa Isaka hauhakikishi kuwa kila mzigo utakuwa nafuu au utafika haraka zaidi kupitia huko."
      },
      {
        "q": "Kuwa na kipima gesi kunatosha kuthibitisha usalama wa shimo?",
        "a": "Kifaa lazima kifae hatari zilizotathminiwa na kitumike pamoja na ukaguzi na utunzaji wake. Vipimo havichukui nafasi ya mfumo wa hewa wala havitoi ruhusa ya kushuka. Mtaalamu anayewajibika aweke maeneo ya kupima, masharti ya kazi na hatua za kuchukua kifaa kikitoa tahadhari au hewa ikikatika."
      },
      {
        "q": "Nithibitisheje mahali pa kuuza dhahabu Kahama?",
        "a": "Pata taarifa za sasa kutoka kwa Afisa Madini Mkazi au Tume kuhusu soko au kituo kilichoidhinishwa na mnunuzi mwenye leseni inayofaa. Uliza nyaraka zinazohusika na namna uzito, usafi, makato na malipo yatakavyorekodiwa. Thibitisha utaratibu huo kabla ya kupeleka dhahabu, badala ya kutegemea jina la eneo pekee."
      }
    ],
  },
  {
    slug: 'chunya',
    town: 'Chunya',
    region: 'Mkoa wa Mbeya',
    title: 'Vifaa vya Uchimbaji Madini Chunya',
    description:
      'Vifaa vya uchimbaji Chunya, Makongolosi na Matundasi: matanki ya CIP, plant za elution, ball mill, concentrator na jenereta kwa uwanja wa dhahabu wa Lupa.',
    summary:
      'Chunya ni kitovu cha uwanja wa dhahabu wa Lupa, mojawapo ya maeneo ya zamani zaidi ya dhahabu Tanzania. Wachimbaji wadogo wa Makongolosi, Matundasi na Itumbi wanaendesha plant kamili zenye mashine za kuponda, kusaga, concentrator, matanki ya CIP na elution. Chunya ilikuwa soko la pili la madini kufunguliwa nchini.',
    jiolojia:
      'Uwanja wa Lupa una dhahabu kwenye mipasuko ya miamba na mishipa ya quartz, pamoja na dhahabu ya mchanga iliyotokana nayo. Kwa marudio ya zamani, chunguza chanzo, historia ya uchakataji na uchafuzi pamoja na maudhui ya dhahabu. Mabaki yenye zebaki yasichukuliwe kama malighafi ya kawaida ya sianidi; mtaalamu aweke njia inayofaa kabla ya kupanga uchenjuaji.',
    usafirishaji: [
      'Takribani kilomita 830 kutoka Dar es Salaam hadi Mbeya kwa barabara kuu ya TANZAM, kisha kaskazini hadi Chunya na Makongolosi',
      'Reli ya TAZARA inafika Mbeya, inayofaa kwa mizigo mizito kama vipande vya matanki',
      'Wakati wa mvua barabara za maeneo ya ndani huwa ngumu; panga mizigo mizito wakati wa kiangazi',
      'Maeneo mengi ya plant hutumia jenereta kwa sababu umeme hauaminiki nje ya miji',
    ],
    manunuzi:
      'Mwenye plant ya kusaga na gravity athibitishe kazi inayokwama kabla ya kununua mfumo wa uchenjuaji. Pima malighafi na mabaki, kisha linganisha njia ya kupata bidhaa ya mwisho pamoja na gharama, maji, umeme na utunzaji wa mabaki. Upanuzi utegemee majibu ya majaribio na miundombinu inayohitajika, badala ya kuchukulia matanki kuwa hatua ya lazima kwa kila plant.',
    faqs: [
      {
        "q": "Nipange nini ili vifaa vifike kwenye eneo la plant Chunya?",
        "a": "Tuma eneo halisi, ukubwa na uzito wa mzigo, pamoja na hali ya barabara ya mwisho na sehemu ya kushushia vifaa. Linganisha njia zinazopatikana na majukumu ya kushughulikia mzigo hadi eneo lako. Wakati wa mvua, thibitisha hali ya njia ya kufikia eneo kabla ya kukubaliana tarehe ya kufikisha vifaa vizito."
      },
      {
        "q": "Nianze na nini kabla ya kuongeza uchenjuaji kwenye plant yangu?",
        "a": "Pima malighafi, mabaki na historia ya uchakataji wake, kisha mtaalamu atathmini mfumo mzima unaopendekezwa. Mabaki yenye zebaki yasichukuliwe kama malighafi ya kawaida ya sianidi. Wigo uonyeshe maandalizi, kuyeyusha dhahabu, kuishika na kuitoa kwenye kaboni, maji, umeme na mabaki, pamoja na vibali na majukumu ya kuendesha."
      },
      {
        "q": "Nipangeje mauzo ya dhahabu Chunya?",
        "a": "Thibitisha njia ya mauzo na leseni ya mnunuzi kwa Tume ya Madini au Afisa Madini Mkazi. Pata orodha ya nyaraka kwa aina yako ya shughuli na kubaliana upimaji, makato na muda wa malipo. Hifadhi ushahidi wa chanzo cha mzigo, assay na stakabadhi ili hesabu ya mauzo iweze kufuatiliwa."
      }
    ],
  },
  {
    slug: 'mwanza',
    town: 'Mwanza',
    region: 'Mkoa wa Mwanza',
    title: 'Vifaa vya Uchimbaji Madini Mwanza',
    description:
      'Vifaa vya uchimbaji Mwanza: winchi, pampu za maji, concentrator, meza za kutingisha na mashine za kusaga kwa wachimbaji wa Sengerema, Misungwi na Kwimba.',
    summary:
      'Mwanza ni kituo kikuu cha biashara cha Kanda ya Ziwa na mahali ambapo vifaa vingi vya migodi hukusanywa, kutolewa na kutengenezwa kabla ya kwenda Sengerema, Misungwi, Buchosa, Kwimba na Magu. Kama mji wa pili kwa ukubwa nchini, una karakana, mafundi na huduma za usafirishaji ambazo wilaya za pembezoni hazina.',
    jiolojia:
      'Mwanza iko kwenye ukanda wa mawe wa Sukumaland. Dhahabu iko hasa ndani ya mawe ya chuma yenye mikanda (BIF) na mishipa ya quartz inayokata miamba. Wachimbaji wengi wa Sengerema, Misungwi na Buchosa huchimba mashimo mafupi na njia za pembeni zinazofuata mishipa hiyo, jambo linaloamua aina ya vifaa wanavyohitaji.',
    usafirishaji: [
      'Usafiri wa barabara kutoka Dar es Salaam unahitaji njia na ratiba ya mzigo husika, pamoja na kutoa mzigo na kufikisha kwenye eneo halisi',
      'Reli ya Kati kupitia tawi la Tabora hadi Mwanza inafaa kwa mizigo mizito isiyo ya haraka',
      'Meli za Ziwa Victoria hufika Ukerewe, visiwa vingine na wilaya za pwani ya ziwa',
      'Uwanja wa ndege wa Mwanza kwa vipuri vya dharura',
    ],
    manunuzi:
      'Wachimbaji wa Mwanza hununua zaidi plant ndogo za concentrator na vifaa vya mashimo kuliko plant kubwa. Mahitaji yanayojirudia ni winchi za tani moja na mbili, pampu za kutoa maji mashimoni wakati wa mvua, na concentrator na meza za kutingisha zinazochukua nafasi ya zebaki.',
    faqs: [
      {
        "q": "Vifaa vinachukua muda gani kufika kwenye eneo langu Mwanza?",
        "a": "Omba ratiba ya mzigo wako inayoonyesha kutoa mzigo bandarini ikiwa kunahusika, usafiri na kufikisha kwenye eneo la plant. Ukubwa wa mzigo, upatikanaji wa lori, mvua na maandalizi ya kushusha vinaweza kubadilisha muda. Tarehe ya ufungaji itegemee hatua hizo zilizothibitishwa, badala ya idadi ya jumla ya siku za safari."
      },
      {
        "q": "Vifaa vinaweza kufikishwa visiwani au kwenye maeneo ya ziwa?",
        "a": "Usafiri wa ziwa unaweza kuwa chaguo ikiwa huduma inayofaa mzigo na eneo inapatikana. Thibitisha meli, kikomo cha mzigo, ratiba na vifaa vya kupakia na kushusha, pamoja na safari ya mwisho hadi plant. Linganisha wigo huo na njia nyingine; usichukulie kila safari ya ziwa kuwa nafuu zaidi."
      },
      {
        "q": "Nianze na vifaa gani kwenye mgodi mdogo Mwanza?",
        "a": "Anza na kazi inayokwama kwenye mgodi na majaribio ya malighafi. Kuponda, kusaga na kutenganisha kwa gravity kunaweza kufaa kwa dhahabu huru, lakini kupandisha mzigo, maji na usalama vinahitaji tathmini zake. Panga pia kusafisha concentrate na kupata bidhaa ya mwisho; concentrator pekee haithibitishi njia kamili bila zebaki."
      }
    ],
  },
  {
    slug: 'tarime',
    town: 'Tarime',
    region: 'Mkoa wa Mara',
    title: 'Vifaa vya Uchimbaji Madini Tarime na Nyamongo',
    description:
      'Vifaa vya uchimbaji madini Tarime na Nyamongo: mashine za kuponda na kusaga, concentrator, meza za kutingisha na pampu kwa vikundi vipya vya wachimbaji wadogo.',
    summary:
      'Wilaya ya Tarime ina Mgodi wa Dhahabu wa North Mara na eneo la Nyamongo, maarufu kwa wachimbaji wadogo tangu miaka ya 1970. Mwaka 2025 Serikali, kwa kushirikiana na mwendeshaji wa mgodi, ilitoa leseni rasmi kwa takribani wachimbaji wadogo 2,000 katika vikundi 48 vya vijana kuzunguka Nyamongo, na wengi wao wanahitaji vifaa vyao vya kwanza.',
    jiolojia:
      'Tarime iko kwenye ukanda wa mawe wa Mara. Mgodi wa North Mara unachimba mashapo ya Gokona chini ya ardhi na Nyabirama kwa shimo la wazi. Wachimbaji wadogo wa Nyamongo hufuata miamba ile ile yenye dhahabu, na eneo lina historia ndefu ya mashimo madogo, zebaki na, hivi karibuni, kuchenjua marudio.',
    usafirishaji: [
      'Takribani kilomita 1,400 hadi 1,500 kutoka Dar es Salaam, kwa kawaida kupitia Mwanza na Musoma',
      'Tarime iko karibu na mpaka wa Kenya Sirari, hivyo baadhi ya mizigo hupimwa bei kupitia bandari ya Mombasa',
      'Meli za Ziwa Victoria hadi Musoma kwa mizigo mizito isiyo ya haraka',
      'Maeneo mengi madogo ya Nyamongo hutumia jenereta',
    ],
    manunuzi:
      'Vikundi vipya vya Nyamongo vinanunua plant za kwanza, si kuboresha. Hii inamaanisha seti kamili rahisi za concentrator zinazolingana na uzalishaji wa kikundi: mashine ya kuponda, kinu cha kusaga, concentrator na meza ya kutingisha, pamoja na pampu na vifaa vya usalama. Kuanza bila zebaki ni rahisi kuliko kubadilisha baadaye.',
    faqs: [
      {
        "q": "Kikundi kipya cha Nyamongo kichague vifaa kwa msingi gani?",
        "a": "Fafanua malighafi, tani zinazoweza kutolewa kwa muda endelevu, saa za kazi, maji na umeme kabla ya kuagiza. Majaribio yanaweza kuunga mkono mfumo wa gravity kwa dhahabu huru, pamoja na njia ya kusafisha concentrate. Vifaa vya shimo na usalama vitathminiwe kando, na upanuzi wa uchenjuaji utegemee ushahidi na bajeti yake."
      },
      {
        "q": "Plant moja inaweza kuhudumia wenye leseni kadhaa?",
        "a": "Inaweza kufaa baada ya kuthibitisha ruhusa zinazohusika na makubaliano ya maandishi. Eleza utunzaji, uzito, sampuli, gharama, ratiba na malipo ya kila mzigo kando. Kumbukumbu hizo husaidia kuzuia migogoro, lakini makubaliano pekee hayathibitishi kuwa shughuli ya kuchakata iliyoratibiwa imeidhinishwa."
      },
      {
        "q": "Ni nafuu kuleta vifaa Tarime kupitia Mombasa?",
        "a": "Linganisha bei za sasa kwa mzigo huo huo kupitia Mombasa na Dar es Salaam. Jumuisha gharama za bandari, transit, nyaraka za mpaka, lori, kushusha na kufikisha kwenye eneo lako. Njia yenye umbali mfupi kwenye ramani si lazima iwe na gharama ndogo au muda mfupi wa kufikisha."
      }
    ],
  },
  {
    slug: 'shinyanga',
    town: 'Shinyanga',
    region: 'Mkoa wa Shinyanga',
    title: 'Vifaa vya Uchimbaji Madini Shinyanga',
    description:
      'Vifaa vya uchimbaji Shinyanga na Mwakitolyo: kinu cha kusaga, concentrator, meza za kutingisha, winchi, pampu na jenereta kwa wachimbaji wadogo wa dhahabu.',
    summary:
      'Mkoa wa Shinyanga una almasi ya Mwadui na sekta hai ya wachimbaji wadogo wa dhahabu kuzunguka Mwakitolyo na wilaya za vijijini. Serikali imetangaza kujenga Kituo cha Kuchakata Madini Mwakitolyo ili kuongeza thamani ya madini na ushiriki wa wananchi, jambo linaloonyesha umuhimu wa dhahabu kwa mkoa huu.',
    jiolojia:
      'Shinyanga iko kusini mwa ukanda wa Sukumaland, ambapo dhahabu iko kwenye mishipa ya quartz na maeneo yaliyopasuka yanayochimbwa kwa mashimo mafupi na ya kati, hasa Mwakitolyo. Mkoa pia una mgodi wa almasi wa Williamson huko Mwadui, wilayani Kishapu. Huduma yetu mkoani inalenga wachimbaji wa dhahabu.',
    usafirishaji: [
      'Takribani kilomita 1,000 kutoka Dar es Salaam kupitia Dodoma, Singida na Nzega',
      'Reli ya Kati kuelekea Mwanza inapita Shinyanga, na bandari kavu ya Isaka iko mkoani',
      'Karibu na Kahama na Mwanza kwa karakana na usafirishaji',
      'Maeneo mengi ya migodi vijijini hutumia jenereta',
    ],
    manunuzi:
      'Wachimbaji wa dhahabu Shinyanga huchimba zaidi mishipa kwa mashimo mafupi na ya kati, hivyo manunuzi yanayojirudia ni winchi na pampu za kutoa maji, pamoja na seti ndogo za kusaga na concentrator. Kwa kuwa maeneo mengi hayana umeme wa gridi, jenereta sahihi mara nyingi hununuliwa pamoja na kinu.',
    faqs: [
      {
        "q": "Naweza kutegemea kituo cha Mwakitolyo kwenye mpango wangu wa uzalishaji?",
        "a": "Thibitisha hali ya sasa ya kituo, huduma, aina ya malighafi inayopokelewa, gharama na uwezo unaopatikana kwa mwendeshaji na mamlaka husika. Tangazo la kujenga kituo halithibitishi kuwa huduma itapatikana kwenye tarehe zako. Tumia wigo uliothibitishwa kulinganisha huduma hiyo na mahitaji ya plant yako."
      },
      {
        "q": "Mnauza vifaa maalumu vya kutenganisha almasi?",
        "a": "Katalogi yetu kwa eneo hili inalenga uchakataji wa dhahabu, kupandisha mzigo na pampu. Mfumo wa kupata almasi unahitaji tathmini na vifaa vya mtaalamu kulingana na malighafi na njia ya recovery. Jadili wigo huo na msambazaji wa uchakataji wa almasi badala ya kuchukulia plant ya dhahabu kuwa mbadala unaofaa."
      },
      {
        "q": "Nitumie taarifa gani kuchagua jenereta kwa kinu kidogo?",
        "a": "Tuma orodha ya mizigo yote ya umeme, mpangilio wa kuendesha na kuwasha mota, mfumo wa starter na hali ya eneo. Mtaalamu wa umeme ahakiki mahitaji ya kuwasha na kuendesha dhidi ya ukadiriaji wa uwezo ya jenereta inayopendekezwa. Kipimo cha mota kubwa pekee hakithibitishi kuwa plant nzima itapata umeme wa kutosha."
      }
    ],
  },
]

export const LOCATIONS_SW_BY_SLUG = new Map(LOCATIONS_SW.map(l => [l.slug, l]))
