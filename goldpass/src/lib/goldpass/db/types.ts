export interface Project {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface TableMeta {
  id: string
  project_id: string
  name: string
  type: string
  columns: Record<string, string>
  row_count: number
  parent_ids?: string[]
  created_at: string
  updated_at: string
}

export interface TableRow {
  [key: string]: unknown
}

export interface AuditEntry {
  id: string
  project_id: string
  table_id: string | null
  operation: string
  details: string
  user_id: string
  timestamp: string
  created_at: string
}

export interface Output {
  id: string
  project_id: string
  name: string
  format: string
  row_count: number
  rows?: number
  created_at: string
}

export interface Version {
  id: string
  table_id: string
  project_id: string
  operation: string
  row_count: number
  created_at: string
}

export interface StageStatus {
  validation: 'pending' | 'done'
  cleaning: 'pending' | 'done'
  analysis: 'pending' | 'done'
}

export type ColType =
  | 'hole_id' | 'from' | 'to' | 'au' | 'cu' | 'ag'
  | 'easting' | 'northing' | 'elevation' | 'depth'
  | 'dip' | 'azimuth' | 'lithology' | 'ignore'
