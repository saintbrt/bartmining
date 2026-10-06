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
      'Road delivery from Dar es Salaam requires a consignment-specific route and schedule, including clearance and final site access',
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
      {
        "q": "How long does delivery to Mwanza take from Dar es Salaam?",
        "a": "Request a schedule for the actual consignment, separating port clearance, road transport and delivery to the site. Vehicle availability, load size, weather and unloading arrangements can change the timing. Confirm those stages in the offer rather than planning commissioning around a fixed number of driving days."
      },
      {
        "q": "Can equipment be delivered to islands and lakeshore sites?",
        "a": "Lake transport may be an option, but confirm the vessel, cargo limits, sailing schedule and handling facilities for the destination. Include packaging, loading, unloading and the final move to site in the comparison. The cheapest or most practical route depends on the consignment and available services."
      },
      {
        "q": "What equipment should a small mine around Mwanza assess first?",
        "a": "Start with the mine's operating constraints and representative feed tests. Crushing, milling and gravity recovery may suit free gold, while hoisting, water and safety duties need their own assessment. Plan concentrate cleanup and a final-product route; buying a concentrator does not establish complete mercury-free recovery."
      },
      {
        "q": "How should local repairs and spares affect equipment selection?",
        "a": "Confirm who can service the proposed machine, which parts are available and how long critical replacements take. Include maintenance access, documentation and initial spares in the scope. A workshop near Mwanza is useful only when it has the capability and parts required for your particular equipment."
      }
    ],
    updated: '2026-10-06',
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
      'Hard or abrasive feed makes crusher, mill and wear-part specification important. Define those duties from representative tests and the intended product size. Where leaching is being considered, test the additional recovery and compare the complete circuit cost rather than treating regional grade or the number of nearby plants as justification.',
    areas: [
      { name: 'Nyarugusu', note: 'One of the region’s longest-worked small-scale gold areas, south of Geita town, with shaft workings and dense processing activity that make it a steady market for mills, concentrators and dewatering pumps.' },
      { name: 'Mgusu', note: 'A long-established small-scale mining settlement in Geita District, working the same greenstone belt as the major mine, where abrasive ore puts crusher and mill wear parts at the top of the buying list.' },
      { name: 'Rwamgasa (Lwamgasa)', note: 'Home to a government demonstration centre for gold processing, built to show small-scale miners improved, mercury-free recovery. Operators here are often upgrading from amalgamation to gravity and leach circuits.' },
      { name: 'Katente (Bukombe)', note: 'A small-scale mining area in Bukombe District with its own government demonstration processing centre, served by the Bukombe buying station under the Geita mineral market.' },
      { name: 'Nyang’hwale, Mbogwe and Chato', note: 'Outlying districts of Geita Region, each with a mineral buying station. Sites here are further from grid power and workshops, so generator sizing and spares holding matter more.' },
    ],
    faqs: [
      {
        "q": "Why might crusher and mill wear be high at a Geita site?",
        "a": "Hard or abrasive feed can increase wear, but the rate also depends on the actual material, machine duty and operating conditions. Test representative ore and review wear records before specifying replacement materials. Track parts and cost against processed tonnes and operating hours rather than assuming one rate for the district."
      },
      {
        "q": "How do I assess whether CIP or CIL is justified for my Geita mine?",
        "a": "Test representative feed and any gravity tailings, then compare additional payable recovery with the complete circuit cost. Include utilities, residue management, approvals, staffing and the loaded-carbon route. A regional grade description or a tailings assay alone does not establish either process selection or profitability."
      },
      {
        "q": "What should a delivery quotation to Geita include?",
        "a": "Ask for the route, load dimensions, vehicle and any permits or special handling required. Confirm clearance, inland transport, unloading and access to the plant location as separate responsibilities. An oversized consignment needs a checked route and schedule rather than assumptions based on a standard truck delivery."
      },
      {
        "q": "Can magnetic surveying identify gold directly in Geita?",
        "a": "It measures magnetic responses that may help interpret rocks and structures. Its usefulness depends on the target and local contrasts, and an anomaly can have more than one explanation. Combine the interpretation with mapping and direct tests before choosing drill targets or assigning a grade."
      }
    ],
    updated: '2026-10-06',
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
      {
        "q": "How should I compare delivery through Isaka with direct road haulage?",
        "a": "Obtain complete offers for the same load and destination. Compare available rail service, terminal handling, clearance responsibilities, onward trucking and the schedule alongside direct road transport. Isaka's position does not by itself guarantee lower cost or quicker delivery for a particular consignment."
      },
      {
        "q": "Which factors determine underground equipment duty around Kahama?",
        "a": "Use the actual shaft and working layout, loads, water inflow, occupied areas and operating activities. Hoisting, dewatering and ventilation must be assessed together by the responsible specialists. A fixed depth threshold or a neighbouring mine's equipment list cannot establish what is adequate for your site."
      },
      {
        "q": "Does owning a gas detector establish that a working is safe?",
        "a": "The detector must suit the assessed hazards and be used and maintained under the site's procedures. Its readings do not replace ventilation or authorise entry. Agree monitoring locations, instrument checks and the response to alarms or ventilation failure with the person responsible for underground safety."
      },
      {
        "q": "How quickly can equipment reach Kahama?",
        "a": "Confirm timing for the actual equipment and route, including any port clearance, terminal handling and site access. A standard road load and an oversized machine can require different preparation. Keep the proposed delivery date linked to vehicle availability and unloading readiness rather than using a general district estimate."
      }
    ],
    updated: '2026-10-06',
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
      'An operator with existing crushing and gravity equipment should establish the next constraint before buying a leach circuit. Test feed and residues, including previous treatment and contaminants, and assess the complete route to final gold. Mercury-bearing tailings need a separate specialist assessment and must not be treated as ordinary cyanide feed. Include utilities and managed residues in any proposed expansion.',
    faqs: [
      {
        "q": "What should I plan for delivery to a Chunya plant site?",
        "a": "Give the supplier the exact destination, load dimensions and the final access conditions. Compare available road and rail options through the southern corridor, including onward handling where needed. Check wet-season access and unloading before agreeing a schedule for heavy equipment."
      },
      {
        "q": "Does recoverable gold in old tailings make them ready for CIP?",
        "a": "Assess representative grade, previous treatment, contaminants and process response first. Mercury-bearing residues should not be treated as ordinary cyanide feed. A qualified specialist should establish a suitable route before chemical procurement, and the economic comparison must include the complete recovery and residue system."
      },
      {
        "q": "How should I prepare to sell gold in Chunya?",
        "a": "Confirm the current authorised market or buying route and the buyer's licence with the Mining Commission. Ask which documents apply to your seller category, and agree weighing, assay, deductions and payment timing. Keep the lot and settlement records together rather than relying on the headline indicative price."
      },
      {
        "q": "What should I do before buying equipment to add leaching?",
        "a": "Test the feed and tailings and have the proposed circuit reviewed as a whole. Include preparation, leaching and adsorption, loaded-carbon handling, elution or toll treatment, utilities and managed residues. Confirm the applicable approvals and operating responsibilities before treating a tank quotation as the complete project scope."
      }
    ],
    updated: '2026-10-06',
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
      {
        "q": "Is delivery to Tarime through Mombasa cheaper than through Dar es Salaam?",
        "a": "Compare current offers for the actual load rather than choosing from distance alone. Include port and transit costs, border documentation, vehicle availability, onward transport and site handling. The route with the shorter map distance may have a different total cost or delivery schedule."
      },
      {
        "q": "What should a newly licensed group in Nyamongo buy first?",
        "a": "Define the operating plan, representative feed, sustainable tonnage and site utilities before choosing machines. Tests may support a crushing, milling and gravity circuit for suitable free gold, with a planned cleanup and final-product route. Assess hoisting, water and safety separately, and budget later process additions only when evidence supports them."
      },
      {
        "q": "How can I confirm a gold-selling route in Mara Region?",
        "a": "Ask the Mining Commission or Resident Mines Officer about current authorised markets, buying centres and buyer licences for your seller category. Confirm the required documents and settlement process before delivery. Do not assume that a buyer's location or a personal introduction establishes permission to trade."
      },
      {
        "q": "Can a shared plant process material from several licence holders?",
        "a": "It may be workable after confirming the applicable processing permissions and written agreements. Define custody, separate weighing and sampling, charges, scheduling and settlement for each lot. Those controls help avoid disputes, but an agreement alone does not establish that the proposed activity is authorised."
      }
    ],
    updated: '2026-10-06',
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
      {
        "q": "Can I plan my production around access to the Mwakitolyo processing centre?",
        "a": "Confirm the facility's current operating status, services, accepted feed, charges and capacity with its operator and the relevant authorities. An announcement does not establish availability for your production dates. Compare the confirmed service scope with your own plant requirements before relying on it in the schedule."
      },
      {
        "q": "Do you supply diamond mining equipment in Shinyanga?",
        "a": "Our catalogue for the region focuses on gold processing, lifting and pumping duties. A diamond recovery circuit needs specialist assessment and equipment appropriate to its feed and recovery requirements. Discuss that scope with a diamond-processing supplier rather than treating a gold plant as a suitable substitute."
      },
      {
        "q": "What information is needed to size a generator for a small gold mill?",
        "a": "Provide the complete load list, operating sequence, starting arrangements and site conditions. Have a qualified electrical designer check both starting and running duty against the proposed generator rating. The largest motor's nameplate alone does not establish a reliable supply for the whole plant."
      },
      {
        "q": "How long does delivery to Shinyanga take?",
        "a": "Request a consignment-specific schedule that includes clearance where relevant, transport availability, the chosen route and site unloading. Road and rail options may have different handling and timing requirements. Agree those stages before committing to an installation date rather than treating a driving-time estimate as the full lead time."
      }
    ],
    updated: '2026-10-06',
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
      {
        "q": "How should a plant near Singida plan for limited water availability?",
        "a": "Establish the source and permitted availability, process demand, return-water quality and seasonal conditions. Have the water balance and storage assessed with the proposed circuit rather than adding a pond after equipment selection. Recycling can help, but it needs a design suited to the process and residue streams."
      },
      {
        "q": "Is a shorter road distance enough to promise quicker delivery to Singida?",
        "a": "Distance is one input. Actual timing also depends on clearance, vehicle availability, load size, access and unloading. Ask for a schedule for the specific consignment and compare the same delivery scope. A general route comparison should not be used as a guaranteed mobilisation date."
      },
      {
        "q": "What should a small miner near Sekenke include in an equipment brief?",
        "a": "Describe the feed, mining method, sustainable tonnes, operating hours, water and power. Use tests to specify crushing, milling and recovery, and assess drilling, hoisting and safety duties separately where relevant. The brief should define each task rather than assume a standard district package fits every mine."
      },
      {
        "q": "Does a nearby commercial mine establish the case for my plant?",
        "a": "Its history may help frame regional geological questions, but your property needs its own rights, feed and process evidence. Keep the programme tied to the next decision on your site. A neighbouring operation's production or equipment does not establish your grade, recovery or viable plant size."
      }
    ],
    updated: '2026-10-06',
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
      {
        "q": "Does the history of Golden Pride establish the value of another Nzega property?",
        "a": "It is a regional mining reference, while a different property needs its own geological and process evidence. Confirm the rights, sample basis and continuity relevant to the target before planning a plant. Historical output from another operation cannot be transferred into your grade or revenue forecast."
      },
      {
        "q": "What should I confirm for delivery to Nzega or Igunga?",
        "a": "Provide the exact destination and access conditions and obtain a route and handling plan for the load. Compare available road or rail arrangements, including any final trucking, unloading and clearance responsibilities. Verify the service and schedule for the consignment rather than relying on distance alone."
      },
      {
        "q": "What should a small mine near Igunga assess before buying a milling set?",
        "a": "Test the material and define the preparation and product size needed for the selected recovery route. Check sustainable feed, power, water and maintenance alongside the mill's duty. Hoisting, dewatering and safety need their own site assessment, so a process package should not be treated as the complete mine."
      },
      {
        "q": "How can I confirm a gold-selling location in Tabora Region?",
        "a": "Ask the Resident Mines Officer or Mining Commission for the current authorised route near your site and verify the buyer's licence. Confirm the documents, assay, valuation, deductions and settlement before delivery. Keep those records with the lot's legal-origin evidence."
      }
    ],
    updated: '2026-10-06',
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
      {
        "q": "What needs checking before work resumes in old mine workings?",
        "a": "Confirm the current rights and site status and have the workings assessed by the responsible competent specialists. Ground stability, access, water, ventilation and hoisting require a coordinated plan. A history of mining at a location does not establish that the remaining workings are suitable for entry or renewed production."
      },
      {
        "q": "Can equipment reach a Musoma site by lake?",
        "a": "Lake transport may be an option if a suitable service and handling arrangement are available for the load. Confirm cargo limits, sailing dates, packing, both-end handling and the final move to site. Compare the complete scope and schedule with road haulage before selecting the route."
      },
      {
        "q": "Can a short safety-equipment list establish that an underground mine is ready?",
        "a": "Equipment is part of a site-specific safety system, not proof of readiness. Have the layout, ground, lifting, water and ventilation duties assessed, with suitable monitoring, emergency procedures, training and maintenance. A cargo winch must not be used to carry people; personnel hoisting needs an appropriately designed and approved system."
      },
      {
        "q": "How do I confirm where to sell gold in Mara Region?",
        "a": "Use the Mining Commission or Resident Mines Officer to confirm the current authorised market or buying route and the buyer's licence. Ask which documents apply to your seller category and how the lot will be valued and settled. Retain the origin, assay and payment records together."
      }
    ],
    updated: '2026-10-06',
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
      'For a vat operator, representative tests and a plant gold balance should establish whether preparation, solution flow or another duty limits recovery. Compare any proposed regrinding, gravity or agitated-leach option under its own measured response and complete cost. A result reported for other plants does not establish the performance or economics of a change at this site.',
    faqs: [
      {
        "q": "Does a recovery figure reported for another Mpanda plant predict my result?",
        "a": "It describes that study's samples and operating conditions. Your feed needs representative sampling and tests covering preparation, permeability and recovery to the final product. Establish where gold is leaving your circuit before using a regional figure to justify new equipment."
      },
      {
        "q": "How should a vat operator assess a recovery improvement?",
        "a": "Investigate feed, residues and the actual loss streams, then compare tested changes under a consistent gold balance. Regrinding, gravity recovery or a different leach arrangement may suit some material, but each needs its own cost and design assessment. Check previous treatment and contaminants before selecting a chemical route."
      },
      {
        "q": "What belongs in an equipment delivery plan for Mpanda?",
        "a": "Confirm the destination, available transport service, load limits and final access and unloading arrangements. Compare complete road and rail offers where practical, and schedule installation against the actual lead time. Include critical spares based on replacement availability rather than assuming support will arrive before production is interrupted."
      },
      {
        "q": "How can I confirm a current gold-selling route in Katavi?",
        "a": "Ask the Resident Mines Officer or Mining Commission about authorised markets and buying centres serving your site, including the relevant arrangements around Mpanda and Karema. Verify the buyer and required records before delivery. An indicative price does not establish the net settlement for your lot."
      }
    ],
    updated: '2026-10-06',
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
      {
        "q": "How quickly can equipment reach a Handeni site?",
        "a": "Request a schedule for the equipment and route actually proposed. Clearance, vehicle availability, load dimensions and final site access can matter as much as driving distance. Confirm those stages and unloading readiness before setting an installation date, even where the destination is relatively close to a port."
      },
      {
        "q": "How should ore hardness affect equipment selection near Handeni?",
        "a": "Use representative hardness and abrasion evidence to define crusher, mill and wear-part duties. Hard-rock feed and alluvial material can require different preparation, so do not select the package from the district name alone. Track wear against the material processed and operating conditions to refine the maintenance budget."
      },
      {
        "q": "Does a district's discovery history prove that a new target contains economic gold?",
        "a": "The history helps frame the regional model, but the target needs its own located samples, continuity evidence and process response. Keep selected specimens separate from representative production samples. Use staged tests to decide the next work rather than treating an earlier discovery as a plant justification."
      },
      {
        "q": "Should I import through Tanga or Dar es Salaam for Handeni?",
        "a": "Compare current shipment-specific offers covering shipping, port handling, clearance, inland transport and unloading. Confirm that the proposed services can handle the equipment on the required dates. The nearer port does not automatically provide the lower delivered cost or shorter total lead time."
      }
    ],
    updated: '2026-10-06',
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
      {
        "q": "How should I plan for port clearance at Dar es Salaam?",
        "a": "Confirm the documentation, classification, charges and responsibilities with the clearing specialist before shipment. Ask for the milestones and information needed to follow the consignment. Actual clearance depends on the shipment and current conditions, so a general lead-time estimate should not be treated as a guaranteed release date."
      },
      {
        "q": "Can I use a fixed percentage of the equipment price as its landed cost?",
        "a": "Build the budget from the actual scope: freight, insurance where applicable, confirmed taxes and fees, port handling, inland transport and unloading. Classification and delivery terms can change those amounts. Obtain itemised offers and the applicable treatment for the consignment instead of adding a universal percentage to an ex-works price."
      },
      {
        "q": "Will consolidating equipment from several suppliers always save money?",
        "a": "It may help when readiness dates, packing, documentation and load arrangements fit together. Compare storage, handling, shipping and the cost of waiting for a delayed item against separate deliveries. Confirm who coordinates each supplier so consolidation does not postpone the equipment needed to begin installation."
      },
      {
        "q": "Do you arrange delivery beyond the Lake Zone?",
        "a": "Discuss the actual project location and equipment with us so the quotation can define the route and delivery scope. Include load dimensions, access, unloading and the required schedule in the enquiry. A regional service listing is a starting point, while the written offer establishes the responsibilities for your shipment."
      }
    ],
    updated: '2026-10-06',
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
      {
        "q": "Which equipment duties do you cover for a tanzanite mine?",
        "a": "Our catalogue covers underground lifting, ventilation, compressed air, dewatering and safety-related equipment. Define those duties from the actual workings with the responsible specialists. Gemstone cutting, sorting and recovery need a separate specialist scope; a gold-processing package is not a substitute."
      },
      {
        "q": "Can a fan's motor rating establish adequate ventilation at Mererani?",
        "a": "Selection needs the mine layout, occupied areas, contaminants, required airflow distribution and system resistance. A motor rating alone does not establish the conditions at the working face. Have the ventilation duty designed and measured, with monitoring and a documented response to power or airflow interruptions."
      },
      {
        "q": "How should hoisting equipment be selected for a deep tanzanite shaft?",
        "a": "Give the designer the shaft geometry, loads, duty cycle and whether the system is for material or personnel. Ropes, brakes, controls and supporting structures must be assessed together. A fixed depth threshold cannot establish suitability, and a material winch must not be used as a personnel hoist."
      },
      {
        "q": "How should the final delivery to a Mererani site be planned?",
        "a": "Confirm the exact destination, site entry arrangements, access and unloading requirements in the delivery scope. If transport is staged through Arusha, include the onward leg and who handles it. Check those practical conditions against the load and installation schedule rather than assuming proximity to a town establishes access."
      }
    ],
    updated: '2026-10-06',
  },
]

export const LOCATION_BY_SLUG = new Map(LOCATIONS.map(l => [l.slug, l]))
