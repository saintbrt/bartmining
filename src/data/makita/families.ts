import type { Equipment, EquipCategory } from '../equipment-catalogue'
import catalogue from './catalogue.json'

/**
 * Makita tool-family pages (batch 1: concrete-work and metal-work tools).
 * Each family is one catalogue entry; its main products and every model are
 * rendered from catalogue.json by src/content/equipment/makita.ts.
 * Wording of the relationship is approved by the owner: "available through
 * Bart Mining in partnership with Makita Tanzania".
 */

export interface MakitaModel { base: string; codes: string[]; spec: string; difference: string; url: string }
export interface MakitaProduct { id: string; name: string; family: string; platform: string; image: string | null; models: MakitaModel[] }

export const MAKITA_PRODUCTS = catalogue.products as MakitaProduct[]
export const MAKITA_SOURCE = catalogue.source

export const PARTNERSHIP_EN = 'available through Bart Mining in partnership with Makita Tanzania'
export const PARTNERSHIP_SW = 'zinapatikana kupitia Bart Mining kwa ushirikiano na Makita Tanzania'

const PLATFORM_LABEL: Record<string, string> = {
  'Corded': 'Corded electric',
  'Cordless 12V CXT': '12V max CXT cordless',
  'Cordless 18V LXT': '18V LXT cordless',
  'Cordless 40V XGT': '40V max XGT cordless',
  'Petrol': 'Petrol engine',
}

interface FamilyCopy {
  family: string
  category: EquipCategory
  name: string
  h1: string
  title: string
  description: string
  summary: string
  sizes: string
  searchTerms: string[]
  applications: string[]
  maintenance: { interval: string; task: string }[]
  faqs: { q: string; a: string }[]
  related: string[]
}

