import { createContext, useContext } from 'react'
import type { Project, TableMeta } from './db'

type StageStatus = { validation: 'pending' | 'done'; cleaning: 'pending' | 'done'; analysis: 'pending' | 'done' }

export interface AppState {
  user: { email: string } | null
  projects: Project[]
  project: Project | null
  tables: TableMeta[]
  stageStatus: Record<string, StageStatus>
  booting: boolean
  setProject: (p: Project | null) => void
  approveStage: (stage: keyof StageStatus) => void
  isStageUnlocked: (stage: string) => boolean
  getStageStatus: (pid: string) => StageStatus
  refresh: () => void
}

export const AppContext = createContext<AppState | null>(null)
export const useAppContext = () => useContext(AppContext)
