'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/goldpass/supabase/client'

type TeamColor = Record<string, string>

type DevicePosition = {
  id: string
  profile_id: string
  team_id: string | null
  lat: number
  lng: number
  accuracy_m: number | null
  altitude_m: number | null
  source: string
  recorded_at: string
  team_name?: string
  team_color?: string
}

type PanelDevice = DevicePosition & { label?: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapboxGL = any

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
const MAPBOX_VERSION = '3.3.0'

function loadMapboxSDK(): Promise<MapboxGL> {
  return new Promise((resolve, reject) => {
    // Already loaded
    if ((window as Window & { mapboxgl?: MapboxGL }).mapboxgl) {
      resolve((window as Window & { mapboxgl?: MapboxGL }).mapboxgl)
      return
    }
    // Inject CSS once
    if (!document.getElementById('mapbox-css')) {
      const link = document.createElement('link')
      link.id = 'mapbox-css'
      link.rel = 'stylesheet'
      link.href = `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_VERSION}/mapbox-gl.css`
      document.head.appendChild(link)
    }
    // Inject script
    const script = document.createElement('script')
    script.src = `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_VERSION}/mapbox-gl.js`
    script.onload = () => resolve((window as Window & { mapboxgl?: MapboxGL }).mapboxgl)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function LiveMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapboxGL>(null)
  const markersRef = useRef<Map<string, MapboxGL>>(new Map())
  const [positions, setPositions] = useState<DevicePosition[]>([])
  const [selected, setSelected] = useState<PanelDevice | null>(null)
  const [teamColors, setTeamColors] = useState<TeamColor>({})
  const [error, setError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Load team colors + initial positions
  useEffect(() => {
    let alive = true
    ;(async () => {
      const sb = createClient()
      const [teamsRes, posRes] = await Promise.all([
        sb.from('explore_teams').select('id, name, color_hex'),
        sb.from('device_positions')
          .select('id, profile_id, team_id, lat, lng, accuracy_m, altitude_m, source, recorded_at')
          .order('recorded_at', { ascending: false })
          .limit(200),
      ])

      if (!alive) return

      const colorMap: TeamColor = {}
      const nameMap: Record<string, string> = {}
      ;(teamsRes.data ?? []).forEach((t: { id: string; name: string; color_hex: string }) => {
        colorMap[t.id] = t.color_hex
        nameMap[t.id] = t.name
      })
      setTeamColors(colorMap)

      const seen = new Map<string, DevicePosition>()
      ;(posRes.data ?? []).forEach((p: DevicePosition) => {
        if (!seen.has(p.profile_id)) {
          seen.set(p.profile_id, {
            ...p,
            team_name: p.team_id ? nameMap[p.team_id] : undefined,
            team_color: p.team_id ? colorMap[p.team_id] : '#6B7A9A',
          })
        }
      })
      if (alive) setPositions(Array.from(seen.values()))
    })()
    return () => { alive = false }
  }, [])

  // Init Mapbox map (loads SDK from CDN — no webpack dependency)
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return
    if (!MAPBOX_TOKEN) { setError('NEXT_PUBLIC_MAPBOX_TOKEN is not set. Add it to your .env.local file.'); return }

    loadMapboxSDK().then(mapboxgl => {
      mapboxgl.accessToken = MAPBOX_TOKEN
      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [34.8, -6.4],
        zoom: 9,
      })
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.on('load', () => setMapLoaded(true))
      mapRef.current = map
    }).catch(() => setError('Failed to load Mapbox GL JS from CDN. Check your internet connection.'))
  }, [])

  // Render / update markers whenever positions or map change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    loadMapboxSDK().then(mapboxgl => {
      const map = mapRef.current
      const existing = markersRef.current

      existing.forEach((marker, pid) => {
        if (!positions.find(p => p.profile_id === pid)) {
          marker.remove()
          existing.delete(pid)
        }
      })

      positions.forEach(pos => {
        const color = pos.team_color ?? '#6B7A9A'
        const el = document.createElement('div')
        el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;cursor:pointer;box-shadow:0 0 6px ${color}80`
        el.title = pos.team_name ?? pos.profile_id.slice(0, 8)
        el.addEventListener('click', () => setSelected(pos))

        if (existing.has(pos.profile_id)) {
          existing.get(pos.profile_id).setLngLat([pos.lng, pos.lat])
          return
        }

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([pos.lng, pos.lat])
          .addTo(map)
        existing.set(pos.profile_id, marker)
      })
    })
  }, [positions, mapLoaded])

  // Supabase Realtime subscription for live position updates
  useEffect(() => {
    const sb = createClient()
    const channel = sb
      .channel('live-positions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'device_positions',
      }, (payload) => {
        const p = payload.new as DevicePosition
        setPositions(prev => {
          const next = prev.filter(x => x.profile_id !== p.profile_id)
          return [...next, {
            ...p,
            team_color: p.team_id ? (teamColors[p.team_id] ?? '#6B7A9A') : '#6B7A9A',
          }]
        })
      })
      .subscribe()
    return () => { sb.removeChannel(channel) }
  }, [teamColors])

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div className="content" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
      <div style={{ padding: '16px 24px 12px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Live Map</h2>
          <p style={{ fontSize: 11, color: 'var(--label-3)', marginTop: 2 }}>
            {positions.length} device{positions.length !== 1 ? 's' : ''} tracked · updates in real time
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: 16 }}>
          {Object.entries(teamColors).map(([id, color]) => (
            <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--label-3)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {id.slice(0, 6)}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ margin: '0 24px 12px', padding: 12, background: 'var(--bg-3)', borderRadius: 8, fontSize: 12, color: 'var(--orange)' }}>
          {error}
        </div>
      )}

      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

        {selected && (
          <div style={{
            position: 'absolute', top: 16, right: 16, width: 260,
            background: 'var(--bg-2)', border: '1px solid var(--sep)', borderRadius: 12,
            padding: 16, zIndex: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{selected.team_name ?? 'Unknown team'}</div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--label-4)', fontSize: 16 }}
                onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--label-4)' }}>Lat / Lng</span>
                <span style={{ fontFamily: 'monospace' }}>{selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}</span>
              </div>
              {selected.accuracy_m != null && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--label-4)' }}>Accuracy</span>
                  <span>±{Math.round(selected.accuracy_m)} m</span>
                </div>
              )}
              {selected.altitude_m != null && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--label-4)' }}>Altitude</span>
                  <span>{Math.round(selected.altitude_m)} m</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--label-4)' }}>Source</span>
                <span>{selected.source}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--label-4)' }}>Last ping</span>
                <span>{new Date(selected.recorded_at).toLocaleTimeString()}</span>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 14 }}
              onClick={() => { /* TODO: pre-fill radio call with this team */ }}>
              Send Radio Call
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
