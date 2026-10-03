import { useEffect, useId, useState } from 'react'
import type { Package } from '../types'

// One flowsheet serves every option: the layout lives here, and each package
// only supplies its own labels (scrubber size, number of centrifuges, ...).

type Kind = 'ore' | 'gold' | 'water' | 'waste'

interface Node { id: string; x: number; y: number; w: number; h: number; label: string; sub?: string; pill?: boolean; accent?: boolean; muted?: boolean }
interface Edge { id: string; from: string; to: string; kind: Kind; pts: [number, number][]; label?: string; lx?: number; ly?: number; anchor?: 'start' | 'end' | 'middle' }

const NODES: Node[] = [
  { id: 'rom', x: 20, y: 100, w: 140, h: 56, label: 'Run-of-mine gravel', sub: 'loader feed' },
  { id: 'oversize', x: 200, y: 30, w: 160, h: 34, label: '+80 mm to waste', muted: true },
  { id: 'hopper', x: 200, y: 100, w: 160, h: 56, label: 'Feed hopper + grizzly' },
  { id: 'feeder', x: 410, y: 100, w: 150, h: 56, label: 'Vibrating feeder' },
  { id: 'coarseWaste', x: 610, y: 30, w: 240, h: 34, label: '+20 mm gravel to waste', muted: true },
  { id: 'scrubber', x: 610, y: 94, w: 240, h: 68, label: 'Rotary scrubber + trommel', pill: true },
  { id: 'tank', x: 650, y: 240, w: 170, h: 56, label: 'Slurry tank + pumps' },
  { id: 'centrifuge', x: 420, y: 240, w: 180, h: 56, label: 'Centrifuges' },
  { id: 'sluice', x: 420, y: 330, w: 180, h: 56, label: 'Sluices' },
  { id: 'table', x: 220, y: 280, w: 150, h: 56, label: 'Shaking table' },
  { id: 'goldroom', x: 20, y: 280, w: 150, h: 56, label: 'Gold room', accent: true },
  { id: 'dewater', x: 220, y: 450, w: 160, h: 56, label: 'Dewatering screen' },
  { id: 'ponds', x: 440, y: 450, w: 180, h: 56, label: 'Settling ponds' },
  { id: 'clean', x: 680, y: 450, w: 170, h: 56, label: 'Clean water pond' },
]

const EDGES: Edge[] = [
  { id: 'e1', from: 'rom', to: 'hopper', kind: 'ore', pts: [[160, 128], [198, 128]] },
  { id: 'e2', from: 'hopper', to: 'oversize', kind: 'waste', pts: [[280, 100], [280, 66]] },
  { id: 'e3', from: 'hopper', to: 'feeder', kind: 'ore', pts: [[360, 128], [408, 128]] },
  { id: 'e4', from: 'feeder', to: 'scrubber', kind: 'ore', pts: [[560, 128], [608, 128]] },
  { id: 'e5', from: 'scrubber', to: 'coarseWaste', kind: 'waste', pts: [[730, 94], [730, 66]] },
  { id: 'e6', from: 'scrubber', to: 'tank', kind: 'ore', pts: [[735, 162], [735, 238]], label: '0-6 mm slurry', lx: 743, ly: 205, anchor: 'start' },
  { id: 'e7', from: 'tank', to: 'centrifuge', kind: 'ore', pts: [[650, 268], [602, 268]] },
  { id: 'e8', from: 'scrubber', to: 'sluice', kind: 'ore', pts: [[850, 128], [895, 128], [895, 358], [602, 358]], label: '6-20 mm', lx: 903, ly: 250, anchor: 'start' },
  { id: 'e9', from: 'centrifuge', to: 'table', kind: 'gold', pts: [[420, 268], [400, 268], [400, 300], [372, 300]], label: 'concentrate', lx: 396, ly: 262, anchor: 'end' },
  { id: 'e10', from: 'sluice', to: 'table', kind: 'gold', pts: [[420, 358], [400, 358], [400, 318], [372, 318]] },
  { id: 'e11', from: 'table', to: 'goldroom', kind: 'gold', pts: [[220, 308], [172, 308]] },
  { id: 'e12', from: 'sluice', to: 'dewater', kind: 'waste', pts: [[510, 386], [510, 420], [300, 420], [300, 448]], label: 'tailings', lx: 404, ly: 414, anchor: 'middle' },
  { id: 'e13', from: 'dewater', to: 'ponds', kind: 'water', pts: [[380, 478], [438, 478]] },
  { id: 'e14', from: 'ponds', to: 'clean', kind: 'water', pts: [[620, 478], [678, 478]] },
  { id: 'e15', from: 'clean', to: 'scrubber', kind: 'water', pts: [[850, 478], [955, 478], [955, 112], [852, 112]], label: 'recycled water', lx: 958, ly: 102, anchor: 'end' },
]

