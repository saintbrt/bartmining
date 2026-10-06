import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { loadSiteModule } from './lib/editorial-library.mjs'

const { EQUIPMENT } = loadSiteModule('src/data/equipment-catalogue.ts')
const { resolveEquipmentPhoto } = loadSiteModule('src/lib/equipment-photos.ts')
const manifest = JSON.parse(fs.readFileSync('src/data/equipment-imagery.json', 'utf8'))
const prompts = JSON.parse(fs.readFileSync('docs/equipment-image-prompts-2026-10-06.json', 'utf8'))
const before = JSON.parse(fs.readFileSync('docs/equipment-image-baseline-2026-10-06.json', 'utf8'))
const replacements = new Set(prompts.entries.map(entry => entry.slug))
const products = new Set(EQUIPMENT.map(item => item.slug))
assert.equal(Object.keys(manifest).length, products.size)
assert.equal(before.length, products.size)
for (const slug of Object.keys(manifest)) assert(products.has(slug), `Orphan image: ${slug}`)
for (const slug of replacements) assert(products.has(slug), `Orphan prompt: ${slug}`)

const results = []
for (const item of EQUIPMENT) {
  const entry = manifest[item.slug]
  const source = path.join('public', entry.src)
  assert(fs.existsSync(source), `Missing website asset: ${item.slug}`)
  assert.equal(resolveEquipmentPhoto(item.slug), entry.src, `Legacy image still selected: ${item.slug}`)
  assert.equal(entry.kind, replacements.has(item.slug) ? 'illustration' : 'reference')
  const meta = await sharp(source).metadata()
  assert.equal(meta.format, 'webp')
  assert(meta.width >= 1200, `Undersized website source: ${item.slug} (${meta.width}px)`)
  assert(meta.height > 0)
  // Decoding verifies that metadata alone is not hiding a truncated image.
  await sharp(source).resize({ width: 16, height: 16, fit: 'inside' }).raw().toBuffer()
  results.push({ slug: item.slug, kind: entry.kind, src: entry.src, width: meta.width, height: meta.height, bytes: fs.statSync(source).size })
}

// Distinct winch illustrations replace the identical automotive image.
const winchBuffers = ['1-ton-winch', '2-ton-winch', '5-ton-mine-winch'].map(slug => fs.readFileSync(path.join('public', manifest[slug].src)))
assert(!winchBuffers[0].equals(winchBuffers[1]))
assert(!winchBuffers[1].equals(winchBuffers[2]))

if (process.argv.includes('--report')) {
  fs.writeFileSync('docs/equipment-image-results-2026-10-06.json', JSON.stringify(results, null, 2) + '\n')
}
console.log(`${results.length} website images passed: ${replacements.size} new illustrations, ${results.length - replacements.size} retained references; all sources at least 1200px wide.`)
console.log('Checks files, resolution, decoding, selection and provenance labels; model accuracy and visual suitability require review.')
