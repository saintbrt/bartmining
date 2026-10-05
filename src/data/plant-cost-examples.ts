/**
 * Public editorial snapshot of CLIENT-facing Chunya proposal totals.
 * Rounded to the nearest USD; never import the private planner JSON into the
 * website. Supplier prices, commissions, margins and pay rates stay private.
 * Source calculation: projects/plant-planner/src/views/Proposal.tsx clientOption.
 * Execution values are proposal allowances, not incurred project costs.
 */
export const CHUNYA_EXAMPLES = [
  { id: 'wash-sluice', date: '2026-10-05', capacityM3h: 150, equipment: 66300, execution: 75543, total: 141843, weeks: 16, categories: [17650, 4650, 8000, 24875, 9500, 4000, 6868] },
  { id: 'scrubber-75', date: '2026-10-03', capacityM3h: 75, equipment: 137400, execution: 214195, total: 351595, weeks: 24, categories: [30673, 29550, 45000, 47500, 26000, 16000, 19472] },
  { id: 'scrubber-150', date: '2026-10-03', capacityM3h: 150, equipment: 227280, execution: 274358, total: 501638, weeks: 26.5, categories: [30892, 40250, 65000, 60775, 28500, 24000, 24942] },
] as const

/** Worked teaching scenarios; these are assumptions, not quotations. */
export const HARD_ROCK_EXAMPLES = [
  { id: 'gravity', tonnesPerDay: 30, equipment: 120000, delivery: 30000, civilsUtilities: 45000, engineeringStartup: 20000, contingency: 21500, workingCapital: 41000 },
  { id: 'cil', tonnesPerDay: 50, equipment: 600000, delivery: 120000, civilsUtilities: 180000, engineeringStartup: 60000, contingency: 96000, workingCapital: 94000 },
] as const

export const MONTHLY_OPERATING_EXAMPLES = [
  { id: 'alluvial', throughput: 150 * 20 * 26 * 0.75, unit: 'm³', costs: [120 * 0.27 * 1.2 * 20 * 26, 15000, 5000, 3000, 3500] },
  { id: 'gravity', throughput: 30 * 26, unit: 't', costs: [30 * 26 * 35 * 0.3, 4500, 3900, 1560, 2340] },
  { id: 'cil', throughput: 50 * 26, unit: 't', costs: [50 * 26 * 40 * 0.3, 10400, 6500, 8000, 2600, 3900] },
] as const

export const totalCost = (values: readonly number[]) => values.reduce((sum, n) => sum + n, 0)
export const usd = (value: number) => `USD ${Math.round(value).toLocaleString('en-US')}`
