// Admin login — email + password (for supervisors/admins using mobile Command View)
import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { supabase } from '../../../lib/supabase/client'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email.trim() || !password) { Alert.alert('Enter your email and password'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (error) Alert.alert('Login failed', error.message)
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.inner}>
        <Text style={s.diamond}>◆</Text>
        <Text style={s.title}>GoldPass Admin</Text>
        <Text style={s.sub}>Command View</Text>

        <View style={s.card}>
          <Text style={s.label}>Email</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholder="admin@example.com" placeholderTextColor="#4A5568" />
          <Text style={[s.label, { marginTop: 14 }]}>Password</Text>
          <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" placeholder="••••••••" placeholderTextColor="#4A5568" />
          <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#0B0C0E" /> : <Text style={s.btnText}>Sign in</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0C0E' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  diamond: { textAlign: 'center', fontSize: 36, color: '#C8973B', marginBottom: 8 },
  title: { textAlign: 'center', fontSize: 22, fontWeight: '700', color: '#E8E9EC', marginBottom: 4 },
  sub: { textAlign: 'center', fontSize: 13, color: '#6B7A9A', marginBottom: 32 },
  card: { backgroundColor: '#16181C', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#2A2D35' },
  label: { fontSize: 11, color: '#6B7A9A', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#0B0C0E', borderRadius: 10, padding: 14, fontSize: 15, color: '#E8E9EC', borderWidth: 1, borderColor: '#2A2D35' },
  btn: { backgroundColor: '#C8973B', borderRadius: 10, padding: 16, marginTop: 20, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#0B0C0E', fontWeight: '700', fontSize: 15 },
})
