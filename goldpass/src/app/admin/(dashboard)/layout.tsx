'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { DB } from '@/lib/goldpass/db'
import { gpError } from '@/lib/goldpass/errors'
import { AppContext } from '@/lib/goldpass/AppContext'
import type { Project, TableMeta, StageStatus } from '@/lib/goldpass/db'

const NAV = [
  { id: 'dashboard',     ico: '⬡', label: 'Dashboard' },
  { id: 'validation',    ico: '①', label: 'Validation' },
  { id: 'cleaning',      ico: '②', label: 'Cleaning' },
  { id: 'analysis',      ico: '③', label: 'Analysis' },
  { id: 'outputs',       ico: '⬇', label: 'Outputs' },
  { id: 'visualization', ico: '◈', label: 'Visualise' },
  { id: 'settings',      ico: '⚙', label: 'Settings' },
]
const STAGE_GATES = new Set(['cleaning', 'analysis', 'outputs', 'visualization'])
const PROJ_COLORS = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30']

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [booting, setBooting] = useState(true)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [project, setProjectState] = useState<Project | null>(null)
  const [tables, setTables] = useState<TableMeta[]>([])
  const [stageStatus, setStageStatus] = useState<Record<string, StageStatus>>({})
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const u = await DB.restoreSession()
        if (!u) { router.push('/admin/login'); return }
        await DB.bootstrap()
        if (alive) {
          setUser(u)
          setProjects(DB.getProjects())
          const stages: Record<string, StageStatus> = {}
          DB.getProjects().forEach(p => { stages[p.id] = DB.getStageStatus(p.id) })
          setStageStatus(stages)
        }
      } catch (e) {
        gpError('GP-2208', e instanceof Error ? e.message : String(e))
        router.push('/admin/login'); return
      }
      finally { if (alive) setBooting(false) }
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => { if (!user) return; setProjects(DB.getProjects()) }, [user, refreshKey])
  useEffect(() => { if (project) setTables(DB.getTables(project.id)); else setTables([]) }, [project, refreshKey])

  function setProject(p: Project | null) {
    setProjectState(p)
    if (p) router.push('/admin/validation')
  }

  function getStageStatus(pid: string): StageStatus {
    return stageStatus[pid] ?? { validation: 'pending', cleaning: 'pending', analysis: 'pending' }
  }

  function approveStage(stage: keyof StageStatus) {
    if (!project) return
    const cur = stageStatus[project.id] ?? DB.getStageStatus(project.id)
    const next = { ...cur, [stage]: 'done' as const }
    DB.setStageStatus(project.id, next, user?.email)
    setStageStatus(prev => ({ ...prev, [project.id]: next }))
    const order: (keyof StageStatus)[] = ['validation', 'cleaning', 'analysis']
    const idx = order.indexOf(stage)
    if (idx >= 0 && idx < order.length - 1) router.push('/admin/' + order[idx + 1])
  }

  function isStageUnlocked(stage: string): boolean {
    if (!project) return stage === 'validation' || stage === 'dashboard' || stage === 'settings'
    const s = getStageStatus(project.id)
    if (stage === 'validation' || stage === 'dashboard' || stage === 'settings') return true
    if (stage === 'cleaning') return s.validation === 'done'
    if (stage === 'analysis') return s.cleaning === 'done'
    if (stage === 'outputs' || stage === 'visualization') return s.analysis === 'done'
    return true
  }

  function handleNav(id: string) {
    if (!isStageUnlocked(id)) {
      const prereq: Record<string, string> = { cleaning: 'Validation', analysis: 'Cleaning', outputs: 'Analysis', visualization: 'Analysis' }
      alert(`Complete ${prereq[id] ?? 'the previous stage'} first.`)
      return
    }
    router.push('/admin/' + id)
  }

  function handleSignOut() { DB.signOut(); router.push('/admin/login') }

  const curView = pathname.replace('/admin/', '').split('/')[0] || 'dashboard'
  const ss = project ? getStageStatus(project.id) : {} as StageStatus

  if (booting) return (
    <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: '#0B0C0E' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="sb-diamond" style={{ margin: '0 auto 16px', width: 32, height: 32 }} />
        <div style={{ color: '#9BA6BC', fontSize: 13, fontFamily: 'monospace' }}>Connecting to GoldPass…</div>
      </div>
    </div>
  )

  if (!user) return null

  return (
    <AppContext.Provider value={{ user, projects, project, tables, stageStatus, booting, setProject, approveStage, isStageUnlocked, getStageStatus, refresh }}>
      <div className="app-root">
        <div className="sidebar">
          <div className="sb-brand">
            <div className="sb-diamond" />
            <div>
              <div className="sb-brand-name">Bart Mining</div>
              <div className="sb-brand-sub">GoldPass · Internal</div>
            </div>
          </div>
          <div className="sb-nav">
            <div className="sb-section">Navigation</div>
            {NAV.map(item => {
              const locked = STAGE_GATES.has(item.id) && !isStageUnlocked(item.id)
              const done = (ss as unknown as Record<string, string>)[item.id] === 'done'
              return (
                <div key={item.id} className={`sb-item${curView === item.id ? ' active' : ''}${locked ? ' sb-item-locked' : ''}`} onClick={() => handleNav(item.id)}>
                  <span className="ico">{locked ? '🔒' : done ? '✓' : item.ico}</span>
                  <span className="sb-label">{item.label}</span>
                </div>
              )
            })}
            {projects.length > 0 && (
              <>
                <div className="sb-sep" />
                <div className="sb-section">Projects</div>
                {projects.map((p, i) => (
                  <div key={p.id} className={`sb-proj${project?.id === p.id ? ' active' : ''}`} onClick={() => setProject(p)}>
                    <div className="sb-proj-dot" style={{ background: PROJ_COLORS[i % 5] }} />
                    <div className="sb-proj-name">{p.name}</div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="sb-foot">
            <div className="sb-user">
              <div className="sb-av">{user.email.slice(0, 2).toUpperCase()}</div>
              <div className="sb-email">{user.email}</div>
            </div>
            <button className="sb-signout" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>

        <div className="main-area">
          <div className="topbar" style={curView === 'dashboard' ? { display: 'none' } : {}}>
            <div className="topbar-title">{project?.name ?? 'GoldPass'}</div>
            {project && <div className="topbar-sub">/ {curView}</div>}
            <div className="topbar-actions">
              <span style={{ fontSize: 11, color: 'var(--label-4)', fontFamily: 'monospace' }}>Internal · Live</span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </AppContext.Provider>
  )
}
