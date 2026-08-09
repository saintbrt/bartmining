/**
 * Central SEO constants and JSON-LD builders.
 *
 * Every structured-data object on the site is produced here so the
 * organisation identity, contact details and service area stay identical
 * across pages. Search engines and AI crawlers reconcile entities by
 * matching these values, so divergence between pages weakens the signal.
 */

export const SITE = {
  url: 'https://www.bartmining.com',
  name: 'Bart Mining',
  legalName: 'Bart Mining Consultancy Ltd',
  logo: 'https://www.bartmining.com/logo.png',
  phone: '+255759141705',
  email: 'info@bartmining.com',
  street: 'Dar es Salaam',
  city: 'Dar es Salaam',
  country: 'TZ',
  countryName: 'Tanzania',
  founded: '2006',
  description:
    'Principal-led mining consultancy and mining equipment supplier based in Dar es Salaam, Tanzania. Gold processing plants, winches, drilling equipment, mine safety equipment and mine management software supplied across Mwanza, Kahama, Geita, Shinyanga and the wider Lake Victoria Goldfields.',
} as const

/** Primary supply territory. Used for areaServed on Organization and Product. */
export const SERVICE_AREAS = [
  'Mwanza', 'Kahama', 'Geita', 'Shinyanga', 'Bukombe', 'Nyangʼhwale',
  'Tabora', 'Dodoma', 'Arusha', 'Mbeya', 'Chunya', 'Songwe',
  'Dar es Salaam', 'Morogoro', 'Mtwara', 'Kigoma',
] as const

type Json = Record<string, unknown>

const areaServed = () => [
  { '@type': 'Country', name: 'Tanzania' },
  ...SERVICE_AREAS.map(a => ({ '@type': 'City', name: a })),
]

/**
 * Organization + LocalBusiness. Emitted once, in the root layout, so every
 * page inherits a resolvable publisher entity.
 */
export function organizationSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: SITE.logo },
    image: SITE.logo,
    description: SITE.description,
    foundingDate: SITE.founded,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.city,
      addressCountry: SITE.country,
    },
    areaServed: areaServed(),
    knowsAbout: [
      'Gold exploration', 'Mineral exploration', 'Mine planning',
      'Gold processing plants', 'Mining winches', 'Mine safety equipment',
      'Mine management software', 'Drilling equipment', 'JORC reporting',
    ],
    sameAs: [] as string[],
  }
}

/** Website entity, enables sitelinks search box eligibility. */
export function websiteSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'en',
  }
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${SITE.url}${t.path}`,
    })),
  }
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export interface ProductSchemaInput {
  slug: string
  name: string
  description: string
  image: string
  category: string
  specs: { label: string; value: string }[]
  applications: readonly string[]
}

/**
 * Product schema without `offers`.
 *
 * These pages document equipment categories against industry-standard
 * specifications rather than priced stock lines, so asserting an Offer with
 * a price would be a false claim. `offers` should be added per product only
 * once real catalogue pricing exists.
 */
export function productSchema(p: ProductSchemaInput): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE.url}/equipment/${p.slug}#product`,
    name: p.name,
    description: p.description,
    image: [p.image],
    category: p.category,
    brand: { '@type': 'Brand', name: SITE.name },
    manufacturer: { '@id': `${SITE.url}/#organization` },
    additionalProperty: p.specs.map(s => ({
      '@type': 'PropertyValue',
      name: s.label,
      value: s.value,
    })),
    audience: {
      '@type': 'BusinessAudience',
      audienceType: p.applications.join(', '),
      geographicArea: areaServed(),
    },
  }
}

/** Long-form guide body wrapping a product page, for article-style surfaces. */
export function techArticleSchema(a: {
  slug: string
  title: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  section: string
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${SITE.url}/equipment/${a.slug}#article`,
    headline: a.title,
    description: a.description,
    image: [a.image],
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    articleSection: a.section,
    inLanguage: 'en',
    author: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: `${SITE.url}/equipment/${a.slug}`,
  }
}

export function articleSchema(a: {
  slug: string
  title: string
  description: string
  image: string
  datePublished: string
  section: string
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE.url}/insights/${a.slug}#article`,
    headline: a.title,
    description: a.description,
    image: [a.image],
    datePublished: a.datePublished,
    dateModified: a.datePublished,
    articleSection: a.section,
    inLanguage: 'en',
    author: { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: `${SITE.url}/insights/${a.slug}`,
  }
}

export function itemListSchema(items: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: `${SITE.url}${it.path}`,
    })),
  }
}
