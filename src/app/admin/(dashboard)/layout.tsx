'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { DB } from '@/lib/goldpass/db'
import { gpError } from '@/lib/goldpass/errors'
import { notify } from '@/lib/goldpass/notify'
import { AppContext } from '@/lib/goldpass/AppContext'
import { createClient } from '@/lib/goldpass/supabase/client'
import type { Project, TableMeta, StageStatus } from '@/lib/goldpass/db'

type ExploreSite = { id: string; name: string }

const NAV = [
  { id: 'dashboard', ico: '⬡', label: 'Dashboard' },
  { id: 'map-data',  ico: '◎', label: 'Map Data' },
  { id: 'maxgold',   ico: '⛏', label: 'Max Gold' },
  { id: 'explore',   ico: '◈', label: 'Explore' },
  { id: 'settings',  ico: '⚙', label: 'Settings' },
]
const MAP_DATA_SUBTABS = [
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'outputs',  label: 'Outputs' },
]
const EXPLORE_SUBTABS = [
  { id: 'overview',       label: 'Overview' },
  { id: 'live-map',       label: 'Live Map' },
  { id: 'my-holes',       label: 'My Holes' },
  { id: 'assignments',    label: 'Assignments' },
  { id: 'radio-call',     label: 'Radio Call' },
  { id: 'survey-photos',  label: 'Survey Photos' },
  { id: 'devices',        label: 'Devices' },
  { id: 'settings',       label: 'Site Settings' },
]
const STAGE_GATES = new Set<string>()
const PROJ_COLORS = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30']

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [booting, setBooting] = useState(true)
  const [mapDataOpen, setMapDataOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [project, setProjectState] = useState<Project | null>(null)
  const [tables, setTables] = useState<TableMeta[]>([])
  const [stageStatus, setStageStatus] = useState<Record<string, StageStatus>>({})
  const [refreshKey, setRefreshKey] = useState(0)
  const [rowsLoading, setRowsLoading] = useState(false)
  const [exploreSites, setExploreSites] = useState<ExploreSite[]>([])

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
          // Load explore sites from Supabase
          const sb = createClient()
          const { data } = await sb.from('sites').select('id, name').order('name')
          if (alive && data) setExploreSites(data)
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

  // Auto-open the correct accordion when navigating directly via URL
  useEffect(() => {
    if (pathname.startsWith('/admin/map-data')) setMapDataOpen(true)
    if (pathname.startsWith('/admin/explore')) setExploreOpen(true)
  }, [pathname])

  function setProject(p: Project | null) {
    setProjectState(p)
    if (p) {
      setRowsLoading(true)
      DB.loadProjectRows(p.id).then(() => { setRowsLoading(false); refresh() })
      router.push('/admin/map-data/cleaning')
    }
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
    if (idx >= 0 && idx < order.length - 1) router.push('/admin/map-data/' + order[idx + 1])
  }

  function isStageUnlocked(_stage: string): boolean {
    return true
  }

  function handleNav(id: string) {
    if (id === 'map-data') {
      setMapDataOpen(o => !o)
      return
    }
    if (id === 'explore') {
      setExploreOpen(o => !o)
      return
    }
    const mapDataIds = new Set(MAP_DATA_SUBTABS.map(s => s.id))
    if (mapDataIds.has(id)) {
      router.push('/admin/map-data/' + id)
      return
    }
    const exploreIds = new Set(EXPLORE_SUBTABS.map(s => s.id))
    if (exploreIds.has(id)) {
      router.push('/admin/explore/' + id)
      return
    }
    router.push('/admin/' + id)
  }

  function handleSignOut() { DB.signOut(); router.push('/admin/login') }

  const pathParts = pathname.replace('/admin/', '').split('/')
  const curSection = pathParts[0] || 'dashboard'
  const curSubSection = pathParts[1] ?? ''
  const curSubView = pathParts[2] ?? ''

  if (booting) return (
    <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="sb-diamond" style={{ margin: '0 auto 16px', width: 32, height: 32 }} />
        <div style={{ color: 'var(--label-3)', fontSize: 13, fontFamily: 'monospace' }}>Connecting to GoldPass…</div>
      </div>
    </div>
  )

  if (!user) return null

  return (
    <AppContext.Provider value={{ user, projects, project, tables, stageStatus, booting, rowsLoading, setProject, approveStage, isStageUnlocked, getStageStatus, refresh }}>
      <div className="app-root">
        <div className="sidebar">
          <div className="sb-brand">
            <div className="sb-diamond" />
            <div>
              <div className="sb-brand-name">GoldPass</div>
            </div>
          </div>
          <div className="sb-nav">
            <div className="sb-section">Navigation</div>
            {NAV.map(item => {
              const isMapData = item.id === 'map-data'
              const isExplore = item.id === 'explore'
              const isActive = isMapData
                ? curSection === 'map-data'
                : isExplore
                  ? curSection === 'explore'
                  : curSection === item.id
              return (
                <div key={item.id}>
                  <div className={`sb-item${isActive ? ' active' : ''}`} onClick={() => handleNav(item.id)}>
                    <span className="ico">{item.ico}</span>
                    <span className="sb-label">{item.label}</span>
                    {(isMapData || isExplore) && (
                      <span style={{ marginLeft: 'auto', fontSize: 9, opacity: 0.5 }}>
                        {isMapData ? (mapDataOpen ? '▲' : '▼') : (exploreOpen ? '▲' : '▼')}
                      </span>
                    )}
                  </div>

                  {isMapData && mapDataOpen && (
                    <div style={{ paddingLeft: 20 }}>
                      {MAP_DATA_SUBTABS.map(sub => (
                        <div key={sub.id}
                          className={`sb-item${curSection === 'map-data' && curSubSection === sub.id ? ' active' : ''}`}
                          style={{ fontSize: 12, paddingLeft: 12 }}
                          onClick={() => handleNav(sub.id)}>
                          <span className="sb-label">{sub.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {isExplore && exploreOpen && (
                    <div style={{ paddingLeft: 20 }}>
                      {EXPLORE_SUBTABS.map(sub => (
                        <div key={sub.id}
                          className={`sb-item${curSubSection === sub.id && curSection === 'explore' ? ' active' : ''}`}
                          style={{ fontSize: 12, paddingLeft: 12 }}
                          onClick={() => handleNav(sub.id)}>
                          <span className="sb-label">{sub.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
          {exploreSites.length > 0 && (
            <>
              <div className="sb-sep" />
              <div className="sb-section">Field Sites</div>
              {exploreSites.map(s => (
                <div key={s.id} className="sb-proj" onClick={() => router.push('/admin/explore/overview')}>
                  <div className="sb-proj-dot" style={{ background: 'var(--gold)' }} />
                  <div className="sb-proj-name">{s.name}</div>
                </div>
              ))}
            </>
          )}
          <div className="sb-foot">
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A9A', fontSize: 12, textAlign: 'left', padding: '4px 0', marginBottom: 6 }}
              onClick={handleSignOut}>
              Sign out
            </button>
            <div className="sb-user">
              <div className="sb-av">{user.email.slice(0, 2).toUpperCase()}</div>
              <div className="sb-email">{user.email}</div>
            </div>
          </div>
        </div>

        <div className="main-area">
          <div className="topbar" style={curSection === 'dashboard' ? { display: 'none' } : {}}>
            <div className="topbar-title">{project?.name ?? 'GoldPass'}</div>
            {project && (
              <div className="topbar-sub">
                / {curSection}
                {curSubSection ? ` / ${curSubSection}` : ''}
                {curSubView ? ` / ${curSubView}` : ''}
              </div>
            )}
            <div className="topbar-actions">
            </div>
          </div>
          {rowsLoading && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(11,12,14,0.5)', display: 'grid', placeItems: 'center', zIndex: 999 }}>
              <div style={{ textAlign: 'center' }}>
                <div className="sb-diamond" style={{ margin: '0 auto 16px', width: 32, height: 32 }} />
                <div style={{ color: '#9BA6BC', fontSize: 13, fontFamily: 'monospace' }}>Loading project data…</div>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </AppContext.Provider>
  )
}
