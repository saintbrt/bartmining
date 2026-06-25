# Bart Mining — Master Project Reference

**Live site:** bartmining.com  
**Internal tool:** GoldPass (at `/admin`)  
**Repo:** `bartmining` monorepo (Next.js 15 + Expo mobile app + shared packages)

This document is the authoritative guide and map for the entire project. It covers every section of the platform, the database schema, edge functions, mobile app, design system, and the full list of known issues. Use it as the single source of truth when building or reviewing any part of the codebase.

---

## 1. Platform Overview

Three interconnected surfaces:

| Surface | Stack | Audience |
|---|---|---|
| **Public marketing site** | Next.js 15 / Tailwind | Clients, investors, leads |
| **GoldPass admin dashboard** | Next.js 15 / Supabase / Claude AI | Geologists, data managers (internal) |
| **GoldPass mobile app** | Expo / React Native / Supabase | Field survey teams on Android tablets |

The marketing site and admin dashboard share one Next.js deployment on Vercel. The mobile app is a separate Expo project under `apps/mobile/`. All three communicate with the same Supabase project (Postgres + Auth + Storage + Edge Functions + Realtime).

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5.19 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3 + custom CSS tokens (public site); inline React styles + `admin.css` (admin) |
| Database | Supabase (Postgres + RLS + Edge Functions) |
| Auth | Supabase Auth (email/password + Google OAuth + device code flow) |
| Storage | Supabase Storage (`survey-photos` bucket) |
| Realtime | Supabase Realtime (Postgres CDC → `device_positions` → Live Map) |
| AI | Anthropic Claude (`claude-sonnet-4-6`) via Supabase Edge Function |
| Maps | Mapbox GL JS v3.3.0 (admin, CDN-loaded); `@rnmapbox/maps` (mobile) |
| Push notifications | Firebase Cloud Messaging (FCM HTTP v1) |
| Email | Resend v3.2.0 |
| Excel | SheetJS (`xlsx` v0.18.5, lazy-loaded) |
| Mobile | Expo / React Native (Android target; EAS Build) |
| Local storage (mobile) | SQLite via `expo-sqlite` (offline queue) |
| Hosting | Vercel (site + admin) + Expo EAS (mobile) |
| Fonts | Sora (headings), Manrope (body), Space Mono (eyebrow labels) |

**`package.json` dependencies:**
```json
{
  "@supabase/ssr": "^0.5.2",
  "@supabase/supabase-js": "^2.49.4",
  "next": "15.5.19",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "resend": "^3.2.0",
  "xlsx": "^0.18.5"
}
```

---

## 3. File Architecture

```
bartmining/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css               # Public site CSS tokens + typography
│   │   ├── layout.tsx                # Root layout (Sora/Manrope/SpaceMono fonts)
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── products/page.tsx
│   │   ├── sustainability/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── insights/
│   │   │   ├── page.tsx              # Article hub (searchable/filterable)
│   │   │   └── [slug]/page.tsx       # Dynamic article pages
│   │   ├── api/contact/route.ts      # Contact form → Resend
│   │   └── admin/
│   │       ├── login/page.tsx        # GoldPass auth
│   │       ├── admin.css             # Admin design tokens (dark mode)
│   │       ├── layout.tsx            # Admin root layout (imports admin.css)
│   │       └── (dashboard)/
│   │           ├── layout.tsx        # App shell: sidebar nav, session restore, AppContext
│   │           ├── dashboard/page.tsx
│   │           ├── map-data/
│   │           │   ├── page.tsx      # Redirect to cleaning
│   │           │   ├── cleaning/page.tsx
│   │           │   ├── analysis/page.tsx
│   │           │   # NOTE: no map-data/outputs/ exists — nav pushes here causing 404
│   │           ├── outputs/page.tsx          # Exists at /admin/outputs (nav link path mismatch)
│   │           ├── maxgold/page.tsx
│   │           ├── visualization/page.tsx
│   │           ├── explore/
│   │           │   ├── page.tsx      # Redirect to overview
│   │           │   ├── overview/page.tsx
│   │           │   ├── live-map/page.tsx
│   │           │   ├── my-holes/page.tsx
│   │           │   ├── assignments/page.tsx
│   │           │   ├── radio-call/page.tsx
│   │           │   ├── survey-photos/page.tsx
│   │           │   ├── devices/page.tsx
│   │           │   └── settings/page.tsx
│   │           └── settings/page.tsx
│   │
│   ├── components/
│   │   ├── layout/Navbar.tsx, Footer.tsx, SiteChrome.tsx
│   │   ├── sections/               # Public site section components
│   │   ├── insights/HubClient.tsx, TableOfContents.tsx, ReadingProgress.tsx
│   │   ├── ui/Reveal.tsx, Counter.tsx
│   │   └── goldpass/               # GoldPass-specific components
│   │       ├── workbench/
│   │       │   ├── StageWorkbench.tsx   # Main canvas + all RPC-calling buttons
│   │       │   ├── FileCard.tsx         # Draggable file card on canvas
│   │       │   └── findConnections.ts   # Detects shared columns/values across tables
│   │       ├── WorkspacePage.tsx        # "Table view" — SQL editor + DataChecks
│   │       ├── TableEditorPage.tsx      # Row/column editor + history
│   │       ├── DataChecksPanel.tsx      # RPC-based check runner (right panel)
│   │       ├── QCPanel.tsx              # Client-side QC runner (older code path)
│   │       ├── UploadModal.tsx
│   │       ├── GpConfirm.tsx
│   │       ├── GpToasts.tsx
│   │       └── ThemeToggle.tsx
│   │
│   ├── content/insights/           # Article TS content files (20+ articles)
│   ├── data/                       # Static data arrays
│   │   └── insights.ts, services.ts, equipment.ts, regions.ts, phases.ts, pillars.ts, testimonials.ts
│   │
│   └── lib/goldpass/
│       ├── AppContext.ts            # React context + useAppContext()
│       ├── aiConfig.ts             # AI_MODEL, pricing constants
│       ├── confirm.ts              # confirmDialog() helper
│       ├── errors.ts               # gpError() — coded error notifications
│       ├── notify.ts               # notify() toast system
│       ├── sqlEngine.ts            # Client-side SQL engine (custom GoldPass dialect)
│       ├── db/
│       │   ├── index.ts            # DB singleton — all data operations + RPCs
│       │   ├── types.ts            # TypeScript types
│       │   └── helpers.ts          # detectColType, exportCsv, invertColMapping, newId
│       ├── dataChecks/index.ts     # RPC-backed check implementations (called by DataChecksPanel)
│       └── qc/index.ts             # Legacy client-side QC (called by QCPanel)
│
├── supabase/
│   ├── setup.sql                   # Full schema, RLS, indexes, all gp_* functions
│   └── functions/
│       ├── gold-ai/index.ts
│       ├── generate-device-invitation/index.ts
│       ├── claim-device/index.ts
│       ├── send-alert/index.ts
│       └── validate-survey-photo/index.ts
│
└── apps/mobile/
    ├── app/
    │   ├── _layout.tsx             # Root layout (font/session load)
    │   ├── (auth)/login/index.tsx  # Device code claim screen
    │   └── (app)/
    │       ├── _layout.tsx         # Tab bar: Explore / Command
    │       ├── command/index.tsx, alerts.tsx, photos.tsx
    │       └── explore/
    │           ├── index.tsx       # My Holes list (weekly assignments)
    │           ├── map.tsx         # Offline hole map
    │           ├── settings.tsx    # Profile/sync settings
    │           └── survey/[id].tsx # Camera + GPS survey capture
    └── lib/
        ├── bluetooth/gnss-receiver.ts, mesh-relay.ts
        ├── device/registration.ts
        ├── gps/accuracy.ts
        ├── offline/local-db.ts     # SQLite offline queue
        ├── radio/fcm.ts
        ├── supabase/client.ts
        └── sync/sync-manager.ts   # Offline → Supabase batch sync
```

