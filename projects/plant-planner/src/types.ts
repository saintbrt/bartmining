// One project = one JSON file in data/. Everything the tool shows is either
// stored here or calculated from it in model.ts.

export interface Project {
  meta: Meta
  inputs: Inputs
  teamRoles: TeamRole[]
  packages: Package[]
  combos: Combo[]
  production: Production
  expenses: Expense[]
  proposal: ProposalText
}

export interface Meta {
  name: string
  client: string
  site: string
  date: string            // ISO yyyy-mm-dd
  validityDays: number
  preparedBy: string
}

/** Rates shared by every package. Fractions are 0-1 (0.3 = 30%). */
export interface Inputs {
  commission: number          // internal, added on top of supplier FOB
  /** Project management fee: one entry, used as the project manager's pay and as the client's payment on signing. */
  pmFee: number
  riskReserve: number         // internal, tracked only
  contingency: number         // on execution costs
  servicesMarkup: number      // on execution services billed to client
  oceanFreightPer40: number
  oogPremiumPerUnit: number
  originFeePerUnit: number
  insuranceRate: number       // of FOB + freight
  pvocRate: number
  pvocMin: number
  pvocMax: number
  portPerUnit: number
  agencyFee: number
  inlandPer40: number
  lowbedPerUnit: number
  importDuty: number
  importVat: number
  crewSize: number
  crewDayRate: number
  crewFlight: number
  crewVisa: number
  crewLivingPerDay: number
  travelPerEngMonth: number
  supplierTerms: Terms
  /** Percentages of the balance (contract less the project management fee). */
  clientTerms: Terms
}

export interface Terms { deposit: number; bl: number; final: number }


export interface TeamRole {
  id: string
  name: string
  monthlyRate: number
  /** Paid the project management fee (Inputs.pmFee) instead of a monthly rate. */
  onFee?: boolean
  duties?: string
}

export interface EquipmentLine {
  tag: string
  item: string
  qty: string
  kw: string            // display text, e.g. "2 × 15"
  supplierCost: number  // line total
  /** Short name used in the proposal's sourcing lists, e.g. "Rotary scrubber". */
  name?: string
  /** Bought in Tanzania, or imported / supplied through a local partner. */
  source?: 'local' | 'import'
  /** Too big for a container: ships on a flat rack and a lowbed (imported items only). */
  oog?: boolean
  basis: string         // where the price came from (internal)
  optional?: boolean
}

/** Option-specific quantities that drive execution costs. */
export interface PackageParams {
  /** 40ft containers if every item were imported. The model scales this to the imported share. */
  containers: number
  installDays: number
  craneDayRate: number
  craneDays: number
  craneMob: number
  civils: number
  bulkSample: number
  survey: number
  inspection: number
  factoryTrip: number
  permits: number
  commissioningConsumables: number
  wearParts: number
}

export interface ScheduleTask {
  id: string
  label: string
  weeks: number
  after: string[]       // task ids that must finish first
}

/**
 * When each cost lands, by project month. Each array has one fraction per
 * month and should sum to 1. Milestone payments use a month index (0 = M1).
 */
export interface CashflowTiming {
  months: number
  supplierDeposit: number
  supplierBL: number
  supplierFinal: number
  clientSigning: number
  clientDeposit: number      // paid on scope confirmation
  clientBL: number
  clientFinal: number
  freight: number[]
  port: number[]
  civils: number[]
  install: number[]
  qa: number[]
  commissioning: number[]
}

export interface Spec { label: string; value: string }

export interface Package {
  id: string
  code: string            // "A", "B", "P2"
  name: string            // "Starter Modular Plant"
  short: string           // label used in tables and pickers
  capacity: number        // nameplate m³/h
  isExpansion?: boolean   // Phase 2 style add-on, not a stand-alone option
  power: string           // "250 kVA"
  summary: string
  description: string
  highlights: string[]
  fitIf: string[]
  specs: Spec[]
  flow: Record<string, { label?: string; sub?: string; hidden?: boolean }>
  /** Which process diagram to draw. Defaults to the scrubber plant. */
  flowsheet?: 'scrubber' | 'washSluice'
  equipment: EquipmentLine[]
  /**
   * Supplier cost quoted for the whole package when the supplier gives one
   * price and no line breakdown. Lines can then carry 0 and show "Included".
   * Treated as imported and containerised.
   */
  packageCost?: number
  /** Internal note on where the package price comes from (supplier, quote no.). */
  packageBasis?: string
  params: PackageParams
  team: Record<string, number[]>   // role id -> allocation per month
  schedule: ScheduleTask[]
  cashflow: CashflowTiming
}

export interface Combo { id: string; name: string; packageIds: string[] }

export interface Production {
  goldPricePerGram: number
  priceDate: string
  recovery: number
  hoursPerDay: number
  daysPerMonth: number
  grades: number[]       // g/m³, illustrative
}

export type CostCategory =
  | 'equipment' | 'logistics' | 'installation' | 'civils'
  | 'engineering' | 'qa' | 'commissioning' | 'contingency' | 'other'

export interface Expense {
  id: string
  date: string
  scope: string            // package id
  category: CostCategory
  description: string
  payee: string
  amount: number
  status: 'committed' | 'paid'
}

export interface ProposalText {
  kicker: string
  title: string
  intro: string
  packageIds: string[]       // stand-alone options shown, in order
  expansionId: string        // package shown as the growth path ('' = none)
  expansionBaseId: string    // which option it grows
  tradeoff: string
  scheduleNote: string
  productionNote: string
  included: string[]
  services: string[]
  clientResponsibilities: string[]
  commissioningNote: string
  steps: { title: string; text: string }[]
  basis: string
  overview: string            // the project, in general
  alternative: string         // why and how the modular start works
  /** Heading for the alternative section. Defaults to the modular-start heading. */
  alternativeTitle?: string
  costsIntro: string
  executionIntro: string
  teamIntro: string
  shippingIntro: string
  /** Chapter on/off, keyed by chapter id (see CHAPTERS in Proposal.tsx). Missing = on. */
  show: Record<string, boolean>
  detail: ProposalDetail
  /** Opening image per chapter id, as an image key ('' = none). */
  images: Record<string, string>
  /** Key equipment photos shown in each option chapter. */
  equipmentPhotos: string[]
}

export interface ProposalDetail {
  equipmentPrices: boolean
  equipmentPhotos: boolean
  costBreakdown: boolean
  importTaxes: boolean
  teamMonths: boolean
  images: boolean
}
