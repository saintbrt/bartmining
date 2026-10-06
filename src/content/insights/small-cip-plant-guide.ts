import { renderArticleFaqs } from '@/lib/article-faqs'

const content = `<p>A small CIP or CIL plant is a processing system, not simply a row of tanks. Prepared ore must enter at a controlled rate, gold must dissolve and reach carbon, and loaded carbon must become a saleable product. Water, residue handling, power and operator routines are part of that same system.</p>
<p>This guide helps an owner turn daily tonnage and test results into a coherent plant brief. It explains what to specify and demonstrates a first volume calculation, without presenting a universal tank size or a minimum tonnage that makes every project profitable.</p>
<h2 id="feed">Establish the feed before the equipment list</h2>
<p>Confirm tonnes per day, operating hours, grade variability, ore types and the preparation needed. For old tailings, establish ownership, previous treatment and contaminants as well as grade. The <a href="https://www.sgs.com/-/media/sgscorp/documents/corporate/brochures/sgs-nr-gold-processing-en.cdn.en-KZ.pdf">SGS gold-processing overview</a> explains the role of test work in choosing treatment routes.</p>
<p>Request leach response over time, reagent consumption, slurry behaviour and carbon-adsorption information. A final extraction percentage does not show whether the planned residence time, carbon inventory and screens will work at the intended flow.</p>
<h2 id="configuration">Connect the duties in the circuit</h2>
<p>CIP separates leaching from carbon adsorption; CIL combines them in the leaching circuit. The selected configuration needs coordinated feed preparation, tanks and agitation, carbon retention and transfer, loaded-carbon handling, elution or an agreed toll route, and residue management.</p>
<p>Prepare a concept sequence: feed preparation → leaching/adsorption → loaded-carbon recovery → elution and goldroom; the residue stream goes to its designed treatment and containment route. This describes process relationships, not a construction drawing. The designer must show every stream, recycle and utility in the engineering documents.</p>
<h2 id="tank-example">Calculate working volume from slurry flow</h2>
<p>For an illustrative 50 dry t/day operation running continuously, assume 40% solids by mass, solids density 2.7 t/m³ and water density 1 t/m³. Daily water is 50 × (1 − 0.40) / 0.40 = 75 t, or 75 m³. Solids occupy about 50 / 2.7 = 18.52 m³, giving approximately 93.52 m³ of slurry per day, or 3.90 m³/h.</p>
<p>At an assumed 24-hour residence time, the first working-volume estimate is 3.90 × 24 = 93.6 m³, with rounding. This is not a gross vessel size, a residence-time recommendation or a complete design. Freeboard, mixing, carbon duty, flow distribution, availability and changes in slurry density still need engineering assessment.</p>
<h2 id="utilities">Budget for steady operation</h2>
<p>Build a load list for milling, agitation, pumps, air supply and auxiliary equipment. Confirm water quality and makeup demand, carbon supply, reagent logistics and laboratory support. Include screens, seals, liners, wear parts and planned maintenance in the operating estimate.</p>
<p>Use measured or tested consumption rather than a standard reagent allowance copied from another mine. The <a href="/insights/activated-carbon-cyanide-tanzania">consumables guide</a> explains what a procurement specification should contain.</p>
<h2 id="readiness">Resolve approvals and handover criteria</h2>
<p>Confirm the activity’s licensing, environmental, chemical and waste requirements before construction. The <a href="https://cyanidecode.org/about-the-cyanide-code/the-cyanide-code/">Cyanide Code</a> is a useful management reference for cyanide facilities, alongside applicable national requirements and specialist procedures.</p>
<p>Agree what commissioning will demonstrate: flow, stable operation, sampling, carbon accountability, operator training and complete documentation. Define how performance will be measured on agreed feed and how defects will be handled. A brief run without a reconciled balance is not proof of sustained recovery.</p>
${renderArticleFaqs("small-cip-plant-guide", "en")}
<h2 id="conclusion">Specify an operable circuit</h2>
<p>Use feed evidence and test results to specify the complete path from prepared ore to payable gold and managed residue. Treat the preliminary volume calculation as a starting check, then have the duties engineered together. The next step is a process brief containing the feed schedule, slurry assumptions, test reports, utilities and proposed handover criteria.</p>
<h2 id="basis">Sources and assumptions</h2>
<p>Technical references were reviewed on 5 October 2026. All volume inputs are illustrative; this guide does not set chemical controls or equipment operating limits.</p>`
export default content
