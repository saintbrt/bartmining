'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import {
  getExecutiveKpis, refreshExecutiveMviews, getManagerScorecard, listProfiles,
  getMonthEndCloses, initiateMonthEndClose, createMonthlySnapshot, finalizeMonthEndClose,
  getMonthlySnapshots, amendMonthlySnapshot, getSiteReportConfigs, upsertSiteReportConfig,
  listSimpleTable,
  type ExecutiveKpis, type ManagerScorecard, type ProfileRow, type MonthEndCloseRow,
  type MonthlySnapshotRow, type SiteReportConfigRow, type SimpleRow,
} from '@/lib/goldpass/erp'

function Kpi({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--label-3)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

export default function ExecutivePage() {
  const [sites, setSites] = useState<SimpleRow[]>([])
  const [siteId, setSiteId] = useState('')
  const [kpis, setKpis] = useState<ExecutiveKpis | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingKpis, setLoadingKpis] = useState(true)

  const [managers, setManagers] = useState<ProfileRow[]>([])
  const [managerId, setManagerId] = useState('')
  const [scorecard, setScorecard] = useState<ManagerScorecard | null>(null)
  const [loadingScorecard, setLoadingScorecard] = useState(false)

  const [closes, setCloses] = useState<MonthEndCloseRow[]>([])
  const [snapshots, setSnapshots] = useState<MonthlySnapshotRow[]>([])
  const [configs, setConfigs] = useState<SiteReportConfigRow[]>([])
  const [loadingRest, setLoadingRest] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [closeSiteId, setCloseSiteId] = useState('')
  const [closeYear, setCloseYear] = useState(String(new Date().getFullYear()))
  const [closeMonth, setCloseMonth] = useState(String(new Date().getMonth() + 1))
  const [initiating, setInitiating] = useState(false)

  const [configSiteId, setConfigSiteId] = useState('')
  const [closeDay, setCloseDay] = useState('3')
  const [budget, setBudget] = useState('0')
  const [productionPlan, setProductionPlan] = useState('0')
  const [savingConfig, setSavingConfig] = useState(false)

  const loadKpis = useCallback(async (id: string) => {
    setLoadingKpis(true)
    setKpis(await getExecutiveKpis(id || undefined))
    setLoadingKpis(false)
  }, [])

  const loadRest = useCallback(async () => {
    setLoadingRest(true)
    const [c, s, cfg, sitesData, mgrs] = await Promise.all([
      getMonthEndCloses(), getMonthlySnapshots(), getSiteReportConfigs(),
      listSimpleTable('sites'), listProfiles(),
    ])
    setCloses(c); setSnapshots(s); setConfigs(cfg); setSites(sitesData)
    setManagers(mgrs.filter(m => m.role === 'manager'))
    setLoadingRest(false)
  }, [])

  useEffect(() => { loadKpis(siteId) }, [siteId, loadKpis])
  useEffect(() => { loadRest() }, [loadRest])

  async function refresh() {
    setRefreshing(true)
    const ok = await refreshExecutiveMviews()
    if (ok) { notify('success', 'Reporting views refreshed.'); await loadKpis(siteId) }
    setRefreshing(false)
  }

  async function loadScorecard() {
    if (!managerId) { notify('warn', 'Select a manager.'); return }
    setLoadingScorecard(true)
    setScorecard(await getManagerScorecard(managerId))
    setLoadingScorecard(false)
  }

  async function initiate() {
    if (!closeSiteId) { notify('warn', 'Select a site.'); return }
    setInitiating(true)
    const id = await initiateMonthEndClose(closeSiteId, Number(closeYear), Number(closeMonth))
    setInitiating(false)
    if (!id) return
    notify('success', 'Month-end close initiated.')
    loadRest()
  }

  async function createSnapshot(closeId: string) {
    if (!window.confirm('Freeze a snapshot for this period? Snapshots are immutable once created.')) return
    setBusyId(closeId)
    const id = await createMonthlySnapshot(closeId)
    setBusyId(null)
    if (!id) return
    notify('success', 'Snapshot created.')
    loadRest()
  }

  async function finalize(closeId: string) {
    if (!window.confirm('Finalize this month-end close?')) return
    setBusyId(closeId)
    const ok = await finalizeMonthEndClose(closeId)
    setBusyId(null)
    if (!ok) return
    notify('success', 'Month-end close finalized.')
    loadRest()
  }

  async function amend(snapshotId: string) {
    const reason = window.prompt('Reason for amending this frozen snapshot (required):')
    if (!reason?.trim()) { if (reason !== null) notify('warn', 'A reason is required.'); return }
    setBusyId(snapshotId)
    const id = await amendMonthlySnapshot(snapshotId, reason.trim())
    setBusyId(null)
    if (!id) return
    notify('success', 'Amendment snapshot created.')
    loadRest()
  }

  async function saveConfig() {
    if (!configSiteId) { notify('warn', 'Select a site.'); return }
    setSavingConfig(true)
    const ok = await upsertSiteReportConfig(configSiteId, {
      close_day_of_month: Number(closeDay) || 3,
      monthly_budget_tsh: Number(budget) || 0,
      production_plan_g: Number(productionPlan) || 0,
    })
    setSavingConfig(false)
    if (!ok) return
    notify('success', 'Site report config saved.')
    loadRest()
  }

  const p = kpis?.production, sp = kpis?.spend, sa = kpis?.sales, pr = kpis?.payroll, inv = kpis?.inventory, fu = kpis?.fuel

  return (
    <div className="content content-pad">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Executive Dashboard</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Current-month KPIs, manager scorecards, and month-end close / snapshot workflow.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <select className="input" style={{ fontSize: 12 }} value={siteId} onChange={e => setSiteId(e.target.value)}>
          <option value="">All sites</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.name as string}</option>)}
        </select>
        <button className="btn btn-secondary btn-sm" disabled={refreshing} onClick={refresh}>
          {refreshing ? 'Refreshing…' : 'Refresh (reporting views may be stale)'}
        </button>
      </div>

      {loadingKpis ? (
        <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
      ) : !kpis ? (
        <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>KPIs unavailable.</div>
      ) : (
        <div className="grid-kpi" style={{ marginBottom: 24 }}>
          <Kpi label="Gold output (g) vs plan" value={`${p?.gold_output_g.toLocaleString()} / ${p?.production_plan_g.toLocaleString()}`} color="var(--label-1)" />
          <Kpi label="Ore tonnes" value={p?.ore_tonnes.toLocaleString() ?? '0'} color="var(--label-1)" />
          <Kpi label="Spend vs budget" value={`TSh ${sp?.total_spend_tsh.toLocaleString()}${sp?.budget_variance_pct != null ? ` (${sp.budget_variance_pct > 0 ? '+' : ''}${sp.budget_variance_pct}%)` : ''}`} color={sp && sp.budget_variance_pct != null && sp.budget_variance_pct > 0 ? 'var(--red)' : 'var(--label-1)'} />
          <Kpi label="Sales revenue" value={`TSh ${sa?.revenue_tsh.toLocaleString()}`} color="var(--label-1)" />
          <Kpi label="Labor cost" value={`TSh ${pr?.labor_cost_tsh.toLocaleString()}`} color="var(--label-1)" />
          <Kpi label="Below-minimum items" value={`${inv?.below_minimum_count} / ${inv?.total_skus}`} color="var(--label-1)" />
          <Kpi label="Fuel (30d)" value={`${fu?.fuel_litres_30d.toLocaleString()} L`} color="var(--label-1)" />
          <Kpi label="Pending approvals" value={String(kpis.pending_approvals)} color="var(--label-1)" />
        </div>
      )}

      <div className="card" style={{ maxWidth: 620, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Manager Scorecard</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <select className="input" style={{ flex: 1, fontSize: 12 }} value={managerId} onChange={e => setManagerId(e.target.value)}>
            <option value="">Select manager…</option>
            {managers.map(m => <option key={m.id} value={m.id}>{m.name ?? m.email ?? m.id}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" disabled={loadingScorecard} onClick={loadScorecard}>{loadingScorecard ? 'Loading…' : 'Load'}</button>
        </div>
        {scorecard && (
          <div className="grid-3" style={{ gap: 10, fontSize: 12 }}>
            <div>Expenses: {scorecard.expense_entries_approved}/{scorecard.expense_entries_submitted}</div>
            <div>Shift logs: {scorecard.shift_logs_approved}/{scorecard.shift_logs_submitted}</div>
            <div>Sales: {scorecard.sales_recorded}</div>
            <div>Adjustments: {scorecard.payroll_adjustments_submitted}</div>
            <div>Approval rate: {scorecard.approval_rate_pct != null ? `${scorecard.approval_rate_pct}%` : '-'}</div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Month-End Close</h3>
        <div className="card" style={{ maxWidth: 620, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Initiate close</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <select className="input" style={{ flex: 1, fontSize: 12 }} value={closeSiteId} onChange={e => setCloseSiteId(e.target.value)}>
              <option value="">Select site…</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name as string}</option>)}
            </select>
            <input className="input" style={{ width: 90, fontSize: 12 }} type="number" placeholder="Year" value={closeYear} onChange={e => setCloseYear(e.target.value)} />
            <input className="input" style={{ width: 70, fontSize: 12 }} type="number" min={1} max={12} placeholder="Month" value={closeMonth} onChange={e => setCloseMonth(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" disabled={initiating} onClick={initiate}>{initiating ? 'Initiating…' : 'Initiate close'}</button>
        </div>

        <div className="card">
          {loadingRest ? <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl tbl-card" style={{ fontSize: 12 }}>
                <thead><tr><th>Site</th><th>Period</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {closes.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No month-end closes yet.</td></tr>
                  ) : closes.map(c => (
                    <tr key={c.id}>
                      <td data-label="Site">{c.site_name ?? '-'}</td>
                      <td data-label="Period">{c.period_year}-{String(c.period_month).padStart(2, '0')}</td>
                      <td data-label="Status">{c.status}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {(c.status === 'draft' || c.status === 'freezing') && (
                            <button className="btn-icon" style={{ fontSize: 10, color: 'var(--blue)' }} disabled={busyId === c.id}
                              onClick={() => createSnapshot(c.id)}>Create Snapshot</button>
                          )}
                          {c.status === 'snapshot_created' && (
                            <button className="btn-icon" style={{ fontSize: 10, color: 'var(--green)' }} disabled={busyId === c.id}
                              onClick={() => finalize(c.id)}>Finalize</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Snapshots</h3>
        <div className="card">
          {loadingRest ? <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl tbl-card" style={{ fontSize: 12 }}>
                <thead><tr><th>Site</th><th>Period</th><th>Version</th><th>Status</th><th>Frozen at</th><th></th></tr></thead>
                <tbody>
                  {snapshots.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No snapshots yet.</td></tr>
                  ) : snapshots.map(s => (
                    <tr key={s.id}>
                      <td data-label="Site">{s.site_name ?? '-'}</td>
                      <td data-label="Period">{new Date(s.period_start).toLocaleDateString()} – {new Date(s.period_end).toLocaleDateString()}</td>
                      <td data-label="Version">v{s.snapshot_version}</td>
                      <td data-label="Status">{s.status}</td>
                      <td data-label="Frozen at" style={{ color: 'var(--label-4)' }}>{s.frozen_at ? new Date(s.frozen_at).toLocaleString() : '-'}</td>
                      <td>
                        {s.status === 'frozen' && (
                          <button className="btn-icon" style={{ fontSize: 10 }} disabled={busyId === s.id}
                            onClick={() => amend(s.id)}>Amend</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Site Report Config</h3>
        <div className="card" style={{ maxWidth: 620, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <select className="input" style={{ flex: 1, minWidth: 140, fontSize: 12 }} value={configSiteId} onChange={e => setConfigSiteId(e.target.value)}>
              <option value="">Select site…</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name as string}</option>)}
            </select>
            <input className="input" style={{ width: 130, fontSize: 12 }} type="number" placeholder="Close day of month" value={closeDay} onChange={e => setCloseDay(e.target.value)} />
            <input className="input" style={{ width: 150, fontSize: 12 }} type="number" placeholder="Monthly budget (TSh)" value={budget} onChange={e => setBudget(e.target.value)} />
            <input className="input" style={{ width: 150, fontSize: 12 }} type="number" placeholder="Production plan (g)" value={productionPlan} onChange={e => setProductionPlan(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" disabled={savingConfig} onClick={saveConfig}>{savingConfig ? 'Saving…' : 'Save'}</button>
        </div>
        <div className="card">
          {loadingRest ? <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl tbl-card" style={{ fontSize: 12 }}>
                <thead><tr><th>Site</th><th>Close day</th><th>Monthly budget (TSh)</th><th>Production plan (g)</th></tr></thead>
                <tbody>
                  {configs.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--label-4)', padding: 32 }}>No site config set yet.</td></tr>
                  ) : configs.map(c => (
                    <tr key={c.site_id}>
                      <td data-label="Site">{c.site_name ?? '-'}</td>
                      <td data-label="Close day">{c.close_day_of_month}</td>
                      <td data-label="Monthly budget (TSh)">{c.monthly_budget_tsh.toLocaleString()}</td>
                      <td data-label="Production plan (g)">{c.production_plan_g.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
