import type { GuideSection } from './index'

/**
 * Guide sections for the centrifugal concentrator page, written for the
 * queries Search Console shows: "centrifugal concentrator gold recovery",
 * "gold recovery with centrifugal gravity concentrator", "centrifuge for
 * gold recovery", "centrifugal gold separator".
 *
 * Mercury replacement and gravity vs cyanide are owned by the insights
 * articles (mercury-free-gold-recovery, gravity-vs-cyanide-gold-recovery);
 * link to them, do not repeat them. Figures match the spec tables of this
 * page and of /equipment/shaking-table-gold.
 */

const bowl = `<figure class="eq-figure">
<svg viewBox="0 0 720 370" role="img" aria-labelledby="ccon-title ccon-desc" style="width:100%;height:auto;display:block">
<title id="ccon-title">How a centrifugal gold concentrator works</title>
<desc id="ccon-desc">Slurry is fed down a central pipe into the base of a spinning conical bowl. Centrifugal force drives the slurry up the bowl walls, where dense gold particles are trapped in concentrate rings. Fluidisation water is injected through the bowl wall from an outer jacket to keep the bed loose, and lighter material overflows the top rim as tailings.</desc>
<defs><marker id="ccon-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<g font-family="inherit" fill="currentColor" font-size="13">
<path d="M175 310 L122 90 M545 310 L598 90 M175 310 H545" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" fill="none"/>
<path d="M200 300 L150 90 M520 300 L570 90 M200 300 H520" stroke="currentColor" stroke-width="2.5" fill="none"/>
<g stroke="currentColor" stroke-width="3">
<path d="M159.5 130 h24"/><path d="M169 170 h24"/><path d="M178.5 210 h24"/><path d="M188 250 h24"/>
<path d="M560.5 130 h-24"/><path d="M551 170 h-24"/><path d="M541.5 210 h-24"/><path d="M532 250 h-24"/>
</g>
<rect x="350" y="12" width="20" height="236" rx="3" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.5"/>
<g stroke="currentColor" stroke-width="1.5" fill="none" marker-end="url(#ccon-arrow)">
<path d="M360 250 V284"/>
<path d="M232 286 L196 116"/><path d="M488 286 L524 116"/>
<path d="M150 88 L112 58"/><path d="M570 88 L608 58"/>
<path d="M78 196 H146"/><path d="M642 196 H574"/>
<path d="M300 336 A60 12 0 0 0 420 336"/>
</g>
<text x="380" y="30">feed slurry</text>
<text x="96" y="44" text-anchor="middle">tailings overflow</text>
<text x="624" y="44" text-anchor="middle">tailings overflow</text>
<text x="70" y="226" text-anchor="middle">fluidisation</text><text x="70" y="243" text-anchor="middle">water</text>
<text x="650" y="226" text-anchor="middle">fluidisation</text><text x="650" y="243" text-anchor="middle">water</text>
<text x="240" y="232">gold held</text><text x="240" y="249">in rings</text>
<text x="360" y="362" text-anchor="middle">bowl spins at 60–200 G</text>
</g>
</svg>
<figcaption>Cross-section of a centrifugal concentrator bowl. Concentrate builds up in the rings during a cycle and is flushed out when the bowl stops (batch units) or bled off continuously (continuous units).</figcaption>
</figure>`

