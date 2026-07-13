/* Column-type detection for user-uploaded CSV/Excel files (Max Gold Finder).
   Ported from the old drill db/helpers.ts when that module was removed, this
   part is a general file-import utility, not drill-specific. */

export type ColType =
  | 'hole_id' | 'from' | 'to' | 'au' | 'cu' | 'ag'
  | 'easting' | 'northing' | 'elevation' | 'depth'
  | 'dip' | 'azimuth' | 'lithology' | 'ignore'

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