---

## 4. Design System

### Public Site (`src/app/globals.css`)

Design tokens as CSS custom properties:

| Token | Value | Usage |
|---|---|---|
| `--gold` | `#AE8A4C` | Primary accent |
| `--gold-2` | `#C7A86C` | Lighter gold |
| `--gold-hi` | `#E4D3AB` | Cream-gold (CTA buttons) |
| `--gold-deep` | `#8A6C36` | Eyebrow labels |
| `--slate` | `#20262A` | Dark section backgrounds |
| `--ink` | `#1C1A16` | Primary body text |
| `--bg` | `#F7F6F3` | Page background |
| `--paper` | `#EFEEEA` | Section alternate background |
| `--r-sm` | `10px` | Border-radius small |
| `--r-md` | `16px` | Border-radius medium |
| `--r-lg` | `26px` | Border-radius large |
| `--r-xl` | `38px` | Border-radius xl (pills) |
| `--maxw` | `1240px` | Max content width |

Typography: `--font-sora` for headings (`font-weight: 700`, `letter-spacing: -0.035em`); `--font-manrope` for body; `--font-mono` for eyebrow labels.

**Key CSS classes:**

| Class | Description |
|---|---|
| `.px-site` | Max 1240px, centred, 32px h-padding |
| `.sec-gap` | 100px vertical padding |
| `.btn-gold` | Primary CTA (`#E4D3AB` background) |
| `.btn-ink` | Dark filled button |
| `.btn-ghost` | Outlined button |
| `.eyebrow` | 12px uppercase tracked label |
| `.grad` | Gold gradient text (CSS clip) |

### Admin Dashboard (`src/app/admin/admin.css`)

`.gp-root` defines a **dark design system** with these tokens:

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0B0C0E` | Page background |
| `--bg-2` | `#111318` | Card / sidebar |
| `--bg-3` | `#1A1D24` | Popover / elevated |
| `--sep` | `#1E2028` | Border / separator |
| `--sep-o` | `rgba(255,255,255,.08)` | Translucent border |
| `--gold` | `#C8973B` | Admin gold accent |
| `--blue` | `#007AFF` | Primary interactive |
| `--green` | `#34C759` | Success |
| `--orange` | `#FF9500` | Warning |
| `--red` | `#FF3B30` | Danger |
| `--purple` | `#AF52DE` | Special |
| `--teal` | `#30B0C7` | Info |
| `--label-1` | `#F2F2F7` | Primary text |
| `--label-2` | `#AEAEB2` | Secondary text |
| `--label-3` | `#636366` | Muted text |
| `--label-4` | `#48484A` | Disabled text |

**Key admin CSS classes:**

| Class | Description |
|---|---|
| `.app-root` | Full-height flex: sidebar + main-area |
| `.sidebar` | Fixed 220px dark left panel |
| `.sb-item.active` | Blue-tinted active nav state |
| `.sb-item-locked` | Locked (opacity 0.4, not-allowed cursor) |
| `.main-area` | Scrollable right content area |
| `.content-pad` | 28px × 32px inner padding |
| `.card` | `bg-2`, 1px border, 16px radius, 20px padding |
| `.btn-primary` | `--blue` background |
| `.btn-secondary` | `bg-3` with translucent border |
| `.btn-danger` | Red translucent style |
| `.btn-icon` | Minimal icon button |
| `.input` | `bg-2`, translucent border, 8px radius |
| `.tbl` | Data table with sticky headers |
| `.badge-*` | Colour-coded status pills |
| `.gp-toasts` | Fixed toast stack (top-right, 340px wide) |

---

## 5. Public Marketing Site

### Pages

| Route | Description |
|---|---|
| `/` | Homepage: hero, services, phases, pillars, founder, regions, testimonials, CTA |
| `/about` | Founder bio, career history, who we serve |
| `/services` | Full-lifecycle mining services grid |
| `/products` | Mining machinery and processing equipment |
| `/sustainability` | ESG commitments |
| `/contact` | Contact form → `api/contact/route.ts` → Resend |
| `/insights` | Knowledge hub — filterable article grid (`HubClient.tsx`) |
| `/insights/[slug]` | Article page with table of contents + reading progress bar |

### Key Components

- `HeroSection.tsx` — landing hero with animated counters and CTA
- `MarqueeSection.tsx` — scrolling partner logos
- `ServiceGrid.tsx` — grid from `data/services.ts`
- `PhasesSection.tsx` — project methodology phases
- `PillarsSection.tsx` — ESG/values pillars
- `RegionsSection.tsx` — East and Southern Africa coverage
- `TestimonialsSection.tsx` — client testimonials
- `HubClient.tsx` — article hub with search and tag filter
- `Reveal.tsx` — scroll-triggered fade animation (IntersectionObserver)
- `Counter.tsx` — animated number counter (IntersectionObserver + requestAnimationFrame)

### Content

Articles live in `src/content/insights/*.ts` and are indexed in `src/data/insights.ts`. Adding an article = create content file + add metadata entry to the index.

---

## 6. GoldPass Admin Dashboard

### Authentication Flow

1. `/admin` → redirects to `/admin/dashboard`
2. `/admin/login` — `DB.signIn(email, password)` or `DB.signInWithGoogle()` (OAuth)
3. After sign-in: `DB.bootstrap()` loads all projects/tables/rows/versions/audit/outputs/stages into in-memory cache `_c`
4. On success: `router.push('/admin/dashboard')`
5. Middleware enforces Supabase session cookie on all `/admin` routes; redirects to `/admin/login` if unauthenticated

### Navigation Structure

`(dashboard)/layout.tsx` renders the full app shell. The sidebar has five top-level sections:

```
⬡  Dashboard
◎  Map Data          [accordion]
       Cleaning
       Analysis
       Outputs         ← nav pushes /admin/map-data/outputs but page lives at /admin/outputs (404)
⛏  Max Gold
◈  Explore           [accordion]
       Overview
       Live Map
       My Holes
       Assignments
       Radio Call
       Survey Photos
       Devices
       Site Settings
⚙  Settings
```

Plus a **Projects** section: clicking a project tile calls `setProject(p)` → loads rows + navigates to Cleaning.

### AppContext (`src/lib/goldpass/AppContext.ts`)

Provided by `(dashboard)/layout.tsx` via `React.createContext`, consumed by `useAppContext()`.

```typescript
interface AppState {
  user:         { email: string } | null
  projects:     Project[]
  project:      Project | null
  tables:       TableMeta[]
  stageStatus:  Record<string, StageStatus>  // keyed by project.id
  booting:      boolean
  rowsLoading:  boolean
  setProject(p: Project | null): void        // loads rows + navigates to cleaning
  approveStage(stage: keyof StageStatus): void
  isStageUnlocked(stage: string): boolean    // ALWAYS returns true — gating not implemented
  getStageStatus(pid: string): StageStatus
  refresh(): void
}
```

