# Bart Mining carousel tool

Local tool for formatting Instagram carousels (1080 × 1350) in the Bart Mining
style. Strategy, layout rules and the post plan live in
[`docs/BARTMINING-SOCIAL.md`](../../docs/BARTMINING-SOCIAL.md).

Not part of the website: it is excluded from the site's `tsconfig` and from
Vercel (`.vercelignore`).

## Run it

```bash
cd tools/social-carousel
npm install      # first time only
npm run dev      # opens on http://localhost:5180
```

## Make a post

1. Pick a post on the left (they're listed in publishing order).
2. Edit text in the right panel. The slide updates live.
3. Fix anything flagged in red: headline over 3 lines, `[placeholder]` text,
   missing or low-res images.
4. **Download all** saves numbered PNGs. October posts IG-19–IG-40 use names
   such as `news-gold-1.png`, `explainer-ore-1.png` and `product-wetmill-1.png`.
   Earlier posts retain their existing `IG-11_slide-01.png` naming.
5. **Copy caption** copies the caption plus hashtags, ready to paste into Instagram.

Edits are kept in this browser only. To make them permanent, click
**Copy post as code** and paste the result over that post in
`src/data/posts.ts`.

## Images

The image dropdown shows three folders, and only these:

| Key prefix | Folder | What |
|------------|--------|------|
| `social/` | `tools/social-carousel/images/` | Images sourced or generated for social |
| `equipment/` | `public/equipment/` (the site's stock) | Product photos |
| `equipment/website/` | Selected reviewed illustrations in `public/equipment/website/` | Original catalogue visuals, also copied into numbered October social files |
| `team/` | `public/team/allan-bartholomew.jpg` | The only approved portrait |

**Upload image** in the right panel (on every slide, whatever the template) (click or drag a file onto it) saves the
file straight into `tools/social-carousel/images/` in the repo and puts it on
the current slide. The page reloads briefly to pick it up; edits are kept.

A post can name a `social/…` file that doesn't exist yet. It shows as a
striped **Image needed** block with the filename. Uploading on that slide
saves the file under that exact name, so it fills the gap. You can also copy
files into `images/` by hand.

To frame a photo, drag it in the big preview to move it, and use the
**Composition** sliders to zoom (1–3×) and nudge it. The photo always fills
its frame, and zoom counts towards the "will look soft" warning.

Uploaded images are new files in the repo: commit them along with the posts
that use them.

Rules for new images are in [`images/README.md`](images/README.md).

## Writing style

Write natural, complete sentences, the way you would explain it to a miner in
person. Headlines are in title case, for example **"How to Process Alluvial
Gold during the Rainy Season"**, and questions are fine. Don't use clipped,
staccato fragments or slogans ("Rain isn't the problem. Clay is."). Sub lines
and captions are also full sentences.

Edits you make in the tool are dropped automatically if that post is later
changed in `posts.ts`, so the file always wins.
Filename-only changes migrate saved browser edits, retaining text and crops.

## Templates

| Template | Use |
|----------|-----|
| `photo-overlay` | Default. Full-bleed photo, bottom gradient, headline bottom-left |
| `light-card` | Photo in a framed card, filling it edge to edge (portraits, small product shots) |
| `cover-dark` | Text-led beats, quotes, team posts without a portrait (`mark` = initials). Optional shaded photo behind |
| `stat` | A white figure in a white hairline box + headline, optional shaded photo behind |
| `cta` | End slide with WhatsApp / web / email. Optional shaded photo behind |

Layout numbers (margins, type sizes, gradient) are in `src/slides.css`.
