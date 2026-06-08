export const PHASES = [
  { k: 'PHASE 01', t: 'Discover', items: ['Geological & geochemical surveys', 'Geophysical sampling', 'Structural mapping', 'Resource estimation'], deliver: 'Geological model · JORC report' },
  { k: 'PHASE 02', t: 'Define',   items: ['Pre-feasibility & feasibility', 'Mine design', 'Environmental baseline', 'Social baseline studies'], deliver: 'Financial model · ESIA · baselines' },
  { k: 'PHASE 03', t: 'Build',    items: ['Equipment procurement', 'Safety system rollout', 'Workforce recruitment & training', 'Community programs'], deliver: 'Commissioned plant · trained crew' },
  { k: 'PHASE 04', t: 'Operate & Close', items: ['Production advisory', 'Safety audits', 'Environmental monitoring', 'Rehabilitation & post-closure'], deliver: 'Rehab · water monitoring · transition' },
] as const
