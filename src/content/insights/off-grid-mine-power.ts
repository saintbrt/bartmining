const content = `<div class="art-stats"><div class="art-stat"><div class="art-stat-v">6-7x</div><div class="art-stat-l">Motor starting current, direct on line</div></div><div class="art-stat"><div class="art-stat-v">0.25-0.30</div><div class="art-stat-l">Litres of diesel per kWh</div></div><div class="art-stat"><div class="art-stat-v">50-80%</div><div class="art-stat-l">The load band a genset should live in</div></div></div>

<h2>Power Is the Operating Cost That Decides Everything</h2>
<p>On an off-grid site, diesel is usually the largest single line in the operating budget, ahead of labour and ahead of consumables. Grinding alone can account for the majority of it. A plant designed without a serious look at power will be profitable on a spreadsheet and marginal in practice.</p>
<p>The decision is not simply generator versus grid. It is a sequence: know your load, size for the worst moment rather than the average, then choose the supply that fits.</p>

<h2>Step One: Build a Real Load List</h2>
<p>Before pricing anything, list every motor and load on site with its rated power, its duty cycle and its starting method. Then work out three numbers:</p>
<ul>
<li><strong>Connected load.</strong> Everything added together. Useful only as an upper bound, because nothing runs everything at once</li>
<li><strong>Maximum demand.</strong> What actually runs simultaneously at the busiest moment. This is what the supply must carry continuously</li>
<li><strong>Largest starting load.</strong> The single biggest motor started direct on line, which is usually the mill. This frequently sets the generator size on its own</li>
</ul>
<p>Most undersized installations come from budgeting on connected load with a diversity factor and forgetting the third number entirely.</p>

<h2>Step Two: Starting Current Is the Constraint</h2>
<p>A squirrel cage induction motor started direct on line draws six to seven times its full load current for a few seconds, at poor power factor. A 90 kW mill motor can therefore demand the best part of 600 kVA momentarily.</p>
<p>A generator that cannot supply that inrush will sag in voltage, trip on under-frequency, or stall. The result is a plant that cannot start its own mill, which is a problem discovered at commissioning when the equipment is already on site.</p>
<p>There are three ways out, and the third is usually best:</p>
<ul>
<li><strong>Oversize the generator</strong> to absorb the inrush. Simple, but it means running lightly loaded the rest of the time, which causes its own problems</li>
<li><strong>Fit a soft starter</strong>, reducing inrush to roughly three or four times full load current. Modest cost, large effect</li>
<li><strong>Fit a variable frequency drive</strong>, which reduces starting current to near full load current, allows speed control, and can recover its cost in energy saving on variable loads such as pumps and fans</li>
</ul>

<div class="art-callout"><strong>A soft starter or VFD is almost always cheaper than the generator capacity it saves.</strong> On a mill or crusher motor this is the highest-return decision in the electrical design, and it is routinely skipped to save a few thousand dollars on a project spending far more on the genset it then requires.</div>

<h2>Step Three: Choose the Supply</h2>

<h3>Grid connection</h3>
<p>Where the national grid reaches, it is normally cheaper per kilowatt hour than diesel by a wide margin. The questions are how far the nearest line is, what a connection costs, what capacity is available, and how reliable supply is in that district. Grid plus a standby generator sized to carry critical loads is the usual arrangement, because an unplanned outage mid-leach is expensive and an outage that stops dewatering can flood a shaft.</p>

<h3>Diesel generation</h3>
<p>The default off grid. Sizing rules that matter:</p>
<ul>
<li><strong>Match the rating to the duty.</strong> Prime or continuous rating for a set that runs constantly, standby rating only for genuine emergency use. Running a standby-rated set continuously will fail early</li>
<li><strong>Keep the load between 50 and 80 percent.</strong> This is where fuel efficiency is best and where the engine stays healthy</li>
<li><strong>Avoid sustained light load.</strong> Below about 30 percent, unburnt fuel glazes the bores and fouls the exhaust, called wet stacking. It progressively destroys the engine</li>
<li><strong>Consider several smaller sets in parallel</strong> rather than one large one. Load varies through the shift, so you can run only what is needed and keep each set in its efficient band, you gain redundancy, and you can service one without stopping the site</li>
</ul>
<p>Budget roughly 0.25 to 0.30 litres of diesel per kilowatt hour generated at sensible load. For a 500 kVA set at 75 percent that is in the region of 100 litres an hour, and over a month of continuous running the fuel bill dwarfs the capital cost of the machine. This is why load management matters more than the purchase price.</p>

<h3>Solar and hybrid</h3>
<p>Tanzania has strong and consistent solar resource, and solar diesel hybrids are now routinely economic on remote sites. The realistic role is fuel displacement rather than replacement: solar carries daytime load, the generator carries night and peaks, and control equipment manages the transition.</p>
<p>Solar works best on loads that are daytime and steady. Borehole pumping into storage is the clearest case, and often pays back quickly with no batteries at all. Running a mill on solar alone is not practical without a large and expensive battery system, so treat solar as a way to reduce diesel hours rather than eliminate the generator.</p>

<h2>Distribution, Earthing and the Things That Get Forgotten</h2>
<ul>
<li><strong>Cable sizing and volt drop.</strong> Long runs to a remote crusher or pump station drop voltage, and motors running at low voltage draw more current and overheat. Size cable for volt drop, not just for current</li>
<li><strong>Power factor.</strong> Lots of lightly loaded induction motors give poor power factor, which wastes generator capacity you have already paid for. Correction equipment is cheap relative to the alternative</li>
<li><strong>Earthing and lightning protection.</strong> Frequently neglected, and a genuine hazard on a wet site with long cable runs</li>
<li><strong>Fuel storage and handling.</strong> Bunded tanks, filtration and water separation. Contaminated fuel is a common and avoidable cause of engine failure</li>
<li><strong>Standby for critical loads.</strong> Dewatering above all. A shaft that floods because the generator stopped is a far larger loss than the generator</li>
</ul>

<h2>Sequence for Getting This Right</h2>
<ul>
<li><strong>Build the load list</strong> with duty cycles and starting methods for every motor</li>
<li><strong>Identify the largest starting load</strong> and decide on soft starter or VFD before sizing the supply</li>
<li><strong>Establish maximum demand</strong> and add headroom, typically at least 25 percent</li>
<li><strong>Price grid connection</strong> if it is anywhere within reach, including the standby set you will still need</li>
<li><strong>Size generation</strong> to sit in the 50 to 80 percent band at normal running load</li>
<li><strong>Assess solar</strong> against daytime steady loads, starting with water pumping</li>
<li><strong>Design distribution properly</strong>, including volt drop, power factor and earthing</li>
</ul>

<div class="art-callout"><strong>Send us your load list and we will size the supply.</strong> Tell us the equipment, the duty cycles and the site location. We will come back with a generation recommendation, the starting arrangement your largest motor needs, and an indicative fuel cost per tonne of ore, which is usually the number that matters most.</div>

<h2>Regions We Serve</h2>
<div class="region-chips"><span class="region-chip">Mwanza</span><span class="region-chip">Geita</span><span class="region-chip">Kahama</span><span class="region-chip">Shinyanga</span><span class="region-chip">Bukombe</span><span class="region-chip">Chunya</span><span class="region-chip">Mbeya</span><span class="region-chip">Tabora</span><span class="region-chip">Dodoma</span><span class="region-chip">Kigoma</span></div>

<h2>Frequently Asked Questions</h2>
<h3>What size generator do I need for a gold plant?</h3>
<p>It depends far more on your largest motor's starting method than on total running load. Total the running load, then check the inrush of the biggest motor started direct on line, which is six to seven times its full load current. Whichever demand is greater sets the size. Fitting a soft starter or VFD usually reduces the generator you need by more than the starter costs.</p>

<h3>How much diesel will a mine site generator use?</h3>
<p>Roughly 0.25 to 0.30 litres per kilowatt hour generated at 50 to 80 percent load. A 500 kVA set at 75 percent burns in the region of 100 litres an hour. Model this per tonne of ore treated, because it is normally the largest operating cost on an off-grid site.</p>

<h3>Can solar power a gold processing plant?</h3>
<p>Not on its own, without a battery system large enough to be uneconomic for most operations. Solar diesel hybrids are practical and increasingly common, with solar displacing daytime fuel while the generator carries night load and peaks. Solar borehole pumping into storage is the clearest standalone win.</p>

<h3>Why does my generator keep tripping when the mill starts?</h3>
<p>Because the inrush current exceeds what the set can supply, so voltage sags and it trips on under-frequency or under-voltage. Fit a soft starter or VFD on that motor, stagger starts so only one large motor starts at a time, or increase generator capacity. The first option is almost always the cheapest.</p>
`

export default content
