# Bart Mining SEO Audit and Growth Plan

**Site:** https://bartmining.com  
**Property in code / sitemap / canonicals:** https://www.bartmining.com  
**Date:** 14 September 2026  
**Scope:** Full public site (122 sitemap URLs), weighted to the pages Search Console is already showing.  
**Search Console export:** `~/Downloads/bartmining/` — Web, last 28 days (16 Aug–12 Sep 2026). Chart, Countries, Devices, Pages. No Queries / CTR / position file in the folder.  
**Status:** Research and audit only. No code changes in this pass.

---

## 1. Verdict

The last-28-day Search Console export is **104 Web impressions**, not 1,500. That 1.5k figure is a longer window or a round number; the 28-day run-rate annualises to about 1,350 if it held flat, and it is **not** flat — weekly impressions went 2 → 14 → 27 → 27 → 34. Google is starting to trust a handful of **English equipment pages**. Almost nothing else is in the game yet.

The page doing the work is `/equipment/gold-elution-electrowinning-plant` (78 impressions across www + apex — about 60% of all page-level impressions). Winches and mine-management software are a distant second. The homepage had **2**. Zero Swahili URLs. Zero insights articles. Tanzania is the top country (36) but Zimbabwe, South Africa and Australia are already in the mix.

Growth from here is not “add more pages.” It is: **collapse www/apex so elution stops splitting 41 vs 37**, then make that elution page (and the winch cluster) unbeatable, then pull the same intent into Kiswahili. The host split is no longer a theory — Search Console is counting the same plant page as two URLs.

The technical layer is already more complete than most sites at this size: robots.txt, sitemap, JSON-LD, hreflang on some pairs, district pages with real local substance, Swahili commercial guides, and `Google-Extended` allowed. Those foundations will not compound while Google is indexing two hosts.

---

## 2. Search Console, last 28 days (the files in Downloads/bartmining)

**Filters:** Search type = Web. Date = Last 28 days.  
**Coverage:** Chart.csv (daily), Countries.csv, Devices.csv, Pages.csv. There is no Queries.csv, no Clicks, no CTR, no average position.

### 2.1 Totals

| Slice | Figure |
|---|---|
| Date range | 16 Aug 2026 – 12 Sep 2026 (28 days) |
| Impressions | **104** (Chart = Countries = Devices) |
| Daily average | 3.7 (range 0–10) |
| Weekly trend (ISO 33→37) | 2, 14, 27, 27, **34** — climbing |
| Mobile / desktop / tablet | 70 / 30 / 4 (67% mobile) |
| Unique pages with ≥1 impression | 14 paths (17 URL rows because www and apex are listed separately) |

If someone quoted “1.5k impressions,” it was not this 28-day Web report. Ask for the 3-month or 16-month export, plus **Queries** and **Search appearance**. What we have is enough to see *which* pages Google is testing.

### 2.2 The host split is live in the data

| Host | Page-level impressions |
|---|---:|
| `bartmining.com` (apex, the 200) | 73 |
| `www.bartmining.com` (301s to apex) | 54 |

Same plant, counted twice:

| URL | Impressions |
|---|---:|
| `https://www.bartmining.com/equipment/gold-elution-electrowinning-plant` | 41 |
| `https://bartmining.com/equipment/gold-elution-electrowinning-plant` | 37 |

Winches and software split the same way. This is why Phase A (one host) is not cosmetic. Google is splitting the only page that is actually accumulating impressions.

Page-row sum (127) is higher than unique impressions (104) because GSC lists www and apex as different pages. Unique impressions still land at 104.

### 2.3 Pages, www and apex combined

