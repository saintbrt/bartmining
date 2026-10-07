'use client'

import { useEffect, useState } from 'react'

/**
 * Client-side filters for the equipment directory. The catalogue is fully
 * server-rendered (every card stays in the HTML for search engines); this
 * component only hides cards and empty groups inside `#eq-catalogue` by
 * reading the data attributes each card carries.
 */

export interface FilterLabels {
  search: string
  searchPlaceholder: string
  all: string
  gold: string
  smallScale: string
  /** Template with {n} and {total} placeholders. */
  showing: string
  none: string
  reset: string
}

interface Props {
  categories: { id: string; label: string }[]
  labels: FilterLabels
}

export default function EquipmentFilters({ categories, labels }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [gold, setGold] = useState(false)
  const [small, setSmall] = useState(false)
  const [count, setCount] = useState<{ shown: number; total: number } | null>(null)

  useEffect(() => {
    const root = document.getElementById('eq-catalogue')
    if (!root) return
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-eq-card]'))
    let shown = 0
    for (const card of cards) {
      const d = card.dataset
      const match =
        (!category || d.category === category) &&
        (!gold || d.gold === '1') &&
        (!small || d.small === '1') &&
        words.every(w => (d.text ?? '').includes(w))
      card.hidden = !match
      if (match) shown++
    }
    for (const group of Array.from(root.querySelectorAll<HTMLElement>('[data-eq-group]'))) {
      group.hidden = !group.querySelector('[data-eq-card]:not([hidden])')
    }
    setCount({ shown, total: cards.length })
  }, [query, category, gold, small])

  const filtered = Boolean(query || category || gold || small)
  const reset = () => { setQuery(''); setCategory(''); setGold(false); setSmall(false) }

  return (
    <div className="eqf" role="search">
      <label className="eqf-search">
        <span className="eqf-label">{labels.search}</span>
        <input
          id="eq-filter-search"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          autoComplete="off"
        />
      </label>
      <div className="eqf-chips" aria-label={labels.search}>
        <button type="button" className="eqf-chip" aria-pressed={!category} onClick={() => setCategory('')}>{labels.all}</button>
        {categories.map(c => (
          <button key={c.id} type="button" className="eqf-chip" aria-pressed={category === c.id} onClick={() => setCategory(category === c.id ? '' : c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="eqf-chips">
        <button type="button" className="eqf-chip eqf-toggle" aria-pressed={gold} onClick={() => setGold(!gold)}>{labels.gold}</button>
        <button type="button" className="eqf-chip eqf-toggle" aria-pressed={small} onClick={() => setSmall(!small)}>{labels.smallScale}</button>
      </div>
      <p className="eqf-count" aria-live="polite">
        {count && (count.shown ? labels.showing.replace('{n}', String(count.shown)).replace('{total}', String(count.total)) : labels.none)}
        {filtered && <> · <button type="button" className="eqf-reset" onClick={reset}>{labels.reset}</button></>}
      </p>
      <style>{`
        [data-eq-card][hidden], [data-eq-group][hidden] { display: none !important; }
        .eqf { margin: 8px 0 28px; display: grid; gap: 12px; }
        .eqf-search { display: grid; gap: 6px; max-width: 420px; }
        .eqf-label { font-size: 13px; font-weight: 600; color: var(--ink-2); }
        .eqf-search input { font: inherit; font-size: 16px; padding: 10px 12px; border: 1px solid var(--line);
          border-radius: 6px; background: var(--bg, #fff); color: var(--ink); }
        .eqf-search input:focus-visible { outline: 2px solid var(--gold); outline-offset: 1px; }
        .eqf-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .eqf-chip { font: inherit; font-size: 14px; padding: 7px 12px; border-radius: 999px; cursor: pointer;
          border: 1px solid var(--line); background: transparent; color: var(--ink-2); }
        .eqf-chip:hover { border-color: var(--ink-3); color: var(--ink); }
        .eqf-chip[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--bg, #fff); }
        .eqf-chip:focus-visible, .eqf-reset:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .eqf-count { font-size: 14px; color: var(--ink-3); margin: 0; }
        .eqf-reset { font: inherit; background: none; border: 0; padding: 0; color: var(--gold); cursor: pointer; text-decoration: underline; }
      `}</style>
    </div>
  )
}
