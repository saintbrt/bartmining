# Image Brief: Generator Rental Pages

**For:** Codex (or any image generator), working in this repo.
**Pages:** bartmining.com/generator-rental, the ten town pages under it, and /jenereta-za-kukodi.
**Save to:** `public/generator-rental/` using the **exact file names below**. The pages pick each image up automatically at the next deploy; no code changes are needed. Until a file exists, its page shows the main hero image (towns) or nothing (size bands).

---

## Rules (must follow)

1. **Generated images only.** No stock photos, no photos of real people, sites, yards or equipment (Bart Mining security policy).
2. **No people.** Equipment and settings only. No faces, no silhouettes of workers.
3. **No logos, brand names or readable text** on the generators, containers, trucks or signs. No manufacturer badges (no CAT, Cummins, Perkins, etc.).
4. **No real, recognisable places or buildings.** The setting should feel East African (red laterite soil, acacia, green hills, coastal light) without being a specific landmark.
5. **Realistic, documentary style.** Natural daylight, believable scale, clean industrial equipment. Not glossy advertising, not illustration, not 3D-render look.
6. **Muted colours.** The site is white with black, grey and a muted gold accent. Avoid saturated reds, blues and greens in the equipment. Generators in grey, off-white or dark green are ideal.
7. **Landscape, high resolution.** Hero and town images **1600 × 1200 px (4:3)** minimum. Size band images **1200 × 900 px (4:3)**. Save as `.jpg` (quality around 85) or `.webp`. Keep each file under about 500 KB.
8. **Keep the subject in the middle 80%.** The page crops slightly on phones.

---

## Images

### Main hero
| File | Shows |
|---|---|
| `generator-rental-hero.jpg` | A large **containerised diesel generator** (a 20 or 40 ft container-style enclosure with exhaust stack and side vents) on a mine or processing site in Tanzania. Red earth, a processing plant or conveyor softly in the background, clear morning light. Cables running neatly to a distribution panel. |

### Town heroes (one per town page)
| File | Town | Shows |
|---|---|---|
| `town-dar-es-salaam.jpg` | Dar es Salaam | Containerised generator powering a **building construction site** in a warm coastal city: tower crane, concrete frame, palm trees, humid bright light. No identifiable skyline. |
| `town-mwanza.jpg` | Mwanza | Generator at an **industrial or processing site near a large lake**, with the rounded granite boulders typical of the Lake Victoria shore in the background. |
| `town-geita.jpg` | Geita | Diesel generator supplying a **gold processing plant** (ball mill, tanks, conveyors) in green rolling hills with red soil. |
| `town-arusha.jpg` | Arusha | Containerised generator providing **standby power at a hotel or lodge**, green gardens, a large mountain softly in the far background. No recognisable hotel. |
| `town-dodoma.jpg` | Dodoma | Generator powering a **large building construction site** in a dry, open central-plateau landscape, tower crane, pale sky. |
| `town-mbeya.jpg` | Mbeya | Generator beside a **gold processing plant in highland country**: green hills, misty mountains, red earth. |
| `town-morogoro.jpg` | Morogoro | Containerised generator at an **agro-processing plant or sugar estate**, fields and mountains behind. |
| `town-tanga.jpg` | Tanga | Generator at an **industrial site near the coast**: warehouses, coconut palms, flat coastal land. |
| `town-kahama.jpg` | Kahama | **Two containerised generators side by side** (running synchronised) beside a gold processing plant with leach tanks. |
| `town-mtwara.jpg` | Mtwara | Containerised generator supplying an **industrial or construction site** in southern coastal Tanzania: flat land, cashew trees, bright light. |

### Size bands (shown above the size table)
| File | Shows |
|---|---|
| `band-300-500.jpg` | A **fully enclosed containerised** diesel generator of around 400 kVA beside a small alluvial wash plant. Securely mounted on a continuous level concrete plinth, with closed service doors, ventilation grilles and neatly routed power cables to a distribution cabinet. |
| `band-500-1000.jpg` | A **single containerised generator** of around 800 kVA beside a crushing and milling circuit. |
| `band-1000-2500.jpg` | **Two or three containerised generators in a row**, with a synchronising panel, at a large processing plant. |

---

## Handing back

1. Save the files in `public/generator-rental/` with the names above.
2. Tell Claude in Claude Code: "images are in". Claude checks every page on desktop and phone, then commits and (with your go-ahead) pushes.
3. To replace an image later, overwrite the file with the same name and redeploy.

Swahili page `/jenereta-za-kukodi` reuses `generator-rental-hero`. No separate image needed.
