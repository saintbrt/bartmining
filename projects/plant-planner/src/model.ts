// The cost model. A straight port of Mbeya_Gold_Plant_Project_Budget.xlsx:
// each function names the sheet it replaces.

import type { CostCategory, Inputs, Package, Project, TeamRole } from './types'

export const CATEGORY_LABEL: Record<CostCategory, string> = {
  equipment: 'Equipment (FOB)',
  logistics: 'Logistics & clearing',
  installation: 'Installation & lifting',
  civils: 'Civil works',
  engineering: 'Engineering & management',
  qa: 'Testing, QA & compliance',
  commissioning: 'Commissioning & spares',
  contingency: 'Contingency',
  other: 'Other',
}

export interface ExecLine { id: string; category: CostCategory; label: string; amount: number; basis: string }

export interface PackageModel {
  pkg: Package
  fob: number
  /** Supplier cost of imported items, and how they ship. */
  importFob: number
  containers: number
  oogUnits: number
  importedLines: number
  commission: number
  clientEquipment: number
  reserve: number
  lines: { tag: string; client: number; commission: number; reserve: number }[]
  exec: ExecLine[]
  execSubtotal: number
  contingency: number
  execTotal: number
  deliverCost: number
  servicesBilled: number
  contract: number
  grossProfit: number
  margin: number
  profitAfterRisk: number
  customsValue: number
  importDuty: number
  importVat: number
  byCategory: Record<CostCategory, number>
  schedule: ScheduledTask[]
  weeksToGold: number
  monthsToGold: number
  team: TeamModel
  cashflow: CashflowModel
}

export interface ScheduledTask { id: string; label: string; start: number; weeks: number; end: number }

export interface TeamModel {
  rows: { role: TeamRole; alloc: number[]; months: number; cost: number }[]
  monthlyCost: number[]
  monthlyTravel: number[]
  cost: number
  travel: number
}

