# Bart Mining editorial standard

Applies to public articles, guides, service explanations and equipment education in English and Kiswahili. A product catalogue, a live price tool and a legal notice can have their own functional layout, but their prose follows the same principles. The purpose is to help a reader make a better decision about a real mining project.

## Start with the reader’s decision

Before drafting, write a brief with five answers:

- Who is reading, and what stage has their project reached?
- What concrete question brought them to this page?
- What should they be able to decide, calculate or prepare after reading?
- What evidence, example and visual will make that possible?
- What cannot yet be answered, and what information would resolve it?

A title is a promise. A cost article must give scoped costs or an honest worked budget, rather than only saying that prices vary. A comparison must explain when each option fits. A how-to guide must reach a usable outcome. A service article must explain the deliverables and how they support a decision.

Example brief for the plant-cost guide: a Tanzanian mine owner assessing a processing investment should leave able to distinguish alluvial from hard-rock plant requirements, separate equipment from startup funding, build a monthly operating model, and prepare the information needed for a project quotation.

## Use a complete narrative

Use this core sequence, with section names adapted to the subject. It is a logical structure, not a requirement to give every article identical headings.

1. **Context and direct answer.** Begin the body with connected paragraphs that establish the situation, answer the main question as far as the evidence allows and explain what the article will cover. Start before the technical detail. Do not open with a statistics strip, a machine list or an unexplained problem.
2. **Explain the choices.** Introduce the relevant concepts and terms, then explain the practical differences and why they matter. For a plant, connect the feed to the process route before discussing equipment prices.
3. **Make the answer usable.** Provide scoped figures, a worked calculation, a comparison, a real example or a clear sequence of work. Walk through what the evidence means for the reader’s decision.
4. **Explain dependencies and omissions.** State what can change the answer and what is outside the example. Place important qualifications beside the relevant claim or number.
5. **Show the next steps.** Explain how the reader can apply the article to their project and which information they need. Use numbered steps for an actual sequence and checklists for items to collect or verify.
6. **Close the argument.** After supporting detail and any FAQs, return to the opening question. State the resulting decision, its conditions and the reader’s immediate next action. The conclusion must make sense without a sales message.
7. **Give the basis and an appropriate contact action.** Provide sources or a basis note where needed. The contact block asks for the information relevant to this subject and follows the substantive conclusion.

FAQs are optional and should answer genuine remaining questions. They cannot replace the main explanation. Region lists and related links should not be the article’s final thought. Avoid repeating a sales pitch in the body and again in the contact block.

## Write sentences that carry the explanation

Use natural, connected language. A paragraph should develop one idea: describe the situation, explain the cause or consequence, and connect it to the project decision. Vary sentence length without using a series of clipped statements for effect.

Prefer concrete subjects and verbs. Explain technical terms on first use and relate them to what a reader will observe, pay for or need to do. Use sentence case for headings and write headings that describe the information beneath them.

Lists are useful for document requirements, equipment inventories, parallel comparisons and ordered actions. Use paragraphs when explaining why something happens or how one issue leads to another. A list of labels followed by fragments is not a substitute for an explanation. A table needs an introduction and a paragraph explaining the important result.

Avoid dramatic assertions, repeated slogans, unsupported superlatives and blanket claims such as “modular always wins” or “a licence means duty exemption.” Avoid presenting a sales promise as a technical conclusion.

**Example of the change:**

> Weak: “Ball mill. Biggest cost. Needs power. Buy spares.”
>
> Better: “The ball mill must grind your ore to the size needed for recovery at the planned feed rate. Harder ore can require more power and a different mill duty, so the equipment price should be compared alongside the expected electricity use and wear-part consumption. Ask the supplier to explain the test results and specifications behind that selection.”

## Publish costs with a traceable basis

Separate equipment supply, delivery, import taxes, site construction and utilities, engineering and installation, commissioning, contingency and operating capital. State the currency, source date, plant type, capacity, operating basis and inclusions. Name significant exclusions beside the table. Distinguish nominal capacity from actual production and never silently compare m³/h with t/day.

Every number must belong to one of these clearly identified categories:

Choose teaching assumptions from a documented, relevant basis rather than inventing large amounts to demonstrate that startup costs can exceed equipment prices. If a package scope or site cost is unknown, show the known subtotal and name the unpriced work. An equipment-and-transport subtotal must not be labelled complete startup funding. Do not attach a capacity or a CIP/CIL configuration to a general equipment estimate without a matching equipment list.

| Category | How to present it |
| --- | --- |
| Current quotation | Identify its date, scope, delivery basis and validity. Do not imply a universal price. |
| Proposal or planning allowance | Explain that it is preliminary and subject to design, site assessment and scope confirmation. |
| Completed-project observation | State what was actually measured and the relevant conditions. Do not call a proposal an installed project. |
| External published price | Link to the original seller, identify the date and specifications, and state what delivery and installation exclude. |
| Worked assumption | Label it beside the figures, show the inputs and arithmetic, and explain what must be replaced by real project data. |

Use client-facing values when drawing on private proposals. Supplier costs, commissions, reserves, margins, staff pay and client-identifying information stay outside public content. Do not import private planner files into the site, commit them, attach a private proposal or expose internal document links. The Chunya editorial snapshot contains only approved client-facing scope and rounded prices; it is manually maintained.

