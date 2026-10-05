# Editorial review — 5 October 2026

## Scope and outcome

The article library contains 38 English insights and five standalone Kiswahili guides. All 43 bodies have been read and revised against the editorial standard. The two substantial English cost guides and their Kiswahili counterparts retain the shared Chunya proposal examples and operating calculations. The other 36 English guides and three Kiswahili guides have been rewritten with context, connected explanation, a usable example or work sequence, a topic-specific conclusion and a source-basis section.

This review covers the article library. Product pages, regional landing pages, live tools and social posts have separate purposes and are not counted among these 43 articles.

## Collections and reading experience

- `/insights` lists only the 38 English articles.
- `/insights-swahili` lists only the five Kiswahili guides. It is linked from the footer and is absent from the main navigation.
- Both collections offer search, topic filters, summaries, images, revision dates and reading times. Existing article URLs remain valid.
- Both languages use `ArticleLayout` for the hero, cover caption, byline, contents, reading width, tables, related reading and relevant contact action.
- Kiswahili guide breadcrumbs lead back to the Kiswahili collection. Only genuine translated counterparts declare reciprocal language links and alternates.
- Sitemap and `llms.txt` use the same inventories, including the separate Kiswahili collection.

## Content corrections

Titles and summaries now describe the actual decision each article helps with. Openings establish context before technical detail. Conclusions resolve the opening question before the contact block. Reading times are calculated from the rendered bodies, including shared table values.

Unsupported statistics, generic recovery promises, unqualified loan claims, blanket import-duty exemptions and invented project or professional credentials were removed from article bodies. Equipment comparisons now account for scope, duty and total cost. Processing articles distinguish test results from assumed examples; country guides distinguish regional geological context from evidence about a particular property.

The Kenya guide corrects the inherited suggestion that Kwale is still producing: the USGS country report records the end of mining in December 2024. Historical geological and production references elsewhere are identified by date and are not presented as current ownership or output.

The PML guide now follows current Mining Commission application guidance rather than an invented application recipe. The gold-sales and Kiswahili royalty guides distinguish published authority guidance, dated Bank of Tanzania purchase terms and explicitly assumed arithmetic. They do not imply that a worked deduction table is a complete current tax determination for every transaction.

Covers use existing local catalogue assets with honest equipment-reference captions. They do not claim to show a completed customer project or a country-specific installation. The cost guides also include process explanations, comparison tables and equipment figures.

## Cost basis and boundaries

The public snapshot in `src/data/plant-cost-examples.ts` contains authorised client-facing scope and prices from the Chunya proposals dated 3 and 5 October 2026. Supplier costs, commissions, margins, reserves, private attachments and client-identifying details remain outside public content. Proposal allowances are distinguished from completed-project costs.

Alluvial examples explain equipment versus execution, schedule dependencies, owner exclusions and operating cash. Hard-rock gravity and CIL budgets are labelled illustrative because the available Chunya proposals price alluvial processing. Operating examples state throughput, hours, availability, fuel and other assumptions; they are not measured Chunya operating results. No current fuel tariff, universal recovery rate or guaranteed production is inferred from those examples.

## Validation

The editorial audit checks all 43 rendered bodies for contextual openings, conclusions, source-basis sections, external references, heading anchors, metadata, reading times, local image files, related guides and internal article-section links. It also checks sitemap uniqueness and article discovery. It passes.

- TypeScript: `npx tsc --noEmit` passed.
- Production build: `npm run build` passed and generated 170 pages. The restricted local environment could not resolve the existing gold-price and exchange-rate APIs; their existing fallback paths allowed the build to complete.
- Browser: all 43 articles and both collections passed at 390px and 1365px, totalling 90 page/viewport checks. These checked layout overflow, images, contents anchors, language, canonicals, article structured data and breadcrumbs. Both collections passed search, no-results reset, topic filters and language isolation. The footer link is present and the main navigation is unchanged. No JavaScript errors were recorded.
- Discovery: the served sitemap contains unique URLs and the new collection. `llms.txt` includes it, and both translated article pairs have reciprocal language alternates.
- `git diff --check` passed.

