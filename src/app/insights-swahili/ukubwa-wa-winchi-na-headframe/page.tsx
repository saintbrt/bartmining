import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/mine-winch-headframe-sizing'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'ukubwa-wa-winchi-na-headframe')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
