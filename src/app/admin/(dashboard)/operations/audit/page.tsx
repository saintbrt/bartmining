'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { getAuditLog, type AuditLogRow } from '@/lib/goldpass/erp'

export default function AuditLogPage() {
  const [rows, setRows] = useState<AuditLogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [entityType, setEntityType] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setRows(await getAuditLog(entityType.trim() ? { entityType: entityType.trim() } : undefined))
    setLoading(false)
  }, [entityType])

  useEffect(() => { load() }, [load])

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 20 }}>
        <h2 className="page-title">Audit Log</h2>
        <p className="page-sub">Before/after history of changes to operational records.</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          className="input"
          style={{ fontSize: 12, width: 260 }}
          placeholder="Filter by entity type (e.g. expense_entries)…"
          value={entityType}
          onChange={e => setEntityType(e.target.value)}
        />
      </div>

      <div className="card">
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl tbl-card" style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Entity type</th>
                  <th>Entity ID</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No audit entries found.</td></tr>
                ) : rows.map(r => (
                  <Fragment key={r.id}>
                    <tr>
                      <td data-label="Date" style={{ color: 'var(--label-4)' }}>{new Date(r.created_at).toLocaleString()}</td>
                      <td data-label="Entity type">{r.entity_type}</td>
                      <td data-label="Entity ID" className="num" style={{ fontSize: 11 }}>{r.entity_id ?? '-'}</td>
                      <td data-label="Action">{r.action}</td>
                      <td>
                        <button className="btn-text"
                          onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                          {expandedId === r.id ? 'Hide' : 'Diff'}
                        </button>
                      </td>
                    </tr>
                    {expandedId === r.id && (
                      <tr>
                        <td colSpan={5} style={{ background: 'var(--bg-3)' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: 12, width: '100%' }}>
                            <div style={{ flex: 1, minWidth: 220 }}>
                              <div style={{ fontSize: 10, color: 'var(--label-4)', marginBottom: 4 }}>Before</div>
                              <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(r.before, null, 2)}</pre>
                            </div>
                            <div style={{ flex: 1, minWidth: 220 }}>
                              <div style={{ fontSize: 10, color: 'var(--label-4)', marginBottom: 4 }}>After</div>
                              <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(r.after, null, 2)}</pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
