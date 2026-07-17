'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import {
  getTanks, getLatestTankColors,
  getPits, createPit, getPitMachinery, assignMachinery, getPitsMonthlyCost,
  getRecoveryReconciliation,
  getTankRoundStatus, getRoundTimeline, getRoundCycleTimes, getRoundFaultFlags,
  listSimpleTable, listEquipment,
  type TankRow, type TankLatestColor,
  type PitRow, type PitMachineryRow, type PitMonthlyCostRow, type SimpleRow, type EquipmentRow,
  type RecoveryReconciliationRow,
  type TankRoundStatusRow, type RoundTimelineRow, type RoundCycleTimeRow,
} from '@/lib/goldpass/erp'
import { PlantMap } from '@/components/goldpass/PlantMap'
import { PitsGrid } from '@/components/goldpass/PitsGrid'
import { TankTimeline } from '@/components/goldpass/TankTimeline'
import { TankStatusBoard } from '@/components/goldpass/TankStatusBoard'
import { Modal } from '@/components/goldpass/Modal'
import { MultiLineChart, LineTrendChart, SERIES_COLORS } from '@/components/goldpass/charts'

/* Plant is admin-only viewing. Tank rounds, color tests, and elution
   batches are entered exclusively through the field manager's mobile app
   (a separate codebase, goldpass-field); this page never writes any of
   that data, it only displays what the mobile app has already logged.
   The one exception is structural setup (pits/machinery), which is
   admin-side equipment/cost-centre configuration, not process logging. */
