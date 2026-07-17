'use client'

import type { RoundTimelineRow } from '@/lib/goldpass/erp'

/* Per-tank round timeline (Gantt-style): one horizontal track per tank,
   rounds drawn as bars positioned by date within the visible window. Hand
   rolled with absolute-positioned divs rather than forcing Recharts' bar
   chart into a per-row variable-segment layout it isn't built for, matching
   the app's existing hand-rolled grid components (PlantMap, PitsGrid).

   Colour here encodes ROUND TIMING status (open vs closed vs overdue), kept
   visually distinct from PlantMap's black/grey/clear CHEMISTRY colour so
   the two meanings never get confused. Reserved status colour only. */

const LINES: { line: 'A' | 'B' | 'C'; label: string }[] = [
  { line: 'A', label: 'Line A' },
  { line: 'B', label: 'Line B' },
  { line: 'C', label: 'Line C' },
]

const OPEN = 'var(--blue)'
const CLOSED = 'var(--label-4)'
const OVERDUE = 'var(--red)'

function dayIndex(dateStr: string, domainStart: number): number {
  return Math.floor((new Date(dateStr + 'T00:00:00Z').getTime() - domainStart) / 86400000)
}

function TankRow({
  tankCode, rounds, domainStart, domainDays, overdueRoundIds,
}: {
  tankCode: string
  rounds: RoundTimelineRow[]
  domainStart: number
  domainDays: number
  overdueRoundIds: Set<string>
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
      <div style={{ width: 44, flexShrink: 0, fontSize: 11, fontWeight: 600, color: 'var(--label-2)' }}>{tankCode}</div>
      <div style={{ position: 'relative', flex: 1, height: 18, background: 'var(--bg-3)', borderRadius: 4 }}>
        {rounds.map(r => {
          const startIdx = Math.max(0, dayIndex(r.start_date, domainStart))
          const endIdx = Math.min(domainDays, dayIndex(r.end_date, domainStart) + 1)
          const leftPct = (startIdx / domainDays) * 100
          const widthPct = Math.max(1, ((endIdx - startIdx) / domainDays) * 100)
          const color = overdueRoundIds.has(r.round_id) ? OVERDUE : r.status === 'open' ? OPEN : CLOSED
          const days = endIdx - startIdx
          return (
            <div
              key={r.round_id}
              title={`Round ${r.round_number}: ${r.start_date} to ${r.status === 'open' ? 'now' : r.end_date} (${days}d)`}
              style={{
                position: 'absolute', left: `${leftPct}%`, width: `${widthPct}%`, top: 1, bottom: 1,
                background: color, borderRadius: 3, minWidth: 4,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export function TankTimeline({
  rows, overdueRoundIds, days = 90,
}: {
  rows: RoundTimelineRow[]
  overdueRoundIds?: Set<string>
  days?: number
}) {
  if (rows.length === 0) {
    return <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '28px 0', textAlign: 'center' }}>No leaching rounds logged yet.</div>
  }

  const domainStart = new Date().getTime() - days * 86400000
  const domainDays = days

  const byTank = new Map<string, { tank_code: string; line: 'A' | 'B' | 'C'; sort_order: number; rounds: RoundTimelineRow[] }>()
  for (const r of rows) {
    const key = r.tank_id
    if (!byTank.has(key)) byTank.set(key, { tank_code: r.tank_code, line: r.line, sort_order: r.sort_order, rounds: [] })
    byTank.get(key)!.rounds.push(r)
  }
  const tanks = Array.from(byTank.values()).sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div>
      <div className="num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--label-4)', marginBottom: 6, paddingLeft: 54 }}>
        <span>{new Date(domainStart).toISOString().slice(0, 10)}</span>
        <span>today</span>
      </div>
      {LINES.map(({ line, label }) => {
        const lineTanks = tanks.filter(t => t.line === line)
        if (lineTanks.length === 0) return null
        return (
          <div key={line} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--label-3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
            {lineTanks.map(t => (
              <TankRow
                key={t.tank_code}
                tankCode={t.tank_code}
                rounds={t.rounds}
                domainStart={domainStart}
                domainDays={domainDays}
                overdueRoundIds={overdueRoundIds ?? new Set()}
              />
            ))}
          </div>
        )
      })}
      <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 10, color: 'var(--label-3)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: OPEN, display: 'inline-block' }} /> Open round</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: CLOSED, display: 'inline-block' }} /> Closed round</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: OVERDUE, display: 'inline-block' }} /> Overdue</span>
      </div>
    </div>
  )
}
