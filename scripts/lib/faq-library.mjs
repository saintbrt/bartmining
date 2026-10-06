import { guideInventory, loadSiteModule } from './editorial-library.mjs'

/** Public reading pages; equipment product FAQs are maintained in their catalogue. */
export function faqInventory() {
  const { getArticleFaqs } = loadSiteModule('src/lib/article-faqs.ts')
  const { LOCATIONS } = loadSiteModule('src/data/locations.ts')
  const { LOCATIONS_SW } = loadSiteModule('src/data/locations-sw.ts')
  const { MARKETS } = loadSiteModule('src/data/markets.ts')
  const { RENTAL_FAQS, RENTAL_TOWNS } = loadSiteModule('src/data/generator-rental.ts')
  const { DELIVERY_FAQS, SW_GOLD_FAQS, SW_GENERATOR_RENTAL_FAQS } = loadSiteModule('src/data/service-faqs.ts')
  return [
    ...guideInventory().map(g => ({ ...g, kind: 'article', faqs: getArticleFaqs(g.slug, g.language) })),
    ...LOCATIONS.map(l => ({ path: `/equipment/supply/${l.slug}`, title: l.title, language: 'en', kind: 'supply', faqs: l.faqs })),
    ...LOCATIONS_SW.map(l => ({ path: `/insights-swahili/vifaa-vya-uchimbaji/${l.slug}`, title: l.title, language: 'sw', kind: 'supply', faqs: l.faqs })),
    ...MARKETS.map(m => ({ path: `/insights-swahili/soko-la-madini/${m.slug}`, title: m.title, language: 'sw', kind: 'market', faqs: m.faqs })),
    { path: '/generator-rental', title: 'Generator rental', language: 'en', kind: 'service', faqs: RENTAL_FAQS },
    ...RENTAL_TOWNS.map(t => ({ path: `/generator-rental/${t.slug}`, title: t.title, language: 'en', kind: 'service', faqs: t.faqs })),
    { path: '/insights-swahili/jenereta-za-kukodi', title: 'Jenereta za kukodi', language: 'sw', kind: 'service', faqs: SW_GENERATOR_RENTAL_FAQS },
    { path: '/insights-swahili/bei-ya-dhahabu-leo', title: 'Bei ya dhahabu leo', language: 'sw', kind: 'price', faqs: SW_GOLD_FAQS },
    { path: '/delivery-shipping', title: 'Delivery and shipping', language: 'en', kind: 'service', faqs: DELIVERY_FAQS },
  ]
}
