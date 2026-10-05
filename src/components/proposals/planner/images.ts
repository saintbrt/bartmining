// Images a proposal may use, all served from public/:
//   equipment/  the website's product photos
//   social/     stock and generated images from the social carousel, copied
//               to public/proposals as JPEG. Only images that need no credit
//               line are copied (no CC licences).
// Keys match the local planner's, so an imported planner file keeps its images.
// To add one, put the file in public/proposals and list its name here.

const EQUIPMENT = [
  '1-ton-winch.jpg',
  '2-ton-winch.jpg',
  '5-ton-mine-winch.jpg',
  'air-compressor-mining.jpg',
  'alluvial-gold-wash-plant.jpg',
  'backhoe-loader.jpg',
  'ball-mill-gold-ore-alt.jpg',
  'ball-mill-gold-ore.jpg',
  'belt-conveyor.jpg',
  'bulldozer.jpg',
  'centrifugal-gold-concentrator.jpg',
  'cil-cip-plant.jpg',
  'concrete-mixer.jpg',
  'cone-crusher.jpg',
  'diesel-generator-mining.jpg',
  'dump-truck.jpg',
  'fall-arrest-harness.jpg',
  'filter-press.jpg',
  'fleet-management-system.jpg',
  'gas-detection-monitor.jpg',
  'geological-modelling-software.jpg',
  'gold-elution-electrowinning-plant.jpg',
  'gold-metal-detector.jpg',
  'hammer-mill.jpg',
  'hydraulic-excavator.jpg',
  'hydrocyclone.jpg',
  'jaw-crusher.jpg',
  'leaching-tank.jpg',
  'lighting-tower.jpg',
  'mine-hoist-headframe.jpg',
  'mine-management-software.jpg',
  'mine-ventilation-fan.jpg',
  'mining-safety-helmet-cap-lamp-alt.jpg',
  'mining-safety-helmet-cap-lamp.jpg',
  'modular-gold-plant.jpg',
  'motor-grader.jpg',
  'pneumatic-rock-drill.jpg',
  'rc-drilling-rig.jpg',
  'rotary-scrubber.jpeg',
  'self-contained-self-rescuer.jpg',
  'shaking-table-gold.jpg',
  'sluice-box-gold-jig.webp',
  'slurry-pump.webp',
  'submersible-dewatering-pump.jpg',
  'tower-crane.jpg',
  'trommel-screen.jpg',
  'vibrating-feeder.jpg',
  'vibrating-screen.jpg',
  'vibratory-roller.jpg',
  'wet-pan-mill.jpg',
  'wheel-loader.jpg',
  'wire-rope-slings-lifting-tackle.jpg',
]

const SOCIAL = [
  'alluvial-fine-screen',
  'alluvial-wet-clay',
  'carbon-adsorption-tanks',
  'centrifugal-concentrator-installation',
  'equipment-delivery-generated',
  'exploration-core-drill',
  'freight-port',
  'gravity-and-leach-plant',
  'gravity-concentrate-circuit',
  'large-agitated-tank-plant',
  'machinery-export-crates',
  'ore-sample-selection',
  'prepared-equipment-foundations',
  'quarry-crusher-context',
  'river-sluice-processing-v2',
  'skid-mounted-processing-module',
  'small-gravity-plant',
  'standalone-gravity-sluice',
]

export const IMAGES: Record<string, string> = Object.fromEntries([
  ...EQUIPMENT.map(f => [`equipment/${f}`, `/equipment/${f}`]),
  ...SOCIAL.map(n => [`social/${n}`, `/proposals/${n}.jpg`]),
])

/** Planner keys carry the original extension (social/x.png); match on the name alone. */
export function imageUrl(key: string | undefined): string | undefined {
  if (!key) return undefined
  if (IMAGES[key]) return IMAGES[key]
  const m = /^social\/(.+)\.\w+$/.exec(key)
  return m ? IMAGES[`social/${m[1]}`] : undefined
}

export const IMAGE_KEYS = Object.keys(IMAGES).sort()

export const imageLabel = (key: string) =>
  key.replace(/^(social|equipment)\//, '').replace(/\.\w+$/, '').replace(/-/g, ' ')
