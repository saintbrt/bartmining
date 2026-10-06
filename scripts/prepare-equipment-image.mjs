import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

// Encode a reviewed master without cropping or enlarging its native pixels.
const [source, slug] = process.argv.slice(2)
if (!source || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  throw new Error('Usage: node scripts/prepare-equipment-image.mjs <source> <product-slug>')
}
const directory = path.resolve('public/equipment/website')
fs.mkdirSync(directory, { recursive: true })
const destination = path.join(directory, `${slug}.webp`)
await sharp(source).rotate().resize({ width: 2400, height: 1800, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 90, effort: 6 }).toFile(destination)
const { width, height } = await sharp(destination).metadata()
console.log(JSON.stringify({ slug, path: `/equipment/website/${slug}.webp`, width, height, bytes: fs.statSync(destination).size }))
