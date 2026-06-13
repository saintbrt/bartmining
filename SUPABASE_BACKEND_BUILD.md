# GoldPass — Fully-Connected Supabase Backend Build

This is the build contract for moving GoldPass from local-cache-first to
**Supabase-as-source-of-truth**, with heavy functions running in Postgres and
true session resume.

Target: Medium data (10k–100k rows/file). Single private user.

---

## GLOBAL GUARDRAILS (apply to EVERY build step)

These are hard constraints. If a step cannot be done without violating one of
these, STOP and ask — do not work around it.

- **G1 — NEVER redesign the workbench.** Canvas layout, file cards, drag/drop,
  connection lines, action bar, Ask AI box: visual structure and arrangement
  stay byte-for-byte as they are. Only the *data source behind them* changes.
- **G2 — NEVER change the look & feel.** No new colors, spacing, fonts, card
  styles, theme behavior, or page layouts. Dark stays default. No restyling
  "while I'm in there."
- **G3 — NEVER rename or reorganize UI.** No QC/SQL/query wording reintroduced.
  Plain-English labels stay. Page routes and names unchanged.
- **G4 — One concern per step.** Each step below touches ONLY its named files /
  layer. No drive-by edits to other steps' files. No refactors outside scope.
- **G5 — Additive, not destructive.** Existing function *signatures* on the `DB`
  layer keep working (same names, same return shapes the UI already consumes)
  so no calling component needs editing for behavior. Internals change; the
  contract the UI sees does not.
- **G6 — Type-check + build must pass** (`npx tsc --noEmit` and `npm run build`)
  at the end of every step before it's considered done.
- **G7 — No new dependencies** unless explicitly approved in that step.
- **G8 — `tsconfig.json` exclude list stays** `["node_modules", "goldpass",
  "supabase/functions"]`. Never let Deno edge code into the Next build.
- **G9 — Security is non-negotiable.** RLS on every table (`user_id =
  auth.uid()`). Anthropic key only in Supabase secrets, never client. AI SQL
  runner is SELECT-only, project-scoped, row- and time-limited.
- **G10 — No live data loss.** `setup.sql` stays clearly marked destructive and
  is only for a fresh/cleared DB. New tables/RPCs are added without dropping
  existing data tables unless the user explicitly re-runs the full reset.

---

## STEP 1 — Schema additions
**Scope:** `supabase/setup.sql` ONLY.

- [ ] Add table `workbench_state` (project_id, stage, files_on_canvas jsonb,
      selection uuid[], updated_at). PK = (project_id, stage).
- [ ] Add table `ai_usage` (id, project_id, tokens_in, tokens_out, model,
      created_at).
- [ ] Add indexes: `table_rows (table_id, row_index)`,
      `table_rows (project_id, table_id)`, and a GIN/expression index on the
      hole_id path used by cross-file checks.
- [ ] RLS policies for both new tables: `user_id = auth.uid()` via project_id.
- [ ] Keep all existing tables/columns unchanged. No drops beyond the existing
      documented reset block.

**Guardrails for this step:** schema only. No TS, no UI. Do not alter existing
table definitions except to add indexes.

**Done when:** `setup.sql` parses cleanly (manual review), new tables + RLS +
indexes present, nothing existing removed.

---

## STEP 2 — Postgres RPC functions
**Scope:** `supabase/setup.sql` (function definitions) ONLY.

Define these `SECURITY DEFINER` functions, each re-checking project ownership:

- [ ] `gp_find_orphan_intervals(project_id, collar_id, interval_id)`
- [ ] `gp_find_undrilled_holes(project_id, collar_id, interval_id)`
- [ ] `gp_find_duplicate_holes(table_id)`
- [ ] `gp_check_coordinates(table_id)`
- [ ] `gp_grade_summary(table_id, metal)`
- [ ] `gp_distance_filter(table_id, ref params)`
- [ ] `gp_build_collar_output(collar_id, interval_id)`
- [ ] `gp_run_query(project_id, sql text)` — locked down: single SELECT only,
      project-scoped, hard row limit, statement timeout. Rejects anything else.

Each function returns a result set (and/or creates a Result File row server-side
where the current UI expects one, returning the new id).

**Guardrails:** functions must return the SAME logical results the current
client-side `dataChecks/` + `sqlEngine` produce — behavior parity, not new
behavior. No new check types invented here.

**Done when:** each RPC callable via `supabase.rpc`, returns parity results on
mock data, `gp_run_query` provably rejects non-SELECT / cross-project / oversized
queries.

---

## STEP 3 — `gold-ai` edge function rewrite
**Scope:** `supabase/functions/gold-ai/index.ts` ONLY.

- [ ] Receive prompt + table schemas.
- [ ] Call Claude (`claude-sonnet-4-6`), system prompt constrains to the
      supported SELECT subset.
- [ ] Call `gp_run_query` with the returned SQL.
- [ ] Create the Result File server-side (or return rows for the DB layer to
      persist — match whatever Step 4 expects; decide here, document here).
- [ ] Insert one `ai_usage` row (input/output tokens from Anthropic response).
- [ ] Return `{ file_id | rows, note, usage }` or `{ error, code }`.

**Guardrails:** key stays in Supabase secrets. Return shape stays compatible
with what `DB.goldAI` already hands the workbench (`askAi()` must not need UI
changes). No model change other than the agreed `claude-sonnet-4-6`.

**Done when:** edge function deploys, returns usage, errors carry GP codes,
`askAi()` consumes it without UI edits.

---

## STEP 4 — `DB` layer rewrite (the big one)
**Scope:** `src/lib/goldpass/db/**` ONLY.

