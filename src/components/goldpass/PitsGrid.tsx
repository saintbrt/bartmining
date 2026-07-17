'use client'

import type { PitRow } from '@/lib/goldpass/erp'

/* Pits panel, sharing the same .grid-cell-set / .grid-cell rhythm as the
   tanks panel (PlantMap) so both grids' rows line up without any drawn
   grid lines, per the plant page's split layout. Grouped by mine location
   only when the pits span more than one location; a single location reads
   better as one flat grid. */

type LocationLookup = Record<string, string>

function PitCell({ pit, machineryCount }: { pit: PitRow; machineryCount: number }) {
  return (
    <div className="card grid-cell">
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--label-1)' }}>{pit.name}</div>
      <div style={{ fontSize: 10, color: 'var(--label-3)', marginTop: 2 }}>{pit.code ?? ' '}</div>
      <div className="num" style={{ fontSize: 10, color: 'var(--label-3)', marginTop: 6 }}>
        {machineryCount > 0 ? `${machineryCount} machine${machineryCount === 1 ? '' : 's'}` : 'No machinery'}
      </div>
    </div>
  )
}

export function PitsGrid({
  pits, loading, machineryCountByPit, locationNames,
}: {
  pits: PitRow[]
  loading: boolean
  machineryCountByPit: Record<string, number>
  locationNames: LocationLookup
}) {
  if (loading) {
    return <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
  }
  if (pits.length === 0) {
    return (
      <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '28px 0', textAlign: 'center' }}>
        No pits yet, add one below.
      </div>
    )
  }

  const distinctLocations = new Set(pits.map(p => p.mine_location_id ?? 'none'))
  if (distinctLocations.size <= 1) {
    return (
      <div className="grid-cell-set">
        {pits.map(p => <PitCell key={p.id} pit={p} machineryCount={machineryCountByPit[p.id] ?? 0} />)}
      </div>
    )
  }

  return (
    <div>
      {Array.from(distinctLocations).map(locId => {
        const locPits = pits.filter(p => (p.mine_location_id ?? 'none') === locId)
        const label = locId === 'none' ? 'Unassigned' : (locationNames[locId] ?? 'Location')
        return (
          <div key={locId} style={{ marginBottom: 20 }}>
            <div className="plant-panel-title">{label}</div>
            <div className="grid-cell-set">
              {locPits.map(p => <PitCell key={p.id} pit={p} machineryCount={machineryCountByPit[p.id] ?? 0} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
