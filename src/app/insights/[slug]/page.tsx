import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ARTICLES } from '@/data/insights'
import ReadingProgress from '@/components/insights/ReadingProgress'
import JsonLd from '@/components/seo/JsonLd'
import { articleSchema, breadcrumbSchema } from '@/lib/seo'
import TableOfContents from '@/components/insights/TableOfContents'

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const a = ARTICLES.find(x => x.slug === slug)
  if (!a) return {}
  // Articles with a Swahili counterpart declare it, so the two are treated
  // as language variants rather than competing for the same query.
  const SWAHILI: Record<string, string> = {
    'mining-equipment-cost-tanzania': 'https://www.bartmining.com/bei-ya-vifaa-vya-uchimbaji',
  }
  const sw = SWAHILI[a.slug]
  return {
    title: `${a.title} | Bart Mining`,
    description: a.description,
    alternates: {
      canonical: `https://www.bartmining.com/insights/${a.slug}`,
      ...(sw ? { languages: { en: `https://www.bartmining.com/insights/${a.slug}`, 'sw-TZ': sw } } : {}),
    },
    openGraph: { title: a.title, description: a.description, images: [{ url: a.image }] },
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

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            slug: article.slug,
            title: article.title,
            description: article.description,
            image: article.image,
            datePublished: '2025-06-01',
            section: article.category,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: article.title, path: `/insights/${article.slug}` },
          ]),
        ]}
      />
      <ReadingProgress />

      {/* Article hero, light, matches rest of site */}
      <section className="subhero" style={{ paddingBottom: 48 }}>
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site" style={{ position: 'relative' }}>
          {/* Breadcrumb */}
          <div className="crumb" style={{ marginBottom: 24 }}>
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/insights">Insights</Link>
            <span className="sep">/</span>
            <span>{article.category}</span>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {article.tags.slice(0, 4).map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em',
                textTransform: 'uppercase', padding: '4px 10px', borderRadius: 'var(--r-sm)',
                background: '#FFFFFF', color: 'var(--gold)',
                border: '1px solid var(--line)',
              }}>{tag}</span>
            ))}
          </div>

          <h1 style={{ fontSize: 'clamp(26px,3.5vw,48px)', maxWidth: 760, lineHeight: 1.2, marginBottom: 18 }}>
            {article.title}
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 17, maxWidth: 640, lineHeight: 1.65, marginBottom: 24 }}>
            {article.description}
          </p>
          <div style={{ display: 'flex', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-3)' }}>
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
            <span>·</span>
            <span>Bart Mining Editorial</span>
          </div>
        </div>
      </section>

      {/* Hero image, contained, full border radius */}
      <div className="px-site" style={{ paddingBottom: 0 }}>
        <div style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', aspectRatio: '21/9' }}>
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 860px) 100vw, 1240px"
            priority
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-site" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 56, alignItems: 'start' }} className="article-layout">

          {/* Article body */}
          <article>
            <div className="art-body" dangerouslySetInnerHTML={{ __html: content }} />

            {/* Article CTA */}
            <div className="on-dark" style={{ marginTop: 56, background: 'var(--slate)', borderRadius: 'var(--r-lg)', padding: '36px 32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'none', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 12 }}>Work with Bart Mining</p>
                <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>Ready to start your exploration programme?</h3>
                <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>Our geologists have operated across East and Southern Africa for decades. Tell us your project and we&apos;ll tell you how to de-risk it.</p>
                <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Get in touch &rarr;</a>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', padding: '20px 18px', boxShadow: 'var(--shadow-sm)' }}>
              <TableOfContents html={content} />
            </div>

            <div style={{ background: 'var(--slate)', borderRadius: 'var(--r-md)', padding: '20px 18px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 10 }}>Speak to a geologist</p>
              <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 15.5, lineHeight: 1.6, marginBottom: 16 }}>Questions about this topic? Our team responds within one business day.</p>
              <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-2)', textDecoration: 'none' }}>Contact us &rarr;</a>
            </div>

            {related.length > 0 && (
              <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', padding: '20px 18px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>Related articles</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {related.map(r => (
                    <Link key={r.slug} href={`/insights/${r.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ position: 'relative', width: 56, height: 40, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={r.image} alt={r.imageAlt} fill style={{ objectFit: 'cover' }} sizes="56px" />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold-deep)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 3 }}>{r.category}</div>
                        <p style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 600, lineHeight: 1.35 }}>{r.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <style>{`
        .article-layout { grid-template-columns: 1fr 280px !important; }
        @media (max-width: 900px) { .article-layout { grid-template-columns: 1fr !important; } .article-layout aside { display: none !important; } }
        .art-body h2 { font-size: clamp(20px,2.2vw,26px); font-weight: 700; margin: 40px 0 14px; color: var(--ink); line-height: 1.3; }
        .art-body h3 { font-size: clamp(16px,1.6vw,19px); font-weight: 700; margin: 28px 0 10px; color: var(--ink); }
        .art-body p { font-size: 16px; line-height: 1.75; color: var(--ink-2); margin-bottom: 18px; }
        .art-body ul, .art-body ol { padding-left: 22px; margin-bottom: 18px; }
        .art-body li { font-size: 16px; line-height: 1.7; color: var(--ink-2); margin-bottom: 6px; }
        .art-body a { color: var(--gold-deep); text-decoration: underline; text-decoration-color: var(--line); }
        .art-body strong { color: var(--ink); font-weight: 700; }
        .art-body blockquote { border-left: 3px solid var(--gold); padding: 12px 20px; margin: 24px 0; background: var(--bg-3); border-radius: 0 var(--r-sm) var(--r-sm) 0; }
        .art-body blockquote p { color: var(--ink); font-style: italic; margin: 0; }
        .art-body table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 15.5px; }
        .art-body th { background: var(--slate); color: rgba(255,255,255,.8); padding: 10px 14px; text-align: left; font-weight: 600; }
        .art-body td { padding: 10px 14px; border-bottom: 1px solid var(--line-2); color: var(--ink-2); }
        .art-body tr:hover td { background: var(--bg-3); }
        .art-stats { display: flex; gap: 24px; flex-wrap: wrap; background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-md); padding: 24px 28px; margin-bottom: 36px; }
        .art-stat-v { font-size: 28px; font-weight: 800; color: var(--gold-deep); font-family: var(--font-sora); }
        .art-stat-l { font-size: 15px; color: var(--ink-3); margin-top: 2px; }
        .region-chips { display: flex; gap: 6px; flex-wrap: wrap; margin: 12px 0 20px; }
        .region-chip { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; padding: 4px 12px; border-radius: var(--r-sm); background: var(--bg-3); border: 1px solid var(--line); color: var(--ink-2); }
        .art-callout { background: var(--slate); color: rgba(255,255,255,.8); border-radius: var(--r-md); padding: 20px 24px; margin: 24px 0; font-size: 15px; line-height: 1.65; }
        .art-callout strong { color: #fff; }
      `}</style>
    </>
  )
}
