'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { restoreSession, signOut, type AuthUser } from '@/lib/goldpass/auth'
import { AppContext } from '@/lib/goldpass/AppContext'

const NAV = [
  { id: 'dashboard',  ico: '⬡', label: 'Dashboard' },
  { id: 'operations', ico: '▤', label: 'Operations' },
  { id: 'plant',      ico: '⚗', label: 'Plant', soon: true },
  { id: 'settings',   ico: '⚙', label: 'Settings' },
]
const OPERATIONS_SUBTABS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'expenses',     label: 'Expenses' },
  { id: 'inventory',    label: 'Inventory' },
  { id: 'sales',        label: 'Sales' },
  { id: 'procurement',  label: 'Procurement' },
  { id: 'shift-logs',   label: 'Shift Logs' },
  { id: 'equipment',    label: 'Equipment' },
  { id: 'daily-ops',    label: 'Daily Ops' },
  { id: 'payroll',      label: 'Payroll' },
  { id: 'executive',    label: 'Executive' },
  { id: 'conflicts',    label: 'Conflicts' },
  { id: 'master-data',  label: 'Master Data' },
  { id: 'users',        label: 'Users' },
  { id: 'audit',        label: 'Audit Log' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [booting, setBooting] = useState(true)
  const [user, setUser] = useState<AuthUser>(null)
  const [operationsOpen, setOperationsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    let alive = true
    restoreSession().then(u => {
      if (!alive) return
      if (!u) { router.push('/admin/login'); return }
      setUser(u); setBooting(false)
    })
    return () => { alive = false }
  }, [])

  // Auto-open the Operations accordion when navigating directly via URL.
  useEffect(() => { if (pathname.startsWith('/admin/operations')) setOperationsOpen(true) }, [pathname])
  // Close the mobile drawer whenever the route changes.
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  function handleSignOut() { signOut(); router.push('/admin/login') }

  const pathParts = pathname.replace('/admin/', '').split('/')
  const curSection = pathParts[0] || 'dashboard'
  const curSubSection = pathParts[1] ?? ''

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
    <AppContext.Provider value={{ user }}>
      <div className="app-root">
        <div className={`sb-backdrop${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />
        <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="sb-brand">
            <div className="sb-diamond" />
            <div>
              <div className="sb-brand-name">GoldPass</div>
            </div>
          </div>
          <div className="sb-nav">
            <div className="sb-section">Navigation</div>
            {NAV.map(item => {
              const isOperations = item.id === 'operations'
              const isActive = curSection === item.id
              if (item.soon) {
                return (
                  <div key={item.id} className="sb-item sb-item-locked" title="Coming soon">
                    <span className="ico">{item.ico}</span>
                    <span className="sb-label">{item.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 9, opacity: 0.6 }}>soon</span>
                  </div>
                )
              }
              return (
                <div key={item.id}>
                  <div className={`sb-item${isActive ? ' active' : ''}`}
                    onClick={() => (isOperations ? setOperationsOpen(o => !o) : router.push('/admin/' + item.id))}>
                    <span className="ico">{item.ico}</span>
                    <span className="sb-label">{item.label}</span>
                    {isOperations && (
                      <span style={{ marginLeft: 'auto', fontSize: 9, opacity: 0.5 }}>{operationsOpen ? '▲' : '▼'}</span>
                    )}
                  </div>
                  {isOperations && operationsOpen && (
                    <div style={{ paddingLeft: 20 }}>
                      {OPERATIONS_SUBTABS.map(sub => (
                        <div key={sub.id}
                          className={`sb-item${curSection === 'operations' && curSubSection === sub.id ? ' active' : ''}`}
                          style={{ fontSize: 12, paddingLeft: 12 }}
                          onClick={() => router.push('/admin/operations/' + sub.id)}>
                          <span className="sb-label">{sub.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
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
            <button className="sb-hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">☰</button>
            <div className="topbar-title">GoldPass</div>
            <div className="topbar-sub">/ {curSection}{curSubSection ? ` / ${curSubSection}` : ''}</div>
          </div>
          {children}
        </div>
      </div>
    </AppContext.Provider>
  )
}
