# Kiswahili public-page inventory — 5 October 2026

This records the live URLs before the subsequent directory migration. See `docs/swahili-directory-migration-2026-10-05.md` for the new canonical locations and redirects. The underlying page counts stay the same.

Checked the current source at commit `ddfb61d`, the live sitemap and every URL below. This is the complete public Kiswahili route inventory found in the current application, rather than only the articles registered in `SWAHILI_ARTICLES`.

**71 active pages returned HTTP 200; one legacy URL returned a 308 redirect.** All 71 active URLs appear in both the source and live sitemaps and have their own matching canonical URL. There are no duplicate URLs in this inventory. Every active page has an incoming body link from another Kiswahili page in this inventory.

## Counts

| Group | Active pages |
| --- | ---: |
| Standalone editorial guides | 5 |
| Gold-price tool | 1 |
| Generator-rental service | 1 |
| Article and equipment directories | 2 |
| Equipment supply by town | 6 |
| Mineral markets by town | 6 |
| Equipment product pages | 50 |
| **Total** | **71** |

## Standalone content pages

These seven pages have independent root URLs. “In article directory” means linked from the body of the live `/insights-swahili` collection, rather than merely appearing in its shared footer.

| URL | Page | Live HTTP | In article directory |
| --- | --- | ---: | --- |
| [/bei-ya-vifaa-vya-uchimbaji](https://bartmining.com/bei-ya-vifaa-vya-uchimbaji) | Bei ya vifaa na gharama za kuanzisha plant ya dhahabu Tanzania | 200 | Yes |
| [/gharama-ya-plant-ya-dhahabu](https://bartmining.com/gharama-ya-plant-ya-dhahabu) | Gharama ya kuanzisha plant ya dhahabu Tanzania | 200 | Yes |
| [/bei-ya-mashine-ya-kusaga-mawe](https://bartmining.com/bei-ya-mashine-ya-kusaga-mawe) | Bei ya mashine ya kusaga mawe ya dhahabu | 200 | Yes |
| [/jinsi-ya-kupata-leseni-ya-pml](https://bartmining.com/jinsi-ya-kupata-leseni-ya-pml) | Jinsi ya kupata leseni ya uchimbaji mdogo (PML) | 200 | Yes |
| [/mrabaha-na-kodi-za-dhahabu](https://bartmining.com/mrabaha-na-kodi-za-dhahabu) | Mrabaha na makato kwenye mauzo ya dhahabu Tanzania | 200 | Yes |
| [/bei-ya-dhahabu-leo](https://bartmining.com/bei-ya-dhahabu-leo) | Bei ya dhahabu leo Tanzania | 200 | No |
| [/jenereta-za-kukodi](https://bartmining.com/jenereta-za-kukodi) | Jenereta za kukodi | 200 | No |

The five editorial guides use `SwInsight → ArticleLayout`. The gold-price page uses a custom price-tool layout; the rental page uses the generator-service layout. A working page and a shared layout do not certify the clarity or completeness of its prose.

### PML guide specifically

The [PML guide](https://bartmining.com/jinsi-ya-kupata-leseni-ya-pml) is live, uses the common article layout, includes contents links, and is linked from both the [Kiswahili article directory](https://bartmining.com/insights-swahili) and the footer. Its route imports `src/content/sw/jinsi-ya-kupata-leseni-ya-pml.ts`. It was included in the earlier registered-article audit. Its content still belongs on the page-by-page editorial review list; its presence in the audit is not proof that it satisfies the reader.

## Directory pages

| URL | Page | Live HTTP |
| --- | --- | ---: |
| [/insights-swahili](https://bartmining.com/insights-swahili) | Makala za uchimbaji kwa Kiswahili | 200 |
| [/equipments-swahili](https://bartmining.com/equipments-swahili) | Vifaa vya uchimbaji | 200 |

Both directories are directly linked in the footer. The current article directory lists five guides, and the equipment directory lists all 50 products.

## Equipment-supply guides by town

| URL | Page | Live HTTP | In article directory |
| --- | --- | ---: | --- |
| [/vifaa-vya-uchimbaji/geita](https://bartmining.com/vifaa-vya-uchimbaji/geita) | Vifaa vya uchimbaji Geita | 200 | No |
| [/vifaa-vya-uchimbaji/kahama](https://bartmining.com/vifaa-vya-uchimbaji/kahama) | Vifaa vya uchimbaji Kahama | 200 | No |
| [/vifaa-vya-uchimbaji/chunya](https://bartmining.com/vifaa-vya-uchimbaji/chunya) | Vifaa vya uchimbaji Chunya | 200 | No |
| [/vifaa-vya-uchimbaji/mwanza](https://bartmining.com/vifaa-vya-uchimbaji/mwanza) | Vifaa vya uchimbaji Mwanza | 200 | No |
| [/vifaa-vya-uchimbaji/tarime](https://bartmining.com/vifaa-vya-uchimbaji/tarime) | Vifaa vya uchimbaji Tarime | 200 | No |
| [/vifaa-vya-uchimbaji/shinyanga](https://bartmining.com/vifaa-vya-uchimbaji/shinyanga) | Vifaa vya uchimbaji Shinyanga | 200 | No |

Generated from `src/data/locations-sw.ts` through `src/app/vifaa-vya-uchimbaji/[town]/page.tsx`. They use `SwahiliArticle → ArticleLayout` and are discoverable through the Kiswahili equipment directory. They are absent from `SWAHILI_ARTICLES` and from the registered-article editorial audit.

## Mineral-market guides by town

| URL | Page | Live HTTP | In article directory |
| --- | --- | ---: | --- |
| [/soko-la-madini/geita](https://bartmining.com/soko-la-madini/geita) | Soko la Madini Geita: Bei ya Dhahabu Leo | 200 | No |
| [/soko-la-madini/chunya](https://bartmining.com/soko-la-madini/chunya) | Soko la Madini Chunya: Bei ya Dhahabu Leo | 200 | No |
| [/soko-la-madini/kahama](https://bartmining.com/soko-la-madini/kahama) | Soko la Madini Kahama: Bei ya Dhahabu Leo | 200 | No |
| [/soko-la-madini/mwanza](https://bartmining.com/soko-la-madini/mwanza) | Soko la Madini Mwanza: Bei ya Dhahabu Leo | 200 | No |
| [/soko-la-madini/songwe](https://bartmining.com/soko-la-madini/songwe) | Soko la Madini Songwe: Bei ya Dhahabu Leo | 200 | No |
| [/soko-la-madini/katavi](https://bartmining.com/soko-la-madini/katavi) | Soko la Madini Katavi (Mpanda): Bei ya Dhahabu Leo | 200 | No |

Generated from `src/data/markets.ts` through `src/app/soko-la-madini/[town]/page.tsx`. They use `SwahiliArticle → ArticleLayout` and are linked through the gold-price page, other market pages and relevant town pages. They are absent from `SWAHILI_ARTICLES` and from the registered-article editorial audit.

## Confirmed gaps in the previous review

- The registered-article audit covers 38 English and five Kiswahili articles. It does not review these six supply guides or six market guides. Checking their routes and links during the equipment work did not constitute a full prose review.
- The twelve town and market guides share the article renderer, but their templates do not supply a dedicated substantive conclusion or source/basis section. Their existing related-area lists and FAQs lead into the contact block. They need individual review for narrative flow, evidence and a useful ending.
- The gold-price tool and generator-rental service sit outside the article inventory. Their explanatory copy needs its own content review even where their functional layouts remain appropriate.
- The seven standalone content pages, twelve town/market guides and fifty product pages should each have a recorded content-review status. HTTP, sitemap and layout checks should remain separate from editorial approval.

## Full equipment-product inventory

All 50 pages are live at their own canonical URLs and linked from `/equipments-swahili`. They use the translated equipment format and remain separate from the article collection.

| URL | Kiswahili product name | Live HTTP |
| --- | --- | ---: |
| [/equipments-swahili/hydraulic-excavator](https://bartmining.com/equipments-swahili/hydraulic-excavator) | Mashine ya kuchimba yenye mfumo wa majimaji (excavator) | 200 |
| [/equipments-swahili/wheel-loader](https://bartmining.com/equipments-swahili/wheel-loader) | Mashine ya kupakia yenye matairi (wheel loader) | 200 |
| [/equipments-swahili/dump-truck](https://bartmining.com/equipments-swahili/dump-truck) | Lori la kumwaga mzigo (dump truck) | 200 |
| [/equipments-swahili/bulldozer](https://bartmining.com/equipments-swahili/bulldozer) | Mashine ya kusukuma udongo (bulldozer) | 200 |
| [/equipments-swahili/motor-grader](https://bartmining.com/equipments-swahili/motor-grader) | Mashine ya kusawazisha barabara (motor grader) | 200 |
| [/equipments-swahili/backhoe-loader](https://bartmining.com/equipments-swahili/backhoe-loader) | Mashine ya kupakia na kuchimba (backhoe loader) | 200 |
| [/equipments-swahili/vibratory-roller](https://bartmining.com/equipments-swahili/vibratory-roller) | Mashine ya kushindilia yenye mtetemo (vibratory roller) | 200 |
| [/equipments-swahili/tower-crane](https://bartmining.com/equipments-swahili/tower-crane) | Kreni ya mnara (tower crane) | 200 |
| [/equipments-swahili/concrete-mixer](https://bartmining.com/equipments-swahili/concrete-mixer) | Lori la kuchanganya zege (concrete mixer) | 200 |
| [/equipments-swahili/cone-crusher](https://bartmining.com/equipments-swahili/cone-crusher) | Mashine ya kuponda ya koni (cone crusher) | 200 |
| [/equipments-swahili/hammer-mill](https://bartmining.com/equipments-swahili/hammer-mill) | Mashine ya kuponda kwa nyundo (hammer mill) | 200 |
| [/equipments-swahili/wet-pan-mill](https://bartmining.com/equipments-swahili/wet-pan-mill) | Kinu cha kusaga kwa maji (wet pan mill) | 200 |
| [/equipments-swahili/vibrating-screen](https://bartmining.com/equipments-swahili/vibrating-screen) | Kichujio cha mawe chenye mtetemo (vibrating screen) | 200 |
| [/equipments-swahili/trommel-screen](https://bartmining.com/equipments-swahili/trommel-screen) | Kichujio cha ngoma kinachozunguka (trommel) | 200 |
| [/equipments-swahili/belt-conveyor](https://bartmining.com/equipments-swahili/belt-conveyor) | Mkanda wa kusafirisha mawe (belt conveyor) | 200 |
| [/equipments-swahili/hydrocyclone](https://bartmining.com/equipments-swahili/hydrocyclone) | Kitenganishi cha chembe kwa mzunguko wa tope (hydrocyclone) | 200 |
| [/equipments-swahili/filter-press](https://bartmining.com/equipments-swahili/filter-press) | Mashine ya kukamua maji ya tope (filter press) | 200 |
| [/equipments-swahili/vibrating-feeder](https://bartmining.com/equipments-swahili/vibrating-feeder) | Kifaa cha kulisha mawe kwa mtetemo (vibrating feeder) | 200 |
| [/equipments-swahili/pneumatic-rock-drill](https://bartmining.com/equipments-swahili/pneumatic-rock-drill) | Mashine ya kutoboa mwamba kwa hewa (pneumatic rock drill) | 200 |
| [/equipments-swahili/lighting-tower](https://bartmining.com/equipments-swahili/lighting-tower) | Mnara wa taa (lighting tower) | 200 |
| [/equipments-swahili/rotary-scrubber](https://bartmining.com/equipments-swahili/rotary-scrubber) | Ngoma ya kuosha na kuvunja udongo (rotary scrubber) | 200 |
| [/equipments-swahili/sluice-box-gold-jig](https://bartmining.com/equipments-swahili/sluice-box-gold-jig) | Mfereji na jig za kutenganisha dhahabu (sluice na jig) | 200 |
| [/equipments-swahili/alluvial-gold-wash-plant](https://bartmining.com/equipments-swahili/alluvial-gold-wash-plant) | Mtambo wa kuosha dhahabu ya alluvial | 200 |
| [/equipments-swahili/1-ton-winch](https://bartmining.com/equipments-swahili/1-ton-winch) | Winchi ya tani 1 | 200 |
| [/equipments-swahili/2-ton-winch](https://bartmining.com/equipments-swahili/2-ton-winch) | Winchi ya tani 2 | 200 |
| [/equipments-swahili/5-ton-mine-winch](https://bartmining.com/equipments-swahili/5-ton-mine-winch) | Winchi ya mgodi ya tani 5 | 200 |
| [/equipments-swahili/mine-hoist-headframe](https://bartmining.com/equipments-swahili/mine-hoist-headframe) | Hoist na mnara wa shimo la mgodi (headframe) | 200 |
| [/equipments-swahili/wire-rope-slings-lifting-tackle](https://bartmining.com/equipments-swahili/wire-rope-slings-lifting-tackle) | Waya, mikanda na vifaa vya kuinua mizigo | 200 |
| [/equipments-swahili/centrifugal-gold-concentrator](https://bartmining.com/equipments-swahili/centrifugal-gold-concentrator) | Kitenganishi cha dhahabu kwa nguvu ya mzunguko (centrifugal concentrator) | 200 |
| [/equipments-swahili/gold-elution-electrowinning-plant](https://bartmining.com/equipments-swahili/gold-elution-electrowinning-plant) | Mtambo wa elution na electrowinning | 200 |
| [/equipments-swahili/cil-cip-plant](https://bartmining.com/equipments-swahili/cil-cip-plant) | Mitambo ya dhahabu ya CIL na CIP | 200 |
| [/equipments-swahili/leaching-tank](https://bartmining.com/equipments-swahili/leaching-tank) | Tanki la kuyeyusha dhahabu lenye kichanganyio (leaching tank) | 200 |
| [/equipments-swahili/modular-gold-plant](https://bartmining.com/equipments-swahili/modular-gold-plant) | Mtambo wa dhahabu wa moduli | 200 |
| [/equipments-swahili/ball-mill-gold-ore](https://bartmining.com/equipments-swahili/ball-mill-gold-ore) | Kinu cha mipira cha kusaga mawe (ball mill) | 200 |
| [/equipments-swahili/jaw-crusher](https://bartmining.com/equipments-swahili/jaw-crusher) | Mashine ya kuponda kwa taya (jaw crusher) | 200 |
| [/equipments-swahili/shaking-table-gold](https://bartmining.com/equipments-swahili/shaking-table-gold) | Meza ya kutikisa ya dhahabu (shaking table) | 200 |
| [/equipments-swahili/rc-drilling-rig](https://bartmining.com/equipments-swahili/rc-drilling-rig) | Mtambo wa kuchimba sampuli kwa reverse circulation (RC) | 200 |
| [/equipments-swahili/gold-metal-detector](https://bartmining.com/equipments-swahili/gold-metal-detector) | Kigunduzi cha metali kwa utafutaji wa dhahabu | 200 |
| [/equipments-swahili/slurry-pump](https://bartmining.com/equipments-swahili/slurry-pump) | Pampu ya tope (slurry pump) | 200 |
| [/equipments-swahili/submersible-dewatering-pump](https://bartmining.com/equipments-swahili/submersible-dewatering-pump) | Pampu ya kuzamishwa ya kutoa maji mgodini | 200 |
| [/equipments-swahili/mining-safety-helmet-cap-lamp](https://bartmining.com/equipments-swahili/mining-safety-helmet-cap-lamp) | Kofia ya usalama na taa ya mgodini | 200 |
| [/equipments-swahili/self-contained-self-rescuer](https://bartmining.com/equipments-swahili/self-contained-self-rescuer) | Kifaa cha kujinusuru cha kupumua (SCSR) | 200 |
| [/equipments-swahili/gas-detection-monitor](https://bartmining.com/equipments-swahili/gas-detection-monitor) | Kipima gesi mbalimbali (multi-gas monitor) | 200 |
| [/equipments-swahili/fall-arrest-harness](https://bartmining.com/equipments-swahili/fall-arrest-harness) | Mkanda wa mwili wa kuzuia athari za kuanguka (fall arrest harness) | 200 |
| [/equipments-swahili/mine-ventilation-fan](https://bartmining.com/equipments-swahili/mine-ventilation-fan) | Feni ya uingizaji hewa mgodini | 200 |
| [/equipments-swahili/mine-management-software](https://bartmining.com/equipments-swahili/mine-management-software) | Programu ya usimamizi wa mgodi | 200 |
| [/equipments-swahili/fleet-management-system](https://bartmining.com/equipments-swahili/fleet-management-system) | Mfumo wa kufuatilia magari na mitambo (fleet management) | 200 |
| [/equipments-swahili/geological-modelling-software](https://bartmining.com/equipments-swahili/geological-modelling-software) | Programu ya modeli za jiolojia na rasilimali | 200 |
| [/equipments-swahili/diesel-generator-mining](https://bartmining.com/equipments-swahili/diesel-generator-mining) | Jenereta ya dizeli kwa mgodi | 200 |
| [/equipments-swahili/air-compressor-mining](https://bartmining.com/equipments-swahili/air-compressor-mining) | Compressor ya hewa kwa mgodi | 200 |

## Legacy overview

[`/vifaa-vya-uchimbaji`](https://bartmining.com/vifaa-vya-uchimbaji) returns **308** to `/equipments-swahili`. It is excluded from the active-page count and sitemap. The six nested town pages retain their URLs.

## Verification and limits

The inventory was reconciled against `src/app` routes, article metadata, dynamic town/market/product data, the generated sitemap, footer links and the live HTML. English pages containing a Kiswahili gateway or language link, including the homepage and contact page, are not separate Kiswahili pages and are excluded. No additional legacy HTML page files were found among the current public route sources.

Live checks confirm status, canonical URL, article-layout markers and article-directory body links. They do not establish native-language editorial quality, legal accuracy or model-specific equipment performance. This pass records the inventory and observed gaps; it does not rewrite or publish the pages.

Raw verification results are temporarily available at `/private/tmp/bart-swahili-inventory-2026-10-05.json`.
