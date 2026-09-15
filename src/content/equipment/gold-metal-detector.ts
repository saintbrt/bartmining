import type { GuideSection } from './index'

/**
 * Guide sections for the gold detector page, written for the queries Search
 * Console shows: "pi gold detector" (71), "vlf gold detector" (41),
 * "pulse induction vs vlf" (position 10), "best vlf gold detector".
 *
 * No prices: Bart Mining has not published detector price bands, and
 * invented TSh figures would be worse than none. Quotes go via WhatsApp.
 * Detector types are described generically, not by brand or model.
 */

const box = (x: number, y: number, w: number, lines: string[], strong = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${lines.length * 18 + 22}" rx="8" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="${strong ? '.12' : '0'}"/>` +
  lines.map((l, i) => `<text x="${x + w / 2}" y="${y + 26 + i * 18}" font-size="13.5"${i === 0 && !strong ? ' font-weight="700"' : strong ? ' font-weight="700"' : ''}>${l}</text>`).join('')

const decision = `<figure class="eq-figure">
<svg viewBox="0 0 720 360" role="img" aria-labelledby="det-title det-desc" style="width:100%;height:auto;display:block">
<title id="det-title">Choosing between PI and VLF gold detectors</title>
<desc id="det-desc">If the ground is heavily mineralised, such as red laterite or ironstone, choose a pulse induction detector: a large coil for bigger, deeper nuggets or a smaller coil for smaller gold. If the ground is mild and the gold is mostly small and shallow among trash, choose a high-frequency VLF detector; otherwise a multi-frequency detector is a good all-rounder.</desc>
<defs><marker id="det-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<g font-family="inherit" text-anchor="middle" fill="currentColor">
${box(210, 10, 300, ['Is the ground heavily mineralised?', 'red laterite, ironstone, hot rocks'])}
<g stroke="currentColor" stroke-width="1.5" fill="none" marker-end="url(#det-arrow)">
<path d="M260 68 L150 118"/><path d="M460 68 L570 118"/>
<path d="M100 176 L95 236"/><path d="M220 176 L265 236"/>
<path d="M500 176 L455 236"/><path d="M640 176 L625 236"/>
</g>
<text x="185" y="92" font-size="12.5" opacity=".75">Yes</text><text x="605" y="90" font-size="12.5" opacity=".75">No, mild soil</text>
${box(30, 122, 240, ['Pulse induction (PI)', 'handles mineralisation'])}
${box(450, 122, 240, ['Mostly small gold, shallow,', 'with trash around?'])}
<text x="55" y="210" font-size="12" opacity=".75">big, deep</text><text x="298" y="210" font-size="12" opacity=".75">small gold</text>
<text x="432" y="210" font-size="12" opacity=".75">yes</text><text x="684" y="210" font-size="12" opacity=".75">no / mixed</text>
${box(15, 240, 160, ['PI + large coil', 'depth, bigger nuggets'], true)}
${box(190, 240, 160, ['PI + small mono coil', 'or short pulse delay'], true)}
${box(370, 240, 160, ['High-frequency VLF', '40–71 kHz'], true)}
${box(545, 240, 160, ['Multi-frequency', 'all-round choice'], true)}
</g>
</svg>
<figcaption>Most ground across the Lake Victoria and Lupa goldfields is mineralised, which is why pulse induction is the usual answer in Tanzania. Test on your own ground with a known target before buying.</figcaption>
</figure>`

export const sections: GuideSection[] = [
  {
    id: 'pi-vs-vlf',
    title: 'PI vs VLF Gold Detectors: How They Differ',
    html: `<p>Both kinds of detector send a magnetic field into the ground and listen for the response from metal. They differ in how they do it, and that decides how they cope with mineralised soil.</p>
<ul>
<li><strong>VLF (very low frequency)</strong> detectors transmit a continuous signal, typically 18–71 kHz on gold machines, and measure the phase shift of the return. Higher frequencies are more sensitive to small gold. VLF can <em>discriminate</em>, telling gold from iron trash, but iron-rich soil also produces a strong signal, so depth and stability fall in laterite.</li>
<li><strong>PI (pulse induction)</strong> detectors send short, powerful pulses and listen to the decaying echo after each one. Mineralised ground's signal fades quickly while metal's lingers, so a PI largely ignores the ground. The trade-off is weak discrimination: a PI finds every nail and bullet, and is heavier and more expensive.</li>
<li><strong>Multi-frequency</strong> VLF detectors transmit several frequencies at once, recovering some of the ground tolerance of PI while keeping discrimination. They are a practical all-rounder on moderately mineralised ground.</li>
</ul>
<div class="eq-tablewrap"><table class="eq-table eq-table-3">
<caption class="eq-caption">Pulse induction vs VLF for gold prospecting</caption>
<thead><tr><th scope="col"></th><th scope="col">VLF</th><th scope="col">Pulse induction (PI)</th></tr></thead>
<tbody>
<tr><th scope="row">How it works</th><td>Continuous signal, 18–71 kHz, phase measurement</td><td>Short pulses, measures signal decay after each pulse</td></tr>
<tr><th scope="row">Mineralised ground (laterite, ironstone)</th><td>Loses depth, noisy, needs constant ground balancing</td><td>Stable; largely ignores mineralisation</td></tr>
<tr><th scope="row">Depth on larger nuggets</th><td>Moderate</td><td>Deepest, up to 1 m or more with a large coil</td></tr>
<tr><th scope="row">Very small gold near surface</th><td>Excellent on high-frequency machines</td><td>Good with short pulse delay and small coil, weaker than high-frequency VLF</td></tr>
<tr><th scope="row">Discrimination (rejecting trash)</th><td>Yes</td><td>Minimal; dig most signals</td></tr>
<tr><th scope="row">Hot rocks</th><td>Frequent false signals</td><td>Far fewer</td></tr>
<tr><th scope="row">Weight and battery</th><td>Lighter, longer battery life</td><td>Heavier, higher power draw</td></tr>
<tr><th scope="row">Cost</th><td>Lower</td><td>Higher</td></tr>
<tr><th scope="row">Best fit</th><td>Mild soil, small shallow gold, trashy old camps</td><td>Mineralised goldfields, deeper nuggets, most Tanzanian ground</td></tr>
</tbody></table></div>`,
  },
  {
    id: 'which-detector',
    title: 'Which Gold Detector for Which Job',
    html: `${decision}
<div class="eq-tablewrap"><table class="eq-table">
<caption class="eq-caption">Detector type by prospecting job</caption>
<thead><tr><th scope="col">Job</th><th scope="col">Detector type and set-up</th></tr></thead>
<tbody>
<tr><th scope="row">Nugget hunting on red laterite and ironstone (Geita, Mwanza, Shinyanga)</th><td>PI with a mono or double-D coil; ground balance on the actual soil before starting</td></tr>
<tr><th scope="row">Deep nuggets on old eluvial ground</th><td>PI with a large coil (35–45 cm); slower sweep, more digging</td></tr>
<tr><th scope="row">Very small gold in mild soil or shallow gullies</th><td>High-frequency VLF (around 40–71 kHz) with a small concentric or DD coil</td></tr>
<tr><th scope="row">Old workings and camps full of iron trash</th><td>VLF or multi-frequency, using discrimination to skip trash</td></tr>
<tr><th scope="row">Checking dumps, tailings and ore on a sorting table</th><td>Small-coil VLF or pinpointer; big PI coils overload on dense metal-rich material</td></tr>
<tr><th scope="row">Tracing a gold trail to the reef</th><td>PI on the slope, logging each find by GPS; see technique below</td></tr>
</tbody></table></div>
<p>A detector recovers coarse, free gold only. Fine gold in gravel or crushed ore needs gravity equipment such as a <a href="/equipment/shaking-table-gold">shaking table</a> or <a href="/equipment/centrifugal-gold-concentrator">centrifugal concentrator</a>.</p>`,
  },
  {
    id: 'coils-technique',
    title: 'Coils, Ground Balance and Field Technique',
    html: `<h3>Choosing a coil</h3>
<ul>
<li><strong>Double-D (DD)</strong> coils handle mineralised ground better and give a narrow, predictable detection pattern. They are the default on most Tanzanian ground.</li>
<li><strong>Mono</strong> coils on a PI give maximum depth and sensitivity, but are noisier in heavy mineralisation.</li>
<li><strong>Coil size</strong> trades depth for small-gold sensitivity: 15–25 cm coils for small gold and trashy ground, 35–45 cm for depth on larger nuggets and open ground.</li>
</ul>
<h3>Ground balance and hot rocks</h3>
<p>Ground balance tells the detector what the soil sounds like so it can ignore it. Balance at the start of every new patch of ground, and re-balance when the soil colour changes. Ironstone and magnetite pebbles ("hot rocks") still give signals. Learn their sound by passing the coil over a known hot rock before hunting.</p>
<h3>Technique that finds more gold</h3>
<ol>
<li>Sweep slowly and overlap each pass by about half a coil width, keeping the coil flat and close to the ground.</li>
<li>Dig every repeatable signal on a PI. Small and deep gold often gives the faintest response.</li>
<li>Check the hole and the spoil separately to confirm where the target is before digging further.</li>
<li>Log every nugget with GPS and depth. Clusters and lines of finds point to where the gold came from.</li>
<li>Work upslope from clusters. Eluvial gold sheds downhill from its source, so the trail narrows towards the reef, which then needs <a href="/insights/gold-exploration-tanzania">proper exploration</a> such as trenching or <a href="/equipment/rc-drilling-rig">RC drilling</a>.</li>
</ol>
<div class="art-callout"><strong>Licence first.</strong> Detecting for gold is prospecting. Work only on ground you hold a licence for, or with the written permission of the holder. See <a href="/jinsi-ya-kupata-leseni-ya-pml">how to get a PML licence</a>. Gold found must be sold through licensed channels; see <a href="/insights/selling-gold-tanzania">selling gold in Tanzania</a>.</div>`,
  },
  {
    id: 'buying-checklist',
    title: 'Buying a Gold Detector in Tanzania: Checklist',
    html: `<ul>
<li><strong>Match the machine to your ground.</strong> Test on your own soil with a known small gold target, or ask the supplier to demonstrate on similar laterite, before paying.</li>
<li><strong>Buy genuine.</strong> Copies of well-known detectors circulate in the region. Check the serial number with the manufacturer and insist on a written warranty.</li>
<li><strong>Warranty and repairs.</strong> Ask where the unit is serviced and how long a repair takes. A detector away for months is a lost season.</li>
<li><strong>Spare coil and cover.</strong> Coils crack on rocky ground. A spare coil cover is cheap; a spare coil keeps you working.</li>
<li><strong>Power off grid.</strong> Plan batteries and charging: spare battery packs and a solar or vehicle charger for multi-day trips.</li>
<li><strong>Headphones and pinpointer.</strong> Good headphones reveal faint deep signals; a handheld pinpointer halves digging time.</li>
<li><strong>Training.</strong> Ground balancing and signal reading take practice. Budget time for it before judging a detector.</li>
</ul>
<p>Prices vary widely by type, coil and whether the unit is genuine. Tell us your ground, the gold you are chasing and your budget on <a href="https://wa.me/255759141705">WhatsApp</a>, and we will recommend a detector type and quote.</p>`,
  },
]
