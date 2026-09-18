const content = `<p><strong>Underground air supply</strong> is really two separate systems that get confused for one another: <strong>ventilation</strong>, which keeps the air breathable, and <strong>compressed air</strong>, which powers drills and other pneumatic tools. Customers often ask for an "air supply tunnel" or an "air supply unit" meaning one or the other, or both together. This guide explains what each system actually does, the fans, ducting and compressors involved, and how to size them correctly.</p>

<div class="art-stats"><div class="art-stat"><div class="art-stat-v">0.1 m&sup3;/s</div><div class="art-stat-l">Minimum ventilation air per person underground</div></div><div class="art-stat"><div class="art-stat-v">100&ndash;150 cfm</div><div class="art-stat-l">Compressed air per jackleg drill</div></div><div class="art-stat"><div class="art-stat-v">40%+</div><div class="art-stat-l">Air lost to poorly jointed duct</div></div></div>

<h2>Two Systems, Not One</h2>
<table>
<thead><tr><th></th><th>Ventilation</th><th>Compressed air</th></tr></thead>
<tbody>
<tr><td>What it does</td><td>Supplies breathable air, clears blast fumes, diesel exhaust and gas</td><td>Powers drills, pneumatic tools and RC drilling</td></tr>
<tr><td>Moved by</td><td>Ventilation fan</td><td>Air compressor</td></tr>
<tr><td>Carried through</td><td>Flexible or rigid ventilation duct, 400&ndash;1,200 mm</td><td>Steel or reinforced hose pipeline, much smaller diameter</td></tr>
<tr><td>Typical pressure</td><td>0.5&ndash;5 kPa</td><td>6&ndash;7 bar for hand drills; 24&ndash;35 bar for RC drilling</td></tr>
<tr><td>Sized by</td><td>Workers, diesel equipment, blast fume clearance</td><td>Number and type of tools running at once</td></tr>
</tbody>
</table>
<p>A shaft or drive needs ventilation as soon as anyone works in it. It only needs compressed air if pneumatic drills, RC drilling or other air-driven tools are used there. Confusing the two leads to buying the wrong equipment, which is the single most common mistake in an "air supply" enquiry.</p>

<h2>Ventilation: How Much Air Does a Working Need</h2>
<p>Underground ventilation air is sized on the largest of three calculations, not a single rule of thumb:</p>
<ul>
<li><strong>Air per person.</strong> A commonly applied minimum is 0.1 m&sup3;/s per person underground.</li>
<li><strong>Air per diesel kilowatt.</strong> Diesel equipment needs roughly 0.05&ndash;0.08 m&sup3;/s per kW of engine power operating underground. This usually dominates the calculation and is where operators most often under-provide, because it is easy to add a loader or generator underground without recalculating ventilation.</li>
<li><strong>Blast fume clearance.</strong> The volume needed to clear blasting fumes from a heading within the planned re-entry time.</li>
</ul>
<p>Take the largest of the three. Auxiliary fans for small workings typically move 1&ndash;20 m&sup3;/s through the duct; full specifications and fan sizing are on the <a href="/equipment/mine-ventilation-fan">mine ventilation fan</a> page.</p>

<h2>Ventilation Ducting: The Part Most Often Under-Specified</h2>
<p>The fan gets the attention, but the duct is usually where air is lost. Ducting comes in two types:</p>
<ul>
<li><strong>Flexible layflat duct</strong> for forcing ventilation: cheap, easy to run into a heading, and standard for pushing fresh air to the face.</li>
<li><strong>Rigid or reinforced duct</strong> for exhausting ventilation: costs more and must resist collapse, but keeps the heading itself clean of contaminated return air.</li>
</ul>
<p>Duct diameter runs 400&ndash;1,200 mm depending on the airflow required. The critical fact: <strong>poorly jointed duct can lose over 40% of the air the fan is delivering</strong> before it reaches the face. Measuring airflow at the fan tells you almost nothing useful about conditions at the face; measure at the face, and treat any large gap as a maintenance backlog on the duct, not a fan problem.</p>
<p><strong>Forcing or exhausting?</strong> Forcing ventilation pushes fresh air to the face and is simpler and cheaper, but workers travel through the contaminated return air on the way in and out. Exhausting draws contaminated air out and keeps the heading clean, but costs more. Many operations run both together, forcing fresh air in on one duct while exhausting on another.</p>

<h2>Compressed Air: Sizing for Drills and Tools</h2>
<p>Compressed air demand is set by what is actually running, added together, not by guesswork:</p>
<table>
<thead><tr><th>Duty</th><th>Air needed</th><th>Pressure</th></tr></thead>
<tbody>
<tr><td>Jackleg or stoper rock drill (each)</td><td>100&ndash;150 cfm</td><td>6&ndash;7 bar</td></tr>
<tr><td>Four drills working together</td><td>About 500&ndash;600 cfm at the compressor, not 400</td><td>6&ndash;7 bar</td></tr>
<tr><td>Reverse circulation (RC) drilling</td><td>900&ndash;1,150 cfm</td><td>24&ndash;35 bar, often with a booster past about 200 m depth</td></tr>
</tbody>
</table>
<p>The gap between "four drills at 100&ndash;150 cfm each" and "500&ndash;600 cfm at the compressor" is pipeline losses and diversity, and it is where undersized systems fail: penetration rate drops and drill steels stick. A mine air system that has never been surveyed commonly loses 20&ndash;30% of its output to leaks in the distribution pipework, often more, which is usually the cheapest capacity increase available, well before buying a second compressor.</p>
<p>Full specifications for the compressor and the drill are on the <a href="/equipment/air-compressor-mining">mining air compressor</a> and <a href="/equipment/pneumatic-rock-drill">pneumatic rock drill (jackleg)</a> pages.</p>

<h2>Diesel or Electric?</h2>
<p>Both ventilation fans and air compressors are available diesel or electric, and the right choice depends on the power available on site, not on the equipment itself:</p>
<ul>
<li><strong>Electric</strong> is standard for fixed plant on a reliable grid or a properly sized generator: cleaner, quieter and cheaper to run once the power supply is there.</li>
<li><strong>Diesel</strong> suits mobile duty and sites without reliable power, but adds heat and exhaust underground, which is itself a ventilation load that must be included in the air-per-kilowatt calculation above.</li>
</ul>
<p>Whichever you choose, the electrical supply and controls need to be specified for the environment: flameproof motors are required in any working where flammable gas has ever been detected, and switchgear should be rated for the dust and moisture underground. See <a href="/insights/off-grid-mine-power">powering an off-grid mine site</a> for sizing the generator behind either system.</p>

<h2>Getting the Whole System Right</h2>
<ol>
<li><strong>Decide what you actually need.</strong> Ventilation for people and diesel equipment, compressed air for drills and tools, or both.</li>
<li><strong>Calculate demand from what will actually run</strong>: people, diesel kW, and the number and type of pneumatic tools, not a single machine's rating.</li>
<li><strong>Size the duct or pipeline for the loss, not the ideal.</strong> Assume real-world joint leakage and pressure drop, and check it once installed by measuring at the working face, not at the fan or compressor.</li>
<li><strong>Match the power source to what is on site</strong>: grid, generator, or diesel-direct.</li>
<li><strong>Add gas detection.</strong> Ventilation reduces gas hazards; it does not replace monitoring them. See <a href="/equipment/gas-detection-monitor">gas detection monitors</a>.</li>
</ol>
<div class="art-callout"><strong>Send us the working, not just a request for "an air supply unit."</strong> Tell us the heading length and section size, how many people and what diesel equipment will be underground, and whether pneumatic drills or RC drilling are involved. We will size the fan, duct, compressor and pipeline as one system rather than quoting equipment that does not match what is actually running.</div>

<h2>Regions We Serve</h2>
<div class="region-chips"><span class="region-chip">Geita</span><span class="region-chip">Kahama</span><span class="region-chip">Mwanza</span><span class="region-chip">Shinyanga</span><span class="region-chip">Chunya</span><span class="region-chip">Mererani</span><span class="region-chip">Tabora</span><span class="region-chip">Dar es Salaam</span></div>

<h2>Frequently Asked Questions</h2>
<h3>What is an "air supply tunnel" for a mine?</h3>
<p>This usually means the ventilation ducting that carries air from the fan to the working face, not a separate tunnel that is dug. Flexible layflat duct is used for forcing ventilation, rigid duct for exhausting. See the ducting section above for sizing.</p>
<h3>What is an "air supply electrical unit"?</h3>
<p>This is most often either an electric-driven ventilation fan or an electric air compressor. Which one you need depends on whether the job is keeping the air breathable (fan) or running pneumatic tools (compressor). Tell us which tools or conditions you are dealing with and we will confirm which piece of equipment actually answers the request.</p>
<h3>Can one system do both ventilation and compressed air?</h3>
<p>No. A ventilation fan moves a large volume of air at very low pressure; a compressor moves a much smaller volume at high pressure to do work through a tool. They are different machines for different jobs, and both are usually needed on an active underground working.</p>
<h3>Why does my ventilation fan seem to be running but the face still feels stuffy?</h3>
<p>Almost always duct leakage. Torn layflat duct, badly made joints and crushed sections can lose over 40% of the fan's output before the air reaches the face. Measure airflow at the face, not at the fan, and inspect the duct along its length.</p>`
export default content
