import type { GuideSection } from './index'

/**
 * Guide section for the pneumatic rock drill page: electric vs pneumatic
 * running cost. Air figures match this page and /equipment/air-compressor-mining
 * (0.12–0.15 kW per cfm at 7 bar; leaks 20–30%). The four-drill example is
 * derived from those ranges.
 */

export const sections: GuideSection[] = [
  {
    id: 'electric-vs-pneumatic',
    title: 'Electric or Pneumatic Rock Drills: Comparing Running Cost',
    html: `<p>Most small underground mines in Tanzania drill with pneumatic jacklegs, and the drill itself is rarely the expensive part. The cost sits in the compressed air. Turning diesel or electricity into compressed air and sending it down a long pipe loses a large share of the energy, so an operation that runs several drills pays mainly for its compressor and its leaks. Electric and hydraulic handheld drills avoid that conversion, which is why operators ask whether they would be cheaper to run.</p>
<p>The air demand shows the scale. A jackleg needs about 100–150 cfm at 6–7 bar, and four drills working together need about 500–600 cfm once leakage and simultaneous use are included. A compressor typically needs roughly 0.12–0.15 kW for each cfm at 7 bar, so that duty takes about 60–90 kW of compressor power. On a system that has never been checked for leaks, 20–30% of that output can be lost before it reaches the face.</p>
<div class="eq-tablewrap"><table class="eq-table">
<thead><tr><th></th><th>Pneumatic jackleg</th><th>Electric or hydraulic handheld drill</th></tr></thead>
<tbody>
<tr><td>Energy route</td><td>Fuel or grid → compressor → air line → drill</td><td>Grid or generator → cable → drill (or power pack)</td></tr>
<tr><td>Main running cost</td><td>Compressor fuel or power, leaks, air-line oil</td><td>Electricity, cables, drill servicing</td></tr>
<tr><td>Strengths</td><td>Simple, robust, widely known and repaired locally</td><td>Avoids compressor losses; quieter at the face on some models</td></tr>
<tr><td>Limits</td><td>Inefficient energy use; noise; depends on a well-sized compressor</td><td>Needs safe power at the face, suitable ratings for wet or gassy conditions, local parts and trained repairers</td></tr>
</tbody>
</table></div>
<p>For most small mines, the quickest saving is not a new drill type but a better air system: fix leaks, keep pipe losses low and match the <a href="/equipment/air-compressor-mining">compressor</a> to the drills actually in use. An electric drill becomes worth a trial where reliable power can be brought safely to the face, the mine plans to drill for years rather than months and a supplier can support the machine locally. Compare the two on the same basis: energy cost per metre drilled, maintenance, downtime and the training the crew needs, measured on a trial rather than taken from a brochure.</p>`,
  },
]
