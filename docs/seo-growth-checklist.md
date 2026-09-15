# Bart Mining SEO Growth Checklist

**Goal:** 20,000 Google impressions per month (Web).
**Baseline (Search Console, 9 Aug – 12 Sep 2026):** **1,481 impressions and 22 clicks in the last 28 days** (1,717 impressions and 23 clicks across all 35 days of data). About 13× growth is needed.
**Timeline:** 3–6 months.
**Rule:** work top to bottom. Don't start a phase until the phase before it is at least marked "live".
**Background:** [seo-audit-2026-09.md](seo-audit-2026-09.md). Its "104 impressions" figure came from a narrower export. **The data below replaces it.**
**Data source:** `~/Downloads/check-here/` (Search Console export: Web, last 3 months; Queries, Pages, Countries, Devices, Chart, Search appearance)

**Photo policy (decided 2026-09-15):** Bart Mining does **not** publish real photos of people, sites, the yard or equipment, for security reasons. Unsplash and Pexels stock images stay. Trust comes from named authors, specs, tables, diagrams and first-hand numbers instead. Items below that needed real photos are struck through.

**Owners:**
- **Allan:** Allan Bartholomew, Head of Business Development
- **Dev:** code change on bartmining.com (goes through a commit and Vercel deploy)
- **Team:** photos, social media, outreach, data entry

**Status marks:** `[ ]` not started · `[~]` in progress · `[x]` done and checked on the live site

---

## What the Search Console data says

### Totals
| Metric | Figure |
|---|---|
| Impressions, last 28 days | **1,481** (~53 per day, steady since 13 Aug) |
| Clicks, last 28 days | **22** |
| Average position trend | ~60 in mid-August → **~29–35** by early September (improving) |
| Desktop / mobile / tablet impressions | 1,210 / 491 / 16. **70% desktop**, but desktop position is 53 vs mobile 19 |
| Rich results (Search appearance) | **None** |
| People searching "Bart Mining" by name | **None.** Only look-alikes (barber mining, barton mining, barminco) |
| www share of page impressions | 510 of 1,844 (28%). Should fade after the host fix (commit `ff4ec8d`) |

### Where impressions come from (www + apex combined)
| Page | Impressions | Clicks | Position | Reading |
|---|---:|---:|---:|---|
| `/insights/mining-consulting-africa` | **401** | 0 | 63 | **Biggest page on the site.** Consulting queries worldwide. Page is thin (~500 words, June 2025 date, stock image). |
| `/equipment/gold-elution-electrowinning-plant` | 267 | 3 | 21–27 | Closest page to page one among the high-volume topics |
| `/equipment/cil-cip-plant` | 219 | 1 | 53–61 | 25 CIP/CIL queries, all ranking 50–99 |
| `/equipment/gold-metal-detector` | 141 | 0 | 42–49 | "pi gold detector" 71, "vlf gold detector" 41 |
| `/equipment/centrifugal-gold-concentrator` | 98 | 1 | 33–64 | |
| `/equipment` | 71 | 3 | 16 | |
| `/equipment/self-contained-self-rescuer` | 71 | 0 | 21–34 | "scsr" 18 at position 30 |
| `/equipment/5-ton-mine-winch` | 64 | 0 | 10–38 | |
| `/equipment/rc-drilling-rig` | 59 | 0 | 39 | "rc drilling rig specifications" |
| `/` | 50 | 3 | 28 | |
| `/equipment/shaking-table-gold` | 50 | 1 | 12–44 | |
| `/equipment/1-ton-winch` | 39 | 0 | **5** | Already top 5, low volume |
| `/insights/geological-mapping` | 36 | 0 | 79 | |
| `/vifaa-vya-uchimbaji` | 24 | 2 | **10** | Swahili, 8% CTR |
| `/equipment/2-ton-winch` | 22 | 0 | **6** | |
| `/equipment/supply/geita`, `/mwanza`, `/kahama` | 14–16 each | 1–3 each | **5–9** | District pages rank and get clicks (CTR 6–21%) |
| `/bei-ya-vifaa-vya-uchimbaji` | 11 | 2 | 11 | Swahili, 18% CTR |
| `/insights/mining-equipment-cost-tanzania` | 14 | 0 | **4–6** | |

### Query topics (Queries.csv, grouped)
| Topic | Impressions | Queries | Typical position | Examples |
|---|---:|---:|---:|---|
| **Mining consulting / advisory** | **413** | 12 | 35–87 | mining technical consulting (69), underground coal mining consultants (60), technical mining advisory (51), resource estimation consultants (30, pos 35) |
| **CIP / CIL** | 142 | 25 | 46–99 | cip plant (55), cip plant design (30), gold cip tank maintenance (21), difference between cil and cip (many variants) |
| **Gold detectors** | 127 | 9 | 41–60 | pi gold detector (71), vlf gold detector (41), pulse induction vs vlf (pos 10) |
| **Elution** | 74 | 19 | 11–92 | gold elution process (36, pos 82), elution plant (8, **pos 16**), aarl/zadra elution, "illusion plant for gold" (misspelling, **pos 11**) |
| **Centrifugal concentrator** | 62 | 8 | 58–77 | |
| **Self-rescuer (SCSR)** | 29 | 6 | 30–55 | |
| Drilling, winch, pumps, shaking table, generator | 6–19 each | | 43–99 | |

