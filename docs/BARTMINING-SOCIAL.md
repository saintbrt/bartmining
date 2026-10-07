# Bart Mining — Social Media Strategy & Carousel Tool

**Status:** Tool scaffold done (`tools/social-carousel/`); 16 active posts are written and in review; image/layout audit completed, factual sign-off and legacy image-rights verification pending  
**Working name:** BARTMINING-SOCIAL  
**Owner:** Bart Mining (Allan / team)  
**Last updated:** 2026-10-02 (full social copy pass; factual sign-off pending)  
**Primary platform for v1:** Instagram (4:5). LinkedIn / Facebook reuse the same PNGs later.  
**Language:** English only.  
**Related refs:**
- Design / layout reference: `/Users/mac/Downloads/Aspire Insta - Old.png` (2000 × 2500, 4:5)
- Legacy carousel tool: `/Users/mac/Desktop/Aspire Capital/BartMining/aspire carousels FInal design.html`
- Site fonts & tokens: `src/app/layout.tsx`, `src/app/globals.css`
- Equipment photos: `public/equipment/` (~53 assets, stock, see resolution table in §2.6)
- Team: `src/data/authors.ts`, `public/team/allan-bartholomew.jpg`
- Delivery page: `/delivery-shipping`

---

## 1. Goal

Build a **local, browser-based carousel formatter** plus a **first content batch of 14 posts** so Bart Mining can publish consistently on Instagram without redesigning from scratch each time.

Outcomes for v1:
1. A living strategy doc (this file).
2. A local tool: preview slides, edit short text, download PNGs.
3. 16 active post specs (copy + slide structure + asset map), ready to render once the tool exists.

We are **not** shipping a CMS, scheduler, or AI auto-writer in v1.

---

## 2. Brand & design system (social)

### 2.1 Typography (from bartmining.com — keep this)

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Headlines | **Sora** | 600 / 700 | **2–3 lines** max |
| Body / sub line | **Manrope** | 500 / 600 | Optional sub line, CTAs, editor UI |
| Eyebrows / labels | **Space Mono** | 400 / 700 | Uppercase, wide letter-spacing, gold (optional) |

Load via Google Fonts in the local tool (same families as the site). Do **not** reuse Cormorant Garamond / Avenir from the old Aspire HTML.

### 2.2 Colour tokens (from site)

| Token | Hex | Use on social |
|-------|-----|----------------|
| Ink / Slate | `#14181A` | Gradient base on photo slides; text on light slides |
| Ink-2 | `#444C50` | Secondary text on light slides |
| Gold | `#8A6C36` / `#7A5F2F` | Eyebrow, thin rules, small marks only |
| Paper / white | `#FFFFFF` / `#F4F6F6` | Headline text on dark; canvas on light slides |
| Line | `#D4DBDE` | Hairlines if needed |

Gold is an accent, never a large fill. Matches the website rule: no amber washes. On dark slides `#8A6C36` is low contrast, so use a lighter gold tint for eyebrows and test it at phone size.

### 2.3 Layout rules (measured from `Aspire Insta - Old.png`)

The reference is a **full-bleed photo** with a **black gradient rising from the bottom** and a **white headline set bottom-left**. There is no frame, no card, no logo, no slide index and no sub line. The specs below are measured from the reference and scaled to a 1080-wide canvas.

**Template A: `photo-overlay` (default, matches reference)**

| Rule | Spec |
|------|------|
| Canvas | **1080 × 1350** (4:5). Export at 1080 only (Instagram downsizes anything larger). |
| Photo | Full bleed, `object-fit: cover`. Source must be **≥ 1350 px tall** after crop (see §2.6). |
| Gradient | Transparent → `#14181A` starting around **65%** of the height, solid near-black for the bottom ~20%, so the headline always sits on black. |
| Side margins | **~110 px** left (≈10% of width), with at least the same on the right. |
| Headline position | Starts around **76%** down; last line ends **~130 px** above the bottom edge. |
| Headline | Sora 600, **~60 px**, line-height ~1.15, white, left-aligned, **2–3 lines** (as in the reference). |
| Sub line (optional) | Manrope 500, ~26 px, white at ~80%, short supporting text, ~20 px below the headline. Keep it brief and check that the text block stays readable over the gradient at phone size. |
| Eyebrow (optional) | Space Mono 700, ~18 px, uppercase, light gold, ~18 px above the headline. Off by default. |
| Logo | **None in v1.** |
| Slide index | None. Instagram already shows carousel dots. |
| Grid crop | The profile grid shows covers at **3:4**, which trims ~34 px off each side. The 110 px margins already clear this. |

