/**
 * Generator rental: /generator-rental, the town pages under it, and the
 * Swahili page /jenereta-za-kukodi.
 *
 * Facts confirmed by Allan (3 Oct 2026): sizes 300 to 2,500 kVA; every hire
 * includes delivery and collection, installation and commissioning, an
 * operator who stays with the set on site, and servicing during the hire; prices are quoted
 * per enquiry and not published. Fuel is supplied by the customer. Minimum
 * hire: one week for industrial and site work, two days for events.
 * Smaller sets are open-frame, larger sets containerised (no size cut-off
 * given, so copy says "smaller" and "larger"). Fuel figures use 0.25 to
 * 0.30 litres per kWh, as on the diesel generator product page. Units are supplied through partner fleets,
 * so copy says "we rent generators" and never claims units in stock or a
 * fleet size.
 *
 * Town pages follow the same rule as src/data/locations.ts: each one must
 * say something true of that town and false of the others, or it shouldn't
 * exist.
 */

import { SITE } from '@/lib/seo'

/** Last real content change to the rental pages. Used as the sitemap lastModified; bump it when the copy changes. */
export const RENTAL_UPDATED = '2026-10-03'

export const RENTAL_MIN_KVA = 300
export const RENTAL_MAX_KVA = 2500

/** Standard set sizes we quote. Above the largest, sets run synchronised. */
export const RENTAL_SIZES = [300, 400, 500, 650, 800, 1000, 1250, 1500, 2000, 2500]

export const SIZE_BANDS: { range: string; typical: string; note: string }[] = [
  {
    range: '300 to 500 kVA',
    typical: 'Alluvial wash plants, small ball mill circuits, construction sites, hotels, offices and hospitals on standby',
    note: 'Covers most small gravity and wash plants, with headroom for motor starting when the largest motor has a soft starter.',
  },
  {
    range: '500 to 1,000 kVA',
    typical: 'Crushing and milling circuits, larger processing plants, factories, large construction and road projects',
    note: 'Sized on the largest motor and how it starts as much as on the total load.',
  },
  {
    range: '1,000 to 2,500 kVA',
    typical: 'Full processing plants, mine site power, industrial facilities, temporary power during grid works',
    note: 'Often supplied as two or more sets running synchronised, so one can be serviced while the others carry the load.',
  },
]

export const INCLUDED: { title: string; text: string }[] = [
  { title: 'Delivery and collection', text: 'The set is transported to your site and collected at the end of the hire, anywhere in Tanzania.' },
  { title: 'Installation and commissioning', text: 'Positioned, connected to your distribution board and tested under load before handover.' },
  { title: 'Operator on site', text: 'An operator stays with the generator for the whole hire, running it and checking it so faults are caught before they stop your work.' },
  { title: 'Servicing during the hire', text: 'Oil, filters and routine service on schedule, and breakdown response while the set is on hire.' },
]

/** Hire terms shown under "Included in every hire". */
export const HIRE_TERMS: { title: string; text: string }[] = [
  { title: 'Fuel', text: 'Supplied by you, the customer using the generator. We estimate the fuel use from your running hours so you can plan deliveries to site.' },
  { title: 'Minimum hire', text: 'One week for industrial, mining and construction work. Two days for events.' },
]

export interface Faq { q: string; a: string }

