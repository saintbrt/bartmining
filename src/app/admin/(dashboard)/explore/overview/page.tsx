'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/goldpass/supabase/client'
import { notify } from '@/lib/goldpass/notify'

// ─── Types ────────────────────────────────────────────────────────────────────
type Vertex = { seq: number; lat: number; lng: number; label: string }
type Site = { id: string; name: string; prefix: string }
type Team = { id: string; name: string; color_hex: string; site_id: string }
type Stats = { activeTeams: number; holesThisWeek: number; photosPending: number; alertsSent: number }
type TeamRow = { id: string; name: string; color_hex: string; completed: number; total: number }
type Alert = { id: string; message: string; priority: string; created_at: string; target_type: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapboxGL = any

const MAPBOX_VERSION = '3.3.0'
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const TEAM_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

// ─── Helpers ─────────────────────────────────────────────────────────────────
function loadMapbox(): Promise<MapboxGL> {
  return new Promise((resolve, reject) => {
    const w = window as Window & { mapboxgl?: MapboxGL }
    if (w.mapboxgl) { resolve(w.mapboxgl); return }
    if (!document.getElementById('mapbox-css')) {
      const link = document.createElement('link')
      link.id = 'mapbox-css'
      link.rel = 'stylesheet'
      link.href = `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_VERSION}/mapbox-gl.css`
      document.head.appendChild(link)
    }
    const script = document.createElement('script')
    script.src = `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_VERSION}/mapbox-gl.js`
    script.onload = () => resolve(w.mapboxgl)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function polygonArea(verts: Vertex[]): number {
  // Shoelace in degrees, convert to m²
  let area = 0
  const n = verts.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += verts[i].lng * verts[j].lat
    area -= verts[j].lng * verts[i].lat
  }
  const degArea = Math.abs(area) / 2
  // 1 deg² ≈ (111320)² m² at equator — rough but sufficient for preview
  return degArea * 111320 * 111320
}

function polygonPerimeterM(verts: Vertex[]): number {
  let total = 0
  for (let i = 0; i < verts.length; i++) {
    const j = (i + 1) % verts.length
    total += haversineM(verts[i].lat, verts[i].lng, verts[j].lat, verts[j].lng)
  }
  return total
}

function pointInPolygon(lat: number, lng: number, verts: Vertex[]): boolean {
  let inside = false
  const n = verts.length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = verts[i].lng, yi = verts[i].lat
    const xj = verts[j].lng, yj = verts[j].lat
    const intersect = ((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

function generateGridPoints(verts: Vertex[], hM: number, vM: number): { lat: number; lng: number }[] {
  if (verts.length < 3 || hM <= 0 || vM <= 0) return []
  const lats = verts.map(v => v.lat), lngs = verts.map(v => v.lng)
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)
  const latPerM = 1 / 111320
  const lngPerM = 1 / (111320 * Math.cos(((minLat + maxLat) / 2) * Math.PI / 180))
  const points: { lat: number; lng: number }[] = []
  for (let lat = minLat; lat <= maxLat; lat += vM * latPerM) {
    for (let lng = minLng; lng <= maxLng; lng += hM * lngPerM) {
      if (pointInPolygon(lat, lng, verts)) points.push({ lat, lng })
    }
  }
  return points
}

function generateHoleId(prefix: string, idx: number): string {
  const cols = idx % 999 + 1
  const rowIdx = Math.floor(idx / 999)
  let rowLetter = ''
  let r = rowIdx
  do {
    rowLetter = String.fromCharCode(65 + (r % 26)) + rowLetter
    r = Math.floor(r / 26) - 1
  } while (r >= 0)
  return `${prefix.toUpperCase()}-${rowLetter}${String(cols).padStart(3, '0')}`
}

// ─── Map Panel ───────────────────────────────────────────────────────────────
function SiteMapPanel({
  vertices,
  gridPoints,
  painted,
  onMapClick,
}: {
  vertices: Vertex[]
  gridPoints: { lat: number; lng: number }[]
  painted: boolean
  onMapClick: (lat: number, lng: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapboxGL>(null)
  const markersRef = useRef<MapboxGL[]>([])
  const gridLayerRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if (!MAPBOX_TOKEN) return
    loadMapbox().then(mgl => {
      mgl.accessToken = MAPBOX_TOKEN
      const map = new mgl.Map({
        container: containerRef.current!,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [34.8, -6.4],
        zoom: 10,
      })
      map.addControl(new mgl.NavigationControl(), 'top-right')
      map.on('click', (e: { lngLat: { lat: number; lng: number } }) => {
        onMapClick(e.lngLat.lat, e.lngLat.lng)
      })
      map.on('load', () => {
        map.addSource('polygon', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[]] }, properties: {} } })
        map.addLayer({ id: 'polygon-fill', type: 'fill', source: 'polygon', paint: { 'fill-color': '#F59E0B', 'fill-opacity': 0 } })
        map.addLayer({ id: 'polygon-line', type: 'line', source: 'polygon', paint: { 'line-color': '#F59E0B', 'line-width': 2, 'line-dasharray': [4, 3] } })
        map.addSource('grid', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
        map.addLayer({ id: 'grid-points', type: 'circle', source: 'grid', paint: { 'circle-radius': 4, 'circle-color': '#F59E0B', 'circle-opacity': 0.85, 'circle-stroke-width': 1, 'circle-stroke-color': '#fff' } })
        gridLayerRef.current = true
        mapRef.current = map
      })
    })
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [])

  // Update polygon + markers when vertices change
  useEffect(() => {
    const map = mapRef.current
    if (!map || !gridLayerRef.current) return

    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    if (vertices.length === 0) {
      const src = map.getSource('polygon')
      if (src) src.setData({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [[]] }, properties: {} })
      return
    }

    loadMapbox().then(mgl => {
      // Drop numbered pins
      vertices.forEach((v, i) => {
        const el = document.createElement('div')
        el.style.cssText = `width:22px;height:22px;border-radius:50%;background:#F59E0B;color:#000;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #fff;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.4)`
        el.textContent = String(i + 1)
        const marker = new mgl.Marker({ element: el, draggable: false })
          .setLngLat([v.lng, v.lat])
          .addTo(map)
        markersRef.current.push(marker)
      })

      // Draw polygon outline (closes when ≥3 points)
      const coords = vertices.length >= 3
        ? [...vertices.map(v => [v.lng, v.lat]), [vertices[0].lng, vertices[0].lat]]
        : vertices.map(v => [v.lng, v.lat])
      const src = map.getSource('polygon')
      if (src) src.setData({
        type: 'Feature',
        geometry: { type: vertices.length >= 3 ? 'Polygon' : 'LineString', coordinates: vertices.length >= 3 ? [coords] : coords },
        properties: {},
      })

      // Fill opacity
      map.setPaintProperty('polygon-fill', 'fill-opacity', painted && vertices.length >= 3 ? 0.08 : 0)

      // Fly to bounds
      const lngs = vertices.map(v => v.lng), lats = vertices.map(v => v.lat)
      map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: 60, maxZoom: 15 })
    })
  }, [vertices, painted])

  // Update grid points layer
  useEffect(() => {
    const map = mapRef.current
    if (!map || !gridLayerRef.current) return
    const src = map.getSource('grid')
    if (!src) return
    src.setData({
      type: 'FeatureCollection',
      features: gridPoints.map(p => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [p.lng, p.lat] }, properties: {} })),
    })
  }, [gridPoints])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}>
      {!MAPBOX_TOKEN && (
        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg-3)', borderRadius: 12 }}>
          <div style={{ textAlign: 'center', color: 'var(--label-4)', fontSize: 12 }}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>◎</div>
            Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local to enable the map.
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Site Setup Panel ────────────────────────────────────────────────────────
function SiteSetupPanel({
  onCreated,
}: {
  onCreated: () => void
}) {
  const [name, setName] = useState('')
  const [prefix, setPrefix] = useState('')
  const [vertices, setVertices] = useState<Vertex[]>([])
  const [hInterval, setHInterval] = useState('500')
  const [vInterval, setVInterval] = useState('500')
  const [painted, setPainted] = useState(false)
  const [gridPoints, setGridPoints] = useState<{ lat: number; lng: number }[]>([])
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Auto-derive prefix from name
  useEffect(() => {
    if (name && !prefix) {
      const words = name.trim().split(/\s+/)
      setPrefix(words.map(w => w[0]).join('').toUpperCase().slice(0, 4))
    }
  }, [name])

  function addVertex(lat: number, lng: number) {
    if (vertices.length >= 10) { notify('warn', 'Maximum 10 boundary points.'); return }
    setVertices(prev => [...prev, { seq: prev.length + 1, lat, lng, label: `Point ${prev.length + 1}` }])
    setGridPoints([])
  }

  function removeVertex(seq: number) {
    setVertices(prev => {
      const next = prev.filter(v => v.seq !== seq)
      return next.map((v, i) => ({ ...v, seq: i + 1, label: `Point ${i + 1}` }))
    })
    setGridPoints([])
    setPainted(false)
  }

  function updateVertex(seq: number, field: 'lat' | 'lng', raw: string) {
    const val = parseFloat(raw)
    if (isNaN(val)) return
    setVertices(prev => prev.map(v => v.seq === seq ? { ...v, [field]: val } : v))
    setGridPoints([])
    setPainted(false)
  }

  function previewGrid() {
    const pts = generateGridPoints(vertices, parseFloat(hInterval), parseFloat(vInterval))
    if (pts.length === 0) { notify('warn', 'No grid points inside polygon — check intervals or polygon size.'); return }
    setGridPoints(pts)
    notify('info', `${pts.length.toLocaleString()} survey points plotted.`)
  }

  async function saveSite() {
    if (!name.trim()) { notify('warn', 'Site name is required.'); return }
    if (!prefix.trim()) { notify('warn', 'Hole ID prefix is required.'); return }
    if (vertices.length < 3) { notify('warn', 'At least 3 boundary points are required.'); return }
    if (gridPoints.length === 0) { notify('warn', 'Generate the grid first — click Preview Grid.'); return }

    setSaving(true)
    try {
      const sb = createClient()
      const { data: me } = await sb.auth.getUser()

      // Insert site (minimal — no more rows/cols/spacing on sites table)
      const { data: site, error: siteErr } = await sb.from('sites').insert({
        name: name.trim(),
        // Keep legacy columns as 0 so existing schema doesn't reject
        origin_lat: vertices[0].lat,
        origin_lng: vertices[0].lng,
        total_rows: 0,
        total_cols: 0,
        row_spacing_m: parseFloat(vInterval) || 500,
        col_spacing_m: parseFloat(hInterval) || 500,
        created_by: me.user?.id,
      }).select('id').single()
      if (siteErr) throw siteErr

      const siteId = site.id

      // Insert vertices
      const { error: vertErr } = await sb.from('site_vertices').insert(
        vertices.map(v => ({ site_id: siteId, seq: v.seq, lat: v.lat, lng: v.lng, label: v.label }))
      )
      if (vertErr) throw vertErr

      // Insert grid config
      const { error: cfgErr } = await sb.from('site_grid_config').insert({
        site_id: siteId,
        h_interval_m: parseFloat(hInterval),
        v_interval_m: parseFloat(vInterval),
        hole_id_prefix: prefix.trim().toUpperCase(),
      })
      if (cfgErr) throw cfgErr

      // Insert holes in batches of 500
      setGenerating(true)
      const holeBatch = gridPoints.map((p, i) => ({
        site_id: siteId,
        hole_id: generateHoleId(prefix.trim(), i),
        lat: p.lat,
        lng: p.lng,
        grid_x: i % Math.ceil(Math.sqrt(gridPoints.length)),
        grid_y: Math.floor(i / Math.ceil(Math.sqrt(gridPoints.length))),
        status: 'pending',
      }))
      for (let i = 0; i < holeBatch.length; i += 500) {
        const { error } = await sb.from('holes').insert(holeBatch.slice(i, i + 500))
        if (error) throw error
      }

      notify('success', `Site "${name.trim()}" created with ${gridPoints.length.toLocaleString()} survey points.`)
      onCreated()
    } catch (e) {
      notify('error', e instanceof Error ? e.message : String(e))
    } finally { setSaving(false); setGenerating(false) }
  }

  const perimeterM = vertices.length >= 2 ? polygonPerimeterM(vertices) : 0
  const areaM2 = vertices.length >= 3 ? polygonArea(vertices) : 0
  const estimatedPts = gridPoints.length

  return (
    <div style={{ display: 'flex', gap: 0, height: '100%', minHeight: 520 }}>
      {/* Left panel */}
      <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 0, overflowY: 'auto', paddingRight: 20, borderRight: '1px solid var(--sep)' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Create site</div>
          <div style={{ fontSize: 12, color: 'var(--label-3)' }}>Define the boundary polygon, then set grid intervals to place survey points.</div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 2 }}>
            <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Site name</div>
            <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Singida Block A" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Hole ID prefix</div>
            <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={prefix} onChange={e => setPrefix(e.target.value.toUpperCase().slice(0, 5))} placeholder="SBA" />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Boundary points <span style={{ fontWeight: 400, color: 'var(--label-4)' }}>({vertices.length}/10 — min 3)</span></span>
            <span style={{ fontSize: 11, color: 'var(--label-4)' }}>Click map to add</span>
          </div>
          {vertices.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '12px 0', textAlign: 'center', background: 'var(--bg-3)', borderRadius: 8 }}>
              Click on the map to place boundary points
            </div>
          )}
          {vertices.map(v => (
            <div key={v.seq} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold)', color: '#000', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{v.seq}</div>
              <input
                className="input"
                style={{ flex: 1, fontSize: 11, padding: '4px 8px' }}
                defaultValue={v.lat.toFixed(6)}
                onBlur={e => updateVertex(v.seq, 'lat', e.target.value)}
                placeholder="Lat"
              />
              <input
                className="input"
                style={{ flex: 1, fontSize: 11, padding: '4px 8px' }}
                defaultValue={v.lng.toFixed(6)}
                onBlur={e => updateVertex(v.seq, 'lng', e.target.value)}
                placeholder="Lng"
              />
              <button className="btn-icon" style={{ fontSize: 10, color: 'var(--red)', flexShrink: 0 }} onClick={() => removeVertex(v.seq)}>✕</button>
            </div>
          ))}
        </div>

        {vertices.length >= 3 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setPainted(p => !p)}>
              {painted ? 'Hide fill' : 'Paint area'}
            </button>
            {perimeterM > 0 && (
              <span style={{ fontSize: 11, color: 'var(--label-4)', alignSelf: 'center' }}>
                {(perimeterM / 1000).toFixed(2)} km perimeter · {(areaM2 / 1e6).toFixed(3)} km²
              </span>
            )}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Grid intervals</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Horizontal (m)</div>
              <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={hInterval} onChange={e => setHInterval(e.target.value)} placeholder="500" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--label-4)', marginBottom: 4 }}>Vertical (m)</div>
              <input className="input" style={{ width: '100%', boxSizing: 'border-box' }} value={vInterval} onChange={e => setVInterval(e.target.value)} placeholder="500" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button className="btn btn-secondary btn-sm" onClick={previewGrid} disabled={vertices.length < 3}>
            Preview grid
          </button>
          {estimatedPts > 0 && (
            <span style={{ fontSize: 11, color: 'var(--label-4)', alignSelf: 'center' }}>
              {estimatedPts.toLocaleString()} survey points
            </span>
          )}
        </div>

        {estimatedPts > 0 && (
          <div style={{ background: 'var(--bg-3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Grid summary</div>
            <div style={{ color: 'var(--label-3)', lineHeight: 1.6 }}>
              <div>{estimatedPts.toLocaleString()} holes · IDs: <span style={{ fontFamily: 'monospace' }}>{prefix || 'XX'}-A001 → {generateHoleId(prefix || 'XX', estimatedPts - 1)}</span></div>
              <div>{hInterval} m × {vInterval} m spacing</div>
            </div>
          </div>
        )}

        <button
          className="btn btn-primary btn-sm"
          style={{ width: '100%' }}
          onClick={saveSite}
          disabled={saving || generating || vertices.length < 3 || gridPoints.length === 0 || !name.trim()}>
          {generating ? 'Generating holes…' : saving ? 'Saving…' : 'Save site'}
        </button>
      </div>

      {/* Map */}
      <div style={{ flex: 1, paddingLeft: 20 }}>
        <SiteMapPanel
          vertices={vertices}
          gridPoints={gridPoints}
          painted={painted}
          onMapClick={addVertex}
        />
      </div>
    </div>
  )
}

