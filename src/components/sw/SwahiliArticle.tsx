import type { ReactNode } from 'react'
import Link from 'next/link'

/**
 * Shared shell for Swahili long-form pages.
 *
 * Keeps the hero, FAQ block, WhatsApp call to action and body typography
 * identical across the Swahili guides, so each page file only carries its
 * metadata, structured data and words.
 */

export interface SwFaq { q: string; a: string }

interface Props {
  crumbs: { name: string; href?: string }[]
  eyebrow: string
  h1: string
  lead: ReactNode
  /** English counterpart, when one exists. */
  enHref?: string
  faqs: SwFaq[]
  ctaTitle?: string
  ctaBody?: string
  children: ReactNode
}

export default function SwahiliArticle({
  crumbs, eyebrow, h1, lead, enHref, faqs,
  ctaTitle = 'Tunakupa bei ya kufikisha eneo lako',
  ctaBody = 'Tuambie kazi unayotaka kufanya, kiasi cha mawe kwa siku na umeme uliopo. Bei tunayokupa inajumuisha usafirishaji hadi eneo lako. Andika kwa Kiswahili au Kiingereza.',
  children,
}: Props) {
  return (
    <div lang="sw">
      <section className="subhero" style={{ paddingBottom: 32 }}>
        <div className="px-site">
          <nav className="crumb" style={{ marginBottom: 24 }} aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={c.name}>
                {i > 0 && <span className="sep">/</span>}
                {c.href ? <Link href={c.href}>{c.name}</Link> : <span>{c.name}</span>}
              </span>
            ))}
          </nav>
          <span className="eyebrow">{eyebrow}</span>
          <h1 style={{ marginTop: 14 }}>{h1}</h1>
          <p className="lead">{lead}</p>
          {enHref && (
            <p style={{ color: 'var(--ink-3)', fontSize: 15, marginTop: 14 }}>
              <Link href={enHref} style={{ color: 'var(--gold)', fontWeight: 600 }}>Read this page in English</Link>
            </p>
          )}
        </div>
      </section>

      <div className="px-site" style={{ paddingBottom: 72 }}>
        <article className="art-body">
          {children}

          <h2 id="maswali">Maswali Yanayoulizwa Mara kwa Mara</h2>
          {faqs.map(f => (
            <div key={f.q} className="eq-faq">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <div className="on-dark" style={{ marginTop: 56, background: 'var(--slate)', borderRadius: 'var(--r-lg)', padding: '36px 32px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 12 }}>Bart Mining</p>
            <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>{ctaTitle}</h3>
            <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>{ctaBody}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Tuma WhatsApp &rarr;</a>
              <Link href="/vifaa-vya-uchimbaji" className="btn btn-ghost">Tazama vifaa</Link>
            </div>
          </div>
        </article>
      </div>

      <style>{`
        .art-body h2 { font-size: clamp(20px,2.2vw,26px); font-weight: 700; margin: 44px 0 14px; color: var(--ink); line-height: 1.3; }
        .art-body h2:first-child { margin-top: 0; }
        .art-body h3 { font-size: clamp(16px,1.6vw,19px); font-weight: 700; margin: 26px 0 8px; color: var(--ink); }
        .art-body p { font-size: 16px; line-height: 1.75; color: var(--ink-2); margin-bottom: 18px; max-width: 68ch; }
        .art-body ul, .art-body ol { margin: 0 0 18px; padding-left: 20px; }
        .art-body li { font-size: 16px; line-height: 1.75; color: var(--ink-2); margin-bottom: 8px; }
        .art-body strong { color: var(--ink); font-weight: 600; }
        .art-body a { color: var(--gold-deep); font-weight: 600; }
        .art-body .tbl { overflow-x: auto; margin-bottom: 22px; }
        .art-body table { width: 100%; border-collapse: collapse; font-size: 15.5px; }
        .art-body th { background: var(--slate); color: rgba(255,255,255,.8); padding: 10px 14px; text-align: left; font-weight: 600; }
        .art-body td { padding: 10px 14px; border-bottom: 1px solid var(--line-2); color: var(--ink-2); }
        .art-callout { background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-md); padding: 18px 22px; margin: 22px 0; }
        .art-callout p { margin: 0; }
        .eq-faq { border-top: 1px solid var(--line-2); padding-top: 18px; margin-bottom: 20px; }
        .eq-faq h3 { margin-top: 0; }
        .eq-faq p { margin-bottom: 0; }
        .region-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .region-chip { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; padding: 5px 12px;
          border-radius: var(--r-sm); background: var(--bg-3); border: 1px solid var(--line); color: var(--ink-2); }
        @media (max-width: 600px) { .art-body h2 { margin-top: 36px; } }
      `}</style>
    </div>
  )
}