export interface CashflowModel {
  months: number
  rows: { label: string; values: number[]; total: number }[]
  outflow: number[]
  receipts: number[]
  net: number[]
  cumulative: number[]
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** Team_Payments sheet. */
function teamModel(pkg: Package, roles: TeamRole[], inputs: Inputs): TeamModel {
  const months = pkg.cashflow.months
  const rows = roles.map(role => {
    const alloc = Array.from({ length: months }, (_, m) => pkg.team[role.id]?.[m] ?? 0)
    const total = sum(alloc)
    // A flat fee is paid once per contract, whatever the months involved.
    return { role, alloc, months: total, cost: role.onFee ? inputs.pmFee : total * role.monthlyRate }
  })
  // Spread a flat fee over the months the role is involved, for cashflow.
  const inMonth = (r: (typeof rows)[number], m: number) =>
    r.role.onFee ? (r.months ? (inputs.pmFee * r.alloc[m]) / r.months : 0) : r.alloc[m] * r.role.monthlyRate
  const monthlyCost = Array.from({ length: months }, (_, m) => sum(rows.map(r => inMonth(r, m))))
  const monthlyTravel = Array.from({ length: months }, (_, m) => sum(rows.map(r => r.alloc[m])) * inputs.travelPerEngMonth)
  return { rows, monthlyCost, monthlyTravel, cost: sum(rows.map(r => r.cost)), travel: sum(monthlyTravel) }
}

/** Schedule sheet: each task starts when everything it waits on has ended. */
function scheduleModel(pkg: Package): ScheduledTask[] {
  const done = new Map<string, ScheduledTask>()
  const visit = (id: string, seen: Set<string>): ScheduledTask | undefined => {
    if (done.has(id)) return done.get(id)
    const t = pkg.schedule.find(x => x.id === id)
    if (!t || seen.has(id)) return undefined
    seen.add(id)
    const start = Math.max(0, ...t.after.map(a => visit(a, seen)?.end ?? 0))
    const st = { id: t.id, label: t.label, start, weeks: t.weeks, end: start + t.weeks }
    done.set(id, st)
    return st
  }
  return pkg.schedule.map(t => visit(t.id, new Set())!).filter(Boolean)
}

export function packageModel(project: Project, pkg: Package): PackageModel {
  const i = project.inputs
  const p = pkg.params

  // Equipment sheets
  const lines = pkg.equipment.map(e => ({
    tag: e.tag,
    commission: e.supplierCost * i.commission,
    client: e.supplierCost * (1 + i.commission),
    reserve: e.supplierCost * i.riskReserve,
  }))
  const fob = sum(pkg.equipment.map(e => e.supplierCost))
  const commission = sum(lines.map(l => l.commission))
  const clientEquipment = sum(lines.map(l => l.client))
  const reserve = sum(lines.map(l => l.reserve))

  const team = teamModel(pkg, project.teamRoles, i)

  // Shipping follows the equipment list. Only imported lines ship; items that
  // are out of gauge go on flat racks, and the containers scale with the
  // imported share of the containerised equipment value.
  const imported = pkg.equipment.map((e, k) => ({ e, k })).filter(x => (x.e.source ?? 'import') === 'import')
  const importFob = sum(imported.map(x => x.e.supplierCost))
  const importClient = sum(imported.map(x => lines[x.k].client))
  const boxedFob = sum(pkg.equipment.filter(e => !e.oog).map(e => e.supplierCost))
  const boxedImportFob = sum(imported.filter(x => !x.e.oog).map(x => x.e.supplierCost))
  const containers = boxedFob > 0 ? Math.ceil(p.containers * (boxedImportFob / boxedFob) - 1e-9) : 0
  const oogUnits = imported.filter(x => x.e.oog).length
  const shipments = imported.length > 0 ? 1 : 0

  const units = containers + oogUnits
  const ocean = containers * i.oceanFreightPer40
  const oog = oogUnits * i.oogPremiumPerUnit
  const insurance = (importFob + ocean + oog) * i.insuranceRate

  // Execution_Costs sheet
  const exec: ExecLine[] = [
    { id: 'origin', category: 'logistics', label: 'Origin port & loading', amount: units * i.originFeePerUnit, basis: 'Units × origin fee' },
    { id: 'ocean', category: 'logistics', label: 'Ocean freight 40ft HC', amount: ocean, basis: 'Containers × freight rate' },
    { id: 'oog', category: 'logistics', label: 'Flat rack / OOG premium', amount: oog, basis: 'OOG units × premium' },
    { id: 'insurance', category: 'logistics', label: 'Marine insurance', amount: insurance, basis: '(imported FOB + freight) × rate' },
    { id: 'pvoc', category: 'logistics', label: 'PVoC certificate of conformity', amount: shipments * Math.min(Math.max(importFob * i.pvocRate, i.pvocMin), i.pvocMax), basis: '% of imported FOB, min/max per TBS' },
    { id: 'port', category: 'logistics', label: 'Dar port charges & customs clearance', amount: units * i.portPerUnit, basis: 'Units × port/clearance rate' },
    { id: 'agency', category: 'logistics', label: 'Clearing & forwarding agency fee', amount: shipments * i.agencyFee, basis: 'Per shipment' },
    { id: 'inland', category: 'logistics', label: 'Inland trucking Dar to Mbeya (containers)', amount: containers * i.inlandPer40, basis: 'Containers × truck rate' },
    { id: 'lowbed', category: 'logistics', label: 'Lowbed trucking Dar to Mbeya (OOG)', amount: oogUnits * i.lowbedPerUnit, basis: 'OOG units × lowbed rate' },
    { id: 'crewLabour', category: 'installation', label: 'OEM installation crew labour', amount: i.crewSize * i.crewDayRate * p.installDays, basis: 'Crew × day rate × days' },
    { id: 'crewTravel', category: 'installation', label: 'OEM crew flights, visas & permits', amount: i.crewSize * (i.crewFlight + i.crewVisa), basis: 'Crew × (flight + visa)' },
    { id: 'crewLiving', category: 'installation', label: 'OEM crew accommodation & food', amount: i.crewSize * i.crewLivingPerDay * p.installDays, basis: 'Crew × days × rate' },
    { id: 'crane', category: 'installation', label: 'Crane hire incl. mobilisation', amount: p.craneDayRate * p.craneDays + p.craneMob, basis: 'Day rate × days + mob' },
    { id: 'civils', category: 'civils', label: 'Pad, plinths, foundations, lined ponds, fuel bund, gold room', amount: p.civils, basis: 'Allowance' },
    { id: 'team', category: 'engineering', label: 'Project team payments', amount: team.cost, basis: 'From Team tab' },
    { id: 'teamTravel', category: 'engineering', label: 'Team travel & site accommodation', amount: team.travel, basis: 'Engineer-months × rate' },
    { id: 'bulkSample', category: 'qa', label: 'Bulk sample & metallurgical testing', amount: p.bulkSample, basis: 'Allowance' },
    { id: 'survey', category: 'qa', label: 'Site survey & geotech', amount: p.survey, basis: 'Allowance' },
    { id: 'inspection', category: 'qa', label: 'Third-party pre-shipment inspection', amount: p.inspection, basis: 'Allowance' },
    { id: 'factoryTrip', category: 'qa', label: 'Factory inspection trip', amount: p.factoryTrip, basis: 'Allowance' },
    { id: 'permits', category: 'qa', label: 'Permits & environmental support', amount: p.permits, basis: 'Allowance' },
    { id: 'consumables', category: 'commissioning', label: 'Commissioning consumables & fuel', amount: p.commissioningConsumables, basis: 'Allowance' },
    { id: 'wearParts', category: 'commissioning', label: 'First-year wear parts', amount: p.wearParts, basis: 'Allowance' },
  ]
  const execSubtotal = sum(exec.map(e => e.amount))
  const contingency = execSubtotal * i.contingency
  const execTotal = execSubtotal + contingency

  // Dashboard sheet
  const deliverCost = fob + execTotal
  const servicesBilled = execTotal * (1 + i.servicesMarkup)
  const contract = clientEquipment + servicesBilled
  const grossProfit = contract - deliverCost
  // Import VAT and duty apply to imported equipment only.
  const customsValue = shipments ? importClient + ocean + oog + insurance : 0
  const importDuty = customsValue * i.importDuty

  const byCategory = emptyCategories()
  byCategory.equipment = fob
  for (const e of exec) byCategory[e.category] += e.amount
  byCategory.contingency = contingency

  const schedule = scheduleModel(pkg)
  const weeksToGold = Math.max(0, ...schedule.map(t => t.end))

  const cashflow = cashflowModel(pkg, project, { fob, contract, exec, contingency, team })

  return {
    pkg, fob, importFob, containers, oogUnits, importedLines: imported.length, commission, clientEquipment, reserve, lines, exec, execSubtotal, contingency, execTotal,
    deliverCost, servicesBilled, contract, grossProfit,
    margin: contract ? grossProfit / contract : 0,
    profitAfterRisk: grossProfit - reserve,
    customsValue, importDuty, importVat: (customsValue + importDuty) * i.importVat,
    byCategory, schedule, weeksToGold, monthsToGold: weeksToGold / 4.33, team, cashflow,
  }
}

export function emptyCategories(): Record<CostCategory, number> {
  return { equipment: 0, logistics: 0, installation: 0, civils: 0, engineering: 0, qa: 0, commissioning: 0, contingency: 0, other: 0 }
}

/** Cashflow sheet. */
function cashflowModel(
  pkg: Package, project: Project,
  m: { fob: number; contract: number; exec: ExecLine[]; contingency: number; team: TeamModel },
): CashflowModel {
  const t = pkg.cashflow
  const n = t.months
  const at = (month: number, amount: number) => Array.from({ length: n }, (_, k) => (k === month ? amount : 0))
  const spread = (dist: number[], amount: number) => Array.from({ length: n }, (_, k) => (dist[k] ?? 0) * amount)
  const of = (...ids: string[]) => sum(m.exec.filter(e => ids.includes(e.id)).map(e => e.amount))
  const st = project.inputs.supplierTerms
  const ct = project.inputs.clientTerms

  const rows = [
    { label: `Supplier ${pct(st.deposit)} deposit`, values: at(t.supplierDeposit, m.fob * st.deposit) },
    { label: `Supplier ${pct(st.bl)} against B/L`, values: at(t.supplierBL, m.fob * st.bl) },
    { label: `Supplier ${pct(st.final)} after commissioning`, values: at(t.supplierFinal, m.fob * st.final) },
    { label: 'Freight, insurance, PVoC, origin', values: spread(t.freight, of('origin', 'ocean', 'oog', 'insurance', 'pvoc')) },
    { label: 'Port, clearing & inland trucking', values: spread(t.port, of('port', 'agency', 'inland', 'lowbed')) },
    { label: 'Civil works', values: spread(t.civils, of('civils')) },
    { label: 'Installation & crane', values: spread(t.install, of('crewLabour', 'crewTravel', 'crewLiving', 'crane')) },
    { label: 'Testing, QA & compliance', values: spread(t.qa, of('bulkSample', 'survey', 'inspection', 'factoryTrip', 'permits')) },
    { label: 'Team payments & travel', values: Array.from({ length: n }, (_, k) => (m.team.monthlyCost[k] ?? 0) + (m.team.monthlyTravel[k] ?? 0)) },
    { label: 'Commissioning, spares & contingency', values: spread(t.commissioning, of('consumables', 'wearParts') + m.contingency) },
  ].map(r => ({ ...r, total: sum(r.values) }))

  const outflow = Array.from({ length: n }, (_, k) => sum(rows.map(r => r.values[k])))
  // The project management fee is paid on signing; the percentages apply to the balance.
  const fee = Math.min(project.inputs.pmFee ?? 0, m.contract)
  const balance = m.contract - fee
  const receipts = Array.from({ length: n }, (_, k) =>
    (k === (t.clientSigning ?? 0) ? fee : 0) +
    (k === t.clientDeposit ? balance * ct.deposit : 0) +
    (k === t.clientBL ? balance * ct.bl : 0) +
    (k === t.clientFinal ? balance * ct.final : 0))
  const net = receipts.map((r, k) => r - outflow[k])
  const cumulative: number[] = []
  net.reduce((acc, x, k) => (cumulative[k] = acc + x), 0)
  return { months: n, rows, outflow, receipts, net, cumulative }
}

/** A package or a combination of packages (e.g. Starter Modular Plant + Phase 2). */
export interface ScopeTotals {
  id: string
  name: string
  fob: number
  commission: number
  clientEquipment: number
  execTotal: number
  deliverCost: number
  servicesBilled: number
  contract: number
  grossProfit: number
  margin: number
  reserve: number
  profitAfterRisk: number
  importVat: number
  byCategory: Record<CostCategory, number>
}

export function scopeTotals(id: string, name: string, models: PackageModel[]): ScopeTotals {
  const add = (f: (m: PackageModel) => number) => sum(models.map(f))
  const byCategory = emptyCategories()
  for (const m of models) for (const k of Object.keys(byCategory) as CostCategory[]) byCategory[k] += m.byCategory[k]
  const contract = add(m => m.contract)
  const grossProfit = add(m => m.grossProfit)
  return {
    id, name,
    fob: add(m => m.fob),
    commission: add(m => m.commission),
    clientEquipment: add(m => m.clientEquipment),
    execTotal: add(m => m.execTotal),
    deliverCost: add(m => m.deliverCost),
    servicesBilled: add(m => m.servicesBilled),
    contract, grossProfit,
    margin: contract ? grossProfit / contract : 0,
    reserve: add(m => m.reserve),
    profitAfterRisk: add(m => m.profitAfterRisk),
    importVat: add(m => m.importVat),
    byCategory,
  }
}

export function projectModel(project: Project) {
  const packages = project.packages.map(p => packageModel(project, p))
  const byId = new Map(packages.map(m => [m.pkg.id, m]))
  const scopes: ScopeTotals[] = [
    ...packages.map(m => scopeTotals(m.pkg.id, m.pkg.short, [m])),
    ...project.combos.map(c => scopeTotals(c.id, c.name, c.packageIds.map(id => byId.get(id)!).filter(Boolean))),
  ]
  return { packages, byId, scopes }
}

export type ProjectModel = ReturnType<typeof projectModel>

/** Monthly throughput and illustrative gold output. */
export function production(project: Project, capacity: number) {
  const pr = project.production
  const m3 = capacity * pr.hoursPerDay * pr.daysPerMonth
  return {
    m3,
    rows: pr.grades.map(g => {
      const grams = m3 * g * pr.recovery
      return { grade: g, grams, value: grams * pr.goldPricePerGram }
    }),
  }
}

// Formatting
export const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
export const num = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
export const pct = (n: number, d = 0) => `${(n * 100).toFixed(d)}%`
export const usdM = (n: number) => `$${(n / 1e6).toFixed(2)}M`
/** "about 5 months", rounded to the nearest half month. */
export const aboutMonths = (m: number) => `about ${num(Math.round(m * 2) / 2, Math.round(m * 2) % 2 ? 1 : 0)} months`
