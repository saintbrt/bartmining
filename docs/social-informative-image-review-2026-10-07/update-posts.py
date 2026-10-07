"""Apply the reviewed informative-batch asset map; leave news posts intact."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent
repo = root.parents[1]
post_file = repo / 'tools/social-carousel/src/data/posts-batch-2.ts'
text = post_file.read_text()
marker = '  // ─────────────────────────── EVERGREEN EXPLAINERS'
news, informative = text.split(marker, 1)
mapping = {
    'explainer-ore-4.png': 'explainer-ore-4.png',
    'plant-brief-report.png': 'news-gold-3.png',
    'field-sample-logbook.png': 'news-youth-1.png',
    'tailings-survey-mapping.png': 'news-youth-1.png',
    'tailings-batch-loading.png': 'news-battery-5.png',
    'used-mill-nameplate.png': 'explainer-used-equipment-2.jpg',
    'used-equipment-loading.png': 'explainer-used-equipment-5.png',
    'motor-starter-panel.png': 'explainer-used-equipment-4.png',
    'loaded-carbon-bags.png': 'explainer-elution-3.png',
    'elution-site-works.png': 'news-battery-2.png',
    'carbon-custody-handover.png': 'explainer-elution-5.png',
    'rental-job-planning.png': 'news-gold-3.png',
    'machine-operator-handover.png': 'explainer-rental-3.png',
    'equipment-resale-yard.png': 'explainer-rental-4.png',
    'product-shaking-2.png': 'product-shaking-2.png',
    'product-compressor-2.png': 'product-compressor-2.png',
}
for old, new in mapping.items():
    informative = informative.replace('social/' + old, 'social/' + new)
for name in ['gold-elution-electrowinning-plant', 'wet-pan-mill', 'submersible-dewatering-pump', 'gas-detection-monitor', 'sluice-box-gold-jig']:
    informative = informative.replace('equipment/' + name + '.jpg', 'equipment/website/' + name + '.webp')
informative = informative.replace('equipment/sluice-box-gold-jig.webp', 'equipment/website/sluice-box-gold-jig.webp')
informative = informative.replace('equipment/5-ton-mine-winch.jpg', 'equipment/website/5-ton-mine-winch-parallel-drive.webp')
informative = informative.replace('equipment/air-compressor-mining.jpg', 'social/product-compressor-1.png')

headlines = {
    'Why Should You Test Your Ore Before Buying a Plant?': 'Test Your Ore Before Buying a Plant',
    'Start with Samples That Represent Your Ore': 'Collect Representative Samples',
    'Each Test Answers a Design Question': 'Match Each Test to a Design Question',
    'Compare Results Under the Same Conditions': 'Compare the Test Conditions',
    'Use the Report to Write Your Plant Brief': 'Use the Report to Plan Your Plant',
    'How Does an Assay Laboratory Report Your Gold Grade?': 'How to Read Your Gold Assay',
    'Record What Each Sample Represents': 'Record the Sample’s Origin',
    'Ask Which Method Suits Your Gold': 'Choose the Right Assay Method',
    'Standards, Blanks and Duplicates Check the Results': 'Check the Quality Evidence',
    'Contained Gold Is Not the Gold You Will Sell': 'Contained Gold and Saleable Gold',
    'Can You Recover More Gold from Old Tailings?': 'Can Old Tailings Yield More Gold?',
    'Confirm Your Right to Treat the Tailings': 'Confirm the Right to Treat Tailings',
    'Mercury in Old Tailings Needs a Specialist': 'Assess Contaminants with Specialists',
    'Solution Must Flow Through the Material': 'Test How Solution Flows',
    'Calculate What One Batch Could Produce': 'Estimate the Gold in Each Batch',
    'What Should You Check Before Buying Used Equipment?': 'Checks Before Buying Used Equipment',
    'Check the Duty Before Negotiating the Price': 'Check Whether the Machine Fits',
    'Have the Machine Inspected Properly': 'Get a Proper Condition Inspection',
    'Confirm the Electrical Supply Matches': 'Check the Electrical Supply',
    'Add Repairs and Delivery to the Price': 'Calculate the Ready-to-Use Cost',
    'How Much Power Does a Small Gold Plant Need?': 'Plan Power for Your Gold Plant',
    'Start with a List of Every Load': 'List Every Electrical Load',
    'Motors Draw More Power When They Start': 'Allow for Motor Starting Demand',
    'Estimate Your Monthly Fuel Use': 'Estimate Monthly Fuel Use',
    'Compare Grid, Diesel and Hybrid Supply': 'Compare Your Power Options',
    'An Elution Plant Strips Gold from Loaded Carbon': 'Stripping Gold from Loaded Carbon',
    'The Package Includes More Than a Column': 'The Complete Elution Route',
    'Carbon Flow Determines the Size You Need': 'Size the Plant for Your Carbon Flow',
    'A Planning Budget Includes Site Works': 'Include Site Works in the Budget',
    'Compare Ownership with Toll Treatment': 'Compare Ownership and Toll Treatment',
    'Should You Rent or Buy Mining Equipment?': 'Should You Rent or Buy Equipment?',
    'Define the Job Before Comparing Prices': 'Define the Job and Working Hours',
    'Check What Wet and Dry Hire Include': 'Check the Hire Terms',
    'A Small Change Can Reverse the Result': 'Resale Value Changes the Result',
    'A Shaking Table Separates Gold by Density': 'Gold Separation on a Shaking Table',
    'Removing Fine Slimes Improves Table Recovery': 'Prepare the Feed for Separation',
    'A Wet Pan Mill Grinds Ore Under Heavy Rollers': 'Grinding Ore in a Wet Pan Mill',
    'Throughput Decides Between a Pan Mill and a Ball Mill': 'Choose a Mill for Your Ore',
    'A Leaching Tank Keeps Ore Slurry Suspended': 'Keeping Ore Slurry Suspended',
    'Leach Tests Set the Tank Volume You Need': 'Size Tanks from Leach Test Results',
    'A Submersible Pump Removes Water from Shafts and Pits': 'Removing Water from Shafts and Pits',
    'Size the Pump on Total Head, Not Depth Alone': 'Size Pumps for Flow and Total Head',
    'A Mine Winch Hoists Ore Up the Shaft': 'Hoisting Ore with a Mine Winch',
    'Two Independent Brakes Protect the Shaft': 'Check the Braking Requirements',
    'A Compressor Powers Rock Drills and Air Tools': 'Air Supply for Drills and Tools',
    'Air Demand Depends on the Tools You Run': 'Size the Air Supply for Your Tools',
    'A Gas Detector Warns of Unsafe Air Underground': 'Monitoring Underground Air',
    'Bump Test the Detector Before Every Shift': 'Check the Detector Before Use',
    'Sluices and Jigs Recover Coarse Gold': 'Recovering Free Gold by Gravity',
    'Even Water Flow Keeps Gold in the Riffles': 'Adjust the Sluice Water Flow',
    'Discuss Shaking Tables for Your Site': 'Discuss Shaking Tables for Your Site',
    'Discuss Dewatering Pumps for Your Site': 'Discuss Your Dewatering Needs',
    'Discuss Air Compressors for Your Site': 'Discuss Your Compressed Air Needs',
    'Discuss Sluices and Jigs for Your Site': 'Discuss Sluices and Jigs',
    'Discuss Rental or Purchase for Your Job': 'Discuss Rental or Purchase',
}
for old, new in headlines.items():
    for prefix in ["headline: '", "cta('"]:
        informative = informative.replace(prefix + old + "'", prefix + new.replace("'", "\\'") + "'")

# Corrections tied to the depicted equipment: remove unsupported universal
# thresholds and keep concepts distinct from offered specifications.
substitutions = {
    'Very fine particles below about 45 microns cloud the separation, so the feed is usually deslimed first. Deck slope, stroke and water are then adjusted one at a time.': 'Very fine slimes can make separation harder. Test suitable classification or desliming, then adjust deck slope, stroke and water for the prepared feed.',
    'The 1,200 mm pan mill is the most common production size. Above about 10–15 tonnes a day, a small ball mill circuit usually becomes the better choice.': 'Throughput, ore hardness and the required grind determine the mill duty. Compare the complete pan-mill and ball-mill circuits against your ore tests.',
    'An agitator keeps slurry moving while cyanide dissolves the gold. Five to eight tanks in series form a CIL or CIP train, each holding carbon behind a screen.': 'Agitation keeps slurry suspended during leaching. CIL combines leaching and carbon adsorption; CIP adds carbon adsorption after leaching.',
    'Daily tonnage, slurry density and the residence time from leach tests set the working volume. Standby power matters because settled slurry can stop an agitator restarting.': 'Feed rate, slurry density and tested residence time set the working volume. Standby power and an engineered restart procedure address settled slurry.',
    'Total head combines the vertical lift with friction in the pipe or hose. Beyond about 80 m, pumps are usually staged in series with sumps between them.': 'Total head includes vertical lift and pipe losses. Use pump curves at the required flow; intermediate sumps and staged pumping may suit the duty.',
    'A 5 tonne winch provides 5,000 kg of line pull for hoisting skips on small to medium underground mines, typically on shafts of 120–300 metres.': 'A winch winds wire rope to move a skip. Rated line pull, rope capacity, speed and braking must match the hoisting duty and installation.',
    'A service brake handles normal stopping, while a fail-safe emergency brake holds the load on power loss or overwind. Both brakes are tested every shift.': 'A hoisting design needs specified service and emergency braking. Confirm the brake arrangement, protections and inspection schedule with a competent engineer.',
    'A jackleg drill needs about 100–150 cfm at 6–7 bar, so four drills need about 500–600 cfm once leaks and pressure losses are included.': 'Add the specified air demand of tools working at the same time. Allow for duty cycles, leaks and pressure losses at the required operating pressure.',
    'A bump test confirms the sensors and alarms respond to gas. Calibration on a set schedule corrects drift, and sensors need replacing as they age.': 'A bump test checks sensor and alarm response. Use the matching test gas and adapter, and follow the manufacturer’s calibration and replacement schedule.',
    'Sluice boxes and jigs recover free gold of about 2 mm and above, which is too coarse for a centrifugal concentrator to take.': 'Sluices and jigs use gravity to recover free gold. Feed sizing, gold particle size and the selected machine determine where they fit in the circuit.',
    'Fast water washes gold across the riffles, while slow water lets sand bury them. Slope and water flow need checking across the full width every shift.': 'Excess flow can carry gold away, while insufficient flow can bury the riffles. Check the water distribution, slope and clean-up schedule for your feed.',
}
for old, new in substitutions.items():
    if old not in informative:
        raise RuntimeError('Expected copy not found: ' + old[:70])
    informative = informative.replace(old, new.replace("'", "\\'"))

caption_changes = {
    'A full-size table handles about 0.3–1.5 tonnes per hour of feed finer than 2 mm. Removing fine slimes first keeps the separation sharp, and the deck slope, stroke and water need adjusting one at a time. Paired with a centrifugal concentrator, a table can produce a concentrate clean enough to smelt without mercury.': 'A table needs prepared feed and suitable wash water. Test classification or desliming where fine slimes interfere, then adjust deck slope, stroke and water for the ore. Confirm the machine’s feed limits and concentrate quality through test work rather than assuming a universal throughput or a smelt-ready product.',
    'The wet pan mill is the most common grinding mill on small-scale gold sites in Tanzania.': 'A wet pan mill grinds crushed ore under heavy rollers with water.',
    'Above about 10–15 tonnes a day, a small ball mill circuit usually becomes the better choice.': 'Compare a pan mill with a ball mill using your throughput, ore hardness, required grind and the complete circuit cost.',
    'Each tank uses an agitator to keep slurry suspended while gold dissolves, and five to eight tanks run in series. Leach tests set the residence time and therefore the tank volume.': 'Agitators keep slurry suspended while gold dissolves. CIL combines leaching and carbon adsorption, while CIP separates those stages. Feed rate, slurry density and leach tests establish the working volume and tank arrangement.',
    'Beyond about 80 m, staging pumps with intermediate sumps is more reliable than one large lift. Check the seal-chamber oil monthly: milky oil means the outer seal has failed and needs attention before the motor is damaged.': 'Use the pump curve at the required flow to compare a direct lift with staged pumping through intermediate sumps. Follow the selected model’s seal inspection schedule and have abnormal oil condition investigated.',
    'A 5 tonne winch provides 5,000 kg of line pull and typically serves shafts of 120–300 metres. It needs two independent brakes, overwind protection and daily rope checks.': 'Rated line pull is not enough to specify a hoisting installation. Rope capacity, speed, load, shaft arrangement and braking need an engineered selection. Confirm service and emergency braking, overwind protection and rope inspection requirements for the installation.',
    'A jackleg rock drill needs about 100–150 cfm at 6–7 bar, while reverse circulation drilling needs far more air at much higher pressure.': 'Use each tool’s specified air demand and operating pressure, including the number running at once and the duty cycle. Reverse circulation drilling can need a substantially different compressor duty from hand-held tools.',
    'Electrochemical sensors typically last 2–3 years, whether the detector is in use or in the store.': 'Sensor life varies by model, gas exposure and storage conditions; follow the manufacturer’s replacement schedule and investigate failed checks.',
    'Sluices and jigs recover the coarse gold that a centrifugal concentrator is not built to take.': 'Sluices and jigs recover free gold by gravity and can form part of a size-based recovery circuit.',
    'Splitting the feed by size, with coarse material to a sluice or jig and fines to the concentrator, recovers more gold overall.': 'Screening can direct different size fractions to suitable recovery equipment. Confirm the selected machines’ feed limits and test the proposed split; 2 mm is not a universal maximum for centrifugal concentrators.',
}
for old, new in caption_changes.items():
    if old not in informative:
        raise RuntimeError('Expected caption not found: ' + old[:70])
    informative = informative.replace(old, new.replace("'", "\\'"))
informative = informative.replace('+ AI_NOTE,', '+ ILLUSTRATION_NOTE,')

jobs = {j['file']: j for j in json.loads((root / 'generation-prompts.json').read_text())}
extra_alts = {
    'news-gold-3.png': 'A calculator, project binder and rock sample on a planning desk.',
    'news-youth-1.png': 'Geological sampling and survey tools at a generic exploration area.',
    'news-battery-5.png': 'An excavator and wheel loader parked in a generic material-handling area.',
    'explainer-used-equipment-2.jpg': 'The shell, drive and supports of a ball mill at Geevor Mine.',
    'news-battery-2.png': 'Conceptual concrete equipment pads and prepared utility connections.',
    'explainer-ore-4.png': 'Test-comparison checklist covering feed sample, grind, duration, reagent use and recovery.',
    'explainer-power-2.png': 'A conceptual load list covering processing, pumping, lighting and site services.',
    'explainer-rental-4.png': 'Illustrative six-month costs: hire USD 15,000, ownership USD 14,000, or USD 19,000 with lower resale value.',
    'explainer-used-equipment-5.png': 'Illustrative equipment cost: USD 40,000 purchase plus inspection, repairs, delivery and installation totals USD 65,000.',
    'product-dewatering-2.png': 'Conceptual transfer from a lower sump through an upper sump to surface discharge; no pump duty or depth specified.',
    'equipment/website/gold-elution-electrowinning-plant.webp': 'An elution equipment concept with vessels, pumps, an electrowinning cell and guarded access.',
    'equipment/website/wet-pan-mill.webp': 'A wet pan mill with two upright rollers, central drive and circular pan.',
    'equipment/website/submersible-dewatering-pump.webp': 'A submersible pump with screened intake, discharge connection and electrical cable.',
    'equipment/website/5-ton-mine-winch-parallel-drive.webp': 'A wire-rope drum with its motor alongside, connected through a side transmission.',
    'equipment/website/gas-detection-monitor.webp': 'A portable gas monitor with sensor inlets and a blank display.',
    'equipment/website/sluice-box-gold-jig.webp': 'A supported gravity sluice with a feed screen, riffles and capture matting.',
}
def add_alt(match):
    key = match.group(1)
    file = key.removeprefix('social/')
    alt = jobs[file]['alt'] if file in jobs else extra_alts.get(file, extra_alts.get(key))
    if not alt:
        raise RuntimeError('No description: ' + key)
    return f"image: '{key}', imageAlt: '{alt.replace(chr(39), chr(92) + chr(39))}',"
informative = re.sub(r"image: '([^']+)',", add_alt, informative)

# Top-align portrait assets inside landscape product cards to preserve their
# mechanical components. Catalogue covers already have landscape framing.
lines = informative.splitlines()
for i, line in enumerate(lines):
    if "template: 'light-card'" in line and "image: 'social/" in line:
        lines[i] = line.replace('crop },', 'crop: { x: 50, y: 0, zoom: 1 } },')
    if "id: 'IG-" not in line and "image: 'social/explainer-used-equipment-2.jpg'" in line:
        lines[i] = line.replace('crop },', 'crop: { x: 50, y: 40, zoom: 1 } },')
informative = '\n'.join(lines) + ('\n' if informative.endswith('\n') else '')

# Required attribution for the reused CC BY-SA photograph, with source and
# cropping stated beside the caption. Generated visuals retain internal provenance.
informative = informative.replace("hashtags: ['#UsedEquipment'", "hashtags: ['#UsedEquipment'")
parts = informative.split("    id: 'IG-29',", 1)
before, used = parts
used, after = used.split("    id: 'IG-30',", 1)
used = used.replace("+ ILLUSTRATION_NOTE,", "+ ILLUSTRATION_NOTE + '\\n\\nBall mill photo: Nilfanion, Geevor Mine 13, Wikimedia Commons (https://commons.wikimedia.org/wiki/File:Geevor_Mine_13.jpg), CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/). Cropped and overlaid with text; this photo slide is shared under the same licence.',")
informative = before + "    id: 'IG-29'," + used + "    id: 'IG-30'," + after

# Capture a reviewable assignment manifest without parsing private project data.
assignments = []
for block in re.split(r'\n  \{\n    id: ', informative)[1:]:
    post = re.match(r"'(IG-\d+)'", block).group(1)
    for line in block.splitlines():
        if "image: '" in line:
            key = re.search(r"image: '([^']+)'", line).group(1)
            assignments.append({'post': post, 'slide': re.search(r"id: '([^']+)'", line).group(1), 'image': key})
(root / 'assignments.json').write_text(json.dumps(assignments, indent=2) + '\n')
post_file.write_text(news + marker + informative)
print(f'{len(assignments)} informative content slides assigned. News content preserved.')
