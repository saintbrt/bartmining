/**
 * Delivery time model for /delivery-shipping.
 *
 * Bart Mining ships from Dar es Salaam (port of entry) to sites across
 * Tanzania, so every route below is Dar -> destination.
 *
 * `hours` is a light-vehicle (passenger car / pickup) baseline in hours.
 * `basis` says how solid that number is:
 *   - 'confirmed'  Allan's own figure, given directly (Sep 2026).
 *   - 'computed'   built by adding confirmed legs together (e.g. Dar->Nzega
 *                  plus the confirmed Nzega->Mwanza leg). The maths is
 *                  shown so nobody mistakes it for a measured figure.
 *   - 'estimate'   a planning placeholder from general road knowledge, not
 *                  logged by Bart Mining. Treat as approximate until a real
 *                  delivery confirms or corrects it.
 *
 * Cargo actually moves slower than a passenger car: the loaded truck is
 * heavier, stops more at weighbridges and checkpoints, and (for abnormal
 * loads) needs permits and a pilot vehicle. `CARGO_CLASSES` holds the
 * multipliers Allan gave for that (Sep 2026) — apply them to `hours`, then
 * add the buffer for a realistic planning window.
 *
 * (x, y) place each town on the schematic map in delivery-shipping/page.tsx.
 * The map is a simplified route diagram, not a scaled geographic map.
 */

export interface DeliveryStop {
  slug: string
  town: string
  region: string
  /** Light-vehicle hours from Dar es Salaam, as [low, high]. */
  hours: [number, number]
  basis: 'confirmed' | 'computed' | 'estimate'
  /** Shown next to computed/estimate figures so the reasoning is visible. */
  note?: string
  x: number
  y: number
}

/** Multiply the light-vehicle baseline by these to plan cargo transit time. */
export const CARGO_CLASSES = [
  {
    id: 'light',
    label: 'Light vehicle',
    example: 'Reference only — how the baseline hours were measured',
    multiplier: 1,
  },
  {
    id: 'medium',
    label: 'Medium cargo',
    example: 'Crushers, mills, tanks, generators on a flatbed',
    multiplier: 1.7,
  },
  {
    id: 'heavy',
    label: 'Heavy cargo',
    example: 'Complete plants, large gensets, bulk consignments',
    multiplier: 2.3,
  },
  {
    id: 'abnormal',
    label: 'Abnormal load (lowboy)',
    example: 'Excavators, dozers, cranes, oversize single units',
    multiplier: null,
    fixedNote: 'Typically 3+ days on the road regardless of distance within Tanzania. Speed is limited by the lowboy itself, and abnormal-load permits and a pilot vehicle are required for most routes — arrange these before the truck loads, not after.',
  },
] as const

/** Add this on top of the cargo-class figure as a planning buffer. */
export const BUFFER = { low: 0.2, high: 0.4 }

export const DELIVERY_STOPS: DeliveryStop[] = [
  { slug: 'dar-es-salaam', town: 'Dar es Salaam', region: 'Port / origin', hours: [0, 0], basis: 'confirmed', note: 'Origin — port clearance and our yard.', x: 540, y: 470 },
  { slug: 'morogoro', town: 'Morogoro', region: 'Morogoro Region', hours: [1.7, 3], basis: 'confirmed', note: "Allan's own figure, depending on transport chosen.", x: 480, y: 400 },
  { slug: 'handeni', town: 'Handeni', region: 'Tanga Region', hours: [4, 5], basis: 'estimate', x: 490, y: 270 },
  { slug: 'dodoma', town: 'Dodoma', region: 'Dodoma Region', hours: [6, 7], basis: 'estimate', x: 400, y: 350 },
  { slug: 'arusha', town: 'Arusha', region: 'Arusha Region', hours: [9, 10], basis: 'estimate', x: 430, y: 130 },
  { slug: 'mererani', town: 'Mererani', region: 'Manyara Region', hours: [9.5, 10.5], basis: 'estimate', note: 'Just south of Arusha.', x: 420, y: 170 },
  { slug: 'singida', town: 'Singida', region: 'Singida Region', hours: [8, 9], basis: 'estimate', x: 330, y: 320 },
  { slug: 'mbeya', town: 'Mbeya', region: 'Mbeya Region', hours: [10, 12], basis: 'estimate', x: 150, y: 480 },
  { slug: 'chunya', town: 'Chunya', region: 'Mbeya Region', hours: [11, 13], basis: 'estimate', note: 'Off the main Mbeya road — the Lupa Goldfield leg adds time.', x: 130, y: 450 },
  { slug: 'songwe', town: 'Songwe', region: 'Songwe Region', hours: [10.5, 12.5], basis: 'estimate', x: 160, y: 500 },
  { slug: 'tabora', town: 'Tabora', region: 'Tabora Region', hours: [12, 14], basis: 'estimate', x: 230, y: 310 },
  { slug: 'nzega', town: 'Nzega', region: 'Tabora Region', hours: [15, 15], basis: 'confirmed', note: "Allan's own figure: 15 hours by passenger car.", x: 260, y: 260 },
  { slug: 'shinyanga', town: 'Shinyanga', region: 'Shinyanga Region', hours: [16, 16.5], basis: 'estimate', note: 'Near Nzega on the same corridor, plus a short local leg.', x: 230, y: 190 },
  { slug: 'kahama', town: 'Kahama', region: 'Shinyanga Region', hours: [16.5, 17], basis: 'estimate', note: 'Near Nzega on the same corridor, plus a short local leg.', x: 190, y: 220 },
  { slug: 'mwanza', town: 'Mwanza', region: 'Mwanza Region', hours: [19, 19.5], basis: 'computed', note: 'Dar→Nzega (confirmed, 15h) + Nzega→Mwanza (confirmed, 4–4.5h).', x: 160, y: 150 },
  { slug: 'geita', town: 'Geita', region: 'Geita Region', hours: [20, 21], basis: 'estimate', note: 'Computed Mwanza figure plus a short local leg.', x: 100, y: 160 },
  { slug: 'musoma', town: 'Musoma', region: 'Mara Region', hours: [21.5, 22.5], basis: 'estimate', note: 'Computed Mwanza figure plus the leg north.', x: 170, y: 90 },
  { slug: 'tarime', town: 'Tarime', region: 'Mara Region', hours: [22.5, 23.5], basis: 'estimate', note: 'Computed Mwanza figure plus the leg north.', x: 150, y: 40 },
  { slug: 'mpanda', town: 'Mpanda', region: 'Katavi Region', hours: [16, 18], basis: 'estimate', x: 100, y: 340 },
] as const

export const DELIVERY_STOP_BY_SLUG = new Map(DELIVERY_STOPS.map(s => [s.slug, s]))
