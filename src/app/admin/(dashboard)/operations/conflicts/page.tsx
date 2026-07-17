'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import { getSyncConflicts, resolveSyncConflict, type SyncConflictRow } from '@/lib/goldpass/erp'
import DynamicTable from '@/components/goldpass/DynamicTable'

export default function ConflictsPage() {
  const [rows, setRows] = useState<SyncConflictRow[]>([])
  const [loading, setLoading] = useState(true)
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setRows(await getSyncConflicts())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function resolve(id: string, resolution: 'keep_server' | 'keep_client' | 'dismissed') {
    const typed = window.prompt('Resolution note (required):')
    if (!typed?.trim()) { if (typed !== null) notify('warn', 'A resolution note is required.'); return }
    setResolvingId(id)
    const ok = await resolveSyncConflict(id, resolution, typed.trim())
    setResolvingId(null)
    if (!ok) return
    notify('success', 'Conflict resolved.')
    load()
  }

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 20 }}>
        <h2 className="page-title">Sync Conflicts</h2>
        <p className="page-sub">Duplicate or conflicting offline submissions from the mobile app that need manual resolution.</p>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <DynamicTable
            rows={rows}
            emptyLabel="No sync conflicts, nothing to resolve."
            hideColumns={['id']}
            actions={row => row.resolution !== 'pending' ? null : (
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-text" disabled={resolvingId === row.id}
                  onClick={() => resolve(row.id as string, 'keep_client')}>Keep mobile submission</button>
                <button className="btn-text" disabled={resolvingId === row.id}
                  onClick={() => resolve(row.id as string, 'keep_server')}>Keep existing</button>
                <button className="btn-text btn-text-danger" disabled={resolvingId === row.id}
                  onClick={() => resolve(row.id as string, 'dismissed')}>Dismiss</button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  )
}
