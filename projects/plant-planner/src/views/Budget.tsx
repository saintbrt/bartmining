import { CATEGORY_LABEL, num, pct, usd } from '../model'
import type { CostCategory, Inputs, PackageParams } from '../types'
import { Internal, Num, Section, Segmented, Text } from '../components/Fields'
import { useLocal } from '../store'
import { PageHead, usePackagePick, type ViewProps } from './shared'

type Sub = 'equipment' | 'execution' | 'team' | 'rates'

export function Budget(props: ViewProps) {
  const [sub, setSub] = useLocal<Sub>('budgetSub', 'equipment')
  const { pkg, index, picker } = usePackagePick(props.project)
  return (
    <div className="page">
      <PageHead
        title="Budget"
        lead="Edit supplier costs, quantities and rates. Totals, proposal prices and cashflow update as you type."
        right={sub === 'rates' ? undefined : picker}
      />
      <div className="subtabs">
        <Segmented<Sub>
          value={sub}
          onChange={setSub}
          options={[
            { value: 'equipment', label: 'Equipment' },
            { value: 'execution', label: 'Execution costs' },
            { value: 'team', label: 'Team' },
            { value: 'rates', label: 'Shared rates' },
          ]}
        />
      </div>
      {sub === 'equipment' && <Equipment {...props} pkgIndex={index} key={pkg.id} />}
      {sub === 'execution' && <Execution {...props} pkgIndex={index} key={pkg.id} />}
      {sub === 'team' && <Team {...props} pkgIndex={index} key={pkg.id} />}
      {sub === 'rates' && <Rates {...props} />}
    </div>
  )
}

type PkgProps = ViewProps & { pkgIndex: number }

