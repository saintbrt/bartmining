/**
 * Tell IndexNow (Bing, Yandex, Seznam, Naver; feeds ChatGPT search and
 * Copilot) that pages changed, so they are recrawled within minutes instead
 * of waiting for the next crawl. Google does not use IndexNow; use Search
 * Console for Google.
 *
 * The key is public by design: it must be served at
 * https://bartmining.com/<key>.txt (public/<key>.txt) so IndexNow can verify
 * the site. Run after a deploy, once that file is live:
 *
 *   npm run indexnow                      every URL in the live sitemap
 *   npm run indexnow -- generator-rental  only URLs containing that text
 *   npm run indexnow -- /a /b             these exact paths
 */

const HOST = 'bartmining.com'
const KEY = 'eca3ee9f25478f46b75983cf8d5327f5'
const SITE = `https://${HOST}`

const args = process.argv.slice(2)

async function sitemapUrls() {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
}

let urls
if (args.length && args.every(a => a.startsWith('/'))) urls = args.map(a => SITE + a)
else {
  urls = await sitemapUrls()
  if (args.length) urls = urls.filter(u => args.some(a => u.includes(a)))
}
if (!urls.length) { console.error('No URLs matched.'); process.exit(1) }

const keyCheck = await fetch(`${SITE}/${KEY}.txt`)
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`Key file ${SITE}/${KEY}.txt is not live yet. Deploy first.`)
  process.exit(1)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
})
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URL(s)`)
urls.forEach(u => console.log('  ' + u))
// 200 = accepted, 202 = accepted (key verification pending). 4xx = check key file and host.
if (res.status >= 400) process.exit(1)
