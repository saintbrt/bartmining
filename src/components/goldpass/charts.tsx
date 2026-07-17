'use client'

import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

// Reserved status ink for deltas/meters: good vs bad only, never decoration.
const GOOD = '#0D8F5F'
const BAD = '#D63A39'
const WARN = '#B8770A'

/* Shared chart primitives for the GoldPass admin panel.

   Minimum-colour data-viz system (see admin.css chart tokens):
   - Single-series line uses ONE accent.
   - Multi-series comparison uses a validated colourblind-safe categorical set,
     assigned in fixed order (never cycled). It passes the dataviz six-checks
     (CVD worst-adjacent ΔE 12.5, contrast >= 3:1 on the light surface).
   - Values/labels wear text ink; only the marks carry the data colour.

   These hex constants mirror the CSS tokens because Recharts renders SVG
   presentation attributes, which don't resolve CSS custom properties. */
export const ACCENT = '#2A78D6'
export const SERIES_COLORS = ['#2A78D6', '#0D8F5F', '#B8770A', '#4A3AA7', '#D63A39', '#C85018']
const GRID = 'rgba(0,0,0,.06)'
const AXIS = '#98989E'
/* Numerals wear the mono stack (mirrors --font-mono in admin.css). */
const MONO = 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace'

function compact(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
  if (abs >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (abs >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(Math.round(n))
}

type TooltipEntry = { dataKey?: string | number; name?: string; value?: number; color?: string; payload?: Record<string, unknown> }

function ChartTooltip({ active, payload, label, prefix = '' }: {
  active?: boolean; payload?: TooltipEntry[]; label?: string; prefix?: string
}) {
  if (!active || !payload?.length) return null
  /* Prefer primary series values; gold overlay uses raw TSh from row payload
     (scaled geometry must never appear in the tooltip). */
  const row = payload[0]?.payload
  const primaryEntry = payload.find(p => p.dataKey === 'value') ?? payload[0]
  const goldRaw = row && typeof row.goldRaw === 'number' ? row.goldRaw as number : null
  const primaryName = (primaryEntry?.name && primaryEntry.name !== 'Value') ? String(primaryEntry.name) : 'Sales'
  const goldLabel = typeof row?.goldLabel === 'string' ? row.goldLabel as string : 'Gold'

  if (goldRaw != null) {
    return (
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--sep)', borderRadius: 'var(--r-sm)', padding: '8px 12px', boxShadow: 'var(--s-sm)', minWidth: 160 }}>
        <div style={{ fontSize: 11, color: 'var(--label-3)', marginBottom: 6 }}>{label}</div>
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: 'var(--label-3)', marginBottom: 1 }}>{primaryName}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--label-1)', fontFamily: MONO, fontVariantNumeric: 'tabular-nums' }}>
            {prefix}{Math.round(primaryEntry?.value ?? 0).toLocaleString()}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--sep)', paddingTop: 6 }}>
          <div style={{ fontSize: 11, color: 'var(--label-3)', marginBottom: 1 }}>{goldLabel}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--label-2)', fontFamily: MONO, fontVariantNumeric: 'tabular-nums' }}>
            TSh {Math.round(goldRaw).toLocaleString()}/g
          </div>
        </div>
      </div>
    )
  }

  /* Single series: small gray label over one big mono value. Multi-series:
     the label plus a swatch-name-value row per series, values in mono. */
  if (payload.length === 1) {
    const p = payload[0]
    return (
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--sep)', borderRadius: 'var(--r-sm)', padding: '8px 12px', boxShadow: 'var(--s-sm)' }}>
        <div style={{ fontSize: 11, color: 'var(--label-3)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--label-1)', fontFamily: MONO, fontVariantNumeric: 'tabular-nums' }}>
          {prefix}{Math.round(p.value ?? 0).toLocaleString()}
        </div>
      </div>
    )
  }
  return (
    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--sep)', borderRadius: 'var(--r-sm)', padding: '8px 12px', boxShadow: 'var(--s-sm)', fontSize: 12 }}>
      <div style={{ fontSize: 11, color: 'var(--label-3)', marginBottom: 6 }}>{label}</div>
      {payload.filter(p => p.dataKey !== 'gold').map(p => (
        <div key={String(p.dataKey)} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 150 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--label-2)' }}>{p.name}</span>
          <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--label-1)', fontFamily: MONO, fontVariantNumeric: 'tabular-nums' }}>
            {prefix}{Math.round(p.value ?? 0).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Faint market-gold overlay. `values` are scaled for drawing; `rawValues` are
    real TSh/g for the tooltip. */
export type ChartGoldOverlay = {
  values: (number | null)[]
  rawValues: (number | null)[]
  name?: string
  color?: string
  strokeOpacity?: number
}

/** Very light gold — context only, never competes with the primary accent. */
export const GOLD_OVERLAY = '#E8D5A3'

function EmptyState({ label = 'No data yet.' }: { label?: string }) {
  return <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '28px 0', textAlign: 'center' }}>{label}</div>
}

