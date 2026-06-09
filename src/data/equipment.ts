export const EQUIP = [
  { ic: 'centrifuge', t: 'Centrifugal Gold Concentrators', d: 'Gravity recovery of fine gold without chemicals - Knelson / Falcon class.', apps: ['Alluvial gold', 'Hard-rock gold', 'Tailings recovery'] },
  { ic: 'elution',    t: 'Elution & Electrowinning Plants', d: 'Advanced recovery that extracts gold from loaded activated carbon.', apps: ['CIL plants', 'CIP plants', 'Gold refining circuits'] },
  { ic: 'cil',        t: 'Carbon-in-Leach (CIL) Systems', d: 'Continuous leach-and-adsorb circuits engineered for high gold recovery.', apps: ['Gold processing', 'High-throughput plants', 'Refractory pre-treatment'] },
  { ic: 'cil',        t: 'Carbon-in-Pulp (CIP) Systems', d: 'Robust adsorption circuits for clarified, pre-leached slurries.', apps: ['Gold processing', 'Clarified feeds', 'Modular circuits'] },
  { ic: 'modular',    t: 'Modular Gold Processing Plants', d: 'Containerised, skid-mounted systems for rapid remote deployment.', apps: ['Remote projects', 'Pilot plants', 'Small-to-medium ops'] },
  { ic: 'hpgr',       t: 'High-Pressure Grinding Rolls', d: 'Energy-efficient comminution ahead of the recovery circuit.', apps: ['Hard-rock comminution', 'Energy reduction', 'Pre-concentration'] },
  { ic: 'thickener',  t: 'Thickener & Clarifier Systems', d: 'Separate solids from liquids and recover precious process water.', apps: ['Water recycling', 'Tailings management', 'Concentrate handling'] },
  { ic: 'dewater',    t: 'Tailings Dewatering Filters', d: 'Filter-press dewatering for safer, drier tailings management.', apps: ['Dry-stack tailings', 'Water recovery', 'Closure-ready storage'] },
] as const
