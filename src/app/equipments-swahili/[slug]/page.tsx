import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { EQUIPMENT, EQUIPMENT_BY_SLUG } from '@/data/equipment-catalogue-sw'
import { SITE, SERVICE_AREAS, productSchema, faqSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import ReadingProgress from '@/components/insights/ReadingProgress'
import { resolveEquipmentPhoto } from '@/lib/equipment-photos'
import { LOCATIONS } from '@/data/locations'
import { LOCATIONS_SW } from '@/data/locations-sw'
import { EQUIPMENT_GUIDES } from '@/content/equipment/sw'

export async function generateStaticParams() {
  return EQUIPMENT.map(e => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const e = EQUIPMENT_BY_SLUG.get(slug)
  if (!e) return {}
  const url = `${SITE.url}/equipments-swahili/${e.slug}`
  // Social cards need an absolute URL, and should show the real product
  // photo where one has been uploaded rather than the stock fallback.
  const photo = resolveEquipmentPhoto(e.slug)
  const ogImage = photo ? `${SITE.url}${photo}` : e.image
  const en = `${SITE.url}/equipment/${e.slug}`
  return {
    title: e.title,
    description: e.description,
    keywords: e.searchTerms,
    alternates: {
      canonical: url,
      languages: { en, 'sw-TZ': url, 'x-default': en },
    },
    openGraph: {
      type: 'article',
      locale: 'sw_TZ',
      url,
      title: e.title,
      description: e.description,
      images: [{ url: ogImage, alt: e.imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: e.title, description: e.description, images: [ogImage] },
  }
}

export default async function EquipmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = EQUIPMENT_BY_SLUG.get(slug)
  if (!item) notFound()

  // A real uploaded photo takes precedence over the stock imagery.
  const photo = resolveEquipmentPhoto(item.slug)
  const heroSrc = photo ?? item.image
  // Relative paths are valid for next/image but not for structured data,
  // where crawlers require a resolvable absolute URL.
  const schemaImage = photo ? `${SITE.url}${photo}` : item.image

  const related = item.related
    .map(s => EQUIPMENT_BY_SLUG.get(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  // Districts whose supply page lists this item as a typical purchase.
  const buyingDistricts = LOCATIONS.filter(l => l.buys.includes(item.slug) && LOCATIONS_SW.some(sw => sw.slug === l.slug))

  const guide = EQUIPMENT_GUIDES[item.slug] ?? []
  const words = [item.summary, ...item.specs.flatMap(row => [row.label, row.value]), ...item.applications,
    ...item.maintenance.flatMap(row => [row.interval, row.task]), ...item.faqs.flatMap(row => [row.q, row.a]),
    ...guide.map(section => `${section.title} ${section.html.replace(/<[^>]*>/g, ' ')}`),
  ].join(' ').trim().split(/\s+/).length
  const readingTime = `Dakika ${Math.ceil((words + 300) / 200)} za kusoma`

  const references: Record<string, { href: string; label: string }[]> = {
    "gas-detection-monitor": [{"href": "https://www.osha.gov/publications/shib093013", "label": "Mwongozo wa kupima gas monitors"}],
    "fall-arrest-harness": [{"href": "https://www.petzl.com/INT/en/Professional/How-and-why-use-a-fall-arrest-lanyard-?ActivityName=Energy-and-Networks", "label": "Mwongozo wa Petzl wa nafasi ya kuanguka"}],
    "cil-cip-plant": [{"href": "https://cyanidecode.org/the-cyanide-code/", "label": "Wigo wa Cyanide Code"}, {"href": "https://www.tumemadini.go.tz/pages/licenseservice/", "label": "Huduma za leseni za Tume ya Madini"}],
    "gold-elution-electrowinning-plant": [{"href": "https://cyanidecode.org/the-cyanide-code/", "label": "Wigo wa Cyanide Code"}],
    "gold-metal-detector": [{"href": "https://www.tumemadini.go.tz/pages/licenseservice/", "label": "Huduma za leseni za Tume ya Madini"}],
  }

  const schemas = [
    productSchema({
      slug: item.slug,
      path: `/equipments-swahili/${item.slug}`,
      name: item.name,
      description: item.description,
      image: schemaImage,
      category: item.categoryLabel,
      specs: item.specs,
      applications: item.applications,
    }),
    faqSchema(item.faqs, 'sw'),
    breadcrumbSchema([
      { name: 'Mwanzo', path: '/' },
            { name: 'Kurasa kwa Kiswahili', path: '/insights-swahili' },
      { name: 'Vifaa vya uchimbaji', path: '/equipments-swahili' },
      { name: item.name, path: `/equipments-swahili/${item.slug}` },
    ]),
  ]

  return (
    <div lang="sw">
      <JsonLd data={schemas} />
      <ReadingProgress />

      <section className="subhero" style={{ paddingBottom: 40 }}>
        <div className="px-site" style={{ position: 'relative' }}>
          <nav className="crumb" style={{ marginBottom: 24 }} aria-label="Njia ya ukurasa">
            <Link href="/">Mwanzo</Link>
            <span className="sep">/</span>
            <Link href="/insights-swahili">Kurasa kwa Kiswahili</Link>
            <span className="sep">/</span>
            <Link href="/equipments-swahili">Vifaa vya uchimbaji</Link>
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
          {item.slug === 'diesel-generator-mining' && (
            <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 720, lineHeight: 1.7, margin: '-8px 0 24px', paddingLeft: 14, borderLeft: '2px solid var(--gold)' }}>
              Ikiwa unahitaji umeme kwa muda, tuna huduma ya kukodisha jenereta za 300 kVA hadi 2,500 kVA,
              pamoja na kufikisha, kufunga, kuhudumia na mwendeshaji kulingana na makubaliano.{' '}
              <Link href="/insights-swahili/jenereta-za-kukodi" style={{ color: 'var(--gold)', fontWeight: 600 }}>Kukodisha jenereta</Link>
            </p>
          )}

          <div style={{ display: 'flex', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-3)', flexWrap: 'wrap' }}>
            <span>{item.categoryLabel}</span>
            <span>·</span>
            <span>{readingTime}</span>
            <span>·</span>
            <span>Ilihaririwa {item.updated}</span>
          </div>
          <p style={{ marginTop: 20 }} lang="en"><Link href={`/equipment/${item.slug}`} style={{ color: 'var(--gold)', fontWeight: 600 }}>Read this equipment guide in English &rarr;</Link></p>
        </div>
      </section>

      <div className="px-site">
        <div style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', aspectRatio: '21/9', border: '1px solid var(--line)' }}>
          <Image src={heroSrc} alt={item.imageAlt} fill style={{ objectFit: 'cover' }} sizes="(max-width: 860px) 100vw, 1240px" priority />
        </div>
      </div>

      <div className="px-site" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div className="eq-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 56, alignItems: 'start' }}>
          <article className="art-body">

            {/* ── Guide sections (only pages with an entry in content/equipment) ── */}
            {guide.map(s => (
              <section key={s.id}>
                <h2 id={s.id}>{s.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: s.html }} />
              </section>
            ))}

            {/* ── Specifications ── */}
            <h2 id="specifications">{item.name}: vipimo</h2>
            <p>
              Vipimo vifuatavyo vinaonyesha makundi ya kawaida ya aina hii ya kifaa.
              Vitumie kueleza mahitaji ya mradi, kisha thibitisha uwezo na masharti
              ya modeli itakayotolewa kabla ya kununua. Havielezi kifaa kimoja
              kilichopo stoo wala dhamana ya matokeo kwenye eneo lako.
            </p>
            <div className="eq-tablewrap">
              <table className="eq-table">
                <caption className="eq-caption">
                  Vipimo vya kawaida: {item.name}
                </caption>
                <thead>
                  <tr><th scope="col">Kipimo</th><th scope="col">Kiwango cha kawaida</th></tr>
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
            {/* Phrased to read correctly for singular, plural and vowel-initial names. */}
            <h2 id="applications">{item.name}: matumizi</h2>
            <ul>
              {item.applications.map(a => <li key={a}>{a}</li>)}
            </ul>

            {/* ── Maintenance ── */}
            <h2 id="maintenance">Ratiba ya matengenezo</h2>
            <p>
              Ukaguzi wa mara kwa mara husaidia kutambua uchakavu na hitilafu kabla ya
              kusimamisha kazi. Ratiba ifuatayo ni msingi wa kupanga; ilinganishe
              na saa za kazi, mazingira na mwongozo wa mtengenezaji. Kwa programu,
              zingatia pia taarifa, watumiaji na uwezo wa kurejesha nakala.
            </p>
            <div className="eq-tablewrap">
              <table className="eq-table">
                <caption className="eq-caption">Vipindi vya kupanga matengenezo</caption>
                <thead>
                  <tr><th scope="col">Kipindi</th><th scope="col">Kazi</th></tr>
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
            <h2 id="faq">Maswali yanayoulizwa mara kwa mara</h2>
            {item.faqs.map(f => (
              <div key={f.q} className="eq-faq">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            {/* ── Supply coverage ── */}
            <h2 id="supply">Usambazaji na kufikisha vifaa Tanzania</h2>
            <p>
              Bart Mining husaidia kupata na kufikisha vifaa hivi kwenye maeneo ya
              uchimbaji Tanzania, yakiwemo Mwanza, Kahama, Geita, Shinyanga na
              Bukombe katika Kanda ya Ziwa, pamoja na Chunya na Mbeya. Usafirishaji
              hupangwa kutoka Dar es Salaam kwa ukubwa wa mzigo na hali ya eneo.
            </p>
            <div className="region-chips">
              {SERVICE_AREAS.map(r => <span key={r} className="region-chip">{r}</span>)}
            </div>
            {buyingDistricts.length > 0 && (
              <p>
                Soma kuhusu usambazaji katika:{' '}
                {buyingDistricts.map((l, i) => (
                  <span key={l.slug}>
                    {i > 0 && ', '}
                    <Link href={`/insights-swahili/vifaa-vya-uchimbaji/${l.slug}`} style={{ color: 'var(--gold)', fontWeight: 600 }}>{l.city}</Link>
                  </span>
                ))}
                .
              </p>
            )}

            <div className="art-callout">
              <strong>Kuchagua kifaa kinachofaa.</strong> Linganisha kazi unayotaka
              kufanya na uwezo, huduma na matengenezo yaliyoelezwa hapa. Vipimo vya
              kundi havitoshi kuthibitisha modeli au bei. Hatua inayofuata ni kuandaa
              mahitaji ya kazi, hali ya eneo na umeme uliopo, kisha kupata vipimo
              na nukuu ya kifaa inayolingana na mradi wako.
            </div>

            {references[item.slug] && (
              <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                Rejea za masharti na usalama:{' '}
                {references[item.slug].map((reference, i) => (
                  <span key={reference.href}>
                    {i > 0 && ' · '}
                    <a href={reference.href}>{reference.label} (kwa Kiingereza)</a>
                  </span>
                ))}
              </p>
            )}

            <div className="on-dark" style={{ marginTop: 56, background: 'var(--slate)', borderRadius: 'var(--r-lg)', padding: '36px 32px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 12 }}>Omba makadirio ya bei</p>
              <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>Unapanga kununua kifaa hiki kwa eneo lako?</h3>
              <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
                Tuambie eneo, kazi inayohitajika, kina au kiasi cha kuchakata na
                umeme uliopo. Tutasaidia kubainisha modeli, wigo wa vifaa na bei,
                pamoja na maandalizi yanayohitajika kwenye eneo. Kwa programu,
                eleza pia data, watumiaji na mifumo unayotaka kuunganisha.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Tuma ujumbe WhatsApp &rarr;</a>
                <Link href="/contact" className="btn btn-ghost">Tuma maombi</Link>
              </div>
            </div>
          </article>

          <aside style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', padding: '20px 18px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>Yaliyomo kwenye ukurasa</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  ...guide.map(s => [s.id, s.title]),
                  ['specifications', 'Vipimo'],
                  ['applications', 'Matumizi'],
                  ['maintenance', 'Matengenezo'],
                  ['faq', 'Maswali na majibu'],
                  ['supply', 'Usambazaji Tanzania'],
                ].map(([id, label]) => (
                  <a key={id} href={`#${id}`} style={{ fontSize: 15, color: 'var(--ink-2)' }}>{label}</a>
                ))}
              </nav>
            </div>

            <div style={{ background: 'var(--slate)', borderRadius: 'var(--r-md)', padding: '20px 18px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 10 }}>Pata bei</p>
              <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 15.5, lineHeight: 1.6, marginBottom: 16 }}>
                Nukuu huandaliwa kwa kazi na hali ya eneo lako pamoja na wigo wa vifaa vinavyohitajika.
              </p>
              <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold-2)' }}>+255 759 141 705 &rarr;</a>
            </div>

            {related.length > 0 && (
              <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', padding: '20px 18px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>Vifaa vinavyohusiana</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {related.map(r => (
                    <Link key={r.slug} href={`/equipments-swahili/${r.slug}`} style={{ display: 'block' }}>
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
        .art-body h2:first-child, .art-body > section:first-child h2 { margin-top: 0; }
        .art-body ol { margin: 0 0 18px; padding-left: 22px; }
        .art-body a { color: var(--gold-deep); text-decoration: underline; text-decoration-color: var(--line); }
        .eq-table-3 th[scope="row"] { width: 26%; }
        .eq-figure { margin: 8px 0 28px; padding: 20px; border: 1px solid var(--line); border-radius: var(--r-md); background: var(--bg-3); color: var(--ink); }
        .eq-diagram { overflow-x: auto; }
        .eq-diagram svg { min-width: 720px; }
        .eq-diagram:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
        .eq-diagram-hint { display: none; }
        @media (max-width: 780px) { .eq-diagram-hint { display: block; margin-bottom: 8px; } }
        .eq-figure figcaption { font-size: 14px; color: var(--ink-3); margin-top: 12px; line-height: 1.6; }
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
    </div>
  )
}