### Countries
| Country | Impressions | Clicks | Position | Reading |
|---|---:|---:|---:|---|
| **Tanzania** | 272 | **19 of 23** | **10** | Ranks well and gets nearly all clicks. Local intent converts. |
| South Africa | 374 | 0 | 56 | Global English research, not buying |
| United States | 240 | 0 | 47 | |
| Australia | 138 | 1 | 58 | |
| Zimbabwe | 93 | 0 | 42 | |
| Uganda, Kenya, Ghana, DRC, Ethiopia | 4–14 each | 0 | **4–13** | Few impressions, but they rank high. Regional demand. |

### What this changes in the plan
1. **The volume is in English technical topics searched worldwide** (consulting, CIP/CIL, detectors, elution), with pages already indexed at positions 20–80. Moving those to page 1–2 is the fastest route to 20k, before new gold-price country pages.
2. **Consulting is the biggest topic, and the business sells it.** The "Mining consulting services" article is the top page. **Upgrade it into a proper consulting services page.** Don't treat it as a low-value article.
3. **Tanzania brings almost all clicks.** Keep the district and Swahili pages. They rank 5–11 with high CTR.
4. **Explainer searches have no answer page:** "difference between cip and cil", "pi vs vlf", "aarl vs zadra", "what is elution in gold processing". An article `cil-vs-cip-vs-heap-leach` exists but isn't among the ranking pages. Google shows the equipment page at position 80–99 instead.
5. **Desktop position 53 vs mobile 19** means worldwide desktop researchers see the site deep in results. Better content, not a layout fix, moves this.
6. **No rich results and no brand searches.** Brand building (Phase I) is currently zero.

---

## 0. How to use this checklist

- Tick an item only after checking it on **https://bartmining.com**, not only in the code.
- Each code phase ships as its own commit or PR. Don't mix phases.
- Write the date next to each finished item, e.g. `[x] ... (2026-09-15)`.
- Every Monday, fill in the **Weekly log** (section 10).
- Before building anything new, check the **Do not do** list (section 11).

---

## Phase 0: Measurement (this week) · Owner: Allan

### 0.1 Search Console
- [x] 3-month export (Queries, Pages, Countries, Devices, Chart, Search appearance), saved in `~/Downloads/check-here/` (2026-09-15)
- [ ] Confirm the property is a **Domain property** for `bartmining.com` (covers www + apex). If it's a URL-prefix property, add a Domain property via DNS TXT.
- [ ] Submit sitemap: `https://bartmining.com/sitemap.xml`
- [ ] URL Inspection → **Request indexing** on:
  - [ ] `https://bartmining.com/`
  - [ ] `/insights/mining-consulting-africa`
  - [ ] `/equipment/gold-elution-electrowinning-plant`
  - [ ] `/equipment/cil-cip-plant`
  - [ ] `/equipment/gold-metal-detector`
  - [ ] `/equipment`
- [ ] Turn on the Generative AI (AI Overviews) performance report if it's offered
- [ ] Next export (mid-October): same 6 files → compare against the tables above

### 0.2 Analytics
- [ ] Create a **GA4** property (or choose Plausible / Vercel Analytics)
- [ ] Give the measurement ID to Dev → add it to the public pages only (not `/admin`)
- [ ] Mark **WhatsApp click** and **contact form submit** as conversion events

### 0.3 Keyword demand check (before building Phases E–G)
Search Console already confirms demand for the English technical topics. Use **Google Keyword Planner** (free) to size them, and to test the Swahili and nearby topics that have no data yet.

| Term | Global | TZ | KE | UG | In GSC already? |
|---|---|---|---|---|---|
| mining technical consulting | | | | | ✅ 69 impr, pos 73 |
| mining consultants | | | | | ✅ variants |
| resource estimation consultants | | | | | ✅ 30 impr, pos 35 |
| cip plant | | | | | ✅ 55 impr, pos 77 |
| difference between cip and cil | | | | | ✅ many variants |
| pi gold detector / vlf gold detector | | | | | ✅ 71 / 41 impr |
| gold elution process | | | | | ✅ 36 impr, pos 82 |
| aarl vs zadra elution | | | | | ✅ variants |
| centrifugal gold concentrator | | | | | ✅ |
| scsr / self-contained self-rescuer | | | | | ✅ |
| rc drilling rig specifications | | | | | ✅ |
| bei ya dhahabu leo | | | | | ❌ |
| gold price today Tanzania | | | | | ❌ |
| gold price Kenya / Uganda today | | | | | ❌ |
| silver price Tanzania | | | | | ❌ |
| bei ya tanzanite | | | | | ❌ |
| bei ya mafuta leo | | | | | ❌ |
| bei ya saruji / nondo | | | | | ❌ |
| mining jobs Tanzania | | | | | ❌ |

- [ ] Fill in the table
- [ ] Cross-check the ❌ terms in **Google Trends** (Tanzania, last 12 months)
- [ ] Drop any ❌ term with **fewer than 100 searches a month** from Phases E and G

**Done when:** a Domain property is confirmed, GA4 records visits, and the demand table is filled in.

---

## Phase A: Technical foundation · Owner: Dev · ✅ LIVE (commit `ff4ec8d`, 2026-09-15)

- [x] One address everywhere: `https://bartmining.com` (canonicals, sitemap, robots, JSON-LD, OG, hreflang)
- [x] `www` → apex 301 kept (Vercel)
- [x] Brand no longer repeated in titles (About, Services, Contact, Sustainability, Insights)
- [x] Homepage and About counters show real numbers in the HTML (25+, 12+, 6)
- [x] Sitemap `lastmod` only where a real date exists
- [ ] **Check in 2–4 weeks:** www rows in Pages export drop from 28% toward 0%
- [ ] **Check in 2–4 weeks:** elution page (135 apex + 132 www today) shows under one URL
- [x] `/insights/tags/east-africa` got 14 impressions but now returns 404 (noindex). Confirmed nothing in the code links to it; it will drop out. (2026-09-15)

