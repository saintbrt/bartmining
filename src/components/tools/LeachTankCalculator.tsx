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
 * Layout: inputs grouped into three fieldsets (throughput, slurry, leach
 * design) with units inside the fields; results in a side panel that leads
 * with the main answer (volume per tank). One column on narrow screens.
 *
 * Check: 50 t/day, 24 h, 45% solids, SG 2.7, 24 h residence, 10%, 6 tanks
 * → 79.6 m³ working, 87.6 m³ planning, 14.6 m³ per tank (matches the FAQ).
 */

type Field = 'tpd' | 'hours' | 'solids' | 'sg' | 'residence' | 'tanks' | 'allowance'
type FieldText = { label: string; unit?: string; help?: string }

const TEXT = {
  en: {
    groups: { throughput: 'Plant throughput', slurry: 'Slurry', leach: 'Leach design' },
    fields: {
      tpd: { label: 'Ore treated', unit: 't/day' },
      hours: { label: 'Operating hours', unit: 'h/day' },
      solids: { label: 'Slurry density', unit: '% solids', help: 'By mass' },
      sg: { label: 'Ore specific gravity', help: 'Typically 2.6–2.8' },
      residence: { label: 'Residence time', unit: 'h', help: 'From your leach test' },
      tanks: { label: 'Number of tanks' },
      allowance: { label: 'Planning allowance', unit: '%' },
    } as Record<Field, FieldText>,
    results: 'Results', perTank: 'Volume per tank', slurry: 'Slurry flow', working: 'Working volume needed', planning: 'Volume with allowance',
    tanksOf: (n: number) => `${n} tank${n === 1 ? '' : 's'}`,
    invalid: 'Enter positive numbers, with solids between 1% and 80% and no more than 24 operating hours.',
    note: 'A planning estimate only. It excludes freeboard, carbon volume and design margins; a process designer confirms tank geometry, agitators and screens from your test results.',
    perHour: 'm³/h',
  },
  sw: {
    groups: { throughput: 'Uwezo wa mtambo', slurry: 'Tope', leach: 'Usanifu wa leaching' },
    fields: {
      tpd: { label: 'Madini yanayochakatwa', unit: 't/siku' },
      hours: { label: 'Saa za kazi', unit: 'saa/siku' },
      solids: { label: 'Msongamano wa tope', unit: '% yabisi', help: 'Kwa uzito' },
      sg: { label: 'Specific gravity ya madini', help: 'Msongamano ukilinganishwa na maji; kwa kawaida 2.6–2.8' },
      residence: { label: 'Muda wa leaching', unit: 'saa', help: 'Kutoka jaribio lako' },
      tanks: { label: 'Idadi ya matanki' },
      allowance: { label: 'Ziada ya ujazo kwa kupanga', unit: '%' },
    } as Record<Field, FieldText>,
    results: 'Matokeo', perTank: 'Ujazo kwa kila tanki', slurry: 'Mtiririko wa tope', working: 'Ujazo wa kazi unaohitajika', planning: 'Ujazo pamoja na ziada ya kupanga',
    tanksOf: (n: number) => `matanki ${n}`,
    invalid: 'Weka namba chanya, na yabisi kati ya 1% na 80% na saa za kazi zisizozidi 24.',
    note: 'Haya ni makadirio ya kupanga tu. Hayajumuishi nafasi kati ya uso wa tope na ukingo wa tanki, ujazo wa kaboni wala nafasi za usanifu; msanifu wa mchakato huthibitisha umbo la matanki, vichanganyio na vichujio kutokana na matokeo ya majaribio yako.',
    perHour: 'm³/saa',
  },
}

const GROUPS: { id: 'throughput' | 'slurry' | 'leach'; fields: Field[] }[] = [
  { id: 'throughput', fields: ['tpd', 'hours'] },
  { id: 'slurry', fields: ['solids', 'sg'] },
  { id: 'leach', fields: ['residence', 'tanks', 'allowance'] },
]
const FIELDS: Field[] = GROUPS.flatMap(g => g.fields)
const DEFAULTS: Record<Field, string> = { tpd: '50', hours: '24', solids: '45', sg: '2.7', residence: '24', tanks: '6', allowance: '10' }

