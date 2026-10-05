import { useEffect, useState } from 'react'
import type { Project } from '@/lib/proposals/types'

export type Update = (fn: (draft: Project) => void) => void

/** Small piece of UI state kept per browser (last tab, last option). */
export function useLocal<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(`bm:${key}`)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(`bm:${key}`, JSON.stringify(v)) } catch { /* private mode */ }
  }, [key, v])
  return [v, setV] as const
}
