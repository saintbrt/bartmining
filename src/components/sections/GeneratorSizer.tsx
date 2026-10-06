'use client'

import { useState } from 'react'
import { RENTAL_MAX_KVA, RENTAL_MIN_KVA, RENTAL_SIZES, whatsappLink } from '@/data/generator-rental'

/**
 * First-pass generator sizing. Same rules as the off-grid power article:
 * a motor started direct on line draws 6 to 7 times its running current,
 * a soft starter cuts that to 3 to 4 times, a VFD to about its running
 * current.
 *
 *   running kVA  = kW / 0.8 power factor
 *   needed kVA   = the larger of
 *     - total running kVA / 0.8   (keep the set at or below 80% load)
 *     - (other running kVA + largest motor's starting kVA) / 2.5
 *       (a set can carry a short starting surge of roughly 2.5 times its
 *        rating with an acceptable voltage dip; for a motor started direct
 *        on line this works out at about 3 kVA per motor kW, the usual
 *        rule of thumb)
 */

type Start = 'dol' | 'starDelta' | 'soft' | 'vfd' | 'none'
// kw and qty hold what the visitor typed, so partial input such as "7." survives.
interface Load { name: string; kw: string; qty: string; start: Start }

/** Keep digits and, when allowed, a single decimal point. */
const digitsOnly = (v: string, decimal: boolean) => {
  const s = v.replace(decimal ? /[^\d.]/g : /\D/g, '')
  if (!decimal) return s
  const dot = s.indexOf('.')
  return dot < 0 ? s : s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '')
}
const num = (s: string) => Number(s) || 0

const START_FACTOR: Record<Start, number> = { dol: 6.5, starDelta: 2.5, soft: 3.5, vfd: 1.2, none: 1 }

const TEXT = {
  en: {
    load: 'Load', kw: 'kW each', qty: 'Qty', start: 'How it starts', add: '+ Add a load', remove: 'Remove',
    starts: { dol: 'Motor, direct on line', starDelta: 'Motor, star-delta', soft: 'Motor, soft starter', vfd: 'Motor, VFD', none: 'Not a motor (lights, heaters)' } as Record<Start, string>,
    running: 'Running load', surge: 'Largest starting surge', needed: 'Generator needed', recommend: 'Rental size to ask for',
    below: `Our smallest hire is ${RENTAL_MIN_KVA} kVA, which covers this load.`,
    above: (n: number) => `More than ${RENTAL_MAX_KVA.toLocaleString('en-US')} kVA: about ${n} sets running synchronised. Send us the load list.`,
    tip: 'Tip: the largest motor started direct on line is driving the size. A soft starter or VFD on it would let you hire a smaller set.',
    note: 'A first estimate only. Send us the load list and we will confirm the size before quoting.',
    send: 'Send this load list on WhatsApp',
    msg: 'Hello Bart Mining, I need a generator for hire. My load list:',
    sample: ['Ball mill motor', 'Slurry pumps', 'Lighting and office'],
  },
  sw: {
    load: 'Mzigo', kw: 'kW kila moja', qty: 'Idadi', start: 'Jinsi inavyowashwa', add: '+ Ongeza mzigo', remove: 'Ondoa',
    starts: { dol: 'Mota, direct on line', starDelta: 'Mota, star-delta', soft: 'Mota, soft starter', vfd: 'Mota, VFD', none: 'Si mota (taa, hita)' } as Record<Start, string>,
    running: 'Mzigo unaotumika', surge: 'Mvuto mkubwa wa kuwasha', needed: 'Jenereta inayohitajika', recommend: 'Ukubwa wa kukodi',
    below: `Jenereta ndogo zaidi tunayokodisha ni kVA ${RENTAL_MIN_KVA}, inatosha mzigo huu.`,
    above: (n: number) => `Zaidi ya kVA ${RENTAL_MAX_KVA.toLocaleString('en-US')}: takriban jenereta ${n} zinazofanya kazi pamoja (synchronised). Tutumie orodha ya mizigo.`,
    tip: 'Ushauri: mota kubwa inayowashwa direct on line ndiyo inayoongeza ukubwa. Soft starter au VFD ingekuwezesha kukodi jenereta ndogo zaidi.',
    note: 'Hii ni makadirio ya awali tu. Tutumie orodha ya mizigo na tutathibitisha ukubwa kabla ya kutoa bei.',
    send: 'Tuma orodha hii kwa WhatsApp',
    msg: 'Habari Bart Mining, naomba kukodi jenereta. Orodha ya mizigo yangu:',
    sample: ['Mota ya ball mill', 'Pampu za tope', 'Taa na ofisi'],
  },
}

const kva = (n: number) => `${Math.round(n).toLocaleString('en-US')} kVA`

