# Search Demand Audit and Content Plan (October 2026)

**Status:** Plan only. Nothing in this document has been built.
**Prepared:** 7 October 2026
**Input:** Three reports produced with Google Gemini, which said it had access to trending search data. The reports cover regional search trends, gaps in the equipment range, website improvements, a 2023–2029 trend forecast and a 2027 content plan.
**Owners:** Allan (business decisions, commercial copy), Bartholomew (technical sign-off), Dev (site changes)
**Related:** [SEO growth checklist](seo-growth-checklist.md) · [Content and implementation plan](content-and-implementation-plan.md) · [Editorial standard](editorial-standard.md) · [Social carousel plan](BARTMINING-SOCIAL.md)

**Status marks:** `[ ]` not started · `[~]` in progress · `[x]` done and checked on the live site

---

## 1. Summary

The Gemini reports point to four demand areas: critical minerals processing, mercury-free gold recovery, modular plants and underground mining (dewatering, hoisting and safety). They also recommend equipment filters, sizing calculators, spec-sheet downloads, more Kiswahili search terms and 15 new articles.

Our review found three things:

1. **Much of the recommended work already exists.** The site already has guides on elution versus toll treatment, plant costs, vat leaching of tailings, equipment rental, financing, mine power and underground air supply. It also has nine Kiswahili insight pages and equipment pages for the filter press, headframe, ventilation fan and dewatering pump. Most of this audit's value lies in strengthening those pages, linking them together and filling specific gaps.
2. **The demand figures are not verified.** The reports give no search volumes. A second Gemini pass and our own checks (7 Oct) confirmed most of the factual claims, but corrected two and left the licence count unconfirmed (see §3). We therefore treat the reports as a list of hypotheses to test against Search Console, Google Trends and Keyword Planner. They are not evidence of demand.
3. **Some recommendations conflict with our own rules.** Case studies with site photos break the photo policy. Publishing client recovery data breaks the confidentiality rule in `AGENTS.md`. Promoting "eco-friendly" non-cyanide reagent powders carries technical and reputational risk. Brand-against-brand comparisons (Knelson vs Falcon) weaken our vendor-neutral position. These items are listed in §4 with a recommended alternative.

**Recommended order:** validate demand first (one week). Then strengthen existing pages, then write the gold, PML and underground articles we can support today. Critical-minerals content waits until Allan decides whether Bart Mining will actually supply flotation and magnetic-separation equipment.

---

## 2. What the audit says

### 2.1 Demand areas

| Area | Gemini's reasoning | Example queries Gemini gave |
|---|---|---|
| Critical minerals processing | Governments are pushing value addition for graphite, lithium, nickel and copper | "froth flotation machines for graphite / copper", "magnetic separators for rare earth elements", "lithium processing plant equipment price" |
| Mercury-free gold recovery | Minamata Convention enforcement and PML formalisation | "mercury-free gold recovery machinery", "knelson vs falcon concentrator", "small scale CIL plant modular price" |
| Modular and portable plants | PML holders want fewer civil works and easy relocation | "portable gold wash plant 10 to 50 tph", "containerized elution and electrowinning system" |
| Underground dewatering and safety | Shallow deposits are running out in Geita, Kahama, Chunya and Mubende | "high head submersible slurry pump for deep shaft", "5 ton electric mine hoist and headframe", "ATEX cap lamp and multi gas detector" |

### 2.2 Patterns Gemini describes (hypotheses)

- **Regulation leads equipment demand by 3–9 months.** Compliance questions come first, then purchase queries.
- **PML maturity ladder.** Miners move through four stages: entry (hammer mill, wet pan mill, jackleg drill, generator), first upgrade (sluice, concentrator, shaking table), scaling up (vat leaching, small CIL, jaw crusher), then underground (winch, deep pumps, gas monitors, cap lamps).
- **Commodity price effect.** A higher gold price raises exploration searches first, followed about six months later by searches for processing plants.

These patterns are reasonable and useful for planning, but no data was supplied to support them. The PML ladder fits our equipment range well and is worth using to organise content, whether or not the timing claims hold up.

### 2.3 Forecast (Gemini's predictions for 2027–2029)