---

## Phase B: Intent and internal links · Owner: Dev · Weeks 1–3 · 🟡 BUILT LOCALLY (2026-09-15), not yet pushed

### B.1 Homepage
- [x] H1 and title describe the business: *Mining consultancy & gold processing equipment in Tanzania* (2026-09-15)
- [x] Primary buttons → `/equipment`, WhatsApp, and consulting page (2026-09-15)
- [x] "Most requested" block linking to the pages with the most impressions (2026-09-15):
  - [x] Mining technical consulting (Phase D.1 page)
  - [x] Gold elution & electrowinning plant
  - [x] CIP/CIL plant
  - [x] Gold metal detectors
  - [x] Centrifugal gold concentrator
  - [x] Winches (1-ton, 2-ton, 5-ton)
  - [x] Also: SCSR self-rescuers, RC drilling rig
- [x] "Kwa Kiswahili" block linking to `/vifaa-vya-uchimbaji`, `/bei-ya-vifaa-vya-uchimbaji`, `/jinsi-ya-kupata-leseni-ya-pml`, `/gharama-ya-plant-ya-dhahabu` (2026-09-15)
- [x] Live gold price teaser (TSh per gram) → `/bei-ya-dhahabu-leo`. Homepage now revalidates hourly. (2026-09-15)

### B.2 Navigation and footer
- [x] Navbar: **Kiswahili** dropdown (desktop) and section (mobile): Vifaa, Bei ya vifaa, Bei ya dhahabu, Leseni ya PML (2026-09-15)
- [x] Footer: plain East/Southern Africa city lists replaced with links to all 13 supply pages plus a "Kwa Kiswahili" column with 6 links. Countries kept as one line of text. (2026-09-15)
- [x] Footer: Privacy and Terms labels removed. Real pages are still Phase C.3. (2026-09-15)

### B.3 Language signals
- [x] Every Swahili page already sets `lang="sw"` on its content wrapper (`SwahiliArticle` or its own wrapper). Root `<html lang="en">` stays: splitting into two root layouts would break the shared 404 page. (checked 2026-09-15)
- [x] hreflang: all 20 pages with pairs link both ways on absolute apex URLs, checked in the build (2026-09-15)
- [x] `x-default` → English version on every pair (2026-09-15)
- [x] Ball mill (`/equipment/ball-mill-gold-ore`) now links back to `/bei-ya-mashine-ya-kusaga-mawe` (2026-09-15)
- [x] Swahili-only pages (gold price, PML, royalties, 6 market pages): lone self-hreflang removed (2026-09-15)

### B.4 Titles and descriptions (use Queries.csv wording)
- [x] Elution: "Gold Elution Process & Electrowinning Plant \| Tanzania", H1 adds "AARL, Zadra" (2026-09-15)
- [x] CIP/CIL: "CIP Plant Design & CIL Gold Plants \| Tanzania" (2026-09-15)
- [x] Detector: "PI vs VLF Gold Detector: Which to Choose \| Tanzania" (2026-09-15)
- [x] Concentrator: "Centrifugal Concentrator for Gold Recovery \| Tanzania" (2026-09-15)
- [x] Self-rescuer: "SCSR Self-Contained Self-Rescuer: Duration & Specs" (2026-09-15)
- [x] RC drilling: "RC Drilling Rig Specifications: Depth & Cost \| Tanzania" (2026-09-15)
- [x] Homepage description trimmed to under 160 characters (2026-09-15)
- [x] Site-wide title pass: 18 titles over 70 characters (incl. " | Bart Mining") shortened. All 124 pages now ≤ 70; Google may clip the brand suffix, which is acceptable. Market pages standardised to "Soko la Madini X: Bei ya Dhahabu Leo". (2026-09-15)
- [x] Site-wide description pass: 56 descriptions over 160 characters shortened, same facts, Swahili kept Swahili. All 124 pages now ≤ 160, none missing. (2026-09-15)
- [x] Insights hub description no longer advertises diamond/copper/platinum country roundups (per I.1) (2026-09-15)

### B.5 Structured data cleanup
- [x] Equipment pages: `TechArticle` removed, `Product` kept on all 47. Unused `techArticleSchema` builder deleted. (2026-09-15)
- [x] `WebSite` schema comment corrected (sitelinks search box retired) (2026-09-15)
- [x] FAQ markup left as is

**Done when:** the homepage links to the top 6 impression pages and Swahili hubs, Swahili pages declare `lang="sw"`, and the 6 titles in B.4 use real query wording.

---

## Phase C: Trust and authorship · Owner: Allan + Dev · Weeks 2–4

### C.1 People (Allan provides, Dev builds)
- [x] ~~Real photo of Bartholomew Ambrose~~. Not possible (photo policy). Make sure no stock image is **captioned** as him: current alt text reads "Exploration site in the field", which is fine.
- [x] Allan's photo approved (2026-09-15), copied to `public/team/allan-bartholomew.jpg`. Bartholomew shown by initials.
- [x] `/about` has a **Management** section (`#management`) (2026-09-15):
  - [x] Bartholomew Ambrose, Founder (`/about#bartholomew-ambrose`)
  - [x] Allan Bartholomew, Head of Business Development (`/about#allan-bartholomew`); no mining-operator claims
- [x] `Person` schema for each on `/about`; Allan's includes LinkedIn + X `sameAs`, image, alumniOf (2026-09-15)
- [x] Stock image alt on `/about` no longer claims to show Bartholomew (2026-09-15)
- [x] People data in one place: `src/data/authors.ts` (2026-09-15)

