import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE, faqSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import { getGoldQuote, formatTzs, formatSwDateTime } from '@/lib/gold-spot'

/**
 * Swahili "gold price today" page.
 *
 * "Bei ya dhahabu leo" is searched daily, so the page regenerates hourly
 * from the public gold-api.com spot price and an open USD/TZS feed. Neither
 * endpoint needs a key. If both fail the page still renders, without
 * numbers, rather than erroring.
 *
 * The figure shown is the international spot price converted to shillings.
 * It is deliberately NOT presented as the Mining Commission's indicative
 * price, which is lower because it reflects royalty and fee deductions.
 *
 * NOTE FOR REVIEW: have a native Swahili speaker read this before it ships.
 */

export const revalidate = 3600

const URL = `${SITE.url}/bei-ya-dhahabu-leo`

export const metadata: Metadata = {
  title: 'Bei ya Dhahabu Leo Tanzania kwa Gramu',
  description:
    'Bei ya dhahabu leo Tanzania kwa gramu na kwa aunsi, kwa shilingi na dola. Karati 24, 22 na 18, pamoja na maelezo ya bei elekezi ya Tume ya Madini na mrabaha.',
  alternates: { canonical: URL, languages: { 'sw-TZ': URL } },
  openGraph: {
    type: 'website', url: URL, locale: 'sw_TZ',
    title: 'Bei ya Dhahabu Leo Tanzania',
    description: 'Bei ya dhahabu kwa gramu kwa shilingi, inasasishwa kila saa.',
  },
}

