import type { GuideSection } from './index'

/**
 * Guide sections for the filter press page: dry-stacked tailings and a
 * sizing worked example. Cake moisture and cycle times match this page's
 * specification table; the 50 t/day mass balance uses labelled assumptions.
 * Dry stacking is presented as an option, not a legal requirement.
 */

export const sections: GuideSection[] = [
  {
    id: 'dry-stacking',
    title: 'Filter Presses and Dry-Stacked Tailings',
    html: `<p>Most small gold plants send tailings to a wet pond, where the solids settle and the water is reused or evaporates. Dry stacking takes a different route: a filter press removes most of the water first, and the damp cake is stacked and compacted on a prepared area. The plant recovers more water for reuse and avoids holding a large volume of slurry behind an embankment.</p>
<p>Dry stacking suits sites where water is scarce, where there is little room or poor ground for a pond, or where the operator wants to reduce the risk that comes with storing liquid tailings. It costs more to build and run than a simple pond, because the press, its pump, cloths and power must operate every day, and the stack still needs drainage, compaction and control of rain runoff. In Tanzania, tailings management is approved through the project’s environmental impact assessment and plans, so discuss the option with your environmental consultant and <a href="https://www.nemc.or.tz/">NEMC</a> early rather than after the plant is designed.</p>`,
  },
  {
    id: 'sizing-example',
    title: 'Sizing a Filter Press for Tailings: A Worked Example',
    html: `<p>A press is sized from the dry solids it must handle each day, the cake moisture it can reach and its cycle time. The example below uses assumed figures to show the order of the calculation; a filtration test on your actual tailings sets the real cycle time and moisture.</p>
<ol>
<li><strong>Solids.</strong> Assume the plant produces 50 tonnes of dry tailings solids per day.</li>
<li><strong>Cake.</strong> At an assumed 15% cake moisture, the press produces about 50 ÷ 0.85 = 59 tonnes of wet cake per day.</li>
<li><strong>Water recovered.</strong> If the tailings slurry is an assumed 40% solids by mass, it carries 75 m³ of water a day. The cake keeps about 9 m³, so the press returns roughly 66 m³ a day to the process.</li>
<li><strong>Cycles.</strong> With an assumed 60-minute filtration cycle plus 20 minutes to open, discharge and close, a press running 20 hours completes about 15 cycles a day.</li>
<li><strong>Volume per cycle.</strong> Each cycle must hold about 59 ÷ 15 = 3.9 tonnes of cake. At an assumed cake density of 1.9 t/m³, that is about 2 m³ of chamber volume, which the supplier converts into a plate size and number of plates.</li>
</ol>
<p>The same steps apply to concentrate or elution residues on a much smaller scale. For a quotation, send the dry tonnes per day, the slurry density, a particle-size result for the tailings and the hours the press will run, and ask the supplier to confirm cycle time and cake moisture from a filtration test before you commit.</p>`,
  },
]
