import type { Metadata } from 'next'
import { ARTICLES } from '@/data/insights'
import HubClient from '@/components/insights/HubClient'
import { SITE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Mining Knowledge Center, East & Southern Africa',
  description: 'Expert guides on gold, diamond, copper and platinum exploration services across Tanzania, Zambia, Botswana, Zimbabwe, South Africa and the wider African mining belt.',
  alternates: { canonical: `${SITE.url}/insights` },
}

export default function InsightsHub() {
  return <HubClient articles={ARTICLES} />
}
