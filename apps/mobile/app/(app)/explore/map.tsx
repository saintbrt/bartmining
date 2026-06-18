// Field map — shows assigned holes and device position
import { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import * as SecureStore from 'expo-secure-store'
import * as Location from 'expo-location'
import { supabase } from '../../../lib/supabase/client'

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '')

type Hole = { id: string; hole_id: string; lat: number; lng: number; status: string }

const STATUS_COLOR: Record<string, string> = { pending: '#4A5568', in_progress: '#3B82F6', completed: '#10B981', flagged: '#F59E0B' }

export default function MapScreen() {
  const [holes, setHoles] = useState<Hole[]>([])
  const [myLoc, setMyLoc] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const camera = useRef<MapboxGL.Camera>(null)

  useEffect(() => {
    ;(async () => {
      const teamId = await SecureStore.getItemAsync('team_id')
      if (!teamId) return

      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())

      const { data } = await supabase
        .from('assignments')
        .select('holes(id, hole_id, lat, lng, status)')
        .eq('team_id', teamId)
        .gte('week_start', weekStart.toISOString().slice(0, 10))

      const list = (data ?? [])
        .map((a: { holes: unknown }) => (Array.isArray(a.holes) ? a.holes[0] : a.holes) as Hole | null)
        .filter((h): h is Hole => h !== null)

      setHoles(list)
      setLoading(false)

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      const coord: [number, number] = [loc.coords.longitude, loc.coords.latitude]
      setMyLoc(coord)
      camera.current?.setCamera({ centerCoordinate: coord, zoomLevel: 14, animationDuration: 800 })
    })()
  }, [])

  if (loading) return <View style={s.root}><ActivityIndicator color="#C8973B" style={{ marginTop: 40 }} /></View>

  return (
    <View style={s.root}>
      <MapboxGL.MapView style={s.map} styleURL="mapbox://styles/mapbox/dark-v11">
        <MapboxGL.Camera ref={camera} zoomLevel={12} centerCoordinate={myLoc ?? [34.8, -6.4]} />

        {myLoc && (
          <MapboxGL.PointAnnotation id="my-loc" coordinate={myLoc}>
            <View style={s.myDot} />
          </MapboxGL.PointAnnotation>
        )}

        {holes.map(h => (
          <MapboxGL.PointAnnotation key={h.id} id={h.id} coordinate={[h.lng, h.lat]}>
            <View style={[s.holeDot, { backgroundColor: STATUS_COLOR[h.status] ?? '#4A5568' }]} />
            <MapboxGL.Callout title={h.hole_id} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>

      <View style={s.legend}>
        {Object.entries(STATUS_COLOR).map(([status, color]) => (
          <View key={status} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: color }]} />
            <Text style={s.legendText}>{status.replace('_', ' ')}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0C0E' },
  map: { flex: 1 },
  myDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#C8973B', borderWidth: 2, borderColor: '#fff' },
  holeDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: '#fff' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12, backgroundColor: '#0B0C0E', borderTopWidth: 1, borderTopColor: '#2A2D35' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: '#6B7A9A', textTransform: 'capitalize' },
})