const FAMILIES: FamilyCopy[] = [
  {
    family: 'rotary-combination-hammers', category: 'concrete-tools',
    name: 'Makita Rotary & Combination Hammers',
    h1: 'Makita Rotary and Combination Hammers: SDS-PLUS and SDS-MAX',
    title: 'Makita Rotary & Combination Hammers | Tanzania',
    description: 'Makita SDS-PLUS and SDS-MAX rotary and combination hammers, corded and cordless (LXT, XGT), available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Rotary and combination hammers drill holes in concrete and masonry with a hammering action, and most can also chisel. On a mine or plant they are used to drill anchor holes for machine foundations, cable trays, pipe supports and guards. Choose SDS-PLUS for holes up to about 28–32 mm and SDS-MAX for larger holes and heavier chiselling, then choose corded or cordless. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: 'SDS-PLUS up to about 32 mm; SDS-MAX up to 52 mm in concrete',
    searchTerms: ['makita rotary hammer', 'makita combination hammer', 'SDS-MAX rotary hammer Tanzania', 'SDS-PLUS hammer drill', 'makita hammer drill price Tanzania'],
    applications: ['Anchor holes for machine foundations and base plates', 'Fixing cable trays, pipe supports and guards to concrete', 'Core and through-holes for services in plant buildings', 'Light chiselling and removing concrete around fixings'],
    maintenance: [
      { interval: 'Every use', task: 'Clean and grease the bit shank; check the bit for wear and the chuck for dust build-up.' },
      { interval: 'Weekly', task: 'Inspect the power cable or battery contacts, side handle and depth gauge; clear the air vents.' },
      { interval: 'Every few months', task: 'Have carbon brushes on corded models checked and replaced as they wear.' },
      { interval: 'As needed', task: 'Return the tool for service if hammering weakens or the tool runs hot; do not keep working it.' },
    ],
    faqs: [
      { q: 'SDS-PLUS or SDS-MAX?', a: 'SDS-PLUS hammers suit holes up to about 28–32 mm and are lighter to hold overhead. SDS-MAX hammers take larger bits for holes up to about 52 mm and heavier chiselling. Choose by the largest hole you drill regularly.' },
      { q: 'What is the difference between a rotary hammer and a combination hammer?', a: 'Makita uses both names for hammers that drill with a hammer action; combination hammers usually also chisel. Check the number of modes in the model notes: two-mode tools drill only, three-mode tools also chisel.' },
      { q: 'Is anti-vibration worth it?', a: 'For daily or long drilling shifts, yes. Models marked AVT reduce vibration reaching the operator, which matters for comfort and long-term health on site.' },
    ],
    related: ['makita-demolition-hammers-breakers', 'makita-power-cutters', 'pneumatic-rock-drill', 'diesel-generator-mining'],
  },
  {
    family: 'demolition-hammers-breakers', category: 'concrete-tools',
    name: 'Makita Demolition Hammers & Breakers',
    h1: 'Makita Demolition Hammers and Electric Breakers',
    title: 'Makita Demolition Hammers & Breakers | Tanzania',
    description: 'Makita demolition hammers and electric breakers, corded and 40V/80V XGT cordless, for breaking concrete and foundations, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Demolition hammers and breakers chisel and break concrete without drilling. On mine and plant sites they remove old foundations, break slabs for new machine bases, clear build-up from chutes and open trenches in concrete. Lighter SDS-MAX hammers suit chiselling and smaller breaking; heavy hex-shank breakers with up to 72.8 J impact energy break slabs and foundations. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: 'SDS-MAX and hex shank (17–30 mm); impact energy from about 7.6 J to 72.8 J',
    searchTerms: ['makita demolition hammer', 'electric breaker Tanzania', 'makita breaker HM1812', 'concrete breaker price Tanzania', 'mashine ya kuvunja zege'],
    applications: ['Breaking out old concrete foundations and plinths', 'Opening trenches and holes in slabs for services', 'Clearing hardened build-up from chutes and hoppers', 'Chiselling during plant installation and repairs'],
    maintenance: [
      { interval: 'Every use', task: 'Grease the chisel shank; check chisels for mushrooming and resharpen or replace.' },
      { interval: 'Weekly', task: 'Check the cable or battery, handles and anti-vibration mounts; clean the vents.' },
      { interval: 'As specified', task: 'Change the hammer grease and check brushes at the intervals in the Makita manual.' },
      { interval: 'As needed', task: 'Stop using a tool that loses impact or overheats and send it for service.' },
    ],
    faqs: [
      { q: 'Demolition hammer or breaker?', a: 'A demolition hammer is lighter and suits chiselling and moderate breaking, often held horizontally. A breaker is heavier, works downwards and breaks thick slabs and foundations faster. Match it to the thickest concrete you break.' },
      { q: 'Can these break rock underground?', a: 'They are designed for concrete and masonry. For production rock breaking use the right mining equipment; these tools suit occasional breaking and plant-area work.' },
      { q: 'Cordless or corded?', a: 'Corded breakers deliver the most impact for long shifts where power is available. The 40V and 80V XGT models remove the cable for remote spots or where trailing leads are a hazard.' },
    ],
    related: ['makita-rotary-combination-hammers', 'makita-power-cutters', 'diesel-generator-mining', 'hydraulic-excavator'],
  },
  {
    family: 'power-cutters', category: 'concrete-tools',
    name: 'Makita Power Cutters',
    h1: 'Makita Power Cutters: Petrol and Cordless',
    title: 'Makita Power Cutters, Petrol & Cordless | Tanzania',
    description: 'Makita petrol and cordless power cutters for concrete, pipe and steel, 230–400 mm, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Power cutters are hand-held cut-off saws with large abrasive or diamond wheels for cutting concrete, masonry, pipe and steel. Petrol models work anywhere with no power supply; cordless LXT and XGT models avoid fuel and exhaust in enclosed areas. On a mine site they cut concrete for trenches and openings, pipe for repairs and steel during installation. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: '230 mm (36V cordless), 355 mm (80V cordless, petrol), up to 400 mm (petrol)',
    searchTerms: ['makita power cutter', 'petrol power cutter Tanzania', 'concrete cut-off saw', 'makita EK7301', 'cordless power cutter'],
    applications: ['Cutting concrete for trenches, openings and repairs', 'Cutting steel pipe and sections on site', 'Cutting where no power supply is available (petrol)', 'Wet cutting to control dust'],
    maintenance: [
      { interval: 'Every use', task: 'Check the wheel for cracks and the guard position; clean the air filter on petrol models.' },
      { interval: 'Weekly', task: 'Check belt tension, spark plug and fuel lines on petrol models; clean battery contacts on cordless models.' },
      { interval: 'As specified', task: 'Service the engine at the hours given in the manual.' },
      { interval: 'As needed', task: 'Replace worn wheels; never use a wheel rated below the cutter speed.' },
    ],
    faqs: [
      { q: 'Petrol or cordless?', a: 'Petrol suits remote work and long cutting with no power. Cordless suits enclosed or noise-sensitive areas and short jobs where fuel handling is unwelcome.' },
      { q: 'How do I control dust when cutting concrete?', a: 'Cut wet where the cutter supports it, and wear respiratory protection. Concrete dust contains silica and must be controlled.' },
      { q: 'Which wheel should I use?', a: 'Diamond wheels for concrete and masonry, abrasive wheels for steel. Use wheels rated for the cutter’s speed and size.' },
    ],
    related: ['makita-demolition-hammers-breakers', 'makita-metal-cutters-cut-off-saws', 'makita-rod-cutters'],
  },
  {
    family: 'wall-chasers-tile-cutters', category: 'concrete-tools',
    name: 'Makita Wall Chasers & Tile Cutters',
    h1: 'Makita Wall Chasers, Tile Cutters and Masonry Cutters',
    title: 'Makita Wall Chasers & Tile Cutters | Tanzania',
    description: 'Makita wall chasers, tile cutters and masonry cutters, corded and cordless, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Wall chasers cut neat parallel grooves in walls for cable and conduit, and tile and masonry cutters make straight cuts in tile, stone and concrete. They are used when fitting out plant control rooms, workshops, offices and site accommodation. Corded models cover the heaviest work; LXT and CXT cordless models suit small jobs and dust-controlled cutting. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: '85 mm to 305 mm wheels; chases up to 35 mm deep',
    searchTerms: ['makita wall chaser', 'tile cutter Tanzania', 'masonry cutter', 'makita SG150', 'concrete groove cutter'],
    applications: ['Cutting chases for electrical cable and conduit', 'Cutting tile and stone in buildings', 'Deep straight cuts in concrete and masonry', 'Fit-out of control rooms, workshops and offices'],
    maintenance: [
      { interval: 'Every use', task: 'Check blades and wheels; empty or connect dust extraction.' },
      { interval: 'Weekly', task: 'Clean guards and vents; check the cable or battery.' },
      { interval: 'Every few months', task: 'Have brushes on corded models checked.' },
      { interval: 'As needed', task: 'Replace worn diamond blades as a pair on twin-blade chasers.' },
    ],
    faqs: [
      { q: 'Why use a wall chaser instead of a grinder?', a: 'A chaser cuts two parallel lines at a set depth in one pass, with dust extraction, so the groove is neat and faster to finish than freehand grinder cuts.' },
      { q: 'Do I need dust extraction?', a: 'Yes. Cutting masonry releases silica dust; connect an extractor and wear respiratory protection.' },
      { q: 'Cordless or corded?', a: 'Corded tools suit long runs of chasing and deep cuts. Cordless tools suit small jobs where power is not close.' },
    ],
    related: ['makita-rotary-combination-hammers', 'makita-concrete-planers-power-scrapers', 'makita-angle-grinders'],
  },
  {
    family: 'concrete-planers-power-scrapers', category: 'concrete-tools',
    name: 'Makita Concrete Planers & Power Scrapers',
    h1: 'Makita Concrete Planers and Power Scrapers',
    title: 'Makita Concrete Planers & Power Scrapers | Tanzania',
    description: 'Makita concrete planers and power scrapers for levelling concrete and removing tiles and scale, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Concrete planers grind concrete surfaces flat with a diamond cup wheel and dust shroud, and power scrapers chisel off tiles, render and scale. On a plant they prepare concrete pads and plinths before equipment is set down, level high spots and remove old coatings. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: '125 mm planers; SDS-PLUS power scrapers',
    searchTerms: ['makita concrete planer', 'concrete grinder Tanzania', 'power scraper', 'makita PC5000C', 'concrete surface preparation'],
    applications: ['Levelling concrete plinths before installing equipment', 'Removing high spots and old coatings', 'Removing tiles, render and scale', 'Preparing surfaces for grout or coatings'],
    maintenance: [
      { interval: 'Every use', task: 'Check the cup wheel and shroud brushes; keep the dust extraction connected.' },
      { interval: 'Weekly', task: 'Clean vents and check the cable or battery.' },
      { interval: 'Every few months', task: 'Have brushes on corded models checked.' },
      { interval: 'As needed', task: 'Replace worn cup wheels and chisels.' },
    ],
    faqs: [
      { q: 'Can a concrete planer replace grouting?', a: 'No. It removes high spots and prepares the surface; machine bases still need correct grouting to the designer’s specification.' },
      { q: 'How do I keep dust down?', a: 'Use the dust shroud with an extractor and wear respiratory protection.' },
      { q: 'Scraper or hammer?', a: 'A power scraper suits wide flat chisels for tiles and coatings; a demolition hammer suits breaking concrete itself.' },
    ],
    related: ['makita-wall-chasers-tile-cutters', 'makita-demolition-hammers-breakers', 'makita-angle-grinders'],
  },
  {
    family: 'angle-grinders', category: 'metalwork-tools',
    name: 'Makita Angle Grinders',
    h1: 'Makita Angle Grinders: Corded, LXT and XGT, 100–230 mm',
    title: 'Makita Angle Grinders, 100–230 mm | Tanzania',
    description: 'Makita angle grinders from 100 mm to 230 mm, corded and 18V LXT or 40V XGT cordless, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Angle grinders cut and grind steel, stone and concrete with abrasive and diamond discs, and are the most used power tool in a mine or plant workshop. Small 100–125 mm grinders suit cutting, deburring and weld preparation; large 180–230 mm grinders cut thicker sections and remove more material. Choose corded for all-day workshop use, or LXT and XGT cordless for work around the plant away from power. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: '100, 115, 125, 150, 180 and 230 mm',
    searchTerms: ['makita angle grinder', 'angle grinder price Tanzania', '230 mm grinder', 'makita GA9062', 'cordless grinder', 'grinder ya kukata chuma'],
    applications: ['Cutting steel sections, bolts and liners during maintenance', 'Grinding welds and preparing joints', 'Removing rust and paint before repairs', 'Cutting concrete and stone with diamond discs'],
    maintenance: [
      { interval: 'Every use', task: 'Check the disc for cracks and the guard position; never remove the guard.' },
      { interval: 'Weekly', task: 'Clean the air vents; check the cable or battery, side handle and switch.' },
      { interval: 'Every few months', task: 'Have brushes on corded models checked and replaced.' },
      { interval: 'As needed', task: 'Use discs rated for the grinder’s speed and size.' },
    ],
    faqs: [
      { q: 'Which size grinder do I need?', a: '115 or 125 mm for most cutting and grinding in a workshop. 180 or 230 mm for cutting thick sections and heavy grinding. Many workshops keep both.' },
      { q: 'Paddle or slide switch?', a: 'A paddle switch stops the grinder as soon as it is released, which many sites require for safety. A slide switch can lock on for long grinding. Check your site rules.' },
      { q: 'Are cordless grinders powerful enough?', a: 'The 40V XGT models are close to corded 1 000 W class grinders and suit most maintenance work. For all-day heavy cutting, corded large grinders are still the standard.' },
    ],
    related: ['makita-metal-cutters-cut-off-saws', 'makita-die-straight-bench-grinders', 'makita-sanders-polishers'],
  },
  {
    family: 'die-straight-bench-grinders', category: 'metalwork-tools',
    name: 'Makita Die, Straight & Bench Grinders',
    h1: 'Makita Die Grinders, Straight Grinders and Bench Grinders',
    title: 'Makita Die, Straight & Bench Grinders | Tanzania',
    description: 'Makita die grinders, straight grinders and bench grinders for precision grinding and sharpening, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Die grinders and straight grinders hold small grinding points and wheels for deburring, porting and grinding in tight spaces, and bench grinders sharpen chisels, drill steels and tools in the workshop. These are the precision tools of a maintenance workshop. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: '6 mm and 8 mm collets; 125–150 mm straight grinders; 150–205 mm bench grinders',
    searchTerms: ['makita die grinder', 'bench grinder Tanzania', 'straight grinder', 'makita GD0602', 'tool sharpening grinder'],
    applications: ['Deburring and finishing machined and welded parts', 'Grinding inside pipes and castings', 'Sharpening chisels, drill steels and tools', 'Fine grinding in tight spaces'],
    maintenance: [
      { interval: 'Every use', task: 'Check grinding points and wheels for damage; keep tool rests close to bench wheels.' },
      { interval: 'Weekly', task: 'Clean vents and check cables or batteries.' },
      { interval: 'Every few months', task: 'Have brushes on corded models checked.' },
      { interval: 'As needed', task: 'Dress bench wheels and replace worn points.' },
    ],
    faqs: [
      { q: 'Die grinder or straight grinder?', a: 'Die grinders are small and fast for points and burrs; straight grinders take larger wheels for heavier grinding inside pipes and on castings.' },
      { q: 'Paddle or slide switch on a die grinder?', a: 'A paddle (dead-man) switch stops the tool when released; a slide switch with lock-on suits long jobs. Follow your site rules.' },
      { q: 'Can a bench grinder sharpen drill steels?', a: 'Yes, with the right wheel and care not to overheat the carbide. Follow the drill-steel maker’s regrinding guidance.' },
    ],
    related: ['makita-angle-grinders', 'makita-sanders-polishers', 'pneumatic-rock-drill'],
  },
  {
    family: 'sanders-polishers', category: 'metalwork-tools',
    name: 'Makita Sanders & Polishers',
    h1: 'Makita Sanders and Polishers: Disc, Angle and Random Orbit',
    title: 'Makita Sanders & Polishers | Tanzania',
    description: 'Makita disc sanders, angle sanders and polishers, corded and cordless, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Sanders and polishers prepare and finish surfaces: disc and angle sanders remove rust, paint and weld marks from steel, and polishers finish painted and metal surfaces. On a plant they prepare steelwork before painting and finish fabricated parts. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: '150 mm and 180 mm pads',
    searchTerms: ['makita polisher', 'disc sander Tanzania', 'angle sander', 'makita random orbit polisher', 'surface preparation tools'],
    applications: ['Removing rust and paint before painting steelwork', 'Smoothing welds on fabricated parts', 'Polishing painted and metal surfaces', 'Surface preparation for coatings'],
    maintenance: [
      { interval: 'Every use', task: 'Check pads and discs; replace worn backing pads.' },
      { interval: 'Weekly', task: 'Clean vents and check cables or batteries.' },
      { interval: 'Every few months', task: 'Have brushes on corded models checked.' },
      { interval: 'As needed', task: 'Use pads rated for the tool’s speed.' },
    ],
    faqs: [
      { q: 'Sander or grinder for removing rust?', a: 'A sander with a flap or sanding disc removes rust with less gouging than a grinder, leaving a better surface for paint.' },
      { q: 'What is a random orbit polisher?', a: 'It rotates and oscillates the pad, which avoids swirl marks on finished surfaces.' },
      { q: 'Cordless or corded?', a: 'Corded for long surface-preparation jobs; cordless for small areas and touch-ups away from power.' },
    ],
    related: ['makita-angle-grinders', 'makita-die-straight-bench-grinders'],
  },
  {
    family: 'metal-cutters-cut-off-saws', category: 'metalwork-tools',
    name: 'Makita Metal Cutters & Cut-off Saws',
    h1: 'Makita Metal Cutters and Cut-off Saws',
    title: 'Makita Metal Cutters & Cut-off Saws | Tanzania',
    description: 'Makita abrasive cut-off saws, cold-cut metal saws and cordless metal cutters, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Cut-off saws and metal cutters make straight, square cuts in steel sections, pipe and bar. Abrasive cut-off saws are fast and simple; cold-cut metal saws leave cleaner, cooler cuts with fewer sparks; cordless cutters bring the cut to the job. They are core workshop tools for repairs, fabrication and installation. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: '76 mm to 405 mm blades and wheels',
    searchTerms: ['makita cut off saw', 'metal cutting saw Tanzania', 'makita LW1401', 'cold cut saw', 'cordless metal cutter'],
    applications: ['Cutting steel sections, angle and channel to length', 'Cutting pipe for plant repairs', 'Cutting bolts and small bar in tight spaces', 'Cutting aluminium composite panels (groove cutter)'],
    maintenance: [
      { interval: 'Every use', task: 'Check the wheel or blade, guard and clamp; clear swarf.' },
      { interval: 'Weekly', task: 'Clean the base and vents; check the cable or battery.' },
      { interval: 'Every few months', task: 'Have brushes on corded models checked.' },
      { interval: 'As needed', task: 'Replace wheels and blades rated for the saw.' },
    ],
    faqs: [
      { q: 'Abrasive or cold-cut saw?', a: 'Abrasive saws are cheaper and cut most steel quickly but produce sparks and heat. Cold-cut saws leave cleaner cuts with less heat and fewer sparks and cost more per blade.' },
      { q: 'What is the difference between LW1400 and LW1401?', a: 'Both are 2 200 W, 355 mm saws. The LW1400 adds tool-less wheel changes and guide adjustment; the LW1401 is the basic version.' },
      { q: 'When should I use a cordless cutter?', a: 'For cuts away from the workshop or in tight spaces, such as bolts and small bar on installed equipment.' },
    ],
    related: ['makita-portable-band-saws', 'makita-angle-grinders', 'makita-shears-nibblers-punchers'],
  },
  {
    family: 'portable-band-saws', category: 'metalwork-tools',
    name: 'Makita Portable Band Saws',
    h1: 'Makita Portable Band Saws: Spark-free Metal Cutting',
    title: 'Makita Portable Band Saws | Tanzania',
    description: 'Makita corded and cordless portable band saws for spark-free cutting of pipe, bar and bolts, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Portable band saws cut pipe, bar, bolts and sections with a continuous blade and almost no sparks, which makes them the safer choice where sparks are a fire risk, such as near fuel, solvents or dusty areas. They cut cleanly and quietly for repairs on installed equipment. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: 'Cutting capacity 66 mm to 127 mm',
    searchTerms: ['makita portable band saw', 'cordless band saw', 'spark free metal cutting', 'makita DPB183', 'pipe cutting saw Tanzania'],
    applications: ['Spark-free cutting near fuel and solvents', 'Cutting pipe and bar on installed equipment', 'Cutting bolts and threaded rod', 'Quiet cutting in occupied areas'],
    maintenance: [
      { interval: 'Every use', task: 'Check blade tension and teeth; clear swarf from the wheels.' },
      { interval: 'Weekly', task: 'Check blade guides and tyres; clean vents.' },
      { interval: 'As needed', task: 'Replace blades with the right tooth pitch for the material.' },
      { interval: 'Every few months', task: 'Have the corded model’s brushes checked.' },
    ],
    faqs: [
      { q: 'Why choose a band saw over a grinder?', a: 'It cuts with very few sparks and less noise, and leaves a square cut. That matters near flammable materials.' },
      { q: 'Which blade should I use?', a: 'Use a finer tooth pitch for thin-wall pipe and a coarser pitch for solid bar.' },
      { q: 'Cordless or corded?', a: 'Cordless for work on installed equipment around the plant; corded for regular workshop cutting.' },
    ],
    related: ['makita-metal-cutters-cut-off-saws', 'makita-rod-cutters'],
  },
  {
    family: 'shears-nibblers-punchers', category: 'metalwork-tools',
    name: 'Makita Shears, Nibblers & Hole Punchers',
    h1: 'Makita Metal Shears, Nibblers and Hole Punchers',
    title: 'Makita Shears, Nibblers & Punchers | Tanzania',
    description: 'Makita metal shears, nibblers, cement shears and cordless hole punchers for sheet metal and board, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Shears and nibblers cut sheet steel cleanly without the heat and sparks of a grinder, nibblers follow curves and shapes, and hole punchers make clean holes in plate and channel without drilling. They are used to make guards, covers, ducting and cladding in the workshop and on site. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: 'Sheet up to 2.0 mm (shears); holes 6–20 mm (punch)',
    searchTerms: ['makita metal shear', 'nibbler Tanzania', 'cordless hole puncher', 'sheet metal cutter', 'makita DJS200'],
    applications: ['Cutting sheet steel for guards and covers', 'Cutting shapes and openings in ducting', 'Punching holes in plate and channel for fixings', 'Cutting fibre-cement board (cement shear)'],
    maintenance: [
      { interval: 'Every use', task: 'Check blades or punch and die for wear; keep them clean.' },
      { interval: 'Weekly', task: 'Lubricate as the manual specifies; check the cable or battery.' },
      { interval: 'As needed', task: 'Replace blades, punches and dies as a set.' },
      { interval: 'Every few months', task: 'Have brushes on corded models checked.' },
    ],
    faqs: [
      { q: 'Shear or nibbler?', a: 'A shear cuts straight and gentle curves quickly with clean edges. A nibbler cuts tighter shapes and openings without distorting the sheet.' },
      { q: 'Why punch instead of drill?', a: 'A punch makes a clean hole in seconds without swarf or a drill bit wandering, which speeds up fitting brackets and channel.' },
      { q: 'What thickness can they cut?', a: 'Check each model’s capacity; the cordless shears listed cut up to 1.3 mm or 2.0 mm steel.' },
    ],
    related: ['makita-metal-cutters-cut-off-saws', 'makita-angle-grinders'],
  },
  {
    family: 'rod-cutters', category: 'metalwork-tools',
    name: 'Makita Rod Cutters',
    h1: 'Makita Rebar and Threaded Rod Cutters',
    title: 'Makita Rebar & Threaded Rod Cutters | Tanzania',
    description: 'Makita cordless rebar cutters and threaded rod cutters, 18V LXT and 12V CXT, available through Bart Mining in partnership with Makita Tanzania.',
    summary: 'Rod cutters shear steel bar and threaded rod cleanly with a cutting die instead of an abrasive wheel, so there are no sparks, little noise and no burrs to file off. Rebar cutters cut reinforcing bar for foundations and supports; threaded rod cutters cut M6 to M10 rod for hangers and fixings. These Makita models are available through Bart Mining in partnership with Makita Tanzania.',
    sizes: 'Rebar 3–25 mm; threaded rod M6–M10',
    searchTerms: ['makita rebar cutter', 'threaded rod cutter', 'cordless rebar cutter Tanzania', 'makita DSC163', 'steel rod cutter'],
    applications: ['Cutting rebar for foundations and plinths', 'Cutting threaded rod for pipe and cable hangers', 'Spark-free cutting in occupied areas', 'Repetitive cutting during installation'],
    maintenance: [
      { interval: 'Every use', task: 'Check the cutting dies for wear and clean them.' },
      { interval: 'Weekly', task: 'Check battery contacts and the body for damage.' },
      { interval: 'As needed', task: 'Replace dies matched to the rod size.' },
      { interval: 'As specified', task: 'Service as the Makita manual specifies.' },
    ],
    faqs: [
      { q: 'Why not use a grinder?', a: 'A rod cutter shears the bar in seconds with no sparks or burrs and no discs to replace, which is faster and safer for repeated cuts.' },
      { q: 'Which dies do I need?', a: 'Threaded rod cutters need dies matched to each thread size (M6, M8, M10).' },
      { q: 'Is 12V CXT enough?', a: 'For M6 to M10 threaded rod, yes. For rebar, use the 18V LXT rebar cutters.' },
    ],
    related: ['makita-power-cutters', 'makita-portable-band-saws', 'makita-rotary-combination-hammers'],
  },
]

