'use client'

import type { TankRow } from '@/lib/goldpass/erp'

/* Static top-view plant map, phase A: tank code + volume only, one row per
   line (A/B/C), plus the process flow footer. Live tank fill state driven by
   color_tests (black/grey/clear) is phase B and not wired here yet, per
   BUILD.md sections 4.7 and 6, so every tank renders in the same neutral
   state, no colour is a proxy for "unknown" here. */

const LINES: { line: 'A' | 'B' | 'C'; label: string }[] = [
  { line: 'A', label: 'Line A' },
  { line: 'B', label: 'Line B' },
  { line: 'C', label: 'Line C' },
]

const FLOW_STEPS = ['Collection tank', 'Carbon tail 1', 'Carbon tail 2', 'Barren out', 'Elution']

function TankCell({ tank }: { tank: TankRow }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '12px 8px', minWidth: 84 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--label-1)' }}>{tank.tank_code}</div>
      <div style={{ fontSize: 10, color: 'var(--label-3)', marginTop: 2 }}>{tank.volume_m3.toLocaleString()} m³</div>
    </div>
  )
}

export function PlantMap({ tanks, loading }: { tanks: TankRow[]; loading: boolean }) {
  if (loading) {
    return <div style={{ fontSize: 12, color: 'var(--label-4)', padding: 16 }}>Loading…</div>
  }
  if (tanks.length === 0) {
    return (
      <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '28px 0', textAlign: 'center' }}>
        No tanks configured yet, run the plant tanks migration to populate this.
      </div>
    )
  }

  return (
    <div>
      {LINES.map(({ line, label }) => {
        const lineTanks = tanks.filter(t => t.line === line)
        if (lineTanks.length === 0) return null
        return (
          <div key={line} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {lineTanks.map(t => <TankCell key={t.id} tank={t} />)}
            </div>
          </div>
        )
      })}

      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--sep)' }}>
        <div style={{ fontSize: 11, color: 'var(--label-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Leaching to elution
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {FLOW_STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 11, padding: '6px 10px', borderRadius: 8, background: 'var(--bg-3)', color: 'var(--label-2)' }}>{step}</div>
              {i < FLOW_STEPS.length - 1 && <span style={{ color: 'var(--label-4)', fontSize: 12 }}>→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
