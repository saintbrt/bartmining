import type { ReactNode } from 'react'
import ArticleLayout from '@/components/insights/ArticleLayout'

export interface SwFaq { q: string; a: string }
interface Props {
  crumbs: { name: string; href?: string }[]
  eyebrow: string
  h1: string
  lead: ReactNode
  enHref?: string
  faqs: SwFaq[]
  ctaTitle?: string
  ctaBody?: string
  image?: string
  imageAlt?: string
  conclusion?: { title: string; body: string }
  children: ReactNode
}

/** Existing JSX guides share the same renderer as English insights. */
export default function SwahiliArticle({ crumbs, eyebrow, h1, lead, enHref, faqs, ctaTitle, ctaBody, image, imageAlt, conclusion, children }: Props) {
  return <ArticleLayout
    lang="sw"
    title={h1}
    description={lead}
    category={eyebrow}
    crumbs={crumbs}
    image={image}
    imageAlt={imageAlt}
    imageCaption={image ? 'Picha ya rejea kutoka kwenye katalogi ya Bart Mining.' : undefined}
    alternate={enHref ? { href: enHref, label: enHref.startsWith('/insights/') ? 'Read this article in English' : 'View related equipment information in English', lang: 'en' } : undefined}
    cta={ctaTitle ? { title: ctaTitle, body: ctaBody ?? 'Tuambie eneo la mradi, kazi unayotaka kufanya na vifaa unavyohitaji. Tutakuandalia pendekezo lenye maelezo ya gharama na huduma zinazojumuishwa.' } : undefined}
  >
    {children}
    {faqs.length > 0 && <><h2 id="maswali">Maswali yanayoulizwa mara kwa mara</h2>{faqs.map(f => <section key={f.q}><h3>{f.q}</h3><p>{f.a}</p></section>)}</>}
    {conclusion && <><h2 id="hitimisho">{conclusion.title}</h2><p>{conclusion.body}</p></>}
  </ArticleLayout>
}
