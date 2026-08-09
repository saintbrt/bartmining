import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo'
import { ARTICLES } from '@/data/insights'
import { EQUIPMENT } from '@/data/equipment-catalogue'

/**
 * Served at /sitemap.xml, generated from the same data the pages render from.
 *
 * Replaces the hand-maintained sitemap.xml at the repository root, which was
 * never served (it sat outside /public) and in any case listed .html URLs
 * from a previous version of the site that now 404.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE.url}/equipment`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/products`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/insights`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/sustainability`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const equipmentPages: MetadataRoute.Sitemap = EQUIPMENT.map(e => ({
    url: `${SITE.url}/equipment/${e.slug}`,
    lastModified: new Date(e.updated),
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map(a => ({
    url: `${SITE.url}/insights/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...equipmentPages, ...articlePages]
}
