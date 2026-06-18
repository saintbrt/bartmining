// Settings — GPS mode, GNSS pairing, sync status, sign out
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, Alert } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { supabase } from '../../../lib/supabase/client'
import { getUnsynced } from '../../../lib/offline/local-db'
import { sync } from '../../../lib/sync/sync-manager'
import { listPairedReceivers, connectToReceiver, disconnectReceiver, isConnected } from '../../../lib/bluetooth/gnss-receiver'
import { startMeshRelay, stopMeshRelay } from '../../../lib/bluetooth/mesh-relay'
import type { BluetoothDevice } from 'react-native-bluetooth-classic'

export default function SettingsScreen() {
  const [teamId, setTeamId] = useState<string | null>(null)
  const [deviceCode, setDeviceCode] = useState<string | null>(null)
  const [meshEnabled, setMeshEnabled] = useState(false)
  const [gnssConnected, setGnssConnected] = useState(false)
  const [paired, setPaired] = useState<BluetoothDevice[]>([])
  const [syncPending, setSyncPending] = useState(0)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    SecureStore.getItemAsync('team_id').then(setTeamId)
    SecureStore.getItemAsync('device_code').then(setDeviceCode)
    setGnssConnected(isConnected())
    getUnsynced().then(({ positions, surveys }) => setSyncPending(positions.length + surveys.length))
    listPairedReceivers().then(setPaired).catch(() => {})
  }, [])

  async function manualSync() {
    setSyncing(true)
    await sync().catch(() => {})
    const { positions, surveys } = await getUnsynced()
    setSyncPending(positions.length + surveys.length)
    setSyncing(false)
  }

  async function connectGnss(device: BluetoothDevice) {
    try {
      await connectToReceiver(device)
      setGnssConnected(true)
      Alert.alert('Connected', `GNSS receiver ${device.name} connected. Using sub-meter accuracy.`)
    } catch (e) {
      Alert.alert('Connection failed', e instanceof Error ? e.message : String(e))
    }
  }

  function toggleMesh(val: boolean) {
    setMeshEnabled(val)
    if (val) startMeshRelay([teamId ?? '']).catch(console.warn)
    else stopMeshRelay()
  }

  async function signOut() {
    Alert.alert('Sign out', 'This will remove your device session. You will need a new code to re-register.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out', style: 'destructive', onPress: async () => {
          await disconnectReceiver()
          stopMeshRelay()
          await supabase.auth.signOut()
          await SecureStore.deleteItemAsync('device_code')
          await SecureStore.deleteItemAsync('team_id')
        }
      }
    ])
  }

  return (
    <ScrollView style={s.root} contentContainerStyle={{ padding: 20 }}>
      <Text style={s.title}>Settings</Text>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Device</Text>
        <Row label="Device code" value={deviceCode ?? '—'} />
        <Row label="Team ID" value={teamId?.slice(0, 8) ?? '—'} />
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Offline sync</Text>
        <Row label="Records pending" value={syncPending.toString()} />
        <TouchableOpacity style={s.btn} onPress={manualSync} disabled={syncing}>
          <Text style={s.btnText}>{syncing ? 'Syncing…' : 'Sync now'}</Text>
        </TouchableOpacity>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>GNSS Receiver (Bluetooth Classic)</Text>
        {paired.length === 0 ? (
          <Text style={s.hint}>No paired Bluetooth devices found. Pair your GNSS receiver in Android Settings first.</Text>
        ) : paired.map(d => (
          <TouchableOpacity key={d.address} style={s.btn} onPress={() => connectGnss(d)}>
            <Text style={s.btnText}>{gnssConnected ? '✓ ' : ''}{d.name ?? d.address}</Text>
          </TouchableOpacity>
        ))}
        {gnssConnected && (
          <TouchableOpacity style={[s.btn, s.btnDanger]} onPress={() => { disconnectReceiver(); setGnssConnected(false) }}>
            <Text style={s.btnText}>Disconnect GNSS</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>BLE Mesh Relay</Text>
        <View style={s.toggleRow}>
          <Text style={s.toggleLabel}>Relay positions to nearby devices</Text>
          <Switch value={meshEnabled} onValueChange={toggleMesh} trackColor={{ true: '#C8973B' }} />
        </View>
        <Text style={s.hint}>When enabled, your device shares GPS with nearby field devices that have no signal.</Text>
      </View>

      <TouchableOpacity style={[s.btn, s.btnDanger, { marginTop: 32 }]} onPress={signOut}>
        <Text style={s.btnText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
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
  root: { flex: 1, backgroundColor: '#0B0C0E' },
  title: { fontSize: 22, fontWeight: '700', color: '#E8E9EC', marginBottom: 24 },
  section: { backgroundColor: '#16181C', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2A2D35' },
  sectionTitle: { fontSize: 11, color: '#6B7A9A', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2A2D35' },
  rowLabel: { fontSize: 13, color: '#6B7A9A' },
  rowValue: { fontSize: 13, color: '#E8E9EC', fontFamily: 'monospace' },
  btn: { backgroundColor: '#2A2D35', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 10 },
  btnDanger: { backgroundColor: '#3B1515' },
  btnText: { color: '#E8E9EC', fontWeight: '600', fontSize: 14 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  toggleLabel: { fontSize: 13, color: '#E8E9EC', flex: 1 },
  hint: { fontSize: 11, color: '#4A5568', marginTop: 8, lineHeight: 16 },
})
