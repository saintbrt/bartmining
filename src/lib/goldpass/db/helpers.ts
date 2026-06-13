import type { ColType } from './types'

const COL_RULES: { p: string[]; t: ColType }[] = [
  { p: ['holeid','hole_id','bhid','drillhole','borehole','hole','id'], t: 'hole_id' },
  { p: ['from','from_m','depth_from','frm'],                           t: 'from' },
  { p: ['to','to_m','depth_to','t0'],                                  t: 'to' },
  { p: ['au','gold','au_ppm','au_gpt','au_ppb','grade_au','au_gt','g/t'], t: 'au' },
  { p: ['cu','copper','cu_pct','cu_%','cu_ppm'],                       t: 'cu' },
  { p: ['ag','silver','ag_ppm','ag_gpt'],                              t: 'ag' },
  { p: ['east','easting','x','longitude','lon','utm_e'],               t: 'easting' },
  { p: ['north','northing','y','latitude','lat','utm_n'],              t: 'northing' },
  { p: ['elev','elevation','rl','z','alt'],                            t: 'elevation' },
  { p: ['depth','max_depth','totaldepth','eoh'],                       t: 'depth' },
  { p: ['dip','inclination','incl'],                                   t: 'dip' },
  { p: ['az','azimuth','bearing','strike'],                            t: 'azimuth' },
  { p: ['lith','lithology','rock','formation','unit'],                 t: 'lithology' },
]

export function detectColType(header: string): ColType {
  const h = header.toLowerCase().replace(/[^a-z0-9_]/g, '')
  for (const rule of COL_RULES) {
    if (rule.p.some(p => h === p || h.startsWith(p) || h.includes(p))) return rule.t
  }
  return 'ignore'
}

export function invertColMapping(m: Record<string, string>): Record<string, string> {
  const inv: Record<string, string> = {}
  for (const [col, type] of Object.entries(m ?? {})) {
    if (type && type !== 'ignore' && !(type in inv)) inv[type] = col
  }
  return inv
}

const TYPE_COLOR: Record<string, string> = {
  hole_id: '#34C759', easting: '#007AFF', northing: '#007AFF', elevation: '#007AFF',
  from: '#AF52DE', to: '#AF52DE', au: '#FF9500', cu: '#FF9500', ag: '#FF9500',
  depth: '#5856D6', dip: '#5856D6', azimuth: '#5856D6', lithology: '#30B0C7', ignore: '#AEAEB2',
}
export function typeColor(t: string): string { return TYPE_COLOR[t] ?? '#AEAEB2' }

export function exportCsv(rows: Record<string, unknown>[], filename: string) {
  if (!rows?.length) return
  const headers = Object.keys(rows[0])
  const esc = (v: unknown) => '"' + String(v ?? '').replace(/"/g, '""') + '"'
  const csv = [headers.map(esc).join(','), ...rows.map(r => headers.map(h => esc(r[h])).join(','))].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
}

export function newId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}
export function ts(): string { return new Date().toISOString() }

/* Excel export via SheetJS (lazy-loaded; same data shape as exportCsv). */
export async function exportExcel(rows: Record<string, unknown>[], filename: string) {
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : filename + '.xlsx')
}
