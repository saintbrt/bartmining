/**
 * Delivery time model for /delivery-shipping.
 *
 * Bart Mining ships from two points: the port and main yard in Dar es
 * Salaam, and a Mwanza base closer to the Lake Victoria goldfields. Every
 * stop below carries a travel time from BOTH, so the page can show
 * whichever origin actually applies to a given order.
 *
 * `hours` is a light-vehicle (passenger car / pickup) baseline in hours.
 * `basis` says how solid that number is:
 *   - 'confirmed'  Allan's own figure, given directly (Sep 2026): Dar<->
 *                  Morogoro and Dar<->Nzega<->Mwanza.
 *   - 'computed'   built by adding confirmed legs together (Dar<->Mwanza
 *                  via the Nzega leg). The maths is shown, not hidden.
 *   - 'estimate'   a planning placeholder, not logged by Bart Mining.
 *                  Where a published road-distance figure was available
 *                  (Sep 2026 web search, see sources on the page) it was
 *                  used to compute the hours at a general upcountry
 *                  average of ~55-60 km/h; otherwise it is general road
 *                  knowledge. Either way, treat as approximate until a
 *                  real delivery confirms or corrects it.
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

export type TimeBasis = 'confirmed' | 'computed' | 'estimate'

export interface RouteTime {
  /** Light-vehicle hours, as [low, high]. */
  hours: [number, number]
  basis: TimeBasis
  note?: string
}