The automated audit checks publishing structure and reference presence. It cannot certify a laboratory result, field performance, regulatory approval or transaction-specific tax treatment. Substantial Kiswahili wording should still receive the fluent-editor review required by the editorial standard before publication, especially technical and financial terms.

## Reviewed inventory

| Article | Language | Body words | Reading time | Basis |
| --- | --- | ---: | --- | --- |
| [Bei ya vifaa na gharama za kuanzisha plant ya dhahabu Tanzania](/bei-ya-vifaa-vya-uchimbaji) | Kiswahili | 2195 | 11 min | Client-facing proposals and labelled planning assumptions; supporting primary references |
| [Gharama ya kuanzisha plant ya dhahabu Tanzania](/gharama-ya-plant-ya-dhahabu) | Kiswahili | 1612 | 9 min | Client-facing proposals and labelled planning assumptions; supporting primary references |
| [Bei ya mashine ya kusaga mawe ya dhahabu](/bei-ya-mashine-ya-kusaga-mawe) | Kiswahili | 662 | 4 min | Primary references; worked examples labelled where used |
| [Jinsi ya kupata leseni ya uchimbaji mdogo (PML)](/jinsi-ya-kupata-leseni-ya-pml) | Kiswahili | 735 | 4 min | Primary references; worked examples labelled where used |
| [Mrabaha na makato kwenye mauzo ya dhahabu Tanzania](/mrabaha-na-kodi-za-dhahabu) | Kiswahili | 736 | 4 min | Primary references; worked examples labelled where used |
| [Mining Commission compliance checklist for Tanzania](/insights/mining-commission-compliance-2026) | English | 694 | 4 min | Primary references; worked examples labelled where used |
| [Selling gold in Tanzania: valuation, BoT and the 20% allocation](/insights/selling-gold-tanzania) | English | 773 | 4 min | Primary references; worked examples labelled where used |
| [Small-scale miner financing in Tanzania: loans, leases and hire](/insights/small-miner-financing) | English | 732 | 4 min | Primary references; worked examples labelled where used |
| [Planning mercury-free gold recovery for a small mine](/insights/mercury-free-gold-recovery) | English | 629 | 4 min | Primary references; worked examples labelled where used |
| [Gold elution plant costs: scope, budgets and toll treatment](/insights/gold-elution-plant-price) | English | 628 | 4 min | Primary references; worked examples labelled where used |
| [Planning a small CIP or CIL gold plant](/insights/small-cip-plant-guide) | English | 612 | 4 min | Primary references; worked examples labelled where used |
| [Activated carbon and cyanide procurement in Tanzania](/insights/activated-carbon-cyanide-tanzania) | English | 621 | 4 min | Primary references; worked examples labelled where used |
| [Vat leaching gold tailings: tests, batch costs and site planning](/insights/vat-leaching-tailings) | English | 634 | 4 min | Primary references; worked examples labelled where used |
| [Mining equipment rental in Tanzania: compare hire and purchase](/insights/equipment-rental-tanzania) | English | 649 | 4 min | Primary references; worked examples labelled where used |
| [Buying used mining equipment in Tanzania](/insights/used-mining-equipment-tanzania) | English | 605 | 4 min | Primary references; worked examples labelled where used |
| [Test work before buying a gold plant](/insights/plant-test-work-guide) | English | 633 | 4 min | Primary references; worked examples labelled where used |
| [Off-grid mine power: loads, supply options and operating cost](/insights/off-grid-mine-power) | English | 626 | 4 min | Primary references; worked examples labelled where used |
| [Gold Plant and Mining Equipment Costs in Tanzania](/insights/mining-equipment-cost-tanzania) | English | 2141 | 11 min | Client-facing proposals and labelled planning assumptions; supporting primary references |
| [What It Costs to Open a Gold Processing Plant in Tanzania](/insights/gold-plant-setup-cost) | English | 1603 | 9 min | Client-facing proposals and labelled planning assumptions; supporting primary references |
| [CIP, CIL and heap leaching: choosing a gold process](/insights/cil-vs-cip-vs-heap-leach) | English | 684 | 4 min | Primary references; worked examples labelled where used |
| [Gravity and cyanide gold recovery: choosing a tested route](/insights/gravity-vs-cyanide-gold-recovery) | English | 608 | 4 min | Primary references; worked examples labelled where used |
| [Planning gold exploration in Tanzania](/insights/gold-exploration-tanzania) | English | 593 | 3 min | Primary references; worked examples labelled where used |
| [Planning diamond exploration in Botswana](/insights/diamond-mining-botswana) | English | 561 | 3 min | Primary references; worked examples labelled where used |
| [Planning copper exploration in Zambia](/insights/copper-mining-zambia) | English | 566 | 3 min | Primary references; worked examples labelled where used |
| [Planning platinum-group metal exploration in Zimbabwe](/insights/platinum-zimbabwe) | English | 584 | 3 min | Primary references; worked examples labelled where used |
| [Planning coal exploration and development in Mozambique](/insights/coal-mining-mozambique) | English | 565 | 3 min | Primary references; worked examples labelled where used |
| [Planning a mineral survey in Kenya](/insights/mineral-survey-kenya) | English | 575 | 3 min | Primary references; worked examples labelled where used |
| [Planning geophysical surveys in East Africa](/insights/geophysical-surveys-east-africa) | English | 583 | 3 min | Primary references; worked examples labelled where used |
| [Planning diamond and RC drilling in Tanzania](/insights/drilling-services-tanzania) | English | 588 | 3 min | Primary references; worked examples labelled where used |
| [Environmental planning for a mining project in Tanzania](/insights/environmental-compliance-mining) | English | 711 | 4 min | Primary references; worked examples labelled where used |
| [Mining equipment procurement in East and Southern Africa](/insights/mining-equipment-africa) | English | 607 | 4 min | Primary references; worked examples labelled where used |
| [Planning a mineral exploration programme in the DRC](/insights/mineral-exploration-drc) | English | 564 | 3 min | Primary references; worked examples labelled where used |
| [Scoping mining technical services in South Africa](/insights/mining-services-south-africa) | English | 577 | 3 min | Primary references; worked examples labelled where used |
| [Planning a mineral exploration programme in Namibia](/insights/mining-exploration-namibia) | English | 556 | 3 min | Primary references; worked examples labelled where used |
| [Geological mapping and structural interpretation for exploration](/insights/geological-mapping) | English | 588 | 3 min | Primary references; worked examples labelled where used |
| [Mine planning and feasibility studies: choosing the next stage](/insights/mine-planning-feasibility) | English | 617 | 4 min | Primary references; worked examples labelled where used |
| [Commissioning assays and laboratory work in Tanzania](/insights/assay-laboratory-tanzania) | English | 590 | 3 min | Primary references; worked examples labelled where used |
| [Scoping mining technical consulting and advisory work](/insights/mining-consulting-africa) | English | 665 | 4 min | Primary references; worked examples labelled where used |
| [Community relations and CSR planning for a mine](/insights/community-csr-mining) | English | 659 | 4 min | Primary references; worked examples labelled where used |
| [Planning outsourced exploration for a junior mining company](/insights/junior-mining-company) | English | 633 | 4 min | Primary references; worked examples labelled where used |
| [Mining opportunities in East Africa: from market theme to project](/insights/future-mining-east-africa) | English | 626 | 4 min | Primary references; worked examples labelled where used |
| [Underground air supply: ventilation and compressed air](/insights/underground-air-supply) | English | 614 | 4 min | Primary references; worked examples labelled where used |
| [Gold recovery in the rainy season: feed, clay and water](/insights/recovering-gold-rainy-season) | English | 619 | 4 min | Primary references; worked examples labelled where used |
