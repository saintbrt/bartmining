import fs from 'node:fs'
import path from 'node:path'
import imagery from '@/data/equipment-imagery.json'
import imageCopy from '@/data/equipment-image-copy.json'

/**
 * Build-time product imagery resolution, shared by both languages.
 * Reviewed website assets in equipment-imagery.json take precedence. Keep
 * their illustration/reference provenance accurate when replacing a master.
 * Legacy slug-named .jpg/.jpeg/.png/.webp/.avif files remain a fallback for
 * products without a prepared asset. Cards without either show a category
 * mark. See public/equipment/README.md for the preparation workflow.
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
 * Returns the selected public image path, or null when none is available.
 */
export function resolveEquipmentPhoto(slug: string): string | null {
  const prepared = (imagery as Record<string, { src: string }>)[slug]
  if (prepared && fs.existsSync(path.join(process.cwd(), 'public', prepared.src))) return prepared.src
  const files = listPhotoFiles()
  for (const ext of EXTENSIONS) {
    const filename = `${slug}${ext}`
    if (files.has(filename)) return `/equipment/${filename}`
  }
  return null
}

export function equipmentImageKind(slug: string): 'illustration' | 'reference' {
  const entry = (imagery as Record<string, { kind: string }>)[slug]
  return entry?.kind === 'illustration' ? 'illustration' : 'reference'
}

export function equipmentImageCaption(slug: string, name: string, language: 'en' | 'sw' = 'en'): string {
  const copy = (imageCopy as Record<string, { en: string; sw: string }>)[slug]
  return copy?.[language] ?? name
}

export function equipmentImageAlt(slug: string, name: string, language: 'en' | 'sw' = 'en'): string {
  return equipmentImageCaption(slug, name, language)
}

/** Count of products with selected imagery. */
export function photoCoverage(slugs: string[]): { withPhoto: number; total: number } {
  return {
    withPhoto: slugs.filter(s => resolveEquipmentPhoto(s) !== null).length,
    total: slugs.length,
  }
}
