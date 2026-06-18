// Join screen — field device enters GOLD-XXXX code + device key
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import * as Application from 'expo-application'
import { claimDevice } from '../../../lib/device/registration'
import { registerFcmToken } from '../../../lib/radio/fcm'

export default function JoinScreen() {
  const [code, setCode] = useState('')
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleJoin() {
    const trimmedCode = code.trim().toUpperCase()
    const trimmedKey = key.trim()
    if (!trimmedCode.startsWith('GOLD-') || trimmedCode.length !== 9) {
      Alert.alert('Invalid code', 'Device code must be in the format GOLD-XXXX.')
      return
    }
    if (trimmedKey.length < 8) {
      Alert.alert('Invalid key', 'Enter the full device key provided by your admin.')
      return
    }

    setLoading(true)
    try {
      const androidId = Application.androidId ?? `device_${Date.now()}`
      const model = `${Application.applicationName} (${Platform.OS})`
      const version = Application.nativeApplicationVersion ?? '1.0.0'

      await claimDevice(trimmedCode, trimmedKey, androidId, model, version)
      await registerFcmToken()
    } catch (e) {
      Alert.alert('Join failed', e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.inner}>
        <Text style={s.diamond}>◆</Text>
        <Text style={s.title}>GoldPass</Text>
        <Text style={s.sub}>Field device registration</Text>

        <View style={s.card}>
          <Text style={s.label}>Device code</Text>
          <TextInput
            style={s.input}
            value={code}
            onChangeText={t => setCode(t.toUpperCase())}
            placeholder="GOLD-XXXX"
            placeholderTextColor="#4A5568"
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <Text style={[s.label, { marginTop: 14 }]}>Device key</Text>
          <TextInput
            style={s.input}
            value={key}
            onChangeText={setKey}
            placeholder="32-character key from admin"
            placeholderTextColor="#4A5568"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleJoin} disabled={loading}>
            {loading ? <ActivityIndicator color="#0B0C0E" /> : <Text style={s.btnText}>Activate device</Text>}
          </TouchableOpacity>
        </View>

        <Text style={s.hint}>Get the device code and key from your GoldPass admin.</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0C0E' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  diamond: { textAlign: 'center', fontSize: 36, color: '#C8973B', marginBottom: 8 },
  title: { textAlign: 'center', fontSize: 24, fontWeight: '700', color: '#E8E9EC', marginBottom: 4 },
  sub: { textAlign: 'center', fontSize: 13, color: '#6B7A9A', marginBottom: 32 },
  card: { backgroundColor: '#16181C', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#2A2D35' },
  label: { fontSize: 11, color: '#6B7A9A', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#0B0C0E', borderRadius: 10, padding: 14, fontSize: 15, color: '#E8E9EC', borderWidth: 1, borderColor: '#2A2D35', fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier' },
  btn: { backgroundColor: '#C8973B', borderRadius: 10, padding: 16, marginTop: 20, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#0B0C0E', fontWeight: '700', fontSize: 15 },
  hint: { textAlign: 'center', fontSize: 12, color: '#4A5568', marginTop: 24 },
})
