import fs from 'node:fs'
import path from 'node:path'

/**
 * Build-time product photo resolution.
 *
 * HOW TO ADD A REAL PHOTO
 * Drop the file into `public/equipment/` named after the product slug, then
 * redeploy. Nothing else to change:
 *
 *     public/equipment/1-ton-winch.jpg      -> /equipment/1-ton-winch
 *     public/equipment/slurry-pump.webp     -> /equipment/slurry-pump
 *
 * Any of .jpg .jpeg .png .webp .avif works; the first match in that order
 * wins. Where no file exists the card falls back to a drawn placeholder, so
 * the grid keeps its shape and never shows a broken image.
 *
 * This runs during the static build, not in the browser, so the resolved
 * paths are baked into the generated HTML and cost nothing at request time.
 */

const PHOTO_DIR = path.join(process.cwd(), 'public', 'equipment')
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'] as const

/** Cached directory listing. The build reads this once per process. */
let cachedFiles: Set<string> | null = null

function listPhotoFiles(): Set<string> {
  if (cachedFiles) return cachedFiles
  try {
    cachedFiles = new Set(fs.readdirSync(PHOTO_DIR))
  } catch {
    // Directory absent on a fresh checkout, which is the normal starting state.
    cachedFiles = new Set()
  }
  return cachedFiles
}

/**
 * Returns the public path of a product photo, or null when none has been
 * uploaded yet.
 */
export function resolveEquipmentPhoto(slug: string): string | null {
  const files = listPhotoFiles()
  for (const ext of EXTENSIONS) {
    const filename = `${slug}${ext}`
    if (files.has(filename)) return `/equipment/${filename}`
  }
  return null
}

/** Count of products that have a real photo. Used by the build-time notice. */
export function photoCoverage(slugs: string[]): { withPhoto: number; total: number } {
  return {
    withPhoto: slugs.filter(s => resolveEquipmentPhoto(s) !== null).length,
    total: slugs.length,
  }
}
