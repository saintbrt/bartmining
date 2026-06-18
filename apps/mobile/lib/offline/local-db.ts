// Local SQLite database — Sprint 7
// Buffers GPS positions, surveys and hole status changes for offline sync.
import * as SQLite from 'expo-sqlite'

let _db: SQLite.SQLiteDatabase | null = null

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db
  _db = await SQLite.openDatabaseAsync('goldpass_local.db')
  await _db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS local_positions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id  TEXT NOT NULL,
      team_id     TEXT,
      lat         REAL NOT NULL,
      lng         REAL NOT NULL,
      accuracy_m  REAL,
      altitude_m  REAL,
      source      TEXT NOT NULL DEFAULT 'gps',
      recorded_at TEXT NOT NULL,
      synced      INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS local_surveys (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      hole_id       TEXT NOT NULL,
      team_id       TEXT NOT NULL,
      local_path    TEXT NOT NULL,
      photo_lat     REAL NOT NULL,
      photo_lng     REAL NOT NULL,
      accuracy_m    REAL,
      notes         TEXT,
      submitted_at  TEXT NOT NULL,
      synced        INTEGER NOT NULL DEFAULT 0,
      remote_id     TEXT
    );

    CREATE TABLE IF NOT EXISTS local_hole_status (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      hole_id    TEXT NOT NULL,
      status     TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      synced     INTEGER NOT NULL DEFAULT 0
    );
  `)
  return _db
}

export async function insertPosition(pos: {
  profile_id: string; team_id: string | null; lat: number; lng: number
  accuracy_m?: number; altitude_m?: number; source?: string; recorded_at: string
}): Promise<void> {
  const db = await getDb()
  await db.runAsync(
    `INSERT INTO local_positions (profile_id, team_id, lat, lng, accuracy_m, altitude_m, source, recorded_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [pos.profile_id, pos.team_id ?? null, pos.lat, pos.lng,
     pos.accuracy_m ?? null, pos.altitude_m ?? null, pos.source ?? 'gps', pos.recorded_at]
  )
  // Prune if over 2000 rows
  await db.runAsync(`
    DELETE FROM local_positions WHERE id IN (
      SELECT id FROM local_positions ORDER BY id DESC LIMIT -1 OFFSET 2000
    )
  `)
}

export async function insertSurvey(survey: {
  hole_id: string; team_id: string; local_path: string
  photo_lat: number; photo_lng: number; accuracy_m?: number; notes?: string; submitted_at: string
}): Promise<void> {
  const db = await getDb()
  await db.runAsync(
    `INSERT INTO local_surveys (hole_id, team_id, local_path, photo_lat, photo_lng, accuracy_m, notes, submitted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [survey.hole_id, survey.team_id, survey.local_path,
     survey.photo_lat, survey.photo_lng, survey.accuracy_m ?? null, survey.notes ?? null, survey.submitted_at]
  )
}

export async function getUnsynced(): Promise<{
  positions: Record<string, unknown>[]
  surveys: Record<string, unknown>[]
  holeStatus: Record<string, unknown>[]
}> {
  const db = await getDb()
  const [positions, surveys, holeStatus] = await Promise.all([
    db.getAllAsync('SELECT * FROM local_positions WHERE synced = 0 ORDER BY id LIMIT 100'),
    db.getAllAsync('SELECT * FROM local_surveys WHERE synced = 0 ORDER BY id LIMIT 20'),
    db.getAllAsync('SELECT * FROM local_hole_status WHERE synced = 0 ORDER BY id LIMIT 50'),
  ])
  return {
    positions: positions as Record<string, unknown>[],
    surveys: surveys as Record<string, unknown>[],
    holeStatus: holeStatus as Record<string, unknown>[],
  }
}

export async function markSynced(table: 'local_positions' | 'local_surveys' | 'local_hole_status', ids: number[]): Promise<void> {
  if (!ids.length) return
  const db = await getDb()
  await db.runAsync(`UPDATE ${table} SET synced = 1 WHERE id IN (${ids.join(',')})`)
}
