'use client'

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import {
  getTanks, getLatestTankColors, getLeachingPeriods, openLeachingPeriod, closeLeachingPeriod,
  getColorTests, logColorTest, getLeachingPeriodCost,
  getPits, createPit, getPitMachinery, assignMachinery, getPitsMonthlyCost,
  listSimpleTable, listEquipment,
  type TankRow, type TankLatestColor, type LeachingPeriodRow, type ColorTestRow, type PeriodCostRow,
  type PitRow, type PitMachineryRow, type PitMonthlyCostRow, type SimpleRow, type EquipmentRow,
} from '@/lib/goldpass/erp'
import { PlantMap } from '@/components/goldpass/PlantMap'
import { PitsGrid } from '@/components/goldpass/PitsGrid'
import { MultiLineChart, SERIES_COLORS } from '@/components/goldpass/charts'

function todayStr() { return new Date().toISOString().slice(0, 10) }

export default function PlantPage() {
  const [tanks, setTanks] = useState<TankRow[]>([])
  const [tankColors, setTankColors] = useState<Record<string, TankLatestColor>>({})
  const [periods, setPeriods] = useState<LeachingPeriodRow[]>([])
  const [colorTests, setColorTests] = useState<ColorTestRow[]>([])

  const [pits, setPits] = useState<PitRow[]>([])
  const [pitMachinery, setPitMachinery] = useState<PitMachineryRow[]>([])
  const [mineLocations, setMineLocations] = useState<SimpleRow[]>([])
  const [projects, setProjects] = useState<SimpleRow[]>([])
  const [equipment, setEquipment] = useState<EquipmentRow[]>([])
  const [pitCosts, setPitCosts] = useState<PitMonthlyCostRow[]>([])

  const [loading, setLoading] = useState(true)

  const [openPeriodDate, setOpenPeriodDate] = useState(todayStr())
  const [openingPeriod, setOpeningPeriod] = useState(false)
  const [closingId, setClosingId] = useState<string | null>(null)
  const [periodCosts, setPeriodCosts] = useState<Record<string, PeriodCostRow[]>>({})

  const [testTankId, setTestTankId] = useState('')
  const [testDate, setTestDate] = useState(todayStr())
  const [testResult, setTestResult] = useState<'black' | 'grey' | 'clear'>('black')
  const [testNotes, setTestNotes] = useState('')
  const [logging, setLogging] = useState(false)

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
      tanksData, colorsData, periodsData, testsData,
      pitsData, machineryData, locationsData, projectsData, equipmentData, pitCostData,
    ] = await Promise.all([
      getTanks(), getLatestTankColors(), getLeachingPeriods(), getColorTests(),
      getPits(), getPitMachinery(), listSimpleTable('mine_locations'), listSimpleTable('projects'),
      listEquipment(), getPitsMonthlyCost(),
    ])
    setTanks(tanksData); setTankColors(colorsData); setPeriods(periodsData); setColorTests(testsData)
    setPits(pitsData); setPitMachinery(machineryData); setMineLocations(locationsData)
    setProjects(projectsData); setEquipment(equipmentData); setPitCosts(pitCostData)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openPeriod = periods.find(p => p.status === 'open')

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

  async function handleOpenPeriod() {
    setOpeningPeriod(true)
    const ok = await openLeachingPeriod(openPeriodDate)
    setOpeningPeriod(false)
    if (!ok) return
    notify('success', 'Leaching period opened.')
    load()
  }

  async function handleClosePeriod(id: string) {
    setClosingId(id)
    const ok = await closeLeachingPeriod(id, todayStr())
    setClosingId(null)
    if (!ok) return
    notify('success', 'Leaching period closed.')
    load()
  }

  async function loadPeriodCost(id: string) {
    if (periodCosts[id]) { setPeriodCosts(prev => { const next = { ...prev }; delete next[id]; return next }); return }
    const rows = await getLeachingPeriodCost(id)
    setPeriodCosts(prev => ({ ...prev, [id]: rows }))
  }

  async function handleLogColorTest() {
    if (!testTankId) { notify('warn', 'Select a tank.'); return }
    setLogging(true)
    const ok = await logColorTest({ tankId: testTankId, testDate, result: testResult, notes: testNotes.trim() || undefined })
    setLogging(false)
    if (!ok) return
    notify('success', 'Color test logged.')
    setTestNotes('')
    load()
  }

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
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Plant</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>
          Tanks and pits at a glance. Tank state reflects the latest color test per tank; pit costs roll
          up from the ledger through each pit's cost centre.
        </p>
      </div>

      <div className="plant-split" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="plant-panel-title">Tanks</div>
          <PlantMap tanks={tanks} loading={loading} tankColors={tankColors} />
        </div>
        <div className="card">
          <div className="plant-panel-title">Pits</div>
          <PitsGrid pits={pits} loading={loading} machineryCountByPit={machineryCountByPit} locationNames={locationNames} />
        </div>
      </div>

      {pitChartSeries.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Pit cost comparison</div>
          <MultiLineChart data={pitChartData} series={pitChartSeries} prefix="TSh " emptyLabel="No pit cost data yet." />
        </div>
      )}

      <div className="plant-split" style={{ marginBottom: 24 }}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Add pit</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <input className="input" style={{ flex: 1, minWidth: 120, fontSize: 12 }} placeholder="Pit name *" value={pitName} onChange={e => setPitName(e.target.value)} />
            <input className="input" style={{ width: 100, fontSize: 12 }} placeholder="Code" value={pitCode} onChange={e => setPitCode(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <select className="input" style={{ flex: 1, minWidth: 120, fontSize: 12 }} value={pitLocationId} onChange={e => setPitLocationId(e.target.value)}>
              <option value="">Location (optional)</option>
              {mineLocations.map(l => <option key={l.id} value={l.id}>{l.name as string}</option>)}
            </select>
            <select className="input" style={{ flex: 1, minWidth: 120, fontSize: 12 }} value={pitProjectId} onChange={e => setPitProjectId(e.target.value)}>
              <option value="">Project (optional)</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name as string}</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" disabled={creatingPit} onClick={handleCreatePit}>{creatingPit ? 'Creating…' : 'Create pit'}</button>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Assign machinery</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <select className="input" style={{ flex: 1, minWidth: 120, fontSize: 12 }} value={assignPitId} onChange={e => setAssignPitId(e.target.value)}>
              <option value="">Select pit…</option>
              {pits.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select className="input" style={{ flex: 1, minWidth: 120, fontSize: 12 }} value={assignEquipmentId} onChange={e => setAssignEquipmentId(e.target.value)}>
              <option value="">Select machine…</option>
              {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input className="input" style={{ flex: 1, fontSize: 12 }} placeholder="Team notes (optional)" value={assignNotes} onChange={e => setAssignNotes(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" disabled={assigning} onClick={handleAssignMachinery}>{assigning ? 'Assigning…' : 'Assign'}</button>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 680, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Leaching period</div>
        {openPeriod ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--label-2)' }}>
              Open since {openPeriod.period_start}{openPeriod.notes ? ` (${openPeriod.notes})` : ''}
            </span>
            <button className="btn btn-secondary btn-sm" disabled={closingId === openPeriod.id} onClick={() => handleClosePeriod(openPeriod.id)}>
              {closingId === openPeriod.id ? 'Closing…' : 'Close period'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input className="input" style={{ width: 160, fontSize: 12 }} type="date" value={openPeriodDate} onChange={e => setOpenPeriodDate(e.target.value)} />
            <button className="btn btn-primary btn-sm" disabled={openingPeriod} onClick={handleOpenPeriod}>
              {openingPeriod ? 'Opening…' : 'Open period'}
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Period history</div>
        {periods.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 8 }}>No leaching periods yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl tbl-card" style={{ fontSize: 12 }}>
              <thead>
                <tr><th>Start</th><th>End</th><th>Status</th><th>Cost</th></tr>
              </thead>
              <tbody>
                {periods.map(p => (
                  <Fragment key={p.id}>
                    <tr>
                      <td>{p.period_start}</td>
                      <td>{p.period_end ?? 'open'}</td>
                      <td>{p.status}</td>
                      <td><button className="btn btn-secondary btn-sm" onClick={() => loadPeriodCost(p.id)}>{periodCosts[p.id] ? 'Hide' : 'Show'}</button></td>
                    </tr>
                    {periodCosts[p.id] && (
                      <tr>
                        <td colSpan={4} style={{ background: 'var(--bg-3)' }}>
                          {periodCosts[p.id].length === 0 ? (
                            <span style={{ fontSize: 11, color: 'var(--label-4)' }}>No cost events in this period.</span>
                          ) : (
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '4px 0' }}>
                              {periodCosts[p.id].map(c => (
                                <span key={c.month} style={{ fontSize: 11, color: 'var(--label-2)' }}>
                                  {c.month.slice(0, 7)}: TSh {Number(c.total_cost_tsh).toLocaleString()}
                                </span>
                              ))}
                            </div>
                          )}
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

      <div className="card" style={{ maxWidth: 680, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Log color test</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <select className="input" style={{ flex: 1, minWidth: 120, fontSize: 12 }} value={testTankId} onChange={e => setTestTankId(e.target.value)}>
            <option value="">Select tank…</option>
            {tanks.map(t => <option key={t.id} value={t.id}>{t.tank_code}</option>)}
          </select>
          <input className="input" style={{ width: 140, fontSize: 12 }} type="date" value={testDate} onChange={e => setTestDate(e.target.value)} />
          <select className="input" style={{ width: 110, fontSize: 12 }} value={testResult} onChange={e => setTestResult(e.target.value as 'black' | 'grey' | 'clear')}>
            <option value="black">Black</option>
            <option value="grey">Grey</option>
            <option value="clear">Clear</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input className="input" style={{ flex: 1, fontSize: 12 }} placeholder="Notes (optional)" value={testNotes} onChange={e => setTestNotes(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-sm" disabled={logging} onClick={handleLogColorTest}>{logging ? 'Logging…' : 'Log test'}</button>
      </div>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Recent color tests</div>
        {colorTests.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 8 }}>No color tests logged yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl tbl-card" style={{ fontSize: 12 }}>
              <thead>
                <tr><th>Date</th><th>Tank</th><th>Result</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {colorTests.slice(0, 30).map(t => (
                  <tr key={t.id}>
                    <td>{t.test_date}</td>
                    <td>{tanks.find(tk => tk.id === t.tank_id)?.tank_code ?? t.tank_id}</td>
                    <td>{t.result}</td>
                    <td>{t.notes ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
