/**
 * Data for /alluvial-plant-proposal: the animated process flow of the
 * clay-bearing alluvial gold plant proposed for Mbeya Region.
 *
 * This is a public snapshot of the internal plant planner
 * (projects/plant-planner). It carries only what a client may see: the
 * flowsheet, equipment sizes and technical figures. No prices, supplier
 * costs or commission belong in this file, because everything here ships
 * to the browser. If the plant design changes in the planner, update the
 * labels and specs here by hand.
 */

export type FlowKind = 'ore' | 'gold' | 'water' | 'waste'

export interface FlowNode {
  id: string
  x: number
  y: number
  w: number
  h: number
  label: string
  pill?: boolean
  accent?: boolean
  muted?: boolean
}

export interface FlowEdge {
  id: string
  from: string
  to: string
  kind: FlowKind
  pts: [number, number][]
  label?: string
  lx?: number
  ly?: number
  anchor?: 'start' | 'end' | 'middle'
}

export const FLOW_NODES: FlowNode[] = [
  { id: 'rom', x: 20, y: 100, w: 140, h: 56, label: 'Run-of-mine gravel' },
  { id: 'oversize', x: 200, y: 30, w: 160, h: 34, label: '+80 mm to waste', muted: true },
  { id: 'hopper', x: 200, y: 100, w: 160, h: 56, label: 'Feed hopper + grizzly' },
  { id: 'feeder', x: 410, y: 100, w: 150, h: 56, label: 'Vibrating feeder' },
  { id: 'coarseWaste', x: 610, y: 30, w: 240, h: 34, label: '+20 mm gravel to waste', muted: true },
  { id: 'scrubber', x: 610, y: 94, w: 240, h: 68, label: 'Rotary scrubber + trommel', pill: true },
  { id: 'tank', x: 650, y: 240, w: 170, h: 56, label: 'Slurry tank + pumps' },
  { id: 'centrifuge', x: 420, y: 240, w: 180, h: 56, label: 'Centrifuges' },
  { id: 'sluice', x: 420, y: 330, w: 180, h: 56, label: 'Sluices' },
  { id: 'table', x: 220, y: 280, w: 150, h: 56, label: 'Shaking table' },
  { id: 'goldroom', x: 20, y: 280, w: 150, h: 56, label: 'Gold room', accent: true },
  { id: 'dewater', x: 220, y: 450, w: 160, h: 56, label: 'Dewatering screen' },
  { id: 'ponds', x: 440, y: 450, w: 180, h: 56, label: 'Settling ponds' },
  { id: 'clean', x: 680, y: 450, w: 170, h: 56, label: 'Clean water pond' },
]

export const FLOW_EDGES: FlowEdge[] = [
  { id: 'e1', from: 'rom', to: 'hopper', kind: 'ore', pts: [[160, 128], [198, 128]] },
  { id: 'e2', from: 'hopper', to: 'oversize', kind: 'waste', pts: [[280, 100], [280, 66]] },
  { id: 'e3', from: 'hopper', to: 'feeder', kind: 'ore', pts: [[360, 128], [408, 128]] },
  { id: 'e4', from: 'feeder', to: 'scrubber', kind: 'ore', pts: [[560, 128], [608, 128]] },
  { id: 'e5', from: 'scrubber', to: 'coarseWaste', kind: 'waste', pts: [[730, 94], [730, 66]] },
  { id: 'e6', from: 'scrubber', to: 'tank', kind: 'ore', pts: [[735, 162], [735, 238]], label: '0-6 mm slurry', lx: 743, ly: 205, anchor: 'start' },
  { id: 'e7', from: 'tank', to: 'centrifuge', kind: 'ore', pts: [[650, 268], [602, 268]] },
  { id: 'e8', from: 'scrubber', to: 'sluice', kind: 'ore', pts: [[850, 128], [895, 128], [895, 358], [602, 358]], label: '6-20 mm', lx: 903, ly: 250, anchor: 'start' },
  { id: 'e9', from: 'centrifuge', to: 'table', kind: 'gold', pts: [[420, 268], [400, 268], [400, 300], [372, 300]], label: 'concentrate', lx: 396, ly: 262, anchor: 'end' },
  { id: 'e10', from: 'sluice', to: 'table', kind: 'gold', pts: [[420, 358], [400, 358], [400, 318], [372, 318]] },
  { id: 'e11', from: 'table', to: 'goldroom', kind: 'gold', pts: [[220, 308], [172, 308]] },
  { id: 'e12', from: 'sluice', to: 'dewater', kind: 'waste', pts: [[510, 386], [510, 420], [300, 420], [300, 448]], label: 'tailings', lx: 404, ly: 414, anchor: 'middle' },
  { id: 'e13', from: 'dewater', to: 'ponds', kind: 'water', pts: [[380, 478], [438, 478]] },
  { id: 'e14', from: 'ponds', to: 'clean', kind: 'water', pts: [[620, 478], [678, 478]] },
  { id: 'e15', from: 'clean', to: 'scrubber', kind: 'water', pts: [[850, 478], [955, 478], [955, 112], [852, 112]], label: 'recycled water', lx: 958, ly: 102, anchor: 'end' },
]

