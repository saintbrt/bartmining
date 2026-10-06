# Product photos

## Website-ready imagery

The English and Kiswahili catalogues share `src/data/equipment-imagery.json`.
Each product selects an optimised WebP in `public/equipment/website/` before
the legacy slug-named image. The manifest distinguishes a generated equipment
illustration from a retained catalogue reference for internal asset records.
Public captions and alt text describe the machine using
`src/data/equipment-image-copy.json` in both languages. Follow the strict
public-copy rule in `docs/editorial-standard.md`; do not expose production-method labels.

Cards retain their 4:3 slot. Product heroes use 16:9 on desktop and 4:3 on
phones. Both use `contain` so a tall helmet, drill, tower or complete machine
is not cropped into a wide strip. Do not restore a blanket `cover` crop.

For a new reviewed master, run:

    node scripts/prepare-equipment-image.mjs /path/to/master.png product-slug

The encoder preserves the full composition, converts to WebP and never
enlarges the source pixels. Select the resulting path and correct `kind`
in the manifest. Generated images are generic illustrations, not evidence
of an exact offered model, a stocked unit or a customer's installation.

The prompt set and baseline review are in `docs/equipment-image-prompts-2026-10-06.json`
and `docs/equipment-image-review-2026-10-06.md`. Run
`node scripts/audit-equipment-images.mjs` after changing the manifest or assets,
then check cards and heroes on desktop and mobile in both languages.

## Legacy sources and article references

The instructions below describe the fallback files. Keep existing sources
that are still referenced by articles; the website-ready image set uses
separate paths and does not overwrite these shared article covers.

For a product without a selected website-ready asset, a photo named after
its slug is picked up as the fallback at build time. For an existing manifest
entry, prepare the replacement master and update that entry instead.

    public/equipment/1-ton-winch.jpg        ->  /equipment/1-ton-winch
    public/equipment/slurry-pump.webp       ->  /equipment/slurry-pump
    public/equipment/jaw-crusher.png        ->  /equipment/jaw-crusher

Accepted extensions, in priority order: .jpg .jpeg .png .webp .avif

Products with no photo yet fall back to a drawn placeholder showing a line
mark for their category, so the grid keeps its shape and never renders a
broken image. Delete nothing to "turn placeholders off"; they disappear on
their own as soon as a matching file exists.

Suggested: landscape, 4:3, at least 1200px wide, product filling the frame
on a plain background.

Files ending `-alt` are spare alternates that are not wired to anything. To
use one, rename it over the live file of the same slug. Delete them freely
if you don't want them.

Avoid assigning the same image to materially different equipment classes.
The old winch sources are duplicates; the website-ready winch illustrations
are distinct industrial references and are selected by the manifest.

## Also used as article covers

Ten insight articles point their cover image at a file in this folder, set in
`src/data/insights.ts`. Renaming or deleting one of these leaves the article
with a broken hero, and no placeholder catches it — the article covers have no
fallback the way the product cards do:

    modular-gold-plant.jpg          gold-plant-setup-cost
    cil-cip-plant.jpg               cil-vs-cip-vs-heap-leach
    centrifugal-gold-concentrator.jpg  gravity-vs-cyanide-gold-recovery
    shaking-table-gold.jpg          plant-test-work-guide
    diesel-generator-mining.jpg     off-grid-mine-power
    rc-drilling-rig.jpg             drilling-services-tanzania, gold-exploration-tanzania
    jaw-crusher.jpg                 mining-equipment-africa
    mine-management-software.jpg    equipment-rental-tanzania
    mine-hoist-headframe.jpg        mining-services-south-africa

Swapping the file for a better photo of the same subject is fine and needs no
code change. Changing the subject means updating `imageAlt` in the same entry.

## Slugs

    1-ton-winch                       1 Tonne Electric Winch
    2-ton-winch                       2 Tonne Electric Winch
    5-ton-mine-winch                  5 Tonne Mine Winch
    mine-hoist-headframe              Mine Hoist & Headframe Systems
    wire-rope-slings-lifting-tackle   Wire Rope, Slings & Lifting Tackle
    centrifugal-gold-concentrator     Centrifugal Gold Concentrator
    gold-elution-electrowinning-plant Elution & Electrowinning Plant
    cil-cip-plant                     CIL & CIP Gold Plants
    modular-gold-plant                Modular Gold Processing Plant
    ball-mill-gold-ore                Ball Mill for Gold Ore
    jaw-crusher                       Jaw Crusher
    shaking-table-gold                Gold Shaking Table
    rc-drilling-rig                   Reverse Circulation (RC) Drilling Rig
    gold-metal-detector               Gold Prospecting Metal Detector
    slurry-pump                       Slurry Pump
    submersible-dewatering-pump       Submersible Dewatering Pump
    mining-safety-helmet-cap-lamp     Mining Safety Helmet & Cap Lamp
    self-contained-self-rescuer       Self-Contained Self-Rescuer (SCSR)
    gas-detection-monitor             Multi-Gas Detection Monitor
    fall-arrest-harness               Fall Arrest Harness & Height Safety
    mine-ventilation-fan              Mine Ventilation Fan
    mine-management-software          Mine Management Software
    fleet-management-system           Mining Fleet Management System
    geological-modelling-software     Geological Modelling & Resource Software
    diesel-generator-mining           Diesel Generator for Mining
    air-compressor-mining             Mining Air Compressor
    hydraulic-excavator               Hydraulic Excavator
    wheel-loader                      Wheel Loader
    dump-truck                        Dump Truck
    bulldozer                         Bulldozer
    motor-grader                      Motor Grader
    backhoe-loader                    Backhoe Loader
    vibratory-roller                  Vibratory Roller
    tower-crane                       Tower Crane
    concrete-mixer                    Concrete Mixer Truck
    cone-crusher                      Cone Crusher
    hammer-mill                       Hammer Mill
    wet-pan-mill                      Wet Pan Mill
    vibrating-screen                  Vibrating Screen
    trommel-screen                    Trommel Screen
    belt-conveyor                     Belt Conveyor
    hydrocyclone                      Hydrocyclone
    filter-press                      Filter Press
    vibrating-feeder                  Vibrating Feeder
    pneumatic-rock-drill              Pneumatic Rock Drill (Jackleg)
    lighting-tower                    Lighting Tower
