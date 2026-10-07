import type { Post } from '../types'
import { cta } from './cta'

/*
 * Second batch (October 2026): news, evergreen explainers and more products.
 * The copy rules at the top of posts.ts apply here too.
 *
 * Sources:
 * - News posts (IG-19 to IG-25) name their public source in the caption and
 *   in each slide note. Re-check every figure against the primary source
 *   (Ministry, Mining Commission, BoT, Kenya State Department) on the day of
 *   posting. News goes stale, so post these first.
 * - Explainers (IG-26 to IG-32) use the named insight file. Every figure in
 *   them is an assumed teaching example from that guide and is labelled
 *   "illustrative".
 * - Products (IG-33 to IG-40) use the corresponding equipment page.
 * - Search-audit guides (IG-41 to IG-47) use the new insight articles named
 *   in `sourceInsight` (docs/search-demand-audit-2026-10-07.md, Phases 2–5).
 * - `social/<file>` images marked "Image needed" still have to be sourced.
 *   News visuals and internal provenance are recorded in
 *   docs/social-news-image-review-2026-10-07/. Public descriptions follow
 *   docs/editorial-standard.md; do not describe the production method.
 */

const BIO_GUIDE = 'Read the full guide through the link in our bio.'
const BIO_EQUIPMENT = 'You can find the equipment guide through the link in our bio.'
const WHATSAPP = 'To discuss your equipment or processing needs, WhatsApp +255 759 141 705.'
const ILLUSTRATION_NOTE = 'Visuals illustrate gold handling, mineral samples, equipment and project planning; they do not document the reported events or named projects.'
const EQUIPMENT_VISUAL_NOTE = 'Visuals illustrate generic equipment, laboratory settings and project planning.'
const NEWS_NOTE = 'This post summarises public reports for general information. It is not legal, tax or investment advice.'
const PRODUCT_NOTE = (slug: string) => `Source: /equipment/${slug}. Allan reviews the quotation copy; Bartholomew reviews the technical claims.`
const crop = { x: 50, y: 50, zoom: 1 }

