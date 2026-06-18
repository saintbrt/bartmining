// BLE Mesh Relay payload encoding/decoding — shared between mobile devices

export const PAYLOAD_BYTES = 14

export function encodePayload(teamIndex: number, lat: number, lng: number, tsSeconds: number): Uint8Array {
  const buf = new DataView(new ArrayBuffer(PAYLOAD_BYTES))
  buf.setUint8(0, teamIndex & 0xff)
  buf.setInt32(1, Math.round(lat * 1e6), false)
  buf.setInt32(5, Math.round(lng * 1e6), false)
  buf.setUint32(9, tsSeconds, false)
  let chk = 0
  for (let i = 0; i < PAYLOAD_BYTES - 1; i++) chk ^= buf.getUint8(i)
  buf.setUint8(PAYLOAD_BYTES - 1, chk)
  return new Uint8Array(buf.buffer)
}

export function decodePayload(bytes: Uint8Array): {
  teamIndex: number; lat: number; lng: number; tsSeconds: number
} | null {
  if (bytes.length !== PAYLOAD_BYTES) return null
  const buf = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let chk = 0
  for (let i = 0; i < PAYLOAD_BYTES - 1; i++) chk ^= buf.getUint8(i)
  if (chk !== buf.getUint8(PAYLOAD_BYTES - 1)) return null
  return {
    teamIndex: buf.getUint8(0),
    lat: buf.getInt32(1, false) / 1e6,
    lng: buf.getInt32(5, false) / 1e6,
    tsSeconds: buf.getUint32(9, false),
  }
}
