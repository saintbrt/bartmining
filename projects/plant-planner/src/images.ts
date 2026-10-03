// Images the proposal may use. Two folders, both already in the repo:
//   social/     tools/social-carousel/images  (generated, Pexels, Unsplash)
//   equipment/  public/equipment              (the website's product photos)
// Social images under a CC licence need a credit line, so they're left out
// rather than risk a client document going out without one.

import sources from '../../../tools/social-carousel/images/sources.json'

const social = import.meta.glob('../../../tools/social-carousel/images/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const equipment = import.meta.glob('../../../public/equipment/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

const name = (path: string) => path.split('/').pop()!
const licences = new Map((sources as { file: string; license: string }[]).map(s => [s.file, s.license]))
const noCredit = (file: string) => {
  const l = licences.get(file)
  return !!l && !/^CC\b/.test(l)
}

export const IMAGES: Record<string, string> = Object.fromEntries([
  ...Object.entries(social).filter(([p]) => noCredit(name(p))).map(([p, url]) => [`social/${name(p)}`, url]),
  ...Object.entries(equipment).map(([p, url]) => [`equipment/${name(p)}`, url]),
])

export const IMAGE_KEYS = Object.keys(IMAGES).sort()

export const imageLabel = (key: string) =>
  key.replace(/^(social|equipment)\//, '').replace(/\.\w+$/, '').replace(/-/g, ' ')
