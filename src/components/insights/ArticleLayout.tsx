import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Author } from '@/data/authors'
import ReadingProgress from './ReadingProgress'
import CallCard from '@/components/ui/CallCard'
import TableOfContents from './TableOfContents'
import { prepareArticleHtml, prepareArticleNodes } from '@/lib/article-content'

interface Props {
  lang?: 'en' | 'sw'
  title: string
  description: ReactNode
  category: string
  image?: string
  imageAlt?: string
  imageCaption?: string
  author?: Author
  authorCredential?: string
  dateLabel?: string
  readTime?: string
  alternate?: { href: string; label: string; lang: 'en' | 'sw' }
  crumbs?: { name: string; href?: string }[]
  html?: string
  children?: ReactNode
  related?: { title: string; href: string }[]
  cta?: { title: string; body: string }
}

/** One reading experience for English insights and Kiswahili guides. */
export default function ArticleLayout({ lang = 'en', title, description, category, image, imageAlt = '', imageCaption, author, authorCredential, dateLabel, readTime, alternate, crumbs, html, children, related = [], cta }: Props) {
  const sw = lang === 'sw'
  const prepared = html !== undefined ? prepareArticleHtml(html) : prepareArticleNodes(children)
  const trail = crumbs ?? [{ name: sw ? 'Mwanzo' : 'Home', href: '/' }, { name: sw ? 'Makala' : 'Insights', href: sw ? '/insights-swahili' : '/insights' }, { name: category }]
  const action = cta ?? {
    title: sw ? 'Tuambie kuhusu mradi wako' : 'Discuss the next step for your project',
    body: sw ? 'Tuambie eneo la mradi, hatua uliyofikia na uamuzi unaotaka kufanya. Tutakusaidia kutambua taarifa na huduma unazohitaji.' : 'Tell us where your project is, what you have established so far and which decision you need to make. We can help identify the information and services you need next.',
  }
  const card = {
    lang,
    eyebrow: sw ? 'Fanya kazi na Bart Mining' : 'Work with Bart Mining',
    title: action.title,
    body: action.body,
    message: sw ? `nimesoma "${title}" na ningependa kuzungumza nanyi kuhusu mradi wangu.` : `I've just read "${title}" and I'd like to talk to you about my project.`,
  }

  return <div className="article-page" lang={lang}>
    <ReadingProgress />
    <section className="subhero article-hero"><div className="px-site">
      <nav className="crumb" aria-label={sw ? 'Njia ya ukurasa' : 'Breadcrumb'}>{trail.map((c, i) => <span key={`${c.name}-${i}`}>{i > 0 && <span className="sep" aria-hidden="true"> / </span>}{c.href ? <Link href={c.href}>{c.name}</Link> : <span>{c.name}</span>}</span>)}</nav>
      <p className="eyebrow">{category}</p>
      <h1>{title}</h1>
      <p className="article-description">{description}</p>
      <div className="article-byline">
        {author?.image && <Image src={author.image} alt="" width={40} height={40} className="article-avatar" />}
        <div>{author ? <><Link href={`/about#${author.id}`} rel="author">{author.name}</Link><p>{authorCredential ?? author.credential}</p></> : <span>Bart Mining</span>}{(dateLabel || readTime) && <p className="article-date">{[dateLabel, readTime].filter(Boolean).join(' · ')}</p>}</div>
      </div>
      {alternate && <Link className="article-language" href={alternate.href} hrefLang={alternate.lang} lang={alternate.lang}>{alternate.label} →</Link>}
    </div></section>
    {image && <figure className="px-site article-cover"><div><Image src={image} alt={imageAlt} fill sizes="(max-width: 900px) 100vw, 1240px" priority style={{ objectFit: 'cover' }} /></div>{imageCaption && <figcaption>{imageCaption}</figcaption>}</figure>}
    <div className="px-site article-body-wrap"><div className="article-layout">
      <article>
        {prepared.headings.length > 0 && <details className="article-mobile-contents"><summary>{sw ? 'Yaliyomo kwenye makala' : 'In this article'}</summary><TableOfContents headings={prepared.headings} lang={lang} /></details>}
        {html !== undefined ? <div className="art-body" dangerouslySetInnerHTML={{ __html: prepared.content as string }} /> : <div className="art-body">{prepared.content}</div>}
        <div className="article-cta"><CallCard {...card} /></div>
      </article>
      <aside className="article-sidebar">
        <CallCard {...card} placement="side" />
        {prepared.headings.length > 0 && <div className="article-sidebar-card article-desktop-contents"><TableOfContents headings={prepared.headings} lang={lang} /></div>}
        {related.length > 0 && <div className="article-sidebar-card"><h2>{sw ? 'Soma pia' : 'Further reading'}</h2><ul>{related.map(r => <li key={r.href}><Link href={r.href}>{r.title}</Link></li>)}</ul></div>}
      </aside>
    </div></div>
  </div>
}