export const POSTS_BATCH_2: Post[] = [
  // ───────────────────────────── NEWS AND MARKET ─────────────────────────────

  {
    id: 'IG-19',
    title: 'Gold Price Update, October 2026',
    pillar: 'news',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'photo-overlay', eyebrow: 'Market Update · October 2026', headline: 'Planning at a Lower Gold Price', sub: 'Gold traded at about USD 4,135 per ounce on 7 October 2026, around a quarter below the record of about USD 5,608 set in January.', image: 'social/news-gold-1.png', imageAlt: 'Unmarked gold bullion bars on a dark weighing bench.', note: 'Source: Trading Economics, 7 Oct 2026. Update the price on the day of posting.', crop },
      { id: 'month', template: 'stat', eyebrow: 'Past month', stat: '−5%', headline: 'Gold Fell Over the Past Month', sub: 'Gold fell about 5% over the past month. The price is still about 2% higher than a year ago, so gold remains high by historical standards even after this fall.', image: 'social/news-gold-2.png', imageAlt: 'A cast gold bar on a laboratory scale beside sample containers.', note: 'Source: Trading Economics (−5.08% month, +2.28% year). Re-check before posting.', crop },
      { id: 'budget', template: 'cover-dark', eyebrow: 'Plant planning', headline: 'Test Your Budget at a Lower Price', sub: 'A project that only pays back at the peak price carries more risk. Before you commit to equipment, check whether it still works at a lower price and in a weaker production month.', image: 'social/news-gold-3.png', imageAlt: 'A calculator, project binder and rock sample on a planning desk.', note: 'Source: small-miner-financing (weaker-month test).', crop },
      { id: 'recovery', template: 'cover-dark', eyebrow: 'Recovery', headline: 'Reduce Gold Lost to Tailings', sub: 'When each gram earns less, gold lost to tailings becomes harder to afford. Ore tests show where better grinding or gravity recovery could add saleable gold.', image: 'social/news-gold-4.png', imageAlt: 'Fine wet mineral sediment in a sample tray.', note: 'Source: plant-test-work-guide.', crop },
      cta('Plan at a Realistic Gold Price', 'When you contact us, please share your ore tests, target output and the gold price used in your plan.'),
    ],
    caption: 'Gold traded at about USD 4,135 per ounce on 7 October 2026. That is around a quarter below the record of about USD 5,608 set in January, and about 5% lower than a month ago.\n\nFor a small mine planning a plant, the lesson is to test the budget at a conservative price rather than the peak. A project that still repays its equipment in a weaker month at a lower price is a safer investment. Reducing gold losses to tailings also becomes more valuable when each gram earns less.\n\nOur gold plant cost guide explains how to build a complete budget. ' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\nSource: Trading Economics, gold spot price, 7 October 2026. Prices change daily. ' + NEWS_NOTE + '\n\n' + ILLUSTRATION_NOTE,
    hashtags: ['#GoldPrice', '#GoldMining', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-20',
    title: 'Kenya Plans a Ban on Unprocessed Gold Exports',
    pillar: 'news',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'photo-overlay', eyebrow: 'Regional News · September 2026', headline: 'Kenya Plans a Raw Gold Export Ban', sub: 'President William Ruto announced on 15 September 2026 that gold will need to be processed locally and exported through approved government channels.', image: 'social/news-kenya-1.png', imageAlt: 'A supported crucible pours molten gold into a rectangular ingot mould.', note: 'Source: Nairametrics, 15 Sep 2026. Confirm with Kenya State Department for Mining.', crop },
      { id: 'output', template: 'stat', eyebrow: 'Kenyan gold output', stat: '300 kg', headline: 'Most Kenyan Gold Comes from Small Miners', sub: 'Kenya produces about 300 kg of gold each month. More than 90% of this gold comes from artisanal and small-scale miners, and much of it is traded outside regulated channels.', image: 'social/news-kenya-2.png', imageAlt: 'A cast gold bar on a laboratory scale beside sample containers.', note: 'Source: Kenya State Department for Mining, via Nairametrics.', crop },
      { id: 'refineries', template: 'cover-dark', eyebrow: 'Refining plans', headline: 'Three Refineries Are Planned', sub: 'The refineries are planned for Kakamega and Nairobi. The plan gives the Central Bank of Kenya first priority in a domestic gold-purchasing programme. An effective date for the export ban has not yet been announced.', image: 'social/news-kenya-3.png', imageAlt: 'Conceptual process vessels, pumps, pipes and access platforms inside a refinery hall.', note: 'Source: Nairametrics. Update if an effective date is published.', crop },
      { id: 'records', template: 'cover-dark', eyebrow: 'Traceable sales', headline: 'Keep Records for Every Gold Sale', sub: 'Buyers across the region increasingly need to know where gold came from. Keeping the weight, assay and sale records for each lot makes the origin easier to document.', image: 'social/news-kenya-4.png', imageAlt: 'A calculator, project binder and rock sample on a planning desk.', note: 'Source: selling-gold-tanzania (sale file).', crop },
      cta('Discuss Gold Recovery for Your Site', 'When you contact us, please describe your site, your current recovery method and how you sell your gold.'),
    ],
    caption: 'Kenya plans to stop exports of unprocessed gold.\n\nPresident William Ruto announced on 15 September 2026 that gold will need to be processed locally and exported through approved government channels. Three refineries are planned for Kakamega and Nairobi, and the Central Bank of Kenya will have first priority in a domestic gold-purchasing programme. An effective date has not yet been announced.\n\nKenya produces about 300 kg of gold a month, more than 90% of it from artisanal and small-scale miners. For miners on both sides of the border, clean concentrate and complete sale records are becoming more important. ' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\nSource: Nairametrics, 15 September 2026. ' + NEWS_NOTE + '\n\n' + ILLUSTRATION_NOTE,
    hashtags: ['#KenyaMining', '#GoldMining', '#EastAfricaMining', '#BartMining'],
  },

  {
    id: 'IG-21',
    title: '65 Mining Areas for Young Miners',
    pillar: 'news',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'photo-overlay', eyebrow: 'Tanzania News · 2026/27', headline: '65 Mining Areas for Young Miners', sub: 'The Mining Commission announced on 16 March 2026 that 65 areas for small-scale mining are reserved for youth in the 2026/27 financial year.', image: 'social/news-youth-1.png', imageAlt: 'Geological sampling and survey tools beside a generic exploration area.', note: 'Source: TanzaniaInvest, 16 Mar 2026. Confirm with the Mining Commission.', crop },
      { id: 'regions', template: 'cover-dark', eyebrow: 'Where the areas are', headline: 'Mining Areas Across Ten Regions', sub: 'They include Geita, Mwanza, Shinyanga, Mbeya, Tabora, Dodoma, Morogoro, Lindi, Mtwara and Manyara. Young miners should follow Commission announcements for application details.', image: 'social/news-youth-2.png', imageAlt: 'Tanzania outline marking centres in Geita, Mwanza, Shinyanga, Mbeya, Tabora, Dodoma, Morogoro, Lindi, Mtwara and Manyara; these are not licence-area locations.', note: 'Regional centres, not licence-area locations. Outline: geoBoundaries / OpenStreetMap (ODbL 1.0); source snapshot in docs/social-news-image-review-2026-10-07.', crop },
      { id: 'finance', template: 'cover-dark', eyebrow: 'Financing', headline: 'CRDB Supports Young Gold Miners', sub: 'The Commission signed an agreement with CRDB Bank on 23 February 2026 to help small-scale gold miners, particularly young people, gain access to finance.', image: 'social/news-youth-3.png', imageAlt: 'A calculator, project binder and rock sample on a planning desk.', note: 'Source: TanzaniaInvest. No loan amount was published; do not add one.', crop },
      { id: 'test', template: 'cover-dark', eyebrow: 'Before you buy', headline: 'Test the Ground Before Buying', sub: 'A licence area is a starting point. Sampling, assays and ore tests show what the ground contains and which equipment the project can support.', image: 'social/news-youth-4.jpg', imageAlt: 'Assorted mineral specimens laid out for examination.', note: 'Source: plant-test-work-guide.', crop },
      { id: 'file', template: 'cover-dark', eyebrow: 'Applying for finance', headline: 'Prepare a Clear Project File', sub: 'Before you apply, prepare your licence, sample results, equipment quotations and a monthly cash forecast that still works in a weaker month.', image: 'social/news-youth-5.jpg', imageAlt: 'A desk arranged for geological study.', note: 'Source: small-miner-financing.', crop },
      cta('Plan Your First Equipment', 'When you contact us, please share your licence area, any sample results and the equipment you are considering.'),
    ],
    caption: 'Tanzania has reserved 65 small-scale mining areas for young miners in 2026/27.\n\nThe Mining Commission announced the allocation on 16 March 2026. The areas are in Geita, Mwanza, Shinyanga, Mbeya, Tabora, Dodoma, Morogoro, Lindi, Mtwara and Manyara. In February, the Commission also signed an agreement with CRDB Bank to help small-scale gold miners, particularly young people, gain access to finance.\n\nA licence area is a starting point. Sampling and ore tests show what the ground contains, and a lender will want a project file with quotations and a realistic cash forecast. Our financing guide explains what to prepare. ' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\nSource: TanzaniaInvest, reporting the Tanzania Mining Commission, March 2026. Map: geoBoundaries / © OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright); styled outline with regional-centre markers, not licence-area boundaries. Stock photos: MART PRODUCTION and Yena Kwon / Pexels. ' + NEWS_NOTE + '\n\n' + ILLUSTRATION_NOTE,
    hashtags: ['#YouthInMining', '#SmallScaleMining', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-22',
    title: "Tanzania's 2025/26 Gold Production",
    pillar: 'news',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'photo-overlay', eyebrow: 'Tanzania News · 2025/26', headline: 'Tanzania’s Gold Output in 2025/26', sub: 'The Ministry of Minerals reported 67.8 tonnes of gold, worth TZS 18.4 trillion, for the 2025/26 financial year.', image: 'social/news-tanzania-1.png', imageAlt: 'Rough cast gold doré bars on an assay bench.', note: 'Source: TanzaniaInvest, reporting the Ministry of Minerals. Confirm against the Ministry release.', crop },
      { id: 'refineries', template: 'stat', eyebrow: 'Domestic refining', stat: '28,701 kg', headline: 'Gold Sold Through Local Refineries', sub: 'Of the gold produced in 2025/26, 28,701 kg was sold through Tanzania’s five domestic refineries.', image: 'social/news-tanzania-2.png', imageAlt: 'A cast gold bar on a laboratory scale beside sample containers.', note: 'Source: TanzaniaInvest.', crop },
      { id: 'bot', template: 'stat', eyebrow: 'Bank of Tanzania', stat: '75.64%', headline: 'BoT Bought Most of the Refined Gold', sub: 'The Bank purchased 21,710 kg under its Domestic Gold Purchase Programme to strengthen the country’s foreign reserves.', image: 'social/news-tanzania-3.png', imageAlt: 'Unmarked gold bullion bars on a dark weighing bench.', note: 'Source: TanzaniaInvest.', crop },
      { id: 'terms', template: 'cover-dark', eyebrow: 'Selling your gold', headline: 'Confirm the Terms Before You Sell', sub: 'Royalty, fees and payment timing depend on the route you use. Before delivering gold, ask for a written settlement calculation and confirm the current terms.', image: 'social/news-tanzania-4.png', imageAlt: 'A calculator, project binder and rock sample on a planning desk.', note: 'Source: selling-gold-tanzania.', crop },
      cta('Discuss Your Production Plans', 'When you contact us, please describe your site, current output and the equipment you are considering.'),
    ],
    caption: 'Tanzania produced 67.8 tonnes of gold in the 2025/26 financial year.\n\nThe Ministry of Minerals valued the production at TZS 18.4 trillion. Of that gold, 28,701 kg was sold through the country’s five domestic refineries, and the Bank of Tanzania bought 21,710 kg, or 75.64% of refined output, under its Domestic Gold Purchase Programme.\n\nIf you sell gold, the route you use affects the royalty, fees and payment timing. Our guide to selling gold in Tanzania explains how to request a written settlement calculation. ' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\nSource: TanzaniaInvest, reporting the Ministry of Minerals. ' + NEWS_NOTE + '\n\n' + ILLUSTRATION_NOTE,
    hashtags: ['#TanzaniaGold', '#GoldMining', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-23',
    title: 'High Court Ruling on Mining CSR',
    pillar: 'news',
    status: 'review',
    signOff: 'bartholomew',
    slides: [
      { id: 'cover', template: 'photo-overlay', eyebrow: 'Tanzania News · January 2026', headline: 'High Court Ruling on Mining CSR', sub: 'On 28 January 2026, the High Court declared part of the Mining (Corporate Social Responsibility) Regulations, 2023 invalid.', image: 'social/news-csr-1.png', imageAlt: 'Legal reference books, balance scales and a hard hat on a project review desk.', note: 'LEGAL REVIEW REQUIRED before posting. Sources: African Mining Online, 20 Mar 2026; Clyde & Co.', crop },
      { id: 'split', template: 'cover-dark', eyebrow: 'What was decided', headline: 'The Court Struck Down the Split', sub: 'Regulation 4(4) allocated 40% of CSR resources to village or community projects and 60% to district, municipal or city council projects.', image: 'social/news-csr-2.png', imageAlt: 'The former CSR allocation: 40% for village or community projects and 60% for council projects; the provision was declared invalid.', note: 'Source: African Mining Online.', crop },
      { id: 'reason', template: 'cover-dark', eyebrow: 'The reasoning', headline: 'The Split Exceeded the Mining Act', sub: 'The court held that regulation 4(4)(a) and (b) exceeded the Minister’s powers, and found that the evidence did not show host communities were adequately consulted.', image: 'social/news-csr-3.png', imageAlt: 'A calculator, project binder and rock sample on a planning desk.', note: 'Source: African Mining Online. Check the judgment wording.', crop },
      { id: 'next', template: 'cover-dark', eyebrow: 'What to do now', headline: 'Review Your CSR Plan with Advisers', sub: 'Mineral right holders should check their CSR planning against the Mining Act and watch for further guidance. A commitment register keeps each promise to the community specific.', image: 'social/news-csr-4.png', imageAlt: 'An empty table with chairs and notebooks prepared for community consultation.', note: 'Source: community-csr-mining (commitment register).', crop },
      cta('Discuss Your Community Plans', 'When you contact us, please describe your licence, your site and the community commitments you are planning.'),
    ],
    caption: 'A High Court ruling has changed how mining CSR resources are allocated in Tanzania.\n\nOn 28 January 2026, the court declared regulation 4(4)(a) and (b) of the Mining (Corporate Social Responsibility) Regulations, 2023 invalid. The regulation had split CSR resources 40% to village or community projects and 60% to district, municipal or city council projects. The court held that the split went beyond the Minister’s powers under the Mining Act and that the evidence did not show host communities had been adequately consulted.\n\nMineral right holders should review their CSR plans with their advisers and watch for further regulatory guidance. Our community guide explains how to keep commitments specific and reviewable. ' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\nSources: African Mining Online, 20 March 2026; Clyde & Co. ' + NEWS_NOTE + '\n\n' + ILLUSTRATION_NOTE,
    hashtags: ['#MiningLaw', '#CSR', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-24',
    title: 'Uganda Formalises Small-Scale Gold Miners',
    pillar: 'news',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'photo-overlay', eyebrow: 'Regional News · 2026', headline: 'Uganda Helps Miners Form Cooperatives', sub: 'A UGX 800 million programme running to October 2026 aims to formalise at least 20 artisanal mining cooperatives.', image: 'social/news-uganda-1.png', imageAlt: 'A gold pan, sample bottles and shovel beside a water basin.', note: 'Source: African Mining Week, 22 Jun 2026.', crop },
      { id: 'partners', template: 'cover-dark', eyebrow: 'Who runs it', headline: 'Who Runs the TENT Initiative?', sub: 'The Uganda Chamber of Energy and Minerals, GIZ Uganda and the Ministry of Energy and Mineral Development are implementing the twelve-month programme.', image: 'social/news-uganda-2.png', imageAlt: 'A calculator, project binder and rock sample on a planning desk.', note: 'Source: African Mining Week.', crop },
      { id: 'scale', template: 'stat', eyebrow: 'Uganda’s gold workforce', stat: '90,000', headline: 'Uganda’s Gold Mining Workforce', sub: 'Around 500,000 people work informally in Ugandan mining, and about 90,000 of them are directly engaged in gold production.', image: 'social/news-uganda-3.png', imageAlt: 'A supported gravity sluice with riffles for mineral separation.', note: 'Source: African Mining Week.', crop },
      { id: 'together', template: 'cover-dark', eyebrow: 'Working as a group', headline: 'Plan Equipment as a Cooperative', sub: 'When miners work as a registered group, they can pool ore test results, share a processing plant and present one project file to a lender or supplier.', image: 'social/news-uganda-4.png', imageAlt: 'A conceptual small gravity processing circuit with a trommel, sluice and shaking table.', crop },
      cta('Discuss Equipment for Your Group', 'When you contact us, please describe your group, your ore and the equipment you are considering.'),
    ],
    caption: 'Uganda is helping artisanal gold miners form cooperatives.\n\nThe TENT Grant Initiative, run by the Uganda Chamber of Energy and Minerals, GIZ Uganda and the Ministry of Energy and Mineral Development, is a UGX 800 million, twelve-month programme running to October 2026. It aims to formalise at least 20 cooperatives. Around 500,000 people work informally in Ugandan mining, about 90,000 of them directly in gold.\n\nA registered group can pool ore tests, share a processing plant and present one project file to a lender or supplier. ' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\nSource: African Mining Week, 22 June 2026. ' + NEWS_NOTE + '\n\n' + ILLUSTRATION_NOTE,
    hashtags: ['#UgandaMining', '#SmallScaleMining', '#EastAfricaMining', '#BartMining'],
  },

  {
    id: 'IG-25',
    title: 'Nickel and graphite projects are advancing in Tanzania',
    pillar: 'news',
    status: 'review',
    signOff: 'bartholomew',
    slides: [
      { id: 'cover', template: 'photo-overlay', eyebrow: 'Tanzania News · 2026', headline: 'Nickel and graphite projects are advancing in Tanzania', sub: 'Nickel and graphite projects are advancing alongside gold, adding demand for equipment, services and skilled workers.', image: 'social/news-battery-1.png', imageAlt: 'Sulphide-bearing drill cores and a separate graphite-rich rock specimen.', note: 'Sources: TanzaniaInvest; Mining Weekly; Crux Investor.', crop },
      { id: 'kabanga', template: 'stat', eyebrow: 'Kabanga nickel', stat: 'USD 942m', headline: 'Kabanga’s Investment Decision', sub: 'The project is estimated to cost about USD 942 million. Its final investment decision was expected in late 2026, although recent reports point to early 2027.', image: 'social/news-battery-2.png', imageAlt: 'Level concrete equipment pads and prepared utility connections at a generic site.', note: 'FID timing conflicts between sources (late 2026 vs Q1 2027). Re-check before posting.', crop },
      { id: 'refinery', template: 'cover-dark', eyebrow: 'Local refining', headline: 'A Planned Refinery at Kahama', sub: 'The development plan includes a hydrometallurgical refinery at Kahama to produce battery-grade nickel, copper and cobalt, staged after concentrate production begins.', image: 'social/news-battery-3.png', imageAlt: 'Conceptual process vessels, pumps, pipes and access platforms inside a refinery hall.', note: 'Source: TanzaniaInvest; Mining Weekly.', crop },
      { id: 'graphite', template: 'cover-dark', eyebrow: 'Mahenge graphite', headline: 'Early Works at Mahenge Graphite', sub: 'Black Rock Mining’s early works at the Mahenge graphite project in Ulanga were scheduled to finish by mid-2026, ahead of a final investment decision.', image: 'social/news-battery-4.png', imageAlt: 'A dark graphite-rich specimen beside a dish of loose graphite flakes.', note: 'Source: TanzaniaInvest. Check whether works completed.', crop },
      { id: 'suppliers', template: 'cover-dark', eyebrow: 'Local supply', headline: 'Projects Need Local Suppliers', sub: 'Construction and operations create demand for earthmoving, power, pumping and maintenance support from suppliers who can document delivery and service.', image: 'social/news-battery-5.png', imageAlt: 'A tracked excavator and wheel loader parked on a prepared earth work area.', crop },
      cta('Discuss Your Equipment Needs', 'When you contact us, please describe your project, location and the equipment or services you need.'),
    ],
    caption: 'Battery minerals are bringing new projects to Tanzania.\n\nThe Kabanga nickel project, estimated at about USD 942 million, includes a planned refinery at Kahama to produce battery-grade nickel, copper and cobalt. Its final investment decision was expected in late 2026, although recent reports point to early 2027. In Ulanga, early works at the Mahenge graphite project were scheduled to finish by mid-2026.\n\nProjects of this size need earthmoving, power, pumping and maintenance support. Our guide to the future of mining in East Africa looks at what this means for the region. ' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\nSources: TanzaniaInvest; Mining Weekly, May 2026; Crux Investor. ' + NEWS_NOTE + '\n\n' + ILLUSTRATION_NOTE,
    hashtags: ['#CriticalMinerals', '#Nickel', '#TanzaniaMining', '#BartMining'],
  },

  // ─────────────────────────── EVERGREEN EXPLAINERS ───────────────────────────

  {
    id: 'IG-26',
    title: 'Testing Ore Before Buying a Plant',
    pillar: 'edu',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'plant-test-work-guide',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'Test Your Ore Before Buying a Plant', sub: 'An assay shows how much gold a sample contains. Metallurgical tests show how that gold can be recovered and what the process will consume.', image: 'social/explainer-ore-1.png', imageAlt: 'Mineral samples, a small grinding mill, sieves and a balance in a test laboratory.', crop },
      { id: 'sample', template: 'cover-dark', eyebrow: 'Sampling', headline: 'Collect Representative Samples', sub: 'A selected high-grade piece can show that gold is present, but the plant will treat a mix of ore types and grades. Your samples need to represent that feed.', image: 'social/explainer-ore-2.png', imageAlt: 'Separate sealed rock samples with blank identification tags and field tools.', crop },
      { id: 'tests', template: 'cover-dark', eyebrow: 'Test selection', headline: 'Match Each Test to a Design Question', sub: 'Gravity tests investigate physical recovery, leach tests measure extraction and reagent use, and grinding tests guide the choice of crusher and mill.', image: 'social/explainer-ore-3.png', imageAlt: 'Capped slurry bottles held horizontally on a laboratory bottle-roll test rack.', crop },
      { id: 'compare', template: 'cover-dark', eyebrow: 'Reading results', headline: 'Compare the Test Conditions', sub: 'A higher recovery at a finer grind also costs more power. Ask for the grind size, test duration and reagent use alongside each recovery figure.', image: 'social/explainer-ore-4.png', imageAlt: 'Test-comparison checklist covering feed sample, grind, duration, reagent use and recovery.', crop },
      { id: 'brief', template: 'cover-dark', eyebrow: 'Plant brief', headline: 'Use the Report to Plan Your Plant', sub: 'A useful report includes sample details, methods, complete results and limitations, so a supplier can size equipment for your actual ore.', image: 'social/explainer-ore-5.png', imageAlt: 'A calculator, project binder and rock sample on a planning desk.', crop },
      cta('Plan Your Ore Tests Before You Buy', 'When you contact us, please describe your samples, ore types and the plant you are considering.'),
    ],
    caption: 'A high assay alone cannot size a mill or choose a leaching process.\n\nAn assay shows how much gold a sample contains, while metallurgical tests show how that gold can be recovered and what the process consumes. Samples need to represent the ore the plant will treat, and each test should answer a specific design question. Compare results under the same conditions, then use the full report to write the plant brief.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#OreTesting', '#GoldProcessing', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-27',
    title: 'Reading an Assay Report',
    pillar: 'edu',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'assay-laboratory-tanzania',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'How to Read Your Gold Assay', sub: 'An assay report is only as useful as the sample behind it. The work begins in the field, before the sample reaches the laboratory.', image: 'social/explainer-assay-1.png', imageAlt: 'Ceramic fire-assay crucibles and shallow cupels beside a closed laboratory furnace.', crop },
      { id: 'record', template: 'cover-dark', eyebrow: 'Sample records', headline: 'Record the Sample’s Origin', sub: 'Each sample needs its location, material, interval, collection method and mass. A laboratory cannot correct a missing location or a biased sample.', image: 'social/explainer-assay-2.png', imageAlt: 'Geological sampling and survey tools at a generic exploration area.', crop },
      { id: 'method', template: 'cover-dark', eyebrow: 'Method', headline: 'Choose the Right Assay Method', sub: 'Fire assay is a common method for gold. Where coarse gold is suspected, ask the laboratory whether screened metallics or another approach would be more reliable.', image: 'social/explainer-assay-3.png', imageAlt: 'A cool, open laboratory furnace with a crucible tray and handling tongs.', crop },
      { id: 'qaqc', template: 'cover-dark', eyebrow: 'Quality checks', headline: 'Check the Quality Evidence', sub: 'Standards test the analysis, blanks reveal contamination and duplicates measure precision. Agree these checks with the laboratory before you send samples.', image: 'social/explainer-assay-4.png', imageAlt: 'Sealed reference-material containers, blank material and paired sample packets.', crop },
      { id: 'grade', template: 'stat', eyebrow: 'Illustrative example', stat: '200 g', headline: 'Contained Gold and Saleable Gold', sub: 'An illustrative 100-tonne lot averaging 2 g/t contains 200 g of gold. Recovery, losses and selling terms decide how much of it you will sell.', image: 'social/explainer-assay-5.png', imageAlt: 'A generic crushed-rock stockpile with a separate sample bag.', crop },
      cta('Discuss Your Sampling and Assays', 'When you contact us, please describe your samples and the decision your results need to support.'),
    ],
    caption: 'A precise assay from a poorly collected sample can still lead to the wrong decision.\n\nRecord what each sample represents, ask the laboratory which method suits your gold and agree quality checks before you send samples. Then read the grade carefully: an illustrative 100-tonne lot at 2 g/t contains 200 g of gold, but recovery and selling terms decide how much you will sell.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#GoldAssay', '#MineralExploration', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-28',
    title: 'Recovering Gold from Old Tailings',
    pillar: 'edu',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'vat-leaching-tailings',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'Can Old Tailings Yield More Gold?', sub: 'Old tailings, often called marudio, can still contain gold. A reprocessing project needs to show how much material there is and whether the gold can be recovered.', image: 'social/explainer-tailings-1.png', imageAlt: 'Fine weathered mineral tailings in a generic contained work area.', crop },
      { id: 'rights', template: 'cover-dark', eyebrow: 'Ownership', headline: 'Confirm the Right to Treat Tailings', sub: 'Before sampling, confirm who owns the tailings and whether you can move or process them. Then map the volumes, depths and sources of the material.', image: 'social/explainer-tailings-2.png', imageAlt: 'Geological sampling and survey tools at a generic exploration area.', crop },
      { id: 'mercury', template: 'cover-dark', eyebrow: 'Contaminants', headline: 'Assess Contaminants with Specialists', sub: 'Where mercury was used, specialists need to assess handling and treatment before chemicals are bought, because cyanide treatment of mercury-bearing tailings raises particular concerns.', image: 'social/explainer-tailings-3.png', imageAlt: 'Sealed sediment samples in a secondary containment tray.', crop },
      { id: 'flow', template: 'cover-dark', eyebrow: 'Vat leaching', headline: 'Test How Solution Flows', sub: 'Fines and clay can stop solution reaching the gold. Tests need to cover permeability as well as extraction before you build a vat site.', image: 'social/explainer-tailings-4.png', imageAlt: 'A conceptual empty lined treatment vat with a protected drainage layer.', crop },
      { id: 'batch', template: 'stat', eyebrow: 'Illustrative batch', stat: '60 g', headline: 'Estimate the Gold in Each Batch', sub: 'An illustrative 100-tonne batch grading 1 g/t contains 100 g of gold. At an assumed 60% recovery, it would produce 60 g before costs.', image: 'social/explainer-tailings-5.png', imageAlt: 'An excavator and wheel loader parked in a generic material-handling area.', crop },
      cta('Discuss a Tailings Project', 'When you contact us, please describe the tailings, their history and any sample results you have.'),
    ],
    caption: 'Old tailings can still contain gold, but a promising assay is not enough to build a vat site.\n\nConfirm your right to treat the material, map how much there is and have specialists assess any mercury. Test whether solution can flow through the material as well as how much gold it extracts. Then cost a full batch: an illustrative 100 tonnes at 1 g/t and an assumed 60% recovery would produce 60 g before costs.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#Tailings', '#GoldRecovery', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-29',
    title: 'Buying Used Mining Equipment',
    pillar: 'edu',
    status: 'review',
    signOff: 'allan',
    sourceInsight: 'used-mining-equipment-tanzania',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'Checks Before Buying Used Equipment', sub: 'A used machine can lower the purchase price, but the saving only counts once the machine suits your duty and is running on your site.', image: 'social/explainer-used-equipment-1.png', imageAlt: 'A generic used horizontal ball mill with visible supports and guarded drive.', crop },
      { id: 'duty', template: 'cover-dark', eyebrow: 'Suitability', headline: 'Check Whether the Machine Fits', sub: 'A seller’s throughput figure describes a previous ore and setup. An engineer should compare the machine’s power and size with your feed and operating hours.', image: 'social/explainer-used-equipment-2.jpg', imageAlt: 'The shell, drive and supports of a ball mill at Geevor Mine.', crop: { x: 50, y: 40, zoom: 1 } },
      { id: 'inspect', template: 'cover-dark', eyebrow: 'Inspection', headline: 'Get a Proper Condition Inspection', sub: 'A photograph or a run without load is not a condition report. A qualified inspector should check the shell, bearings, drive, liners and earlier repairs.', image: 'social/explainer-used-equipment-3.png', imageAlt: 'Stationary bearing components, a mounted dial indicator and inspection tools.', crop },
      { id: 'electrical', template: 'cover-dark', eyebrow: 'Electrical supply', headline: 'Check the Electrical Supply', sub: 'Record every nameplate, drive and control panel. Your electrical designer needs to compare them with the site supply, including voltage and frequency.', image: 'social/explainer-used-equipment-4.png', imageAlt: 'An isolated motor control cabinet with contactors, breakers and wire ducts.', crop },
      { id: 'cost', template: 'stat', eyebrow: 'Illustrative example', stat: 'USD 65,000', headline: 'Calculate the Ready-to-Use Cost', sub: 'In an illustrative case, a USD 40,000 machine costs USD 65,000 once inspection, repairs, delivery and installation are added.', image: 'social/explainer-used-equipment-5.png', imageAlt: 'Illustrative equipment cost: USD 40,000 purchase plus inspection, repairs, delivery and installation totals USD 65,000.', crop },
      cta('Get Help Assessing a Used Machine', 'When you contact us, please share the machine details, the seller’s information and your intended duty.'),
    ],
    caption: 'A used machine is only a saving once it is running on your site.\n\nCheck that the machine suits your ore and hours before you negotiate, have it inspected properly and confirm that its electrics match your supply. Then compare the complete cost: in an illustrative case, a USD 40,000 machine reaches USD 65,000 after inspection, repairs, delivery and installation, and further repairs or delays could remove the saving.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE + '\n\nBall mill photo: Nilfanion, Geevor Mine 13, Wikimedia Commons (https://commons.wikimedia.org/wiki/File:Geevor_Mine_13.jpg), CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/). Cropped and overlaid with text; this photo slide is shared under the same licence.',
    hashtags: ['#UsedEquipment', '#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-30',
    title: 'Power for a Small Gold Plant',
    pillar: 'edu',
    status: 'review',
    signOff: 'allan',
    sourceInsight: 'off-grid-mine-power',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'Plan Power for Your Gold Plant', sub: 'Adding up motor ratings gives only part of the answer. Starting demand, operating hours and fuel supply decide whether the power system works and what it costs.', image: 'social/explainer-power-1.png', imageAlt: 'An enclosed generator on a concrete pad with exhaust routed outside its shelter.', crop },
      { id: 'load', template: 'cover-dark', eyebrow: 'Load list', headline: 'List Every Electrical Load', sub: 'List each motor with its rating, running hours and starting method, and mark essential loads, such as dewatering pumps, that must keep running.', image: 'social/explainer-power-2.png', imageAlt: 'A conceptual load list covering processing, pumping, lighting and site services.', crop },
      { id: 'start', template: 'cover-dark', eyebrow: 'Starting demand', headline: 'Allow for Motor Starting Demand', sub: 'A generator needs to handle the surge when large motors start, not only their running load. An electrical designer should plan the starting sequence.', image: 'social/explainer-power-3.png', imageAlt: 'An isolated motor control cabinet with contactors, breakers and wire ducts.', crop },
      { id: 'fuel', template: 'stat', eyebrow: 'Illustrative example', stat: '16,848 L', headline: 'Estimate Monthly Fuel Use', sub: 'An illustrative 120 kW average demand for 20 hours a day over 26 days uses about 16,848 litres of diesel at an assumed 0.27 litres per kWh.', image: 'social/explainer-power-4.png', imageAlt: 'A generic fuel tank within a concrete containment bund.', crop },
      { id: 'options', template: 'cover-dark', eyebrow: 'Supply options', headline: 'Compare Your Power Options', sub: 'Each option needs real figures for your site: connection cost and reliability for the grid, fuel and servicing for diesel, and night-time supply for solar.', image: 'social/explainer-power-5.png', imageAlt: 'A conceptual solar array, generator and enclosed battery and inverter cabinets.', crop },
      cta('Plan the Power Supply for Your Plant', 'When you contact us, please include your equipment list, operating hours and site location.'),
    ],
    caption: 'A remote plant’s power system has to start the equipment, run through the production schedule and cope with interruptions.\n\nStart with a list of every load and its running hours, allow for the surge when large motors start and estimate monthly fuel use. In an illustrative case, 120 kW for 20 hours a day over 26 days uses about 16,848 litres of diesel. Then compare grid, diesel and hybrid supply using real figures for your site.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#MinePower', '#Generators', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-31',
    title: 'What an Elution Plant Does',
    pillar: 'edu',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'gold-elution-plant-price',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: 'What Is an Elution Plant?', headline: 'Stripping Gold from Loaded Carbon', sub: 'Gold collected on activated carbon is stripped into solution, recovered by electrowinning and smelted into a saleable product.', image: 'social/explainer-elution-1.webp', imageAlt: 'An elution equipment concept with vessels, pumps, an electrowinning cell and guarded access.', crop },
      { id: 'scope', template: 'cover-dark', eyebrow: 'Scope', headline: 'The Complete Elution Route', sub: 'A complete route covers carbon handling, stripping, electrowinning, goldroom work and carbon regeneration, plus the utilities and site work to run them.', image: 'social/explainer-elution-2.png', imageAlt: 'A conceptual electrowinning cell with electrode frames and a separate rectifier.', crop },
      { id: 'carbon', template: 'cover-dark', eyebrow: 'Sizing', headline: 'Size the Plant for Your Carbon Flow', sub: 'If your circuit sends four carbon batches a month and the elution plant handles three, loaded carbon builds up in storage every month.', image: 'social/explainer-elution-3.png', imageAlt: 'Dark granular activated carbon and sealed sample and transport containers.', crop },
      { id: 'budget', template: 'stat', eyebrow: 'Illustrative budget', stat: 'USD 143k', headline: 'Include Site Works in the Budget', sub: 'In an illustrative budget, a USD 80,000 process package rises to USD 143,000 once delivery, site works, engineering, startup and contingency are added.', image: 'social/explainer-elution-4.png', imageAlt: 'Conceptual concrete equipment pads and prepared utility connections.', crop },
      { id: 'toll', template: 'cover-dark', eyebrow: 'Toll treatment', headline: 'Compare Ownership and Toll Treatment', sub: 'A toll processor strips carbon for a fee. Compare its full terms, including sampling, payable recovery and settlement time, with the cost of owning a plant.', image: 'social/explainer-elution-5.png', imageAlt: 'Sealed carbon transport containers, retained samples and a blank custody clipboard.', crop },
      cta('Discuss Elution for Your Circuit', 'When you contact us, please include your carbon batch size, batches per month and current arrangements.'),
    ],
    caption: 'An elution plant takes gold loaded onto carbon towards a saleable product.\n\nThe complete route includes carbon handling, stripping, electrowinning, goldroom work and regeneration. Carbon flow, not daily ore tonnage, sets the size. In an illustrative budget, a USD 80,000 process package becomes USD 143,000 once delivery, site works, engineering, startup and contingency are added. Compare that with a clear toll-treatment offer before choosing.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#GoldElution', '#GoldProcessing', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-32',
    title: 'Renting or Buying Equipment',
    pillar: 'compare',
    status: 'review',
    signOff: 'allan',
    sourceInsight: 'equipment-rental-tanzania',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'Should You Rent or Buy Equipment?', sub: 'Renting can preserve cash for a defined job, while buying can suit sustained use. The answer depends on the period, utilisation and contract terms.', image: 'social/explainer-rental-1.png', imageAlt: 'A parked tracked excavator with handover equipment on a separate bench.', crop },
      { id: 'job', template: 'cover-dark', eyebrow: 'The job', headline: 'Define the Job and Working Hours', sub: 'Describe the duty, start date and expected hours. A generator needs the load, a pump needs the flow and head, and a compressor needs the tool demand.', image: 'social/explainer-rental-2.png', imageAlt: 'A calculator, project binder and rock sample on a planning desk.', crop },
      { id: 'hire', template: 'cover-dark', eyebrow: 'Wet and dry hire', headline: 'Check the Hire Terms', sub: 'Dry hire usually supplies the machine without an operator, while wet hire includes one. Fuel, maintenance, wear parts and insurance still need to be in the contract.', image: 'social/explainer-rental-3.png', imageAlt: 'Equipment keys, a blank checklist and maintenance folder beside a parked generator.', crop },
      { id: 'compare', template: 'stat', eyebrow: 'Illustrative six-month job', stat: 'USD 1,000', headline: 'Resale Value Changes the Result', sub: 'In this example, hire costs USD 15,000 and ownership USD 14,000. If resale falls by USD 5,000, ownership rises to USD 19,000.', image: 'social/explainer-rental-4.png', imageAlt: 'Illustrative six-month costs: hire USD 15,000, ownership USD 14,000, or USD 19,000 with lower resale value.', crop },
      cta('Discuss Rental or Purchase', 'When you contact us, please describe the duty, your location and how long you need the equipment.'),
    ],
    caption: 'A daily hire rate alone does not tell you what a productive hour will cost.\n\nDefine the job and hours, then check exactly what the hire includes. Compare complete costs over the same period: in an illustrative six-month job, hire costs USD 15,000 and ownership USD 14,000, but a USD 5,000 drop in resale value makes ownership USD 19,000. Use written offers and realistic resale assumptions before choosing.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#EquipmentRental', '#MiningEquipment', '#TanzaniaMining', '#BartMining'],
  },

  // ───────────────────────────────── PRODUCTS ─────────────────────────────────

  {
    id: 'IG-33',
    title: 'Shaking Tables',
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: 'What Is a Shaking Table?', headline: 'Gold Separation on a Shaking Table', sub: 'A shaking table moves slurry across a riffled deck while wash water flows over it. Heavy gold travels to one edge, while lighter material washes off the other.', image: 'social/product-shaking-1.png', imageAlt: 'A riffled shaking-table deck, wash-water manifold and separate drive on a steel frame.', note: PRODUCT_NOTE('shaking-table-gold') + ' equipment/shaking-table-gold.jpg is already used in IG-11.', crop: { x: 50, y: 0, zoom: 1 } },
      { id: 'selection', template: 'light-card', eyebrow: 'How Do You Get Good Results?', headline: 'Prepare the Feed for Separation', sub: 'Very fine slimes can make separation harder. Test suitable classification or desliming, then adjust deck slope, stroke and water for the prepared feed.', image: 'social/product-shaking-2.png', imageAlt: 'A stationary shaking-table slope adjustment, drive linkage and riffled deck.', crop: { x: 50, y: 0, zoom: 1 } },
      cta('Discuss Shaking Tables for Your Site', 'For a quotation, please include your feed size, throughput and the concentrator ahead of the table.'),
    ],
    caption: 'A shaking table is the standard final cleaning step in many small gold plants.\n\nA table needs prepared feed and suitable wash water. Test classification or desliming where fine slimes interfere, then adjust deck slope, stroke and water for the ore. Confirm the machine’s feed limits and concentrate quality through test work rather than assuming a universal throughput or a smelt-ready product.\n\n' + BIO_EQUIPMENT + '\n\nFor a quotation, WhatsApp +255 759 141 705 with your feed size, throughput and the concentrator ahead of the table.\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#ShakingTable', '#GoldProcessing', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-34',
    title: 'Wet Pan Mills',
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: 'What Is a Wet Pan Mill?', headline: 'Grinding Ore in a Wet Pan Mill', sub: 'A wet pan mill grinds crushed ore under steel rollers running around a pan with water. It produces a slurry that can go straight to a table or concentrator.', image: 'social/product-wetmill-1.webp', imageAlt: 'A wet pan mill with two upright rollers, central drive and circular pan.', note: PRODUCT_NOTE('wet-pan-mill'), crop },
      { id: 'selection', template: 'light-card', eyebrow: 'How Do You Choose a Pan Mill?', headline: 'Choose a Mill for Your Ore', sub: 'Throughput, ore hardness and the required grind determine the mill duty. Compare the complete pan-mill and ball-mill circuits against your ore tests.', image: 'social/product-wetmill-2.png', imageAlt: 'Two upright steel rollers on a central cross arm inside a circular wet pan mill.', crop: { x: 50, y: 0, zoom: 1 } },
      cta('Discuss Wet Pan Mills for Your Site', 'For a quotation, please include your ore type, daily tonnage and preferred power source.'),
    ],
    caption: 'A wet pan mill grinds crushed ore under heavy rollers with water.\n\nIt is simple to run and repair, and it grinds and slurries the ore in one machine. Pair it with a shaking table or centrifugal concentrator rather than mercury, which loses both mercury and gold to the tailings. Compare a pan mill with a ball mill using your throughput, ore hardness, required grind and the complete circuit cost.\n\n' + BIO_EQUIPMENT + '\n\nFor a quotation, WhatsApp +255 759 141 705 with your ore type, daily tonnage and preferred power source.\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#WetPanMill', '#MercuryFree', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-35',
    title: 'Leaching Tanks',
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: 'What Is a Leaching Tank?', headline: 'Keeping Ore Slurry Suspended', sub: 'Agitation keeps slurry suspended during leaching. CIL combines leaching and carbon adsorption; CIP adds carbon adsorption after leaching.', image: 'social/product-leaching-1.png', imageAlt: 'A conceptual row of agitated tanks with central drives, pipework and guarded walkways.', note: PRODUCT_NOTE('leaching-tank') + ' equipment/leaching-tank.jpg is already used in IG-02.', crop: { x: 50, y: 0, zoom: 1 } },
      { id: 'selection', template: 'light-card', eyebrow: 'How Do You Size a Leaching Tank?', headline: 'Size Tanks from Leach Test Results', sub: 'Feed rate, slurry density and tested residence time set the working volume. Standby power and an engineered restart procedure address settled slurry.', image: 'social/product-leaching-2.png', imageAlt: 'A top-mounted motor and gearbox supporting a vertical tank agitator shaft.', crop: { x: 50, y: 0, zoom: 1 } },
      cta('Discuss Leaching Tanks for Your Site', 'For a quotation, please include your leach test results, daily tonnage and site power supply.'),
    ],
    caption: 'Leaching tanks form the core of a CIL or CIP gold plant.\n\nAgitators keep slurry suspended while gold dissolves. CIL combines leaching and carbon adsorption, while CIP separates those stages. Feed rate, slurry density and leach tests establish the working volume and tank arrangement. If an agitator stops, solids settle quickly and can pack hard, so standby power and a restart procedure matter. Bolted panel tanks ship flat in containers for remote sites.\n\n' + BIO_EQUIPMENT + '\n\nFor a quotation, WhatsApp +255 759 141 705 with your leach test results, daily tonnage and site power supply.\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#LeachingTank', '#CIL', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-36',
    title: 'Submersible Dewatering Pumps',
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: 'What Is a Dewatering Pump?', headline: 'Removing Water from Shafts and Pits', sub: 'A submersible pump sits in the water it removes, so it avoids the priming and suction problems that stop surface pumps in a flooding shaft.', image: 'social/product-dewatering-1.webp', imageAlt: 'A submersible pump with screened intake, discharge connection and electrical cable.', note: PRODUCT_NOTE('submersible-dewatering-pump'), crop },
      { id: 'selection', template: 'light-card', eyebrow: 'How Do You Size a Dewatering Pump?', headline: 'Size Pumps for Flow and Total Head', sub: 'Total head includes vertical lift and pipe losses. Use pump curves at the required flow; intermediate sumps and staged pumping may suit the duty.', image: 'social/product-dewatering-2.png', imageAlt: 'Conceptual transfer from a lower sump through an upper sump to surface discharge; no pump duty or depth specified.', crop: { x: 50, y: 0, zoom: 1 } },
      cta('Discuss Your Dewatering Needs', 'For a quotation, please include your water inflow, shaft depth and discharge route.'),
    ],
    caption: 'A submersible pump keeps shafts and pits workable when water comes in.\n\nSize it on total head, which adds pipe friction to the vertical lift, and allow for wet-season inflow. Use the pump curve at the required flow to compare a direct lift with staged pumping through intermediate sumps. Follow the selected model’s seal inspection schedule and have abnormal oil condition investigated.\n\n' + BIO_EQUIPMENT + '\n\nFor a quotation, WhatsApp +255 759 141 705 with your water inflow, shaft depth and discharge route.\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#Dewatering', '#MiningPumps', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-37',
    title: 'Mine Winches',
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: 'What Does a Mine Winch Do?', headline: 'Hoisting Ore with a Mine Winch', sub: 'A winch winds wire rope to move a skip. Rated line pull, rope capacity, speed and braking must match the hoisting duty and installation.', image: 'social/product-winch-1.webp', imageAlt: 'A wire-rope drum with its motor alongside, connected through a side transmission.', note: PRODUCT_NOTE('5-ton-mine-winch'), crop },
      { id: 'selection', template: 'light-card', eyebrow: 'What Makes a Winch Safe?', headline: 'Check the Braking Requirements', sub: 'A hoisting design needs specified service and emergency braking. Confirm the brake arrangement, protections and inspection schedule with a competent engineer.', image: 'social/product-winch-2.png', imageAlt: 'A stationary winch drum-end braking assembly with its motor alongside the drum.', crop: { x: 50, y: 0, zoom: 1 } },
      cta('Discuss Mine Winches for Your Shaft', 'For a quotation, please include your shaft depth, load and power supply.'),
    ],
    caption: 'A mine winch is part of a permanent hoisting installation, not portable plant.\n\nRated line pull is not enough to specify a hoisting installation. Rope capacity, speed, load, shaft arrangement and braking need an engineered selection. Confirm service and emergency braking, overwind protection and rope inspection requirements for the installation. Permanent hoisting installations also need periodic examination by a competent person, so confirm the requirements for your licence before commissioning.\n\n' + BIO_EQUIPMENT + '\n\nFor a quotation, WhatsApp +255 759 141 705 with your shaft depth, load and power supply.\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#MineWinch', '#MineSafety', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-38',
    title: 'Mining Air Compressors',
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: 'What Does a Mining Compressor Do?', headline: 'Air Supply for Drills and Tools', sub: 'A mining compressor supplies the air for rock drills, pneumatic tools and reverse circulation drilling. Rotary screw machines suit continuous mining duty.', image: 'social/product-compressor-1.png', imageAlt: 'A towable enclosed air compressor with a supported drawbar and secured hose.', note: PRODUCT_NOTE('air-compressor-mining'), crop: { x: 50, y: 0, zoom: 1 } },
      { id: 'selection', template: 'light-card', eyebrow: 'How Do You Size a Compressor?', headline: 'Size the Air Supply for Your Tools', sub: 'Add the specified air demand of tools working at the same time. Allow for duty cycles, leaks and pressure losses at the required operating pressure.', image: 'social/product-compressor-2.png', imageAlt: 'An air-line coupling beside an ultrasonic leak-inspection instrument.', crop: { x: 50, y: 0, zoom: 1 } },
      cta('Discuss Your Compressed Air Needs', 'For a quotation, please include the tools you run, how many work at once and your power source.'),
    ],
    caption: 'A compressor needs to match the tools it will run.\n\nUse each tool’s specified air demand and operating pressure, including the number running at once and the duty cycle. Reverse circulation drilling can need a substantially different compressor duty from hand-held tools. Rotary screw compressors suit continuous mining duty. Leaks commonly waste 20–30% of output on a system that has never been checked, so fixing them is often cheaper than buying more capacity.\n\n' + BIO_EQUIPMENT + '\n\nFor a quotation, WhatsApp +255 759 141 705 with the tools you run, how many work at once and your power source.\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#AirCompressor', '#RockDrilling', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-39',
    title: 'Gas Detection Monitors',
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: 'What Does a Gas Detector Measure?', headline: 'Monitoring Underground Air', sub: 'A four-gas monitor measures oxygen, carbon monoxide, hydrogen sulphide and combustible gas, and alarms by sound, light and vibration.', image: 'social/product-gas-1.webp', imageAlt: 'A portable gas monitor with sensor inlets and a blank display.', note: PRODUCT_NOTE('gas-detection-monitor'), crop },
      { id: 'selection', template: 'light-card', eyebrow: 'How Do You Keep It Reliable?', headline: 'Check the Detector Before Use', sub: 'A bump test checks sensor and alarm response. Use the matching test gas and adapter, and follow the manufacturer’s calibration and replacement schedule.', image: 'social/product-gas-2.png', imageAlt: 'A portable gas monitor with a sensor test cap, hose and regulated test-gas cylinder.', crop: { x: 50, y: 0, zoom: 1 } },
      cta('Discuss Gas Detection for Your Mine', 'For a quotation, please include the number of workers underground and the areas you need to monitor.'),
    ],
    caption: 'A gas detector only protects your team if it is tested and calibrated.\n\nA four-gas monitor measures oxygen, carbon monoxide, hydrogen sulphide and combustible gas. A bump test before every shift confirms the sensors and alarms respond, while calibration on a set schedule corrects drift. Sensor life varies by model, gas exposure and storage conditions; follow the manufacturer’s replacement schedule and investigate failed checks.\n\n' + BIO_EQUIPMENT + '\n\nFor a quotation, WhatsApp +255 759 141 705 with the number of workers underground and the areas you need to monitor.\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#GasDetection', '#MineSafety', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-40',
    title: 'Sluice Boxes and Gold Jigs',
    pillar: 'product',
    status: 'review',
    signOff: 'allan',
    slides: [
      { id: 'cover', template: 'light-card', eyebrow: 'What Do Sluices and Jigs Recover?', headline: 'Recovering Free Gold by Gravity', sub: 'Sluices and jigs use gravity to recover free gold. Feed sizing, gold particle size and the selected machine determine where they fit in the circuit.', image: 'social/product-sluice-1.webp', imageAlt: 'A supported gravity sluice with a feed screen, riffles and capture matting.', note: PRODUCT_NOTE('sluice-box-gold-jig') + ' Check overlap with IG-11 two-mm slide.', crop },
      { id: 'selection', template: 'light-card', eyebrow: 'How Do You Avoid Losing Gold?', headline: 'Adjust the Sluice Water Flow', sub: 'Excess flow can carry gold away, while insufficient flow can bury the riffles. Check the water distribution, slope and clean-up schedule for your feed.', image: 'social/product-sluice-2.png', imageAlt: 'A supported sluice with transverse riffles, capture matting and shallow distributed water.', crop: { x: 50, y: 0, zoom: 1 } },
      cta('Discuss Sluices and Jigs', 'For a quotation, please include your gravel type, throughput and water supply.'),
    ],
    caption: 'Sluices and jigs recover free gold by gravity and can form part of a size-based recovery circuit.\n\nScreening can direct different size fractions to suitable recovery equipment. Confirm the selected machines’ feed limits and test the proposed split; 2 mm is not a universal maximum for centrifugal concentrators. On a sluice, even water flow and the right slope matter more than the box itself. Clean-up is the most exposed point in the plant, so follow a fixed schedule with more than one person present.\n\n' + BIO_EQUIPMENT + '\n\nFor a quotation, WhatsApp +255 759 141 705 with your gravel type, throughput and water supply.\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#SluiceBox', '#AlluvialGold', '#TanzaniaMining', '#BartMining'],
  },
  // ─────────────────────── GUIDES FROM THE SEARCH AUDIT ───────────────────────

  {
    id: 'IG-41',
    title: 'Wet Pan Mill or Ball Mill',
    pillar: 'compare',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'wet-pan-mill-vs-ball-mill',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'Wet Pan Mill or Ball Mill?', sub: 'The right mill depends on how fine your ore must be ground, how many tonnes you treat each day and the power and support your site has.', image: 'social/pan-mill-vs-ball-mill.png', imageAlt: 'A wet pan mill and a ball mill side by side at a small processing site.', crop },
      { id: 'grind', template: 'cover-dark', eyebrow: 'Liberation size', headline: 'Grind Size Comes First', sub: 'A pan mill produces material of about 0.1–0.6 mm, while a ball mill usually grinds to about 75–150 microns. Tests show how fine your gold needs to be ground.', image: 'social/grind-size-sieve-test.png', imageAlt: 'Laboratory sieves holding ground ore of different sizes.', crop },
      { id: 'tonnage', template: 'cover-dark', eyebrow: 'Tonnage', headline: 'Tonnage Is the Second Test', sub: 'Above about 10–15 tonnes a day, one ball mill circuit is usually easier to run than a row of pan mills, because power and labour favour a single grinding line.', image: 'social/row-of-pan-mills.png', imageAlt: 'Several wet pan mills arranged in a row at a processing shed.', crop },
      { id: 'example', template: 'stat', eyebrow: 'Illustrative example', stat: '1 t/h', headline: '20 Tonnes a Day Is 1 Tonne an Hour', sub: 'Over 20 operating hours, 20 tonnes a day means 1 tonne an hour. At an assumed 0.5 t/h per pan mill, two mills would meet the duty if the gold is freed at a coarse size.', image: 'social/mill-duty-calculation.png', imageAlt: 'A blank planning notebook, calculator and pencil beside crushed ore.', crop },
      cta('Choose a Mill for Your Ore', 'When you contact us, please share your tonnes per day, operating hours, power source and any grind test results.'),
    ],
    caption: 'Should you grind with a wet pan mill or a ball mill?\n\nA pan mill is cheaper, simpler and easier to repair. A ball mill grinds finer and more consistently at higher tonnage, but costs more to buy, power and run. Grind and recovery tests show how fine your gold must be ground, and your daily tonnage shows how many machines you would need. Above about 10–15 tonnes a day, one ball mill circuit is usually easier to run.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#BallMill', '#WetPanMill', '#GoldProcessing', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-42',
    title: 'Sizing a Mine Winch and Headframe',
    pillar: 'edu',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'mine-winch-headframe-sizing',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'How Big Should Your Winch Be?', sub: 'Size the hoisting system from the heaviest load on the rope, the trips you need each day and the headframe that carries the rope over the shaft.', image: 'social/shaft-headframe-winch.png', imageAlt: 'A steel headframe over a small mine shaft with a winch house beside it.', crop },
      { id: 'load', template: 'cover-dark', eyebrow: 'Suspended load', headline: 'Count Everything on the Rope', sub: 'Add the bucket, the ore it carries and the rope hanging in the shaft. Rated pull is quoted on the first rope layer and falls as the drum fills.', image: 'social/kibble-loaded-ore.png', imageAlt: 'A steel kibble loaded with ore at the bottom of a shaft.', crop },
      { id: 'trips', template: 'stat', eyebrow: 'Illustrative example', stat: '30 t/day', headline: 'Trips Set the Daily Tonnage', sub: 'On a 100 m shaft at 10 m/min, an assumed 24-minute cycle gives 50 trips in 20 hours. At 600 kg a trip, that is about 30 tonnes a day.', image: 'social/winch-drum-rope.png', imageAlt: 'Wire rope wound on a winch drum.', crop },
      { id: 'sheave', template: 'cover-dark', eyebrow: 'Headframe', headline: 'Match the Sheave to the Rope', sub: 'A sheave at least 60 times the rope diameter limits rope fatigue, so a 12 mm rope needs a sheave of at least 720 mm. An engineer designs the headframe for the rope loads.', image: 'social/headframe-sheave-wheel.png', imageAlt: 'A sheave wheel at the top of a steel headframe.', crop },
      cta('Size Your Hoisting System', 'When you contact us, please send your shaft depth, bucket weight, ore per trip and required tonnes per day.'),
    ],
    caption: 'How big should your mine winch be?\n\nStart with the heaviest load on the rope: the bucket, its ore and the rope itself. Then work out the trips needed for your daily tonnage. In an illustrative 100-metre shaft, a 24-minute cycle gives 50 trips in 20 hours, or about 30 tonnes a day at 600 kg a trip. The sheave must be at least 60 times the rope diameter, and a permanent hoisting installation needs certification and inspection.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#MineWinch', '#UndergroundMining', '#MineSafety', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-43',
    title: 'Dewatering a Deep Shaft',
    pillar: 'edu',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'shaft-dewatering-staged-pumping',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'Keeping a Deep Shaft Dry', sub: 'Measure how much water comes in, size the pumps on total head and stage them once a single lift becomes too high.', image: 'social/flooded-shaft-sump.png', imageAlt: 'A water-filled sump at the bottom of a timbered mine shaft.', crop },
      { id: 'inflow', template: 'cover-dark', eyebrow: 'Inflow', headline: 'Measure the Water Coming In', sub: 'Stop pumping and time how fast the sump fills. A 2 by 2 metre sump rising 0.5 metres in an hour means about 2 cubic metres of inflow an hour.', image: 'social/sump-level-measurement.png', imageAlt: 'A measuring staff standing in a mine sump.', crop },
      { id: 'head', template: 'cover-dark', eyebrow: 'Total head', headline: 'Friction Adds to the Lift', sub: 'A pump must overcome pipe friction as well as the vertical lift. A long, narrow hose can add more resistance than the shaft depth itself.', image: 'social/pump-hose-shaft.png', imageAlt: 'A discharge hose running up the side of a mine shaft.', crop },
      { id: 'stages', template: 'stat', eyebrow: 'Staging', stat: '80 m', headline: 'Stage the Pumps Below 80 m', sub: 'Beyond about 80 metres, pumps in series with an intermediate sump are usually more reliable. A failure then floods one stage rather than the whole shaft.', image: 'social/intermediate-sump-pump.png', imageAlt: 'A submersible pump in an intermediate sump part-way up a shaft.', crop },
      cta('Plan Your Shaft Dewatering', 'When you contact us, please send your measured inflow, shaft depth and pipe route.'),
    ],
    caption: 'Water stops more small underground mines than almost anything else.\n\nMeasure the inflow in both the dry and wet seasons, then size each pump on total head, which is the vertical lift plus pipe friction. Beyond about 80 metres, staging pumps with an intermediate sump is usually more reliable. Plan standby pumps and power for the rains, and check seal oil monthly.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#Dewatering', '#UndergroundMining', '#MiningPumps', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-44',
    title: 'Copper Ore for Small Miners',
    pillar: 'edu',
    status: 'review',
    signOff: 'allan',
    sourceInsight: 'copper-ore-processing-tanzania',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'Chunya Plant Buys Copper Ore from Small-Scale Miners', sub: 'Tanzania’s first modern copper processing plant opened at Chunya in June 2025, and it buys ore from small-scale miners.', image: 'social/copper-oxide-ore.png', imageAlt: 'Green copper oxide ore samples on a sorting table.', note: 'Source: The EastAfrican; Argus (June 2025). Confirm current purchasing terms before posting.', crop },
      { id: 'plant', template: 'stat', eyebrow: 'Chunya plant', stat: '4,000 t', headline: 'Bought From Small Miners Monthly', sub: 'The plant can treat about 31,200 tonnes of ore a month, of which about 4,000 tonnes are bought from small-scale miners across the country.', image: 'social/copper-ore-stockpile.png', imageAlt: 'A stockpile of crushed copper ore at a processing yard.', note: 'Source: The EastAfrican; Argus.', crop },
      { id: 'types', template: 'cover-dark', eyebrow: 'Ore type', headline: 'Oxide and Sulphide Ores Differ', sub: 'Oxide ore is usually leached, while sulphide ore is usually concentrated by flotation. A leach test shows which route suits your ore before you sell or invest.', image: 'social/copper-sulphide-sample.png', imageAlt: 'A metallic copper sulphide ore sample beside a hand lens.', crop },
      { id: 'value', template: 'stat', eyebrow: 'Illustrative example', stat: '450 kg', headline: 'Grade Sets the Copper in a Load', sub: '30 tonnes of ore at 1.5% copper contains 450 kg of copper. The buyer pays for an agreed share of it, so get written terms before you deliver.', image: 'social/ore-truck-weighbridge.png', imageAlt: 'A loaded ore truck on a weighbridge.', crop },
      cta('Plan Your Copper Sampling', 'When you contact us, please tell us where your copper showings are and what assays you have.'),
    ],
    caption: 'Copper is now an option for Tanzanian small-scale miners.\n\nThe copper plant that opened at Chunya in June 2025 buys ore from small-scale miners. Whether selling pays depends on your ore type, grade, the buyer’s written terms and transport. Oxide ore suits leaching, while sulphide ore usually needs flotation. In an illustrative load, 30 tonnes at 1.5% copper contains 450 kg of copper, of which the buyer pays for an agreed share.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\nSources: The EastAfrican; Argus, June 2025. ' + NEWS_NOTE + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#Copper', '#CriticalMinerals', '#SmallScaleMining', '#TanzaniaMining', '#BartMining'],
  },
  {
    id: 'IG-45',
    title: 'Flotation for Graphite and Copper',
    pillar: 'edu',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'flotation-graphite-copper',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'How Flotation Concentrates Graphite and Copper', sub: 'Flotation makes valuable minerals attach to air bubbles and rise into a froth, while the waste stays in the slurry.', image: 'social/flotation-froth-cells.png', imageAlt: 'Mineral-laden froth overflowing from a bank of flotation cells.', crop },
      { id: 'copper', template: 'cover-dark', eyebrow: 'Copper sulphide', headline: 'Copper Floats in Rougher and Cleaner Stages', sub: 'A rougher stage recovers most of the copper, and cleaner stages raise the concentrate grade. Oxide copper usually needs leaching instead.', image: 'social/copper-sulphide-concentrate.png', imageAlt: 'A sample of dark copper sulphide concentrate in a laboratory tray.', crop },
      { id: 'graphite', template: 'cover-dark', eyebrow: 'Flake graphite', headline: 'Graphite Plants Protect the Flakes', sub: 'Large flakes sell for more, so graphite is ground gently and cleaned through several stages to reach a high carbon grade.', image: 'social/graphite-flakes-tray.png', imageAlt: 'Silvery graphite flakes spread on a sample tray.', crop },
      { id: 'example', template: 'stat', eyebrow: 'Illustrative example', stat: '4.1 t/day', headline: 'Grade and Recovery Set the Concentrate', sub: '100 tonnes a day at 1.2% copper, with 85% recovered into a 25% copper concentrate, gives about 4.1 tonnes of concentrate a day.', image: 'social/concentrate-bags-store.png', imageAlt: 'Bagged mineral concentrate stacked in a store.', crop },
      cta('Plan Your Flotation Test Work', 'When you contact us, please share your ore type, sample locations and any test results.'),
    ],
    caption: 'Flotation is the standard way to concentrate copper sulphide ore and flake graphite.\n\nValuable minerals attach to air bubbles and rise into a froth that overflows as concentrate. Copper circuits use rougher and cleaner stages; graphite circuits grind gently and clean several times to keep the flakes large. In an illustrative example, 100 tonnes a day at 1.2% copper gives about 4.1 tonnes of 25% concentrate. Test work on your ore sets the real figures.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#Flotation', '#Graphite', '#Copper', '#CriticalMinerals', '#BartMining'],
  },

  {
    id: 'IG-46',
    title: 'Lithium and Nickel Processing',
    pillar: 'edu',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'lithium-nickel-processing-guide',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'How Lithium and Nickel Ore Become a Product', sub: 'A deposit is valued through the concentrate it can make and the terms a buyer will offer.', image: 'social/pegmatite-core-samples.png', imageAlt: 'Pale pegmatite drill core laid out in core trays.', crop },
      { id: 'lithium', template: 'cover-dark', eyebrow: 'Spodumene', headline: 'Spodumene Is Concentrated to About 6% Li₂O', sub: 'Dense media separation works when spodumene is released at a coarse size; flotation is used when it is only released at finer sizes.', image: 'social/spodumene-crystals.png', imageAlt: 'Pale green spodumene crystals in a rock sample.', crop },
      { id: 'nickel', template: 'cover-dark', eyebrow: 'Nickel sulphide', headline: 'Nickel Is Floated, Then Refined', sub: 'At Kabanga, nickel concentrate is planned to be refined at Kahama into nickel, copper and cobalt products.', image: 'social/nickel-concentrate-sample.png', imageAlt: 'A sample of nickel sulphide concentrate beside a hand lens.', note: 'Source: TanzaniaInvest, June 2026.', crop },
      { id: 'example', template: 'stat', eyebrow: 'Illustrative example', stat: '152 t', headline: 'Concentrate From 1,000 Tonnes of Ore', sub: 'Ore at 1.3% Li₂O, with 70% recovered into a 6% concentrate, gives about 152 tonnes of concentrate per 1,000 tonnes of ore.', image: 'social/ore-to-concentrate-scale.png', imageAlt: 'A large ore stockpile beside a small pile of concentrate.', crop },
      cta('Plan Your Exploration and Test Work', 'When you contact us, please describe your prospect and the drilling and assays completed so far.'),
    ],
    caption: 'Lithium and nickel deposits are valued through the concentrate they can produce.\n\nSpodumene is concentrated to about 6% Li₂O by dense media separation, flotation or both. Nickel sulphide is floated into a concentrate and then refined; at Kabanga, refining is planned at Kahama. In an illustrative example, 1,000 tonnes of ore at 1.3% Li₂O with 70% recovery gives about 152 tonnes of concentrate.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\nSource for Kabanga: TanzaniaInvest, June 2026. ' + NEWS_NOTE + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#Lithium', '#Nickel', '#CriticalMinerals', '#TanzaniaMining', '#BartMining'],
  },

  {
    id: 'IG-47',
    title: 'Gravity and Magnets for Mineral Sands and Gold Concentrates',
    pillar: 'compare',
    status: 'review',
    signOff: 'bartholomew',
    sourceInsight: 'magnetic-vs-gravity-separation',
    slides: [
      { id: 'cover', template: 'photo-overlay', headline: 'Gravity and Magnets for Mineral Sands and Gold Concentrates', sub: 'Gravity removes light sand from heavy minerals. Magnetic separators then sort the concentrate; gold miners use magnets to remove magnetite from black sand.', image: 'social/heavy-mineral-sand.png', imageAlt: 'Dark heavy mineral sand on a beach with lighter sand around it.', crop },
      { id: 'gravity', template: 'cover-dark', eyebrow: 'Density', headline: 'Gravity Removes the Light Sand First', sub: 'Spirals, tables and concentrators turn a large tonnage of sand into a small heavy mineral concentrate.', image: 'social/gravity-spirals-plant.png', imageAlt: 'A bank of gravity spiral concentrators processing sand.', crop },
      { id: 'magnetic', template: 'cover-dark', eyebrow: 'Magnetism', headline: 'Magnets Split the Heavy Minerals', sub: 'Low-intensity drums remove magnetite; high-intensity machines recover weakly magnetic minerals such as ilmenite.', image: 'social/drum-magnet-separator.png', imageAlt: 'A drum magnetic separator with dark magnetic material on the drum.', crop },
      { id: 'gold', template: 'stat', eyebrow: 'Illustrative example', stat: '20 kg', headline: 'A Magnet Cleans Gold Black Sand', sub: 'If 60% of a 50 kg gravity concentrate is magnetite, a magnet leaves about 20 kg to clean and smelt. Gold is not magnetic, so it stays behind.', image: 'social/black-sand-magnet.png', imageAlt: 'A small magnet held above a pan, lifting black sand while gold-coloured specks remain.', crop },
      cta('Separate Your Heavy Minerals', 'When you contact us, please share your sample or concentrate details and the minerals you want to recover.'),
    ],
    caption: 'Gravity or magnetic separation for heavy minerals?\n\nGravity equipment sorts particles by density and removes the light sand. Magnetic separators then split the heavy minerals: magnetite with a low-intensity drum, ilmenite and other weakly magnetic minerals at high intensity. Gold miners can use a magnet to strip magnetite from black sand: in an illustrative 50 kg concentrate that is 60% magnetite, about 20 kg remains to clean and smelt.\n\n' + BIO_GUIDE + '\n\n' + WHATSAPP + '\n\n' + EQUIPMENT_VISUAL_NOTE,
    hashtags: ['#MineralSands', '#MagneticSeparation', '#GoldProcessing', '#TanzaniaMining', '#BartMining'],
  },
]
