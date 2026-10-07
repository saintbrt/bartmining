import type { GuideSection } from './index'

/**
 * Guide sections for the leaching tank page, written for the maintenance and
 * inspection queries Search Console shows ("gold cip tank maintenance",
 * "gold agitator maintenance", "gold mine leach tank inspections").
 *
 * The routine interval table is already rendered from the catalogue's
 * `maintenance` data, so these sections explain why the checks matter, how
 * a planned internal inspection runs and how to read early warning signs.
 * No chemical dosing or detoxification settings: those belong to the plant's
 * own process and safety procedures.
 */

export const sections: GuideSection[] = [
  {
    id: 'why-maintenance-matters',
    title: 'What Maintenance Protects in a CIP or CIL Tank Train',
    html: `<p>A leach train recovers gold only while every tank keeps its slurry suspended, its carbon in place and its air supply working. Most problems in a small CIP or CIL plant start as a quiet loss rather than a breakdown: an interstage screen that lets fine carbon escape to tailings, a worn impeller that lets solids settle in one corner, or sanded launders that send slurry around a tank instead of through it. Each one lowers recovery for weeks before anyone sees it in the gold produced.</p>
<p>Routine maintenance therefore has three jobs. It keeps the agitators and screens doing their duty every shift. It finds wear in the lining, impellers and air lines before they fail. And it produces records, so that a fall in recovery can be traced to a cause instead of being blamed on the ore. The interval table further down this page lists the routine checks; the sections below explain how to run a planned internal inspection and what to watch between shutdowns. For the wider process, see the <a href="/equipment/cil-cip-plant">CIL and CIP plant guide</a>.</p>`,
  },
  {
    id: 'planned-inspection',
    title: 'How to Run a Planned Leach Tank Inspection',
    html: `<p>An internal inspection means taking one tank out of the train, emptying it and sending people inside. That combines a confined space, residual process chemicals and heavy rotating equipment, so it must follow the plant’s written safety procedures and permits. The sequence below shows the order of work a plant manager should plan around; it does not replace those procedures or the chemical handling rules set by your process designer.</p>
<ol>
<li><strong>Plan the bypass.</strong> Decide how slurry will flow around the tank while it is out of service, and how the carbon it holds will be moved to the next tank so it is not lost or left unaccounted for.</li>
<li><strong>Isolate the energy.</strong> Lock out the agitator drive, air supply and any pumps, and record who holds each lock.</li>
<li><strong>Empty and wash down.</strong> Drain the slurry to an approved destination and wash the tank according to the decontamination procedure, so no settled residue remains on the floor.</li>
<li><strong>Test the atmosphere.</strong> A competent person tests the air inside before anyone enters and keeps monitoring during the work, using a <a href="/equipment/gas-detection-monitor">gas detector</a> fitted with the sensors your procedure specifies, including one for hydrogen cyanide where the process requires it.</li>
<li><strong>Inspect and record.</strong> Check each item in the list below, photograph or sketch defects, and measure wear where possible so the next inspection can compare results.</li>
<li><strong>Repair, then return to service.</strong> Replace worn parts, repair lining damage and allow any coating to cure as the manufacturer requires. Restart the agitator before filling the tank fully with slurry, then confirm suspension and screen flow over the first shift.</li>
</ol>
<p>Inside the tank, the inspection should cover:</p>
<ul>
<li>Impeller blades and the shaft, for wear, cracking and loss of balance.</li>
<li>The lining at the slurry line and around the floor, where abrasion and corrosion concentrate.</li>
<li>The interstage screen mesh and its seals, for holes or gaps that would let carbon pass.</li>
<li>Air sparging pipes and nozzles, for blockage or breakage.</li>
<li>Baffles, the tank floor and the inlet and outlet launders, for sanding, cracks and leaks.</li>
</ul>
<p>Plan the shutdown when the tank train can spare one tank, and keep spare impellers, screen mesh and lining repair materials on site beforehand. A tank that waits two weeks for a part keeps the whole train running short.</p>`,
  },
  {
    id: 'warning-signs',
    title: 'Early Warning Signs Between Shutdowns',
    html: `<p>Operators see most developing problems before an inspection does, provided they know what to look for. The table connects common signs to their usual causes and the first action to take. Treat it as a starting point for fault-finding: when a sign persists, confirm the cause with the plant metallurgist or the equipment supplier.</p>
<div class="eq-tablewrap"><table class="eq-table">
<thead><tr><th>What the operator sees</th><th>Likely cause</th><th>First action</th></tr></thead>
<tbody>
<tr><td>Fine carbon in the tailings sample or on the tailings screen</td><td>Torn interstage screen or worn seal</td><td>Check the screen on that tank and the carbon inventory; repair before carbon losses grow</td></tr>
<tr><td>Slurry level rising behind one screen</td><td>Screen blinding with grit, wood chips or oversize carbon</td><td>Clean or rotate the screen and check upstream trash screening</td></tr>
<tr><td>Agitator noise or vibration has changed</td><td>Impeller wear, loose blades, bearing or gearbox wear</td><td>Check gearbox oil and bearings; plan an impeller inspection</td></tr>
<tr><td>Coarse sand in launders or a dead zone on the tank surface</td><td>Weak suspension, often from impeller wear or a slurry that is too dense</td><td>Check impeller condition and slurry density against the design</td></tr>
<tr><td>Rust staining or seepage on the outer wall</td><td>Lining failure inside the tank</td><td>Mark the area, monitor it and bring the internal inspection forward</td></tr>
<tr><td>Lower dissolved oxygen readings at the same air flow</td><td>Blocked or broken air spargers</td><td>Inspect the air lines and valves at the next opportunity</td></tr>
</tbody>
</table></div>
<p>The common thread is recording. A daily log of agitator condition, screen checks and carbon movements lets the plant compare this month with last month and act on a trend rather than a single reading. For a first estimate of tank volume, use our <a href="/tools/leach-tank-calculator">leach tank calculator</a>. If you are sizing new tanks or replacing a worn train, send us your tonnage, slurry density and leach test results so the tank volume, agitators and screens can be specified together.</p>`,
  },
]
