// Admin mobile — Radio Call / Alerts
import { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { supabase } from '../../../lib/supabase/client'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
type AlertRow = { id: string; message: string; priority: string; target_type: string; created_at: string }

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertRow[]>([])
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    supabase.from('explore_alerts').select('id, message, priority, target_type, created_at')
      .order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setAlerts(data ?? []))
  }, [])

  async function send() {
    if (!message.trim()) return
    setSending(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const { data: sites } = await supabase.from('sites').select('id').limit(1)
      const siteId = sites?.[0]?.id
      if (!siteId) { Alert.alert('No site configured'); setSending(false); return }

      const { data, error } = await supabase.from('explore_alerts').insert({
        site_id: siteId, sent_by: session?.user.id,
        target_type: 'all', message: message.trim(), priority,
      }).select('id').single()
      if (error) throw error

      fetch(`${SUPABASE_URL}/functions/v1/send-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ alert_id: data.id }),
      }).catch(() => {})

      setMessage('')
      const { data: fresh } = await supabase.from('explore_alerts').select('id, message, priority, target_type, created_at').order('created_at', { ascending: false }).limit(20)
      setAlerts(fresh ?? [])
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : String(e))
    } finally { setSending(false) }
  }

  return (
    <View style={s.root}>
      <View style={s.compose}>
        <View style={s.priorityRow}>
          {(['normal', 'urgent'] as const).map(p => (
            <TouchableOpacity key={p} style={[s.pill, priority === p && s.pillActive, p === 'urgent' && priority === p && s.pillUrgent]} onPress={() => setPriority(p)}>
              <Text style={[s.pillText, priority === p && { color: '#0B0C0E' }]}>{p === 'normal' ? '📢 Normal' : '🚨 Urgent'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput style={s.input} value={message} onChangeText={setMessage} placeholder="Message to all teams…" placeholderTextColor="#4A5568" multiline />
        <TouchableOpacity style={[s.sendBtn, sending && { opacity: 0.6 }]} onPress={send} disabled={!message.trim() || sending}>
          {sending ? <ActivityIndicator color="#0B0C0E" /> : <Text style={s.sendBtnText}>Send alert</Text>}
        </TouchableOpacity>
      </View>
      <FlatList
        data={alerts}
        keyExtractor={a => a.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item: a }) => (
          <View style={s.alertCard}>
            <Text style={[s.alertPriority, a.priority === 'urgent' && { color: '#EF4444' }]}>
              {a.priority === 'urgent' ? '🚨' : '📢'} {a.target_type}
            </Text>
            <Text style={s.alertMsg}>{a.message}</Text>
            <Text style={s.alertTime}>{new Date(a.created_at).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0C0E' },
  compose: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#2A2D35' },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  pill: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#2A2D35', alignItems: 'center' },
  pillActive: { backgroundColor: '#C8973B' },
  pillUrgent: { backgroundColor: '#EF4444' },
  pillText: { color: '#E8E9EC', fontSize: 13, fontWeight: '600' },
  input: { backgroundColor: '#16181C', borderRadius: 10, padding: 12, color: '#E8E9EC', fontSize: 14, borderWidth: 1, borderColor: '#2A2D35', marginBottom: 10, minHeight: 70 },
  sendBtn: { backgroundColor: '#C8973B', borderRadius: 10, padding: 14, alignItems: 'center' },
  sendBtnText: { color: '#0B0C0E', fontWeight: '700', fontSize: 15 },
  alertCard: { backgroundColor: '#16181C', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#2A2D35' },
  alertPriority: { fontSize: 11, color: '#C8973B', fontWeight: '600', marginBottom: 4 },
  alertMsg: { fontSize: 14, color: '#E8E9EC', marginBottom: 4 },
  alertTime: { fontSize: 11, color: '#4A5568' },
})
