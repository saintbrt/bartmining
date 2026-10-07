import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import EquipmentThumb from '@/components/equipment/EquipmentThumb'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, itemListSchema, breadcrumbSchema } from '@/lib/seo'
import { MAKITA_FAMILIES, MAKITA_PRODUCTS, PARTNERSHIP_EN, PARTNERSHIP_SW } from '@/data/makita/families'
import { EQUIPMENT_BY_SLUG as EN_BY_SLUG } from '@/data/equipment-catalogue'
import { EQUIPMENT_BY_SLUG as SW_BY_SLUG } from '@/data/equipment-catalogue-sw'

/** Makita brand hub, shared by /equipment/makita and /equipment-swahili/makita. */

const TEXT = {
  en: {
    base: '/equipment', home: 'Home', equipment: 'Equipment', crumb: 'Makita',
    h1: 'Makita Power Tools for Mines, Plants and Workshops',
    lead: `Makita concrete-work and metal-work tools are ${PARTNERSHIP_EN}. Each page below covers one tool family: how to choose, where it is used on a mine or plant, and every model with its kit options and key specifications.`,
    groups: { 'concrete-tools': 'Concrete & Demolition Power Tools', 'metalwork-tools': 'Metalworking Power Tools' } as Record<string, string>,
    count: (p: number, m: number) => `${p} main product${p === 1 ? '' : 's'} · ${m} models`,
    more: 'View models',
    swLink: { text: 'Unasoma Kiswahili?', link: 'Tazama zana za Makita kwa Kiswahili', href: '/equipment-swahili/makita' },
    cta: { eyebrow: 'Order Makita tools', heading: 'Tell us the model, quantity and site', body: 'Send the model or tool you need, the quantity, whether you want the tool only or a kit with batteries, and your delivery location. We will confirm availability and quote.', primary: 'WhatsApp us', secondary: 'Contact us' },
  },
  sw: {
    base: '/equipment-swahili', home: 'Nyumbani', equipment: 'Vifaa', crumb: 'Makita',
    h1: 'Zana za umeme za Makita kwa migodi, mitambo na karakana',
    lead: `Zana za Makita za kazi za zege na za chuma ${PARTNERSHIP_SW}. Kila ukurasa hapa chini unahusu familia moja ya zana: jinsi ya kuchagua, inapotumika mgodini au kwenye mtambo, na kila modeli pamoja na chaguo za vifurushi na vipimo vikuu.`,
    groups: { 'concrete-tools': 'Zana za umeme za zege na kuvunja', 'metalwork-tools': 'Zana za umeme za kufanyia kazi chuma' } as Record<string, string>,
    count: (p: number, m: number) => `bidhaa kuu ${p} · modeli ${m}`,
    more: 'Tazama modeli',
    swLink: { text: 'Reading in English?', link: 'View Makita tools in English', href: '/equipment/makita' },
    cta: { eyebrow: 'Agiza zana za Makita', heading: 'Tueleze modeli, idadi na eneo', body: 'Tutumie modeli au zana unayohitaji, idadi, kama unataka zana pekee au kifurushi chenye betri, na eneo la kufikisha. Tutathibitisha upatikanaji na kutoa bei.', primary: 'WhatsApp', secondary: 'Wasiliana nasi' },
  },
} as const

