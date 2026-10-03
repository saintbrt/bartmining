import { useCallback, useMemo } from 'react'
import { projectModel } from './model'
import { useLocal, useProject, useProjectList, type SaveState } from './store'
import { Overview } from './views/Overview'
import { Budget } from './views/Budget'
import { Schedule } from './views/Schedule'
import { Cashflow } from './views/Cashflow'
import { Expenses } from './views/Expenses'
import { Plant } from './views/Plant'
import { Proposal } from './views/Proposal'
import { MapView } from './views/Map'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'budget', label: 'Budget' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'cashflow', label: 'Cashflow' },
  { id: 'plant', label: 'Plant' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'map', label: 'Map' },
] as const
type Tab = (typeof TABS)[number]['id']

const SAVE_TEXT: Record<SaveState, string> = { saved: 'Saved', saving: 'Saving…', unsaved: 'Unsaved', error: 'Not saved: is the dev server running?', conflict: 'Changed elsewhere. Reload this page before editing.' }

export function App() {
  const list = useProjectList()
  const [slug, setSlug] = useLocal('project', 'mbeya-gold-plant')
  const [tab, setTab] = useLocal<Tab>('tab', 'overview')
  const { project, error, save, update } = useProject(slug)
  const model = useMemo(() => (project ? projectModel(project) : null), [project])

  // Only the proposal prints, so switch to it first and let it render.
  const exportPdf = useCallback(() => {
    setTab('proposal')
    window.setTimeout(() => {
      const before = document.title
      if (project) document.title = `${project.meta.name} Proposal ${project.meta.date}`
      window.print()
      document.title = before
    }, 300)
  }, [project, setTab])

  return (
    <div className={`app tab-${tab}`}>
      <header className="topbar no-print">
        <div className="brand">
          <strong>Plant Planner</strong>
          {list.length > 1 ? (
            <select aria-label="Project" value={slug} onChange={e => setSlug(e.target.value)}>
              {list.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
            </select>
          ) : (
            <span className="muted">{project?.meta.name}</span>
          )}
        </div>
        <nav className="tabs">
          {TABS.map(t => (
            <button key={t.id} className={t.id === tab ? 'on' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </nav>
        <div className={`save save-${save}`}>{SAVE_TEXT[save]}</div>
        <button className="btn primary small" onClick={exportPdf} disabled={!project}>Export PDF</button>
      </header>

      <main className="main">
        {error && <Missing slug={slug} error={error} />}
        {project && model && (
          <>
            {tab === 'overview' && <Overview project={project} model={model} update={update} />}
            {tab === 'budget' && <Budget project={project} model={model} update={update} />}
            {tab === 'expenses' && <Expenses project={project} model={model} update={update} />}
            {tab === 'schedule' && <Schedule project={project} model={model} update={update} />}
            {tab === 'cashflow' && <Cashflow project={project} model={model} update={update} />}
            {tab === 'plant' && <Plant project={project} model={model} />}
            {tab === 'map' && <MapView />}
            {tab === 'proposal' && <Proposal project={project} model={model} update={update} onExport={exportPdf} />}
          </>
        )}
      </main>

      {tab !== 'proposal' && (
        <div className="print-only print-blocked">
          Only the proposal prints. Open the Proposal tab and use Export PDF.
        </div>
      )}
    </div>
  )
}

function Missing({ slug, error }: { slug: string; error: string }) {
  return (
    <div className="empty">
      <h2>No project file</h2>
      <p>{error}</p>
      <p className="muted">
        Projects live in <code>projects/plant-planner/data/{slug}.json</code>. That folder is gitignored because it
        holds supplier costs and commission, so a fresh clone starts empty. Copy the file in from your backup.
      </p>
    </div>
  )
}
