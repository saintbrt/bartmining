# Social Carousel Review — 2026-10-02

All 16 posts are written and marked `review`. This is a content and media review, not factual or publication approval.

## Browser and Export Checks

Every one of the 69 slides was opened in the local tool with Sora and Manrope loaded. Final measurements show no missing image references, no headline over three lines, no text overlapping a light-card photo frame, and no image-upscale warnings at the tool’s current thresholds. Intentionally text-only light cards are supported and no longer trigger false missing-image warnings. Statistic boxes now have a dark backing so white figures remain visible over bright equipment photos.

The production build passes. PNG exports were checked on dark, light-card, map and sourced-photo slides at the required 1080 × 1350 size. Contact sheets below are visual review previews, not publishing exports. Measurements are recorded in `measurements.json` and source sizes in `image-inventory.json`.

## Visual Review Sheets

- [Review sheet 1](social-review-2026-10-02/review-1.jpg)
- [Review sheet 2](social-review-2026-10-02/review-2.jpg)
- [Review sheet 3](social-review-2026-10-02/review-3.jpg)
- [Review sheet 4](social-review-2026-10-02/review-4.jpg)

## Per-Post Audit

| Post | Slides | Layout checks | Remaining review or limitation |
|------|--------|---------------|--------------------------------|
| IG-11 · Alluvial Gold Processing During the Rains | 7 | Pass | The missing cover now uses the existing scrubber photograph as an equipment illustration. It is not a wet-site photo; the original sourcing note is retained. Bartholomew must confirm the model-specific feed limit and resolve the source recovery-range discrepancy. |
| IG-07 · Meet Allan Bartholomew | 4 | Pass | Only the approved Allan portrait is used. Role wording is limited to authors.ts. |
| IG-05 · Centrifugal Gold Concentrators | 1 | Pass | Existing concentrator image fits the light-card frame without enlargement. Model suitability and image usage rights still need confirmation. |
| IG-03 · When Is Gravity Recovery Enough? | 6 | Pass | Technical comparison retains the source’s particle-size qualification. Equipment photos need provenance verification. |
| IG-12 · Equipment Delivery to the Lake Zone | 5 | Pass | Created a 4000 × 3350 dispatch-location map from the website data. No route lengths, exact road paths or delivery guarantees are shown. Allan must confirm delivery and insurance terms. |
| IG-10 · Gold Plant Costs in Tanzania | 6 | Pass | Ranges retain capacity and equipment-only qualifications. Allan must approve the cost figures and exclusions. |
| IG-08 · Meet Bartholomew Ambrose | 5 | Pass | Added licensed core-storage stock photography; the caption states that it is not from Bartholomew’s projects. Team facts are limited to authors.ts. |
| IG-02 · CIL, CIP and Heap Leaching | 6 | Pass | Resolved missing CIL image using the website asset, then changed that slide to light-card to avoid a 1.4× full-bleed enlargement. The website render needs provenance and technical confirmation. |
| IG-09 · Mercury-Free Gold Recovery | 6 | Pass | Retains the free-gold qualification and avoids a general recovery guarantee. Existing equipment photos need provenance verification. |
| IG-06 · Modular Gold Plants | 5 | Pass | Resolved missing configuration image using the website CIL asset. Existing plant renders need provenance verification. |
| IG-13 · Ball Mills | 3 | Pass | Replaced the small, watermarked image with a 4112 × 2848 licensed historical ball-mill photo. Caption identifies the historical example, author, source, crop and share-alike license. |
| IG-14 · Jaw Crushers | 3 | Pass | Existing 1536 × 1024 jaw-crusher photo fits the light-card frame. A 4K replacement and usage-rights evidence are still preferable. |
| IG-15 · Cone Crushers | 3 | Pass | Replaced the 511 × 603 image with a licensed 1813 × 1664 cone-crusher photo. Its adjusted crop fits without enlargement and keeps the large dealer sign outside the frame. It remains below 4K and shows a manufacturer-specific model. Caption makes clear that the pictured model is not a supply offer. |
| IG-16 · Hammer Mills | 3 | Pass | Existing 1920 × 1920 hammer-mill photo fits without enlargement. Product identification and usage-rights evidence remain to be confirmed. |
| IG-17 · Vibrating Screens | 3 | Pass | Replaced the soft image with a 4896 × 3264 licensed portable wet-screening photo. Caption identifies it as an example. Bartholomew should confirm it is the preferred illustration for the general screen post. |
| IG-18 · Slurry Pumps | 3 | Pass | Existing 750 × 562 pump photo enlarges by about 1.28×, below the tool’s 1.5× light-card limit. A sharper source remains desirable; the 4K candidate was rejected for its prominent watermark. |

