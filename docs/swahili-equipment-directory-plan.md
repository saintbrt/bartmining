# Kiswahili equipment directory: mirror the existing catalogue

Revised implementation plan, 5 October 2026. The catalogue and all 50 Kiswahili product pages have now been implemented locally using this approach. Validation and editorial review are recorded in `docs/swahili-equipment-review-2026-10-05.md`.

## Approach

Copy the existing English equipment directory and product-page format into `/equipments-swahili`, then rewrite all reader-facing content in natural, grammatically correct Kiswahili. Keep the current design, category order, product cards, photographs, section order, tables and enquiry flow.

The existing English directory is `/equipment`. Its URLs stay as they are. The new Kiswahili directory uses the requested `/equipments-swahili` path, with the same product slugs beneath it.

This is a catalogue translation using the existing format. It requires two new route files and translated content, with small updates to the links and page metadata that connect them. Reuse existing components and utilities where they already fit; copying the current route templates is sufficient for this pass.

## What gets copied

| Existing English page | Kiswahili counterpart |
| --- | --- |
| `/equipment` | `/equipments-swahili` |
| `/equipment/{slug}` | `/equipments-swahili/{slug}` |
| `/equipment/ball-mill-gold-ore` | `/equipments-swahili/ball-mill-gold-ore` |

The current catalogue contains 50 products across eight categories. All 50 have existing local photographs. The translated catalogue will include every product, rather than another selected overview.

| Category | Kiswahili label | Products |
| --- | --- | ---: |
| Earthmoving and construction | Mitambo ya kuchimba na ujenzi | 9 |
| Hoisting and lifting | Vifaa vya kuinua na kupandisha mizigo | 5 |
| Gold processing and recovery | Uchakataji na utenganishaji wa dhahabu | 20 |
| Exploration and drilling | Utafiti wa madini na uchimbaji wa sampuli | 3 |
| Pumps and dewatering | Pampu na utoaji wa maji | 2 |
| Mine safety | Vifaa vya usalama migodini | 5 |
| Mine software | Programu za usimamizi wa migodi | 3 |
| Power and compressed air | Umeme na hewa iliyobanwa | 3 |
| **Total** | | **50** |

## 1. Duplicate the directory and product templates

Copy `src/app/equipment/page.tsx` into `src/app/equipments-swahili/page.tsx`. Preserve its introductory area, category sections, cards and supporting links. Translate the text and point every product card to the Kiswahili product route.

Copy `src/app/equipment/[slug]/page.tsx` into `src/app/equipments-swahili/[slug]/page.tsx`. Preserve the hero, photo, existing explanatory sections, specifications, applications, maintenance, FAQs, contents, related products and enquiry action. Generate the same 50 product slugs and retain the existing behaviour for unknown slugs.

Reuse the equipment photographs and existing presentation components. Use the same visual format on desktop and phones. This pass does not add search, filters or a different page structure.

## 2. Rewrite the complete content in Kiswahili

Add a Kiswahili catalogue using the existing equipment data shape, for example `src/data/equipment-catalogue-sw.ts`. Keep the original product slugs, category identifiers, image references and related-product identities so the two versions remain easy to match.

Rewrite every visible field: product names, titles, descriptions, introductions, category labels, specification labels and qualifications, application descriptions, maintenance instructions, questions and answers, image descriptions and enquiry messages. Translate the page interface too, including breadcrumbs, section headings, table headers, contents links and buttons.

Write from the meaning of the English explanation. Use complete, connected sentences with proper Kiswahili grammar, and explain familiar English trade terms where useful. Preserve the depth of the source explanation. Tables and lists keep their current function, while introductory and explanatory prose must read naturally.

Keep measurements, units, dates, model references and technical qualifications equivalent. Generic specification ranges must remain identified as generic. Translation must not introduce new prices, capacity promises or recovery guarantees. Apply `docs/editorial-standard.md` to the prose and have substantial translations reviewed for fluent Kiswahili.

