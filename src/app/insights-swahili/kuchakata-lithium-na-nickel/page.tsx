import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/lithium-nickel-processing-guide'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'kuchakata-lithium-na-nickel')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