### C.2 Articles
- [x] Byline: "Bart Mining Editorial" → named person with photo/initials, linked to `/about#<id>` with `rel="author"` (2026-09-15)
  - [x] Technical, geology and consulting articles (28) → **Bartholomew Ambrose**
  - [x] Cost, procurement, finance, trading and consumables guides (9) → **Allan Bartholomew, Head of Business Development**
- [x] Article schema `author` → Person with `@id` matching `/about` (2026-09-15)
- [x] Hardcoded `datePublished: '2025-06-01'` replaced with each article's month (pinned to day 1) (2026-09-15)
- [x] `dateModified` only where the body changed. Consulting article: published June 2025, updated September 2026. (2026-09-15)
- [x] Page shows the same date as the schema ("Updated September 2026" where rewritten) (2026-09-15)

### C.3 Organization
- [ ] Fill Organization `sameAs`: LinkedIn, Facebook, Instagram, YouTube, Google Business Profile
- [x] Real **Privacy** page `/privacy`, describing only what the site actually does (contact form via Resend, not stored in a database; no analytics or tracking cookies on public pages; login cookies only on staff `/admin`; Vercel hosting logs). Legal wording accepted (approved by Allan, 2026-09-15). (2026-09-15)
- [x] Real **Terms** page `/terms`: general guidance not advice, indicative specs and prices, third-party gold price data, IP, liability, Tanzanian law. Legal wording accepted (approved by Allan, 2026-09-15). (2026-09-15)
- [x] Privacy and Terms linked in the footer on every page and added to the sitemap (2026-09-15)
- [x] Contact page expanded: "What to send us" for equipment quotes and consulting, plus email, WhatsApp and district links. No office hours or response-time promises added (not confirmed). (2026-09-15)
- [x] Public email corrected to **hello@bartmining.com** (the monitored inbox; site previously showed info@) (2026-09-15)
- [x] Contact form now delivers to **allanbartinc@gmail.com** (Allan, 2026-09-15)
- [x] **Security fix:** contact form escaped all visitor input before building the notification email (was HTML injection into the inbox); subject stripped of line breaks; fields type-checked and length-capped (2026-09-15)
- [x] Contact form "We typically reply within one business day" confirmed, kept (approved by Allan, 2026-09-15)
- [x] ~~Replace Pexels/Unsplash images with real photos~~. Stock images stay (photo policy).
- [x] Stock image alt text audited: all describe the image generically; none claim to show Bart Mining people, sites or kit (the only offender, "Bartholomew Ambrose on an exploration site", was fixed in C.1) (2026-09-15)

### C.4 Consistency across your profiles
- [ ] LinkedIn title: "Head of Business Development at Bart Mining" (Aspire listed separately as Founder & CEO)
- [ ] Aspire About page already says "Head of Business Development" (changed locally, not yet committed in the Aspire repo)
- [ ] Same name, phone, email and address on website, Google Business Profile, WhatsApp Business and directories

**Done when:** no stock photos of people, every article has a named author with a real date, and Privacy and Terms pages exist.

---

## Phase D: Strengthen pages Google already shows · Owner: Dev + Team · Weeks 2–8

**Order is set by Search Console impressions** (section above). Re-sort after each monthly export.

### D.1 Mining technical consulting (401 impressions, position 63, 0 clicks) · 🟡 BUILT LOCALLY (2026-09-15)
The largest impression source. Consulting searches worldwide ("mining technical consulting", "technical mining advisory", "resource estimation consultants", "mining scoping study consultants", "underground coal mining consultants").
- [x] Decision: **upgrade `/insights/mining-consulting-africa` in place** (Allan, 2026-09-15)
- [x] Claims confirmed true by Allan: Competent Person (JORC / NI 43-101), investor due diligence, scoping to feasibility studies, underground and coal consulting (2026-09-15)
- [x] Title and H1: "Mining Technical Consulting & Advisory Services" (2026-09-15)
- [x] Sections that match real queries (~1,220 words, up from ~500) (2026-09-15):
  - [x] Technical advisory
  - [x] Technical due diligence for investors
  - [x] Resource estimation: JORC and NI 43-101, Competent Person sign-off
  - [x] Scoping, pre-feasibility and feasibility studies (accuracy table)
  - [x] Underground and coal mining consulting
  - [x] Geological data and exploration programmes
- [x] **Who does the work:** Bartholomew Ambrose, using only claims already on `/about` (2026-09-15)
- [x] How an engagement works: 5 steps with typical timelines (2026-09-15)
- [x] Date updated to September 2026 (content really changed) (2026-09-15)
- [x] Enquiry section: email, WhatsApp, contact form (2026-09-15)
- [x] Linked from the homepage (hero button and "Most requested") (2026-09-15)
- [x] Unsupported claims removed: stock-exchange acceptance list, cobalt/PGM commodities, "streaming companies" (2026-09-15)
- [x] **Reviewed:** timelines (desktop review 2–4 weeks, estimate or scoping 6–12 weeks) and "the person who reviews your data is the person who signs the report"
- [x] ~~Real field photo~~. Unsplash image stays (no real photos, security decision 2026-09-15).
- [x] Named author byline: Bartholomew Ambrose (done in C.2, 2026-09-15)
- [x] Linked from `/services` (new "Technical consulting" section) and `/about` (button under the founder block) (2026-09-15)
- [x] `/insights/geological-mapping` upgraded in place (36 impressions, position 79): ~1,280 words (was ~560). Broken punctuation fixed; mapping-scale table; GST Quarter Degree Sheets; mapping through laterite/mbuga cover; structural controls on gold in the Lake Victoria and Lupa goldfields; map → drill targets → 3D model → JORC; deliverables callout; 4 FAQs. `updated: September 2026`. (2026-09-15)

