import type { GuideSection } from './index'

/**
 * Guide sections for the elution page, written against the queries Search
 * Console shows for it: "gold elution process", "aarl elution", "zadra
 * elution", "elution heaters", "elution column". Figures stay consistent
 * with the spec table and with /insights/gold-elution-plant-price, which
 * owns the price discussion. Link to it, do not repeat it.
 */

const flowDiagram = `<figure class="eq-figure">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="elution-flow-title elution-flow-desc" style="width:100%;height:auto;display:block">
<title id="elution-flow-title">Gold elution process flow</title>
<desc id="elution-flow-desc">Loaded carbon moves through acid wash, elution, electrowinning and carbon regeneration. Gold sludge from the electrowinning cell goes to smelting to make doré, and regenerated carbon returns to the leach tanks.</desc>
<defs><marker id="elu-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
<g font-family="inherit" font-size="15" text-anchor="middle" fill="currentColor">
<g stroke="currentColor" stroke-width="1.5" fill="none">
<rect x="10" y="30" width="200" height="80" rx="8"/><rect x="260" y="30" width="200" height="80" rx="8"/><rect x="510" y="30" width="200" height="80" rx="8"/>
<rect x="510" y="190" width="200" height="80" rx="8"/><rect x="260" y="190" width="200" height="80" rx="8"/><rect x="10" y="190" width="200" height="80" rx="8"/>
</g>
<text x="110" y="64" font-weight="700">1. Loaded carbon</text><text x="110" y="88" font-size="13" opacity=".75">screened from CIL/CIP</text>
<text x="360" y="64" font-weight="700">2. Acid wash</text><text x="360" y="88" font-size="13" opacity=".75">dilute HCl, then rinse</text>
<text x="610" y="64" font-weight="700">3. Elution (strip)</text><text x="610" y="88" font-size="13" opacity=".75">hot caustic cyanide</text>
<text x="610" y="224" font-weight="700">4. Electrowinning</text><text x="610" y="248" font-size="13" opacity=".75">gold plates on cathodes</text>
<text x="360" y="224" font-weight="700">5. Smelting</text><text x="360" y="248" font-size="13" opacity=".75">sludge + flux → doré</text>
<text x="110" y="224" font-weight="700">6. Regeneration kiln</text><text x="110" y="248" font-size="13" opacity=".75">stripped carbon, 650–750 °C</text>
<g stroke="currentColor" stroke-width="1.5" fill="none" marker-end="url(#elu-arrow)">
<path d="M210 70H255"/><path d="M460 70H505"/><path d="M610 110V185"/><path d="M510 230H465"/>
<path d="M560 110 C 480 150, 250 150, 160 186"/>
</g>
<text x="360" y="132" font-size="12.5" opacity=".7">stripped (barren) carbon</text>
<path d="M110 190V140" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" fill="none" marker-end="url(#elu-arrow)"/>
<text x="110" y="132" font-size="12.5" opacity=".7">back to leach tanks</text>
</g>
</svg>
<figcaption>Batch elution circuit. Pregnant eluate from step 3 feeds the electrowinning cell; in a Zadra circuit it circulates continuously between the column and the cell.</figcaption>
</figure>`

