# Bart Mining: Content and Implementation Plan

**Started:** 3 October 2026
**Covers:** generator rental (new service), the gold wash plant content built from the Mbeya proposal, the standalone trommel offer, and the plant planner tool.
**Sits alongside:** [seo-growth-checklist.md](seo-growth-checklist.md) (the overall SEO programme and Search Console baseline). This file is the working plan for the items below; that one stays the master checklist.

**Status marks:** `[ ]` not started · `[~]` in progress · `[x]` done and checked on the live site
**Owners:** **Allan** (Allan Bartholomew, Head of Business Development) · **Dev** (code, commit, Vercel deploy) · **Team** (social, data entry, Google Business Profile)

Update the status marks and the [change log](#change-log) as work lands, so nothing gets lost between sessions.

---

## Rules for everything in this plan

1. **Plant names.** Never write "Option A" or "Option B", anywhere. The two configurations are the **Full Scale Plant** (150 m³/h) and the **Starter Modular Plant** (75 m³/h). The add-on is **Phase 2 • Second line**; production lines are **Line 1 / Line 2**.
2. **No internal figures in public.** Supplier costs, commission, price-risk reserve, margin and team rates never appear on the website, in articles or in client PDFs. Client prices only, and only where a decision below allows it.
3. **The repo is public.** `projects/plant-planner/data/` (supplier costs, commission) is gitignored and must stay that way. Back it up somewhere private.
4. **Pushing to `main` deploys the live site.** Commit and push only on Allan's say-so.
5. **No real photos** of people, sites, the yard or our equipment. Stock (Unsplash, Pexels) and generated images only. CC-licensed images need a credit line, so leave them out of client documents.
6. **No doorway pages.** A town page exists only if it says something true of that town and false of the others (same rule as `src/data/locations.ts`).
7. **Author:** Allan Bartholomew, Head of Business Development.
8. **Titles are searches.** Every page title is phrased the way someone types it into Google.
9. **Copy style:** natural full sentences, title-case headlines, no slogans or staccato.

---

## Decisions

### Made
| Date | Decision |
|---|---|
| 2026-10-03 | Plant configurations are named Full Scale Plant and Starter Modular Plant (never Option A/B). |
| 2026-10-03 | Client payment terms: project management fee on signing, then 30% of the balance on scope confirmation, 60% against bill of lading, 10% after commissioning. The fee is one editable entry in the planner. |
| 2026-10-03 | Team monthly rates scaled so the highest is $2,500 (Tanzania rates). Project manager is paid the flat project management fee instead. |
| 2026-10-03 | Plant page lives at `/alluvial` (shorter than `/alluvial-plant-proposal`). |
| 2026-10-03 | Generator rental is the top SEO priority (live demand: a caller asked for 200–2,500 kVA). |
| 2026-10-03 | Town pages for generator rental use `/generator-rental/<town>`, not `/generator-rental-<town>`. |
| 2026-10-03 | Generator rental facts (D1–D5): public wording is "we rent generators" (units come from partners, so never claim a fleet or stock); sizes 300–2,500 kVA; every hire includes delivery and collection, installation and commissioning, an operator or technician, and servicing; no published rates, call or WhatsApp for a quote; enquiries go to +255 759 141 705. Fuel is supplied by the customer; minimum hire is one week for industrial work and two days for events. |

### Open
| # | Question | Owner | Blocks |
|---|---|---|---|
| D6 | Wash plant articles: rounded price ranges, or no prices? | Allan | 1.3, 1.4 |
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
| 0.5 | `[x]` | Swahili page | `/jenereta-za-kukodi` | Jenereta za Kukodi Tanzania: kVA 300 hadi 2,500 | jenereta za kukodi, kukodi jenereta | Dev |
| 0.6 | `[ ]` | Article | `/insights/what-size-generator-do-i-need` | What Size Generator Do I Need? kVA Guide for Mines and Sites | what size generator do I need, generator size calculator, kVA calculation | Dev |
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
| 1.1 | `[ ]` | Main guide, with the animated diagram | `/alluvial` | How to Build a Gold Wash Plant: Step by Step | how to build a gold wash plant, how does a gold wash plant work, alluvial gold wash plant |
| 1.2 | `[ ]` | Article | `/insights/gold-trommel-sluice-box` | Gold Trommel With Sluice Box: Sizes, Price and When It's Enough | gold trommel for sale, trommel with sluice box, gold washing machine |
| 1.3 | `[ ]` | Article | `/insights/small-vs-full-gold-wash-plant` | Small Gold Wash Plant vs Full Plant: Which Should You Start With? | small gold wash plant, modular gold wash plant |
| 1.4 | `[ ]` | Article | `/insights/gold-wash-plant-equipment-list` | Gold Wash Plant Equipment List (75 and 150 m³/h) | gold wash plant equipment list, equipment needed for a gold wash plant |

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
| 2.1 | `[ ]` | `/insights/gold-wash-plant-setup-time` | How Long Does It Take to Set Up a Gold Wash Plant? | gold plant installation time, how long to set up a gold plant | The 10 delivery stages, the lowbed for the scrubber, commissioning sign-off, the project team. Links to Delivery & Shipping. |
| 2.2 | `[ ]` | `/insights/gold-wash-plant-water` | How Much Water Does a Gold Wash Plant Need? | gold wash plant water requirement, settling ponds for a gold plant | Circulating vs makeup water, pond sequence, recycling. Not covered anywhere on the site yet. |
| 2.3 | `[ ]` | `/insights/buy-gold-wash-plant-tanzania` | Where to Buy Gold Wash Plant Equipment in Tanzania | gold wash plant for sale Tanzania, mining equipment suppliers Tanzania | **Blocked by D8.** What's bought locally vs imported, and how that changes freight and lead time. |

**Existing pages to update with links:** Recovering Gold in the Rainy Season, What It Costs to Set Up a Small Gold Processing Plant, Test Work Before You Buy, Off-Grid Mine Power.

---

## Phase 3: Other formats

| # | Status | Item | Note |
|---|---|---|---|
| 3.1 | `[ ]` | Carousel: **How a Gold Wash Plant Works in 7 Steps** | The 7 flow steps are already written. Format in `tools/social-carousel`. |
| 3.2 | `[ ]` | `/jinsi-ya-kujenga-plant-ya-kuosha-dhahabu`: **Jinsi ya Kujenga Plant ya Kuosha Dhahabu** | Swahili version of 1.1. Link from `/gharama-ya-plant-ya-dhahabu`. |

---

## Track B: Standalone trommel offer

A client wants only a gold washing machine: a trommel or scrubber with sluice boxes, no full plant. This is a separate offer.

- [ ] **B1.** New project in the planner (its own file in `projects/plant-planner/data/`)
- [ ] **B2.** A simpler flow diagram for this machine: hopper, trommel with spray bars, oversize out, fines over the sluice boxes, concentrate clean-up
- [ ] **B3.** Proposal: the machine, its sluices, specs, price, delivery, terms. No plant chapters (team, civils, ponds).
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
- [ ] Travel and site accommodation is $1,500 per person-month, now above most salaries. Confirm or lower.
- [ ] The website page data (`src/data/alluvial-plant.ts`) is a hand-kept snapshot. The Map tab marks it as not automatic.

---

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
