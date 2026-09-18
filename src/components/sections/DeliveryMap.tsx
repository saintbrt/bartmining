'use client'

import { useMemo, useState } from 'react'
import { DELIVERY_STOPS, DELIVERY_STOP_BY_SLUG, CARGO_CLASSES, BUFFER, type DeliveryStop } from '@/data/delivery-routes'

const BASIS_LABEL: Record<DeliveryStop['basis'], { label: string; color: string }> = {
  confirmed: { label: 'Confirmed figure', color: 'var(--gold-deep)' },
  computed: { label: 'Computed from confirmed legs', color: 'var(--gold)' },
  estimate: { label: 'Estimate — to be confirmed', color: 'var(--ink-3)' },
}

const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1))

const fmtDays = (h: number) => {
  const d = h / 24
  return d < 1 ? `${fmt(h)}h` : `${fmt(d)} day${d >= 1.5 ? 's' : ''}`
}

export default function DeliveryMap() {
  const [selected, setSelected] = useState<string>('mwanza')
  const [cargo, setCargo] = useState<string>('medium')

  const stop = DELIVERY_STOP_BY_SLUG.get(selected) ?? DELIVERY_STOPS[0]
  const cls = CARGO_CLASSES.find(c => c.id === cargo) ?? CARGO_CLASSES[1]

  const range = useMemo(() => {
    if (stop.slug === 'dar-es-salaam') return null
    const [lo, hi] = stop.hours
    if (cls.multiplier === null) return null // abnormal load: fixed note, not a multiplier
    const loAdj = lo * cls.multiplier
    const hiAdj = hi * cls.multiplier
    const loBuf = loAdj * (1 + BUFFER.low)
    const hiBuf = hiAdj * (1 + BUFFER.high)
    return { loAdj, hiAdj, loBuf, hiBuf }
  }, [stop, cls])

  const dar = DELIVERY_STOP_BY_SLUG.get('dar-es-salaam')!

  return (
    <div className="dmap-wrap">
      {/* Map */}
      <div className="dmap-card">
        <svg viewBox="0 0 620 560" role="img" aria-label="Simplified diagram of Bart Mining delivery routes across Tanzania" className="dmap-svg">
          {DELIVERY_STOPS.filter(s => s.slug !== 'dar-es-salaam').map(s => (
            <line key={s.slug} x1={dar.x} y1={dar.y} x2={s.x} y2={s.y} stroke="var(--line)" strokeWidth={1} />
          ))}
          {stop.slug !== 'dar-es-salaam' && (
            <line x1={dar.x} y1={dar.y} x2={stop.x} y2={stop.y} stroke="var(--gold)" strokeWidth={2.5} />
          )}
          {DELIVERY_STOPS.map(s => {
            const active = s.slug === selected
            const isDar = s.slug === 'dar-es-salaam'
            return (
              <g key={s.slug} transform={`translate(${s.x},${s.y})`} onClick={() => setSelected(s.slug)} style={{ cursor: 'pointer' }} role="button" aria-pressed={active} tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelected(s.slug) }}>
                <circle r={isDar ? 9 : active ? 8 : 5.5} fill={isDar ? 'var(--ink)' : active ? 'var(--gold)' : 'var(--bg-3)'} stroke={isDar ? 'var(--ink)' : 'var(--gold)'} strokeWidth={isDar ? 0 : 1.5} />
                <text
                  x={0} y={isDar ? -16 : active ? -14 : -11}
                  textAnchor="middle"
                  fontSize={isDar || active ? 13 : 11}
                  fontWeight={isDar || active ? 700 : 500}
                  fill="var(--ink)"
                  style={{ fontFamily: 'var(--font-sora)' }}
                >
                  {s.town}
                </text>
              </g>
            )
          })}
        </svg>
        <p className="dmap-caption">Simplified route diagram — not to scale. Click or tap a town, or use the dropdown, to see its delivery time.</p>
      </div>

      {/* Controls + result */}
      <div className="dmap-panel">
        <label className="dmap-label" htmlFor="dmap-town">Delivering to</label>
        <select id="dmap-town" className="dmap-select" value={selected} onChange={e => setSelected(e.target.value)}>
          {DELIVERY_STOPS.filter(s => s.slug !== 'dar-es-salaam').map(s => (
            <option key={s.slug} value={s.slug}>{s.town} — {s.region}</option>
          ))}
        </select>

        <label className="dmap-label" htmlFor="dmap-cargo">Cargo type</label>
        <select id="dmap-cargo" className="dmap-select" value={cargo} onChange={e => setCargo(e.target.value)}>
          {CARGO_CLASSES.filter(c => c.id !== 'light').map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <p className="dmap-example">{cls.example}</p>

        <div className="dmap-result">
          {cls.multiplier === null ? (
            <>
              <div className="dmap-result-figure">3+ days</div>
              <p className="dmap-result-sub">{cls.fixedNote}</p>
            </>
          ) : range ? (
            <>
              <div className="dmap-result-figure">{fmtDays(range.loBuf)} – {fmtDays(range.hiBuf)}</div>
              <p className="dmap-result-sub">
                Light-vehicle baseline {fmt(stop.hours[0])}–{fmt(stop.hours[1])}h, &times;{cls.multiplier} for {cls.label.toLowerCase()},
                plus a {Math.round(BUFFER.low * 100)}–{Math.round(BUFFER.high * 100)}% buffer for checkpoints, weather and loading.
              </p>
            </>
          ) : null}
        </div>

        <div className="dmap-basis">
          <span className="dmap-basis-dot" style={{ background: BASIS_LABEL[stop.basis].color }} />
          <span>{BASIS_LABEL[stop.basis].label}</span>
          {stop.note && <span className="dmap-basis-note">— {stop.note}</span>}
        </div>

        <p className="dmap-fineprint">
          Planning figures, not a delivery promise. Every quotation states the actual transit time for that consignment and route once it is confirmed.
        </p>
      </div>

      <style>{`
        .dmap-wrap { display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; align-items: start; }
        .dmap-card { background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 16px; }
        .dmap-svg { width: 100%; height: auto; display: block; }
        .dmap-caption { font-size: 13px; color: var(--ink-3); margin-top: 10px; text-align: center; }
        .dmap-panel { background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 22px; display: flex; flex-direction: column; gap: 6px; }
        .dmap-label { font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); margin-top: 14px; }
        .dmap-label:first-child { margin-top: 0; }
        .dmap-select { width: 100%; font-size: 15.5px; padding: 10px 12px; border-radius: var(--r-sm); border: 1px solid var(--line); background: var(--bg); color: var(--ink); margin-top: 6px; }
        .dmap-example { font-size: 13px; color: var(--ink-3); margin-top: 4px; }
        .dmap-result { background: var(--paper); border: 1px solid var(--line); border-radius: var(--r-md); padding: 16px; margin-top: 18px; }
        .dmap-result-figure { font-family: var(--font-sora); font-weight: 800; font-size: 30px; letter-spacing: -0.02em; color: var(--gold-deep); }
        .dmap-result-sub { font-size: 13.5px; color: var(--ink-2); line-height: 1.6; margin-top: 8px; }
        .dmap-basis { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12.5px; color: var(--ink-3); margin-top: 14px; }
        .dmap-basis-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .dmap-basis-note { color: var(--ink-3); }
        .dmap-fineprint { font-size: 12.5px; color: var(--ink-3); line-height: 1.6; margin-top: 14px; border-top: 1px solid var(--line-2); padding-top: 12px; }
        @media (max-width: 860px) { .dmap-wrap { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
