# FAQ review — 6 October 2026

The requested languages are English and Kiswahili. This pass covers every registered article, every English equipment-supply guide, all Kiswahili town and market guides, and their connected generator-rental, price and delivery pages. There are 68 guides and 14 functional/service pages: 82 URLs with 259 question-and-answer pairs. Equipment product FAQs are a separate catalogue collection and are outside this article review.

## Coverage

| Collection | Pages | Questions |
| --- | ---: | ---: |
| English articles | 38 | 78 |
| Kiswahili articles | 5 | 12 |
| English supply guides | 13 | 52 |
| Kiswahili town guides | 6 | 18 |
| Kiswahili market guides | 6 | 20 |
| Connected English service pages | 12 | 64 |
| Kiswahili rental service | 1 | 10 |
| Kiswahili gold-price tool | 1 | 5 |
| **Total** | **82** | **259** |

## Findings and changes

- Only four of the 43 registered articles had dedicated FAQ sections. Their twelve useful answers were preserved, including the equivalent English/Kiswahili cost-guide content and existing section anchors. The other 39 guides received two topic-specific questions each. These address decisions and misunderstandings left by the subject; FAQs remain optional for future articles and do not replace the main explanation.
- Questions and answers use complete sentences, practical conditions and a next assessment where needed. The review checked each against the article topic and body. Market questions about unrelated equipment purchases were replaced by sale-document, valuation, settlement and record questions.
- Town guides no longer use fixed delivery-day promises as FAQ answers. Offers must define clearance, route, handling, access and unloading for the actual consignment. The Dar es Salaam answer no longer applies an unsupported 25–45% uplift to every equipment price.
- Underground answers no longer use general 60 m or 80 m thresholds to decide hoisting, pumping or ventilation. Gas monitoring is explained as one part of the assessed system, rather than permission to enter. Cargo winches are distinguished from personnel-hoisting systems.
- Recovery answers require representative evidence and a complete product route. Old mercury-bearing residues are distinguished from ordinary cyanide feed; adjacent Chunya paragraphs were corrected to agree with the answers. No fixed recovery improvement is promised from buying a concentrator or adding tanks.
- Market and gold-price answers no longer present one refinery royalty rate as applying to every transaction, or a historical indicative price as today's settlement. They direct readers to the relevant official terms, weight and purity basis, itemised deductions and actual payment trigger. Duplicate deduction is explicitly addressed.
- Rental answers no longer confirm generator size from a fixed starting-current multiplier, kVA-per-kW shortcut or standard plant range. Starting, simultaneous operation, site conditions and the model's rating are assessed together. Existing fuel arithmetic is retained as an explicit teaching example with power factor, load and consumption assumptions; it is not a fuel quote.
- FAQs precede substantive conclusions in the guides. The town/market templates now close the argument and give a basis for the answers, with applicable English technical links identified as English. Relevant nearby body paragraphs were changed where they contradicted a revised answer.
- The same FAQ copy supplies the visible article text and language-correct structured data. Registered copy lives in src/data/article-faqs.json; the rendering helper escapes plain text. Connected service/price copy lives in src/data/service-faqs.ts, with English rental copy retained in src/data/generator-rental.ts.
- Reading times were recalculated from the rendered article bodies. Revision dates changed for the 39 substantive FAQ additions and the revised English supply/rental content. Preserving the four existing FAQ sections did not invent a new substantive revision for those articles.

## Source basis and limits

Existing article references remain attached to their explanatory bodies. The new questions explain their implications without introducing new supplier prices, legal fees, eligibility promises or chemical operating recipes. The following primary material was consulted for the sensitive FAQ corrections:

