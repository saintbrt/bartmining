import { num } from '@/lib/proposals/model'
import { Num, Section, Stat } from '../components/Fields'
import { PageHead, usePackagePick, type ViewProps } from './shared'

export function Schedule({ project, model, update }: ViewProps) {
  const { pkg, index, picker } = usePackagePick(project)
  const m = model.packages[index]
  const total = Math.max(1, Math.ceil(m.weeksToGold))
  const ticks = Array.from({ length: Math.floor(total / 4) + 1 }, (_, k) => k * 4)

  return (
    <div className="page">
      <PageHead title="Schedule" lead="Weeks from down-payment to first gold. Each task starts when the tasks it waits on are finished." right={picker} />

      <div className="stats">
        <Stat label="Weeks to first gold" value={num(m.weeksToGold, 1)} />
        <Stat label="Months to first gold" value={num(m.monthsToGold, 1)} />
        <Stat label="Tasks" value={String(m.schedule.length)} />
      </div>

      <Section title={`${pkg.name} timeline`}>
        <div className="gantt">
          <div className="gantt-row gantt-head">
            <div className="gantt-label" />
            <div className="gantt-weeks">Weeks</div>
            <div className="gantt-track">
              {ticks.map(t => <span key={t} className="tick" style={{ left: `${(t / total) * 100}%` }}>{t}</span>)}
            </div>
          </div>
          {m.schedule.map(t => {
            const task = pkg.schedule.find(x => x.id === t.id)!
            const k = pkg.schedule.indexOf(task)
            return (
              <div className="gantt-row" key={t.id}>
                <div className="gantt-label">
                  {t.label}
                  {task.after.length > 0 && (
                    <span className="cell-note">after {task.after.map(a => pkg.schedule.find(x => x.id === a)?.label ?? a).join(' + ')}</span>
                  )}
                </div>
                <div className="gantt-weeks">
                  <Num label={`${t.label} weeks`} value={task.weeks} width={64} onChange={v => update(p => { p.packages[index].schedule[k].weeks = v })} />
                </div>
                <div className="gantt-track">
                  {ticks.map(w => <span key={w} className="grid-line" style={{ left: `${(w / total) * 100}%` }} />)}
                  <span
                    className={`bar ${t.end === m.weeksToGold ? 'bar-end' : ''}`}
                    style={{ left: `${(t.start / total) * 100}%`, width: `${(t.weeks / total) * 100}%` }}
                    title={`Week ${num(t.start, 1)} to ${num(t.end, 1)}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <p className="hint">Cashflow timing doesn't follow this automatically. If you move the schedule a lot, check the month each payment lands in on the Cashflow tab.</p>
      </Section>
    </div>
  )
}
