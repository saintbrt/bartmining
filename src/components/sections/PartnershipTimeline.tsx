'use client'

import { useEffect, useRef, useState } from 'react'
import { TIMELINE } from '@/data/partnership'

/**
 * Deliverables timeline for /partner, drawn in the home page's phase-card
 * language: hairlines, small square marks, ink type, gold only on the mark
 * of the deliverable being read.
 *
 * As the reader scrolls, a hairline fills down the rail and each deliverable
 * lights in turn. On desktop a sticky phase card follows alongside. All copy
 * is readable before any script runs; the highlight only adds emphasis.
 */
export default function PartnershipTimeline() {
  const wrap = useRef<HTMLDivElement>(null)
  const [fill, setFill] = useState(0)
  const [active, setActive] = useState(-1)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const mark = window.innerHeight * 0.6
      const r = el.getBoundingClientRect()
      setFill(Math.max(0, Math.min(r.height, mark - r.top)))
      let last = -1
      el.querySelectorAll<HTMLElement>('[data-tl]').forEach((n, i) => { if (n.getBoundingClientRect().top + 8 < mark) last = i })
      setActive(last)
      let p = 0
      el.querySelectorAll<HTMLElement>('[data-phase]').forEach((n, i) => { if (n.getBoundingClientRect().top < mark) p = i })
      setPhase(p)
    }
    const req = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', req)
    return () => {
      window.removeEventListener('scroll', req)
      window.removeEventListener('resize', req)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  let idx = -1
  const cur = TIMELINE[phase]

  return (
    <div className="ptl">
      <aside className="ptl-side" aria-hidden="true">
        <div className="ptl-card">
          <div className="ptl-label">{cur.label} · {cur.when}</div>
          <div className="ptl-title">{cur.title}</div>
          <ul>
            {cur.items.map(it => <li key={it.t}><span>&#8250;</span>{it.t}</li>)}
          </ul>
          <div className="ptl-foot">Milestone · {cur.milestone.when} — {cur.milestone.text}</div>
          <div className="ptl-steps">
            {TIMELINE.map((p, i) => <span key={p.key} className={i <= phase ? 'on' : ''} />)}
          </div>
        </div>
      </aside>

      <div className="ptl-list" ref={wrap}>
        <span className="ptl-rail" />
        <span className="ptl-fill" style={{ height: fill }} />
        {TIMELINE.map(p => (
          <div key={p.key} data-phase>
            <div className="ptl-phase">
              <span className="ptl-label">{p.label} · {p.when}</span>
              <h3>{p.title}</h3>
            </div>
            {p.items.map(it => {
              idx += 1
              const i = idx
              return (
                <div key={it.t} data-tl className={`ptl-item${i <= active ? ' on' : ''}${i === active ? ' now' : ''}`}>
                  <h4>{it.t}</h4>
                  <p>{it.d}</p>
                </div>
              )
            })}
            <div className="ptl-ms">
              <div className="ptl-ms-k">Milestone · {p.milestone.when}</div>
              <div className="ptl-ms-v">{p.milestone.text}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .ptl { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 64px; align-items: start; }
        .ptl-side { align-self: stretch; }
        .ptl-card { position: sticky; top: 110px; background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 28px 24px; }
        .ptl-label { font-family: var(--font-mono), monospace; font-size: 12px; letter-spacing: .18em; text-transform: uppercase; color: var(--gold-deep); }
        .ptl-title { font-family: var(--font-sora), sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.035em; color: var(--ink); margin-top: 14px; }
        .ptl-card ul { list-style: none; padding: 0; margin: 16px 0 20px; display: flex; flex-direction: column; gap: 8px; }
        .ptl-card li { display: flex; gap: 8px; font-size: 15px; color: var(--ink-2); line-height: 1.45; }
        .ptl-card li span { color: var(--gold); flex-shrink: 0; }
        .ptl-foot { padding-top: 16px; border-top: 1px solid var(--line-2); font-family: var(--font-mono), monospace; font-size: 12px; letter-spacing: .06em; color: var(--ink-3); line-height: 1.6; }
        .ptl-steps { display: flex; gap: 6px; margin-top: 18px; }
        .ptl-steps span { flex: 1; height: 1px; background: var(--line); transition: background .4s var(--ease); }
        .ptl-steps span.on { background: var(--ink); }

        .ptl-list { position: relative; padding-left: 36px; }
        .ptl-rail, .ptl-fill { position: absolute; left: 4px; top: 6px; width: 1px; }
        .ptl-rail { bottom: 6px; background: var(--line); }
        .ptl-fill { background: var(--ink); max-height: calc(100% - 12px); }
        .ptl-phase { position: relative; margin: 0 0 28px; }
        .ptl-phase h3 { font-size: clamp(22px, 2.4vw, 28px); margin-top: 12px; }
        .ptl-item { position: relative; padding: 0 0 28px; }
        .ptl-item::before { content: ''; position: absolute; left: -36px; top: 8px; width: 9px; height: 9px; background: var(--bg); border: 1px solid var(--line); transition: background .3s var(--ease), border-color .3s var(--ease); }
        .ptl-item.on::before { background: var(--ink); border-color: var(--ink); }
        .ptl-item.now::before { background: var(--gold); border-color: var(--gold); }
        .ptl-item h4 { font-size: 17px; letter-spacing: -0.02em; line-height: 1.3; color: var(--ink-3); transition: color .3s var(--ease); }
        .ptl-item.on h4 { color: var(--ink); }
        .ptl-item p { color: var(--ink-2); font-size: 15.5px; line-height: 1.6; margin-top: 6px; max-width: 600px; }
        .ptl-ms { background: var(--bg-3); border: 1px solid var(--line); border-radius: var(--r-sm); padding: 12px 16px; margin: 0 0 56px; max-width: 600px; }
        .ptl-ms-k { font-family: var(--font-mono), monospace; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
        .ptl-ms-v { font-family: var(--font-sora), sans-serif; font-weight: 700; font-size: 15.5px; color: var(--ink); margin-top: 4px; line-height: 1.45; }
        [data-phase]:last-child .ptl-ms { margin-bottom: 0; }

        @media (max-width: 860px) {
          .ptl { grid-template-columns: 1fr; gap: 0; }
          .ptl-side { display: none; }
          .ptl-list { padding-left: 28px; }
          .ptl-item::before { left: -28px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ptl-item::before, .ptl-item h4, .ptl-steps span { transition: none; }
        }
      `}</style>
    </div>
  )
}
