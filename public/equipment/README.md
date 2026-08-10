# Product photos

Drop a photo here named after the product slug and redeploy. Nothing else
needs changing: the catalogue page and the product page both pick it up
automatically at build time.

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

Several products can share one photo: just save the same image under each
slug. The three winches currently do this.

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
