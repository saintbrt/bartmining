import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/wet-pan-mill-vs-ball-mill'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'kinu-cha-dhahabu-pan-mill-au-ball-mill')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
