# Consolidated Kiswahili directory — 5 October 2026

The current instruction is to put Kiswahili pages in their directory rather than leave separate root URLs. This migration moves all 19 non-product content pages beneath `/insights-swahili/`, keeps the 50 equipment products beneath `/equipments-swahili/`, and makes the central Kiswahili directory the entry point for all of them.

## Directory and URL structure

- `/insights-swahili` lists five editorial guides, the gold-price tool, generator-rental service, six town supply guides, six market guides and a card opening the complete equipment catalogue. There are 20 directory entries: 19 content pages and one catalogue.
- `/equipments-swahili` lists the 50 translated products. It and its product pages link back to the central Kiswahili directory.
- The footer offers the central Kiswahili directory and equipment catalogue. Neither is added to the main navigation.
- There remain 71 active Kiswahili pages in total. Functional page layouts are retained: consolidation changes their addresses and discovery, not the tools or service functions.

## Canonical URL migration

Every old URL below has a permanent 308 redirect. Existing query parameters and section fragments are preserved when following the redirect.

| Former URL | New canonical URL |
| --- | --- |
| /bei-ya-vifaa-vya-uchimbaji | /insights-swahili/bei-ya-vifaa-vya-uchimbaji |
| /gharama-ya-plant-ya-dhahabu | /insights-swahili/gharama-ya-plant-ya-dhahabu |
| /bei-ya-mashine-ya-kusaga-mawe | /insights-swahili/bei-ya-mashine-ya-kusaga-mawe |
| /jinsi-ya-kupata-leseni-ya-pml | /insights-swahili/jinsi-ya-kupata-leseni-ya-pml |
| /mrabaha-na-kodi-za-dhahabu | /insights-swahili/mrabaha-na-kodi-za-dhahabu |
| /bei-ya-dhahabu-leo | /insights-swahili/bei-ya-dhahabu-leo |
| /jenereta-za-kukodi | /insights-swahili/jenereta-za-kukodi |
| /vifaa-vya-uchimbaji/geita | /insights-swahili/vifaa-vya-uchimbaji/geita |
| /vifaa-vya-uchimbaji/kahama | /insights-swahili/vifaa-vya-uchimbaji/kahama |
| /vifaa-vya-uchimbaji/chunya | /insights-swahili/vifaa-vya-uchimbaji/chunya |
| /vifaa-vya-uchimbaji/mwanza | /insights-swahili/vifaa-vya-uchimbaji/mwanza |
| /vifaa-vya-uchimbaji/tarime | /insights-swahili/vifaa-vya-uchimbaji/tarime |
| /vifaa-vya-uchimbaji/shinyanga | /insights-swahili/vifaa-vya-uchimbaji/shinyanga |
| /soko-la-madini/geita | /insights-swahili/soko-la-madini/geita |
| /soko-la-madini/chunya | /insights-swahili/soko-la-madini/chunya |
| /soko-la-madini/kahama | /insights-swahili/soko-la-madini/kahama |
| /soko-la-madini/mwanza | /insights-swahili/soko-la-madini/mwanza |
| /soko-la-madini/songwe | /insights-swahili/soko-la-madini/songwe |
| /soko-la-madini/katavi | /insights-swahili/soko-la-madini/katavi |

The exact old overview `/vifaa-vya-uchimbaji` continues to redirect to `/equipments-swahili`. Its former nested town URLs redirect to the town guides beneath `/insights-swahili`.

## Connected metadata and links

Article metadata, body links, related guides, English language alternates, town/market cross-links, rental-service structured data, breadcrumbs, homepage links, footer links, sitemap and `llms.txt` now use the new canonical locations. Article section identifiers remain unchanged. New Kiswahili content must be placed beneath the appropriate directory and included in `src/data/swahili-directory.ts`.

The directory keeps the existing searchable card format. Town and market pages can be found by location or topic; the service filter opens generator rental. Cards without tracked editorial dates do not invent publication or revision dates.

## Validation

Production build and TypeScript pass. The existing registered-article audit passes for 38 English and five Kiswahili articles. Integration checks verify all 71 active Kiswahili routes, the 19 migrated URLs, the legacy overview, canonicals, directory entries, sitemap, machine-readable links and reciprocal language alternates. Browser review checks phone and desktop layouts, search, filters, section links and redirects.

All checks passed: 71 active routes, 19 page migrations and 48 browser-page checks at 390 px and 1440 px. No horizontal overflow, missing section links or JavaScript errors were found. Directory search finds the PML guide; filters find all twelve town/market guides and the generator service. The old PML URL preserves its `#pml` fragment and query parameters. Temporary screenshots and the integration report are in `/private/tmp/bart-sw-migration/`.

`node scripts/audit-swahili-directory.mjs` is the persistent discovery check. It covers the directory's 20 entries, source sitemap, images, legacy redirects, all 50 product URLs and misplaced Kiswahili route templates.

## Editorial scope

This is a routing and discovery migration. The twelve town/market guides remain outside the registered HTML article audit, although they are now fully listed in the Kiswahili directory. Their fuller prose, source-basis and conclusion review identified in `docs/swahili-page-inventory-2026-10-05.md` remains separate work. Listing a page in the directory does not certify its content.

Deployment should be verified separately after this migration is pushed to `main`.
