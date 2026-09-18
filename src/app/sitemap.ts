import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'
import { ARTICLES } from '@/data/insights'
import { EQUIPMENT } from '@/data/equipment-catalogue'
import { LOCATIONS } from '@/data/locations'
import { LOCATIONS_SW } from '@/data/locations-sw'
import { MARKETS } from '@/data/markets'

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
    { url: `${SITE.url}/insights`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/sustainability`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/privacy`, lastModified: new Date('2026-09-15'), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE.url}/terms`, lastModified: new Date('2026-09-15'), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE.url}/delivery-shipping`, lastModified: new Date('2026-09-18'), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE.url}/vifaa-vya-uchimbaji`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE.url}/bei-ya-vifaa-vya-uchimbaji`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE.url}/bei-ya-dhahabu-leo`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE.url}/bei-ya-mashine-ya-kusaga-mawe`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/jinsi-ya-kupata-leseni-ya-pml`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/gharama-ya-plant-ya-dhahabu`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/mrabaha-na-kodi-za-dhahabu`, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const marketPages: MetadataRoute.Sitemap = MARKETS.map(m => ({
    url: `${SITE.url}/soko-la-madini/${m.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const swahiliTownPages: MetadataRoute.Sitemap = LOCATIONS_SW.map(l => ({
    url: `${SITE.url}/vifaa-vya-uchimbaji/${l.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const equipmentPages: MetadataRoute.Sitemap = EQUIPMENT.map(e => ({
    url: `${SITE.url}/equipment/${e.slug}`,
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

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map(a => ({
    url: `${SITE.url}/insights/${a.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...equipmentPages, ...locationPages, ...swahiliTownPages, ...marketPages, ...articlePages]
}
