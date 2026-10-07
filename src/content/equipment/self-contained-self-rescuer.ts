import type { GuideSection } from './index'

/**
 * Guide sections for the SCSR page (Search Console: "scsr" at position 30,
 * plus "miners self rescuer", "self-contained self-rescuer" variants).
 * Covers SCSR vs filter self-rescuer, how to plan coverage from rated
 * duration, and storage, inspection and training. Figures match the
 * page's specification table; the escape-time example is a labelled
 * assumption.
 */

export const sections: GuideSection[] = [
  {
    id: 'scsr-vs-filter',
    title: 'SCSR or Filter Self-Rescuer: Which Protects Your Miners?',
    html: `<p>Two kinds of escape device are sold as “self-rescuers”, and they protect against different dangers. A <strong>filter self-rescuer</strong> cleans the air the miner breathes: it converts carbon monoxide into carbon dioxide. It only works when the surrounding air still contains enough oxygen to breathe. A <strong>self-contained self-rescuer (SCSR)</strong> does not use the mine air at all. It produces oxygen chemically inside a closed breathing circuit, so it protects the wearer in smoke, after a gas inrush or wherever oxygen has been used up.</p>
<p>After an underground fire or blast, a miner cannot know whether the air is short of oxygen. That is why many mines issue or cache SCSRs for escape. A filter unit costs less and weighs less, but it offers no protection in an oxygen-deficient atmosphere. If your mine has a credible risk of fire, gas or oxygen depletion, plan escape around self-contained units and use a <a href="/equipment/gas-detection-monitor">multi-gas detector</a> to check the atmosphere during normal work.</p>`,
  },
  {
    id: 'planning-coverage',
    title: 'Planning SCSR Coverage From Rated Duration',
    html: `<p>Units are rated for 10, 30 or 60 minutes, but that rating assumes a steady walking escape. Climbing ladders, carrying an injured colleague or breathing hard from fear uses oxygen faster, and a unit can run out well before its nameplate time. Coverage should therefore be planned from a timed escape, not from the rating alone.</p>
<ol>
<li><strong>Time the escape routes.</strong> Walk each route from the furthest working place to fresh air or a refuge, wearing normal kit, and record the time. Include ladders and steep sections.</li>
<li><strong>Allow for stress.</strong> Add a margin for exertion, poor visibility and helping others. Many operators treat the realistic duration of a unit as well below its rating.</li>
<li><strong>Decide what each miner carries.</strong> If the timed escape plus margin fits within one unit, a belt-worn SCSR may be enough. If not, place cached units along the route so a miner can change to a fresh unit before the first runs out.</li>
<li><strong>Mark and check the caches.</strong> Signpost each cache, keep it accessible and include it in the monthly checks shown in the maintenance table below.</li>
</ol>
<p>As a worked assumption, suppose the timed walk from the deepest stope to the shaft takes 20 minutes, and you allow double that for a stressed escape. A 30-minute unit would not cover 40 minutes, so either issue 60-minute units or place a cache roughly halfway. Replace these figures with your own timed routes.</p>`,
  },
  {
    id: 'storage-training',
    title: 'Storage, Inspection and Training',
    html: `<p>An SCSR that has been dropped, overheated or opened may not work when it is needed. Store units within the manufacturer’s temperature range, away from direct sun and engine heat, and check the seal indicator on every worn unit at the start of each shift. Any unit that has been activated, even briefly, is spent and must be replaced. Expired chemical units cannot be recertified, so track the expiry date of every unit in a register.</p>
<p>Training matters as much as the device. A working SCSR breathes hot and dry, and untrained users have removed working units in panic. Every underground worker should practise donning with a dedicated training unit at induction and at least once a year. Confirm the training, inspection and record-keeping your licence requires with the Mining Commission’s inspectorate and OSHA Tanzania. For a quotation, tell us how many people work underground, the length of your longest escape route and whether you need belt-worn units, cached units or both.</p>`,
  },
]
