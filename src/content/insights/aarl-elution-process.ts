const content = `<div class="art-stats"><div class="art-stat"><div class="art-stat-v">110-130&deg;C</div><div class="art-stat-l">Typical AARL elution temperature</div></div><div class="art-stat"><div class="art-stat-v">400-600 kPa</div><div class="art-stat-l">Operating pressure range</div></div><div class="art-stat"><div class="art-stat-v">8-14 h</div><div class="art-stat-l">Full elution cycle, pre-soak to strip</div></div></div>

<h2>The Short Answer</h2>
<p>AARL, named for South Africa's Anglo American Research Laboratories where it was developed, is the elution method most CIP and CIL plants outside North America run. It strips gold from loaded activated carbon using a hot, pressurised caustic cyanide wash preceded by an acid pre-soak, and it is popular because it is fast, needs no pre-treatment of the carbon with alcohol, and recovers cleanly into a small volume of pregnant solution ready for electrowinning.</p>

<h2>The Process, Step by Step</h2>
<h3>1. Acid wash, or pre-soak</h3>
<p>Loaded carbon is first washed with dilute hydrochloric acid to strip calcium and other carbonate scale that has built up on the carbon during adsorption. Left in place, that scale reduces the carbon's effective surface area and interferes with elution efficiency in every cycle that follows. The acid wash is rinsed thoroughly before the next step; carried-over acid reacting with cyanide downstream is a genuine safety hazard.</p>

<h3>2. Pre-soak with strip solution</h3>
<p>The column is filled with a hot solution of sodium cyanide and sodium hydroxide and left static for roughly an hour. This pre-soak conditions the carbon and begins displacing gold from the internal pore structure before flow starts, which shortens the active elution stage that follows.</p>

<h3>3. Elution at temperature and pressure</h3>
<p>Fresh strip solution is pumped through the carbon bed at 110 to 130&deg;C under 400 to 600 kPa, held above atmospheric pressure specifically to keep the solution liquid at that temperature. Gold desorbs from the carbon into solution and is carried out of the column as pregnant eluate, which is collected and fed to electrowinning. Flow continues until the gold concentration in the eluate drops to an uneconomic level, typically 8 to 14 hours after the cycle began.</p>

<h3>4. Cooling and carbon transfer</h3>
<p>The column is cooled and depressurised before the stripped carbon is transferred, usually to a regeneration kiln that reactivates it thermally for another adsorption cycle. Carbon that skips regeneration loses activity noticeably faster over repeated cycles.</p>

<h2>Why Plants Choose AARL</h2>
<ul>
<li><strong>Speed.</strong> A full cycle in 8 to 14 hours compares favourably with the Zadra process's longer atmospheric strip time, which matters directly to how much carbon inventory a plant needs to carry</li>
<li><strong>No alcohol pre-treatment.</strong> Unlike some alternative methods, AARL needs no ethanol addition, which removes a flammable reagent from the plant and simplifies procurement in remote locations</li>
<li><strong>Clean eluate.</strong> The pressurised, high-temperature strip produces a concentrated pregnant solution that suits direct electrowinning without further concentration</li>
</ul>
<p>The tradeoff is capital and operating complexity against those benefits: a pressure vessel, a heater rated for the duty, and pressure-safety systems that an atmospheric Zadra strip does not need.</p>

<div class="art-callout"><strong>Elution efficiency is a carbon problem as much as a process problem.</strong> Carbon that has not been properly acid-washed, or that has been through too many cycles without adequate regeneration, will elute poorly regardless of how well the AARL column itself is run. Track carbon activity, not just eluate grade, if strip performance starts drifting.</p>

<h2>Common Elution Problems</h2>
<ul>
<li><strong>Incomplete acid wash.</strong> Carbonate scale left on the carbon depresses gold desorption in every subsequent cycle, and the effect compounds over time</li>
<li><strong>Temperature or pressure short of spec.</strong> Elution kinetics are strongly temperature-dependent; running a few degrees cold extends cycle time and can leave residual gold on the carbon</li>
<li><strong>Channelling in the column.</strong> Poorly packed or degraded carbon lets strip solution bypass sections of the bed, so gold in those channels never sees fresh solution</li>
<li><strong>Regeneration skipped or under-temperature.</strong> Carbon that is not properly reactivated loses adsorption capacity, which shows up as depressed loading on the next cycle rather than as an elution fault, and is often misdiagnosed as an elution problem when it is a regeneration one</li>
<li><strong>Cyanide or caustic concentration drift.</strong> Strip solution strength that has not been checked and topped up between cycles is one of the most common, and most avoidable, causes of declining elution performance</li>
</ul>

<h2>AARL vs Zadra</h2>
<p>Zadra elution runs at or near atmospheric pressure and lower temperature, which needs a simpler, cheaper vessel but a longer cycle, often 24 to 48 hours. Pressure Zadra closes some of that gap by adding pressure without AARL's full temperature and caustic strength, sitting operationally between the two. For most small to medium plants balancing capital against cycle time, AARL's shorter cycle usually wins once throughput justifies the extra vessel cost; very small or capital-constrained operations sometimes accept Zadra's longer cycle to avoid the pressure system altogether.</p>

<h2>Regions We Serve</h2>
<div class="region-chips"><span class="region-chip">Mwanza</span><span class="region-chip">Geita</span><span class="region-chip">Kahama</span><span class="region-chip">Shinyanga</span><span class="region-chip">Bukombe</span><span class="region-chip">Chunya</span><span class="region-chip">Mbeya</span><span class="region-chip">Tabora</span><span class="region-chip">Dodoma</span></div>

<h2>Frequently Asked Questions</h2>
<h3>How long does a full AARL elution cycle take?</h3>
<p>Typically 8 to 14 hours from the start of the acid wash to the end of elution flow, depending on carbon loading, temperature control and column design. That is roughly a third to a half the time a standard atmospheric Zadra strip needs for a comparable duty.</p>

<h3>Why does AARL need an acid wash and Zadra sometimes does not?</h3>
<p>Both benefit from removing carbonate scale, but AARL's shorter, higher-intensity cycle is more sensitive to anything reducing carbon surface area, so the acid wash is treated as a mandatory step rather than an optional one.</p>

<h3>What happens if elution temperature falls below spec?</h3>
<p>Desorption slows, cycle time extends to hit the same eluate grade target, and if the operator does not compensate by running longer, gold is left on the carbon and reports as lower loading, and lower recovery, in the next adsorption cycle rather than as an obvious elution fault.</p>

<h3>Can an AARL column be retrofitted to an existing CIP or CIL plant?</h3>
<p>Yes, this is common practice. The elution and electrowinning circuit is a discrete unit that can be added or upgraded independently of the tank train, provided the plant has the pressure-rated vessel, heating capacity and instrumentation the AARL cycle needs.</p>
<p>See our <a href="/equipment/gold-elution-electrowinning-plant">elution and electrowinning plant</a> range for AARL-rated vessel specifications, or the <a href="/equipment/cil-cip-plant">CIL and CIP plant</a> page for the adsorption circuit that feeds it.</p>
`

export default content