| Path | Impressions | Role |
|---|---:|---|
| `/equipment/gold-elution-electrowinning-plant` | **78** | **The page.** Gold plant commercial intent. |
| `/equipment/1-ton-winch` | 12 | Small-shaft kit, Lake Victoria |
| `/equipment/mine-management-software` | 10 | Software, not hardware |
| `/equipment/5-ton-mine-winch` | 8 | |
| `/equipment/2-ton-winch` | 5 | |
| `/equipment/modular-gold-plant` | 4 | Adjacent to elution |
| `/` | 2 | Homepage is not the growth surface |
| `/equipment/submersible-dewatering-pump` | 2 | |
| 6 other equipment URLs (detector, shaking table, concentrator, generator, fleet software, Kahama supply) | 1 each | Noise / first crawl |

Not in this report at all: every Kiswahili URL, every insights article, `/equipment` hub, `/services`, `/about`, `/contact`, gold-price, PML, plant-cost.

So the 122-URL sitemap is almost entirely invisible. Google is sampling **product specification pages**, led by elution/electrowinning.

### 2.4 Countries

| Country | Impressions | Share |
|---|---:|---:|
| Tanzania | 36 | 35% |
| Zimbabwe | 17 | 16% |
| South Africa | 9 | 9% |
| Australia | 8 | 8% |
| Uganda | 5 | 5% |
| Ghana, India, United States | 3 each | |
| Egypt, Laos, Thailand | 2 each | |
| 14 others at 1 | 14 | |

Demand is English-language mining countries, not only Tanzania. Elution-plant and winch queries travel. Kiswahili is still the right *next* cluster for TZ small miners, but the current impressions are English equipment specs. Do not rebuild the homepage as a Kiswahili-first page on the back of this export.

### 2.5 What this changes in the plan

1. **Treat elution/electrowinning as page one** — title, H1, unique photos, landed-cost narrative, FAQ that answers “price / what is included / Tanzania power / carbon batch size,” internal links from winches and modular plant *into* it, and from it out to CIP/CIL and cost guides.
2. **Winch cluster is page two** (1-ton + 2-ton + 5-ton = 25 impressions combined). Cross-link them; do not let them cannibalise.
3. **Unify the host before content rewrites** so the 41+37 elution impressions become one URL.
4. **Homepage is not the 1.5k page.** Two impressions. Do not spend the first sprint on homepage slogans.
5. **Export Queries next.** Without queries we cannot see whether people search “elution plant Tanzania,” “electrowinning gold,” or brand. That file decides the H1.
6. **Swahili and insights are a bet, not current traffic.** Keep building them, but the 90-day ranking work is the English equipment URLs Google already shows.

---

## 2b. What ~1.5k / 104 impressions actually means

| Signal | Typical reading at ~1,500 impressions |
|---|---|
| Indexing | Googlebot has found the site. A subset of URLs is in the index. |
| Rankings | Almost none in positions 1–10. Impressions at this scale are mostly positions 11–100, Discover bleed, or branded queries. |
| Clicks | Usually tens, not hundreds, unless CTR is unusually high. |
| Next bottleneck | Not “more content.” It is **eligibility + relevance**. Eligibility = one canonical host, crawlable HTML, Search Console verified. Relevance = titles/H1s that match queries people type, unique facts, a named expert. |

