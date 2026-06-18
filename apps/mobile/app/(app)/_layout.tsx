import { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { Text } from 'react-native'
import { supabase } from '../../lib/supabase/client'
import { sync } from '../../lib/sync/sync-manager'
import { startGpsCapture } from '../../lib/gps/accuracy'
import { setupForegroundHandler, registerFcmToken } from '../../lib/radio/fcm'
import BackgroundFetch from 'react-native-background-fetch'

export default function AppLayout() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/(auth)/join')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) router.replace('/(auth)/join')
    })
    return () => subscription.unsubscribe()
  }, [router])

  useEffect(() => {
    // Start GPS capture
    startGpsCapture().catch(console.warn)

    // Register FCM token and handle foreground alerts
    registerFcmToken().catch(console.warn)
    const unsub = setupForegroundHandler((message, priority) => {
      // TODO: show in-app alert modal
      console.log('Radio Call:', priority, message)
    })

    // Background sync via react-native-background-fetch
    BackgroundFetch.configure({
      minimumFetchInterval: 1,  // minutes (minimum)
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    }, async (taskId) => {
      await sync()
      BackgroundFetch.finish(taskId)
    }, (_taskId) => { /* timeout */ })

    // Sync on foreground
    sync().catch(console.warn)

    return () => { unsub() }
  }, [])

  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#0B0C0E', borderTopColor: '#2A2D35' },
      tabBarActiveTintColor: '#C8973B',
      tabBarInactiveTintColor: '#4A5568',
      headerStyle: { backgroundColor: '#0B0C0E' },
      headerTintColor: '#C8973B',
    }}>
      <Tabs.Screen name="explore/index" options={{ title: 'Holes', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>◎</Text> }} />
      <Tabs.Screen name="explore/map" options={{ title: 'Map', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>◈</Text> }} />
      <Tabs.Screen name="explore/settings" options={{ title: 'Settings', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚙</Text> }} />
    </Tabs>
  )
}