export default function GeneratorSizer({ lang = 'en', source = 'generator rental page' }: { lang?: 'en' | 'sw'; source?: string }) {
  const t = TEXT[lang]
  const [loads, setLoads] = useState<Load[]>([
    { name: t.sample[0], kw: '75', qty: '1', start: 'dol' },
    { name: t.sample[1], kw: '15', qty: '2', start: 'soft' },
    { name: t.sample[2], kw: '10', qty: '1', start: 'none' },
  ])
  const set = (i: number, patch: Partial<Load>) => setLoads(ls => ls.map((l, k) => (k === i ? { ...l, ...patch } : l)))

  const valid = loads
    .map(l => ({ name: l.name, kw: num(l.kw), qty: num(l.qty), start: l.start }))
    .filter(l => l.kw > 0 && l.qty > 0)
  type Parsed = (typeof valid)[number]
  const runKva = (l: Parsed) => (l.kw * l.qty) / 0.8
  const totalRun = valid.reduce((a, l) => a + runKva(l), 0)
  const motors = valid.filter(l => l.start !== 'none')
  // The surge that matters is one motor starting (stagger the rest).
  const biggest = motors.reduce<Parsed | null>((best, l) => {
    const s = (l.kw / 0.8) * START_FACTOR[l.start]
    return !best || s > (best.kw / 0.8) * START_FACTOR[best.start] ? l : best
  }, null)
  const surge = biggest ? (biggest.kw / 0.8) * START_FACTOR[biggest.start] : 0
  const othersRun = biggest ? totalRun - biggest.kw / 0.8 : totalRun
  const needed = Math.max(totalRun / 0.8, biggest ? (othersRun + surge) / 2.5 : 0)
  const size = RENTAL_SIZES.find(s => s >= needed)
  // Above the largest single set: split across synchronised sets, each a standard size.
  const sets = Math.ceil(needed / RENTAL_MAX_KVA)
  const perSet = RENTAL_SIZES.find(s => s >= needed / sets) ?? RENTAL_MAX_KVA
  const startDriven = biggest?.start === 'dol' && (othersRun + surge) / 2.5 > totalRun / 0.8

  const summary = valid.map(l => `- ${l.name || t.load}: ${l.qty} × ${l.kw} kW (${t.starts[l.start]})`).join('\n')
  const message = `${t.msg}\n${summary}\n${t.needed}: ~${kva(needed)}\n(${source})`

  return (
    <div className="gs">
      <div className="gs-table" role="table" aria-label={t.load}>
        <div className="gs-row gs-head" role="row">
          <span role="columnheader">{t.load}</span><span role="columnheader">{t.kw}</span><span role="columnheader">{t.qty}</span><span role="columnheader">{t.start}</span><span />
        </div>
        {loads.map((l, i) => (
          <div className="gs-row" role="row" key={i}>
            <input aria-label={t.load} value={l.name} onChange={e => set(i, { name: e.target.value })} />
            <input aria-label={t.kw} inputMode="decimal" pattern="[0-9]*[.]?[0-9]*" maxLength={7} value={l.kw} onChange={e => set(i, { kw: digitsOnly(e.target.value, true) })} />
            <input aria-label={t.qty} inputMode="numeric" pattern="[0-9]*" maxLength={3} value={l.qty} onChange={e => set(i, { qty: digitsOnly(e.target.value, false) })} />
            <select aria-label={t.start} value={l.start} onChange={e => set(i, { start: e.target.value as Start })}>
              {(Object.keys(START_FACTOR) as Start[]).map(s => <option key={s} value={s}>{t.starts[s]}</option>)}
            </select>
            <button type="button" className="gs-remove" aria-label={t.remove} onClick={() => setLoads(ls => ls.filter((_, k) => k !== i))}>×</button>
          </div>
        ))}
      </div>
      <button type="button" className="gs-add" onClick={() => setLoads(ls => [...ls, { name: '', kw: '', qty: '1', start: 'dol' }])}>{t.add}</button>

      <dl className="gs-result" aria-live="polite">
        <div><dt>{t.running}</dt><dd>{kva(totalRun)}</dd></div>
        <div><dt>{t.surge}</dt><dd>{biggest ? kva(surge) : '–'}</dd></div>
        <div><dt>{t.needed}</dt><dd>{kva(needed)}</dd></div>
        <div className="gs-pick">
          <dt>{t.recommend}</dt>
          <dd>{needed <= 0 ? '–' : size ? kva(size) : `${sets} × ${kva(perSet)}`}</dd>
        </div>
      </dl>
      {needed > 0 && needed < RENTAL_MIN_KVA && <p className="gs-note">{t.below}</p>}
      {!size && needed > 0 && <p className="gs-note">{t.above(sets)}</p>}
      {startDriven && <p className="gs-note">{t.tip}</p>}
      <p className="gs-note muted">{t.note}</p>
      {valid.length > 0 && (
        <a className="btn btn-gold gs-send" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">{t.send}</a>
      )}
    </div>
  )
}
