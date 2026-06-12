# GoldPass — Architecture, Operations Map & Roadmap

GoldPass is the internal drill-data QA/QC application embedded in the Bart Mining
website at `/admin`. It is a Next.js 15 (App Router) client application backed by
Supabase (Postgres + Auth + Edge Functions). This document maps every page,
component, library function, and data flow; analyses security; and gives
domain-grounded recommendations for further development.

---

## 1. High-level infrastructure diagram

```
                        ┌──────────────────────────────────────────┐
                        │             Vercel (Next.js)              │
                        │                                            │
   Browser  ───────────▶│  Marketing site   /            (public)   │
                        │  ├─ Navbar / Footer (SiteChrome)           │
                        │  └─ pages: /, /about, /products, /insights │
                        │                                            │
                        │  GoldPass admin   /admin/*     (protected) │
                        │  ├─ middleware.ts  (Supabase session check)│
                        │  ├─ /admin/login                           │
                        │  └─ /admin/(dashboard)/*                   │
                        │      ├─ layout.tsx  (AppContext, sidebar)  │
                        │      ├─ dashboard/                         │
                        │      ├─ validation/  cleaning/  analysis/  │
                        │      ├─ outputs/                           │
                        │      ├─ visualization/                     │
                        │      └─ settings/                          │
                        └───────────────┬────────────────────────────┘
                                         │ supabase-js (browser client)
                                         ▼
                        ┌──────────────────────────────────────────┐
                        │              Supabase project              │
                        │                                            │
                        │  Auth: email/password + Google OAuth       │
                        │                                            │
                        │  Postgres tables:                          │
                        │   - projects                               │
                        │   - tables_meta                            │
                        │   - table_rows                             │
                        │   - versions                               │
                        │   - audit_log                              │
                        │   - outputs                                │
                        │                                            │
                        │  Edge Function: gold-ai (NL → SQL)         │
                        └──────────────────────────────────────────┘
```

**Auth flow**

```
/admin/* request
   │
   ▼
middleware.ts ── createServerClient (cookies) ── supabase.auth.getUser()
   │                                   │
   │ no session                       │ session OK
   ▼                                   ▼
redirect → /admin/login         allow request through
                                       │
                                       ▼
(dashboard) layout.tsx → DB.restoreSession() → DB.bootstrap()
   │ fails → console.error + router.push('/admin/login')
   ▼
AppContext.Provider { user, projects, project, tables, stageStatus, ... }
```

---

## 2. Page / route map

| Route | File | Purpose |
|---|---|---|
| `/admin/login` | `src/app/admin/login/page.tsx` | Email/password sign-in (`DB.signIn`) + "Continue with Google" (`DB.signInWithGoogle`) |
| `/admin/dashboard` | `.../dashboard/page.tsx` | Project list, create-project form, KPI counters, recent activity feed |
| `/admin/validation` | `.../validation/page.tsx` | `WorkspacePage` with `stage="validation"`, `QC_DEFS` |
| `/admin/cleaning` | `.../cleaning/page.tsx` | `WorkspacePage` with `stage="cleaning"`, `CLEAN_DEFS` (gated on validation done) |
| `/admin/analysis` | `.../analysis/page.tsx` | `WorkspacePage` with `stage="analysis"`, `ANALYSIS_DEFS` (gated on cleaning done) |
| `/admin/outputs` | `.../outputs/page.tsx` | Build & export collar/assay output CSVs, `DB.addOutput`, `DB.getOutputs` (gated on analysis done) |
| `/admin/visualization` | `.../visualization/page.tsx` | Drill-hole/section visualisation (gated on analysis done) |
| `/admin/settings` | `.../settings/page.tsx` | Account / project settings |

All `(dashboard)` routes share `layout.tsx`, which provides `AppContext` (current
user, projects, active project, tables, stage status, and helper methods
`setProject`, `approveStage`, `isStageUnlocked`, `getStageStatus`, `refresh`).

Stage gating (`STAGE_GATES`): `cleaning → analysis → outputs/visualization` are
locked until the prior stage is approved (`approveStage`), persisted to
`localStorage` under `gp-stage-status`.

---

## 3. Component map

