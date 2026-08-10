import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, faqSchema, breadcrumbSchema, articleSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'

/**
 * Swahili cost page.
 *
 * "Bei" is what buyers actually type, so the slug leads with it rather than
 * with "gharama", which is the more formal word for cost. Paired by hreflang
 * with the English landed-cost article so the two are treated as language
 * variants rather than duplicates.
 *
 * NOTE FOR REVIEW: have a native Swahili speaker read this before it ships.
 * Written in standard Kiswahili with simple construction, but trade and
 * customs vocabulary varies and a local reader will catch anything stiff.
 */

const URL = `${SITE.url}/bei-ya-vifaa-vya-uchimbaji`
const EN = `${SITE.url}/insights/mining-equipment-cost-tanzania`

export const metadata: Metadata = {
  title: 'Bei ya Vifaa vya Uchimbaji Madini Tanzania | Bart Mining',
  description:
    'Bei ya vifaa vya uchimbaji madini Tanzania: gharama za usafirishaji, ushuru wa forodha, VAT, kutoa mzigo bandarini Dar es Salaam na usafiri hadi Mwanza, Geita na Kahama.',
  alternates: {
    canonical: URL,
    languages: { 'sw-TZ': URL, en: EN },
  },
  openGraph: {
    type: 'article', url: URL, locale: 'sw_TZ',
    title: 'Bei ya Vifaa vya Uchimbaji Madini Tanzania',
    description: 'Gharama halisi ya kufikisha kifaa eneo lako: usafirishaji, ushuru, VAT na usafiri wa ndani.',
  },
}

const FAQS = [
  {
    q: 'Kwa nini bei hazipo kwenye tovuti?',
    a: 'Kwa sababu kila mradi ni tofauti. Bei ya kifaa hutegemea kazi unayotaka kufanya, kiasi cha mawe kwa siku, aina ya mwamba wako na umeme uliopo eneo lako. Tukikupa bei bila kujua mambo haya, itakuwa ni bei ya kubahatisha. Tutumie taarifa za mradi wako na tutakupa bei kamili.',
  },
  {
    q: 'Nitaongeza kiasi gani juu ya bei ya kifaa?',
    a: 'Kwa kupanga bajeti, ongeza takribani asilimia 25 hadi 45 juu ya bei ya kiwandani ili kupata gharama ya kufikisha eneo lako Kanda ya Ziwa. Vifaa vikubwa lakini vyepesi hugharimu zaidi kwa sababu usafirishaji ndio unaotawala. Hii ni njia ya kukadiria tu, si mbadala wa bei rasmi.',
  },
  {
    q: 'Je, vifaa vya uchimbaji vinatozwa ushuru Tanzania?',
    a: 'Mashine nyingi za mitaji hutozwa kiwango cha chini cha ushuru chini ya ushuru wa pamoja wa Afrika Mashariki, na VAT ya asilimia 18 hutozwa juu yake. Wenye leseni fulani za madini wanaweza kupata msamaha kwa baadhi ya vifaa. Sheria hubadilika, hivyo thibitisha na TRA au wakala wako wa forodha kabla ya kupanga bajeti.',
  },
  {
    q: 'Vifaa vinachukua muda gani kufika?',
    a: 'Kutoka kiwandani nje ya nchi hadi eneo lako, panga wiki sita hadi kumi na mbili kwa mzigo wa kawaida wa kontena. Kutoka bandari ya Dar es Salaam hadi Mwanza, Geita au Kahama ni siku mbili hadi nne kwa barabara. Kuchelewa kunakotokea zaidi ni bandarini, si barabarani.',
  },
  {
    q: 'Ninawezaje kupunguza gharama?',
    a: 'Njia kubwa ni kuunganisha mizigo katika kontena moja badala ya kuagiza kidogo kidogo. Pia hakikisha msimbo wa forodha wa mzigo wako ni sahihi kabla haujasafirishwa, na nunua vipuri vya mwaka wa kwanza pamoja na mashine yenyewe badala ya kuvileta kwa ndege baadaye.',
  },
]

