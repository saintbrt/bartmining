import type { ProjectModel } from '@/lib/proposals/model'
import type { Update } from '../store'
import type { Project } from '@/lib/proposals/types'
import { Segmented } from '../components/Fields'
import { useLocal } from '../store'

export interface ViewProps { project: Project; model: ProjectModel; update: Update }

/** The option being edited, remembered across tabs. */
export function usePackagePick(project: Project) {
  const [id, setId] = useLocal('package', project.packages[0]?.id ?? '')
  const pkg = project.packages.find(p => p.id === id) ?? project.packages[0]
  const picker = (
    <Segmented
      value={pkg.id}
      options={project.packages.map(p => ({ value: p.id, label: p.short }))}
      onChange={setId}
    />
  )
  return { pkg, index: project.packages.indexOf(pkg), picker }
}

export function PageHead({ title, lead, right }: { title: string; lead?: string; right?: React.ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {right && <div className="page-head-right">{right}</div>}
    </div>
  )
}
