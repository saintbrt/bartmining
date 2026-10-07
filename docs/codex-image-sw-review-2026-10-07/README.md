# Image and Kiswahili review — 7 October 2026

This completes the image generation and editorial pass requested in [the handoff](../codex-handoff-2026-10-07.md). Work remains local and uncommitted. Native Tanzanian Kiswahili approval and the existing technical sign-off remain pending.

## Images

All 31 requested assets were created with the **built-in image_gen tool**. No customer, staff, site or equipment photographs were used. The images depict generic equipment classes, samples and settings; they do not identify a stocked model, actual installation, sampled deposit or named project.

The three catalogue replacements are:

| Product | Website asset | Reviewed master |
| --- | --- | --- |
| Flotation cell | [flotation-cell.webp](../../public/equipment/website/flotation-cell.webp) | [Master](flotation-cell-master.png) |
| Magnetic separator | [magnetic-separator.webp](../../public/equipment/website/magnetic-separator.webp) | [Master](magnetic-separator-master.png) |
| Spiral classifier | [spiral-classifier.webp](../../public/equipment/website/spiral-classifier.webp) | [Master](spiral-classifier-master.png) |

Each master is 1448 × 1086. `scripts/prepare-equipment-image.mjs` encoded the full composition as WebP without enlargement. The original SVG schematics remain in `docs/equipment-image-sources-2026-10-07/`. The three existing prompt records now retain the schematic descriptions as `previousPrompt` and identify the actual generation tool and revision.

The 28 social images are saved under the **exact descriptive filenames from the handoff** in [tools/social-carousel/images](../../tools/social-carousel/images/). Each is 1122 × 1402, meeting the minimum portrait resolution. IG-41–IG-47 each use four new content images and the existing shared closing slide.

- [All 35 rendered slides](social-slides-contact-sheet.jpg): rows IG-41 through IG-47; columns follow slide order.
- [Catalogue hero previews](equipment-contact-sheet.jpg).
- [Complete original prompts](generation-prompts.json), with targeted revision prompts under `results/`.
- [Selected assets, final prompts, dimensions and checksums](asset-register.json).
- Social provenance is also recorded in [sources.json](../../tools/social-carousel/images/sources.json).

Two initial social outputs were revised: the mills now stand independently with a visible aisle, and the planning notebook is blank rather than showing invented numerical calculations. The pump illustrations show pumps partly immersed, and the magnet scene uses a support rather than an invented person's hand. Their image descriptions match the selected outputs. Public captions retain the existing generic-visual note and contain no production-method labels.

Catalogue geometry was compared with these manufacturer references, consulted for visual arrangement rather than copied as image assets:

- [Metso RCS flotation cells](https://www.metso.com/portfolio/rcs-series/?r=3): mechanical cells, overhead agitation and froth collection.
- [Eriez wet drum separators](https://www.eriez.com/Products/Magnetic-Separation/Magnetic-Processing-Concentration/Magnetic-Separation-Solutions-for-Wet-Minerals-Processing/Wet-Drum-Separators): horizontal drum and slurry tank arrangement.
- [Sepor spiral classifier](https://sepor.com/product/spiral-classifier/): inclined trough, screw, settling pool, lower fine overflow and upper coarse discharge.
- [Multotec spiral concentrators](https://www.multotec.com/en/spiral-concentrator1): stationary helical gravity channels, distinct from a screw classifier.
- The existing reviewed parallel-drive winch illustration supplied the winch reference.

The two new guide covers initially cropped equipment drives in the shared wide cover window. `ArticleLayout` now contains catalogue illustrations identified in the imagery manifest, preserving the whole machine. This currently affects only the flotation and magnetic-separation guides and their Kiswahili counterparts. The paired pages continue to share one layout. Product cards and heroes already contained the full machine.

## Kiswahili coverage

Compared the eight new guide bodies with their English counterparts, including the worked examples, scope limits, conclusions and next steps. Reviewed their eight metadata entries and all 24 corresponding FAQ answers. Edited all seven requested equipment section files, restricting the centrifugal concentrator review to `batch-vs-continuous`.

Also reviewed the calculator prose and `TEXT.sw`, the three complete new product entries, the nine existing product titles/search terms, three equipment captions, filter labels, `minerals` category name and calculator directory entry. The nine title/search-term sets, filter labels, category name and directory entry were retained after review.

Corrections include:

- Clay as `udongo wa mfinyanzi`, and a distinction between returned clarified process water and new water from the source.
- Repairing a mill rather than manufacturing it; diesel engine versus electric motor; grind size needed for liberation.
- Wire-rope, sheave, headframe, sump, pump-head and flotation-reagent explanations.
- Tank protective lining and seals, an emergency refuge chamber, and filter cake.
- Drilling intervals rather than general excavation; elements causing price deductions rather than “punishment” terminology.
- Magnetic attraction rather than describing minerals as magnets.
- Calculator division by operating hours, relative mineral density, planning volume allowance and freeboard.
- Torque in the winch FAQ, and classifier alt text that no longer claims a ball mill is visible.

[Language change inventory](language-changes.json) records the main edit scope; [preservation checks](preservation-check.json) compare source files with the pre-edit handoff snapshot. Numerical values, formulas, links and section anchors were retained. Calculator logic and unrelated JSON entries were retained. English guide bodies were retained; only the four requested English cover descriptions changed.

This is an editorial and translation comparison, **not native-speaker approval**. All `NOTE FOR REVIEW` comments remain. A native Tanzanian editor should check technical vocabulary and idiom before publication.

## Remaining content sign-off

The handoff requested unchanged numerical facts. This pass therefore does not establish fresh factual or engineering approval of inherited claims. The reviewer should resolve these before publishing:

- The English graphite guide describes carbon grades in the mid-90s; its existing Kiswahili sentence says `asilimia 90 na zaidi`, a broader claim. The numerical wording was retained for the requested fact-preserving review.
- Mill capacity and the 10–15 t/day comparison depend on the ore and models tested.
- The 80 m pumping threshold, per-stage head limits and maintenance intervals depend on the pump and site. Staging alone does not guarantee flood isolation; protection and interlocks matter. Stopping pumps to measure inflow requires the site's approved procedure.
- Hoist safety factors, sheave ratios and personnel-hoisting requirements need a competent engineering review against applicable requirements.
- Gold can be trapped in magnetic aggregates; IG-47's short copy should be reviewed alongside the fuller guide qualification. Mineral colours and illustrative pile sizes do not establish assay grades or a measured mass ratio.

## Validation

Required TypeScript, editorial, FAQ, directory and equipment-image audits passed, as did the Next.js production build and carousel typecheck/build. Inventories: 46 English guides, 13 Kiswahili guides, 307 FAQ answers, 29 directory entries and 53 product images; 245 static pages generated.

The production build logged unavailable live gold-price/exchange-rate hosts in this restricted environment and completed using the application's existing fallback. Those integrations were outside this review.

[Carousel checks](carousel-check.json) cover all 35 slides, with no missing-image, upscale or headline warnings. Five IG-47 slides were downloaded through the actual export flow at 1080 × 1350; copies are under `exports/`.

[Website checks](website-check.json) record desktop/mobile route, image, caption, anchor and calculator checks. Screenshots are under `website/`. No commit, push or deployment was performed.
