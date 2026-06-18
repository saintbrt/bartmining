// BLE Mesh Relay — Sprint 13
// Devices with no data signal advertise their position as a 14-byte BLE payload.
// Nearby devices with signal pick it up and upload on their behalf.
//
// Payload layout (14 bytes):
//   [0]     team_id_short (1 byte — index 0-255)
//   [1-4]   lat encoded as int32 (×1e6)
//   [5-8]   lng encoded as int32 (×1e6)
//   [9-12]  unix timestamp uint32 (seconds)
//   [13]    checksum (XOR of bytes 0-12)
import { BleManager, Device } from 'react-native-ble-plx'
import { supabase } from '../supabase/client'
import * as SecureStore from 'expo-secure-store'

const EXPLORE_SERVICE_UUID = 'GP-EXPLORE-0001'
const POSITION_CHAR_UUID   = 'GP-EXPLORE-0002'

const manager = new BleManager()
let scanning = false

function encodePayload(teamIndex: number, lat: number, lng: number, ts: number): Uint8Array {
  const buf = new DataView(new ArrayBuffer(14))
  buf.setUint8(0, teamIndex & 0xff)
  buf.setInt32(1, Math.round(lat * 1e6), false)
  buf.setInt32(5, Math.round(lng * 1e6), false)
  buf.setUint32(9, ts, false)
  let chk = 0
  for (let i = 0; i < 13; i++) chk ^= buf.getUint8(i)
  buf.setUint8(13, chk)
  return new Uint8Array(buf.buffer)
}

function decodePayload(bytes: Uint8Array): { teamIndex: number; lat: number; lng: number; ts: number } | null {
  if (bytes.length !== 14) return null
  const buf = new DataView(bytes.buffer)
  let chk = 0
  for (let i = 0; i < 13; i++) chk ^= buf.getUint8(i)
  if (chk !== buf.getUint8(13)) return null  // checksum fail
  return {
    teamIndex: buf.getUint8(0),
    lat: buf.getInt32(1, false) / 1e6,
    lng: buf.getInt32(5, false) / 1e6,
    ts: buf.getUint32(9, false),
  }
}

export async function startMeshRelay(teamIds: string[]): Promise<void> {
  if (scanning) return
  scanning = true

  manager.startDeviceScan([EXPLORE_SERVICE_UUID], null, async (error, device: Device | null) => {
    if (error || !device) return
    try {
      await device.connect()
      await device.discoverAllServicesAndCharacteristics()
      const char = await device.readCharacteristicForService(EXPLORE_SERVICE_UUID, POSITION_CHAR_UUID)
      if (!char.value) return
      const bytes = Uint8Array.from(atob(char.value), c => c.charCodeAt(0))
      const decoded = decodePayload(bytes)
      if (!decoded) return

      const teamId = teamIds[decoded.teamIndex]
      if (!teamId) return

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const profileId = session.user.id
      await supabase.from('device_positions').insert({
        profile_id: profileId,
        team_id: teamId,
        lat: decoded.lat,
        lng: decoded.lng,
        source: 'gps',
        recorded_at: new Date(decoded.ts * 1000).toISOString(),
      })
    } catch { /* device may be out of range */ }
  })
}

export function stopMeshRelay(): void {
  scanning = false
  manager.stopDeviceScan()
}

export { encodePayload, decodePayload }

// Store team_id list for relay reference
export async function getTeamIdList(): Promise<string[]> {
  const stored = await SecureStore.getItemAsync('team_id_list')
  return stored ? JSON.parse(stored) : []
}