- [US EPA: artisanal and small-scale gold mining without mercury](https://www.epa.gov/international-cooperation/artisanal-and-small-scale-gold-mining-without-mercury): feed-specific method selection and mercury-bearing tailings concerns.
- [SGS: gold processing](https://www.sgs.com/-/media/sgscorp/documents/corporate/brochures/sgs-nr-gold-processing-en.cdn.en-KZ.pdf): ore-specific circuits and the full route to final gold.
- [ICMI: Cyanide Code](https://cyanidecode.org/about-the-cyanide-code/the-cyanide-code/): coordinated chemical management; this is not a Tanzanian permit rule.
- [NIOSH: mine ventilating principles and practices](https://stacks.cdc.gov/view/cdc/161141): design and distribution responsibilities; not a Tanzania-specific entry criterion.
- [Mining Commission: licence guidance](https://tumemadini.go.tz/pages/licenseservice/), [application procedure](https://www.tumemadini.go.tz/pages/applicationprocedure/) and [mineral-market list](https://tumemadini.go.tz/statistics/list-of-mineral-markets/): official routes for verification. These Commission pages were available through indexed official excerpts; direct retrieval timed out. The revised answers therefore do not assert new licence conditions, current market opening hours or a universal refinery rate.

This is an FAQ/editorial consistency review, not a fresh verification of every inherited geological statement, historical statistic, company service commitment or study figure elsewhere in the site. Private project data and supplier figures were not used. An independent fluent Kiswahili editor has not reviewed this pass; no external language or professional certification is claimed.

## Validation

The source FAQ audit, registered-article audit, Kiswahili-directory audit, production build and TypeScript checks pass. The production preview passed 88 browser-page checks: all 82 URLs at 390 px and six representative pages at 1440 px. Every reviewed question and answer matches the visible page and its single FAQPage schema, with the correct language. Section anchors work, guide FAQs precede their conclusions, and no horizontal overflow or JavaScript page errors were found. English desktop and Kiswahili phone FAQ screenshots were also inspected for reading flow. External requests and image downloads were blocked in these FAQ checks; this does not represent an image or live-data availability test.

The temporary browser report and screenshots are in `/private/tmp/bart-faq-review/`. The first desktop run encountered an ordinary cached 304 response; rerunning with browser caching disabled passed. The app did not require a fix for that test condition. `node scripts/audit-article-faqs.mjs` is the persistent source check for future edits.

## Complete reviewed URL inventory

| Language | Page | Questions |
| --- | --- | ---: |
| Kiswahili | /insights-swahili/bei-ya-vifaa-vya-uchimbaji | 3 |
| Kiswahili | /insights-swahili/gharama-ya-plant-ya-dhahabu | 3 |
| Kiswahili | /insights-swahili/bei-ya-mashine-ya-kusaga-mawe | 2 |
| Kiswahili | /insights-swahili/jinsi-ya-kupata-leseni-ya-pml | 2 |
| Kiswahili | /insights-swahili/mrabaha-na-kodi-za-dhahabu | 2 |
| English | /insights/mining-commission-compliance-2026 | 2 |
| English | /insights/selling-gold-tanzania | 2 |
| English | /insights/small-miner-financing | 2 |
| English | /insights/mercury-free-gold-recovery | 2 |
| English | /insights/gold-elution-plant-price | 2 |
| English | /insights/small-cip-plant-guide | 2 |
| English | /insights/activated-carbon-cyanide-tanzania | 2 |
| English | /insights/vat-leaching-tailings | 2 |
| English | /insights/equipment-rental-tanzania | 2 |
| English | /insights/used-mining-equipment-tanzania | 2 |
| English | /insights/plant-test-work-guide | 2 |
| English | /insights/off-grid-mine-power | 2 |
| English | /insights/mining-equipment-cost-tanzania | 3 |
| English | /insights/gold-plant-setup-cost | 3 |
| English | /insights/cil-vs-cip-vs-heap-leach | 2 |
| English | /insights/gravity-vs-cyanide-gold-recovery | 2 |
| English | /insights/gold-exploration-tanzania | 2 |
| English | /insights/diamond-mining-botswana | 2 |
| English | /insights/copper-mining-zambia | 2 |
| English | /insights/platinum-zimbabwe | 2 |
| English | /insights/coal-mining-mozambique | 2 |
| English | /insights/mineral-survey-kenya | 2 |
| English | /insights/geophysical-surveys-east-africa | 2 |
| English | /insights/drilling-services-tanzania | 2 |
| English | /insights/environmental-compliance-mining | 2 |
| English | /insights/mining-equipment-africa | 2 |
| English | /insights/mineral-exploration-drc | 2 |
| English | /insights/mining-services-south-africa | 2 |
| English | /insights/mining-exploration-namibia | 2 |
| English | /insights/geological-mapping | 2 |
| English | /insights/mine-planning-feasibility | 2 |
| English | /insights/assay-laboratory-tanzania | 2 |
| English | /insights/mining-consulting-africa | 2 |
| English | /insights/community-csr-mining | 2 |
| English | /insights/junior-mining-company | 2 |
| English | /insights/future-mining-east-africa | 2 |
| English | /insights/underground-air-supply | 2 |
| English | /insights/recovering-gold-rainy-season | 2 |
| English | /equipment/supply/mwanza | 4 |
| English | /equipment/supply/geita | 4 |
| English | /equipment/supply/kahama | 4 |
| English | /equipment/supply/chunya | 4 |
| English | /equipment/supply/tarime | 4 |
| English | /equipment/supply/shinyanga | 4 |
| English | /equipment/supply/singida | 4 |
| English | /equipment/supply/nzega | 4 |
| English | /equipment/supply/musoma | 4 |
| English | /equipment/supply/mpanda | 4 |
| English | /equipment/supply/handeni | 4 |
| English | /equipment/supply/dar-es-salaam | 4 |
| English | /equipment/supply/mererani | 4 |
| Kiswahili | /insights-swahili/vifaa-vya-uchimbaji/geita | 3 |
| Kiswahili | /insights-swahili/vifaa-vya-uchimbaji/kahama | 3 |
| Kiswahili | /insights-swahili/vifaa-vya-uchimbaji/chunya | 3 |
| Kiswahili | /insights-swahili/vifaa-vya-uchimbaji/mwanza | 3 |
| Kiswahili | /insights-swahili/vifaa-vya-uchimbaji/tarime | 3 |
| Kiswahili | /insights-swahili/vifaa-vya-uchimbaji/shinyanga | 3 |
| Kiswahili | /insights-swahili/soko-la-madini/geita | 4 |
| Kiswahili | /insights-swahili/soko-la-madini/chunya | 4 |
| Kiswahili | /insights-swahili/soko-la-madini/kahama | 3 |
| Kiswahili | /insights-swahili/soko-la-madini/mwanza | 3 |
| Kiswahili | /insights-swahili/soko-la-madini/songwe | 3 |
| Kiswahili | /insights-swahili/soko-la-madini/katavi | 3 |
| English | /generator-rental | 10 |
| English | /generator-rental/mwanza | 7 |
| English | /generator-rental/dar-es-salaam | 7 |
| English | /generator-rental/geita | 7 |
| English | /generator-rental/arusha | 5 |
| English | /generator-rental/dodoma | 4 |
| English | /generator-rental/mbeya | 4 |
| English | /generator-rental/morogoro | 4 |
| English | /generator-rental/tanga | 4 |
| English | /generator-rental/kahama | 4 |
| English | /generator-rental/mtwara | 4 |
| Kiswahili | /insights-swahili/jenereta-za-kukodi | 10 |
| Kiswahili | /insights-swahili/bei-ya-dhahabu-leo | 5 |
| English | /delivery-shipping | 4 |

Deployment should be verified separately after these changes are pushed to `main`.
