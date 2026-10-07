import SwInsight, { swInsightMetadata } from '@/components/sw/SwInsight'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import content from '@/content/sw/magnetic-vs-gravity-separation'

const article = SWAHILI_ARTICLES.find(a => a.slug === 'utenganishaji-wa-sumaku-au-gravity')!
export const metadata = swInsightMetadata(article)
export default function GuidePage() { return <SwInsight article={article} html={content} /> }