**Template B: `light-card` (for small or square product shots)**

Use this when the photo is too small or too square to go full bleed. It keeps the same type scale and margins.

| Rule | Spec |
|------|------|
| Canvas | `#F4F6F6` background. |
| Photo | Card at the top (860 × 720), 1 px hairline border, 4 px radius, no shadow. The photo **fills the card edge to edge** (`cover`), never upscaled past 1.5×. |
| Text | Ink headline + optional Ink-2 sub line below the card. |

Use `light-card` for content slides in product and delivery posts. All closing CTA slides use the shared photo-overlay helper. Show the framed photo when an image is assigned; use a clean text-only light slide otherwise. The shared CTA retains the contact details. Educational posts can continue to use `photo-overlay`, and Allan’s approved portrait remains a light card.

**Other templates:** `cover-dark` (no photo, slate background, for quotes / Bartholomew), `stat` (a white figure at ~72 px inside a white hairline box with small corner radius, above the headline), `cta` (dark end slide).

**General rules:**
- **Use straightforward headlines:** a clear title, question or statement that names the subject and communicates one idea. Headlines do not have to be complete sentences. Use title case, for example “How to Set Up an Alluvial Gold Plant” or “Scrubbing Releases Gold Trapped in Clay”.
- **Explain the message in the supporting text.** Use natural, complete sentences, as you would when explaining the equipment to a mining operator. Use an explicit subject and explain the situation, action and reason in one or two connected sentences. Keep the language readable at phone size.
- **Prefer explanatory sentences to checklist instructions in supporting copy.** Instead of “Check feed size, slurry flow and clean-water supply when selecting a unit for your plant”, write “Before buying a centrifugal concentrator, it is important to check the feed size, slurry flow and clean water supply so you can choose a unit that suits your processing needs.” Imperatives are grammatically complete, but this brand prefers an explanation of when and why the action matters.
- **Vary the sentence openings.** Use “Before buying…”, “When selecting…” or “To choose…” where the context calls for them; avoid applying the same sentence pattern to every product.
- **Do not pad every sentence with “it is important to”.** Use the context and a concrete reason to make the sentence flow naturally. Do not promise efficient processing or higher recovery unless the source supports that claim.
- **Keep headlines direct and supporting copy explanatory.** Questions and conventional titles are allowed. Eyebrows remain short labels, figures retain units, and CTAs can make a polite direct request in a connected sentence.
- **Avoid clipped fragments, slogans and vague promises.** Prefer “Clay Can Trap Gold During the Rains” to “Rain. Clay. Lost Gold.” Explain technical terms when they first appear.
- **Do not repeat the statistic in the headline.** Use the headline to explain what the figure means, and state its conditions in the supporting text.
- **Describe supported roles and services accurately.** Do not turn a general role into a guarantee about every order. Keep estimates distinct from confirmed prices, dates and service terms.
- **Max 3 headline lines at the existing font size.** Shorten the headline and move detail into the supporting text. Do not shrink the type to fit.
- Educational carousels generally use **5–7 slides**: cover → teach → proof → bridge → CTA. Focused product posts can use **3 slides**: purpose → selection → enquiry; IG-05 remains a single-image post.
- One idea per slide. No bullet walls.

### 2.4 What we keep vs drop from the Aspire HTML

