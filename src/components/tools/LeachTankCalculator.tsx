'use client'

import { useState } from 'react'

/**
 * Leach tank working-volume calculator. Same method as the leaching tank FAQ
 * and the small CIP plant guide:
 *
 *   solids t/h        = tonnes per day / plant operating hours
 *   slurry m³/h       = solids / ore SG + solids × (1 − x) / x   (water SG 1)
 *   working volume m³ = slurry m³/h × residence time h
 *   planning volume   = working volume × (1 + allowance)
 *   per tank          = planning volume / number of tanks
 *
 * No tank dimensions are shown: they depend on a shape choice, and the
 * owner asked that tools publish only verifiable calculations (D14).
 *
 * Check: 50 t/day, 24 h, 45% solids, SG 2.7, 24 h residence, 10%, 6 tanks
 * → 79.6 m³ working, 87.6 m³ planning, 14.6 m³ per tank (matches the FAQ).
 */

const TEXT = {
  en: {
    tpd: 'Ore treated (tonnes per day)', hours: 'Plant operating hours per day', solids: 'Slurry density (% solids by mass)',
    sg: 'Ore specific gravity', residence: 'Leach residence time (hours, from your leach test)', tanks: 'Number of tanks',
    allowance: 'Planning allowance (%)', results: 'Results', slurry: 'Slurry flow', working: 'Working volume needed',
    planning: 'Volume with allowance', perTank: 'Volume per tank',
    invalid: 'Enter positive numbers, with solids between 1% and 80%.',
    note: 'A planning estimate only. It excludes freeboard, carbon volume and design margins; a process designer confirms tank geometry, agitators and screens from your test results.',
    perHour: 'm³/h',
  },
  sw: {
    tpd: 'Madini yanayochakatwa (tani kwa siku)', hours: 'Saa za kazi za mtambo kwa siku', solids: 'Msongamano wa tope (% yabisi kwa uzito)',
    sg: 'Msongamano wa madini ukilinganishwa na maji (specific gravity)', residence: 'Muda wa leaching (saa, kutoka jaribio lako)', tanks: 'Idadi ya matanki',
    allowance: 'Ziada ya ujazo kwa kupanga (%)', results: 'Matokeo', slurry: 'Mtiririko wa tope', working: 'Ujazo wa kazi unaohitajika',
    planning: 'Ujazo pamoja na ziada ya kupanga', perTank: 'Ujazo kwa kila tanki',
    invalid: 'Weka namba chanya, na yabisi kati ya 1% na 80%.',
    note: 'Haya ni makadirio ya kupanga tu. Hayajumuishi nafasi kati ya uso wa tope na ukingo wa tanki, ujazo wa kaboni wala nafasi za usanifu; msanifu wa mchakato huthibitisha umbo la matanki, vichanganyio na vichujio kutokana na matokeo ya majaribio yako.',
    perHour: 'm³/saa',
  },
}

const FIELDS = ['tpd', 'hours', 'solids', 'sg', 'residence', 'tanks', 'allowance'] as const
type Field = typeof FIELDS[number]
const DEFAULTS: Record<Field, string> = { tpd: '50', hours: '24', solids: '45', sg: '2.7', residence: '24', tanks: '6', allowance: '10' }

const fmt = (n: number, _lang: 'en' | 'sw', digits = 1) => n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })

export function leachTankVolumes(v: Record<Field, number>) {
  const solidsTph = v.tpd / v.hours
  const x = v.solids / 100
  const slurry = solidsTph / v.sg + (solidsTph * (1 - x)) / x
  const working = slurry * v.residence
  const planning = working * (1 + v.allowance / 100)
  const perTank = planning / Math.max(1, Math.round(v.tanks))
  return { slurry, working, planning, perTank }
}

export default function LeachTankCalculator({ lang = 'en' }: { lang?: 'en' | 'sw' }) {
  const t = TEXT[lang]
  const [values, setValues] = useState<Record<Field, string>>(DEFAULTS)
  const nums = Object.fromEntries(FIELDS.map(f => [f, Number(values[f])])) as Record<Field, number>
  const valid = FIELDS.every(f => Number.isFinite(nums[f]) && (f === 'allowance' ? nums[f] >= 0 : nums[f] > 0))
    && nums.solids >= 1 && nums.solids <= 80 && nums.hours <= 24
  const r = valid ? leachTankVolumes(nums) : null

  return (
    <div className="ltc">
      <div className="ltc-inputs">
        {FIELDS.map(f => (
          <label key={f} className="ltc-field" htmlFor={`ltc-${f}`}>
            <span>{t[f]}</span>
            <input
              id={`ltc-${f}`}
              inputMode="decimal"
              value={values[f]}
              onChange={e => setValues({ ...values, [f]: e.target.value.replace(/[^\d.]/g, '') })}
            />
          </label>
        ))}
      </div>
      <div className="ltc-results" aria-live="polite">
        <h3>{t.results}</h3>
        {r ? (
          <dl>
            <div><dt>{t.slurry}</dt><dd>{fmt(r.slurry, lang, 2)} {t.perHour}</dd></div>
            <div><dt>{t.working}</dt><dd>{fmt(r.working, lang)} m³</dd></div>
            <div><dt>{t.planning}</dt><dd>{fmt(r.planning, lang)} m³</dd></div>
            <div className="ltc-key"><dt>{t.perTank}</dt><dd>{fmt(r.perTank, lang)} m³</dd></div>
          </dl>
        ) : <p>{t.invalid}</p>}
        <p className="ltc-note">{t.note}</p>
      </div>
      <style>{`
        .ltc { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
        .ltc-inputs { display: grid; gap: 14px; }
        .ltc-field { display: grid; gap: 6px; font-size: 14px; color: var(--ink-2); font-weight: 600; }
        .ltc-field input { font: inherit; font-size: 16px; font-weight: 500; padding: 10px 12px; border: 1px solid var(--line);
          border-radius: 6px; background: var(--bg, #fff); color: var(--ink); max-width: 220px; }
        .ltc-field input:focus-visible { outline: 2px solid var(--gold); outline-offset: 1px; }
        .ltc-results { border: 1px solid var(--line); border-radius: 8px; padding: 20px 22px; background: var(--bg, #fff); }
        .ltc-results h3 { font-size: 18px; margin: 0 0 12px; }
        .ltc-results dl { margin: 0; display: grid; gap: 10px; }
        .ltc-results dl > div { display: flex; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--line); padding-bottom: 8px; }
        .ltc-results dt { color: var(--ink-2); font-size: 14.5px; }
        .ltc-results dd { margin: 0; font-weight: 600; color: var(--ink); text-align: right; font-variant-numeric: tabular-nums; }
        .ltc-key dd { color: var(--gold); font-size: 18px; }
        .ltc-note { font-size: 13px; color: var(--ink-3); line-height: 1.55; margin: 14px 0 0; }
        @media (max-width: 860px) { .ltc { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