Four products contain additional guides: elution/electrowinning, CIL/CIP, metal detectors and centrifugal concentrators. Copy their guide content into `src/content/equipment/sw/` and translate all 16 existing sections, including diagram labels, captions, table cells and supporting links. Keep their existing placement within the product pages.

Work through the catalogue by category, reviewing each group before moving on. Finish all 50 product translations and the four extended guides before replacing the public overview.

## 3. Connect the catalogue

Place “Vifaa vya uchimbaji” in the footer, pointing to `/equipments-swahili`. Keep the existing main navigation. `/insights-swahili` remains the separate collection for articles.

Directory cards, related equipment and product references within Kiswahili content should lead to the corresponding Kiswahili products. Update the six existing Kiswahili town pages so their product names, cards and directory breadcrumbs use the new catalogue. Preserve those town URLs.

Add direct language links between equivalent English and Kiswahili pages. Update the English directory's current Kiswahili link and replace the ball-mill product's incorrect language pairing with the actual translated product. The ball-mill pricing article retains its article URL and can remain related reading.

Replace the partial `/vifaa-vya-uchimbaji` overview with an exact permanent redirect to `/equipments-swahili`. Keep `/vifaa-vya-uchimbaji/{town}` routes working; the redirect must apply only to the overview. Update internal links to the new destination.

## 4. Update page identity and discovery

Give each new page its own canonical URL, Kiswahili title and description, and reciprocal language alternates with the equivalent English page. Mark Kiswahili content with the appropriate language attribute.

Reuse the existing structured-data helpers, making the small path/language adjustments needed for the translated routes. Product, FAQ, breadcrumb and directory data must match the visible content and actual page URL.

Add the new directory and 50 product URLs to the sitemap. Remove the redirected overview entry while preserving the town pages. Update `llms.txt` to describe and list the complete Kiswahili catalogue.

## 5. Check the finished catalogue

Verify that all 50 products appear in the directory and open complete Kiswahili pages. Compare technical values and qualifications with the English source, and read the prose for grammar, clarity and flow. Check that the extended guides, diagrams, photos, specifications, maintenance and FAQs are fully translated.

Check product cards, related links, language links, footer discovery, canonicals and structured data. Confirm that the overview redirects correctly, all six town pages still work, and English equipment pages retain their current format.

Run the existing editorial audit, TypeScript check, production build and diff checks. Review representative ordinary product pages and all four extended guides on phone and desktop screens, checking tables, images and contents links.

The result should let a Kiswahili reader browse the same full catalogue, follow the same familiar page format and understand the equipment well enough to prepare a relevant enquiry.

## Main files

| File or area | Change |
| --- | --- |
| `src/app/equipments-swahili/page.tsx` | Copy and translate the English directory. |
| `src/app/equipments-swahili/[slug]/page.tsx` | Copy and translate the English product template. |
| `src/data/equipment-catalogue-sw.json` | Store complete Kiswahili content for all 50 products. |
| `src/data/equipment-catalogue-sw.ts` | Match translations to the existing catalogue identities and category order. |
| `src/content/equipment/sw/` | Copy and translate the four extended guides. |
| English equipment routes | Update language links and alternates. |
| Kiswahili town routes and relevant content links | Connect to translated products and the new directory. |
| Footer and `next.config.ts` | Add footer discovery and replace the partial overview. |
| SEO helper, sitemap and `llms.txt` | Identify and list the translated routes correctly. |

## Complete target product inventory

All proposed URLs below use `/equipments-swahili/` followed by the existing catalogue slug. Names are the English source names for inventory matching; the new pages and listing will display reviewed Kiswahili names.