**`approveStage` in layout.tsx** uses this stage order:
```typescript
const ORDER = ['validation', 'cleaning', 'analysis']
```
Note: `validation` is included in the order array even though no validation page or UI stage exists.

**`isStageUnlocked`** always returns `true`. `STAGE_GATES` is declared but never populated.

**`StageStatus` type** (`db/types.ts`):
```typescript
type StageStatus = {
  validation: 'pending' | 'done'
  cleaning:   'pending' | 'done'
  analysis:   'pending' | 'done'
}
```

**`DEFAULT_STAGES`** (`db/index.ts`):
```typescript
{ validation: 'pending', cleaning: 'pending', analysis: 'pending' }
```

The `project_stages` table stores all three columns including `validation`. No validation page exists in the UI.

---

## 7. GoldPass — Page by Page

### 7.1 Dashboard (`/admin/dashboard`)

**Displays:**
- `PitHero` — canvas animation of concentric ellipses (mining pit visual)
- 4 animated stat counters (`Counter` component, IntersectionObserver + requestAnimationFrame):
  - Projects count
  - Total data rows
  - Tables count
  - Outputs count
- Recent activity feed (last 8 entries from `DB.getAuditLog()`, across all projects)
- Project cards grid with file count, row count, stage progress dots, and next-action button

**Actions:**
- "New project" → `DB.createProject(name)` then `DB.loadProjectRows(id)`
- Click project card → `setProject(p)` → loads rows, navigates to Cleaning
- Rename project → `window.prompt` for new name → `DB.renameProject(id, name)`
- Delete project → typed-name confirm modal → `DB.deleteProject(id)` (cascades in DB)

---

### 7.2 Map Data — Cleaning (`/admin/map-data/cleaning`)

Thin wrapper:
```tsx
<StageWorkbench
  stage="cleaning"
  project={project}
  user={user}
  tables={tables}
  onRefresh={refresh}
  stageDone={ss.cleaning === 'done'}
  onApprove={() => approveStage('cleaning')}
/>
```

All logic is in `StageWorkbench`. See section 8 for full StageWorkbench breakdown.

---

### 7.3 Map Data — Analysis (`/admin/map-data/analysis`)

Same pattern:
```tsx
<StageWorkbench
  stage="analysis"
  ...
  stageDone={ss.analysis === 'done'}
  onApprove={() => approveStage('analysis')}
/>
```

---

### 7.4 Map Data — Outputs (`/admin/map-data/outputs` → broken nav)

The sidebar nav links Outputs to `/admin/map-data/outputs` (via `router.push('/admin/map-data/' + 'outputs')`), but no page file exists at that path. The actual Outputs page lives at `src/app/admin/(dashboard)/outputs/page.tsx` — served at **`/admin/outputs`**.

Clicking Outputs in the nav produces a 404. To fix: either move `outputs/page.tsx` into `map-data/outputs/`, or change the nav link to push `/admin/outputs` instead.

**The Outputs page at `/admin/outputs` provides:**
- Collar output builder: select a collar file + interval file → `DB.rpcBuildCollarOutput(collar.id, interval.id)` → `gp_build_collar_output`; preview first 20 rows
- PPM summary builder: checkbox-select files → `DB.rpcBuildPpmOutput(ppmIds)` → `gp_build_ppm_output`; output: HOLEID / MFRO / MTO / MAXIMUMPPM
- Save output: `DB.addOutput(projectId, name, rows, 'csv', email)` → stores full `data` jsonb in `outputs` table
- Download: CSV via `exportCsv`; Excel via SheetJS (lazy-loads fresh data from Supabase)
- Rename: `window.prompt` → `DB.renameOutput` (inconsistent — see Known Issues)
- Delete: `window.confirm` → `DB.deleteOutput` (inconsistent — see Known Issues)

---

### 7.5 Max Gold (`/admin/maxgold`)

Standalone tool. No project required. No Supabase calls. Entirely client-side.

**Purpose:** Upload any CSV/Excel → map columns → find the row with the maximum grade value per hole → export one-row-per-hole table.

**Supported formats:** `.csv`, `.txt`, `.tsv`, `.xlsx`, `.xls`

**Column meanings (MEANINGS array):** `hole_id`, `from`, `to`, `au`, `cu`, `ag`, `ignore`, `other`

**`process()` logic:**
1. Group all rows by normalised HoleID (uppercase, stripped of spaces/dashes)
2. For each hole, keep only the row with the highest value in the selected grade column
3. Output: one row per hole

**Download:** `exportCsv()` → file named `max_gold_<original_filename>.csv`

---

### 7.6 Visualization (`/admin/visualization`)

Client-side only. Reads from `DB.getRows()` cache — no RPCs or mutations.

**CollarMap component:**
- Canvas 2D scatter plot
- `buildPoints()` uses `invertColMapping()` to find easting, northing, and grade columns
- Dot size and opacity scale with grade value
- Zoom (wheel), pan (drag), hover tooltip
- "⬇ PNG" exports the canvas via `canvas.toDataURL()`
- "Reset view" button

**GradeHistogram component:**
- 10-bin histogram of grade values
- Metal selector: `au` / `cu` / `ag`
- Grade sourced from collar file or first interval file containing the selected metal column

---

### 7.7 Settings (`/admin/settings`)

**Account section:** user email display.

**Data defaults section (UI-only, NOT persisted):**
- Grade unit (g/t, ppm, ppb)
- Depth unit (metres, feet)
- Au threshold
- Null value placeholders

**Backend status:** `DB.ready()` indicator (green/red).

**Claude AI section:**
- Model: `AI_MODEL` from `aiConfig.ts` = `'claude-sonnet-4-6'`
- Monthly usage meter: `DB.getAiUsageThisMonth(project.id)` → sums `tokens_in × $3/1M + tokens_out × $15/1M` against $50/month budget

**Project backup:** "⬇ Download full backup (.xlsx)" → exports all project tables from cache via SheetJS.

**Activity history:** `DB.getAuditLog(project.id)` with text search filter.

---

### 7.8 Explore — Overview (`/admin/explore/overview`)

When no site exists, shows the full **SiteSetupPanel**.

**SiteSetupPanel:**
- Left panel: site name, hole ID prefix, up to 10 polygon boundary points (click Mapbox satellite map), grid interval (H × V metres), "Preview grid" button, hole count estimate
- Right panel: Mapbox satellite map showing polygon outline, numbered vertex pins, and preview grid dots
- "Save site" → inserts to `sites` + `site_vertices` + `site_grid_config` + `holes` (batched 500/insert)
- Hole ID generation: `PREFIX-A001`, `PREFIX-A002`, …, `PREFIX-B001` (column-then-row letter pattern)
- `generateGridPoints()`: point-in-polygon test against boundary vertices
- Max 10 vertices enforced in UI

When a site exists, shows the **Overview dashboard:**
- `TeamPanel` — add/delete teams (`explore_teams.insert` / `explore_teams.delete`)
- Stats row: Active teams / Holes this week / Photos pending / Alerts sent
- Team progress bars (assignments vs completed this week)
- Recent alerts list (last 5 from `explore_alerts`)

---

### 7.9 Explore — Live Map (`/admin/explore/live-map`)

- Mapbox GL JS v3.3.0, loaded from CDN. Requires `NEXT_PUBLIC_MAPBOX_TOKEN`.
- Initial load: fetches latest 200 rows from `device_positions` (ordered by `recorded_at DESC`), deduplicated by `profile_id` (keep most recent per device)
- Fetches `explore_teams` for colour mapping (`team_id → color_hex`)
- Renders a coloured circle marker per device on dark Mapbox satellite style