/* Single-series line (e.g. revenue trend). One accent, no legend: the card
   title names the series. Straight segments (not a spline), a faint gradient
   wash under the line, hairline recessive grid, mono ticks, dashed cursor.
   Optional `gold` overlays market gold as a very light, low-opacity line
   (scaled into the primary domain for geometry; raw TSh/g in tooltip). */
export function LineTrendChart({ data, gold, valueName = 'Sales', prefix = '', color = ACCENT, height = 220, emptyLabel }: {
  data: { label: string; value: number }[]
  gold?: ChartGoldOverlay | null
  valueName?: string
  prefix?: string
  color?: string
  height?: number
  emptyLabel?: string
}) {
  if (data.length === 0) return <EmptyState label={emptyLabel} />
  const gradId = `gp-trend-${color.replace('#', '')}`
  const hasGold = !!gold && gold.values.some(v => v != null)
  const goldColor = gold?.color ?? GOLD_OVERLAY
  const goldOpacity = gold?.strokeOpacity ?? 0.42
  const goldName = gold?.name ?? 'Gold (market)'
  const rows = data.map((d, i) => ({
    ...d,
    gold: gold?.values[i] ?? null,
    goldRaw: gold?.rawValues[i] ?? null,
    goldLabel: goldName,
  }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={rows} margin={{ top: 12, right: 16, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.12} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: GRID }} tick={{ fontSize: 11, fill: AXIS, fontFamily: MONO }} />
        <YAxis tickFormatter={compact} tickLine={false} axisLine={false} width={44} tick={{ fontSize: 11, fill: AXIS, fontFamily: MONO }} />
        <Tooltip content={<ChartTooltip prefix={prefix} />} cursor={{ stroke: AXIS, strokeDasharray: '3 3' }} />
        {hasGold && (
          <Area type="linear" dataKey="gold" name={goldName} stroke={goldColor} strokeWidth={1.5}
            strokeOpacity={goldOpacity} fill="none" dot={false} activeDot={{ r: 3, fill: goldColor, strokeOpacity: 1 }}
            isAnimationActive={false} connectNulls />
        )}
        <Area type="linear" dataKey="value" name={valueName} stroke={color} strokeWidth={2}
          fill={`url(#${gradId})`} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* Multi-series comparison (e.g. Revenue vs Cost vs Profit over months).
   Legend always present; series colours assigned in fixed order from the
   validated categorical set; one shared y-axis (never dual-axis). */
export function MultiLineChart({ data, series, prefix = '', height = 260, emptyLabel }: {
  data: Record<string, string | number>[]
  series: { key: string; name: string; color?: string }[]
  prefix?: string
  height?: number
  emptyLabel?: string
}) {
  if (data.length === 0) return <EmptyState label={emptyLabel} />
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 12, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: GRID }} tick={{ fontSize: 11, fill: AXIS, fontFamily: MONO }} />
        <YAxis tickFormatter={compact} tickLine={false} axisLine={false} width={44} tick={{ fontSize: 11, fill: AXIS, fontFamily: MONO }} />
        <Tooltip content={<ChartTooltip prefix={prefix} />} cursor={{ stroke: AXIS, strokeDasharray: '3 3' }} />
        <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        {series.map((s, i) => (
          <Line key={s.key} type="linear" dataKey={s.key} name={s.name}
            stroke={s.color ?? SERIES_COLORS[i % SERIES_COLORS.length]}
            strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

/* Single-hue bar/column comparison (magnitude across a few categories).
   One accent for every bar (bar length already shows the value, colour must
   not re-encode it); 4px rounded caps, hairline grid, tooltip. */
export function BarCompareChart({ data, prefix = '', color = ACCENT, height = 200, emptyLabel }: {
  data: { label: string; value: number }[]
  prefix?: string
  color?: string
  height?: number
  emptyLabel?: string
}) {
  if (data.length === 0) return <EmptyState label={emptyLabel} />
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 12, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: GRID }} tick={{ fontSize: 11, fill: AXIS, fontFamily: MONO }} />
        <YAxis tickFormatter={compact} tickLine={false} axisLine={false} width={44} tick={{ fontSize: 11, fill: AXIS, fontFamily: MONO }} />
        <Tooltip content={<ChartTooltip prefix={prefix} />} cursor={{ fill: 'rgba(0,0,0,.04)' }} />
        <Bar dataKey="value" name="Value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/* Stat tile: label over a big mono value, delta (colour = direction times
   whether up is good, a reserved status use) with a "vs last month" sublabel,
   optional sparkline. The value wears ink; only the delta carries colour. */
export function StatTile({ label, value, prefix = '', delta, deltaLabel = 'vs last month', spark, goodWhenUp = true }: {
  label: string
  value: number
  prefix?: string
  delta?: number            // signed percentage vs previous period
  deltaLabel?: string       // context line shown after the delta
  spark?: number[]          // trailing series for the sparkline
  goodWhenUp?: boolean      // whether an increase is good (revenue) or bad (cost)
}) {
  const good = delta != null && (delta >= 0 ? goodWhenUp : !goodWhenUp)
  const deltaColor = delta == null || delta === 0 ? 'var(--label-4)' : good ? GOOD : BAD
  const sparkData = (spark ?? []).map((v, i) => ({ i, v }))
  return (
    <div className="card">
      <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 4 }}>{label}</div>
      <div className="stat-value-sm">{prefix}{Math.round(value).toLocaleString()}</div>
      {delta != null && (
        <div style={{ fontSize: 11, color: 'var(--label-4)', marginTop: 4 }}>
          <span className="num" style={{ fontWeight: 600, color: deltaColor }}>
            {delta > 0 ? '↑' : delta < 0 ? '↓' : ''}{Math.abs(delta).toFixed(0)}%
          </span>{' '}{deltaLabel}
        </div>
      )}
      {sparkData.length > 1 && (
        <div style={{ height: 34, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
              <Line type="linear" dataKey="v" stroke="var(--label-4)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

/* Metric strip: the hero chart's attached KPI row. Each cell is a button:
   gray label, big mono value, delta + context line. The active cell wears a
   2px ink bar across its top (tab affordance). Values are preformatted
   strings so callers control prefix/units. Collapses 4 -> 2x2 via grid-kpi
   breakpoints (grid-template-columns set inline to divide evenly). */
export type MetricStripItem = {
  key: string
  label: string
  value: string
  delta?: number
  deltaLabel?: string
  goodWhenUp?: boolean
}

export function MetricStrip({ metrics, active, onSelect }: {
  metrics: MetricStripItem[]
  active: string
  onSelect: (key: string) => void
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`, borderTop: '1px solid var(--sep)' }}>
      {metrics.map((m, i) => {
        const isActive = m.key === active
        const good = m.delta != null && (m.delta >= 0 ? (m.goodWhenUp ?? true) : !(m.goodWhenUp ?? true))
        const deltaColor = m.delta == null || m.delta === 0 ? 'var(--label-4)' : good ? GOOD : BAD
        return (
          <button
            key={m.key}
            onClick={() => onSelect(m.key)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              padding: '14px 16px 12px',
              borderTop: isActive ? '2px solid var(--label-1)' : '2px solid transparent',
              marginTop: -1,
              borderRight: i < metrics.length - 1 ? '1px solid var(--sep)' : 'none',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ fontSize: 12, color: isActive ? 'var(--label-1)' : 'var(--label-3)', fontWeight: isActive ? 600 : 400, marginBottom: 6 }}>
              {m.label}
            </div>
            <div className="stat-value">{m.value}</div>
            {m.delta != null && (
              <div style={{ fontSize: 11, color: 'var(--label-4)', marginTop: 4 }}>
                <span className="num" style={{ fontWeight: 600, color: deltaColor }}>
                  {m.delta > 0 ? '↑' : m.delta < 0 ? '↓' : ''}{Math.abs(m.delta).toFixed(1)}%
                </span>{' '}{m.deltaLabel ?? 'vs last month'}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* Meter: one ratio against a limit. Track is a lighter step; fill severity
   goes accent → warning → danger as it approaches/exceeds the limit. */
export function Meter({ value, max, label, prefix = '', suffix = '', format }: {
  value: number
  max: number
  label?: string
  prefix?: string
  suffix?: string
  format?: (n: number) => string
}) {
  const fmt = format ?? ((n: number) => Math.round(n).toLocaleString())
  const ratio = max > 0 ? value / max : 0
  const pct = Math.min(100, Math.max(0, ratio * 100))
  const fill = ratio > 1 ? BAD : ratio > 0.85 ? WARN : ACCENT
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: 'var(--label-3)' }}>{label}</span>
          <span style={{ color: 'var(--label-1)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            {prefix}{fmt(value)}{suffix} <span style={{ color: 'var(--label-4)', fontWeight: 400 }}>/ {prefix}{fmt(max)}{suffix}</span>
          </span>
        </div>
      )}
      <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-3)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: fill, borderRadius: 4, transition: 'width .4s ease' }} />
      </div>
    </div>
  )
}