export const FLOW_BANDS = [
  { y: 22, label: 'FEED & WASH' },
  { y: 228, label: 'RECOVERY' },
  { y: 432, label: 'WATER' },
]

export const FLOW_STEPS: { title: string; text: string; nodes: string[]; edges: string[] }[] = [
  { title: 'Feed', nodes: ['rom', 'hopper', 'oversize'], edges: ['e1', 'e2'],
    text: 'A loader tips run-of-mine gravel into the hopper. The 80 mm grizzly bars reject boulders, which go straight to waste.' },
  { title: 'Meter', nodes: ['hopper', 'feeder', 'scrubber'], edges: ['e3', 'e4'],
    text: 'The vibrating feeder meters gravel into the scrubber at a steady rate, so the drum never floods or runs empty.' },
  { title: 'Scrub and screen', nodes: ['scrubber', 'coarseWaste'], edges: ['e5', 'e15'],
    text: 'Water and tumbling inside the rotating drum break the clay apart and free the gold. The trommel screen splits the washed gravel by size, and anything over 20 mm goes to waste.' },
  { title: 'Fine gold', nodes: ['scrubber', 'tank', 'centrifuge'], edges: ['e6', 'e7'],
    text: 'The 0-6 mm slurry, where most of the fine gold sits, is pumped to the centrifugal concentrators. They hold the heavy gold and let the lighter sand pass.' },
  { title: 'Coarse gold', nodes: ['scrubber', 'sluice'], edges: ['e8'],
    text: 'The 6-20 mm fraction runs over the sluices, whose riffles trap the coarser gold and small nuggets.' },
  { title: 'Clean-up and gold room', nodes: ['centrifuge', 'sluice', 'table', 'goldroom'], edges: ['e9', 'e10', 'e11'],
    text: 'Concentrates from the centrifuges and sluices are upgraded on the shaking table. The gold then goes to the locked gold room for drying and smelting.' },
  { title: 'Water recovery', nodes: ['sluice', 'dewater', 'ponds', 'clean', 'scrubber'], edges: ['e12', 'e13', 'e14', 'e15'],
    text: 'Tailings are dewatered and the water settles through the ponds. Clean water is pumped back to the scrubber, so the plant reuses most of its water.' },
]

export interface PlantOption {
  id: string
  short: string
  name: string
  summary: string
  capacity: string
  throughput: string
  power: string
  firstGold: string
  /** Sub-label under each node, by node id. */
  subs: Record<string, string>
  specs: { label: string; value: string }[]
}