export interface DeliveryStop {
  slug: string
  town: string
  region: string
  fromDar: RouteTime
  fromMwanza: RouteTime
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

export const ORIGINS = [
  { id: 'dar-es-salaam', label: 'Dar es Salaam', sub: 'Port & main yard' },
  { id: 'mwanza', label: 'Mwanza', sub: 'Lake Victoria goldfields base' },
] as const

export const DELIVERY_STOPS: DeliveryStop[] = [
  {
    slug: 'dar-es-salaam', town: 'Dar es Salaam', region: 'Port / main yard',
    fromDar: { hours: [0, 0], basis: 'confirmed', note: 'Origin — port clearance and our yard.' },
    fromMwanza: { hours: [19, 20], basis: 'computed', note: "Same route as Dar→Mwanza: Dar→Nzega (confirmed, 15h) + Nzega→Mwanza (confirmed, 4–4.5h), cross-checked against a published road distance of roughly 1,120 km." },
    x: 540, y: 470,
  },
  {
    slug: 'mwanza', town: 'Mwanza', region: 'Mwanza Region',
    fromDar: { hours: [19, 20], basis: 'computed', note: "Dar→Nzega (confirmed, 15h) + Nzega→Mwanza (confirmed, 4–4.5h), cross-checked against a published road distance of roughly 1,120 km." },
    fromMwanza: { hours: [0, 0], basis: 'confirmed', note: 'Origin — our Mwanza base.' },
    x: 160, y: 150,
  },
  {
    slug: 'morogoro', town: 'Morogoro', region: 'Morogoro Region',
    fromDar: { hours: [1.7, 3], basis: 'confirmed', note: "Allan's own figure, depending on transport chosen." },
    fromMwanza: { hours: [17, 18.5], basis: 'estimate', note: 'Morogoro sits on the same corridor as the Dar↔Mwanza route, before Dar — computed Mwanza→Dar time minus the Dar→Morogoro leg.' },
    x: 480, y: 400,
  },
  {
    slug: 'handeni', town: 'Handeni', region: 'Tanga Region',
    fromDar: { hours: [4, 5], basis: 'estimate' },
    fromMwanza: { hours: [22, 25], basis: 'estimate', note: 'Off the main Mwanza corridor — a long cross-country route either way.' },
    x: 490, y: 270,
  },
  {
    slug: 'dodoma', town: 'Dodoma', region: 'Dodoma Region',
    fromDar: { hours: [6, 7], basis: 'estimate' },
    fromMwanza: { hours: [11, 12.5], basis: 'estimate', note: 'On the Dar↔Mwanza corridor — computed from the Mwanza→Dar time minus the Dar→Dodoma leg.' },
    x: 400, y: 350,
  },
  {
    slug: 'arusha', town: 'Arusha', region: 'Arusha Region',
    fromDar: { hours: [9, 10], basis: 'estimate' },
    fromMwanza: { hours: [10, 12], basis: 'estimate', note: 'Via Singida and Babati — a different corridor from the Dar↔Mwanza road.' },
    x: 430, y: 130,
  },
  {
    slug: 'mererani', town: 'Mererani', region: 'Manyara Region',
    fromDar: { hours: [9.5, 10.5], basis: 'estimate', note: 'Just south of Arusha.' },
    fromMwanza: { hours: [10.5, 12.5], basis: 'estimate', note: 'Just south of Arusha.' },
    x: 420, y: 170,
  },
  {
    slug: 'singida', town: 'Singida', region: 'Singida Region',
    fromDar: { hours: [8, 9], basis: 'estimate' },
    fromMwanza: { hours: [7, 8], basis: 'estimate', note: 'Published road distance from Mwanza is roughly 437 km.' },
    x: 330, y: 320,
  },
  {
    slug: 'mbeya', town: 'Mbeya', region: 'Mbeya Region',
    fromDar: { hours: [10, 11.5], basis: 'estimate', note: 'Published road distance from Dar is roughly 830 km.' },
    fromMwanza: { hours: [13, 15], basis: 'estimate' },
    x: 150, y: 480,
  },
  {
    slug: 'chunya', town: 'Chunya', region: 'Mbeya Region',
    fromDar: { hours: [11, 13], basis: 'estimate', note: 'Off the main Mbeya road — the Lupa Goldfield leg adds time.' },
    fromMwanza: { hours: [14, 16], basis: 'estimate' },
    x: 130, y: 450,
  },
  {
    slug: 'songwe', town: 'Songwe', region: 'Songwe Region',
    fromDar: { hours: [10.5, 12.5], basis: 'estimate' },
    fromMwanza: { hours: [13.5, 15.5], basis: 'estimate' },
    x: 160, y: 500,
  },
  {
    slug: 'tabora', town: 'Tabora', region: 'Tabora Region',
    fromDar: { hours: [12, 14], basis: 'estimate' },
    fromMwanza: { hours: [6, 6.5], basis: 'estimate', note: 'Published road distance from Mwanza is roughly 357 km via Shinyanga.' },
    x: 230, y: 310,
  },
  {
    slug: 'nzega', town: 'Nzega', region: 'Tabora Region',
    fromDar: { hours: [15, 15], basis: 'confirmed', note: "Allan's own figure: 15 hours by passenger car." },
    fromMwanza: { hours: [4, 4.5], basis: 'confirmed', note: "Allan's own figure." },
    x: 260, y: 260,
  },
  {
    slug: 'shinyanga', town: 'Shinyanga', region: 'Shinyanga Region',
    fromDar: { hours: [16, 16.5], basis: 'estimate', note: 'Near Nzega on the same corridor, plus a short local leg.' },
    fromMwanza: { hours: [4, 4.5], basis: 'estimate', note: 'Published road distance from Mwanza is roughly 239 km.' },
    x: 230, y: 190,
  },
  {
    slug: 'kahama', town: 'Kahama', region: 'Shinyanga Region',
    fromDar: { hours: [16.5, 17], basis: 'estimate', note: 'Near Nzega on the same corridor, plus a short local leg.' },
    fromMwanza: { hours: [5.5, 6.5], basis: 'estimate', note: 'Beyond Shinyanga on the same road.' },
    x: 190, y: 220,
  },
  {
    slug: 'geita', town: 'Geita', region: 'Geita Region',
    fromDar: { hours: [21, 22.5], basis: 'estimate', note: 'Computed Mwanza figure plus the local leg to Geita.' },
    fromMwanza: { hours: [2, 2.5], basis: 'estimate', note: 'Published road distance from Mwanza is roughly 119 km via Busisi.' },
    x: 100, y: 160,
  },
  {
    slug: 'musoma', town: 'Musoma', region: 'Mara Region',
    fromDar: { hours: [22.5, 24], basis: 'estimate', note: 'Computed Mwanza figure plus the leg north.' },
    fromMwanza: { hours: [3.5, 4], basis: 'estimate', note: 'A fully paved 218 km road from Mwanza.' },
    x: 170, y: 90,
  },
  {
    slug: 'tarime', town: 'Tarime', region: 'Mara Region',
    fromDar: { hours: [24, 26], basis: 'estimate', note: 'Computed Mwanza figure plus the leg north of Musoma.' },
    fromMwanza: { hours: [5, 6], basis: 'estimate', note: 'Past Musoma, near the Kenyan border.' },
    x: 150, y: 40,
  },
  {
    slug: 'mpanda', town: 'Mpanda', region: 'Katavi Region',
    fromDar: { hours: [16, 18], basis: 'estimate' },
    fromMwanza: { hours: [9, 10.5], basis: 'estimate', note: 'Via Tabora, then west.' },
    x: 100, y: 340,
  },
] as const

export const DELIVERY_STOP_BY_SLUG = new Map(DELIVERY_STOPS.map(s => [s.slug, s]))
