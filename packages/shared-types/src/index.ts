// Shared types between dashboard and mobile app

export type HoleStatus = 'pending' | 'in_progress' | 'completed' | 'flagged'
export type DeviceRole = 'field_team' | 'supervisor'
export type InvitationStatus = 'pending' | 'active' | 'revoked'
export type SurveyStatus = 'pending' | 'approved' | 'rejected'
export type AlertPriority = 'normal' | 'urgent'
export type AlertTargetType = 'team' | 'all' | 'individual'
export type GpsSource = 'gps' | 'bluetooth_gnss' | 'manual'
export type DeviceStatus = 'active' | 'suspended' | 'deregistered'

export interface Site {
  id: string
  name: string
  description?: string
  total_rows: number
  total_cols: number
  origin_lat: number
  origin_lng: number
  row_spacing_m: number
  col_spacing_m: number
  created_by?: string
  created_at: string
}

export interface Hole {
  id: string
  site_id: string
  hole_id: string
  row_num: number
  col_num: number
  lat: number
  lng: number
  elevation_m?: number
  status: HoleStatus
  created_at: string
}

export interface ExploreTeam {
  id: string
  site_id: string
  name: string
  color_hex: string
  created_at: string
}

export interface Assignment {
  id: string
  site_id: string
  team_id: string
  hole_id: string
  week_start: string
  assigned_by?: string
  created_at: string
}

export interface DevicePosition {
  id: string
  profile_id: string
  team_id?: string
  lat: number
  lng: number
  accuracy_m?: number
  altitude_m?: number
  source: GpsSource
  recorded_at: string
  synced_at: string
}

export interface HoleSurvey {
  id: string
  hole_id: string
  team_id: string
  submitted_by: string
  photo_url: string
  photo_lat: number
  photo_lng: number
  photo_accuracy_m?: number
  notes?: string
  status: SurveyStatus
  reviewed_by?: string
  reviewed_at?: string
  submitted_at: string
  synced_offline: boolean
}

export interface ExploreAlert {
  id: string
  site_id: string
  sent_by: string
  target_type: AlertTargetType
  target_id?: string
  message: string
  priority: AlertPriority
  delivery_status: Record<string, string>
  created_at: string
}

export interface DeviceInvitation {
  id: string
  site_id: string
  team_id: string
  device_code: string
  label?: string
  role: DeviceRole
  status: InvitationStatus
  created_by: string
  claimed_by?: string
  claimed_at?: string
  expires_at: string
  created_at: string
}

export interface RegisteredDevice {
  id: string
  profile_id: string
  invitation_id: string
  android_id: string
  device_model?: string
  app_version?: string
  fcm_token?: string
  bt_mac?: string
  last_seen_at?: string
  registered_at: string
  status: DeviceStatus
}
