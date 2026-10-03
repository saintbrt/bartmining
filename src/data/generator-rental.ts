/**
 * Generator rental: /generator-rental, the town pages under it, and the
 * Swahili page /jenereta-za-kukodi.
 *
 * Facts confirmed by Allan (3 Oct 2026): sizes 300 to 2,500 kVA; every hire
 * includes delivery and collection, installation and commissioning, an
 * operator or technician, and servicing during the hire; prices are quoted
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
  { title: 'Operator or technician', text: 'Someone who knows the set runs it or checks it, so faults are caught before they stop your work.' },
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
    a: 'Every hire includes delivery and collection, installation and commissioning, an operator or technician, and servicing during the hire period.',
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
  /** District supply page for the same town, if there is one. */
  supplyPage?: string
}

export const RENTAL_TOWNS: RentalTown[] = [
  {
    slug: 'mwanza',
    town: 'Mwanza',
    region: 'Mwanza Region',
    title: 'Generator Rental in Mwanza: 300 to 2,500 kVA',
    description: 'Generator rental in Mwanza from 300 kVA to 2,500 kVA, delivered and installed, with an operator and servicing included. For Lake Zone mines, plants, factories and sites.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Mwanza and across the Lake Zone, from our Mwanza base. Every hire is delivered, installed and commissioned, with an operator or technician and servicing included for the whole hire.',
    demand: [
      { title: 'Lake Zone gold mines and plants', text: 'Sites in Sengerema, Misungwi, Buchosa, Kwimba and Magu, and further out in Geita and Kahama, are mostly beyond reliable grid supply. Mills, concentrators and pumps there need prime power sized for motor starting.' },
      { title: 'Factories and processing in town', text: 'Fish processing, cold stores and manufacturing in Mwanza are grid connected but need standby generation large enough to carry refrigeration and production through a power cut.' },
      { title: 'Construction and lakeshore projects', text: 'Construction sites and projects on the lakeshore and islands need temporary power for weeks or months, often before a grid connection exists.' },
    ],
    logistics: [
      'Our Mwanza base serves the Lake Zone directly, so sets for Geita, Kahama, Shinyanga and Musoma do not have to come up from Dar es Salaam',
      'About 120 km from Mwanza to Geita, with the Mwanza Gulf crossing to plan for on large sets',
      'Lake Victoria shipping can be the practical route to island and lakeshore sites',
    ],
    faqs: [
      { q: 'Do you have generators for rent in Mwanza?', a: 'Yes. We rent generators from 300 kVA to 2,500 kVA in Mwanza and across the Lake Zone, delivered from our Mwanza base and installed on site.' },
      { q: 'Can you supply a generator to a mine outside Mwanza town?', a: 'Yes, including sites in Sengerema, Misungwi, Geita and Kahama. Tell us the site location and road access, and we will plan delivery and installation around it.' },
      { q: 'Can a generator back up my factory during power cuts?', a: 'Yes. For standby use we size the set on the loads that must keep running, such as refrigeration or a production line, and connect it so it takes over when the grid fails.' },
      { q: 'How quickly can a generator reach my site in the Lake Zone?', a: 'It depends on the distance and the size of the set. Sites around Mwanza are supplied from our Mwanza base, so they do not wait for a truck from Dar es Salaam. The route planner on our delivery page gives realistic road times by district, and we confirm the delivery date with the quote.' },
      { q: 'Can you deliver a generator to an island or lakeshore site?', a: 'Yes, with planning. For island sites the practical route is often Lake Victoria shipping rather than road. Tell us the exact location and the landing point, and we will plan the delivery and installation around it.' },
      { q: 'What size generator does a fish processing plant or cold store need?', a: 'Refrigeration compressors are motors, so the size depends on how they start as much as on the total load. List the compressors, pumps and lighting with their kW, or use the calculator on this page, and we will confirm a size that carries the plant through a power cut.' },
      { q: 'Do you rent generators in Kahama and Shinyanga?', a: 'Yes. Kahama, Shinyanga, Geita and Musoma are supplied from our Mwanza base. The same terms apply: a one-week minimum for industrial and mining work, with delivery, installation, an operator and servicing included.' },
    ],
    supplyPage: '/equipment/supply/mwanza',
  },
  {
    slug: 'dar-es-salaam',
    town: 'Dar es Salaam',
    region: 'Dar es Salaam Region',
    title: 'Generator Rental in Dar es Salaam: 300 to 2,500 kVA',
    description: 'Generator rental in Dar es Salaam from 300 kVA to 2,500 kVA for construction, factories, events and standby power, delivered, installed and serviced.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA in Dar es Salaam, where Bart Mining is based. Every hire is delivered, installed and commissioned, with an operator or technician and servicing included, for construction, industry, events and standby during power cuts.',
    demand: [
      { title: 'Construction and infrastructure', text: 'Building sites, road works and projects that need power before a grid connection is in place, often for several months.' },
      { title: 'Factories, warehouses and the port area', text: 'Standby or continuous power for production lines, cold rooms and logistics yards where a power cut stops the business.' },
      { title: 'Events, hotels and commercial buildings', text: 'Temporary power for events, and backup for hotels, hospitals and offices during grid maintenance or outages.' },
    ],
    logistics: [
      'Bart Mining is based in Dar es Salaam, so sets in the city reach site quickest',
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
    supplyPage: '/equipment/supply/dar-es-salaam',
  },
  {
    slug: 'geita',
    town: 'Geita',
    region: 'Geita Region',
    title: 'Generator Rental in Geita: 300 to 2,500 kVA',
    description: 'Generator rental in Geita from 300 kVA to 2,500 kVA for gold mines and processing plants, delivered from Mwanza, installed, with an operator and servicing included.',
    summary: 'We rent generators from 300 kVA to 2,500 kVA for mines and processing plants in Geita and its surrounding districts. Sets come from our Mwanza base, about 120 km away, and every hire includes delivery, installation and commissioning, an operator or technician, and servicing.',
    demand: [
      { title: 'Processing plants', text: 'Ball mills, crushers and CIL or CIP circuits are large motor loads that need prime power sized for starting surge, usually 500 kVA and above.' },
      { title: 'Small and medium mines away from the grid', text: 'Sites in Nyang’hwale, Mbogwe, Chato and Bukombe are further from grid power and workshops, so a reliable rented set with servicing included avoids lost production.' },
      { title: 'Bridging power during expansion', text: 'Temporary power while a new plant section is built or a permanent generator or grid connection is on order.' },
    ],
    logistics: [
      'About 120 km from our Mwanza base, with the Mwanza Gulf crossing factored in for large sets',
      'Roughly 1,250 km by road from Dar es Salaam, which is why Geita hires are supplied from Mwanza',
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
    supplyPage: '/equipment/supply/geita',
  },
]

/** WhatsApp link with a pre-filled first line, so every enquiry shows which page it came from. */
export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

export const PHONE_DISPLAY = '+255 759 141 705'
export const PHONE_HREF = `tel:${SITE.phone}`
