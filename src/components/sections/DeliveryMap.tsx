'use client'

import { useEffect, useMemo, useState } from 'react'
import { DELIVERY_STOPS, DELIVERY_STOP_BY_SLUG, CARGO_CLASSES, BUFFER, ORIGINS, type RouteTime } from '@/data/delivery-routes'

const BASIS_LABEL: Record<RouteTime['basis'], { label: string; color: string }> = {
  confirmed: { label: 'Confirmed figure', color: 'var(--gold-deep)' },
  computed: { label: 'Computed from confirmed legs', color: 'var(--gold)' },
  estimate: { label: 'Estimate — to be confirmed', color: 'var(--ink-3)' },
}

const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1))
const fmtDays = (h: number) => {
  const d = h / 24
  return d < 1 ? `${fmt(h)}h` : `${fmt(d)} day${d >= 1.5 ? 's' : ''}`
}

/**
 * A loose, decorative outline of mainland Tanzania — a backdrop for the
 * route diagram, not a geographic reference. It shares the map's coordinate
 * space so the town markers roughly sit "inside" it, but the coastline and
 * borders are hand-drawn approximations, not traced data.
 */
const TZ_SILHOUETTE = 'M120,20 C170,10 230,40 260,80 C300,70 340,60 380,90 C420,60 460,80 470,120 C500,150 520,190 500,230 C540,260 560,320 555,390 C560,430 545,470 555,510 C540,530 500,535 480,520 C450,510 430,500 400,480 C360,510 300,520 260,545 C210,555 160,545 140,510 C120,480 130,450 110,420 C80,400 60,360 70,320 C55,290 60,250 90,230 C70,190 75,150 100,120 C90,80 95,45 120,20 Z'

export default function DeliveryMap() {
  const [origin, setOrigin] = useState<string>('dar-es-salaam')
  const [selected, setSelected] = useState<string>('mwanza')
  const [cargo, setCargo] = useState<string>('medium')

  // A destination can't be its own origin.
  useEffect(() => {
    if (selected === origin) {
      setSelected(ORIGINS.find(o => o.id !== origin)?.id ?? origin)
    }
  }, [origin, selected])

  const originStop = DELIVERY_STOP_BY_SLUG.get(origin)!
  const stop = DELIVERY_STOP_BY_SLUG.get(selected) ?? DELIVERY_STOPS[0]
  const cls = CARGO_CLASSES.find(c => c.id === cargo) ?? CARGO_CLASSES[1]
  const route = origin === 'mwanza' ? stop.fromMwanza : stop.fromDar

  const range = useMemo(() => {
    if (stop.slug === origin || cls.multiplier === null) return null
    const [lo, hi] = route.hours
    const loAdj = lo * cls.multiplier
    const hiAdj = hi * cls.multiplier
    return { loBuf: loAdj * (1 + BUFFER.low), hiBuf: hiAdj * (1 + BUFFER.high) }
  }, [stop, origin, route, cls])

  return (
    <div className="dmap-wrap">
      {/* Map */}
      <div className="dmap-card">
        <svg viewBox="0 0 670 560" role="img" aria-label="Simplified diagram of Bart Mining delivery routes across Tanzania" className="dmap-svg">
          <path d={TZ_SILHOUETTE} className="dmap-silhouette" />

          {stop.slug !== origin && (
            <line x1={originStop.x} y1={originStop.y} x2={stop.x} y2={stop.y} stroke="var(--gold)" strokeWidth={2.5} strokeLinecap="round" />
          )}

          {DELIVERY_STOPS.map(s => {
            const isOrigin = s.slug === origin
            const isOtherOrigin = ORIGINS.some(o => o.id === s.slug) && !isOrigin
            const active = s.slug === selected
            const big = isOrigin || active
            return (
              <g key={s.slug} transform={`translate(${s.x},${s.y})`} onClick={() => setSelected(s.slug)} style={{ cursor: 'pointer' }} role="button" aria-pressed={active} tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelected(s.slug) }}>
                <circle
                  r={isOrigin ? 9 : active ? 8 : 5.5}
                  fill={isOrigin ? 'var(--ink)' : active ? 'var(--gold)' : 'var(--bg-3)'}
                  stroke={isOrigin ? 'var(--ink)' : 'var(--gold)'}
                  strokeWidth={isOrigin ? 0 : 1.5}
                  opacity={isOtherOrigin ? 0.55 : 1}
                />
                <text
                  x={0} y={big ? -14 : -11}
                  textAnchor="middle"
                  fontSize={big ? 13 : 11}
                  fontWeight={big ? 700 : 500}
                  fill="var(--ink)"
                  opacity={isOtherOrigin ? 0.6 : 1}
                  style={{ fontFamily: 'var(--font-sora)' }}
                >
                  {s.town}{isOtherOrigin ? ' (base)' : ''}
                </text>
              </g>
            )
          })}
        </svg>
        <p className="dmap-caption">Simplified route diagram, not to scale. Click or tap a town, or use the dropdown, to see its delivery time.</p>
      </div>

      {/* Controls + result */}
      <div className="dmap-panel">
        <label className="dmap-label" htmlFor="dmap-origin">Shipping from</label>
        <select id="dmap-origin" className="dmap-select" value={origin} onChange={e => setOrigin(e.target.value)}>
          {ORIGINS.map(o => (
            <option key={o.id} value={o.id}>{o.label} — {o.sub}</option>
          ))}
        </select>

        <label className="dmap-label" htmlFor="dmap-town">Delivering to</label>
        <select id="dmap-town" className="dmap-select" value={selected} onChange={e => setSelected(e.target.value)}>
          {DELIVERY_STOPS.filter(s => s.slug !== origin).map(s => (
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
                Light-vehicle baseline {fmt(route.hours[0])}–{fmt(route.hours[1])}h from {originStop.town}, &times;{cls.multiplier} for {cls.label.toLowerCase()},
                plus a {Math.round(BUFFER.low * 100)}–{Math.round(BUFFER.high * 100)}% buffer for checkpoints, weather and loading.
              </p>
            </>
          ) : null}
        </div>

        <div className="dmap-basis">
          <span className="dmap-basis-dot" style={{ background: BASIS_LABEL[route.basis].color }} />
          <span>{BASIS_LABEL[route.basis].label}</span>
          {route.note && <span className="dmap-basis-note">— {route.note}</span>}
        </div>

        <p className="dmap-fineprint">
          Planning figures, not a delivery promise. Every quotation states the actual transit time for that consignment and route once it is confirmed.
        </p>
      </div>

      <style>{`
        .dmap-wrap { display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; align-items: start; }
        .dmap-card { background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 16px; }
        .dmap-svg { width: 100%; height: auto; display: block; }
        .dmap-silhouette { fill: var(--ink); opacity: 0.05; stroke: none; }
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