export default function SwahiliCostPage() {
  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            slug: 'mining-equipment-cost-tanzania',
            title: 'Bei ya Vifaa vya Uchimbaji Madini Tanzania',
            description: 'Gharama halisi ya kufikisha vifaa vya uchimbaji madini eneo lako Tanzania.',
            image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=800&h=400&q=75',
            datePublished: '2026-08-10',
            section: 'Bei',
          }),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Vifaa vya Uchimbaji', path: '/vifaa-vya-uchimbaji' },
            { name: 'Bei', path: '/bei-ya-vifaa-vya-uchimbaji' },
          ]),
        ]}
      />

      <div lang="sw">
        <section className="subhero" style={{ paddingBottom: 32 }}>
          <div className="px-site">
            <nav className="crumb" style={{ marginBottom: 24 }} aria-label="Breadcrumb">
              <Link href="/">Mwanzo</Link><span className="sep">/</span>
              <Link href="/vifaa-vya-uchimbaji">Vifaa vya uchimbaji</Link><span className="sep">/</span>
              <span>Bei</span>
            </nav>
            <span className="eyebrow">Bei na gharama</span>
            <h1 style={{ marginTop: 14 }}>Bei ya vifaa vya uchimbaji madini.</h1>
            <p className="lead">
              Bei unayopewa na muuzaji si gharama halisi ya kifaa. Kati ya bei ile na
              mashine inayofanya kazi eneo lako kuna usafirishaji wa baharini, ushuru wa
              forodha, VAT, gharama za bandari na usafiri wa ndani. Ukurasa huu unaeleza
              gharama zote ili uweze kupanga bajeti kamili.
            </p>
            <p style={{ color: 'var(--ink-3)', fontSize: 15, marginTop: 14 }}>
              <Link href="/insights/mining-equipment-cost-tanzania" style={{ color: 'var(--gold)', fontWeight: 600 }}>Read this page in English</Link>
            </p>
          </div>
        </section>

        <div className="px-site" style={{ paddingBottom: 72 }}>
          <article className="art-body">
            <h2 id="gharama">Gharama Zinazoongezeka</h2>
            <p>
              Bei nyingi zinazotolewa na wauzaji wa nje ni bei ya kiwandani au ya bandari
              ya kwao. Gharama zinazofuata ni zako mwenyewe:
            </p>
            <ul>
              <li><strong>Usafirishaji wa baharini.</strong> Kwa kontena hadi bandari ya Dar es Salaam, pamoja na bima ya mzigo</li>
              <li><strong>Ushuru wa forodha.</strong> Hutegemea msimbo wa forodha wa mzigo wako. Mashine za mitaji hutozwa kiwango cha chini kuliko bidhaa za kawaida</li>
              <li><strong>VAT.</strong> Asilimia 18 juu ya thamani ikijumuisha ushuru</li>
              <li><strong>Tozo nyingine.</strong> Tozo ya maendeleo ya reli na ada za forodha</li>
              <li><strong>Gharama za bandari.</strong> Kushusha mzigo, kuhifadhi na ada ya wakala wa forodha</li>
              <li><strong>Usafiri wa ndani.</strong> Kutoka Dar es Salaam hadi Kanda ya Ziwa ni takribani kilomita 1,000 hadi 1,250</li>
              <li><strong>Kazi za eneo lako.</strong> Msingi wa zege, umeme, maji na kufunga mashine. Hizi hazipo kwenye bei ya mashine</li>
            </ul>
            <p>
              Kwa jumla, ongeza takribani asilimia 25 hadi 45 juu ya bei ya kiwandani ili
              kupata gharama ya kufikisha eneo lako. Vifaa vikubwa lakini vyepesi hugharimu
              zaidi kwa sababu usafirishaji ndio unaotawala.
            </p>

            <h2 id="kupunguza">Jinsi ya Kupunguza Gharama</h2>
            <ul>
              <li><strong>Unganisha mizigo.</strong> Kontena moja iliyojaa ni nafuu kuliko mizigo mitatu midogo. Panga manunuzi kwa awamu badala ya kuagiza kila kifaa kinapohitajika</li>
              <li><strong>Hakikisha msimbo wa forodha ni sahihi</strong> kabla mzigo haujasafirishwa. Kurekebisha baadaye kunachukua muda na kunagharimu</li>
              <li><strong>Angalia kama unastahili msamaha.</strong> Baadhi ya leseni za madini zina nafuu kwa vifaa vya mitaji</li>
              <li><strong>Nunua vipuri pamoja na mashine.</strong> Kipuri kinacholetwa kwa ndege dharura hugharimu mara kadhaa ya thamani yake</li>
              <li><strong>Panga mzigo uweze kuingia kontena.</strong> Tanki linalosafirishwa likiwa vipande hugharimu kidogo sana kuliko likiwa limekamilika</li>
            </ul>

            <h2 id="muda">Muda wa Kufika</h2>
            <p>
              Kutoka kiwandani Asia hadi eneo lako Kanda ya Ziwa, panga wiki sita hadi kumi
              na mbili kwa mzigo wa kawaida wa kontena, ikiwa mashine ipo tayari. Mashine
              inayotengenezwa kwa oda huchukua muda zaidi. Kuchelewa kunakotokea zaidi ni
              bandarini kutokana na nyaraka, si barabarani.
            </p>

            <h2 id="mikoa">Tunasambaza Wapi</h2>
            <div className="region-chips">
              {['Mwanza','Geita','Kahama','Shinyanga','Bukombe','Tabora','Chunya','Mbeya','Dodoma','Dar es Salaam'].map(r => (
                <span key={r} className="region-chip">{r}</span>
              ))}
            </div>
            <p>
              Kwa maelezo ya kila eneo:{' '}
              <Link href="/equipment/supply/mwanza" style={{ color: 'var(--gold)', fontWeight: 600 }}>Mwanza</Link>,{' '}
              <Link href="/equipment/supply/geita" style={{ color: 'var(--gold)', fontWeight: 600 }}>Geita</Link>,{' '}
              <Link href="/equipment/supply/kahama" style={{ color: 'var(--gold)', fontWeight: 600 }}>Kahama</Link>.
            </p>

            <h2 id="maswali">Maswali Yanayoulizwa Mara kwa Mara</h2>
            {FAQS.map(f => (
              <div key={f.q} className="eq-faq">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <div className="on-dark" style={{ marginTop: 56, background: 'var(--slate)', borderRadius: 'var(--r-lg)', padding: '36px 32px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 12 }}>Omba bei</p>
              <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>Tunakupa bei ya kufikisha eneo lako</h3>
              <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
                Bei tunayokupa inajumuisha usafirishaji, ushuru na kufikisha eneo lako.
                Bei unayokubali ndiyo bei utakayolipa. Andika kwa Kiswahili au Kiingereza.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Tuma WhatsApp &rarr;</a>
                <Link href="/vifaa-vya-uchimbaji" className="btn btn-ghost">Tazama vifaa</Link>
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
        .art-body li { font-size: 16px; line-height: 1.75; color: var(--ink-2); margin-bottom: 8px; }
        .art-body strong { color: var(--ink); font-weight: 600; }
        .eq-faq { border-top: 1px solid var(--line-2); padding-top: 18px; margin-bottom: 20px; }
        .eq-faq h3 { margin-top: 0; }
        .eq-faq p { margin-bottom: 0; }
        .region-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .region-chip { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em; padding: 5px 12px;
          border-radius: var(--r-sm); background: var(--bg-3); border: 1px solid var(--line); color: var(--ink-2); }
        @media (max-width: 600px) { .art-body h2 { margin-top: 36px; } }
      `}</style>
    </>
  )
}
