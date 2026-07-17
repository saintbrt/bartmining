'use client'

import type { TankRoundStatusRow } from '@/lib/goldpass/erp'

/* One row per tank: current round, days elapsed, last color test, days
   since last test. Read-only on the Plant Overview subtab; the optional
   `actions` render-prop lets the Chemical Manager subtab render the same
   rows with Start round / End round buttons, one component, two call
   sites (same convention DynamicTable already uses elsewhere).

   Colour reserved for status only: red = overdue round, amber = stale
   colour test (>= 5 days since last reading), ink otherwise. */

const COLOR_LABEL: Record<'black' | 'grey' | 'clear', string> = { black: 'Black', grey: 'Grey', clear: 'Clear' }

export function TankStatusBoard({
  rows, loading, actions,
}: {
  rows: TankRoundStatusRow[]
  loading: boolean
  actions?: (row: TankRoundStatusRow) => React.ReactNode
}) {
  if (loading) {
    return <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
  }
  if (rows.length === 0) {
    return <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '28px 0', textAlign: 'center' }}>No tanks configured yet.</div>
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="tbl tbl-card" style={{ fontSize: 12 }}>
        <thead>
          <tr>
            <th>Tank</th><th>Round</th><th>Started</th><th>Days open</th>
            <th>Last color test</th><th>Days since test</th>{actions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.tank_id}>
              <td data-label="Tank">{r.tank_code}</td>
              <td data-label="Round">{r.round_number ?? <span style={{ color: 'var(--label-4)' }}>Idle</span>}</td>
              <td data-label="Started">{r.start_date ?? '—'}</td>
              <td data-label="Days open">
                {r.days_open != null ? (
                  <span style={{ color: r.is_overdue ? 'var(--red)' : 'var(--label-1)', fontWeight: r.is_overdue ? 600 : 400 }}>
                    {r.days_open}{r.is_overdue ? ' (overdue)' : ''}
                  </span>
                ) : '—'}
              </td>
              <td data-label="Last color test">
                {r.latest_color ? `${COLOR_LABEL[r.latest_color]} (${r.latest_test_date})` : <span style={{ color: 'var(--label-4)' }}>No test</span>}
              </td>
              <td data-label="Days since test">
                {r.days_since_last_test != null ? (
                  <span style={{ color: r.days_since_last_test >= 5 ? 'var(--orange)' : 'var(--label-1)', fontWeight: r.days_since_last_test >= 5 ? 600 : 400 }}>
                    {r.days_since_last_test}{r.days_since_last_test >= 5 ? ' (stale)' : ''}
                  </span>
                ) : '—'}
              </td>
              {actions && <td data-label="Action">{actions(r)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
