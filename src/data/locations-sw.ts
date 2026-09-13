/**
 * Swahili district pages (/vifaa-vya-uchimbaji/[town]).
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
      'Vifaa vya uchimbaji madini Geita: mashine za kuponda na kusaga mawe, concentrator, matanki ya CIP na pampu kwa wachimbaji wa Nyarugusu, Mgusu, Rwamgasa na Katente.',
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
      'Kwa sababu mawe ni magumu, wachimbaji wa Geita hununua zaidi mashine imara za kuponda na kusaga. Madini ya kutosha katika baadhi ya maeneo yanahalalisha matanki ya CIP, hivyo Geita ina maombi mengi ya CIP kuliko eneo lolote tunalohudumia.',
    faqs: [
      { q: 'Kwa nini mashine huchakaa haraka Geita?', a: 'Mawe ya chuma yenye mikanda yanayobeba dhahabu Geita ni magumu na yanakwaruza. Meno ya jaw crusher, liners za kinu na pampu za tope huisha haraka kuliko kwenye mawe laini. Nunua vipuri vyenye chuma bora na panga bajeti ya vipuri kwa tani, si kwa mwezi.' },
      { q: 'Plant ya CIP inafaa kwa mchimbaji mdogo Geita?', a: 'Mara nyingine, na mara nyingi zaidi Geita kuliko maeneo mengine. Pima mabaki ya concentrator yako kwanza. Kama dhahabu iliyobaki inalipa gharama ya matanki, vibali na wafanyakazi, CIP inafaa; kama sivyo, concentrator pekee ni bora.' },
      { q: 'Nauza wapi dhahabu Geita?', a: 'Kwenye soko la madini Geita au vituo vya ununuzi vya Bukombe, Chato, Mbogwe na Nyang’hwale. Tazama ukurasa wa soko la madini Geita kwa bei ya leo na maelezo zaidi.' },
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
      { q: 'Bandari kavu ya Isaka inasaidiaje?', a: 'Isaka ni kituo cha reli na barabara kilomita 60 hivi kutoka Kahama. Makontena yanaweza kusafirishwa kwa reli kutoka Dar es Salaam na kuchukuliwa Isaka badala ya kusafirishwa kwa lori kilomita 1,000. Kwa mizigo mizito inaweza kupunguza gharama.' },
      { q: 'Nahitaji kipima gesi kwa shimo dogo?', a: 'Kama watu wanashuka shimoni, ndiyo. Upungufu wa oksijeni, kaboni monoksidi baada ya kulipua, na gesi nyingine hatari haziwezi kugunduliwa bila kifaa. Kipima gesi ni miongoni mwa vifaa vya bei nafuu zaidi na kinaweza kuokoa maisha.' },
      { q: 'Nauza wapi dhahabu Kahama?', a: 'Kwenye soko la madini Kahama au vituo vya ununuzi vilivyosajiliwa. Tazama ukurasa wa soko la madini Kahama kwa bei ya leo.' },
    ],
  },
  {
    slug: 'chunya',
    town: 'Chunya',
    region: 'Mkoa wa Mbeya',
    title: 'Vifaa vya Uchimbaji Madini Chunya',
    description:
      'Vifaa vya uchimbaji madini Chunya, Makongolosi na Matundasi: matanki ya CIP, plant za elution, ball mill, concentrator na jenereta kwa uwanja wa dhahabu wa Lupa.',
    summary:
      'Chunya ni kitovu cha uwanja wa dhahabu wa Lupa, mojawapo ya maeneo ya zamani zaidi ya dhahabu Tanzania. Wachimbaji wadogo wa Makongolosi, Matundasi na Itumbi wanaendesha plant kamili zenye mashine za kuponda, kusaga, concentrator, matanki ya CIP na elution. Chunya ilikuwa soko la pili la madini kufunguliwa nchini.',
    jiolojia:
      'Uwanja wa Lupa una ukubwa wa takribani kilomita za mraba 2,600. Dhahabu yake iko kwenye mipasuko ya miamba na mishipa ya quartz, pamoja na dhahabu ya mchanga iliyotokana nayo. Eneo limechimbwa tangu mwaka 1922, na miaka mingi ya kutumia zebaki imeacha marudio mengi yenye dhahabu. Ndiyo sababu uchenjuaji kwa vat na CIP umeenea sana.',
    usafirishaji: [
      'Takribani kilomita 830 kutoka Dar es Salaam hadi Mbeya kwa barabara kuu ya TANZAM, kisha kaskazini hadi Chunya na Makongolosi',
      'Reli ya TAZARA inafika Mbeya, inayofaa kwa mizigo mizito kama vipande vya matanki',
      'Wakati wa mvua barabara za maeneo ya ndani huwa ngumu; panga mizigo mizito wakati wa kiangazi',
      'Maeneo mengi ya plant hutumia jenereta kwa sababu umeme hauaminiki nje ya miji',
    ],
    manunuzi:
      'Wachimbaji wengi wa Chunya tayari wana mashine za kusaga na concentrator. Hatua inayofuata ni matanki ya kuchenjua na plant ya elution ili kuokoa dhahabu iliyobaki kwenye mabaki na marudio ya zamani. Jenereta zenye uwezo wa kuendesha kinu na mota za matanki pia zinahitajika mara kwa mara.',
    faqs: [
      { q: 'Vifaa vinafikaje Chunya?', a: 'Kwa barabara kutoka Dar es Salaam hadi Mbeya, takribani kilomita 830, kisha kaskazini hadi Chunya na Makongolosi. Mizigo mizito inaweza pia kusafirishwa kwa reli ya TAZARA hadi Mbeya. Ongeza muda wakati wa mvua.' },
      { q: 'Nianze na nini kuongeza CIP kwenye plant yangu?', a: 'Pima mawe na mabaki yako kwanza, kisha hakikisha kinu chako kinasaga laini vya kutosha. Vitu vikuu ni matanki ya kuchenjua yenye skrini, njia ya kushughulikia kaboni, na elution yako au ya pamoja. Bwawa la mabaki lenye lining na vibali vya sianidi viwe tayari kabla ya kuanza.' },
      { q: 'Nauza wapi dhahabu Chunya?', a: 'Kwenye soko la madini Chunya au vituo vya ununuzi vya Makongolosi, Matundasi, Itumbi, Sangambi, Godima, Igundu na Shoga. Tazama ukurasa wa soko la madini Chunya kwa bei ya leo.' },
    ],
  },
  {
    slug: 'mwanza',
    town: 'Mwanza',
    region: 'Mkoa wa Mwanza',
    title: 'Vifaa vya Uchimbaji Madini Mwanza',
    description:
      'Vifaa vya uchimbaji madini Mwanza: winchi, pampu za kutoa maji, concentrator, meza za kutingisha na mashine za kusaga kwa wachimbaji wa Sengerema, Misungwi, Buchosa na Kwimba.',
    summary:
      'Mwanza ni kituo kikuu cha biashara cha Kanda ya Ziwa na mahali ambapo vifaa vingi vya migodi hukusanywa, kutolewa na kutengenezwa kabla ya kwenda Sengerema, Misungwi, Buchosa, Kwimba na Magu. Kama mji wa pili kwa ukubwa nchini, una karakana, mafundi na huduma za usafirishaji ambazo wilaya za pembezoni hazina.',
    jiolojia:
      'Mwanza iko kwenye ukanda wa mawe wa Sukumaland. Dhahabu iko hasa ndani ya mawe ya chuma yenye mikanda (BIF) na mishipa ya quartz inayokata miamba. Wachimbaji wengi wa Sengerema, Misungwi na Buchosa huchimba mashimo mafupi na njia za pembeni zinazofuata mishipa hiyo, jambo linaloamua aina ya vifaa wanavyohitaji.',
    usafirishaji: [
      'Takribani kilomita 1,150 kutoka Dar es Salaam, kwa kawaida siku tatu hadi nne kwa lori',
      'Reli ya Kati kupitia tawi la Tabora hadi Mwanza inafaa kwa mizigo mizito isiyo ya haraka',
      'Meli za Ziwa Victoria hufika Ukerewe, visiwa vingine na wilaya za pwani ya ziwa',
      'Uwanja wa ndege wa Mwanza kwa vipuri vya dharura',
    ],
    manunuzi:
      'Wachimbaji wa Mwanza hununua zaidi plant ndogo za concentrator na vifaa vya mashimo kuliko plant kubwa. Mahitaji yanayojirudia ni winchi za tani moja na mbili, pampu za kutoa maji mashimoni wakati wa mvua, na concentrator na meza za kutingisha zinazochukua nafasi ya zebaki.',
    faqs: [
      { q: 'Vifaa vinachukua muda gani kufika Mwanza?', a: 'Siku tatu hadi nne kwa lori baada ya mzigo kutoka bandari ya Dar es Salaam, umbali wa takribani kilomita 1,150. Kutoa mzigo bandarini mara nyingi huchukua muda mrefu kuliko safari ya barabarani.' },
      { q: 'Vifaa vinaweza kufika visiwani?', a: 'Ndiyo. Meli za Ziwa Victoria kutoka Mwanza hufika Ukerewe na visiwa vingine, na mara nyingi ni nafuu kuliko barabara. Zinahitaji muda zaidi na mzigo ufungwe vizuri.' },
      { q: 'Nianze na vifaa gani kwenye mgodi mdogo Mwanza?', a: 'Concentrator na winchi. Concentrator pamoja na meza ya kutingisha huondoa haja ya zebaki na mara nyingi hupata dhahabu zaidi. Winchi sahihi na pampu ya kutoa maji hutatua mambo mawili yanayosimamisha uzalishaji mara nyingi kwenye shimo fupi.' },
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
      { q: 'Kikundi kipya cha Nyamongo kinunue nini kwanza?', a: 'Seti rahisi ya concentrator inayolingana na tani halisi za kikundi kwa siku: mashine ya kuponda, kinu, concentrator na meza ya kutingisha. Inapata dhahabu huru bila zebaki, ni rahisi kuendesha, na matanki ya CIP yanaweza kuongezwa baadaye.' },
      { q: 'Plant moja inaweza kuhudumia vikundi kadhaa?', a: 'Ndiyo, na Nyamongo mara nyingi inafaa. Plant ya pamoja inaepusha kila kikundi kununua kinu chake, ilimradi mawe ya kila leseni yanapimwa na kuhesabiwa kando na makubaliano yameandikwa.' },
      { q: 'Ni nafuu kuleta vifaa Tarime kupitia Mombasa?', a: 'Mara nyingine. Tarime iko karibu na mpaka wa Sirari, hivyo kwa baadhi ya mizigo njia ya Mombasa inastahili kulinganishwa na Dar es Salaam. Tunapima bei za njia zote mbili pale inapoleta tofauti.' },
    ],
  },
  {
    slug: 'shinyanga',
    town: 'Shinyanga',
    region: 'Mkoa wa Shinyanga',
    title: 'Vifaa vya Uchimbaji Madini Shinyanga',
    description:
      'Vifaa vya uchimbaji madini Shinyanga na Mwakitolyo: kinu cha kusaga, concentrator, meza za kutingisha, winchi, pampu na jenereta kwa wachimbaji wadogo wa dhahabu.',
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
      { q: 'Kituo cha Kuchakata Madini Mwakitolyo ni nini?', a: 'Ni mpango wa Serikali wa kujenga kituo cha kuchakata madini Mwakitolyo, ili kuongeza thamani ya madini hapa nchini na kujenga ujuzi kwa vijana na wanawake. Wachimbaji wa karibu wanaweza kukitumia badala ya kujenga kila hatua ya uchakataji wenyewe.' },
      { q: 'Mnauza vifaa vya kuchimba almasi?', a: 'Huduma yetu mkoani inalenga dhahabu: kusaga, concentrator, winchi na pampu. Kwa vifaa maalum vya kutenganisha almasi, wasiliana na msambazaji mtaalamu wa almasi.' },
      { q: 'Jenereta ya ukubwa gani inafaa kwa kinu kidogo?', a: 'Chagua jenereta kulingana na umeme mwingi unaovutwa na mota kubwa zaidi wakati wa kuwasha, si umeme wa kawaida wa kufanya kazi. Mota ya kinu inaweza kuvuta mara kadhaa ya umeme wake wakati wa kuwasha, na jenereta ndogo hukatika au kuharibu mota.' },
    ],
  },
]

export const LOCATIONS_SW_BY_SLUG = new Map(LOCATIONS_SW.map(l => [l.slug, l]))