Google’s own ranking guide is that core systems retrieve relevant pages, then prefer the ones that look most helpful. Helpful Content is no longer a separate update; it was folded into core ranking in March 2024 and is evaluated continuously. ([Ranking systems guide](https://developers.google.com/search/docs/appearance/ranking-systems-guide), last updated 10 Dec 2025.)

Until Search Console is verified on **both** `bartmining.com` and `www.bartmining.com` (or a Domain property covering both), we cannot see which queries produced the 1,500 impressions, which pages got them, or whether AI Overviews are already showing the site.

**Immediate measurement step (no code):** add a Domain property in Search Console for `bartmining.com`, submit `https://bartmining.com/sitemap.xml` after the host is unified, and turn on the [Generative AI performance report](https://support.google.com/webmasters/answer/16984139).

---

## 3. Latest Google SEO, as of mid-2026

This section is official Search Central, not third-party “ranking factor” lists. Third-party surveys (for example Search Engine Land, 9 Sep 2026) still rank intent, links, and original research highly. Google does not publish a ranking-factor list. Treat those as operator opinion.

### 3.1 Ranking and quality

- **People-first, non-commodity content.** Content written primarily to rank is a warning sign. Content that would still be useful if someone arrived from WhatsApp is the target. ([Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), 10 Dec 2025.)
- **Who / How / Why.** Google asks: who created this, how was it produced, why does it exist. Bylines that lead to a real author page are strongly encouraged. Anonymous “editorial” bylines fail this test.
- **E-E-A-T is not a ranking factor.** It is a rater concept. Trust is the most important of the four. YMYL (money, safety, licences, cyanide, royalties) gets extra weight. Gold selling, PML licences, plant cost, and cyanide pages on this site **are** YMYL-adjacent.
- **Original information beats summaries.** Google’s 2026 AI-search guide contrasts commodity copy (“7 tips for first-time homebuyers”) with non-commodity copy that only the author could write. ([Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), 10 Jul 2026.)
- **Smaller core updates run continuously.** You do not have to wait for a named core update to see gains after quality work. ([Core updates docs](https://developers.google.com/search/docs/appearance/core-updates), Dec 2025.)

### 3.2 Generative AI (AI Overviews / AI Mode)

Official position, July 2026:

- SEO still applies. AI Overviews are grounded in the same index and ranking systems (RAG + query fan-out).
- There is **no special AI markup**, no separate AI index, and no ranking benefit from `llms.txt`. Google Search ignores `llms.txt`. Keeping it for ChatGPT / Perplexity is fine and does not hurt Google. ([AI optimization guide, mythbusting](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide); docs update 15 Jun 2026.)
- “AEO” / “GEO” hacks (chunking, rewriting for the model, buying fake mentions) are not supported.
- **Scaled content written to capture every fan-out query is spam.** Same policy as web search. ([Spam policies](https://developers.google.com/search/docs/essentials/spam-policies), 28 Aug 2026.)
- Allowing `Google-Extended` is the correct opt-in for Gemini / AI Overviews grounding. This site already allows it in `robots.txt`.

### 3.3 Technical requirements that still matter

| Area | Current Google position |
|---|---|
| HTTPS | Required for a good page experience. Site is HTTPS with HSTS. |
| Mobile | Mobile-first. Pages must be usable on a phone. |
| Core Web Vitals | LCP ≤ 2.5s, **INP** ≤ 200ms (FID is gone), CLS ≤ 0.1. Used in ranking; not a silver bullet. ([Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), 10 Dec 2025.) |
| Canonicals | Redirects and `rel=canonical` are both **strong** signals. Sitemap is **weak**. Do not point them at different hosts. ([Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), 10 Jul 2026.) |
| www vs apex | Site-move guidance now explicitly covers domain variants including www / non-www (17 Jun 2026). Pick one, 301 the other, put that one in canonicals **and** the sitemap. |
| hreflang | Bidirectional, absolute URLs, self-referential, `x-default` recommended. Google detects language from the page, not from `lang` or hreflang — but both still help targeting. ([Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), 22 Dec 2025.) |
| Structured data | JSON-LD still the recommended format. Helps rich results; **not required** for AI Overviews. Product rich results need `Offer` (or a review). FAQ **rich results were removed from Google Search on 7 May 2026**; FAQ schema no longer produces a SERP feature. (Docs removed 15 Jun 2026.) |
| Sitelinks search box | Retired (Nov 2024). `WebSite` + `SearchAction` will not bring a search box. |
| Favicon | 1:1, at least 8×8, **recommend 48×48+**. Supported formats listed 28 Aug 2026. Site already ships a 512×512 `logo.png`. |
| JS | Google renders JS. Still put the real title, H1, canonical, and important claims in the initial HTML. |

### 3.4 Spam policies that this site must not trip

Relevant to Bart Mining because of programmatic district pages and a large insights set:

1. **Scaled content abuse** — many pages generated primarily to rank, with little unique value, including AI-written or lightly translated pages.
2. **Doorway abuse** — near-identical city pages that only swap the place name and funnel to one destination.
3. **Keyword stuffing** — city lists and repeated commercial phrases with no extra information.
4. **Expired domain abuse** — not applicable unless the domain was recycled (no evidence of that).

The English district pages were written to avoid doorways (distinct geology, operators, logistics, buying pattern). That is the right design. The risk is **adding more towns that cannot pass that bar**, and the Africa-wide insight articles that read like a content mill covering every country.

---

## 4. What is already in good shape

Do not rip this out.

- Next.js App Router, server-rendered HTML, HTTPS, HSTS, prerendered pages (`x-nextjs-prerender: 1`).
- `robots.ts` allows `/`, blocks `/admin` and `/api`, names AI crawlers including `Google-Extended`.
- `sitemap.ts` is generated from the same data as the pages (122 live URLs). Old `.html` sitemap is gone.
- `/products` → `/equipment` 301s, plus 301s for withdrawn product slugs.
- Central JSON-LD builders in `src/lib/seo.ts`: Organization + LocalBusiness, WebSite, BreadcrumbList, Product (correctly **without fake offers**), TechArticle, Article, Service, FAQ, ItemList.
- JSON-LD is emitted in the HTML, escaped against `</script>`, not gated on hydration.
- Equipment pages have real photos in `/public/equipment/`, specs, FAQs, related items, and district cross-links.
- Several English ↔ Swahili pairs exist and are cross-linked in the UI (`Read this page in English` / `Soma ukurasa huu kwa Kiswahili`).
- Swahili commercial pages target real demand: *bei ya dhahabu leo*, *vifaa vya uchimbaji*, *leseni ya PML*, *gharama ya plant*, royalties.
- Gold-price page regenerates hourly from public spot + FX, and it **does not pretend** to be the Mining Commission indicative price.
- Location data comments explicitly forbid doorway pages. Sampled Geita / Kahama / Mwanza copy is district-specific, not a find-replace.

---

## 5. Site inventory (live sitemap, 14 Sep 2026)

122 URLs, all listed as `https://www.bartmining.com/...` even though the live 200 host is `https://bartmining.com`.

| Section | URLs | Role |
|---|---:|---|
| Home | 1 | Brand / consultancy |
| Equipment hub + 47 product guides + 13 district supply pages | 61 | Commercial English |
| Insights | 37 | Topical / informational |
| Swahili hub + 6 town pages | 7 | Commercial Kiswahili |
| Swahili guides (price, mill, PML, plant cost, royalties) | 5 | High-intent Kiswahili |
| Mineral market pages | 6 | Daily Kiswahili intent |
| About, services, sustainability, contact | 4 | Trust / conversion |

That is enough URL surface for a site at 1.5k impressions. Adding more URLs now is more likely to dilute crawl and quality than to grow.

---

## 6. Findings

Severity: **P0** blocks indexing consolidation. **P1** blocks rankings. **P2** leaves easy gains on the table. **P3** hygiene.

### P0 — Host conflict: live site and canonicals disagree

**Live behaviour (curl, 14 Sep 2026):**

- `https://www.bartmining.com/` → **301** → `https://bartmining.com/`
- `https://bartmining.com/` → **200**
- HTTP → HTTPS 308 (good)
- HSTS present (good)

**What the HTML, sitemap, and robots then say:**

- Every audited page’s `<link rel="canonical">` points at `https://www.bartmining.com/...`
- `sitemap.xml` lists only www URLs
- `robots.txt` `Host:` and `Sitemap:` are www
- `SITE.url` and `metadataBase` in code are www
- JSON-LD `@id`s are www (`https://www.bartmining.com/#organization`)

Google’s rule: **do not specify different URLs as canonical with different techniques.** Redirects are a strong signal for the apex. Canonical + sitemap are a strong/weak pair for www. The two fight. Consolidation of links, impressions, and rankings is delayed, and Search Console “why is this page not indexed / duplicate, Google chose different canonical” reports become noisy.

**Fix (when we code):** pick **one** host. Recommendation: **apex `https://bartmining.com`**, because that is already what Vercel serves as 200. Then:

1. Set `SITE.url` and `metadataBase` to `https://bartmining.com`.
2. Rebuild every canonical, hreflang, OG url, JSON-LD `@id`, sitemap loc, robots sitemap/host.
3. Keep the www → apex 301.
4. In Search Console, use a **Domain** property, set the preferred site if offered, resubmit the apex sitemap.
5. Internal links should already be relative; confirm none hardcode www.

Do not flip the 301 to make www canonical unless you also change Vercel’s primary domain. Matching the 200 host is cheaper.

### P0 — Search Console and analytics are not in the codebase

No `google-site-verification` meta, no gtag, no GTM. Verification may exist via DNS (unconfirmed). Without a Domain property we cannot:

- see query × page × country × device
- see Tanzania vs rest-of-world
- see AI Overview impressions
- confirm index coverage vs the 122 sitemap URLs
- measure Core Web Vitals from CrUX

**Fix:** Domain property + GA4 (or equivalent) on the public layout. Do this in the same sprint as the host fix so data is not split across hosts.

### P1 — Homepage does not match search intent

Live title: *Bart Mining: Mining Consultancy & Gold Processing Plants | Tanzania & Africa*  
Live H1: *Responsible resource development*  
Live counters in the **Googlebot HTML:** `0+` years, `0+` countries, `0` continents (the `Counter` component hydrates later).

Google’s quality questions: does the main heading summarise the content? Would a searcher feel they landed in the right place?

A Tanzania miner searching *mashine ya kusaga mawe*, *gold plant Tanzania*, or *mining equipment Geita* sees a slogan. The title is closer to intent than the H1. Title and H1 should agree, and both should name the job: consultancy **and** equipment supply in Tanzania.

The hero image and OG image are a Pexels stock photo. OG image is a ranking-adjacent Discover / snippet signal (Google confirmed `og:image` as a preferred-image source, 2 Mar 2026). Stock photography on the homepage and on the founder block (“Bartholomew Ambrose on an exploration site” is a Pexels model) **hurts trust** on a YMYL-adjacent mining site.

### P1 — Authorship and E-E-A-T are fake-looking, not missing

| Surface | Current state | Google’s ask |
|---|---|---|
| Insights byline | “Bart Mining Editorial” | Named person, link to a bio |
| Article schema `author` | `{ "@id": ".../#organization" }` | Person with `name` + `url` or `sameAs` ([Article markup](https://developers.google.com/search/docs/appearance/structured-data/article), 8 Sep 2026) |
| `datePublished` / `dateModified` | Hardcoded `2025-06-01` on every article | Real ISO dates; `dateModified` only when the body actually changed |
| Visible date | “September 2026” | Must match schema |
| Founder photo | Pexels | A real photo of Bart |
| Organization `sameAs` | `[]` | LinkedIn, Facebook, Google Business Profile, YouTube if they exist |
| About title | `About & Founder Bartholomew Ambrose \| Bart Mining, Tanzania \| Bart Mining` | Title template double-appends the brand |
| Privacy / Terms in footer | Non-link `<span>`s | Real pages, or remove the labels |

Mining royalties, cyanide, PML licences, and “how to sell gold” are the kind of topics raters treat as high-stakes. A stock photo of a stranger labelled as the founder, plus an org-only author and a 2025 schema date on a 2026 article, is the opposite of verifiable experience.

### P1 — Swahili is the growth channel and it is hidden

- Root `<html lang="en">` on every page, including Kiswahili URLs. Content wrappers use `lang="sw"`. Google detects language from text, but `lang` on `<html>` is still the document language for accessibility and for some processors.
- Several Swahili pages only declare `hreflang="sw-TZ"` pointing at themselves (gold price, PML, royalties, mill price). No English pair, no `x-default`.
- Reciprocal pairs that do exist (`/equipment` ↔ `/vifaa-vya-uchimbaji`, district pairs) look valid, but all hreflang hrefs are **www**, so they inherit the P0 host bug.
- Navbar and footer have **zero** Kiswahili links. A Swahili miner who lands on English has to already know the URL.
- Native-speaker review is still a `NOTE FOR REVIEW` in the source. Shipping unreviewed Kiswahili is a quality risk (spelling / “hastily produced” in Google’s self-assessment list).

Kiswahili commercial queries (*bei ya dhahabu leo*, *vifaa vya uchimbaji Geita*, *leseni ya PML*) are the least competitive, highest-intent inventory on this site. They should be in the nav, in the sitemap host, and on `lang="sw"` documents.

### P1 — Insights mix unique Tanzania work with commodity country roundups

**Keep and deepen** (non-commodity, matches the actual business):

- Selling gold in Tanzania (44 markets / 120 centres, BoT programme, 20% rule, 5 Sep 2026 indicative prices)
- Mining Commission compliance 2026
- Mercury-free recovery, CIP/CIL, vat leaching, elution plant cost
- Equipment cost / landed price, used equipment, rental
- Small-miner financing, PML

**Treat as dilution** unless Bart has a live project and original photos/data:

- Diamond mining Botswana
- Copper Zambia
- Platinum Zimbabwe
- Coal Mozambique
- Mineral survey Kenya, exploration DRC / Namibia, mining services South Africa

Google’s own “avoid search-engine-first” questions include: *Are you producing lots of content on many different topics in hopes that some of it might perform well?* Those country roundups are the textbook case. They also compete with specialist local publishers and add no first-hand evidence.

Do not delete them on day one (that can look like a quality wipe). Stop expanding them. Noindex or canonical-cluster only after Search Console shows they get impressions and no clicks.

### P2 — Structured data that does not earn a SERP feature

- **FAQPage** on district, Swahili, and equipment pages: the FAQ rich result was **removed from Google Search on 7 May 2026**. Keep visible FAQs for humans; the JSON-LD no longer pays for itself as a rich result.
- **Product** without `offers`: correct (no fake prices), which also means **no product snippet**. When real quote bands exist, add `Offer` with `priceSpecification` / `availability` rather than invented list prices.
- **WebSite** comment claims sitelinks search box eligibility; that feature is gone. Harmless, not useful.
- **LocalBusiness** has no `geo` coordinates, no `openingHours`, no GBP URL in `sameAs`. Local pack for Dar es Salaam will not happen from schema alone — it needs a [Google Business Profile](https://business.google.com/).
- Equipment `keywords` meta: Google has ignored `keywords` for years. Harmless noise.

### P2 — Freshness theatre in the sitemap

Most sitemap `lastmod` values are `2026-09-14T17:43:50.193Z` — `new Date()` at request time. Google’s helpful-content Q: *Are you changing the date of pages to make them seem fresh when the content has not substantially changed?* Use the real `updated` field from each content object. `changefreq` is ignored by Google.

### P2 — Internal linking and IA

- Footer “East Africa / Southern Africa” city lists are **not links**. They look like a keyword block even if they are meant as coverage copy. Link the cities that have supply pages; drop the rest or move them to prose.
- Homepage does not send link equity to `/equipment`, `/vifaa-vya-uchimbaji`, or `/bei-ya-dhahabu-leo` in the primary CTA. Primary CTA is `/services` and `#method`.
- Insights hub is English-only. Swahili guides live as disconnected top-level routes.
- Privacy and Terms are labelled and unclickable.

### P2 — Images

- Equipment catalogue photos: good, local, used in OG on product pages.
- Homepage / about / sustainability: Pexels. Replace with site photography.
- Article covers often reuse product photos (acceptable) rather than unique editorial images (better for Discover).
- Next.js image optimizer is on; remote Pexels hosts add third-party latency to LCP on the homepage.

### P3 — Smaller hygiene

- Title template `'%s | Bart Mining'` double-brands pages whose title already contains “Bart Mining” (About is the live example).
- Homepage canonical in HTML is `https://www.bartmining.com` with **no trailing slash**; sitemap loc is `https://www.bartmining.com/`. Minor once the host is unified; pick one.
- Insights canonical in code uses a trailing slash on the hub (`/insights/`) and none on articles. Be consistent.
- Testimonials are anonymous (“Resource Investment Partner”). Fine if real; better with a named, permissioned quote.
- `llms.txt` is well written. Keep it for other crawlers. Do not expect a Google ranking effect.
- No `twitter:site`. Low priority.
- Favicon 32×32 is below Google’s 48×48 recommendation; 512×512 logo is already in the icon set, so this is likely already OK.

---

## 7. How this maps to “taking it to the moon”

A realistic ladder from the **104 / 28-day** baseline (elution already compounding), assuming host unification first:

| Horizon | Impressions (order of magnitude) | What has to be true |
|---|---|---|
| 30 days | 104 / 28d → 150–250 / 28d | Host unified so elution is one URL, Domain property, elution + winch titles/H1s aligned to actual queries, sitemap resubmitted |
| 90 days | 400–800 / 28d | Elution ranking for “gold elution plant” / Tanzania variants, winch cluster ranking, modular plant + CIP supporting it, author/Person + real photos, GBP live |
| 6–12 months | 50k+ trailing 16 months | English equipment cluster + Kiswahili commercial cluster (*vifaa*, *bei ya dhahabu*, PML) both ranking. Off-site: associations, local press, supplier directories, YouTube of real kit |

This is not a “publish 50 more AI articles” plan. Google’s 2026 AI guide says unique viewpoint + first-hand evidence beats volume. One photographed, priced, specified ball mill delivered to Geita will outrank ten Botswana diamond roundups.

---

## 8. Recommended work, in order (still not coding)

### Phase A — Unblock Google (1 sprint)

1. Unify host to `https://bartmining.com` everywhere (canonical, sitemap, robots, JSON-LD, OG, hreflang).
2. Verify Search Console **Domain** property; resubmit sitemap; inspect homepage, `/equipment`, `/vifaa-vya-uchimbaji`, `/bei-ya-dhahabu-leo`.
3. Add GA4 (or equivalent) on the public layout only.
4. Real `lastmod` from content dates.
5. Render founder stats as real numbers in HTML (`25+`, not a hydrated `0+`).
6. Fix About title double brand.

### Phase B — Intent and language (1–2 sprints)

7. Homepage H1 + title + meta aligned to *mining consultancy and gold processing equipment, Tanzania*. Primary CTA to equipment **and** WhatsApp. Unique photo.
8. `<html lang>` per route (`en` / `sw`).
9. Complete hreflang: every pair bidirectional, `x-default` on English, all on the apex host. Gold-price / PML / royalties either get an English counterpart or drop the lone self-hreflang.
10. Kiswahili in the nav and footer (at least: Vifaa, Bei ya dhahabu, Leseni ya PML).
11. Native Kiswahili review of the shipped pages (already flagged in code comments).

### Phase C — Trust (ongoing, starts now)

12. Real founder photograph; Person schema; `/about` as the author URL on every article.
13. Replace “Bart Mining Editorial” with Bartholomew Ambrose (or a named engineer) and a short credentials line.
14. Fix article `datePublished` / `dateModified` to the real dates in `insights.ts`.
15. Fill Organization `sameAs` (LinkedIn, Facebook, GBP).
16. Create / claim Google Business Profile: Dar es Salaam, category Mining consultant / Equipment supplier, WhatsApp, photos of yard/kit.
17. Real Privacy and Terms pages, or remove the footer labels.

### Phase D — Content that can rank (90 days)

Priority is the URLs Search Console already shows, not the URLs we wish were ranking.

18. **Elution / electrowinning page first.** Unique photos, what a plant includes, carbon batch sizes, Tanzania power (400 V / 50 Hz), landed vs ex-works, link to CIP/CIL + cost guide. This is ~60% of current impressions.
19. **Winch cluster second** (1-ton, 2-ton, 5-ton). Distinct H1s so they do not cannibalise (shaft depth / load, not three pages saying “winch Tanzania”).
20. **Mine management software** and **modular gold plant** third — already in the impression set.
21. **Do not add more district or country pages** until elution/winches are consolidating. Kahama supply has 1 impression; that is a seed, not a programme.
22. Kiswahili (gold price, vifaa, PML) stays on the roadmap as the TZ small-miner wedge. It is not current GSC traffic.
23. Add **first-party evidence** to the elution and winch pages: a photo of kit on a Tanzanian site, a landed-cost worked example. That is the non-commodity bar.
24. Optional: Merchant Center later, only when you have real SKUs and prices. Product snippets need offers.

### Phase E — Off-site (parallel, not a code sprint)

22. NAP consistency: website, GBP, WhatsApp, email, Dar address.
23. Listings: Tanzania Mining Commission adjacent directories, chamber of mines, equipment importer lists, local business listings in Mwanza/Geita.
24. One filmed equipment walk-through (YouTube). Google’s AI guide explicitly wants supporting images and video.
25. Earn links from pages that already rank for *small scale mining Tanzania* (press, STAMICO, university, NGO mercury-free programmes) by publishing something they would cite (indicative royalty table, 2026 inspection checklist).

---

## 9. What we will not do

- No mass new location pages.
- No “AI Overview optimizer” markup, chunking, or keyword-variant pages.
- No fake `Offer` prices to force product rich results.
- No date-bumping articles without a real edit.
- No buying links.
- No treating `llms.txt` as a Google ranking lever.
- No waiting for the next named core update before shipping Phase A.

---

## 10. Open questions (need you, not code)

1. The 28-day Web export is 104 impressions. Where was 1.5k from — 3 months, 16 months, or another search type? Export **Queries + Pages + Search appearance** for 3 months if you have it.
2. Confirm the preferred host. Apex is already the 200 and already has more GSC impressions (73 vs 54). Any reason to keep www?
3. Real photos of Bart and of kit on Tanzanian sites — elution plant especially?
4. Social profiles and Google Business Profile — URLs?
5. Who is the public author: Bart only, or named engineers too?
6. Are the Swahili pages approved by a native speaker yet?

---

## 11. Sources (official, used in this report)

- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) (10 Dec 2025)
- [A guide to Google Search ranking systems](https://developers.google.com/search/docs/appearance/ranking-systems-guide) (10 Dec 2025)
- [Optimizing for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) (10 Jul 2026)
- [Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies) (28 Aug 2026)
- [Specify a canonical URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) (10 Jul 2026)
- [Localized versions / hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions) (22 Dec 2025)
- [Page experience](https://developers.google.com/search/docs/appearance/page-experience) (10 Dec 2025)
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) (10 Dec 2025)
- [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article) (8 Sep 2026)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization) (8 Sep 2026)
- [Search Central documentation updates](https://developers.google.com/search/updates) (FAQ rich result removal May/Jun 2026; llms.txt clarification 15 Jun 2026; www/non-www site-move note 17 Jun 2026; favicon formats 28 Aug 2026)

---

## 12. Next step

This document is the brief. The first coding sprint should be **Phase A only** (host unification + measurement + HTML stats + About title). Do not mix in homepage copy, hreflang, or new pages in the same PR — we need a clean recrawl of one host before we ask Google to re-evaluate content.
