import type { GuideSection } from './index'

/**
 * Guide sections for the CIP/CIL plant page.
 *
 * Intent split (Search Console, Sep 2026): this page owns plant design,
 * sizing and tank maintenance ("cip plant", "cip plant design", "gold cip
 * tank maintenance"). The comparison query "difference between cip and cil"
 * belongs to /insights/cil-vs-cip-vs-heap-leach, so this page gives a
 * two-line definition and links there rather than competing for it.
 *
 * Sizing figures match /insights/small-cip-plant-guide (50 t/day, 45%
 * solids, 24 h ≈ 90 m³ with freeboard).
 */

const tank = (x: number, y: number, label: string, carbon: boolean) =>
  `<rect x="${x}" y="${y}" width="60" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="${carbon ? '.14' : '0'}"/><text x="${x + 30}" y="${y + 36}" font-size="13" font-weight="700">${label}</text>`

const arrow = (x1: number, x2: number, y: number) =>
  `<path d="M${x1} ${y}H${x2}" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/>`

const row = (y: number, title: string, labels: string[], carbonFrom: number) => {
  const xs = labels.map((_, i) => 130 + 72 * i)
  return `<text x="60" y="${y - 12}" font-size="14" font-weight="700">${title}</text>
<rect x="10" y="${y}" width="100" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
<text x="60" y="${y + 27}" font-size="13">Milled ore</text><text x="60" y="${y + 44}" font-size="13">slurry</text>
${arrow(110, 126, y + 30)}
${labels.map((l, i) => tank(xs[i], y, l, i >= carbonFrom)).join('')}
${xs.slice(0, -1).map(x => arrow(x + 60, x + 70, y + 30)).join('')}
${arrow(550, 576, y + 30)}
<rect x="580" y="${y}" width="130" height="60" rx="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
<text x="645" y="${y + 27}" font-size="13">To tailings</text><text x="645" y="${y + 44}" font-size="12.5" opacity=".75">detox + TSF</text>
<path d="M540 ${y + 78}H${xs[carbonFrom] + 10}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#cip-arrow)"/>
<text x="${(540 + xs[carbonFrom]) / 2 + 5}" y="${y + 96}" font-size="12.5" opacity=".75">carbon moves counter-current</text>
<path d="M${xs[carbonFrom] + 30} ${y}V${y - 24}" stroke="currentColor" stroke-width="1.5" marker-end="url(#cip-arrow)"/>
<text x="${xs[carbonFrom] + 42}" y="${y - 12}" font-size="12.5" text-anchor="start" opacity=".75">loaded carbon → elution</text>`
}

const tankTrain = `<figure class="eq-figure">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="cip-train-title cip-train-desc" style="width:100%;height:auto;display:block">
<title id="cip-train-title">CIL and CIP tank trains compared</title>
<desc id="cip-train-desc">In CIL, milled ore slurry flows through six tanks that all contain carbon, so leaching and adsorption happen together. In CIP, the first three tanks leach without carbon and the last three adsorb gold onto carbon. In both, carbon is pumped against the slurry flow and loaded carbon leaves from the first carbon tank to elution.</desc>
<defs><marker id="cip-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<g font-family="inherit" text-anchor="middle" fill="currentColor">
${row(50, 'CIL', ['1', '2', '3', '4', '5', '6'], 0)}
${row(220, 'CIP', ['L1', 'L2', 'L3', 'A1', 'A2', 'A3'], 3)}
</g>
</svg>
<figcaption>Shaded tanks hold activated carbon. CIL (top) leaches and adsorbs in every tank. CIP (bottom) leaches first in L1–L3, then adsorbs in A1–A3. Tank count and residence time come from test work on your ore.</figcaption>
</figure>`

