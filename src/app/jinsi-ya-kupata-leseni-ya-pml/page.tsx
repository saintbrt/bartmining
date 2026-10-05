import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/jinsi-ya-kupata-leseni-ya-pml'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'jinsi-ya-kupata-leseni-ya-pml')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
