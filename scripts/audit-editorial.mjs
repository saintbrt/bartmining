import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { guideInventory, loadSiteModule } from './lib/editorial-library.mjs'

const guides = guideInventory()
const { prepareArticleHtml } = loadSiteModule('src/lib/article-content.tsx')
const prepared = new Map(guides.map(a => [a.path, prepareArticleHtml(a.html)]))
const paths = new Set(guides.map(a => a.path))
let failures = 0
function check(condition, article, message) {
  if (!condition) { failures++; console.error(`${article.path}: ${message}`) }
}
assert.equal(paths.size, guides.length, 'Article URLs must be unique')
const sitemap = loadSiteModule('src/app/sitemap.ts').default()
const sitemapUrls = sitemap.map(entry => entry.url)
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Sitemap URLs must be unique')
for (const route of ['/insights', '/insights-swahili', ...paths]) {
  assert.ok(sitemapUrls.includes(`https://bartmining.com${route}`), `Missing sitemap route: ${route}`)
}
for (const article of guides) {
  const { html, headings } = { html: prepared.get(article.path).content, headings: prepared.get(article.path).headings }
  check(article.html.trim().startsWith('<p>'), article, 'missing contextual opening')
  check(/<h2[^>]*id="(?:conclusion|hitimisho)"/.test(article.html), article, 'missing substantive conclusion')
  check(/<h2[^>]*id="(?:basis|vyanzo)"/.test(article.html), article, 'missing sources/assumptions section')
  check(/href="https?:\/\/(?!wa\.me|bartmining\.com)/.test(html), article, 'missing external source')
  check(headings.filter(h => h.level === 2).length >= 4, article, 'insufficient explanatory sections')
  check(new Set(headings.map(h => h.id)).size === headings.length, article, 'duplicate heading anchors')
  check(!/art-stats|region-chips/.test(html), article, 'inherited statistics/region block needs review')
  check(article.imageCaption && article.imageAlt, article, 'cover needs alt text and context caption')
  check(article.readTime.startsWith(article.language === 'sw' ? `Dakika ${article.minutes} ` : `${article.minutes} min `), article, 'reading time does not match body')
  check(article.updatedDate && article.updated, article, 'missing tracked revision date')
  check(article.language === 'sw' ? !article.path.startsWith('/insights/') : article.path === `/insights/${article.slug}`, article, 'language and route mismatch')
  for (const image of [article.image, ...[...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m => m[1])]) {
    check(image.startsWith('/') && fs.existsSync(path.join('public', image)), article, `missing catalogue image: ${image}`)
  }
  const peers = guides.filter(a => a.language === article.language)
  for (const slug of article.related) check(peers.some(a => a.slug === slug), article, `missing related guide: ${slug}`)
  for (const match of html.matchAll(/href="(\/[^" ]+)"/g)) {
    const [target, fragment] = match[1].split('#')
    if (!paths.has(target)) {
      check(!target.startsWith('/insights/'), article, `missing internal article: ${target}`)
      continue
    }
    if (fragment) check(prepared.get(target).headings.some(h => h.id === fragment), article, `missing linked section: ${match[1]}`)
  }
  if (article.englishSlug) check(guides.some(a => a.language === 'en' && a.slug === article.englishSlug), article, 'missing English counterpart')
}
const en = guides.filter(a => a.language === 'en').length
const sw = guides.filter(a => a.language === 'sw').length
console.log(`Reviewed inventory: ${en} English guides and ${sw} Kiswahili guides.`)
console.log(`Editorial structure, sources, metadata, images and article links: ${failures ? `${failures} failures` : 'passed'}.`)
console.log('This checks publishing structure and references, not legal certification, laboratory validity or field performance.')
process.exitCode = failures ? 1 : 0
