import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/flotation-graphite-copper'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'flotation-ya-graphite-na-shaba')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