### D.2 Gold elution & electrowinning plant (267 impressions, position 21–27)
🟡 **BUILT LOCALLY (2026-09-15)**, not yet pushed. Page body ~1,770 words (was ~830). Guide sections live in `src/content/equipment/gold-elution-electrowinning-plant.ts`, a new per-product guide system any equipment page can use.
- [x] Section: **The Gold Elution Process, Step by Step** (6 steps: loaded carbon → acid wash → elution → electrowinning → smelting → regeneration) (2026-09-15)
- [x] Section: **AARL vs Zadra Elution**, 8-row comparison table (eluant, temperature, pressure, cycle time, eluate, water quality, equipment, best fit) (2026-09-15)
- [x] Section: **What a Complete Elution Plant Includes**, scope table (column, heater/boiler, acid wash, tanks, cell and rectifier, kiln, furnace, controls and safety) (2026-09-15)
- [x] Price: callout links to `/insights/gold-elution-plant-price`, not duplicated (2026-09-15)
- [x] Section: **Power and Heating on Tanzanian Sites** (400 V / 50 Hz, diesel vs electric heating, generator sizing, protected supply for ventilation and gas detection) (2026-09-15)
- [x] Section: **Sizing the Carbon Batch to Your Plant**: formula plus worked table for 50–1,000 t/day (2026-09-15)
- [x] **SVG process flow diagram** instead of photos (photo policy), checked visually (2026-09-15)
- [x] Links out → CIL vs CIP article, small CIP guide, price article, vat leaching, diesel generators, off-grid power, carbon and cyanide supply (all 7 checked) (2026-09-15)
- [x] Links in ← CIP/CIL plant, modular plant, leaching tank already list elution as related; homepage "Most requested" links to it (2026-09-15)
- [x] Spec table cycle time corrected: 8–14 h AARL, 12–24 h pressure Zadra, 48–72 h atmospheric Zadra (2026-09-15)
- [x] Page `updated` → 2026-09-15 (sitemap lastmod follows); read time 14 min (2026-09-15)
- [x] Template fix on all equipment pages: "What **an** Elution…" / "What **a** Ball Mill…" (was always "a") (2026-09-15)
- [x] **Technical figures accepted** (acid wash ~3% HCl, kiln 650–750 °C, AARL/Zadra eluant strengths and temperatures, batch-sizing assumptions of 1,500 g/t loading and 100 g/t barren)

### D.3 CIP/CIL plant (219 impressions, position 53–61, 25 queries)
🟡 **BUILT LOCALLY (2026-09-15)**, not yet pushed. Guide sections in `src/content/equipment/cil-cip-plant.ts`.
- [x] Fix overlap between pages (2026-09-15):
  - [x] Equipment page = **plant design, sizing and tank maintenance**. Gives a two-line CIP/CIL definition and links out for the comparison.
  - [x] Article retitled **"Difference Between CIP and CIL, and When Heap Leach Fits"**, description leads with the query, `updated: September 2026`
  - [x] Article gets a **CIL vs CIP vs heap leach comparison table** as its second section
  - [x] Each links to the other ("the difference between CIP and CIL" ↔ "CIP and CIL gold plant design")
- [x] Section: **How a CIP or CIL Gold Plant Works**: 7-step circuit with links to concentrator, leaching tank and elution pages (2026-09-15)
- [x] Section: **CIP Plant Design: The Numbers That Size the Plant**: 9-row design parameter table plus worked tank-volume table for 50–500 t/day (maths re-checked: 88 / 175 / 438 / 876 m³; matches the small CIP guide) (2026-09-15)
- [x] Section: **Gold CIP Tank Maintenance: What Fails and How to Catch It**: 8 failure modes (screens, attrition, carbon activity, agitators, lime scale, DO, corrosion) plus tank-entry cyanide safety callout (2026-09-15)
- [x] FAQs added: "What is a CIP plant?" and "What does CIL mean in gold processing?" (7 FAQs total) (2026-09-15)
- [x] **CIL vs CIP tank-train SVG diagram** instead of photos, checked visually (2026-09-15)
- [x] Page `updated` → 2026-09-15; read time 15 min (2026-09-15)
- [x] Template fix on all equipment pages: applications heading now "{name}: Uses and Applications" (the old "What a … Is Used For" broke on plural and vowel-initial names) (2026-09-15)
- [x] Design ranges and tank-maintenance guidance accepted (approved by Allan, 2026-09-15)

### D.4 Gold metal detectors (141 impressions, position 42–49)
🟡 **BUILT LOCALLY (2026-09-15)**, not yet pushed. Guide sections in `src/content/equipment/gold-metal-detector.ts`. Page body ~1,650 words.
- [x] Section: **PI vs VLF Gold Detectors: How They Differ**: how VLF, PI and multi-frequency work, plus a 9-row comparison table (mineralised ground, depth, small gold, discrimination, hot rocks, weight, cost, best fit) (2026-09-15)
- [x] Section: **Which Gold Detector for Which Job**: decision diagram (SVG) plus a 6-row table by job, by detector **type** not brand (2026-09-15)
- [x] Section: **Coils, Ground Balance and Field Technique**: DD vs mono, coil size, hot rocks, 5-step technique incl. tracing eluvial gold upslope; licence callout → PML guide and selling gold (2026-09-15)
- [x] Section: **Buying a Gold Detector in Tanzania: Checklist**: genuine vs copies, warranty, spare coil, off-grid power, pinpointer, training (2026-09-15)
- [x] Description rewritten around "PI vs VLF gold detectors" (154 chars); `updated` 2026-09-15; read time 12 min (2026-09-15)
- [x] Links → shaking table, concentrator, RC drill, gold exploration, PML guide, selling gold (all 6 checked) (2026-09-15)
- [x] **Price ranges in TSh: skipped, accepted.** No published Bart Mining detector prices, so the page points to a WhatsApp quote. Add a price table once Allan provides real ranges.
- [x] Generic detector types only, no brands (approved by Allan, 2026-09-15)

