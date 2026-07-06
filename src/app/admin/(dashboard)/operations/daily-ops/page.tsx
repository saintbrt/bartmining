'use client'

import { useCallback, useEffect, useState } from 'react'
import { getDailyOpsSummary, type DailyOpsSummaryRow } from '@/lib/goldpass/erp'
import DynamicTable from '@/components/goldpass/DynamicTable'

export default function DailyOpsPage() {
  const [rows, setRows] = useState<DailyOpsSummaryRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setRows(await getDailyOpsSummary())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Daily Operations</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Daily gold output and ore tonnes from approved shift logs, plus pending/approved counts. (No production target field exists in the schema yet.)</p>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
        ) : (
          <DynamicTable rows={rows} emptyLabel="No production logged for today yet." />
        )}
      </div>
    </div>
  )
}
