import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import CtaSection from '@/components/sections/CtaSection'
import LeachTankCalculator from '@/components/tools/LeachTankCalculator'
import LeachTankPlantIllustration from '@/components/tools/LeachTankPlantIllustration'
import JsonLd from '@/components/seo/JsonLd'
import { SITE, breadcrumbSchema } from '@/lib/seo'

/**
 * Kikokotoo cha tanki la leaching: Kiswahili counterpart of
 * /tools/leach-tank-calculator, cross-linked with hreflang.
 * NOTE FOR REVIEW: native Kiswahili review pending.
 */

const URL = `${SITE.url}/insights-swahili/kikokotoo-cha-tanki-la-leaching`
const EN_URL = `${SITE.url}/tools/leach-tank-calculator`
const TITLE = 'Kikokotoo cha ujazo wa tanki la leaching (CIL na CIP)'
const DESCRIPTION = 'Kokotoa mtiririko wa tope, ujazo wa kazi na ujazo wa kila tanki kwa mtambo mdogo wa CIL au CIP kutokana na tani kwa siku, msongamano wa tope na muda wa leaching.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL, languages: { 'sw-TZ': URL, en: EN_URL, 'x-default': EN_URL } },
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESCRIPTION, locale: 'sw_TZ' },
}

export default function KikokotooPage() {
  return (
    <>
      <JsonLd data={[
        {
          '@context': 'https://schema.org', '@type': 'WebApplication', name: TITLE, url: URL, description: DESCRIPTION, inLanguage: 'sw',
          applicationCategory: 'CalculatorApplication', operatingSystem: 'Any', isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        breadcrumbSchema([
          { name: 'Nyumbani', path: '/' },
          { name: 'Maarifa kwa Kiswahili', path: '/insights-swahili' },
          { name: 'Kikokotoo cha tanki la leaching', path: '/insights-swahili/kikokotoo-cha-tanki-la-leaching' },
        ]),
      ]} />

      <section className="subhero" style={{ paddingBottom: 32 }} lang="sw">
        <div className="px-site">
          <Reveal>
            <nav className="crumb" aria-label="Njia">
              <Link href="/">Nyumbani</Link><span className="sep">/</span><Link href="/insights-swahili">Maarifa kwa Kiswahili</Link><span className="sep">/</span><span>Kikokotoo cha tanki</span>
            </nav>
          </Reveal>
          <Reveal delay={1}><h1 style={{ marginTop: 14 }}>{TITLE}</h1></Reveal>
          <Reveal delay={2}>
            <p className="lead">
              Matanki ya leaching yanahitaji kuwa na ukubwa gani kwa mtambo wako? Ujazo unatokana na mtiririko wa tope na muda
              ambao madini yako yanahitaji kuyeyuka. Weka tani kwa siku, msongamano wa tope, msongamano wa madini ukilinganishwa na maji (specific gravity) na muda wa
              leaching kutoka kwenye jaribio lako, na kikokotoo kitakupa ujazo wa kazi na ujazo wa kila tanki.
            </p>
          </Reveal>
          <p style={{ marginTop: 16, fontSize: 15 }} lang="en">
            Reading in English? <Link href="/tools/leach-tank-calculator" style={{ color: 'var(--gold)', fontWeight: 600 }}>Use the calculator in English</Link>
          </p>
          <LeachTankPlantIllustration lang="sw" />
        </div>
      </section>

      <section className="sec-gap-sm" style={{ background: 'var(--paper)' }} lang="sw">
        <div className="px-site">
          <LeachTankCalculator lang="sw" />
        </div>
      </section>

      <section className="sec-gap-sm" lang="sw">
        <div className="px-site tool-prose">
          <h2>Jinsi hesabu inavyofanyika</h2>
          <p>
            Kikokotoo kwanza hubadilisha tani zako kwa siku kuwa tani za yabisi kwa saa kwa kugawanya kwa saa za kazi za mtambo. Kisha
            hukokotoa ujazo wa tope ambao yabisi hizo hutengeneza pamoja na maji yake: ujazo wa yabisi ni tani ukigawanya kwa
            specific gravity ya madini, na ujazo wa maji hutokana na asilimia ya yabisi kwa uzito. Kuzidisha mtiririko wa tope
            kwa muda wa leaching kunatoa ujazo wa kazi ambao mfululizo wa matanki lazima ubebe. Ziada ya ujazo kwa ajili ya kupanga
            huongezwa, na jumla hugawanywa kwa idadi ya matanki.
          </p>
          <h2>Mfano wa hesabu</h2>
          <p>
            Thamani za mwanzo zinaonyesha mtambo unaochakata tani 50 kwa siku kwa saa 24 kwa yabisi 45%, madini yenye specific
            gravity 2.7 na leaching ya saa 24. Mtiririko wa tope ni takribani m³ 3.3 kwa saa, kwa hiyo ujazo wa kazi ni takribani
            m³ 79.6. Kwa ziada ya ujazo ya 10% unakuwa takribani m³ 87.6, au matanki sita ya takribani m³ 14.6 kila moja.
            Takwimu hizi ni dhana za kuonyesha njia; tumia tani zako na muda wa leaching kutoka jaribio kwenye madini yako.
          </p>
          <h2>Kile matokeo hayajumuishi</h2>
          <p>
            Takwimu ni ujazo wa kazi kwa ajili ya kupanga. Haijumuishi nafasi kati ya uso wa tope na ukingo wa tanki, ujazo wa kaboni na vichujio, wala
            nafasi ambazo msanifu huongeza. Nguvu ya kichanganyio, ukubwa wa kichujio, hewa na umbo la tanki vyote vinahitaji
            usanifu wa mchakato kutokana na matokeo ya majaribio yako. <Link href="/equipment-swahili/leaching-tank">Ukurasa wa tanki la leaching</Link> unaeleza
            ujenzi na matengenezo ya tanki, na <Link href="/insights-swahili/gharama-ya-plant-ya-dhahabu">mwongozo wa gharama ya plant ya dhahabu</Link> unaeleza
            bajeti ya mtambo mzima.
          </p>
        </div>
      </section>

      <CtaSection
        eyebrow="Panga matanki yako"
        heading={<>Tutumie <span className="grad">tani na jaribio la leaching</span></>}
        body="Tueleze tani kwa siku, msongamano wa tope, matokeo ya majaribio ya leaching na umeme wa eneo, tutakusaidia kupanga matanki, vichanganyio na vichujio pamoja."
        primaryLabel="WhatsApp"
        primaryHref="https://wa.me/255759141705"
        secondaryLabel="Wasiliana nasi"
        secondaryHref="/contact"
      />

      <style>{`
        .tool-prose h2 { font-size: clamp(22px, 2.6vw, 28px); margin: 28px 0 12px; }
        .tool-prose h2:first-child { margin-top: 0; }
        .tool-prose p { color: var(--ink-2); font-size: 17px; line-height: 1.7; }
        .tool-prose a { color: var(--gold); font-weight: 600; }
      `}</style>
    </>
  )
}
