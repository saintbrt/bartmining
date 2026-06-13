'use client'

import { useEffect, useState } from 'react'
import { useAppContext } from '@/lib/goldpass/AppContext'
import { useRouter } from 'next/navigation'
import { DB } from '@/lib/goldpass/db'

const AI_BUDGET = 50 // USD / month

export default function SettingsPage() {
  const ctx = useAppContext()
  const router = useRouter()
  const [gradeUnit, setGradeUnit] = useState('g/t')
  const [depthUnit, setDepthUnit] = useState('metres')
  const [auThreshold, setAuThreshold] = useState('0.1')
  const [nullValues, setNullValues] = useState('-99, 9999, N/A')
  const [auditFilter, setAuditFilter] = useState('')
  const [aiUsage, setAiUsage] = useState<{ tokensIn: number; tokensOut: number; requests: number; cost: number } | null>(null)

  const ready = DB.ready()
  useEffect(() => {
    if (!ready) return
    DB.getAiUsageThisMonth().then(setAiUsage)
  }, [ready])

  if (!ctx || !ctx.user) return null
  const { user, project } = ctx

  function handleSignOut() { DB.signOut(); router.push('/admin/login') }

  return (
    <div className="content content-pad" style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Settings</h2>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Account</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{user.email.slice(0, 2).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{user.email}</div>
            <div style={{ fontSize: 12, color: 'var(--label-3)' }}>Bart Mining GoldPass</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-danger btn-sm" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 16 }}>Data defaults</div>
        {[
          { label: 'Grade unit', value: gradeUnit, onChange: setGradeUnit, options: ['g/t', 'ppm', 'ppb', '%'] },
          { label: 'Depth unit', value: depthUnit, onChange: setDepthUnit, options: ['metres', 'feet'] },
        ].map(f => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: 'var(--label-2)', width: 120 }}>{f.label}</label>
            <select className="input" style={{ flex: 1 }} value={f.value} onChange={e => f.onChange(e.target.value)}>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: 'var(--label-2)', width: 120 }}>Au threshold</label>
          <input className="input" style={{ flex: 1 }} value={auThreshold} onChange={e => setAuThreshold(e.target.value)} placeholder="0.1" />
          <span style={{ fontSize: 12, color: 'var(--label-4)' }}>g/t</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 13, color: 'var(--label-2)', width: 120 }}>Null values</label>
          <input className="input" style={{ flex: 1 }} value={nullValues} onChange={e => setNullValues(e.target.value)} placeholder="-99, 9999, N/A" />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Backend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: ready ? 'var(--green)' : 'var(--red)', boxShadow: ready ? '0 0 6px var(--green)' : undefined }} />
          <div style={{ fontSize: 13 }}>{ready ? 'Supabase connected' : 'Supabase not configured'}</div>
        </div>
        {!ready && <p style={{ fontSize: 12, color: 'var(--label-4)', marginTop: 8, lineHeight: 1.6 }}>Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON environment variables.</p>}
        {project && (
          <div style={{ fontSize: 12, color: 'var(--label-3)', marginTop: 10 }}>
            Current project: <strong style={{ color: 'var(--label-1)' }}>{project.name}</strong> · {DB.getTables(project.id).length} files · {DB.getTables(project.id).reduce((a, t) => a + t.row_count, 0).toLocaleString()} rows · {DB.getOutputs(project.id).length} outputs
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Claude AI</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: ready ? 'var(--green)' : 'var(--red)', boxShadow: ready ? '0 0 6px var(--green)' : undefined }} />
          <div style={{ fontSize: 13 }}>{ready ? 'Claude AI connected' : 'Claude AI not configured'}</div>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--label-4)' }}>gold-ai · claude-sonnet-4-6</div>
        </div>
        {ready && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: 'var(--label-3)' }}>Usage this month</span>
              <span style={{ color: 'var(--label-1)', fontWeight: 600 }}>${(aiUsage?.cost ?? 0).toFixed(2)} <span style={{ color: 'var(--label-4)', fontWeight: 400 }}>of ${AI_BUDGET.toFixed(2)}</span></span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-3)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, ((aiUsage?.cost ?? 0) / AI_BUDGET) * 100)}%`, background: (aiUsage?.cost ?? 0) / AI_BUDGET > 0.9 ? 'var(--red)' : (aiUsage?.cost ?? 0) / AI_BUDGET > 0.7 ? 'var(--orange)' : 'var(--green)', transition: 'width .4s' }} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11, color: 'var(--label-3)' }}>
              <span>{(aiUsage?.requests ?? 0).toLocaleString()} request{(aiUsage?.requests ?? 0) !== 1 ? 's' : ''}</span>
              <span>{(aiUsage?.tokensIn ?? 0).toLocaleString()} tokens in</span>
              <span>{(aiUsage?.tokensOut ?? 0).toLocaleString()} tokens out</span>
            </div>
          </div>
        )}
        {!ready && <p style={{ fontSize: 12, color: 'var(--label-4)', marginTop: 8, lineHeight: 1.6 }}>Deploy the gold-ai edge function and set the ANTHROPIC_API_KEY secret to enable AI features.</p>}
      </div>

      {project && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>Project backup</div>
          <p style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 12 }}>Download every file in "{project.name}" as one Excel workbook (one sheet per file).</p>
          <button className="btn btn-secondary btn-sm" onClick={async () => {
            const tables = DB.getTables(project.id)
            if (!tables.length) return
            const XLSX = await import('xlsx')
            const wb = XLSX.utils.book_new()
            tables.forEach(t => {
              const rows = DB.getRows(t.id, 0)
              if (rows.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), t.name.slice(0, 31).replace(/[\\/?*[\]:]/g, '_'))
            })
            XLSX.writeFile(wb, `${project.name}-backup.xlsx`)
          }}>⬇ Download full backup (.xlsx)</button>
        </div>
      )}

      {project && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', flex: 1 }}>Activity history</div>
            <input className="input" style={{ width: 160, fontSize: 11, padding: '4px 9px' }} placeholder="Search history…" value={auditFilter} onChange={e => setAuditFilter(e.target.value)} />
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {DB.getAuditLog(project.id)
              .filter(a => !auditFilter.trim() || `${a.operation} ${a.details}`.toLowerCase().includes(auditFilter.toLowerCase()))
              .map(a => (
                <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 12 }}>
                  <span style={{ color: 'var(--label-4)', flexShrink: 0, fontSize: 10 }}>{new Date(a.created_at).toLocaleString()}</span>
                  <span style={{ color: 'var(--gold)', fontFamily: 'monospace', flexShrink: 0, fontSize: 10 }}>{a.operation}</span>
                  <span style={{ color: 'var(--label-2)' }}>{a.details}</span>
                </div>
              ))}
            {DB.getAuditLog(project.id).length === 0 && <div style={{ fontSize: 12, color: 'var(--label-4)' }}>No activity recorded yet.</div>}
          </div>
        </div>
      )}
    </div>
  )
}
