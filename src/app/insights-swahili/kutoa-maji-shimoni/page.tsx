import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/shaft-dewatering-staged-pumping'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'kutoa-maji-shimoni')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
