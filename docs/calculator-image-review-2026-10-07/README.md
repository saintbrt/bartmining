# Calculator layout and CIL/CIP illustration — 7 October 2026

Both calculator pages now use the standard `.px-site` container for the introduction, calculator and explanation sections. Removed the separate 760px prose limit; site width remains 1240px with 32px side padding on desktop and 20px padding on small screens.

Added a shared [LeachTankPlantIllustration](../../src/components/tools/LeachTankPlantIllustration.tsx) below the introduction on both language versions. It shows six agitated tanks, overhead drives, interstage pipes, access walkway and slurry pumps. English and Kiswahili alt text and captions describe the same arrangement and relate it to the working-volume calculation. Calculator values and formulas are unchanged.

- Public asset: `public/tools/cil-cip-tank-train.webp`, 1448 × 1086, 256,790 bytes.
- Master: [master.png](master.png).
- Built-in image generation prompt: [prompt.json](prompt.json).
- Dimensions, checksum and references: [asset.json](asset.json).
- Browser results: [browser-check.json](browser-check.json).

Checked the generic arrangement against Metso's [OKTOP CIL reactor](https://www.metso.com/portfolio/oktop-cil-reactor/) and [gold cyanide leaching process](https://www.metso.com/portfolio/gold-cyanide-leaching-process/) references, which identify agitator systems, tank-top supports, walking platforms and pumps for CIL/CIP applications. The illustration is a tank-stage example, not a complete engineering design, specified model or customer installation. Six tanks illustrate the calculator's initial example; the user selects the required number of tanks.

Production build passed (245 generated pages). Live gold-price and exchange-rate lookups used the existing fallback when their hosts could not resolve in the sandbox. Browser checks passed for both routes at 1920px, 1440px and 390px: introduction, calculator and lower-section widths and padding match exactly; the illustration frame spans the content width; its image loads with contain framing and translated captions; no horizontal overflow or browser errors. Desktop/mobile screenshots accompany this record.

No commit, push or deployment was performed for these changes.
