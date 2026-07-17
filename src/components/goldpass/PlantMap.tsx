'use client'

import type { TankRow, TankLatestColor } from '@/lib/goldpass/erp'

/* Top-view plant map, one row per line (A/B/C), plus the process flow footer.
   Tank fill state comes from the latest color_tests row per tank (phase B):
   black = gold still present, grey = partial with resistance, clear = fully
   extracted. Colour is paired with a text label, never colour alone, so the
   state reads the same for colorblind users. */

const LINES: { line: 'A' | 'B' | 'C'; label: string }[] = [
  { line: 'A', label: 'Line A' },
  { line: 'B', label: 'Line B' },
  { line: 'C', label: 'Line C' },
]

const FLOW_STEPS = ['Collection tank', 'Carbon tail 1', 'Carbon tail 2', 'Barren out', 'Elution']

const COLOR_STATE: Record<'black' | 'grey' | 'clear', { label: string; swatch: string }> = {
  black: { label: 'Black', swatch: 'var(--label-1)' },
  grey:  { label: 'Grey',  swatch: 'var(--label-4)' },
  clear: { label: 'Clear', swatch: 'var(--green)' },
}

function TankCell({ tank, latest }: { tank: TankRow; latest?: TankLatestColor }) {
  const state = latest ? COLOR_STATE[latest.result] : null
  return (
    <div className="card grid-cell">
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--label-1)' }}>{tank.tank_code}</div>
      <div className="num" style={{ fontSize: 10, color: 'var(--label-3)', marginTop: 2 }}>{tank.volume_m3.toLocaleString()} m³</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 6 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: state ? state.swatch : 'transparent',
          border: state ? 'none' : '1px dashed var(--label-4)',
        }} />
        <span style={{ fontSize: 10, color: 'var(--label-3)' }}>{state ? state.label : 'No test'}</span>
      </div>
    </div>
  )
}

export function PlantMap({ tanks, loading, tankColors }: { tanks: TankRow[]; loading: boolean; tankColors?: Record<string, TankLatestColor> }) {
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
            <div className="plant-panel-title">{label}</div>
            <div className="grid-cell-set">
              {lineTanks.map(t => <TankCell key={t.id} tank={t} latest={tankColors?.[t.id]} />)}
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
              <div style={{ fontSize: 11, padding: '6px 10px', borderRadius: 'var(--r-sm)', background: 'var(--bg-3)', color: 'var(--label-2)' }}>{step}</div>
              {i < FLOW_STEPS.length - 1 && <span style={{ color: 'var(--label-4)', fontSize: 12 }}>→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
