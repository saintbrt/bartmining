import type { Metadata } from 'next'
import Link from 'next/link'
import { EQUIPMENT, equipmentByCategory } from '@/data/equipment-catalogue'
import { SITE, SERVICE_AREAS, itemListSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Mining Equipment Supply Tanzania — Specifications & Guides',
  description:
    'Mining equipment supplied across Mwanza, Kahama, Geita and Shinyanga: winches, gold processing plants, drilling rigs, pumps, safety equipment and mine management software.',
  alternates: { canonical: `${SITE.url}/equipment` },
  openGraph: {
    title: 'Mining Equipment Supply Tanzania — Specifications & Guides',
    description:
      'Specifications, applications and maintenance guides for 30 categories of mining equipment supplied across Tanzania.',
    url: `${SITE.url}/equipment`,
  },
}

export default function EquipmentHub() {
  const groups = equipmentByCategory()

  return (
    <>
      <JsonLd
        data={[
          itemListSchema(EQUIPMENT.map(e => ({ name: e.name, path: `/equipment/${e.slug}` }))),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Equipment', path: '/equipment' },
          ]),
        ]}
      />

      <section className="subhero" style={{ paddingBottom: 40 }}>
        <div className="px-site">
          <nav className="crumb" style={{ marginBottom: 24 }} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Equipment</span>
          </nav>
          <span className="eyebrow">Equipment supply</span>
          <h1 style={{ marginTop: 14 }}>Mining equipment, specified for the job.</h1>
          <p className="lead">
            Specifications, applications and maintenance guidance for {EQUIPMENT.length} categories
            of mining equipment we supply across Tanzania — from a 1 tonne winch to a full CIL
            plant. Every page states typical industry figures so you can scope a requirement
            before you enquire.
          </p>
        </div>
      </section>

      <div className="px-site" style={{ paddingBottom: 80 }}>
        {groups.map(group => (
          <section key={group.category} style={{ marginBottom: 56 }}>
            <h2 style={{
              fontSize: 'clamp(19px,2vw,24px)', marginBottom: 6,
              paddingBottom: 14, borderBottom: '1px solid var(--line)',
            }}>
              {group.label}
            </h2>
            <div className="eq-grid">
              {group.items.map(item => (
                <Link
                  key={item.slug}
                  href={`/equipment/${item.slug}`}
                  className="eq-card"
                >
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="eq-more">View specifications &rarr;</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 style={{ fontSize: 'clamp(19px,2vw,24px)', marginBottom: 14 }}>Regions we supply</h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 680, marginBottom: 18, lineHeight: 1.7 }}>
            Equipment is delivered nationwide from Dar es Salaam, with the heaviest coverage
            across the Lake Victoria Goldfields where most of Tanzania&apos;s gold mining sits.
          </p>
          <div className="region-chips">
            {SERVICE_AREAS.map(r => <span key={r} className="region-chip">{r}</span>)}
          </div>
        </section>
      </div>

      <style>{`
        .eq-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }
        .eq-card { display: block; border: 1px solid var(--line); border-radius: var(--r-lg);
          padding: 22px 20px; background: var(--bg-3); transition: border-color .2s; }
        .eq-card:hover { border-color: var(--ink-3); }
        .eq-card h3 { font-size: 18px; margin-bottom: 8px; color: var(--ink); line-height: 1.3; }
        .eq-card p { font-size: 15.5px; color: var(--ink-2); line-height: 1.6; margin-bottom: 14px; }
        .eq-more { font-family: var(--font-mono); font-size: 12.5px; letter-spacing: .06em;
          text-transform: uppercase; color: var(--gold); }
        .region-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .region-chip { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; padding: 5px 12px;
          border-radius: var(--r-sm); background: var(--bg-3); border: 1px solid var(--line); color: var(--ink-2); }
        @media (max-width: 1080px) { .eq-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px)  { .eq-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