### D.5 Centrifugal gold concentrator (98 impressions)
🟡 **BUILT LOCALLY (2026-09-15)**, not yet pushed. Guide sections in `src/content/equipment/centrifugal-gold-concentrator.ts`. Page body ~1,650 words.
- [x] Section: **How a Centrifugal Gold Concentrator Works**: 5 steps (feed, stratification, fluidisation, tailings, discharge) plus a bowl cross-section SVG, checked visually (2026-09-15)
- [x] Section: **Gold Recovery by Particle Size**: 5-band table (>2 mm to <20 µm), liberation vs grind, GRG test → test work guide and gravity vs cyanide article (2026-09-15)
- [x] Section: **Centrifugal Concentrator vs Shaking Table**: 8-row table (figures match both spec tables), typical mercury-free circuit → mercury-free recovery article (2026-09-15)
- [x] Section: **Installing and Sizing a Concentrator**: placement (mill circuit, alluvial, tailings), sizing on t/h of solids, water, cycle time, power, concentrate security (2026-09-15)
- [x] Links → shaking table, ball mill, hydrocyclone, trommel, vibrating screen, CIL plant, generator, and 4 articles (all 11 checked). Shaking table already links back via related. (2026-09-15)
- [x] Mercury replacement and gravity vs cyanide left to the insights articles (linked, not repeated) (2026-09-15)
- [x] `updated` 2026-09-15; read time 14 min (2026-09-15)
- [x] Recovery-by-size bands and installation guidance accepted (approved by Allan, 2026-09-15)

### D.6 Self-contained self-rescuer / SCSR (71 impressions, position 21–34)
- [ ] Put "SCSR" in the H1, and explain SCSR vs filter self-rescuer
- [ ] Duration ratings (30 / 60 min), training, storage, inspection
- [ ] Tanzania safety compliance note

### D.7 Winch cluster (1-ton pos 5, 2-ton pos 6, 5-ton pos 10–38)
- [ ] Already top 10. Improve **CTR**: titles with load + shaft depth + "price Tanzania"
- [ ] Comparison table on each page linking to the other two
- [x] ~~Real photo on each~~ (photo policy)

### D.8 RC drilling rig (59 impressions, position 39)
- [ ] Specifications table first (depth, hole diameter, compressor, rod length). The query is "rc drilling rig specifications".
- [ ] "What is RC drilling" + RC vs RAB vs diamond short section

### D.9 Tanzania district and Swahili pages (rank 5–11, CTR 6–21%)
- [ ] Geita, Mwanza, Kahama: add real delivery examples (typical transit days, route, landed-cost example; no photos), keep improving CTR
- [ ] Bring Swahili district pages (Geita, Kahama, Mwanza, Shinyanga, Tarime, Chunya) from ~450 words to the depth of their English counterparts
- [ ] **Native Kiswahili review** of all Swahili pages (flagged in code as `NOTE FOR REVIEW`)

**Done when:** D.1–D.4 are live and the next monthly export shows their average position improving.

---

## Phase E: Explainers for questions already being searched · Owner: Dev · Weeks 3–10

These searches show up in Queries.csv with **no dedicated answer page**. Build them as genuinely useful guides with diagrams and real specs, not generic filler. Check each against existing articles first so pages don't compete.

- [x] **Difference between CIP and CIL**: `cil-vs-cip-vs-heap-leach` retitled, comparison table added (done in D.3, 2026-09-15)
- [x] **What is elution in gold processing** / **AARL vs Zadra**: covered as sections on the elution page (D.2, 2026-09-15)
- [x] **PI vs VLF gold detector**: covered on the detector page (D.4, 2026-09-15)
- [x] **How a centrifugal gold concentrator works**: covered on the concentrator page (D.5, 2026-09-15)
- [ ] **What is RC drilling** (vs RAB vs diamond core)
- [ ] **SCSR guide: types, duration, inspection**
- [ ] **Mine dewatering: sump pumps vs submersible vs barge** (queries: sump dewatering, dewatering barge, dewatering sump pump)
- [ ] **Diesel generators for mines and quarries: sizing guide** (5 generator queries)
- [ ] **Shaking table for gold: setup and recovery** (5 queries)
- [ ] Each explainer links to its equipment page, and the equipment page links back

**Done when:** at least 5 explainers are live and indexed, each with its own diagram or table.

---

## Phase F: Live-data pages · Owner: Dev · Weeks 4–12

No Search Console demand for these yet. **Only build items that pass the demand check in 0.3.** Each page must show **real data that changes**. No pages that only swap a place name.

### F.1 Gold (uses existing free sources: gold-api.com + open.er-api.com)
- [x] `/bei-ya-dhahabu-leo`: live world spot price → TSh per gram, 24K/22K/18K, hourly (already live)
- [x] 6 market pages (`/soko-la-madini/*`), hourly (already live)
- [ ] **Gold price history in TSh**: 7-day, 30-day and 1-year chart, plus a table of daily closing prices
  - [ ] Store a daily price snapshot (the chart needs its own history)
  - [ ] Swahili page + English counterpart ("gold price history Tanzania")
