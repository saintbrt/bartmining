export const SERVICES = [
  {
    n: '01', ic: 'survey', t: 'Geological Survey',
    d: 'Site assessment and geological evaluation - from first mapping to a defensible resource estimate.',
    long: 'We characterise the ground before anyone commits capital: structured mapping, disciplined sampling and resource estimation that survives third-party due diligence.',
    includes: ['Geological mapping', 'Core sampling', 'Resource estimation', 'JORC-compliant reporting'],
    tags: ['Mapping', 'Sampling', 'JORC Reporting'],
  },
  {
    n: '02', ic: 'explore', t: 'Exploration',
    d: 'Mineral discovery and resource-development programs: prospecting, targeting, drilling, definition.',
    long: 'Operator-led exploration that moves from a hunch to a defined resource - designing the right program, drilling it efficiently, and modelling what the data actually says.',
    includes: ['Prospecting programs', 'Target identification', 'Drilling campaigns', 'Resource definition'],
    tags: ['Prospecting', 'Drilling', 'Modelling'],
  },
  {
    n: '03', ic: 'plan', t: 'Mine Planning & Design',
    d: 'Feasibility, open-pit and underground design, development roadmaps and closure planning.',
    long: 'Strategic planning and engineering support that treats closure as a day-one decision, not an afterthought - so the plan is fundable and the mine is buildable.',
    includes: ['Feasibility studies', 'Open-pit design', 'Underground mine design', 'Development roadmaps', 'Closure planning'],
    tags: ['Feasibility', 'Scheduling', 'Closure'],
  },
  {
    n: '04', ic: 'machine', t: 'Mining Machinery & Processing Plants',
    d: 'From exploration support equipment to complete gold-recovery systems - sourced, supplied and commissioned to your site conditions and production targets.',
    long: 'We specify, procure and commission specialised mineral-processing machinery - matching equipment to ore characteristics, throughput and remoteness, then standing it up on site.',
    includes: ['Specification & sizing', 'Procurement & logistics', 'Installation & commissioning', 'Operator handover'],
    tags: ['Gold Recovery', 'Processing Plants', 'Commissioning'],
  },
  {
    n: '05', ic: 'safety', t: 'Safety Equipment & Gear',
    d: 'PPE, gas detection, self-rescuers, fall-arrest systems and underground refuge chambers.',
    long: 'Mining safety systems and protective equipment - supplied, installed and audited. Safety corners cut: zero, always.',
    includes: ['Personal protective equipment', 'Gas detection systems', 'Self-rescuers', 'Fall arrest systems', 'Underground refuge chambers'],
    tags: ['PPE', 'Gas Detection', 'Rescue'],
  },
] as const
