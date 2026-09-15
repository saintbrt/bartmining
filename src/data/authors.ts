/**
 * Named people behind Bart Mining's published guidance.
 *
 * Google asks "who wrote this?" and prefers a real person with a bio page
 * over an organisation byline, especially on money, licensing and safety
 * topics. Every claim here must be true and public: do not add credentials
 * or experience a person does not have.
 *
 * Photo policy: no real photos of people, sites or kit are published for
 * security reasons. The one exception is Allan's headshot, which is already
 * public and was approved for use (Sep 2026). Bartholomew is shown by initials.
 */

export type AuthorId = 'bartholomew-ambrose' | 'allan-bartholomew'

export interface Author {
  id: AuthorId
  name: string
  jobTitle: string
  /** One line under the byline. */
  credential: string
  bio: string
  image?: string
  initials: string
  knowsAbout: string[]
  sameAs: string[]
  alumniOf?: string
}

export const AUTHORS: Record<AuthorId, Author> = {
  'bartholomew-ambrose': {
    id: 'bartholomew-ambrose',
    name: 'Bartholomew Ambrose',
    jobTitle: 'Founder',
    credential: 'Founder · 25+ years in exploration and mine operations',
    bio: 'Bartholomew has led exploration programmes and operated producing mines for more than 25 years, including work with Resolute Mining and Barrick Gold, on deposits in Tanzania, the DRC, Liberia, Brazil, Canada and Australia. He leads Bart Mining’s technical consulting, resource estimation and study work.',
    initials: 'BA',
    knowsAbout: [
      'Mineral exploration', 'Mine operations', 'Resource estimation', 'JORC Code',
      'NI 43-101', 'Feasibility studies', 'Technical due diligence', 'Underground mining',
      'Gold processing',
    ],
    sameAs: [],
  },
  'allan-bartholomew': {
    id: 'allan-bartholomew',
    name: 'Allan Bartholomew',
    jobTitle: 'Head of Business Development',
    credential: 'Head of Business Development',
    bio: 'Allan leads business development at Bart Mining: equipment sourcing and supply, landed-cost and procurement planning, and client relationships with mining operators across Tanzania. He studied mechanical engineering at Özyeğin University in Istanbul.',
    image: '/team/allan-bartholomew.jpg',
    initials: 'AB',
    knowsAbout: [
      'Business development', 'Mining equipment supply', 'Equipment procurement',
      'Landed cost and import logistics', 'Mechanical engineering',
    ],
    sameAs: [
      'https://tr.linkedin.com/in/allanbartholomew',
      'https://x.com/bartgpt',
    ],
    alumniOf: 'Özyeğin University',
  },
}

/**
 * Commercial guides (cost, procurement, finance, trading, consumables) are
 * Allan's. Everything technical, geological or consulting defaults to
 * Bartholomew, whose operating experience those pages rely on.
 */
const ALLAN_ARTICLES = new Set([
  'selling-gold-tanzania',
  'small-miner-financing',
  'gold-elution-plant-price',
  'activated-carbon-cyanide-tanzania',
  'equipment-rental-tanzania',
  'used-mining-equipment-tanzania',
  'mining-equipment-cost-tanzania',
  'gold-plant-setup-cost',
  'mining-equipment-africa',
])

export function authorForArticle(slug: string): Author {
  return AUTHORS[ALLAN_ARTICLES.has(slug) ? 'allan-bartholomew' : 'bartholomew-ambrose']
}

/** Stable JSON-LD @id for a person, anchored on the About page. */
export const personId = (siteUrl: string, id: AuthorId) => `${siteUrl}/about#${id}`
