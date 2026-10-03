'use client'

import { useEffect, useId, useState } from 'react'
import {
  FLOW_BANDS, FLOW_EDGES, FLOW_NODES, FLOW_STEPS, PLANT_OPTIONS,
  FLOW_BANDS_MOBILE, FLOW_EDGES_MOBILE, FLOW_NODES_MOBILE, FLOW_VIEWBOX_MOBILE,
  type FlowKind,
} from '@/data/alluvial-plant'

/**
 * Animated process flow for the alluvial gold plant. The whole plant flows
 * by default; "Show ore flow" walks through it one step at a time, dimming
 * everything not involved in that step.
 */

const KINDS: { kind: FlowKind; label: string }[] = [
  { kind: 'ore', label: 'Gravel / slurry' },
  { kind: 'gold', label: 'Gold concentrate' },
  { kind: 'water', label: 'Water' },
  { kind: 'waste', label: 'Waste / tailings' },
]

const pathD = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
const pathLen = (pts: [number, number][]) => pts.slice(1).reduce((a, [x, y], i) => a + Math.hypot(x - pts[i][0], y - pts[i][1]), 0)

export default function PlantFlow() {
  const uid = useId().replace(/:/g, '')
  const [optionId, setOptionId] = useState(PLANT_OPTIONS[0].id)
  const [step, setStep] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  // Phones get the same plant drawn top to bottom instead of a sideways-scrolling diagram.
  const narrow = useMedia('(max-width: 700px)')
  const nodes = narrow ? FLOW_NODES_MOBILE : FLOW_NODES
  const edges = narrow ? FLOW_EDGES_MOBILE : FLOW_EDGES
  const bands = narrow ? FLOW_BANDS_MOBILE : FLOW_BANDS
  const vb = narrow ? FLOW_VIEWBOX_MOBILE : { w: 1000, h: 530 }
  const option = PLANT_OPTIONS.find(o => o.id === optionId) ?? PLANT_OPTIONS[0]
  const spot = step === null ? null : FLOW_STEPS[step]

  useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => {
      setStep(s => {
        const next = s === null ? 0 : s + 1
        if (next >= FLOW_STEPS.length) { setPlaying(false); return null }
        return next
      })
    }, step === null ? 50 : 4200)
    return () => window.clearTimeout(t)
  }, [playing, step])

  const go = (s: number | null) => { setPlaying(false); setStep(s) }
  const moving = !reduced

  return (
    <div className="pf">
      <div className="pf-top">
        <div className="pf-toggle" role="tablist" aria-label="Plant option">
          {PLANT_OPTIONS.map(o => (
            <button key={o.id} role="tab" aria-selected={o.id === option.id} className={o.id === option.id ? 'on' : ''} onClick={() => setOptionId(o.id)}>
              {o.short}
            </button>
          ))}
        </div>
        <p className="pf-summary">{option.summary}</p>
      </div>

      <dl className="pf-stats">
        <div><dt>Capacity</dt><dd>{option.capacity}</dd></div>
        <div><dt>Processed per month</dt><dd>{option.throughput}</dd></div>
        <div><dt>Prime power</dt><dd>{option.power}</dd></div>
        <div><dt>First gold</dt><dd>{option.firstGold}</dd></div>
      </dl>

      <div className="pf-controls">
        <div className="pf-buttons">
          {playing
            ? <button className="pf-btn" onClick={() => go(null)}>Stop</button>
            : <button className="pf-btn primary" onClick={() => { setStep(null); setPlaying(true) }}>▶ Show ore flow</button>}
          <button className="pf-btn ghost" disabled={step === null || step === 0} onClick={() => go((step ?? 1) - 1)}>‹ Prev</button>
          <button className="pf-btn ghost" disabled={step === FLOW_STEPS.length - 1} onClick={() => go(step === null ? 0 : step + 1)}>Next ›</button>
          {step !== null && <button className="pf-btn ghost" onClick={() => go(null)}>Whole plant</button>}
        </div>
        <p className="pf-caption" aria-live="polite">
          {spot
            ? <><span className="pf-step-no">Step {step! + 1} of {FLOW_STEPS.length}</span><strong>{spot.title}.</strong> {spot.text}</>
            : <span className="pf-muted">Follow the gravel from the hopper to the gold room, one step at a time.</span>}
        </p>
      </div>

      <div className="pf-scroll">
        <svg className={`pf-svg ${narrow ? 'pf-mobile' : ''}`} viewBox={`0 0 ${vb.w} ${vb.h}`} role="img" aria-label={`Process flow diagram, ${option.name}`}>
          <defs>
            {KINDS.map(({ kind }) => (
              <marker key={kind} id={`${uid}-${kind}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,1 L9,5 L0,9 z" className={`pf-arrow-${kind}`} />
              </marker>
            ))}
          </defs>

          {bands.map((b, i) => (
            <g key={b.label}>
              {i > 0 && <line x1="0" x2={vb.w} y1={b.y - 12} y2={b.y - 12} className="pf-band-rule" />}
              <text x="0" y={b.y} className="pf-band-label">{b.label}</text>
            </g>
          ))}

          {edges.map(e => {
            const on = !spot || spot.edges.includes(e.id)
            const d = pathD(e.pts)
            return (
              <g key={e.id} className={`pf-edge pf-edge-${e.kind} ${on ? '' : 'dim'}`}>
                <path d={d} className="pf-line" markerEnd={`url(#${uid}-${e.kind})`} />
                {moving && on && <path d={d} className="pf-flow" />}
                {moving && on && (e.kind === 'ore' || e.kind === 'gold') && (
                  <circle r={e.kind === 'gold' ? 3.5 : 3} className={`pf-dot-${e.kind}`}>
                    <animateMotion dur={`${Math.max(0.8, pathLen(e.pts) / 70)}s`} repeatCount="indefinite" path={d} />
                  </circle>
                )}
                {e.label && <text x={e.lx} y={e.ly} textAnchor={e.anchor} className="pf-edge-label">{e.label}</text>}
              </g>
            )
          })}

          {nodes.map(n => {
            const sub = option.subs[n.id]
            const on = !spot || spot.nodes.includes(n.id)
            return (
              <g key={n.id} className={`pf-node ${n.accent ? 'accent' : ''} ${n.muted ? 'muted' : ''} ${on ? '' : 'dim'}`}>
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.pill ? n.h / 2 : 4} />
                <text x={n.x + n.w / 2} y={n.y + (sub ? n.h / 2 - 3 : n.h / 2 + 4)} textAnchor="middle" className="pf-node-label">{n.label}</text>
                {sub && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 13} textAnchor="middle" className="pf-node-sub">{sub}</text>}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="pf-legend">
        {KINDS.map(k => (
          <span key={k.kind}>
            <svg width="26" height="8" aria-hidden="true"><line x1="0" x2="26" y1="4" y2="4" className={`pf-legend-${k.kind}`} /></svg>
            {k.label}
          </span>
        ))}
      </div>

      <div className="pf-detail">
        <div>
          <h3>The process, step by step</h3>
          <ol className="pf-steps">
            {FLOW_STEPS.map((s, k) => (
              <li key={s.title} className={step === k ? 'on' : ''}>
                <button onClick={() => go(step === k ? null : k)}>{s.title}</button>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3>{option.name}</h3>
          <table className="pf-specs">
            <tbody>
              {option.specs.map(s => <tr key={s.label}><th scope="row">{s.label}</th><td>{s.value}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function useMedia(query: string) {
  const [match, setMatch] = useState(false)
  useEffect(() => {
    const m = window.matchMedia(query)
    setMatch(m.matches)
    const on = () => setMatch(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}
