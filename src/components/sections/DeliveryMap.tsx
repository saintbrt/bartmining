'use client'

import { useMemo, useState } from 'react'
import {
  DELIVERY_STOPS, DELIVERY_STOP_BY_SLUG, CARGO_CLASSES, BUFFER, ORIGINS,
  MAP_VIEWBOX, project, TZ_OUTLINE, LAKE_VICTORIA_OUTLINE, ZANZIBAR_OUTLINES,
  type RouteTime,
} from '@/data/delivery-routes'

const BASIS_LABEL: Record<RouteTime['basis'], { label: string; color: string }> = {
  confirmed: { label: 'Confirmed figure', color: 'var(--gold-deep)' },
  computed: { label: 'Computed from confirmed legs', color: 'var(--gold)' },
  estimate: { label: 'Estimate, to be confirmed', color: 'var(--ink-3)' },
}

const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1))
const fmtDays = (h: number) => {
  const d = h / 24
  return d < 1 ? `${fmt(h)}h` : `${fmt(d)} day${d >= 1.5 ? 's' : ''}`
}

/** [lon,lat] ring -> a closed SVG path, projected to the map's viewBox. */
function ringPath(ring: readonly (readonly [number, number])[]): string {
  return ring.map((p, i) => {
    const [x, y] = project(p as [number, number])
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ') + ' Z'
}

/**
 * A gently arced path between two points, the way a flight- or shipping-
 * route line is usually drawn rather than a ruled straight line: offset the
 * midpoint perpendicular to the line by a fraction of its length.
 */
function routeArc(from: [number, number], to: [number, number]): string {
  const [x1, y1] = from
  const [x2, y2] = to
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.max(1, Math.hypot(dx, dy))
  const bulge = Math.min(60, len * 0.16)
  const mx = (x1 + x2) / 2 - (dy / len) * bulge
  const my = (y1 + y2) / 2 + (dx / len) * bulge
  return `M${x1} ${y1} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2} ${y2}`
}

export default function DeliveryMap() {
  const [origin, setOrigin] = useState<string>('dar-es-salaam')
  const [selected, setSelected] = useState<string>('')
  const [cargo, setCargo] = useState<string>('medium')

  const originStop = DELIVERY_STOP_BY_SLUG.get(origin)!
  const stop = selected ? DELIVERY_STOP_BY_SLUG.get(selected) : undefined
  const cls = CARGO_CLASSES.find(c => c.id === cargo) ?? CARGO_CLASSES[1]
  const route = stop ? (origin === 'mwanza' ? stop.fromMwanza : stop.fromDar) : undefined

  const range = useMemo(() => {
    if (!route || !stop || stop.slug === origin || cls.multiplier === null) return null
    const [lo, hi] = route.hours
    const loAdj = lo * cls.multiplier
    const hiAdj = hi * cls.multiplier
    return { loBuf: loAdj * (1 + BUFFER.low), hiBuf: hiAdj * (1 + BUFFER.high) }
  }, [stop, origin, route, cls])

  function pick(slug: string) {
    setSelected(slug === origin ? '' : slug)
  }

  return (
    <div className="dmap-wrap">
      {/* Map */}
      <div className="dmap-card">
        <svg viewBox={`0 0 ${MAP_VIEWBOX.w} ${MAP_VIEWBOX.h}`} role="img" aria-label="Map of Tanzania with Bart Mining delivery routes" className="dmap-svg">
          <defs>
            <marker id="dmap-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="var(--gold)" />
            </marker>
          </defs>

          {/* Decorative backdrop only — a simplified outline, not a reference map. */}
          <path d={ringPath(TZ_OUTLINE)} className="dmap-country" />
          <path d={ringPath(LAKE_VICTORIA_OUTLINE)} className="dmap-lake" />
          {ZANZIBAR_OUTLINES.map((ring, i) => <path key={i} d={ringPath(ring)} className="dmap-country" />)}

          {stop && stop.slug !== origin && (
            <path
              d={routeArc(project(originStop.lonLat), project(stop.lonLat))}
              fill="none" stroke="var(--gold)" strokeWidth={2.25} strokeLinecap="round"
              markerEnd="url(#dmap-arrow)"
            />
          )}

          {DELIVERY_STOPS.map(s => {
            const [x, y] = project(s.lonLat)
            const isOrigin = s.slug === origin
            const isOtherOrigin = ORIGINS.some(o => o.id === s.slug) && !isOrigin
            const active = s.slug === selected
            const big = isOrigin || active
            return (
              <g key={s.slug} transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`} onClick={() => pick(s.slug)} style={{ cursor: 'pointer' }} role="button" aria-pressed={active} tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') pick(s.slug) }}>
                <circle r={14} fill="transparent" />
                <circle
                  r={isOrigin ? 9 : active ? 8 : 5}
                  fill={isOrigin ? 'var(--ink)' : active ? 'var(--gold)' : 'var(--bg)'}
                  stroke={isOrigin ? 'var(--ink)' : 'var(--gold)'}
                  strokeWidth={isOrigin ? 0 : 1.5}
                  opacity={isOtherOrigin ? 0.55 : 1}
                />
                {(big || isOtherOrigin) && (
                  <text
                    x={0} y={-14}
                    textAnchor="middle"
                    fontSize={big ? 13 : 11}
                    fontWeight={big ? 700 : 500}
                    fill="var(--ink)"
                    opacity={isOtherOrigin ? 0.65 : 1}
                    style={{ fontFamily: 'var(--font-sora)' }}
                  >
                    {s.town}{isOtherOrigin ? ' (base)' : ''}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
        <p className="dmap-caption">
          {selected ? 'Click another town, or the same one, to change the destination.' : 'Click a town on the map, or use the dropdown, to see a delivery estimate.'}
        </p>
      </div>

      {/* Controls + result */}
      <div className="dmap-panel">
        <label className="dmap-label" htmlFor="dmap-origin">Shipping from</label>
        <select id="dmap-origin" className="dmap-select" value={origin} onChange={e => { setOrigin(e.target.value); if (e.target.value === selected) setSelected('') }}>
          {ORIGINS.map(o => (
            <option key={o.id} value={o.id}>{o.label} · {o.sub}</option>
          ))}
        </select>

        <label className="dmap-label" htmlFor="dmap-town">Delivering to</label>
        <select id="dmap-town" className="dmap-select" value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">Choose a town…</option>
          {DELIVERY_STOPS.filter(s => s.slug !== origin).map(s => (
            <option key={s.slug} value={s.slug}>{s.town} · {s.region}</option>
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
          {!stop || !route ? (
            <p className="dmap-result-empty">Pick a destination to see an estimated delivery time.</p>
          ) : cls.multiplier === null ? (
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

        {stop && route && (
          <div className="dmap-basis">
            <span className="dmap-basis-dot" style={{ background: BASIS_LABEL[route.basis].color }} />
            <span>{BASIS_LABEL[route.basis].label}</span>
            {route.note && <span className="dmap-basis-note">· {route.note}</span>}
          </div>
        )}

        <p className="dmap-fineprint">
          Planning figures, not a delivery promise. Every quotation states the actual transit time for that consignment and route once it is confirmed.
        </p>
      </div>

      <style>{`
        .dmap-wrap { display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; align-items: start; }
        .dmap-card { background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 16px; }
        .dmap-svg { width: 100%; height: auto; display: block; }
        .dmap-country { fill: var(--ink); fill-opacity: 0.05; stroke: var(--ink); stroke-opacity: 0.12; stroke-width: 1; }
        .dmap-lake { fill: var(--gold); fill-opacity: 0.08; stroke: none; }
        .dmap-caption { font-size: 13px; color: var(--ink-3); margin-top: 10px; text-align: center; }
        .dmap-panel { background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 22px; display: flex; flex-direction: column; gap: 6px; }
        .dmap-label { font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); margin-top: 14px; }
        .dmap-label:first-child { margin-top: 0; }
        .dmap-select { width: 100%; font-size: 15.5px; padding: 10px 12px; border-radius: var(--r-sm); border: 1px solid var(--line); background: var(--bg); color: var(--ink); margin-top: 6px; }
        .dmap-example { font-size: 13px; color: var(--ink-3); margin-top: 4px; }
        .dmap-result { background: var(--paper); border: 1px solid var(--line); border-radius: var(--r-md); padding: 16px; margin-top: 18px; min-height: 26px; }
        .dmap-result-empty { font-size: 14.5px; color: var(--ink-3); }
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
