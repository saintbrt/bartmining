import type { Post } from '../types'
import { cta } from './cta'
import { POSTS_BATCH_2 } from './posts-batch-2'

/*
 * First batch, from docs/BARTMINING-SOCIAL.md §5.
 *
 * Copy rules:
 * - Use a clear title, question or instruction that names the subject directly.
 *   Headlines use title case and express one idea within three lines.
 *   Supporting copy explains the situation, action and reason in connected
 *   sentences with an explicit subject. Avoid bare checklist instructions.
 *   Direct requests are appropriate in CTAs; short labels are fine in eyebrows.
 *   Avoid slogans, clipped fragments, vague promises and unexplained jargon.
 * - Every numerical claim comes from the named insight file. Team facts come
 *   from src/data/authors.ts; IG-12 uses /delivery-shipping. Equipment posts
 *   without an insight use the corresponding equipment page.
 * - Copy is pending the named owner’s factual sign-off before publication.
 * - Text in [square brackets] is an outline placeholder. The tool flags it and
 *   it must be replaced before export.
 * - `social/<file>` images that don't exist yet render as "Image needed".
 *   Drop the file into tools/social-carousel/images/ with that exact name.
 */

export const ORIGINAL_POSTS: Post[] = [
  {
    id: 'IG-11',
    title: "Alluvial Gold Processing During the Rains",
    pillar: 'edu',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'recovering-gold-rainy-season',
    slides: [
      {
        id: 'cover',
        template: 'photo-overlay',
        headline: "How to Process Alluvial Gold During the Rains",
        image: "social/river-sluice-processing-v2.png",
        note: 'Cover image needed: alluvial wash plant or pit in wet, muddy conditions. Portrait, ≥1080×1350, no people.',
        sub: "During the rainy season, the way your plant handles clay, screens the feed and manages water affects how much gold it can recover.", crop: {"x":50,"y":50,"zoom":1} },
      {
        id: 'clay', image: "social/alluvial-wet-clay.png",
        template: 'cover-dark',
        eyebrow: "Clay and recovery",
        headline: "Clay Can Trap Gold During the Rainy Season",
        sub: "Gold can stay trapped in clay lumps that leave with the waste. Muddy water also makes fine gold harder to recover.", crop: {"x":50,"y":50,"zoom":1} },
      {
        id: 'scrub',
        template: 'photo-overlay',
        eyebrow: "Feed preparation",
        headline: "Scrubbing Releases Gold Trapped in Clay",
        image: "equipment/rotary-scrubber.jpeg",
        sub: "A rotary scrubber releases gold trapped in clay. A coarse screen then removes stones before the finer material reaches the next screen.", crop: {"x":50,"y":50,"zoom":1} },
      {
        id: 'two-mm',
        template: 'stat',
        eyebrow: "Feed size",
        stat: "< 2 mm",
        headline: "This Concentrator Setup Needs Feed Below 2 mm",
        image: "social/alluvial-fine-screen.png",
        sub: "In the setup described in this guide, a sluice or jig treats the 2–16 mm material so coarser gold can also be recovered.", crop: {"x":50,"y":50,"zoom":1} },
      {
        id: 'recovery', image: "equipment/shaking-table-gold.jpg",
        template: 'stat',
        eyebrow: "Recovery estimate",
        stat: "Ore test",
        headline: "Ore Tests Help You Estimate Gold Recovery",
        sub: "Testing a representative ore sample before choosing equipment helps you estimate recovery, which depends on gold particle size, liberation and clay content.", crop: {"x":50,"y":50,"zoom":1} },
      {
        id: 'site',
        template: 'photo-overlay',
        eyebrow: "Site preparation",
        headline: "Site Preparation Helps You Manage Heavy Rain",
        image: "equipment/submersible-dewatering-pump.jpg",
        sub: "Before the rains arrive, your site needs drainage, pit dewatering, covered stockpiles and settling ponds that can handle heavy rain.", crop: {"x":50,"y":50,"zoom":1} },
      cta("Prepare Your Wash Plant for the Rains", "When you contact us about preparing for the rains, please describe your ore and current setup."),
    ],
    caption: "Wet clay can reduce gold recovery during the rainy season.\n\nGold can stay trapped in clay lumps, while muddy water makes fine gold harder to recover. Scrubbing releases gold from clay, while screening prepares the feed for recovery equipment. The site also needs water recycling, drainage, covered stockpiles and settling ponds.\n\nRead the full guide through the link in our bio.\n\nTo discuss your equipment or processing needs, WhatsApp +255 759 141 705.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.",
    hashtags: ['#AlluvialGold', '#GoldProcessing', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-07',
    title: "Meet Allan Bartholomew",
    pillar: 'team',
    status: 'review',
    signOff: 'allan',
    slides: [
      {
        id: 'cover',
        template: 'light-card',
        eyebrow: "Meet the team",
        headline: "Meet Allan Bartholomew",
        image: "team/allan-bartholomew.jpg",
        crop: {"x":50,"y":12,"zoom":1},
        note: 'Only approved portrait. 600×682, so light-card only (never full bleed).',
        sub: "Allan is Head of Business Development and Partnerships at Bart Mining. With extensive experience supporting projects across Tanzania, he is committed to working tirelessly to meet your needs and exceed your expectations.",
      },
      {
        id: 'sourcing', image: "social/mining-equipment-dispatch.png",
        template: 'cover-dark',
        eyebrow: "Equipment sourcing",
        headline: "Allan Helps You Source Mining Equipment",
        sub: "He leads equipment sourcing and supply for mining operators across Tanzania.", crop: {"x":50,"y":50,"zoom":1} },
      {
        id: 'landed-cost', image: "social/machinery-export-crates.png",
        template: 'cover-dark',
        eyebrow: "Cost planning",
        headline: "Allan Helps You Plan Equipment Costs",
        sub: "His work includes landed-cost and procurement planning, helping you account for import and logistics costs.", crop: {"x":50,"y":50,"zoom":1} },
      {
        id: 'delivery', image: "social/equipment-delivery-generated.png",
        template: 'cover-dark',
        eyebrow: "Delivery logistics",
        headline: "Allan Coordinates Equipment Delivery",
        sub: "Allan coordinates the logistics of transporting mining equipment to your site.", crop: {"x":50,"y":50,"zoom":1} },
      {
        id: 'maintenance', image: "social/pump-maintenance-generated.png",
        template: 'cover-dark',
        eyebrow: "Repairs and maintenance",
        headline: "Allan Coordinates Repairs and Maintenance",
        sub: "He also coordinates repair and maintenance operations for mining equipment.", crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss Your Equipment Needs with Allan", "When you contact Allan, please explain whether you need equipment, delivery or help arranging repairs and maintenance. Include your site location."),
    ],
    caption: "Allan is Head of Business Development and Partnerships at Bart Mining. With extensive experience supporting projects across Tanzania, he is committed to working tirelessly to meet your needs and exceed your expectations.\n\nAllan leads equipment sourcing and supply, landed-cost and procurement planning, and client relationships with mining operators across Tanzania. He also coordinates equipment delivery logistics and repair and maintenance operations.\n\nWhether you are planning an equipment purchase, arranging delivery or need help coordinating repairs and maintenance, tell Allan what you need and where your site is.\n\nTo discuss your equipment needs, WhatsApp +255 759 141 705.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.",
    hashtags: ['#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },


  {
    id: 'IG-05',
    title: "Centrifugal Gold Concentrators",
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'single', template: 'light-card', eyebrow: "What Is a Centrifugal Concentrator?", headline: "A Centrifugal Concentrator Recovers Free Gold", image: "equipment/centrifugal-gold-concentrator.jpg", note: 'Single image post. Check the claim against the equipment page.', sub: "A centrifugal concentrator spins slurry in a bowl to separate free gold from lighter material. Screened feed and clean water help the unit work effectively.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'feed', template: 'light-card', eyebrow: "How Do You Prepare the Feed?", headline: "The Feed Needs Screening Before Recovery", sub: "A screen removes oversized material before slurry reaches the concentrator. Gold also needs to be released from the rock so the bowl can separate it by density.", image: 'social/concentrator-feed-preparation.png', crop: { x: 50, y: 50, zoom: 1 } },
      { id: 'water', template: 'light-card', eyebrow: "Why Does Clean Water Matter?", headline: "Clean Water Keeps the Bowl Working", sub: "The concentrator needs clean water at a regulated pressure. Silt can block the bowl’s fluidisation holes, so the supply needs checking during each operating shift.", image: 'social/concentrator-clean-water-supply.png', crop: { x: 50, y: 50, zoom: 1 } },
      { id: 'selection', template: 'light-card', eyebrow: "How Do You Choose a Concentrator?", headline: "Ore Tests Guide the Unit You Need", sub: "Before choosing a concentrator, you need to understand your ore, feed rate and water supply. The bowl size and discharge cycle also need to suit your plant.", image: 'social/concentrator-bowl-selection.png', crop: { x: 50, y: 50, zoom: 1 } },
      cta("Discuss a Concentrator for Your Site", "For a quotation, please include your ore tests, target throughput, feed size and available water supply."),
    ],
    caption: "A centrifugal concentrator separates free gold from lighter material by spinning ore mixed with water in a bowl. Denser particles collect in the bowl\u2019s riffles while lighter material flows out. The process uses water rather than mercury or cyanide.\n\nThe gold needs to be released from the surrounding rock before gravity separation can recover it. A concentrator cannot recover gold that remains locked inside other minerals, so ore tests and suitable grinding matter when planning the circuit.\n\nThe unit needs screened feed, suitable slurry flow and a clean, pressure-regulated water supply. Silt in the water or oversized feed can block the bowl\u2019s fluidisation holes and reduce performance.\n\nBefore choosing a unit, we need to understand your ore, target throughput and existing equipment so its size and operating requirements suit your plant.\n\nTo discuss a centrifugal concentrator for your site, WhatsApp +255 759 141 705.\n\nThe feed, water-supply and concentrator-bowl images are AI-generated illustrations of generic equipment, not photographs of Bart Mining equipment or operations.",
    hashtags: ['#GoldProcessing', '#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },

  

  {
    id: 'IG-12',
    title: "Equipment Delivery to the Lake Zone",
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', image: "social/excavator-transport.jpg", template: 'light-card', eyebrow: "Delivery", headline: "Mining Equipment Delivery to the Lake Zone", sub: "Before equipment is dispatched, the delivery plan needs to account for the route, cargo handling and access to your site.", crop: {"x":54,"y":50,"zoom":1} },
      { id: 'origins', template: 'light-card', eyebrow: "Dispatch points", headline: "Delivery Can Start from Dar es Salaam or Mwanza", image: "social/lake-zone-route-map.png", note: 'Route-map graphic (portrait). No Bart Mining yard or truck photos.', sub: "The dispatch point depends on your order, so it needs to be confirmed when you arrange delivery to your site.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'times', image: "social/generator-delivery-truck.png", template: 'light-card', eyebrow: "Delivery estimates", headline: "Delivery Time Depends on the Route and Cargo", sub: "The delivery page provides district estimates for planning, while your quotation confirms the delivery window for your order.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'support', image: "social/packed-mining-spare-parts.png", template: 'light-card', eyebrow: "Insurance and parts", headline: "Insurance and Parts Need to Be Agreed", sub: "Before ordering, you need to confirm the transit cover, replacement parts arrangements and wear parts your site should hold.", crop: {"x":50,"y":50,"zoom":1} },
      cta("Request a Delivery Quote for Your Site", "To request a delivery quotation, please include your district, equipment details and site access information."),
    ],
    caption: "Planning equipment delivery to the Lake Zone starts with your site and cargo details.\n\nThe route, dispatch point, load size and site access affect the delivery plan. District times on our delivery page are planning estimates, while your quotation confirms the delivery window for your order. Offloading, transit insurance and spare parts support also need to be agreed before dispatch.\n\nSee the delivery guide through the link in our bio.\n\nFor a delivery quotation, WhatsApp +255 759 141 705.\n\nPhoto: Roger Starnes Sr. Unsplash License (https://unsplash.com/license). Source: https://unsplash.com/photos/yellow-excavator-loaded-on-a-flatbed-trailer-8f8OYBy3z4U. Cropped for the carousel.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.",
    hashtags: ['#MiningEquipment', '#Geita', '#Mwanza', '#BartMining'],
  },

  {
    id: 'IG-10',
    title: "Gold Plant Costs in Tanzania",
    pillar: 'edu',
    status: 'review',
    signOff: 'allan',
    sourceInsight: 'gold-plant-setup-cost',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: "What Does a Gold Plant Cost in Tanzania?", image: "social/gold-plant-sunrise.jpg", sub: "These equipment ranges can help with early planning, but the full cost depends on your ore, the processing route and the conditions at your site.", crop: {"x":72,"y":50,"zoom":1} },
      { id: 'b1', image: "social/small-gravity-plant.png", template: 'stat', eyebrow: "Gravity-only plant", stat: "USD 60k–200k", headline: "Equipment for a Gravity-Only Plant", sub: "For a gravity-only plant treating free-milling ore at 10–30 tonnes per day, this range covers equipment supply before delivery and site costs are added.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'b2', image: "social/gravity-and-leach-plant.png", template: 'stat', eyebrow: "Gravity and CIL", stat: "USD 400k–900k", headline: "Equipment for Gravity Recovery and CIL", sub: "For suitable free-milling ore at 50 tonnes per day, this equipment range includes gravity recovery and CIL, which adds leaching and gold recovery from solution.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'b3', image: "social/large-agitated-tank-plant.png", template: 'stat', eyebrow: "Larger CIL plant", stat: "USD 800k–2m+", headline: "Equipment for a Larger CIL Plant", sub: "This equipment range applies to a CIL plant treating free-milling ore at 100 tonnes per day and above, with larger projects potentially costing more.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'b4', image: "social/freight-port.jpg", template: 'stat', eyebrow: "Additional delivery costs", stat: "+25–45%", headline: "Freight and Import Costs Add to the Price", sub: "The guide estimates this addition to the supplier’s price before shipping for a Lake Victoria Goldfields site. Site works and working capital are additional.", crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss the Full Cost of Your Gold Plant", "To discuss a plant budget, please include your ore tests, target tonnage and site conditions."),
    ],
    caption: "A gold plant’s equipment price is only part of the setup cost.\n\nThe guide gives indicative US-dollar equipment ranges for free-milling ore. These exclude freight, duty, civil works, power generation, tailings facilities and working capital. Ore tests and a full project quotation provide a better basis for your budget.\n\nRead the full guide through the link in our bio.\n\nTo discuss your equipment or processing needs, WhatsApp +255 759 141 705.\n\nPhoto: Calistemon. CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0). Source: https://commons.wikimedia.org/wiki/File:Sunrise_Dam_Gold_Mine_plant_01.jpg. Cropped for the carousel. The adapted photo slide is shared under the same license.\n\nPhoto: Andrea Musto. Pexels License (https://www.pexels.com/license/). Source: https://www.pexels.com/photo/a-port-with-shipping-containers-and-cranes-13025947/. Cropped for the carousel.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.\n\nThe plant photograph shows Sunrise Dam Gold Mine in Western Australia and is illustrative; it does not represent a quoted plant configuration or price.",
    hashtags: ['#GoldProcessing', '#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-08',
    title: "Meet Bartholomew Ambrose",
    pillar: 'team',
    status: 'review',
    signOff: 'bartholomew',
    slides: [
      { id: 'cover', template: 'cover-dark', eyebrow: "Founder", headline: "Meet Our Founder, Bartholomew Ambrose", note: 'No portrait (photo policy). Text-only cover; initials removed.', sub: "He has more than 25 years of experience in exploration and mine operations.", },
      { id: 'career', image: "social/exploration-core-drill.png", template: 'cover-dark', eyebrow: "Career", headline: "His Experience Includes Resolute and Barrick", sub: "Bartholomew has led exploration programmes and operated producing mines.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'where', template: 'photo-overlay', eyebrow: "International experience", headline: "His Work Has Taken Him Across Four Continents", image: "social/exploration-core-trays.jpg", note: 'Generic stock exploration image (core trays / drill rig). No people.', sub: "He has worked on deposits in Tanzania, the DRC, Liberia, Brazil, Canada and Australia.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'principal', image: "social/geology-study-desk.jpg", template: 'cover-dark', eyebrow: "Technical leadership", headline: "Bartholomew Leads Our Technical Consulting", note: 'Bartholomew approves this wording.', sub: "He leads Bart Mining’s resource estimation and study work, as well as technical consulting.", crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss Your Mining Project with Us", "When you contact us, please describe your project and the technical advice you need."),
    ],
    caption: "Meet Bartholomew Ambrose, founder of Bart Mining.\n\nHe has more than 25 years of experience leading exploration programmes and operating producing mines, including work with Resolute Mining and Barrick Gold. His work has covered deposits in Africa, Brazil, Canada and Australia. The core-storage photograph is illustrative and is not from one of his projects. He leads our technical consulting, resource estimation and study work.\n\nTo discuss your project, WhatsApp +255 759 141 705.\n\nPhoto: Phil Whitehouse from London, United Kingdom. CC BY 2.0 (https://creativecommons.org/licenses/by/2.0). Source: https://commons.wikimedia.org/wiki/File:Core_samples_(3843897410).jpg. Cropped for the carousel.\n\nPhoto: Yena Kwon. Pexels License (https://www.pexels.com/license/). Source: https://www.pexels.com/photo/rocks-on-the-desk-8188036/. Cropped for the carousel.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.\n\nThe geology desk and exploration images are illustrative and do not show Bartholomew’s own project work.",
    hashtags: ['#MiningConsulting', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-02',
    title: "CIL, CIP and Heap Leaching",
    pillar: 'compare',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'cil-vs-cip-vs-heap-leach',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: "How Do CIL, CIP and Heap Leaching Differ?", image: "equipment/leaching-tank.jpg", sub: "The main difference is how the ore is leached and how dissolved gold is collected.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'cil', template: 'light-card', eyebrow: "Carbon in leach", headline: "CIL Leaches Gold and Collects It in the Same Tanks", image: "social/cil-agitated-tank-illustration.png", sub: "Carbon in leach uses activated carbon to collect dissolved gold while leaching continues.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'cip', image: "social/carbon-adsorption-tanks.png", template: 'cover-dark', eyebrow: "Carbon in pulp", headline: "CIP Collects Gold After the Leaching Stage", sub: "Carbon in pulp moves the leached ore slurry into separate tanks where activated carbon collects the gold.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'heap', image: "social/heap-leach-colorado.jpg", template: 'cover-dark', eyebrow: "Heap leaching", headline: "Heap Leaching Treats Ore on a Lined Pad", sub: "In heap leaching, solution passes through crushed ore stacked on a lined pad, so the process needs suitable ore, enough space and a longer processing period.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'fit', image: "social/ore-sample-selection.jpg", template: 'cover-dark', eyebrow: "Process selection", headline: "Ore Tests Help You Choose the Process", sub: "Before choosing a method, you need to compare the test results, processing costs, water supply and site requirements.", crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss the Right Process for Your Ore", "When you contact us about process selection, please include your ore details and leach test results."),
    ],
    caption: "CIL, CIP and heap leaching recover gold through cyanide leaching, but their layouts differ.\n\nCIL combines leaching and carbon collection in the same tanks. CIP uses separate stages, while heap leaching passes solution through crushed ore on a lined pad. Ore tests, costs and site conditions help determine which process fits.\n\nRead the full guide through the link in our bio.\n\nTo discuss your equipment or processing needs, WhatsApp +255 759 141 705.\n\nPhoto: James St. John. CC BY 2.0 (https://creativecommons.org/licenses/by/2.0). Source: https://commons.wikimedia.org/wiki/File:Cyanide_leaching_of_low_grade_gold_ore_rock_piles_(above_Squaw_Gulch,_Cripple_Creek_Mining_District,_Colorado,_USA)_4.jpg. Cropped for the carousel.\n\nPhoto: MART PRODUCTION. Pexels License (https://www.pexels.com/license/). Source: https://www.pexels.com/photo/assorted-rocks-on-the-table-8471928/. Cropped for the carousel.\n\nThe heap-leaching photograph shows a site in Colorado and is illustrative.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.",
    hashtags: ['#GoldProcessing', '#GoldMining', '#TanzaniaMining', '#BartMining'],
  },


  {
    id: 'IG-09',
    title: "Mercury-Free Gold Recovery",
    pillar: 'edu',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'mercury-free-gold-recovery',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: "How to Recover Gold Without Mercury", image: "social/standalone-gravity-sluice.png", sub: "A gravity circuit can recover free gold and prepare a concentrate for smelting.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 's2', image: "social/fine-tailings-sediment.png", template: 'cover-dark', eyebrow: "Gold losses", headline: "Mercury Can Leave Fine Gold in the Tailings", sub: "Amalgamation can miss fine or coated gold. Testing your ore shows how much of that gold a gravity circuit could recover.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 's3', template: 'photo-overlay', eyebrow: "Gravity recovery", headline: "A Concentrator Recovers Gold Free from Rock", image: "social/centrifugal-concentrator-installation.png", sub: "For hard-rock ore, crushing and grinding release gold from the rock so it can be recovered by gravity separation.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 's4', template: 'photo-overlay', eyebrow: "Concentrate cleaning", headline: "Concentrate Cleaning Comes Before Smelting", image: "social/shaking-tables-geevor.jpg", sub: "A shaking table removes lighter material from the concentrate so that, once it is sufficiently clean, it can be smelted with fluxes.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 's5', image: "social/gravity-concentrate-circuit.png", template: 'stat', eyebrow: "Mercury-free recovery", stat: "0 g", headline: "A Gravity Circuit Needs No Mercury", sub: "Although a gravity circuit needs no mercury, it still needs power, water, maintenance and trained operators, with ore tests guiding equipment selection.", crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss Mercury-Free Gold Recovery", "When you contact us about mercury-free recovery, please describe your ore and milling setup."),
    ],
    caption: "Free gold can be recovered without using mercury.\n\nA centrifugal concentrator recovers gold by density, and a shaking table cleans the concentrate before smelting. For hard-rock ore, the gold must first be released by crushing and grinding. Ore tests and an assessment of your existing equipment help you plan the change.\n\nRead the full guide through the link in our bio.\n\nTo discuss your equipment or processing needs, WhatsApp +255 759 141 705.\n\nPhoto: Rich257. CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0). Source: https://commons.wikimedia.org/wiki/File:Geevor_tin_mine_shaking_tables.jpg. Cropped for the carousel. The adapted photo slide is shared under the same license.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.\n\nThe shaking-table photograph shows historical equipment at Geevor tin mine and illustrates the separation method, rather than a Bart Mining gold project.",
    hashtags: ['#GoldProcessing', '#GoldMining', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-06',
    title: "Modular Gold Plants",
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: "What Is a Modular Gold Plant?", headline: "A Modular Plant Needs a Prepared Site", image: "equipment/modular-gold-plant.jpg", sub: "A modular gold plant combines processing stages in units that can be transported and connected on site. Its layout needs to suit your ore tests and site conditions.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'cil', template: 'light-card', eyebrow: "Which Plant Modules Do You Need?", headline: "Ore Tests Determine the Modules You Need", image: "social/skid-mounted-processing-module.png", sub: "The layout can include crushing, milling and gravity recovery, with leaching added where the ore tests support it.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'elution', template: 'light-card', eyebrow: "How Do You Prepare the Site?", headline: "The Site Needs to Be Ready for Installation", image: "social/prepared-equipment-foundations.png", sub: "Before the plant arrives, the site needs foundations, power, water and unloading access. Your quotation should define the installation and commissioning support.", crop: {"x":50,"y":50,"zoom":1} },
      { id: 'cost', image: "equipment/diesel-generator-mining.jpg", template: 'light-card', eyebrow: "What Should Your Plant Budget Include?", headline: "Site Costs Form Part of the Plant Budget", sub: "The full plant budget includes equipment, delivery, foundations, power, water, tailings facilities and working capital.", crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss a Modular Plant for Your Site", "When you contact us about a modular plant, please include your ore tests, target output and site conditions."),
    ],
    caption: "A modular gold plant needs a site that is ready for installation.\n\nOre tests determine the processing modules, while the site needs foundations, power, water and access for unloading. The quotation should define installation, commissioning and operator training. The full budget also needs to include site preparation and operating costs.\n\nTo discuss your equipment or processing needs, WhatsApp +255 759 141 705.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.",
    hashtags: ['#GoldProcessing', '#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: "IG-13",
    title: "Ball Mills",
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: "What Is a Ball Mill?", headline: "A Ball Mill Grinds Ore to Release Gold", sub: "A ball mill uses tumbling steel balls to grind crushed ore and release gold from the surrounding rock. The required grind and ore hardness guide the choice of mill.", image: "social/ball-mill-small-clean-generated.png", note: "Source: /equipment/ball-mill-gold-ore. Allan reviews the quotation copy; Bartholomew reviews the technical claims." , crop: {"x":50,"y":50,"zoom":1} },
      { id: 'selection', image: "social/ball-mill-grinding-media.png", template: 'light-card', eyebrow: "How Do You Choose a Ball Mill?", headline: "Ore Hardness Determines the Mill You Need", sub: "Before buying a ball mill, you need to understand the ore hardness, required grind size and target throughput so the mill and motor can be sized for your ore." , crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss Ball Mills for Your Site", "For a quotation, please include your ore tests, target throughput and available power."),
    ],
    caption: "A ball mill needs to match the ore it will grind. A compact mill can suit a smaller processing circuit, with ore tests guiding the required size and power.\n\nOre hardness, feed size and target grind affect the required power and capacity. Testing a representative sample helps you select the mill, while grinding media and liners need to be included in the operating budget.\n\nYou can find the equipment guide through the link in our bio.\n\nFor a quotation, WhatsApp +255 759 141 705 with your ore tests, target throughput and available power.\n\nThe ball-mill and grinding-media images are AI-generated illustrations of generic equipment, not photographs of a supplied Bart Mining model. The cover illustrates a small mill; its capacity needs to be confirmed against your ore and required grind.",
    hashtags: ["#BallMills", '#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: "IG-14",
    title: "Jaw Crushers",
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: "How Does a Jaw Crusher Work?", headline: "A Jaw Crusher Reduces Large Rock for Processing", sub: "A jaw crusher compresses rock between fixed and moving plates to reduce its size. This prepares the material for the next crushing or grinding stage in your plant.", image: "equipment/jaw-crusher.jpg", note: "Source: /equipment/jaw-crusher. Allan reviews the quotation copy; Bartholomew reviews the technical claims." , crop: {"x":50,"y":50,"zoom":1} },
      { id: 'selection', image: "social/jaw-crusher-feed-opening.png", template: 'light-card', eyebrow: "How Do You Choose a Jaw Crusher?", headline: "Feed Size Determines the Crusher Opening", sub: "When selecting a jaw crusher, the largest rock size and required output need to be considered together so the feed opening and discharge setting suit your circuit." , crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss Jaw Crushers for Your Site", "For a quotation, please include your largest feed size, target output and required product size."),
    ],
    caption: "A jaw crusher is usually the first crushing stage in a hard-rock gold plant.\n\nThe largest rock size determines the feed opening, while the discharge setting affects product size and capacity. A controlled feed helps the crusher run steadily, and jaw plate wear needs to be included in maintenance planning.\n\nYou can find the equipment guide through the link in our bio.\n\nFor a quotation, WhatsApp +255 759 141 705 with your largest feed size, target output and required product size.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.",
    hashtags: ["#JawCrusher", '#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },


  {
    id: "IG-16",
    title: "Hammer Mills",
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: "How Does a Hammer Mill Work?", headline: "A Hammer Mill Crushes Ore by Impact", sub: "A hammer mill uses swinging hammers to break ore by impact. A discharge screen controls the size of material leaving the mill before it moves to the next stage.", image: "equipment/hammer-mill.jpg", note: "Source: /equipment/hammer-mill. Allan reviews the quotation copy; Bartholomew reviews the technical claims." , crop: {"x":50,"y":50,"zoom":1} },
      { id: 'selection', image: "social/hammer-mill-rotor-screen.png", template: 'light-card', eyebrow: "How Do You Choose a Hammer Mill?", headline: "Ore Conditions Affect Hammer and Screen Wear", sub: "Before investing in a hammer mill, it is important to assess the feed size, moisture and abrasiveness because these affect screen performance and wear costs." , crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss Hammer Mills for Your Site", "For a quotation, please include your feed size, ore moisture and preferred power source."),
    ],
    caption: "A hammer mill can provide a crushing stage for a small hard-rock operation.\n\nThe discharge screen controls the product size, while wet or sticky feed can block it. A hammer mill does not replace the fine grinding needed to release gold from hard rock, so its role needs to be assessed within the full circuit.\n\nYou can find the equipment guide through the link in our bio.\n\nFor a quotation, WhatsApp +255 759 141 705 with your feed size, ore moisture and preferred power source.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.",
    hashtags: ["#HammerMill", '#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: "IG-17",
    title: "Vibrating Screens",
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: "What Is a Vibrating Screen?", headline: "A Vibrating Screen Separates Rock by Size", sub: "A vibrating screen separates rock by size as smaller particles pass through its panels. Larger material moves to the next stage or returns for further crushing.", image: "social/vibrating-screen-stock.jpg", note: "Source: /equipment/vibrating-screen. Allan reviews the quotation copy; Bartholomew reviews the technical claims." , crop: {"x":50,"y":50,"zoom":1} },
      { id: 'selection', image: "social/vibrating-screen-panels.png", template: 'light-card', eyebrow: "How Do You Choose a Vibrating Screen?", headline: "Screen Selection Depends on the Required Product", sub: "When choosing a vibrating screen, you need to consider the feed rate and the sizes you want to separate so the screen area and openings suit your circuit." , crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss Vibrating Screens for Your Site", "For a quotation, please include your feed rate, moisture conditions and required size fractions."),
    ],
    caption: "A vibrating screen helps control the product size in a crushing circuit. The stock photograph shows a portable wet screening system as an example.\n\nCorrectly sized material can move forward while oversize returns for further crushing. Feed moisture, panel openings and available screen area affect performance, so screen selection needs to be considered alongside the crusher.\n\nYou can find the equipment guide through the link in our bio.\n\nFor a quotation, WhatsApp +255 759 141 705 with your feed rate, moisture conditions and required size fractions.\n\nPhoto: Peter Craven. CC BY 2.0 (https://creativecommons.org/licenses/by/2.0). Source: https://commons.wikimedia.org/wiki/File:MSU_10_being_lifted_by_skip_lorry_at_CDE_factory_(7368236992).jpg. Cropped for the carousel.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.",
    hashtags: ["#VibratingScreen", '#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: "IG-18",
    title: "Slurry Pumps",
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: "What Is a Slurry Pump?", headline: "A Slurry Pump Moves Water Mixed with Solids", sub: "A slurry pump moves water mixed with solids, such as mill discharge and tailings. Its components need to suit the abrasive material and required flow in your plant.", image: "equipment/slurry-pump.webp", note: "Source: /equipment/slurry-pump. Allan reviews the quotation copy; Bartholomew reviews the technical claims." , crop: {"x":50,"y":50,"zoom":1} },
      { id: 'selection', image: "social/slurry-pump-wear-liners.png", template: 'light-card', eyebrow: "How Do You Choose a Slurry Pump?", headline: "Pump Selection Depends on the Slurry and Route", sub: "Before selecting a slurry pump, you need to understand the required flow, solids content and pipeline pressure so the pump and liner material suit the slurry." , crop: {"x":50,"y":50,"zoom":1} },
      cta("Discuss Slurry Pumps for Your Site", "For a quotation, please include your slurry details, required flow and pipeline route."),
    ],
    caption: "A slurry pump needs to match the material and the pipeline it serves.\n\nFlow, solids content, particle size and the pressure needed to move the slurry affect the selection. The liner material also needs to suit the slurry, and replacement wear parts should be included in maintenance planning.\n\nYou can find the equipment guide through the link in our bio.\n\nFor a quotation, WhatsApp +255 759 141 705 with your slurry details, required flow and pipeline route.\n\nAI-generated images illustrate generic equipment and settings. They are not photographs of Bart Mining people, customer sites, equipment or operations.",
    hashtags: ["#SlurryPump", '#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },
]

export const POSTS: Post[] = [...ORIGINAL_POSTS, ...POSTS_BATCH_2]

/** Sidebar folders. Sections split a folder into labelled groups by pillar. */
export interface PostFolder {
  id: string
  label: string
  postIds: string[]
  sections?: { label: string; pillars: Post['pillar'][] }[]
}

export const POST_FOLDERS: PostFolder[] = [
  { id: 'original', label: 'Original posts', postIds: ORIGINAL_POSTS.map(p => p.id) },
  { id: 'news', label: 'News · October 2026', postIds: POSTS_BATCH_2.filter(p => p.pillar === 'news').map(p => p.id) },
  {
    id: 'informative',
    label: 'Informative content · October 2026',
    postIds: POSTS_BATCH_2.filter(p => p.pillar !== 'news').map(p => p.id),
    sections: [
      { label: 'Explainers', pillars: ['edu', 'compare'] },
      { label: 'Products', pillars: ['product', 'team'] },
    ],
  },
]