| Category | Current product | Proposed Kiswahili product URL |
| --- | --- | --- |
| earthmoving | Hydraulic Excavator | /equipments-swahili/hydraulic-excavator |
| earthmoving | Wheel Loader | /equipments-swahili/wheel-loader |
| earthmoving | Dump Truck | /equipments-swahili/dump-truck |
| earthmoving | Bulldozer | /equipments-swahili/bulldozer |
| earthmoving | Motor Grader | /equipments-swahili/motor-grader |
| earthmoving | Backhoe Loader | /equipments-swahili/backhoe-loader |
| earthmoving | Vibratory Roller | /equipments-swahili/vibratory-roller |
| earthmoving | Tower Crane | /equipments-swahili/tower-crane |
| earthmoving | Concrete Mixer Truck | /equipments-swahili/concrete-mixer |
| processing | Cone Crusher | /equipments-swahili/cone-crusher |
| processing | Hammer Mill | /equipments-swahili/hammer-mill |
| processing | Wet Pan Mill | /equipments-swahili/wet-pan-mill |
| processing | Vibrating Screen | /equipments-swahili/vibrating-screen |
| processing | Trommel Screen | /equipments-swahili/trommel-screen |
| processing | Belt Conveyor | /equipments-swahili/belt-conveyor |
| processing | Hydrocyclone | /equipments-swahili/hydrocyclone |
| processing | Filter Press | /equipments-swahili/filter-press |
| processing | Vibrating Feeder | /equipments-swahili/vibrating-feeder |
| exploration | Pneumatic Rock Drill (Jackleg) | /equipments-swahili/pneumatic-rock-drill |
| power | Lighting Tower | /equipments-swahili/lighting-tower |
| processing | Rotary Scrubber | /equipments-swahili/rotary-scrubber |
| processing | Sluice Box and Gold Jig | /equipments-swahili/sluice-box-gold-jig |
| processing | Alluvial Gold Wash Plant | /equipments-swahili/alluvial-gold-wash-plant |
| hoisting | 1 Tonne Electric Winch | /equipments-swahili/1-ton-winch |
| hoisting | 2 Tonne Electric Winch | /equipments-swahili/2-ton-winch |
| hoisting | 5 Tonne Mine Winch | /equipments-swahili/5-ton-mine-winch |
| hoisting | Mine Hoist & Headframe Systems | /equipments-swahili/mine-hoist-headframe |
| hoisting | Wire Rope, Slings & Lifting Tackle | /equipments-swahili/wire-rope-slings-lifting-tackle |
| processing | Centrifugal Gold Concentrator | /equipments-swahili/centrifugal-gold-concentrator |
| processing | Elution & Electrowinning Plant | /equipments-swahili/gold-elution-electrowinning-plant |
| processing | CIL & CIP Gold Plants | /equipments-swahili/cil-cip-plant |
| processing | Gold Leaching Tank (Agitation Tank) | /equipments-swahili/leaching-tank |
| processing | Modular Gold Processing Plant | /equipments-swahili/modular-gold-plant |
| processing | Ball Mill for Gold Ore | /equipments-swahili/ball-mill-gold-ore |
| processing | Jaw Crusher | /equipments-swahili/jaw-crusher |
| processing | Gold Shaking Table | /equipments-swahili/shaking-table-gold |
| exploration | Reverse Circulation (RC) Drilling Rig | /equipments-swahili/rc-drilling-rig |
| exploration | Gold Prospecting Metal Detector | /equipments-swahili/gold-metal-detector |
| pumping | Slurry Pump | /equipments-swahili/slurry-pump |
| pumping | Submersible Dewatering Pump | /equipments-swahili/submersible-dewatering-pump |
| safety | Mining Safety Helmet & Cap Lamp | /equipments-swahili/mining-safety-helmet-cap-lamp |
| safety | Self-Contained Self-Rescuer (SCSR) | /equipments-swahili/self-contained-self-rescuer |
| safety | Multi-Gas Detection Monitor | /equipments-swahili/gas-detection-monitor |
| safety | Fall Arrest Harness & Height Safety | /equipments-swahili/fall-arrest-harness |
| safety | Mine Ventilation Fan | /equipments-swahili/mine-ventilation-fan |
| software | Mine Management Software | /equipments-swahili/mine-management-software |
| software | Mining Fleet Management System | /equipments-swahili/fleet-management-system |
| software | Geological Modelling & Resource Software | /equipments-swahili/geological-modelling-software |
| power | Diesel Generator for Mining | /equipments-swahili/diesel-generator-mining |
| power | Mining Air Compressor | /equipments-swahili/air-compressor-mining |
