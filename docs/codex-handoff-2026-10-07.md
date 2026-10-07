# Codex handoff: images and Kiswahili review (7 October 2026)

**Purpose:** replace placeholder imagery and review Kiswahili for the work built on 7 October 2026 (search-demand plan, Phases 1–7). Nothing has been committed or deployed.
**Plan and build log:** [search-demand-audit-2026-10-07.md](search-demand-audit-2026-10-07.md)
**Repository root:** `/Users/mac/Documents/GitHub/bartmining`

## Rules that apply to everything below

- Follow [the editorial standard](editorial-standard.md) and `AGENTS.md`.
- **No real photos** of people, sites, the yard or equipment (security policy). Use generated illustrations or licensed stock only.
- **Never write "AI", "AI-generated" or similar** in any public caption, alt text or copy, in either language. Keep provenance in internal records only: `src/data/equipment-imagery.json` (`kind`), `docs/equipment-image-prompts-2026-10-06.json` and the social sourcing docs.
- Generated images are generic equipment-class illustrations, not a stocked unit, an exact model or a customer site.
- Do not commit, push or deploy unless the owner asks.

---

## 1. Equipment product images (3)

These three products currently show **code-drawn schematics**. They pass the image audit, but they look different from the illustrated catalogue. Replace them with illustrations in the same style as the other products.

| Product | Live page (EN / SW) | Current image (replace) | Schematic source (keep for reference) |
|---|---|---|---|
| Froth flotation cell | `/equipment/flotation-cell` · `/equipment-swahili/flotation-cell` | `public/equipment/website/flotation-cell.webp` | `docs/equipment-image-sources-2026-10-07/flotation-cell.svg` |
| Magnetic separator | `/equipment/magnetic-separator` · `/equipment-swahili/magnetic-separator` | `public/equipment/website/magnetic-separator.webp` | `docs/equipment-image-sources-2026-10-07/magnetic-separator.svg` |
| Spiral classifier | `/equipment/spiral-classifier` · `/equipment-swahili/spiral-classifier` | `public/equipment/website/spiral-classifier.webp` | `docs/equipment-image-sources-2026-10-07/spiral-classifier.svg` |

### Prompts

**flotation-cell**
> Use case: product-mockup. Create one high resolution 2048 by 1536 landscape catalogue illustration for Bart Mining's froth flotation cell equipment page. A single industrial bank of three mechanical froth flotation cells in a row: rectangular steel tanks on short legs, an electric drive motor and belt guard on top of each cell driving a vertical impeller shaft, a continuous froth launder along the front lip with grey-white mineral froth overflowing into it, a feed box at the left end and a tailings box at the right end, steel walkway handrail along the top. Show the whole bank in three-quarter front view, fully inside the frame with generous clear margins. Neutral warm off-white studio background and floor, soft diffuse daylight, restrained steel grey tanks with yellow safety guards, blue motors, crisp realistic metal textures. Product occupies about 75 percent of frame width. No people, logos, watermarks, text, labels, branding, specifications or unrelated machinery. This is a generic equipment-class illustration, not a documentary photo or exact model. It must fit a 4:3 catalogue card and a 16:9 product window without cropping the machine.

**magnetic-separator**
> Use case: product-mockup. Create one high resolution 2048 by 1536 landscape catalogue illustration for Bart Mining's magnetic separator equipment page. A single wet low-intensity drum magnetic separator: a horizontal stainless steel drum about one metre in diameter mounted over a steel slurry tank, a feed box along the top of the tank, an electric gear motor driving the drum at one end, two product outlets under the tank (magnetic and non-magnetic), on a steel support frame with short legs. A thin band of dark magnetic material adheres to the drum surface. Show the whole machine in three-quarter side view, fully inside the frame with generous clear margins. Neutral warm off-white studio background and floor, soft diffuse daylight, steel grey frame, blue tank, crisp realistic metal textures. Product occupies about 75 percent of frame width. No people, logos, watermarks, text, labels, branding, specifications or unrelated machinery. This is a generic equipment-class illustration, not a documentary photo or exact model. It must fit a 4:3 catalogue card and a 16:9 product window without cropping the machine.