function Equipment({ project, model, update, pkgIndex }: PkgProps) {
  const [clientView, setClientView] = useLocal('clientView', false)
  const pkg = project.packages[pkgIndex]
  const m = model.packages[pkgIndex]
  const set = (row: number, fn: (e: (typeof pkg.equipment)[number]) => void) =>
    update(p => fn(p.packages[pkgIndex].equipment[row]))

  return (
    <Section
      title={`${pkg.name} equipment`}
      aside={
        <label className="check">
          <input type="checkbox" checked={clientView} onChange={e => setClientView(e.target.checked)} />
          Client view (hide costs and commission)
        </label>
      }
    >
      <div className="table-wrap">
        <table className="grid edit">
          <thead>
            <tr>
              <th style={{ width: 110 }}>Tag</th>
              <th>Item</th>
              <th style={{ width: 70 }}>Qty</th>
              <th style={{ width: 100 }}>kW</th>
              <th style={{ width: 170 }}>Short name</th>
              <th className="c" style={{ width: 80 }}>Imported</th>
              <th className="c" style={{ width: 80 }}>Flat rack</th>
              {!clientView && <th className="n" style={{ width: 130 }}>Supplier cost <Internal /></th>}
              {!clientView && <th className="n">Commission</th>}
              <th className="n">Client price</th>
              {!clientView && <th className="n">Risk reserve</th>}
              {!clientView && <th style={{ minWidth: 200 }}>Price basis</th>}
              <th style={{ width: 70 }}>Optional</th>
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {pkg.equipment.map((e, r) => (
              <tr key={r}>
                <td><Text label="Tag" value={e.tag} onChange={v => set(r, x => { x.tag = v })} /></td>
                <td><Text label="Item" value={e.item} onChange={v => set(r, x => { x.item = v })} /></td>
                <td><Text label="Qty" value={e.qty} onChange={v => set(r, x => { x.qty = v })} /></td>
                <td><Text label="kW" value={e.kw} onChange={v => set(r, x => { x.kw = v })} /></td>
                <td><Text label="Short name" value={e.name ?? ''} placeholder={e.item.split(',')[0]} onChange={v => set(r, x => { x.name = v || undefined })} /></td>
                <td className="c">
                  <input type="checkbox" aria-label={`${e.tag} imported`} checked={(e.source ?? 'import') === 'import'}
                    onChange={ev => set(r, x => { x.source = ev.target.checked ? 'import' : 'local'; if (!ev.target.checked) x.oog = undefined })} />
                </td>
                <td className="c">
                  <input type="checkbox" aria-label={`${e.tag} flat rack`} disabled={(e.source ?? 'import') !== 'import'} checked={!!e.oog}
                    onChange={ev => set(r, x => { x.oog = ev.target.checked || undefined })} />
                </td>
                {!clientView && <td className="n"><Num label="Supplier cost" value={e.supplierCost} onChange={v => set(r, x => { x.supplierCost = v })} /></td>}
                {!clientView && <td className="n muted">{usd(m.lines[r].commission)}</td>}
                <td className="n">{usd(m.lines[r].client)}</td>
                {!clientView && <td className="n muted">{usd(m.lines[r].reserve)}</td>}
                {!clientView && <td><Text label="Price basis" value={e.basis} onChange={v => set(r, x => { x.basis = v })} /></td>}
                <td className="c"><input type="checkbox" aria-label="Optional" checked={!!e.optional} onChange={ev => set(r, x => { x.optional = ev.target.checked || undefined })} /></td>
                <td className="c">
                  <button className="icon" title="Remove line" onClick={() => {
                    if (confirm(`Remove ${e.tag || 'this line'}?`)) update(p => { p.packages[pkgIndex].equipment.splice(r, 1) })
                  }}>×</button>
                </td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={7}>Total</td>
              {!clientView && <td className="n">{usd(m.fob)}</td>}
              {!clientView && <td className="n">{usd(m.commission)}</td>}
              <td className="n">{usd(m.clientEquipment)}</td>
              {!clientView && <td className="n">{usd(m.reserve)}</td>}
              <td colSpan={clientView ? 2 : 3} />
            </tr>
          </tbody>
        </table>
      </div>
      <button className="btn ghost add" onClick={() => update(p => {
        p.packages[pkgIndex].equipment.push({ tag: '', item: '', qty: '1', kw: '-', supplierCost: 0, basis: 'Estimate', source: 'local' })
      })}>+ Add equipment line</button>
      <p className="hint">
        <strong>{m.importedLines} of {pkg.equipment.length} items imported</strong> ({usd(m.importFob)} supplier cost), shipping in{' '}
        {m.containers} × 40ft container{m.containers === 1 ? '' : 's'} and {m.oogUnits} flat rack{m.oogUnits === 1 ? '' : 's'}.
        Unticked items are bought in Tanzania. Freight, insurance, PVoC, clearing, trucking, import VAT, cashflow and the
        proposal all follow these ticks.
      </p>
      <p className="hint">
        Supplier cost is the line total: FOB for imported items, delivered to site for items bought in Tanzania.
        Client price = supplier cost × (1 + {pct(project.inputs.commission)} commission).
      </p>
    </Section>
  )
}

const PARAMS: { key: keyof PackageParams; label: string; money?: boolean }[] = [
  { key: 'containers', label: '40ft containers if every item were imported' },
  { key: 'installDays', label: 'OEM installation days' },
  { key: 'craneDayRate', label: 'Crane day rate', money: true },
  { key: 'craneDays', label: 'Crane days' },
  { key: 'craneMob', label: 'Crane mobilisation', money: true },
  { key: 'civils', label: 'Civil works allowance', money: true },
  { key: 'bulkSample', label: 'Bulk sample + metallurgical testing', money: true },
  { key: 'survey', label: 'Site survey & geotech', money: true },
  { key: 'inspection', label: 'Pre-shipment inspection', money: true },
  { key: 'factoryTrip', label: 'Factory inspection trip', money: true },
  { key: 'permits', label: 'Permits & environmental support', money: true },
  { key: 'commissioningConsumables', label: 'Commissioning consumables & fuel', money: true },
  { key: 'wearParts', label: 'First-year wear parts', money: true },
]

function Execution({ project, model, update, pkgIndex }: PkgProps) {
  const pkg = project.packages[pkgIndex]
  const m = model.packages[pkgIndex]
  const cats = [...new Set(m.exec.map(e => e.category))] as CostCategory[]
  return (
    <div className="two-col">
      <Section title="Quantities and allowances">
        <div className="form-list">
          {PARAMS.map(f => (
            <label key={f.key}>
              <span>{f.label}</span>
              <Num value={pkg.params[f.key]} onChange={v => update(p => { p.packages[pkgIndex].params[f.key] = v })} width={120} />
            </label>
          ))}
        </div>
        <p className="hint">
          Shipping now: {m.containers} × 40ft container{m.containers === 1 ? '' : 's'} and {m.oogUnits} flat rack{m.oogUnits === 1 ? '' : 's'},
          worked out from the items ticked Imported on the Equipment tab. Freight, port and crew rates are shared by every plant
          under Shared rates.
        </p>
      </Section>

      <Section title={`Cost to deliver, ${pkg.short}`}>
        <table className="grid">
          <tbody>
            {cats.map(c => (
              <CategoryRows key={c} title={CATEGORY_LABEL[c]} rows={m.exec.filter(e => e.category === c)} />
            ))}
            <tr className="total"><td>Subtotal execution</td><td className="n">{usd(m.execSubtotal)}</td></tr>
            <tr><td>Contingency ({pct(project.inputs.contingency)})</td><td className="n">{usd(m.contingency)}</td></tr>
            <tr className="total"><td>Total execution cost</td><td className="n">{usd(m.execTotal)}</td></tr>
            <tr><td>Equipment, supplier FOB</td><td className="n">{usd(m.fob)}</td></tr>
            <tr className="total strong"><td>Total cost to deliver</td><td className="n">{usd(m.deliverCost)}</td></tr>
          </tbody>
        </table>
      </Section>
    </div>
  )
}

function CategoryRows({ title, rows }: { title: string; rows: { id: string; label: string; amount: number; basis: string }[] }) {
  return (
    <>
      <tr className="group"><td colSpan={2}>{title}</td></tr>
      {rows.map(r => (
        <tr key={r.id}>
          <td>{r.label}<span className="cell-note">{r.basis}</span></td>
          <td className="n">{usd(r.amount)}</td>
        </tr>
      ))}
    </>
  )
}

function Team({ project, model, update, pkgIndex }: PkgProps) {
  const pkg = project.packages[pkgIndex]
  const t = model.packages[pkgIndex].team
  const months = pkg.cashflow.months
  return (
    <Section title={`Team allocation, ${pkg.short}`} aside={<span className="muted">1 = a full month. Rates are shared by every option.</span>}>
      <div className="table-wrap">
        <table className="grid edit">
          <thead>
            <tr>
              <th>Role</th>
              <th className="n">Rate / month or fee</th>
              {Array.from({ length: months }, (_, k) => <th key={k} className="n">M{k + 1}</th>)}
              <th className="n">Months</th>
              <th className="n">Cost</th>
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row, r) => (
              <tr key={row.role.id}>
                <td>{row.role.name}</td>
                <td className="n">
                  {row.role.onFee
                    ? <span className="flat"><Num label="Project management fee" value={project.inputs.pmFee} onChange={v => update(p => { p.inputs.pmFee = v })} width={90} /><span className="cell-note">project management fee</span></span>
                    : <Num label="Monthly rate" value={row.role.monthlyRate} onChange={v => update(p => { p.teamRoles[r].monthlyRate = v })} width={90} />}
                </td>
                {row.alloc.map((a, k) => (
                  <td key={k} className="n">
                    <Num label={`M${k + 1}`} value={a} width={56} onChange={v => update(p => {
                      const arr = p.packages[pkgIndex].team[row.role.id] ?? (p.packages[pkgIndex].team[row.role.id] = [])
                      while (arr.length < months) arr.push(0)
                      arr[k] = v
                    })} />
                  </td>
                ))}
                <td className="n">{num(row.months, 2)}</td>
                <td className="n">{usd(row.cost)}</td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={2}>Team cost per month</td>
              {t.monthlyCost.map((c, k) => <td key={k} className="n">{usd(c)}</td>)}
              <td />
              <td className="n">{usd(t.cost)}</td>
            </tr>
            <tr>
              <td colSpan={2}>Travel & site accommodation</td>
              {t.monthlyTravel.map((c, k) => <td key={k} className="n muted">{usd(c)}</td>)}
              <td />
              <td className="n">{usd(t.travel)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  )
}

type InputKey = { [K in keyof Inputs]: Inputs[K] extends number ? K : never }[keyof Inputs]
const RATE_GROUPS: { title: string; fields: { key: InputKey; label: string; percent?: boolean; note?: string }[] }[] = [
  {
    title: 'Commercial',
    fields: [
      { key: 'commission', label: 'Commission on equipment', percent: true, note: 'Internal. Added on top of supplier FOB.' },
      { key: 'riskReserve', label: 'Equipment price-risk reserve', percent: true, note: 'Internal. Tracked, not charged.' },
      { key: 'contingency', label: 'Execution contingency', percent: true },
      { key: 'servicesMarkup', label: 'Markup on services billed to client', percent: true },
    ],
  },
  {
    title: 'Logistics, China to Mbeya',
    fields: [
      { key: 'oceanFreightPer40', label: 'Ocean freight per 40ft HC' },
      { key: 'oogPremiumPerUnit', label: 'Flat rack / OOG premium per unit' },
      { key: 'originFeePerUnit', label: 'Origin port & loading per unit' },
      { key: 'insuranceRate', label: 'Marine insurance', percent: true },
      { key: 'pvocRate', label: 'PVoC fee (of FOB)', percent: true },
      { key: 'pvocMin', label: 'PVoC minimum per shipment' },
      { key: 'pvocMax', label: 'PVoC maximum per shipment' },
      { key: 'portPerUnit', label: 'Dar port + clearance per unit' },
      { key: 'agencyFee', label: 'Clearing & forwarding agency fee' },
      { key: 'inlandPer40', label: 'Trucking Dar to Mbeya per 40ft' },
      { key: 'lowbedPerUnit', label: 'Lowbed Dar to Mbeya per OOG unit' },
      { key: 'importDuty', label: 'Import duty (licensed miner)', percent: true },
      { key: 'importVat', label: 'Import VAT (client-borne)', percent: true },
    ],
  },
  {
    title: 'OEM installation crew',
    fields: [
      { key: 'crewSize', label: 'Crew size (persons)' },
      { key: 'crewDayRate', label: 'Day rate per person' },
      { key: 'crewFlight', label: 'Return flight per person' },
      { key: 'crewVisa', label: 'Visa & work permit per person' },
      { key: 'crewLivingPerDay', label: 'Accommodation & food per day' },
      { key: 'travelPerEngMonth', label: 'Team travel per engineer-month' },
    ],
  },
]

function Rates({ project, update }: ViewProps) {
  const i = project.inputs
  const pr = project.production
  const terms = (which: 'supplierTerms' | 'clientTerms', title: string, labels: Record<'deposit' | 'bl' | 'final', string>) => {
    const total = i[which].deposit + i[which].bl + i[which].final
    const off = Math.abs(total - 1) > 1e-6
    return (
      <div className="form-list">
        <h3>{title}</h3>
        {which === 'clientTerms' && (
          <label>
            <span>On signing: project management fee (USD)</span>
            <Num label="Project management fee" value={i.pmFee} onChange={v => update(p => { p.inputs.pmFee = v })} width={90} />
          </label>
        )}
        {(['deposit', 'bl', 'final'] as const).map(k => (
          <label key={k}>
            <span>{labels[k]}</span>
            <Num percent value={i[which][k]} onChange={v => update(p => { p.inputs[which][k] = v })} width={90} />
          </label>
        ))}
        <p className={off ? 'warn' : 'hint'}>
          {off ? `These add up to ${Math.round(total * 100)}%. They must add up to 100%.` : 'Adds up to 100%.'}
        </p>
      </div>
    )
  }
  return (
    <>
      <div className="three-col">
        {RATE_GROUPS.map(g => (
          <Section key={g.title} title={g.title}>
            <div className="form-list">
              {g.fields.map(f => (
                <label key={f.key} title={f.note}>
                  <span>{f.label}{f.note && <span className="cell-note">{f.note}</span>}</span>
                  <Num percent={f.percent} value={i[f.key]} onChange={v => update(p => { p.inputs[f.key] = v })} width={100} />
                </label>
              ))}
            </div>
          </Section>
        ))}
      </div>
      <div className="three-col">
        <Section title="Payment terms">
          {terms('clientTerms', 'Client pays us (% of the balance after the fee)', { deposit: 'On scope confirmation', bl: 'Against bill of lading', final: 'After commissioning' })}
          {terms('supplierTerms', 'We pay the supplier', { deposit: 'On order', bl: 'Against bill of lading', final: 'After commissioning' })}
        </Section>
        <Section title="Production assumptions">
          <div className="form-list">
            <label><span>Gold price per gram (USD)</span><Num value={pr.goldPricePerGram} onChange={v => update(p => { p.production.goldPricePerGram = v })} width={100} /></label>
            <label><span>Price date</span><input className="text-field" type="date" value={pr.priceDate} onChange={e => update(p => { p.production.priceDate = e.target.value })} style={{ width: 150 }} /></label>
            <label><span>Recovery</span><Num percent value={pr.recovery} onChange={v => update(p => { p.production.recovery = v })} width={100} /></label>
            <label><span>Operating hours per day</span><Num value={pr.hoursPerDay} onChange={v => update(p => { p.production.hoursPerDay = v })} width={100} /></label>
            <label><span>Operating days per month</span><Num value={pr.daysPerMonth} onChange={v => update(p => { p.production.daysPerMonth = v })} width={100} /></label>
            <label>
              <span>Illustrative grades (g/m³, comma separated)</span>
              <Text value={pr.grades.join(', ')} onChange={v => update(p => {
                p.production.grades = v.split(',').map(s => Number(s.trim())).filter(n => Number.isFinite(n) && n > 0)
              })} />
            </label>
          </div>
        </Section>
        <Section title="Proposal details">
          <div className="form-list">
            <label><span>Project name</span><Text value={project.meta.name} onChange={v => update(p => { p.meta.name = v })} /></label>
            <label><span>Client</span><Text value={project.meta.client} placeholder="Client name" onChange={v => update(p => { p.meta.client = v })} /></label>
            <label><span>Site</span><Text value={project.meta.site} onChange={v => update(p => { p.meta.site = v })} /></label>
            <label><span>Proposal date</span><input className="text-field" type="date" value={project.meta.date} onChange={e => update(p => { p.meta.date = e.target.value })} style={{ width: 150 }} /></label>
            <label><span>Validity (days)</span><Num value={project.meta.validityDays} onChange={v => update(p => { p.meta.validityDays = v })} width={100} /></label>
            <label><span>Prepared by</span><Text value={project.meta.preparedBy} onChange={v => update(p => { p.meta.preparedBy = v })} /></label>
          </div>
        </Section>
      </div>
    </>
  )
}