```
src/components/goldpass/
├── WorkspacePage.tsx      shared shell for validation/cleaning/analysis stages
│   ├── table tab strip + data preview grid
│   ├── right panel: QC | SQL | Files
│   │     QC   → <QCPanel>
│   │     SQL  → ask-AI box (DB.goldAI / mockAIQuery) + runSimpleSQL + result table
│   │     Files→ table list, "Edit" → <TableEditorPage>, "Merge all" → DB.mergeTables, delete → DB.deleteTable
│   └── <UploadModal> (CSV/Excel ingest)
│
├── QCPanel.tsx             runs QC_DEFS / CLEAN_DEFS / ANALYSIS_DEFS against active table
│   ├── per-check "Run" → runQC() → results + issue preview table
│   ├── "Fix" (if def.fixable) → applyFix() → DB.replaceRows
│   ├── comparison-table dropdown for def.needsCompare
│   └── "Save as table" (analysis stage) → DB.createChildTable
│
├── TableEditorPage.tsx     full-table view: filter, remove duplicates/empty rows,
│                           export CSV, version badge (DB.getVersions)
│
└── UploadModal.tsx         CSV parsing (RFC-4180 splitCsvLine), column-type
                            inference, DB.insertTable (chunked inserts)
```

---

## 4. Library layer

### 4.1 `src/lib/goldpass/db/index.ts` — `DB` object (Supabase data-access layer)

| Function | Purpose | Wired in UI? |
|---|---|---|
| `ready()` | true if Supabase env vars configured | internal |
| `signIn(email, pw)` | email/password login | login page |
| `signInWithGoogle()` | Google OAuth via `signInWithOAuth` | login page (new) |
| `restoreSession()` | restore Supabase session on boot, try/catch + console log | dashboard layout |
| `signOut()` | sign out, clear cache | sidebar |
| `bootstrap()` | initial cache warm-up (projects etc.) | dashboard layout |
| `loadProjectRows(projectId)` | load all table rows for a project into cache | dashboard "create project" |
| `getProjects()` | list cached projects | layout, dashboard |
| `createProject(name)` | insert new project row | dashboard |
| `getTables(projectId)` | list tables for project | layout, workspace |
| `getRows(tableId, limit)` | rows for a table (0 = all) | workspace, table editor, QC |
| `insertTable(projectId, name, type, rows, columns, user)` | create table_meta + chunked insert into table_rows | UploadModal |
| `replaceRows(tableId, rows, user, opCode, detail)` | full delete+reinsert, bump version, write audit log | QC fix, dedupe/empty-row removal |
| `deleteTable(tableId, projectId, user)` | remove table + meta | files panel |
| `createChildTable(projectId, name, rows, parentIds, user)` | save QC issue subset as new table | QCPanel "Save as table" (newly wired) |
| `mergeTables(projectId, tableIds, name, user)` | union/merge multiple tables into one | WorkspacePage "Merge all" (newly wired) |
| `log(projectId, op, detail, user)` | write audit_log row | internal, called by replaceRows etc. |
| `getAuditLog(projectId)` | last ≤200 audit entries | dashboard "Recent activity" (newly wired) |
| `addOutput(projectId, name, rows)` | persist generated export | outputs page |
| `getOutputs(projectId)` | list outputs | dashboard counters, outputs page |
| `getVersions(tableId)` | list version history | TableEditorPage version badge (newly wired) |
| `goldAI(projectId, question)` | calls Supabase edge function `gold-ai` (NL → SQL) | WorkspacePage "Ask" (newly wired, with `mockAIQuery` fallback) |

### 4.2 `src/lib/goldpass/qc/index.ts` — QC / cleaning / analysis function library

Three exported definition arrays drive `QCPanel`:

- **`QC_DEFS`** (Validation stage) — fns 01–11 of the spec: hole-ID format,
  duplicate hole IDs, from/to interval errors, interval overlaps/gaps,
  duplicate intervals, negative grades, coordinate outliers, null placeholders,
  collar completeness, plus comparison checks `find_undrilled` /
  `find_orphan_assays` / `find_missing_rows` (now wired with `compare` table
  selector).
- **`CLEAN_DEFS`** (Cleaning stage) — fns 12–14: standardise hole IDs, remove
  undrilled holes, resolve unit conflicts.
- **`ANALYSIS_DEFS`** (Analysis stage) — fns 21–24: best intercept
  (`findBestIntercept`), correlation (`findCorrelation`), grade ranking
  (`rankByGrade`), plus general issue review with "Save as table".

Core functions:

- `runQC(def, rows, invMap, compare?)` → `{ issues, count, summary, cols, error? }`
- `applyFix(def, rows, invMap)` → cleaned rows for `fixable` defs
- `invertColMapping(columns)` (in `db/helpers`) → maps logical field names
  (hole_id, from, to, grade, x, y, z…) to actual column headers
- `runSimpleSQL(sqlText, tables, getRows)` → regex-parsed `SELECT … FROM … [WHERE …] [LIMIT …]`
  prototype query engine, `WHERE` evaluated via `new Function`
