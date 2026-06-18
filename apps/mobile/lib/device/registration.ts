// Device registration — claim GOLD-XXXX code against claim-device Edge Function
import * as SecureStore from 'expo-secure-store'
import { supabase } from '../supabase/client'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!

export type ClaimResult = {
  access_token: string
  refresh_token: string
  profile_id: string
  team_id: string
}

export async function claimDevice(
  deviceCode: string,
  deviceKey: string,
  androidId: string,
  deviceModel?: string,
  appVersion?: string,
  fcmToken?: string,
): Promise<ClaimResult> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/claim-device`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      device_code: deviceCode.trim().toUpperCase(),
      device_key: deviceKey.trim(),
      android_id: androidId,
      device_model: deviceModel,
      app_version: appVersion,
      fcm_token: fcmToken,
    }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Claim failed')

  // Set Supabase session from returned tokens
  await supabase.auth.setSession({
    access_token: json.access_token,
    refresh_token: json.refresh_token,
  })

  // Persist device identity
  await SecureStore.setItemAsync('device_code', deviceCode.trim().toUpperCase())
  await SecureStore.setItemAsync('android_id', androidId)
  await SecureStore.setItemAsync('team_id', json.team_id)

  return json as ClaimResult
}

export async function getStoredDeviceCode(): Promise<string | null> {
  return SecureStore.getItemAsync('device_code')
}

export async function getStoredTeamId(): Promise<string | null> {
  return SecureStore.getItemAsync('team_id')
}