export const FLOW_STEPS: { title: string; text: string; nodes: string[]; edges: string[]; anchor: string }[] = [
  { title: 'Feed', anchor: 'rom', nodes: ['rom', 'hopper', 'oversize'], edges: ['e1', 'e2'],
    text: 'A loader tips run-of-mine gravel into the hopper. The 80 mm grizzly bars reject boulders, which go straight to waste.' },
  { title: 'Meter', anchor: 'feeder', nodes: ['hopper', 'feeder', 'scrubber'], edges: ['e3', 'e4'],
    text: 'The vibrating feeder meters gravel into the scrubber at a steady rate, so the drum never floods or runs empty.' },
  { title: 'Scrub and screen', anchor: 'scrubber', nodes: ['scrubber', 'coarseWaste'], edges: ['e5', 'e15'],
    text: 'Water and tumbling inside the rotating drum break the clay apart and free the gold. The trommel screen splits the washed gravel by size, and anything over 20 mm goes to waste.' },
  { title: 'Fine gold', anchor: 'tank', nodes: ['scrubber', 'tank', 'centrifuge'], edges: ['e6', 'e7'],
    text: 'The 0-6 mm slurry, where most of the fine gold sits, is pumped to the centrifugal concentrators. They hold the heavy gold and let the lighter sand pass.' },
  { title: 'Coarse gold', anchor: 'sluice', nodes: ['scrubber', 'sluice'], edges: ['e8'],
    text: 'The 6-20 mm fraction runs over the sluices, whose riffles trap the coarser gold and small nuggets.' },
  { title: 'Clean-up and gold room', anchor: 'table', nodes: ['centrifuge', 'sluice', 'table', 'goldroom'], edges: ['e9', 'e10', 'e11'],
    text: 'Concentrates from the centrifuges and sluices are upgraded on the shaking table. The gold then goes to the locked gold room for drying and smelting.' },
  { title: 'Water recovery', anchor: 'ponds', nodes: ['sluice', 'dewater', 'ponds', 'clean', 'scrubber'], edges: ['e12', 'e13', 'e14', 'e15'],
    text: 'Tailings are dewatered and the water settles through the ponds. Clean water is pumped back to the scrubber, so the plant reuses most of its water.' },
]

const BANDS = [
  { y: 22, label: 'FEED & WASH' },
  { y: 228, label: 'RECOVERY' },
  { y: 432, label: 'WATER' },
]

const KIND_LEGEND: { kind: Kind; label: string }[] = [
  { kind: 'ore', label: 'Gravel / slurry' },
  { kind: 'gold', label: 'Gold concentrate' },
  { kind: 'water', label: 'Water' },
  { kind: 'waste', label: 'Waste / tailings' },
]

const d = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')
const len = (pts: [number, number][]) => pts.slice(1).reduce((a, [x, y], i) => a + Math.hypot(x - pts[i][0], y - pts[i][1]), 0)

