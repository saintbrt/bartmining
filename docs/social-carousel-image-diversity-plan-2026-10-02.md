# Social carousel image diversity plan — 2 October 2026

This is the plan for the next editing pass. **Implemented: 51 distinct content assets are wired into 14 active posts / 66 slides, including 6 new licensed photographs, 28 new generated illustrations and 17 existing assets. IG-03 and IG-15 are removed, Allan’s introduction is updated, and the shared CTA is unchanged. Factual sign-off remains pending.** It supersedes the earlier image-coverage checklist for visual diversity: filling every image slot did not resolve repetition.

## Scope and required decisions

- [ ] Remove **IG-03 — When Is Gravity Recovery Enough?**, including its publishing-schedule entry. Reserve the ID; do not renumber other posts.
- [ ] Update Allan’s introduction and source bio with business development **and partnerships**, project support across Tanzania and the requested client-service commitment.
- [ ] Make every content image unique across the active set; different crops of the same photo do not count as new images.
- [ ] Keep the shared CTA image, crop, layout and WhatsApp number exactly as they are.
- [ ] Keep product content pages on light cards; retain existing slide IDs, text sources and technical claims unless a requested copy change requires an update.
- [ ] Keep Bartholomew’s initials-only introduction.
- [ ] Add the prepared generated image of a fictional person processing river sediment with a sluice to the alluvial cover. This is an explicit exception to the previous no-people stock/generation rule for this cover, not permission to invent a Bart Mining person or site.
- [ ] Source suitable existing or licensed imagery first. Generate genuinely missing scenes instead of substituting unrelated machinery.
- [ ] Update captions, image credits, rights records and AI disclosures to match the final assets; remove credits for images no longer used.

After removing IG-03: **15 posts / 65 slides**, comprising **50 content image slots**, **14 shared CTA pages** and **1 intentional initials-only page**. Before implementation, retained content used **16 repeated image files**. The target is **zero repeated content images**; any necessary exception must be identified and explained in this checklist.

## Allan’s revised introduction

“Allan is Head of Business Development and Partnerships at Bart Mining. With extensive experience supporting projects across Tanzania, he is committed to working tirelessly to meet your needs and exceed your expectations.”

Keep the title and introductory copy readable on the portrait card. Expand the caption to describe equipment sourcing, partnerships, procurement planning, delivery coordination, and repair and maintenance coordination. Add the newly supplied role and experience facts to `src/data/authors.ts` so the biography and social copy stay consistent. Treat the client-service wording as a commitment, without adding guarantees about outcomes or turnaround times.

## Page-by-page checklist

Every current page is listed below, including CTA pages and the six pages scheduled for deletion. “Keep” means retain that asset on this page and remove competing uses elsewhere. All page implementation checkboxes are complete, including removal of the six IG-03 pages. The separate asset-prepared column records the completed sourcing work. Exact files in that column supersede earlier open-ended image briefs.

