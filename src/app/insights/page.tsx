import type { Metadata } from 'next'
import { ENGLISH_ARTICLES } from '@/data/article-library'
import JsonLd from '@/components/seo/JsonLd'
import { itemListSchema } from '@/lib/seo'
import HubClient from '@/components/insights/HubClient'
import { SITE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Mining Knowledge Center, East & Southern Africa',
  description: 'English mining articles: gold processing, equipment and plant costs, selling gold, licences, exploration and project planning.',
  alternates: { canonical: `${SITE.url}/insights` },
}

export default function InsightsHub() {
  return <><JsonLd data={itemListSchema(ENGLISH_ARTICLES.map(a => ({ name: a.title, path: a.path })))} /><HubClient articles={ENGLISH_ARTICLES} /></>
}
