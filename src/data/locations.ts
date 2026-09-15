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
  /** Named mining areas within the district, each with a line true of that area. */
  areas?: { name: string; note: string }[]
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
      'Mining equipment for Mwanza and the Sukumaland goldfields: gravity plants, mills, crushers, pumps, winches and safety equipment, delivered from Dar es Salaam.',
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
    buys: ['centrifugal-gold-concentrator', 'shaking-table-gold', 'wet-pan-mill', '1-ton-winch', 'submersible-dewatering-pump', 'hydraulic-excavator'],
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
      'Mining equipment supplied to Geita: gravity plants, crushers, mills, pumps and safety equipment for small-scale miners beside Tanzania’s largest gold mine.',
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
    buys: ['jaw-crusher', 'cone-crusher', 'hydraulic-excavator', 'centrifugal-gold-concentrator', 'modular-gold-plant', 'dump-truck'],
    buysNote:
      'Geita ore is competent and abrasive, so comminution specification matters more here than in districts working softer oxide material. Undersized crushers and thin mill liners fail quickly on this ore. The district also has enough grade and tonnage in places to justify leach circuits, so Geita sees more CIL enquiries than anywhere else we supply.',
    areas: [
      { name: 'Nyarugusu', note: 'One of the region’s longest-worked small-scale gold areas, south of Geita town, with shaft workings and dense processing activity that make it a steady market for mills, concentrators and dewatering pumps.' },
      { name: 'Mgusu', note: 'A long-established small-scale mining settlement in Geita District, working the same greenstone belt as the major mine, where abrasive ore puts crusher and mill wear parts at the top of the buying list.' },
      { name: 'Rwamgasa (Lwamgasa)', note: 'Home to a government demonstration centre for gold processing, built to show small-scale miners improved, mercury-free recovery. Operators here are often upgrading from amalgamation to gravity and leach circuits.' },
      { name: 'Katente (Bukombe)', note: 'A small-scale mining area in Bukombe District with its own government demonstration processing centre, served by the Bukombe buying station under the Geita mineral market.' },
      { name: 'Nyang’hwale, Mbogwe and Chato', note: 'Outlying districts of Geita Region, each with a mineral buying station. Sites here are further from grid power and workshops, so generator sizing and spares holding matter more.' },
    ],
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
      'Mining equipment for Kahama and Msalala: underground winches, ventilation fans, dewatering pumps and safety equipment, delivered via Isaka.',
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
  {
    // NOTE FOR REVIEW: road distances are approximate, and the page still
    // needs Bart Mining's own work in the district (jobs supplied, delivery
    // experience) to fully meet the substance rule at the top of this file.
    slug: 'chunya',
    city: 'Chunya',
    region: 'Mbeya Region',
    title: 'Mining Equipment Supply in Chunya, Tanzania',
    description:
      'Mining equipment for Chunya, Makongolosi and the Lupa Goldfield: crushers, ball mills, concentrators, CIP tanks and elution plants, delivered via Mbeya.',
    summary:
      'Chunya is the centre of the Lupa Goldfield, one of Tanzania’s oldest gold mining districts and now one of its most active small-scale processing areas. Around Makongolosi, Matundasi and Itumbi, licensed small miners run complete processing plants with crushers, ball mills, gravity concentrators, CIP tanks and elution units, and Chunya hosts a government mineral market. It is served from Mbeya on the southern TAZARA corridor rather than through the Lake Zone.',
    logistics: [
      'Roughly 830 km by road from Dar es Salaam to Mbeya on the TANZAM highway, then north from Mbeya to Chunya and Makongolosi',
      'The only goldfield centre we supply that is reached on the southern corridor, so consignments do not route through Mwanza or Isaka',
      'The TAZARA railway reaches Mbeya, which suits heavy or non-urgent loads such as tank panels and mill shells',
      'Songwe Airport at Mbeya handles urgent spares and instruments',
      'Roads beyond the main centres become difficult in the rainy season, so heavy deliveries are best scheduled for the dry months',
      'Grid power reaches the main centres; many plant sites still rely on diesel generation',
    ],
    geology:
      'The Lupa Goldfield covers about 2,600 square kilometres of Chunya District and neighbouring Songwe, in the south-western highlands. Unlike the Archaean greenstone belts of the Lake Victoria Goldfields, Lupa gold sits in Palaeoproterozoic granitoid and metamorphic rocks, hosted mainly in shear zones and quartz veins, with alluvial and eluvial gold shed from them. The field has been worked since the gold rush of 1922, and by the late 1930s most of Tanzania’s artisanal miners worked here. Decades of amalgamation have left large volumes of tailings, which is why vat and tank leaching are so widespread in the district today.',
    operators: [
      'A large licensed small-scale sector around Makongolosi, Matundasi, Itumbi, Chokaa and Mbugani',
      'Small miners running complete plants: crushing, milling, gravity concentration, CIP and CIL tanks and elution',
      'Vat leach operators reprocessing historic amalgamation tailings',
      'New Luika Gold Mine in neighbouring Songwe Region, on the same goldfield',
      'The Chunya mineral market, part of the national network of government mineral markets',
    ],
    buys: ['leaching-tank', 'gold-elution-electrowinning-plant', 'ball-mill-gold-ore', 'centrifugal-gold-concentrator', 'jaw-crusher', 'diesel-generator-mining'],
    buysNote:
      'Chunya buys further down the flowsheet than most districts. Many operators already have crushing and gravity equipment, and the next purchase is leach tanks and an elution plant so they can recover the gold their gravity circuit and historic tailings still hold. With power unreliable away from the main centres, generators sized for mills and agitators are a recurring need.',
    faqs: [
      { q: 'How is equipment delivered to Chunya?', a: 'By road from Dar es Salaam to Mbeya on the TANZAM highway, roughly 830 km, then north to Chunya and the Makongolosi area. Heavy loads can also move by TAZARA rail to Mbeya. Allow extra time in the rainy season, when roads to outlying plant sites can become impassable for heavy trucks.' },
      { q: 'Why do so many Chunya miners run CIP tanks?', a: 'The Lupa Goldfield has been mined since the 1920s, and generations of mercury amalgamation left tailings that still hold gold. Tank and vat leaching recover that gold, and many operators also run fresh ore through a gravity circuit and then leach the tailings, which lifts overall recovery well above gravity alone.' },
      { q: 'Is there somewhere to sell gold in Chunya?', a: 'Yes. Chunya has a government mineral market, part of the national network of mineral markets and buying centres run under the Mining Commission, where licensed miners can sell gold at published indicative prices.' },
      { q: 'What should I buy first to add leaching to a gravity plant in Chunya?', a: 'Test your ore and tailings first, then check that your mill grinds fine enough for leaching. The main purchases are a train of agitated leaching tanks with interstage screens, a way to handle loaded carbon, and access to an elution plant, whether your own or a shared one. Lined tailings storage and cyanide permits must be in place before you start.' },
    ],
    updated: '2026-09-13',
  },
  {
    // NOTE FOR REVIEW: road distances approximate; add Bart Mining's own
    // work in the district before shipping, per the rule at the top.
    slug: 'tarime',
    city: 'Tarime',
    region: 'Mara Region',
    title: 'Mining Equipment Supply in Tarime and Nyamongo, Tanzania',
    description:
      'Mining equipment for Tarime, Nyamongo and the North Mara goldfield: gravity plants, ball mills, crushers, leach tanks and pumps for small-scale miners.',
    summary:
      'Tarime District in Mara Region is home to North Mara Gold Mine and to Nyamongo, one of Tanzania’s best-known small-scale gold areas since its boom of the 1970s and 1980s. In 2025 the government, working with the mine operator, formally licensed around 2,000 small-scale miners in 48 youth groups around Nyamongo, creating a large new base of legal operations that need their first equipment.',
    logistics: [
      'Roughly 1,400 to 1,500 km by road from Dar es Salaam, usually via Mwanza and Musoma',
      'Tarime sits close to the Kenyan border at Sirari, so some consignments are priced through the port of Mombasa as an alternative to Dar es Salaam',
      'Lake Victoria shipping to Musoma is an option for heavy, non-urgent loads from Mwanza',
      'Grid power reaches the main centres; many small sites around Nyamongo rely on generators',
    ],
    geology:
      'Tarime lies on the Mara greenstone belt, part of the Archaean Tanzania Craton north-east of the Lake Victoria Goldfields. North Mara works the Gokona deposit underground and the Nyabirama deposit as an open pit, feeding a plant of around 8,000 tonnes per day. Small-scale workings around Nyamongo follow the same mineralised structures, and the district has a long history of artisanal pits, amalgamation and, more recently, tailings leaching.',
    operators: [
      'North Mara Gold Mine, an open pit and underground operation near Nyamongo',
      'Around 2,000 newly licensed small-scale miners in 48 youth groups around Nyamongo',
      'Long-established artisanal and small-scale miners across Tarime District',
      'Contractors and suppliers serving the mine from Tarime town',
    ],
    buys: ['centrifugal-gold-concentrator', 'ball-mill-gold-ore', 'jaw-crusher', 'shaking-table-gold', 'submersible-dewatering-pump', 'mining-safety-helmet-cap-lamp'],
    buysNote:
      'The newly licensed groups around Nyamongo are buying first plants, not upgrades. That means complete, simple gravity circuits sized for group production: a crusher, a ball mill, a centrifugal concentrator and a shaking table, with pumps and basic safety equipment for pit and shaft work. Getting the circuit mercury-free from day one is easier than converting later.',
    faqs: [
      { q: 'Is it cheaper to deliver to Tarime through Mombasa?', a: 'Sometimes. Tarime is close to the Kenyan border at Sirari, so for some consignments the route through Mombasa is worth pricing against Dar es Salaam. The comparison depends on transit and clearance costs for that shipment, so we price both where it makes a difference.' },
      { q: 'What should a newly licensed youth group in Nyamongo buy first?', a: 'A simple gravity circuit sized to the group’s real daily tonnage: crusher, ball mill, centrifugal concentrator and shaking table. It recovers free gold without mercury, is straightforward to operate and maintain, and can be extended with leach tanks later if the tailings justify it.' },
      { q: 'Where can gold be sold in Mara Region?', a: 'Through the government mineral markets and licensed buying centres in Mara Region, which operate under the Mining Commission. Selling outside that network is illegal and risks confiscation.' },
      { q: 'Can one plant serve several small licence holders?', a: 'Yes, and around Nyamongo it often makes sense. A shared processing plant avoids each group buying its own mill, as long as the ore from each licence is weighed, sampled and accounted for separately and the arrangement is agreed in writing.' },
    ],
    updated: '2026-09-13',
  },
  {
    // NOTE FOR REVIEW: road distances approximate; add Bart Mining's own
    // work in the district before shipping, per the rule at the top.
    slug: 'shinyanga',
    city: 'Shinyanga',
    region: 'Shinyanga Region',
    title: 'Mining Equipment Supply in Shinyanga, Tanzania',
    description:
      'Mining equipment for Shinyanga and Mwakitolyo: ball mills, concentrators, shaking tables, shaft winches, pumps and generators for small-scale gold miners.',
    summary:
      'Shinyanga Region combines Tanzania’s diamond heartland at Mwadui with an active small-scale gold sector around Mwakitolyo and the rural districts west of Shinyanga town. The government has announced a Mineral Processing Center at Mwakitolyo to expand local value addition, which reflects how central small-scale gold has become to the region.',
    logistics: [
      'Roughly 1,000 km by road from Dar es Salaam via Dodoma, Singida and Nzega',
      'On the Central Line railway towards Mwanza, with the Isaka dry port in the same region',
      'Close enough to Kahama and Mwanza to draw on their workshops and freight capacity',
      'Grid connected in town; rural mining sites commonly rely on diesel generation',
    ],
    geology:
      'Shinyanga sits on the southern Sukumaland greenstone belt, where gold occurs in quartz veins and shear zones worked by small-scale shafts and pits, notably around Mwakitolyo. The region is also defined by kimberlite: the Williamson Diamond Mine at Mwadui in Kishapu District works the Mwadui pipe, the world’s largest economic kimberlite to have seen continuous mining. Our supply in the region is focused on the gold sector.',
    operators: [
      'Small-scale gold miners around Mwakitolyo and across Shinyanga Rural',
      'A planned government Mineral Processing Center at Mwakitolyo',
      'Williamson Diamond Mine at Mwadui and other diamond operations in Kishapu District',
      'Regional traders and service providers based in Shinyanga town',
    ],
    buys: ['ball-mill-gold-ore', 'centrifugal-gold-concentrator', 'shaking-table-gold', '1-ton-winch', 'submersible-dewatering-pump', 'diesel-generator-mining'],
    buysNote:
      'Shinyanga’s gold operators mostly work vein gold from shallow to medium shafts, so the recurring purchases are the shaft basics, winches and dewatering pumps, together with compact milling and gravity circuits. With many sites off-grid, a correctly sized generator is often bought with the mill rather than after it.',
    faqs: [
      { q: 'What is the Mwakitolyo Mineral Processing Center?', a: 'A government initiative announced to establish a mineral processing centre at Mwakitolyo, aimed at adding value to minerals locally and building technical skills among young people and women across the value chain. Small-scale miners nearby may be able to use it rather than building every processing step themselves.' },
      { q: 'Do you supply diamond mining equipment in Shinyanga?', a: 'Our catalogue and experience in the region are focused on gold: milling, gravity recovery, shaft and pumping equipment. For diamond recovery equipment such as dense media separation or X-ray sorting, speak to a specialist supplier.' },
      { q: 'What size generator does a small gold mill need?', a: 'Size it for the starting current of the largest motor, not just its running load, plus everything else on site. A mill motor can draw several times its rated current at start-up, which is why generators sized only on running load trip or damage the motor.' },
      { q: 'How long does delivery to Shinyanga take?', a: 'Two to three days by road for roughly 1,000 km once the consignment has cleared at Dar es Salaam. Rail on the Central Line and the Isaka dry port are alternatives for heavy loads.' },
    ],
    updated: '2026-09-13',
  },
  {
    // NOTE FOR REVIEW: road distances approximate; add Bart Mining's own
    // work in the district before shipping, per the rule at the top.
    slug: 'singida',
    city: 'Singida',
    region: 'Singida Region',
    title: 'Mining Equipment Supply in Singida, Tanzania',
    description:
      'Mining equipment for Singida, Sekenke, Iramba and Ikungi: crushers, ball mills, concentrators, compressors and generators for central Tanzania gold miners.',
    summary:
      'Singida is central Tanzania’s gold region, worked since 1909 when the Sekenke mine opened, and revived by discoveries at Londoni, Sambaru and Mang’onyi in 2004. Small-scale mining has been semi-mechanised since the early 2000s, and the Singida Gold Mine in Ikungi District reached commercial production in 2023. It is closer to Dar es Salaam than any Lake Zone goldfield.',
    logistics: [
      'Roughly 700 km by road from Dar es Salaam via Morogoro and Dodoma, closer than any Lake Zone goldfield',
      'Singida sits on the main road to Nzega, Shinyanga and Mwanza, so haulage capacity is easy to find',
      'The region is semi-arid, so water for processing has to be planned from the start',
      'Grid power reaches the main centres; outlying mining areas rely on generators',
    ],
    geology:
      'Singida’s gold sits in the Iramba–Sekenke greenstone belt on the south-eastern side of the Tanzania Craton. Gold is structurally controlled, in quartz veins and shear zones. Sekenke, Shelui and Muhentiri are historic sites; Sekenke was the largest single gold producer in pre-war Tanganyika. More recent discoveries at Londoni, Sambaru and Mang’onyi underpin both small-scale mining and the Singida Gold Mine.',
    operators: [
      'Singida Gold Mine in Ikungi District, in commercial production since 2023',
      'Small-scale and semi-mechanised miners around Sekenke, Shelui and Iramba',
      'Artisanal and small-scale operations around Londoni, Sambaru and Mang’onyi',
    ],
    buys: ['jaw-crusher', 'ball-mill-gold-ore', 'centrifugal-gold-concentrator', 'shaking-table-gold', 'air-compressor-mining', 'diesel-generator-mining'],
    buysNote:
      'Singida’s semi-mechanised operators break hard vein ore, so compressors for rock drilling and robust crushers feature more than in softer districts. Because water is scarce, gravity circuits need water recycling built in from the start, and generators are a standard part of most site purchases.',
    faqs: [
      { q: 'How does water scarcity in Singida affect a gold plant?', a: 'Milling and gravity concentration use a lot of water. In a semi-arid district that means a settling pond or thickener to recycle water, storage to ride out dry months, and choosing equipment that does not waste water. Plan the water balance before sizing the plant, not after.' },
      { q: 'Is Singida quicker to supply than the Lake Zone?', a: 'Yes. At roughly 700 km from Dar es Salaam via Dodoma, Singida is the closest of the goldfields we supply, typically a two-day road trip once cleared, compared with three to four days for Mwanza or Geita.' },
      { q: 'What do small miners around Sekenke need most?', a: 'Rock breaking and milling equipment for hard vein ore, a compressor where rock drilling is used, a gravity circuit to recover free gold without mercury, and a generator sized for the mill’s starting load.' },
      { q: 'Is there a gold mine operating in Singida?', a: 'Yes. The Singida Gold Mine in Ikungi District reached commercial production in 2023, alongside a long-established small-scale and semi-mechanised mining sector in the region.' },
    ],
    updated: '2026-09-13',
  },
  {
    // NOTE FOR REVIEW: road distances approximate; add Bart Mining's own
    // work in the district before shipping, per the rule at the top.
    slug: 'nzega',
    city: 'Nzega and Igunga',
    region: 'Tabora Region',
    title: 'Mining Equipment Supply in Nzega and Igunga, Tabora',
    description:
      'Mining equipment for Nzega, Igunga and Tabora: ball mills, concentrators, shaking tables, shaft winches and generators for small-scale gold miners.',
    summary:
      'Nzega is where Tanzania’s modern gold industry began. Golden Pride at Lusu, 18 km north of Nzega town, was the first modern commercial gold mine built in the country, producing over 2.2 million ounces between 1998 and 2013. Since its closure, small-scale miners across Nzega and neighbouring Igunga, at sites such as Mwashiku, have become the backbone of Tabora Region’s gold production.',
    logistics: [
      'Nzega sits on the main Dar es Salaam to Mwanza road, roughly 900 km from Dar es Salaam via Dodoma and Singida',
      'Tabora town is on the Central Line railway, with branch lines towards Kigoma and Mpanda',
      'About 200 km south of Mwanza, so Lake Zone workshops and freight are within reach',
      'Grid power in the towns; rural sites around Igunga and Nzega commonly run generators',
    ],
    geology:
      'Nzega lies on the Nzega greenstone belt at the southern edge of the Lake Victoria Goldfields, part of the Archaean Tanzania Craton. Golden Pride exploited shear-hosted gold in the belt, and small-scale workings across the district follow similar quartz vein and shear structures. Much of the district’s small-scale mining is on shallow to moderate shafts and pits, with gravity and amalgamation processing close to the workings.',
    operators: [
      'Small-scale gold miners across Nzega District, including ground around the former Golden Pride mine at Lusu',
      'Small-scale miners in Igunga District at sites such as Mwashiku',
      'Processing operators running milling and gravity plants near the workings',
    ],
    buys: ['ball-mill-gold-ore', 'centrifugal-gold-concentrator', 'shaking-table-gold', 'jaw-crusher', '1-ton-winch', 'diesel-generator-mining'],
    buysNote:
      'Tabora’s small-scale sector is dominated by shaft mining and on-site milling, so the recurring purchases are compact crushing and milling sets, gravity concentrators to replace mercury, shaft winches and generators for sites away from the grid.',
    faqs: [
      { q: 'What happened to the Golden Pride mine at Nzega?', a: 'Golden Pride, developed by Resolute Mining at Lusu, was the first modern commercial gold mine in Tanzania. It produced over 2.2 million ounces from 1998 until it ceased operations in 2013. Small-scale mining continues across the wider district.' },
      { q: 'How is equipment delivered to Nzega and Igunga?', a: 'By road on the main Dar es Salaam to Mwanza route, roughly 900 km to Nzega. Heavy loads can use the Central Line railway to Tabora. Mwanza, about 200 km north, is the nearest centre with deep workshop and spares capacity.' },
      { q: 'What should a small mine near Igunga buy first?', a: 'A milling set that grinds fine enough to liberate the gold, then a centrifugal concentrator and shaking table to recover it without mercury. On shaft operations, a correctly rated winch and a dewatering pump come next.' },
      { q: 'Where can gold be sold in Tabora Region?', a: 'Through government mineral markets and licensed buying centres operating under the Mining Commission. Contact the Resident Mines Officer for current locations in Nzega, Igunga and Tabora.' },
    ],
    updated: '2026-09-13',
  },
  {
    // NOTE FOR REVIEW: road distances approximate; add Bart Mining's own
    // work in the district before shipping, per the rule at the top.
    slug: 'musoma',
    city: 'Musoma and Butiama',
    region: 'Mara Region',
    title: 'Mining Equipment Supply in Musoma and Butiama, Mara',
    description:
      'Mining equipment for Musoma, Butiama, Kiabakari and Buhemba: shaft winches, pumps, safety gear, mills and concentrators on the Musoma-Mara belt.',
    summary:
      'Musoma is the Lake Victoria port town of Mara Region and the base for gold mining in Butiama District, home to the historic Kiabakari and Buhemba mines. Buhemba shows both the potential and the risk of the district: after a collapse there trapped small-scale miners, mining was suspended and the site was mapped for handover to licensed groups. Safe underground working is as central to buying here as recovery.',
    logistics: [
      'Roughly 1,350 km by road from Dar es Salaam via Mwanza, with Musoma about 220 km north-east of Mwanza',
      'Musoma port on Lake Victoria connects to Mwanza, which suits heavy loads such as mill shells and tank panels',
      'Kiabakari lies about 30 km south of Musoma, on the road towards Butiama',
      'Grid power in Musoma; mining sites inland commonly rely on generators',
    ],
    geology:
      'Musoma and Butiama sit on the Musoma-Mara greenstone belt, the Archaean belt that also hosts North Mara further east. Gold occurs in quartz veins and shear zones worked historically at Kiabakari and Buhemba, and today by small-scale miners across the district. Many workings are underground, following veins to depth, which is why ground stability, hoisting and dewatering dominate the equipment conversation.',
    operators: [
      'Small-scale miners across Butiama District, including groups around Buhemba',
      'The historic Kiabakari mining area, south of Musoma',
      'STAMICO, which surveyed Buhemba for handover to licensed small-scale groups',
    ],
    buys: ['2-ton-winch', 'submersible-dewatering-pump', 'mining-safety-helmet-cap-lamp', 'gas-detection-monitor', 'ball-mill-gold-ore', 'centrifugal-gold-concentrator'],
    buysNote:
      'Mara’s underground vein workings make hoisting, dewatering and safety equipment the first purchases, ahead of processing. Operators at old mine sites are working ground disturbed by previous mining, which makes certified winches, reliable pumps and gas detection essential rather than optional.',
    faqs: [
      { q: 'Why was mining at Buhemba suspended?', a: 'The government suspended mining at Buhemba after a collapse trapped several small-scale miners. STAMICO surveyed the site so it could be mapped and handed over to licensed groups. It is a reminder that old mine ground needs proper assessment, ground support and safe hoisting.' },
      { q: 'Can equipment reach Musoma by lake?', a: 'Yes. Lake Victoria shipping from Mwanza to Musoma port is a practical route for heavy or oversized loads, and often easier than road for equipment such as mill shells. It needs more lead time and packing for handling at both ports.' },
      { q: 'What safety equipment does a small underground mine need?', a: 'At minimum: hard hats and cap lamps, a correctly rated winch that nobody rides, dewatering pumps, and a gas detector wherever people work beyond natural ventilation. Deeper workings also need forced ventilation and self-rescuers.' },
      { q: 'Where can gold be sold in Mara Region?', a: 'Through the government mineral markets and licensed buying centres in Mara Region, operating under the Mining Commission. Contact the Resident Mines Officer for current locations.' },
    ],
    updated: '2026-09-13',
  },
  {
    // NOTE FOR REVIEW: road distances approximate; add Bart Mining's own
    // work in the district before shipping, per the rule at the top.
    slug: 'mpanda',
    city: 'Mpanda',
    region: 'Katavi Region',
    title: 'Mining Equipment Supply in Mpanda, Katavi',
    description:
      'Mining equipment for Mpanda and the Mpanda Mineral Field: ball mills, concentrators, leach tanks and elution for gold miners at Ibindi, Kapanda and Katuma.',
    summary:
      'Mpanda is the centre of the Mpanda Mineral Field in western Tanzania, where small-scale miners at Ibindi, Kapanda and Katuma run vat leaching plants. Research on those plants found average recovery below 57 percent, which means much of the gold mined in Katavi is lost. The region has mineral markets in Mpanda Municipality and at Karema, and the Katavi mineral market has handled tens of billions of shillings of gold.',
    logistics: [
      'One of the most remote goldfields we supply, more than 1,200 km from Dar es Salaam by road',
      'The Central Line railway reaches Mpanda through its branch from Kaliua, which suits heavy consignments',
      'Road access can be slow in the rainy season; schedule heavy deliveries for the dry months',
      'Limited grid power and workshops, so spares and generators need planning up front',
    ],
    geology:
      'The Mpanda Mineral Field lies in the Palaeoproterozoic Ubendian belt near Lake Tanganyika, outside the Archaean craton that hosts the Lake Victoria Goldfields. Its mineralised veins carry three associations: gold-rich deposits, gold with base metals, and base-metal-rich deposits. Where copper and other base metals accompany the gold, cyanide consumption rises and recovery falls, which is part of why vat leaching performs poorly here.',
    operators: [
      'Small-scale miners and vat leach plants at Ibindi, Kapanda and Katuma',
      'Gold workings at Ugalla, Singililwa, Msagiya and around Mpanda town',
      'Government mineral markets in Mpanda Municipality and Karema',
    ],
    buys: ['ball-mill-gold-ore', 'centrifugal-gold-concentrator', 'leaching-tank', 'gold-elution-electrowinning-plant', 'shaking-table-gold', 'diesel-generator-mining'],
    buysNote:
      'The biggest opportunity in Katavi is recovery, not tonnage. With vat leach plants averaging below 57 percent, finer grinding, gravity recovery ahead of leaching and agitated tank leaching can recover gold that is currently discarded. Ore with base metals needs testing before any cyanide circuit is sized.',
    faqs: [
      { q: 'Why is gold recovery low at Mpanda?', a: 'Research at the Ibindi, Katuma and Kapanda plants found average recovery below 57 percent with vat leaching. Likely contributors include coarse grinding that leaves gold locked in particles, base metals that consume cyanide, and the limits of percolation leaching. Test work on the ore identifies which apply.' },
      { q: 'How can a vat leach operator at Ibindi improve recovery?', a: 'Test the ore and tailings, then consider regrinding, adding a centrifugal concentrator to catch free gold first, and moving to agitated tank leaching. Where base metals are present, the leach chemistry needs adjusting based on tests rather than guesswork.' },
      { q: 'How is equipment delivered to Mpanda?', a: 'By road over more than 1,200 km, or by the Central Line railway on the branch to Mpanda for heavy loads. Plan for longer lead times than the Lake Zone, and bring critical spares with the equipment.' },
      { q: 'Where is gold sold in Katavi?', a: 'At the government mineral markets in Mpanda Municipality and Karema, and licensed buying centres in the region.' },
    ],
    updated: '2026-09-13',
  },
  {
    // NOTE FOR REVIEW: road distances approximate; add Bart Mining's own
    // work in the district before shipping, per the rule at the top.
    slug: 'handeni',
    city: 'Handeni',
    region: 'Tanga Region',
    title: 'Mining Equipment Supply in Handeni, Tanga',
    description:
      'Mining equipment for Handeni and the Magambazi gold field: crushers, ball mills, concentrators, compressors and pumps, close to Dar es Salaam and Tanga port.',
    summary:
      'Handeni is the closest goldfield to a seaport in Tanzania. Gold discovered by local people at Magambazi in 2003 set off a rush of alluvial and hard-rock mining, and exploration later confirmed a significant quartz vein deposit. For equipment buyers, the defining advantage is distance: Handeni is a day’s drive from Dar es Salaam and close to Tanga port, compared with three days or more to the Lake Zone.',
    logistics: [
      'Roughly 250 km by road from Dar es Salaam via Chalinze, typically a single day’s drive',
      'About 110 km from Tanga port, an alternative point of entry for imported equipment',
      'The shortest and cheapest inland freight leg of any goldfield we supply',
      'Grid power in Handeni town; mining sites commonly use generators',
    ],
    geology:
      'The Handeni gold field sits in Proterozoic metamorphic rocks of the Mozambique belt, east of the Tanzania Craton, a different setting from the Lake Victoria Goldfields. Gold at Magambazi occurs as quartz vein mineralisation in strongly silicified rock within a brittle-ductile shear zone. Both alluvial and hard-rock gold have been worked, and the silicified host rock is hard and abrasive, which matters for crushing and milling equipment.',
    operators: [
      'Small-scale alluvial and hard-rock miners across Handeni District, including around Magambazi',
      'Exploration and development interests on the Handeni gold field',
      'Small-scale operations extending into neighbouring Kilindi District',
    ],
    buys: ['jaw-crusher', 'ball-mill-gold-ore', 'centrifugal-gold-concentrator', 'shaking-table-gold', 'air-compressor-mining', 'submersible-dewatering-pump'],
    buysNote:
      'Handeni operators work both alluvial ground and hard silicified vein rock, so buying splits between gravity equipment for alluvial material and robust crushing, milling and compressed-air drilling for hard rock. Short delivery times mean equipment and spares can be sourced from Dar es Salaam as needed rather than stockpiled.',
    faqs: [
      { q: 'How quickly can equipment reach Handeni?', a: 'Once cleared at Dar es Salaam, usually within a day by road over roughly 250 km. Equipment landed at Tanga port is closer still, about 110 km away. This makes Handeni the fastest goldfield in Tanzania to supply and support.' },
      { q: 'Is Handeni ore hard on equipment?', a: 'The vein gold at Magambazi sits in strongly silicified rock, which is hard and abrasive. Specify quality jaw plates, mill liners and grinding media, and budget wear parts per tonne. Alluvial material is gentler but needs good gravity recovery for fine gold.' },
      { q: 'When was gold discovered at Handeni?', a: 'Local people discovered gold in the Magambazi area in 2003, which triggered a rush of alluvial and hard-rock mining. Gold had been described in the area since the 1950s, but it was the 2003 discovery that made Handeni an active goldfield.' },
      { q: 'Should I import through Tanga port instead of Dar es Salaam?', a: 'It is worth pricing for Handeni. Tanga is closer, but shipping line schedules and clearance options differ from Dar es Salaam, so compare the full landed cost and timing for each consignment.' },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'dar-es-salaam',
    city: 'Dar es Salaam',
    region: 'Dar es Salaam Region',
    title: 'Mining Equipment in Dar es Salaam: Import & Clearance',
    description:
      'Mining equipment imported through Dar es Salaam: port clearance, landed cost, consolidated shipments and delivery to every goldfield in Tanzania.',
    summary:
      'Dar es Salaam is where almost every piece of imported mining equipment enters Tanzania and where Bart Mining is based. For buyers anywhere in the country, the quality of what happens at the port, from customs classification to consolidation and onward transport, decides whether a plant arrives on time and on budget. This page covers what matters at the Dar es Salaam end of the supply chain.',
    logistics: [
      'The port of Dar es Salaam is the main gateway for equipment bound for every Tanzanian goldfield',
      'Onward road distances: about 250 km to Handeni, 700 km to Singida, 830 km to Mbeya for Chunya, 1,000 km to Kahama, 1,150 km to Mwanza and 1,250 km to Geita',
      'The Central Line railway and TAZARA both start in Dar es Salaam, for heavy loads to Tabora, Isaka, Mpanda and Mbeya',
      'Julius Nyerere International Airport handles urgent spares and instruments',
    ],
    geology:
      'Dar es Salaam is not a mining district, and this page is about logistics rather than geology. Its role in mining is as the port of entry, the base for importers, clearing agents and freight operators, and the nearest large centre for goldfields in the east such as Handeni.',
    operators: [
      'Bart Mining’s base, from where equipment supply across Tanzania is coordinated',
      'Clearing and forwarding agents, freight operators and bonded warehouses serving mining imports',
      'Equipment suppliers, fabricators and workshops serving projects nationwide',
    ],
    buys: ['modular-gold-plant', 'cil-cip-plant', 'diesel-generator-mining', 'air-compressor-mining', 'rc-drilling-rig', 'slurry-pump'],
    buysNote:
      'Buyers who deal with us in Dar es Salaam are usually procuring complete plants or large packages for sites elsewhere, where consolidation, correct customs classification and a single landed price matter most. Combining a plant, generator, pumps and first-year spares in one shipment reduces both cost and the risk of one missing item stopping commissioning.',
    faqs: [
      { q: 'How long does port clearance take at Dar es Salaam?', a: 'It varies with documentation, customs classification and port congestion. Clearance is usually the least predictable part of delivery, more so than the inland road journey, so correct paperwork before the goods ship is the single biggest factor in avoiding delays.' },
      { q: 'What does it cost to land mining equipment in Tanzania?', a: 'As a planning figure, add roughly 25 to 45 percent to an ex-works price to cover freight, duty, VAT, port charges and inland transport to a Lake Zone site. Our landed cost guide breaks down each item.' },
      { q: 'Can you consolidate equipment from several suppliers?', a: 'Yes, and it is often worth doing. A single consolidated shipment with one set of documents and one onward delivery is cheaper and less risky than several small consignments arriving at different times.' },
      { q: 'Do you deliver outside the Lake Zone?', a: 'Yes. From Dar es Salaam we deliver to every goldfield covered on this site, including Chunya, Singida, Handeni, Mpanda, Tarime, Shinyanga and Tabora Region, as well as the Lake Zone centres of Mwanza, Geita and Kahama.' },
    ],
    updated: '2026-09-13',
  },
  {
    // NOTE FOR REVIEW: add Bart Mining's own work in the district before
    // shipping, per the rule at the top.
    slug: 'mererani',
    city: 'Mererani',
    region: 'Manyara Region',
    title: 'Tanzanite Mining Equipment, Mererani & Arusha',
    description:
      'Underground equipment for Mererani tanzanite mines near Arusha: shaft winches, ventilation fans, compressors, pumps, gas detectors and self-rescuers.',
    summary:
      'Mererani, in Simanjiro District near Arusha, is the only place in the world where tanzanite is mined commercially. The mining area covers less than 17 square kilometres and is worked mainly by small-scale and artisanal operators through deep, narrow shafts. That makes Mererani the most demanding underground environment in the Tanzanian small-scale sector, and its equipment needs centre on hoisting, ventilation and safety rather than processing.',
    logistics: [
      'Roughly 650 km by road from Dar es Salaam to Arusha, with Mererani a short drive south-east of Arusha',
      'Kilimanjaro International Airport, between Arusha and Moshi, handles urgent spares and instruments',
      'Tanga port is an alternative point of entry for northern Tanzania',
      'Arusha has workshops, traders and the region’s gemstone trade, so support is close by',
    ],
    geology:
      'Tanzanite occurs in the Mererani Hills in metamorphic rocks of the Neoproterozoic Mozambique belt, in folded graphitic gneisses and schists with associated calc-silicate rocks. The gem-bearing zones are followed underground, and workings reach considerable depth through narrow shafts and inclines. Graphitic host rock, depth and limited airflow create the ventilation and gas hazards that define safe mining here.',
    operators: [
      'Small-scale and artisanal tanzanite miners working licensed blocks in the Mererani Hills',
      'Larger regulated operators within the controlled mining area',
      'Gemstone traders and dealers in Mererani and Arusha',
    ],
    buys: ['5-ton-mine-winch', 'mine-ventilation-fan', 'air-compressor-mining', 'gas-detection-monitor', 'self-contained-self-rescuer', 'submersible-dewatering-pump'],
    buysNote:
      'Mererani buys underground equipment almost exclusively. Deep shafts need proper hoisting, forced ventilation, compressed air for drilling and gas detection, and every miner underground should carry a self-rescuer. Processing equipment for gold is not relevant here; the value is in getting people and rock out of deep workings safely.',
    faqs: [
      { q: 'Do you supply equipment for tanzanite mines?', a: 'Yes, the underground side: hoisting, ventilation, compressed air, dewatering, gas detection and personal safety equipment. We do not supply gemstone cutting or sorting equipment.' },
      { q: 'Why is ventilation so important at Mererani?', a: 'Workings are deep and narrow, natural airflow is limited, and blasting and diesel equipment produce toxic gases. Without forced ventilation, oxygen levels fall and carbon monoxide builds up. A correctly sized fan and duct system, with gas detectors, is basic life-safety equipment at depth.' },
      { q: 'What hoisting equipment suits a deep tanzanite shaft?', a: 'Beyond roughly 60 metres a light winch is no longer adequate. Deep shafts need a correctly rated mine winch or hoist with fail-safe braking, a rope with the proper safety factor, and a clear rule that goods winches never carry people unless certified for it.' },
      { q: 'Is Mererani in Arusha or Manyara?', a: 'Mererani is in Simanjiro District, Manyara Region, but it is reached from Arusha, which is the commercial and gemstone trading centre for the area. Equipment for Mererani is usually delivered and supported through Arusha.' },
    ],
    updated: '2026-09-13',
  },
]

export const LOCATION_BY_SLUG = new Map(LOCATIONS.map(l => [l.slug, l]))