**Realtime:**
```typescript
supabase.channel('live-positions')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'device_positions' }, handler)
  .subscribe()
```
On each INSERT: updates that device's marker position.

**Marker click → side panel shows:**
- Team name
- Lat/Lng (6 decimal places)
- Accuracy (m), altitude (m)
- GPS source
- Last ping time
- "Send Radio Call" button — **TODO comment in code, no implementation**

Error state rendered if `NEXT_PUBLIC_MAPBOX_TOKEN` is not set.

---

### 7.10 Explore — My Holes (`/admin/explore/my-holes`)

Admin read-only view of all holes.

**Data sources:**
```typescript
supabase.from('holes').select('*')
supabase.from('assignments').select('hole_id, team_id, explore_teams(name)')
supabase.from('hole_surveys').select('hole_id, submitted_at').order('submitted_at', { ascending: false })
```

**Table columns:** Hole ID / Row / Col / Lat / Lng / Team / Status / Last Survey

**Filters:** Status dropdown (all / pending / in_progress / completed / flagged) + hole ID text search

**Status colours:** pending=grey (`--label-4`), in_progress=blue, completed=green, flagged=orange

---

### 7.11 Explore — Assignments (`/admin/explore/assignments`)

Weekly assignment manager.

**Week navigation:** Previous/next week buttons; week shown as ISO Sunday date.

**Assign:** Select team → click hole chips (max 20) → "Assign N holes" →
```typescript
supabase.from('assignments').upsert(rows, { onConflict: 'hole_id,week_start' })
```

**Unassign:** ✕ on row →
```typescript
supabase.from('assignments').delete().eq('id', assignmentId)
```

**Copy last week:** reads last week's assignments, upserts for current week.

**Export:** "⬇ CSV" → `assignments_YYYY-MM-DD.csv`

**Legacy `generateGrid()` function still exists here:**
- Uses `sites.total_rows × sites.total_cols` (old schema)
- Generates `H001-001` style IDs
- Conflicts with the new polygon-based hole ID format (`PREFIX-A001`)
- Only shown when site exists but `holes` table is empty for that site

---

### 7.12 Explore — Radio Call (`/admin/explore/radio-call`)

**Compose:**
- Send to: All teams / Team (select from dropdown) / Individual (no device picker — TODO)
- Priority: Normal / Urgent
- 5 quick-phrase presets
- Free-text message textarea

**Send:**
1. `supabase.from('explore_alerts').insert({...})`
2. Fire-and-forget: `fetch('/functions/v1/send-alert', { body: { alert_id } })`
3. Non-fatal on failure (alert saved regardless)

**Alert history:** last 20 rows from `explore_alerts` with priority icon, target, timestamp.

---

### 7.13 Explore — Survey Photos (`/admin/explore/survey-photos`)

**Data source:**
```typescript
supabase.from('hole_surveys')
  .select('*, holes(hole_id, lat, lng), explore_teams(name)')
```

**GPS offset:** `haversineM(hole.lat, hole.lng, photo_lat, photo_lng)`:
- ≤30 m → green
- 30–100 m → orange
- >100 m → red

**Default filter:** `'pending'`

**Admin actions (pending photos):**
```typescript
supabase.from('hole_surveys').update({
  status: 'approved' | 'rejected',
  reviewed_by: user.email,
  reviewed_at: new Date().toISOString()
})
```

---

### 7.14 Explore — Devices (`/admin/explore/devices`)

**Data:**
```typescript
supabase.from('device_invitations')
  .select('*, explore_teams(name), registered_devices(last_seen_at)')
```

**Generate invitation:**
1. Enter label + select team + select role (`field_team` / `supervisor`)
2. POST to `/functions/v1/generate-device-invitation`
3. Returns `{ device_code, device_key, invitation_id, expires_at }`
4. Raw key shown ONCE — only bcrypt hash stored in DB

**Revoke:**
```typescript
supabase.from('device_invitations').update({ status: 'revoked' })
```

---

### 7.15 Explore — Site Settings (`/admin/explore/settings`)

**List all sites** from `supabase.from('sites')`.

**Edit:** name, description, `origin_lat`, `origin_lng` (spacing/rows/cols cannot be changed).

**Delete site:** typed-name confirm → cascades holes, assignments, surveys, alerts.

**Delete all holes (for a site):**
```typescript
supabase.from('holes').delete().eq('site_id', siteId)
```
Allows regeneration of the hole grid without deleting the site itself.

---

## 8. StageWorkbench Deep-Dive

**File:** `src/components/goldpass/workbench/StageWorkbench.tsx`

**Props:**
```typescript
interface Props {
  stage:     'cleaning' | 'analysis'  // validation stage has NO UI
  project:   Project
  user:      { email: string }
  tables:    TableMeta[]
  onRefresh: () => void
  stageDone: boolean
  onApprove: () => void
}
```

Note: `WorkspacePage.tsx` still has `stage: 'validation' | 'cleaning' | 'analysis'` in its props — the `'validation'` branch is dead code.

### Canvas Layout

- Files appear as `FileCard` components at x/y positions, draggable
- Auto-selects newly added files (max 4 selected at once; `notify('info', ...)` on cap)
- "Off-canvas" scrollable list on the left shows project files not yet placed on canvas
- "+ Upload" button → `UploadModal` → `DB.insertTable`
- "Table view" toggle → renders `WorkspacePage` in place of canvas
- "Approve & Continue →" button (only shown when `!stageDone`) → `onApprove()`
- SVG connection lines drawn between `FileCard` pairs that share linking roles (via `findConnections`)

### Session Persistence

On mount: `DB.getWorkbenchState(project.id, stage)` restores card positions and selection.  
On change: `DB.saveWorkbenchState(project.id, stage, { layout, selection })` — debounced 600ms.

### Cleaning-Stage Actions (10 total)

| Action ID | Label | What it calls |
|---|---|---|
| `_combine_dedupe` | Combine & Deduplicate | `DB.rpcCombineAndDedupe(tableIds)` → `gp_combine_and_dedupe` |
| `_fix_formatting` | Fix Formatting | `DB.rpcFixFormatting(tableId)` → `gp_fix_formatting` |
| `_join` | Join Files | `handleJoin()` — client-side HoleID join (see below) |
| `_merge` | Merge Files | `window.prompt` for name → `DB.mergeTables(ids, name)` |
| `_data_health` | Data Health Check | `DB.rpcCheckDataHealth([tableId])` → `gp_check_data_health` |
| `_intervals` | Check Intervals | `DB.rpcCheckIntervals([tableId])` → `gp_check_intervals` |
| `missing_hole_ids` | Missing Hole IDs | `DB.rpcRunCheck('missing_hole_ids', tableId)` → `gp_run_check` |
| `find_null_placeholders` | Find Null Placeholders | `DB.rpcRunCheck('find_null_placeholders', tableId)` → `gp_run_check` |
| `_compare_files` | Compare Files | `DB.rpcCompareFiles(tableIds)` → `gp_compare_files` |
| `_undrilled_orphans` | Undrilled / Orphan Assays | `DB.rpcFindUndrilledOrphans(collarIds, intervalIds)` → `gp_find_undrilled_orphans` |

### Analysis-Stage Actions (2 total)

