import { usd } from '@/lib/proposals/model'
import type { CashflowTiming } from '@/lib/proposals/types'
import { Internal, Num, Section, Stat } from '../components/Fields'
import { PageHead, usePackagePick, type ViewProps } from './shared'

type Spread = 'freight' | 'port' | 'civils' | 'install' | 'qa' | 'commissioning'
type Milestone = 'supplierDeposit' | 'supplierBL' | 'supplierFinal' | 'clientSigning' | 'clientDeposit' | 'clientBL' | 'clientFinal'

const SPREADS: { key: Spread; label: string }[] = [
  { key: 'freight', label: 'Freight, insurance, PVoC' },
  { key: 'port', label: 'Port, clearing, trucking' },
  { key: 'civils', label: 'Civil works' },
  { key: 'install', label: 'Installation & crane' },
  { key: 'qa', label: 'Testing, QA & compliance' },
  { key: 'commissioning', label: 'Commissioning, spares, contingency' },
]
const MILESTONES: { key: Milestone; label: string }[] = [
  { key: 'clientSigning', label: 'Project management fee received (signing)' },
  { key: 'clientDeposit', label: 'Scope-confirmation payment received' },
  { key: 'clientBL', label: 'Client B/L payment received' },
  { key: 'clientFinal', label: 'Client final payment received' },
  { key: 'supplierDeposit', label: 'Supplier order payment paid' },
  { key: 'supplierBL', label: 'Supplier B/L payment paid' },
  { key: 'supplierFinal', label: 'Supplier final payment paid' },
]

const signed = (n: number) => (n < 0 ? `(${usd(-n)})` : usd(n))

export function Cashflow({ project, model, update }: ViewProps) {
  const { pkg, index, picker } = usePackagePick(project)
  const cf = model.packages[index].cashflow
  const t = pkg.cashflow
  const months = Array.from({ length: cf.months }, (_, k) => k)
  const low = Math.min(0, ...cf.cumulative)
  const setT = (fn: (t: CashflowTiming) => void) => update(p => fn(p.packages[index].cashflow))

  return (
    <div className="page">
      <PageHead
        title="Cashflow"
        lead="Money out to suppliers and contractors against money in from the client, month by month."
        right={<>{picker}<Internal /></>}
      />

      <div className="stats">
        <Stat label="Total outflow" value={usd(cf.outflow.reduce((a, b) => a + b, 0))} />
        <Stat label="Client receipts" value={usd(cf.receipts.reduce((a, b) => a + b, 0))} />
        <Stat label="Net position at close" value={signed(cf.cumulative.at(-1) ?? 0)} />
        <Stat label="Lowest cash position" value={signed(Math.min(...cf.cumulative))} note={low < 0 ? 'Funding needed' : 'Never negative'} />
      </div>

      <Section title={`${pkg.name}, monthly`}>
        <div className="table-wrap">
          <table className="grid">
            <thead>
              <tr><th>USD</th>{months.map(k => <th key={k} className="n">M{k + 1}</th>)}<th className="n">Total</th></tr>
            </thead>
            <tbody>
              {cf.rows.map(r => (
                <tr key={r.label}>
                  <td>{r.label}</td>
                  {r.values.map((v, k) => <td key={k} className={`n ${v ? '' : 'zero'}`}>{v ? usd(v) : '–'}</td>)}
                  <td className="n">{usd(r.total)}</td>
                </tr>
              ))}
              <tr className="total"><td>Total outflow</td>{cf.outflow.map((v, k) => <td key={k} className="n">{usd(v)}</td>)}<td className="n">{usd(cf.outflow.reduce((a, b) => a + b, 0))}</td></tr>
              <tr className="total"><td>Client receipts</td>{cf.receipts.map((v, k) => <td key={k} className={`n ${v ? '' : 'zero'}`}>{v ? usd(v) : '–'}</td>)}<td className="n">{usd(cf.receipts.reduce((a, b) => a + b, 0))}</td></tr>
              <tr><td>Net cashflow</td>{cf.net.map((v, k) => <td key={k} className="n">{signed(v)}</td>)}<td className="n">{signed(cf.net.reduce((a, b) => a + b, 0))}</td></tr>
              <tr className="strong"><td>Cumulative cash position</td>{cf.cumulative.map((v, k) => <td key={k} className={`n ${v < 0 ? 'negative' : ''}`}>{signed(v)}</td>)}<td /></tr>
            </tbody>
          </table>
        </div>
        <CumulativeBars values={cf.cumulative} />
      </Section>

      <Section title="When each payment lands" aside={<span className="muted">Spread rows are % of that cost per month and should add up to 100%.</span>}>
        <div className="table-wrap">
          <table className="grid edit">
            <thead>
              <tr><th>Cost</th>{months.map(k => <th key={k} className="n">M{k + 1}</th>)}<th className="n">Sum</th></tr>
            </thead>
            <tbody>
              {SPREADS.map(s => {
                const total = months.reduce((a, k) => a + (t[s.key][k] ?? 0), 0)
                return (
                  <tr key={s.key}>
                    <td>{s.label}</td>
                    {months.map(k => (
                      <td key={k} className="n">
                        <Num percent width={64} label={`${s.label} M${k + 1}`} value={t[s.key][k] ?? 0} onChange={v => setT(x => {
                          while (x[s.key].length < x.months) x[s.key].push(0)
                          x[s.key][k] = v
                        })} />
                      </td>
                    ))}
                    <td className={`n ${Math.abs(total - 1) > 1e-6 ? 'negative' : 'muted'}`}>{Math.round(total * 100)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="form-list milestones">
          {MILESTONES.map(ms => (
            <label key={ms.key}>
              <span>{ms.label}</span>
              <select value={t[ms.key] ?? 0} onChange={e => setT(x => { x[ms.key] = Number(e.target.value) })}>
                {months.map(k => <option key={k} value={k}>Month {k + 1}</option>)}
              </select>
            </label>
          ))}
        </div>
      </Section>
    </div>
  )
}

/** Cumulative cash as plain bars around a zero line. */
function CumulativeBars({ values }: { values: number[] }) {
  const max = Math.max(1, ...values.map(Math.abs))
  return (
    <div className="cum-bars" aria-label="Cumulative cash position by month">
      {values.map((v, k) => (
        <div key={k} className="cum-col">
          <div className="cum-pos">{v > 0 && <span style={{ height: `${(v / max) * 100}%` }} />}</div>
          <div className="cum-neg">{v < 0 && <span style={{ height: `${(-v / max) * 100}%` }} />}</div>
          <div className="cum-label">M{k + 1}</div>
        </div>
      ))}
    </div>
  )
}
