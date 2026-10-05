import { CATEGORY_LABEL, pct, usd, type ScopeTotals } from '../model'
import type { CostCategory } from '../types'
import { Internal, Num, Section } from '../components/Fields'
import { PageHead, type ViewProps } from './shared'

const ROWS: { label: string; get: (s: ScopeTotals) => string; internal?: boolean; strong?: boolean; note?: string }[] = [
  { label: 'Equipment supplier cost', get: s => usd(s.fob), internal: true },
  { label: 'Commission on equipment', get: s => usd(s.commission), internal: true },
  { label: 'Client equipment price', get: s => usd(s.clientEquipment), strong: true, note: 'Shown in the proposal' },
  { label: 'Execution costs incl. contingency', get: s => usd(s.execTotal) },
  { label: 'Total cost to deliver', get: s => usd(s.deliverCost), strong: true },
  { label: 'Execution services billed to client', get: s => usd(s.servicesBilled) },
  { label: 'Client contract value', get: s => usd(s.contract), strong: true },
  { label: 'Gross profit', get: s => usd(s.grossProfit), internal: true, strong: true },
  { label: 'Gross margin', get: s => pct(s.margin, 1), internal: true },
  { label: 'Price-risk reserve', get: s => usd(s.reserve), internal: true },
  { label: 'Profit after worst-case price movement', get: s => usd(s.profitAfterRisk), internal: true },
  { label: 'Client-borne import VAT', get: s => usd(s.importVat), note: 'Information only' },
]

const CATS: CostCategory[] = ['equipment', 'logistics', 'installation', 'civils', 'engineering', 'qa', 'commissioning', 'contingency']

export function Overview({ project, model, update }: ViewProps) {
  const i = project.inputs
  return (
    <div className="page">
      <PageHead
        title={project.meta.name}
        lead={`${project.meta.site}. Every number here recalculates from the Budget tab.`}
        right={<Internal>Internal: contains commission</Internal>}
      />

      <Section title="Commercial levers">
        <div className="levers">
          <label>Project management fee (USD) <Num label="Project management fee" value={i.pmFee} onChange={v => update(p => { p.inputs.pmFee = v })} width={100} /></label>
          <label>Commission on equipment <Num percent value={i.commission} onChange={v => update(p => { p.inputs.commission = v })} width={90} /></label>
          <label>Price-risk reserve <Num percent value={i.riskReserve} onChange={v => update(p => { p.inputs.riskReserve = v })} width={90} /></label>
          <label>Execution contingency <Num percent value={i.contingency} onChange={v => update(p => { p.inputs.contingency = v })} width={90} /></label>
          <label>Markup on services <Num percent value={i.servicesMarkup} onChange={v => update(p => { p.inputs.servicesMarkup = v })} width={90} /></label>
        </div>
        {i.servicesMarkup === 0 && <p className="hint">Services are billed at cost, so gross profit equals the equipment commission.</p>}
      </Section>

      <Section title="Summary by option">
        <div className="table-wrap">
          <table className="grid">
            <thead>
              <tr><th>USD</th>{model.scopes.map(s => <th key={s.id} className="n">{s.name}</th>)}</tr>
            </thead>
            <tbody>
              {ROWS.map(r => (
                <tr key={r.label} className={r.strong ? 'strong' : ''}>
                  <td>
                    {r.label}
                    {r.internal && <Internal />}
                    {r.note && <span className="cell-note">{r.note}</span>}
                  </td>
                  {model.scopes.map(s => <td key={s.id} className="n">{r.get(s)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Cost to deliver, by category">
        <div className="table-wrap">
          <table className="grid">
            <thead>
              <tr><th>Category</th>{model.scopes.map(s => <th key={s.id} className="n">{s.name}</th>)}</tr>
            </thead>
            <tbody>
              {CATS.map(c => (
                <tr key={c}>
                  <td>{CATEGORY_LABEL[c]}</td>
                  {model.scopes.map(s => (
                    <td key={s.id} className="n">
                      {usd(s.byCategory[c])}
                      <span className="share">{pct(s.byCategory[c] / s.deliverCost)}</span>
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="total">
                <td>Total</td>
                {model.scopes.map(s => <td key={s.id} className="n">{usd(s.deliverCost)}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}
