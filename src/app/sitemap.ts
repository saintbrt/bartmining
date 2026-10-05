import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'
import { ARTICLE_LIBRARY } from '@/data/article-library'
import { EQUIPMENT } from '@/data/equipment-catalogue'
import { EQUIPMENT as EQUIPMENT_SW } from '@/data/equipment-catalogue-sw'
import { LOCATIONS } from '@/data/locations'
import { LOCATIONS_SW } from '@/data/locations-sw'
import { MARKETS } from '@/data/markets'
import { RENTAL_TOWNS, RENTAL_UPDATED } from '@/data/generator-rental'

/**
 * Served at /sitemap.xml, generated from the same data the pages render from.
 *
 * Replaces the hand-maintained sitemap.xml at the repository root, which was
 * never served (it sat outside /public) and in any case listed .html URLs
 * from a previous version of the site that now 404.
 *
 * lastModified is only set where it is true: the content's own `updated`
 * date, or request time for the gold-price pages that revalidate hourly.
 * Pages with no tracked edit date omit it rather than claiming to be fresh.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE.url}/equipment`, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE.url}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/insights-swahili`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/insights`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/sustainability`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/generator-rental`, lastModified: new Date(RENTAL_UPDATED), changeFrequency: 'monthly', priority: 0.9 },
    ...RENTAL_TOWNS.map(t => ({ url: `${SITE.url}/generator-rental/${t.slug}`, lastModified: new Date(RENTAL_UPDATED), changeFrequency: 'monthly' as const, priority: 0.85 })),
    { url: `${SITE.url}/insights-swahili/jenereta-za-kukodi`, lastModified: new Date(RENTAL_UPDATED), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE.url}/privacy`, lastModified: new Date('2026-09-15'), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE.url}/terms`, lastModified: new Date('2026-09-15'), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE.url}/delivery-shipping`, lastModified: new Date('2026-09-18'), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE.url}/equipments-swahili`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE.url}/insights-swahili/bei-ya-dhahabu-leo`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
  ]

  const marketPages: MetadataRoute.Sitemap = MARKETS.map(m => ({
    url: `${SITE.url}/insights-swahili/soko-la-madini/${m.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const swahiliTownPages: MetadataRoute.Sitemap = LOCATIONS_SW.map(l => ({
    url: `${SITE.url}/insights-swahili/vifaa-vya-uchimbaji/${l.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const equipmentPages: MetadataRoute.Sitemap = EQUIPMENT.map(e => ({
    url: `${SITE.url}/equipment/${e.slug}`,
    lastModified: new Date(e.updated),
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const swahiliEquipmentPages: MetadataRoute.Sitemap = EQUIPMENT_SW.map(e => ({
    url: `${SITE.url}/equipments-swahili/${e.slug}`,
    lastModified: new Date(e.updated),
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const locationPages: MetadataRoute.Sitemap = LOCATIONS.map(l => ({
    url: `${SITE.url}/equipment/supply/${l.slug}`,
    lastModified: new Date(l.updated),
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const articlePages: MetadataRoute.Sitemap = ARTICLE_LIBRARY.map(a => ({
    url: `${SITE.url}${a.path}`,
    lastModified: a.updatedDate ? new Date(a.updatedDate) : undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...equipmentPages, ...swahiliEquipmentPages, ...locationPages, ...swahiliTownPages, ...marketPages, ...articlePages]
}
