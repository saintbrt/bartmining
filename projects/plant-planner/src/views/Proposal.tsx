import { useState, type ReactNode } from 'react'
import { aboutMonths, CATEGORY_LABEL, num, pct, production, usd, type ProjectModel } from '../model'
import type { CostCategory, Package, Project, ProposalDetail, ProposalText } from '../types'
import { FLOW_STEPS, FlowControls, FlowDiagram, useFlowPlayer } from '../components/FlowDiagram'
import { Area } from '../components/Fields'
import { IMAGES, IMAGE_KEYS, imageLabel } from '../images'
import type { ViewProps } from './shared'

/**
 * Everything the client document is allowed to know. The document renders
 * from this only, so supplier cost, commission, reserve and margin can't
 * reach the PDF. Execution services appear at the price billed to the client.
 */
interface ClientOption {
  pkg: Package
  price: number
  lines: { tag: string; item: string; name: string; qty: string; kw: string; price: number; optional?: boolean; source: 'local' | 'import'; oog: boolean }[]
  services: { category: CostCategory; amount: number }[]
  servicesTotal: number
  projectTotal: number
  importDuty: number
  importVat: number
  containers: number
  oogUnits: number
  monthlyM3: number
  monthsToGold: number
  weeksToGold: number
  schedule: { id: string; label: string; weeks: number; start: number; end: number }[]
  team: { id: string; name: string; duties: string; months: number }[]
  output: { grade: number; grams: number; value: number }[]
}

const SERVICE_CATEGORIES: CostCategory[] = ['logistics', 'installation', 'civils', 'engineering', 'qa', 'commissioning', 'contingency']
const SERVICE_LABEL: Partial<Record<CostCategory, string>> = {
  logistics: 'Shipping, insurance, clearing and trucking to site',
  installation: 'Installation crew and crane',
  civils: 'Civil works: pad, foundations, lined ponds',
  engineering: 'Engineering and project management',
  qa: 'Testing, inspection and permits',
  commissioning: 'Commissioning and first-year wear parts',
  contingency: 'Contingency',
}

function clientOption(project: Project, model: ProjectModel, id: string): ClientOption | null {
  const m = model.byId.get(id)
  if (!m) return null
  const out = production(project, m.pkg.capacity)
  const k = 1 + project.inputs.servicesMarkup
  return {
    pkg: m.pkg,
    price: m.clientEquipment,
    lines: m.pkg.equipment.map((e, i) => ({ tag: e.tag, item: e.item, name: e.name || e.item.split(',')[0], qty: e.qty, kw: e.kw, price: m.lines[i].client, optional: e.optional, source: e.source ?? 'import', oog: !!e.oog })),
    services: SERVICE_CATEGORIES.map(c => ({ category: c, amount: m.byCategory[c] * k })),
    servicesTotal: m.servicesBilled,
    projectTotal: m.contract,
    importDuty: m.importDuty,
    importVat: m.importVat,
    containers: m.containers,
    oogUnits: m.oogUnits,
    monthlyM3: out.m3,
    monthsToGold: m.monthsToGold,
    weeksToGold: m.weeksToGold,
    schedule: m.schedule.map(t => ({ id: t.id, label: t.label, weeks: t.weeks, start: t.start, end: t.end })),
    team: m.team.rows.filter(r => r.months > 0).map(r => ({ id: r.role.id, name: r.role.name, duties: r.role.duties ?? '', months: r.months })),
    output: out.rows,
  }
}

interface ChapterDef { id: string; title: string }

function chapterList(options: ClientOption[]): ChapterDef[] {
  return [
    { id: 'overview', title: 'Project overview' },
    ...options.map(o => ({ id: `option:${o.pkg.id}`, title: o.pkg.name })),
    { id: 'comparison', title: 'Comparing the options' },
    { id: 'costs', title: 'Project costs' },
    { id: 'execution', title: 'Execution and schedule' },
    { id: 'team', title: 'Project team' },
    { id: 'shipping', title: 'Shipping and logistics' },
    { id: 'production', title: 'Production potential' },
    { id: 'terms', title: 'Commercial terms' },
    { id: 'nextSteps', title: 'Next steps' },
  ]
}

const DETAILS: { key: keyof ProposalDetail; label: string }[] = [
  { key: 'equipmentPrices', label: 'Prices in equipment lists' },
  { key: 'equipmentPhotos', label: 'Equipment photos' },
  { key: 'costBreakdown', label: 'Cost breakdown by category' },
  { key: 'importTaxes', label: 'Import VAT estimate' },
  { key: 'teamMonths', label: 'Team months per option' },
  { key: 'images', label: 'Chapter images' },
]

