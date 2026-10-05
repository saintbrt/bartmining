import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SWAHILI_ARTICLES } from '@/data/article-library'
import { articlePublishedDate } from '@/lib/article-dates'
import { ARTICLES } from '@/data/insights'
import ArticleLayout from '@/components/insights/ArticleLayout'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, articleSchema, breadcrumbSchema } from '@/lib/seo'
import { authorForArticle } from '@/data/authors'

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

/**
 * Cover images are either a path under public/ or a remote URL. Both work in
 * next/image, but structured data and Open Graph need a resolvable absolute
 * URL, so relative paths get the site origin put back in front.
 */
function absoluteImage(src: string): string {
  return src.startsWith('http') ? src : `${SITE.url}${src}`
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const a = ARTICLES.find(x => x.slug === slug)
  if (!a) return {}
  // Articles with a Swahili counterpart declare it, so the two are treated
  // as language variants rather than competing for the same query.
  const counterpart = SWAHILI_ARTICLES.find(x => x.englishSlug === a.slug)
  const sw = counterpart ? `${SITE.url}${counterpart.path}` : undefined
  return {
    title: a.title,
    description: a.description,
    alternates: {
      canonical: `${SITE.url}/insights/${a.slug}`,
      ...(sw ? { languages: { en: `${SITE.url}/insights/${a.slug}`, 'sw-TZ': sw, 'x-default': `${SITE.url}/insights/${a.slug}` } } : {}),
    },
    openGraph: { title: a.title, description: a.description, images: [{ url: absoluteImage(a.image) }] },
  }
}

async function getContent(slug: string): Promise<string> {
  try {
    const mod = await import(`../../../content/insights/${slug}`)
    return (mod.default ?? mod.content ?? '') as string
  } catch {
    return ''
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) notFound()

  const content = await getContent(slug)
  const related = ARTICLES.filter(a => article.related.includes(a.slug)).slice(0, 3)
  const author = authorForArticle(article.slug)
  const counterpart = SWAHILI_ARTICLES.find(a => a.englishSlug === article.slug)

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            slug: article.slug,
            title: article.title,
            description: article.description,
            image: absoluteImage(article.image),
            datePublished: articlePublishedDate(article.date),
            ...(article.updated ? { dateModified: article.updatedDate ?? articlePublishedDate(article.updated) } : {}),
            section: article.category,
            author,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: article.title, path: `/insights/${article.slug}` },
          ]),
        ]}
      />
      <ArticleLayout
        title={article.title}
        description={article.description}
        category={article.category}
        image={article.image}
        imageAlt={article.imageAlt}
        imageCaption={article.imageCaption}
        author={author}
        dateLabel={article.updated ? `Updated ${article.updated}` : article.date}
        readTime={article.readTime}
        alternate={counterpart ? { href: counterpart.path, label: 'Soma kwa Kiswahili', lang: 'sw' } : undefined}
        html={content}
        related={related.map(r => ({ title: r.title, href: `/insights/${r.slug}` }))}
        cta={article.cta}
      />
    </>
  )
}