- [ ] **English page: Gold price today in Tanzania** (hreflang pair with the Swahili one)
- [x] Mining Commission indicative price: **left as a dated example** (decided 2026-09-15)

### F.2 Other metals (same API)
- [ ] Silver price in TSh (Swahili + English)
- [ ] Platinum price in TSh
- [ ] Copper price in TSh
- [ ] One hub page linking all metal price pages

### F.3 Regional gold price
Uganda, Kenya, Ghana, DRC and Ethiopia already rank at positions 4–13 on small volumes.
- [ ] Kenya: gold price in KES
- [ ] Uganda: gold price in UGX
- [ ] Others **only if** the demand check shows ≥ 500 searches a month
- [ ] Each page gets something specific to that country (local selling rules, currency, and a note on local price vs world spot), not a template with the name swapped

### F.4 Gemstones (manual data)
- [ ] Tanzanite price guide (manual price ranges by grade, with the date updated shown)
- [ ] Someone on the Team owns the monthly update

**Done when:** the history chart and at least 3 metal pages are live, indexed and getting impressions.

---

## Phase G: Tools and calculators (earn links) · Owner: Dev · Weeks 4–12

Each tool gets its own page with an explanation, a worked example, and a Swahili version.

- [ ] **Gold value calculator:** grams + karat → TSh value today (live price)
- [ ] **Royalty calculator:** sale value → 6% royalty + 1% inspection fee + take-home
- [ ] **Karat / purity converter:** karat ↔ % ↔ price per gram
- [ ] **CIP/CIL plant sizing calculator:** tonnes per day → tank volume, residence time, carbon inventory (supports D.3)
- [ ] **Elution batch calculator:** carbon tonnes → cycle time, eluant volume (supports D.2)
- [ ] **Generator sizing for mining equipment:** list equipment → kVA needed
- [ ] Each tool linked from the homepage, relevant equipment pages and the gold price page
- [ ] Each tool has a clean share link for WhatsApp (share button)

**Done when:** at least 3 tools are live, shared on social media, and have at least one link from another site.

---

## Phase H: Mining-adjacent pages (only if the demand check passes) · Owner: Dev + Team · Months 2–4

