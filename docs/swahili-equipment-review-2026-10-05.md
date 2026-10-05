# Kiswahili equipment catalogue review

Reviewed locally on 5 October 2026. This pass implements the simplified approach in `docs/swahili-equipment-directory-plan.md`: copy the existing equipment format and write complete Kiswahili counterparts.

## Scope and reader outcome

The reader is choosing equipment for a Tanzanian mining or processing project. Each page explains the equipment's purpose, selection considerations, indicative specifications, applications, maintenance and remaining questions. The conclusion asks the reader to turn those considerations into a project specification before requesting a quotation.

`/equipments-swahili` lists all 50 products across the same eight categories as `/equipment`. Each product uses the same slug below the new directory. The hero, photographs, tables, explanatory sections, contents, related products and enquiry layout follow the English format.

The translated inventory contains:

| Material | Count |
| --- | ---: |
| Product pages | 50 |
| Categories | 8 |
| Specification rows | 531 |
| Application descriptions | 231 |
| Maintenance rows | 237 |
| Questions and answers | 190 |
| Extended guides | 4 |
| Extended guide sections | 16 |
| Existing local product photographs | 50 |

The extended guides cover elution/electrowinning, CIL/CIP, centrifugal concentrators and gold detectors. Their prose, tables, conceptual diagrams, captions and accessibility descriptions are translated. Section identities remain aligned with the English guides. English-only supporting articles are identified beside their links.

## Editorial treatment

The Kiswahili copy explains the meaning of the source rather than shortening it into disconnected phrases. Introductions establish the job and the selection problem; answers explain causes, consequences and the information needed for a decision. Familiar trade terms remain where helpful, with an explanation of their function.

Generic equipment ranges are qualified as comparisons to confirm against the selected model and site. Recovery, capacity, service-life and consumption examples must not be read as guarantees. Catalogue photos are described as reference images; process diagrams represent concepts, not construction drawings or completed customer projects. No new equipment prices have been added.

Copy lives in `src/data/equipment-catalogue-sw.json`. Its TypeScript adapter shares the original slugs, category identities, related-product identities and photograph references, and fails if a product translation is missing. Extended guides live in `src/content/equipment/sw/`.

The prose received an internal drafting and review pass. An independent fluent Kiswahili editor has not reviewed this revision. The technical terminology should be included in that editorial handoff under the site's standard.

## Corrections carried into both languages

The source review found several specific errors or overstatements. Corrections are reflected in both catalogues where applicable:

- A 500 kVA generator at power factor 0.8 and 75% load delivers 300 kW. At the example rate of 0.25–0.30 L/kWh, consumption is 75–90 L/h. Actual budgeting needs the selected model's fuel curve.
- Moving the same tonnage at 80% of the intended payload requires 25% more trips than at 100%. Fuel and tyre costs do not automatically rise by the same percentage.
- A tank-sizing example at 50 t/day, 45% solids by mass, ore density 2.7 t/m³, water density 1 t/m³ and 24 hours residence gives about 79.6 m³ working volume. Adding an illustrative 10% of working volume gives about 87.6 m³, or six tanks of about 14.6 m³. The guide's larger-throughput examples use the same basis. This is an arithmetic example; actual freeboard and geometry require design.
- Wheel-loader selection no longer treats a bucket-volume range as proof of a conflicting operating-load range. Tower-crane selection requires a load chart at the actual radius instead of claiming the maximum load is available at the jib tip.
- A connector's marked strength depends on its axis, gate condition and standard. The former universal “22 kN gate rating” statement has been removed.
- Gas-monitor calibration follows the manufacturer and instrument condition instead of a universal monthly interval. A failed bump test or calibration check must be resolved before reuse.
- Cyanide tank entry refers to an approved isolation, preparation, testing, entry and rescue procedure. The previous instruction to “neutralise” a tank without specifying a safe procedure has been removed; acids must not be mixed with cyanide residues.

The relevant sources are [OSHA's portable gas-monitor guidance](https://www.osha.gov/publications/shib093013), [Petzl's fall-clearance explanation](https://www.petzl.com/INT/en/Professional/How-and-why-use-a-fall-arrest-lanyard-?ActivityName=Energy-and-Networks), [Petzl's connector loading guidance](https://www.petzl.com/sfc/servlet.shepherd/version/download/0686800000YuI2zAAF), the [Cyanide Code and its scope](https://cyanidecode.org/the-cyanide-code/), and its [mining guidance](https://cyanidecode.org/wp-content/uploads/2025/03/15-Mining-Guidance-JUNE-2021.pdf). Licensing references point to the [Mining Commission's licence services](https://www.tumemadini.go.tz/pages/licenseservice/); they do not turn a generic product description into confirmation of legal eligibility.

This is a catalogue translation with selected factual corrections. It is not independent verification of every inherited equipment range, manufacturer specification, recovery estimate or field claim. The revision date records the content change, not certification of all 531 specification rows. Confirm model-specific figures and regulatory requirements when preparing an actual project quotation.

## Links and discovery

- The footer's “Vifaa vya uchimbaji” link opens `/equipments-swahili`. The main navigation keeps its existing entries.
- The legacy `/vifaa-vya-uchimbaji` overview permanently redirects to the new directory. Its six town pages retain their URLs and use Kiswahili product names and product destinations.
- The directory and all 50 products have reciprocal language links, their own canonicals and matching English/Kiswahili alternates. The ball-mill product pairs with its translated product rather than a pricing article.
- Product structured data uses the actual translated URL. FAQ content and language agree with the visible Kiswahili answers.
- The sitemap includes the directory and 50 products, keeps the six town URLs and excludes the redirected overview. `llms.txt` lists the complete Kiswahili catalogue.
- `/insights-swahili` remains the separate article collection.

## Validation

The production build generates 221 static pages, including the new directory and 50 product pages. TypeScript and the existing editorial audit pass. The article audit covers the existing 38 English and five Kiswahili articles; the equipment inventory and browser checks below cover the new catalogue separately.

The catalogue check confirms matching product identities, category order, row counts for every product, all 50 local photos, valid related-product destinations and all 16 shared guide section identities. Sitemap URLs are unique and include exactly 51 new Kiswahili catalogue routes.

HTTP checks cover all 50 English/Kiswahili product pairs, their canonicals and reciprocal alternates, product and FAQ structured data, all six town pages, the overview's 308 redirect and the unknown-product 404. Browser checks cover all 51 Kiswahili pages at 390 px and 1440 px, with no page overflow, missing contents anchors or JavaScript errors. Footer discovery is present and the directory has not been added to the main navigation.

Representative visual checks cover the directory, an excavator, ball mill, mining software and all four extended guides. Sixteen full-page screenshots were captured. The first pass found one clipped detector diagram label; it was split over two lines and its arrow moved clear of the text. Visual review also found that labels became too small when a whole diagram shrank to phone width. Both languages now use a focusable horizontal diagram container with a 720 px minimum diagram width, while captions keep their normal reading width. Final checks repeat the product-pair HTTP checks and representative mobile/desktop rendering against the final build, verify diagram text stays within its viewBox, and check scrolling by keyboard.

Browser request interception kept the visual checks local. The inherited remote stock image in the directory and live external services were excluded from those checks; the 50 local product photographs were checked separately.

All final checks passed, including 16 diagram-page checks across both languages and screen widths, keyboard scrolling, and the remaining directory links on the gold-price, generator-rental and contact pages.

Local validation scripts and screenshots are stored in `/private/tmp/bart-equipment-sw/`; they are temporary review artifacts and are not imported by the site. No commit, push or deployment was made in this pass.