| Action ID | Label | What it calls |
|---|---|---|
| `_analysis` | Analysis Pool | `DB.rpcAnalysisPool(tableIds)` → `gp_analysis_pool` |
| `_distance` | Distance Filter | `DB.rpcDistanceFilterPooled(tableIds, refTableId, radiusM)` → `gp_distance_filter_pooled` |

### "◈ Analyse Files" Button (Cleaning stage only)

Triggers `runAutoAnalysis()` — a parallel batch diagnostic run across all canvas tables.

**Per-file (parallel Promise.all):**
- `DB.rpcCheckDataHealth([table.id])` — for every file
- `DB.rpcCheckIntervals([table.id])` — for non-collar files only
- `DB.rpcRunCheck('missing_hole_ids', table.id)` — for every file
- `DB.rpcRunCheck('find_null_placeholders', table.id)` — for every file

**Cross-file (after per-file completes):**
- `DB.rpcFindUndrilledOrphans(collarIds, intervalIds)` — collar vs interval cross-check
- `DB.rpcCompareFiles(canvasTables.map(t => t.id))` — diff all canvas tables

**AnalysisReport panel** (300px right panel, revealed after analysis runs):
- Per-file section: one row per table showing pass/fail for each check type
- Cross-file section: undrilled orphans + file comparison results
- Overall status banner:
  - Green: no issues found across all checks
  - Orange: warnings (some issues but fixable)
  - Red: critical issues (data health failures, interval errors)

### handleJoin() — Client-Side HoleID Join

1. Build lookup map from collar rows: `{ normalised_hole_id → row }`
2. Iterate interval rows; for each, find matching collar row
3. Merge: prefix collar column names with `"collar_"` if they conflict with interval columns
4. Call `DB.createChildTable(name, mergedRows, [collarId, intervalId])` → persists as child table

### AI Query Bar (both stages)

1. User types natural-language question
2. `DB.goldAI(question, schemas)` → POST to `gold-ai` Edge Function → Claude → SQL + note
3. `executeSQL(sql, DB.getRows)` → runs in `sqlEngine.ts`
4. If result is non-empty: `DB.createChildTable(name, rows, [sourceTableId])` → appears on canvas as a result file
5. Token usage logged: `DB.logAiUsage(project.id, usage)` → inserted into `ai_usage`

---
## 9. FileCard Deep-Dive
**File:** `src/components/goldpass/workbench/FileCard.tsx`

**Layout constants:**
```typescript
CARD_W          = 232   // px
CARD_HEADER_H   = 52    // px
COL_ROW_H       = 22    // px per column row
MAX_COLS_SHOWN  = 8     // max columns displayed on card
```

**Card displays:**
- File name (truncated)
- Type badge: `collar` / `interval` / `survey` / `lithology` / `other` — child tables show `"result file"`
- Row count
- Up to 8 columns with their detected role labels

**Button actions:**
- **Open** → navigates to `TableEditorPage` for that table
- **✕** → removes card from canvas (table remains in project)
- **🗑** → `DB.deleteTable(id)` — full delete with `confirmDialog`

**`isNew` prop:** triggers `gp-appear` CSS animation class on mount.

---

## 10. findConnections Deep-Dive

**File:** `src/components/goldpass/workbench/findConnections.ts`

**`LINKING_ROLES`** (columns that can form connections):
`hole_id`, `easting`, `northing`, `elevation`, `utm_e`, `utm_n`, `lat`, `long`, `from`, `to`

**Strategy 1 — Semantic role match:**
- Both files have a column with the same role
- For `hole_id` role: also performs value overlap sanity check — samples up to 200 rows per file, checks if ≥30% of values overlap
- ≥30% overlap → high confidence; lower → medium confidence

**Strategy 2 — Raw column name match:**
- Identical column names not already matched by Strategy 1
- Value overlap ≥30% → medium confidence

Connection lines drawn on the SVG layer between matched `FileCard` pairs.

---

## 11. Core Library Deep-Dive

### 11.1 DB Singleton (`src/lib/goldpass/db/index.ts`)

Single exported `DB` object. Keeps an **in-memory cache** (`_c`) that mirrors Supabase for instant rendering. Mutations use `bg()` pattern — optimistic local update first, then background Supabase persist with error `notify` on failure.

**`_c` cache shape:**
```typescript
_c = {
  user, projects, tables, meta,
  rows,       // Record<tableId, TableRow[]>
  versions, audit, outputs, stages
}
```

**`bg(fn)` pattern:**
```typescript
// Update local cache immediately
_c.something = newValue
// Then persist in background
bg(async () => {
  const { error } = await supabase.from('...').update(...)
  if (error) notify('error', error.message, 'GP-22xx')
})
```

**`insertRowsChunked()`:** inserts rows in batches of `CHUNK = 1000` to avoid Supabase payload limits.

**Full method reference:**

| Category | Methods |
|---|---|
| Auth | `signIn`, `signInWithGoogle`, `restoreSession`, `signOut` |
| Bootstrap | `bootstrap()` — loads all project data into `_c` |
| Projects | `getProjects`, `createProject`, `renameProject`, `deleteProject`, `loadProjectRows` |
| Tables | `getTables`, `insertTable`, `deleteTable`, `setTableColumns`, `mergeTables`, `createChildTable` |
| Rows | `getRows(tableId, limit=0)`, `replaceRows`, `insertRowsChunked`, `restoreVersion` |
| Outputs | `getOutputs`, `addOutput`, `renameOutput`, `deleteOutput`, `downloadOutput` |
| Stage | `getStageStatus`, `setStageStatus` |
| Audit | `getAuditLog` |
| AI | `goldAI(question, schemas)`, `logAiUsage`, `getAiUsageThisMonth` |
| Workbench state | `saveWorkbenchState(projectId, stage, state)`, `getWorkbenchState(projectId, stage)` |
| RPCs | `rpcRunCheck`, `rpcApplyFix`, `rpcBuildCollarOutput`, `rpcBuildPpmOutput`, `rpcCombineAndDedupe`, `rpcFixFormatting`, `rpcCheckIntervals`, `rpcCheckDataHealth`, `rpcFindUndrilledOrphans`, `rpcCompareFiles`, `rpcAnalysisPool`, `rpcDistanceFilterPooled` |

### 11.2 RPC → SQL Function Map

All `gp_*` SQL functions call `gp_assert_owner(v_pid)` — ownership enforced server-side via SECURITY DEFINER.

| TS wrapper | SQL function | Called from |
|---|---|---|
| `rpcRunCheck(checkId, tableId, compareId?)` | `gp_run_check` | StageWorkbench generic actions |
| `rpcApplyFix(checkId, tableId)` | `gp_apply_fix` | StageWorkbench fix branch |
| `rpcBuildCollarOutput(tableId)` | `gp_build_collar_output` | Outputs page |
| `rpcBuildPpmOutput(tableId)` | `gp_build_ppm_output` | Outputs page |
| `rpcCombineAndDedupe(tableIds)` | `gp_combine_and_dedupe` | `_combine_dedupe` action |
| `rpcFixFormatting(tableId)` | `gp_fix_formatting` | `_fix_formatting` action |
| `rpcCheckIntervals(tableIds)` | `gp_check_intervals` | `_intervals` action + auto-analysis |
| `rpcCheckDataHealth(tableIds)` | `gp_check_data_health` | `_data_health` action + auto-analysis |
| `rpcFindUndrilledOrphans(collarIds, intervalIds)` | `gp_find_undrilled_orphans` | `_undrilled_orphans` action + auto-analysis |
| `rpcCompareFiles(tableIds)` | `gp_compare_files` | `_compare_files` action + auto-analysis |
| `rpcAnalysisPool(tableIds)` | `gp_analysis_pool` | `_analysis` action |
| `rpcDistanceFilterPooled(tableIds, refId, radiusM)` | `gp_distance_filter_pooled` | `_distance` action |

