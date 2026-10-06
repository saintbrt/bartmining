# Bart Mining: Content and Implementation Plan

**Started:** 3 October 2026
**Consolidated:** 6 October 2026
**Covers:** generator rental (new service), the gold wash plant content built from the Mbeya proposal, the standalone trommel offer, and the plant planner tool.
**Sits alongside:** [seo-growth-checklist.md](seo-growth-checklist.md) (the overall SEO programme and Search Console baseline). This file is the working plan for the items below; that one stays the master checklist.

**Status marks:** `[ ]` not started · `[~]` in progress · `[x]` done and checked on the live site
**Owners:** **Allan** (Allan Bartholomew, Head of Business Development) · **Dev** (code, commit, Vercel deploy) · **Team** (social, data entry, Google Business Profile)

Update the status marks and the [change log](#change-log) as work lands, so nothing gets lost between sessions.

The [consolidated content briefs](#consolidated-content-briefs-and-source-bank) below collect the planned subjects, reader outcomes, public source material, numerical examples, visuals and unanswered questions in this same file. They are working briefs, not completed articles or approved engineering designs. The older phase tables retain the original sequence; the briefs record the current editorial and directory requirements.

---

## Rules for everything in this plan

1. **Plant names.** Never write "Option A" or "Option B", anywhere. The two configurations are the **Full Scale Plant** (150 m³/h) and the **Starter Modular Plant** (75 m³/h). The add-on is **Phase 2 • Second line**; production lines are **Line 1 / Line 2**.
2. **No internal figures in public.** Supplier costs, commission, price-risk reserve, margin and team rates never appear on the website, in articles or in client PDFs. Client prices only, and only where a decision below allows it.
3. **The repo is public.** `projects/plant-planner/data/` (supplier costs, commission) is gitignored and must stay that way. Back it up somewhere private.
4. **Pushing to `main` deploys the live site.** Commit and push only on Allan's say-so.
5. **Images must have a known source and usage rights.** Follow the editorial standard: catalogue references must be labelled, and generated illustrations must not imply a real Bart Mining installation. Do not use private client or site photographs without permission. Client documents need a separate image-rights check.
6. **No doorway pages.** A town page exists only if it says something true of that town and false of the others (same rule as `src/data/locations.ts`).
7. **Author:** Allan Bartholomew. Use the current author record in `src/data/authors.ts` for the role and biography.
8. **Titles are searches.** Every page title is phrased the way someone types it into Google.
9. **Copy style:** follow `docs/editorial-standard.md`: natural full sentences, connected explanations, sentence-case headings and a substantive conclusion.

---

## Decisions

### Made
| Date | Decision |
|---|---|
| 2026-10-03 | Plant configurations are named Full Scale Plant and Starter Modular Plant (never Option A/B). |
| 2026-10-03 | Client payment terms: project management fee on signing, then 30% of the balance on scope confirmation, 60% against bill of lading, 10% after commissioning. The fee is one editable entry in the planner. |
| 2026-10-03 | Internal team costing is maintained in the private planner. Public content uses only approved client-facing scope and prices. |
| 2026-10-03 | Plant page lives at `/alluvial` (shorter than `/alluvial-plant-proposal`). |
| 2026-10-03 | Generator rental is the top SEO priority (live demand: a caller asked for 200–2,500 kVA). |
| 2026-10-03 | Town pages for generator rental use `/generator-rental/<town>`, not `/generator-rental-<town>`. |
| 2026-10-03 | Generator rental facts (D1–D5): public wording is "we rent generators" (units come from partners, so never claim a fleet or stock); sizes 300–2,500 kVA; every hire includes delivery and collection, installation and commissioning, an operator or technician, and servicing; no published rates, call or WhatsApp for a quote; enquiries go to +255 759 141 705. Fuel is supplied by the customer; minimum hire is one week for industrial work and two days for events. |

### Open
| # | Question | Owner | Blocks |
|---|---|---|---|
| D6 | Approved client-facing examples are available in `src/data/plant-cost-examples.ts`. Use dated, scoped examples; approval of those examples does not authorise new price ranges or private figures. | Allan / Dev | New or changed commercial figures |
| D7 | Can article 1.3 open with an anonymous case study ("a recent proposal for a clay-rich deposit in the Southern Highlands")? | Allan | 1.3 |
| D8 | Which equipment we source in Tanzania vs import (the planner's current ticks are guesses) | Allan | 2.3, planner |
| D9 | Trommel offer: the six questions in [Track B](#track-b-standalone-trommel-offer) | Allan | Track B |

---

## Phase 0: Generator rental (do first)

**Why first:** real enquiries are coming in for a service the site doesn't mention. Nothing on bartmining.com currently ranks for generator hire.

**Facts:** answered 2026-10-03 (see Decisions). Content lives in `src/data/generator-rental.ts`; the calculator is `src/components/sections/GeneratorSizer.tsx`.

| # | Status | Page | Address | Title | Target searches | Owner |
|---|---|---|---|---|---|---|
| 0.1 | `[x]` | Main service page | `/generator-rental` | Generator Rental in Tanzania: 300 to 2,500 kVA | generator rental Tanzania, generator hire Tanzania, 500 kVA generator for rent, 1000 kVA generator hire | Dev |
| 0.2 | `[x]` | Town page | `/generator-rental/mwanza` | Generator Rental in Mwanza | generator rental Mwanza, generator hire Mwanza | Dev |
| 0.3 | `[x]` | Town page | `/generator-rental/dar-es-salaam` | Generator Rental in Dar es Salaam | generator rental Dar es Salaam, generator hire Dar | Dev |
| 0.4 | `[x]` | Town page | `/generator-rental/geita` | Generator Rental in Geita | generator rental Geita | Dev |
| 0.4b | `[x]` | Town pages (added 2026-10-03) | `/generator-rental/arusha`, `/dodoma`, `/mbeya`, `/morogoro`, `/tanga`, `/kahama`, `/mtwara` | Generator Rental in <Town>: 300 to 2,500 kVA | generator rental <town> | Dev |
| 0.5 | `[x]` | Swahili page | `/insights-swahili/jenereta-za-kukodi` | Jenereta za Kukodi Tanzania: kVA 300 hadi 2,500 | jenereta za kukodi, kukodi jenereta | Dev |
| 0.6 | `[~]` | Article: paired drafts below; implementation pending | `/insights/what-size-generator-do-i-need` | What Size Generator Do I Need? kVA Guide for Mines and Sites | what size generator do I need, generator size calculator, kVA calculation | Dev |
| 0.7 | — | Article: dropped for now (rates are not published) | `/insights/generator-rental-price-tanzania` | Generator Rental Price in Tanzania: Daily and Monthly Rates | generator rental price, generator hire cost | Dev |
| 0.9 | `[x]` | Images | `public/generator-rental/` | Hero (home-page style) on every rental page, size band pictures. Brief for Codex: [image-brief-generator-rental.md](image-brief-generator-rental.md). 14 generated images live (`9408d3f`). | — | Codex / Dev |
| 0.8 | `[ ]` | Google Business Profile | (off-site) | Add the "Generator rental service" category, services list and description | generator rental near me | Allan / Team |

### 0.1 Main service page: content checklist
- [x] Answer-first opening: what we rent, the size range, where we deliver, how to get a quote
- [x] Size bands 300–500, 500–1,000 and 1,000–2,500 kVA, with what each typically powers
- [x] Prime vs standby rating, explained simply
- [x] Synchronised sets for large loads; site access for big sets
- [x] What's included, fuel (customer supplies), minimum hire (one week industrial, two days events), delivery area
- [x] **"What size do I need" calculator** (English and Swahili): loads with starting method, recommends a standard rental size, sends the load list on WhatsApp
- [x] Call and WhatsApp buttons above the fold, with a pre-filled WhatsApp message per page
- [x] FAQ (7 questions) with FAQ structured data
- [x] Service structured data (`serviceType: Generator rental`) and breadcrumbs
- [x] Links out: diesel generator product page, off-grid power article, equipment rental article, town pages

### Town pages (0.2–0.4): what makes each one real
| Town | Distinct content |
|---|---|
| Mwanza | Our Mwanza base, Lake Zone mining districts, fish processing and industrial standby, delivery times from Mwanza |
| Dar es Salaam | Largest market: construction, port and logistics, events, power-cut backup for offices and factories, same-day delivery |
| Geita | Mine sites away from the grid, large mill and plant loads, long hire periods, fuel logistics on site |

More towns (Kahama, Chunya, Shinyanga) only once there's a genuine local angle and real enquiries from there.

### Linking generator rental into the site
- [x] Services page section, main menu, footer (English and Kiswahili columns). Homepage services grid left as is: its heading counts five capabilities.
- [x] Diesel generator product page: rental callout under the summary
- [x] Off-grid power article and equipment rental article
- [x] District supply pages: a rental line on every district that buys generators (plus Mwanza and Dar es Salaam, linking to their town pages)
- [x] Sitemap; hreflang between `/generator-rental` and `/jenereta-za-kukodi`

**Phase 0 is done when:** 0.1–0.5 are live, in the sitemap, linked from the menu and product page, submitted in Search Console, and the Google Business Profile category is added.

---

## Phase 1: Gold wash plant content (from the Mbeya proposal)

Source material: the plant planner (`projects/plant-planner`), the animated diagram, the equipment schedules, the schedule and the proposal text. All figures used publicly must pass Rule 2.

| # | Status | Page | Address | Title | Target searches |
|---|---|---|---|---|---|
| 1.1 | `[~]` | Paired main-guide drafts below; diagram/implementation pending | `/alluvial` | How to build a gold wash plant, step by step | how to build a gold wash plant, how does a gold wash plant work, alluvial gold wash plant |
| 1.2 | `[~]` | Paired article drafts below | `/insights/gold-trommel-sluice-box` | Gold trommel with sluice box: when a simpler wash plant is enough | gold trommel for sale, trommel with sluice box, gold washing machine |
| 1.3 | `[~]` | Paired article drafts below | `/insights/small-vs-full-gold-wash-plant` | Small gold wash plant versus full plant: which should you start with? | small gold wash plant, modular gold wash plant |
| 1.4 | `[~]` | Paired article drafts below | `/insights/gold-wash-plant-equipment-list` | Gold wash plant equipment list for 75 and 150 m³/h | gold wash plant equipment list, equipment needed for a gold wash plant |

### 1.1 Turning `/alluvial` into the public guide
`/alluvial` is live but unlisted, written for one client. To make it the public guide:
- [ ] Rewrite for clay-rich alluvial deposits in Tanzania in general: no client, no "proposal" wording, no named site
- [ ] Keep the animated diagram, the 7-step walkthrough and the Full Scale / Starter Modular toggle
- [ ] Add sections: when you need a scrubber, choosing the capacity, water and ponds (summary), power, and what to test first
- [ ] FAQ with structured data
- [ ] Remove `noindex`, add to the sitemap, link from the rotary scrubber, trommel, sluice box and alluvial wash plant product pages, and from the rainy-season article
- [ ] Update `src/data/alluvial-plant.ts` comments: it's a public guide now, not a proposal snapshot

### Embedding the diagram in articles
- [ ] Add a placeholder (for example `<div data-plant-flow></div>`) that the article page swaps for the animated diagram, so 1.3 and 1.4 can show it, not just `/alluvial`

---

## Phase 2: Gold wash plant how-to

| # | Status | Address | Title | Target searches | Note |
|---|---|---|---|---|---|
| 2.1 | `[~]` | `/insights/gold-wash-plant-setup-time` | How long does it take to set up a gold wash plant? | gold plant installation time, how long to set up a gold plant | Paired drafts below. Public stage durations and equipment-specific transport needs still need confirmation. |
| 2.2 | `[~]` | `/insights/gold-wash-plant-water` | How much water does a gold wash plant need? | gold wash plant water requirement, settling ponds for a gold plant | Paired drafts below, with a labelled teaching example; project water requirements need review. |
| 2.3 | `[~]` | `/insights/buy-gold-wash-plant-tanzania` | Where to buy gold wash plant equipment in Tanzania | gold wash plant for sale Tanzania, mining equipment suppliers Tanzania | Paired general buying drafts below. Item-specific sourcing still depends on D8. |

**Existing pages to update with links:** Recovering Gold in the Rainy Season, What It Costs to Set Up a Small Gold Processing Plant, Test Work Before You Buy, Off-Grid Mine Power.

---

## Phase 3: Other formats

| # | Status | Item | Note |
|---|---|---|---|
| 3.1 | `[~]` | Carousel: **How a gold wash plant works in seven steps** | Paired English/Kiswahili slide copy below; reviewed visuals and production pending. |
| 3.2 | `[~]` | `/insights-swahili/jinsi-ya-kujenga-plant-ya-kuosha-dhahabu`: **Jinsi ya kujenga mtambo wa kuosha dhahabu** | Full counterpart draft below. Link from `/insights-swahili/gharama-ya-plant-ya-dhahabu` during implementation. |

---

## Track B: Standalone trommel offer

A client wants only a gold washing machine: a trommel or scrubber with sluice boxes, no full plant. This is a separate offer.

- [x] **B1.** New private wash-and-sluice project in the planner (2026-10-05): nominal 150 m³/h washing screen and six sluice boxes. Supplier identifiers and costs stay in the private planner; use only the separately approved client-facing snapshot for public writing.
- [x] **B2.** Wash-and-sluice flow diagram (`flowsheet: 'washSluice'`): screen, distribution box, sluices with mats, clean-up, tailings, water pump
- [~] **B3.** Proposal drafted in the planner (16 pages). Waiting on Allan's review and the open technical points (pump starting on the 200 kW generator, clay content)
- [ ] **B4.** Export the PDF and send

**Blocked by D9. Needs from Allan:**
1. The machine we can actually supply (model or supplier) and our cost, or the price to quote
2. Capacity the client wants (t/h or m³/h)
3. Power: diesel engine on the machine, or electric motors with a generator
4. Mounting: skid or mobile on wheels
5. Clay in their ore (scrubbing section or plain trommel)
6. Delivery: to their site in Tanzania, or at the port

Feeds article 1.2, which targets the same buyers.

---

## Track C: Plant planner backlog

Known gaps in `projects/plant-planner`, noted so they don't surprise anyone:

- [ ] Equipment sourcing ticks (Imported / Tanzania) are first guesses. Set them properly (D8).
- [ ] Items bought in Tanzania: enter supplier cost as the delivered-to-site price. The planner adds no inland trucking for them.
- [ ] Team months don't follow the schedule automatically. Check Budget → Team after schedule changes.
- [ ] Cashflow payment months don't follow the schedule automatically. Phase 2's final payment sits in month 5, but commissioning now ends in month 6.
- [ ] Containers scale with the imported share of equipment value. Replace with real packing-list numbers once known.
- [ ] Confirm travel and site accommodation allowances in the private planner. Internal team costs do not belong in public content.
- [ ] The website page data (`src/data/alluvial-plant.ts`) is a hand-kept snapshot. The Map tab marks it as not automatic.

---

## Consolidated content briefs and source bank

### Scope and current position

The proposal gives us seven complementary wash-plant subjects, a Kiswahili counterpart programme, a seven-step carousel and a related generator-sizing guide. Each article must answer its own question rather than repeat the equipment list with a different title.

Repository check on 6 October 2026: `/alluvial` exists as an unlisted proposal page with `index: false` and `follow: false`. The six supporting wash-plant article slugs and the generator-sizing article slug are not registered in the current article library. Existing equipment-cost and plant-setup-cost guides already use the approved public proposal examples. The new subjects should build on those guides rather than reproduce them in full.

The main guide should be drafted first. The equipment-list and configuration-comparison articles can then use its shared definitions and reviewed diagram. The trommel article needs a clear distinction between a rotating trommel, a rotary scrubber and the vibrating washing screen in the newer wash-and-sluice proposal. Water, schedule and sourcing articles need their own calculations or confirmed project inputs before completion.

### Public sources already available

| Source | Material we can reuse | Limits |
| --- | --- | --- |
| `src/data/alluvial-plant.ts` | Two proposed scrubber configurations, equipment quantities, seven process steps, desktop/mobile flow definitions and preliminary technical specifications | A manually maintained proposal snapshot, not field measurements or a universal design. Several specifications need reconciliation before reuse. |
| `src/components/sections/PlantFlow.tsx` | Animated process diagram and configuration controls | Explain and review the flow before embedding it. Provide an equivalent readable explanation and check reduced-motion behaviour. |
| `src/app/alluvial/page.tsx` | Existing proposal presentation and configuration comparison | Currently a proposal page. Rewrite the audience, claims, layout and metadata before making it a public article. |
| `src/data/plant-cost-examples.ts` | Approved client-facing equipment, execution and total examples dated 3 and 5 October 2026; proposal durations; explicitly assumed operating examples | Do not import private planner data. Prices and allowances are scoped proposal examples, not current universal prices or completed-project costs. |
| `src/content/insights/mining-equipment-cost-tanzania.ts` | Separation of plant types, public capital examples, operating arithmetic, exclusions and quotation preparation | Preserve the distinction between an assumption and measured performance. Avoid repeating its complete budget in every new guide. |
| `src/content/insights/gold-plant-setup-cost.ts` | Execution categories, startup funding, owner responsibilities and schedule dependencies | Services remain proposal allowances; operating cash and separately payable charges remain additional. |
| Existing test-work, rainy-season, gravity-recovery and off-grid-power articles | Supporting explanations and links | Recheck any claim reused in the new context. An existing page is not independent proof of performance. |
| Equipment pages in `/equipment` and `/equipment-swahili` | Model references, product identities and catalogue illustrations | Confirm that the actual proposed model matches the product specification. Catalogue images do not show a completed client plant. |
| `src/data/generator-rental.ts` and `src/components/sections/GeneratorSizer.tsx` | Existing rental facts and preliminary load-list workflow | Confirm the calculator assumptions against the sizing article. A calculator result is not final electrical design. |

The private planner remains a reference for authorised project work, not a public content dependency. If a missing figure is needed, obtain an approved public extract rather than copying its private files, proposal attachments or internal calculations into this document.

### Approved capital and schedule examples

These rounded USD figures already appear in the public editorial snapshot. Use an anonymous proposal description in articles; retain the source dates and scope. An equipment-and-execution total does not represent every cost of opening and operating a mine.

| Proposed configuration | Proposal date | Nominal feed | Equipment | Execution allowance | Equipment + execution | Modelled duration |
| --- | --- | --- | --- | --- | --- | --- |
| Washing screen and six sluices | 5 October 2026 | 150 m³/h | USD 66,300 | USD 75,543 | USD 141,843 | 16 weeks |
| Starter Modular Plant: scrubber and gravity recovery | 3 October 2026 | 75 m³/h | USD 137,400 | USD 214,195 | USD 351,595 | 24 weeks |
| Full Scale Plant: scrubber and gravity recovery | 3 October 2026 | 150 m³/h | USD 227,280 | USD 274,358 | USD 501,638 | 26.5 weeks |

Execution categories in the existing cost guide are shipping/insurance/clearing/inland delivery; installation crew and lifting; civil works; engineering and project management; testing/inspection/permits; commissioning and first-year wear parts; and contingency. Categories are planning allowances, not invoices or current freight quotations. Rounded category sums can differ from the rounded total by one dollar.

Keep separately payable import taxes and statutory charges, owner operating capital, land/licence acquisition, excavation and ore haulage outside these totals where the proposal excludes them. Verify goods, importer eligibility and the actual delivery term before stating a tax or duty position. Do not apply the owner's preliminary USD 90,000 hard-rock equipment reference to an alluvial package; it belongs to a separate, incompletely scoped comparison.

The two 150 m³/h proposals have different treatment and supporting scopes. Their nominal capacity does not establish equivalent clay handling, gold recovery or actual productive feed. Likewise, the 75 m³/h proposal total cannot be doubled to quote an expansion: shared facilities, additional equipment and execution require a separate scope.

### Process explanation to develop

Use the seven steps as a narrative: explain what enters each step, what the equipment changes and where each output goes. The existing snapshot provides this starting sequence:

1. **Receive the gravel.** A loader feeds a hopper and grizzly. The example uses an 80 mm opening; any rejection size needs sampling and a clear oversize-handling decision.
2. **Control the feed.** A vibrating feeder supplies the washing section at a controlled rate. Explain why inconsistent feeding affects washing and downstream loading.
3. **Wash and classify.** The scrubber proposal uses tumbling and water to break down clay, followed by size separation. The simpler washing-screen proposal must be explained separately.
4. **Treat the fine fraction.** Suitable classified slurry goes to centrifugal recovery. Match the feed opening, solids duty and water requirements to the actual model.
5. **Treat the coarser fraction.** A separately directed fraction passes through sluices. Explain the design and test basis rather than promising that every coarse particle or nugget will be captured.
6. **Clean up the concentrate.** The scrubber concept includes shaking-table cleanup and a controlled gold-room route. State what testing and handling are needed for the final product.
7. **Manage tailings and return water.** Trace every recovery outlet to its next destination, then explain dewatering, settling, return water and makeup supply. The current schematic needs this outlet review before publication.

Treat this as a proposed process concept. It does not establish a completed installation, a universal recovery rate or a detailed engineering design.

### Technical figures requiring confirmation

The following values are recorded in the public technical snapshot. They are collected here so a writer can see what needs checking, not so they become approved claims by repetition.

| Item | Starter Modular Plant snapshot | Full Scale Plant snapshot | Required confirmation |
| --- | --- | --- | --- |
| Scrubber | 2.0 × 5.0 m class; 37 kW | 2.2 × 6.5 m; 55 kW | Actual offered machine, clay duty and tested capacity. |
| Centrifugal units | 2 × STLB-80 | 3 × STLB-80 | Each unit's permitted feed size and solids capacity; reconcile the diagram's 0–6 mm feed with the model specification. |
| Sluice/table arrangement | 1 coarse + 2 scavenger runs; 1 table | 2 coarse + 3 scavenger runs; 2 tables | Complete routing, clean-up duty and each tailings destination. This is a different scope from the six-sluice washing-screen package. |
| Installed/running load | 175–190 / 120–150 kW | 280–340 / 200–260 kW | Motor list, simultaneous loads, starting methods, site derating and operating schedule. |
| Proposed power supply | 250 kVA prime, expansion provision | 500 kVA prime | Starting/load assessment and expansion design; do not select from summed running kW alone. |
| Circulating/makeup water | 250–280 / 40–55 m³/h | 500 / 75–120 m³/h | Actual water balance, solids/clay behaviour, pond losses and seasonal water availability. |
| Feed density assumption | 1.50–1.70 t/m³ | 1.50–1.70 t/m³ | Whether measured bulk volume and density use the same basis. Do not silently convert loose gravel to dry solids mass. |
| Monthly volume displayed | 39,000 m³ | 78,000 m³ | Hours/day, days/month and productive availability behind those values. They are not established monthly production. |
| Recovery envelope displayed | 88–95% free-gold recovery | 88–95% free-gold recovery | Representative tests, gold-size distribution and a defined mass balance. Do not publish as a guarantee. |

The operating-cost guide uses a different, explicitly assumed example: `150 × 20 hours/day × 26 days/month × 0.75 productive availability = 58,500 m³/month`. It assumes 120 kW average draw, 0.27 L/kWh and USD 1.20/L fuel over 520 hours. Those inputs are teaching assumptions; they are neither a current fuel quote nor measurements of the proposed scrubber plants. Do not mix this example with the snapshot's 78,000 m³ display or its generator rating.

### Article 1.1: How to build a gold wash plant, step by step

**Routes:** English `/alluvial`; proposed Kiswahili `/insights-swahili/jinsi-ya-kujenga-plant-ya-kuosha-dhahabu`.

**Reader and decision:** A mine owner with an alluvial deposit who needs to understand the complete route from feed testing to a plant ready for commissioning. They should leave able to prepare a project brief and recognise which design decisions cannot be made from a machine catalogue.

**Opening and flow:** Establish the difference between loose alluvial gravel and hard-rock ore. Explain why clay and gold behaviour determine the treatment route. Move from sampling to washing and classification, then recovery, cleanup, water/tailings, power and site preparation. Introduce the two scrubber configurations only after the process is clear, and distinguish the simpler washing-screen alternative.

**Usable outcome:** A project-input checklist covering location, representative samples, clay/size distribution, target feed basis, water source, power, access, operating schedule and product handling. End by explaining how these inputs become a scoped equipment list and commissioning plan.

**Visuals and FAQs:** Reviewed animated flow with a seven-step text explanation; a configuration table. Candidate questions concern scrubber necessity, the role of a trommel and why nominal capacity is not actual output. Keep FAQs before the conclusion.

**Dependencies:** Reconcile the process and model specifications above; replace proposal/client wording; use `ArticleLayout`; decide how the custom `/alluvial` route participates in the article inventory. Remove `noindex` and add discovery only when the public guide is ready.

### Article 1.2: Gold trommel with sluice box—sizes, price and when it is enough

**Route:** `/insights/gold-trommel-sluice-box`; prepare a full Kiswahili counterpart beneath `/insights-swahili/` with its slug confirmed during drafting.

**Reader and decision:** Someone considering a smaller equipment scope who needs to know whether washing, screening and sluices can treat their material adequately.

**Opening and flow:** Explain a trommel's role and the limits of treating clay-rich feed with screening alone. Distinguish rotary trommel, rotary scrubber and vibrating washing screen. Follow the feed through washing/classification, sluice distribution and cleanup, then explain water, power and tailings support.

**Usable outcome:** A comparison of treatment duties and a quotation checklist: machine type/model, feed characteristics, nominal capacity basis, sluice quantity, pumps, controls, power, spares, delivery and installation. Use the USD 66,300 equipment example only as a dated washing-screen-and-six-sluice package; it is not a standalone trommel price.

**Visuals and FAQs:** A separately reviewed wash-and-sluice concept, plus labelled catalogue references. Candidate questions: whether sluices remove the need for cleanup, and what evidence shows that washing alone is enough. Conclude with the tests and scope needed to select this route.

**Dependencies:** Confirm the actual offered machine, clay duty, starting load and public scope. If no verified trommel price exists, change the title to match what the article can answer rather than invent a price.

### Article 1.3: Small gold wash plant versus full plant—which should you start with?

**Route:** `/insights/small-vs-full-gold-wash-plant`; paired Kiswahili guide beneath `/insights-swahili/`.

**Reader and decision:** An owner deciding between staging investment and building a larger line from the start. They should understand how deposit evidence, available capital and shared infrastructure affect the choice.

**Opening and flow:** Define Starter Modular Plant (75 m³/h) and Full Scale Plant (150 m³/h) as the proposal examples. Compare feed supply, water/power, equipment scope, proposal capital and the consequences of adding Line 2. Explain where modular expansion preserves flexibility and where it duplicates equipment or requires advance infrastructure.

**Usable outcome:** A comparison table with the dated public costs and clearly qualified technical inputs; a decision sequence using tested deposit evidence, productive-hours assumptions and available funding. Explain that first-line production cannot replace sufficient pre-investment sampling.

**Visuals and FAQs:** Side-by-side reviewed flows or a configuration toggle, with separate captions. Candidate questions: whether a second line costs the same as the first, and whether two lines guarantee continuous operation. Close with the conditions supporting each choice rather than declaring one universally cheaper.

**Dependencies:** Confirm shared pond/gold-room/control scope and expansion provisions. Do not claim lower unit operating cost without a consistent calculation. An anonymous case-study opening still needs separate approval if it adds project detail beyond the approved snapshot; a general explanation can be drafted now.

### Article 1.4: Gold wash plant equipment list for 75 and 150 m³/h

**Route:** `/insights/gold-wash-plant-equipment-list`; paired Kiswahili guide beneath `/insights-swahili/`.

**Reader and decision:** An owner comparing proposals who needs a complete functional equipment list and a way to identify omissions.

**Opening and flow:** Explain that a useful equipment list follows the process and includes supporting duties. Cover receiving/feeding, washing/classification, slurry handling, recovery, concentrate cleanup, water/tailings, electrical controls and power. Separate process machines from owner-supplied mobile equipment, site works and commissioning services.

**Usable outcome:** A table with function, proposed quantity/specification for each configuration, the selection basis and unresolved items. Add a scope checklist for wear parts, lifting, foundations, cabling, pipework, instrumentation, training and commissioning. Link to the existing budget guide for full cost treatment.

**Visuals and FAQs:** Numbered process diagram and a few purposeful equipment references. Candidate questions: whether the generator or loader is included, and whether identical nominal capacity means equivalent scope. Conclude with how to compare itemised offers against the same duty.

**Dependencies:** Confirm quantities, classifications and model duty. Avoid inferring an item-level selling price by dividing the package total.

### Article 2.1: How long does it take to set up a gold wash plant?

**Route:** `/insights/gold-wash-plant-setup-time`; paired Kiswahili guide beneath `/insights-swahili/`.

**Reader and decision:** An owner planning funding, site readiness and a realistic production start.

**Opening and flow:** Distinguish equipment delivery from production readiness. Explain scope confirmation, design/testing, manufacturing, inspection, shipment, clearance/inland delivery, parallel civil/water/electrical work, installation, dry/wet checks and performance acceptance. Confirm the actual stage sequence against an approved public schedule extract.

**Usable outcome:** A dependency timeline and site-readiness checklist. Use 16, 24 and 26.5 weeks only as the respective dated proposal models; explain different scopes and what each model assumes. Do not invent stage-by-stage durations to make the total look complete.

**Visuals and FAQs:** Timeline showing concurrent site work and equipment supply; a commissioning handover checklist. Candidate questions: whether arrival means immediate production, and what site work can proceed during manufacture. Conclude with the next milestone the owner must make ready.

**Dependencies:** Packing dimensions, lifting/lowbed needs, route access, confirmed approvals and acceptance criteria. Link to `/delivery-shipping`; avoid fixed national clearance or transport promises.

### Article 2.2: How much water does a gold wash plant need?

**Route:** `/insights/gold-wash-plant-water`; paired Kiswahili guide beneath `/insights-swahili/`.

**Reader and decision:** An owner checking whether their available water source and site can support the proposed duty.

**Opening and flow:** Define circulating flow, recovered return water, initial system fill and fresh makeup. Explain where water leaves the system and why clay, retained moisture, evaporation, leakage, bleed and pond operation affect the balance. Separate water demand from pump power and pond storage.

**Usable outcome:** A clearly labelled water-balance worksheet: system boundary, measured/assumed inflows and outflows, daily productive hours, startup fill and seasonal supply. Reconcile return and loss streams before calculating fresh-water demand. Populate a numerical example only from reviewed inputs; keep unknown values blank.

**Visuals and FAQs:** Water-loop diagram and an inflow/outflow table. Candidate questions: whether circulating flow equals river abstraction, and whether recycled water eliminates makeup demand. Close with the measurements needed before selecting pumps and ponds.

**Dependencies:** Review the snapshot's water figures. Pond volume needs settling tests, solids duty, storage and site constraints; do not derive a universal pond size from feed capacity alone. Verify any water-use or discharge requirements against current official sources during drafting.

### Article 2.3: Where to buy gold wash plant equipment in Tanzania

**Route:** `/insights/buy-gold-wash-plant-tanzania`; paired Kiswahili guide beneath `/insights-swahili/`.

**Reader and decision:** An owner comparing supply routes and trying to obtain comparable quotations.

**Opening and flow:** Explain what a written supply scope should identify before comparing a local purchase with import. Discuss availability, model duty, technical support, spares, inspection, delivery terms, inland transport, installation and warranty responsibilities.

**Usable outcome:** A quotation-comparison sheet with the machine list, delivery term/named place, currency/date/validity, exclusions, lead-time dependencies, documentation, service scope and acceptance method. Show confirmed local/import sourcing only after D8 is answered; leave undecided items explicitly unconfirmed.

**Visuals and FAQs:** Scope comparison table and a supply-to-site sequence. Candidate questions: whether a port-delivered quote includes site installation, and what documents to request before payment. Conclude with an itemised enquiry rather than a generic supplier endorsement.

**Dependencies:** Actual sourcing decisions, current transport quotes and verified trade/tax requirements. Do not claim stock, automatic exemptions or universal import markups.

### Related generator-sizing article

**Route:** `/insights/what-size-generator-do-i-need`; prepare its Kiswahili counterpart beneath `/insights-swahili/`.

Explain kW versus kVA, prime versus standby, simultaneous running load, motor-starting requirements, starting sequence, manufacturer limits and site conditions. Use a transparent load-list example with explicitly assumed values; show what an electrical specialist must confirm. Match the existing calculator's assumptions and explain its limits. Link to `/generator-rental`, the Kiswahili rental page and off-grid-power guidance. The reader should leave with a load schedule suitable for a sizing enquiry, not a guarantee that a fixed kVA unit will start every plant.

### Visual and social deliverables

The planned carousel is **How a gold wash plant works in seven steps**. Derive its sequence from the reviewed main guide, not the unreviewed snapshot. Each slide should explain one process change in a complete, natural sentence, with a diagram crop or an appropriate illustration. Finish with the project inputs needed to discuss a plant. Use `tools/social-carousel` only after checking its current working content; those files include separate ongoing work.

Available catalogue references include `public/equipment/rotary-scrubber.jpeg`, `trommel-screen.jpg`, `centrifugal-gold-concentrator.jpg`, `sluice-box-gold-jig.webp`, `shaking-table-gold.jpg` and `alluvial-gold-wash-plant.jpg`. File existence is not evidence of image rights, suitability, resolution or the proposed model. Check those properties before selection, caption references accurately and provide meaningful alt text. Prefer the existing code-native flow for process explanations; no new image generation is needed to assemble these briefs.

### Language, linking and implementation

Plan each English/Kiswahili pair from the same facts and reader outcome. Use the shared `ArticleLayout`, equivalent examples and reciprocal language links. Have substantial Kiswahili drafts reviewed for natural technical expression. Confirm new Kiswahili slugs during drafting, then register every guide in the central `/insights-swahili` directory. Do not create new standalone root-level Kiswahili articles or add the directory to the main navigation.

Link the main wash-plant guide from relevant equipment pages in both languages. Supporting articles link back to the main guide and only to other articles that answer a useful next question. Update the rainy-season, plant-cost, test-work and off-grid-power articles with appropriate contextual links. Existing Kiswahili rental and cost pages now use `/insights-swahili/`; old root addresses in the historical tracking log are redirects.

For standard guides, register metadata and related links in the existing article library, add body content in `src/content/insights/` or `src/content/sw/`, and use shared FAQ copy only where useful. The custom `/alluvial` guide needs an explicit rendering/inventory decision so it uses the common article presentation without losing its process diagram. Add canonical/language metadata, contents anchors, sitemap entries and hub discovery together.

### Evidence still to collect

- [ ] Representative feed and recovery evidence sufficient for the process claims: clay behaviour, gold sizes, oversize assays, classification and mass-balance basis.
- [ ] Offered equipment specifications, especially centrifugal feed size/duty, washing-screen versus trommel identity and complete outlet routing.
- [ ] Reviewed motor/load list and starting assessment for each scope, including any expansion provision.
- [ ] Water balance and settling evidence; water source, seasonal availability and site constraints.
- [ ] Approved public delivery-stage extract, packing/lifting requirements and commissioning acceptance criteria.
- [ ] Confirmed local/import sourcing and any new scoped public quotations.
- [ ] Current primary sources for legal, environmental, water, trade or tax claims used in a draft. These briefs do not establish current regulatory requirements.
- [ ] Image provenance and any permission needed for new client/project material.

Drafting can start with the general explanation and approved examples while these items remain explicitly unresolved. Dependent numerical claims must wait for their evidence; do not fill gaps with invented costs, capacities, recovery or deadlines.

### Completion checklist for each article pair

- [ ] The opening establishes the reader's problem and gives a useful direct answer.
- [ ] Connected paragraphs explain the choices, example and resulting decision.
- [ ] Numbers include their source date, units, scope and assumption status beside the claim.
- [ ] The article produces its promised worksheet, comparison or practical sequence.
- [ ] Visuals explain the text and distinguish a concept/proposal from a real installation.
- [ ] Optional FAQs match the body and visible/structured copy; the substantive conclusion follows them.
- [ ] English and Kiswahili carry equivalent guidance, with appropriate language review.
- [ ] Layout, tables, diagram controls and contents links work on mobile and desktop.
- [ ] Article, FAQ and Kiswahili-directory audits pass as applicable; run TypeScript and a production build for rendering/data changes.
- [ ] Metadata, sitemap, reciprocal language links and directory entries are complete. Publishing remains a separately requested action.

---

## Article drafts: English

**Drafted:** 6 October 2026. These bodies are collected for review in this file; they are not yet registered or published as website articles. Proposed titles have been adjusted where the available evidence cannot support a price promise. Production visuals and shared FAQ data will be wired in when the drafts are implemented. Technical checks in the source bank remain open.

### EN 1.1 — How to build a gold wash plant, step by step

An alluvial gold wash plant should be designed around the gravel it will receive, rather than around a collection of machines bought separately. Before choosing a drum, screen or concentrator, you need to know how the material washes, where the gold sits and whether the site can supply enough feed, water and power for the intended duty.

For a new project, the useful starting point is a representative sample and a process brief. Those inputs connect the deposit to the equipment, the equipment to the supporting infrastructure, and the infrastructure to a realistic startup budget. This guide follows that sequence so you can prepare a proposal that covers a working plant.

#### Establish what the plant must treat

Alluvial deposits contain sediment and gravel in which some gold may already be liberated. That differs from hard-rock ore, where crushing and grinding may be needed to release the gold. Even within an alluvial deposit, washing behaviour and gold distribution can change between layers or areas.

Collect material that represents the planned feed, including the difficult sections. Ask the test programme to explain gold content by size, how clay breaks down, what gravity treatment recovers and what remains in rejected material or tailings. A rich pan sample identifies an occurrence; it does not establish the average feed or the equipment duty for continuous production. [Test work before buying a plant](/insights/plant-test-work-guide) explains how to turn these questions into a laboratory brief.

#### Follow the material through the plant

The receiving hopper gives the loader a defined feed point, while a feeder controls the rate entering the washing section. Oversize handling belongs in this design: sampling must establish whether material rejected by a grizzly or screen can be discarded or needs another treatment route.

Washing then prepares the feed for classification and recovery. A trommel separates sizes through a rotating screen; a scrubber adds a washing duty whose suitability depends on the material. Some clay requires a different treatment, so the presence of clay alone is not enough to specify a rotary scrubber. [McLanahan's scrubber guidance](https://www.mclanahan.com/products/rotary-scrubbers) explains why clay type and feed characteristics affect selection.

After washing, direct each size fraction to equipment that can accept it. In the scrubber-based proposal concept, centrifugal recovery and sluices serve different streams, followed by concentrate cleanup. The final screen openings, concentrator feed limits and flow rates must agree with the offered models. Trace each concentrate and tailings outlet; an equipment list without those connections leaves part of the process undefined.

**Process visual:** Show receiving → controlled feeding → washing/classification → appropriate recovery streams → concentrate cleanup → product handling, with all tailings connected to the water-management route. Caption it as a proposed process concept, not an installed plant.

#### Choose capacity from productive hours

Nominal feed capacity is the rate the design targets under stated conditions. Monthly production also depends on available material, operating hours, interruptions and whether water or downstream equipment constrains the line.

For an explicitly assumed planning example, a 75 m³/h line scheduled for 10 hours a day and 26 days a month, with 80% productive availability, would treat `75 × 10 × 26 × 0.80 = 15,600 m³/month`. A 150 m³/h line under the same assumptions would treat 31,200 m³. These are arithmetic examples, not predictions of a deposit or plant. Use the same volume basis throughout and replace the inputs with your project evidence.

#### Plan the supporting systems and startup funding

Prepare a site layout that includes access, unloading, foundations, operating space, water storage and return, tailings handling, electrical distribution and controlled concentrate handling. Give the generator supplier a motor list and starting sequence; give the water-system designer a balance that distinguishes circulation from fresh supply.

The approved proposal examples illustrate how scope changes the budget. The 5 October 2026 washing-screen-and-six-sluice package contains USD 66,300 of equipment and an equipment-plus-execution allowance of USD 141,843. The 3 October scrubber proposals show USD 351,595 for the 75 m³/h starter scope and USD 501,638 for the 150 m³/h full scope. These are different proposed configurations. Separately payable taxes, owner costs and operating capital still need to be budgeted. See the [plant setup cost guide](/insights/gold-plant-setup-cost) for the breakdown.

#### Questions before you order

**Can I buy the machines first and test the gravel later?** You can obtain preliminary offers, but the final duty should follow the tests. Otherwise you may commit to a washing or recovery arrangement that requires replacement or additional equipment once the actual material is understood.

**Does a gravity plant guarantee a finished gold product?** Gravity treatment produces a concentrate whose quality depends on the feed and operating conditions. Include cleanup, product testing and the agreed handling route in the scope; do not treat the concentrator's output as a guaranteed sale-ready product.

#### Turn the evidence into a complete plant brief

The right wash plant connects a tested feed to a defined process and supporting systems. Start with representative material, then specify capacity against realistic productive hours and confirm how every output will be handled. Before ordering, you should have an itemised scope, site responsibilities, startup budget and acceptance plan that describe the same project.

**Basis:** The configurations and prices are dated client-facing proposal examples, not measured operating results. The capacity example uses stated teaching assumptions. The linked test-work guide and manufacturer reference support the selection approach; they do not validate the proposal's capacity or recovery.

**Next step:** Send Bart Mining the site location, sample/test results, intended feed rate, operating schedule, water source and power information so the remaining scope can be identified.

### EN 1.2 — Gold trommel with sluice box: when a simpler wash plant is enough

A trommel-and-sluice arrangement may suit an alluvial project when washing and screening can prepare the material for effective gravity recovery. The important question is whether that route works on your gravel at the intended rate. A lower equipment price helps only if the plant can produce an acceptable result without unplanned treatment stages.

Before comparing offers, distinguish the machine being sold. A rotary trommel, a rotary scrubber and a vibrating washing screen can appear in washing proposals, but their duties are not interchangeable. Ask the supplier to identify the actual machine and explain the evidence behind its selection.

#### Compare washing duty before comparing prices

A trommel classifies material through openings in a rotating drum. Washing sprays and the machine arrangement determine how it also washes the feed. A scrubber is selected for a more deliberate scrubbing duty, while a vibrating washing screen uses a different motion and arrangement. Whether any of these is sufficient depends on feed size, clay behaviour and the required product.

If sticky lumps remain after washing, gold-bearing material may reach the wrong outlet or remain poorly prepared for recovery. Test the difficult feed as well as the easy-washing gravel. [McLanahan's explanation of scrubbing](https://www.mclanahan.com/solutions/scrubbing) describes why some contaminants require more than washing alone.

#### Include distribution and cleanup

The washing section needs a defined path to the sluices. Specify how slurry is distributed, the duty assigned to each run and the required water supply. A count of six sluices says little without their operating arrangement and the feed they receive.

Plan removal and processing of the captured concentrate alongside tailings sampling. A concentrate can still contain substantial heavy material, so its quantity and quality affect cleanup capacity and the final product route. The [US EPA overview of gravity concentration](https://www.epa.gov/international-cooperation/artisanal-and-small-scale-gold-mining-without-mercury) describes sluicing and subsequent concentration; it does not establish a recovery percentage for your deposit.

#### Understand the scope of the available price example

Bart Mining's approved 5 October 2026 example is a proposed **150 m³/h vibrating washing-screen-and-six-sluice package**. Its USD 66,300 equipment scope includes the washing screen, sluices, mats, water pump, hoses, controls and generator in the priced configuration. It is not a standalone trommel quotation.

| Budget boundary | Dated proposal example |
| --- | --- |
| Equipment scope | USD 66,300 |
| Estimated execution services | USD 75,543 |
| Equipment + execution | USD 141,843 |

The total excludes separately payable taxes, statutory charges and owner operating capital. A different machine, material or delivery scope needs a different quotation. The useful lesson is to compare the whole treatment and delivery scope, rather than borrow a package price for a machine with a similar description.

#### Ask for a comparison you can use

Request the machine model, feed-size limits, capacity basis, washing requirements and recovery arrangement. Ask what the price includes for pumps, generator, controls, wear parts, delivery, installation and training. Request the trial or test results that support the route, including the material rejected and the gold remaining in tailings.

**Visual:** A labelled washing-screen → distribution → sluices → cleanup concept, with a separate water/tailings route. Do not label this diagram as a rotary trommel installation.

#### A remaining question

**Can I add a scrubber later if washing is inadequate?** An addition may be possible, but it can change feed routing, foundations, controls, water and power. Price and design that alternative before assuming it will be a simple upgrade; tests may show that a different washing technology is needed.

#### Choose the simplest route that the evidence supports

A washing-and-sluice plant makes sense when representative trials show that its preparation and recovery duties are suitable. Confirm the material behaviour, cleanup route and supporting services before judging the price. Your next step is a like-for-like scoped offer on the actual proposed machine, supported by results on your feed.

**Basis and enquiry:** The price example is the approved proposal dated 5 October 2026, not a universal trommel price. Send the location, feed description, sample results, target capacity and desired delivery scope to request a suitable comparison.

### EN 1.3 — Small gold wash plant versus full plant: which should you start with?

Starting with a smaller line can reduce the amount committed to the first stage, while a larger line may suit a project with enough tested feed and supporting infrastructure. Neither choice is automatically better. The decision depends on what you know about the deposit, the production duty you can support and how expansion would actually be built.

Bart Mining's scrubber proposal provides a useful comparison: a **Starter Modular Plant at 75 m³/h** and a **Full Scale Plant at 150 m³/h**. These are proposed designs and nominal feed rates, rather than demonstrated monthly output.

#### Compare the same budget boundaries

| Proposal scope, 3 October 2026 | Starter Modular Plant | Full Scale Plant |
| --- | --- | --- |
| Nominal feed | 75 m³/h | 150 m³/h |
| Equipment | USD 137,400 | USD 227,280 |
| Execution allowance | USD 214,195 | USD 274,358 |
| Equipment + execution | USD 351,595 | USD 501,638 |

The larger proposal total is USD 150,043 above the starter total. That is a comparison of these scopes, not the price of adding a second line. Both still need separately payable taxes, owner costs and operating cash. The starter scope includes substantial supporting work, which explains why halving nominal capacity does not halve the complete proposal allowance.

#### Calculate the duty your project can sustain

Assume, only for comparison, 10 scheduled hours a day, 26 days a month and 80% productive availability. The starter line would then treat 15,600 m³/month and the full line 31,200 m³/month. Before planning either volume, establish whether excavation and haulage can supply it and whether water, power, maintenance and downstream duties can sustain it.

If both scenarios used an assumed grade of 0.20 g/m³, their contained feed gold would be 3,120 g and 6,240 g respectively. Those figures are **before recovery and selling deductions**. The grade is hypothetical; neither figure is revenue or profit. A useful business comparison replaces the grade with representative evidence and compares complete costs at more than one productive-hours scenario.

#### Design expansion as a project

For a staged plan, decide which facilities are built for Line 1 and which are sized for the eventual second line. Space, water return, electrical distribution and product handling need to be considered together. Shared infrastructure may reduce repeated work, but provision built early also consumes first-stage capital.

Two independent processing lines may allow one to operate while the other is serviced. That benefit depends on adequate feed and on shared systems remaining available. A common water or power interruption can affect both, so describe the actual arrangement rather than promise uninterrupted production.

**Visual:** Two proposed layouts showing the starter line, reserved expansion space and shared facilities. Mark unconfirmed expansion duties clearly.

#### Questions about staging

**Will running the starter plant prove the whole deposit?** Production data can improve understanding of the material actually treated. It does not automatically establish the grade, variability or available volume of areas not sampled or mined. Stage investment around defined evidence milestones rather than replacing pre-investment sampling with production.

**Should I choose the cheaper proposal if funds are limited?** Check whether you can fund its excluded work and operating reserve as well as the quoted scope. A package that fits the equipment budget can still be unaffordable to commission or operate.

#### Match investment to evidence and available funding

Choose the starter approach when its duty fits the tested feed supply and a separately scoped expansion preserves useful flexibility. Investigate the larger line when evidence and infrastructure support the higher duty and the complete funding requirement is affordable. Before deciding, compare both under the same assumptions for productive hours, grade, recovery and owner costs.

**Basis and enquiry:** Costs are approved 3 October 2026 proposal examples. All production and grade calculations above are teaching assumptions. Send the test results, production plan, utilities and intended expansion milestones for a project-specific comparison.

### EN 1.4 — Gold wash plant equipment list for 75 and 150 m³/h

A useful wash-plant equipment list describes how material moves from the loader to a recoverable product, including the water and tailings streams. It also identifies what the owner must supply. Without those boundaries, two offers can contain similar machines while covering different projects.

The table below follows the two proposed scrubber configurations. It records proposed quantities and functions, not a final selection for every deposit. Confirm offered models and duties after feed testing.

#### Read the list in process order

| Function | Starter Modular Plant, 75 m³/h | Full Scale Plant, 150 m³/h |
| --- | --- | --- |
| Receive feed | Hopper and grizzly | Hopper and grizzly |
| Control feed | Vibrating feeder | Vibrating feeder |
| Wash and classify | Rotary scrubber with screening | Larger rotary scrubber with screening |
| Handle classified slurry | Slurry tank, duty/standby pumps | Slurry tank, duty/standby pumps |
| Centrifugal recovery | 2 proposed units | 3 proposed units |
| Sluice duty | 1 coarse + 2 scavenger runs | 2 coarse + 3 scavenger runs |
| Concentrate cleanup | 1 shaking table | 2 shaking tables |
| Product handling | Proposed gold-room facilities | Proposed gold-room facilities |
| Tailings and return water | Dewatering duty, settling and return system | Dewatering duty, settling and return system |
| Power and controls | Generator and electrical/control scope to confirm | Generator and electrical/control scope to confirm |

The quantities come from the public proposal snapshot. Feed openings, individual capacities and pump duties need to agree with the final process. In particular, do not assume that a fine fraction defined by one screen can enter every centrifugal model without further classification.

#### Identify supporting work separately

A loader and a dependable excavation/haulage arrangement must deliver the required feed, but their purchase or hire should not be assumed included. Likewise, foundations, installation lifting, piping, cabling, water storage and tailings facilities require a defined execution scope even when the machines are supplied as a package.

Ask for interfaces to be described in writing: where the supplier's piping ends, who supplies incoming power, who unloads and lifts equipment, and who prepares the foundations. An apparently complete list can leave these connections unpriced.

#### Use the cost example to check scope, not unit prices

The 3 October 2026 proposals allow USD 137,400 for starter equipment and USD 227,280 for full-scale equipment. With their execution allowances, the totals are USD 351,595 and USD 501,638 respectively. Separately payable taxes, owner costs and operating capital remain additional.

These package figures cannot establish the individual selling price of a scrubber or concentrator. They also cannot be compared directly with the newer six-sluice washing-screen package, which uses a different process scope. Use the [plant-cost guide](/insights/gold-plant-setup-cost) to compare the same budget boundaries.

#### Prepare an offer-comparison checklist

For each item, record its function, quantity, offered model, feed requirements, design duty, power/water demand and included accessories. Then record the supporting scope:

- Wear parts, consumables and the recommended initial spares.
- Foundations, structures, lifting, piping and electrical installation.
- Controls, instruments and the operating information they provide.
- Training, commissioning, sampling and acceptance criteria.
- Delivery responsibilities, documentation and warranty/service terms.

Compare those entries against the same process diagram. If an output or service appears in the drawing but not the scope, resolve it before placing an order.

**Visual:** A process diagram with item numbers matching the table. Label catalogue photographs as equipment references, not pictures of the proposed plant in operation.

#### A remaining question

**Does more recovery equipment necessarily mean more recovered gold?** Equipment changes what treatment is possible, but the result depends on the feed, preparation and operation. Ask for tests and a balance showing where the additional unit would capture gold and what it adds to the supporting duties.

#### Buy a connected process

The equipment list is complete when every feed and output has a defined route and every necessary supporting duty has an owner. Use the proposed quantities as a starting reference, then turn your test results and site conditions into an itemised offer. That gives you a clearer basis for both price comparison and commissioning.

**Basis and enquiry:** Quantities and costs are proposal examples, not final engineering specifications. Send the feed/test information, intended capacity and existing site infrastructure so the process and supply boundaries can be checked together.

### EN 2.1 — How long does it take to set up a gold wash plant?

A wash plant is ready for production when the equipment, site infrastructure and operating arrangements are ready together. The arrival of the machines is one milestone in that sequence. Foundations, water, electrical work, trained operators and an agreed commissioning programme must also be in place.

The practical way to plan the start date is to build a schedule from dependencies. Identify what releases each stage, which work can proceed in parallel and what evidence is needed before the next payment or handover.

#### Use proposal durations with their scope

| Dated proposal | Modelled delivery sequence to production |
| --- | --- |
| Washing screen and six sluices, 5 October 2026 | 16 weeks |
| Starter Modular scrubber plant, 3 October 2026 | 24 weeks |
| Full Scale scrubber plant, 3 October 2026 | 26.5 weeks |

These are planning models for different proposed scopes, not guaranteed delivery periods for any plant ordered today. A different machine, manufacturing slot, shipment or site condition can change the schedule. Confirm the contractual start event and milestone conditions; a duration without a defined starting point cannot establish a production date.

#### Release procurement with an agreed design

Before manufacturing or purchasing against a final scope, settle the feed duty, equipment list, utility needs and supply boundaries. Changes made after commitment may affect both money and time. Keep outstanding design questions visible, especially classification, pump duty, motor starting and the owner's site responsibilities.

The supply schedule should identify drawing approval, manufacturing, inspection, shipment readiness and the documentation required for dispatch. Inspection is useful only when the checks and acceptance basis are clear before equipment is packed.

#### Prepare the site while supply progresses

Where the approved design allows it, access, foundations, water facilities and electrical infrastructure can progress during equipment supply. This reduces the risk of a delivered machine waiting for work that could have been completed earlier.

Record the information each site task needs. Foundations need confirmed loads and dimensions; unloading needs equipment weights and lifting arrangements; water works need a reviewed balance and layout. Work started on guessed dimensions may create rework rather than save time.

#### Separate transport from installation

The shipping and delivery scope must identify the route, packing, clearance responsibilities, site access and unloading. Confirm heavy or oversized transport from actual dimensions and weights. A road-time estimate alone does not include equipment availability, loading, port procedures or lifting at the destination. The [delivery and shipping page](/delivery-shipping) explains the information needed for a transport discussion.

After delivery, installation connects mechanical equipment, piping, controls and power. Set a readiness check before wet commissioning: the plant must have the necessary water, suitable feed, functioning instruments and operators who understand the agreed procedures.

#### Agree what commissioning must demonstrate

Define the test feed, measurement basis, sampling method, operating conditions and acceptance records before the trial. Separate mechanical completion from evidence that the agreed process duty has been achieved. Record defects and outstanding items so the handover does not rely on an informal statement that the plant has started.

**Timeline visual:** Supply/design work above a parallel site-preparation track, joining at installation and commissioning. Use actual approved milestone dates when available; do not invent individual stage durations from the overall proposal total.

#### A remaining question

**Can I promise a production date as soon as I order?** You can plan a target date, but it should be tied to confirmed supply and site milestones. Identify the decisions or conditions that could move it and update the forecast when those change.

#### Plan the next prerequisite

The startup period depends on how well equipment supply and site readiness are coordinated. Begin with the agreed scope, then assign each prerequisite, responsible party and acceptance record. The most useful next action is to identify what must be ready for your next milestone, rather than rely on a single month count.

**Basis and enquiry:** Durations come from approved proposal models dated 3 and 5 October 2026. They are not measured national averages or delivery guarantees. Send the site-readiness position, intended scope, access information and target operating date to discuss a dependent schedule.

### EN 2.2 — How much water does a gold wash plant need?

A wash plant needs water moving through its process, but that circulating flow is different from the fresh water drawn into the site. When some water returns from tailings treatment, the fresh supply replaces losses and any required discharge or replacement. You also need water to fill the system before normal circulation begins.

This distinction matters when assessing a borehole, river intake or stored supply. A pump's rated flow cannot, by itself, tell you how much fresh water the operation requires or how large its ponds should be.

#### Define the boundary of the calculation

Draw the plant, water-recovery equipment, ponds and return supply inside one boundary. Record what enters and what leaves that boundary over a stated period. Internal return flow is reuse; it must not be counted as a new external inflow each time it circulates.

At steady storage, the external inputs and outputs balance. Fresh water and water entering with the feed must cover external water leaving with solids, evaporation, seepage/leaks, required discharge and any other identified losses. If stored water is increasing, that increase also needs an input. Startup filling should be calculated separately from routine makeup.

#### Follow the return water and retained solids

Different solids streams can retain different amounts of moisture. Fine clay can also affect clarification and the condition of the water returned to the plant. Investigate these streams rather than assuming that all water sent to a pond is immediately available as clear return water.

The design must include how settled solids are removed and what happens while equipment or ponds are being maintained. [McLanahan's water-management overview](https://www.mclanahan.com/solutions/tailing-water-management) describes water recovery alongside the associated tailings duties; it is not a pond-sizing specification for your site.

#### Work through a transparent example

Assume a hypothetical plant needs **100 m³/h** at its process supply point and receives **80 m³/h** of suitable recovered water there. With no other inflow at that point, the shortfall is `100 − 80 = 20 m³/h`. Over 10 operating hours, that is 200 m³ of makeup supply.

This is arithmetic with assumed inputs, not a measured requirement of the 75 or 150 m³/h proposals. It omits startup filling and assumes the return water is available when needed. A complete site balance must explain the 20 m³/h difference through identified outputs or storage changes and account for water entering with the feed. Replace both flow assumptions with measurements or a reviewed design.

| Worksheet entry | What to record |
| --- | --- |
| Process water duty | Flow and required quality at each supply point |
| Return supply | Recoverable quantity, quality and timing |
| External inputs | Fresh source and moisture entering with feed |
| External outputs | Moisture leaving with solids, discharge and other losses |
| Storage | Initial fill, operating level changes and reserve |
| Operating period | Hours/day, interruptions and seasonal conditions |

#### Size ponds and pumps from their own duties

Pond design needs solids loading, settling behaviour, storage, maintenance access and site conditions. Pump selection needs flow, elevation/pressure losses, water or slurry properties and operating arrangements. Neither should be selected using only the plant's nominal gravel rate.

Confirm source availability during the intended operating season, the permissions relevant to that source and the requirements for any discharge. No current abstraction limit or approval period is assumed in this guide.

**Visual:** A loop showing process supply, tailings/water separation and return, with external inflows, losses and storage labelled separately.

#### A remaining question

**Does recycling mean that I no longer need fresh water?** Only a reviewed balance can establish the external supply required. A return system can reduce demand, but startup filling, losses and water-quality management still need to be addressed.

#### Decide from the balance, not the pump label

First define the water streams, then establish how much suitable water returns and when. Use the resulting balance to assess fresh supply, storage and treatment, and size each pump for its actual duty. Before buying equipment, collect the flow, solids and seasonal information that makes that assessment possible.

**Basis and enquiry:** The numerical example is hypothetical. Proposal water figures remain subject to confirmation and are not presented here as requirements. Send source information, operating hours, feed characteristics and available test results for a water-system discussion.

### EN 2.3 — Where to buy gold wash plant equipment in Tanzania

You can investigate equipment available in Tanzania and equipment supplied through import, but a useful buying decision starts with a common plant duty and scope. The quoted price has meaning only when you know what is being supplied, where responsibility transfers and what remains to be completed on site.

Bart Mining can discuss an itemised equipment and execution proposal. The local or imported origin of each item, its actual availability and its delivery conditions must be confirmed in that offer; this guide does not claim that every listed machine is stocked locally.

#### Define the duty before requesting offers

Give each supplier the same feed description, sample/test results, intended capacity basis and operating schedule. Include the water and power available, the delivery location and the supporting work already completed. Otherwise one offer may assume only equipment supply while another includes a wider installation programme.

Ask the supplier to show how the proposed machines connect and why the washing and recovery route fits the material. A machine description or attractive photograph is not enough to establish that relationship.

#### Compare complete supply boundaries

| Comparison entry | Question to settle in writing |
| --- | --- |
| Equipment | Which models, quantities, accessories and spares are supplied? |
| Technical duty | What feed and operating conditions support capacity and recovery claims? |
| Delivery | What term and named place apply, and who handles each transport stage? |
| Installation | Who provides foundations, lifting, piping, cabling and controls? |
| Commissioning | What trial, training, sampling and handover records are included? |
| Commercial terms | What are the currency, date, validity, exclusions and payment milestones? |
| Support | How are warranty work, servicing and replacement parts arranged? |

Use one copy of this table for each offer. Resolve a blank entry before interpreting the total as a complete startup price.

#### Understand the delivery term

An offer delivered to a port is different from an offer installed at your site. Under CIF, the seller arranges freight and insurance to the named destination port, while risk transfers when the goods are placed aboard the vessel at origin. Customs clearance, inland delivery and installation are not automatically included. [ICC Academy explains this separation of cost and risk](https://academy.iccwbo.org/incoterms/article/place-of-delivery-risk-transfer-global-trade-contracts/).

Request actual packing dimensions and weights before pricing the inland route. Confirm loading, unloading, insurance and any special access requirements. Taxes and statutory charges need their own verified treatment for the goods and importer concerned; do not assume a general exemption because the equipment is used for mining.

#### Read proposal examples as scope references

The approved 5 October 2026 washing-screen-and-six-sluice example contains USD 66,300 of equipment, with an equipment-plus-execution allowance of USD 141,843. Its scope differs from the scrubber configurations in the [equipment list guide](/insights/gold-wash-plant-equipment-list). These figures help illustrate the boundaries to ask about; they are not a national price list or confirmation of current availability.

#### A remaining question

**Is local supply always cheaper or faster?** Compare the actual offered machine, available date and complete delivered scope. Local fabrication or assembly may involve imported components, and an imported offer may omit services available in another proposal. Obtain confirmed item-level sourcing and lead times before drawing a conclusion.

#### Request comparable offers

The best buying comparison uses the same tested feed, process duty and delivery destination for every supplier. Confirm what is included and who completes the interfaces, then compare the budget and dependent schedule. Prepare those inputs before asking for a plant price so the resulting offer addresses your project.

**Basis and enquiry:** The commercial example is a dated approved proposal, not a current market survey. Send the site, feed/test information, target duty and desired supply boundary to discuss an itemised quotation. Confirm local/import sourcing in that quotation.

### EN 0.6 — What size generator do I need? A kVA guide for mines and sites

The generator size needed for a plant depends on both the power required while equipment runs and the demand created when loads start or change. Adding the motor labels gives you part of the picture, but it does not confirm that a particular generator will start the plant or carry its full operating sequence.

Begin with a load schedule, then have the proposed set checked against its actual ratings, starting performance and site conditions. This makes a generator enquiry useful even when you do not yet know the final kVA size.

#### Separate electrical input from motor output

Record each load's actual electrical input, operating power factor and starting information where available. A motor's mechanical output rating is not its complete electrical demand: efficiency and operating conditions affect the input. Label unconfirmed entries so they are not mistaken for measured loads.

kW describes active power and kVA apparent power. For a defined load with power factor 0.8, an assumed 120 kW electrical demand corresponds to `120 ÷ 0.8 = 150 kVA`. The power factor is an assumption here; a motor list can contain different values, so establish the aggregate duty rather than applying one convenient number to every item.

#### Build the operating sequence

| Hypothetical simultaneous load | Assumed electrical input |
| --- | --- |
| Washing drive | 40 kW |
| Feed and slurry equipment | 35 kW |
| Water pumps | 30 kW |
| Lighting and auxiliary loads | 15 kW |
| Running total | 120 kW |

This is a teaching load list, not a measurement of a Bart Mining plant. Record which items run together and what is already operating when the largest motor starts. Then obtain the starting characteristics and acceptable voltage/frequency response for the actual equipment. The 150 kVA arithmetic above is a running-load reference, not a generator recommendation.

#### Check the offered model and duty

A set must satisfy both engine power and alternator/loading requirements at the site. The assessment should include voltage, frequency, phases, starting controls, ambient conditions and any relevant site derating. Prime and standby ratings refer to different operating duties; use the manufacturer's limits for the intended hours and loading rather than choosing the larger advertised number. [Cummins' application manual](https://www.cummins.com/sites/default/files/2024-08/t030-Liquid-cooled-gen-set-application-manual.pdf) provides a manufacturer reference for these checks.

A soft starter or variable-speed drive changes how the load is applied, but its suitability must be checked with the motor and generator system. There is no fixed percentage by which it lets you reduce every generator. Similarly, parallel sets need an appropriate synchronising, protection and load-sharing arrangement; their nameplate totals alone do not define a working supply.

#### Budget fuel from the operating profile

Ask for the proposed model's fuel-consumption information at the expected loading and site conditions. Use the operating schedule to calculate deliveries, storage and service intervals. Avoid treating the generator's maximum kVA rating as the average electrical consumption of the plant.

The [generator-rental calculator](/generator-rental) helps assemble an initial load enquiry. Bart Mining's confirmed rental service covers 300–2,500 kVA, with availability and the offered model confirmed for the hire dates. That service range does not establish the generator required by the hypothetical example.

#### A remaining question

**Should I buy a much larger set to avoid starting problems?** Obtain the starting assessment first. A larger nameplate may not address every system issue, and the proposed model still needs checking for the expected running profile. Compare suitable designs with the specialist rather than applying an arbitrary reserve percentage.

#### Send a load schedule, not just a kVA guess

To establish the right size, provide the electrical load list, starting arrangements, sequence, operating hours, site conditions and any planned expansion. Use arithmetic to make the inputs visible, then ask a qualified electrical specialist to confirm the set and installation for that duty. That gives you a defensible quotation and a clearer operating plan.

**Basis and enquiry:** Numbers in the worked example are hypothetical electrical inputs. Rental facts come from the company record confirmed on 3 October 2026; the model and availability remain enquiry-specific. Send your load list, site and required dates to discuss sizing and rental.

## Rasimu za makala: Kiswahili

**Tarehe ya rasimu:** 6 Oktoba 2026. Makala hizi zimeandaliwa kwa mapitio katika faili hili; bado hazijaongezwa kwenye tovuti. Zitumie mpangilio wa pamoja wa makala na ziwekwe chini ya `/insights-swahili/`. Takwimu, maelezo ya wigo na masharti muhimu lazima yaendane na makala za Kiingereza. Mapitio ya lugha na uthibitisho wa vipimo vya kiufundi bado yanahitajika kabla ya uchapishaji.

### SW 1.1 — Jinsi ya kujenga mtambo wa kuosha dhahabu, hatua kwa hatua

Mtambo wa kuosha dhahabu ya alluvial unapaswa kuchaguliwa kulingana na mchanga na changarawe utakazochakata. Dhahabu ya alluvial ni dhahabu iliyokusanyika kwenye mashapo, kwa mfano kwenye tabaka za mchanga na changarawe. Kabla ya kununua mashine, unahitaji kuelewa jinsi malighafi inavyooshwa, sehemu dhahabu ilipo na kama eneo linaweza kutoa malighafi, maji na umeme wa kutosha kwa kazi iliyopangwa.

Kwa mradi mpya, anza na sampuli inayowakilisha malighafi na maelezo ya kazi unayotaka mtambo ufanye. Taarifa hizo zinaunganisha hali ya amana na mfumo wa uchakataji, vifaa vinavyohitajika na bajeti ya kufikia uzalishaji. Mwongozo huu unafuata hatua hizo ili ombi lako la bei lieleze mradi mzima.

#### Tambua malighafi utakayochakata

Kwenye amana ya alluvial, sehemu ya dhahabu inaweza kuwa tayari imeachana na mwamba. Hali hiyo ni tofauti na mawe magumu ambayo yanaweza kuhitaji kuvunjwa na kusagwa ili kuachia dhahabu. Hata ndani ya eneo moja la alluvial, udongo wa mfinyanzi na mgawanyo wa dhahabu vinaweza kutofautiana kati ya tabaka au sehemu za amana.

Chukua sampuli kutoka kwenye malighafi inayotarajiwa kulisha mtambo, pamoja na sehemu zilizo ngumu kuosha. Majaribio yaonyeshe dhahabu ilivyo katika madaraja mbalimbali ya ukubwa, namna mfinyanzi unavyovunjika, kiasi kinachopatikana kwa utenganishaji wa uzito na kinachobaki kwenye malighafi inayotengwa au mabaki. Sampuli yenye dhahabu nyingi kwenye beseni haithibitishi wastani wa malighafi ya uzalishaji. [Mwongozo wa majaribio kabla ya kununua mtambo, kwa Kiingereza](/insights/plant-test-work-guide), unaeleza namna ya kupanga kazi ya maabara.

#### Fuata malighafi kutoka mwanzo hadi mwisho

Hopper, yaani chombo cha kupokea malighafi, hutoa sehemu maalumu ya kupakia. Feeder hudhibiti kiwango kinachoingia kwenye sehemu ya kuosha. Mpango pia ueleze hatima ya mawe makubwa yanayotengwa na grizzly au skrini; sampuli zisaidie kuthibitisha kama yanaweza kuondolewa au yanahitaji uchakataji mwingine.

Trommel hutenganisha ukubwa kwa skrini inayozunguka. Scrubber huongeza kazi ya kuosha kwa msuguano na mzunguko, lakini ufaafu wake unategemea aina ya malighafi. Baadhi ya mfinyanzi unaweza kuhitaji teknolojia nyingine, hivyo uwepo wa mfinyanzi pekee hautoshi kuchagua rotary scrubber. [Maelezo ya McLanahan kuhusu scrubber, kwa Kiingereza](https://www.mclanahan.com/products/rotary-scrubbers), yanafafanua umuhimu wa aina ya udongo na sifa za malighafi.

Baada ya kuosha, elekeza kila daraja la ukubwa kwenye kifaa kinachoweza kulipokea. Kwenye pendekezo la scrubber, centrifugal concentrators na sluices zinahudumia mikondo tofauti kabla ya kusafisha mkusanyiko wenye dhahabu. Matundu ya skrini, ukubwa unaokubalika kwenye concentrator na viwango vya mtiririko viendane na modeli zinazotolewa. Kila mkondo wa mkusanyiko na mabaki uwe na njia iliyoelezwa.

**Mchoro unaopendekezwa:** Kupokea → kudhibiti malighafi → kuosha na kutenganisha ukubwa → utenganishaji unaofaa → kusafisha mkusanyiko → kushughulikia bidhaa. Onyesha pia njia za mabaki na maji. Eleza kuwa huu ni mchoro wa dhana inayopendekezwa, si mtambo uliokwisha kujengwa.

#### Linganisha uwezo na saa halisi za uzalishaji

Uwezo uliotajwa wa m³ kwa saa unategemea masharti ya usanifu. Kiasi cha mwezi kinategemea pia upatikanaji wa malighafi, saa za kazi, kusimama kwa mtambo na uwezo wa maji au vifaa vinavyofuata.

Kwa mfano wa hesabu pekee, mtambo wa 75 m³/h uliopangwa kufanya kazi saa 10 kwa siku, siku 26 kwa mwezi, ukiwa katika uzalishaji kwa 80% ya saa zilizopangwa, ungechakata `75 × 10 × 26 × 0.80 = 15,600 m³/mwezi`. Mtambo wa 150 m³/h kwa masharti hayo ungechakata 31,200 m³. Haya ni makisio ya kufundishia, si utabiri wa amana au mtambo wako. Tumia msingi mmoja wa kupima ujazo na badilisha makisio kwa taarifa za mradi.

#### Panga miundombinu na fedha za kuanza

Mpangilio wa eneo ujumuishe njia ya kufikia mtambo, kushusha vifaa, msingi, nafasi ya kufanya kazi, maji na mzunguko wake, mabaki, usambazaji wa umeme na udhibiti wa mkusanyiko wenye dhahabu. Kwa uchaguzi wa jenereta, toa orodha ya mota na mpangilio wa kuwasha. Kwa mfumo wa maji, tofautisha maji yanayozunguka na maji mapya yanayoingia.

Mifano ya mapendekezo yaliyoidhinishwa inaonyesha tofauti ya wigo. Pendekezo la tarehe 5 Oktoba 2026 la washing screen na sluices sita lina vifaa vya USD 66,300 na jumla ya vifaa pamoja na makadirio ya utekelezaji ya USD 141,843. Mapendekezo ya scrubber ya tarehe 3 Oktoba yana jumla ya USD 351,595 kwa 75 m³/h na USD 501,638 kwa 150 m³/h. Kodi zinazolipwa kando, gharama za mmiliki na fedha za kuendesha bado zinahitaji bajeti yake. [Mwongozo wa gharama za kuanzisha mtambo](/insights-swahili/gharama-ya-plant-ya-dhahabu) unaonyesha mgawanyo huo.

#### Maswali kabla ya kuagiza

**Naweza kununua mashine kabla ya kufanya majaribio?** Unaweza kuomba bei za awali, lakini uteuzi wa mwisho ufuate matokeo ya malighafi. Vinginevyo unaweza kujifunga kwenye mfumo ambao baadaye unahitaji kubadilishwa au kuongezewa vifaa.

**Utenganishaji wa uzito unahakikisha dhahabu iliyo tayari kuuzwa?** Kifaa hutoa mkusanyiko ambao ubora wake unategemea malighafi na uendeshaji. Jumuisha usafishaji, vipimo vya bidhaa na njia ya kuishughulikia kwenye wigo; usidhanie kuwa kila mkusanyiko ni bidhaa ya mwisho.

#### Geuza ushahidi kuwa maelezo kamili ya mradi

Mtambo unaofaa unaunganisha malighafi iliyojaribiwa na mfumo ulioelezwa pamoja na miundombinu yake. Anza na sampuli, panga uwezo kwa saa zinazowezekana na thibitisha njia ya kila bidhaa na baki. Kabla ya kuagiza, uwe na orodha ya vifaa, majukumu ya eneo, bajeti na utaratibu wa kuthibitisha matokeo unaoeleza mradi huo huo.

**Msingi na hatua inayofuata:** Bei ni mifano ya mapendekezo yenye tarehe, si gharama zilizopimwa baada ya ujenzi. Hesabu ya uzalishaji ina makisio yaliyotajwa. Tutumie eneo, matokeo ya sampuli na majaribio, kiwango cha malighafi, saa za kazi, chanzo cha maji na taarifa za umeme ili kujadili wigo unaobaki.

### SW 1.2 — Trommel na sluice za dhahabu: lini mfumo rahisi wa kuosha unatosha?

Mfumo wa trommel na sluices unaweza kufaa pale ambapo kuosha na kutenganisha ukubwa kunatayarisha malighafi vizuri kwa utenganishaji wa dhahabu kwa uzito. Swali la msingi ni kama mfumo huo unafanya kazi kwenye changarawe yako kwa kiwango kinachotakiwa. Bei ndogo ya vifaa inasaidia tu ikiwa matokeo yanakubalika bila kuhitaji hatua nyingine zisizopangwa.

Kabla ya kulinganisha bei, tambua mashine inayotolewa. Rotary trommel, rotary scrubber na vibrating washing screen zinaweza kuonekana kwenye mapendekezo ya kuosha, lakini kazi zake hazifanani katika kila hali. Muuzaji ataje mashine halisi na ushahidi wa kuichagua.

#### Linganisha kazi ya kuosha kwanza

Trommel hutenganisha malighafi kupitia matundu ya ngoma inayozunguka; mpangilio wa maji na mashine huamua jinsi inavyoosha pia. Scrubber huchaguliwa kwa kazi maalumu ya kusugua na kuosha, huku vibrating washing screen ikitumia mtetemo na mpangilio tofauti. Ufaafu hutegemea ukubwa wa malighafi, tabia ya mfinyanzi na matokeo yanayotakiwa.

Iwapo mabonge ya mfinyanzi yanabaki baada ya kuosha, malighafi yenye dhahabu inaweza kwenda kwenye mkondo usiofaa au kutotayarishwa vizuri kwa utenganishaji. Jaribu sehemu ngumu kuosha pamoja na zile rahisi. [Maelezo ya McLanahan kuhusu scrubbing, kwa Kiingereza](https://www.mclanahan.com/solutions/scrubbing), yanafafanua kwa nini baadhi ya malighafi inahitaji kazi zaidi ya kuoshwa tu.

#### Jumuisha mgawanyo wa mtiririko na usafishaji

Kutoka kwenye mashine ya kuosha, eleza jinsi malighafi na maji vinavyogawanywa kwenda kwenye sluices. Taja kazi ya kila njia na maji yanayohitajika. Idadi ya sluices sita haiwezi kueleza uwezo wa mfumo bila kujua mpangilio na malighafi inayozipitia.

Panga utoaji na usafishaji wa mkusanyiko pamoja na kuchukua sampuli za mabaki. Mkusanyiko unaweza bado kuwa na madini mengine mazito, hivyo kiasi na ubora wake vinaathiri kazi ya usafishaji na bidhaa ya mwisho. [Mwongozo wa US EPA kuhusu utenganishaji wa uzito, kwa Kiingereza](https://www.epa.gov/international-cooperation/artisanal-and-small-scale-gold-mining-without-mercury), unaeleza sluices na hatua zinazofuata; hauhakikishi asilimia ya dhahabu itakayopatikana kwenye mradi wako.

#### Elewa mfano wa bei uliopo

Mfano wa Bart Mining ulioidhinishwa wa tarehe 5 Oktoba 2026 ni **vibrating washing screen yenye sluices sita, yenye uwezo unaopendekezwa wa 150 m³/h**. Wigo wa vifaa wa USD 66,300 unajumuisha skrini ya kuosha, sluices, mikeka ya kunasa dhahabu, pampu, mabomba, mfumo wa udhibiti na jenereta iliyoko kwenye pendekezo. Hii si bei ya trommel pekee.

| Sehemu ya bajeti | Mfano wa pendekezo |
| --- | --- |
| Vifaa | USD 66,300 |
| Makadirio ya huduma za utekelezaji | USD 75,543 |
| Vifaa + utekelezaji | USD 141,843 |

Kodi na tozo zinazolipwa kando pamoja na fedha za kuendesha hazimo kwenye jumla hiyo. Mashine, malighafi au wigo mwingine wa kufikisha unahitaji bei yake. Linganisha matibabu ya malighafi na huduma zinazojumuishwa, badala ya kutumia bei ya kifurushi kwa mashine yenye jina linalofanana.

#### Omba taarifa zinazowezesha uamuzi

Omba modeli, ukubwa unaokubalika wa malighafi, msingi wa uwezo, mahitaji ya kuosha na mpangilio wa kutenganisha dhahabu. Thibitisha pampu, jenereta, udhibiti, vipuri vya uchakavu, kufikisha, ufungaji na mafunzo vinavyojumuishwa. Matokeo ya majaribio yaeleze pia malighafi iliyotengwa na dhahabu iliyobaki kwenye mabaki.

**Mchoro:** Washing screen → mgawanyo wa mtiririko → sluices → usafishaji, pamoja na njia ya maji na mabaki. Usiuite mchoro huu mtambo wa rotary trommel.

#### Swali linalobaki

**Naweza kuongeza scrubber baadaye ikiwa kuosha hakutoshi?** Inaweza kuwezekana, lakini mabadiliko yanaweza kuhusisha njia ya malighafi, msingi, udhibiti, maji na umeme. Chunguza na panga gharama za mabadiliko kabla ya kudhania kuwa ni ongezeko dogo; majaribio yanaweza kuonyesha teknolojia tofauti inahitajika.

#### Chagua mfumo rahisi unaoungwa mkono na majaribio

Mfumo wa kuosha na sluices unafaa pale ambapo sampuli zinazowakilisha malighafi zinaonyesha kuwa kazi zake zinatosha. Thibitisha kuosha, usafishaji wa mkusanyiko na huduma za ziada kabla ya kuhukumu bei. Hatua inayofuata ni kuomba bei yenye wigo unaolingana kwa mashine halisi, ikisaidiwa na matokeo ya malighafi yako.

**Msingi na mawasiliano:** Mfano wa bei unatokana na pendekezo la tarehe 5 Oktoba 2026, si bei ya jumla ya trommel. Tutumie eneo, maelezo na majaribio ya malighafi, uwezo unaolengwa na wigo wa kufikisha unaotaka.

### SW 1.3 — Mtambo mdogo au mkubwa wa kuosha dhahabu: uanze na upi?

Kuanza na laini ndogo kunaweza kupunguza kiasi kinachowekezwa kwenye hatua ya kwanza. Laini kubwa inaweza kufaa mradi wenye malighafi iliyothibitishwa na miundombinu inayoweza kuuhudumia. Hakuna chaguo linalofaa kila mradi; uamuzi unategemea ushahidi wa amana, uzalishaji unaowezekana na namna upanuzi utakavyotekelezwa.

Pendekezo la scrubber la Bart Mining linatoa mifano miwili: **Starter Modular Plant ya 75 m³/h** na **Full Scale Plant ya 150 m³/h**. Hivi ni viwango vya malighafi vinavyopendekezwa, si uzalishaji wa mwezi uliothibitishwa.

#### Linganisha sehemu zilezile za bajeti

| Pendekezo la tarehe 3 Oktoba 2026 | Starter Modular Plant | Full Scale Plant |
| --- | --- | --- |
| Uwezo unaopendekezwa | 75 m³/h | 150 m³/h |
| Vifaa | USD 137,400 | USD 227,280 |
| Makadirio ya utekelezaji | USD 214,195 | USD 274,358 |
| Vifaa + utekelezaji | USD 351,595 | USD 501,638 |

Tofauti ya jumla ni USD 150,043. Hii ni tofauti kati ya wigo wa mapendekezo hayo, si bei ya kuongeza laini ya pili. Kodi zinazolipwa kando, gharama za mmiliki na fedha za uendeshaji bado zinaongezwa. Pendekezo la kuanzia linajumuisha kazi muhimu za miundombinu, ndiyo maana kupunguza uwezo kwa nusu hakupunguzi jumla yote kwa nusu.

#### Hesabu uzalishaji ambao mradi unaweza kuuhudumia

Tuchukulie kwa mfano saa 10 kwa siku, siku 26 kwa mwezi na uzalishaji kwa 80% ya saa zilizopangwa. Laini ya kuanzia ingechakata 15,600 m³ kwa mwezi na kubwa 31,200 m³. Kabla ya kupanga ujazo huo, thibitisha uchimbaji na usafirishaji wa malighafi pamoja na uwezo wa maji, umeme, matengenezo na vifaa vinavyofuata.

Iwapo zote zingetumia kiwango cha dhahabu cha kubuni cha 0.20 g/m³, dhahabu iliyomo kwenye malighafi ingekuwa 3,120 g na 6,240 g. Hizi ni hesabu **kabla ya upotevu kwenye uchakataji na makato ya mauzo**. Kiwango cha dhahabu ni makisio; majibu hayo si mapato wala faida. Linganisha gharama kamili kwa viwango tofauti vya saa za uzalishaji, ukitumia taarifa zinazowakilisha amana yako.

#### Panga upanuzi kama mradi wake

Amua ni miundombinu gani itajengwa kwa Line 1 na ipi itaandaliwa kwa Line 2 ya baadaye. Nafasi, kurudisha maji, usambazaji wa umeme na kushughulikia bidhaa viangaliwe pamoja. Miundombinu inayotumiwa na laini zote inaweza kupunguza kazi inayorudiwa, lakini kuiandaa mapema pia inahitaji fedha katika hatua ya kwanza.

Laini mbili zinaweza kuruhusu moja kuendelea wakati nyingine inafanyiwa matengenezo. Faida hiyo inategemea malighafi ya kutosha na mifumo ya pamoja kuendelea kufanya kazi. Tatizo la chanzo kimoja cha maji au umeme linaweza kusimamisha zote, hivyo usiahidi uzalishaji usiokatika bila kuchunguza mpangilio.

**Mchoro:** Onyesha laini ya kuanzia, nafasi ya upanuzi na miundombinu ya pamoja. Weka wazi kazi za upanuzi ambazo bado hazijathibitishwa.

#### Maswali kuhusu kuanza kwa hatua

**Uzalishaji wa laini ya kwanza utathibitisha amana yote?** Taarifa za uzalishaji zinaeleza malighafi iliyochakatwa. Hazithibitishi moja kwa moja kiwango cha dhahabu, mabadiliko au ujazo wa sehemu ambazo hazijachukuliwa sampuli au kuchimbwa. Panga hatua za uwekezaji kwa ushahidi maalumu, bila kuondoa umuhimu wa sampuli kabla ya kuwekeza.

**Nichague pendekezo la bei ndogo ikiwa fedha ni chache?** Hakikisha unaweza kulipia kazi zilizotengwa kwenye bei na akiba ya uendeshaji. Vifaa vinaweza kutoshea bajeti yako huku fedha za kuanza au kuendesha mtambo zikiwa hazitoshi.

#### Linganisha uwekezaji na ushahidi uliopo

Chagua njia ya kuanza na laini ndogo ikiwa kazi yake inaendana na malighafi iliyothibitishwa na mpango wa upanuzi una wigo wake. Chunguza laini kubwa ikiwa amana na miundombinu vinaweza kuhudumia kiwango hicho na fedha za mradi mzima zinapatikana. Linganisha zote kwa masharti yale yale ya saa, kiwango cha dhahabu, urejeshaji na gharama za mmiliki.

**Msingi na mawasiliano:** Bei ni mifano ya tarehe 3 Oktoba 2026; hesabu za uzalishaji na kiwango cha dhahabu ni za kufundishia. Tutumie majaribio, mpango wa uzalishaji, maji na umeme pamoja na hatua za upanuzi unazotaka.

### SW 1.4 — Orodha ya vifaa vya mtambo wa kuosha dhahabu wa 75 na 150 m³/h

Orodha nzuri ya vifaa inaeleza njia ya malighafi kutoka kupakiwa hadi kupata bidhaa, pamoja na maji na mabaki. Pia inaonyesha kile mmiliki atakachotoa. Bila mipaka hiyo, bei mbili zinaweza kuwa na majina ya mashine yanayofanana lakini zikajumuisha miradi tofauti.

Jedwali linafuata mapendekezo mawili ya scrubber. Linaonyesha kazi na idadi zinazopendekezwa; si uteuzi wa mwisho kwa kila amana. Thibitisha modeli na kazi zake baada ya majaribio.

#### Soma orodha kwa mpangilio wa uchakataji

| Kazi | Starter Modular Plant, 75 m³/h | Full Scale Plant, 150 m³/h |
| --- | --- | --- |
| Kupokea malighafi | Hopper na grizzly | Hopper na grizzly |
| Kudhibiti malighafi | Vibrating feeder | Vibrating feeder |
| Kuosha na kutenganisha ukubwa | Rotary scrubber na skrini | Rotary scrubber kubwa na skrini |
| Kusafirisha tope lenye malighafi | Tanki na pampu ya kazi/akiba | Tanki na pampu ya kazi/akiba |
| Utenganishaji wa centrifugal | Vifaa 2 vinavyopendekezwa | Vifaa 3 vinavyopendekezwa |
| Sluices | Njia 1 ya coarse + 2 za scavenger | Njia 2 za coarse + 3 za scavenger |
| Kusafisha mkusanyiko | Shaking table 1 | Shaking tables 2 |
| Kushughulikia bidhaa | Miundombinu ya gold room | Miundombinu ya gold room |
| Mabaki na maji yanayorudi | Kuondoa maji kwenye mabaki, kutuliza na kurudisha maji | Kuondoa maji kwenye mabaki, kutuliza na kurudisha maji |
| Umeme na udhibiti | Wigo wa jenereta na mfumo wa umeme uthibitishwe | Wigo wa jenereta na mfumo wa umeme uthibitishwe |

Coarse hapa ni mkondo wa malighafi kubwa zaidi; scavenger ni hatua inayolenga kupata dhahabu iliyobaki kwenye mkondo unaofuata. Kazi halisi na njia zake zionyeshwe kwenye mchoro. Matundu ya skrini, uwezo wa kila kifaa na pampu viendane na mfumo wa mwisho. Daraja linaloitwa fine halikubaliki moja kwa moja kwenye kila modeli ya concentrator.

#### Tenganisha vifaa na kazi za eneo

Loader na mfumo wa uchimbaji na usafirishaji vinahitaji kutoa malighafi ya kutosha, lakini usidhanie kuwa ununuzi au ukodishaji wake umejumuishwa. Msingi, vifaa vya kunyanyua, mabomba, nyaya, hifadhi ya maji na eneo la mabaki vinahitaji wigo ulioelezwa hata mashine zikiuzwa kama kifurushi.

Andika mahali majukumu yanapokutana: mabomba ya muuzaji yanaishia wapi, nani anatoa umeme unaoingia, nani anashusha na kunyanyua mashine na nani anaandaa msingi. Orodha inayoonekana kamili inaweza kuacha viunganishi hivi bila bei.

#### Tumia bei ya kifurushi kukagua wigo

Pendekezo la tarehe 3 Oktoba 2026 lina vifaa vya USD 137,400 kwa mtambo wa kuanzia na USD 227,280 kwa mkubwa. Pamoja na makadirio ya utekelezaji, jumla ni USD 351,595 na USD 501,638. Kodi zinazolipwa kando, gharama za mmiliki na fedha za kuendesha zinaongezwa.

Jumla hizo hazionyeshi bei ya kila scrubber au concentrator. Pia hazilinganishwi moja kwa moja na kifurushi kipya cha washing screen na sluices sita, ambacho kina wigo tofauti. [Mwongozo wa gharama za mtambo](/insights-swahili/gharama-ya-plant-ya-dhahabu) unasaidia kulinganisha sehemu zilezile za bajeti.

#### Andaa jedwali la kulinganisha ofa

Kwa kila kifaa, andika kazi, idadi, modeli, sifa za malighafi inayokubalika, uwezo, mahitaji ya maji na umeme na vifaa vidogo vinavyojumuishwa. Kisha hakiki:

- Vipuri vya uchakavu, vifaa vinavyotumika na akiba ya mwanzo.
- Misingi, miundo, kunyanyua, mabomba na ufungaji wa umeme.
- Udhibiti, vyombo vya kupimia na taarifa vinavyotoa kwa mwendeshaji.
- Mafunzo, majaribio ya kuanza uzalishaji, sampuli na masharti ya kukubali kazi.
- Majukumu ya kufikisha, nyaraka, dhamana na huduma.

Linganisha orodha na mchoro mmoja wa mchakato. Iwapo mkondo au huduma ipo kwenye mchoro bila mwenye jukumu kwenye ofa, tatua pengo hilo kabla ya kuagiza.

**Mchoro:** Weka namba za vifaa zinazolingana na jedwali. Picha za katalogi ziwe na maelezo kuwa ni rejea, si picha za mradi uliokwisha kufungwa.

#### Swali linalobaki

**Kuongeza vifaa vya kutenganisha kunamaanisha dhahabu nyingi zaidi?** Vifaa vinaongeza hatua zinazoweza kufanywa, lakini matokeo hutegemea malighafi, maandalizi na uendeshaji. Omba majaribio na mizania inayoonyesha kifaa cha ziada kitapata dhahabu wapi na mahitaji kitakayoongeza.

#### Nunua mfumo uliounganishwa

Orodha inakuwa kamili pale ambapo kila malighafi na mkondo wa matokeo una njia iliyoelezwa na kila kazi ya ziada ina mwenye jukumu. Tumia idadi hizi kama rejea ya kuanzia, kisha geuza majaribio na hali ya eneo kuwa ofa ya vipengele. Huo ni msingi bora wa kulinganisha bei na kuthibitisha mtambo wakati wa kuanza.

**Msingi na mawasiliano:** Idadi na bei ni mifano ya mapendekezo, si vipimo vya mwisho vya uhandisi. Tutumie taarifa za malighafi, majaribio, uwezo unaolengwa na miundombinu iliyopo ili kukagua mchakato na mipaka ya ugavi pamoja.

### SW 2.1 — Inachukua muda gani kufunga mtambo wa kuosha dhahabu?

Mtambo unakuwa tayari kwa uzalishaji pale vifaa, miundombinu ya eneo na maandalizi ya uendeshaji vinapokuwa tayari pamoja. Kuwasili kwa mashine ni hatua moja ya kazi hiyo. Misingi, maji, umeme, waendeshaji walioandaliwa na utaratibu wa majaribio ya kuanza lazima viwepo pia.

Panga tarehe ya kuanza kwa kuonyesha utegemezi wa kila kazi. Eleza kinachoruhusu hatua ianze, kazi zinazoweza kufanyika sambamba na uthibitisho unaohitajika kabla ya malipo au makabidhiano yanayofuata.

#### Elewa muda uliopo kwenye mapendekezo

| Pendekezo lenye tarehe | Muda uliopangwa hadi uzalishaji |
| --- | --- |
| Washing screen na sluices sita, 5 Oktoba 2026 | Wiki 16 |
| Starter Modular Plant ya scrubber, 3 Oktoba 2026 | Wiki 24 |
| Full Scale Plant ya scrubber, 3 Oktoba 2026 | Wiki 26.5 |

Hii ni mifano ya ratiba za wigo tofauti, si ahadi ya muda wa kila mtambo unaoagizwa leo. Mashine, nafasi ya utengenezaji, usafirishaji au hali ya eneo ikibadilika, ratiba inaweza kubadilika. Thibitisha tukio linaloanzisha muda wa mkataba na masharti ya hatua zake; wiki zilizotajwa bila mwanzo ulioelezwa haziwezi kutoa tarehe ya uzalishaji.

#### Thibitisha usanifu kabla ya kujifunga kwenye ugavi

Kabla ya kununua au kutengeneza kwa wigo wa mwisho, kubaliana malighafi, vifaa, maji, umeme na mipaka ya ugavi. Mabadiliko yanayofuata baada ya kuagiza yanaweza kuongeza gharama na muda. Weka wazi maswali yaliyobaki kuhusu utenganishaji wa ukubwa, pampu, kuanzisha mota na majukumu ya mmiliki.

Ratiba ya ugavi ionyeshe kukubali michoro, utengenezaji, ukaguzi, utayari wa kusafirisha na nyaraka za kupeleka mzigo. Ukaguzi uwe na vipimo na masharti yaliyokubaliwa kabla ya vifaa kufungwa kwa safari.

#### Andaa eneo sambamba na ugavi

Usanifu uliothibitishwa ukiruhusu, njia ya kufikia eneo, msingi, maji na miundombinu ya umeme vinaweza kuandaliwa wakati vifaa vinatolewa. Hii inapunguza uwezekano wa mashine kuwasili na kusubiri kazi ambayo ingeweza kukamilika mapema.

Eleza taarifa zinazohitajika kwa kila kazi. Msingi unahitaji uzito na vipimo vilivyothibitishwa, kushusha kunahitaji mpango wa kunyanyua na kazi za maji zinahitaji mizania na mpangilio uliopitiwa. Kuanza kwa vipimo vya kubuni kunaweza kuleta marudio ya kazi.

#### Tenganisha safari na ufungaji

Wigo wa kufikisha ueleze njia, ufungaji wa mzigo, majukumu ya kutoa bandarini, kufika eneo na kushusha. Thibitisha mahitaji ya usafiri wa vifaa vikubwa kwa vipimo na uzito halisi. Muda wa barabarani haujumuishi moja kwa moja upatikanaji wa vifaa, kupakia, taratibu za bandari na kunyanyua eneo la mwisho. [Ukurasa wa usafirishaji, kwa Kiingereza](/delivery-shipping), unaeleza taarifa za kuandaa.

Baada ya kufikisha, ufungaji unaunganisha mashine, mabomba, udhibiti na umeme. Kabla ya majaribio yenye maji na malighafi, hakiki utayari wa maji, malighafi inayofaa, vyombo vya kupimia na waendeshaji wanaoelewa utaratibu.

#### Kubaliana matokeo ya majaribio ya kuanza

Commissioning ni majaribio na uthibitisho wa utayari wa mfumo kabla ya makabidhiano ya uzalishaji. Kubaliana malighafi ya majaribio, vipimo, sampuli, hali za uendeshaji na kumbukumbu za kukubali kazi. Kukamilika kwa ufungaji wa mitambo kutofautishwe na uthibitisho wa kazi ya uchakataji iliyokubaliwa. Andika kasoro na kazi zilizobaki badala ya kutegemea kauli kwamba mtambo umeanza.

**Mchoro wa ratiba:** Onyesha ugavi na maandalizi ya eneo katika njia sambamba zinazokutana kwenye ufungaji na commissioning. Tumia hatua na tarehe zilizothibitishwa; usigawanye jumla ya wiki kwa makisio yasiyo na msingi.

#### Swali linalobaki

**Naweza kuahidi tarehe ya uzalishaji mara ninapoagiza?** Unaweza kupanga lengo, lakini liunganishe na hatua zilizothibitishwa za ugavi na eneo. Tambua masharti yanayoweza kulisogeza na sasisha ratiba yanapobadilika.

#### Panga sharti la hatua inayofuata

Muda wa kuanza unategemea uratibu wa vifaa na utayari wa eneo. Anza na wigo uliokubaliwa, kisha mpe kila sharti mwenye jukumu na kumbukumbu ya kukamilika. Tambua kinachopaswa kuwa tayari kwa hatua inayofuata, badala ya kutegemea idadi moja ya miezi.

**Msingi na mawasiliano:** Muda unatokana na mapendekezo ya tarehe 3 na 5 Oktoba 2026, si wastani wa nchi au dhamana ya kufikisha. Tutumie utayari wa eneo, wigo, taarifa za kufikia na tarehe unayolenga ili kujadili ratiba yenye utegemezi ulioelezwa.

### SW 2.2 — Mtambo wa kuosha dhahabu unahitaji maji kiasi gani?

Mtambo unahitaji maji yanayopita kwenye uchakataji, lakini kiwango hicho ni tofauti na maji mapya yanayochukuliwa kutoka kwenye chanzo. Maji yakirudishwa baada ya kushughulikia mabaki, maji mapya hufidia yanayopotea na yanayotolewa au kubadilishwa kwa mahitaji ya mfumo. Pia kuna maji ya kujaza mfumo kabla ya mzunguko wa kawaida kuanza.

Tofauti hii ni muhimu unapochunguza kisima, mto au hifadhi. Kiwango kilichoandikwa kwenye pampu pekee hakiwezi kukuambia mahitaji ya maji mapya wala ukubwa unaofaa wa mabwawa.

#### Eleza mpaka wa hesabu

Weka mtambo, vifaa vya kurudisha maji, mabwawa na mfumo wa kurudi ndani ya mpaka mmoja kwenye mchoro. Rekodi kinachoingia na kinachotoka kwa kipindi kilichoelezwa. Maji yanayorudi ndani ya mfumo ni maji yanayotumika tena; usiyahesabu kama maji mapya kila yanapozunguka.

Hifadhi ikiwa haibadiliki, kiasi kinachoingia kutoka nje kinalingana na kinachotoka. Maji mapya pamoja na unyevu unaoingia na malighafi vifidie maji yanayoondoka na mabaki, uvukizaji, kuvuja, maji yanayotolewa na upotevu mwingine uliotambuliwa. Hifadhi ikiongezeka, ongezeko hilo pia linahitaji maji. Kujaza mwanzo kuhesabiwe kando na mahitaji ya kawaida.

#### Fuata maji yanayorudi na yabaki kwenye mabaki

Mikondo tofauti ya mabaki inaweza kubeba unyevu tofauti. Mfinyanzi mwembamba unaweza pia kuathiri kutulia kwa chembe na ubora wa maji yanayorudi. Chunguza mikondo hiyo badala ya kudhania kuwa maji yote yanayoingia kwenye bwawa yanapatikana mara moja kwa matumizi tena.

Mpango ujumuishe kuondoa mashapo yaliyotulia na kazi wakati vifaa au mabwawa vinatengenezwa. [Maelezo ya McLanahan kuhusu maji na mabaki, kwa Kiingereza](https://www.mclanahan.com/solutions/tailing-water-management), yanaonyesha uhusiano huo; hayatoi vipimo vya bwawa la eneo lako.

#### Fuata mfano wenye makisio yaliyo wazi

Tuchukulie mtambo wa mfano unahitaji **100 m³/h** kwenye sehemu ya kuingiza maji, na hapo unapokea **80 m³/h** ya maji yanayorudi yenye ubora unaofaa. Bila maji mengine yanayoingia hapo, tofauti ni `100 − 80 = 20 m³/h`. Kwa saa 10 za kazi, ni 200 m³ ya maji ya kufidia.

Hii ni hesabu ya kufundishia, si mahitaji yaliyopimwa ya pendekezo la 75 au 150 m³/h. Haijumuishi kujaza mwanzo na inadhania maji yanayorudi yanapatikana wakati yanapohitajika. Mizania kamili ieleze tofauti ya 20 m³/h kupitia maji yanayotoka au mabadiliko ya hifadhi, pamoja na unyevu unaoingia na malighafi. Badilisha viwango hivi kwa vipimo au usanifu uliopitiwa.

| Taarifa ya kuhesabu | Kinachohitajika |
| --- | --- |
| Maji ya uchakataji | Kiwango na ubora katika kila sehemu ya matumizi |
| Maji yanayorudi | Kiasi kinachopatikana, ubora na muda |
| Yanayoingia kutoka nje | Chanzo kipya na unyevu wa malighafi |
| Yanayotoka | Unyevu wa mabaki, maji yanayotolewa na upotevu mwingine |
| Hifadhi | Kujaza mwanzo, mabadiliko ya kiwango na akiba |
| Kipindi cha kazi | Saa, kusimama na hali za msimu |

#### Chagua mabwawa na pampu kwa kazi zake

Usanifu wa bwawa unahitaji kiasi cha chembe, namna zinavyotulia, hifadhi, nafasi ya matengenezo na hali ya eneo. Pampu inahitaji kiwango cha mtiririko, urefu na upinzani wa njia, sifa za maji au tope na mpangilio wa kufanya kazi. Vyote visichaguliwe kwa kiwango cha changarawe cha mtambo pekee.

Thibitisha upatikanaji wa chanzo katika msimu wa kazi, vibali vinavyohusika na masharti ya kutoa maji. Mwongozo huu hauchukulii kiwango cha sasa cha kuchukua maji au muda wa kupata kibali kuwa tayari vimethibitishwa.

**Mchoro:** Onyesha maji ya kazi, kutenganisha maji na mabaki, kurudi, maji mapya, upotevu na hifadhi katika njia tofauti.

#### Swali linalobaki

**Kurudisha maji kunamaanisha sitahitaji chanzo kipya?** Mizania iliyopitiwa ndiyo inayoweza kueleza mahitaji ya nje. Mzunguko unaweza kupunguza mahitaji, lakini kujaza mwanzo, upotevu na udhibiti wa ubora bado vinahitaji mpango.

#### Amua kwa mizania ya maji

Anza kwa kueleza mikondo, kisha thibitisha kiasi cha maji yenye ubora unaofaa kinachorudi na muda wake. Tumia mizania kutathmini chanzo kipya, hifadhi na matibabu, huku kila pampu ikichaguliwa kwa kazi yake. Kusanya taarifa za mtiririko, chembe na msimu kabla ya kununua.

**Msingi na mawasiliano:** Mfano una makisio ya kufundishia. Viwango vya maji vya mapendekezo bado vinahitaji uthibitisho. Tutumie chanzo, saa za kazi, malighafi na matokeo ya majaribio ili kujadili mfumo wa maji.

### SW 2.3 — Mahali pa kununua vifaa vya mtambo wa kuosha dhahabu Tanzania

Unaweza kuchunguza vifaa vinavyopatikana Tanzania na vinavyoletwa kutoka nje, lakini uamuzi mzuri unaanza na kazi na wigo unaolingana. Bei ina maana unapojua kinachotolewa, sehemu majukumu yanapohama na kazi zinazobaki kwenye eneo.

Bart Mining inaweza kujadili pendekezo la vifaa na utekelezaji lenye vipengele. Asili ya kila kifaa, upatikanaji wake halisi na masharti ya kufikisha yathibitishwe kwenye ofa. Mwongozo huu haudai kuwa kila mashine iliyotajwa ipo tayari kwenye ghala nchini.

#### Eleza kazi kabla ya kuomba bei

Wape wauzaji maelezo yale yale ya malighafi, matokeo ya sampuli na majaribio, msingi wa uwezo na saa za kazi. Jumuisha maji, umeme, eneo la kufikisha na maandalizi yaliyokamilika. Bila hilo, ofa moja inaweza kuwa ya mashine pekee na nyingine ikajumuisha kazi pana ya ufungaji.

Muuzaji aonyeshe vifaa vinavyounganishwa na sababu ya kuchagua njia ya kuosha na kutenganisha kwa malighafi hiyo. Jina la mashine au picha nzuri haitoshi kuthibitisha ufaafu.

#### Linganisha mipaka ya ugavi

| Kipengele | Swali la kujibu kwa maandishi |
| --- | --- |
| Vifaa | Modeli, idadi, vifaa vidogo na vipuri gani vinatolewa? |
| Kazi ya kiufundi | Malighafi na masharti gani yanaunga mkono uwezo na urejeshaji? |
| Kufikisha | Sharti na sehemu gani vimetajwa, na nani anafanya kila hatua? |
| Ufungaji | Nani anatoa msingi, kunyanyua, mabomba, nyaya na udhibiti? |
| Commissioning | Majaribio, mafunzo, sampuli na nyaraka gani zinajumuishwa? |
| Biashara | Sarafu, tarehe, uhalali, vilivyotengwa na hatua za malipo ni zipi? |
| Huduma | Dhamana, matengenezo na vipuri vinashughulikiwaje? |

Jaza jedwali kwa kila ofa. Tatua sehemu iliyo wazi kabla ya kuichukulia jumla kuwa bei kamili ya kuanza uzalishaji.

#### Elewa sharti la kufikisha

Bei ya kufikisha bandarini ni tofauti na bei ya kufunga mtambo eneo lako. Kwa CIF, muuzaji hupanga usafiri na bima hadi bandari iliyotajwa, huku hatari ikihama mzigo unapowekwa kwenye meli kwenye bandari ya kuanzia. Kutoa mzigo forodhani, usafiri wa ndani na ufungaji havijumuishwi moja kwa moja. [ICC Academy, kwa Kiingereza](https://academy.iccwbo.org/incoterms/article/place-of-delivery-risk-transfer-global-trade-contracts/), inaeleza tofauti kati ya gharama na hatari.

Omba vipimo na uzito wa mizigo kabla ya kupanga safari ya ndani. Thibitisha kupakia, kushusha, bima na mahitaji maalumu ya njia. Kodi na tozo zihakiwe kwa bidhaa na mwagizaji husika; matumizi ya kifaa kwenye uchimbaji hayathibitishi msamaha wa jumla.

#### Tumia mfano wa pendekezo kuelewa wigo

Mfano ulioidhinishwa wa tarehe 5 Oktoba 2026 wa washing screen na sluices sita una vifaa vya USD 66,300 na jumla ya vifaa pamoja na makadirio ya utekelezaji ya USD 141,843. Wigo wake unatofautiana na wa scrubber. Hesabu hizi zinaonyesha vipengele vya kuulizia; si orodha ya bei za nchi nzima au uthibitisho wa upatikanaji wa sasa. [Mwongozo wa gharama](/insights-swahili/gharama-ya-plant-ya-dhahabu) unafafanua mipaka ya bajeti.

#### Swali linalobaki

**Vifaa vya nchini huwa nafuu au vinafika haraka zaidi kila wakati?** Linganisha mashine halisi, tarehe inayopatikana na wigo wa kufikisha. Kifaa kinachotengenezwa au kuunganishwa nchini kinaweza kutumia vipengele vya kuagizwa; ofa ya kuagiza inaweza kutenga huduma zilizopo kwenye nyingine. Thibitisha asili na muda wa kila kifaa kabla ya kuhitimisha.

#### Omba ofa zinazoweza kulinganishwa

Wauzaji wote watumie malighafi iliyojaribiwa, kazi ya mfumo na eneo lilelile la kufikisha. Hakiki vilivyojumuishwa na anayekamilisha viunganishi, kisha linganisha bajeti na ratiba yake. Andaa taarifa hizo kabla ya kuomba bei ili pendekezo lieleze mradi wako.

**Msingi na mawasiliano:** Mfano wa biashara ni pendekezo lenye tarehe, si utafiti wa bei za sasa. Tutumie eneo, malighafi, majaribio, uwezo na mipaka ya ugavi unayotaka. Asili ya vifaa vya nchini au vya kuagizwa ithibitishwe kwenye ofa.

### SW 0.6 — Nahitaji jenereta ya ukubwa gani kwa mgodi au eneo la kazi?

Ukubwa wa jenereta unategemea umeme unaotumika wakati vifaa vinafanya kazi na mahitaji yanapotakiwa kuanza au kubadilisha mzigo. Kujumlisha vipimo vya mota kunatoa sehemu ya taarifa, lakini hakuthibitishi kuwa jenereta fulani itawasha na kuendesha mtambo katika hatua zake zote.

Anza na orodha ya mizigo ya umeme na mpangilio wa kufanya kazi. Kisha modeli inayopendekezwa ihakikiwe kwa viwango vyake, uwezo wa kuanzisha vifaa na hali ya eneo. Hivyo unaweza kuomba ushauri wenye taarifa hata kabla ya kujua kVA ya mwisho.

#### Tofautisha nguvu ya mota na umeme unaoingia

Andika umeme halisi unaoingia kwa kila kifaa, power factor na taarifa za kuanza, inapowezekana. Power factor inaeleza uhusiano wa kW na kVA kwa mzigo husika. Kipimo cha nguvu ya mitambo kwenye mota si umeme wote unaoingia; ufanisi na hali ya kazi vinaathiri tofauti. Taja vipimo ambavyo bado havijathibitishwa.

kW inaeleza nguvu tendaji na kVA ukubwa wa nguvu dhahiri. Kwa mzigo uliodhaniwa wa 120 kW na power factor 0.8, hesabu ni `120 ÷ 0.8 = 150 kVA`. Power factor hiyo ni makisio ya mfano; vifaa vinaweza kuwa na thamani tofauti, hivyo thibitisha mahitaji ya mfumo mzima.

#### Andika mpangilio wa uendeshaji

| Mzigo wa mfano unaofanya kazi kwa pamoja | Umeme unaoingia uliodhaniwa |
| --- | --- |
| Kuendesha mashine ya kuosha | 40 kW |
| Kulisha na kusafirisha tope | 35 kW |
| Pampu za maji | 30 kW |
| Taa na vifaa vya ziada | 15 kW |
| Jumla wakati wa kazi | 120 kW |

Hii ni orodha ya kufundishia, si vipimo vya mtambo wa Bart Mining. Eleza vifaa vinavyoendesha pamoja na vinavyokuwa tayari vinafanya kazi wakati mota kubwa inaanza. Pata taarifa za kuanzisha na mabadiliko yanayokubalika ya voltage na frequency kwa mfumo huo. Jibu la 150 kVA ni rejea ya mzigo wa kazi, si pendekezo la ukubwa wa jenereta.

#### Hakiki modeli na aina ya matumizi

Jenereta ihudumie mahitaji ya injini na alternator katika hali ya eneo. Hakiki voltage, frequency, phases, udhibiti wa kuanzisha, mazingira na kupungua kwa uwezo kunakohusika kwenye eneo. Prime na standby ni viwango vya matumizi tofauti; fuata masharti ya modeli kwa saa na mizigo iliyopangwa badala ya kuchagua namba kubwa kwenye tangazo. [Mwongozo wa Cummins, kwa Kiingereza](https://www.cummins.com/sites/default/files/2024-08/t030-Liquid-cooled-gen-set-application-manual.pdf), ni rejea ya mtengenezaji kuhusu tathmini hiyo.

Soft starter au variable-speed drive hubadilisha namna mzigo unavyoingia, lakini ufaafu wake uhakikiwe pamoja na mota na mfumo wa jenereta. Hakuna asilimia moja ya kupunguza jenereta kwa kila mradi. Jenereta zinazofanya kazi sambamba pia zinahitaji mfumo unaofaa wa kusawazisha, ulinzi na kugawana mzigo; jumla ya nameplate pekee haitoshi.

#### Panga mafuta kwa hali ya kazi

Omba taarifa za matumizi ya mafuta za modeli inayotolewa kwa mzigo unaotarajiwa na hali ya eneo. Tumia saa za kazi kupanga kufikisha mafuta, hifadhi na muda wa huduma. KVA ya juu ya jenereta si wastani wa umeme unaotumika kwenye mtambo.

[Kikokotoo cha jenereta kwenye ukurasa wa kukodi](/insights-swahili/jenereta-za-kukodi) kinasaidia kuandaa ombi la awali. Huduma ya Bart Mining iliyothibitishwa inahusu 300–2,500 kVA, huku modeli na upatikanaji vikithibitishwa kwa tarehe zako. Kiwango hicho cha huduma hakiwezi kutumika kuchagua jenereta ya mfano huu moja kwa moja.

#### Swali linalobaki

**Ninunue jenereta kubwa sana ili kuepuka matatizo ya kuanza?** Pata tathmini ya kuanzisha kwanza. Namba kubwa haitatui kila tatizo la mfumo, na modeli bado inahitaji kuhakikiwa kwa mzigo wake wa kawaida. Linganisha mifumo inayofaa na mtaalamu badala ya kuongeza asilimia ya akiba bila msingi.

#### Tuma orodha ya mizigo badala ya kubahatisha kVA

Toa umeme wa kila kifaa, namna na mpangilio wa kuwasha, saa za kazi, hali ya eneo na mpango wa upanuzi. Hesabu ziweke taarifa wazi, kisha mtaalamu wa umeme athibitishe jenereta na ufungaji kwa kazi hiyo. Huo ni msingi bora wa kuomba bei na kupanga uendeshaji.

**Msingi na mawasiliano:** Hesabu zinatumia umeme unaoingia wa kubuni. Taarifa za huduma ya kukodi zilithibitishwa tarehe 3 Oktoba 2026; modeli na upatikanaji zinategemea ombi. Tutumie orodha ya mizigo, eneo na tarehe unazohitaji.

## Carousel draft: how a gold wash plant works in seven steps

Use a cover, seven explanatory slides and a closing slide. The sequence is a proposed scrubber-based concept; confirm the diagram before production. English and Kiswahili versions use the same visual identities. No slide should include an unverified recovery percentage or portray an illustration as a real customer installation.

| Slide | English copy | Kiswahili copy | Visual direction |
| --- | --- | --- | --- |
| Cover | **How a gold wash plant works** — Follow the gravel from feeding to recovery, then see how water returns through the system. | **Mtambo wa kuosha dhahabu unafanyaje kazi?** Fuata changarawe kutoka kupakiwa hadi kutenganishwa, kisha uone maji yanavyorudi. | Reviewed concept overview; label as an illustration. |
| 1 | **Receive the gravel.** A hopper provides the feed point, while the oversize route must be selected from the material and test results. | **Pokea malighafi.** Hopper ni sehemu ya kupakia, huku njia ya mawe makubwa ikichaguliwa kwa malighafi na majaribio. | Hopper/grizzly and oversize outlet. |
| 2 | **Control the feed.** The feeder supplies the washing section at a rate the connected equipment can handle. | **Dhibiti kiwango.** Feeder hupeleka malighafi kwenye kuosha kwa kiwango kinachoweza kuhudumiwa na vifaa vinavyofuata. | Feeder connection and directional arrow. |
| 3 | **Wash and classify.** The selected washing system prepares the material, and screens direct the size fractions to their next duties. | **Osha na tenga ukubwa.** Mfumo uliochaguliwa hutayarisha malighafi, kisha skrini huelekeza kila daraja kwenye hatua yake. | Washing section and labelled classification. |
| 4 | **Treat suitable fine feed.** Classified slurry goes to centrifugal recovery only when its size and duty match the offered model. | **Chakata malighafi ndogo inayofaa.** Tope huenda kwenye centrifugal recovery ikiwa ukubwa na kiwango vinaendana na modeli. | Fine-stream route, without unconfirmed openings. |
| 5 | **Treat the assigned sluice stream.** Distribution, water and operating conditions must support the duty given to each sluice. | **Chakata mkondo wa sluice.** Mgawanyo, maji na hali za kazi viendane na kazi ya kila sluice. | Sluice stream and distribution. |
| 6 | **Clean up the concentrate.** Further treatment and product checks establish the route from captured material to the final product. | **Safisha mkusanyiko.** Hatua za ziada na vipimo huonyesha njia kutoka malighafi iliyonaswa hadi bidhaa ya mwisho. | Table/product handling; no invented gold yield. |
| 7 | **Manage tailings and return water.** Defined outlets lead to the water system, with fresh supply replacing the required losses. | **Panga mabaki na rudisha maji.** Mikondo iliyoelezwa huingia kwenye mfumo wa maji, huku maji mapya yakifidia mahitaji yaliyobaki. | Every tailings outlet, return and makeup. |
| Close | **Start with your material.** Send the site, representative test results, intended feed rate, water and power information to discuss a suitable plant. | **Anza na malighafi yako.** Tutumie eneo, majaribio yanayowakilisha malighafi, uwezo, maji na umeme ili kujadili mtambo unaofaa. | Compact project-input checklist and contact action. |

## Draft review and implementation notes

The complete first drafts above cover all seven wash-plant subjects plus the generator-sizing guide in both languages, along with carousel copy. They answer the briefs using the approved public examples and transparent arithmetic. They do not resolve the technical checks by assuming missing information is true.

Links between planned articles are proposed destinations and become active only when those articles are registered. Replace or defer such links if the publication sequence leaves a destination unavailable. Visual directions are editorial notes, not public paragraphs; replace them with reviewed diagrams/images, captions and alt text during implementation. Convert the genuine FAQ questions to the shared data source when pages are built, preserving visible/structured agreement.

Before publication, review the centrifugal/classification interface and complete outlet routing for the main diagram, the equipment quantities/model duties, the expansion interfaces and any new schedule or water claims. Obtain fluent Kiswahili editorial review. Production implementation must register the pages, language pairs, discovery and sitemap, then run the applicable audits and rendered-page checks.

The draft set intentionally avoids the snapshot's unconfirmed recovery percentage, water requirements, monthly-volume labels and fixed generator selection. Dated proposal prices and durations are presented with their scopes, not as current quotes. Water, throughput, grade and electrical examples are labelled assumptions. No private supplier data has been added.

Document checks on 6 October 2026 confirmed all 16 article bodies, matching USD values across each pair, and the arithmetic for proposal totals, production/grade examples, water makeup and the electrical example. `git diff --check` passed. These checks do not replace technical or fluent-language review. No application build was needed for this Markdown-only change.

## Tracking

The site has **no analytics**, and the privacy page says so publicly. Adding GA4 or Vercel Analytics means updating `/privacy` first. Until then, track with the tools below.

### Search Console (weekly, every Monday)
For each new page, record impressions, clicks and average position, and the top queries it appears for.

| Page | Live date | Wk 1 | Wk 2 | Wk 4 | Wk 8 | Top queries |
|---|---|---|---|---|---|---|
| `/generator-rental` | 2026-10-03 | | | | | |
| `/generator-rental/mwanza` | 2026-10-03 | | | | | |
| `/generator-rental/dar-es-salaam` | 2026-10-03 | | | | | |
| `/generator-rental/geita` | 2026-10-03 | | | | | |
| `/jenereta-za-kukodi` | 2026-10-03 | | | | | |
| `/generator-rental/arusha`, `/dodoma`, `/mbeya`, `/morogoro`, `/tanga`, `/kahama`, `/mtwara` | 2026-10-03 | | | | | |
| `/alluvial` | | | | | | |
| `/insights/gold-trommel-sluice-box` | | | | | | |
| `/insights/small-vs-full-gold-wash-plant` | | | | | | |
| `/insights/gold-wash-plant-equipment-list` | | | | | | |

After each page goes live: request indexing in Search Console (URL Inspection), and confirm it's in the sitemap.

### Enquiries (the number that matters)
Without analytics, tell enquiries apart by the **pre-filled WhatsApp message** each page uses. Each page opens WhatsApp with its own first line, so the source is visible in the chat:

| Page | Pre-filled message starts with |
|---|---|
| `/generator-rental` and town pages | "Hello Bart Mining, I'm enquiring about generator rental (<town>)…" |
| `/jenereta-za-kukodi` | "Habari Bart Mining, naomba bei ya kukodi jenereta…" |
| `/alluvial` and wash plant articles | "Hello Bart Mining, I'm interested in a gold wash plant…" |
| `/insights/gold-trommel-sluice-box` | "Hello Bart Mining, I'm interested in a gold trommel with sluice boxes…" |

Also ask every caller "How did you find us?" and log it:

| Date | Channel (call / WhatsApp / email) | What they wanted | Size or capacity | Town | How they found us | Outcome |
|---|---|---|---|---|---|---|
| 2026-10-0? | Call | Generator rental | 200–2,500 kVA | | | Triggered Phase 0 |

### IndexNow (Bing, Copilot, ChatGPT search)
Key file: `public/eca3ee9f25478f46b75983cf8d5327f5.txt` (public by design). After any deploy that adds or changes pages, run `npm run indexnow` (whole sitemap) or `npm run indexnow -- generator-rental` (matching URLs). Google ignores IndexNow; use Search Console for Google. Add the site in Bing Webmaster Tools too (Allan).

### Google Business Profile
Check monthly: searches, calls and direction requests, especially for "generator rental" queries after 0.8.

---

## Done so far

| Date | What | Commit |
|---|---|---|
| 2026-10-03 | Plant planner tool (`projects/plant-planner`): costs, expenses, schedule, cashflow, plant diagram, proposal PDF, sourcing ticks that drive shipping, project management fee, Map tab, auto-refresh and stale-tab save protection | `36abbd8` |
| 2026-10-03 | Plant page with animated diagram and phone layout, unlisted | `36abbd8` |
| 2026-10-03 | Plant page moved to `/alluvial`, deployed to bartmining.com | `aa6e654` |

---

## Change log

| Date | Change |
|---|---|
| 2026-10-03 | Plan created: generator rental (Phase 0), wash plant content (Phases 1–3), trommel offer (Track B), planner backlog (Track C), tracking. |
| 2026-10-03 | Generator rental is nationwide (partners ship anywhere, operator always on site): seven more town pages (no Zanzibar), "Mwanza base" wording removed, operator wording strengthened, home-page style hero with image slots, image brief for Codex. |
| 2026-10-03 | Phase 0 live (commits `c8ce24e`, `17b1371`, `bc3aa2a`): FAQs 10 / 7 / 7 / 7 / 10, fuel and minimum hire terms. Earlier entry: Phase 0 built: `/generator-rental`, three town pages, `/jenereta-za-kukodi`, sizing calculator, site links, sitemap. Checked on desktop and phone. Waiting for Allan's go-ahead to push. Also fixed the doubled "Bart Mining" in the `/alluvial` title. |
| 2026-10-06 | Consolidated all seven wash-plant briefs, generator-sizing brief, Kiswahili/social deliverables, approved public capital examples, source inventory, technical checks and completion criteria in this file. Updated current Kiswahili routes and editorial rules; removed private commercial figures from the working plan. Article drafting and publication remain pending. |
| 2026-10-06 | Added complete first drafts of the seven wash-plant articles and generator-sizing article in English and Kiswahili, plus paired carousel copy. Drafts remain in this file for review; production-page implementation, technical/language review and publication remain pending. |
