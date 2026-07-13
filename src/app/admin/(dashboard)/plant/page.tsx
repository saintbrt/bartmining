'use client'

import { useEffect, useState } from 'react'
import { getTanks, type TankRow } from '@/lib/goldpass/erp'
import { PlantMap } from '@/components/goldpass/PlantMap'

export default function PlantPage() {
  const [tanks, setTanks] = useState<TankRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    getTanks().then(rows => { if (alive) { setTanks(rows); setLoading(false) } })
    return () => { alive = false }
  }, [])

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Plant</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>
          Top view of the 15 leaching tanks across lines A, B and C, and the flow into elution.
          Tank fill state from daily color tests arrives in a later phase.
        </p>
      </div>

      <div className="card">
        <PlantMap tanks={tanks} loading={loading} />
      </div>
    </div>
  )
}
