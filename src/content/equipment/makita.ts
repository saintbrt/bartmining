import type { GuideSection } from './index'
import { MAKITA_FAMILIES, MAKITA_PRODUCTS, PARTNERSHIP_EN, PARTNERSHIP_SW } from '@/data/makita/families'
import { PRODUCT_COPY } from '@/data/makita/products'

/**
 * Generated guide sections for the Makita family pages: a short platform
 * guide, then one section per main product (image, description and a table
 * of every size and kit option). Data: src/data/makita/catalogue.json.
 */

type Lang = 'en' | 'sw'

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))

const PLATFORM: Record<string, { en: string; sw: string }> = {
  'Corded': { en: 'Corded electric', sw: 'Umeme wa waya' },
  'Cordless 12V CXT': { en: '12V max CXT cordless', sw: 'Betri 12V max CXT' },
  'Cordless 18V LXT': { en: '18V LXT cordless', sw: 'Betri 18V LXT' },
  'Cordless 40V XGT': { en: '40V max XGT cordless', sw: 'Betri 40V max XGT' },
  'Petrol': { en: 'Petrol engine', sw: 'Injini ya petroli' },
}

const T = {
  en: {
    platformTitle: 'Corded, Cordless or Petrol: Choosing a Makita Platform',
    platform: `<p>Every main product below runs on one power source. <strong>Corded</strong> tools give full power for all-day work where mains or generator power is available. <strong>18V LXT</strong> cordless tools share one battery system across a very wide range; twin-battery 36V tools use two 18V batteries. <strong>40V max XGT</strong> cordless tools deliver close to corded power for heavier work; 80V tools use two 40V batteries. <strong>12V max CXT</strong> tools are compact for light jobs. If your site already uses one battery system, staying with it saves buying more batteries and chargers.</p>
<p>In each table, the model is one tool and its options are kit codes: codes ending in <code>Z</code> are usually the tool body only, while longer codes include batteries, a charger and a case. The "What's different" column explains models that share the same headline specification. These tools are ${PARTNERSHIP_EN}.</p>`,
    model: 'Model', options: 'Options (kit codes)', spec: 'Key specification', diff: "What's different",
    makitaPage: 'Makita page', models: (n: number) => `${n} model${n === 1 ? '' : 's'}`,
    note: 'Specifications are as published by Makita Tanzania; confirm the model, kit and availability when you request a quotation.',
    imageAlt: (name: string) => `Makita ${name}`,
  },
  sw: {
    platformTitle: 'Waya, betri au petroli: kuchagua mfumo wa Makita',
    platform: `<p>Kila bidhaa kuu hapa chini hutumia chanzo kimoja cha nguvu. Zana za <strong>waya</strong> hutoa nguvu kamili kwa kazi ya siku nzima pale umeme wa gridi au jenereta upo. Zana za betri za <strong>18V LXT</strong> hutumia mfumo mmoja wa betri kwenye zana nyingi sana; zana za 36V hutumia betri mbili za 18V. Zana za betri za <strong>40V max XGT</strong> hutoa nguvu karibu na za waya kwa kazi nzito; zana za 80V hutumia betri mbili za 40V. Zana za <strong>12V max CXT</strong> ni ndogo kwa kazi nyepesi. Ikiwa eneo lako tayari linatumia mfumo mmoja wa betri, kuendelea nao kunaokoa kununua betri na chaja zaidi.</p>
<p>Kwenye kila jedwali, modeli ni zana moja na chaguo zake ni code za vifurushi: code zinazoishia na <code>Z</code> kwa kawaida ni zana pekee, huku code ndefu zikijumuisha betri, chaja na sanduku. Safu ya "Tofauti" inaeleza modeli zenye vipimo vikuu sawa. Zana hizi ${PARTNERSHIP_SW}.</p>`,
    model: 'Modeli', options: 'Chaguo (code za vifurushi)', spec: 'Kipimo kikuu', diff: 'Tofauti',
    makitaPage: 'Ukurasa wa Makita', models: (n: number) => `modeli ${n}`,
    note: 'Vipimo ni kama vilivyochapishwa na Makita Tanzania; thibitisha modeli, kifurushi na upatikanaji unapoomba bei.',
    imageAlt: (name: string) => `Makita ${name}`,
  },
} as const

function productSection(id: string, lang: Lang): GuideSection {
  const p = MAKITA_PRODUCTS.find(x => x.id === id)!
  const t = T[lang]
  const copy = PRODUCT_COPY[p.id]?.[lang] ?? ''
  const hasDiff = p.models.some(m => m.difference)
  const rows = p.models.map(m => `<tr><td><a href="${esc(m.url)}" rel="noopener"><strong>${esc(m.base)}</strong></a></td><td>${m.codes.map(esc).join(', ')}</td><td>${esc(m.spec)}</td>${hasDiff ? `<td>${esc(m.difference)}</td>` : ''}</tr>`).join('')
  const figure = p.image
    ? `<figure class="eq-figure"><img src="${p.image}" alt="${esc(t.imageAlt(p.name))}" loading="lazy" style="width:100%;max-width:520px;height:auto;display:block;margin:0 auto;background:#fff;border-radius:6px"><figcaption>${esc(t.imageAlt(p.name))} · ${esc(PLATFORM[p.platform]?.[lang] ?? p.platform)} · ${t.models(p.models.length)}</figcaption></figure>`
    : ''
  return {
    id: p.id,
    title: `Makita ${p.name}`,
    html: `<p>${esc(copy)}</p>
${figure}
<div class="eq-tablewrap"><table class="eq-table">
<thead><tr><th>${t.model}</th><th>${t.options}</th><th>${t.spec}</th>${hasDiff ? `<th>${t.diff}</th>` : ''}</tr></thead>
<tbody>${rows}</tbody>
</table></div>
<p style="font-size:14px;color:var(--ink-3)">${t.note}</p>`,
  }
}

function buildGuides(lang: Lang): Record<string, GuideSection[]> {
  const out: Record<string, GuideSection[]> = {}
  for (const f of MAKITA_FAMILIES) {
    const products = MAKITA_PRODUCTS.filter(p => p.family === f.family)
    out[f.slug] = [
      { id: 'choosing-platform', title: T[lang].platformTitle, html: T[lang].platform },
      ...products.map(p => productSection(p.id, lang)),
    ]
  }
  return out
}

export const MAKITA_GUIDES_EN = buildGuides('en')
export const MAKITA_GUIDES_SW = buildGuides('sw')
