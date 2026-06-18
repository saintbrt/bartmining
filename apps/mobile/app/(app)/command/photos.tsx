// Admin mobile — Survey Photo review
import { useEffect, useState } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { supabase } from '../../../lib/supabase/client'

type Survey = { id: string; photo_url: string; status: string; submitted_at: string; hole_label: string; team_name: string }

export default function PhotosScreen() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase
      .from('hole_surveys')
      .select('id, photo_url, status, submitted_at, holes(hole_id), explore_teams(name)')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false })
      .limit(50)

    setSurveys((data ?? []).map((s: Record<string, unknown>) => ({
      id: s.id as string,
      photo_url: s.photo_url as string,
      status: s.status as string,
      submitted_at: s.submitted_at as string,
      hole_label: (Array.isArray(s.holes) ? (s.holes[0] as Record<string, string>)?.hole_id : (s.holes as Record<string, string> | null)?.hole_id) ?? '—',
      team_name: (Array.isArray(s.explore_teams) ? (s.explore_teams[0] as Record<string, string>)?.name : (s.explore_teams as Record<string, string> | null)?.name) ?? '—',
    })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function review(id: string, status: 'approved' | 'rejected') {
    setUpdating(id)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('hole_surveys').update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() }).eq('id', id)
    setSurveys(prev => prev.filter(s => s.id !== id))
    setUpdating(null)
  }

  if (loading) return <View style={s.root}><ActivityIndicator color="#C8973B" style={{ marginTop: 40 }} /></View>

  return (
    <FlatList
      style={s.root}
      data={surveys}
      keyExtractor={s => s.id}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={<Text style={{ color: '#6B7A9A', textAlign: 'center', marginTop: 40 }}>No pending photos.</Text>}
      renderItem={({ item: sv }) => (
        <View style={s.card}>
          <Image source={{ uri: sv.photo_url }} style={s.photo} resizeMode="cover" />
          <View style={s.info}>
            <Text style={s.holeId}>{sv.hole_label}</Text>
            <Text style={s.meta}>{sv.team_name} · {new Date(sv.submitted_at).toLocaleString()}</Text>
          </View>
          <View style={s.actions}>
            <TouchableOpacity style={s.approveBtn} onPress={() => review(sv.id, 'approved')} disabled={updating === sv.id}>
              <Text style={s.actionText}>✓ Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.rejectBtn} onPress={() => review(sv.id, 'rejected')} disabled={updating === sv.id}>
              <Text style={s.actionText}>✕ Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0C0E' },
  card: { backgroundColor: '#16181C', borderRadius: 12, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2D35' },
  photo: { width: '100%', height: 200 },
  info: { padding: 12 },
  holeId: { fontSize: 15, fontWeight: '700', color: '#E8E9EC', fontFamily: 'monospace' },
  meta: { fontSize: 12, color: '#6B7A9A', marginTop: 2 },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#2A2D35' },
  approveBtn: { flex: 1, padding: 14, alignItems: 'center', backgroundColor: '#0F2A1A' },
  rejectBtn: { flex: 1, padding: 14, alignItems: 'center', backgroundColor: '#2A0F0F', borderLeftWidth: 1, borderLeftColor: '#2A2D35' },
  actionText: { color: '#E8E9EC', fontWeight: '600', fontSize: 14 },
})
