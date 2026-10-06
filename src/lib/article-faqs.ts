import data from '@/data/article-faqs.json'

export interface ArticleFaq { q: string; a: string }
type ArticleLanguage = 'en' | 'sw'
const faqs = data as Record<ArticleLanguage, Record<string, ArticleFaq[]>>

/** The visible answers and structured data use this same editorial copy. */
export function getArticleFaqs(slug: string, language: ArticleLanguage = 'en'): ArticleFaq[] {
  return faqs[language][slug] ?? []
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
}

export function renderArticleFaqs(slug: string, language: ArticleLanguage = 'en', title?: string): string {
  const items = getArticleFaqs(slug, language)
  if (!items.length) return ''
  const heading = title ?? (language === 'sw' ? 'Maswali na majibu' : 'Questions and answers')
  const id = language === 'sw' ? 'maswali' : 'questions'
  return `<h2 id="${id}">${escapeHtml(heading)}</h2>\n${items.map(item => `<h3>${escapeHtml(item.q)}</h3>\n<p>${escapeHtml(item.a)}</p>`).join('\n')}`
}