**spiral-classifier**
> Use case: product-mockup. Create one high resolution 2048 by 1536 landscape catalogue illustration for Bart Mining's spiral classifier equipment page. A single high-weir spiral (screw) classifier: a long open steel trough inclined at about 15 degrees, a large rotating steel screw spiral visible along the trough, a pool of grey slurry at the lower end with an overflow weir and discharge box, a gearbox and electric motor drive with a spiral lifting device at the upper end, a sand discharge chute at the top end, steel support legs. Show the whole classifier in three-quarter side view, fully inside the frame with generous clear margins. Neutral warm off-white studio background and floor, soft diffuse daylight, steel grey structure, yellow safety guards, blue motor, crisp realistic metal textures. Product occupies about 80 percent of frame width. No ball mill, people, logos, watermarks, text, labels, branding, specifications or unrelated machinery. This is a generic equipment-class illustration, not a documentary photo or exact model. It must fit a 4:3 catalogue card and a 16:9 product window without cropping the machine.

### After generating

1. Check the mechanical layout against a real reference for each machine class (editorial standard, "Use visuals that explain something").
2. Encode each approved master (never enlarges, keeps the full composition):
   ```bash
   node scripts/prepare-equipment-image.mjs /path/to/flotation-cell-master.png flotation-cell
   node scripts/prepare-equipment-image.mjs /path/to/magnetic-separator-master.png magnetic-separator
   node scripts/prepare-equipment-image.mjs /path/to/spiral-classifier-master.png spiral-classifier
   ```
   This overwrites `public/equipment/website/<slug>.webp`. The manifest entries in `src/data/equipment-imagery.json` already point there with `"kind": "illustration"`.
3. In `docs/equipment-image-prompts-2026-10-06.json`, update the three entries for these slugs: set `prompt` to the prompt used, `tool` and `status` to the real values, `previousPrompt` to the schematic description now in `prompt`, and `revision` to a one-line note.
4. The captions and alt text in `src/data/equipment-image-copy.json` describe the machine and need no change unless the new image shows something different.
5. Run `node scripts/audit-equipment-images.mjs`, then check the cards and product heroes on desktop and mobile in both languages.

The three new guides use two of these images as covers (`/equipment/website/flotation-cell.webp`, `/equipment/website/magnetic-separator.webp`). Their cover captions say "Schematic of…". If the images are replaced, change those captions in `src/data/insights.ts` and `src/data/article-library.ts` (entries `flotation-graphite-copper`, `magnetic-vs-gravity-separation`, `flotation-ya-graphite-na-shaba`, `utenganishaji-wa-sumaku-au-gravity`) to describe the illustrated machine instead.

---

## 2. Social carousel images (28 missing)

**Folder:** `tools/social-carousel/images/` (save each file with the exact name below; the tool fills the matching "Image needed" slot).
**Posts:** `tools/social-carousel/src/data/posts-batch-2.ts`, posts IG-41 to IG-47 (folder "Informative content" in the tool).
**Size:** portrait 4:5, at least **1080 × 1350** (2160 × 2700 preferred). Slides use full-bleed templates, so keep the subject in the middle and the lower third simple, because the headline sits on a dark gradient at the bottom.
**Style for every prompt (prefix):** *Realistic editorial illustration, East African small-scale mining context, natural daylight, muted earth tones with steel grey and a touch of warm gold, no people's faces, no logos, no text, no watermarks, no brand names, portrait 4:5.*

