import { useMemo, useState } from 'react'
import { PageHead } from './shared'

// How a change travels through the planner. Keep this in step with model.ts:
// every edge here is a real dependency in the calculations.

type Col = 'input' | 'calc' | 'show'
interface MapNode { id: string; col: Col; label: string; where?: string; manual?: boolean }

const NODES: MapNode[] = [
  { id: 'equipCost', col: 'input', label: 'Equipment supplier cost', where: 'Budget → Equipment' },
  { id: 'imported', col: 'input', label: 'Imported tick', where: 'Budget → Equipment' },
  { id: 'flatRack', col: 'input', label: 'Flat rack tick', where: 'Budget → Equipment' },
  { id: 'equipText', col: 'input', label: 'Item, qty, kW, short name', where: 'Budget → Equipment' },
  { id: 'commission', col: 'input', label: 'Commission %', where: 'Overview / Shared rates' },
  { id: 'reserve', col: 'input', label: 'Price-risk reserve %', where: 'Overview / Shared rates' },
  { id: 'contingency', col: 'input', label: 'Contingency %', where: 'Overview / Shared rates' },
  { id: 'markup', col: 'input', label: 'Markup on services %', where: 'Overview / Shared rates' },
  { id: 'pmFee', col: 'input', label: 'Project management fee', where: 'Overview / Team / Shared rates' },
  { id: 'team', col: 'input', label: 'Team months and monthly rates', where: 'Budget → Team' },
  { id: 'shared', col: 'input', label: 'Freight, port, crew and travel rates', where: 'Budget → Shared rates' },
  { id: 'params', col: 'input', label: 'Containers if all imported, install days, crane, allowances', where: 'Budget → Execution costs' },
  { id: 'weeks', col: 'input', label: 'Task weeks', where: 'Schedule' },
  { id: 'timing', col: 'input', label: 'Payment months', where: 'Cashflow' },
  { id: 'terms', col: 'input', label: 'Payment terms %', where: 'Budget → Shared rates' },
  { id: 'prod', col: 'input', label: 'Gold price, recovery, hours, grades', where: 'Budget → Shared rates' },
  { id: 'text', col: 'input', label: 'Proposal text, chapters, images', where: 'Proposal' },

  { id: 'clientPrice', col: 'calc', label: 'Client equipment price' },
  { id: 'commissionAmt', col: 'calc', label: 'Commission amount' },
  { id: 'reserveAmt', col: 'calc', label: 'Price-risk reserve' },
  { id: 'shipping', col: 'calc', label: 'Containers and flat racks' },
  { id: 'logistics', col: 'calc', label: 'Freight, insurance, PVoC, clearing, trucking' },
  { id: 'install', col: 'calc', label: 'Installation crew and crane' },
  { id: 'engineering', col: 'calc', label: 'Engineering and management' },
  { id: 'exec', col: 'calc', label: 'Execution services incl. contingency' },
  { id: 'contract', col: 'calc', label: 'Total project cost to client' },
  { id: 'deliver', col: 'calc', label: 'Our cost to deliver' },
  { id: 'profit', col: 'calc', label: 'Gross profit and margin' },
  { id: 'vat', col: 'calc', label: 'Import VAT estimate' },
  { id: 'schedule', col: 'calc', label: 'Weeks and months to first gold' },
  { id: 'cash', col: 'calc', label: 'Monthly receipts and outflow' },
  { id: 'output', col: 'calc', label: 'Monthly gold and revenue' },

  { id: 'sOverview', col: 'show', label: 'Overview tab' },
  { id: 'sBudget', col: 'show', label: 'Budget tab' },
  { id: 'sExpenses', col: 'show', label: 'Expenses: budget column' },
  { id: 'sSchedule', col: 'show', label: 'Schedule tab' },
  { id: 'sCash', col: 'show', label: 'Cashflow tab' },
  { id: 'sPlant', col: 'show', label: 'Plant tab' },
  { id: 'pPlants', col: 'show', label: 'Proposal: overview and plant chapters' },
  { id: 'pCompare', col: 'show', label: 'Proposal: comparison' },
  { id: 'pCosts', col: 'show', label: 'Proposal: project costs' },
  { id: 'pExec', col: 'show', label: 'Proposal: execution and schedule' },
  { id: 'pTeam', col: 'show', label: 'Proposal: project team' },
  { id: 'pShip', col: 'show', label: 'Proposal: shipping and sourcing' },
  { id: 'pProd', col: 'show', label: 'Proposal: production potential' },
  { id: 'pTerms', col: 'show', label: 'Proposal: commercial terms' },
  { id: 'web', col: 'show', label: 'Website page /alluvial-plant-proposal', manual: true },
]

