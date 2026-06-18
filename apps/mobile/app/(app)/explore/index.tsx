// My Holes — field team view of assigned holes for this week
import { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../../lib/supabase/client'
import * as SecureStore from 'expo-secure-store'
import { sync } from '../../../lib/sync/sync-manager'

type Hole = {
  id: string
  hole_id: string
  row_num: number
  col_num: number
  lat: number
  lng: number
  status: 'pending' | 'in_progress' | 'completed' | 'flagged'
}

const STATUS_COLOR: Record<string, string> = {
  pending: '#4A5568',
  in_progress: '#3B82F6',
  completed: '#10B981',
  flagged: '#F59E0B',
}

function weekStartDate(): string {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay())
  return d.toISOString().slice(0, 10)
}

export default function MyHolesScreen() {
  const [holes, setHoles] = useState<Hole[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  async function loadHoles() {
    const teamId = await SecureStore.getItemAsync('team_id')
    if (!teamId) return

    const weekStart = weekStartDate()
    const { data } = await supabase
      .from('assignments')
      .select('holes(id, hole_id, row_num, col_num, lat, lng, status)')
      .eq('team_id', teamId)
      .eq('week_start', weekStart)

    const holeList = (data ?? [])
      .map((a: { holes: unknown }) => (Array.isArray(a.holes) ? a.holes[0] : a.holes) as Hole | null)
      .filter((h): h is Hole => h !== null)
      .sort((a, b) => a.row_num - b.row_num || a.col_num - b.col_num)

    setHoles(holeList)
    setLoading(false)
  }

  async function onRefresh() {
    setRefreshing(true)
    await sync()
    await loadHoles()
    setRefreshing(false)
  }

  useEffect(() => { loadHoles() }, [])

  const pending = holes.filter(h => h.status !== 'completed').length
  const done = holes.filter(h => h.status === 'completed').length

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>My Holes</Text>
        <Text style={s.sub}>{done}/{holes.length} completed this week</Text>
        {holes.length > 0 && (
          <View style={s.progressBar}>
            <View style={[s.progressFill, { width: `${holes.length ? (done / holes.length) * 100 : 0}%` as `${number}%` }]} />
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color="#C8973B" style={{ marginTop: 40 }} />
      ) : holes.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>No holes assigned this week.</Text>
          <Text style={s.emptyHint}>Check with your supervisor for this week's assignments.</Text>
        </View>
      ) : (
        <FlatList
          data={holes}
          keyExtractor={h => h.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C8973B" />}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item: h }) => (
            <TouchableOpacity style={s.card} onPress={() => router.push(`/(app)/explore/hole/${h.id}`)}>
              <View style={[s.dot, { backgroundColor: STATUS_COLOR[h.status] }]} />
              <View style={s.info}>
                <Text style={s.holeId}>{h.hole_id}</Text>
                <Text style={s.coords}>R{h.row_num} C{h.col_num} · {h.lat.toFixed(5)}, {h.lng.toFixed(5)}</Text>
              </View>
              <Text style={[s.status, { color: STATUS_COLOR[h.status] }]}>{h.status.replace('_', ' ')}</Text>
              <Text style={s.arrow}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0C0E' },
  header: { padding: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#2A2D35' },
  title: { fontSize: 20, fontWeight: '700', color: '#E8E9EC' },
  sub: { fontSize: 13, color: '#6B7A9A', marginTop: 2 },
  progressBar: { height: 4, backgroundColor: '#2A2D35', borderRadius: 2, marginTop: 10 },
  progressFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 2 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#E8E9EC', textAlign: 'center', marginBottom: 8 },
  emptyHint: { fontSize: 13, color: '#6B7A9A', textAlign: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16181C', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2A2D35' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  info: { flex: 1 },
  holeId: { fontSize: 15, fontWeight: '700', color: '#E8E9EC', fontFamily: 'monospace' },
  coords: { fontSize: 11, color: '#6B7A9A', marginTop: 2 },
  status: { fontSize: 11, fontWeight: '600', marginRight: 8, textTransform: 'capitalize' },
  arrow: { fontSize: 20, color: '#4A5568' },
})