export const MAKITA_FAMILIES = FAMILIES.map(f => ({ ...f, slug: `makita-${f.family}` }))

function familySpecs(f: FamilyCopy) {
  const products = MAKITA_PRODUCTS.filter(p => p.family === f.family)
  const models = products.reduce((n, p) => n + p.models.length, 0)
  const codes = products.reduce((n, p) => n + p.models.reduce((m, x) => m + x.codes.length, 0), 0)
  const platforms = [...new Set(products.map(p => PLATFORM_LABEL[p.platform] ?? p.platform))]
  return [
    { label: 'Brand', value: 'Makita' },
    { label: 'Main products', value: products.map(p => p.name).join(', ') },
    { label: 'Models listed', value: `${models} models (${codes} kit codes)` },
    { label: 'Power options', value: platforms.join(', ') },
    { label: 'Sizes', value: f.sizes },
    { label: 'Availability', value: 'Through Bart Mining in partnership with Makita Tanzania; confirm the model and kit when you enquire' },
  ]
}

const LABELS: Record<EquipCategory, string> = {
  earthmoving: '', hoisting: '', processing: '', minerals: '', exploration: '', pumping: '', safety: '', software: '', power: '',
  'concrete-tools': 'Concrete & Demolition Power Tools',
  'metalwork-tools': 'Metalworking Power Tools',
}

export const MAKITA_EQUIPMENT: Equipment[] = MAKITA_FAMILIES.map(f => ({
  slug: f.slug,
  name: f.name,
  h1: f.h1,
  title: f.title,
  description: f.description,
  summary: f.summary,
  category: f.category,
  categoryLabel: LABELS[f.category],
  searchTerms: f.searchTerms,
  specs: familySpecs(f),
  applications: f.applications,
  maintenance: f.maintenance,
  faqs: f.faqs,
  related: f.related,
  brand: 'Makita',
  image: `/equipment/website/${f.slug}.webp`,
  imageAlt: `${f.name}`,
  updated: '2026-10-07',
  readTime: '6 min read',
}))
