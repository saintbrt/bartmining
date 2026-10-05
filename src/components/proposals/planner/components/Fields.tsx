import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Number input that keeps the text you type until you leave the field, so
 * "0." or an empty box doesn't snap back mid-edit. `percent` shows 0.3 as 30.
 */
export function Num({ value, onChange, percent, step, width, align = 'right', label }: {
  value: number
  onChange: (v: number) => void
  percent?: boolean
  step?: number
  width?: number
  align?: 'left' | 'right'
  label?: string
}) {
  const shown = percent ? round(value * 100) : value
  const [text, setText] = useState(String(shown))
  const focused = useRef(false)
  useEffect(() => { if (!focused.current) setText(String(shown)) }, [shown])

  const commit = (t: string) => {
    const n = Number(t.replace(/,/g, ''))
    if (t.trim() !== '' && Number.isFinite(n)) onChange(percent ? n / 100 : n)
  }
  return (
    <span className="num-field" style={width ? { width } : undefined}>
      <input
        aria-label={label}
        inputMode="decimal"
        value={text}
        step={step}
        style={{ textAlign: align }}
        onFocus={e => { focused.current = true; e.target.select() }}
        onChange={e => { setText(e.target.value); commit(e.target.value) }}
        onBlur={() => { focused.current = false; setText(String(shown)) }}
      />
      {percent && <span className="unit">%</span>}
    </span>
  )
}

const round = (n: number) => Math.round(n * 1e6) / 1e6

export function Text({ value, onChange, placeholder, label }: {
  value: string; onChange: (v: string) => void; placeholder?: string; label?: string
}) {
  return <input className="text-field" aria-label={label} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
}

/** Textarea that grows with its content. */
export function Area({ value, onChange, rows = 2, className, label }: {
  value: string; onChange: (v: string) => void; rows?: number; className?: string; label?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight + 2}px` }
  }, [value])
  return <textarea ref={ref} aria-label={label} className={`area ${className ?? ''}`} rows={rows} value={value} onChange={e => onChange(e.target.value)} />
}

export function Segmented<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void
}) {
  return (
    <div className="segmented" role="tablist">
      {options.map(o => (
        <button key={o.value} role="tab" aria-selected={o.value === value} className={o.value === value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="section">
      <header className="section-head">
        <h2>{title}</h2>
        {aside && <div className="section-aside">{aside}</div>}
      </header>
      {children}
    </section>
  )
}

export function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {note && <div className="stat-note">{note}</div>}
    </div>
  )
}

/** Marks a block that must never reach the client. */
export function Internal({ children }: { children?: ReactNode }) {
  return <span className="internal-tag" title="Internal only. Never shown in the proposal.">{children ?? 'Internal'}</span>
}
