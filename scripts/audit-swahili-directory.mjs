import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { loadSiteModule } from './lib/editorial-library.mjs'

const { SWAHILI_DIRECTORY } = loadSiteModule('src/data/swahili-directory.ts')
const { SWAHILI_ARTICLES } = loadSiteModule('src/data/article-library.ts')
const { LOCATIONS_SW } = loadSiteModule('src/data/locations-sw.ts')
const { MARKETS } = loadSiteModule('src/data/markets.ts')
const { EQUIPMENT } = loadSiteModule('src/data/equipment-catalogue-sw.ts')
const entries = new Set(SWAHILI_DIRECTORY.map(e => e.path))
assert.equal(entries.size, SWAHILI_DIRECTORY.length, 'Duplicate directory entries')
const expected = [
  ...SWAHILI_ARTICLES.map(a => a.path),
  ...LOCATIONS_SW.map(l => `/insights-swahili/vifaa-vya-uchimbaji/${l.slug}`),
  ...MARKETS.map(m => `/insights-swahili/soko-la-madini/${m.slug}`),
  '/insights-swahili/bei-ya-dhahabu-leo', '/insights-swahili/jenereta-za-kukodi',
  '/equipment-swahili',
]
for (const route of expected) assert(entries.has(route), `Missing directory entry: ${route}`)

const sitemap = new Set(loadSiteModule('src/app/sitemap.ts').default().map(e => new URL(e.url).pathname))
for (const entry of SWAHILI_DIRECTORY) {
  assert(entry.path.startsWith('/insights-swahili/') || entry.path === '/equipment-swahili', `Scattered directory URL: ${entry.path}`)
  assert(sitemap.has(entry.path), `Missing sitemap entry: ${entry.path}`)
  assert(fs.existsSync(path.join('public', entry.image)), `Missing directory image: ${entry.image}`)
}
for (const item of EQUIPMENT) assert(sitemap.has(`/equipment-swahili/${item.slug}`), `Missing product: ${item.slug}`)

const redirects = await loadSiteModule('next.config.ts').default.redirects()
const legacyGuides = ['bei-ya-vifaa-vya-uchimbaji', 'gharama-ya-plant-ya-dhahabu', 'bei-ya-mashine-ya-kusaga-mawe', 'jinsi-ya-kupata-leseni-ya-pml', 'mrabaha-na-kodi-za-dhahabu']
const moved = [
  ...legacyGuides.map(slug => ({ old: `/${slug}`, current: `/insights-swahili/${slug}` })),
  ...LOCATIONS_SW.map(l => ({ old: `/vifaa-vya-uchimbaji/${l.slug}`, current: `/insights-swahili/vifaa-vya-uchimbaji/${l.slug}`, town: l.slug })),
  ...MARKETS.map(m => ({ old: `/soko-la-madini/${m.slug}`, current: `/insights-swahili/soko-la-madini/${m.slug}`, town: m.slug })),
  { old: '/bei-ya-dhahabu-leo', current: '/insights-swahili/bei-ya-dhahabu-leo' },
  { old: '/jenereta-za-kukodi', current: '/insights-swahili/jenereta-za-kukodi' },
]
for (const page of moved) {
  assert(!sitemap.has(page.old), `Legacy URL still in sitemap: ${page.old}`)
  const redirect = redirects.find(r => r.source.replace(':town', page.town ?? '') === page.old)
  assert(redirect?.permanent, `Missing permanent redirect: ${page.old}`)
  assert.equal(redirect.destination.replace(':town', page.town ?? ''), page.current)
}

for (const suffix of ['', ...EQUIPMENT.map(item => `/${item.slug}`)]) {
  const old = `/equipments-swahili${suffix}`
  const current = `/equipment-swahili${suffix}`
  assert(!sitemap.has(old), `Legacy catalogue URL still in sitemap: ${old}`)
  assert(sitemap.has(current), `Missing catalogue URL: ${current}`)
  const redirect = redirects.find(r => r.source === (suffix ? '/equipments-swahili/:path*' : old))
  assert(redirect?.permanent, `Missing permanent catalogue redirect: ${old}`)
  assert.equal(redirect.destination.replace('/:path*', suffix), current)
}
assert(redirects.some(r => r.source === '/vifaa-vya-uchimbaji' && r.destination === '/equipment-swahili' && r.permanent), 'Legacy equipment overview must redirect directly to the current catalogue')

function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) { scan(filename); continue }
    if (entry.name !== 'page.tsx') continue
    const source = fs.readFileSync(filename, 'utf8')
    const route = '/' + path.relative('src/app', directory).split(path.sep).join('/')
    const kiswahili = /import\s+SwInsight|import\s+SwahiliArticle|locale:\s*'sw_TZ'|<div\s+lang="sw"/.test(source)
    if (!kiswahili) continue
    assert(route === '/insights-swahili' || route.startsWith('/insights-swahili/') || route === '/equipment-swahili' || route.startsWith('/equipment-swahili/'), `Kiswahili page outside directories: ${route}`)
    if (!route.includes('[') && route !== '/insights-swahili') assert(entries.has(route), `Page missing from directory: ${route}`)
  }
}
scan('src/app')
console.log(`Kiswahili directory: ${entries.size} entries, ${moved.length} migrations and ${EQUIPMENT.length} product URLs passed.`)
console.log('Checks discovery and URL structure; content quality requires the separate editorial review.')