## Image Sources and License Records

New library assets retain their original resolution; no artificial 4K enlargement was used. Attribution-required photos include credits, source URLs, license URLs and crop notices in their post captions. For the two CC BY-SA photos, the affected photo slide is explicitly shared under the same license. Keep those credits with the published post.

- `ball-mill-geevor.jpg`: 4112 × 2848; CC BY-SA 3.0; Nilfanion. Source: [https://commons.wikimedia.org/wiki/File:Geevor_Mine_13.jpg](https://commons.wikimedia.org/wiki/File:Geevor_Mine_13.jpg).
- `cone-crusher-hp400.jpg`: 1813 × 1664; CC BY-SA 3.0; Zachary Scheidler. Source: [https://commons.wikimedia.org/wiki/File:Nordberg_HP400_Cone_Crusher.jpg](https://commons.wikimedia.org/wiki/File:Nordberg_HP400_Cone_Crusher.jpg).
- `vibrating-screen-stock.jpg`: 4896 × 3264; CC BY 2.0; Peter Craven. Source: [https://commons.wikimedia.org/wiki/File:MSU_10_being_lifted_by_skip_lorry_at_CDE_factory_(7368236992).jpg](https://commons.wikimedia.org/wiki/File:MSU_10_being_lifted_by_skip_lorry_at_CDE_factory_(7368236992).jpg).
- `exploration-core-trays.jpg`: 3648 × 2736; CC BY 2.0; Phil Whitehouse from London, United Kingdom. Source: [https://commons.wikimedia.org/wiki/File:Core_samples_(3843897410).jpg](https://commons.wikimedia.org/wiki/File:Core_samples_(3843897410).jpg).
- `quarry-crusher-context.jpg`: 6048 × 4024; Pexels License; marcin studio. Source: [https://www.pexels.com/photo/dust-around-crusher-machine-17320062/](https://www.pexels.com/photo/dust-around-crusher-machine-17320062/).
- `lake-zone-route-map.png`: 4000 × 3350; Project-created vector graphic; Bart Mining carousel project. Source: `src/data/delivery-routes.ts`.

The optional Pexels quarry image is available in the dropdown but is not assigned as a specific crusher model. Unsplash and Pexels searches did not yield suitable openly downloadable images for every specialist machine; general industrial images were not substituted for exact equipment types.

## Open Issues Before Publication

1. The retained website equipment assets have no license records in this repository. Their presence on the website does not establish permission for social reuse. Confirm their origins and usage rights or replace them before publishing. They are identified in the image inventory; newly sourced images have records in `tools/social-carousel/images/sources.json`.
2. Not every selected image is 4K or portrait. The cone, jaw, hammer mill and slurry pump are exceptions; their final card rendering clears the current size thresholds. The rainy-season cover is a workshop equipment illustration rather than a rainy-site scene.
3. Allan and Bartholomew still need to approve the facts, equipment illustrations and commercial terms. In particular, IG-11’s source discrepancy and IG-12’s policy wording remain open.
4. Captions say “link in bio”. The publishing team must make sure the corresponding guide is actually available from the bio before each post goes live.
5. The delivery map is a dispatch-location graphic rather than a road-route map. It intentionally omits unconfirmed travel times and paths.
