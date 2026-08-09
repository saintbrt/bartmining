import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { EQUIPMENT, EQUIPMENT_BY_SLUG } from '@/data/equipment-catalogue'
import { SITE, SERVICE_AREAS, productSchema, techArticleSchema, faqSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import ReadingProgress from '@/components/insights/ReadingProgress'

export async function generateStaticParams() {
  return EQUIPMENT.map(e => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const e = EQUIPMENT_BY_SLUG.get(slug)
  if (!e) return {}
  const url = `${SITE.url}/equipment/${e.slug}`
  return {
    title: e.title,
    description: e.description,
    keywords: e.searchTerms,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: e.title,
      description: e.description,
      images: [{ url: e.image, alt: e.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: e.title, description: e.description, images: [e.image] },
  }
}

export default async function EquipmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = EQUIPMENT_BY_SLUG.get(slug)
  if (!item) notFound()

  const related = item.related
    .map(s => EQUIPMENT_BY_SLUG.get(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  const schemas = [
    productSchema({
      slug: item.slug,
      name: item.name,
      description: item.description,
      image: item.image,
      category: item.categoryLabel,
      specs: item.specs,
      applications: item.applications,
    }),
    techArticleSchema({
      slug: item.slug,
      title: item.h1,
      description: item.description,
      image: item.image,
      datePublished: item.updated,
      dateModified: item.updated,
      section: item.categoryLabel,
    }),
    faqSchema(item.faqs),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Equipment', path: '/equipment' },
      { name: item.name, path: `/equipment/${item.slug}` },
    ]),
  ]

  return (
    <>
      <JsonLd data={schemas} />
      <ReadingProgress />

      <section className="subhero" style={{ paddingBottom: 40 }}>
        <div className="px-site" style={{ position: 'relative' }}>
          <nav className="crumb" style={{ marginBottom: 24 }} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/equipment">Equipment</Link>
            <span className="sep">/</span>
            <span>{item.categoryLabel}</span>
          </nav>

          <h1 style={{ fontSize: 'clamp(26px,3.5vw,46px)', maxWidth: 820, lineHeight: 1.2, marginBottom: 18 }}>
            {item.h1}
          </h1>

          {/*
            Answer-first summary. Placed immediately after the H1 and before
            any imagery so that an extractive crawler reaches a complete,
            self-contained answer within the first block of the document.
          */}
          <p style={{ color: 'var(--ink-2)', fontSize: 18, maxWidth: 720, lineHeight: 1.7, marginBottom: 24 }}>
            {item.summary}
          </p>

          <div style={{ display: 'flex', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-3)', flexWrap: 'wrap' }}>
            <span>{item.categoryLabel}</span>
            <span>·</span>
            <span>{item.readTime}</span>
            <span>·</span>
            <span>Updated {item.updated}</span>
          </div>
        </div>
      </section>

      <div className="px-site">
        <div style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', aspectRatio: '21/9', border: '1px solid var(--line)' }}>
          <Image src={item.image} alt={item.imageAlt} fill style={{ objectFit: 'cover' }} sizes="(max-width: 860px) 100vw, 1240px" priority />
        </div>
      </div>

      <div className="px-site" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div className="eq-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 56, alignItems: 'start' }}>
          <article className="art-body">

            {/* ── Specifications ── */}
            <h2 id="specifications">{item.name} Specifications</h2>
            <p>
              The figures below describe typical industry specifications for this class of
              equipment rather than a single fixed model. Use them to scope a requirement,
              then confirm exact figures against the supplied unit before purchase.
            </p>
            <div className="eq-tablewrap">
              <table className="eq-table">
                <caption className="eq-caption">
                  Typical specification range — {item.name}
                </caption>
                <thead>
                  <tr><th scope="col">Specification</th><th scope="col">Typical value</th></tr>
                </thead>
                <tbody>
                  {item.specs.map(s => (
                    <tr key={s.label}>
                      <th scope="row">{s.label}</th>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Applications ── */}
            <h2 id="applications">What a {item.name} Is Used For</h2>
            <ul>
              {item.applications.map(a => <li key={a}>{a}</li>)}
            </ul>

            {/* ── Maintenance ── */}
            <h2 id="maintenance">Maintenance Schedule</h2>
            <p>
              Most premature failures in this equipment class trace back to a missed routine
              check rather than a design fault. The intervals below are a practical starting
              schedule; adjust them to your duty cycle and the manufacturer manual.
            </p>
            <div className="eq-tablewrap">
              <table className="eq-table">
                <caption className="eq-caption">Recommended maintenance intervals</caption>
                <thead>
                  <tr><th scope="col">Interval</th><th scope="col">Task</th></tr>
                </thead>
                <tbody>
                  {item.maintenance.map(m => (
                    <tr key={m.interval}>
                      <th scope="row">{m.interval}</th>
                      <td>{m.task}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── FAQ. Mirrors the FAQPage schema above, visible on the page. ── */}
            <h2 id="faq">Frequently Asked Questions</h2>
            {item.faqs.map(f => (
              <div key={f.q} className="eq-faq">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            {/* ── Supply coverage ── */}
            <h2 id="supply">Supply and Delivery Across Tanzania</h2>
            <p>
              Bart Mining supplies {item.name.toLowerCase()} and related equipment to mining
              operations throughout Tanzania, with primary coverage of the Lake Victoria
              Goldfields — Mwanza, Kahama, Geita, Shinyanga and Bukombe — alongside the Lupa
              Goldfields around Chunya and Mbeya, and delivery nationwide from Dar es Salaam.
            </p>
            <div className="region-chips">
              {SERVICE_AREAS.map(r => <span key={r} className="region-chip">{r}</span>)}
            </div>

            <div className="art-callout">
              <strong>Specification note.</strong> The values on this page are
              industry-standard ranges for the equipment category, published so buyers can
              scope requirements before enquiring. They are not a quotation and do not
              describe a specific stocked model. Contact us with your duty, site conditions
              and power supply for a specification and quotation against your actual
              requirement.
            </div>

            <div className="on-dark" style={{ marginTop: 56, background: 'var(--slate)', borderRadius: 'var(--r-lg)', padding: '36px 32px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 12 }}>Request a quotation</p>
              <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>Need a {item.name.toLowerCase()} specified for your site?</h3>
              <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
                Tell us your duty, depth or throughput and available power supply. We will
                come back with a specification and price, and flag anything on site that
                needs to change to make it work.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-gold">WhatsApp us &rarr;</a>
                <Link href="/contact" className="btn btn-ghost">Send an enquiry</Link>
              </div>
            </div>
          </article>

          <aside style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', padding: '20px 18px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>On this page</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  ['specifications', 'Specifications'],
                  ['applications', 'Applications'],
                  ['maintenance', 'Maintenance'],
                  ['faq', 'FAQ'],
                  ['supply', 'Supply in Tanzania'],
                ].map(([id, label]) => (
                  <a key={id} href={`#${id}`} style={{ fontSize: 15, color: 'var(--ink-2)' }}>{label}</a>
                ))}
              </nav>
            </div>

            <div style={{ background: 'var(--slate)', borderRadius: 'var(--r-md)', padding: '20px 18px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 10 }}>Get a price</p>
              <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 15.5, lineHeight: 1.6, marginBottom: 16 }}>
                We quote against your duty and site conditions, not a catalogue line.
              </p>
              <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-2)' }}>+255 759 141 705 &rarr;</a>
            </div>

            {related.length > 0 && (
              <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', padding: '20px 18px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>Related equipment</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {related.map(r => (
                    <Link key={r.slug} href={`/equipment/${r.slug}`} style={{ display: 'block' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 3 }}>{r.categoryLabel}</div>
                      <p style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 600, lineHeight: 1.35 }}>{r.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <style>{`
        .eq-layout { grid-template-columns: 1fr 280px; }
        /* Grid items default to min-width:auto, so the spec table's min-width
           would push the column past the viewport. The body clips rather than
           scrolls, so the overflow silently truncates text instead of showing
           a scrollbar. min-width:0 lets the column shrink and hands the
           scrolling to .eq-tablewrap, where it belongs. */
        .eq-layout > * { min-width: 0; }
        @media (max-width: 900px) {
          .eq-layout { grid-template-columns: 1fr !important; }
          .eq-layout aside { display: none !important; }
        }
        .art-body h2 { font-size: clamp(20px,2.2vw,26px); font-weight: 700; margin: 44px 0 14px; color: var(--ink); line-height: 1.3; }
        .art-body h2:first-child { margin-top: 0; }
        .art-body h3 { font-size: clamp(16px,1.6vw,19px); font-weight: 700; margin: 26px 0 8px; color: var(--ink); }
        .art-body p { font-size: 16px; line-height: 1.75; color: var(--ink-2); margin-bottom: 18px; }
        .art-body ul { margin: 0 0 18px; padding-left: 20px; }
        .art-body li { font-size: 16px; line-height: 1.75; color: var(--ink-2); margin-bottom: 7px; }
        .art-body strong { color: var(--ink); font-weight: 600; }

        .eq-tablewrap { overflow-x: auto; margin: 0 0 24px; border: 1px solid var(--line); border-radius: var(--r-md); }
        .eq-table { border-collapse: collapse; width: 100%; min-width: 460px; }
        .eq-caption { text-align: left; font-family: var(--font-mono); font-size: 12px; letter-spacing: .1em;
          text-transform: uppercase; color: var(--ink-3); padding: 14px 16px; border-bottom: 1px solid var(--line); }
        .eq-table th[scope="col"] { font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em;
          text-transform: uppercase; color: var(--ink-3); font-weight: 400; text-align: left; padding: 12px 16px;
          border-bottom: 1px solid var(--line); background: var(--paper); }
        .eq-table th[scope="row"] { text-align: left; font-weight: 600; color: var(--ink); font-size: 15.5px;
          padding: 13px 16px; vertical-align: top; width: 42%; }
        .eq-table td { color: var(--ink-2); font-size: 15.5px; padding: 13px 16px; vertical-align: top; }
        .eq-table tbody tr + tr th, .eq-table tbody tr + tr td { border-top: 1px solid var(--line-2); }

        .eq-faq { border-top: 1px solid var(--line-2); padding-top: 18px; margin-bottom: 20px; }
        .eq-faq h3 { margin-top: 0; }
        .eq-faq p { margin-bottom: 0; }

        .region-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 24px; }
        .region-chip { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; padding: 5px 12px;
          border-radius: var(--r-sm); background: var(--bg-3); border: 1px solid var(--line); color: var(--ink-2); }

        .art-callout { background: var(--paper); border: 1px solid var(--line); border-left: 3px solid var(--gold);
          border-radius: var(--r-sm); padding: 20px 24px; margin: 32px 0; font-size: 15.5px; line-height: 1.7; color: var(--ink-2); }

        @media (max-width: 600px) {
          .art-body h2 { margin-top: 36px; }
          .eq-table th[scope="row"] { width: 45%; font-size: 15px; }
          .eq-table td { font-size: 15px; }
        }
      `}</style>
    </>
  )
}