### 11.3 SQL Engine (`src/lib/goldpass/sqlEngine.ts`)

Custom in-browser SQL engine. Runs against `DB.getRows()` cache. Used by WorkspacePage "Run SQL" and the AI query bar result.

**Supported syntax:**
```sql
SELECT [DISTINCT] * | col [AS alias] | AGG(col) [AS alias], ...
  FROM table [, table2]    -- two-table FROM = row concatenation, NOT cross join
  [WHERE col op value [AND|OR|NOT ...]]
  [GROUP BY col, ...] [ORDER BY col [ASC|DESC]] [LIMIT n]
DELETE FROM table WHERE ...
```

**Aggregates:** `MAX`, `MIN`, `AVG`, `SUM`, `COUNT(col)`, `COUNT(DISTINCT col)`

**Not supported:** `JOIN`, `HAVING`, subqueries, `INSERT`, `UPDATE`, `CREATE`, `ALTER`

**Error codes:**
- `GP-2301` — parse error
- `GP-2302` — table not found
- `GP-2303` — column not found
- `GP-2304` — WHERE clause invalid

### 11.4 DataChecksPanel vs QCPanel

Two parallel check panel implementations exist:

| Component | File | Check source | Used by |
|---|---|---|---|
| `DataChecksPanel` | `dataChecks/index.ts` | Calls `DB.rpcRunCheck` / `DB.rpcApplyFix` (RPCs) | WorkspacePage "Checks" tab |
| `QCPanel` | `qc/index.ts` | Calls `runQC` / `applyFix` client-side (in-memory) | WorkspacePage (legacy path) |

`DataChecksPanel.handleRun()` passes `def.id` to `DB.rpcRunCheck(def.id, table.id, compareId?)`.  
`DataChecksPanel.handleFix()` calls `DB.rpcApplyFix(def.id, table.id)` then `DB.replaceRows(...)`.

`QCPanel.handleRun()` calls `runQC(def, rows, invMap, compare, columns)` entirely client-side.  
`QCPanel.handleFix()` calls `applyFix(def, rows, invMap)` client-side then `DB.replaceRows(...)`.

Both panels have `stage: 'validation' | 'cleaning' | 'analysis'` in their props — the `'validation'` branch is dead.

### 11.5 AI Config (`src/lib/goldpass/aiConfig.ts`)

```typescript
export const AI_MODEL            = 'claude-sonnet-4-6'
export const AI_PRICE_IN_PER_1M  = 3    // USD per 1M input tokens
export const AI_PRICE_OUT_PER_1M = 15   // USD per 1M output tokens
```

The Edge Function (`gold-ai/index.ts`) has its own matching `model: 'claude-sonnet-4-6'` string — these must be kept in sync manually.

### 11.6 Column Types and Detection (`db/helpers.ts`, `db/types.ts`)

**`ColType` union:**
`hole_id` | `from` | `to` | `au` | `cu` | `ag` | `easting` | `northing` | `elevation` | `depth` | `dip` | `azimuth` | `lithology` | `ignore`

**`detectColType(header: string)`:**
1. Normalise: lowercase, strip non-alphanumeric characters
2. Match against `COL_RULES` — ordered pattern list
3. Returns first matching `ColType` or `undefined`

**`invertColMapping(columns: Record<string, ColType>)`:**  
Returns `Record<ColType, string>` — first column header for each role. Used by visualization and QC.

### 11.7 Error and Notification System

**`notify.ts`:**
```typescript
type ToastKind = 'info' | 'success' | 'warn' | 'error'
notify(kind, msg, code?)  // pub to listeners + console mirror
onToast(fn)               // subscribe (returns unsubscribe fn)
```

**`errors.ts` — GP_ERRORS registry:**
- `20xx` — configuration errors
- `21xx` — auth errors
- `22xx` — persistence errors
- `23xx` — SQL engine errors
- `24xx` — AI errors
- `25xx` — output errors

**`confirm.ts`:**
```typescript
confirmDialog(message: string): Promise<boolean>
onConfirmRequest(fn)   // subscribed by <GpConfirm/> overlay
```

---

## 12. Supabase Schema

### GoldPass Data Tables

```sql
-- Core project data
projects          id(uuid PK), name, owner_id(auth.users), created_at, updated_at

tables_meta       id(uuid PK), project_id(FK projects), name, type, columns(jsonb),
                  row_count, parent_ids(uuid[]), created_at, updated_at

table_rows        id(bigint PK), table_id(FK tables_meta), project_id, row_index(int),
                  data(jsonb)
                  INDEX: GIN on data (jsonb_path_ops) — for cross-file RPC checks

versions          id(uuid PK), table_id, project_id, operation, row_count, data(jsonb), created_at

audit_log         id(uuid PK), project_id, table_id, operation, details, user_id, created_at

outputs           id(uuid PK), project_id, name, format, row_count, data(jsonb), created_at

project_stages    project_id(uuid PK FK projects),
                  validation text CHECK ('pending','done') DEFAULT 'pending',
                  cleaning   text CHECK ('pending','done') DEFAULT 'pending',
                  analysis   text CHECK ('pending','done') DEFAULT 'pending',
                  updated_at
                  -- NOTE: validation column exists in DB but has NO corresponding UI page

workbench_state   (project_id, stage)(composite PK), layout(jsonb), selection(uuid[]), updated_at

ai_usage          id(uuid PK), project_id, model, tokens_in(int), tokens_out(int), created_at
```

### Explore / Field Operations Tables

```sql
sites             id(uuid PK), name, origin_lat, origin_lng, total_rows, total_cols,
                  row_spacing_m, col_spacing_m, description, created_by, created_at

site_vertices     id(uuid PK), site_id(FK sites), seq(int), lat, lng, label

site_grid_config  id(uuid PK), site_id(FK sites), h_interval_m, v_interval_m, hole_id_prefix

holes             id(uuid PK), site_id(FK sites), hole_id(text), row_num(int), col_num(int),
                  lat, lng, grid_x, grid_y,
                  status text CHECK ('pending','in_progress','completed','flagged') DEFAULT 'pending',
                  created_at, updated_at

explore_teams     id(uuid PK), site_id(FK sites), name, color_hex, created_at

assignments       id(uuid PK), site_id, team_id(FK explore_teams), hole_id(FK holes),
                  week_start(date), assigned_by, created_at
                  UNIQUE(hole_id, week_start)

hole_surveys      id(uuid PK), hole_id(FK holes), team_id, submitted_by(auth.users),
                  photo_url, photo_lat, photo_lng, photo_accuracy_m, notes,
                  status text CHECK ('pending','approved','rejected') DEFAULT 'pending',
                  reviewed_by, reviewed_at, submitted_at, synced_offline(bool)

explore_alerts    id(uuid PK), site_id, sent_by(auth.users),
                  target_type text CHECK ('all','team','individual'),
                  target_id(uuid nullable), message, priority text CHECK ('normal','urgent'),
                  delivery_status(jsonb), created_at
```

### Device Management Tables