| Post | File | Prompt (add the prefix) |
|---|---|---|
| IG-41 | `pan-mill-vs-ball-mill.png` | A wet pan mill with two heavy steel rollers in a circular pan beside a small horizontal ball mill, under an open-sided processing shed, both machines clearly separate and fully visible |
| IG-41 | `grind-size-sieve-test.png` | A stack of brass laboratory test sieves on a bench, top sieve holding coarse ground ore, a lower sieve holding fine grey powder, a small scoop beside them |
| IG-41 | `row-of-pan-mills.png` | Four identical wet pan mills in a row under a corrugated-roof shed, slurry channels running from each, red soil floor |
| IG-41 | `mill-duty-calculation.png` | An open notebook with handwritten tonnage arithmetic (illegible numbers only), a pencil and a calculator beside a small heap of crushed grey ore on a wooden table |
| IG-42 | `shaft-headframe-winch.png` | A steel lattice headframe about 12 metres tall over a small square mine shaft collar with a concrete pad, a small corrugated winch house beside it, red earth and scrub |
| IG-42 | `kibble-loaded-ore.png` | A round steel kibble bucket filled with broken ore, hanging on a wire rope at the bottom of a timbered shaft, lit by a cap-lamp beam |
| IG-42 | `winch-drum-rope.png` | Close-up of steel wire rope neatly wound in layers on an electric winch drum, motor and brake housing partly visible |
| IG-42 | `headframe-sheave-wheel.png` | Looking up at a large sheave wheel with wire rope at the top of a steel headframe against a clear sky |
| IG-43 | `flooded-shaft-sump.png` | The bottom of a timbered mine shaft with a sump of muddy water, a submersible pump hose dropping into it, wet rock walls |
| IG-43 | `sump-level-measurement.png` | A painted measuring staff with depth marks standing upright in a mine sump of murky water, wet rock behind |
| IG-43 | `pump-hose-shaft.png` | A flexible lay-flat discharge hose and power cable clamped up the side of a timbered mine shaft, viewed from below |
| IG-43 | `intermediate-sump-pump.png` | A grey submersible dewatering pump sitting in a rock-cut intermediate sump on a ledge part-way up a mine shaft, hose rising upwards |
| IG-44 | `copper-oxide-ore.png` | Pieces of green and blue copper oxide ore (malachite-type colouring) laid out on a sorting table, hand-sized rocks |
| IG-44 | `copper-ore-stockpile.png` | A stockpile of crushed greenish copper ore in a dusty processing yard, front-end loader bucket edge just visible |
| IG-44 | `copper-sulphide-sample.png` | A metallic brassy copper sulphide ore sample beside a folding hand lens on a geologist's table |
| IG-44 | `ore-truck-weighbridge.png` | A loaded tipper truck of ore standing on a concrete weighbridge, small weighbridge office in the background, red dirt road |
| IG-45 | `flotation-froth-cells.png` | Close view of thick grey-silver mineral froth overflowing the lip of a flotation cell into a launder |
| IG-45 | `copper-sulphide-concentrate.png` | A laboratory tray of dark grey-green copper sulphide concentrate powder, a sample label without text |
| IG-45 | `graphite-flakes-tray.png` | Shiny silver-grey graphite flakes spread thinly on a white sample tray, flakes of visibly different sizes |
| IG-45 | `concentrate-bags-store.png` | Stacked one-tonne bulk bags of mineral concentrate on pallets in a clean warehouse, no printing on the bags |
| IG-46 | `pegmatite-core-samples.png` | Pale pegmatite drill core laid out in wooden core trays in a covered core shed, coarse crystals visible |
| IG-46 | `spodumene-crystals.png` | A hand specimen of pale green-white spodumene crystals in pegmatite rock on a neutral background |
| IG-46 | `nickel-concentrate-sample.png` | A dish of fine bronze-grey nickel sulphide concentrate beside a folding hand lens on a laboratory bench |
| IG-46 | `ore-to-concentrate-scale.png` | A very large ore stockpile beside a much smaller neat pile of concentrate, showing the difference in scale, processing yard |
| IG-47 | `heavy-mineral-sand.png` | Dark streaks of black heavy mineral sand on a light-coloured beach, close to the ground |
| IG-47 | `gravity-spirals-plant.png` | A row of gravity spiral concentrators (helical fibreglass troughs) with sand slurry flowing down them in a wet plant |
| IG-47 | `drum-magnet-separator.png` | A drum magnetic separator with a band of black magnetic sand clinging to the rotating drum |
| IG-47 | `black-sand-magnet.png` | A hand magnet lifting black magnetite sand from a gold panning dish, a few tiny gold specks left in the pan |

