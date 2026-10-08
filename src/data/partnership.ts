/**
 * Local market partnership: the one place for the package price, the places
 * left this year and the deliverables timeline. The page, llms.txt and FAQ
 * copy read from here, so a change to the price or the places count is a
 * single edit.
 *
 * PLACES_LEFT must stay true. Update it whenever a partner signs.
 */

export const PARTNERSHIP_PRICE_USD = 15000
export const PARTNERSHIP_PRICE = `USD ${PARTNERSHIP_PRICE_USD.toLocaleString('en-US')}`
export const PLACES_PER_YEAR = 10
export const PLACES_LEFT = 4

/** Page images; internal source and review notes live in docs/partnership-image-review-2026-10-08.md. */
export const PARTNERSHIP_IMAGES = {
  hero: { src: '/partner/hero.jpg', alt: 'Tracked mobile crusher processing rock beside a stockpile' },
  proof: { src: '/partner/proof.jpg', alt: 'A bank of spiral concentrators separating minerals from sand and water' },
} as const

export type TimelineItem = { t: string; d: string }
export type TimelinePhase = {
  key: string
  label: string
  when: string
  title: string
  items: TimelineItem[]
  milestone: { when: string; text: string }
}

export const TIMELINE: TimelinePhase[] = [
  {
    key: 'setup',
    label: 'Phase 01',
    when: 'Months 1–3',
    title: 'Build your local presence',
    items: [
      { t: 'Market assessment and local pricing', d: 'We assess demand for your products, build the landed-price model and set selling prices that work for local buyers.' },
      { t: 'Registration and import route', d: 'We confirm the registrations, product approvals and clearing route your goods need, so shipments move without surprises.' },
      { t: 'Your own social media pages', d: 'We create and run Instagram, Facebook and other pages for your brand in the region, so every advert leads to an active local presence.' },
      { t: 'TAMISA membership', d: 'We register you with TAMISA, the mining suppliers’ association, and place your company inside the local industry network.' },
      { t: 'Brand material in Kiswahili and English', d: 'Brochures and banners written for East African buyers, ready for presentations and site visits.' },
      { t: 'Your products on bartmining.com', d: 'Dedicated catalogue pages with specifications and enquiry routes, seen by the miners who already use our guides and price tools.' },
      { t: '3D product presentations', d: '3D models that show how your machines are built and how they work, used in adverts, on your pages and in buyer meetings.' },
      { t: 'Engineer and spare-parts training', d: 'We introduce your products to our engineers and train them on installation, operation and spare parts, so buyers get expert local support.' },
      { t: 'Advertising campaigns go live', d: 'Five months of paid advertising and collaborative posts, planned to reach more than five million people in the first six months.' },
      { t: 'Introductions to the mining community', d: 'Meetings with miners’ associations, local mining committees and machinery supplier organisations.' },
    ],
    milestone: { when: 'Month 3', text: 'Your brand, pages, material and trained engineers are in place. Ready to launch.' },
  },
  {
    key: 'launch',
    label: 'Phase 02',
    when: 'Months 4–6',
    title: 'Launch and first sales',
    items: [
      { t: 'Twelve presentation trips', d: 'At least four trips a month to mining towns, presenting your products to buyers where they work.' },
      { t: 'Sales handled end to end', d: 'Enquiries, site visits, demonstrations, quotations, clearing and delivery, all managed by our team.' },
      { t: 'Monthly progress reports', d: 'Advertising reach, enquiries, quotations and sales measured against your targets every month.' },
    ],
    milestone: { when: 'Month 6', text: 'USD 50,000 sales target reviewed. The fixed fee ends and the partnership moves to commission.' },
  },
  {
    key: 'grow',
    label: 'Phase 03',
    when: 'Months 7–12',
    title: 'Grow and expand',
    items: [
      { t: 'Commission-only selling', d: 'We keep selling and supporting your customers, paid only by commission on the deals we close.' },
      { t: 'Expansion across East and Southern Africa', d: 'Once your products are established here, we help take them into further markets across East and Southern Africa.' },
      { t: 'Spare parts stocked locally', d: 'Fast-moving parts and consumables held in the region, so repeat orders and service do not wait on shipping.' },
      { t: 'Your local office, centre and visas', d: 'When you are ready, we help you open a local office or service centre and arrange work permits and visas for your staff.' },
    ],
    milestone: { when: 'Month 12', text: 'USD 200,000+ cumulative sales target. The journey doesn’t end there.' },
  },
]

export const INCLUDED = [
  'Market assessment, local pricing and import route',
  'Your social media pages, run for six months',
  'TAMISA membership and introductions to mining committees',
  'Brochures and banners in Kiswahili and English',
  'Your product pages on bartmining.com',
  '3D product presentations',
  'Engineer and spare-parts training',
  'Five months of advertising, 5M+ planned reach',
  'Twelve presentation trips to mining towns',
  'Sales, quotations, clearing and delivery handled',
  'Six monthly progress reports',
]

/**
 * Buyer demand in Tanzania, from Google Trends exports (country: Tanzania,
 * downloaded 8 Oct 2026). Values are Google's relative search interest and
 * period growth for related queries, not search counts. Keep the source note
 * beside these figures wherever they are shown.
 */
export const DEMAND_SOURCE = 'Google Trends, Tanzania. Related searches for gold (Oct 2021–Oct 2026) and for ball mills, alluvial gold and mining (2004–Oct 2026), downloaded 8 October 2026. Figures show relative interest and growth over each period, not numbers of searches.'

export const DEMAND = [
  { k: 'Machines', v: 'Ball mills', q: 'ball mill machine · ball mill price · ball mill for sale · jaw crusher', d: 'The leading equipment searches are buyers looking for machines and prices, with crushers close behind.' },
  { k: 'Alluvial gold', v: 'Top query', q: 'alluvial gold · alluvial mining · alluvial gold mining', d: 'Alluvial gold is the leading search in its group, pointing to steady demand for wash plants, trommels and concentrators.' },
  { k: 'Gold price', v: '+110%', q: 'gold price in tanzania · gold price today +120%', d: 'Far more Tanzanians follow the gold price than five years ago, a sign of how many people are working gold.' },
  { k: 'New mines', v: '+1,300%', q: 'nyanzaga gold mine · geita gold +190%', d: 'Searches for newer projects and established goldfields are climbing as activity spreads to new areas.' },
]
