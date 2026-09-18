/**
 * Delivery time model and map geography for /delivery-shipping.
 *
 * Bart Mining ships from two points: the port and main yard in Dar es
 * Salaam, and a Mwanza base closer to the Lake Victoria goldfields. Every
 * stop below carries a travel time from BOTH, so the page can show
 * whichever origin actually applies to a given order.
 *
 * Positions are real WGS84 longitude/latitude, projected equirectangularly
 * (see `project()`) rather than hand-placed pixel coordinates, so the map
 * is geographically honest even though it is drawn, not tiled.
 *
 * `hours` is a light-vehicle (passenger car / pickup) baseline in hours.
 * `basis` says how solid that number is:
 *   - 'confirmed'  Allan's own figure, given directly (Sep 2026): Dar<->
 *                  Morogoro and Dar<->Nzega<->Mwanza.
 *   - 'computed'   built by adding confirmed legs together (Dar<->Mwanza
 *                  via the Nzega leg). The maths is shown, not hidden.
 *   - 'estimate'   a planning placeholder, not logged by Bart Mining.
 *                  Where a published road-distance figure was available
 *                  (Sep 2026 web search, sourced on the page) it was used
 *                  to compute the hours at a general upcountry average of
 *                  ~55-60 km/h; otherwise it is general road knowledge.
 *                  Either way, treat as approximate until a real delivery
 *                  confirms or corrects it.
 *
 * Cargo actually moves slower than a passenger car: the loaded truck is
 * heavier, stops more at weighbridges and checkpoints, and (for abnormal
 * loads) needs permits and a pilot vehicle. `CARGO_CLASSES` holds the
 * multipliers Allan gave for that (Sep 2026) — apply them to `hours`, then
 * add the buffer for a realistic planning window.
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
  /** WGS84 [longitude, latitude]. */
  lonLat: [number, number]
  fromDar: RouteTime
  fromMwanza: RouteTime
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
    slug: 'dar-es-salaam', town: 'Dar es Salaam', region: 'Port / main yard', lonLat: [39.2695, -6.8235],
    fromDar: { hours: [0, 0], basis: 'confirmed', note: 'Origin — port clearance and our yard.' },
    fromMwanza: { hours: [19, 20], basis: 'computed', note: "Same route as Dar→Mwanza: Dar→Nzega (confirmed, 15h) + Nzega→Mwanza (confirmed, 4–4.5h), cross-checked against a published road distance of roughly 1,120 km." },
  },
  {
    slug: 'mwanza', town: 'Mwanza', region: 'Mwanza Region', lonLat: [32.9000, -2.5167],
    fromDar: { hours: [19, 20], basis: 'computed', note: "Dar→Nzega (confirmed, 15h) + Nzega→Mwanza (confirmed, 4–4.5h), cross-checked against a published road distance of roughly 1,120 km." },
    fromMwanza: { hours: [0, 0], basis: 'confirmed', note: 'Origin — our Mwanza base.' },
  },
  {
    slug: 'morogoro', town: 'Morogoro', region: 'Morogoro Region', lonLat: [37.6612, -6.8210],
    fromDar: { hours: [1.7, 3], basis: 'confirmed', note: "Allan's own figure, depending on transport chosen." },
    fromMwanza: { hours: [17, 18.5], basis: 'estimate', note: 'Morogoro sits on the same corridor as the Dar↔Mwanza route, before Dar — computed Mwanza→Dar time minus the Dar→Morogoro leg.' },
  },
  {
    slug: 'handeni', town: 'Handeni', region: 'Tanga Region', lonLat: [38.0167, -5.4333],
    fromDar: { hours: [4, 5], basis: 'estimate' },
    fromMwanza: { hours: [22, 25], basis: 'estimate', note: 'Off the main Mwanza corridor — a long cross-country route either way.' },
  },
  {
    slug: 'dodoma', town: 'Dodoma', region: 'Dodoma Region', lonLat: [35.7395, -6.1722],
    fromDar: { hours: [6, 7], basis: 'estimate' },
    fromMwanza: { hours: [11, 12.5], basis: 'estimate', note: 'On the Dar↔Mwanza corridor — computed from the Mwanza→Dar time minus the Dar→Dodoma leg.' },
  },
  {
    slug: 'arusha', town: 'Arusha', region: 'Arusha Region', lonLat: [36.6833, -3.3667],
    fromDar: { hours: [9, 10], basis: 'estimate' },
    fromMwanza: { hours: [10, 12], basis: 'estimate', note: 'Via Singida and Babati — a different corridor from the Dar↔Mwanza road.' },
  },
  {
    slug: 'mererani', town: 'Mererani', region: 'Manyara Region', lonLat: [37.0333, -3.8833],
    fromDar: { hours: [9.5, 10.5], basis: 'estimate', note: 'Just south of Arusha.' },
    fromMwanza: { hours: [10.5, 12.5], basis: 'estimate', note: 'Just south of Arusha.' },
  },
  {
    slug: 'singida', town: 'Singida', region: 'Singida Region', lonLat: [34.7436, -4.8163],
    fromDar: { hours: [8, 9], basis: 'estimate' },
    fromMwanza: { hours: [7, 8], basis: 'estimate', note: 'Published road distance from Mwanza is roughly 437 km.' },
  },
  {
    slug: 'mbeya', town: 'Mbeya', region: 'Mbeya Region', lonLat: [33.4500, -8.9000],
    fromDar: { hours: [10, 11.5], basis: 'estimate', note: 'Published road distance from Dar is roughly 830 km.' },
    fromMwanza: { hours: [13, 15], basis: 'estimate' },
  },
  {
    slug: 'chunya', town: 'Chunya', region: 'Mbeya Region', lonLat: [33.4632, -8.5498],
    fromDar: { hours: [11, 13], basis: 'estimate', note: 'Off the main Mbeya road — the Lupa Goldfield leg adds time.' },
    fromMwanza: { hours: [14, 16], basis: 'estimate' },
  },
  {
    slug: 'songwe', town: 'Songwe', region: 'Songwe Region', lonLat: [32.9333, -9.1167],
    fromDar: { hours: [10.5, 12.5], basis: 'estimate' },
    fromMwanza: { hours: [13.5, 15.5], basis: 'estimate' },
  },
  {
    slug: 'tabora', town: 'Tabora', region: 'Tabora Region', lonLat: [32.8266, -5.0162],
    fromDar: { hours: [12, 14], basis: 'estimate' },
    fromMwanza: { hours: [6, 6.5], basis: 'estimate', note: 'Published road distance from Mwanza is roughly 357 km via Shinyanga.' },
  },
  {
    slug: 'nzega', town: 'Nzega', region: 'Tabora Region', lonLat: [33.1833, -4.2144],
    fromDar: { hours: [15, 15], basis: 'confirmed', note: "Allan's own figure: 15 hours by passenger car." },
    fromMwanza: { hours: [4, 4.5], basis: 'confirmed', note: "Allan's own figure." },
  },
  {
    slug: 'shinyanga', town: 'Shinyanga', region: 'Shinyanga Region', lonLat: [33.4212, -3.6639],
    fromDar: { hours: [16, 16.5], basis: 'estimate', note: 'Near Nzega on the same corridor, plus a short local leg.' },
    fromMwanza: { hours: [4, 4.5], basis: 'estimate', note: 'Published road distance from Mwanza is roughly 239 km.' },
  },
  {
    slug: 'kahama', town: 'Kahama', region: 'Shinyanga Region', lonLat: [32.5892, -3.8397],
    fromDar: { hours: [16.5, 17], basis: 'estimate', note: 'Near Nzega on the same corridor, plus a short local leg.' },
    fromMwanza: { hours: [5.5, 6.5], basis: 'estimate', note: 'Beyond Shinyanga on the same road.' },
  },
  {
    slug: 'geita', town: 'Geita', region: 'Geita Region', lonLat: [32.1667, -2.8667],
    fromDar: { hours: [21, 22.5], basis: 'estimate', note: 'Computed Mwanza figure plus the local leg to Geita.' },
    fromMwanza: { hours: [2, 2.5], basis: 'estimate', note: 'Published road distance from Mwanza is roughly 119 km via Busisi.' },
  },
  {
    slug: 'musoma', town: 'Musoma', region: 'Mara Region', lonLat: [33.8000, -1.5000],
    fromDar: { hours: [22.5, 24], basis: 'estimate', note: 'Computed Mwanza figure plus the leg north.' },
    fromMwanza: { hours: [3.5, 4], basis: 'estimate', note: 'A fully paved 218 km road from Mwanza.' },
  },
  {
    slug: 'tarime', town: 'Tarime', region: 'Mara Region', lonLat: [34.3667, -1.3500],
    fromDar: { hours: [24, 26], basis: 'estimate', note: 'Computed Mwanza figure plus the leg north of Musoma.' },
    fromMwanza: { hours: [5, 6], basis: 'estimate', note: 'Past Musoma, near the Kenyan border.' },
  },
  {
    slug: 'mpanda', town: 'Mpanda', region: 'Katavi Region', lonLat: [31.0695, -6.3438],
    fromDar: { hours: [16, 18], basis: 'estimate' },
    fromMwanza: { hours: [9, 10.5], basis: 'estimate', note: 'Via Tabora, then west.' },
  },
] as const

