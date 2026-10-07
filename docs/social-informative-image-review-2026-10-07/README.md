# Informative carousel image review — 7 October 2026

The **Informative content · October 2026** folder contains IG-26 through IG-40:
seven explainers and eight equipment posts. All 50 content slides have images;
the 15 closing slides retain the shared CTA design. Posts remain in review.

## Review sheets

- [All 15 covers](covers-review.jpg)
- [New raster assets](raw-assets-review.jpg)
- Explainers: [IG-26](IG-26-review.jpg), [IG-27](IG-27-review.jpg), [IG-28](IG-28-review.jpg), [IG-29](IG-29-review.jpg), [IG-30](IG-30-review.jpg), [IG-31](IG-31-review.jpg), [IG-32](IG-32-review.jpg).
- Equipment: [IG-33](IG-33-review.jpg), [IG-34](IG-34-review.jpg), [IG-35](IG-35-review.jpg), [IG-36](IG-36-review.jpg), [IG-37](IG-37-review.jpg), [IG-38](IG-38-review.jpg), [IG-39](IG-39-review.jpg), [IG-40](IG-40-review.jpg).
- [Slide assignments](assignments.json) and [browser measurements](measurements.json).

## Asset basis

Thirty-one new raster illustrations were created with the built-in image tool
and saved to `tools/social-carousel/images/`. Their full prompt set is in
[generation-prompts.json](generation-prompts.json), with individual production
records in `results/`. Wet-pan, winch and gas-test scenes use the existing
catalogue illustrations as explicit mechanical references.

Five original code-rendered diagrams explain test comparisons, load lists,
the used-equipment budget, rental versus ownership and staged dewatering.
Numeric examples come from the published guide bodies and remain explicitly
illustrative. The editable SVGs and [rendering script](render-diagrams.cjs)
are retained here. They are teaching diagrams, not installation designs.

Six existing high-resolution catalogue illustrations replace undersized legacy
assets. Their original prompts and production records are linked in
[catalogue-provenance.json](catalogue-provenance.json). Numbered copies now live
in the social image library; the originals in `public/equipment/website/`
retain their names. Other reused illustrations retain their prior source records.

The 50 content assets use category, topic and slide number, for example
`explainer-ore-1.png` and `product-wetmill-2.png`. Downloads use the same stem
and `.png`. The [filename register](../../tools/social-carousel/images/file-names.json)
maps every current name to its original file and post. Shared illustrations
have a separate copy for each post so they can be managed independently.

The Geevor ball-mill photograph used in IG-29 is by Nilfanion, under CC BY-SA
3.0. Its source, cropping, text overlay and resulting slide licence are credited
in that post’s caption. The asset already exists in the reviewed social library.

New social assets have descriptions, dimensions and assignments in
`tools/social-carousel/images/sources.json`. Public descriptions discuss their
visible subjects; production methods remain in internal records. No image
claims to document a customer installation, stocked model, measured assay or
specific quotation. Blank instruments and sample labels avoid inventing
readings, certificates or grades.

## Technical references and targeted copy corrections

Online sources were used to check concepts and mechanical arrangements.
Their photographs were not copied into the library.

