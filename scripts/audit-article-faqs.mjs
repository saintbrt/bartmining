import assert from 'node:assert/strict'
import { guideInventory, loadSiteModule } from './lib/editorial-library.mjs'
import { faqInventory } from './lib/faq-library.mjs'

const guides = guideInventory()
const { getArticleFaqs } = loadSiteModule('src/lib/article-faqs.ts')
const stored = loadSiteModule('src/data/article-faqs.json')
const { faqSchema } = loadSiteModule('src/lib/seo.ts')
const decode = value => value.replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" })[entity])

for (const language of ['en', 'sw']) {
  for (const slug of Object.keys(stored[language])) {
    assert(guides.some(g => g.language === language && g.slug === slug), `Orphan FAQ copy: ${language}/${slug}`)
  }
}

for (const guide of guides) {
  const faqs = getArticleFaqs(guide.slug, guide.language)
  const section = guide.html.match(/<h2 id="(?:questions|maswali)">[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/)
  if (!faqs.length) {
    assert(!section, `FAQ body missing from shared copy: ${guide.path}`)
    continue
  }
  assert(section, `Missing visible FAQs: ${guide.path}`)
  const visible = [...section[1].matchAll(/<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/gs)].map(match => ({ q: decode(match[1]), a: decode(match[2]) }))
  assert.deepEqual(visible, faqs, `Visible answers differ from shared copy: ${guide.path}`)
  const conclusion = guide.html.search(/<h2 id="(?:conclusion|hitimisho)"/)
  assert(conclusion > section.index, `FAQs must precede the conclusion: ${guide.path}`)
}
const pages = faqInventory()
assert.equal(new Set(pages.map(page => page.path)).size, pages.length, 'Duplicate FAQ page URLs')
const unsafeClaims = /25\s+to\s+45\s+percent|past\s+roughly\s+(?:60|80)\s*m\b|beyond\s+roughly\s+60\s+metres|removes\s+any\s+need\s+for\s+mercury/i
for (const page of pages) {
  assert.equal(new Set(page.faqs.map(f => f.q.trim().toLowerCase())).size, page.faqs.length, `Duplicate questions: ${page.path}`)
  for (const item of page.faqs) {
    assert(item.q.trim().endsWith('?'), `Question needs a question mark: ${page.path}`)
    assert(item.a.trim() && /[.!?]$/.test(item.a.trim()), `Incomplete answer: ${page.path}`)
    assert(!/<[^>]+>/.test(item.q + item.a), `FAQ copy must remain plain text: ${page.path}`)
    assert(!unsafeClaims.test(item.a), `Unqualified legacy claim: ${page.path}`)
  }
  const schema = faqSchema(page.faqs, page.language)
  assert.equal(schema.inLanguage, page.language)
  assert.deepEqual(schema.mainEntity.map(item => ({ q: item.name, a: item.acceptedAnswer.text })), page.faqs, `Structured answers differ: ${page.path}`)
}
console.log(`FAQ inventory: ${pages.length} reading pages (${pages.filter(p => p.language === 'en').length} English, ${pages.filter(p => p.language === 'sw').length} Kiswahili), ${pages.reduce((sum, p) => sum + p.faqs.length, 0)} answers passed.`)
console.log('Checks coverage, visible copy, order, duplicates, schema and known claim regressions. Editorial relevance and factual scope require the recorded manual review.')
