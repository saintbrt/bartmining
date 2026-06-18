// GPS capture with network-aware interval — Sprint 7
import * as Location from 'expo-location'
import NetInfo from '@react-native-community/netinfo'
import { insertPosition } from '../offline/local-db'
import { supabase } from '../supabase/client'
import * as SecureStore from 'expo-secure-store'

export type GpsSource = 'gps' | 'bluetooth_gnss' | 'manual'

let watchSub: Location.LocationSubscription | null = null

async function getIntervalMs(): Promise<number> {
  const net = await NetInfo.fetch()
  const type = net.type
  if (type === 'wifi' || net.details?.cellularGeneration === '4g') return 5000
  if (net.details?.cellularGeneration === '3g') return 10000
  return 30000 // 2G or unknown
}

export async function startGpsCapture(source: GpsSource = 'gps'): Promise<void> {
  if (watchSub) return

  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') throw new Error('Location permission denied')

  const profileId = (await supabase.auth.getUser()).data.user?.id
  const teamId = await SecureStore.getItemAsync('team_id')
  if (!profileId) throw new Error('Not authenticated')

  const intervalMs = await getIntervalMs()

  watchSub = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: intervalMs,
      distanceInterval: 0,
    },
    async (loc) => {
      const pos = {
        profile_id: profileId,
        team_id: teamId ?? null,
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        accuracy_m: loc.coords.accuracy ?? undefined,
        altitude_m: loc.coords.altitude ?? undefined,
        source,
        recorded_at: new Date(loc.timestamp).toISOString(),
      }
      await insertPosition(pos)
    }
  )
}

export function stopGpsCapture(): void {
  watchSub?.remove()
  watchSub = null
}
