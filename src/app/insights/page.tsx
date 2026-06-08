import type { Metadata } from 'next'
import { ARTICLES } from '@/data/insights'
import HubClient from '@/components/insights/HubClient'

export const metadata: Metadata = {
  title: 'Mining Knowledge Center, East & Southern Africa | Bart Mining',
  description: 'Expert guides on gold, diamond, copper and platinum exploration services across Tanzania, Zambia, Botswana, Zimbabwe, South Africa and the wider African mining belt.',
  alternates: { canonical: 'https://www.bartmining.com/insights/' },
}

export default function InsightsHub() {
  return <HubClient articles={ARTICLES} />
}