export default function MakitaHub({ lang }: { lang: 'en' | 'sw' }) {
  const t = TEXT[lang]
  const bySlug = lang === 'en' ? EN_BY_SLUG : SW_BY_SLUG
  const categories = ['concrete-tools', 'metalwork-tools']
  return (
    <>
      <JsonLd data={[
        itemListSchema(MAKITA_FAMILIES.map(f => ({ name: bySlug.get(f.slug)?.name ?? f.name, path: `${t.base}/${f.slug}` }))),
        breadcrumbSchema([
          { name: t.home, path: '/' },
          { name: t.equipment, path: t.base },
          { name: t.crumb, path: `${t.base}/makita` },
        ]),
      ]} />
      <section className="subhero" style={{ paddingBottom: 32 }} lang={lang === 'sw' ? 'sw' : undefined}>
        <div className="px-site">
          <Reveal>
            <nav className="crumb" aria-label="Breadcrumb">
              <Link href="/">{t.home}</Link><span className="sep">/</span><Link href={t.base}>{t.equipment}</Link><span className="sep">/</span><span>{t.crumb}</span>
            </nav>
          </Reveal>
          <Reveal delay={1}><h1 style={{ marginTop: 14 }}>{t.h1}</h1></Reveal>
          <Reveal delay={2}><p className="lead">{t.lead}</p></Reveal>
          <p style={{ marginTop: 16, fontSize: 15 }} lang={lang === 'en' ? 'sw' : 'en'}>
            {t.swLink.text} <Link href={t.swLink.href} style={{ color: 'var(--gold)', fontWeight: 600 }}>{t.swLink.link}</Link>
          </p>
        </div>
      </section>

      <div className="px-site" style={{ paddingBottom: 72 }} lang={lang === 'sw' ? 'sw' : undefined}>
        {categories.map((c, ci) => {
          const fams = MAKITA_FAMILIES.filter(f => f.category === c)
          return (
            <section key={c} style={{ marginTop: ci === 0 ? 8 : 56 }}>
              <div className="mk-head"><h2>{t.groups[c]}</h2></div>
              <div className="mk-grid">
                {fams.map((f, i) => {
                  const item = bySlug.get(f.slug)
                  const prods = MAKITA_PRODUCTS.filter(p => p.family === f.family)
                  const models = prods.reduce((n, p) => n + p.models.length, 0)
                  return (
                    <Link key={f.slug} href={`${t.base}/${f.slug}`} className="mk-card">
                      <EquipmentThumb slug={f.slug} language={lang} alt={item?.name ?? f.name} category={f.category} sizes="(max-width: 860px) 50vw, 310px" priority={ci === 0 && i < 2} />
                      <div className="mk-body">
                        <h3>{item?.name ?? f.name}</h3>
                        <p>{prods.map(p => p.name).join(' · ')}</p>
                        <span className="mk-meta">{t.count(prods.length, models)}</span>
                        <span className="mk-more">{t.more} &rarr;</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <CtaSection
        eyebrow={t.cta.eyebrow}
        heading={<>{t.cta.heading}</>}
        body={t.cta.body}
        primaryLabel={t.cta.primary}
        primaryHref="https://wa.me/255759141705"
        secondaryLabel={t.cta.secondary}
        secondaryHref="/contact"
      />

      <style>{`
        .mk-head { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid var(--line); padding-bottom: 12px; margin-bottom: 22px; }
        .mk-head h2 { font-size: clamp(22px, 2.4vw, 28px); }
        .mk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .mk-card { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: var(--r-md, 8px); overflow: hidden; background: var(--bg, #fff); color: inherit; text-decoration: none; }
        .mk-card:hover { border-color: var(--ink-3); }
        .mk-card:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .mk-card .eq-thumb { position: relative; aspect-ratio: 4 / 3; width: 100%; border-bottom: 1px solid var(--line); background: #fff; }
        .mk-card .eq-thumb-empty { display: grid; place-items: center; background: var(--paper); }
        .mk-card .eq-thumb-empty svg { width: 42%; max-width: 84px; height: auto; color: var(--ink-3); opacity: .45; }
        .mk-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .mk-body h3 { font-size: 17px; line-height: 1.3; color: var(--ink); }
        .mk-body p { font-size: 14.5px; color: var(--ink-2); line-height: 1.55; flex: 1; }
        .mk-meta { font-size: 13px; color: var(--ink-3); }
        .mk-more { font-size: 14px; font-weight: 600; color: var(--gold); }
        @media (max-width: 1080px) { .mk-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .mk-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}

export function makitaHubMetadata(lang: 'en' | 'sw') {
  const en = `${SITE.url}/equipment/makita`, sw = `${SITE.url}/equipment-swahili/makita`
  const title = lang === 'en' ? 'Makita Power Tools in Tanzania' : 'Zana za umeme za Makita Tanzania'
  const description = lang === 'en'
    ? 'Makita concrete-work and metal-work tools available through Bart Mining in partnership with Makita Tanzania: hammers, breakers, cutters, grinders, saws and shears.'
    : 'Zana za Makita za zege na chuma zinapatikana kupitia Bart Mining kwa ushirikiano na Makita Tanzania: hammer, breaker, mashine za kukata, grinder, misumeno na shear.'
  const url = lang === 'en' ? en : sw
  return {
    title, description,
    alternates: { canonical: url, languages: { en, 'sw-TZ': sw, 'x-default': en } },
    openGraph: { type: 'website' as const, url, title, description, ...(lang === 'sw' ? { locale: 'sw_TZ' } : {}) },
  }
}
