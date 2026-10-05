import { num } from '@/lib/proposals/model'
import { FlowControls, FlowDiagram, flowsheetFor, useFlowPlayer } from '../components/FlowDiagram'
import { Section, Stat } from '../components/Fields'
import { useLocal } from '../store'
import { production } from '@/lib/proposals/model'
import { PageHead, usePackagePick, type ViewProps } from './shared'

export function Plant({ project, model }: Omit<ViewProps, 'update'>) {
  const { pkg, index, picker } = usePackagePick(project)
  const m = model.packages[index]
  const fs = flowsheetFor(pkg)
  const player = useFlowPlayer(fs.steps.length)
  const [live, setLive] = useLocal('flowLive', true)
  const out = production(project, pkg.capacity)

  return (
    <div className="page">
      <PageHead title="Plant" lead="How the plant moves gravel from the hopper to the gold room. Press Show ore flow to walk through it." right={picker} />

      <div className="stats">
        <Stat label="Nameplate capacity" value={`${pkg.capacity} m³/h`} />
        <Stat label="Monthly throughput" value={`${num(out.m3)} m³`} note={`${project.production.hoursPerDay} h/day, ${project.production.daysPerMonth} days`} />
        <Stat label="Power" value={pkg.power} />
        <Stat label="First gold" value={`${num(m.monthsToGold, 1)} months`} />
      </div>

      <Section
        title={`${pkg.name}, process flow`}
        aside={
          <label className="check">
            <input type="checkbox" checked={live} onChange={e => setLive(e.target.checked)} /> Animate lines
          </label>
        }
      >
        <FlowControls player={player} flowsheet={fs} />
        <FlowDiagram pkg={pkg} animate={live || player.playing || player.step !== null} step={player.step} />
      </Section>

      <div className="two-col">
        <Section title="The process, step by step">
          <ol className="steps-list">
            {fs.steps.map((s, k) => (
              <li key={s.title} className={player.step === k ? 'on' : ''}>
                <button className="link" onClick={() => player.go(player.step === k ? null : k)}>{s.title}</button>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </Section>
        <Section title="Key figures">
          <table className="grid">
            <tbody>
              {pkg.specs.map(s => <tr key={s.label}><td>{s.label}</td><td>{s.value}</td></tr>)}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  )
}
