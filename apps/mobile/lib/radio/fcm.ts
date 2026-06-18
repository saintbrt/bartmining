// FCM Push Notifications — Sprint 12
// Handles incoming Radio Call alerts from Firebase Cloud Messaging.
import messaging from '@react-native-firebase/messaging'
import { supabase } from '../supabase/client'

export async function requestNotificationPermission(): Promise<boolean> {
  const authStatus = await messaging().requestPermission()
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
         authStatus === messaging.AuthorizationStatus.PROVISIONAL
}

export async function getFcmToken(): Promise<string | null> {
  try {
    return await messaging().getToken()
  } catch {
    return null
  }
}

export async function registerFcmToken(): Promise<void> {
  const token = await getFcmToken()
  if (!token) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Update registered_devices row with current FCM token
  await supabase.from('registered_devices')
    .update({ fcm_token: token, last_seen_at: new Date().toISOString() })
    .eq('profile_id', user.id)
}

export function setupForegroundHandler(onAlert: (message: string, priority: string) => void): () => void {
  return messaging().onMessage(async remoteMessage => {
    const body = remoteMessage.notification?.body ?? ''
    const priority = (remoteMessage.data?.priority as string) ?? 'normal'
    onAlert(body, priority)
  })
}

export function setupBackgroundHandler(): void {
  messaging().setBackgroundMessageHandler(async _remoteMessage => {
    // Android handles notification display automatically via channel explore_alerts
  })
}