export function Proposal({ project, model, update, onExport }: ViewProps & { onExport: () => void }) {
  const [edit, setEdit] = useState(false)
  const tx = project.proposal
  const options = tx.packageIds.map(id => clientOption(project, model, id)).filter((o): o is ClientOption => !!o)
  const expansion = tx.expansionId ? clientOption(project, model, tx.expansionId) : null
  const standalone = project.packages.filter(p => !p.isExpansion)
  const chapters = chapterList(options)
  const detail = tx.detail

  return (
    <div className="proposal-layout">
      <aside className="proposal-tools no-print">
        <button className="btn primary block" onClick={onExport}>Export PDF</button>
        <p className="hint">Opens the print dialog. Choose Save as PDF, paper size A4, and turn off headers and footers.</p>

        <label className="check"><input type="checkbox" checked={edit} onChange={e => setEdit(e.target.checked)} /> Edit text</label>

        <div className="tool-group">
          <h3>Options</h3>
          {standalone.map(p => (
            <label className="check" key={p.id}>
              <input
                type="checkbox"
                checked={tx.packageIds.includes(p.id)}
                onChange={e => update(d => {
                  const ids = d.proposal.packageIds.filter(x => x !== p.id)
                  if (e.target.checked) ids.push(p.id)
                  d.proposal.packageIds = standalone.map(s => s.id).filter(x => ids.includes(x))
                })}
              />
              {p.name}
            </label>
          ))}
        </div>

        <div className="tool-group">
          <h3>Chapters</h3>
          {chapters.map(c => (
            <label className="check" key={c.id}>
              <input type="checkbox" checked={tx.show[c.id] !== false} onChange={e => update(d => { d.proposal.show[c.id] = e.target.checked })} />
              {c.title}
            </label>
          ))}
        </div>

        <div className="tool-group">
          <h3>Show</h3>
          {DETAILS.map(x => (
            <label className="check" key={x.key}>
              <input type="checkbox" checked={detail[x.key]} onChange={e => update(d => { d.proposal.detail[x.key] = e.target.checked })} />
              {x.label}
            </label>
          ))}
        </div>

        {detail.images && (
          <div className="tool-group">
            <h3>Images</h3>
            {[{ id: 'cover', title: 'Cover' }, ...chapters].map(c => (
              <label className="pick" key={c.id}>
                <span>{c.title}</span>
                <select value={tx.images[c.id] ?? ''} onChange={e => update(d => { d.proposal.images[c.id] = e.target.value })}>
                  <option value="">None</option>
                  {IMAGE_KEYS.map(k => <option key={k} value={k}>{imageLabel(k)}</option>)}
                </select>
              </label>
            ))}
          </div>
        )}

        <p className="hint safe">Client prices only. Supplier costs, commission and margin are never in this document.</p>
      </aside>

      <Document project={project} options={options} expansion={expansion} chapters={chapters} edit={edit} update={update} />
    </div>
  )
}