export const PLANT_OPTIONS: PlantOption[] = [
  {
    id: 'A',
    short: 'Full Scale Plant',
    name: 'Full Scale Plant',
    summary: '150 m³/h in a single line, built in one go.',
    capacity: '150 m³/h',
    throughput: '78,000 m³',
    power: '500 kVA',
    firstGold: 'about 6 months',
    subs: {
      rom: 'loader feed',
      hopper: '30-40 m³ • 80 mm bars',
      feeder: '150-180 m³/h • 15 kW',
      scrubber: 'Φ2.2 × 6.5 m • 55 kW • 6 / 20 mm',
      tank: '8-12 m³ • 1 duty + 1 standby',
      centrifuge: '3 × STLB-80',
      sluice: '2 coarse + 3 scavenger runs',
      table: '2 × 6-S',
      goldroom: 'furnace • locked store',
      dewater: '7.5 kW',
      ponds: 'primary + polishing',
      clean: 'recycle pump 18.5 kW',
    },
    specs: [
      { label: 'Nameplate / turndown', value: '150 / 100 m³/h' },
      { label: 'Feed mass rate (1.50-1.70 t/m³)', value: '225-255 t/h' },
      { label: 'Rotary scrubber', value: 'Φ2.2 × 6.5 m, 55 kW' },
      { label: 'Fine gold recovery', value: '3 × STLB-80 centrifuges' },
      { label: 'Coarse gold recovery', value: '2 coarse + 3 scavenger sluice runs, 2 tables' },
      { label: 'Installed / running load', value: '280-340 / 200-260 kW' },
      { label: 'Power supply', value: '500 kVA prime' },
      { label: 'Circulating water / makeup', value: '500 / 75-120 m³/h' },
      { label: 'Crew per shift', value: '7 + shared mechanic' },
      { label: 'Free-gold recovery envelope', value: '88-95%' },
    ],
  },
  {
    id: 'B',
    short: 'Starter Modular Plant',
    name: 'Starter Modular Plant',
    summary: '75 m³/h starter line that grows to 150 m³/h by adding an identical second line later.',
    capacity: '75 m³/h',
    throughput: '39,000 m³',
    power: '250 kVA',
    firstGold: 'about 5.5 months',
    subs: {
      rom: 'loader feed',
      hopper: '15-20 m³ • 80 mm bars',
      feeder: '75-100 m³/h • 7.5 kW',
      scrubber: 'Φ2.0 × 5.0 m • 37 kW • 6 / 20 mm',
      tank: '5-6 m³ • 1 duty + 1 standby',
      centrifuge: '2 × STLB-80',
      sluice: '1 coarse + 2 scavenger runs',
      table: '1 × 6-S',
      goldroom: 'furnace • locked store',
      dewater: '5.5 kW',
      ponds: 'primary + polishing',
      clean: 'recycle pump 11 kW',
    },
    specs: [
      { label: 'Nameplate / turndown', value: '75 / 50 m³/h' },
      { label: 'Feed mass rate (1.50-1.70 t/m³)', value: '113-128 t/h' },
      { label: 'Rotary scrubber', value: 'Φ2.0 × 5.0 m class, 37 kW' },
      { label: 'Fine gold recovery', value: '2 × STLB-80 centrifuges' },
      { label: 'Coarse gold recovery', value: '1 coarse + 2 scavenger sluice runs, 1 table' },
      { label: 'Installed / running load', value: '175-190 / 120-150 kW' },
      { label: 'Power supply', value: '250 kVA prime, sync-ready for a second line' },
      { label: 'Circulating water / makeup', value: '250-280 / 40-55 m³/h' },
      { label: 'Crew per shift', value: '6 + shared mechanic' },
      { label: 'Free-gold recovery envelope', value: '88-95%' },
    ],
  },
]

/**
 * Phone layout: the same plant drawn top to bottom in a narrow viewBox.
 * Node and edge ids match the desktop layout, so FLOW_STEPS works for both.
 */
export const FLOW_VIEWBOX_MOBILE = { w: 360, h: 870 }