export const sections: GuideSection[] = [
  {
    id: 'how-it-works',
    title: 'How a CIP or CIL Gold Plant Works',
    html: `<p>A CIP or CIL plant recovers gold that is too fine for gravity. Ore is milled to a fine slurry, gold is dissolved with dilute sodium cyanide in a train of agitated tanks, and the dissolved gold is captured on granules of activated carbon. The loaded carbon is then stripped in an <a href="/equipment/gold-elution-electrowinning-plant">elution and electrowinning plant</a>.</p>
${tankTrain}
<p><strong>CIL</strong> (carbon in leach) puts carbon in every tank, so gold is adsorbed as soon as it dissolves. <strong>CIP</strong> (carbon in pulp) leaches first, then adsorbs in a separate set of tanks. For the full comparison, including recovery, capital cost, preg-robbing ore and heap leach, see <a href="/insights/cil-vs-cip-vs-heap-leach">the difference between CIP and CIL</a>.</p>
<p>A complete circuit, from ore to gold, includes:</p>
<ol>
<li><strong>Crushing and milling</strong> to about 80% passing 75–150 µm, with a <a href="/equipment/centrifugal-gold-concentrator">centrifugal concentrator</a> in the mill circuit to take out coarse gold first.</li>
<li><strong>Thickening</strong> to 40–50% solids, which sets tank volume and cyanide use.</li>
<li><strong>Leach and adsorption tanks</strong>, 5–8 <a href="/equipment/leaching-tank">agitated tanks</a> in series, with lime for pH 10.5–11.5 and air or oxygen for 6–10 ppm dissolved oxygen.</li>
<li><strong>Interstage screens</strong> that keep carbon in each tank while slurry flows on.</li>
<li><strong>Carbon transfer</strong>, pumping carbon upstream against the slurry so the richest carbon meets the richest solution.</li>
<li><strong>Elution, electrowinning and regeneration</strong> to recover gold and reactivate the carbon.</li>
<li><strong>Cyanide detoxification and a lined tailings storage facility.</strong></li>
</ol>`,
  },
  {
    id: 'plant-design',
    title: 'CIP Plant Design: The Numbers That Size the Plant',
    html: `<p>Every CIP or CIL plant design is built on a few parameters. All of them should come from test work on your ore (see <a href="/insights/plant-test-work-guide">test work before you buy a plant</a>), not from a catalogue.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3">
<caption class="eq-caption">Core CIP/CIL design parameters</caption>
<thead><tr><th scope="col">Parameter</th><th scope="col">Typical range</th><th scope="col">What it decides</th></tr></thead>
<tbody>
<tr><th scope="row">Grind size</th><td>80% passing 75–150 µm</td><td>Gold liberation and recovery; mill power</td></tr>
<tr><th scope="row">Leach residence time</th><td>18–36 h total</td><td>Total tank volume</td></tr>
<tr><th scope="row">Slurry density</th><td>40–50% solids</td><td>Slurry volume per tonne; agitation power</td></tr>
<tr><th scope="row">Cyanide</th><td>150–500 ppm NaCN</td><td>Leach rate and reagent cost</td></tr>
<tr><th scope="row">pH</th><td>10.5–11.5 (lime)</td><td>Cyanide stability; keeps HCN gas from forming</td></tr>
<tr><th scope="row">Dissolved oxygen</th><td>6–10 ppm</td><td>Leach rate; air or oxygen supply</td></tr>
<tr><th scope="row">Carbon concentration</th><td>10–25 g/L of pulp</td><td>Adsorption rate and carbon inventory</td></tr>
<tr><th scope="row">Number of tanks</th><td>5–8</td><td>Carbon staging and short-circuiting risk</td></tr>
<tr><th scope="row">Interstage screen aperture</th><td>0.6–0.8 mm</td><td>Carbon retention; must pass slurry, hold carbon</td></tr>
</tbody></table></div>
<h3>Sizing the tank train: a worked example</h3>
<p>Total tank volume = slurry volume per hour × residence time, plus freeboard. Slurry volume per day is the ore volume (tonnes ÷ ore density) plus the water carried at the target solids density. The table assumes ore density 2.7 t/m³, 45% solids, 24 hours residence, 10% freeboard and six equal tanks:</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3">
<caption class="eq-caption">Worked example: tank volume by plant throughput</caption>
<thead><tr><th scope="col">Plant throughput</th><th scope="col">Total tank volume</th><th scope="col">Six tanks of about</th></tr></thead>
<tbody>
<tr><th scope="row">50 t/day</th><td>≈ 90 m³</td><td>15 m³ each</td></tr>
<tr><th scope="row">100 t/day</th><td>≈ 175 m³</td><td>29 m³ each</td></tr>
<tr><th scope="row">250 t/day</th><td>≈ 440 m³</td><td>73 m³ each</td></tr>
<tr><th scope="row">500 t/day</th><td>≈ 875 m³</td><td>146 m³ each</td></tr>
</tbody></table></div>
<p>Double the residence time and the volume doubles; run at 40% solids instead of 45% and it rises by about 17%. Carbon advanced from the train each day sets the elution batch. See <a href="/equipment/gold-elution-electrowinning-plant#batch-sizing">sizing the carbon batch</a>. For a small-plant view of the same calculation, including consumables per tonne, read the <a href="/insights/small-cip-plant-guide">small CIP and CIL plant guide</a>.</p>`,
  },
  {
    id: 'tank-maintenance',
    title: 'Gold CIP Tank Maintenance: What Fails and How to Catch It',
    html: `<p>The maintenance schedule further down the page gives routine intervals. This section covers the failures that quietly cost recovery in a CIP or CIL tank train, and the check that catches each one early.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3">
<caption class="eq-caption">CIP/CIL tank train: common failures</caption>
<thead><tr><th scope="col">Failure</th><th scope="col">Symptom</th><th scope="col">Check</th></tr></thead>
<tbody>
<tr><th scope="row">Interstage screen blinding</th><td>Tank level rising, slurry overflowing the launder</td><td>Screen differential level every shift; clean or run the sweep/airlift</td></tr>
<tr><th scope="row">Worn or torn screen</th><td>Carbon found in downstream tanks or tailings; gold lost with fine carbon</td><td>Sieve a tailings sample for carbon daily; inspect wedge-wire panels</td></tr>
<tr><th scope="row">Carbon attrition</th><td>Carbon inventory falling; rising fine carbon in tailings</td><td>Weekly carbon inventory per tank; check agitator speed and transfer pump type</td></tr>
<tr><th scope="row">Low carbon activity</th><td>Solution gold rising in the last tanks at steady feed</td><td>Activity test on carbon samples; regeneration kiln performance</td></tr>
<tr><th scope="row">Agitator wear or failure</th><td>Sanding in the tank bottom, short-circuiting, lower recovery</td><td>Motor current trend, gearbox oil, impeller and shaft wear at shutdowns</td></tr>
<tr><th scope="row">Lime scaling</th><td>Scale on screens, pipes and carbon; slower elution</td><td>pH control stability; acid wash results on carbon</td></tr>
<tr><th scope="row">Low dissolved oxygen</th><td>Slower leach, gold left in tailings</td><td>DO meter per tank; air sparger and blower condition</td></tr>
<tr><th scope="row">Liner or shell corrosion</th><td>Leaks, weeping welds, stained plinths</td><td>Annual internal inspection; containment bund condition</td></tr>
</tbody></table></div>
<div class="art-callout"><strong>Tank entry is a cyanide job.</strong> Before anyone enters a tank for inspection or relining, it must be drained, washed out, neutralised and tested for HCN gas, with a permit-to-work, gas monitors and a standby person. Most tank maintenance incidents happen here, not in normal operation.</div>`,
  },
]