// ─── Team Panel ───────────────────────────────────────────────────────────────
function TeamPanel({ site, teams, onChanged }: { site: Site; teams: Team[]; onChanged: () => void }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(TEAM_COLORS[0])
  const [saving, setSaving] = useState(false)

  async function addTeam() {
    if (!name.trim()) { notify('warn', 'Enter a team name.'); return }
    setSaving(true)
    try {
      const sb = createClient()
      const { error } = await sb.from('explore_teams').insert({ site_id: site.id, name: name.trim(), color_hex: color }).select().single()
      if (error) throw error
      notify('success', `Team "${name.trim()}" added.`)
      setName('')
      onChanged()
    } catch (e) {
      notify('error', e instanceof Error ? e.message : String(e))
    } finally { setSaving(false) }
  }

  async function deleteTeam(id: string, teamName: string) {
    if (!window.confirm(`Delete team "${teamName}"?`)) return
    const sb = createClient()
    const { error } = await sb.from('explore_teams').delete().eq('id', id)
    if (error) { notify('error', error.message); return }
    notify('info', `Team "${teamName}" deleted.`)
    onChanged()
  }

  const siteTeams = teams.filter(t => t.site_id === site.id)

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Teams — {site.name}</div>
      <div style={{ fontSize: 12, color: 'var(--label-3)', marginBottom: 14 }}>Field teams are assigned survey holes each week and appear on the Live Map.</div>
      {siteTeams.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {siteTeams.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'var(--bg-3)', borderRadius: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color_hex }} />
              <span style={{ fontSize: 12 }}>{t.name}</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--label-4)', fontSize: 12, padding: 0, lineHeight: 1 }} onClick={() => deleteTeam(t.id, t.name)}>✕</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input className="input" style={{ flex: 1, minWidth: 140 }} value={name} onChange={e => setName(e.target.value)} placeholder="Team name…" onKeyDown={e => e.key === 'Enter' && addTeam()} />
        <div style={{ display: 'flex', gap: 4 }}>
          {TEAM_COLORS.map(c => (
            <div key={c} onClick={() => setColor(c)} style={{ width: 18, height: 18, borderRadius: '50%', background: c, cursor: 'pointer', border: color === c ? '2px solid #fff' : '2px solid transparent', boxSizing: 'border-box' }} />
          ))}
        </div>
        <button className="btn btn-primary btn-sm" onClick={addTeam} disabled={saving || !name.trim()}>{saving ? 'Adding…' : '+ Team'}</button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ExploreOverviewPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [teamRows, setTeamRows] = useState<TeamRow[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sb = createClient()
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekStartStr = weekStart.toISOString().slice(0, 10)

      const [sitesRes, teamsRes, photosRes, alertsRes, assignmentsRes, holesRes] = await Promise.all([
        sb.from('sites').select('id, name'),
        sb.from('explore_teams').select('id, name, color_hex, site_id'),
        sb.from('hole_surveys').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        sb.from('explore_alerts').select('id, message, priority, created_at, target_type').order('created_at', { ascending: false }).limit(5),
        sb.from('assignments').select('hole_id, team_id').gte('week_start', weekStartStr),
        sb.from('holes').select('id, status'),
      ])

      const rawSites = (sitesRes.data ?? []) as { id: string; name: string }[]
      const siteList: Site[] = rawSites.map(s => ({ id: s.id, name: s.name, prefix: '' }))
      const teamList = teamsRes.data ?? []
      setSites(siteList)
      setTeams(teamList)

      const rows: TeamRow[] = teamList.map((t: Team) => {
        const assigned = (assignmentsRes.data ?? []).filter((a: { team_id: string }) => a.team_id === t.id)
        const assignedIds = new Set(assigned.map((a: { hole_id: string }) => a.hole_id))
        const completed = (holesRes.data ?? []).filter((h: { id: string; status: string }) => assignedIds.has(h.id) && h.status === 'completed').length
        return { id: t.id, name: t.name, color_hex: t.color_hex, completed, total: assignedIds.size }
      })
      setTeamRows(rows)
      setAlerts(alertsRes.data ?? [])
      setStats({
        activeTeams: rows.filter(r => r.total > 0).length,
        holesThisWeek: (assignmentsRes.data ?? []).length,
        photosPending: photosRes.count ?? 0,
        alertsSent: (alertsRes.data ?? []).length,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const activeSite = sites[0] ?? null
  const hasSite = sites.length > 0

  return (
    <div className="content content-pad" style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Explore Overview</h2>
        <p style={{ fontSize: 12, color: 'var(--label-3)' }}>Field exploration tracking. Monitor teams, holes, alerts and devices.</p>
      </div>

      {error && <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 16 }}>{error}</div>}

      {/* Site setup — full two-column layout when no site exists */}
      {!loading && !hasSite && (
        <div style={{ flex: 1, minHeight: 0 }}>
          <SiteSetupPanel onCreated={load} />
        </div>
      )}

      {/* Dashboard when site exists */}
      {hasSite && (
        <>
          {activeSite && (
            <TeamPanel site={activeSite} teams={teams} onChanged={load} />
          )}

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Active teams',    value: stats?.activeTeams,   color: 'var(--blue)' },
              { label: 'Holes this week', value: stats?.holesThisWeek, color: 'var(--green)' },
              { label: 'Photos pending',  value: stats?.photosPending, color: 'var(--orange)' },
              { label: 'Alerts sent',     value: stats?.alertsSent,    color: 'var(--purple)' },
            ].map(k => (
              <div key={k.label} className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: k.color, lineHeight: 1 }}>{loading ? '…' : (k.value ?? 0).toLocaleString()}</div>
                <div style={{ fontSize: 11, color: 'var(--label-3)', marginTop: 6 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Team progress + recent alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Team progress this week</div>
              {loading ? (
                <div style={{ fontSize: 12, color: 'var(--label-4)' }}>Loading…</div>
              ) : teamRows.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '20px 0', textAlign: 'center' }}>
                  No teams yet. Add teams above, then assign holes from the Assignments tab.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {teamRows.map(t => {
                    const pct = t.total > 0 ? Math.round((t.completed / t.total) * 100) : 0
                    return (
                      <div key={t.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color_hex, display: 'inline-block' }} />
                            {t.name}
                          </span>
                          <span style={{ color: 'var(--label-4)' }}>{t.completed}/{t.total} · {pct}%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 3, background: 'var(--bg-3)' }}>
                          <div style={{ height: '100%', borderRadius: 3, background: t.color_hex, width: `${pct}%`, transition: 'width .4s' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Recent alerts</div>
              {loading ? (
                <div style={{ fontSize: 12, color: 'var(--label-4)' }}>Loading…</div>
              ) : alerts.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--label-4)', padding: '20px 0', textAlign: 'center' }}>No alerts yet. Send one from the Radio Call tab.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {alerts.map(a => (
                    <div key={a.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12 }}>
                      <span style={{ color: a.priority === 'urgent' ? 'var(--red)' : 'var(--gold)', flexShrink: 0, fontWeight: 600, fontSize: 11 }}>
                        {a.priority === 'urgent' ? '!' : '›'} {a.target_type}
                      </span>
                      <span style={{ flex: 1, color: 'var(--label-2)' }}>{a.message}</span>
                      <span style={{ color: 'var(--label-4)', fontSize: 11, flexShrink: 0 }}>{new Date(a.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
