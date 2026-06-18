import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { supabase } from '../lib/supabase/client'
import { setupBackgroundHandler } from '../lib/radio/fcm'

setupBackgroundHandler()

export default function RootLayout() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().finally(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#0B0C0E' }, headerTintColor: '#C8973B', headerTitleStyle: { fontWeight: '600' } }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
