import type { Metadata } from 'next'
import { SWAHILI_ARTICLES, type LibraryArticle } from '@/data/article-library'
import { authorForArticle } from '@/data/authors'
import { SITE, articleSchema, breadcrumbSchema, faqSchema } from '@/lib/seo'
import { getArticleFaqs } from '@/lib/article-faqs'
import { articlePublishedDate, articleDateLabel } from '@/lib/article-dates'
import ArticleLayout from '@/components/insights/ArticleLayout'
import JsonLd from '@/components/seo/JsonLd'

export function swInsightMetadata(article: LibraryArticle): Metadata {
  const canonical = `${SITE.url}${article.path}`
  const english = article.englishSlug ? `${SITE.url}/insights/${article.englishSlug}` : undefined
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical, ...(english ? { languages: { en: english, 'sw-TZ': canonical, 'x-default': english } } : {}) },
    openGraph: { type: 'article', url: canonical, locale: 'sw_TZ', title: article.title, description: article.description, images: [{ url: `${SITE.url}${article.image}`, alt: article.imageAlt }] },
  }
}

export default function SwInsight({ article, html }: { article: LibraryArticle; html: string }) {
  const author = article.englishSlug ? authorForArticle(article.englishSlug) : undefined
  return <>
    <JsonLd data={[
      articleSchema({ ...article, language: 'sw', section: article.category, image: `${SITE.url}${article.image}`, datePublished: articlePublishedDate(article.date), dateModified: article.updatedDate, author }),
      breadcrumbSchema([{ name: 'Mwanzo', path: '/' }, { name: 'Kurasa kwa Kiswahili', path: '/insights-swahili' }, { name: article.title, path: article.path }]),
      ...(getArticleFaqs(article.slug, 'sw').length ? [faqSchema(getArticleFaqs(article.slug, 'sw'), 'sw')] : []),
    ]} />
    <ArticleLayout
      lang="sw" title={article.title} description={article.description} category={article.category}
      image={article.image} imageAlt={article.imageAlt} imageCaption={article.imageCaption}
      author={author} authorCredential={author?.id === 'allan-bartholomew' ? 'Mkuu wa Maendeleo ya Biashara na Ubia' : undefined}
      dateLabel={articleDateLabel(article, 'sw')} readTime={article.readTime}
      crumbs={[{ name: 'Mwanzo', href: '/' }, { name: 'Kurasa kwa Kiswahili', href: '/insights-swahili' }, { name: article.title }]}
      alternate={article.englishSlug ? { href: `/insights/${article.englishSlug}`, label: 'Read this article in English', lang: 'en' } : undefined}
      html={html}
      related={SWAHILI_ARTICLES.filter(a => article.related.includes(a.slug)).map(a => ({ title: a.title, href: a.path }))}
      cta={article.cta}
    />
  </>
}