After adding images, open the tool (`cd tools/social-carousel && npm run dev`, http://localhost:5180), check the crops on each slide, and confirm each caption's visual note still fits. Record provenance in the social sourcing docs, not in captions.

---

## 3. Kiswahili review

All new Kiswahili text carries `NOTE FOR REVIEW`. Phase 5 text had a first machine review (`docs/sw-review-grok-2026-10-07.json`; 18 of 20 suggestions applied). Everything still needs a review by a native Tanzanian Kiswahili speaker. Keep facts, numbers, links and section anchors (`id="…"`) unchanged, and keep each English and Kiswahili pair equivalent.

### New Kiswahili guides (body · metadata · route)

Metadata for all of these is in `src/data/article-library.ts` (`SWAHILI_ARTICLES`); FAQs are in `src/data/article-faqs.json` under `"sw"`.

| Kiswahili URL | Body file | English counterpart |
|---|---|---|
| `/insights-swahili/kinu-cha-dhahabu-pan-mill-au-ball-mill` | `src/content/sw/wet-pan-mill-vs-ball-mill.ts` | `/insights/wet-pan-mill-vs-ball-mill` · `src/content/insights/wet-pan-mill-vs-ball-mill.ts` |
| `/insights-swahili/ukubwa-wa-winchi-na-headframe` | `src/content/sw/mine-winch-headframe-sizing.ts` | `/insights/mine-winch-headframe-sizing` · `src/content/insights/mine-winch-headframe-sizing.ts` |
| `/insights-swahili/kutoa-maji-shimoni` | `src/content/sw/shaft-dewatering-staged-pumping.ts` | `/insights/shaft-dewatering-staged-pumping` · `src/content/insights/shaft-dewatering-staged-pumping.ts` |
| `/insights-swahili/kurejesha-maji-kwenye-mtambo` | `src/content/sw/water-recycling-gold-plant.ts` | `/insights/water-recycling-gold-plant` · `src/content/insights/water-recycling-gold-plant.ts` |
| `/insights-swahili/kuchakata-madini-ya-shaba` | `src/content/sw/copper-ore-processing-tanzania.ts` | `/insights/copper-ore-processing-tanzania` · `src/content/insights/copper-ore-processing-tanzania.ts` |
| `/insights-swahili/flotation-ya-graphite-na-shaba` | `src/content/sw/flotation-graphite-copper.ts` | `/insights/flotation-graphite-copper` · `src/content/insights/flotation-graphite-copper.ts` |
| `/insights-swahili/kuchakata-lithium-na-nickel` | `src/content/sw/lithium-nickel-processing-guide.ts` | `/insights/lithium-nickel-processing-guide` · `src/content/insights/lithium-nickel-processing-guide.ts` |
| `/insights-swahili/utenganishaji-wa-sumaku-au-gravity` | `src/content/sw/magnetic-vs-gravity-separation.ts` | `/insights/magnetic-vs-gravity-separation` · `src/content/insights/magnetic-vs-gravity-separation.ts` |

Each Kiswahili route is a three-line page in `src/app/insights-swahili/<slug>/page.tsx`.

### New Kiswahili tool page

| URL | File | English counterpart |
|---|---|---|
| `/insights-swahili/kikokotoo-cha-tanki-la-leaching` | `src/app/insights-swahili/kikokotoo-cha-tanki-la-leaching/page.tsx` (prose) and `src/components/tools/LeachTankCalculator.tsx` (`TEXT.sw` labels) | `/tools/leach-tank-calculator` · `src/app/tools/leach-tank-calculator/page.tsx` |

### Kiswahili equipment guide sections (shown on `/equipment-swahili/<slug>`)

Each file mirrors the English file of the same name in `src/content/equipment/`.

| File | Product page(s) |
|---|---|
| `src/content/equipment/sw/leaching-tank.ts` | leaching-tank |
| `src/content/equipment/sw/winch-selection.ts` | 1-ton-winch, 2-ton-winch, 5-ton-mine-winch |
| `src/content/equipment/sw/self-contained-self-rescuer.ts` | self-contained-self-rescuer |
| `src/content/equipment/sw/pneumatic-rock-drill.ts` | pneumatic-rock-drill |
| `src/content/equipment/sw/filter-press.ts` | filter-press |
| `src/content/equipment/sw/diesel-generator-mining.ts` | diesel-generator-mining |
| `src/content/equipment/sw/centrifugal-gold-concentrator.ts` | centrifugal-gold-concentrator (new section `batch-vs-continuous` only) |

### Kiswahili product data (`src/data/equipment-catalogue-sw.json`)

- **New products (full entries):** `flotation-cell`, `magnetic-separator`, `spiral-classifier`.
- **New `title` and `searchTerms` fields** on: `ball-mill-gold-ore`, `wet-pan-mill`, `hammer-mill`, `centrifugal-gold-concentrator`, `shaking-table-gold`, `leaching-tank`, `diesel-generator-mining`, `air-compressor-mining`, `submersible-dewatering-pump`.
- **Image captions:** the `sw` values for the three new products in `src/data/equipment-image-copy.json`.

### Other Kiswahili strings

- Equipment filters on `/equipment-swahili`: labels in `src/app/equipment-swahili/page.tsx` (`<EquipmentFilters labels={…}>`).
- New category name: `minerals` in `CATEGORY_LABELS_SW`, `src/data/equipment-catalogue-sw.ts`.
- Directory entry for the calculator: `src/data/swahili-directory.ts`.

---

## 4. English pages changed or added (for reference)

**New English guides:** `src/content/insights/` → `wet-pan-mill-vs-ball-mill`, `mine-winch-headframe-sizing`, `shaft-dewatering-staged-pumping`, `water-recycling-gold-plant`, `copper-ore-processing-tanzania`, `flotation-graphite-copper`, `lithium-nickel-processing-guide`, `magnetic-vs-gravity-separation` (metadata in `src/data/insights.ts`).

**English guides with new sections:** `gold-elution-plant-price`, `equipment-rental-tanzania`, `small-miner-financing`, `vat-leaching-tailings`, `underground-air-supply`, `gravity-vs-cyanide-gold-recovery`, `off-grid-mine-power`, `small-cip-plant-guide`.

**English equipment guide sections:** `src/content/equipment/` → `leaching-tank`, `winch-selection`, `self-contained-self-rescuer`, `pneumatic-rock-drill`, `filter-press`, `diesel-generator-mining`, plus a new section in `centrifugal-gold-concentrator`.

**New English products:** `flotation-cell`, `magnetic-separator`, `spiral-classifier` (in `src/data/equipment-extra.ts`).

---

## 5. Checks to run after changes

```bash
npx tsc --noEmit -p .
node scripts/audit-editorial.mjs
node scripts/audit-article-faqs.mjs
node scripts/audit-swahili-directory.mjs
node scripts/audit-equipment-images.mjs
npx next build
cd tools/social-carousel && npm run typecheck
```

All passed on 7 October 2026 before this handoff (46 English and 13 Kiswahili guides, 307 FAQ answers, 53 product images, 245 static pages).