const fmt = (n: number, digits = 1) => n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })

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
  const tanks = Math.max(1, Math.round(nums.tanks || 1))

  return (
    <div className="ltc">
      <form className="ltc-form" onSubmit={e => e.preventDefault()} noValidate>
        {GROUPS.map(g => (
          <fieldset key={g.id} className="ltc-group">
            <legend>{t.groups[g.id]}</legend>
            <div className="ltc-fields">
              {g.fields.map(f => {
                const ft = t.fields[f]
                return (
                  <div key={f} className="ltc-field">
                    <label htmlFor={`ltc-${f}`}>{ft.label}</label>
                    <div className="ltc-input">
                      <input
                        id={`ltc-${f}`}
                        inputMode="decimal"
                        value={values[f]}
                        aria-describedby={ft.help ? `ltc-${f}-help` : undefined}
                        onChange={e => setValues({ ...values, [f]: e.target.value.replace(/[^\d.]/g, '') })}
                      />
                      {ft.unit && <span className="ltc-unit" aria-hidden="true">{ft.unit}</span>}
                    </div>
                    {ft.help && <span id={`ltc-${f}-help`} className="ltc-help">{ft.help}</span>}
                  </div>
                )
              })}
            </div>
          </fieldset>
        ))}
      </form>

      <aside className="ltc-results" aria-live="polite" aria-label={t.results}>
        <h3>{t.results}</h3>
        {r ? (
          <>
            <div className="ltc-main">
              <span className="ltc-main-label">{t.perTank}</span>
              <span className="ltc-main-value">{fmt(r.perTank)} <small>m³</small></span>
              <span className="ltc-main-sub">{t.tanksOf(tanks)}</span>
            </div>
            <dl>
              <div><dt>{t.planning}</dt><dd>{fmt(r.planning)} m³</dd></div>
              <div><dt>{t.working}</dt><dd>{fmt(r.working)} m³</dd></div>
              <div><dt>{t.slurry}</dt><dd>{fmt(r.slurry, 2)} {t.perHour}</dd></div>
            </dl>
          </>
        ) : <p className="ltc-invalid" role="alert">{t.invalid}</p>}
        <p className="ltc-note">{t.note}</p>
      </aside>

      <style>{`
        .ltc { display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 340px); gap: 28px; align-items: start; }
        .ltc-form { display: grid; gap: 22px; min-width: 0; }
        .ltc-group { border: 0; margin: 0; padding: 0; min-width: 0; }
        .ltc-group legend { padding: 0; margin-bottom: 12px; font-family: var(--font-mono, ui-monospace, monospace); font-size: 12px;
          font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--gold); }
        .ltc-fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px 20px; }
        .ltc-field { display: grid; gap: 6px; align-content: start; min-width: 0; }
        .ltc-field label { font-size: 15px; font-weight: 600; color: var(--ink); line-height: 1.35; }
        .ltc-input { display: flex; align-items: stretch; border: 1px solid var(--line); border-radius: 6px; background: var(--bg, #fff); overflow: hidden; }
        .ltc-input:focus-within { outline: 2px solid var(--gold); outline-offset: 1px; border-color: var(--gold); }
        .ltc-input input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 17px; font-weight: 600;
          padding: 11px 12px; color: var(--ink); font-variant-numeric: tabular-nums; }
        .ltc-unit { display: flex; align-items: center; padding: 0 12px; font-size: 14px; color: var(--ink-3); background: var(--paper, #f4f6f6);
          border-left: 1px solid var(--line); white-space: nowrap; }
        .ltc-help { font-size: 13px; color: var(--ink-3); }
        .ltc-results { position: sticky; top: calc(env(safe-area-inset-top, 0px) + 96px); border: 1px solid var(--line); border-radius: 10px;
          padding: 22px; background: var(--bg, #fff); display: grid; gap: 16px; }
        .ltc-results h3 { font-size: 16px; margin: 0; }
        .ltc-main { display: grid; gap: 4px; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
        .ltc-main-label { font-size: 14px; font-weight: 600; color: var(--ink-2); }
        .ltc-main-value { font-size: 40px; font-weight: 700; line-height: 1.05; color: var(--gold); font-variant-numeric: tabular-nums; }
        .ltc-main-value small { font-size: 18px; font-weight: 600; color: var(--ink-3); }
        .ltc-main-sub { font-size: 13px; color: var(--ink-3); }
        .ltc-results dl { margin: 0; display: grid; gap: 10px; }
        .ltc-results dl > div { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }
        .ltc-results dt { font-size: 14px; color: var(--ink-2); }
        .ltc-results dd { margin: 0; font-size: 15px; font-weight: 600; color: var(--ink); text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
        .ltc-invalid { margin: 0; color: var(--ink-2); }
        .ltc-note { margin: 0; font-size: 13px; color: var(--ink-3); line-height: 1.55; }
        @media (max-width: 900px) {
          .ltc { grid-template-columns: 1fr; }
          .ltc-results { position: static; }
        }
      `}</style>
    </div>
  )
}
