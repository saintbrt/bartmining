# Bart Mining

Marketing website and internal data platform for Bart Mining — a principal-led mining consultancy and equipment supplier based in Dar es Salaam, Tanzania, operating across East & Southern Africa.

**Live site:** [bartmining.com](https://www.bartmining.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3 + inline React styles |
| Auth & DB | Supabase |
| Email | Resend |
| Hosting | Vercel |
| Fonts | Sora, Manrope, Space Mono (Google Fonts) |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Homepage
│   ├── about/                  # About page
│   ├── services/               # Services page
│   ├── products/               # Products & equipment page
│   ├── sustainability/         # ESG & sustainability page
│   ├── contact/                # Contact page
│   ├── insights/               # Insights hub + article pages
│   │   └── [slug]/             # Dynamic article pages
│   ├── admin/                  # Internal GoldPass tool (auth-protected)
│   │   ├── login/
│   │   └── (dashboard)/        # Dashboard, analysis, validation, outputs
│   ├── api/
│   │   └── contact/            # Contact form API endpoint (Resend)
│   └── globals.css             # Global styles, design tokens, utility classes
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/               # Page section components
│   │   ├── HeroSection.tsx
│   │   ├── MarqueeSection.tsx
│   │   ├── ServiceGrid.tsx
│   │   ├── EquipGrid.tsx
│   │   ├── PhasesSection.tsx
│   │   ├── PillarsSection.tsx
│   │   ├── RegionsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── CtaSection.tsx
│   ├── insights/
│   │   ├── HubClient.tsx       # Searchable & filterable article grid
│   │   ├── TableOfContents.tsx
│   │   └── ReadingProgress.tsx
│   ├── goldpass/               # Internal GoldPass data tool components
│   └── ui/
│       ├── Reveal.tsx          # Scroll-triggered fade-in animation
│       └── Counter.tsx         # Animated stat counters
│
├── content/
│   └── insights/               # Article content files (TypeScript)
│
└── data/                       # Static data arrays
    ├── insights.ts             # Article metadata (20+ articles)
    ├── services.ts             # 6 core services
    ├── equipment.ts            # Mining equipment catalog
    ├── regions.ts              # East & Southern Africa coverage
    ├── phases.ts               # Project methodology phases
    ├── pillars.ts              # ESG/values pillars
    └── testimonials.ts         # Client testimonials
```

---

## Pages

### Public Marketing Site

| Route | Description |
|---|---|
| `/` | Homepage — hero, services, methodology, founder, ESG, regions, testimonials |
| `/about` | About Bart Mining — founder bio, career history, stats, who we serve |
| `/services` | Full-lifecycle service offering |
| `/products` | Mining machinery & processing plants — equipment grid |
| `/sustainability` | ESG approach, environmental & social commitments |
| `/contact` | Contact form (submits via Resend email API) |
| `/insights` | Knowledge centre — searchable, filterable article hub |
| `/insights/[slug]` | Individual articles with reading progress & table of contents |

### Admin — GoldPass (Internal)

Protected by Supabase auth middleware. Accessible at `/admin`.

| Route | Description |
|---|---|
| `/admin/login` | Authentication |
| `/admin/dashboard` | Main dashboard |
| `/admin/analysis` | Data analysis |
| `/admin/cleaning` | Data cleaning & processing |
| `/admin/validation` | Data validation & QC |
| `/admin/visualization` | Data visualisation |
| `/admin/outputs` | Export & output management |
| `/admin/settings` | Configuration |

---

## Design System

Design tokens are defined as CSS custom properties in `src/app/globals.css`.

### Colour Palette

| Token | Value | Usage |
|---|---|---|
| `--gold` | `#AE8A4C` | Primary accent |
| `--gold-2` | `#C7A86C` | Lighter gold |
| `--gold-hi` | `#E4D3AB` | Cream-gold (buttons) |
| `--gold-deep` | `#8A6C36` | Deep gold, eyebrow labels |
| `--slate` | `#20262A` | Dark backgrounds |
| `--ink` | `#1C1A16` | Primary text |
| `--ink-2` | `#5A5648` | Secondary text |
| `--ink-3` | `#8A8278` | Muted text |
| `--bg` | `#F7F6F3` | Page background |
| `--paper` | `#F2EFE8` | Section background (warm off-white) |

### Key CSS Classes

| Class | Description |
|---|---|
| `.px-site` | Max-width container (1240px, centred, 32px side padding) |
| `.sec-gap` | Standard section padding (100px top/bottom) |
| `.btn-gold` | Primary CTA button (cream-gold `#E4D3AB`, slate text) |
| `.btn-ink` | Dark filled button |
| `.btn-ghost` | Outlined button |
| `.eyebrow` | Small uppercase section label |
| `.grad` | Gold gradient text highlight |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (for admin auth)
- A Resend account (for contact form emails)

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=hello@bartmining.com
```

### Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Content Management

### Adding an Article

1. Create the content file: `src/content/insights/your-article-slug.ts`
2. Add the metadata entry to `src/data/insights.ts` (slug, title, description, tags, category, image, date, readTime)

The article will automatically appear in the insights hub and get its own page at `/insights/your-article-slug`.

### Updating Services or Equipment

Edit the arrays in `src/data/services.ts` or `src/data/equipment.ts`. Changes reflect across all pages that use those components.

---

## Deployment

The site is deployed on **Vercel** and connects to the `main` branch. Push to `main` to trigger a production deploy.

The `/admin` routes are protected by `src/middleware.ts` which checks Supabase session cookies and redirects unauthenticated requests to `/admin/login`.
