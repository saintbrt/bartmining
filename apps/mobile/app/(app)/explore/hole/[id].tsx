// Hole Detail — shows hole info, proximity indicator, and triggers survey
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { supabase } from '../../../../lib/supabase/client'

type Hole = { id: string; hole_id: string; lat: number; lng: number; status: string; row_num: number; col_num: number }

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function HoleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [hole, setHole] = useState<Hole | null>(null)
  const [myLoc, setMyLoc] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('holes').select('*').eq('id', id).single().then(({ data }) => {
      setHole(data as Hole)
      setLoading(false)
    })
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }).then(loc => {
      setMyLoc({ lat: loc.coords.latitude, lng: loc.coords.longitude })
    }).catch(() => {})
  }, [id])

  const offsetM = hole && myLoc ? haversineM(myLoc.lat, myLoc.lng, hole.lat, hole.lng) : null
  const inRange = offsetM !== null && offsetM <= 30

  function startSurvey() {
    if (!inRange) {
      Alert.alert('Too far away', `You are ${Math.round(offsetM ?? 0)} m from the hole. Move within 30 m to start a survey.`)
      return
    }
    router.push(`/(app)/explore/survey/${id}`)
  }

  if (loading) return <View style={s.root}><ActivityIndicator color="#C8973B" style={{ marginTop: 40 }} /></View>
  if (!hole) return <View style={s.root}><Text style={{ color: '#E8E9EC', textAlign: 'center', marginTop: 40 }}>Hole not found.</Text></View>

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.holeId}>{hole.hole_id}</Text>
        <Text style={s.sub}>Row {hole.row_num} · Col {hole.col_num}</Text>
      </View>

      <View style={s.card}>
        <Row label="Latitude" value={hole.lat.toFixed(6)} />
        <Row label="Longitude" value={hole.lng.toFixed(6)} />
        <Row label="Status" value={hole.status.replace('_', ' ')} />
        {offsetM !== null && (
          <Row label="Distance" value={`${Math.round(offsetM)} m ${inRange ? '✓' : '— move closer'}`} />
        )}
      </View>

      {/* Proximity circle */}
      <View style={s.proximityWrap}>
        <View style={[s.outerRing, inRange && { borderColor: '#10B981' }]}>
          <View style={[s.innerRing, inRange && { borderColor: '#10B981' }]}>
            <View style={[s.dot, inRange && { backgroundColor: '#10B981' }]} />
          </View>
        </View>
        <Text style={[s.proximityText, inRange && { color: '#10B981' }]}>
          {inRange ? 'In range — ready to survey' : offsetM !== null ? `${Math.round(offsetM)} m away` : 'Getting location…'}
        </Text>
      </View>

      <TouchableOpacity style={[s.btn, !inRange && s.btnMuted]} onPress={startSurvey}>
        <Text style={s.btnText}>📷 Start Survey</Text>
      </TouchableOpacity>
    </View>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0C0E', padding: 20 },
  header: { marginBottom: 20 },
  holeId: { fontSize: 28, fontWeight: '700', color: '#C8973B', fontFamily: 'monospace' },
  sub: { fontSize: 13, color: '#6B7A9A', marginTop: 4 },
  card: { backgroundColor: '#16181C', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#2A2D35' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2A2D35' },
  rowLabel: { fontSize: 13, color: '#6B7A9A' },
  rowValue: { fontSize: 13, color: '#E8E9EC', fontFamily: 'monospace' },
  proximityWrap: { alignItems: 'center', marginBottom: 32 },
  outerRing: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#2A2D35', justifyContent: 'center', alignItems: 'center' },
  innerRing: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#2A2D35', justifyContent: 'center', alignItems: 'center' },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#4A5568' },
  proximityText: { marginTop: 12, fontSize: 13, color: '#6B7A9A' },
  btn: { backgroundColor: '#C8973B', borderRadius: 12, padding: 18, alignItems: 'center' },
  btnMuted: { opacity: 0.5 },
  btnText: { color: '#0B0C0E', fontWeight: '700', fontSize: 16 },
})