export const DELIVERY_STOP_BY_SLUG = new Map(DELIVERY_STOPS.map(s => [s.slug, s]))

// ───────────────────────── Map geography ─────────────────────────
//
// Real WGS84 outlines, simplified for a small decorative backdrop: mainland
// Tanzania, Lake Victoria, and the Zanzibar/Pemba islands. Equirectangular
// projection — fine at this scale and this close to the equator, and far
// simpler than a full map library for a handful of points and one outline.

export const MAP_BOUNDS = {
  lonMin: 29.20, lonMax: 40.50,
  latMin: -11.85, latMax: -0.80,
  padX: 40, padY: 30,
  width: 720, height: 690,
} as const

export const MAP_VIEWBOX = { w: MAP_BOUNDS.padX * 2 + MAP_BOUNDS.width, h: MAP_BOUNDS.padY * 2 + MAP_BOUNDS.height }

/** Project a [lon, lat] pair to [x, y] in the map's SVG viewBox. */
export function project([lon, lat]: [number, number]): [number, number] {
  const x = MAP_BOUNDS.padX + ((lon - MAP_BOUNDS.lonMin) / (MAP_BOUNDS.lonMax - MAP_BOUNDS.lonMin)) * MAP_BOUNDS.width
  const y = MAP_BOUNDS.padY + ((MAP_BOUNDS.latMax - lat) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) * MAP_BOUNDS.height
  return [x, y]
}