### IG-11 — Alluvial Gold Processing During the Rains

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — How to Process Alluvial Gold During the Rains | `equipment/rotary-scrubber.jpeg` | The scrubber repeats three times and does not establish river gold processing. | **Replace.** Use the generated fictional-person sluice scene in a generic East African river setting; disclose it as an illustration. | [x] [river-sluice-processing-v2.png](../tools/social-carousel/images/sourcing-review/river-sluice-processing-v2.png) · 1122 × 1402 · new generated illustration |
| [x] | 2 · `clay` — Clay Can Trap Gold During the Rainy Season | `equipment/rotary-scrubber.jpeg` | The same scrubber does not illustrate the clay problem. | **Replace.** Close view of wet clay-rich alluvial sediment or clay lumps beside screened gravel. | [x] [alluvial-wet-clay.png](../tools/social-carousel/images/sourcing-review/alluvial-wet-clay.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `scrub` — Scrubbing Releases Gold Trapped in Clay | `equipment/rotary-scrubber.jpeg` | Relevant machinery; eliminate its uses on the cover and clay page. | **Keep exclusively.** Existing rotary scrubber; reserve this photograph for this page only. | [x] [rotary-scrubber.jpeg](../public/equipment/rotary-scrubber.jpeg) · 3968 × 2232 · existing asset |
| [x] | 4 · `two-mm` — This Concentrator Setup Needs Feed Below 2 mm | `equipment/centrifugal-gold-concentrator.jpg` | The concentrator photograph repeats across four pages; screening better illustrates feed preparation. | **Replace.** Fine wet-screening equipment or a clearly visible screen panel used before concentration. | [x] [alluvial-fine-screen.png](../tools/social-carousel/images/sourcing-review/alluvial-fine-screen.png) · 1122 × 1402 · new generated illustration |
| [x] | 5 · `recovery` — Ore Tests Help You Estimate Gold Recovery | `social/exploration-core-trays.jpg` | Core storage is repeated and poorly matched to alluvial recovery; a shaking table adds the requested machinery variation. | **Reassign exclusively.** Existing gold shaking-table photograph, reserved for this page. | [x] [shaking-table-gold.jpg](../public/equipment/shaking-table-gold.jpg) · 4032 × 3024 · existing asset |
| [x] | 6 · `site` — Site Preparation Helps You Manage Heavy Rain | `equipment/submersible-dewatering-pump.jpg` | Relevant distinct equipment for rain management; inspect the crop. | **Keep exclusively.** Existing dewatering-pump photograph. | [x] [submersible-dewatering-pump.jpg](../public/equipment/submersible-dewatering-pump.jpg) · 2560 × 1819 · existing asset |
| [x] | 7 · `cta` — Prepare Your Wash Plant for the Rains | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-07 — Meet Allan Bartholomew

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — Meet Allan Bartholomew | `team/allan-bartholomew.jpg` | Role and introductory copy need the requested expansion. | **Update copy; keep portrait.** Approved Allan portrait; add business development, partnerships, nationwide project support and commitment to clients. | [x] [allan-bartholomew.jpg](../public/team/allan-bartholomew.jpg) · 600 × 682 · existing asset |
| [x] | 2 · `sourcing` — Allan Helps You Source Mining Equipment | `equipment/hammer-mill.jpg` | Hammer-mill photo repeats in the hammer-mill post. | **Replace.** Mining machinery prepared for dispatch in a supplier workshop: a different machine or packaged equipment components. | [x] [mining-equipment-dispatch.png](../tools/social-carousel/images/sourcing-review/mining-equipment-dispatch.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `landed-cost` — Allan Helps You Plan Equipment Costs | `equipment/modular-gold-plant.jpg` | The modular-plant image repeats five times; this page needs procurement and logistics context. | **Replace.** Crated industrial equipment prepared for freight, with no legible invented invoice or price. | [x] [machinery-export-crates.png](../tools/social-carousel/images/sourcing-review/machinery-export-crates.png) · 1122 × 1402 · new generated illustration |
| [x] | 4 · `delivery` — Allan Coordinates Equipment Delivery | `social/equipment-delivery-generated.png` | Relevant, but repeated in the delivery and cost posts; replace those uses. | **Keep exclusively.** Existing generated lowbed trailer carrying a jaw crusher; reserved for Allan’s delivery page. | [x] [equipment-delivery-generated.png](../tools/social-carousel/images/equipment-delivery-generated.png) · 1122 × 1402 · existing asset |
| [x] | 5 · `maintenance` — Allan Coordinates Repairs and Maintenance | `social/pump-maintenance-generated.png` | Relevant, but repeated in the delivery support page; replace that use. | **Keep exclusively.** Existing generated pump-maintenance bench; reserved for Allan’s maintenance page. | [x] [pump-maintenance-generated.png](../tools/social-carousel/images/pump-maintenance-generated.png) · 1122 × 1402 · existing asset |
| [x] | 6 · `cta` — Discuss Your Equipment Needs with Allan | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-05 — Centrifugal Gold Concentrators

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `single` — A Centrifugal Concentrator Recovers Free Gold | `equipment/centrifugal-gold-concentrator.jpg` | The photograph repeats in alluvial and mercury-free posts; replace those other uses. | **Keep exclusively.** Existing centrifugal concentrator, reserved for this product introduction. | [x] [centrifugal-gold-concentrator.jpg](../public/equipment/centrifugal-gold-concentrator.jpg) · 1500 × 1500 · existing asset |

### IG-03 — When Is Gravity Recovery Enough?

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — When Is Gravity Recovery Enough? | `equipment/shaking-table-gold.jpg` | User explicitly requested deletion of this post. | **Delete page with the post.** Remove from active POSTS; reserve IG-03. | Not needed: post deletion or intentional initials |
| [x] | 2 · `gravity` — Gravity Recovers Gold That Is Free from Rock | `equipment/centrifugal-gold-concentrator.jpg` | User explicitly requested deletion of this post. | **Delete page with the post.** Remove from active POSTS; reserve IG-03. | Not needed: post deletion or intentional initials |
| [x] | 3 · `cyanide` — Leaching Can Recover Gold That Gravity Misses | `equipment/leaching-tank.jpg` | User explicitly requested deletion of this post. | **Delete page with the post.** Remove from active POSTS; reserve IG-03. | Not needed: post deletion or intentional initials |
| [x] | 4 · `stat` — Gold Particle Size Affects Gravity Recovery | `equipment/centrifugal-gold-concentrator.jpg` | User explicitly requested deletion of this post. | **Delete page with the post.** Remove from active POSTS; reserve IG-03. | Not needed: post deletion or intentional initials |
| [x] | 5 · `decide` — Extra Recovery Needs to Justify the Cost | `social/exploration-core-trays.jpg` | User explicitly requested deletion of this post. | **Delete page with the post.** Remove from active POSTS; reserve IG-03. | Not needed: post deletion or intentional initials |
| [x] | 6 · `cta` — Discuss the Recovery Options for Your Ore | `social/bart-mining-final.jpeg` | User explicitly requested deletion of this post. | **Delete page with the post.** Remove from active POSTS; reserve IG-03. | Not needed: post deletion or intentional initials |

### IG-12 — Equipment Delivery to the Lake Zone

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — Mining Equipment Delivery to the Lake Zone | `social/equipment-delivery-generated.png` | The crusher-delivery illustration repeats Allan’s slide. | **Replace.** A lowbed truck carrying an excavator towards a rural industrial site. | [x] [excavator-transport.jpg](../tools/social-carousel/images/sourcing-review/excavator-transport.jpg) · 3816 × 2362 · new licensed photograph |
| [x] | 2 · `origins` — Delivery Can Start from Dar es Salaam or Mwanza | `social/lake-zone-route-map.png` | Useful specific context; remove the repeated map from the delivery-time page. | **Keep exclusively.** Existing dispatch/destination map. | [x] [lake-zone-route-map.png](../tools/social-carousel/images/lake-zone-route-map.png) · 4000 × 3350 · existing asset |
| [x] | 3 · `times` — Delivery Time Depends on the Route and Cargo | `social/lake-zone-route-map.png` | The user specifically requests equipment transport rather than another map. | **Replace.** A flatbed truck carrying secured generator sets, with believable loading and tie-downs. | [x] [generator-delivery-truck.png](../tools/social-carousel/images/sourcing-review/generator-delivery-truck.png) · 1122 × 1402 · new generated illustration |
| [x] | 4 · `support` — Insurance and Parts Need to Be Agreed | `social/pump-maintenance-generated.png` | The maintenance-bench image repeats Allan’s page and does not distinguish parts logistics. | **Replace.** Organised replacement wear parts or spare components packed for delivery. | [x] [packed-mining-spare-parts.png](../tools/social-carousel/images/sourcing-review/packed-mining-spare-parts.png) · 1122 × 1402 · new generated illustration |
| [x] | 5 · `cta` — Request a Delivery Quote for Your Site | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-10 — Gold Plant Costs in Tanzania

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — What Does a Gold Plant Cost in Tanzania? | `equipment/modular-gold-plant.jpg` | The modular-plant render repeats across five pages. | **Replace.** Distinct wide view of a gold-processing plant, preferably a licensed actual plant photograph. | [x] [gold-plant-sunrise.jpg](../tools/social-carousel/images/sourcing-review/gold-plant-sunrise.jpg) · 3072 × 2304 · new licensed photograph |
| [x] | 2 · `b1` — Equipment for a Gravity-Only Plant | `equipment/shaking-table-gold.jpg` | The shaking-table photograph appears four times and does not show a plant setup. | **Replace.** Small gravity-processing setup with a sluice, jig or shaking table; distinct from every alluvial image. | [x] [small-gravity-plant.png](../tools/social-carousel/images/sourcing-review/small-gravity-plant.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `b2` — Equipment for Gravity Recovery and CIL | `equipment/leaching-tank.jpg` | The leaching-tank photograph repeats on the next page and in the process comparison. | **Replace.** Distinct gravity and leach equipment view, or a plausible illustrative tank circuit. | [x] [gravity-and-leach-plant.png](../tools/social-carousel/images/sourcing-review/gravity-and-leach-plant.png) · 1122 × 1402 · new generated illustration |
| [x] | 4 · `b3` — Equipment for a Larger CIL Plant | `equipment/leaching-tank.jpg` | Using the same tank photo as the smaller configuration fails to distinguish the pages. | **Replace.** A different larger multi-tank processing installation, with enough visual space for the price range. | [x] [large-agitated-tank-plant.png](../tools/social-carousel/images/sourcing-review/large-agitated-tank-plant.png) · 1122 × 1402 · new generated illustration |
| [x] | 5 · `b4` — Freight and Import Costs Add to the Price | `social/equipment-delivery-generated.png` | The delivery-truck image repeats Allan’s page; freight/import costs need a separate visual. | **Replace.** Ocean-freight containers or machinery being prepared for export at a port. | [x] [freight-port.jpg](../tools/social-carousel/images/sourcing-review/freight-port.jpg) · 5568 × 3712 · new licensed photograph |
| [x] | 6 · `cta` — Discuss the Full Cost of Your Gold Plant | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-08 — Meet Bartholomew Ambrose

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — Meet Our Founder, Bartholomew Ambrose | `No image — intentional` | Intentional design exception; no image is missing. | **Keep intentional initials.** Keep BA initials and the current plain background; do not invent a founder portrait. | Not needed: post deletion or intentional initials |
| [x] | 2 · `career` — His Experience Includes Resolute and Barrick | `social/exploration-core-trays.jpg` | The same core-storage photo is repeated three times in this post. | **Replace.** Use the generated people-free exploration drill. The downloaded drill photographs contained people, and the website image was too small for full bleed. | [x] [exploration-core-drill.png](../tools/social-carousel/images/sourcing-review/exploration-core-drill.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `where` — His Work Has Taken Him Across Four Continents | `social/exploration-core-trays.jpg` | Generic exploration context with the existing disclaimer; remove all other uses. | **Keep exclusively.** Existing licensed core-storage photograph, reserved for this page. | [x] [exploration-core-trays.jpg](../tools/social-carousel/images/exploration-core-trays.jpg) · 3648 × 2736 · existing asset |
| [x] | 4 · `principal` — Bartholomew Leads Our Technical Consulting | `social/exploration-core-trays.jpg` | Another core-storage image fails to distinguish technical consulting from career history. | **Replace.** Geological maps, core-logging records or an anonymous technical-study workspace without readable invented results. | [x] [geology-study-desk.jpg](../tools/social-carousel/images/sourcing-review/geology-study-desk.jpg) · 3552 × 4736 · new licensed photograph |
| [x] | 5 · `cta` — Discuss Your Mining Project with Us | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-02 — CIL, CIP and Heap Leaching

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — How Do CIL, CIP and Heap Leaching Differ? | `equipment/leaching-tank.jpg` | Remove its repeated uses on the CIP and cost pages. | **Keep exclusively.** Existing leaching-tank photograph, reserved for this comparison cover. | [x] [leaching-tank.jpg](../public/equipment/leaching-tank.jpg) · 1920 × 1440 · existing asset |
| [x] | 2 · `cil` — CIL Leaches Gold and Collects It in the Same Tanks | `equipment/cil-cip-plant.jpg` | Existing render has a visible watermark and repeats in the modular post. | **Replace.** Use the prepared distinct generic CIL agitated-vessel illustration; technical review pending. | [x] [cil-agitated-tank-illustration.png](../tools/social-carousel/images/sourcing-review/cil-agitated-tank-illustration.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `cip` — CIP Collects Gold After the Leaching Stage | `equipment/leaching-tank.jpg` | The cover photo repeats and does not visually distinguish separate CIP stages. | **Replace.** Distinct downstream carbon-adsorption tank stage; verified photograph or technically reviewed illustration. | [x] [carbon-adsorption-tanks.png](../tools/social-carousel/images/sourcing-review/carbon-adsorption-tanks.png) · 1122 × 1402 · new generated illustration |
| [x] | 4 · `heap` — Heap Leaching Treats Ore on a Lined Pad | `social/heap-leach-colorado.jpg` | Distinct and relevant; retain attribution and the illustrative-site disclosure. | **Keep exclusively.** Existing licensed Colorado heap-leaching photograph. | [x] [heap-leach-colorado.jpg](../tools/social-carousel/images/heap-leach-colorado.jpg) · 3008 × 1574 · existing asset |
| [x] | 5 · `fit` — Ore Tests Help You Choose the Process | `social/exploration-core-trays.jpg` | Core storage repeats Bartholomew’s page and does not show process-selection testing. | **Replace.** Representative ore samples prepared for metallurgical laboratory tests. | [x] [ore-sample-selection.jpg](../tools/social-carousel/images/sourcing-review/ore-sample-selection.jpg) · 6000 × 4000 · new licensed photograph |
| [x] | 6 · `cta` — Discuss the Right Process for Your Ore | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-09 — Mercury-Free Gold Recovery

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — How to Recover Gold Without Mercury | `equipment/shaking-table-gold.jpg` | The shaking-table photograph is reserved for the alluvial post. | **Replace.** Distinct sluice or gravity-recovery installation establishing mercury-free processing. | [x] [standalone-gravity-sluice.png](../tools/social-carousel/images/sourcing-review/standalone-gravity-sluice.png) · 1122 × 1402 · new generated illustration |
| [x] | 2 · `s2` — Mercury Can Leave Fine Gold in the Tailings | `equipment/shaking-table-gold.jpg` | The same shaker is repeated; this page discusses losses and fine material. | **Replace.** Tailings sediment or a tray of fine mineral material, without pretending visible particles prove gold content. | [x] [fine-tailings-sediment.png](../tools/social-carousel/images/sourcing-review/fine-tailings-sediment.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `s3` — A Concentrator Recovers Gold Free from Rock | `equipment/centrifugal-gold-concentrator.jpg` | The product photograph is reserved for IG-05. | **Replace.** A different centrifugal concentrator in a genuine installation, or a technically reviewed illustration. | [x] [centrifugal-concentrator-installation.png](../tools/social-carousel/images/sourcing-review/centrifugal-concentrator-installation.png) · 1122 × 1402 · new generated illustration |
| [x] | 4 · `s4` — Concentrate Cleaning Comes Before Smelting | `equipment/shaking-table-gold.jpg` | A recrop of the old photo will not provide a new visual. | **Replace.** A different shaking table with concentrate channels visible; prefer an actual licensed equipment photograph. | [x] [shaking-tables-geevor.jpg](../tools/social-carousel/images/sourcing-review/shaking-tables-geevor.jpg) · 3264 × 2448 · new licensed photograph |
| [x] | 5 · `s5` — A Gravity Circuit Needs No Mercury | `equipment/centrifugal-gold-concentrator.jpg` | Repeats the concentrator again; needs a new visual for the circuit message. | **Replace.** Distinct gravity equipment group or clean concentrate-processing setup. | [x] [gravity-concentrate-circuit.png](../tools/social-carousel/images/sourcing-review/gravity-concentrate-circuit.png) · 1122 × 1402 · new generated illustration |
| [x] | 6 · `cta` — Discuss Mercury-Free Gold Recovery | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-06 — Modular Gold Plants

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — A Modular Plant Needs a Prepared Site | `equipment/modular-gold-plant.jpg` | Remove its other four uses. | **Keep exclusively.** Existing modular-plant illustration, reserved for this introduction. | [x] [modular-gold-plant.jpg](../public/equipment/modular-gold-plant.jpg) · 2000 × 1381 · existing asset |
| [x] | 2 · `cil` — Ore Tests Determine the Modules You Need | `equipment/cil-cip-plant.jpg` | CIL/CIP image is reserved for the process comparison. | **Replace.** Distinct processing module or skid-mounted equipment selected for a modular plant. | [x] [skid-mounted-processing-module.png](../tools/social-carousel/images/sourcing-review/skid-mounted-processing-module.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `elution` — The Site Needs to Be Ready for Installation | `equipment/modular-gold-plant.jpg` | The modular render repeats the cover and does not show site preparation. | **Replace.** Prepared concrete foundations, utility connections or an equipment unloading area. | [x] [prepared-equipment-foundations.png](../tools/social-carousel/images/sourcing-review/prepared-equipment-foundations.png) · 1122 × 1402 · new generated illustration |
| [x] | 4 · `cost` — Site Costs Form Part of the Plant Budget | `equipment/modular-gold-plant.jpg` | The modular render repeats again; show a tangible additional site cost. | **Replace.** Distinct power-supply equipment or site utility installation; consider unused generator photograph. | [x] [diesel-generator-mining.jpg](../public/equipment/diesel-generator-mining.jpg) · 1280 × 960 · existing asset |
| [x] | 5 · `cta` — Discuss a Modular Plant for Your Site | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-13 — Ball Mills

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — A Ball Mill Grinds Ore to Release Gold | `social/ball-mill-geevor.jpg` | Relevant historical equipment illustration; retain its attribution and disclaimer. | **Keep exclusively.** Existing licensed Geevor ball-mill photograph. | [x] [ball-mill-geevor.jpg](../tools/social-carousel/images/ball-mill-geevor.jpg) · 4112 × 2848 · existing asset |
| [x] | 2 · `selection` — Ore Hardness Determines the Mill You Need | `social/ball-mill-geevor.jpg` | The same photograph repeats the cover; use a different asset that supports mill selection. | **Replace.** Grinding balls, mill liners or a genuinely different ball-mill drive view. | [x] [ball-mill-grinding-media.png](../tools/social-carousel/images/sourcing-review/ball-mill-grinding-media.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `cta` — Discuss Ball Mills for Your Site | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-14 — Jaw Crushers

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — A Jaw Crusher Reduces Large Rock for Processing | `equipment/jaw-crusher.jpg` | Relevant distinct product introduction. | **Keep exclusively.** Existing jaw-crusher photograph. | [x] [jaw-crusher.jpg](../public/equipment/jaw-crusher.jpg) · 1536 × 1024 · existing asset |
| [x] | 2 · `selection` — Feed Size Determines the Crusher Opening | `equipment/jaw-crusher.jpg` | The cover photograph repeats; a new asset must illustrate feed and opening selection. | **Replace.** Separate close photograph of a jaw-crusher feed opening, jaw plates and coarse feed rock. | [x] [jaw-crusher-feed-opening.png](../tools/social-carousel/images/sourcing-review/jaw-crusher-feed-opening.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `cta` — Discuss Jaw Crushers for Your Site | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-15 — Cone Crushers (removed from active batch)

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — A Cone Crusher Prepares Finer Feed for Milling | `social/cone-crusher-hp400.jpg` | Keep the illustrative-model disclaimer and licence credit. | **Keep exclusively.** Existing licensed HP400 cone-crusher photograph. | [x] [cone-crusher-hp400.jpg](../tools/social-carousel/images/cone-crusher-hp400.jpg) · 1813 × 1664 · existing asset |
| [x] | 2 · `selection` — The Mill Feed Determines the Crusher Setting | `social/cone-crusher-hp400.jpg` | Repeating the same photo and crop adds no visual variation. | **Replace.** Separate cone-crusher mantle and concave liners, or a distinct discharge/chamber view. | [x] [cone-crusher-wear-liners.png](../tools/social-carousel/images/sourcing-review/cone-crusher-wear-liners.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `cta` — Discuss Cone Crushers for Your Site | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-16 — Hammer Mills

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — A Hammer Mill Crushes Ore by Impact | `equipment/hammer-mill.jpg` | Remove its use in Allan’s sourcing page. | **Keep exclusively.** Existing hammer-mill photograph. | [x] [hammer-mill.jpg](../public/equipment/hammer-mill.jpg) · 1920 × 1920 · existing asset |
| [x] | 2 · `selection` — Ore Conditions Affect Hammer and Screen Wear | `equipment/hammer-mill.jpg` | The cover photo repeats; show the components affected by wear and moisture. | **Replace.** Distinct hammer rotor, replaceable hammers or discharge-screen close view. | [x] [hammer-mill-rotor-screen.png](../tools/social-carousel/images/sourcing-review/hammer-mill-rotor-screen.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `cta` — Discuss Hammer Mills for Your Site | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-17 — Vibrating Screens

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — A Vibrating Screen Separates Rock by Size | `social/vibrating-screen-stock.jpg` | Relevant screening equipment; confirm stock attribution matches the selected file. | **Keep exclusively.** Existing verified vibrating-screen photograph; retain any saved replacement only after matching it to the correct equipment. | [x] [vibrating-screen-stock.jpg](../tools/social-carousel/images/vibrating-screen-stock.jpg) · 4896 × 3264 · existing asset |
| [x] | 2 · `selection` — Screen Selection Depends on the Required Product | `social/vibrating-screen-stock.jpg` | The same cover image repeats; unrelated industrial rollers do not explain screen selection. | **Replace.** Separate screening deck or mesh-panel photograph showing openings and separated size fractions. | [x] [vibrating-screen-panels.png](../tools/social-carousel/images/sourcing-review/vibrating-screen-panels.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `cta` — Discuss Vibrating Screens for Your Site | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

### IG-18 — Slurry Pumps

| Implemented | Page / slide | Current image | Issue | Planned action / image | Asset prepared |
|---|---|---|---|---|---|
| [x] | 1 · `cover` — A Slurry Pump Moves Water Mixed with Solids | `equipment/slurry-pump.webp` | Relevant product introduction; inspect resolution. | **Keep exclusively.** Existing slurry-pump photograph. | [x] [slurry-pump.webp](../public/equipment/slurry-pump.webp) · 750 × 562 · existing asset |
| [x] | 2 · `selection` — Pump Selection Depends on the Slurry and Route | `equipment/slurry-pump.webp` | The cover photo repeats; do not reuse Allan’s maintenance illustration either. | **Replace.** Distinct slurry-pump impeller, wear liner or pumping pipework. | [x] [slurry-pump-wear-liners.png](../tools/social-carousel/images/sourcing-review/slurry-pump-wear-liners.png) · 1122 × 1402 · new generated illustration |
| [x] | 3 · `cta` — Discuss Slurry Pumps for Your Site | `social/bart-mining-final.jpeg` | Approved intentional repeated image; exempt from content-image uniqueness. | **Keep shared CTA.** Use shared design from `src/data/cta.ts` unchanged. | [x] Shared CTA retained |

## Implementation order

1. **Use the staged asset register:** copy only the selected new files from `tools/social-carousel/images/sourcing-review/` to `tools/social-carousel/images/`. This review subfolder is not imported by the image library. Apply the exact page keys and suggested crops from `asset-register.json`; do not wire rejected alternatives into posts.
2. **Copy and removal:** update Allan’s bio/intro/caption; remove IG-03; correct the active-post count and schedule.
3. **Priority imagery:** apply the prepared alluvial cover and machinery sequence, equipment-delivery trucks, and five distinct gold-cost content images.
4. **Remaining imagery:** apply the registered team/service, process-comparison, mercury-free recovery and modular-plant images.
5. **Product detail pages:** apply the prepared distinct ball-mill, jaw, cone, hammer, screen and pump component images to the six selection pages.
6. **Provenance and captions:** record source URLs, licences, creators, dimensions, intended page and transformations. Disclose generated illustrations and never describe them as real Bart Mining operations.
7. **Review:** run uniqueness and missing-file checks, inspect all crops and text contrast, check the three-line headline limit, preview all 65 pages, export representative PNGs and run the tool build.

## Image quality and sourcing checklist

- [x] One asset reserved per content page; maintain a page-to-asset register.
- [x] Search existing unused assets, Pexels, Unsplash and Wikimedia Commons for the specific scene or machine component.
- [ ] Prefer 4K originals or portrait 4:5 images. A landscape photo is acceptable only if the portrait crop preserves the subject and resolution remains adequate for 1080 × 1350 export.
- [ ] Reject wrong equipment types, irrelevant scenes, missing commercial-use rights, watermarks, excessive branding or insufficient resolution.
- [ ] If a suitable image cannot be found, generate one image for that page with a page-specific brief; do not reuse a generated scene to fill several slots.
- [ ] Use inspected equipment references when generating specialist machines/components; retain reference shapes and plausible mechanisms.
- [ ] Label all generated assets in the source register and affected captions; technical sign-off remains pending until reviewed by Bartholomew.
- [ ] For the requested river scene, prefer an authentic licensed image. If generation is necessary, depict a fictional generic person safely operating plausible equipment, without resembling Allan or Bartholomew and without claiming a real company site.
- [ ] Avoid inventing additional technical facts, capacities, recovery percentages, customer counts, delivery deadlines or price claims through text or image captions.

## Completion checks

- [x] All 65 retained pages marked individually above.
- [x] IG-03 absent from the active list and proposed schedule.
- [x] Fifty distinct content assets; shared CTA repeats excluded; founder initials retained.
- [x] No reused photo disguised by renaming or cropping.
- [x] No missing image files or enlargement warnings.
- [x] Headline wrapping, photo/text overlap, subject crops and contrast checked in the rendered tool.
- [x] All photo credits and generation disclosures agree with actual files.
- [x] Review sheets and source register saved alongside this checklist.
- [x] TypeScript, production build and representative PNG export checks pass.
- [ ] Named owners review factual copy and generated equipment before publication.

## Completed sourcing and asset review

- [x] Search public libraries and inspect downloaded candidates before selecting them.
- [x] Reserve **50 distinct content assets**, with no repeated destination filenames or SHA-256 hashes.
- [x] Prepare **6 new licensed photographs**: excavator transport, actual gold plant, freight port, geology desk, mineral samples and historical shaking tables.
- [x] Generate **25 distinct missing scenes** using the built-in image_gen tool; save all selected files in the project review folder.
- [x] Refine the generated river cover to a generic East African river setting with a fictional person operating a sluice.
- [x] Visually inspect subject, machine type and composition; specialist engineering approval remains pending.
- [x] Verify all files decode and meet the tool’s enlargement limits at their suggested crops.
- [x] Save source links, creators, licences, actual dimensions, exact page assignments, hashes and generation prompts.
- [x] Keep live posts, Allan’s bio and shared CTA unchanged during sourcing.

The generated files are **1122 × 1402**, approximately **4:5**, sufficient for 1080 × 1350 export at normal scale; they are **not 4K**. New stock photos range from 3072 × 2304 to 6000 × 4000, including a portrait geology image at 3552 × 4736. Existing images retain their earlier resolution and rights-review notes.

The implemented asset set has passed file, uniqueness and browser-render checks, including text wrapping, subject crops and contrast. Generated machinery is illustrative and awaits Bartholomew’s technical review; none is evidence of an actual plant capacity, price, customer site or fleet.

### Saved deliverables

- [Asset register with all 50 exact assignments](../tools/social-carousel/images/sourcing-review/asset-register.json)
- [Generation prompts and river revision](../tools/social-carousel/images/sourcing-review/prompt-register.json); [additional CIL replacement prompt](../tools/social-carousel/images/sourcing-review/cil-generation-prompt.json)
- Review sheets: [1](social-image-sourcing-2026-10-02/asset-review-01.jpg), [2](social-image-sourcing-2026-10-02/asset-review-02.jpg), [3](social-image-sourcing-2026-10-02/asset-review-03.jpg), [4](social-image-sourcing-2026-10-02/asset-review-04.jpg), [5](social-image-sourcing-2026-10-02/asset-review-05.jpg).

### Stock sources and required caption changes

- **IG-12 / cover**: [Roger Starnes Sr — excavator-transport.jpg](https://unsplash.com/photos/yellow-excavator-loaded-on-a-flatbed-trailer-8f8OYBy3z4U); [Unsplash License](https://unsplash.com/license). Actual excavator on a lowbed trailer; manufacturer markings visible. Illustrative transport, not Bart Mining fleet or a model offer.
- **IG-10 / cover**: [Calistemon — gold-plant-sunrise.jpg](https://commons.wikimedia.org/wiki/File:Sunrise_Dam_Gold_Mine_plant_01.jpg); [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0). Actual Sunrise Dam plant in Western Australia; illustrative plant photograph, not a quotation for the pictured installation.
- **IG-10 / b4**: [Andrea Musto — freight-port.jpg](https://www.pexels.com/photo/a-port-with-shipping-containers-and-cranes-13025947/); [Pexels License](https://www.pexels.com/license/). Actual port photograph; no claim of Bart Mining cargo or a specific shipping route.
- **IG-08 / principal**: [Yena Kwon — geology-study-desk.jpg](https://www.pexels.com/photo/rocks-on-the-desk-8188036/); [Pexels License](https://www.pexels.com/license/). Actual geological/fossil study desk, not a record of Bartholomew’s project.
- **IG-02 / fit**: [MART PRODUCTION — ore-sample-selection.jpg](https://www.pexels.com/photo/assorted-rocks-on-the-table-8471928/); [Pexels License](https://www.pexels.com/license/). Actual assorted mineral specimens; illustrative sample-selection context, not gold assay evidence.
- **IG-09 / s4**: [Rich257 — shaking-tables-geevor.jpg](https://commons.wikimedia.org/wiki/File:Geevor_tin_mine_shaking_tables.jpg); [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0). Actual historical shaking tables at Geevor tin mine; illustrates gravity-separation equipment, not a Bart Mining gold project.

For CC BY-SA photographs, implementation must credit the creator, link the original and licence, disclose carousel cropping, and share the adapted photo slide under the same compatible licence. Preserve the existing credits on retained Commons photographs. Remove credits attached to any photo no longer present in that post. Generated scenes require illustration disclosures in the affected captions.

### Rejected candidates and fallback reasons

| Topic | Candidate or search outcome | Decision |
|---|---|---|
| Alluvial cover | [Gold miner at the Irrawaddy River](https://commons.wikimedia.org/wiki/File:Gold_miner_at_the_Irrawaddy_River.jpg), 4000 × 6000 | Good river photo, but it shows panning rather than a sluice; select the generated sluice scene. |
| Plant-cost cover | [Sunrise Dam processing plant 08](https://commons.wikimedia.org/wiki/File:Sunrise_Dam_Gold_Mine_processing_plant_08.jpg) | Download review showed the core yard dominates; use the separate plant 01 photograph. |
| Founder’s career | Website RC-drilling photo, 1920 × 826; [Pilbara drill photograph](https://commons.wikimedia.org/wiki/File:Drill_rig,_Pilbara,_August_2007.jpg) | The website photo is too short for full bleed; both contain people, outside the cover-specific exception. Generate a people-free exploration rig. |
| Modular site preparation | [Concrete construction photograph](https://www.pexels.com/photo/concrete-construction-site-with-building-materials-36162732/) | Shows an unfinished building and material stacks; generate actual equipment pads and service connections. |
| Procurement and parts dispatch | Pexels warehouse and crate searches returned mostly cartons, storage bins or unrelated machinery | Generate distinct machinery dispatch, export crates and packed mining parts. |
| Generator transport | Pexels generator-truck search returned general truck listings rather than a usable secured generator load | Generate a dedicated flatbed carrying generator sets. |
| CIL/CIP and gravity circuit details | Commons mineral-processing and tank searches offered historical equipment, unrelated processes or plant views that did not distinguish the required stages | Use distinct generic equipment illustrations; technical review pending. |
| Existing CIL render | `public/equipment/cil-cip-plant.jpg` | Visible watermark in the retained candidate; generate a fresh agitated-vessel illustration and record the extra replacement. |
| Product components | Commons/Pexels searches for grinding media, jaw plates, cone liners, hammer rotors, screen mesh and pump impellers did not yield selected assets with the right subject, adequate resolution and verified reuse terms | Generate a different component illustration for each selection page; do not recrop the cover photos. |
| Clay and fine tailings | Stock results did not provide selected mineral-processing sample scenes at the required specificity | Generate visually distinct material samples, without claiming visible gold or assay results. |

Rejected photographs and the first river variant remain in `sourcing-review/` for traceability but are absent from the 50-asset register. They must not be copied into the live image library during implementation.

## Implementation validation

- **Active data:** 15 posts / 65 slides; IG-03 removed without reassigning its ID.
- **Images:** all 50 content files match the selected register hashes and use distinct filenames and SHA-256 hashes. All assigned files resolve.
- **CTA:** all 14 closing slides match their pre-implementation values exactly; the shared helper remains unchanged. Templates and original sourcing notes are retained.
- **Browser review:** every slide rendered in local Chrome; zero missing images, enlargement warnings, headline-line violations or card/text overlaps. All five review sheets were visually inspected for crop and contrast.
- **Build/export:** TypeScript and production build passed. Representative PNG downloads passed at 1080 × 1350 (IG-11 cover, IG-12 route map, IG-13 ball mill and IG-15 cone crusher).
- **Pending:** Allan/Bartholomew factual and technical sign-off, plus rights verification for legacy website assets already identified in this plan. Posts remain in `review` status.

- [Rendered review sheet 1](social-image-sourcing-2026-10-02/rendered/review-1.jpg)
- [Rendered review sheet 2](social-image-sourcing-2026-10-02/rendered/review-2.jpg)
- [Rendered review sheet 3](social-image-sourcing-2026-10-02/rendered/review-3.jpg)
- [Rendered review sheet 4](social-image-sourcing-2026-10-02/rendered/review-4.jpg)
- [Rendered review sheet 5](social-image-sourcing-2026-10-02/rendered/review-5.jpg)
- [All 65 browser measurements](social-image-sourcing-2026-10-02/rendered/measurements.json)

## IG-05 expansion — completed

The original sourcing pass covered 65 slides. IG-05 has since expanded from one page to five, bringing the active batch to **15 posts / 69 slides**, with **53 distinct content images**, **15 shared CTAs** and one initials-only founder cover. Earlier 65-slide/50-image validation entries document the original pass.

| Implemented | Page | Image | Review |
|---|---|---|---|
| [x] | 1 · Introduction | `equipment/centrifugal-gold-concentrator.jpg` | Original image retained exclusively |
| [x] | 2 · Feed preparation | `social/concentrator-feed-preparation.png` | Generated illustration; technical sign-off pending |
| [x] | 3 · Clean water | `social/concentrator-clean-water-supply.png` | Generated illustration; technical sign-off pending |
| [x] | 4 · Equipment selection | `social/concentrator-bowl-selection.png` | Generated illustration; technical sign-off pending |
| [x] | 5 · CTA | Shared CTA helper | Existing design retained |

All 69 active slides passed browser checks for missing images, enlargement, headline length and card/text overlap. [Expanded IG-05 rendered review](social-image-sourcing-2026-10-02/rendered/ig05-expanded.jpg). [Saved generation prompts](../tools/social-carousel/images/sources/ig05-expansion-prompts.json).

## Ball-mill cover replacement

IG-13 now uses `social/ball-mill-small-clean-generated.png`: a newly generated compact ball-mill illustration on pure white, replacing the historical Geevor photograph. The requested roughly 3-tonne/hour appearance is an image brief, not a verified capacity claim. The caption discloses generation and no longer credits the removed photograph. The original asset remains available but is not assigned to this cover. [Generation prompt](../tools/social-carousel/images/sources/ball-mill-clean-prompt.json).

## IG-15 removal

Cone Crushers was removed from `POSTS` and the publishing schedule at the owner’s request. Its three slides are no longer active. Source assets and historical reviews remain available. Current totals: **14 posts / 66 slides / 51 distinct content images / 14 shared CTAs**, plus one initials-only founder cover.

## IG-08 cover adjustment

Removed the BA initials and their underline from the founder cover at the owner’s request. It now uses a plain black text-only cover; no portrait was added. Cone Crushers (IG-15) remains removed from the active batch.