```sql
profiles          id(uuid PK FK auth.users), email, role text DEFAULT 'field_team', team_id

device_invitations id(uuid PK), site_id, team_id, device_code(text 'GOLD-XXXX'),
                   device_key(text bcrypt hash), label, role,
                   status text CHECK ('pending','active','revoked'),
                   created_by, claimed_by, claimed_at, expires_at

registered_devices id(uuid PK), profile_id(FK profiles), invitation_id,
                   android_id, device_model, app_version, fcm_token, bt_mac,
                   status, last_seen_at

device_positions  id(uuid PK), profile_id(FK profiles), team_id,
                  lat, lng, accuracy_m, altitude_m, source, recorded_at
```

### Helper SQL Functions (all in `setup.sql`)

| Function | Purpose |
|---|---|
| `gp_assert_owner(p_pid)` | Raises exception if `auth.uid()` is not `projects.owner_id`. Used as first line of all gp_* RPCs. |
| `gp_col(data jsonb, key text)` | Safe jsonb text extract |
| `gp_num(data jsonb, key text)` | Safe jsonb numeric extract |
| `gp_fixed(v numeric, dp int)` | Round to dp decimal places |
| `gp_rowkey(data jsonb, cols text[])` | Composite dedup key from multiple jsonb columns |
| `gp_cols(table_id uuid)` | Returns `columns` jsonb from `tables_meta` |

### RLS Policy Strategy

- `projects`: owner-only via `auth.uid() = owner_id`
- `tables_meta`, `table_rows`, `versions`, `audit_log`, `outputs`, `project_stages`, `workbench_state`, `ai_usage`: project-scoped via `owns_project(project_id)` helper function
- All `gp_*` RPCs: `SECURITY DEFINER` + `gp_assert_owner()` call — bypass RLS but re-check ownership
- GIN index on `table_rows.data (jsonb_path_ops)` for cross-file RPC performance

---

## 13. Edge Functions

### `gold-ai/index.ts`

- **Route:** `POST /functions/v1/gold-ai`
- **Auth:** Requires `Authorization` header
- **Input:** `{ project_id, question, schemas: [{ name, type, row_count, columns: [{col, role}] }] }`
- **Output:** `{ sql, note, usage: { input_tokens, output_tokens }, model }` or `{ error, code }`
- **Model:** `claude-sonnet-4-6`, `max_tokens: 600`
- **System prompt:** constrains output to GoldPass SQL dialect; responds with minified JSON `{"sql":"...","note":"..."}`
- **CORS:** `Access-Control-Allow-Origin: *`
- **Note:** SQL runs client-side in `sqlEngine.ts` — not against real Postgres
- **Secrets:** `ANTHROPIC_API_KEY`

### `generate-device-invitation/index.ts`

- **Route:** `POST /functions/v1/generate-device-invitation`
- **Auth:** Admin or supervisor role (checked via `profiles.role`)
- **Input:** `{ site_id, team_id, label, role, expires_hours? }`
- **Logic:** Generates `GOLD-XXXX` code (5-attempt collision retry), 32-char random key → bcrypt hash → inserts `device_invitations`
- **Output:** `{ device_code, device_key, invitation_id, expires_at }` — raw key returned ONCE
- **Secrets:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`

### `claim-device/index.ts`

- **Route:** `POST /functions/v1/claim-device`
- **Auth:** None — validated by device code + key + android_id
- **Input:** `{ device_code, device_key, android_id, device_model?, app_version?, fcm_token?, bt_mac? }`
- **Logic:** Validates code/key (bcrypt compare) → creates `auth.users` record (`device-GOLD-xxxx@goldpass.internal`) + `profiles` + `registered_devices` → marks invitation `active` → returns JWT session
- **Re-registration:** If `android_id` already registered, returns a fresh JWT (no duplicate user created)
- **Secrets:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### `validate-survey-photo/index.ts`

- **Route:** `POST /functions/v1/validate-survey-photo`
- **Input:** `{ survey_id }`
- **Logic:** Loads `hole_surveys` row + joined `holes(lat, lng)` → haversine distance → sets `status`:
  - ≤30 m → `'approved'` + marks `holes.status = 'completed'`
  - 30–100 m → `'pending'` (admin manual review required)
  - >100 m → `'rejected'`
- **Called by:** `sync-manager.ts` after photo upload and survey row insert

### `send-alert/index.ts`

- **Route:** `POST /functions/v1/send-alert`
- **Auth:** Requires bearer token
- **Input:** `{ alert_id }`
- **Logic:**
  1. Load alert from `explore_alerts`
  2. Determine target `registered_devices` (all / by team / by individual)
  3. Get FCM OAuth access token via RS256 JWT from service account JSON
  4. Send FCM HTTP v1 messages to each device's `fcm_token`
  5. Update `explore_alerts.delivery_status` with per-device result
- **Secrets:** `FCM_PROJECT_ID`, `FCM_SERVICE_ACCOUNT_JSON`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

---

## 14. Mobile App (Expo / React Native)

### Authentication

1. First launch → `claim-device` Edge Function with `GOLD-XXXX` code + device key + Android ID
2. Returns JWT → stored via `expo-secure-store` (`access_token`, `refresh_token`, `team_id`, `profile_id`)
3. Supabase client uses stored tokens for all subsequent requests

### Tab Structure

```
[Explore tab]              [Command tab — supervisor/admin only]
  My Holes list              Command Map (Mapbox, realtime positions)
  Offline hole map           Alert history
  Profile/sync settings      Survey photo review
```

### My Holes Screen (`explore/index.tsx`)

Loads weekly assignments:
```typescript
supabase.from('assignments')
  .select('holes(id, hole_id, row_num, col_num, lat, lng, status)')
  .eq('team_id', teamId)
  .eq('week_start', weekStartDate())
