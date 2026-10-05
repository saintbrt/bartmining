import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/mrabaha-na-kodi-za-dhahabu'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'mrabaha-na-kodi-za-dhahabu')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