const EDGES: [string, string][] = [
  ['equipCost', 'clientPrice'], ['equipCost', 'commissionAmt'], ['equipCost', 'reserveAmt'], ['equipCost', 'shipping'], ['equipCost', 'logistics'], ['equipCost', 'deliver'],
  ['imported', 'shipping'], ['imported', 'logistics'], ['imported', 'vat'], ['imported', 'pShip'], ['imported', 'pPlants'],
  ['flatRack', 'shipping'],
  ['equipText', 'pPlants'], ['equipText', 'pShip'], ['equipText', 'sBudget'],
  ['commission', 'clientPrice'], ['commission', 'commissionAmt'],
  ['reserve', 'reserveAmt'],
  ['contingency', 'exec'],
  ['markup', 'contract'],
  ['pmFee', 'engineering'], ['pmFee', 'cash'], ['pmFee', 'pTerms'],
  ['team', 'engineering'], ['team', 'pTeam'],
  ['shared', 'logistics'], ['shared', 'install'], ['shared', 'engineering'], ['shared', 'vat'],
  ['params', 'shipping'], ['params', 'install'], ['params', 'exec'],
  ['weeks', 'schedule'],
  ['timing', 'cash'],
  ['terms', 'cash'], ['terms', 'pTerms'],
  ['prod', 'output'],
  ['text', 'pPlants'], ['text', 'pCompare'], ['text', 'pCosts'], ['text', 'pExec'], ['text', 'pTeam'], ['text', 'pShip'], ['text', 'pProd'], ['text', 'pTerms'],

  ['clientPrice', 'contract'], ['clientPrice', 'vat'], ['clientPrice', 'pPlants'], ['clientPrice', 'pCompare'], ['clientPrice', 'sBudget'],
  ['commissionAmt', 'profit'], ['commissionAmt', 'sBudget'],
  ['reserveAmt', 'profit'], ['reserveAmt', 'sBudget'],
  ['shipping', 'logistics'], ['shipping', 'pShip'], ['shipping', 'sBudget'],
  ['logistics', 'exec'], ['logistics', 'vat'],
  ['install', 'exec'],
  ['engineering', 'exec'], ['engineering', 'cash'],
  ['exec', 'contract'], ['exec', 'deliver'], ['exec', 'pCosts'], ['exec', 'cash'], ['exec', 'sBudget'],
  ['contract', 'profit'], ['contract', 'cash'], ['contract', 'pCosts'],
  ['deliver', 'profit'], ['deliver', 'sExpenses'], ['deliver', 'sBudget'],
  ['profit', 'sOverview'],
  ['vat', 'sOverview'], ['vat', 'pCosts'],
  ['schedule', 'sSchedule'], ['schedule', 'sPlant'], ['schedule', 'pPlants'], ['schedule', 'pCompare'], ['schedule', 'pExec'], ['schedule', 'pShip'], ['schedule', 'web'],
  ['cash', 'sCash'],
  ['output', 'pProd'], ['output', 'sPlant'], ['output', 'pPlants'], ['output', 'web'],
  ['contract', 'sOverview'], ['clientPrice', 'sOverview'], ['deliver', 'sOverview'],
]

const COLS: { col: Col; title: string; lead: string }[] = [
  { col: 'input', title: 'You change', lead: 'Inputs and where to edit them' },
  { col: 'calc', title: 'It recalculates', lead: 'Worked out by the model' },
  { col: 'show', title: 'Where it shows', lead: 'Updated straight away' },
]

function reach(from: string, dir: 'down' | 'up') {
  const out = new Set<string>([from])
  const stack = [from]
  while (stack.length) {
    const n = stack.pop()!
    for (const [a, b] of EDGES) {
      const next = dir === 'down' ? (a === n ? b : null) : (b === n ? a : null)
      if (next && !out.has(next)) { out.add(next); stack.push(next) }
    }
  }
  return out
}

export function MapView() {
  const [sel, setSel] = useState<string | null>('imported')
  const lit = useMemo(() => (sel ? new Set([...reach(sel, 'down'), ...reach(sel, 'up')]) : null), [sel])
  const node = NODES.find(n => n.id === sel)
  const down = sel ? [...reach(sel, 'down')].filter(id => id !== sel) : []
  const named = (col: Col) => down.map(id => NODES.find(n => n.id === id)!).filter(n => n.col === col)

  return (
    <div className="page">
      <PageHead
        title="Map"
        lead="What each change updates. Click anything to see its chain: what feeds it, and everything it recalculates."
      />

      {node && (
        <div className="map-summary">
          <strong>{node.label}</strong>
          {node.where && <span className="muted"> ({node.where})</span>}
          {named('calc').length > 0 && <> recalculates: {named('calc').map(n => n.label).join(', ')}.</>}
          {named('show').length > 0 && <> It shows on: {named('show').map(n => n.label + (n.manual ? ' (by hand)' : '')).join(', ')}.</>}
          {node.col !== 'input' && down.length === 0 && <> This is where the result is shown.</>}
        </div>
      )}

      <div className="map">
        {COLS.map(c => (
          <div key={c.col} className="map-col">
            <h2>{c.title}</h2>
            <p className="muted">{c.lead}</p>
            {NODES.filter(n => n.col === c.col).map(n => (
              <button
                key={n.id}
                className={`map-node ${sel === n.id ? 'sel' : ''} ${lit && !lit.has(n.id) ? 'dim' : ''} ${n.manual ? 'manual' : ''}`}
                onClick={() => setSel(sel === n.id ? null : n.id)}
              >
                {n.label}
                {n.where && <span className="map-where">{n.where}</span>}
                {n.manual && <span className="map-where">Not automatic: update src/data/alluvial-plant.ts and deploy</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
