import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/mining-equipment-cost-tanzania'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'bei-ya-vifaa-vya-uchimbaji')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
