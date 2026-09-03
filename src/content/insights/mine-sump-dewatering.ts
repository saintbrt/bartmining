const content = `<div class="art-stats"><div class="art-stat"><div class="art-stat-v">1.5-2x</div><div class="art-stat-l">Recommended pump capacity vs measured inflow</div></div><div class="art-stat"><div class="art-stat-v">Total head</div><div class="art-stat-l">The number that actually sizes a dewatering pump</div></div><div class="art-stat"><div class="art-stat-v">Wet season</div><div class="art-stat-l">When undersized systems fail, not dry season</div></div></div>

<h2>The Short Answer</h2>
<p>Sump dewatering exists to keep a working face, a decline or a pit bottom dry enough to mine, and the whole system is only as good as its weakest link: the sump's capacity to hold surge, the pump's ability to move total head rather than just static lift, and the discharge line's ability to actually carry that water away without silting up or bursting. Undersizing any one of those three defeats the other two, and it is the single most common cause of dewatering systems that work fine in the dry season and fail the moment rain arrives.</p>

<h2>The System, Not Just the Pump</h2>
<h3>The sump</h3>
<p>A sump's job is to buffer inflow surges between pump cycles, not just to be a hole where water collects. Undersized sumps cause pumps to short-cycle, which is hard on motors and seals, and they leave no margin when inflow spikes during a blast or a sudden groundwater intersection. Sump capacity should be sized against peak, not average, inflow.</p>

<h3>The pump</h3>
<p>Pump sizing is about total dynamic head, the static lift plus friction losses through the pipe and fittings plus any residual pressure needed at discharge, not simply the vertical distance from sump to surface. A pump selected on lift alone routinely underperforms once real pipe friction and fitting losses are accounted for, and underperformance here is invisible until the water level starts climbing.</p>

<h3>The discharge line</h3>
<p>Pipe diameter, material and route decide whether the pump's rated output actually reaches surface. Undersized pipe adds friction head the pump then has to fight, eroding effective capacity even on a correctly rated pump. Abrasive or high-solids water shortens the working life of both the pump and the line, and that wear rate is a design input, not an afterthought.</p>

<div class="art-callout"><strong>Size for the wet season, not the average day.</strong> A dewatering system that comfortably handles dry-season seepage and then floods a working face in the first heavy rain was undersized from the start. Measure or estimate peak inflow, not typical inflow, and size the sump and pump against that number.</p>

<h2>Selecting a Submersible Dewatering Pump</h2>
<ul>
<li><strong>Calculate total dynamic head</strong> from the actual pipe run, not straight-line distance, including every bend, valve and fitting the water has to pass through</li>
<li><strong>Size capacity at 1.5 to 2 times measured or estimated peak inflow</strong> to give margin for surge events and pump wear over the unit's service life, not just its rated performance on day one</li>
<li><strong>Match solids handling to actual water quality.</strong> A pump rated for clear water will wear rapidly, or clog outright, on slurry-laden sump water; check the solids and particle size the pump is actually built to pass</li>
<li><strong>Check voltage and cable run against your power source.</strong> Voltage drop over a long cable run to a remote sump is a common, avoidable cause of underperforming pumps that test correctly on the surface</li>
<li><strong>Plan for redundancy on critical dewatering points.</strong> A single pump with no standby on a face that floods without dewatering is a production risk, not just an equipment decision</li>
</ul>

<h2>Common Mistakes</h2>
<ul>
<li><strong>Sizing on static lift alone.</strong> Ignoring friction losses in the discharge line is the single most common reason a correctly rated pump on paper underperforms in the sump</li>
<li><strong>Undersized sump volume.</strong> Forces the pump to cycle constantly, shortening motor and seal life and leaving no buffer for surge inflow</li>
<li><strong>No standby pump on a critical face.</strong> One pump failure away from a flooded working area is an avoidable production stoppage</li>
<li><strong>Wrong solids rating for the actual water.</strong> A clear-water pump run on slurry wears out far faster than its rated service life suggests, and the failure is often blamed on the equipment rather than the selection</li>
<li><strong>Ignoring seasonal inflow variation.</strong> A system speced on dry-season measurements alone is speced for the easy half of the year only</li>
</ul>

<h2>Underground Dewatering Beyond the Sump</h2>
<p>Sump pumping is one stage of a larger underground dewatering system that typically includes drainage drives or ditches directing water to collection points, staged pumping where deep workings lift water to intermediate sumps before a final lift to surface, and settling arrangements to keep solids out of the pump train wherever practical. On a multi-level operation, each stage needs to be sized against the inflow it actually receives, not against the total mine inflow, or intermediate stages become the bottleneck regardless of how well the final surface pump is specified.</p>

<h2>Regions We Serve</h2>
<div class="region-chips"><span class="region-chip">Mwanza</span><span class="region-chip">Geita</span><span class="region-chip">Kahama</span><span class="region-chip">Shinyanga</span><span class="region-chip">Bukombe</span><span class="region-chip">Chunya</span><span class="region-chip">Mbeya</span><span class="region-chip">Tabora</span><span class="region-chip">Dodoma</span></div>

<h2>Frequently Asked Questions</h2>
<h3>How do I estimate peak inflow if I have no measured data?</h3>
<p>Start from comparable workings in the same geology and hydrogeology if any exist, and build in a conservative margin above that estimate until you have a season of actual measured data from your own site. Underestimating peak inflow is far more costly than modest over-sizing on the pump and sump.</p>

<h3>What causes a submersible pump to underperform against its rated capacity?</h3>
<p>Most commonly, friction losses in an undersized or poorly routed discharge line that were not accounted for when the pump was selected against lift alone, followed by voltage drop on a long cable run and impeller wear from solids the pump was not rated to handle.</p>

<h3>Should every level have its own pump, or should water be routed to one main sump?</h3>
<p>Depends on mine depth and layout. Deep or multi-level operations generally need staged pumping through intermediate sumps rather than one pump lifting the full depth, because total dynamic head and pipe friction both scale badly with a single very long lift.</p>

<h3>How often should dewatering pumps be serviced?</h3>
<p>On a schedule set by duty cycle and water quality rather than a fixed calendar interval; a pump running continuously in abrasive slurry needs far more frequent inspection than one cycling occasionally in clear seepage. Track wear indicators, not just runtime hours.</p>
<p>See our <a href="/equipment/submersible-dewatering-pump">submersible dewatering pump</a> page for current sizing charts and specifications.</p>
`

export default content
