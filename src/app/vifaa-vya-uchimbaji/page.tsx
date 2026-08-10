import type { Metadata } from 'next'
import Link from 'next/link'
import EquipmentThumb from '@/components/equipment/EquipmentThumb'
import { EQUIPMENT_BY_SLUG } from '@/data/equipment-catalogue'
import { LOCATIONS } from '@/data/locations'
import { SITE, faqSchema, breadcrumbSchema, serviceSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'

/**
 * Swahili gateway page.
 *
 * The business sells in Tanzania, where Swahili is the national language, and
 * the site had no Swahili content at all. Competition on these terms is close
 * to nil and AI assistants answering Swahili queries currently have very
 * little to draw on.
 *
 * The page is marked lang="sw" on its content wrapper because the root layout
 * declares lang="en", and it is cross-linked with hreflang so search engines
 * treat it as the Swahili counterpart of /equipment rather than duplicate
 * content.
 *
 * NOTE FOR REVIEW: this copy should be read by a native Swahili speaker
 * before it ships. It is written in standard Kiswahili sanifu with simple
 * sentence construction, but mining vocabulary varies by region and a local
 * reviewer will catch anything that reads as translated rather than written.
 */

const URL = `${SITE.url}/vifaa-vya-uchimbaji`

export const metadata: Metadata = {
  title: 'Vifaa vya Uchimbaji Madini Tanzania | Bart Mining',
  description:
    'Tunauza vifaa vya uchimbaji madini Tanzania: mitambo ya kuchenjua dhahabu, winchi, pampu, mashine za kuponda mawe na vifaa vya usalama. Mwanza, Geita, Kahama na Dar es Salaam.',
  alternates: {
    canonical: URL,
    languages: { 'sw-TZ': URL, en: `${SITE.url}/equipment` },
  },
  openGraph: {
    type: 'website',
    url: URL,
    locale: 'sw_TZ',
    title: 'Vifaa vya Uchimbaji Madini Tanzania | Bart Mining',
    description: 'Mitambo ya dhahabu, winchi, pampu na vifaa vya usalama. Tunasambaza Mwanza, Geita, Kahama na mikoa mingine.',
  },
}

const KITS = [
  { slug: 'centrifugal-gold-concentrator', sw: 'Mashine ya kuchenjua dhahabu', note: 'Hutenganisha dhahabu kwa mzunguko wa kasi. Haitumii zebaki wala kemikali.' },
  { slug: 'shaking-table-gold', sw: 'Meza ya kutingisha', note: 'Husafisha dhahabu iliyochenjuliwa hadi kufikia hatua ya kuyeyusha.' },
  { slug: 'ball-mill-gold-ore', sw: 'Kinu cha kusaga mawe', note: 'Husaga mawe ili dhahabu iachiliwe kabla ya kuchenjua.' },
  { slug: 'jaw-crusher', sw: 'Mashine ya kuponda mawe', note: 'Huponda mawe makubwa kuwa madogo tayari kwa kusagwa.' },
  { slug: '1-ton-winch', sw: 'Winchi ya tani moja', note: 'Hupandisha ndoo za mawe kutoka shimoni. Ina breki ya usalama.' },
  { slug: 'submersible-dewatering-pump', sw: 'Pampu ya kutoa maji', note: 'Hutoa maji shimoni. Hufanya kazi ikiwa ndani ya maji yenyewe.' },
  { slug: 'mining-safety-helmet-cap-lamp', sw: 'Kofia ngumu na taa', note: 'Kinga ya kichwa pamoja na taa ya kuchajiwa kwa kazi za chini ya ardhi.' },
  { slug: 'gas-detection-monitor', sw: 'Kipima gesi', note: 'Hupima hewa ya oksijeni, kaboni monoksidi na gesi nyingine hatari.' },
]

const FAQS = [
  {
    q: 'Mnauza vifaa gani vya uchimbaji madini?',
    a: 'Tunauza mitambo ya kuchenjua dhahabu, vinu vya kusaga, mashine za kuponda mawe, winchi za shimoni, pampu za maji, vifaa vya usalama, mitambo ya umeme na kompresa. Kila kifaa kina ukurasa wake wenye maelezo kamili ya kiufundi.',
  },
  {
    q: 'Mnasambaza mikoa gani?',
    a: 'Tunasambaza Tanzania nzima kutoka Dar es Salaam. Tunahudumia zaidi mikoa ya Kanda ya Ziwa: Mwanza, Geita, Kahama, Shinyanga na Bukombe, pamoja na Chunya, Mbeya, Tabora na Dodoma.',
  },
  {
    q: 'Bei ni kiasi gani?',
    a: 'Bei hutegemea kazi unayotaka kufanya, ukubwa wa uzalishaji na hali ya eneo lako. Hatuweki bei kwenye tovuti kwa sababu kila mradi ni tofauti. Tutumie taarifa za mradi wako na tutakupa bei kamili ikiwa ni pamoja na usafirishaji, ushuru na kufikisha eneo lako.',
  },
  {
    q: 'Je, naweza kuacha kutumia zebaki?',
    a: 'Ndiyo. Mashine ya kuchenjua dhahabu kwa mzunguko wa kasi ikiunganishwa na meza ya kutingisha hupata dhahabu nyingi kuliko zebaki, na hutoa dhahabu safi tayari kuyeyushwa. Zebaki ni hatari kwa afya yako na kwa familia yako, na pia hupoteza dhahabu ndogo ndogo.',
  },
  {
    q: 'Vifaa vinachukua muda gani kufika?',
    a: 'Kutoka bandari ya Dar es Salaam hadi Kanda ya Ziwa ni takribani siku mbili hadi nne kwa barabara. Kwa vifaa vinavyoagizwa nje, panga wiki sita hadi kumi na mbili kutoka kuagiza hadi kufika eneo lako.',
  },
]

export default function SwahiliGateway() {
  const items = KITS.map(k => ({ ...k, item: EQUIPMENT_BY_SLUG.get(k.slug) })).filter(x => x.item)

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            slug: 'mwanza',
            name: 'Uuzaji wa vifaa vya uchimbaji madini Tanzania',
            description: 'Mitambo ya kuchenjua dhahabu, winchi, pampu na vifaa vya usalama kwa wachimbaji Tanzania.',
            city: 'Mwanza', region: 'Kanda ya Ziwa',
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Vifaa vya Uchimbaji', path: '/vifaa-vya-uchimbaji' },
          ]),
        ]}
      />

      {/* lang is set here because the root layout declares lang="en". */}
      <div lang="sw">
        <section className="subhero" style={{ paddingBottom: 32 }}>
          <div className="px-site">
            <nav className="crumb" style={{ marginBottom: 24 }} aria-label="Breadcrumb">
              <Link href="/">Mwanzo</Link><span className="sep">/</span><span>Vifaa vya uchimbaji</span>
            </nav>
            <span className="eyebrow">Kiswahili</span>
            <h1 style={{ marginTop: 14 }}>Vifaa vya uchimbaji madini Tanzania.</h1>
            <p className="lead">
              Bart Mining inauza na kufunga mitambo ya kuchenjua dhahabu, winchi, pampu,
              mashine za kuponda mawe na vifaa vya usalama. Tunahudumia wachimbaji wadogo
              na wa kati katika Kanda ya Ziwa, tukitoka Dar es Salaam.
            </p>
            <p style={{ color: 'var(--ink-3)', fontSize: 15, marginTop: 14 }}>
              <Link href="/equipment" style={{ color: 'var(--gold)', fontWeight: 600 }}>Read this page in English</Link>
            </p>
          </div>
        </section>

        <div className="px-site" style={{ paddingBottom: 72 }}>
          <article className="art-body">
            <h2 id="vifaa">Vifaa Tunavyouza</h2>
            <p>
              Kila kifaa kina ukurasa wenye maelezo ya kiufundi, matumizi yake na jinsi ya
              kukitunza. Kwa sasa maelezo hayo yapo kwa Kiingereza, lakini unaweza kutuuliza
              kwa Kiswahili wakati wowote.
            </p>
            <div className="sw-grid">
              {items.map(({ slug, sw, note, item }) => (
                <Link key={slug} href={`/equipment/${slug}`} className="eq-card">
                  <EquipmentThumb slug={slug} alt={sw} category={item!.category} sizes="(max-width: 640px) 50vw, 25vw" />
                  <div className="eq-cardbody">
                    <h3>{sw}</h3>
                    <p>{note}</p>
                    <span className="eq-more">Maelezo zaidi &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>

            <h2 id="zebaki">Kuacha Zebaki</h2>
            <p>
              Wachimbaji wengi bado wanatumia zebaki kupata dhahabu. Zebaki ni hatari kwa afya
              ya mchimbaji na familia yake, huchafua maji, na pia hupoteza dhahabu ndogo ndogo
              ambayo haiungani nayo.
            </p>
            <p>
              Mashine ya kuchenjua dhahabu kwa mzunguko wa kasi, ikiunganishwa na meza ya
              kutingisha, hupata asilimia 85 hadi 98 ya dhahabu iliyoachiliwa bila kutumia
              kemikali yoyote. Hutumia maji tu. Dhahabu inayopatikana huwa safi kiasi cha
              kuyeyushwa moja kwa moja.
            </p>

            <h2 id="bei">Bei na Gharama</h2>
            <p>
              Bei hutegemea kazi unayotaka kufanya na hali ya eneo lako, hivyo hatuweki bei
              kwenye tovuti. Lakini tumeandika ukurasa unaoeleza gharama zote zinazoongezeka
              juu ya bei ya mashine: usafirishaji, ushuru wa forodha, VAT na usafiri wa ndani.
            </p>
            <p>
              <Link href="/bei-ya-vifaa-vya-uchimbaji" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                Soma kuhusu bei ya vifaa vya uchimbaji &rarr;
              </Link>
            </p>

            <h2 id="mikoa">Mikoa Tunayohudumia</h2>
            <p>
              Tunasambaza Tanzania nzima kutoka Dar es Salaam. Kwa maelezo ya kina ya kila
              eneo, tembelea kurasa hizi:
            </p>
            <ul>
              {LOCATIONS.map(l => (
                <li key={l.slug}>
                  <Link href={`/equipment/supply/${l.slug}`} style={{ color: 'var(--gold)', fontWeight: 600 }}>
                    Vifaa vya uchimbaji {l.city}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="region-chips">
              {['Mwanza','Geita','Kahama','Shinyanga','Bukombe','Tabora','Chunya','Mbeya','Dodoma','Arusha','Dar es Salaam','Kigoma'].map(r => (
                <span key={r} className="region-chip">{r}</span>
              ))}
            </div>

            <h2 id="maswali">Maswali Yanayoulizwa Mara kwa Mara</h2>
            {FAQS.map(f => (
              <div key={f.q} className="eq-faq">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <div className="on-dark" style={{ marginTop: 56, background: 'var(--slate)', borderRadius: 'var(--r-lg)', padding: '36px 32px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 12 }}>Wasiliana nasi</p>
              <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>Unahitaji kifaa gani?</h3>
              <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
                Tuambie kazi unayotaka kufanya, kiasi cha mawe kwa siku, na aina ya umeme
                uliopo eneo lako. Tutakupa ushauri na bei kamili. Unaweza kuandika kwa
                Kiswahili au Kiingereza.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Tuma WhatsApp &rarr;</a>
                <Link href="/contact" className="btn btn-ghost">Jaza fomu</Link>
              </div>
            </div>
          </article>
        </div>
      </div>

      <style>{`
        .art-body h2 { font-size: clamp(20px,2.2vw,26px); font-weight: 700; margin: 44px 0 14px; color: var(--ink); line-height: 1.3; }
        .art-body h2:first-child { margin-top: 0; }
        .art-body h3 { font-size: clamp(16px,1.6vw,19px); font-weight: 700; margin: 26px 0 8px; color: var(--ink); }
        .art-body p { font-size: 16px; line-height: 1.75; color: var(--ink-2); margin-bottom: 18px; max-width: 68ch; }
        .art-body ul { margin: 0 0 18px; padding-left: 20px; }
        .art-body li { font-size: 16px; line-height: 1.9; color: var(--ink-2); }

        .sw-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 22px 0 8px; }
        .eq-card { display: flex; flex-direction: column; border: 1px solid var(--line);
          border-radius: var(--r-lg); overflow: hidden; background: var(--bg-3); transition: border-color .2s; }
        .eq-card:hover { border-color: var(--ink-3); }
        .eq-cardbody { padding: 14px; display: flex; flex-direction: column; gap: 7px; flex: 1; }
        .eq-card h3 { font-size: 15.5px; margin: 0; color: var(--ink); line-height: 1.3; }
        .eq-card p { font-size: 14.5px; color: var(--ink-2); line-height: 1.5; margin: 0; flex: 1; }
        .eq-more { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .06em;
          text-transform: uppercase; color: var(--gold); margin-top: auto; }
        .eq-thumb { position: relative; aspect-ratio: 4 / 3; width: 100%;
          border-bottom: 1px solid var(--line); background: var(--paper); }
        .eq-thumb-empty { display: grid; place-items: center;
          background-image: repeating-linear-gradient(45deg, transparent 0 7px, rgba(94,104,109,.055) 7px 8px); }
        .eq-thumb-empty svg { width: 42%; max-width: 84px; height: auto; color: var(--ink-3); opacity: .45; }

        .eq-faq { border-top: 1px solid var(--line-2); padding-top: 18px; margin-bottom: 20px; }
        .eq-faq h3 { margin-top: 0; }
        .eq-faq p { margin-bottom: 0; }

        .region-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .region-chip { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; padding: 5px 12px;
          border-radius: var(--r-sm); background: var(--bg-3); border: 1px solid var(--line); color: var(--ink-2); }

        @media (max-width: 1080px) { .sw-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 780px)  { .sw-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .art-body h2 { margin-top: 36px; } }
      `}</style>
    </>
  )
}