export const RENTAL_FAQS: Faq[] = [
  {
    q: 'What sizes of generator can I rent?',
    a: 'We rent generators from 300 kVA to 2,500 kVA. For loads larger than a single set, two or more generators run synchronised as one supply.',
  },
  {
    q: 'What size generator do I need?',
    a: 'Add up the running load, then check the largest motor and how it starts. A motor started direct on line draws six to seven times its running current for a few seconds, and that surge decides the generator size more often than the total load does. Use the calculator on this page for a first figure, then send us the load list and we will confirm it.',
  },
  {
    q: 'What is included in the hire?',
    a: 'Every hire includes delivery and collection, installation and commissioning, an operator who stays with the generator on site, and servicing during the hire period.',
  },
  {
    q: 'Are the generators open or containerised?',
    a: 'Smaller sets are supplied open-frame. Larger sets come in a container, which protects them from dust and rain, keeps the noise down and makes them easier to secure on site.',
  },
  {
    q: 'Who supplies the fuel?',
    a: 'The customer using the generator supplies the fuel. Tell us how many hours a day it will run and we will estimate the consumption, so you can plan deliveries to site.',
  },
  {
    q: 'What is the minimum hire period?',
    a: 'One week for industrial, mining and construction work, and two days for events.',
  },
  {
    q: 'How much does it cost to rent a generator?',
    a: 'It depends on the size, how long you need it, where the site is and how many hours a day it runs. We quote each hire individually: send the size or your load list, the site location and the dates by phone or WhatsApp and we will come back with a price.',
  },
  {
    q: 'What is the difference between prime and standby power?',
    a: 'A prime-rated generator is the main power source and runs for long hours at varying load, which is what a mine or plant off the grid needs. A standby rating is for backup during grid cuts and assumes limited running hours. If the generator will run your site every day, ask for prime power and size on the prime rating.',
  },
  {
    q: 'Can a rented generator run a ball mill or crusher?',
    a: 'Yes, as long as it is sized for the motor’s starting surge. A soft starter or variable speed drive on the largest motor usually reduces the generator size you need by more than the starter costs.',
  },
  {
    q: 'Do you deliver outside Dar es Salaam and Mwanza?',
    a: 'Yes, anywhere in Tanzania. Road time depends on the distance and the size of the set; the route planner on our delivery page gives realistic times by district.',
  },
]

export interface RentalTown {
  slug: string
  town: string
  region: string
  title: string
  description: string
  /** Answer-first opening paragraph. */
  summary: string
  /** What hires look like in this town specifically. */
  demand: { title: string; text: string }[]
  logistics: string[]
  faqs: Faq[]
  /** Alt text for the town hero image (public/generator-rental/town-<slug>). */
  imageAlt: string
  /** Related district supply page, and the place it covers if not the town itself. */
  supplyPage?: string
  supplyLabel?: string
}