function Document({ project, options, expansion, chapters, edit, update }: {
  project: Project
  options: ClientOption[]
  expansion: ClientOption | null
  chapters: ChapterDef[]
  edit: boolean
  update: ViewProps['update']
}) {
  const tx = project.proposal
  const meta = project.meta
  const detail = tx.detail
  const on = (id: string) => tx.show[id] !== false
  const setTx = <K extends keyof ProposalText>(k: K) => (v: ProposalText[K]) => update(d => { d.proposal[k] = v })
  const setPkg = (id: string, fn: (p: Package) => void) => update(d => { const p = d.packages.find(x => x.id === id); if (p) fn(p) })
  const base = options.find(o => o.pkg.id === tx.expansionBaseId)
  const full = options.find(o => o.pkg.id !== tx.expansionBaseId)
  const multi = options.length > 1
  const n = (o: ClientOption) => o.pkg.short
  const img = (id: string) => (detail.images ? IMAGES[tx.images[id] ?? ''] : undefined)

  // Chapters are numbered by position, so switching one off renumbers the rest.
  const visible = chapters.filter(c => on(c.id)).map((c, k) => ({ ...c, no: k + 1 }))
  const no = (id: string) => visible.find(c => c.id === id)?.no ?? 0

  // A scope column for the modular route (base option + its expansion).
  const modular = expansion && base ? {
    label: `${n(base)} + ${expansion.pkg.short}`,
    price: base.price + expansion.price,
    services: SERVICE_CATEGORIES.map((c, i) => ({ category: c, amount: base.services[i].amount + expansion.services[i].amount })),
    servicesTotal: base.servicesTotal + expansion.servicesTotal,
    projectTotal: base.projectTotal + expansion.projectTotal,
    importDuty: base.importDuty + expansion.importDuty,
    importVat: base.importVat + expansion.importVat,
  } : null
  const costCols = [
    ...options.map(o => ({ label: n(o), price: o.price, services: o.services, servicesTotal: o.servicesTotal, projectTotal: o.projectTotal, importDuty: o.importDuty, importVat: o.importVat })),
    ...(modular ? [modular] : []),
  ]

  return (
    <article className="doc">
      <header className="doc-cover">
        <div className="doc-brand">Bart Mining</div>
        {img('cover') && <img className="doc-cover-image" src={img('cover')} alt="" />}
        <T edit={edit} value={tx.kicker} onChange={setTx('kicker')} className="doc-kicker" />
        <T edit={edit} value={tx.title} onChange={setTx('title')} as="h1" />
        <dl className="doc-meta">
          {meta.client && <div><dt>Client</dt><dd>{meta.client}</dd></div>}
          <div><dt>Site</dt><dd>{meta.site}</dd></div>
          <div><dt>Date</dt><dd>{longDate(meta.date)}</dd></div>
          <div><dt>Valid until</dt><dd>{longDate(addDays(meta.date, meta.validityDays))}</dd></div>
          {meta.preparedBy && <div><dt>Prepared by</dt><dd>{meta.preparedBy}</dd></div>}
        </dl>
        <T edit={edit} value={tx.intro} onChange={setTx('intro')} as="p" className="doc-intro" />
        <nav className="doc-contents" aria-label="Contents">
          <h2>Contents</h2>
          <ol>{visible.map(c => <li key={c.id}><span className="doc-contents-no">{c.no}</span>{c.title}</li>)}</ol>
        </nav>
      </header>

      {on('overview') && (
        <Chapter no={no('overview')} title="Project overview" image={img('overview')}>
          <Sec no={`${no('overview')}.1`} title="The project">
            <T edit={edit} value={tx.overview} onChange={setTx('overview')} as="p" />
          </Sec>
          {base && (
            <Sec no={`${no('overview')}.2`} title="Where sampling is limited: a modular start">
              <T edit={edit} value={tx.alternative} onChange={setTx('alternative')} as="p" />
            </Sec>
          )}
          <Sec no={`${no('overview')}.${base ? 3 : 2}`} title={multi ? 'The options at a glance' : 'The plant at a glance'}>
            <table className="doc-table">
              <thead><tr><th>Option</th><th>Capacity</th><th>Approach</th><th>First gold</th>{detail.equipmentPrices && <th className="n">Equipment</th>}</tr></thead>
              <tbody>
                {options.map(o => (
                  <tr key={o.pkg.id}>
                    <td className="strong">{o.pkg.name}</td>
                    <td>{o.pkg.capacity} m³/h</td>
                    <td><T edit={edit} value={o.pkg.summary} onChange={v => setPkg(o.pkg.id, p => { p.summary = v })} as="span" /></td>
                    <td>{aboutMonths(o.monthsToGold)}</td>
                    {detail.equipmentPrices && <td className="n">{usd(o.price)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </Sec>
        </Chapter>
      )}

      {options.map(o => on(`option:${o.pkg.id}`) && (
        <OptionChapter
          key={o.pkg.id}
          no={no(`option:${o.pkg.id}`)}
          o={o}
          image={img(`option:${o.pkg.id}`)}
          detail={detail}
          photos={tx.equipmentPhotos}
          expansion={o === base ? expansion : null}
          full={o === base ? full : undefined}
          edit={edit}
          setPkg={setPkg}
          tradeoff={<T edit={edit} value={tx.tradeoff} onChange={setTx('tradeoff')} as="p" />}
        />
      ))}

      {on('comparison') && multi && (
        <Chapter no={no('comparison')} title="Comparing the options" image={img('comparison')}>
          <Sec no={`${no('comparison')}.1`} title="Side by side">
            <p>Both options use the same flowsheet. They differ in scale and in how the investment is staged.</p>
            <table className="doc-table">
              <thead><tr><th />{options.map(o => <th key={o.pkg.id}>{n(o)}</th>)}</tr></thead>
              <tbody>
                {specLabels(options).map(label => (
                  <tr key={label}>
                    <td>{label}</td>
                    {options.map(o => <td key={o.pkg.id}>{o.pkg.specs.find(s => s.label === label)?.value ?? '–'}</td>)}
                  </tr>
                ))}
                <tr><td>Processed per month</td>{options.map(o => <td key={o.pkg.id}>{num(o.monthlyM3)} m³</td>)}</tr>
                <tr><td>Time to first gold</td>{options.map(o => <td key={o.pkg.id}>{aboutMonths(o.monthsToGold)}</td>)}</tr>
                {expansion && base && full && (
                  <tr><td>Path to {full.pkg.capacity} m³/h</td>{options.map(o => <td key={o.pkg.id}>{o === base ? `Add ${expansion.pkg.name}` : o.pkg.capacity >= full.pkg.capacity ? 'Built in one project' : '–'}</td>)}</tr>
                )}
                {detail.equipmentPrices && <tr className="total"><td>Equipment package</td>{options.map(o => <td key={o.pkg.id}>{usd(o.price)}</td>)}</tr>}
              </tbody>
            </table>
          </Sec>
          <Sec no={`${no('comparison')}.2`} title="Which option fits your project">
            <div className="two">
              {options.map(o => (
                <div key={o.pkg.id}>
                  <h3>The {n(o)} is the better fit if</h3>
                  <L edit={edit} items={o.pkg.fitIf} onChange={v => setPkg(o.pkg.id, p => { p.fitIf = v })} />
                </div>
              ))}
            </div>
          </Sec>
        </Chapter>
      )}

      {on('costs') && options.length > 0 && (
        <Chapter no={no('costs')} title="Project costs" image={img('costs')}>
          <T edit={edit} value={tx.costsIntro} onChange={setTx('costsIntro')} as="p" />
          <Sec no={`${no('costs')}.1`} title="Cost of a working plant on site">
            <table className="doc-table">
              <thead><tr><th>USD</th>{costCols.map(c => <th key={c.label} className="n">{c.label}</th>)}</tr></thead>
              <tbody>
                <tr><td>Equipment package</td>{costCols.map(c => <td key={c.label} className="n">{usd(c.price)}</td>)}</tr>
                {detail.costBreakdown
                  ? SERVICE_CATEGORIES.map((cat, i) => (
                      <tr key={cat}><td>{SERVICE_LABEL[cat] ?? CATEGORY_LABEL[cat]}</td>{costCols.map(c => <td key={c.label} className="n">{usd(c.services[i].amount)}</td>)}</tr>
                    ))
                  : <tr><td>Execution services (shipping, installation, civils, engineering, commissioning)</td>{costCols.map(c => <td key={c.label} className="n">{usd(c.servicesTotal)}</td>)}</tr>}
                <tr className="total"><td>Total project cost</td>{costCols.map(c => <td key={c.label} className="n">{usd(c.projectTotal)}</td>)}</tr>
              </tbody>
            </table>
            <p className="small">
              Contingency is {pct(project.inputs.contingency)} of the execution services, for unknowns found during delivery.
              {modular && ` The ${modular.label} column is the full modular route to ${base!.pkg.capacity + expansion!.pkg.capacity} m³/h.`}
            </p>
          </Sec>
          {detail.importTaxes && (
            <Sec no={`${no('costs')}.2`} title="Import taxes, paid by the client">
              <table className="doc-table keep">
                <thead><tr><th>USD</th>{costCols.map(c => <th key={c.label} className="n">{c.label}</th>)}</tr></thead>
                <tbody>
                  <tr><td>Import duty ({pct(project.inputs.importDuty)} for a licensed mining company)</td>{costCols.map(c => <td key={c.label} className="n">{usd(c.importDuty)}</td>)}</tr>
                  <tr><td>Import VAT ({pct(project.inputs.importVat)}, estimate)</td>{costCols.map(c => <td key={c.label} className="n">{usd(c.importVat)}</td>)}</tr>
                </tbody>
              </table>
              <p className="small">VAT is calculated on the customs value (equipment, freight and insurance). Relief may be available under a mining framework agreement. These amounts are not part of the project cost above.</p>
            </Sec>
          )}
        </Chapter>
      )}

      {on('execution') && options.length > 0 && (
        <Chapter no={no('execution')} title="Execution and schedule" image={img('execution')}>
          <T edit={edit} value={tx.executionIntro} onChange={setTx('executionIntro')} as="p" />
          <Sec no={`${no('execution')}.1`} title="Delivery stages">
            <table className="doc-table">
              <thead><tr><th>Stage</th>{options.map(o => <th key={o.pkg.id}>{n(o)}</th>)}</tr></thead>
              <tbody>
                {stageRows(options).map(r => (
                  <tr key={r.id}>
                    <td>{r.label}</td>
                    {options.map(o => {
                      const t = o.schedule.find(x => x.id === r.id)
                      return <td key={o.pkg.id}>{t ? weeks(t.weeks) : '–'}</td>
                    })}
                  </tr>
                ))}
                <tr className="total"><td>Total to first gold</td>{options.map(o => <td key={o.pkg.id}>{aboutMonths(o.monthsToGold)}</td>)}</tr>
              </tbody>
            </table>
            <T edit={edit} value={tx.scheduleNote} onChange={setTx('scheduleNote')} as="p" className="small" />
            <T edit={edit} value={tx.commissioningNote} onChange={setTx('commissioningNote')} as="p" className="small" />
          </Sec>
          {options.map((o, k) => (
            <Sec key={o.pkg.id} no={`${no('execution')}.${k + 2}`} title={`Timeline, ${o.pkg.name}`}>
              <Gantt o={o} />
            </Sec>
          ))}
        </Chapter>
      )}

      {on('team') && options.length > 0 && (
        <Chapter no={no('team')} title="Project team" image={img('team')}>
          <T edit={edit} value={tx.teamIntro} onChange={setTx('teamIntro')} as="p" />
          <Sec no={`${no('team')}.1`} title="Roles and responsibilities">
            <table className="doc-table">
              <thead>
                <tr><th>Role</th><th>Responsibilities</th>{detail.teamMonths && options.map(o => <th key={o.pkg.id} className="n">{n(o)}</th>)}</tr>
              </thead>
              <tbody>
                {project.teamRoles.map(r => (
                  <tr key={r.id}>
                    <td className="strong">{r.name}</td>
                    <td>
                      {edit
                        ? <Area value={r.duties ?? ''} onChange={v => update(d => { const x = d.teamRoles.find(y => y.id === r.id); if (x) x.duties = v })} />
                        : r.duties}
                    </td>
                    {detail.teamMonths && options.map(o => {
                      const t = o.team.find(x => x.id === r.id)
                      return <td key={o.pkg.id} className="n">{t ? `${num(t.months, t.months % 1 ? 1 : 0)} mo` : '–'}</td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {detail.teamMonths && <p className="small">Months are the total time each role is assigned to the project, including part-time months.</p>}
          </Sec>
        </Chapter>
      )}

      {on('shipping') && options.length > 0 && (
        <Chapter no={no('shipping')} title="Shipping and logistics" image={img('shipping')}>
          <T edit={edit} value={tx.shippingIntro} onChange={setTx('shippingIntro')} as="p" />
          <Sec no={`${no('shipping')}.1`} title="Where the equipment comes from">
            <div className="two">
              <div><h3>Sourced in Tanzania</h3><ul>{sourceList(options, 'local').map(x => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>Imported or through local partners</h3><ul>{sourceList(options, 'import').map(x => <li key={x}>{x}</li>)}</ul></div>
            </div>
          </Sec>
          <Sec no={`${no('shipping')}.2`} title="Route for imported equipment">
            <table className="doc-table">
              <thead><tr><th>Leg</th><th>From – to</th>{options.map(o => <th key={o.pkg.id}>{n(o)}</th>)}</tr></thead>
              <tbody>
                {SHIPPING_LEGS.map(leg => (
                  <tr key={leg.id}>
                    <td className="strong">{leg.title}</td>
                    <td>{leg.route}</td>
                    {options.map(o => {
                      const t = o.schedule.find(x => x.id === leg.id)
                      return <td key={o.pkg.id}>{t ? weeks(t.weeks) : '–'}</td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Sec>
          <Sec no={`${no('shipping')}.3`} title="Shipment size">
            <table className="doc-table">
              <thead><tr><th />{options.map(o => <th key={o.pkg.id}>{n(o)}</th>)}{expansion && base && <th>{expansion.pkg.short}</th>}</tr></thead>
              <tbody>
                <tr><td>40 ft high-cube containers</td>{options.map(o => <td key={o.pkg.id}>{o.containers}</td>)}{expansion && base && <td>{expansion.containers}</td>}</tr>
                <tr><td>Flat rack, out of gauge ({oogNames(options, expansion).join(', ').toLowerCase() || 'none'})</td>{options.map(o => <td key={o.pkg.id}>{o.oogUnits}</td>)}{expansion && base && <td>{expansion.oogUnits}</td>}</tr>
              </tbody>
            </table>
            <p className="small">Only imported equipment ships. Container counts are estimates and are confirmed by the packing list once the equipment is built.</p>
          </Sec>
          <Sec no={`${no('shipping')}.4`} title="Customs and compliance">
            <ul>
              <li>Pre-shipment inspection and factory acceptance test before the equipment leaves China.</li>
              <li>PVoC certificate of conformity, required for import into Tanzania.</li>
              <li>Import duty exemption applies to plant imported by a licensed mining company.{detail.importTaxes && no('costs') ? ` Import VAT estimates are in chapter ${no('costs')}.` : ''}</li>
              <li>Marine cargo insurance from the supplier to Dar es Salaam, extendable to the site.</li>
            </ul>
          </Sec>
        </Chapter>
      )}

      {on('production') && options.length > 0 && (
        <Chapter no={no('production')} title="Production potential" image={img('production')}>
          <Sec no={`${no('production')}.1`} title="Illustrative monthly output">
            <table className="doc-table">
              <thead>
                <tr><th>Head grade</th>{options.map(o => <th key={o.pkg.id} colSpan={2}>{n(o)}</th>)}</tr>
                <tr className="sub"><th />{options.map(o => [<th key={`${o.pkg.id}g`}>Gold / month</th>, <th key={`${o.pkg.id}v`}>Gross value</th>])}</tr>
              </thead>
              <tbody>
                {project.production.grades.map((g, k) => (
                  <tr key={g}>
                    <td>{g} g/m³</td>
                    {options.map(o => [
                      <td key={`${o.pkg.id}g`}>{num(o.output[k]?.grams ?? 0)} g</td>,
                      <td key={`${o.pkg.id}v`}>{usd(o.output[k]?.value ?? 0)}</td>,
                    ])}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small">
              Monthly m³ × grade × {pct(project.production.recovery)} recovery, at {project.production.hoursPerDay} hours a day and {project.production.daysPerMonth} days a month,
              valued at the {longDate(project.production.priceDate)} gold price of ${project.production.goldPricePerGram.toFixed(2)} per gram.{' '}
              <T edit={edit} value={tx.productionNote} onChange={setTx('productionNote')} as="span" />
            </p>
          </Sec>
        </Chapter>
      )}

      {on('terms') && (
        <Chapter no={no('terms')} title="Commercial terms" image={img('terms')}>
          <Sec no={`${no('terms')}.1`} title="Scope of supply">
            <div className="two">
              <div><h3>Included in the equipment package</h3><L edit={edit} items={tx.included} onChange={setTx('included')} /></div>
              <div><h3>Execution services, confirmed on selection</h3><L edit={edit} items={tx.services} onChange={setTx('services')} /></div>
            </div>
          </Sec>
          <Sec no={`${no('terms')}.2`} title="Payment terms">
            <table className="doc-table keep">
              <thead><tr><th>Milestone</th><th>What is paid</th><th className="n">Amount</th></tr></thead>
              <tbody>
                {project.inputs.pmFee > 0 && (
                  <tr><td>On signing</td><td>Project management fee, which starts sampling and testing</td><td className="n">{usd(project.inputs.pmFee)}</td></tr>
                )}
                <tr><td>On confirmation of the project scope</td><td>After the test results confirm the flowsheet and plant size</td><td className="n">{pct(project.inputs.clientTerms.deposit)} of the balance</td></tr>
                <tr><td>Against bill of lading</td><td>When imported equipment is shipped</td><td className="n">{pct(project.inputs.clientTerms.bl)} of the balance</td></tr>
                <tr><td>After the commissioning certificate</td><td>When the plant is handed over</td><td className="n">{pct(project.inputs.clientTerms.final)} of the balance</td></tr>
              </tbody>
            </table>
            {project.inputs.pmFee > 0 && (
              <p className="small">The balance is the total project cost less the project management fee paid on signing.</p>
            )}
          </Sec>
          <Sec no={`${no('terms')}.3`} title="Client responsibilities">
            <L edit={edit} items={tx.clientResponsibilities} onChange={setTx('clientResponsibilities')} />
          </Sec>
        </Chapter>
      )}

      {on('nextSteps') && (
        <Chapter no={no('nextSteps')} title="Next steps" image={img('nextSteps')}>
          <Sec no={`${no('nextSteps')}.1`} title="How we move forward">
            <ol className="next-steps">
              {tx.steps.map((s, k) => (
                <li key={k}>
                  <span className="step-k">{String(k + 1).padStart(2, '0')}</span>
                  <T edit={edit} value={s.title} onChange={v => update(d => { d.proposal.steps[k].title = v })} as="h3" />
                  <T edit={edit} value={s.text} onChange={v => update(d => { d.proposal.steps[k].text = v })} as="p" />
                </li>
              ))}
            </ol>
          </Sec>
          <Sec no={`${no('nextSteps')}.2`} title="Basis of this proposal">
            <p>Valid for {meta.validityDays} days from {longDate(meta.date)}. <T edit={edit} value={tx.basis} onChange={setTx('basis')} as="span" /></p>
          </Sec>
        </Chapter>
      )}
    </article>
  )
}

const SHIPPING_LEGS = [
  { id: 'fat', title: 'Manufacturing, inspection and packing', route: 'Factory to Chinese port' },
  { id: 'ocean', title: 'Ocean freight', route: 'China to Dar es Salaam' },
  { id: 'clear', title: 'Port clearance and PVoC', route: 'Dar es Salaam port' },
  { id: 'truck', title: 'Road transport', route: 'Dar es Salaam to Mbeya, about 830 km' },
]

function OptionChapter({ no, o, image, detail, photos, expansion, full, edit, setPkg, tradeoff }: {
  no: number
  o: ClientOption
  image?: string
  detail: ProposalDetail
  photos: string[]
  expansion: ClientOption | null
  full?: ClientOption
  edit: boolean
  setPkg: (id: string, fn: (p: Package) => void) => void
  tradeoff: ReactNode
}) {
  const player = useFlowPlayer()
  const shown = photos.map(k => IMAGES[k]).filter(Boolean)
  const s = (k: number) => `${no}.${k}`
  return (
    <Chapter no={no} title={o.pkg.name} image={image}>
      <Sec no={s(1)} title="Overview">
        <T edit={edit} value={o.pkg.description} onChange={v => setPkg(o.pkg.id, p => { p.description = v })} as="p" />
        <dl className="figures">
          <div><dt>Capacity</dt><dd>{o.pkg.capacity} m³/h</dd></div>
          <div><dt>Processed per month</dt><dd>{num(o.monthlyM3)} m³</dd></div>
          <div><dt>Prime power</dt><dd>{o.pkg.power}</dd></div>
          <div><dt>First gold</dt><dd>{aboutMonths(o.monthsToGold)}</dd></div>
          {detail.equipmentPrices && <div><dt>Equipment package</dt><dd>{usd(o.price)}</dd></div>}
        </dl>
        <L edit={edit} items={o.pkg.highlights} onChange={v => setPkg(o.pkg.id, p => { p.highlights = v })} />
      </Sec>

      <Sec no={s(2)} title="Process flow" newPage>
        <p>The numbers on the diagram match the steps in {s(3)}.</p>
        <div className="no-print flow-tools"><FlowControls player={player} compact /></div>
        <FlowDiagram pkg={o.pkg} step={player.step} animate={player.playing || player.step !== null} numbered />
      </Sec>

      <Sec no={s(3)} title="How it works, step by step">
        <ol className="flow-steps">
          {FLOW_STEPS.map(st => <li key={st.title}><strong>{st.title}.</strong> {st.text}</li>)}
        </ol>
      </Sec>

      <Sec no={s(4)} title="Equipment" newPage>
        {detail.equipmentPhotos && shown.length > 0 && (
          <div className="photo-strip">{shown.map(u => <img key={u} src={u} alt="" />)}</div>
        )}
        <EquipmentTable o={o} prices={detail.equipmentPrices} />
      </Sec>

      <Sec no={s(5)} title="Key figures">
        <table className="doc-table">
          <tbody>{o.pkg.specs.map(sp => <tr key={sp.label}><td>{sp.label}</td><td>{sp.value}</td></tr>)}</tbody>
        </table>
      </Sec>

      {expansion && (
        <Sec no={s(6)} title={`Growing to ${o.pkg.capacity + expansion.pkg.capacity} m³/h: ${expansion.pkg.name}`} newPage>
          <T edit={edit} value={expansion.pkg.description} onChange={v => setPkg(expansion.pkg.id, p => { p.description = v })} as="p" />
          <EquipmentTable o={expansion} prices={detail.equipmentPrices} />
          {detail.equipmentPrices && (
            <table className="doc-table spaced">
              <tbody>
                <tr><td>Phase 1, {o.pkg.name}</td><td className="n">{usd(o.price)}</td></tr>
                <tr><td>Phase 2, {expansion.pkg.name}</td><td className="n">{usd(expansion.price)}</td></tr>
                <tr className="total"><td>Equipment for {o.pkg.capacity + expansion.pkg.capacity} m³/h in two phases</td><td className="n">{usd(o.price + expansion.price)}</td></tr>
                {full && <tr><td>Difference from the {full.pkg.name} in one build</td><td className="n">{signedUsd(o.price + expansion.price - full.price)}</td></tr>}
                {full && <tr><td>Committed up front with the {o.pkg.short}</td><td className="n">{pct(1 - o.price / full.price)} less</td></tr>}
              </tbody>
            </table>
          )}
          {tradeoff}
        </Sec>
      )}
    </Chapter>
  )
}

function Gantt({ o }: { o: ClientOption }) {
  const total = Math.max(1, Math.ceil(o.weeksToGold))
  const ticks = Array.from({ length: Math.floor(total / 4) + 1 }, (_, k) => k * 4)
  return (
    <div className="doc-gantt">
      {o.schedule.map(t => (
        <div className="doc-gantt-row" key={t.id}>
          <span className="doc-gantt-label">{t.label}</span>
          <span className="doc-gantt-track">
            <span className="doc-gantt-bar" style={{ left: `${(t.start / total) * 100}%`, width: `${(t.weeks / total) * 100}%` }} />
          </span>
        </div>
      ))}
      <div className="doc-gantt-row doc-gantt-axis">
        <span className="doc-gantt-label">Weeks from down-payment</span>
        <span className="doc-gantt-track">{ticks.map(w => <span key={w} style={{ left: `${(w / total) * 100}%` }}>{w}</span>)}</span>
      </div>
    </div>
  )
}

function EquipmentTable({ o, prices }: { o: ClientOption; prices: boolean }) {
  return (
    <table className="doc-table equipment">
      <thead><tr><th>Tag</th><th>Equipment</th><th>Qty</th><th>kW</th><th>Source</th>{prices && <th className="n">Price (USD)</th>}</tr></thead>
      <tbody>
        {o.lines.map((l, k) => (
          <tr key={k}>
            <td className="tag">{l.tag}</td>
            <td>{l.item}{l.optional && <span className="opt"> (optional)</span>}</td>
            <td>{l.qty}</td>
            <td>{l.kw}</td>
            <td>{l.source === 'local' ? 'Tanzania' : 'Imported'}</td>
            {prices && <td className="n">{num(l.price)}</td>}
          </tr>
        ))}
        {prices && <tr className="total"><td /><td>Total, {o.pkg.short}</td><td /><td /><td /><td className="n">{usd(o.price)}</td></tr>}
      </tbody>
    </table>
  )
}

function Chapter({ no, title, image, children }: { no: number; title: string; image?: string; children: ReactNode }) {
  return (
    <section className="doc-chapter">
      <header className="doc-chapter-head">
        <span className="doc-chapter-no">Chapter {no}</span>
        <h2>{title}</h2>
      </header>
      {image && <img className="doc-chapter-image" src={image} alt="" />}
      {children}
    </section>
  )
}

function Sec({ no, title, newPage, children }: { no: string; title: string; newPage?: boolean; children: ReactNode }) {
  return (
    <section className={`doc-sec ${newPage ? 'new-page' : ''}`}>
      <h3 className="doc-sec-title"><span className="doc-no">{no}</span>{title}</h3>
      {children}
    </section>
  )
}

type TAs = 'div' | 'p' | 'h1' | 'h3' | 'span'

/** Text that turns into a textarea in edit mode. */
function T({ edit, value, onChange, as = 'div', className }: {
  edit: boolean; value: string; onChange: (v: string) => void; as?: TAs; className?: string
}) {
  if (edit) return <Area value={value} onChange={onChange} className={`edit-${as} ${className ?? ''}`} />
  const Tag = as
  return <Tag className={className}>{value}</Tag>
}

/** Bullet list; in edit mode one item per line. */
function L({ edit, items, onChange }: { edit: boolean; items: string[]; onChange: (v: string[]) => void }) {
  if (edit) {
    return <Area value={items.join('\n')} onChange={v => onChange(v.split('\n').filter((s, k, a) => s.trim() || k === a.length - 1))} className="edit-list" />
  }
  return <ul>{items.filter(Boolean).map((s, k) => <li key={k}>{s}</li>)}</ul>
}

/** Equipment short names (set on the Budget equipment list) by where they come from. */
function sourceList(options: ClientOption[], source: 'local' | 'import') {
  // An item sourced differently per plant is listed under both, naming the plant.
  const out: string[] = []
  const names: string[] = []
  for (const o of options) for (const l of o.lines) if (!names.includes(l.name)) names.push(l.name)
  for (const name of names) {
    const here = options.filter(o => o.lines.some(l => l.name === name && l.source === source))
    if (!here.length) continue
    const everywhere = options.every(o => !o.lines.some(l => l.name === name) || here.includes(o))
    out.push(everywhere ? name : `${name} (${here.map(o => o.pkg.short).join(', ')})`)
  }
  return out
}

function oogNames(options: ClientOption[], expansion: ClientOption | null) {
  const seen: string[] = []
  for (const o of [...options, ...(expansion ? [expansion] : [])]) for (const l of o.lines) if (l.source === 'import' && l.oog && !seen.includes(l.name)) seen.push(l.name)
  return seen
}

function specLabels(options: ClientOption[]) {
  const seen: string[] = []
  for (const o of options) for (const s of o.pkg.specs) if (!seen.includes(s.label)) seen.push(s.label)
  return seen
}

function stageRows(options: ClientOption[]) {
  const seen: { id: string; label: string }[] = []
  for (const o of options) for (const t of o.schedule) if (!seen.some(s => s.id === t.id)) seen.push({ id: t.id, label: t.label })
  return seen
}

const weeks = (w: number) => (w < 1 ? `${Math.round(w * 7)} days` : `${num(w, w % 1 ? 1 : 0)} week${w === 1 ? '' : 's'}`)
const signedUsd = (n: number) => (n >= 0 ? `+${usd(n)}` : `−${usd(-n)}`)

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  // Local date parts: toISOString() would shift to UTC and can land a day early.
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function longDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
