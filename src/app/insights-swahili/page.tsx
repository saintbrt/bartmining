import type { Metadata } from 'next'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, itemListSchema } from '@/lib/seo'
import HubClient from '@/components/insights/HubClient'

export const metadata: Metadata = {
  title: 'Makala za uchimbaji kwa Kiswahili',
  description: 'Miongozo ya vifaa, gharama za plant ya dhahabu, leseni ya PML na mauzo ya dhahabu Tanzania, yenye mifano na hatua za kupanga mradi.',
  alternates: { canonical: `${SITE.url}/insights-swahili` },
  openGraph: { url: `${SITE.url}/insights-swahili`, locale: 'sw_TZ', title: 'Makala za uchimbaji kwa Kiswahili' },
}

export default function SwahiliInsightsHub() {
  return <>
    <JsonLd data={itemListSchema(SWAHILI_ARTICLES.map(a => ({ name: a.title, path: a.path })))} />
    <HubClient articles={SWAHILI_ARTICLES} language="sw" />
  </>
}