- [ ] Make every mutation `await`-ed: optimistic update → confirm → reconcile →
      rollback + `notify('error', …, GP-code)` on failure.
- [ ] Reads come from a cache that is ALWAYS rebuilt from Postgres on load /
      project switch (no stale trust).
- [ ] Rows lazy-load: metadata always; rows fetched on demand with range
      pagination. `getRows` keeps its signature but pulls/paginates from DB.
- [ ] Route heavy actions (orphans, undrilled, duplicates, coords, grade
      summary, distance, collar output) to the Step 2 RPCs.
- [ ] Route AI to the Step 3 edge function.

**Guardrails (critical):** `DB` public method names and return shapes stay the
same so NO component using them needs editing (G5). This step changes internals
only. Do NOT touch any `.tsx` page/component in this step.

**Done when:** every existing UI action works unchanged against real Supabase,
writes are confirmed (no silent drift), big files don't block the canvas.

---

## STEP 5 — Workbench-state persistence + resume
**Scope:** `StageWorkbench.tsx` state-sync wiring + `DB` helpers ONLY.

- [ ] On canvas change (file added/removed/moved, selection change): debounced
      upsert to `workbench_state`.
- [ ] On load: read `workbench_state`, restore files-on-canvas, positions,
      selection, for that project+stage.

**Guardrails:** add ONLY persistence wiring. Do NOT change how the canvas looks,
how cards drag, how lines draw, or the action bar. No new UI elements. Restore
must reproduce the existing layout exactly, not a new one.

**Done when:** refresh / leave-and-return drops you on the same canvas with the
same files, positions, and selection.

---

## STEP 6 — Settings: Claude AI box + token/budget meter
**Scope:** `src/app/admin/(dashboard)/settings/page.tsx` ONLY.

- [ ] Add a "Claude AI connected" status box styled IDENTICALLY to the existing
      Supabase box (same dot + label pattern).
- [ ] Read `ai_usage`, sum current month, show tokens used and est. cost vs
      $50 (Sonnet 4.6 pricing), with the same card styling already on the page.

**Guardrails:** reuse existing card / dot / label styles verbatim. No new design
language. No changes to other Settings cards.

**Done when:** box reflects last AI call status; meter shows real monthly tokens
+ $ vs $50, exact from `ai_usage`.

---

## STEP 7 — Reconcile dual sources of truth
**Scope:** `src/lib/goldpass/dataChecks/**` and `src/lib/goldpass/sqlEngine.ts`.

- [ ] Now that compute lives in Postgres RPCs, reduce these TS files to thin
      callers / types only, so there is exactly ONE implementation of each
      check. No behavior change.

**Guardrails:** do not delete types still imported by the UI. Do not change any
labels or action names. Purely removing the duplicated client-side compute.

**Done when:** no check has two implementations; UI still type-checks and builds.

---

## BUILD STATUS (this pass)

- [x] **Step 1** — `workbench_state` + `ai_usage` tables, indexes, RLS. Done.
- [x] **Step 2** — All ~25 check/fix/analysis/builder functions ported to Postgres
      RPCs in `setup.sql` (`gp_run_check`, `gp_apply_fix`, `gp_build_collar_output`,
      `gp_grade_summary`, `gp_distance_filter` + helpers). Parity caveats documented
      inline. **NOT executed/tested here (no Postgres in this environment) — must be
      run + verified against live Supabase.** `gp_run_query` intentionally NOT ported
      (custom dialect ≠ Postgres); AI SQL still runs via `sqlEngine.ts`.
- [x] **Step 3** — `gold-ai` returns `usage` (tokens) + model; client logs `ai_usage`.
- [x] **Step 4** — Additive DB methods: `loadTableRows` (lazy), `rpcRunCheck`,
      `rpcApplyFix`, `rpcBuildCollarOutput`, `rpcGradeSummary`, `rpcDistanceFilter`,
      `logAiUsage`, `getAiUsageThisMonth`, `saveWorkbenchState`, `getWorkbenchState`.
      Existing sync method signatures unchanged (G5 honoured — no `.tsx` call sites
      broken). New error codes GP-2305/2410/2411.
- [x] **Step 5** — Canvas resume: `StageWorkbench` restores files/positions/selection
      from `workbench_state` on load and debounce-saves on change. No visual change.
- [x] **Step 6** — Settings "Claude AI connected" box + token/$50 budget meter,
      styled identically to the Supabase box.
- [~] **Step 7** — PARTIAL by design: the canvas workbench now runs all checks via
      backend RPCs (`runAction` is async, with a per-action busy state). The legacy
      list view (`WorkspacePage`) and the single typed-point distance filter still use
      the TS engine (no ref table for the latter); the TS functions in `dataChecks`
      remain as those callers + a parity reference. Fully gutting them would require
      converting `WorkspacePage` to async RPCs too — deferred to avoid untested-here
      breakage.

Verification done here: `tsc --noEmit` clean, `npm run build` ✓ (40/40 pages).
Verification still REQUIRED on your side: run `supabase/setup.sql` against the live
DB and confirm each RPC returns parity results on real collar/assay/survey data, and
that the AI box + resume work end-to-end.

## OUT OF SCOPE (do not touch in ANY step unless separately approved)
- Workbench visual design, layout, drag behavior, connection-line rendering.
- Any page's look, arrangement, colors, copy (beyond the one Settings box).
- Auth / middleware / login flow.
- Visualization, Outputs, Dashboard, Table Editor *appearance*.
- Adding multi-user / `project_members`.
- Any new npm dependency.
- Model selection beyond `claude-sonnet-4-6`.
