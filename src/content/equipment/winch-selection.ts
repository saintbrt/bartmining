import type { GuideSection } from './index'

/**
 * Shared comparison for the 1, 2 and 5 tonne winch pages. These pages
 * already rank in the top 10 (Search Console, Aug–Oct 2026); the comparison
 * links the three so a reader who lands on the wrong size can move to the
 * right one. Figures match each page's specification table.
 */

export const sections: GuideSection[] = [
  {
    id: 'choosing-winch-size',
    title: 'Choosing Between a 1, 2 and 5 Tonne Winch',
    html: `<p>The right winch depends on the heaviest load it will lift, how deep the shaft is and whether it serves a temporary job or permanent production hoisting. Rated line pull is quoted on the first rope layer. As rope builds up on the drum, the available pull falls, so a winch working near its rating on a deep shaft can struggle when the drum is nearly full. The table compares the three sizes we describe, using the figures on each product page.</p>
<div class="eq-tablewrap"><table class="eq-table">
<thead><tr><th></th><th><a href="/equipment/1-ton-winch">1 tonne</a></th><th><a href="/equipment/2-ton-winch">2 tonne</a></th><th><a href="/equipment/5-ton-mine-winch">5 tonne</a></th></tr></thead>
<tbody>
<tr><td>Rated line pull (first layer)</td><td>1,000 kg</td><td>2,000 kg</td><td>5,000 kg</td></tr>
<tr><td>Typical shaft depth</td><td>Up to about 60 m</td><td>About 60–120 m</td><td>About 120–300 m</td></tr>
<tr><td>Wire rope diameter</td><td>8–11 mm</td><td>11–14 mm</td><td>16–20 mm</td></tr>
<tr><td>Drum rope capacity</td><td>30–120 m</td><td>60–200 m</td><td>150–400 m</td></tr>
<tr><td>Line speed</td><td>8–15 m/min</td><td>7–12 m/min</td><td>15–45 m/min</td></tr>
<tr><td>Motor</td><td>1.5–3.0 kW</td><td>3.0–5.5 kW</td><td>7.5–15 kW</td></tr>
<tr><td>Machine mass</td><td>60–130 kg</td><td>180–350 kg</td><td>900–2,500 kg</td></tr>
<tr><td>Typical role</td><td>Ore buckets on shallow shafts, hauling and positioning</td><td>Deeper shafts, larger buckets, skips on inclines</td><td>Permanent production hoisting with skips or kibbles</td></tr>
</tbody>
</table></div>
<p>To choose, add up everything hanging on the rope at its heaviest moment: the bucket or kibble, the ore inside it and the rope itself between the drum and the bottom of the shaft. The rope supplier gives its mass per metre, and on a deep shaft that weight is significant. Then allow a margin so the winch is not working at its limit on every lift.</p>
<p>As a worked assumption, suppose a kibble weighs 250 kg empty and carries 600 kg of ore. That is 850 kg before the rope is counted. A 1 tonne winch would leave very little margin once the rope is added, especially with the drum nearly full, so a 2 tonne winch is the safer choice for that duty. Replace these figures with your actual bucket weight, fill and shaft depth.</p>
<p>Depth also matters beyond load. A deeper shaft needs more rope on the drum, and a production shaft that hoists all day needs the line speed, braking and inspection regime of a permanent installation rather than a portable winch. Any winch that carries people must be designed, certified and inspected for that purpose, with a much higher rope safety factor than goods hoisting. Confirm the current requirements for your licence with the Mining Commission and OSHA Tanzania before commissioning. For a quotation, send us the shaft depth, the heaviest load including the bucket, how many hours a day it will run and your power supply.</p>`,
  },
]