export function FlowDiagram({ pkg, animate = false, step = null, numbered = false, legend = true }: {
  pkg: Package
  animate?: boolean
  /** Index into FLOW_STEPS to spotlight, or null for the whole plant. */
  step?: number | null
  /** Show step numbers on the diagram (for print, alongside the step list). */
  numbered?: boolean
  legend?: boolean
}) {
  const uid = useId().replace(/:/g, '')
  const reduced = usePrefersReducedMotion()
  const moving = animate && !reduced

  const hidden = new Set(Object.entries(pkg.flow).filter(([, v]) => v.hidden).map(([k]) => k))
  const nodes = NODES.filter(n => !hidden.has(n.id)).map(n => ({ ...n, ...pick(pkg.flow[n.id]) }))
  const edges = EDGES.filter(e => !hidden.has(e.from) && !hidden.has(e.to))
  const spot = step === null ? null : FLOW_STEPS[step]
  const nodeOn = (id: string) => !spot || spot.nodes.includes(id)
  const edgeOn = (id: string) => !spot || spot.edges.includes(id)

  return (
    <figure className="flow">
      <svg viewBox="0 0 1000 530" role="img" aria-label={`Process flow, ${pkg.name}`}>
        <defs>
          {(['ore', 'gold', 'water', 'waste'] as Kind[]).map(k => (
            <marker key={k} id={`${uid}-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" className={`arrow-${k}`} />
            </marker>
          ))}
        </defs>

        {BANDS.map((b, i) => (
          <g key={b.label}>
            {i > 0 && <line x1="0" x2="1000" y1={b.y - 12} y2={b.y - 12} className="band-rule" />}
            <text x="0" y={b.y} className="band-label">{b.label}</text>
          </g>
        ))}

        {edges.map(e => {
          const on = edgeOn(e.id)
          const path = d(e.pts)
          return (
            <g key={e.id} className={`edge edge-${e.kind} ${on ? '' : 'dim'}`}>
              <path d={path} className="edge-line" markerEnd={`url(#${uid}-${e.kind})`} />
              {moving && on && <path d={path} className="edge-flow" />}
              {moving && on && (e.kind === 'ore' || e.kind === 'gold') && (
                <circle r={e.kind === 'gold' ? 3.5 : 3} className={`dot dot-${e.kind}`}>
                  <animateMotion dur={`${Math.max(0.8, len(e.pts) / 70)}s`} repeatCount="indefinite" path={path} />
                </circle>
              )}
              {e.label && <text x={e.lx} y={e.ly} textAnchor={e.anchor} className="edge-label">{e.label}</text>}
            </g>
          )
        })}

        {nodes.map(n => (
          <g key={n.id} className={`node ${n.accent ? 'accent' : ''} ${n.muted ? 'muted' : ''} ${nodeOn(n.id) ? '' : 'dim'}`}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.pill ? n.h / 2 : 4} />
            <text x={n.x + n.w / 2} y={n.y + (n.sub ? n.h / 2 - 3 : n.h / 2 + 4)} textAnchor="middle" className="node-label">{n.label}</text>
            {n.sub && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 13} textAnchor="middle" className="node-sub">{n.sub}</text>}
          </g>
        ))}

        {numbered && FLOW_STEPS.map((s, i) => {
          const n = nodes.find(x => x.id === s.anchor)
          if (!n) return null
          return (
            <g key={s.title} className="step-num">
              <circle cx={n.x} cy={n.y} r="10" />
              <text x={n.x} y={n.y + 4} textAnchor="middle">{i + 1}</text>
            </g>
          )
        })}
      </svg>
      {legend && (
        <figcaption className="flow-legend">
          {KIND_LEGEND.map(l => (
            <span key={l.kind}><svg width="26" height="8"><line x1="0" x2="26" y1="4" y2="4" className={`legend-${l.kind}`} /></svg>{l.label}</span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}

function pick(v?: { label?: string; sub?: string }) {
  const out: { label?: string; sub?: string } = {}
  if (v?.label) out.label = v.label
  if (v?.sub) out.sub = v.sub
  return out
}

function usePrefersReducedMotion() {
  const q = '(prefers-reduced-motion: reduce)'
  const [r, setR] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setR(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return r
}

/** Step-through controls shared by the Plant view and the proposal preview. */
export function useFlowPlayer() {
  const [step, setStep] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
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
  return {
    step, playing,
    play: () => { setStep(null); setPlaying(true) },
    stop: () => { setPlaying(false); setStep(null) },
    go: (s: number | null) => { setPlaying(false); setStep(s) },
  }
}

export function FlowControls({ player, compact }: { player: ReturnType<typeof useFlowPlayer>; compact?: boolean }) {
  const { step, playing, play, stop, go } = player
  const s = step === null ? null : FLOW_STEPS[step]
  return (
    <div className={`flow-controls ${compact ? 'compact' : ''}`}>
      <div className="flow-buttons">
        {playing
          ? <button className="btn" onClick={stop}>Stop</button>
          : <button className="btn primary" onClick={play}>▶ Show ore flow</button>}
        <button className="btn ghost" disabled={step === null || step === 0} onClick={() => go((step ?? 1) - 1)}>‹ Prev</button>
        <button className="btn ghost" disabled={step === FLOW_STEPS.length - 1} onClick={() => go(step === null ? 0 : step + 1)}>Next ›</button>
        {step !== null && <button className="btn ghost" onClick={() => go(null)}>Whole plant</button>}
      </div>
      <div className="flow-caption" aria-live="polite">
        {s ? (
          <><span className="flow-step-no">Step {step! + 1} of {FLOW_STEPS.length}</span><strong>{s.title}.</strong> {s.text}</>
        ) : (
          <span className="muted">Follow the gravel from the hopper to the gold room, one step at a time.</span>
        )}
      </div>
    </div>
  )
}
