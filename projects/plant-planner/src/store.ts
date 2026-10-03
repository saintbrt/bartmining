import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from './types'

export type SaveState = 'saved' | 'saving' | 'unsaved' | 'error' | 'conflict'
export type Update = (fn: (draft: Project) => void) => void

/** Loads one project file and writes every change back to it, debounced. */
export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [save, setSave] = useState<SaveState>('saved')
  const saveRef = useRef<SaveState>('saved')
  saveRef.current = save
  const timer = useRef<number | undefined>(undefined)
  const latest = useRef<Project | null>(null)
  const version = useRef<string | null>(null)

  useEffect(() => {
    setProject(null)
    setError(null)
    fetch(`/api/projects/${slug}`)
      .then(r => {
        if (!r.ok) return Promise.reject(new Error(`Could not load ${slug} (${r.status})`))
        version.current = r.headers.get('X-Version')
        return r.json()
      })
      .then((p: Project) => { latest.current = p; setProject(p) })
      .catch(e => setError(String(e.message ?? e)))
  }, [slug])

  // Pick up changes made elsewhere (another tab, or the file edited on disk)
  // without a manual reload. Local edits in progress are never replaced.
  useEffect(() => {
    let busy = false
    const check = async () => {
      if (busy || document.hidden || saveRef.current !== 'saved' || !version.current) return
      busy = true
      try {
        const r = await fetch(`/api/projects/${slug}`)
        const v = r.headers.get('X-Version')
        if (r.ok && v && v !== version.current && saveRef.current === 'saved') {
          const p = (await r.json()) as Project
          version.current = v
          latest.current = p
          setProject(p)
        }
      } catch { /* server down: try again next tick */ }
      busy = false
    }
    const timer = window.setInterval(check, 3000)
    window.addEventListener('focus', check)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', check) }
  }, [slug])

  const flush = useCallback(async () => {
    window.clearTimeout(timer.current)
    if (!latest.current) return
    setSave('saving')
    try {
      const r = await fetch(`/api/projects/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(version.current ? { 'If-Match': version.current } : {}) },
        body: JSON.stringify(latest.current),
      })
      if (r.status === 409) return setSave('conflict')
      version.current = r.headers.get('X-Version') ?? version.current
      setSave(r.ok ? 'saved' : 'error')
    } catch {
      setSave('error')
    }
  }, [slug])

  const update: Update = useCallback(fn => {
    if (!latest.current) return
    // A tab that lost a save conflict stops saving until it's reloaded.
    if (saveRef.current === 'conflict') return
    const next = structuredClone(latest.current)
    fn(next)
    latest.current = next
    setProject(next)
    setSave('unsaved')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, 500)
  }, [flush])

  // Don't lose the last edit if the tab closes inside the debounce window.
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (save === 'unsaved' || save === 'saving') { flush(); e.preventDefault() }
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [save, flush])

  return { project, error, save, update }
}

export function useProjectList() {
  const [list, setList] = useState<{ slug: string; name: string }[]>([])
  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setList).catch(() => setList([]))
  }, [])
  return list
}

/** Small piece of UI state kept per browser (last tab, last option). */
export function useLocal<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(`pp:${key}`)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(`pp:${key}`, JSON.stringify(v)) } catch { /* private mode */ }
  }, [key, v])
  return [v, setV] as const
}
