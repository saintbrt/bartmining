'use client'

import { useCallback, useEffect, useState } from 'react'
import { notify } from '@/lib/goldpass/notify'
import {
  getTanks, getTankRoundStatus, startRound, endRound,
  getColorTests, logColorTest,
  getElutionBatches, logElutionBatch,
  type TankRow, type TankRoundStatusRow, type ColorTestRow, type ElutionBatchRow,
} from '@/lib/goldpass/erp'
import { TankStatusBoard } from '@/components/goldpass/TankStatusBoard'
import { Modal } from '@/components/goldpass/Modal'

function todayStr() { return new Date().toISOString().slice(0, 10) }

type RoundAction = { tankId: string; tankCode: string; mode: 'start' | 'end'; roundId?: string }

export default function ChemicalManagerPage() {
  const [tanks, setTanks] = useState<TankRow[]>([])
  const [roundStatus, setRoundStatus] = useState<TankRoundStatusRow[]>([])
  const [colorTests, setColorTests] = useState<ColorTestRow[]>([])
  const [elutionBatches, setElutionBatches] = useState<ElutionBatchRow[]>([])
  const [loading, setLoading] = useState(true)

  const [roundAction, setRoundAction] = useState<RoundAction | null>(null)
  const [roundDate, setRoundDate] = useState(todayStr())
  const [roundNotes, setRoundNotes] = useState('')
  const [savingRound, setSavingRound] = useState(false)

  const [colorTestOpen, setColorTestOpen] = useState(false)
  const [testTankId, setTestTankId] = useState('')
  const [testDate, setTestDate] = useState(todayStr())
  const [testResult, setTestResult] = useState<'black' | 'grey' | 'clear'>('black')
  const [testNotes, setTestNotes] = useState('')
  const [logging, setLogging] = useState(false)

  const [elutionOpen, setElutionOpen] = useState(false)
  const [batchDate, setBatchDate] = useState(todayStr())
  const [goldRecoveredG, setGoldRecoveredG] = useState('')
  const [carbonStageNotes, setCarbonStageNotes] = useState('')
  const [loggingBatch, setLoggingBatch] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [tanksData, roundStatusData, testsData, elutionData] = await Promise.all([
      getTanks(), getTankRoundStatus(), getColorTests(), getElutionBatches(),
    ])
    setTanks(tanksData); setRoundStatus(roundStatusData); setColorTests(testsData); setElutionBatches(elutionData)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openRoundAction(row: TankRoundStatusRow) {
    setRoundAction(row.round_id
      ? { tankId: row.tank_id, tankCode: row.tank_code, mode: 'end', roundId: row.round_id }
      : { tankId: row.tank_id, tankCode: row.tank_code, mode: 'start' })
    setRoundDate(todayStr())
    setRoundNotes('')
  }

  async function handleSaveRound() {
    if (!roundAction) return
    setSavingRound(true)
    const ok = roundAction.mode === 'start'
      ? await startRound(roundAction.tankId, roundDate, roundNotes.trim() || undefined)
      : await endRound(roundAction.roundId!, roundDate, roundNotes.trim() || undefined)
    setSavingRound(false)
    if (!ok) return
    notify('success', roundAction.mode === 'start' ? 'Round started.' : 'Round ended.')
    setRoundAction(null)
    load()
  }

  async function handleLogColorTest() {
    if (!testTankId) { notify('warn', 'Select a tank.'); return }
    setLogging(true)
    const ok = await logColorTest({ tankId: testTankId, testDate, result: testResult, notes: testNotes.trim() || undefined })
    setLogging(false)
    if (!ok) return
    notify('success', 'Color test logged.')
    setColorTestOpen(false); setTestTankId(''); setTestNotes('')
    load()
  }

  async function handleLogElutionBatch() {
    if (!goldRecoveredG || Number(goldRecoveredG) < 0) { notify('warn', 'Enter grams recovered.'); return }
    setLoggingBatch(true)
    const ok = await logElutionBatch({
      batchDate, goldRecoveredG: Number(goldRecoveredG),
      carbonStageNotes: carbonStageNotes.trim() || undefined,
    })
    setLoggingBatch(false)
    if (!ok) return
    notify('success', 'Elution batch logged.')
    setElutionOpen(false); setGoldRecoveredG(''); setCarbonStageNotes('')
    load()
  }

  return (
    <div className="content content-pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Chemical Manager</h2>
          <p style={{ fontSize: 12, color: 'var(--label-3)' }}>
            Start or end a tank's leaching round, log a color test, or log an elution batch. Log
            whenever something changes, on no fixed schedule; a tank flags "stale" here after 5
            days with no color test.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => { setColorTestOpen(true); setTestDate(todayStr()) }}>Log color test</button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setElutionOpen(true); setBatchDate(todayStr()) }}>Log elution batch</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Tanks</div>
        <TankStatusBoard
          rows={roundStatus}
          loading={loading}
          actions={row => (
            <button className="btn btn-primary btn-sm" onClick={() => openRoundAction(row)}>
              {row.round_id ? 'End round' : 'Start round'}
            </button>
          )}
        />
      </div>

      <div className="plant-split">
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Recent color tests</div>
          {colorTests.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 8 }}>No color tests logged yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl tbl-card" style={{ fontSize: 12 }}>
                <thead><tr><th>Date</th><th>Tank</th><th>Result</th><th>Notes</th></tr></thead>
                <tbody>
                  {colorTests.slice(0, 30).map(t => (
                    <tr key={t.id}>
                      <td data-label="Date">{t.test_date}</td>
                      <td data-label="Tank">{tanks.find(tk => tk.id === t.tank_id)?.tank_code ?? t.tank_id}</td>
                      <td data-label="Result">{t.result}</td>
                      <td data-label="Notes">{t.notes ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Recent elution batches</div>
          {elutionBatches.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 8 }}>No elution batches logged yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl tbl-card" style={{ fontSize: 12 }}>
                <thead><tr><th>Date</th><th>Recovered (g)</th><th>Notes</th></tr></thead>
                <tbody>
                  {elutionBatches.slice(0, 30).map(b => (
                    <tr key={b.id}>
                      <td data-label="Date">{b.batch_date}</td>
                      <td data-label="Recovered (g)">{b.gold_recovered_g.toLocaleString()}</td>
                      <td data-label="Notes">{b.carbon_stage_notes ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {roundAction && (
        <Modal title={`${roundAction.mode === 'start' ? 'Start' : 'End'} round: ${roundAction.tankCode}`} onClose={() => setRoundAction(null)}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <input className="input" style={{ width: 160, fontSize: 12 }} type="date" value={roundDate} onChange={e => setRoundDate(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input className="input" style={{ flex: 1, fontSize: 12 }} placeholder="Notes (optional)" value={roundNotes} onChange={e => setRoundNotes(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" disabled={savingRound} onClick={handleSaveRound}>
            {savingRound ? 'Saving…' : roundAction.mode === 'start' ? 'Start round' : 'End round'}
          </button>
        </Modal>
      )}

      {colorTestOpen && (
        <Modal title="Log color test" onClose={() => setColorTestOpen(false)}>
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
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input className="input" style={{ flex: 1, fontSize: 12 }} placeholder="Notes (optional)" value={testNotes} onChange={e => setTestNotes(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" disabled={logging} onClick={handleLogColorTest}>{logging ? 'Logging…' : 'Log test'}</button>
        </Modal>
      )}

      {elutionOpen && (
        <Modal title="Log elution batch" onClose={() => setElutionOpen(false)}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <input className="input" style={{ width: 140, fontSize: 12 }} type="date" value={batchDate} onChange={e => setBatchDate(e.target.value)} />
            <input className="input" style={{ flex: 1, minWidth: 120, fontSize: 12 }} type="number" placeholder="Gold recovered (g) *" value={goldRecoveredG} onChange={e => setGoldRecoveredG(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input className="input" style={{ flex: 1, fontSize: 12 }} placeholder="Carbon stage notes (optional)" value={carbonStageNotes} onChange={e => setCarbonStageNotes(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" disabled={loggingBatch} onClick={handleLogElutionBatch}>{loggingBatch ? 'Logging…' : 'Log batch'}</button>
        </Modal>
      )}
    </div>
  )
}