- `mockAIQuery(question, tables, activeTable)` → local heuristic NL→SQL fallback
- `exportCsv(rows, filename)` → client-side CSV download

**Spec functions not yet implemented** (from the 25-function reference docs):
`compareFiles`, `findDuplicatesAcrossFiles`, `reconcileColumns`, `mergeFiles`
(distinct from `mergeTables`'s simple union), `diffFiles`, `buildCollarOutput`
(currently a manual implementation lives in `outputs/page.tsx`),
`exportCollarOutput` (generic exporter — currently outputs page is hardcoded
to collar+assay).

---

## 5. "Endpoints" (Supabase tables & edge functions)

GoldPass has no custom Next.js API routes — all data access goes directly from
the browser to Supabase via `supabase-js`, governed by Row Level Security (RLS)
policies (see Security section).

| Table | Columns (key) | Written by | Read by |
|---|---|---|---|
| `projects` | id, name, owner, created_at | `createProject` | `getProjects`, dashboard |
| `tables_meta` | id, project_id, name, type, columns(json), row_count | `insertTable`, `createChildTable`, `mergeTables` | `getTables` |
| `table_rows` | id, table_id, data(json), row_index | `insertTable`, `replaceRows` | `getRows` |
| `versions` | id, table_id, created_at | `replaceRows` | `getVersions` |
| `audit_log` | id, project_id, operation, details, created_at | `log()` (called from replaceRows, deleteTable, mergeTables, createChildTable, etc.) | `getAuditLog` |
| `outputs` | id, project_id, name, rows(json)/path, created_at | `addOutput` | `getOutputs` |

| Edge function | Purpose | Caller |
|---|---|---|
| `gold-ai` | Natural-language question → suggested SQL + note | `DB.goldAI` (WorkspacePage "Ask") |

**Auth provider config required in Supabase Dashboard**: Email/Password
(enabled), Google OAuth (provider must be enabled with valid client
ID/secret + authorized redirect `https://bartmining.com/admin/dashboard`,
restored in code this session — verify it is still configured server-side).

---

## 6. Security analysis

1. **Auth boundary**: `middleware.ts` correctly gates all `/admin/*` routes
   server-side using `createServerClient` + cookie-based session — this is the
   real perimeter, not the client-side `gp-auth` cookie (which is currently
   unused/dead and can be removed).
2. **RLS is the actual data perimeter**. Since all reads/writes go straight
   from the browser using the anon key, every table (`projects`, `tables_meta`,
   `table_rows`, `versions`, `audit_log`, `outputs`) **must** have RLS policies
   scoping rows to `auth.uid()` / project ownership. If RLS is missing or
   permissive, any authenticated user can read/write any project's data —
   this should be audited directly in the Supabase dashboard (not visible from
   the codebase).
3. **`runSimpleSQL` + `new Function`**: WHERE-clause evaluation uses
   `new Function`, executed only against in-memory cached rows (not a real DB
   connection), so it cannot reach Postgres directly — but it is still
   arbitrary JS execution in the browser. Acceptable for an internal tool used
   by trusted staff; should never be exposed to untrusted users or extended to
   run server-side.
4. **`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON`**: intentionally
   public (anon key is safe to expose by design), but reinforces that RLS is
   the only thing standing between a logged-in user and other projects' data.
5. **Audit log** (`audit_log`, capped at 200 rows in `getAuditLog`) provides
   accountability for destructive ops (replaceRows, deleteTable, merges) —
   good practice, but consider also logging failed `bg()` write attempts
   (currently console-only, fire-and-forget).
6. **CSV upload**: now uses RFC-4180 parsing; still no server-side validation
   of file size / row count before chunked insert — large files could cause
   long-running client-side loops. Consider a hard row-count cap with a
   user-facing warning.
7. **Stage-status persistence in `localStorage`**: per-browser only, not
   server-synced or audited — a user could bypass stage gating by switching
   browsers/devices, or by editing localStorage. Low risk for an internal tool,
   but if stage approval needs to be authoritative (e.g. for compliance/sign-off),
   move it into `projects` or a new `project_stages` table with audit logging.

---

## 7. UI / UX suggestions

- **Outputs page**: generalise beyond the hardcoded "exactly one collar + one
  assay table" assumption — let the user pick which tables map to which
  output role, and implement a generic `exportCollarOutput`/`buildCollarOutput`
  per the spec so other deliverables (composite intervals, statistics summary)
  can be exported the same way.
- **Pagination**: `getRows` defaults to 5000 rows; large drill programs can
  exceed this. Add server-side pagination/virtualised scrolling to
  `TableEditorPage` and `WorkspacePage`'s preview grid.
- **Comparison-based QC checks** (`find_undrilled`, `find_orphan_assays`,
  `find_missing_rows`, and the unimplemented `compareFiles`/`diffFiles`/
  `findDuplicatesAcrossFiles`) would benefit from a dedicated "Compare files"
  panel rather than being buried per-check in QCPanel — this matches how
  Micromine/MapInfo workflows typically present a dedicated reconciliation step
  between collar/survey/assay/lithology files.
- **Visualisation page**: currently minimal — a simple plan-view (X/Y) and
  section-view (down-hole) plot using the cleaned `collar` + `survey` +
  `assay` tables would directly support the "gold prediction from survey data"
  goal and is a natural next milestone.
- **Stage approval**: surface *why* a stage is locked inline (which specific
  QC checks are still failing), not just "Complete Validation first."

---

## 8. Domain-informed roadmap (data quality & exploration best practice)

Drawing on standard mineral-exploration data-management practice (the
"garbage in, garbage out" principle central to QA/QC for collar, survey, assay
and lithology data, as used in Micromine/MapInfo-style workflows):

1. **Coordinate system handling**: GoldPass currently treats X/Y/Z as plain
   numeric columns. Industry practice requires an explicit, recorded coordinate
   reference system (e.g. UTM zone + datum) per project/table, with a
   validation check that all tables in a project share the same CRS before
   merging — this would be a strong addition to `QC_DEFS`.
2. **Down-hole survey validation**: beyond interval overlap/gap checks,
   standard QC includes dip/azimuth range checks and detection of unrealistic
   hole-deviation (tangent/minimum-curvature consistency) — a future
   `ANALYSIS_DEFS` candidate once survey tables are first-class.
3. **Assay QC**: negative-grade and null-placeholder checks exist; consider
   adding detection of below-detection-limit codes (e.g. `<0.01`) handled
   inconsistently across labs, and duplicate/standard/blank QC-sample flagging
   — central to "garbage in garbage out" assay QC.
4. **Grade prediction from survey data**: `findBestIntercept`,
   `findCorrelation`, `rankByGrade` give a foundation; a logical next step is
   a simple grade-domain/statistics summary output (mean, CV, top intercepts
   per hole) feeding into the Outputs/Visualisation stages — directly
   supporting resource-estimation handoff (Micromine/Datamine-style exports).
5. **File reconciliation suite**: implementing the remaining spec functions
   (`compareFiles`, `findDuplicatesAcrossFiles`, `reconcileColumns`,
   `mergeFiles`, `diffFiles`) closes the gap with standard "merge multiple
   field/lab batches" workflows and reduces manual reconciliation errors —
   the single highest-value remaining QC gap.

---

## 9. Rebuild status (implemented)

All of the following were implemented in the GoldPass rebuild:

- **Error-code system** (`src/lib/goldpass/errors.ts`) + **toast notifications**
  (`notify.ts`, `GpToasts.tsx`) — no silent failures; every persistence/auth/AI
  failure raises a coded toast and a structured console line. The UI never goes
  blank: errors surface as notifications while the design keeps working.
- **Real AI pipeline** — `mockAIQuery` removed. `supabase/functions/gold-ai/`
  is a schema-aware NL→SQL edge function (Anthropic-powered). Workbench flow:
  Ask → AI writes SQL → engine runs it → result saved as a new persisted file
  that appears on the workbench with an animation; empty results produce a
  "no matching values exist" notification.
- **Proper SQL engine** (`src/lib/goldpass/sqlEngine.ts`) — tokenized parser,
  no `new Function`: SELECT/DISTINCT, MAX/MIN/AVG/SUM/COUNT(+DISTINCT),
  WHERE (=, !=, >, <, >=, <=, LIKE, IS [NOT] NULL, AND/OR/NOT, parentheses,
  column-to-column), GROUP BY, ORDER BY, LIMIT, multi-table FROM, and guarded
  DELETE (confirmation + version + audit).
- **Outputs persisted** — `outputs.data` jsonb stores the full result rows;
  any output can be re-downloaded later (`DB.downloadOutput`).
- **Stage status server-persisted** — new `project_stages` table replaces
  localStorage; approvals are audited.
- **`bg()` writes** now raise coded toasts (GP-22xx) on failure.
- **`gp-auth` cookie removed** (middleware uses the Supabase session).
- **Cross-file suite** — `diffTables`, `findDuplicatesAcrossTables`,
  `reconcileColumns`, column-aware `mergeTables`, generic `buildCollarOutput`
  with table pickers on the Outputs page.
- **`supabase/setup.sql`** — full schema, indexes, triggers and owner-scoped
  RLS policies for every table; run manually in the Supabase SQL editor.

## 10. Error code catalog

| Code | Meaning |
|---|---|
| GP-2314 | Supabase not connected — `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON` missing or invalid |
| GP-2101 | Sign-in failed (credentials rejected or auth service unreachable) |
| GP-2102 | Google sign-in failed (check Google provider config in Supabase) |
| GP-2103 | Session restore failed |
| GP-2104 | Sign-out failed to reach Supabase (local session cleared anyway) |
| GP-2105 | Signed in but no access to GoldPass tables — RLS missing (run `supabase/setup.sql`) |
| GP-2201 | Project failed to save |
| GP-2202 | Table import failed to save |
| GP-2203 | Row update failed to save |
| GP-2204 | Table delete failed to reach the database |
| GP-2205 | Audit log entry failed to save |
| GP-2206 | Output failed to save |
| GP-2207 | Stage status failed to save |
| GP-2208 | Bootstrap failed — could not load projects/tables |
| GP-2209 | Version record failed to save |
| GP-2301 | SQL could not be parsed (unsupported syntax) |
| GP-2302 | Table named in the query does not exist on the workbench |
| GP-2303 | Column named in the query does not exist |
| GP-2304 | WHERE clause invalid |
| GP-2401 | AI service unreachable (gold-ai not deployed / network error) |
| GP-2402 | AI returned an unusable response |
| GP-2403 | AI not configured (`ANTHROPIC_API_KEY` secret missing) |
| GP-2501 | Export failed — output has no rows |
| GP-2502 | Output download failed — stored data could not be fetched |

## 11. Deployment steps (manual, one-time)

1. Supabase Dashboard → SQL Editor → run `supabase/setup.sql`.
2. `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...`
3. `supabase functions deploy gold-ai`
4. Verify Google provider is enabled (Auth → Providers) with redirect
   `https://bartmining.com/admin/dashboard`.
5. Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON`.

## 12. Remaining known limitations

- Audit log capped at 200 entries in the UI (full history stays in the table).
- `getRows` default limit 5000; very large drill programs need pagination.
- Visualisation page is still minimal (plan-view/section plots are the next milestone).

---

## Visual Stage Workbench (added)

Each working stage (Validation, Cleaning, Analysis) is now a **visual canvas
workbench** instead of a linear file list. Stage gating and the
Approve & Continue flow are unchanged.

**Components** (`src/components/goldpass/workbench/`):
- `StageWorkbench.tsx` — the canvas page: file tray, draggable file cards,
  connection lines, plain-English action bar, Ask AI box. A "Table view"
  button opens the previous list-style workspace (`WorkspacePage`) for
  row-level work.
- `FileCard.tsx` — a file as a card: name, type, row count, column list.
  Card geometry constants let line endpoints be computed without DOM
  measurement.
- `findConnections.ts` — detects matching columns between files on the
  canvas: same semantic role (hole_id, easting/northing, from/to…) →
  high-confidence line (hole_id is additionally value-checked); identical
  raw column names with ≥30% value overlap → medium-confidence line.
  Unrelated files get no lines.

**Interaction model**: drag files from the tray onto the canvas → lines
appear between related files → click to select 1-4 cards → run an action
or ask the AI. Every non-destructive result is saved as a **Result File**
(`tables_meta.type='child'`, `parent_ids` = sources) and animates onto the
canvas with dashed gold "Made From" lineage lines. Destructive fixes
(Remove Duplicate Rows, Remove Empty Rows, …) confirm first and record a
version via `DB.replaceRows`.

**Plain-language naming**: `src/lib/goldpass/qc/` is now
`src/lib/goldpass/dataChecks/` (`CHECK_DEFS`, `runCheck`, `CheckDef`,
`CheckResult`); `QCPanel` is `DataChecksPanel`. User-facing actions are
plain English: Find Missing Hole IDs, Find Missing Values, Check
Coordinates, Check Files Match, Remove Duplicate Rows, Remove Empty Rows,
Fix Hole ID Format, Trim Extra Spaces, Merge Matching Files, Find Best
Holes, Rank Holes by Grade, Compare Files, Ask AI.

**Theme**: dark remains the default; a Dark/Light toggle
(`ThemeToggle.tsx`) replaces the "Internal · Live" topbar label. Light
theme is CSS-variable overrides under `.gp-root[data-theme="light"]`;
the preference is a cosmetic localStorage value only.
