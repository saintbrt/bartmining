import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/water-recycling-gold-plant'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'kurejesha-maji-kwenye-mtambo')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
