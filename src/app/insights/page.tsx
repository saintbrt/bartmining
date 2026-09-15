import type { Metadata } from 'next'
import { ARTICLES } from '@/data/insights'
import HubClient from '@/components/insights/HubClient'
import { SITE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Mining Knowledge Center, East & Southern Africa',
  description: 'Practical guides for miners in Tanzania and East Africa: gold processing, equipment costs, selling gold, compliance, exploration and consulting.',
  alternates: { canonical: `${SITE.url}/insights` },
}

export default function InsightsHub() {
  return <HubClient articles={ARTICLES} />
}
