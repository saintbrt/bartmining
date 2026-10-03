import fs from 'node:fs'
import path from 'node:path'

/**
 * Build-time image slots for the generator rental pages.
 *
 * Drop a file into `public/generator-rental/` named after its slot and
 * redeploy; the page shows it. Until then nothing renders, so a missing
 * image never leaves a gap or a broken icon. Same pattern as
 * src/lib/equipment-photos.ts. Brief: docs/image-brief-generator-rental.md.
 *
 *   generator-rental-hero   /generator-rental and /jenereta-za-kukodi hero
 *   town-<slug>             hero of /generator-rental/<slug>, e.g. town-arusha
 *   band-300-500, band-500-1000, band-1000-2500   size band pictures
 */

export interface RentalImage { src: string; alt: string }

const DIR = path.join(process.cwd(), 'public', 'generator-rental')
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'] as const

let cached: Set<string> | null = null
function files(): Set<string> {
  if (cached) return cached
  try { cached = new Set(fs.readdirSync(DIR)) } catch { cached = new Set() }
  return cached
}

/** Public URL for a slot file name (without extension), or null if not added yet. */
export function findRentalImage(file: string, alt: string): RentalImage | null {
  for (const ext of EXTENSIONS) {
    if (files().has(file + ext)) return { src: `/generator-rental/${file}${ext}`, alt }
  }
  return null
}

export const heroImage = () =>
  findRentalImage('generator-rental-hero', 'Containerised diesel generator powering a mine site in Tanzania')

export const townImage = (slug: string, alt: string) => findRentalImage(`town-${slug}`, alt)

export const BAND_IMAGES = [
  { file: 'band-300-500', alt: 'Enclosed diesel generator of around 400 kVA on a concrete plinth beside a small wash plant' },
  { file: 'band-500-1000', alt: 'Containerised diesel generator of around 800 kVA beside a crushing and milling circuit' },
  { file: 'band-1000-2500', alt: 'Two containerised generators running synchronised at a large processing plant' },
]
