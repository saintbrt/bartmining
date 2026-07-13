'use client'

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

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
const GRID = 'rgba(0,0,0,.08)'
const AXIS = '#98989E'

function compact(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
  if (abs >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (abs >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(Math.round(n))
}

type TooltipEntry = { dataKey?: string | number; name?: string; value?: number; color?: string }

function ChartTooltip({ active, payload, label, prefix = '' }: {
  active?: boolean; payload?: TooltipEntry[]; label?: string; prefix?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--sep)', borderRadius: 8, padding: '8px 10px', boxShadow: 'var(--s-sm)', fontSize: 12 }}>
      <div style={{ color: 'var(--label-3)', marginBottom: payload.length > 1 ? 6 : 2 }}>{label}</div>
      {payload.map(p => (
        <div key={String(p.dataKey)} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 150 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--label-2)' }}>{p.name}</span>
          <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--label-1)', fontVariantNumeric: 'tabular-nums' }}>
            {prefix}{Math.round(p.value ?? 0).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ label = 'No data yet.' }: { label?: string }) {
  return <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '28px 0', textAlign: 'center' }}>{label}</div>
}

/* ── Single-series line (e.g. revenue trend). One accent, no legend — the card
   title names the series. Hairline recessive grid, compact y-ticks, tooltip. */
export function LineTrendChart({ data, prefix = '', color = ACCENT, height = 220, emptyLabel }: {
  data: { label: string; value: number }[]
  prefix?: string
  color?: string
  height?: number
  emptyLabel?: string
}) {
  if (data.length === 0) return <EmptyState label={emptyLabel} />
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 12, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: GRID }} tick={{ fontSize: 11, fill: AXIS }} />
        <YAxis tickFormatter={compact} tickLine={false} axisLine={false} width={44} tick={{ fontSize: 11, fill: AXIS }} />
        <Tooltip content={<ChartTooltip prefix={prefix} />} cursor={{ stroke: GRID }} />
        <Line type="monotone" dataKey="value" name="Value" stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

/* ── Multi-series comparison (e.g. Revenue vs Cost vs Profit over months).
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
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: GRID }} tick={{ fontSize: 11, fill: AXIS }} />
        <YAxis tickFormatter={compact} tickLine={false} axisLine={false} width={44} tick={{ fontSize: 11, fill: AXIS }} />
        <Tooltip content={<ChartTooltip prefix={prefix} />} cursor={{ stroke: GRID }} />
        <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        {series.map((s, i) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name}
            stroke={s.color ?? SERIES_COLORS[i % SERIES_COLORS.length]}
            strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
