// Command Map — admin/supervisor mobile view of all team positions
import { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import { supabase } from '../../../lib/supabase/client'

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '')

type Pos = { id: string; profile_id: string; lat: number; lng: number; recorded_at: string; team_id: string | null; team_name?: string; team_color?: string }

export default function CommandMapScreen() {
  const [positions, setPositions] = useState<Pos[]>([])
  const camera = useRef<MapboxGL.Camera>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const [teamsRes, posRes] = await Promise.all([
        supabase.from('explore_teams').select('id, name, color_hex'),
        supabase.from('device_positions').select('id, profile_id, lat, lng, recorded_at, team_id').order('recorded_at', { ascending: false }).limit(100),
      ])
      if (!alive) return
      const colorMap: Record<string, string> = {}
      const nameMap: Record<string, string> = {}
      ;(teamsRes.data ?? []).forEach((t: { id: string; name: string; color_hex: string }) => {
        colorMap[t.id] = t.color_hex
        nameMap[t.id] = t.name
      })
      const seen = new Map<string, Pos>()
      ;(posRes.data ?? []).forEach((p: Pos) => {
        if (!seen.has(p.profile_id)) seen.set(p.profile_id, {
          ...p, team_name: p.team_id ? nameMap[p.team_id] : undefined,
          team_color: p.team_id ? colorMap[p.team_id] : '#6B7A9A',
        })
      })
      if (alive) setPositions(Array.from(seen.values()))
    })()

    const channel = supabase.channel('cmd-positions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'device_positions' }, payload => {
        const p = payload.new as Pos
        setPositions(prev => [...prev.filter(x => x.profile_id !== p.profile_id), p])
      })
      .subscribe()

    return () => { alive = false; supabase.removeChannel(channel) }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
        <MapboxGL.Camera ref={camera} zoomLevel={10} centerCoordinate={[34.8, -6.4]} />
        {positions.map(p => (
          <MapboxGL.PointAnnotation key={p.profile_id} id={p.profile_id} coordinate={[p.lng, p.lat]}>
            <View style={[s.dot, { backgroundColor: p.team_color ?? '#6B7A9A' }]} />
            <MapboxGL.Callout title={p.team_name ?? p.profile_id.slice(0, 8)} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
      <View style={s.bar}>
        <Text style={s.barText}>{positions.length} device{positions.length !== 1 ? 's' : ''} live</Text>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#fff' },
  bar: { padding: 12, backgroundColor: '#0B0C0E', borderTopWidth: 1, borderTopColor: '#2A2D35' },
  barText: { color: '#6B7A9A', fontSize: 12, textAlign: 'center' },
})