/** Simplified national outline, for the low-opacity backdrop only. */
export const TZ_OUTLINE: [number, number][] = [
  [33.90371, -0.95000], [34.07262, -1.05982], [37.69869, -3.09699],
  [37.76690, -3.67712], [39.20222, -4.67677], [38.74054, -5.90895],
  [38.79977, -6.47566], [39.44000, -6.84000], [39.47000, -7.10000],
  [39.19469, -7.70390], [39.25203, -8.00781], [39.18652, -8.48551],
  [39.53574, -9.11237], [39.94960, -10.09840], [40.31659, -10.31710],
  [39.52100, -10.89688], [38.42756, -11.28520], [37.82764, -11.26879],
  [37.47129, -11.56876], [36.77515, -11.59454], [36.51408, -11.72094],
  [35.31240, -11.43915], [34.55999, -11.52002], [34.28000, -10.16000],
  [33.94084, -9.69367], [33.73972, -9.41715], [32.75937, -9.23060],
  [32.19186, -8.93036], [31.55635, -8.76205], [31.15775, -8.59458],
  [30.74000, -8.34000], [30.20000, -7.08000], [29.62000, -6.52000],
  [29.41999, -5.94000], [29.51999, -5.41998], [29.34000, -4.49998],
  [29.75351, -4.45239], [30.11632, -4.09012], [30.50554, -3.56858],
  [30.75224, -3.35931], [30.74301, -3.03431], [30.52766, -2.80762],
  [30.46967, -2.41383], [30.75831, -2.28725], [30.81613, -1.69891],
  [30.41910, -1.13466], [30.76986, -1.01455], [31.86617, -1.02736],
  [33.90371, -0.95000],
]

export const LAKE_VICTORIA_OUTLINE: [number, number][] = [
  [31.55, -1.08], [31.80, -1.35], [31.95, -1.85], [32.25, -2.35],
  [32.90, -2.62], [33.35, -2.35], [33.85, -1.70], [34.15, -1.20],
  [33.55, -1.06], [32.40, -1.05], [31.55, -1.08],
]

export const ZANZIBAR_OUTLINES: [number, number][][] = [
  [ // Unguja
    [39.18, -5.73], [39.35, -5.72], [39.58, -6.15], [39.52, -6.48],
    [39.20, -6.47], [39.12, -6.16], [39.18, -5.73],
  ],
  [ // Pemba
    [39.65, -4.87], [39.86, -4.95], [39.81, -5.43], [39.64, -5.42], [39.65, -4.87],
  ],
]
