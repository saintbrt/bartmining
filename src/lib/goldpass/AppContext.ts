import { createContext, useContext } from 'react'
import type { AuthUser } from './auth'

/* Minimal admin context: just the signed-in user. The old drill project/table
   state was removed with the exploration module. */
export interface AppState {
  user: AuthUser
}

export const AppContext = createContext<AppState | null>(null)
export const useAppContext = () => useContext(AppContext)
