'use client'


import { useAppContext } from '@/lib/AppContext'
import WorkspacePage from '@/components/workspace/WorkspacePage'

export default function ValidationPage() {
  const ctx = useAppContext()
  if (!ctx || !ctx.user) return null
  const { project, tables, user, refresh, getStageStatus, approveStage } = ctx
  if (!project) return (
    <div className="content content-pad" style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, opacity: .15, marginBottom: 12 }}>◆</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No project selected</div>
        <p style={{ fontSize: 13, color: 'var(--label-3)' }}>Select a project from the sidebar or create one on the Dashboard.</p>
      </div>
    </div>
  )
  const ss = getStageStatus(project.id)
  return <WorkspacePage stage="validation" project={project} user={user!} tables={tables} onRefresh={refresh} stageDone={ss.validation === 'done'} onApprove={() => approveStage('validation')} />
}