| Period | Predicted trigger | Predicted search themes |
|---|---|---|
| Late 2026–2027 | Local processing requirements; Kabanga refinery; copper plants | Flotation circuits, magnetic separators, electrowinning and smelting |
| 2027–2028 | Diesel costs; grid expansion into goldfields | Transformer sizing, solar-diesel hybrids, electric versus pneumatic drills |
| 2028–2029 | Dry-stack tailings and zero-discharge rules | Filter press sizing, cyanide destruction, water recycling |

### 2.4 Recommendations Gemini made

- **Equipment:** add critical-minerals equipment (flotation cells, magnetic separators, spiral classifiers), leaching reagents and visible financing options.
- **Equipment directory:** filters by commodity, mining stage and scale; gated spec-sheet and drawing downloads; sizing calculators; Kiswahili terms in titles and metadata.
- **Insights:** 15 new articles across five themes (critical minerals, power, tailings and water, underground mining, Kiswahili commercial guides), plus case studies with photos and recovery data.
- **Workflow:** link every article to equipment pages, offer spec downloads, mention districts in examples.

---

## 3. Fact check

Any claim that reaches public copy must be confirmed from a primary source first.

| Claim in the reports | Status | Our finding | Action |
|---|---|---|---|
| Gold averaging USD 4,000+/oz in 2026 | Confirmed | About USD 4,135 on 7 Oct 2026, after a record of about USD 5,608 in January ([Trading Economics](https://tradingeconomics.com/commodity/gold)). | Use dated figures only, with a source |
| 2025 rally "USD 2,600 → 3,500/oz" | Confirmed | Gold started 2025 at about USD 2,609–2,623 and first reached USD 3,500 intraday on 22 April 2025 ([BullionVault, citing Reuters](https://www.bullionvault.com/about-us/in-the-press/2025/gl-rtrs-3500-apr)). | Usable with the date |
| BoT 20% gold allocation from 2024 | Confirmed, but described loosely | The BoT programme notice is dated 1 Oct 2024. Gemini describes it as "PML holders allocating 20% of their gold". Our [selling-gold guide](../src/content/insights/selling-gold-tanzania.ts), citing BoT, describes 20% **of gold exports**, applying to mineral-right holders and licensed dealers under section 59 of the Mining Act. Separately, the 2025/26 budget requires companies with government contracts to refine and trade at least 20% of production locally. | Use our guide's wording, not Gemini's |
| "Dodoma Critical Minerals Hub" | Partly confirmed | No official "hub" by that name. What exists: a TZS 14.3 billion Geological Survey mineral testing laboratory at Kizota, Dodoma. The foundation stone was laid on 25 Aug 2025; it is **under construction, due September 2027**, and is expected to be the largest in East and Central Africa ([TanzaniaInvest](https://tanzaniainvest.com/mining/dodoma-mineral-testing-laboratory-completion-2027)). | Refer to "the Dodoma mineral testing laboratory (due 2027)", never "hub" |
| "450+ critical mineral licences" (Gemini now says 454 in 2025) | Not confirmed | Gemini cites TICGL and a Commission annual report. Our search found neither the figure nor the report. Confirmed figures: 8,501 licences of all types in 2024/25 and 54,626 between 2018/19 and Sep 2024 (TanzaniaInvest; The Citizen). | Do not use until the Commission's own figure is found |
| Copper processing in Chunya | Confirmed | Mineral Access Systems Tanzania (MAST) opened Tanzania's first modern copper processing plant at Chunya, Mbeya, inaugurated by the Prime Minister. It processes 31,200 t of 0.5–2% Cu ore a month (4,000 t bought from small-scale miners) and uses leaching and cementation to make concentrate of up to 75% Cu. MAST plans plants in Manyara, Ruvuma and Dodoma ([The EastAfrican](https://www.theeastafrican.co.ke/tea/business-tech/tanzania-launches-modern-copper-processing-plant-5088446); [Argus](https://www.argusmedia.com/en/news-and-insights/latest-market-news/2701443-tanzania-launches-first-copper-processing-plant)). | Usable; confirm the opening date before quoting it |
| Graphite in Lindi and Tanga | Confirmed, but Gemini's figure is wrong | Lindi Jumbo (Lindi) and God Mwanga Gems (Kwedikabu and Kwamsisi, Handeni, Tanga) are operating. Gemini says "25,000 tonnes **per month**" for Tanga. The source says Tanzania's **total** output is about 25,000 t **a year** from those two mines; GMG's two plants have a combined nameplate capacity of 360,000 t/yr ([Project Blue](https://projectblue.com/blue/news-analysis/1315/new-graphite-supply-increases-tanzania’s-market-share)). Mahenge (Ulanga) is still in development. | Use Project Blue's figures, not Gemini's |
| Nyerere Hydropower power reaching the goldfields | Clarified | The 2,115 MW plant feeds the national grid; power reaches mining districts through the general transmission network, not dedicated lines. Gemini's "TANESCO commissioning report (Aug 2026)" was not checked. | Fine as general context; a site's actual grid access needs TANESCO confirmation |
| Minamata enforcement "forcing" miners off mercury | Clarified | Tanzania is a party to the Convention and has a National Action Plan for small-scale gold mining. Mercury use is being phased out gradually; there is no blanket cutoff. | Describe it as a gradual phase-out, never as a ban already in force |
| Dry-stack and zero-discharge rules by 2028–29 | Not a legal rule | Gemini agrees: no Tanzanian law sets this. Current rules require environmental impact assessments and approved tailings management under NEMC. | Present only as good practice, never as a requirement |
| Search volumes and "high-volume" labels | No data | Gemini agrees these need Keyword Planner or similar tools | Validate in Phase 0 |

**What the corrections change:**
- **Critical minerals (D10) is less speculative.** Copper processing in Chunya and graphite plants in Tanga and Lindi are real and operating. MAST's leach-and-cementation route and buying from small-scale miners are directly relevant to our audience. This supports a copper-focused guide even before any flotation equipment pages.
- **Assays (Phase 1):** the Dodoma laboratory supports an update to the assay guide and social post IG-27 once it opens (due Sep 2027). Until then it is a future facility.
- **Selling gold:** Gemini's version of the 20% rule is a common misreading. Our guide's wording is more precise, and a short explainer or social post could correct it.

---

## 4. Recommendations we should change or decline

| Recommendation | Problem | What we do instead |
|---|---|---|
| Case studies with **site photos** and **recovery data** | Breaks the photo policy (no real photos of people, sites, yard or equipment). Client results and details are confidential under `AGENTS.md`. | Anonymous, approved worked examples (open decision D7 in the content plan). Use diagrams, tables and stated assumptions. Never use client names or real recovery figures without written approval. |
| **Eco-friendly non-cyanide leaching powders** and a partnership with the makers | Many "eco" gold reagents are poorly documented, some still contain cyanide compounds, and environmental approval is still required. Promoting them could mislead buyers and harm our credibility. | Decline for now. If demand is confirmed, Bartholomew writes a cautious explainer on what these products are, what to ask the supplier and why test work and approvals are still required. No product promotion. |
| **"Knelson vs Falcon"** comparison | A brand comparison weakens our vendor-neutral position and raises trademark and accuracy risks | Write a generic comparison of centrifugal concentrator types (batch versus continuous) and explain how to choose. Brand names appear only as examples searchers use. |
| **Gated** spec sheets and general-arrangement drawings | We may not hold or be licensed to publish supplier drawings. A form in front of basic specs can also reduce trust and indexing. | Keep specs on the page, where they are indexable. A downloadable PDF can follow only if Allan confirms we have suitable, publishable documents. Gating needs a separate decision (D13). |
| "Highlight **rent-to-own / vendor financing**" | We can only advertise arrangements we actually offer | Allan confirms what we offer (D12). Until then, link to the existing rental and financing guides. |
| **Critical-minerals equipment** section | Only worthwhile if we can source, quote and support this equipment. Otherwise pages bring enquiries we cannot serve. | Decision D10 before any pages are built |
| District mentions in every example | Useful, but can read as keyword stuffing | Mention a district only when the example genuinely relates to it |

---

## 5. What we already have

How each audit recommendation compares with the current site. "Strengthen" means improve and link existing pages rather than write new ones.

| Audit recommendation | Existing coverage | Verdict |
|---|---|---|
| Gold elution plant cost vs toll treatment | [/insights/gold-elution-plant-price](../src/content/insights/gold-elution-plant-price.ts) already compares owning a plant with toll treatment | Strengthen (this page already has 267 impressions at position 21–27) |
| 50 TPD CIL plant cost breakdown (EN + SW) | [/insights/gold-plant-setup-cost](../src/content/insights/gold-plant-setup-cost.ts) and SW `gharama-ya-plant-ya-dhahabu`; approved examples in `src/data/plant-cost-examples.ts` | Strengthen with a 50 TPD worked example from the approved examples only |
| Wet pan mill vs ball mill (EN + SW) | Equipment pages for both; SW `bei-ya-mashine-ya-kusaga-mawe` | **New comparison article** (EN + SW) |
| Leasing for PML holders | [/insights/equipment-rental-tanzania](../src/content/insights/equipment-rental-tanzania.ts), [/insights/small-miner-financing](../src/content/insights/small-miner-financing.ts) | Strengthen; add a PML-holder section rather than a new page (avoids two pages competing for the same searches) |
| Tailings: vat leach vs CIL | [/insights/vat-leaching-tailings](../src/content/insights/vat-leaching-tailings.ts) touches agitated leaching | Strengthen with a comparison section, or a new article if Phase 0 shows separate demand |
| Mine hoist and headframe sizing | Equipment pages: 1, 2 and 5 tonne winches, headframe, wire rope (5 t winch: 64 impressions; 1 t at position 5) | **New guide** linking these pages |
| Underground dewatering (staged pumping) | Equipment pages: submersible dewatering pump, slurry pump | **New guide** |
| Ventilation air requirements | Equipment page: ventilation fan; [/insights/underground-air-supply](../src/content/insights/underground-air-supply.ts) | Strengthen the existing insight first |
| Grid vs diesel; hybrid solar-diesel | [/insights/off-grid-mine-power](../src/content/insights/off-grid-mine-power.ts), generator rental pages | Strengthen first; new articles only if Phase 0 shows demand |
| Electric vs pneumatic rock drills | Equipment pages: pneumatic rock drill, air compressor | **New article**, if validated |
| Dry-stack tailings / filter press guide | Equipment page: filter press | **New guide**, if validated |
| Water recycling and cyanide destruction | Environmental compliance insight; leaching tank page mentions detox tanks | **New guide**, careful scope (no dosing procedures, as in the vat article) |
| Flotation, lithium and nickel processing, magnetic separators | Regional articles (copper in Zambia, platinum, coal) but nothing on processing; no equipment pages | Depends on D10 |
| PML safety and licence rules 2027 (SW) | SW `jinsi-ya-kupata-leseni-ya-pml`; [/insights/mining-commission-compliance-2026](../src/content/insights/mining-commission-compliance-2026.ts) | Strengthen; update when the rules change |
| Kiswahili terms in equipment metadata | SW equipment pages exist for 4 products; directory at `/vifaa-vya-uchimbaji` (position 10, 8% click rate) | **Extend** to more products |
| Fleet management system offline GPS | Equipment page: fleet management system | Strengthen with an FAQ, if validated |
| Equipment filters (commodity / stage / scale) | Directory is grouped by category | **New feature** (Phase 6) |
| Sizing calculators | Plant planner is private (`projects/plant-planner`); none public | **New feature** (Phase 6); must not expose private planner costs |

---

## 6. Plan and checklist

Work top to bottom. Every article follows the [editorial standard](editorial-standard.md) and has an English and a Kiswahili version with the same guidance and layout (`AGENTS.md`).

### Phase 0: Check the demand (about one week)

Goal: replace Gemini's claims with our own evidence before we write anything.

**Workbook:** [search-demand-phase0-keywords.csv](search-demand-phase0-keywords.csv) lists 72 search terms across 11 topic clusters (English and Kiswahili). Each term is mapped to the existing page and the proposed action, with empty columns for Trends, Keyword Planner and Search Console results and the verdict. Import it into Google Sheets, fill the columns, then send it back for analysis.

- [x] Export Search Console queries and pages for the last 3 months (Web) and compare with the baseline in the [SEO checklist](seo-growth-checklist.md) (7 Oct; results in §9)
- [x] Group our existing queries into the audit's clusters (7 Oct; §9): critical minerals, mercury-free recovery, modular plants, underground, power, tailings, financing, Kiswahili
- [ ] Look up every proposed query in Google Trends (Tanzania, Kenya, Uganda, DRC, Zambia; past 5 years) and Keyword Planner. Record volume, trend and competition.
- [ ] Mark each proposed article: **Go** (clear demand), **Merge** (fold into an existing page) or **Drop**
- [x] Verify or remove every claim in §3 that we want to use (7 Oct; licence count still unconfirmed)
- [ ] Record results in the workbook CSV and summarise them in §9
- [ ] **Gate:** Allan approves the Go list before Phase 2

### Build log (7 October 2026)

All phases below were built locally on 7 October 2026 at the owner's instruction to proceed without stopping. **Nothing is committed or deployed.** `[~]` means built locally and checked (`tsc`, production build, editorial, FAQ and Kiswahili-directory audits, headless-browser checks on desktop and mobile), but not yet live. Every new Kiswahili text carries `NOTE FOR REVIEW` and needs a native review before publishing.

**Default decisions taken while proceeding:**
- **Phase 0 gate:** Keyword Planner data was not available, so priority followed our Search Console data (§9). Topics with no evidence were **merged** into existing pages instead of getting thin new articles.
- **2.4 and 2.5 merged** into existing pages to avoid two pages competing for the same searches (see Phase 2).
- **Phase 3 and 4** were done mostly as sections on existing guides and equipment pages; only water recycling became a new article pair.
- **D10 (critical minerals):** first built as information only, then completed in full on the owner’s instruction the same day (see Phase 5).
- **D13 (spec sheets):** skipped; no publishable documents confirmed.
- **D6:** no approved 50 TPD CIL example exists, so the plant-cost item stays open.

### Phase 1: Strengthen what we have (quick wins)

- [~] `/insights/gold-elution-plant-price`: links to the elution and CIL/CIP equipment pages added; the wrong contact box (copied from the test-work guide) replaced with an elution/toll one
- [ ] `/insights/gold-plant-setup-cost`: 50 TPD worked example. **Blocked:** `plant-cost-examples.ts` has only alluvial wash-plant examples; needs an approved CIL example (D6)
- [~] `/insights/equipment-rental-tanzania`: new section "Match hire to a small-scale licence"; `/insights/small-miner-financing`: new section "Add the evidence a small-scale licence can provide" (cites the Commission–CRDB agreement via TanzaniaInvest); both cross-linked
- [~] `/insights/vat-leaching-tailings`: new section "Decide between vat leaching and agitated leaching"
- [~] `/insights/underground-air-supply`: links to ventilation fan, compressor, gas detector and SCSR pages
- [~] Equipment FAQs: the ball mill page already answers sizing ("How do I size a ball mill…"); no change needed. New guide sections added instead (below)
- [~] Kiswahili: Swahili search titles and terms added to 9 products (ball mill, wet pan mill, hammer mill, centrifugal, shaking table, leaching tank, generator, compressor, dewatering pump) through new optional `title`/`searchTerms` fields in `equipment-catalogue-sw.json`
- [~] PML ladder links: shaking table → CIL/CIP; 5 t winch → dewatering pump; dewatering pump → 5 t winch; leaching tank → gas detector
- [~] Redirect `/equipment/5-tin-mine-winch` → `/equipment/5-ton-mine-winch` (`next.config.ts`)
- [~] New equipment guide sections, EN + SW: leaching tank (maintenance, planned inspection, warning signs, for "gold cip tank maintenance"); 1/2/5 t winches (shared size comparison, SEO checklist D.7); SCSR (SCSR vs filter, coverage planning, storage and training, SEO checklist D.6)

### Phase 2: New gold, PML and underground guides

| # | Result | EN | SW |
|---|---|---|---|
| 2.1 | New: `/insights/wet-pan-mill-vs-ball-mill` · `/insights-swahili/kinu-cha-dhahabu-pan-mill-au-ball-mill` | [~] | [~] |
| 2.2 | New: `/insights/mine-winch-headframe-sizing` · `/insights-swahili/ukubwa-wa-winchi-na-headframe` | [~] | [~] |
| 2.3 | New: `/insights/shaft-dewatering-staged-pumping` · `/insights-swahili/kutoa-maji-shimoni` | [~] | [~] |
| 2.4 | Merged: section "Batch or continuous discharge" on `/equipment/centrifugal-gold-concentrator` (EN + SW) | [~] | [~] |
| 2.5 | Merged: section "Moving an operating gravity plant to leaching" in `/insights/gravity-vs-cyanide-gold-recovery` (English-only guide) | [~] | n/a |

### Phase 3: Power

- [~] 3.1 Merged: section "Assess a grid connection on the same basis" in `/insights/off-grid-mine-power` (TANESCO and EWURA linked; no tariff figures published; per-kWh comparison uses labelled assumptions)
- [~] 3.2 Merged: section "Size a solar-diesel hybrid from the hourly profile" in the same guide
- [~] 3.3 Merged: section "Electric or pneumatic rock drills" on `/equipment/pneumatic-rock-drill` (EN + SW)

### Phase 4: Tailings and water

- [~] 4.1 Sections "Filter presses and dry-stacked tailings" and a 50 t/day sizing example on `/equipment/filter-press` (EN + SW); dry stacking presented as an option, NEMC linked
- [~] 4.2 New: `/insights/water-recycling-gold-plant` · `/insights-swahili/kurejesha-maji-kwenye-mtambo`
- [~] 4.3 Merged: section "Plan cyanide destruction before tailings leave the circuit" in `/insights/small-cip-plant-guide` (planning scope only)

### Phase 5: Critical minerals

Completed on 7 October 2026 at the owner’s instruction (“complete critical minerals”), which settles **D10 = yes** for publishing equipment and guides. Supply terms for each item are still confirmed per enquiry.

- [~] New equipment category **Critical & Base Minerals Processing** (`minerals`) on `/equipment` and `/equipment-swahili`, with its own filter chip and card mark
- [~] Equipment pages, EN + SW: `/equipment/flotation-cell`, `/equipment/magnetic-separator`, `/equipment/spiral-classifier`. Images are code-drawn schematics (`docs/equipment-image-sources-2026-10-07/`), recorded in the image prompts and baseline files; image audit passes for all 53 products
- [~] 5.1 New: `/insights/flotation-graphite-copper` · `/insights-swahili/flotation-ya-graphite-na-shaba`
- [~] 5.2 New: `/insights/lithium-nickel-processing-guide` · `/insights-swahili/kuchakata-lithium-na-nickel` (Kabanga figures from TanzaniaInvest, June 2026)
- [~] 5.3 New: `/insights/magnetic-vs-gravity-separation` · `/insights-swahili/utenganishaji-wa-sumaku-au-gravity` (Handeni mineral sands licence from TanzaniaInvest, March 2024)
- [~] Copper guide updated to link the flotation page and guide instead of saying we publish no copper equipment
- [~] Social posts IG-45 to IG-47
- [~] Kiswahili first-pass review of all Phase 5 SW text by `grok` (read-only); 18 of 20 suggestions applied, 2 rejected as incorrect. Record: `docs/sw-review-grok-2026-10-07.json`. A native human review is still required
- [ ] Bartholomew: technical sign-off on the three equipment pages and three guides
- [ ] Impact crusher page: not built (no evidence of demand yet)

### Phase 6: Equipment directory and tools

- [~] Filters on `/equipment` and `/equipment-swahili`: search, stage (category) chips, "Gold recovery" and "Common on small-scale (PML) sites" toggles. Cards stay server-rendered for search engines. Tags live in `src/data/equipment-facets.ts` (Allan to review the small-scale list)
- [~] Calculator 1: the existing generator sizer on `/generator-rental` now has an anchor and is linked from the generator equipment page (EN + SW) and the off-grid power guide
- [~] Calculator 2: new leach tank volume calculator, `/tools/leach-tank-calculator` and `/insights-swahili/kikokotoo-cha-tanki-la-leaching`; same method as the leaching tank FAQ (reproduces 79.6 m³ / 14.6 m³ per tank); linked from the leaching tank page and the small CIP guide; in the sitemap and Kiswahili directory
- [ ] Spec-sheet PDFs: skipped (D13)
- [~] Mobile and performance check: no horizontal scroll at 390 px on the new pages; filter and calculator add ~2–3 kB of client JS

### Phase 7: Social posts

- [~] IG-41 to IG-44 added to the carousel tool's "Informative content" folder: wet pan mill vs ball mill, winch sizing, shaft dewatering, copper ore. Images are placeholders to source
- [ ] News posts: none added; no new confirmed regulatory change since IG-19 to IG-25

### Before publishing

- [ ] Native Kiswahili review of all new SW text (6 guide pairs' SW versions, 7 SW equipment guide files, calculator page, product titles)
- [ ] Bartholomew: technical sign-off on all new guides and equipment sections; Allan: commercial copy and the small-scale tag list
- [ ] Commit, deploy and request indexing for the new URLs, then check them in Search Console after 2–4 weeks
- [ ] Update `docs/editorial-standard.md` inventory counts (done in this pass) and tick the matching SEO checklist items once live

### Not doing

- Case studies with real photos or client recovery data
- Promotion of eco-reagent products
- Brand-against-brand comparisons
- Presenting predicted regulations (dry-stack, zero discharge) as current rules

---

## 7. Decisions needed

| # | Question | Owner | Blocks |
|---|---|---|---|
| D10 | Critical-minerals equipment? **Answered in the tracker 7 Oct: yes.** Phase 5 built. Confirm supply terms per enquiry. | Allan | Done |
| D11 | Content for Kenya, Uganda, DRC and Zambia buyers? **Answered: yes.** Current data shows little regional volume (§9), so add regional pages as demand appears. | Allan | Future article scope |
| D12 | Financing we offer? **Answered: rental and lease.** Added to the rental guide (7 Oct). No rent-to-own or partner-lender claims. | Allan | Done |
| D13 | Publishable spec sheets? **Answered: no.** Skipped. | Allan | Done |
| D14 | Public calculators? **Answered: yes, only if accuracy can be verified; no assumption-heavy tools.** Leach tank calculator kept to the mass balance; the assumed tank-shape output was removed (7 Oct). | Allan / Bartholomew | Done |
| D15 | Can we publish one approved, anonymous project example (links to D7)? | Allan | Case-study content |
| D16 | Phase 0 data owner? **Answered: Google data, already supplied** (Search Console export, §9). | Allan | Done |

---

## 8. Checklist for each new article

- [ ] Phase 0 shows demand (or Allan approves it for strategic reasons)
- [ ] Opens with the reader's question, explains it in connected prose and gives a worked example and a conclusion with a next step (editorial standard)
- [ ] English and Kiswahili versions with the same guidance and layout
- [ ] Every figure has a source or is clearly labelled as an assumption
- [ ] No supplier costs, commission, margin, reserves, staff pay, private attachments or client details
- [ ] No real photos; stock, diagrams or labelled AI illustrations only
- [ ] Links to the relevant equipment pages and at least one related insight
- [ ] Technical sign-off (Bartholomew) and commercial sign-off (Allan)
- [ ] Added to the sitemap and checked in Search Console after publishing
- [ ] Social carousel drafted in the social tool

---

## 9. Measurement

| Measure | Baseline | Check |
|---|---|---|
| Impressions, last 28 days (whole site) | 1,481 (Sep 2026, SEO checklist) | Monthly |
| Impressions by cluster | To be recorded in Phase 0 | Monthly |
| Pages in positions 1–10 | To be recorded in Phase 0 | Monthly |
| WhatsApp and contact-form enquiries that mention an article or product | To be recorded | Monthly |

### Phase 0 results: Search Console (9 Aug – 4 Oct 2026)

**Source:** Search Console export, Web, 7 files (`~/Downloads/bartmining/`), analysed 7 Oct 2026. Query-level results are in the [workbook](search-demand-phase0-keywords.csv). Keyword Planner and Trends columns are still empty.

**Important limit:** only 1,252 of 2,717 impressions (46%) are tied to a named query. Google hides the rest as rare queries, and 46 of the 47 clicks come from these hidden queries. So Search Console shows which topics we appear for, but not everything people search.

#### Totals

| Measure | 10 Aug – 6 Sep | 7 Sep – 4 Oct | Change |
|---|---:|---:|---|
| Clicks | 13 | **34** | +162% |
| Impressions | 1,382 | 1,325 | flat (−4%) |
| Average position (weighted) | 45.1 | **25.2** | much better; last 7 days 17.7 |

- **Tanzania** brings 691 impressions at **position 9** and 33 of the 47 clicks. Kenya (22, position 8), Uganda (21, position 4), Zambia (44, position 30) and DRC (6) are small. South Africa (479) and the US (335) are large but rank at 43–55, mostly for consulting and detector searches.
- **Mobile** ranks at 17 and brings 32 clicks; desktop ranks at 48 and brings 14.
- **www:** 810 of 3,009 page impressions (27%) are still on `www.` URLs. Unchanged from September's 28%; see SEO checklist Phase A.
- One stray URL, `/equipment/5-tin-mine-winch` (a typo), received an impression. It does not appear in our code, so an external link probably points to it. Add a redirect to `/equipment/5-ton-mine-winch`.

#### Named queries by topic

| Topic | Queries | Impressions | Avg position | In Gemini's plan? |
|---|---:|---:|---:|---|
| Consulting and advisory | 13 | **479** | 65 | No (SEO checklist D.1) |
| Gold metal detectors (VLF/PI) | 10 | **266** | 47 | No (SEO checklist D.4) |
| CIP / CIL and leaching | 27 | 166 | 71 | Yes |
| Elution (incl. AARL, Zadra) | 22 | 104 | 63 | Yes |
| Gravity (concentrators, shaking tables) | 13 | 86 | 66 | Yes |
| Underground and safety (SCSR, winch, dewatering) | 15 | 52 | 47 | Yes |
| Earthmoving (dump truck, grader) | 11 | 26 | 37 | No |
| Drilling (RC) | 4 | 24 | 66 | Partly |
| Kiswahili (gold price, markets) | 6 | 12 | **7.5** | Yes (Pillar 5) |
| Modular plants | 2 | 7 | 21 | Yes |
| Power (generators) | 5 | 6 | 93 | Yes |
| Critical minerals | 0 | 0 | — | Yes (Pillar 1) |
| Tailings, filter press, financing | 0 | 0 | — | Yes |

#### What this means for the plan

1. **Gemini's priorities barely appear in our own data.** Critical minerals, tailings and financing have no impressions. That is expected, because we have no pages on them, so it does not prove there is no demand. But nothing in our data supports putting them first. Keyword Planner is now the deciding test for Phases 3–5.
2. **The two largest topics are missing from Gemini's plan.** Consulting (479) and detectors (266) are already covered by SEO checklist phases D.1 and D.4. Finishing those phases comes before any new topic.
3. **Gold processing is confirmed as our core** (CIP/CIL, elution, gravity: 356 impressions). It ranks at 60–70 apart from a few strong pages (elution plant at 16, modular plant design at 24). Phase 1 should go ahead. "Gold CIP tank maintenance" (30 impressions, position 45) points to adding maintenance content to the leaching tank page.
4. **Underground equipment is small but ranks well.** The winch pages sit at positions 5–9 and SCSR at 30. This supports guide 2.2 (winch and headframe sizing) as the most promising new article. Guide 2.3 (dewatering) has weak but real demand.
5. **Local and Kiswahili pages rank in the top 10 with good click rates.** The market pages (`/soko-la-madini/*`) rank at 4–8, and `/vifaa-vya-uchimbaji` at 7. Clicks come mainly from Tanzanian mobile users, which supports extending Kiswahili coverage.
6. **D11 (countries):** the data favours staying focused on Tanzania. Kenya and Uganda rank well on tiny volumes; a few regional pages are enough for now.

#### Links to the SEO checklist

Several items in this plan already exist in the [SEO growth checklist](seo-growth-checklist.md). Do them there and tick them here, so the work is not done twice:

| This plan | SEO checklist |
|---|---|
| Phase 1 elution, CIP/CIL, concentrator improvements | D.2, D.3, D.5 |
| Phase 1 Kiswahili and district pages | D.9 |
| Phase 1 explainer questions (CIP vs CIL, PI vs VLF, AARL vs Zadra) | E |
| Phase 6 calculators | G |
| Measurement | K (monthly review) |

### Phase 0 results: Keyword Planner and Trends (fill in)

| Proposed topic | Google Trends | Keyword Planner volume | Verdict (Go / Merge / Drop) |
|---|---|---|---|
| | | | |
