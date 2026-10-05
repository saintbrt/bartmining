'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/goldpass/supabase/client'
import { getProject, saveProjectData, type ProjectRow } from '@/lib/proposals/db'
import { contractValue } from '@/lib/proposals/deal'
import type { Project } from '@/lib/proposals/types'
import type { Update } from './planner/store'

export type SaveState = 'saved' | 'saving' | 'unsaved' | 'error' | 'conflict'

/**
 * One project from bm_projects, saved back as it's edited (debounced). A save
 * only lands if nobody saved since this window loaded; otherwise the window
 * stops saving and asks for a reload, so two windows can't overwrite each
 * other. Changes saved elsewhere are picked up while this window is idle.
 */
export function useProjectDoc(id: string) {
  const [row, setRow] = useState<ProjectRow | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [save, setSave] = useState<SaveState>('saved')
  const saveRef = useRef<SaveState>('saved')
  saveRef.current = save
  const latest = useRef<Project | null>(null)
  const version = useRef(0)
  const timer = useRef<number | undefined>(undefined)

  const load = useCallback(async () => {
    const r = await getProject(id)
    if (!r) { setError('Project not found, or this account has no access to it.'); return }
    latest.current = r.data
    version.current = r.version
    setRow(r)
    setProject(r.data)
    setSave('saved')
  }, [id])

  useEffect(() => { load() }, [load])

  const flush = useCallback(async () => {
    window.clearTimeout(timer.current)
    if (!latest.current || saveRef.current === 'conflict' || saveRef.current === 'saved') return saveRef.current !== 'conflict'
    setSave('saving')
    const res = await saveProjectData(id, latest.current, version.current, contractValue(latest.current))
    if (res.ok) {
      version.current = res.version
      setSave('saved')
      return true
    }
    setSave(res.conflict ? 'conflict' : 'error')
    return false
  }, [id])

  const update: Update = useCallback(fn => {
    if (!latest.current || saveRef.current === 'conflict') return
    const next = structuredClone(latest.current)
    fn(next)
    latest.current = next
    setProject(next)
    setSave('unsaved')
    saveRef.current = 'unsaved'
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, 700)
  }, [flush])

  // Changes saved in another window or by the server (a proposal number).
  useEffect(() => {
    const check = async () => {
      if (document.hidden || saveRef.current !== 'saved') return
      const { data } = await createClient().from('bm_projects').select('version').eq('id', id).maybeSingle()
      if (data && data.version !== version.current && saveRef.current === 'saved') load()
    }
    const t = window.setInterval(check, 15000)
    window.addEventListener('focus', check)
    return () => { window.clearInterval(t); window.removeEventListener('focus', check) }
  }, [id, load])

  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (saveRef.current === 'unsaved' || saveRef.current === 'saving') { flush(); e.preventDefault() }
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [flush])

  return { row, project, error, save, update, flush, reload: load, setRow }
}
