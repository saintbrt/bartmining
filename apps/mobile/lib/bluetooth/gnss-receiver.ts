// Bluetooth Classic GNSS Receiver — Sprint 13
// Reads NMEA 0183 sentences from paired receivers (Eos Arrow, Bad Elf, Emlid Reach RS2)
// and emits high-accuracy GPS positions to replace internal GPS.
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic'
import { insertPosition } from '../offline/local-db'
import { supabase } from '../supabase/client'
import * as SecureStore from 'expo-secure-store'

type NmeaGga = { lat: number; lng: number; altitude: number; accuracy: number; valid: boolean }

function parseGga(sentence: string): NmeaGga | null {
  // $GPGGA,hhmmss.ss,llll.ll,a,yyyyy.yy,a,x,xx,x.x,x.x,M,x.x,M,x.x,xxxx*hh
  if (!sentence.startsWith('$GPGGA') && !sentence.startsWith('$GNGGA')) return null
  const parts = sentence.split(',')
  if (parts.length < 10) return null
  const fixQuality = parseInt(parts[6])
  if (!fixQuality) return null // 0 = no fix

  const rawLat = parseFloat(parts[2])
  const latDir = parts[3]
  const rawLng = parseFloat(parts[4])
  const lngDir = parts[5]

  const lat = Math.floor(rawLat / 100) + (rawLat % 100) / 60
  const lng = Math.floor(rawLng / 100) + (rawLng % 100) / 60
  const finalLat = latDir === 'S' ? -lat : lat
  const finalLng = lngDir === 'W' ? -lng : lng
  const altitude = parseFloat(parts[9]) || 0
  const hdop = parseFloat(parts[8]) || 1
  const accuracy = hdop * 3  // rough CEP estimate

  return { lat: finalLat, lng: finalLng, altitude, accuracy, valid: true }
}

let activeDevice: BluetoothDevice | null = null
let readInterval: ReturnType<typeof setInterval> | null = null

export async function listPairedReceivers(): Promise<BluetoothDevice[]> {
  const devices = await RNBluetoothClassic.getBondedDevices()
  return devices
}

export async function connectToReceiver(device: BluetoothDevice): Promise<void> {
  await disconnectReceiver()
  activeDevice = await RNBluetoothClassic.connectToDevice(device.address)

  const profileId = (await supabase.auth.getUser()).data.user?.id
  const teamId = await SecureStore.getItemAsync('team_id')
  if (!profileId) return

  let buffer = ''
  readInterval = setInterval(async () => {
    if (!activeDevice) return
    try {
      const available = await activeDevice.available()
      if (available) {
        const data = await activeDevice.read()
        buffer += data
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const fix = parseGga(line.trim())
          if (fix?.valid) {
            await insertPosition({
              profile_id: profileId,
              team_id: teamId,
              lat: fix.lat,
              lng: fix.lng,
              accuracy_m: fix.accuracy,
              altitude_m: fix.altitude,
              source: 'bluetooth_gnss',
              recorded_at: new Date().toISOString(),
            })
          }
        }
      }
    } catch { /* device disconnected */ }
  }, 1000)
}

export async function disconnectReceiver(): Promise<void> {
  if (readInterval) { clearInterval(readInterval); readInterval = null }
  if (activeDevice) {
    try { await activeDevice.disconnect() } catch { /* ignore */ }
    activeDevice = null
  }
}

export function isConnected(): boolean {
  return activeDevice !== null
}