export const RENTAL_TOWNS: RentalTown[] = [
  {
    slug: 'mwanza',
    town: 'Mwanza',
    region: 'Mwanza Region',
    title: 'Generator Rental in Mwanza: 300 to 2,500 kVA',
    description: 'Generator rental in Mwanza from 300 kVA to 2,500 kVA, delivered and installed, with an operator and servicing included. For Lake Zone mines, plants, factories and sites.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Mwanza and across the Lake Zone. Every hire is delivered, installed and commissioned, with an operator on site and servicing included for the whole hire.',
    demand: [
      { title: 'Lake Zone gold mines and plants', text: 'Sites in Sengerema, Misungwi, Buchosa, Kwimba and Magu, and further out in Geita and Kahama, are mostly beyond reliable grid supply. Mills, concentrators and pumps there need prime power sized for motor starting.' },
      { title: 'Factories and processing in town', text: 'Fish processing, cold stores and manufacturing in Mwanza are grid connected but need standby generation large enough to carry refrigeration and production through a power cut.' },
      { title: 'Construction and lakeshore projects', text: 'Construction sites and projects on the lakeshore and islands need temporary power for weeks or months, often before a grid connection exists.' },
    ],
    logistics: [
      'We deliver across the Lake Zone, including Geita, Kahama, Shinyanga, Musoma and the lakeshore districts',
      'About 120 km from Mwanza to Geita, with the Mwanza Gulf crossing to plan for on large sets',
      'Lake Victoria shipping can be the practical route to island and lakeshore sites',
    ],
    faqs: [
      { q: 'Do you have generators for rent in Mwanza?', a: 'Yes. We rent generators from 300 kVA to 2,500 kVA in Mwanza and across the Lake Zone, delivered and installed on site with an operator.' },
      { q: 'Can you supply a generator to a mine outside Mwanza town?', a: 'Yes, including sites in Sengerema, Misungwi, Geita and Kahama. Tell us the site location and road access, and we will plan delivery and installation around it.' },
      { q: 'Can a generator back up my factory during power cuts?', a: 'Yes. For standby use we size the set on the loads that must keep running, such as refrigeration or a production line, and connect it so it takes over when the grid fails.' },
      { q: 'How quickly can a generator reach my site in the Lake Zone?', a: 'It depends on the distance and the size of the set. The route planner on our delivery page gives realistic road times by district, and we confirm the delivery date with the quote.' },
      { q: 'Can you deliver a generator to an island or lakeshore site?', a: 'Yes, with planning. For island sites the practical route is often Lake Victoria shipping rather than road. Tell us the exact location and the landing point, and we will plan the delivery and installation around it.' },
      { q: 'What size generator does a fish processing plant or cold store need?', a: 'Refrigeration compressors are motors, so the size depends on how they start as much as on the total load. List the compressors, pumps and lighting with their kW, or use the calculator on this page, and we will confirm a size that carries the plant through a power cut.' },
      { q: 'Do you rent generators in Kahama and Shinyanga?', a: 'Yes, along with Geita and Musoma. The same terms apply: a one-week minimum for industrial and mining work, with delivery, installation, an operator and servicing included.' },
    ],
    imageAlt: 'Rented diesel generator at an industrial site near Lake Victoria',
    supplyPage: '/equipment/supply/mwanza',
  },
  {
    slug: 'dar-es-salaam',
    town: 'Dar es Salaam',
    region: 'Dar es Salaam Region',
    title: 'Generator Rental in Dar es Salaam: 300 to 2,500 kVA',
    description: 'Generator rental in Dar es Salaam from 300 kVA to 2,500 kVA for construction, factories, events and standby power, delivered, installed and serviced.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Dar es Salaam, where Bart Mining is based. Every hire is delivered, installed and commissioned, with an operator on site and servicing included, for construction, industry, events and standby during power cuts.',
    demand: [
      { title: 'Construction and infrastructure', text: 'Building sites, road works and projects that need power before a grid connection is in place, often for several months.' },
      { title: 'Factories, warehouses and the port area', text: 'Standby or continuous power for production lines, cold rooms and logistics yards where a power cut stops the business.' },
      { title: 'Events, hotels and commercial buildings', text: 'Temporary power for events, and backup for hotels, hospitals and offices during grid maintenance or outages.' },
    ],
    logistics: [
      'Bart Mining is based in Dar es Salaam, and we deliver across the city and its industrial areas',
      'Dar es Salaam is also the starting point for hires to sites inland: about 830 km to Mbeya, 1,150 km to Mwanza and 1,250 km to Geita by road',
      'Site access for a large set needs space for a truck and, for bigger units, a crane or forklift; we check this before delivery',
    ],
    faqs: [
      { q: 'Where can I rent a large generator in Dar es Salaam?', a: 'We rent generators from 300 kVA to 2,500 kVA in Dar es Salaam, delivered and installed, with an operator and servicing included. Call or WhatsApp us with the size or your load list for a quote.' },
      { q: 'Can I rent a generator for an event?', a: 'Yes, with a two-day minimum hire. Tell us the event dates, the location and what will be powered, such as lighting, sound and catering, and we will size the set and deliver it before the event.' },
      { q: 'Can you install a generator to take over automatically during power cuts?', a: 'Yes. For standby hires the set is connected so it takes over when the grid fails and hands back when supply returns.' },
      { q: 'What size generator does a construction site need?', a: 'It depends on the biggest machines on site, usually a tower crane, hoists, concrete pumps and welding sets. A tower crane motor starting under load is often what sets the size, so list the machines with their kW and use the calculator, or send the list and we will size it.' },
      { q: 'What size generator for a hotel, office or hospital on standby?', a: 'Size it on everything that must keep running during a power cut. Air conditioning and lifts are usually the largest loads; lighting, IT and kitchens are smaller. If only essential circuits are backed up, a smaller set will do. Send us the loads or a recent electricity bill showing peak demand, and we will recommend a size.' },
      { q: 'What do I need on site for a large generator?', a: 'Firm, level ground or a concrete base, access for the delivery truck, and room for a crane or forklift to place larger sets. You also need a safe cable route to your distribution board and a place to store fuel. We check access before delivery.' },
      { q: 'Are the generators open or containerised?', a: 'Smaller sets are supplied open-frame. Larger sets come in a container, which keeps the noise down and protects the set, which matters in town, at events and next to offices or hotels.' },
    ],
    imageAlt: 'Containerised generator powering a construction site in a coastal city',
    supplyPage: '/equipment/supply/dar-es-salaam',
  },
  {
    slug: 'geita',
    town: 'Geita',
    region: 'Geita Region',
    title: 'Generator Rental in Geita: 300 to 2,500 kVA',
    description: 'Generator rental in Geita from 300 kVA to 2,500 kVA for gold mines and processing plants, delivered, installed, with an operator on site and servicing included.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA for mines and processing plants in Geita and its surrounding districts. Every hire includes delivery, installation and commissioning, an operator on site, and servicing.',
    demand: [
      { title: 'Processing plants', text: 'Ball mills, crushers and CIL or CIP circuits are large motor loads that need prime power sized for starting surge, usually 500 kVA and above.' },
      { title: 'Small and medium mines away from the grid', text: 'Sites in Nyang’hwale, Mbogwe, Chato and Bukombe are further from grid power and workshops, so a reliable rented set with servicing included avoids lost production.' },
      { title: 'Bridging power during expansion', text: 'Temporary power while a new plant section is built or a permanent generator or grid connection is on order.' },
    ],
    logistics: [
      'About 120 km from Mwanza, with the Mwanza Gulf crossing factored in for large sets',
      'Roughly 1,250 km by road from Dar es Salaam',
      'Grid power reaches the main centres; outlying sites rely on generation',
    ],
    faqs: [
      { q: 'What size generator does a gold processing plant in Geita need?', a: 'It depends on the plant, but mills and crushers started direct on line often push the requirement to 500 kVA or more. Send us the motor list and how each motor starts, and we will recommend a size.' },
      { q: 'Can you supply a generator to a site outside Geita town?', a: 'Yes, including Nyang’hwale, Mbogwe, Chato and Bukombe. Tell us the site location and road access when you ask for a quote.' },
      { q: 'How long can I rent a generator for?', a: 'From one week, the minimum for mining and industrial work, to months of continuous prime power. Tell us how long you need it when you ask for a quote.' },
      { q: 'What size generator for a ball mill?', a: 'Size it on the mill motor and how it starts. Started direct on line, a mill motor needs roughly 3 kVA of generator per kW of motor, so a 132 kW mill needs a set of about 400 kVA or more before anything else is added. With a soft starter the requirement drops a lot, often by close to half.' },
      { q: 'What size generator for a CIL or CIP plant?', a: 'A CIL or CIP plant runs a mill, agitators on every tank, pumps and an elution circuit, so the total load is large and the mill sets the starting surge. Plants of this kind commonly need 500 kVA to over 1,000 kVA. Send the motor list and we will size it, often as two synchronised sets.' },
      { q: 'Can two generators run together for a big plant?', a: 'Yes. Two or more sets can run synchronised as one supply. They share the load, one can be serviced while the others keep the plant running, and capacity can be added later.' },
      { q: 'How much fuel does a 500 kVA generator use?', a: 'Diesel generators use roughly 0.25 to 0.30 litres per kWh. A 500 kVA set at about three-quarters load produces around 300 kW, so it burns roughly 75 to 90 litres an hour, or 1,500 to 1,800 litres over a 20-hour day. Fuel is supplied by you, so plan deliveries to site around this.' },
    ],
    imageAlt: 'Diesel generator supplying a gold processing plant in green hills',
    supplyPage: '/equipment/supply/geita',
  },
  {
    slug: 'arusha',
    town: 'Arusha',
    region: 'Arusha Region',
    title: 'Generator Rental in Arusha: 300 to 2,500 kVA',
    description: 'Generator rental in Arusha from 300 kVA to 2,500 kVA for lodges, hotels, events, farms, construction and Mererani mining, delivered, installed, with an operator on site.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Arusha and across northern Tanzania, for hotels and lodges, conferences and events, flower and horticulture farms, construction and the tanzanite mines at Mererani. Every hire is delivered, installed and commissioned, with an operator on site and servicing included.',
    demand: [
      { title: 'Hotels, lodges and conferences', text: 'Standby power for hotels and safari lodges, and temporary power for conferences and events, where a power cut in front of guests is not an option.' },
      { title: 'Farms and cold storage', text: 'Flower and horticulture farms around Arusha depend on cold rooms and irrigation pumps. A standby set keeps produce cold and pumps running through grid outages.' },
      { title: 'Mererani and construction', text: 'Shaft winches, compressors and pumps at the Mererani tanzanite workings, and construction sites across the city that need power before a grid connection.' },
    ],
    logistics: [
      'Roughly 640 km by road from Dar es Salaam',
      'Lodges and camps outside town are often on rough access roads; tell us the route so the right truck is sent',
      'Mererani is about an hour from Arusha by road',
    ],
    faqs: [
      { q: 'Can I rent a generator for a hotel or lodge in Arusha?', a: 'Yes. For standby we size the set on what must keep running during a power cut, usually kitchens, cold rooms, lighting and water pumps, and connect it to take over when the grid fails.' },
      { q: 'Can I rent a generator for a conference or event in Arusha?', a: 'Yes, with a two-day minimum hire. Tell us the dates, the venue and what will be powered, and we will size the set and have it running before the event starts.' },
      { q: 'What size generator does a flower farm or cold store need?', a: 'Cold rooms and irrigation pumps are motor loads, so the size depends on how the compressors and pumps start. List them with their kW, or use the calculator on this page, and we will confirm the size.' },
      { q: 'Do you supply generators to Mererani?', a: 'Yes. Mining hires have a one-week minimum and include delivery, installation, an operator on site and servicing. Send us the winch, compressor and pump list and we will size the set.' },
      { q: 'Can you deliver to a lodge outside Arusha town?', a: 'Yes. Tell us the location and the state of the access road when you ask for a quote, so we can plan the right truck and installation.' },
    ],
    imageAlt: 'Containerised generator providing standby power at a hotel near the mountains',
    supplyPage: '/equipment/supply/mererani',
    supplyLabel: 'Mererani',
  },
  {
    slug: 'dodoma',
    town: 'Dodoma',
    region: 'Dodoma Region',
    title: 'Generator Rental in Dodoma: 300 to 2,500 kVA',
    description: 'Generator rental in Dodoma from 300 kVA to 2,500 kVA for construction, government and office buildings, conferences and standby power, delivered, installed, with an operator on site.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Dodoma, for construction projects, offices and institutions, conferences and events, and standby during power cuts. Every hire is delivered, installed and commissioned, with an operator on site and servicing included.',
    demand: [
      { title: 'Construction in the capital', text: 'New government, institutional and residential buildings across Dodoma need site power for cranes, hoists, mixers and welding, often for months before the permanent supply is connected.' },
      { title: 'Offices and institutions', text: 'Standby power for offices, hospitals, colleges and data rooms, sized on the circuits that must keep running during an outage.' },
      { title: 'Conferences and events', text: 'Temporary power for conferences, national events and exhibitions held in the capital.' },
    ],
    logistics: [
      'Roughly 450 km by road from Dar es Salaam, in the centre of the country',
      'Its central position makes Dodoma a practical point for hires to Singida, Manyara and the central regions',
      'Large sets need truck access and space for lifting; we check the site before delivery',
    ],
    faqs: [
      { q: 'Do you rent generators in Dodoma?', a: 'Yes. We rent generators from 300 kVA to 2,500 kVA in Dodoma, delivered and installed, with an operator on site and servicing included.' },
      { q: 'What size generator does a construction site in Dodoma need?', a: 'It depends on the biggest machines, usually a tower crane, hoists and concrete equipment. List them with their kW, or use the calculator on this page, and we will size the set.' },
      { q: 'Can a generator back up an office or institution during power cuts?', a: 'Yes. We size it on the loads that must stay on, such as lighting, IT, lifts and air conditioning, and connect it to take over when the grid fails.' },
      { q: 'Can I rent a generator for a conference in Dodoma?', a: 'Yes, with a two-day minimum hire. Tell us the venue, the dates and what will be powered.' },
    ],
    imageAlt: 'Diesel generator powering a building construction site with a tower crane',
  },
  {
    slug: 'mbeya',
    town: 'Mbeya',
    region: 'Mbeya Region',
    title: 'Generator Rental in Mbeya: 300 to 2,500 kVA',
    description: 'Generator rental in Mbeya from 300 kVA to 2,500 kVA for Chunya and Songwe gold mines, processing plants, agro-processing and construction, delivered, installed, with an operator on site.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Mbeya and the Southern Highlands, for gold mines and processing plants in Chunya and Songwe, agro-processing, and construction. Every hire is delivered, installed and commissioned, with an operator on site and servicing included.',
    demand: [
      { title: 'Chunya and Songwe gold mining', text: 'Mills, crushers, pumps and leach plants on the Lupa goldfield are large motor loads, and many sites are beyond reliable grid supply.' },
      { title: 'Agro-processing', text: 'Coffee, tea, rice and grain processing in the Southern Highlands needs dependable power through the harvest season, when an outage costs the most.' },
      { title: 'Construction on the southern corridor', text: 'Road, building and infrastructure projects along the Mbeya corridor that need site power before or instead of a grid connection.' },
    ],
    logistics: [
      'Roughly 830 km by road from Dar es Salaam along the TANZAM highway',
      'Chunya mining areas are a further drive north of Mbeya on roads that can be difficult in the rains',
      'Highland weather means access plans should allow for the rainy season',
    ],
    faqs: [
      { q: 'Do you rent generators for mines in Chunya?', a: 'Yes. Mining hires have a one-week minimum and include delivery, installation, an operator on site and servicing. Send us the motor list and we will size the set.' },
      { q: 'What size generator does a gold processing plant in Mbeya Region need?', a: 'Mills and crushers started direct on line often push the requirement to 500 kVA or more; leach plants add agitators and pumps. Use the calculator on this page for a first figure, then send us the motor list.' },
      { q: 'Can you deliver a generator during the rainy season?', a: 'Yes, with planning. Tell us the site and the access road when you ask for a quote, so delivery can be timed and routed around wet roads.' },
      { q: 'Can a generator run a coffee or grain processing plant?', a: 'Yes. Size it on the plant’s motors and how they start, and tell us the hours it runs during the season.' },
    ],
    imageAlt: 'Diesel generator beside a gold processing plant in highland country',
    supplyPage: '/equipment/supply/chunya',
    supplyLabel: 'Chunya',
  },
  {
    slug: 'morogoro',
    town: 'Morogoro',
    region: 'Morogoro Region',
    title: 'Generator Rental in Morogoro: 300 to 2,500 kVA',
    description: 'Generator rental in Morogoro from 300 kVA to 2,500 kVA for agro-processing, sugar and industrial plants, construction and standby power, delivered, installed, with an operator on site.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Morogoro, for agro-processing and industrial plants, sugar and estate operations, construction along the central corridor, and standby during power cuts. Every hire is delivered, installed and commissioned, with an operator on site and servicing included.',
    demand: [
      { title: 'Agro-processing and estates', text: 'Sugar, grain and fruit processing in Morogoro Region runs on large motor loads during the season, when an outage stops the whole line.' },
      { title: 'Industry', text: 'Standby or continuous power for factories and processing plants in and around Morogoro town.' },
      { title: 'Construction on the central corridor', text: 'Road, rail and building projects between Dar es Salaam and Dodoma that need site power for months at a time.' },
    ],
    logistics: [
      'Roughly 190 km by road from Dar es Salaam, the closest of the major centres to the port',
      'On the main road and rail corridor to Dodoma and the central regions',
      'Estate and rural sites can be well off the highway; tell us the access route',
    ],
    faqs: [
      { q: 'Do you rent generators in Morogoro?', a: 'Yes. We rent generators from 300 kVA to 2,500 kVA in Morogoro and its estates, delivered and installed, with an operator on site and servicing included.' },
      { q: 'What size generator does a processing plant need?', a: 'Size it on the motors and how they start as much as on the total load. List the motors with their kW, or use the calculator on this page, and we will confirm the size.' },
      { q: 'Can I rent a generator just for the harvest or processing season?', a: 'Yes. Industrial hires have a one-week minimum and can run for the whole season. Tell us the dates when you ask for a quote.' },
      { q: 'Can a generator back up my factory during power cuts?', a: 'Yes. We size it on the loads that must keep running and connect it so it takes over when the grid fails.' },
    ],
    imageAlt: 'Containerised generator supplying an agro-processing plant',
  },
  {
    slug: 'tanga',
    town: 'Tanga',
    region: 'Tanga Region',
    title: 'Generator Rental in Tanga: 300 to 2,500 kVA',
    description: 'Generator rental in Tanga from 300 kVA to 2,500 kVA for port and industrial sites, agro-processing, construction and Handeni gold mining, delivered, installed, with an operator on site.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Tanga and across Tanga Region, for the port and industrial sites, sisal and fruit processing, construction, and gold mining around Handeni. Every hire is delivered, installed and commissioned, with an operator on site and servicing included.',
    demand: [
      { title: 'Port and industry', text: 'Standby and continuous power for industrial plants, warehouses and port-side operations in and around Tanga.' },
      { title: 'Agro-processing', text: 'Sisal, fruit and other processing across Tanga Region, where the season’s output depends on power staying on.' },
      { title: 'Handeni gold mining', text: 'Small and medium gold operations around Handeni run mills, crushers and pumps, mostly away from reliable grid supply.' },
    ],
    logistics: [
      'Roughly 350 km by road from Dar es Salaam',
      'Handeni is about 250 km from Dar es Salaam, inland from Tanga',
      'Large sets need truck access and space for lifting on site',
    ],
    faqs: [
      { q: 'Do you rent generators in Tanga?', a: 'Yes. We rent generators from 300 kVA to 2,500 kVA in Tanga and across the region, delivered and installed, with an operator on site and servicing included.' },
      { q: 'Do you supply generators to mines around Handeni?', a: 'Yes. Mining hires have a one-week minimum. Send us the mill, crusher and pump list and we will size the set.' },
      { q: 'Can a generator back up an industrial site during power cuts?', a: 'Yes. We size it on the loads that must keep running and connect it to take over when the grid fails.' },
      { q: 'What size generator do I need?', a: 'Add up the running load and check the largest motor and how it starts. The calculator on this page gives a first figure; send us the load list and we will confirm it.' },
    ],
    imageAlt: 'Diesel generator providing power at an industrial site near the coast',
    supplyPage: '/equipment/supply/handeni',
    supplyLabel: 'Handeni',
  },
  {
    slug: 'kahama',
    town: 'Kahama',
    region: 'Shinyanga Region',
    title: 'Generator Rental in Kahama: 300 to 2,500 kVA',
    description: 'Generator rental in Kahama from 300 kVA to 2,500 kVA for gold mines, processing plants and contractors, delivered, installed, with an operator on site and servicing included.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Kahama, one of Tanzania’s main gold mining districts, for mines, processing plants, mining contractors and construction. Every hire is delivered, installed and commissioned, with an operator on site and servicing included.',
    demand: [
      { title: 'Gold mines and processing plants', text: 'Mills, crushers, CIL and CIP circuits and dewatering pumps across the Kahama goldfields, where outlying sites rely on generation.' },
      { title: 'Mining contractors', text: 'Contractors working for the larger mines need temporary power for camps, workshops and project sites, often for months.' },
      { title: 'Town and construction', text: 'Construction and commercial sites in a growing mining town, and standby power for businesses through grid outages.' },
    ],
    logistics: [
      'Roughly 1,000 km by road from Dar es Salaam',
      'Close to Shinyanga and within reach of Geita and the Lake Zone',
      'Outlying mine sites can be on unsealed roads; tell us the access when you ask for a quote',
    ],
    faqs: [
      { q: 'Do you rent generators in Kahama?', a: 'Yes. We rent generators from 300 kVA to 2,500 kVA in Kahama and the surrounding mining areas, delivered and installed, with an operator on site and servicing included.' },
      { q: 'What size generator does a CIL or CIP plant in Kahama need?', a: 'A CIL or CIP plant runs a mill, agitators, pumps and an elution circuit, so it commonly needs 500 kVA to over 1,000 kVA. Send us the motor list and we will size it, often as two synchronised sets.' },
      { q: 'Can I rent a generator for a contractor camp?', a: 'Yes. Camps and workshops are mostly lighting, cooking, water pumps and tools. Use the calculator for a first figure, and tell us how long the camp will run.' },
      { q: 'How much fuel will the generator use?', a: 'Roughly 0.25 to 0.30 litres per kWh. A 500 kVA set at about three-quarters load burns 75 to 90 litres an hour. Fuel is supplied by you, so plan deliveries to site around this.' },
    ],
    imageAlt: 'Two containerised generators at a gold processing plant',
    supplyPage: '/equipment/supply/kahama',
  },
  {
    slug: 'mtwara',
    town: 'Mtwara',
    region: 'Mtwara Region',
    title: 'Generator Rental in Mtwara: 300 to 2,500 kVA',
    description: 'Generator rental in Mtwara from 300 kVA to 2,500 kVA for industrial and energy projects, cashew processing, the port and construction, delivered, installed, with an operator on site.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Mtwara and southern Tanzania, for industrial and energy projects, cashew processing, the port and construction. Every hire is delivered, installed and commissioned, with an operator on site and servicing included.',
    demand: [
      { title: 'Industrial and energy projects', text: 'Construction and maintenance work on industrial plants and the energy sector in the south, where temporary power runs for weeks or months.' },
      { title: 'Cashew processing', text: 'Cashew processing in Mtwara and Lindi runs hard through the season, and a standby set keeps the line moving through outages.' },
      { title: 'Port and construction', text: 'Port-side operations and building projects in Mtwara town that need site power before a grid connection.' },
    ],
    logistics: [
      'Roughly 550 km by road from Dar es Salaam, the main route south',
      'Also serves Lindi and the southern regions',
      'Large sets need truck access and space for lifting on site',
    ],
    faqs: [
      { q: 'Do you rent generators in Mtwara?', a: 'Yes. We rent generators from 300 kVA to 2,500 kVA in Mtwara and Lindi, delivered and installed, with an operator on site and servicing included.' },
      { q: 'Can I rent a generator for the cashew processing season?', a: 'Yes. Industrial hires have a one-week minimum and can run for the whole season. Tell us the dates and the processing line’s motors.' },
      { q: 'Can you supply power for a construction or industrial project?', a: 'Yes, for weeks or months. Send us the equipment list and the project duration, and we will size the set and plan servicing for the whole hire.' },
      { q: 'What size generator do I need?', a: 'Add up the running load and check the largest motor and how it starts. The calculator on this page gives a first figure; send us the load list and we will confirm it.' },
    ],
    imageAlt: 'Containerised generator supplying an industrial site in southern Tanzania',
  },
]

/** WhatsApp link with a pre-filled first line, so every enquiry shows which page it came from. */
export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

export const PHONE_DISPLAY = '+255 759 141 705'
export const PHONE_HREF = `tel:${SITE.phone}`
