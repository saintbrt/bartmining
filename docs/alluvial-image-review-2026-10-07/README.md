# Alluvial wash-plant image replacement — 7 October 2026

Replaced the water-recycling article's 600 × 450 JPG with one new catalogue illustration, shared by the English and Kiswahili water-recycling and equipment-cost guides, product pages, equipment directories, proposal picker and social image library.

- Public asset: `public/equipment/website/alluvial-gold-wash-plant-v2.webp` (1448 × 1086 native pixels, 258,012 bytes). The versioned filename refreshes cached image requests.
- Master: [master.png](master.png). Generated with the built-in image tool; encoded using `scripts/prepare-equipment-image.mjs` without enlarging or cropping.
- Exact generation prompt: [prompt.json](prompt.json). Asset checksum and retired-file checksums: [asset.json](asset.json).
- Both previous public files were removed. The original image baseline remains a historical record. Old proposal and social browser keys resolve to the replacement rather than a deleted file; new image pickers list the new key.
- Both languages' descriptions identify the hopper, spray-equipped trommel, twin sluices, water tank and pump. Water-recycling captions explain that settling ponds or a thickener are separate stages. No article figures or technical recommendations changed.

Mechanical arrangement checked against the manufacturer's [MSI T5](https://www.msi-mining.com/t5.html) and [MSI T8](https://www.msi-mining.com/t8.html) descriptions: hopper/feed, trommel, spray manifold and recovery sluices. The image shows fines feeding sluices from beneath the mesh, with coarse gravel leaving through a separate end chute. It illustrates a generic basic wash circuit, not a supplied model, complete project or customer installation.

Validation passed: production website build (245 pages), social tool build, equipment-image audit (53 images), editorial audit (46 English and 13 Kiswahili guides) and Kiswahili directory audit. The website build used its existing fallback when live gold-price and exchange-rate hosts could not resolve in the sandbox.

[Browser checks](browser-check.json) cover eight affected routes at 1440px and 390px: the four guide pages, two product pages and two equipment directories. All replacement images loaded, no deleted file was requested, covers contained the complete machine, and there was no horizontal overflow or browser error. Both retired social image keys resolved to the new, loadable asset. Separate checks verified the catalogue resolver, current proposal key, imported proposal compatibility, label and deletion of both retired files.

Desktop and mobile water-recycling screenshots are saved alongside this record. The unrelated IG-25 headline edit remains intact. No commit, push or deployment was performed for this replacement.