export const FLOW_NODES_MOBILE: FlowNode[] = [
  { id: 'rom', x: 80, y: 30, w: 200, h: 48, label: 'Run-of-mine gravel' },
  { id: 'oversize', x: 4, y: 110, w: 68, h: 48, label: '+80 mm waste', muted: true },
  { id: 'hopper', x: 80, y: 110, w: 200, h: 48, label: 'Feed hopper + grizzly' },
  { id: 'feeder', x: 80, y: 190, w: 200, h: 48, label: 'Vibrating feeder' },
  { id: 'coarseWaste', x: 4, y: 272, w: 68, h: 48, label: '+20 mm waste', muted: true },
  { id: 'scrubber', x: 80, y: 268, w: 200, h: 56, label: 'Rotary scrubber + trommel', pill: true },
  { id: 'tank', x: 14, y: 372, w: 162, h: 48, label: 'Slurry tank + pumps' },
  { id: 'centrifuge', x: 14, y: 452, w: 162, h: 48, label: 'Centrifuges' },
  { id: 'sluice', x: 186, y: 412, w: 150, h: 48, label: 'Sluices' },
  { id: 'table', x: 80, y: 540, w: 200, h: 48, label: 'Shaking table' },
  { id: 'goldroom', x: 80, y: 620, w: 200, h: 48, label: 'Gold room', accent: true },
  { id: 'dewater', x: 14, y: 720, w: 162, h: 48, label: 'Dewatering screen' },
  { id: 'ponds', x: 186, y: 720, w: 150, h: 48, label: 'Settling ponds' },
  { id: 'clean', x: 186, y: 800, w: 150, h: 48, label: 'Clean water pond' },
]

export const FLOW_EDGES_MOBILE: FlowEdge[] = [
  { id: 'e1', from: 'rom', to: 'hopper', kind: 'ore', pts: [[180, 78], [180, 108]] },
  { id: 'e2', from: 'hopper', to: 'oversize', kind: 'waste', pts: [[80, 134], [74, 134]] },
  { id: 'e3', from: 'hopper', to: 'feeder', kind: 'ore', pts: [[180, 158], [180, 188]] },
  { id: 'e4', from: 'feeder', to: 'scrubber', kind: 'ore', pts: [[180, 238], [180, 266]] },
  { id: 'e5', from: 'scrubber', to: 'coarseWaste', kind: 'waste', pts: [[80, 296], [74, 296]] },
  { id: 'e6', from: 'scrubber', to: 'tank', kind: 'ore', pts: [[110, 324], [110, 370]], label: '0-6 mm', lx: 116, ly: 352, anchor: 'start' },
  { id: 'e7', from: 'tank', to: 'centrifuge', kind: 'ore', pts: [[95, 420], [95, 450]] },
  { id: 'e8', from: 'scrubber', to: 'sluice', kind: 'ore', pts: [[250, 324], [250, 410]], label: '6-20 mm', lx: 256, ly: 370, anchor: 'start' },
  { id: 'e9', from: 'centrifuge', to: 'table', kind: 'gold', pts: [[95, 500], [95, 520], [150, 520], [150, 538]] },
  { id: 'e10', from: 'sluice', to: 'table', kind: 'gold', pts: [[250, 460], [250, 520], [210, 520], [210, 538]], label: 'concentrate', lx: 256, ly: 500, anchor: 'start' },
  { id: 'e11', from: 'table', to: 'goldroom', kind: 'gold', pts: [[180, 588], [180, 618]] },
  { id: 'e12', from: 'sluice', to: 'dewater', kind: 'waste', pts: [[322, 460], [322, 694], [95, 694], [95, 718]], label: 'tailings', lx: 316, ly: 688, anchor: 'end' },
  { id: 'e13', from: 'dewater', to: 'ponds', kind: 'water', pts: [[176, 744], [184, 744]] },
  { id: 'e14', from: 'ponds', to: 'clean', kind: 'water', pts: [[261, 768], [261, 798]] },
  { id: 'e15', from: 'clean', to: 'scrubber', kind: 'water', pts: [[336, 824], [352, 824], [352, 296], [282, 296]], label: 'recycled water', lx: 346, ly: 250, anchor: 'end' },
]

export const FLOW_BANDS_MOBILE = [
  { y: 18, label: 'FEED & WASH' },
  { y: 360, label: 'RECOVERY' },
  { y: 708, label: 'WATER' },
]