const tzs = formatTzs
const usd = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`

const KARATS = [
  { k: '24K', purity: 1, note: 'Dhahabu safi (99.9%)' },
  { k: '22K', purity: 22 / 24, note: 'Asilimia 91.7' },
  { k: '18K', purity: 18 / 24, note: 'Asilimia 75' },
]

const FAQS = [
  {
    q: 'Kwa nini bei ya soko la madini ni chini kuliko bei ya dunia?',
    a: 'Bei elekezi inayotolewa na Tume ya Madini kwa masoko ya madini na vituo vya ununuzi huzingatia makato kama mrabaha na ada ya ukaguzi. Kwa hiyo mchimbaji hupokea bei iliyo chini kidogo ya bei ya soko la dunia iliyobadilishwa kwa shilingi. Kwa mfano, tarehe 5 Septemba 2026 bei elekezi ilikuwa takribani TSh 341,008 kwa gramu kwenye masoko ya madini na TSh 333,430 kwenye vituo vya ununuzi.',
  },
  {
    q: 'Mrabaha wa dhahabu Tanzania ni kiasi gani?',
    a: 'Mrabaha wa kawaida wa dhahabu ni asilimia 6. Unapungua hadi asilimia 4 dhahabu ikiuzwa kwa Benki Kuu ya Tanzania, na asilimia 2 ikiuzwa kwa kiwanda cha kusafisha dhahabu nchini. Pia kuna ada ya ukaguzi ya asilimia 1 kwa mauzo mengi. Viwango hubadilika, hivyo thibitisha na Tume ya Madini.',
  },
  {
    q: 'Bei hii inasasishwa mara ngapi?',
    a: 'Ukurasa huu unasasisha bei ya dhahabu ya soko la dunia na kiwango cha kubadilisha dola kuwa shilingi kila saa. Bei ya soko hubadilika muda wote, hivyo tumia hii kama mwongozo na thibitisha bei ya siku kwenye soko la madini kabla ya kuuza.',
  },
  {
    q: 'Nauza wapi dhahabu kihalali?',
    a: 'Kwenye masoko ya madini na vituo vya ununuzi vilivyosajiliwa na Tume ya Madini, vilivyopo katika maeneo kama Geita, Mwanza, Chunya, Kahama, Shinyanga, Songwe, Mara na Kigoma, au kwa wafanyabiashara wenye leseni halali. Kuuza nje ya mfumo huu ni kinyume cha sheria.',
  },
  {
    q: 'Gramu moja ya dhahabu ya karati 22 ni shilingi ngapi?',
    a: 'Chukua bei ya gramu ya karati 24 na uzidishe kwa 0.917. Jedwali lililo juu ya ukurasa huu linaonyesha hesabu hiyo kwa bei ya leo. Bei halisi utakayolipwa pia hutegemea usafi uliopimwa na makato ya mnunuzi.',
  },
]

export default async function GoldPriceTodayPage() {
  const q = await getGoldQuote(revalidate)
  const gramTzs = q ? q.tzsGram : null
  const updated = q ? formatSwDateTime(q.updatedAt) : null

  return (
    <>
      <JsonLd
        data={[
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Bei ya Dhahabu Leo', path: '/bei-ya-dhahabu-leo' },
          ]),
        ]}
      />

      <div lang="sw">
        <section className="subhero" style={{ paddingBottom: 32 }}>
          <div className="px-site">
            <nav className="crumb" style={{ marginBottom: 24 }} aria-label="Breadcrumb">
              <Link href="/">Mwanzo</Link><span className="sep">/</span>
              <span>Bei ya dhahabu leo</span>
            </nav>
            <span className="eyebrow">Bei ya dhahabu</span>
            <h1 style={{ marginTop: 14 }}>Bei ya dhahabu leo Tanzania</h1>
            <p className="lead">
              Bei ya dhahabu ya soko la dunia kwa gramu na kwa aunsi, imebadilishwa kuwa
              shilingi za Kitanzania. Inasasishwa kila saa.
            </p>

            {q && gramTzs ? (
              <div className="gp-hero">
                <div>
                  <div className="gp-label">Gramu 1, karati 24</div>
                  <div className="gp-big">{tzs(gramTzs)}</div>
                </div>
                <div>
                  <div className="gp-label">Aunsi 1 (gramu 31.1)</div>
                  <div className="gp-mid">{usd(q.usdOz)}</div>
                  <div className="gp-sub">{tzs(q.usdOz * q.usdToTzs)}</div>
                </div>
                <div>
                  <div className="gp-label">Dola 1 = shilingi</div>
                  <div className="gp-mid">{q.usdToTzs.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                  <div className="gp-sub">Imesasishwa {updated}</div>
                </div>
              </div>
            ) : (
              <p className="gp-down">
                Bei haipatikani kwa sasa. Tafadhali jaribu tena baada ya muda mfupi.
              </p>
            )}
          </div>
        </section>

        <div className="px-site" style={{ paddingBottom: 72 }}>
          <article className="art-body">
            {gramTzs && (
              <>
                <h2 id="karati">Bei kwa Karati</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table className="gp-table">
                    <thead><tr><th>Karati</th><th>Usafi</th><th>Gramu 1</th><th>Gramu 10</th></tr></thead>
                    <tbody>
                      {KARATS.map(r => (
                        <tr key={r.k}>
                          <td><strong>{r.k}</strong></td>
                          <td>{r.note}</td>
                          <td>{tzs(gramTzs * r.purity)}</td>
                          <td>{tzs(gramTzs * r.purity * 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <h2 id="soko">Bei ya Soko la Dunia na Bei ya Soko la Madini</h2>
            <p>
              Bei iliyo juu ni bei ya soko la dunia iliyobadilishwa kuwa shilingi. Bei
              utakayolipwa kwenye soko la madini au kituo cha ununuzi huwa chini kidogo,
              kwa sababu Tume ya Madini hutoa <strong>bei elekezi</strong> inayozingatia
              makato kama mrabaha na ada ya ukaguzi. Tarehe 5 Septemba 2026, kwa mfano,
              bei elekezi ilikuwa takribani <strong>TSh 341,008 kwa gramu</strong> kwenye
              masoko ya madini na <strong>TSh 333,430 kwa gramu</strong> kwenye vituo vya
              ununuzi.
            </p>
            <p>
              Bei halisi pia hutegemea usafi wa dhahabu yako unaopimwa sokoni. Dhahabu
              isiyosafishwa vizuri hupimwa chini ya karati 24 na hulipwa kulingana na hilo.
            </p>

            <h2 id="mrabaha">Mrabaha na Makato</h2>
            <ul>
              <li><strong>Mrabaha wa kawaida:</strong> asilimia 6</li>
              <li><strong>Ukiuza kwa Benki Kuu ya Tanzania:</strong> asilimia 4</li>
              <li><strong>Ukiuza kwa kiwanda cha kusafisha dhahabu nchini:</strong> asilimia 2</li>
              <li><strong>Ada ya ukaguzi:</strong> asilimia 1 kwa mauzo mengi</li>
            </ul>
            <p>
              Viwango hivi hubadilika kupitia Sheria ya Fedha kila mwaka. Thibitisha
              viwango vya sasa na Tume ya Madini kabla ya kuuza.
            </p>

            <h2 id="masoko">Masoko ya Madini</h2>
            <p>
              Tanzania ina mtandao wa masoko ya madini na vituo vya ununuzi katika maeneo
              yenye madini, yakiwemo:
            </p>
            <div className="region-chips">
              {['Geita','Mwanza','Chunya','Kahama','Shinyanga','Songwe','Mara','Kigoma','Manyara','Arusha','Dar es Salaam'].map(r => (
                <span key={r} className="region-chip">{r}</span>
              ))}
            </div>

            <h2 id="uzalishaji">Ongeza Dhahabu Unayopata</h2>
            <p>
              Bei ya dhahabu ikiwa juu, kila gramu inayopotea kwenye mabaki (marudio) ni
              hasara kubwa zaidi. Mashine sahihi za kusaga, kutenganisha dhahabu na
              kuchenjua zinaongeza kiasi unachopata kutoka kwenye mawe yale yale. Tazama{' '}
              <Link href="/vifaa-vya-uchimbaji" style={{ color: 'var(--gold)', fontWeight: 600 }}>vifaa vya uchimbaji</Link>,{' '}
              <Link href="/equipment/centrifugal-gold-concentrator" style={{ color: 'var(--gold)', fontWeight: 600 }}>concentrator</Link>{' '}
              na{' '}
              <Link href="/equipment/leaching-tank" style={{ color: 'var(--gold)', fontWeight: 600 }}>matanki ya kuchenjua</Link>.
            </p>

            <h2 id="maswali">Maswali Yanayoulizwa Mara kwa Mara</h2>
            {FAQS.map(f => (
              <div key={f.q} className="eq-faq">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}

            <p style={{ color: 'var(--ink-3)', fontSize: 14, marginTop: 28 }}>
              Bei zilizo kwenye ukurasa huu ni kwa taarifa tu na si ushauri wa kifedha.
              Chanzo: bei ya soko la dunia ya XAU na kiwango cha kubadilisha fedha USD/TZS.
            </p>

            <div className="on-dark" style={{ marginTop: 40, background: 'var(--slate)', borderRadius: 'var(--r-lg)', padding: '36px 32px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 12 }}>Bart Mining</p>
              <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>Unahitaji mashine za kuchakata dhahabu?</h3>
              <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 16, marginBottom: 24, lineHeight: 1.6 }}>
                Tunasambaza ball mill, concentrator, matanki ya CIP na plant za elution hadi
                eneo lako. Andika kwa Kiswahili au Kiingereza.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Tuma WhatsApp &rarr;</a>
                <Link href="/bei-ya-vifaa-vya-uchimbaji" className="btn btn-ghost">Bei ya vifaa</Link>
              </div>
            </div>
          </article>
        </div>
      </div>

      <style>{`
        .gp-hero { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 20px; margin-top: 28px;
          background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-md); padding: 24px 28px; }
        .gp-label { font-family: var(--font-mono); font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
        .gp-big { font-size: clamp(30px,4vw,44px); font-weight: 800; color: var(--gold-deep); line-height: 1.1; }
        .gp-mid { font-size: 24px; font-weight: 700; color: var(--ink); }
        .gp-sub { font-size: 14px; color: var(--ink-3); margin-top: 4px; }
        .gp-down { margin-top: 24px; color: var(--ink-2); }
        .gp-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 15.5px; }
        .gp-table th { background: var(--slate); color: rgba(255,255,255,.8); padding: 10px 14px; text-align: left; font-weight: 600; }
        .gp-table td { padding: 10px 14px; border-bottom: 1px solid var(--line-2); color: var(--ink-2); white-space: nowrap; }
        .art-body h2 { font-size: clamp(20px,2.2vw,26px); font-weight: 700; margin: 44px 0 14px; color: var(--ink); line-height: 1.3; }
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
        @media (max-width: 700px) { .gp-hero { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
