'use client'

import { useState } from 'react'
import { MASTER_DATA_ENTITIES } from '@/lib/goldpass/erp'
import EntityCrudCard from '@/components/goldpass/EntityCrudCard'

export default function MasterDataPage() {
  const [entityId, setEntityId] = useState(MASTER_DATA_ENTITIES[0].id)
  const entity = MASTER_DATA_ENTITIES.find(e => e.id === entityId)!

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Master Data</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Sites, locations, departments, cost centres, and employees used across expenses, inventory, and operations.</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {MASTER_DATA_ENTITIES.map(e => (
          <button
            key={e.id}
            onClick={() => setEntityId(e.id)}
            className={entityId === e.id ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
          >
            {e.label}
          </button>
        ))}
      </div>

      <EntityCrudCard key={entity.id} entity={entity} />
    </div>
  )
}
