import type { Metadata } from 'next'
import { SWAHILI_DIRECTORY } from '@/data/swahili-directory'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, itemListSchema } from '@/lib/seo'
import HubClient from '@/components/insights/HubClient'

export const metadata: Metadata = {
  title: 'Maarifa na huduma za uchimbaji kwa Kiswahili',
  description: 'Kurasa zote kwa Kiswahili: miongozo ya plant na leseni, masoko ya madini, usambazaji kwa maeneo, bei ya dhahabu, jenereta na katalogi ya vifaa.',
  alternates: { canonical: `${SITE.url}/insights-swahili` },
  openGraph: { url: `${SITE.url}/insights-swahili`, locale: 'sw_TZ', title: 'Maarifa na huduma za uchimbaji kwa Kiswahili' },
}

export default function SwahiliInsightsHub() {
  return <>
    <JsonLd data={itemListSchema(SWAHILI_DIRECTORY.map(a => ({ name: a.title, path: a.path })))} />
    <HubClient articles={SWAHILI_DIRECTORY} language="sw" directory />
  </>
}
