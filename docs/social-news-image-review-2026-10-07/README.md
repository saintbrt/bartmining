# News carousel image review — 7 October 2026

IG-19 through IG-25 have 30 content slides and seven shared closing slides.
All content images resolve; the existing shared CTA design is retained.
The posts remain in **review** and have not been published.

The 30 content assets now use category, topic and slide number, for example
`news-gold-1.png` and `news-kenya-2.png`. PNG downloads use the same stem.
The [filename register](../../tools/social-carousel/images/file-names.json)
maps each numbered file to its original name and post. Shared content images
have a separate editable copy for each post.

## Review the visuals

- [Seven covers](covers-review.jpg)
- Complete slide strips: [IG-19](IG-19-review.jpg), [IG-20](IG-20-review.jpg), [IG-21](IG-21-review.jpg), [IG-22](IG-22-review.jpg), [IG-23](IG-23-review.jpg), [IG-24](IG-24-review.jpg), [IG-25](IG-25-review.jpg).
- [Slide assignments and descriptions](assignments.json)
- [Browser measurements](measurements.json)

Thirteen portrait raster assets were created with the built-in image generation
tool. The prompt set is in [cover prompts](generation-prompts.json),
[support prompts](support-prompts.json) and [mineral prompts](mineral-prompts.json).
Final assets live in `tools/social-carousel/images/`; the shared internal
provenance register is `tools/social-carousel/images/sources.json`.

The images illustrate generic gold handling, mineral samples, survey tools,
processing equipment and project planning. They contain no people, official
documents, project branding, readable assay values or market charts. They do
not establish mineral grades, equipment specifications or the condition of
the named projects. Mechanical arrangements were visually inspected for
plausibility; they are not engineering drawings.

Two code-rendered explanatory visuals accompany the raster assets. The map
marks regional centres, not the locations of the 65 licence areas. It uses a
historical geoBoundaries / OpenStreetMap country outline and intentionally
omits regional borders. Its actual metadata identifies ODbL 1.0, rather than
assuming the dataset's general CC BY description. The source snapshot and
attribution are retained here and credited on the image and in the caption.
The CSR graphic explicitly describes the **former**, invalidated 40/60 split;
it does not invent a replacement allocation rule. Editable SVGs and the
rendering script are included in this folder.

Two existing stock photos are reused for IG-21: MART PRODUCTION's mineral
specimens and Yena Kwon's geological study desk, both under the Pexels License.
Other reused processing illustrations have existing provenance entries.
Public descriptions follow `docs/editorial-standard.md`; production methods
are kept in internal records.

## Online reference search

These sources informed subject selection and plausibility. Their images were
**not downloaded or reproduced**; search visibility does not grant reuse rights.

| Post | Reference | Design decision |
| --- | --- | --- |
| IG-19 | [Bullion imagery](https://www.coindesk.com/markets/2023/04/04/tokenized-gold-surpasses-1b-in-market-cap-as-gold-price-nears-all-time-high) | Plain bullion and weighing bench; no invented trading screen. |
| IG-20 | [Kenyan refining apparatus](https://www.aqs.co.ke/services/gold-analysis/gold-refining) | Supported crucible and mould; no claimed photo of the announced refineries. |
| IG-21 | [Minerals Ministry field activity](https://www.madini.go.tz/page/11276396-776e-4213-ad4c-ff94821aaad5/) | Survey and sampling equipment rather than a fabricated youth event. |
| IG-22 | [Mwanza refinery's cast bars](https://www.mpmrcl.com/news15.html) | Rough doré distinct from polished bullion; no official stamps. |
| IG-23 | [Tanzanian High Court reference](https://www.thecitizen.co.tz/tanzania/news/national/who-s-the-next-chief-justice-of-tanzania--4276624) and [ruling explanation](https://fbattorneys.co.tz/court-nullifies-csr-regulations-on-funds-allocation/) | Conceptual legal review desk and a former-allocation diagram; no invented courthouse or court seal. |
| IG-24 | [Ugandan miners' organisation](https://ugaasm.com/news/) | Panning kit, registration preparation and shared equipment rather than invented cooperative members. |
| IG-25 | [Lifezone core samples](https://ir.lifezonemetals.com/news/press-releases/news-details/2023/Lifezone-Metals-Reports-Completion-of-Tembo-Zone-Infill-Drilling-at-the-Kabanga-Nickel-Project-with-41-m-Intersect-at-2.07-Ni-including-16.4-m-at-2.77-Ni/default.aspx) | Generic sulphide-bearing core, graphite specimens and a conceptual process hall; no claimed Kabanga construction photograph. |

## Validation and remaining editorial work

The carousel production build includes TypeScript checking. Browser review
checks image loading and dimensions, the three-line headline limit and text
bounds, and captures all 37 slides. Headlines were shortened with displaced
facts retained in supporting copy. The images are large enough for the
1080 × 1350 canvas, and the tool reports no layout/image issues for these posts.

This pass checks imagery and formatting. It does not certify the inherited
news figures or legal claims. The source verification and author sign-off
already required in the post notes remain outstanding, including the daily
gold price, the export-ban effective date, the youth application details,
production figures, legal wording and project investment timing.

Reproduce the diagram assets with `node docs/social-news-image-review-2026-10-07/render-diagrams.cjs`.
With the local tool running on port 5180, reproduce the browser review with
`node docs/social-news-image-review-2026-10-07/check-layout.cjs` (requires local Chrome).
