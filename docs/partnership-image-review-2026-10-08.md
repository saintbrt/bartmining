# Partnerships image review — 8 October 2026

Internal production record. The user approved the mobile-crusher hero, requested a second image from the gravity social post in tools, and requested a Git push. The page now uses both local image paths. The external artifact was not edited.

| Asset | Export | Native source | Export processing |
| --- | --- | --- | --- |
| `public/partnerships/hero.jpg` | 3072 × 2048, JPEG, approximately 3:2 | 1536 × 1024 | Upscaled with sips; JPEG quality 95 |
| `public/partnerships/proof.jpg` | 1122 × 1402, JPEG, approximately 4:5 | 1122 × 1402 | Existing gravity-post asset; JPEG quality 95, no resizing |

Used the built-in image_gen tool. Exact generation and correction prompts are in [the prompt record](partnership-image-prompts-2026-10-08.json). Original PNGs remain in the tool's generated_images directory.

The current proof image is reused directly from `tools/social-carousel/images/gravity-spirals-plant.png`, the gravity slide of IG-47, “Gravity and Magnets for Mineral Sands and Gold Concentrates”. Its original provenance and review are in `tools/social-carousel/images/sources.json`. It is an existing generated equipment illustration, not a sourced photograph of an actual Bart Mining installation. No new generation or retouching was performed for the replacement. The source has stationary helical troughs around supported vertical columns, top feed pipes and lower collection launders. Equipment fills the upper image; lower launders remain suitable behind the quote card. Both page images use Next Image quality 85. Proof uses a centred crop within the existing 3:4 frame. Public alt text describes the visible mineral-separation equipment.

Compared the selected spiral image's visible arrangement with [Multotec's mineral spiral concentrator reference](https://www.multotec.com/en/mineral-spiral-concentrators): supported helical troughs, feed piping and collection launders are present. This is a check of the equipment class, not certification of the illustrated plumbing or an exact machine model.

## Mechanical and visual review

The user subsequently clarified that the approved hero was the original mobile-crusher stock photograph, rather than the earlier plant rendering. The current hero was regenerated using [that photograph](https://images.pexels.com/photos/17320062/pexels-photo-17320062.jpeg?auto=compress&cs=tinysrgb&w=2400) as the edit reference. Compared the two images: the yellow tracked crusher, central radiator housing, right-hand hopper, supported discharge belt extending up-left to the stockpile, crawler undercarriage, atmospheric dust, tree line and open lower-right foreground remain in the same arrangement. Reviewed the belt, rollers, guards and track components against the supplied photograph. Surface textures are sharper, with small differences typical of regeneration; this is not a pixel-identical restoration. The approximately 3:2 composition follows the approved photograph. Native output is 1536 × 1024; the 3072 × 2048 export is upscaled, despite requesting higher native resolution. Proof image and page data were verified unchanged by SHA-256.

The following plant-hero review is historical and describes the superseded asset; its source and prompts remain recorded in the prompt record.

Compared the hero against Mt Baker Mining and Metals' [jaw crusher](https://mbmmllc.com/products/jaw-crushers/) and [ball mill](https://mbmmllc.com/products/ball-mills/) references, including their product photographs. The final hero has a short crusher discharge above one continuous inclined conveyor, with crushed ore visibly received by the belt. The conveyor's head chute enters the mill at the axial feed end. The mill is horizontal with bearing supports and a plausible offset motor/transmission/girth-gear arrangement. The crusher motor sits beside its flywheel with a perforated guard over the belt run. Conveyor idlers, return run, tail pulley and structural legs are visible. Earlier variants with a ground discharge, disconnected chute and extra belt were rejected.

Historical review of the superseded engineer/concentrator proof image: compared that scene with the [FLS centrifugal concentrator reference](https://fls.com/en/equipment/precious-metal-recovery/gravity-concentration), including the manufacturer's cutaway showing central feed, vertical bowl axis, support legs and drive below the bowl. That generic concentrator had top feed, an enclosed vertical housing, bolted support frame, pipe connections, a base motor and guarded drive, and a separate control cabinet. The three people were engaged with the controls, wore hard hats, and remained clear of the drive. The user subsequently requested the existing gravity-post equipment image instead.

This is a visual plausibility check of visible components, not verification of hidden internals or an engineered plant design. The scenes do not document an actual Bart Mining installation, employee, client or exact supplied model.

The current hero retains the original quarry daylight and open lower-right ground. The current proof shows equipment and collection launders, with natural daylight and space below the main spiral troughs for the card. No production-method labels were added to the site.

## Validation and handoff

Confirmed both files decode as JPEG and have the recorded export dimensions. The hero follows the original mobile-crusher photograph's approximately 3:2 composition and was upscaled. The proof preserves its existing native dimensions and approximately 4:5 composition; the page applies a centred crop in its 3:4 frame.

`src/data/partnership.ts` now references `/partnerships/hero.jpg` and `/partnerships/proof.jpg`. Desktop and phone crops and the production build are checked before the user-requested Git push. The linked Claude artifact could not be read through the web tool and was not edited.

Validation completed: production build including lint and TypeScript passed; editorial inventory and FAQ audits passed; Git whitespace check passed. The production build used existing fallback behaviour where the sandbox could not resolve external gold-price and exchange-rate APIs.

Browser checked at 1440px and 390px: both optimised local images loaded at quality 85, centred cover crops were retained, both overlay cards stayed inside the viewport, no horizontal overflow and no page errors. The proof quote card intentionally overlaps the image's lower-right edge, following the shared founder-image style. Screenshots and measurements are in [the browser review folder](partnership-image-review-2026-10-08/browser-check.json). Unrelated external tracking requests were blocked for the final local crop checks.
