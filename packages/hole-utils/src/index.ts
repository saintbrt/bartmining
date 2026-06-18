// Hole grid utilities — shared between dashboard and mobile

export function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export interface GridOrigin {
  lat: number
  lng: number
  rowSpacingM: number
  colSpacingM: number
}

/**
 * Calculate the lat/lng of a hole from its grid origin and row/col indices.
 * Row increases southward (negative latitude direction), col increases eastward.
 */
export function holeCoords(origin: GridOrigin, row: number, col: number): { lat: number; lng: number } {
  const latPerMeter = 1 / 111320
  const lngPerMeter = 1 / (111320 * Math.cos(origin.lat * Math.PI / 180))
  return {
    lat: origin.lat - row * origin.rowSpacingM * latPerMeter,
    lng: origin.lng + col * origin.colSpacingM * lngPerMeter,
  }
}

/**
 * Generate a full grid of hole_id strings and coordinates for a site.
 */
export function generateHoleGrid(
  origin: GridOrigin,
  totalRows: number,
  totalCols: number,
  prefix = 'H',
): Array<{ hole_id: string; row_num: number; col_num: number; lat: number; lng: number }> {
  const holes = []
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < totalCols; c++) {
      const coords = holeCoords(origin, r, c)
      holes.push({
        hole_id: `${prefix}${String(r + 1).padStart(3, '0')}-${String(c + 1).padStart(3, '0')}`,
        row_num: r + 1,
        col_num: c + 1,
        lat: coords.lat,
        lng: coords.lng,
      })
    }
  }
  return holes
}

export function surveyStatusFromOffset(offsetM: number): 'approved' | 'pending' | 'rejected' {
  if (offsetM <= 30) return 'approved'
  if (offsetM <= 100) return 'pending'
  return 'rejected'
}

export function weekStartDate(offset = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay() + offset * 7)
  return d.toISOString().slice(0, 10)
}
