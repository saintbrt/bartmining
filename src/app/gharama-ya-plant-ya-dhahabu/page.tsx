import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/gold-plant-setup-cost'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'gharama-ya-plant-ya-dhahabu')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