| Subject | Primary reference | Review decision |
| --- | --- | --- |
| Bottle-roll testing | [SGS leaching tests](https://www.sgs.com/en-pe/showcases/metallurgical-testing/leaching-tests) | Show capped slurry bottles resting horizontally on a roller rack. |
| Assay samples | [SGS fire assay](https://www.sgs.com/en-us/services/fire-assay-analysis) and [ALS sample submission](https://www.alsglobal.com/de-ch/geochemistry/sample-preparation/sample-submission) | Crucibles, cupels and separate sample containers illustrate the method without invented results. |
| Shaking tables | [Holman Wilfley](https://www.holmanwilfley.co.uk/product/holman-shaking-tables/) | Show a riffled deck, supported drive, feed and water supply; qualify desliming and throughput rather than promise recovery. |
| CIL and CIP | [Multotec interstage screening](https://www.multotec.com/en/knowledgehub-content/what-is-an-interstage-screen) | Distinguish combined leaching/adsorption from adsorption after leaching; remove a universal tank-count rule. |
| Dewatering | [Xylem stage dewatering](https://prod.xylem.com/nl-nl/applications/face-stage-dewatering/) and [high-head pump](https://www.xylem.com/en-us/products--services/pumps-packaged-pump-systems/pumps/submersible-pumps/submersible-dewatering-pumps/flygt-2000-series/flygt-2450/) | Size against flow and total head; an 80 m staging threshold is not universal. Diagram has no depths or capacities. |
| Winches | [Thern winches](https://thern.com/en-GB/winches/) and the project’s parallel-drive reference | Preserve offset parallel motor/drum shafts and side transmission. Remove the assumption that nominal line pull alone defines hoisting suitability or a shaft-depth range. Braking still needs installation-specific engineering review. |
| Compressed air | [Atlas Copco sizing](https://www.atlascopco.com/en-us/compressors/wiki/compressed-air-articles/sizing-an-air-compressor) and [leak losses](https://www.atlascopco.com/en-uk/compressors/air-compressor-blog/challenger/quantity) | Match pressure, simultaneous tool demand and duty cycles; no universal four-drill compressor size. |
| Gas testing | [Dräger test guidance](https://www.draeger.com/en_uk/Productfinder/Portable-Gas-Detection/Calibration-and-Bump-Testing) and [sensor specifications](https://www.draeger.com/Content/Documents/Products/X-am-5800-pi-100941-en-MASTER.pdf) | Show a cap covering the sensor inlet cluster, tubing and regulated cylinder. Qualify sensor life by model and exposure instead of a universal 2–3 year rule. |
| Gravity feed size | [FLSmidth Knelson specification](https://www.flsmidth.com/-/media/brochures/brochures-products/precious-metals-recovery/knelson-concentrator-qs48-spec-sheet.pdf) | The cited model recommends 2 mm but allows a larger maximum feed size. Remove the claim that centrifugal concentrators cannot accept anything above 2 mm. |

Public financial example bases: `plant-test-work-guide`,
`assay-laboratory-tanzania`, `vat-leaching-tailings`,
`used-mining-equipment-tanzania`, `off-grid-mine-power`,
`gold-elution-plant-price` and `equipment-rental-tanzania` in
`src/content/insights/`. No private planner files were used.

## Validation and limits

The carousel TypeScript check and production build passed. Local Chrome
rendered all 65 slides with loaded, sufficiently large images, headlines within
three lines, text inside the canvas and no overlap between product-card photos
and their text. Portrait product assets use a top-aligned crop to preserve
their visible components. Fonts and the existing shared layout were retained.

The tool successfully downloaded an explainer cover and a product detail slide
as native 1080 × 1350 PNGs. See [export-check.json](export-check.json) and
the two files in [exports/](exports/).

After the filename change, all 102 news and informative slides passed browser
checks and the tool build passed. All 80 numbered assets match their original
byte checksums. [Filename checks](filename-check.json) verified old-name
resolution, preservation of saved text and crops, rejection of stale content
edits, and three sequential `product-wetmill` PNG downloads including the CTA.
Earlier posts and website files retain their original naming.

This is an imagery and formatting pass with the targeted corrections above,
not a complete engineering or factual approval. Model-specific capacities,
inspection schedules, quotations and hoisting requirements still need the
responsible technical reviewer’s sign-off before posting. All 15 posts remain
in review; nothing was deployed or published.

To rerender the diagrams, run
`node docs/social-informative-image-review-2026-10-07/render-diagrams.cjs`.
With the local carousel tool on port 5180, reproduce browser measurements with
`node docs/social-informative-image-review-2026-10-07/check-layout.cjs`.
