import { useState } from 'react'
import { CATEGORY_LABEL, emptyCategories, pct, usd } from '../model'
import type { CostCategory, Expense } from '../types'
import { Num, Section, Segmented, Stat, Text } from '../components/Fields'
import { useLocal } from '../store'
import { PageHead, type ViewProps } from './shared'

const CATS = Object.keys(CATEGORY_LABEL) as CostCategory[]
const today = () => new Date().toLocaleDateString('en-CA') // yyyy-mm-dd, local time

export function Expenses({ project, model, update }: ViewProps) {
  const [scopeId, setScopeId] = useLocal('expenseScope', model.scopes[0]?.id ?? '')
  const scope = model.scopes.find(s => s.id === scopeId) ?? model.scopes[0]
  const [filter, setFilter] = useState<CostCategory | 'all'>('all')

  // A combo (e.g. Starter Modular Plant + Phase 2) tracks spend booked against any of its packages.
  const combo = project.combos.find(c => c.id === scope.id)
  const inScope = (e: Expense) => (combo ? combo.packageIds.includes(e.scope) : e.scope === scope.id)
  const rows = project.expenses.filter(inScope)

  const committed = emptyCategories()
  const paid = emptyCategories()
  for (const e of rows) (e.status === 'paid' ? paid : committed)[e.category] += e.amount
  const totalBudget = scope.deliverCost
  const totalPaid = Object.values(paid).reduce((a, b) => a + b, 0)
  const totalCommitted = Object.values(committed).reduce((a, b) => a + b, 0)

  const [draft, setDraft] = useState<Omit<Expense, 'id'>>(() => blank(scope.id))
  // The draft's package must belong to whatever scope is on screen now.
  const draftScope = combo ? (combo.packageIds.includes(draft.scope) ? draft.scope : combo.packageIds[0]) : scope.id

  const add = () => {
    if (!draft.description.trim() || !draft.amount) return
    update(p => { p.expenses.push({ ...draft, scope: draftScope, id: crypto.randomUUID() }) })
    setDraft({ ...blank(draftScope), date: draft.date, category: draft.category })
  }
  const shown = rows
    .filter(e => filter === 'all' || e.category === filter)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="page">
      <PageHead
        title="Expenses"
        lead="Record what has been committed and paid, and see it against the budget for the option you're delivering."
        right={<Segmented value={scope.id} onChange={setScopeId} options={model.scopes.map(s => ({ value: s.id, label: s.name }))} />}
      />

      <div className="stats">
        <Stat label="Budget (cost to deliver)" value={usd(totalBudget)} />
        <Stat label="Paid" value={usd(totalPaid)} note={pct(totalPaid / totalBudget, 1) + ' of budget'} />
        <Stat label="Committed, not yet paid" value={usd(totalCommitted)} />
        <Stat label="Remaining" value={usd(totalBudget - totalPaid - totalCommitted)} />
      </div>

      <Section title="Budget against actual">
        <table className="grid">
          <thead>
            <tr><th>Category</th><th className="n">Budget</th><th className="n">Paid</th><th className="n">Committed</th><th className="n">Remaining</th><th style={{ width: '22%' }}>Used</th></tr>
          </thead>
          <tbody>
            {CATS.map(c => {
              const budget = scope.byCategory[c]
              const used = paid[c] + committed[c]
              if (!budget && !used) return null
              const over = used > budget
              return (
                <tr key={c}>
                  <td>{CATEGORY_LABEL[c]}</td>
                  <td className="n">{usd(budget)}</td>
                  <td className="n">{paid[c] ? usd(paid[c]) : '–'}</td>
                  <td className="n">{committed[c] ? usd(committed[c]) : '–'}</td>
                  <td className={`n ${over ? 'negative' : ''}`}>{usd(budget - used)}</td>
                  <td>
                    <div className={`meter ${over ? 'over' : ''}`}>
                      <span className="meter-paid" style={{ width: `${Math.min(100, budget ? (paid[c] / budget) * 100 : 100)}%` }} />
                      <span className="meter-committed" style={{ width: `${Math.min(100, budget ? (committed[c] / budget) * 100 : 0)}%` }} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="hint"><span className="key key-paid" /> paid <span className="key key-committed" /> committed. Contingency is spent by booking costs that weren't budgeted against it.</p>
      </Section>

      <Section
        title="Ledger"
        aside={
          <div className="row-gap">
            <select value={filter} onChange={e => setFilter(e.target.value as CostCategory | 'all')} aria-label="Filter by category">
              <option value="all">All categories</option>
              {CATS.map(c => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
            </select>
            <button className="btn ghost" onClick={() => downloadCsv(project.meta.name, rows, project)}>Export CSV</button>
          </div>
        }
      >
        <div className="table-wrap">
          <table className="grid edit">
            <thead>
              <tr>
                <th style={{ width: 150 }}>Date</th>
                {combo && <th style={{ width: 120 }}>Package</th>}
                <th style={{ width: 200 }}>Category</th>
                <th>Description</th>
                <th style={{ width: 170 }}>Paid to</th>
                <th className="n" style={{ width: 130 }}>Amount (USD)</th>
                <th style={{ width: 130 }}>Status</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              <tr className="draft">
                <td><input className="text-field" type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} /></td>
                {combo && (
                  <td>
                    <select value={draftScope} onChange={e => setDraft({ ...draft, scope: e.target.value })}>
                      {combo.packageIds.map(id => <option key={id} value={id}>{project.packages.find(p => p.id === id)?.short}</option>)}
                    </select>
                  </td>
                )}
                <td>
                  <select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value as CostCategory })}>
                    {CATS.map(c => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
                  </select>
                </td>
                <td><Text placeholder="What was it for?" value={draft.description} onChange={v => setDraft({ ...draft, description: v })} /></td>
                <td><Text placeholder="Supplier or person" value={draft.payee} onChange={v => setDraft({ ...draft, payee: v })} /></td>
                <td className="n"><Num value={draft.amount} onChange={v => setDraft({ ...draft, amount: v })} /></td>
                <td>
                  <select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as Expense['status'] })}>
                    <option value="committed">Committed</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td><button className="btn primary small" onClick={add} disabled={!draft.description.trim() || !draft.amount}>Add</button></td>
              </tr>
              {shown.map(e => {
                const k = project.expenses.findIndex(x => x.id === e.id)
                const set = (fn: (x: Expense) => void) => update(p => fn(p.expenses[k]))
                return (
                  <tr key={e.id}>
                    <td><input className="text-field" type="date" value={e.date} onChange={ev => set(x => { x.date = ev.target.value })} /></td>
                    {combo && (
                      <td>
                        <select value={e.scope} onChange={ev => set(x => { x.scope = ev.target.value })}>
                          {combo.packageIds.map(id => <option key={id} value={id}>{project.packages.find(p => p.id === id)?.short}</option>)}
                        </select>
                      </td>
                    )}
                    <td>
                      <select value={e.category} onChange={ev => set(x => { x.category = ev.target.value as CostCategory })}>
                        {CATS.map(c => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
                      </select>
                    </td>
                    <td><Text value={e.description} onChange={v => set(x => { x.description = v })} /></td>
                    <td><Text value={e.payee} onChange={v => set(x => { x.payee = v })} /></td>
                    <td className="n"><Num value={e.amount} onChange={v => set(x => { x.amount = v })} /></td>
                    <td>
                      <select value={e.status} onChange={ev => set(x => { x.status = ev.target.value as Expense['status'] })}>
                        <option value="committed">Committed</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="c">
                      <button className="icon" title="Delete" onClick={() => {
                        if (confirm(`Delete "${e.description}"?`)) update(p => { p.expenses = p.expenses.filter(x => x.id !== e.id) })
                      }}>×</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {shown.length === 0 && <p className="hint">No expenses recorded{filter === 'all' ? '' : ' in this category'} yet. Use the first row to add one.</p>}
      </Section>
    </div>
  )
}

function blank(scope: string): Omit<Expense, 'id'> {
  return { date: today(), scope, category: 'equipment', description: '', payee: '', amount: 0, status: 'committed' }
}

function downloadCsv(name: string, rows: Expense[], project: ViewProps['project']) {
  const esc = (s: string | number) => `"${String(s).replace(/"/g, '""')}"`
  const lines = [
    ['Date', 'Package', 'Category', 'Description', 'Paid to', 'Amount USD', 'Status'],
    ...rows.map(e => [e.date, project.packages.find(p => p.id === e.scope)?.short ?? e.scope, CATEGORY_LABEL[e.category], e.description, e.payee, e.amount, e.status]),
  ].map(r => r.map(esc).join(','))
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `${name} expenses ${today()}.csv` })
  a.click()
  URL.revokeObjectURL(url)
}
