// The figures at the top of the Projects tab, worked out from the rows
// themselves so they can't disagree with the board.

import { isoToday, proformaState, type ProformaState } from './deal'
import type { PaymentRow, ProformaRow, ProjectCard, ProposalRow } from './db'

export interface Figure { count: number; value: number }

export interface Tracking {
  year: number
  /** Proposals issued this year: distinct numbers, and every revision sent. */
  proposals: { numbers: number; revisions: number }
  /** Projects waiting on the client's answer to a proposal. */
  open: Figure
  /** Won, in delivery or completed. */
  sales: Figure
  /** Won ÷ (won + lost), over projects that have an answer. */
  winRate: number | null
  /** Pro formas raised but not yet confirmed by the client (draft or sent). */
  pending: Figure
  /** Confirmed (or part paid), waiting for the money. */
  awaiting: Figure
  overdue: Figure
  received: { month: number; year: number; total: number }
}

export interface ProformaView extends ProformaRow { paid: number; state: ProformaState; outstanding: number }

/** Pro formas with what has been paid against each and where they stand. */
export function proformaViews(proformas: ProformaRow[], payments: PaymentRow[], today = isoToday()): ProformaView[] {
  const paid = new Map<string, number>()
  for (const p of payments) if (p.proforma_id) paid.set(p.proforma_id, (paid.get(p.proforma_id) ?? 0) + p.amount)
  return proformas.map(pf => {
    const got = paid.get(pf.id) ?? 0
    const state = proformaState(pf, got, today)
    return { ...pf, paid: got, state, outstanding: state === 'cancelled' ? 0 : Math.max(0, pf.amount - got) }
  })
}

const WON = new Set(['won', 'delivery', 'completed'])

export function tracking(projects: ProjectCard[], proposals: ProposalRow[], proformas: ProformaView[], payments: PaymentRow[], now = new Date()): Tracking {
  const year = now.getFullYear()
  const month = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const live = projects.filter(p => !p.archived)
  const fig = (rows: { value: number }[]): Figure => ({ count: rows.length, value: rows.reduce((a, r) => a + r.value, 0) })

  const thisYear = proposals.filter(p => p.sent_at.startsWith(String(year)))
  const won = live.filter(p => WON.has(p.stage))
  const lost = live.filter(p => p.stage === 'lost')

  const outstanding = (states: ProformaState[]) =>
    fig(proformas.filter(pf => states.includes(pf.state)).map(pf => ({ value: pf.outstanding })))

  const sum = (rows: PaymentRow[]) => rows.reduce((a, r) => a + r.amount, 0)

  return {
    year,
    proposals: { numbers: new Set(thisYear.map(p => p.number)).size, revisions: thisYear.length },
    open: fig(live.filter(p => p.stage === 'negotiation').map(p => ({ value: p.value_usd }))),
    sales: fig(won.map(p => ({ value: p.value_usd }))),
    winRate: won.length + lost.length ? won.length / (won.length + lost.length) : null,
    pending: outstanding(['draft', 'sent']),
    awaiting: outstanding(['confirmed', 'part_paid']),
    overdue: outstanding(['overdue']),
    received: {
      month: sum(payments.filter(p => p.received_on.startsWith(month))),
      year: sum(payments.filter(p => p.received_on.startsWith(String(year)))),
      total: sum(payments),
    },
  }
}