export const sections: GuideSection[] = [
  {
    id: 'how-it-works',
    title: 'How a Centrifugal Gold Concentrator Works',
    html: `<p>Gold is roughly seven times denser than the quartz and silicate rock around it. Under ordinary gravity, a fine gold particle settles too slowly to separate cleanly from the slurry. A centrifugal concentrator multiplies the effective gravity 60–200 times, so even fine gold separates by density in seconds.</p>
${bowl}
<ol>
<li><strong>Feed.</strong> Screened slurry (usually below 2 mm) enters through a central pipe and reaches the base of the spinning bowl.</li>
<li><strong>Stratification.</strong> Centrifugal force drives the slurry outwards and up the bowl wall. Dense particles, gold and heavy minerals, push into the rings (riffles) cut into the wall.</li>
<li><strong>Fluidisation.</strong> Clean water is injected through small holes in the rings from a jacket around the bowl. It keeps the concentrate bed loose, so heavy gold can displace lighter particles instead of the rings packing solid with sand.</li>
<li><strong>Tailings.</strong> Light material rides over the rings and overflows the top rim.</li>
<li><strong>Concentrate discharge.</strong> A batch unit stops on a timer and flushes the rings into a concentrate launder. A continuous unit bleeds concentrate through valves without stopping.</li>
</ol>
<p>The concentrate is typically 500 to 2,000 times smaller in mass than the feed, but still contains heavy sands and sulphides. It is usually cleaned on a <a href="/equipment/shaking-table-gold">shaking table</a> before smelting. See below.</p>`,
  },
  {
    id: 'recovery-by-size',
    title: 'Gold Recovery by Particle Size',
    html: `<p>A centrifugal concentrator can only recover gold that is <strong>liberated</strong>, meaning free of the rock around it, and in the size range the bowl can hold. Recovery on liberated gold is typically 85–98%, but it varies with particle size:</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3">
<caption class="eq-caption">Indicative recovery on liberated gold by particle size</caption>
<thead><tr><th scope="col">Gold particle size</th><th scope="col">Centrifugal concentrator</th><th scope="col">What to watch</th></tr></thead>
<tbody>
<tr><th scope="row">Above 2 mm</th><td>Not fed; screened out</td><td>Oversize blocks fluidisation holes. Recover coarse nuggets on a screen, sluice or jig first.</td></tr>
<tr><th scope="row">150 µm – 2 mm</th><td>High</td><td>The strongest range; flaky gold recovers less well than rounded grains.</td></tr>
<tr><th scope="row">38 – 150 µm</th><td>High</td><td>Where a concentrator clearly beats sluices and tables.</td></tr>
<tr><th scope="row">20 – 38 µm</th><td>Moderate, falling</td><td>Needs correct G-force and fluidisation water; slimes reduce it.</td></tr>
<tr><th scope="row">Below 20 µm</th><td>Low</td><td>Behaves with the water, not by density. Recover by leaching instead.</td></tr>
</tbody></table></div>
<p>Two practical consequences follow:</p>
<ul>
<li><strong>Grind decides recovery more than the machine does.</strong> Gold still locked inside rock particles goes to tailings regardless of settings. Grinding finer in a <a href="/equipment/ball-mill-gold-ore">ball mill</a> liberates more gold, at a power cost.</li>
<li><strong>Test before you buy.</strong> A gravity recoverable gold (GRG) test on your ore shows how much of the gold a concentrator can catch at a given grind. The rest needs a leach circuit. See the <a href="/insights/plant-test-work-guide">test work guide</a> and <a href="/insights/gravity-vs-cyanide-gold-recovery">gravity vs cyanide recovery</a>.</li>
</ul>`,
  },
  {
    id: 'vs-shaking-table',
    title: 'Centrifugal Concentrator vs Shaking Table',
    html: `<p>The two machines are usually partners, not rivals. The concentrator does the heavy lifting on volume; the table cleans its concentrate to a grade that can be smelted.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3">
<caption class="eq-caption">Centrifugal concentrator vs shaking table</caption>
<thead><tr><th scope="col"></th><th scope="col">Centrifugal concentrator</th><th scope="col">Shaking table</th></tr></thead>
<tbody>
<tr><th scope="row">Separating force</th><td>60–200 G</td><td>Normal gravity plus deck motion and wash water</td></tr>
<tr><th scope="row">Throughput</th><td>0.5–100 t/h by bowl size</td><td>0.3–1.5 t/h on a full-size deck</td></tr>
<tr><th scope="row">Fine gold</th><td>Recovers down to about 20 µm</td><td>Loses much gold below about 45 µm</td></tr>
<tr><th scope="row">Recovery on liberated gold</th><td>85–98%</td><td>60–90%, depending on desliming</td></tr>
<tr><th scope="row">Concentrate</th><td>Large mass reduction (500–2,000:1) but still contains heavy sands</td><td>High grade, often directly smeltable</td></tr>
<tr><th scope="row">Operator skill</th><td>Low once water pressure and cycle time are set</td><td>High; slope, stroke and water need constant attention</td></tr>
<tr><th scope="row">Security</th><td>Concentrate enclosed in the bowl</td><td>Gold visible on an open deck</td></tr>
<tr><th scope="row">Best role</th><td>Primary gravity recovery on the full stream</td><td>Cleaning concentrate; small alluvial plants</td></tr>
</tbody></table></div>
<p>A typical mercury-free circuit on a small Tanzanian plant runs <strong>crusher → ball mill → concentrator → shaking table → smelting</strong>, with the concentrator tailings going to a leach circuit or storage. The full circuit and the case for replacing amalgamation are covered in <a href="/insights/mercury-free-gold-recovery">mercury-free gold recovery</a>.</p>`,
  },
  {
    id: 'installation-sizing',
    title: 'Installing and Sizing a Concentrator',
    html: `<h3>Where it goes in the plant</h3>
<ul>
<li><strong>Hard-rock plants:</strong> on the ball mill discharge or a bleed of the <a href="/equipment/hydrocyclone">hydrocyclone</a> underflow, where liberated gold concentrates in the circulating load. Catching gold here stops it being ground flat and lost.</li>
<li><strong>Alluvial and eluvial plants:</strong> after a <a href="/equipment/trommel-screen">trommel</a> or <a href="/equipment/vibrating-screen">vibrating screen</a> removes oversize and clay balls.</li>
<li><strong>Tailings retreatment:</strong> on repulped old amalgamation tailings, often ahead of <a href="/insights/vat-leaching-tailings">vat leaching</a> or a <a href="/equipment/cil-cip-plant">CIL plant</a>.</li>
</ul>
<h3>Sizing</h3>
<p>Bowl size is chosen on the <strong>tonnes per hour of solids</strong> in the stream it treats, not on plant tonnes per day. Divide daily tonnage by operating hours: a 100 t/day plant running 20 hours treats 5 t/h. If the concentrator only takes a bleed of the mill circuit, size it on that bleed. Undersizing overloads the bowl and washes gold out; oversizing wastes capital and water.</p>
<h3>What makes or breaks recovery on site</h3>
<ul>
<li><strong>Screen the feed.</strong> A screen ahead of the concentrator is not optional; oversize blocks the fluidisation holes.</li>
<li><strong>Clean fluidisation water at steady pressure.</strong> Silty water blocks the holes and quietly lowers recovery over a few shifts. Use a header tank or filter and a pressure regulator.</li>
<li><strong>Cycle time to suit grade.</strong> On batch units, run too long and the rings saturate and start losing gold; too short and you flush more often than needed. Adjust from assays of tailings.</li>
<li><strong>Power supply.</strong> Drives are 1.5–30 kW on 400 V three phase. Size the <a href="/equipment/diesel-generator-mining">generator</a> for the mill, pumps and concentrator together.</li>
<li><strong>Secure the concentrate.</strong> Lock the concentrate outlet and control who flushes the bowl. Concentrate is the most valuable, most easily stolen material in the plant.</li>
</ul>`,
  },
]