```
Sorted by `row_num` then `col_num`. Pull-to-refresh calls `sync()` then reloads.

### Offline Sync (`sync/sync-manager.ts`)

Called on: app foreground, every 30s via background-fetch, after any submission. Idempotent lock (`syncing` boolean prevents concurrent runs).

**Sync order:**

1. **Positions:** `device_positions` bulk insert → `markSynced('local_positions', ids)`
2. **Surveys:** for each unsynced survey:
   - Upload photo to Supabase Storage (`survey-photos/survey_{hole_id}_{timestamp}.jpg`) via raw `fetch` with base64 body
   - Insert `hole_surveys` row
   - Fire-and-forget call to `validate-survey-photo` Edge Function with `survey_id`
   - `markSynced('local_surveys', [id])`
3. **Hole status changes:** `holes.update({ status })` one at a time → `markSynced('local_hole_status', ids)`

---

## 15. UploadModal

**File:** `src/components/goldpass/UploadModal.tsx`

**CSV parsing:**
- RFC-4180 compliant parser with auto delimiter detection (comma / semicolon / tab)
- Handles quoted fields with embedded commas and newlines

**Excel parsing (SheetJS, lazy-loaded):**
- Every non-empty sheet becomes a separate file
- Warns on files > 50,000 rows

**`suggestType()` — file type inference:**
- Detects `collar` / `assay` / `survey` / `lithology` / `other` from column role pattern

**Preview mode:**
- Shows first 5 rows
- Dropdown per column for meaning correction
- "Import" → `DB.insertTable()` for each file (parallel)
- Duplicate name deduplication: appends `" (2)"`, `" (3)"` suffix

---

## 16. Known Issues (Priority Order)

### Critical

**Outputs nav link 404s — path mismatch**  
The "Outputs" item in the Map Data sidebar accordion pushes `/admin/map-data/outputs` (via `router.push('/admin/map-data/' + 'outputs')`). The Outputs page exists but lives at `/admin/outputs` (`src/app/admin/(dashboard)/outputs/page.tsx`). Clicking Outputs in the nav hits Next.js's 404. Fix: change the push to `/admin/outputs`, or move the file to `map-data/outputs/`.

### High Priority

**#2 — Race: `setProject()` navigates before rows finish loading**  
`DB.loadProjectRows(p.id)` runs async; navigation to Cleaning is immediate. StageWorkbench may read empty rows. `rowsLoading` overlay added — verify StageWorkbench disables action buttons while `rowsLoading === true`.

**#9 — Dual check path: DataChecksPanel (RPC) vs QCPanel (client-side)**  
Two parallel implementations. `DataChecksPanel` now uses RPCs; `QCPanel` still uses in-memory client-side checks. Clarify which is the canonical path and remove the other.

### Medium Priority

**#1 — Login: bootstrap errors swallowed before redirect**  
`handleSubmit` always pushes to dashboard even if `DB.bootstrap()` fails silently. Fix: check result, show error before redirect.

**#4 — Dashboard stats recompute on every render**  
`totalRows` iterates all projects × tables on every render. Fix: `useMemo`.

**Assignments legacy `generateGrid()` conflict with polygon-based hole IDs**  
`generateGrid()` in `/explore/assignments` still produces `H001-001` style IDs (old `rows × cols` schema). New sites use `PREFIX-A001` format from polygon-based setup. These are incompatible. Fix: remove `generateGrid()` entirely; the polygon flow is canonical.

**Live Map "Send Radio Call" — TODO stub**  
Device panel in Live Map has a "Send Radio Call" button with a `// TODO` comment and no implementation. Fix: pre-fill the Radio Call page with the selected device's team and navigate.

**Settings data defaults not persisted**  
Grade unit, depth unit, Au threshold, null values in Settings are local React state only — not saved to Supabase. Fix: add a `user_preferences` table or store as a project-level JSON column.

**`validation` stage dead code throughout**  
- `project_stages` table has `validation` column (Supabase schema)
- `StageStatus` type includes `validation`
- `DEFAULT_STAGES` includes `validation: 'pending'`
- `approveStage` order array includes `'validation'`
- `DataChecksPanel` and `QCPanel` props include `'validation'` in stage union
- `WorkspacePage` props include `'validation'` in stage union
- No `/admin/map-data/validation` page exists
Fix: Either build the validation page or remove all `validation` references from the type system, stage order, DB schema, and component props.

### Low Priority

**#3 — `window.prompt` / `window.alert` still used**  
Rename project (`window.prompt`) and delete project (typed-name confirm using native dialog) are inconsistent with the `confirmDialog()` / `notify()` system. Fix: replace with `GpConfirm` overlay.

**#6 — `coordInfo` omitted on `gp_run_check` early-return path**  
`detect_coord_system` branch returns early (when no easting/northing columns found) without the `coordInfo` key. Client expects optional `coordInfo` — no crash today but a footgun. Fix: always include `coordInfo: null` in early returns.

**#10 — `getRows` default limit 5000 (truncation footgun)**  
All current call sites pass `0` (unlimited) explicitly. Default of 5000 is a trap for future callers. Fix: change default to `0`.

**#11 — AI model name in two files**  
`aiConfig.ts` has `AI_MODEL = 'claude-sonnet-4-6'`; edge function has `model: 'claude-sonnet-4-6'` hardcoded. Fix: add comment in edge function pointing to `aiConfig.ts` as source of truth.

---

## 17. Dead Code

1. **`QCPanel.tsx` + `qc/index.ts`** — Legacy client-side QC. `DataChecksPanel` (RPC-backed) is the canonical path. If `QCPanel` is no longer rendered anywhere, delete both files.
2. **`WorkspacePage` `validation` stage branch** — `stage === 'validation'` code path inside `WorkspacePage.tsx` is unreachable (no validation page renders `WorkspacePage`). Remove the branch and the `'validation'` union type from its props.
3. **`DataChecksPanel` + `QCPanel` `validation` branch** — same dead `'validation'` branch in both panel components.
4. **Assignments `generateGrid()` function** — legacy `total_rows × total_cols` hole generator. Remove once polygon-based sites are fully canonical.
5. **`Output.rows?: number` in `db/types.ts`** — field never set or read; `row_count` is used. Delete.
6. **`STAGE_GATES` constant in layout.tsx** — declared but never populated or used. Delete.

---

## 18. Build Roadmap — What's Next

### A. Critical fixes

1. **Fix Outputs nav link** — the Outputs page exists at `/admin/outputs` but the sidebar nav pushes `/admin/map-data/outputs`. Either change `layout.tsx` to push `/admin/outputs` for the outputs subtab, or move `outputs/page.tsx` into `map-data/outputs/`.
2. **Resolve validation stage dead code** — decide to build the validation page or purge the `validation` references throughout the type system.
3. **Remove legacy `generateGrid()` from assignments** — conflicts with polygon hole IDs.

### B. Explore module — polish

1. **Radio Call → Individual target picker** — add device dropdown for `target_type = 'individual'`
2. **Live Map → Radio Call pre-fill** — wire the "Send Radio Call" device-panel button
3. **Survey Photos — mini map popup** — show photo GPS vs hole GPS for rejected/pending reviews

### C. Mobile app — pending features

1. **Offline hole map** (`explore/map.tsx`) — render site polygon + hole grid from local SQLite cache
2. **BLE mesh relay** — connect stub to actual BLE layer
3. **GNSS receiver integration** — centimetre-accuracy positioning via BLE
4. **Alert history** (`command/alerts.tsx`) — verify it loads `explore_alerts` scoped to device's team
5. **Mobile photo review** (`command/photos.tsx`) — supervisor approve/reject on mobile

### D. Supabase hardening

1. Add proper RLS on Explore tables for anon-key access (currently relying on service-role key in edge functions)
2. Rate-limit `gold-ai` edge function per project/user (prevent AI budget abuse)
3. Confirm `profiles`, `site_vertices`, `site_grid_config` tables exist in final `setup.sql`
4. Handle Supabase JWT refresh in Expo app (token expiry)

### E. UX improvements

1. Replace remaining `window.prompt` / `window.alert` calls with `GpConfirm` / `notify()` system
2. WorkspacePage "Ask AI" — show generated SQL in read-only box before executing
3. Settings data defaults — persist to Supabase (add `user_preferences` table or project JSON column)
4. `DB.bootstrap()` failure — surface error before redirecting to dashboard

---

## 19. Deployment

### Web + Admin

- Hosted on Vercel, connected to `main` branch
- Push to `main` → auto-deploy production
- `vercel.json` + `.vercelignore` configured

### Mobile

- EAS Build (`apps/mobile/eas.json`)
- Profiles: `development`, `preview`, `production`

### Supabase Edge Functions

```bash
supabase functions deploy gold-ai
supabase functions deploy generate-device-invitation
supabase functions deploy claim-device
supabase functions deploy validate-survey-photo
supabase functions deploy send-alert
```

### Database Schema

Run `supabase/setup.sql` in the Supabase Dashboard SQL Editor.

**Warning:** the file begins with `DROP TABLE CASCADE` statements — never run on production without a full backup.

---

*Last updated: 2026-06-25. Generated from full codebase review.*