export const sections: GuideSection[] = [
  {
    id: 'elution-process',
    title: 'The Gold Elution Process, Step by Step',
    html: `<p>Elution is the reverse of adsorption. In the leach tanks, activated carbon picks up gold from cyanide solution at ambient temperature. In the elution column, heat, caustic soda and cyanide push the gold back off the carbon into a small volume of rich solution. Electrowinning then takes the gold out of that solution as a solid.</p>
${flowDiagram}
<ol>
<li><strong>Recover and wash the loaded carbon.</strong> Carbon is pumped from the first CIL or CIP tank, screened from the slurry and washed with water so ore fines do not enter the column.</li>
<li><strong>Acid wash.</strong> Dilute hydrochloric acid, typically around 3%, dissolves calcium carbonate and other scale that blocks carbon pores and slows the strip. The carbon is then rinsed and neutralised. Acid washing is essential in AARL and strongly recommended in Zadra.</li>
<li><strong>Elution (the strip).</strong> Hot caustic cyanide solution passes through the carbon bed at 110–140 °C in a pressure column, or around 95 °C in an atmospheric one. Higher temperature strips faster. The target is below 100 g/t gold left on the carbon.</li>
<li><strong>Electrowinning.</strong> The gold-bearing (pregnant) eluate flows through a cell where a rectifier drives current between anodes and cathodes. Gold plates onto steel wool or stainless mesh cathodes.</li>
<li><strong>Smelting.</strong> Cathode sludge is filtered, dried and smelted with fluxes into doré bars, which are sold and refined off site.</li>
<li><strong>Carbon regeneration.</strong> Stripped carbon is heated in a kiln at roughly 650–750 °C in a steam atmosphere to burn off organic fouling and restore its activity, then returned to the leach tanks.</li>
</ol>`,
  },
  {
    id: 'aarl-vs-zadra',
    title: 'AARL vs Zadra Elution',
    html: `<p>The two methods use the same chemistry but run the strip differently. Zadra circulates one eluant continuously through the column and the electrowinning cell. AARL (developed by Anglo American Research Laboratories) soaks the carbon, then displaces the gold with clean hot water in a single pass, producing a smaller, richer eluate.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3">
<caption class="eq-caption">AARL vs Zadra: typical operating differences</caption>
<thead><tr><th scope="col"></th><th scope="col">Zadra</th><th scope="col">AARL</th></tr></thead>
<tbody>
<tr><th scope="row">How the strip runs</th><td>Continuous recirculation of eluant between column and electrowinning cell</td><td>Acid wash, caustic cyanide pre-soak, then elution with hot clean water in one pass</td></tr>
<tr><th scope="row">Eluant</th><td>About 1% NaOH with 0.1–0.2% NaCN</td><td>Pre-soak about 2–3% NaOH with 1–3% NaCN; elution with softened or demineralised water</td></tr>
<tr><th scope="row">Temperature and pressure</th><td>About 95 °C atmospheric, or 125–140 °C pressurised</td><td>110–120 °C, pressurised</td></tr>
<tr><th scope="row">Cycle time</th><td>48–72 h atmospheric; 12–24 h pressurised</td><td>8–14 h</td></tr>
<tr><th scope="row">Eluate</th><td>Larger volume, lower grade, electrowon in circuit</td><td>Smaller volume, higher grade, electrowon after the strip</td></tr>
<tr><th scope="row">Water quality</th><td>Tolerant of site water</td><td>Needs good-quality water; hardness fouls the carbon</td></tr>
<tr><th scope="row">Equipment</th><td>Fewer tanks, simpler controls</td><td>Acid wash, pre-soak and eluate tanks; more valves and sequencing</td></tr>
<tr><th scope="row">Best fit</th><td>Small and medium plants, toll elution, 0.5–3 t carbon per batch</td><td>Larger plants where short cycles and throughput matter</td></tr>
</tbody></table></div>
<p>For most small-scale and mid-tier operations in Tanzania, <strong>pressure Zadra</strong> is the practical middle ground: a much shorter cycle than atmospheric Zadra without the extra tanks and water treatment AARL needs. The trade-offs are covered in more depth in <a href="/insights/cil-vs-cip-vs-heap-leach">CIL vs CIP vs heap leach</a> and the <a href="/insights/small-cip-plant-guide">small CIP and CIL plant guide</a>.</p>`,
  },
  {
    id: 'whats-included',
    title: 'What a Complete Elution Plant Includes',
    html: `<p>Quotes differ most in what they leave out. A working plant, not just a column, includes:</p>
<div class="eq-tablewrap"><table class="eq-table">
<caption class="eq-caption">Elution plant scope checklist</caption>
<thead><tr><th scope="col">Component</th><th scope="col">What it does</th></tr></thead>
<tbody>
<tr><th scope="row">Elution column</th><td>Insulated stainless vessel holding the carbon batch, pressure rated and certified for pressure methods</td></tr>
<tr><th scope="row">Elution heater or boiler</th><td>Diesel-fired or electric heating with a heat exchanger to hold the eluant at strip temperature</td></tr>
<tr><th scope="row">Acid wash vessel</th><td>Removes scale before stripping; often the column itself in small plants</td></tr>
<tr><th scope="row">Solution tanks and pumps</th><td>Eluant make-up, circulation, pre-soak (AARL) and barren solution</td></tr>
<tr><th scope="row">Electrowinning cell and rectifier</th><td>Plates gold from the eluate onto cathodes</td></tr>
<tr><th scope="row">Carbon regeneration kiln</th><td>Restores carbon activity so it keeps loading gold</td></tr>
<tr><th scope="row">Smelting furnace</th><td>Turns cathode sludge into doré, with fluxes, crucibles and moulds</td></tr>
<tr><th scope="row">Controls and safety</th><td>Temperature and pressure control, HCN gas detection, ventilation, eyewash and shower, secure access</td></tr>
</tbody></table></div>
<div class="art-callout"><strong>Looking for prices?</strong> Indicative price bands by batch size, running costs and the case for toll elution are in <a href="/insights/gold-elution-plant-price">Gold Elution Plant Price in Tanzania</a>.</div>`,
  },
  {
    id: 'batch-sizing',
    title: 'Sizing the Carbon Batch to Your Plant',
    html: `<p>Batch size comes from how much gold your leach circuit recovers and how heavily the carbon is loaded before it is stripped:</p>
<p><strong>Carbon to strip per day (t) = gold recovered per day (g) ÷ (loaded carbon grade − stripped carbon grade) (g/t)</strong></p>
<p>The table below works this through for a free-milling ore at 3 g/t, 90% leach recovery, carbon loaded to 1,500 g/t and stripped to 100 g/t, with a strip every three days. Change any of those and the batch changes in proportion. Higher grade or leaner loading means more carbon.</p>
<div class="eq-tablewrap"><table class="eq-table eq-table-3">
<caption class="eq-caption">Worked example: batch size by plant throughput</caption>
<thead><tr><th scope="col">Plant throughput</th><th scope="col">Carbon to strip per day</th><th scope="col">Batch every 3 days</th></tr></thead>
<tbody>
<tr><th scope="row">50 t/day</th><td>≈ 0.1 t</td><td>≈ 0.3 t (consider toll elution)</td></tr>
<tr><th scope="row">100 t/day</th><td>≈ 0.2 t</td><td>≈ 0.6 t</td></tr>
<tr><th scope="row">250 t/day</th><td>≈ 0.5 t</td><td>≈ 1.5 t</td></tr>
<tr><th scope="row">500 t/day</th><td>≈ 1.0 t</td><td>≈ 2.9 t</td></tr>
<tr><th scope="row">1,000 t/day</th><td>≈ 1.9 t</td><td>≈ 5.8 t</td></tr>
</tbody></table></div>
<p>Size the column with a margin above the calculated batch for grade spikes, and check that the regeneration kiln can process the same tonnage between strips. A batch below about half a tonne usually makes <a href="/insights/vat-leaching-tailings">vat leach</a> and small CIP operators better off sharing or tolling a plant than owning one.</p>`,
  },
  {
    id: 'power-heating',
    title: 'Power and Heating on Tanzanian Sites',
    html: `<p>Elution equipment is specified for the Tanzanian supply standard of <strong>400 V three phase at 50 Hz</strong> (230 V single phase for controls). Heating is the largest energy load, holding the eluant at strip temperature for the whole cycle.</p>
<ul>
<li><strong>Diesel-fired heating</strong> is the usual choice off grid. It is cheaper to run than electric heating on a generator, which converts diesel to electricity and back to heat with large losses.</li>
<li><strong>Electric heating</strong> makes sense on a reliable TANESCO grid connection, where it is cleaner and easier to control.</li>
<li><strong>Generator sizing</strong> must cover the circulation pumps, rectifier, kiln burner blowers, lighting, ventilation fans and gas detection together, with starting margin for pump motors. See <a href="/equipment/diesel-generator-mining">diesel generators for mining</a> and <a href="/insights/off-grid-mine-power">powering an off-grid mine site</a>.</li>
<li><strong>Ventilation and gas detection</strong> run whenever cyanide solution is hot. They belong on a protected supply, not the first circuit shed when a generator is overloaded.</li>
</ul>
<p>Reagent supply for the strip (caustic soda, sodium cyanide, hydrochloric acid and make-up carbon) is covered in <a href="/insights/activated-carbon-cyanide-tanzania">activated carbon and sodium cyanide supply in Tanzania</a>.</p>`,
  },
]