For operating examples, show productive throughput, the operating schedule, load or consumption assumptions, unit prices, fixed expenses and the monthly total. Give cost per consistent feed unit and distinguish processing cost from the full mine cost. Explain working-capital needs separately from construction contingency. Revenue examples need a grade, recovery, feed basis, gold-price date and selling deductions; gross gold value is not profit.

Do not publish a current exchange rate, freight price, tax rate, tariff classification or legal eligibility from memory. Verify changing claims against primary sources and name the date and scope. When a position remains unresolved, explain what must be confirmed. A generic disclaimer does not cure a confident unsupported claim.

## Give English and Kiswahili readers equivalent value

Plan paired articles from the same brief and shared facts. Write idiomatic Kiswahili from the meaning of the explanation, rather than compressing the English into fragments. Explain an English trade term where readers use it, instead of alternating unexplained terminology.

Both versions must contain the same material answer, examples, calculations, scope boundaries and next action. They can use different sentence structures and locally natural phrasing. Keep currencies, dates, units and assumptions synchronised through shared data wherever possible. Identify links to supporting English-only material as such.

Use the common `ArticleLayout` for both languages. Paired guides have reciprocal language links, their own canonical URLs and language-correct structured data. A related equipment product page is not a translation of an article and must not be declared as its language alternate.

Have a fluent Kiswahili editor review substantial translations, particularly technical and financial vocabulary. This review should improve expression without changing the shared facts.

## Use visuals that explain something

Choose a process flow for a sequence, a table for a comparison, and a photo when the reader needs to recognise equipment or a site condition. Explain the visual in a caption. Refer to it in the surrounding prose and provide meaningful alt text.

Use site-owned images or assets whose usage rights and provenance are known. Label catalogue references as references, and distinguish a proposed configuration from an installed project. Do not imply a catalogue image or generated illustration documents an actual customer installation. Prefer simple code-native diagrams for process concepts; label them as concepts rather than detailed engineering designs.

An article does not need a decorative image in every section. Visuals should reduce an actual misunderstanding, such as the difference between washing gravel and milling rock.

## Implementation and review

- English insight bodies live in `src/content/insights/`.
- All five standalone Kiswahili guide bodies live in `src/content/sw/`. `src/data/article-library.ts` supplies their metadata and the language-specific article inventories.
- `/insights` lists English articles. `/insights-swahili` is the central Kiswahili directory: its searchable collection lists the five editorial guides, six town supply guides, six market guides, gold-price tool, generator-rental page and the equipment catalogue. `src/data/swahili-directory.ts` supplies this complete collection. All 19 non-product content pages live beneath `/insights-swahili/`; permanent redirects preserve their former root URLs. Link the directory in the footer without adding it to the main navigation. New Kiswahili content must be placed beneath this directory and listed there.
- `/equipment` and `/equipment-swahili` use matching equipment directory and product-page formats. Kiswahili product copy lives in `src/data/equipment-catalogue-sw.json`, with its catalogue adapter in `src/data/equipment-catalogue-sw.ts`; extended guides live in `src/content/equipment/sw/`. Translate every current product, keeping slugs, photos, technical values and related identities aligned. Link the catalogue from the central Kiswahili directory and footer. The legacy equipment overview redirects to the catalogue; town supply guides now live under `/insights-swahili/vifaa-vya-uchimbaji/`.
- `src/data/insights.ts` carries titles, summaries, dates, covers and any topic-specific contact message.
- `src/data/plant-cost-examples.ts` is the public shared basis for the cost examples. Update both languages by updating this data and checking the prose assumptions too.
- `ArticleLayout` owns the hero, byline, language link, responsive contents, reading width, tables and contact block. `SwInsight` renders the standalone Kiswahili articles, while `SwahiliArticle` adapts other existing JSX guides. Do not add another article layout or per-route typography overrides.
- `prepareArticleHtml` and `prepareArticleNodes` assign server-rendered heading anchors. Contents links must work without waiting for JavaScript.
- Record a revision date only when content materially changes. A prose revision is not proof that every inherited statistic has been reverified; the audit must say what remains.

Before considering an article complete, a reviewer should be able to answer yes to each of these questions: Does the title’s promise get answered? Does the opening establish context? Do paragraphs explain rather than merely enumerate? Is there a usable example or outcome? Are numbers and claims traceable and qualified where they occur? Does the conclusion resolve the opening question? Does the contact action fit the topic? Does the translation carry the same value? Do the page, tables, images and contents work on a phone?

Run `node scripts/audit-editorial.mjs` to check both language inventories for narrative structure, references, source-basis sections, metadata, reading times, image files, related articles and linked section anchors. This is a structural check, not a substitute for reading or factual review. Run TypeScript checks and the production build after changes to shared rendering or data.

Run `node scripts/audit-swahili-directory.mjs` after adding or moving Kiswahili pages. It checks the full directory, sitemap, images, migrated URLs and permanent redirects, and detects Kiswahili page templates outside the two directories. This discovery check complements the registered-article audit; neither certifies every page's editorial quality.