| Keep | Drop / replace |
|------|----------------|
| Full-bleed photo + bottom gradient look | Cormorant / Avenir typography → Sora / Manrope |
| Local HTML preview + per-slide + batch download | 2× export (the old PNGs are ~12 MB each, which Instagram doesn't need) |
| Slide labels + designer notes panel | Aspire branding / gold `#C8A96E` palette |
| Editable text fields before export | Hard-coded 9-slide Aspire narrative |

### 2.5 Photo policy (must follow)

From `src/data/authors.ts` and the security decision of 2026-09-15:
- **No real photos** of Bart Mining people, sites, yard or kit. Social imagery is licensed stock or generated.
- **Allan Bartholomew** headshot is the only approved portrait (`public/team/allan-bartholomew.jpg`).
- **Bartholomew Ambrose** → `cover-dark` quote card with initials, never a portrait.

### 2.6 Image sourcing (in this order)

The completed image-diversity pass is tracked in [the page-by-page image diversity checklist](social-carousel-image-diversity-plan-2026-10-02.md). It covers every current slide, removal of IG-03, Allan’s revised introduction, and unique content images with the shared CTA retained. All 51 selected content assets are now wired into 14 active posts (66 slides). The checklist links the exact assignments, credits and rendered review sheets; factual sign-off remains pending.

The current slide-by-slide inventory and completion checklist are in [the image checklist](social-carousel-image-checklist-2026-10-02.md). It records sourced images, generated illustrations and outstanding review items.

1. **Existing `public/equipment/` stock**, if it is big enough (table below).
2. **Find it online:** a higher-res licensed stock photo of the same product (Unsplash, Pexels, or other free-commercial-use sources). Save it at full resolution in the tool's own image folder, not in `public/`.
3. **Swap the product:** if nothing good exists for that product, change the slide to a related product that has a good photo.
4. **Last resort: generate it.** Codex and Grok work together on sourcing and generation. Rules for generated images:
   - Equipment only. No people, no faces, no recognisable real sites or brands/logos.
   - Have someone technical check that the machine looks plausible (wrong-looking kit costs credibility with miners).
   - Never present a generated image as "our plant" or "our delivery".

Full-bleed needs ~1080 × 1350. Current files:

| File | Size | Status |
|------|------|--------|
| `shaking-table-gold.jpg` | 4032 × 3024 | Full bleed ✅ |
| `rotary-scrubber.jpeg` | 3968 × 2232 | Full bleed ✅ (tight vertical crop) |
| `modular-gold-plant.jpg` | 2000 × 1381 | Full bleed ✅ |
| `leaching-tank.jpg` | 1920 × 1440 | Full bleed ✅ |
| `centrifugal-gold-concentrator.jpg` | 1500 × 1500 | Full bleed ✅ |
| `cil-cip-plant.jpg` | 1600 × 1000 | Borderline → step 2 |
| `gold-elution-electrowinning-plant.jpg` | 1100 × 760 | Too small → step 2 |
| `equipment/website/alluvial-gold-wash-plant-v2.webp` | **1448 × 1086** | Replaced on 7 Oct 2026; retired image keys resolve to this illustration |
| `trommel-screen.jpg` | **573 × 377** | Too small → step 2 |
| `sluice-box-gold-jig.webp` | **550 × 550** | Too small → step 2 |
| `team/allan-bartholomew.jpg` | **600 × 682** | `light-card` portrait only (no substitute allowed) |

---

## 3. Audience, platform & CTA

| Audience | Where they are | Tone |
|----------|----------------|------|
| Small / mid gold operators in TZ (Geita, Mwanza, Kahama, Shinyanga) | **Instagram + WhatsApp**: this is the v1 target | Practical, plain English |
| Procurement / plant managers | LinkedIn (later) | Crisp English, numbers, comparisons |
| Investors / partners | LinkedIn (later) | Principal-led credibility |

v1 is **Instagram first, English only**. Every post is written for the small/mid operator. LinkedIn reuse is a later, separate caption pass. Keep the English simple: short words, no jargon without a one-line explanation, since many readers use English as a second language.

**CTA (fixed for Instagram):**
- Links in IG captions are **not clickable**. So the caption says **"Link in bio"** and the bio points to the current post's article (or one links page).
- **Primary CTA = WhatsApp** `+255 759 141 705`. Use `wa.me/255759141705` in the bio or story. Display the phone number in CTA slides and captions; do not ask readers to mention an IG post code.
- Secondary: "DM us", `hello@bartmining.com`.
- All CTA slides share the IG-17 full-bleed closing image and crop. The design is defined once in `tools/social-carousel/src/data/cta.ts`; changing it updates every post, including browser-edited posts. Headlines and enquiry instructions remain specific to each post. Product content slides continue to use light cards.

---

## 4. Content pillars

| Pillar | Posts in batch | Share |
|--------|----------------|-------|
| **A. Educational / how-to** | 09, 10, 11 | 3 / 16 |
| **B. Comparison / explainer** | 02, 03 | 2 / 16 |
| **C. Product / service** | 05, 06, 12, 13–18 | 9 / 16 |
| **D. Team** | 07, 08 | 2 / 16 |

Every educational carousel ends with **one** product or consulting bridge slide, then the CTA slide.

---

## 5. First batch — 16 active post specs

Slide counts are targets; trim if copy won't stay ≤ 3 lines. **Every source claim (numbers, recovery %, costs) is copied from the named insight file, never written fresh.** Hooks are drafts: check product claims against the equipment pages before publishing.

### Removed from the active batch: IG-01
This post repeats the feed preparation and recovery setup in IG-11. It is removed from `POSTS`; its ID is reserved rather than reassigned.

### Post 02 — CIL vs CIP vs Heap Leach
- **Format:** Carousel · 6 slides · Pillar B
- **Hook:** "How Do CIL, CIP and Heap Leaching Differ?"
- **Slides:** Cover → one method per slide (×3, one fact each) → which fits small–mid TZ ops → CTA
- **Source:** `src/content/insights/cil-vs-cip-vs-heap-leach.ts`
- **Assets:** `leaching-tank.jpg` (cover), CIL/CIP plant (step 2)

### Removed from the active batch: IG-03
“When Is Gravity Recovery Enough?” was removed at the owner’s request. Its ID remains reserved.

### Removed from the active batch: IG-04
This post repeats the feed preparation and recovery setup in IG-11. It is removed from `POSTS`; its ID is reserved rather than reassigned.

### Post 05 — Product: Centrifugal Gold Concentrator
- **Format:** **Carousel · 5 slides** · Pillar C
- **Hook:** "The Right Concentrator Depends on Your Feed"
- **Asset:** `centrifugal-gold-concentrator.jpg` (full bleed)
- **Slides:** Introduction → feed preparation → clean-water supply → equipment selection → shared CTA.

### Post 06 — Product: Modular Gold Plant
- **Format:** Carousel · 5 slides · Pillar C
- **Hook:** "A Modular Plant Needs a Prepared Site"
- **Assets:** `modular-gold-plant.jpg` (cover), CIL/CIP configuration image (step 2); modular plant image for site preparation
- **Link:** cost post 10 as the natural follow-up.

### Post 07 — Team: Meet Allan Bartholomew
- **Format:** Carousel · 6 slides · Pillar D
- **Hook:** "Meet Allan Bartholomew"
- **Asset:** `public/team/allan-bartholomew.jpg` (`light-card` portrait, the file is only 600 × 682)
- **Slides:** Portrait cover → equipment sourcing → cost planning → delivery logistics → coordination of repairs and maintenance → CTA
- **Facts:** Only what's in `authors.ts`. No invented client counts.

### Post 08 — Team: Bartholomew Ambrose — 25+ Years
- **Format:** Carousel · 5 slides · Pillar D
- **Hook:** "Meet Our Founder, Bartholomew Ambrose"
- **Visual:** `cover-dark` with "BA" initials. **No portrait.** Interior slides can use generic stock exploration imagery (core trays, drill rig).
- **Slides:** Founder introduction → career marks (Resolute, Barrick, TZ / DRC / Liberia / Brazil / Canada / Australia, as in `authors.ts`) → technical consulting, resource estimation and study leadership → CTA consulting
- **Sign-off:** Bartholomew approves the quote wording.

### Post 09 — Mercury-Free Gold Recovery
- **Format:** Carousel · 6 slides · Pillar A
- **Hook:** "How to Recover Gold Without Mercury"
- **Source:** `mercury-free-gold-recovery.ts`
- **Assets:** `shaking-table-gold.jpg`, `centrifugal-gold-concentrator.jpg`
- **Why:** Strong trust + compliance angle for small miners. Keep the tone helpful, not preachy.

### Post 10 — Gold Plant Setup Cost (Tanzania)
- **Format:** Carousel · 6 slides · Pillar A / commercial
- **Hook:** "What Does a Gold Plant Cost in Tanzania?"
- **Source:** `gold-plant-setup-cost.ts`
- **Rule:** Cost **buckets / ranges** from the article only, never a single headline price.
- **Owner voice / sign-off:** Allan (commercial guide in `authors.ts`).

### Post 11 — Rainy Season Gold Recovery — **publish first**
- **Format:** Carousel · 5 slides · Pillar A
- **Hook:** "How to Process Alluvial Gold During the Rains"
- **Source:** `recovering-gold-rainy-season.ts`
- **Assets:** `rotary-scrubber.jpeg` (cover), wash plant / trommel (step 2)
- **Timing:** The short rains run **Oct–Dec**, so this is relevant now. Re-run it before the long rains (Mar–May).

### Post 12 — Delivery to the Lake Zone *(replaces "Achievements / Footprint")*
- **Format:** Carousel · 5 slides · Pillar C (service)
- **Hook:** "Mining Equipment Delivery to the Lake Zone"
- **Slides:** Cover → dispatch points (Dar es Salaam, Mwanza) → what affects district delivery estimates (from `/delivery-shipping`) → confirm insurance + spare parts support → CTA
- **Visual:** `cover-dark` + a simple route-map graphic, or stock road-freight imagery. No Bart Mining yard or truck photos.
- **Why the swap:** "Achievements" had no hard facts we can publish (no client names, no site photos). Delivery answers the real buyer question, "can you get it to my site?", using facts already on the site.

### Six Additional Product Posts — IG-13 to IG-18

These are practical core equipment topics for a hard-rock mining audience, chosen from the website catalogue. This is an editorial selection, not a sales or popularity ranking. Each post has three light-card slides: what the equipment does → what determines selection → quotation invitation. Numerical specifications are omitted so the copy does not imply that every supplied model has the same performance.

| Post | Product | Distinct message | Website source |
|------|---------|------------------|----------------|
| IG-13 | Ball mill | Ore hardness, grind size and throughput determine selection. | `/equipment/ball-mill-gold-ore` |
| IG-14 | Jaw crusher | Feed opening and discharge setting need to suit the rock and output. | `/equipment/jaw-crusher` |
| IG-16 | Hammer mill | Moisture and abrasion affect screen performance and wear costs. | `/equipment/hammer-mill` |
| IG-17 | Vibrating screen | Screening controls size fractions within the crushing circuit. | `/equipment/vibrating-screen` |
| IG-18 | Slurry pump | Slurry properties and pumping requirements determine the duty. | `/equipment/slurry-pump` |

The source copy is in `src/data/equipment-catalogue.ts` and `src/data/equipment-extra.ts`. Product photos use the website library and verified public-library replacements. See [the image and slide audit](social-carousel-audit-2026-10-02.md) for sources and remaining issues. Allan signs off the commercial posts, with Bartholomew reviewing their technical claims. The posts are written in `POSTS` with `review` status; publication approval is still pending.

### Stretch (future topics)
- Weekly gold price snapshot (recurring, low effort)
- Small mining licence (PML) in 5 steps
- Selling gold in Tanzania (compliance-aware)
- Equipment rental vs buy
- Off-grid mine power

### Suggested publishing order (2 per week)
Week 1: **11**, 07 · Week 2: 13, 14 · Week 3: 12, 10 · Week 4: 08, 16 · Week 5: 02, 17 · Week 6: 09, 18 · Week 7: 05, 06

The rainy-season post goes out first because it's timely. Allan's intro goes out early so later CTAs have a face behind them.

---

## 6. Caption & hashtag system (lightweight)

**Caption structure:**
1. State the topic or practical problem directly.
2. Explain one idea in two to four natural sentences. Avoid simply repeating every slide.
3. For posts with a guide, direct readers to the link in our bio. Do not promise a guide for a team or product post without one.
4. End with a relevant WhatsApp invitation, `+255 759 141 705`, without asking readers to mention a post code.
5. Use **3–5 relevant hashtags**, including `#BartMining`, as the batch’s house style.

**Tags (pick 3–5):** `#BartMining` `#TanzaniaMining` `#GoldProcessing` `#AlluvialGold` `#MiningEquipment` `#GoldMining` `#Geita` `#Mwanza` `#Kahama`

Store final captions in the post data (§7.5) so the export package = slides + caption text.

---

## 7. Local tool — product brief

### 7.1 What it is

A **single-page local app** you open in the browser. No deploy. Purpose: format carousels, tweak text, download PNGs.

### 7.2 Must-have features (v1) — trimmed

| Feature | Detail |
|---------|--------|
| Post picker | Select one of the 16 active post specs |
| Slide canvas | Live preview at 1080 × 1350, templates from §2.3 |
| Text edit | Side panel: headline, optional sub / eyebrow, CTA. **Red warning if the headline wraps past 3 lines** (cheap, and it enforces the one rule that matters most) |
| Image swap | Dropdown limited to the tool's **approved image folder** (photo policy enforcement) |
| Image upload | Click or drag in the editor; the file is saved into `tools/social-carousel/images/` in the repo |
| Composition | Drag the photo in the preview to reposition it; sliders for position and zoom (1–3×). The photo always fills its frame |
| Download one / all | PNG at 1080 × 1350, files named `IG-01_slide-01.png` |
| Caption box | Editable caption + copy button |
| Brand lock | Fonts / colours fixed; user edits content only |

### 7.3 Moved to v1.1 (do not block launch)

- Add / remove / reorder slides in the UI (edit `posts.ts` instead for now)
- Zip export, caption `.txt` export
- LinkedIn 1:1 crop, 2× export, logo option

### 7.4 Technical approach

**Option B: Vite + React + `html-to-image`** in `tools/social-carousel/`, with post content in `posts.ts`.

Known gotchas to handle in Phase 2:
- Wait for `document.fonts.ready` before capture, or Sora falls back to a system font in the PNG.
- Render the slide at native 1080 × 1350 off-screen and scale the *preview* with CSS `transform`, so the capture isn't blurry.
- Keep images in `tools/social-carousel/public/images/` (copied from `public/equipment/` plus sourced/generated ones) instead of reaching into `../../public`. This avoids Vite fs-allow issues, and that folder becomes the approved list.
- Keep `tools/` out of the Next.js build and out of Vercel (check `tsconfig` / `eslint` include paths so the main app doesn't try to type-check it).

### 7.5 Content data shape (draft)

```ts
type Slide = {
  id: string
  template: 'photo-overlay' | 'light-card' | 'cover-dark' | 'stat' | 'cta'
  eyebrow?: string
  headline: string      // UI warns past 3 lines
  sub?: string
  image?: string        // file in public/images
  imageFocus?: string   // CSS object-position, e.g. '50% 30%'
  stat?: string         // 'stat' template only
}

type Post = {
  id: string            // 'IG-01', used in filenames and internal post organisation
  title: string
  pillar: 'edu' | 'compare' | 'product' | 'team'
  slides: Slide[]
  caption: string
  hashtags: string[]    // 3–5
  sourceInsight?: string
  signOff: 'allan' | 'bartholomew'
}
```

`bullets` dropped: one idea per slide means no bullets on slides.

### 7.6 Folder sketch

```
tools/social-carousel/
  package.json
  index.html
  public/images/        # approved stock + sourced/generated images
  src/
    App.tsx
    templates/
      PhotoOverlay.tsx
      LightCard.tsx
      CoverDark.tsx
      StatSlide.tsx
      CtaSlide.tsx
    data/
      posts.ts
    export/
      downloadPng.ts
  README.md
docs/BARTMINING-SOCIAL.md
```

---

## 8. Build phases (after this plan is approved)

| Phase | Work | Exit criteria |
|-------|------|----------------|
| **0. Plan** | This doc + human edits | Sign-off table filled |
| **1. Design freeze** | Build **Post 11** as the golden carousel in `photo-overlay` | Side by side with `Aspire Insta - Old.png` at phone size, it looks like the same family |
| **2. Tool scaffold** | Local app, `photo-overlay` template, PNG export | 1080 × 1350 PNG with correct fonts |
| **3. Templates** | light-card, cover-dark, stat, cta | Each used by ≥ 1 post |
| **4. Content + images** | Encode the 16 active posts; source images per §2.6 | Every post previews end to end, no pixelated covers |
| **5. Polish** | 3rd-line warning, caption copy, README | A non-dev teammate exports a post unaided |
| **6. Publish pilot** | Posts 11, 07, 05 live | Feedback → adjust copy rules |

**Do not start Phase 1 coding until Phase 0 sign-off.**

---

## 9. Success metrics (first 30 days of posting)

- **8 posts published** (2 / week). Producing posts that never get published doesn't count.
- **Saves + shares per post** (Instagram Insights). Saves are the signal that educational content is working.
- **WhatsApp enquiries from Instagram.** This is the number that matters.
- Profile visits → bio link taps.
- The tool was used by a non-dev teammate at least once without help.

---

## 10. Decisions & open questions

**Decided:**
1. Platform: **Instagram 4:5 only** for v1.
2. Language: **English only.**
3. Logo: **none** for v1.
4. Images: existing stock → find online → swap product → generate (Grok / Codex) as last resort (§2.6).
5. Fact sign-off follows `authors.ts`: **commercial (cost, products, delivery) → Allan; technical (recovery, methods, team quote) → Bartholomew.**
6. Tool hosting: **fully local**. No `/admin` mount in v1.

**Still open:**
1. **Bio link:** a single links page or change the bio URL per post?
2. ~~Who sources images~~ → Codex + Grok. They drop files into `tools/social-carousel/images/` using the exact filenames the posts ask for (the tool lists them as "Image needed").

---

## 11. Risks

| Risk | Mitigation |
|------|------------|
| Scope creep into scheduler / AI writer / slide editor | v1 cut line in §7.2 / §7.3 |
| Long headlines breaking the 3-line rule | UI warning + rewrite in content pass |
| Photo policy breach | Image dropdown limited to the approved folder; uploads land only in `tools/social-carousel/images/` and follow its README rules |
| Pixelated covers from small product shots | §2.6 table + sourcing order |
| Generated images that look wrong or fake to miners | Generation is the last resort; technical check; never captioned as our own kit |
| Wrong technical claims on carousels | Every number copied from a named insight file; sign-off per §10 |
| Batch produced but never posted | Publishing order in §5; metric is *published*, not *produced* |

---

## 12. Decision log

| Date | Decision |
|------|----------|
| 2026-03-26 | Strategy drafted; implementation paused for review |
| — | Fonts: Sora / Manrope / Space Mono (site) |
| — | Tool: local formatter with preview + download + text edit |
| 2026-10-02 | Layout reference = `Aspire Insta - Old.png`: full-bleed photo + bottom gradient (`photo-overlay`); `light-card` as fallback |
| 2026-10-02 | English only; no logo in v1 |
| 2026-10-02 | Image sourcing order: stock → online → swap product → generate; Codex + Grok own image sourcing |
| 2026-10-02 | Headline limit relaxed to 3 lines (matches reference) |
| 2026-10-02 | Writing style: natural, complete sentences; title-case headlines; no staccato fragments or slogans |
| 2026-10-02 | Image upload added to the tool (saves into the repo); stat shrunk to ~72 px in a hairline box; light-card photo fills its frame |
| 2026-10-02 | Phase 0 accepted; tool scaffolded at `tools/social-carousel/` (Vite + React + html-to-image), Post 11 written as golden carousel |
| 2026-10-02 | Instagram-first; WhatsApp phone number as the primary CTA |
| 2026-10-02 | Post 12 "Achievements" → "Delivery to the Lake Zone"; Post 05 → single image |
| 2026-10-02 | Post 11 (rainy season) publishes first: short rains Oct–Dec |

---

## Earlier Claude review notes (2026-10-02)

Historical notes below describe the original 12-post plan. The active batch now has 14 posts, and product/service content slides use light cards, with the shared photo-overlay CTA.

1. **The layout spec didn't match the reference.** §2.3 described light cards in a white frame with a logo bar. `Aspire Insta - Old.png` is a full-bleed photo with a black gradient and a bottom-left white headline, with no logo or index. §2.3 is now rewritten from measurements of it. The light card stays as a fallback template only.
2. **Several key images are too small for that look.** The wash plant (600 × 450), trommel (573 × 377), sluice (550 × 550) and elution plant (1100 × 760) will pixelate full bleed. §2.6 now sets the sourcing order (online → swap product → generate).
3. **12 posts is realistic only because they're not all equal.** Post 05 is now a single image. 01 and 04 are spaced apart with different covers. "Achievements" had no publishable facts, so it became a delivery post built from `/delivery-shipping`.
4. **The CTA didn't work on Instagram.** Caption links aren't clickable. The CTA is now link-in-bio + WhatsApp with the phone number displayed directly.
5. **Timing:** it's October, so the rainy-season post is timely now and goes first.
6. **Tool scope cut:** slide add/reorder, uploads, zip and 2× export are moved to v1.1. The line-count warning moved up to v1 because it's cheap and enforces the core rule.
7. **Metric changed** from "12 produced, ≥ 3 published" to "8 published + WhatsApp enquiries by code". Otherwise the batch gets made and never posted.

---

## Human sign-off

| Role | Name | Date | OK? |
|------|------|------|-----|
| Content / BD | Allan Bartholomew | | |
| Technical accuracy | Bartholomew Ambrose | | |
| Design | | | |

**Copy review following the 2026-10-02 pass:**
- All 16 active posts have headlines, supporting text, captions and hashtags in `tools/social-carousel/src/data/posts.ts`. Placeholder copy has been replaced. Sign-off owners remain unchanged; every active post is now marked `review`, not `draft`. This is not publication approval.
- IG-11 uses an ore-test message in its recovery slide because the source labels 85–98% as combined recovery in its summary but concentrator recovery in its body. Bartholomew should resolve the source discrepancy before that percentage is reused.
- IG-11’s below-2 mm guidance describes the source’s proposed setup. The equipment catalogue lists different limits for some larger units; Bartholomew should confirm suitability for any specific quoted model.
- IG-10’s ranges are indicative equipment prices for free-milling ore, not total project budgets. Allan should approve the figures, capacity bands and exclusions.
- IG-12 describes planning estimates and asks buyers to confirm insurance and parts support. The delivery source marks after-sales and insurance policy details as awaiting Allan’s confirmation; the social copy makes no fixed transit-time or coverage promise.
- Allan’s introduction uses only the responsibilities in `src/data/authors.ts`. Bartholomew’s introduction describes his published technical leadership without promising personal involvement in every client assignment.
- Product posts use the corresponding equipment pages for qualitative claims. No new numerical performance claims have been added to posts without a named insight.

**Batch revision:** IG-01 and IG-04 were removed to avoid repeating IG-11. IG-05 now focuses on equipment selection, and IG-06 on configuration and site readiness. All slides in product/service posts use the light-card layout, including contact slides.

**Sentence-style pass:** Supporting copy now explains the context and purpose in connected sentences rather than giving bare checklist instructions. Existing factual qualifications, post IDs and layouts are preserved. Six additional product posts (IG-13–IG-18) broaden the batch into crushing, grinding, screening and pumping.

**Next step:** Allan reviews commercial copy and his introduction; Bartholomew reviews technical copy and his introduction. Preview all slides at phone size, check the three-line headline limit and image readiness, then export the approved posts.


## Image and Slide Audit — 2026-10-02

Before the diversity pass, all 16 posts (69 slides) were opened in the browser after the image pass. The source records, per-post findings and visual review sheets are in [social-carousel-audit-2026-10-02.md](social-carousel-audit-2026-10-02.md). New stock-image licenses and attribution requirements are recorded in `tools/social-carousel/images/sources.json`; required credits are included in the captions.

The ball mill, cone crusher and vibrating screen use sourced replacements. The team post uses licensed core-storage photography, and the delivery post uses a project-created map from the website location data. The existing scrubber photo serves as an interim equipment illustration on the rainy-season cover. The CIL configuration image now resolves from the website library.

Prefer 4K originals or portrait compositions suitable for 4:5, but do not enlarge a small image simply to claim 4K. Product light cards can use smaller originals when the final crop stays within the image-quality threshold. Exact subject identification takes priority over a generic industrial photograph. Photos of historical equipment or other manufacturers’ machines must be described as examples, with no suggestion of ownership, stock availability or endorsement.

All headline wrapping and missing-image checks pass. Product posts remain light cards, and intentional text-only light cards no longer trigger missing-image warnings. Sample dark, light, map and sourced-photo PNG exports were verified at 1080 × 1350. Retained website-image provenance, selected equipment illustrations and factual approval remain open in the audit.

### Image diversity implementation — 2026-10-02

The active batch contains **15 posts / 69 slides** after removal of IG-03. All 53 content image slots use distinct files; the 15 shared CTA images intentionally repeat, and the founder cover retains initials. Allan’s role now includes partnerships, with delivery logistics and repair/maintenance coordination retained. Licensed-photo credits and generated-image disclosures match the selected assets.

All 65 slides were rendered and checked: no missing images, enlargement warnings, headlines over three lines, or card/text overlaps. Four representative downloads passed at 1080 × 1350. See the [implementation checklist and rendered reviews](social-carousel-image-diversity-plan-2026-10-02.md#implementation-validation). Factual sign-off by Allan and Bartholomew remains pending.

### Equipment eyebrows

Equipment covers use a short, direct question such as “What Is a Ball Mill?” or “How Does a Jaw Crusher Work?”. Selection pages use “How Do You Choose a [Machine]?”; plant planning pages name their specific question. Avoid generic labels such as “Equipment selection” when a simple question makes the purpose clearer. Shared CTA eyebrows remain “Talk to us”.

### Equipment cover descriptions

Each equipment cover uses a natural, complete description that renders on **three lines** in the current light-card layout. Explain how the equipment works or fits the plant, using only existing sourced claims. Achieve the length through useful copy rather than forced line breaks. Check wrapping and card/text overlap in the browser whenever this copy or typography changes. All eight covers passed this check on 2026-10-02.

### Copy-ready caption editor

The tool displays caption text and hashtags together in one editable field. The “Copy caption and hashtags” button copies the entire visible text, with hashtags beneath the caption. The post data retains separate `caption` and `hashtags` properties for validation and saved edits. IG-05 now explains centrifugal separation and includes sourced preparation, water and selection details in its caption.

### IG-05 carousel expansion

IG-05 now contains five pages: the original concentrator introduction, feed preparation, clean-water supply, equipment selection and the shared CTA. The three new light-card pages use distinct generated illustrations with disclosures in the caption. Copy comes from `src/data/equipment-catalogue.ts` (centrifugal-gold-concentrator). The active total is 15 posts / 69 slides / 53 distinct content images / 15 CTA slides. All 69 slides passed browser layout checks. [Expanded IG-05 review](social-image-sourcing-2026-10-02/rendered/ig05-expanded.jpg).

### Black shading and text

The carousel tool uses pure black (`#000000`) for dark backgrounds, photo shading, stat backplates and dark text. Transparent shadows and gradients use black RGB values with opacity; charcoal or blue-green substitutes are not used.

### Removed from the active batch: IG-15

The cone crushers post was removed at the owner’s request. Its ID remains reserved. The active batch now contains **14 posts / 66 slides**, with **51 distinct content images** and **14 shared CTAs**. Earlier audit totals document previous versions.
