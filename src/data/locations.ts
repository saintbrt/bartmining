/**
 * District supply pages.
 *
 * These exist to rank for "mining equipment <city>" queries, which is a
 * legitimate local-search intent. They are NOT doorway pages: Google
 * penalises near-identical pages that only swap a place name, so each entry
 * below must carry substance that is true of that district and false of the
 * others. If a new district cannot be given its own geology, operators,
 * logistics reality and buying pattern, it should not get a page.
 */

export interface LocationFaq { q: string; a: string }

export interface Location {
  slug: string
  city: string
  region: string
  title: string
  description: string
  /** Answer-first lede, written to stand alone if lifted by a crawler. */
  summary: string
  /** Distance and route from the port of entry. */
  logistics: string[]
  /** What makes the local geology and mining sector distinctive. */
  geology: string
  /** Named operations and operators in the district. */
  operators: string[]
  /** Equipment this district actually buys, as slugs into the catalogue. */
  buys: string[]
  /** Why buying pattern differs here. */
  buysNote: string
  faqs: LocationFaq[]
  updated: string
}

const UPDATED = '2026-08-10'

export const LOCATIONS: Location[] = [
  {
    slug: 'mwanza',
    city: 'Mwanza',
    region: 'Mwanza Region',
    title: 'Mining Equipment Supply in Mwanza, Tanzania',
    description:
      'Mining equipment supplied to Mwanza and the surrounding Sukumaland goldfields: gravity plants, mills, crushers, pumps, winches and safety equipment, delivered from Dar es Salaam.',
    summary:
      'Mwanza is the commercial base of the Lake Victoria Goldfields and the natural staging point for equipment reaching Sengerema, Misungwi, Buchosa, Kwimba and Magu. As Tanzania’s second city it has the workshops, freight handling and skilled trades that outlying districts do not, which is why most equipment bound for the goldfields is consolidated, cleared or repaired here before it moves on.',
    logistics: [
      'Roughly 1,150 km by road from the port of Dar es Salaam, typically three to four days for a standard truck',
      'Served by the Central Line railway via the Tabora to Mwanza branch, which suits heavy or non-urgent consignments',
      'Lake Victoria shipping reaches Bukoba, Musoma and the islands, and is often the practical route to lakeshore sites',
      'Mwanza Airport handles urgent spares and instrument shipments',
      'Grid connected, though sites outside town should still plan standby generation',
    ],
    geology:
      'Mwanza sits on the Sukumaland greenstone belt, a Late Archaean terrane of the Tanzania Craton. Gold is hosted principally in banded iron formation and in shear-zone quartz vein arrays cutting granitoid and volcaniclastic rocks. Workings across Sengerema, Misungwi and Buchosa are typically shallow shaft and adit operations following vein and BIF horizons, which shapes what equipment the district needs.',
    operators: [
      'A dense small-scale and artisanal sector across Sengerema, Misungwi, Buchosa and Kwimba',
      'Numerous licensed small mines working shaft and adit operations on vein and BIF-hosted gold',
      'Regional workshops, fabricators and freight operators serving the wider goldfield',
    ],
    buys: ['centrifugal-gold-concentrator', 'shaking-table-gold', 'ball-mill-gold-ore', '1-ton-winch', 'submersible-dewatering-pump', 'mining-safety-helmet-cap-lamp'],
    buysNote:
      'Mwanza buying is dominated by small gravity plants and shaft equipment rather than large process trains. Because most operations here work shallow shafts on vein and BIF gold, the recurring purchases are one and two tonne winches, dewatering pumps for shafts that flood in the wet season, and gravity recovery equipment that replaces mercury amalgamation.',
    faqs: [
      { q: 'How long does delivery to Mwanza take from Dar es Salaam?', a: 'Three to four days by road for a standard truck once the consignment has cleared the port, over roughly 1,150 km. Clearance at Dar is usually the longer and less predictable part of the journey, so plan the schedule around clearance rather than around the road leg.' },
      { q: 'Can equipment be delivered to islands and lakeshore sites?', a: 'Yes. Lake Victoria shipping from Mwanza reaches Ukerewe, the smaller islands and the lakeshore districts, and is frequently cheaper and easier than road for those destinations. It needs more lead time and the consignment must be packed for handling at both ends.' },
      { q: 'What equipment do small mines around Mwanza usually need first?', a: 'A gravity circuit and a shaft winch, in that order of impact. A centrifugal concentrator with a shaking table removes any need for mercury and usually recovers more gold than amalgamation did. A correctly rated winch and a dewatering pump then address the two things that most often stop production on a shallow shaft.' },
      { q: 'Is there support for repairs and spares in Mwanza?', a: 'Mwanza has the deepest concentration of workshops, fabricators and trades in the goldfields, which is a genuine advantage over siting equipment further out. We hold this in mind when specifying: equipment that can be serviced locally is worth more than marginally better equipment that cannot.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'geita',
    city: 'Geita',
    region: 'Geita Region',
    title: 'Mining Equipment Supply in Geita, Tanzania',
    description:
      'Mining equipment supplied to Geita: gravity recovery plants, crushers, mills, pumps and safety equipment for small-scale operations alongside Tanzania’s largest gold mine.',
    summary:
      'Geita has the highest concentration of gold mining activity in Tanzania, anchored by Geita Gold Mine, one of the largest gold operations in Africa, and surrounded by an unusually dense small-scale sector working the same greenstone belt. That combination gives the district a two-tier equipment market: contractor and consumable supply serving a major operation, and complete small plants serving licensed small mines nearby.',
    logistics: [
      'Roughly 1,250 km by road from Dar es Salaam, commonly routed through Mwanza',
      'About 120 km from Mwanza, so most consignments stage through Mwanza rather than travelling direct',
      'Road access from Mwanza involves crossing the Mwanza Gulf, which should be factored into scheduling for abnormal loads',
      'Grid connected in the main centres, with standby generation normal on outlying sites',
      'Water is generally available, which widens the plant options compared with drier districts',
    ],
    geology:
      'Geita lies on the Sukumaland greenstone belt, with gold hosted principally in banded iron formation and in structurally controlled zones cutting the BIF and adjacent intrusives. The Geita goldfield hosts several orebodies including Nyankanga, Geita Hill, Lone Cone and Star and Comet. The strength of the BIF-hosted signature is why magnetic surveying works so well in this district and why ore here tends to be competent and abrasive, which in turn drives comminution equipment selection.',
    operators: [
      'Geita Gold Mine, operated by AngloGold Ashanti, one of the largest gold mines in Africa',
      'A large licensed small-scale sector working the same belt on adjacent ground',
      'Contractors, drilling companies and service providers based around the mine',
    ],
    buys: ['jaw-crusher', 'ball-mill-gold-ore', 'cil-cip-plant', 'centrifugal-gold-concentrator', 'modular-gold-plant', 'slurry-pump'],
    buysNote:
      'Geita ore is competent and abrasive, so comminution specification matters more here than in districts working softer oxide material. Undersized crushers and thin mill liners fail quickly on this ore. The district also has enough grade and tonnage in places to justify leach circuits, so Geita sees more CIL enquiries than anywhere else we supply.',
    faqs: [
      { q: 'Why does equipment wear out faster in Geita?', a: 'The banded iron formation hosted ore in this belt is competent and abrasive. Jaw plates, mill liners and slurry pump wet ends all wear faster here than on softer oxide ore at the same tonnage. Specify manganese content on jaw plates and high-chrome or composite mill liners, and budget wear parts per tonne rather than per month.' },
      { q: 'Is a CIL plant justified for a small mine near Geita?', a: 'Sometimes, and more often here than elsewhere in Tanzania, because grades in parts of the district support it. The test is whether the gold left in your gravity tailings pays for the leach circuit plus its compliance and labour overhead. Assay the gravity tailings before deciding, because on many operations gravity alone remains the better answer.' },
      { q: 'How is equipment delivered to Geita?', a: 'Almost always through Dar es Salaam then by road via Mwanza, roughly 1,250 km in total. Abnormal loads need the Mwanza Gulf crossing planned in advance, along with route permits, so allow substantially more lead time for anything oversized such as a mill shell or an assembled tank.' },
      { q: 'Does geophysics work well in the Geita area?', a: 'Magnetic surveying is particularly effective across this belt because the banded iron formation that hosts much of the gold is strongly magnetic, so the stratigraphy and the structures cutting it map clearly. Magnetics does not detect gold itself, but in this district it is an unusually good guide to where to drill.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'kahama',
    city: 'Kahama',
    region: 'Shinyanga Region',
    title: 'Mining Equipment Supply in Kahama, Tanzania',
    description:
      'Mining equipment supplied to Kahama and Msalala: underground winches, ventilation fans, dewatering pumps and safety equipment, delivered via the Central Corridor and Isaka.',
    summary:
      'Kahama is the underground mining centre of the Tanzanian goldfields and the best-connected of the three for freight, because it sits on the Central Corridor with the Isaka inland container depot nearby. Bulyanhulu, one of the country’s major underground gold mines, sits in Msalala district, and the surrounding small-scale sector works deeper shafts than is typical elsewhere in the region.',
    logistics: [
      'Roughly 1,000 km from Dar es Salaam on the Central Corridor, the shortest road leg of the three goldfield centres',
      'The Isaka inland container depot lies about 60 km away, a rail and road transhipment point on the Central Line',
      'Containers can be railed to Isaka and cleared there rather than trucked the full distance from Dar, which is worth pricing on heavy consignments',
      'On the main transit route towards Rwanda and Burundi, so haulage capacity is readily available',
      'Grid connected in town, with standby generation standard on mine sites',
    ],
    geology:
      'Kahama sits on the Sukumaland greenstone belt in the southern part of the Lake Victoria Goldfields. The district is defined by deeper, structurally controlled gold systems rather than the shallow BIF-hosted workings more typical around Mwanza, which is why underground mining dominates here and why the equipment mix differs so markedly from the rest of the goldfields.',
    operators: [
      'Bulyanhulu Gold Mine in Msalala district, an underground operation and one of Tanzania’s largest',
      'Buzwagi, near Kahama town, which has moved out of mining into closure and redevelopment',
      'A small-scale sector working deeper shafts than is typical elsewhere in the goldfields',
      'A substantial contractor and haulage base built around the Central Corridor',
    ],
    buys: ['5-ton-mine-winch', 'mine-hoist-headframe', 'mine-ventilation-fan', 'submersible-dewatering-pump', 'self-contained-self-rescuer', 'gas-detection-monitor'],
    buysNote:
      'Kahama is the one district in the goldfields where underground equipment leads the enquiry list. Deeper shafts mean hoisting rather than hand winching, forced ventilation rather than natural airflow, staged dewatering rather than a single pump, and a genuine need for gas detection and self-rescuers. Equipment specified for a shallow Mwanza shaft is frequently unsafe here.',
    faqs: [
      { q: 'What is the advantage of the Isaka dry port for equipment delivery?', a: 'Isaka is a rail and road transhipment point on the Central Line about 60 km from Kahama, so containers can move by rail from Dar es Salaam and be cleared or collected there instead of trucking the full 1,000 km. On heavy consignments this can reduce both cost and road damage risk, and it is worth pricing against straight road haulage every time.' },
      { q: 'Why is underground equipment different around Kahama?', a: 'Because the shafts are deeper. Past roughly 60 m a hand or light winch is no longer adequate and hoisting duty begins, past roughly 80 m dewatering needs staging with intermediate sumps, and once workings are deep enough that natural ventilation fails, forced ventilation and gas detection stop being optional. Specifying shallow-shaft equipment for a deep working is a common and dangerous error.' },
      { q: 'Do I need gas detection for a small underground operation?', a: 'If people go underground, yes. Oxygen deficiency, carbon monoxide after blasting and hydrogen sulphide in wet ground are all real hazards in this district, and none of them can be detected reliably without an instrument. A bump-tested four-gas monitor is among the cheapest pieces of equipment on any underground site and the one most likely to prevent a fatality.' },
      { q: 'How quickly can equipment reach Kahama?', a: 'It has the shortest road leg of the three goldfield centres at roughly 1,000 km, typically two to three days by road once cleared, and rail via Isaka is available for heavier or less urgent loads. Haulage capacity is easy to source because Kahama sits on the main transit route towards Rwanda and Burundi.' },
    ],
    updated: UPDATED,
  },
]

export const LOCATION_BY_SLUG = new Map(LOCATIONS.map(l => [l.slug, l]))
