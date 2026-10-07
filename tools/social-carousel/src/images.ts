import { renamedImageKey } from './data/file-names'

// The image dropdown is exactly these three folders. That list is the photo
// policy (docs/BARTMINING-SOCIAL.md §2.5): site stock, Allan's approved
// headshot, and images sourced or generated for social.
const pick = (mods: Record<string, string>, prefix: string) =>
  Object.entries(mods).map(([path, url]) => ({ key: `${prefix}/${path.split('/').pop()}`, url }))

const equipment = import.meta.glob<string>('../../../public/equipment/*.{jpg,jpeg,png,webp,avif}', {
  eager: true, query: '?url', import: 'default',
})
// The reviewed, full-resolution catalogue illustrations replace small legacy
// files in the October informative batch without changing other posts.
const catalogueIllustrations = import.meta.glob<string>(
  '../../../public/equipment/website/{gold-elution-electrowinning-plant,wet-pan-mill,submersible-dewatering-pump,5-ton-mine-winch-parallel-drive,gas-detection-monitor,sluice-box-gold-jig,alluvial-gold-wash-plant-v2}.webp',
  { eager: true, query: '?url', import: 'default' },
)
const team = import.meta.glob<string>('../../../public/team/allan-bartholomew.jpg', {
  eager: true, query: '?url', import: 'default',
})
const social = import.meta.glob<string>('../images/*.{jpg,jpeg,png,webp,avif}', {
  eager: true, query: '?url', import: 'default',
})

export const IMAGE_LIBRARY = [
  ...pick(social, 'social'),
  ...pick(equipment, 'equipment'),
  ...pick(catalogueIllustrations, 'equipment/website'),
  ...pick(team, 'team'),
].filter(i => !i.key.includes('-alt.'))

const byKey = new Map(IMAGE_LIBRARY.map(i => [i.key, i.url]))
// Retain saved browser selections while serving the replacement illustration.
const alluvialReplacement = byKey.get('equipment/website/alluvial-gold-wash-plant-v2.webp')
if (alluvialReplacement) {
  byKey.set('equipment/alluvial-gold-wash-plant.jpg', alluvialReplacement)
  byKey.set('equipment/website/alluvial-gold-wash-plant.webp', alluvialReplacement)
}

export const resolveImage = (key?: string) =>
  key ? byKey.get(key) ?? byKey.get(renamedImageKey(key)) : undefined