export default function PlantPage() {
  const [tanks, setTanks] = useState<TankRow[]>([])
  const [tankColors, setTankColors] = useState<Record<string, TankLatestColor>>({})

  const [pits, setPits] = useState<PitRow[]>([])
  const [pitMachinery, setPitMachinery] = useState<PitMachineryRow[]>([])
  const [mineLocations, setMineLocations] = useState<SimpleRow[]>([])
  const [projects, setProjects] = useState<SimpleRow[]>([])
  const [equipment, setEquipment] = useState<EquipmentRow[]>([])
  const [pitCosts, setPitCosts] = useState<PitMonthlyCostRow[]>([])

  const [reconciliation, setReconciliation] = useState<RecoveryReconciliationRow[]>([])
  const [roundStatus, setRoundStatus] = useState<TankRoundStatusRow[]>([])
  const [timeline, setTimeline] = useState<RoundTimelineRow[]>([])
  const [cycleTimes, setCycleTimes] = useState<RoundCycleTimeRow[]>([])
  const [overdueRoundIds, setOverdueRoundIds] = useState<Set<string>>(new Set())

  const [loading, setLoading] = useState(true)
  const [setupOpen, setSetupOpen] = useState(false)

  const [pitName, setPitName] = useState('')
  const [pitCode, setPitCode] = useState('')
  const [pitLocationId, setPitLocationId] = useState('')
  const [pitProjectId, setPitProjectId] = useState('')
  const [creatingPit, setCreatingPit] = useState(false)

  const [assignPitId, setAssignPitId] = useState('')
  const [assignEquipmentId, setAssignEquipmentId] = useState('')
  const [assignNotes, setAssignNotes] = useState('')
  const [assigning, setAssigning] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [
      tanksData, colorsData,
      pitsData, machineryData, locationsData, projectsData, equipmentData, pitCostData,
      reconciliationData, roundStatusData, timelineData, cycleTimeData, faultFlagsData,
    ] = await Promise.all([
      getTanks(), getLatestTankColors(),
      getPits(), getPitMachinery(), listSimpleTable('mine_locations'), listSimpleTable('projects'),
      listEquipment(), getPitsMonthlyCost(),
      getRecoveryReconciliation(), getTankRoundStatus(), getRoundTimeline(), getRoundCycleTimes(),
      getRoundFaultFlags(),
    ])
    setTanks(tanksData); setTankColors(colorsData)
    setPits(pitsData); setPitMachinery(machineryData); setMineLocations(locationsData)
    setProjects(projectsData); setEquipment(equipmentData); setPitCosts(pitCostData)
    setReconciliation(reconciliationData)
    setRoundStatus(roundStatusData); setTimeline(timelineData); setCycleTimes(cycleTimeData)
    setOverdueRoundIds(new Set(faultFlagsData.map(f => f.round_id)))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const locationNames = useMemo(() => {
    const out: Record<string, string> = {}
    for (const loc of mineLocations) out[loc.id] = loc.name as string
    return out
  }, [mineLocations])

  const machineryCountByPit = useMemo(() => {
    const out: Record<string, number> = {}
    for (const m of pitMachinery) out[m.pit_id] = (out[m.pit_id] ?? 0) + 1
    return out
  }, [pitMachinery])

  const pitChartData = useMemo(() => {
    const months = Array.from(new Set(pitCosts.map(c => c.month))).sort()
    const pitNames = Array.from(new Set(pitCosts.map(c => c.pit_name)))
    return months.map(month => {
      const row: Record<string, string | number> = { label: month.slice(0, 7) }
      for (const name of pitNames) {
        const match = pitCosts.find(c => c.month === month && c.pit_name === name)
        row[name] = match ? Number(match.total_cost_tsh) : 0
      }
      return row
    })
  }, [pitCosts])

  const pitChartSeries = useMemo(() => {
    const pitNames = Array.from(new Set(pitCosts.map(c => c.pit_name)))
    return pitNames.map((name, i) => ({ key: name, name, color: SERIES_COLORS[i % SERIES_COLORS.length] }))
  }, [pitCosts])

  const reconciliationChartData = useMemo(() => reconciliation.map(r => ({
    label: r.month.slice(0, 7),
    'Recovered (elution)': Number(r.recovered_g),
    'Sold (sales)': Number(r.sold_g),
  })), [reconciliation])

  const reconciliationSeries = [
    { key: 'Recovered (elution)', name: 'Recovered (elution)', color: SERIES_COLORS[0] },
    { key: 'Sold (sales)', name: 'Sold (sales)', color: SERIES_COLORS[1] },
  ]

  const cycleTimeChartData = useMemo(() => cycleTimes.map(c => ({
    label: c.month.slice(0, 7), value: c.avg_days ?? 0,
  })), [cycleTimes])

  async function handleCreatePit() {
    if (!pitName.trim()) { notify('warn', 'Enter a pit name.'); return }
    setCreatingPit(true)
    const id = await createPit({
      name: pitName.trim(), code: pitCode.trim() || undefined,
      mineLocationId: pitLocationId || undefined, projectId: pitProjectId || undefined,
    })
    setCreatingPit(false)
    if (!id) return
    notify('success', 'Pit created.')
    setPitName(''); setPitCode(''); setPitLocationId(''); setPitProjectId('')
    load()
  }

  async function handleAssignMachinery() {
    if (!assignPitId || !assignEquipmentId) { notify('warn', 'Select a pit and a machine.'); return }
    setAssigning(true)
    const ok = await assignMachinery({ pitId: assignPitId, equipmentId: assignEquipmentId, teamNotes: assignNotes.trim() || undefined })
    setAssigning(false)
    if (!ok) return
    notify('success', 'Machinery assigned.')
    setAssignNotes('')
    load()
  }

  return (
    <div className="content content-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="page-title">Plant</h2>
          <p className="page-sub">
            Tank rounds, cycle time, and pit status at a glance. Logged from the field on the
            mobile app; this page is for viewing, not data entry.
          </p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setSetupOpen(true)}>+ Structural setup</button>
      </div>

      <div className="plant-split" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="plant-panel-title">Tanks</div>
          <PlantMap tanks={tanks} loading={loading} tankColors={tankColors} />
        </div>
        <div className="card">
          <div className="plant-panel-title">Pits</div>
          <PitsGrid pits={pits} loading={loading} machineryCountByPit={machineryCountByPit} locationNames={locationNames} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">Leaching round timeline</div>
        <TankTimeline rows={timeline} overdueRoundIds={overdueRoundIds} />
      </div>

      <div className="plant-split" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-title">Round cycle time (avg days, closed rounds)</div>
          <LineTrendChart data={cycleTimeChartData} emptyLabel="No closed rounds yet." />
        </div>
        {pitChartSeries.length > 0 && (
          <div className="card">
            <div className="section-title">Pit cost comparison</div>
            <MultiLineChart data={pitChartData} series={pitChartSeries} prefix="TSh " emptyLabel="No pit cost data yet." />
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title">Tank status</div>
        <TankStatusBoard rows={roundStatus} loading={loading} />
      </div>

      <div className="card">
        <div className="section-title">Recovery reconciliation</div>
        <p style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 12 }}>
          Physical gold recovered (elution) against fine gold sold (sales), by month. Elution is the
          source of truth for grams recovered; sales is the source of truth for money. A gap is stock
          on hand or worth a closer look, not an error to force-match.
        </p>
        <MultiLineChart data={reconciliationChartData} series={reconciliationSeries} emptyLabel="No recovery data yet." />
      </div>

      {setupOpen && (
        <Modal title="Structural setup" onClose={() => setSetupOpen(false)}>
          <div style={{ marginBottom: 20 }}>
            <div className="section-title">Add pit</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <input className="input input-sm" style={{ flex: 1, minWidth: 120 }} placeholder="Pit name *" value={pitName} onChange={e => setPitName(e.target.value)} />
              <input className="input input-sm" style={{ width: 100 }} placeholder="Code" value={pitCode} onChange={e => setPitCode(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <select className="input input-sm" style={{ flex: 1, minWidth: 120 }} value={pitLocationId} onChange={e => setPitLocationId(e.target.value)}>
                <option value="">Location (optional)</option>
                {mineLocations.map(l => <option key={l.id} value={l.id}>{l.name as string}</option>)}
              </select>
              <select className="input input-sm" style={{ flex: 1, minWidth: 120 }} value={pitProjectId} onChange={e => setPitProjectId(e.target.value)}>
                <option value="">Project (optional)</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name as string}</option>)}
              </select>
            </div>
            <button className="btn btn-primary btn-sm" disabled={creatingPit} onClick={handleCreatePit}>{creatingPit ? 'Creating…' : 'Create pit'}</button>
          </div>

          <div>
            <div className="section-title">Assign machinery</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <select className="input input-sm" style={{ flex: 1, minWidth: 120 }} value={assignPitId} onChange={e => setAssignPitId(e.target.value)}>
                <option value="">Select pit…</option>
                {pits.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select className="input input-sm" style={{ flex: 1, minWidth: 120 }} value={assignEquipmentId} onChange={e => setAssignEquipmentId(e.target.value)}>
                <option value="">Select machine…</option>
                {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input className="input input-sm" style={{ flex: 1 }} placeholder="Team notes (optional)" value={assignNotes} onChange={e => setAssignNotes(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" disabled={assigning} onClick={handleAssignMachinery}>{assigning ? 'Assigning…' : 'Assign'}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