- [ ] **Bei ya mafuta leo**: EWURA monthly fuel prices by region (Team enters them monthly from EWURA's announcement)
- [ ] **Construction material prices** (cement, rebar): monthly manual prices, links to the construction equipment pages
- [ ] **Mining jobs Tanzania**: only if the Team commits to keeping listings current weekly
- [ ] Each page shows **who updated it and when**

**Done when:** each page has a named owner, updates on schedule, and gets impressions within 6 weeks. If not, remove it.

---

## Phase I: Content discipline · Owner: Allan · Ongoing

### I.1 Stop
- [ ] No new general country articles (Botswana diamonds, Zambia copper, Mozambique coal and similar)
- [ ] No new town/district pages beyond the current 13 until D.1–D.4 improve
- [ ] No AI-written articles published without first-hand facts added

### I.2 Keep and deepen
- [ ] **Mining consulting** (D.1): now the top impression page
- [ ] Selling gold in Tanzania
- [ ] Mining Commission compliance 2026
- [ ] PML licence guide
- [ ] Mercury-free recovery, CIP/CIL, vat leaching, elution plant price
- [ ] Equipment landed cost (ranks position 4–6), used equipment, rental
- [ ] Small-miner financing

### I.3 Every new article must have at least one of
- [ ] ~~A photo taken by Bart Mining~~ → an original diagram, table or calculator
- [ ] A number we measured or quoted (landed cost, delivery time, plant output)
- [ ] A named person who did the work
- [ ] A dated official source (Mining Commission, BoT, EWURA)

### I.4 Review the general country articles (month 3)
- [ ] Pull 3-month Search Console data for: diamond-mining-botswana, copper-mining-zambia, platinum-zimbabwe, coal-mining-mozambique, mineral-survey-kenya, mineral-exploration-drc, mining-services-south-africa, mining-exploration-namibia, future-mining-east-africa, junior-mining-company
- [ ] **None of these appear in the current Pages export**, so they have zero impressions so far
- [ ] Still zero at month 3 → noindex or merge into a stronger page
- [ ] **Don't bulk-delete on day one**

---

## Phase J: Off-site authority and links · Owner: Allan + Team · Start week 1, ongoing

### J.1 Google Business Profile
- [ ] Create or claim the profile: Dar es Salaam
- [ ] Categories: Mining consultant, Mining equipment supplier
- [ ] WhatsApp, phone, website `https://bartmining.com`, hours
- [x] ~~10+ real photos (office, yard, equipment, team)~~ (photo policy). Use logo, cover graphic and branded price or spec graphics.
- [ ] Ask 5 real customers for reviews
- [ ] Post weekly (new equipment, gold price update, delivery photos)

### J.2 Brand searches (currently zero)
- [ ] **Daily gold price post in Swahili** (WhatsApp Channel, Instagram, Facebook, TikTok) → link to `/bei-ya-dhahabu-leo`
- [ ] Weekly equipment post with a spec graphic or diagram (~~real photo~~) → link to the product page
- [ ] YouTube: 1 **animated explainer or narrated diagram** per month (elution process, CIP vs CIL, PI vs VLF) instead of real walk-throughs (photo policy), embedded on the page
- [ ] Always write the name as **"Bart Mining"**. Searchers currently confuse it with Barton, Barber and Barminco.
- [ ] Put profile URLs into Organization `sameAs` (Phase C.3)

### J.3 Directories and listings
- [ ] Tanzania Chamber of Minerals and Energy (member or supplier listing)
- [ ] Tanzanian business directories (same name, phone, address everywhere)
- [ ] Mining equipment supplier directories (regional and international). Global CIP, elution and detector searchers use these.
- [ ] Mining consultant directories (for D.1 consulting searches)
- [ ] Mwanza, Geita and Kahama local business listings

### J.4 Outreach (earn links, don't buy them)
- [ ] JamiiForums: answer mining and gold price threads helpfully, link where it's relevant
- [ ] Facebook small-scale mining groups (Tanzania, Kenya, Uganda)
- [ ] Pitch the royalty calculator and TSh gold price chart to Mwananchi, The Citizen and Daily News
- [ ] Contact mercury-free / ASGM NGO programmes and universities (e.g. UDSM geology) with the compliance checklist
- [ ] Contact equipment manufacturers you import from → ask for a "distributor in Tanzania" link
- [ ] Offer the CIP vs CIL and PI vs VLF explainers to mining forums and prospecting communities as references

**Done when:** Google Business Profile is live with reviews, daily price posts have run for 30 days, and at least 10 other websites link to bartmining.com.

---

## Phase K: Monthly review · Owner: Allan · First Monday of every month

- [ ] Export Search Console last 3 months → the same 6 files → save to a dated folder (e.g. `~/Downloads/gsc-2026-10/`)
- [ ] Update the "What the Search Console data says" tables at the top of this file
- [ ] Top 20 queries: is each one's page the best answer? If not, add to Phase D or E.
- [ ] **Queries at position 8–20 → quick wins.** Current: elution plant (16), illusion plant for gold (11), pulse induction vs vlf (10).
- [ ] **Pages with 50+ impressions and 0 clicks** → rewrite title and description. Current: consulting article, detectors, self-rescuer, 5-ton winch, RC drill.
- [ ] New pages from the last 30 days with zero impressions → check they're indexed (URL Inspection)
- [ ] Search Console **Page indexing** report: fix new "Duplicate" or "Crawled – not indexed" issues
- [ ] PageSpeed Insights on homepage, consulting page, elution page, gold price page → LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1
- [ ] Update section 10 and re-sort Phase D priorities

---

## 10. Weekly log

| Week of | Impressions (28d) | Clicks (28d) | Avg position | Top query | Shipped this week | Notes |
|---|---:|---:|---:|---|---|---|
| 2026-09-15 | 1,481 | 22 | ~30 (Sep) | pi gold detector (71) | Phase A live (host unification). Phase B + D.1 built locally, not pushed. | Baseline from GSC export 9 Aug – 12 Sep. 28% of page impressions still on www. |
| | | | | | | |
| | | | | | | |
| | | | | | | |

**Milestones:**

| Target | Impressions / 28 days | Expected | What has to be true |
|---|---:|---|---|
| Baseline | 1,481 | Sep 2026 | |
| Host consolidated + titles match queries | 2,500–3,500 | ~Oct 2026 | Phase A settled, B.4 titles live |
| Top pages upgraded | 5,000–8,000 | ~Nov 2026 | D.1–D.4 live, positions 60 → 20–30 |
| Explainers + tools indexed | 10,000–14,000 | ~Dec 2026 – Jan 2027 | Phase E ≥ 5 guides, Phase G ≥ 3 tools, first links |
| **Goal** | **20,000** | ~Jan – Mar 2027 | Consulting, CIP/CIL, elution and detectors on page 1–2; Tanzania price pages and brand searches growing |

These are estimates, not promises. Re-set them after each monthly review.

---

## 11. Do not do

- ❌ Buy links or "SEO packages"
- ❌ Create pages that only swap a town or country name
- ❌ Publish AI articles with no first-hand facts
- ❌ Change dates on articles that weren't edited
- ❌ Invent `Offer` prices to get product rich results
- ❌ Add "AI Overview" markup, chunking, or keyword-variant pages
- ❌ Treat `llms.txt` as a Google ranking factor
- ❌ Bulk-delete old articles in one go
- ❌ Give Allan mining-operator credentials he doesn't have
- ❌ Claim consulting experience (e.g. underground coal) the team hasn't actually done
- ❌ Create two pages targeting the same query (check existing articles first. See D.3.)
- ❌ Push to `main` without an explicit go-ahead (every push deploys to Vercel)

---

## 12. Quick reference

| Thing | Where |
|---|---|
| Site | https://bartmining.com |
| Sitemap | https://bartmining.com/sitemap.xml |
| Robots | https://bartmining.com/robots.txt |
| Site constants (URL, name, phone) | `src/lib/seo.ts` → `SITE` |
| Sitemap source | `src/app/sitemap.ts` |
| Gold price data | `src/lib/gold-spot.ts` (gold-api.com + open.er-api.com, hourly) |
| Equipment data | `src/data/equipment-catalogue.ts`, `src/data/equipment-extra.ts` |
| Articles | `src/data/insights.ts`, `src/content/insights/` |
| Consulting article (top page) | `src/data/insights.ts` → slug `mining-consulting-africa` |
| District pages | `src/data/locations.ts`, `src/data/locations-sw.ts` |
| Market pages | `src/data/markets.ts` |
| Full audit | `docs/seo-audit-2026-09.md` |
| Search Console export (baseline) | `~/Downloads/check-here/` |
| PageSpeed | https://pagespeed.web.dev/ |
| Keyword Planner | https://ads.google.com/aw/keywordplanner |
| Google Trends | https://trends.google.com/ |
| Google Business Profile | https://business.google.com/ |
