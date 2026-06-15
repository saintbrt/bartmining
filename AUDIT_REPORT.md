# GoldPass Admin Dashboard — Code Audit

Scope: `src/app/admin/**`, `src/lib/goldpass/**`, `src/components/goldpass/**`,
`supabase/setup.sql`, `supabase/functions/gold-ai/index.ts`.

## Overview

GoldPass is a Next.js client app backed by Supabase (Postgres + RLS + Edge
Functions). The UI keeps an in-memory cache (`_c` in `db/index.ts`) that
mirrors Supabase tables for instant rendering, with "fire and forget"
background writes (`bg()`). Heavy data-quality/analysis operations run as
SECURITY DEFINER Postgres functions (`gp_*`) in `setup.sql`, called via
`DB.rpc*` wrappers. A Deno edge function (`gold-ai`) turns natural-language
questions into SQL for a custom client-side SQL engine (`sqlEngine.ts`).

Overall the RPC layer is well-aligned with the TS wrappers and the SQL
functions consistently call `gp_assert_owner()`. The bugs found are mostly:
optimistic-cache/Supabase desync risks, a few stale or unreachable code
paths, off-by-one row-count semantics, and UI affordances that don't fully
match backend behaviour.

---

## Page-by-Page Breakdown

### `/admin` (`src/app/admin/page.tsx`)
Pure redirect to `/admin/dashboard`. No issues.

### `/admin/login` (`src/app/admin/login/page.tsx`)
- "Sign in" → `DB.signIn()` → Supabase `auth.signInWithPassword`, then
  `DB.bootstrap()`, then `router.push('/admin/dashboard')`.
- "Continue with Google" → `DB.signInWithGoogle()` → `auth.signInWithOAuth`.
No RPCs. No issues beyond Issue #1 below (bootstrap not awaited for errors).

### `(dashboard)/layout.tsx`
Wraps all dashboard routes; handles session restore, project list/select,
stage-gating, sign-out. No RPC calls. See Issues #2, #3.

### `(dashboard)/dashboard/page.tsx`
- "Create" (new project) → `DB.createProject()` (local + bg insert into
  `projects`).
- Project card "✎ Rename" → `DB.renameProject()`.
- Project card "✕ Delete" → `DB.deleteProject()` (typed-name confirm).
- Clicking a project card → `ctx.setProject()` → loads rows, navigates to
  `/admin/validation`.
No RPCs. See Issue #4 (totalRows/tables stat).

### `(dashboard)/validation|cleaning|analysis/page.tsx`
Thin wrappers around `StageWorkbench` with `stage` prop fixed per route.
Identical structure, no page-specific logic. No issues beyond what's in
`StageWorkbench`.

### `components/goldpass/workbench/StageWorkbench.tsx`
The hub for almost all `DB.rpc*` calls and `DB.goldAI`. Buttons:

| `STAGE_ACTIONS` id | Stage | Handler | RPC / Local |
|---|---|---|---|
| `missing_hole_ids` | validation | `ALL_DEFS` fallthrough → `check()` | `gp_run_check` (p_check='missing_hole_ids') |
| `find_null_placeholders` | validation | fallthrough → `check()` | `gp_run_check` |
| `_data_health` | validation | explicit branch | `DB.rpcCheckDataHealth` → `gp_check_data_health` |
| `_intervals` | validation | explicit branch | `DB.rpcCheckIntervals` → `gp_check_intervals` |
| `_compare_files` | validation | explicit branch | `DB.rpcCompareFiles` → `gp_compare_files` |
| `_undrilled_orphans` | validation | explicit branch | `DB.rpcFindUndrilledOrphans` → `gp_find_undrilled_orphans` |
| `_combine_dedupe` | cleaning | explicit branch | `DB.rpcCombineAndDedupe` → `gp_combine_and_dedupe` |
| `_fix_formatting` | cleaning | explicit branch | `DB.rpcFixFormatting` → `gp_fix_formatting` |
| `_merge` | cleaning | explicit branch | local only — `DB.mergeTables` |
| `_analysis` | analysis | explicit branch | `DB.rpcAnalysisPool` → `gp_analysis_pool` |
| `_distance` | analysis | explicit branch | `DB.rpcDistanceFilterPooled` → `gp_distance_filter_pooled`, or local `distanceFilter()` if no ref file |
| "Ask AI" | all | `askAi()` | `DB.goldAI` → edge function `gold-ai`, then `executeSQL` (client-side) |
| "+ Upload" | all | `UploadModal` | local only — `DB.insertTable` |
| "Approve & Continue →" | all | `onApprove` → `approveStage()` | `DB.setStageStatus` (local + `project_stages` upsert) |
| "Table view" | all | toggles to `WorkspacePage` | local |

Most `CHECK_DEFS`/`CLEAN_DEFS`/`ANALYSIS_DEFS` ids that aren't explicitly
branched fall through to the generic `check()` → `gp_run_check` /
`gp_apply_fix` path (e.g. `negative_grades`, `trim_whitespace`,
`standardise_hole_ids`, `remove_empty_rows`, `find_duplicates`,
`from_greater_than_to`, etc.). See Issues #5–#8 for dead/unreachable ids.

### `components/goldpass/WorkspacePage.tsx` ("Table view")
- "Run SQL" → `runStatement()` → **client-side** `executeSQL` (sqlEngine.ts) —
  not an RPC, intentionally (per setup.sql comment).
- "Ask" (AI) → `DB.goldAI` → edge function, then `executeSQL` locally.
- "⊕ Merge all tables into one" → `DB.mergeTables` (local).
- "Edit"/"✕ Delete" per table → `DB.deleteTable` (local + bg delete).
- DataChecksPanel (right "Checks" tab) → **client-side** `runCheck`/`applyFix`
  from `dataChecks/index.ts` — does NOT call the `gp_run_check`/`gp_apply_fix`
  RPCs at all. See Issue #9.

### `components/goldpass/TableEditorPage.tsx`
- "+ Row", cell edit, "Delete N selected" → `DB.replaceRows` (local + bg
  delete/insert/version).
- "Columns" panel: rename column / set meaning → `DB.setTableColumns`,
  triggers `DB.replaceRows` when row data changes.
- "History" panel: "Restore this version" → `DB.restoreVersion` (RPC-free,
  direct `versions` table read).
- "CSV"/"Excel" export → local `exportCsv`/`exportExcel`.
No RPCs.

### `(dashboard)/outputs/page.tsx`
- "Preview output" → `DB.rpcBuildCollarOutput` → `gp_build_collar_output`.
- "Save output" / "Save as output" → `DB.addOutput` (local + bg insert +
  client-side `exportCsv`).
- "⬇ CSV" → `DB.downloadOutput` (direct `outputs` select).
- "⬇ Excel" → inline Supabase select + `exportExcel`.
- "✎ Rename" → `DB.renameOutput`; "✕ Delete" → `DB.deleteOutput`.

### `(dashboard)/visualization/page.tsx`
Pure client-side rendering from `DB.getRows()` (cache). No RPCs, no
mutations. "⬇ PNG" exports canvas. No issues found beyond general cache
staleness concerns (Issue #2).

### `(dashboard)/settings/page.tsx`
- "Sign out" → `DB.signOut()`.
- AI usage meter → `DB.getAiUsageThisMonth()` (direct `ai_usage` select).
- "⬇ Download full backup (.xlsx)" → local, reads `DB.getRows()` cache.
- Activity history → `DB.getAuditLog()` (cache).
No RPCs.

---

## RPC Cross-Reference Table

| TS wrapper (`db/index.ts`) | RPC name | Exists in setup.sql | Called from | Wrapper return type matches jsonb_build_object keys? |
|---|---|---|---|---|
| `rpcRunCheck` | `gp_run_check` | ✅ (line ~270) | `StageWorkbench.check()` (generic fallthrough actions) | ✅ `{issues,count,summary,cols,coordInfo?,error?}` matches |
| `rpcApplyFix` | `gp_apply_fix` | ✅ (line ~600) | `StageWorkbench.runActionInner` fixing branch | ✅ returns `{rows,count}`; wrapper extracts `.rows` |
| `rpcBuildCollarOutput` | `gp_build_collar_output` | ✅ (line ~669) | `outputs/page.tsx` `buildPreview()` | ✅ `{rows,error?}` |
| `rpcGradeSummary` | `gp_grade_summary` | ✅ (line ~710) | **none** | n/a — dead TS wrapper (see Dead Code) |
| `rpcDistanceFilter` | `gp_distance_filter` | ✅ (line ~733) | **none** (only the *pooled* variant is used) | n/a — dead TS wrapper |
| `rpcCombineAndDedupe` | `gp_combine_and_dedupe` | ✅ (line ~754) | `StageWorkbench` `_combine_dedupe` | ✅ `{clean,duplicates,anomalies,summary,error?}` |
| `rpcFixFormatting` | `gp_fix_formatting` | ✅ (line ~876) | `StageWorkbench` `_fix_formatting` | ✅ `{files:[...],error?}` |
| `rpcCheckIntervals` | `gp_check_intervals` | ✅ (line ~948) | `StageWorkbench` `_intervals` | ✅ `{order_issues,overlaps,gaps,count,summary,error?}` |
| `rpcCheckDataHealth` | `gp_check_data_health` | ✅ (line ~1008) | `StageWorkbench` `_data_health` | ✅ `{issues,negative_grades,coord_outliers,incomplete_collars,count,coord_system,summary,error?}` |
| `rpcFindUndrilledOrphans` | `gp_find_undrilled_orphans` | ✅ (line ~1094) | `StageWorkbench` `_undrilled_orphans` | ✅ `{undrilled,orphans,count,summary,error?}` |
| `rpcCompareFiles` | `gp_compare_files` | ✅ (line ~1141) | `StageWorkbench` `_compare_files` | ✅ `{issues,count,summary,error?}` |
| `rpcAnalysisPool` | `gp_analysis_pool` | ✅ (line ~1187) | `StageWorkbench` `_analysis` | ✅ `{grade_summary,best_intercept,rank_by_grade,ppm_table,summary,error?}` |
| `rpcDistanceFilterPooled` | `gp_distance_filter_pooled` | ✅ (line ~1251) | `StageWorkbench` `_distance` (multi-ref branch) | ✅ `{rows,error?}` |

All `gp_*` SQL functions checked use `perform public.gp_assert_owner(v_pid)`
(directly or via per-table loop) **except**: `gp_col`, `gp_num`, `gp_fixed`,
`gp_rowkey`, `gp_cols`, `gp_assert_owner`, `owns_project`, `touch_updated_at`
— these are pure helpers/infra, not user-facing RPCs, so that's correct.

`gp_distance_filter` (singular, non-pooled) **does** call
`gp_assert_owner` but is unused from the frontend — see Dead Code.

---

## Dead Code List

1. **`DB.rpcGradeSummary` / `gp_grade_summary`** — TS wrapper defined in
   `src/lib/goldpass/db/index.ts:452-456`, SQL function defined in
   `setup.sql:710-730`, but no component calls `DB.rpcGradeSummary` anywhere
   (`grep` for `rpcGradeSummary` only matches the definition). The
   client-side equivalent `gradeSummary()` in `dataChecks/index.ts:383-395`
   is also unused (no call sites). Pure dead code on both sides.

2. **`DB.rpcDistanceFilter` / `gp_distance_filter`** (singular/non-pooled) —
   `db/index.ts:457-461` and `setup.sql:733-750`. Only
   `rpcDistanceFilterPooled` is called from `StageWorkbench`'s `_distance`
   action (multi-file branch); the single-ref RPC is unreferenced. The
   single-file/no-ref case instead uses the **client-side**
   `distanceFilter()` from `dataChecks/index.ts`.

3. **`STAGE_ACTIONS` ids that fall through to `ALL_DEFS`** —
   `missing_hole_ids` and `find_null_placeholders` (validation stage) are
   listed in `STAGE_ACTIONS` and *do* exist in `CHECK_DEFS`, so they're not
   dead, but every other `CHECK_DEFS`/`CLEAN_DEFS`/`ANALYSIS_DEFS` entry
   (e.g. `from_greater_than_to`, `from_to_overlaps`, `from_to_gaps`,
   `duplicate_intervals`, `negative_grades`, `coordinate_outliers`,
   `check_collar_completeness`, `trim_whitespace`, `standardise_hole_ids`,
   `remove_empty_rows`, `resolve_unit_conflicts`, `find_duplicates`,
   `find_missing_rows`, `detect_coord_system`, `best_intercept`,
   `rank_by_grade`, `find_correlation`, `diff_tables`, `duplicates_across`,
   `reconcile_columns`, `find_undrilled`, `find_orphan_assays`) have **no
   button anywhere in `StageWorkbench`** — they're only reachable via the
   "Table view" → `DataChecksPanel`, which uses the **client-side**
   `runCheck`/`applyFix`, not the RPCs. This means the corresponding `gp_*`
   SQL branches inside `gp_run_check`/`gp_apply_fix`
   (e.g. `'from_greater_than_to'`, `'coordinate_outliers'`,
   `'check_collar_completeness'`, `'resolve_unit_conflicts'`,
   `'find_correlation'`, `'best_intercept'`, `'rank_by_grade'`,
   `'detect_coord_system'`, `'find_undrilled'`, `'find_orphan_assays'`,
   `'find_missing_rows'`, `'diff_tables'`, `'duplicates_across'`,
   `'reconcile_columns'`) are **effectively dead SQL** — they exist only as
   unused parity ports (`rpcRunCheck`/`rpcApplyFix` are never invoked with
   those `p_check` values from any UI button). See Issue #9.

4. **`Output.rows?` field** (`db/types.ts:42`) — declared optional on the
   `Output` interface but never set or read anywhere (`grep` for `.rows`
   on an Output object finds nothing; `row_count` is used instead).

---

## Issues Found

1. **`login/page.tsx:17-20` — bootstrap errors swallowed before redirect.**
   `DB.bootstrap()` can fail per-project (`gpError('GP-2105'...)` or
   `'GP-2208'`) and returns `[]` on the top-level `projects` query error, but
   `handleSubmit` doesn't check this — it always calls
   `router.push('/admin/dashboard')` after a successful *sign-in* even if
   bootstrap silently produced an empty project list. The user lands on a
   dashboard that looks empty with no indication anything went wrong (the
   toast from `gpError` may have already faded).

2. **`(dashboard)/layout.tsx:62-69` `setProject()` — race between
   `loadProjectRows` and navigation.** `setProject()` immediately calls
   `router.push('/admin/validation')` while `DB.loadProjectRows(p.id)` is
   still in flight (`.then(() => refresh())`). `StageWorkbench` reads
   `DB.getRows()` synchronously on first render — if validation page mounts
   before rows finish loading, `connections` (via `findConnections`) and any
   `_distance`/checks running on cards added immediately will operate on an
   empty row cache (`_c.rows[t.id]` undefined → `getRows` returns `[]`).
   There's no loading state gating this.

3. **`(dashboard)/layout.tsx:96-103` `handleNav()` uses `alert()`.** Native
   `alert()` for the stage-lock message is inconsistent with the rest of the
   app's `notify()`/toast system (`GpToasts`) used everywhere else
   (`notify('warn', ...)`, `confirmDialog`, etc.). Minor UX inconsistency —
   "silly mistake" given the app otherwise has a polished toast system.

4. **`dashboard/page.tsx:78,87` — stats double-iterate and can be stale
   relative to `_c.tables`.** `totalRows` and the "Tables" stat both call
   `DB.getTables(p.id)` inside `.reduce`, for every project, on every render
   — O(projects × tables) recomputation with no memoization. Not a
   correctness bug per se, but combined with issue #2 (rows loading async)
   the "Data rows" counter can show 0 immediately after creating a project
   and before `loadProjectRows` resolves, then jump — there's no
   loading/skeleton state for `Counter`.

5. **`StageWorkbench.tsx:52` `FIXING_IDS` includes `'find_duplicates'`, but
   `'find_duplicates'` is in `ANALYSIS_DEFS`, not `CHECK_DEFS`/`CLEAN_DEFS`,
   and is not in any `STAGE_ACTIONS` list** — so the `FIXING_IDS` check at
   line 376 (`if (FIXING_IDS.has(actionId))`) can never be reached for
   `find_duplicates` via the generic `ALL_DEFS` fallthrough path in
   `StageWorkbench`, because no button ever sets `actionId = 'find_duplicates'`
   (see Dead Code #3). The `FIXING_IDS` set entry is effectively unreachable
   dead configuration inside `StageWorkbench` (it IS reachable from
   `DataChecksPanel`'s "Fix" button, but that path doesn't consult
   `FIXING_IDS` at all — `DataChecksPanel.handleFix` runs unconditionally for
   any `def.fixable`).

6. **`gp_run_check` "detect_coord_system" / "best_intercept" / "rank_by_grade"
   / "find_correlation" early-return shape mismatch with `CheckJson`.**
   These branches `return jsonb_build_object('issues','[]'::jsonb,'count',0,
   'summary',...,'cols','[]'::jsonb, ...)` — note `'cols'` is the *literal
   string* `'[]'` cast to jsonb (i.e. a JSON array, fine) but for
   `'best_intercept'`/`'rank_by_grade'`/`'find_correlation'` "no grade column"
   early-return, the object **omits `coordInfo`** entirely while the success
   path of `detect_coord_system` *adds* `coordInfo`. `CheckJson` in
   `StageWorkbench.tsx:55` types `coordInfo?` as optional so this is
   technically safe, but it means **`gp_run_check('detect_coord_system', …)`
   when `v_ecount = 0` returns no `coordInfo`** while the happy path does —
   any caller that unconditionally reads `res.coordInfo.system` (none
   currently do, but `DataChecksPanel`'s client-side `detect_coord_system`
   case at `dataChecks/index.ts:203` always sets `coordInfo`) would break if
   ported. Inconsistent contract between the two implementations of the same
   check (client `dataChecks/index.ts` vs SQL `gp_run_check`).

7. **`gp_compare_files` (setup.sql:1141-1182) tags rows with `_only_in` /
   `_missing_from`, but `gp_run_check`'s `'diff_tables'` branch
   (setup.sql:531-546) and the client `diffTables()` in
   `dataChecks/index.ts:311-318` tag rows with `_side: 'only in A'/'only in B'`.**
   These are two different checks for conceptually the same "diff" operation
   with different output column naming conventions (`_side` vs
   `_only_in`/`_missing_from`). Not a bug per se (different RPCs/checks by
   design) but a naming inconsistency that increases the "silly mistake"
   surface if someone tries to unify them later — e.g. `_compare_files`
   issues saved as a Result File (`StageWorkbench.tsx:364`) will have
   different marker columns than a `diff_tables` Result File, with no shared
   convention.

8. **`StageWorkbench.tsx:325-353` `_distance` action — `refs.length` check
   silently changes UX semantics.** When exactly one file is selected
   (`refs.length === 0`), the user is prompted for a typed "East, North"
   point and the check runs **entirely client-side** via `distanceFilter()`
   (no RPC, no `gp_assert_owner`, operates on `DB.getRows(A.id, 0)` — i.e.
   whatever is in the local cache, which could be stale per Issue #2). When
   2+ files are selected, it switches to the pooled RPC
   `gp_distance_filter_pooled` which re-fetches fresh from `table_rows`.
   Same button, same label, two different data-freshness guarantees with no
   indication to the user.

9. **`DataChecksPanel.tsx` ("Table view" → Checks tab) never calls any
   `gp_run_check`/`gp_apply_fix` RPC — it's 100% client-side
   (`runCheck`/`applyFix` from `dataChecks/index.ts`), operating on
   `DB.getRows(table.id, 0)`.** Per the comment block at the top of
   `setup.sql` (lines 201-223), the SQL RPCs were built specifically *so the
   heavy work runs where the rows live* and so "the thin client wrappers
   (Step 7) can swap to these without UI changes" — but that swap was never
   completed for `DataChecksPanel`. For large tables (the doc references
   10k-100k rows/file), every check in the "Table view" Checks tab runs the
   full row set in the browser, while the *same checks* triggered from the
   workbench canvas (`StageWorkbench` generic fallthrough) run server-side.
   Two code paths for the same checks, with different performance
   characteristics and (per Issue #6/#7) slightly different output shapes —
   high risk of "fixed it in one place, not the other" bugs going forward.

10. **`db/index.ts:181-184` `getRows(tableId, limit = 5000)`** — silently
    truncates to 5000 rows by default. Most call sites pass `0` explicitly
    (meaning "all"), e.g. `StageWorkbench`'s `connections` memo passes `200`,
    but `DataChecksPanel.handleRun` (line 31) and `TableEditorPage` (line 35)
    pass `0`. However `VisualizationPage`'s `buildPoints()` (line 22, 29)
    also passes `0`. The *one* place that doesn't pass an explicit value
    would silently get only 5000 rows — a `grep` shows all current call
    sites do pass an explicit arg, so this is currently latent, but the
    default of `5000` (vs `0`/unlimited) is a footgun for any future call
    site that omits the second argument, with no warning/error surfaced.

11. **`db/index.ts:390` `goldAI()` hardcodes `'claude-sonnet-4-6'` as the
    fallback model name for usage logging** (`json.model ?? 'claude-sonnet-4-6'`),
    matching the edge function's hardcoded `model: 'claude-sonnet-4-6'`
    (`supabase/functions/gold-ai/index.ts:60,80`) — consistent today, but
    both are hardcoded in two separate files with no shared constant; if the
    model is ever upgraded, both files (plus the `${AI_BUDGET}` pricing
    comment at `db/index.ts:407-408`, and the Settings page label at
    `settings/page.tsx:92`) need coordinated edits with nothing enforcing it.

12. **`outputs/page.tsx:27-28` collar/interval auto-selection can silently
    pick the wrong file.** `collar = tables.find(t => t.id === collarId) ??
    tables.find(t => t.type === 'collar')` — if the project has *multiple*
    `collar`-typed tables and the user hasn't explicitly chosen one via the
    dropdown, `find()` picks the first one in array order (insertion/created
    order), which may not be the one the user intends, with no indication
    that an implicit default was used. Same for `interval`/`type === 'assay'`.

13. **`gp_apply_fix` (setup.sql:600-666) `else` branch silently returns all
    rows unchanged** (`select coalesce(jsonb_agg(data order by row_index),'[]')
    into v_rows from public.table_rows where table_id = p_table`) for any
    `p_check` not explicitly handled (e.g. if `rpcApplyFix` were ever called
    with `'remove_empty_rows'`'s sibling check ids not covered, such as
    `'find_null_placeholders'` which **is** handled — but e.g.
    `'from_greater_than_to'`, `'coordinate_outliers'` etc. are `fixable:
    false` in `CHECK_DEFS` so `rpcApplyFix` should never be called with
    those — but there's no server-side guard / error if it were, it just
    returns the unmodified table as `{rows: <all rows>, count: <all>}` and
    `StageWorkbench` would call `DB.replaceRows` with the (unchanged) full
    row set, creating a spurious "version" entry in the audit log /
    `versions` table for a no-op fix).

14. **`StageWorkbench.tsx:95` selection cap of 4 silently drops extra
    selections** (`.slice(0, 4)`), and `toggleSelect` (line 168) also caps at
    4 with `prev.length >= 4 ? prev : [...]` — clicking a 5th file simply does
    nothing with no toast/feedback explaining the 4-file limit to the user.

15. **`db/types.ts:42` `Output.rows?: number`** is dead/unused (see Dead Code
    #4) — likely a leftover/renamed field (`row_count` is the real one),
    risk of confusion for future maintainers reading the type.

---

## Recommendations

1. Decide on **one** execution path for data-quality checks
   (`gp_run_check`/`gp_apply_fix` RPCs vs. client-side `dataChecks/index.ts`)
   and migrate `DataChecksPanel` to match `StageWorkbench`'s pattern — or
   explicitly document why both exist and keep their summaries/shapes in
   lock-step (currently both are hand-maintained parity ports per the
   `setup.sql` header comment, which is a maintenance burden and the most
   likely source of future "silly mistakes").

2. Remove or wire up the dead RPCs: `gp_grade_summary`/`rpcGradeSummary` and
   `gp_distance_filter`/`rpcDistanceFilter` (non-pooled). If `gradeSummary()`
   in `dataChecks/index.ts` is also unused, delete it too.

3. Add a loading/disabled state on the workbench while
   `DB.loadProjectRows()` is still resolving after `setProject()`, to avoid
   running checks/connections against an empty row cache (Issue #2).

4. Replace the native `alert()` in `(dashboard)/layout.tsx` with the existing
   `notify()` toast system for consistency (Issue #3).

5. Surface to the user when `_distance` falls back to the client-side,
   single-point path vs. the pooled server RPC (Issue #8), and consider
   running `gp_distance_filter` for the single-reference-file case too, for
   consistency and to use the indexed server-side computation.

6. Add a guard/error in `gp_apply_fix`'s `else` branch (Issue #13) so an
   unsupported `p_check` returns an explicit error instead of "fix did
   nothing but still recorded a version".

7. Give the user feedback when the 4-file selection cap is hit (Issue #14),
   and when `outputs/page.tsx` auto-selects a collar/interval file by type
   when multiple candidates exist (Issue #12).

8. Extract the hardcoded `'claude-sonnet-4-6'` model id and pricing
   (`$3`/`$15` per 1M tokens) into a single shared constant referenced by
   `db/index.ts`, `gold-ai/index.ts`, and `settings/page.tsx` (Issue #11).

9. Remove the unused `Output.rows?: number` field from `db/types.ts`
   (Issue #15).

---

## Fix Plan — Process Per Issue

For each item below: **Diagnose → Change → Verify (build + manual click-test)
→ Commit**. Issues are grouped in the order they'll be worked, not strictly
the numbering above (highest-impact / most-reported-by-user first).

### A. Workbench file selection still broken (reported again — not fully fixed)
- **Diagnose**: the earlier fix (removing `setPointerCapture`, extending
  auto-select) was committed, but user reports clicking still doesn't select.
  Re-check `FileCard.tsx` for a second click-blocking layer: confirm the
  click target is the card root (not a child with its own `stopPropagation`
  that never bubbles to `onToggleSelect`), confirm `selected` visual state
  (`selected` prop → border/highlight class) is actually applied and visibly
  distinct, and confirm the 4-file cap (Issue #14) isn't silently eating
  clicks when 4 files are already auto-selected (likely culprit: with the new
  "select every file added to canvas" behaviour, 4 files fill the cap
  immediately, so clicking a 5th/6th file does nothing — *looks* broken but
  is the cap with no feedback).
- **Change**:
  1. Add a toast (`notify('info', 'Max 4 files selected — deselect one first')`)
     in `toggleSelect` when the cap is hit (Issue #14).
  2. Verify `FileCard.tsx` root element has both the click handler and a
     `selected`-driven style (e.g. border colour/box-shadow) — add the style
     if missing so selection is visibly obvious.
  3. Re-test the auto-select cap: with >4 files on canvas, cap the
     *auto-select* to the first 4 but still allow manual toggling of the
     others (don't let auto-select silently reserve all 4 slots forever).
- **Verify**: manually add 1, 2, 5 files to a canvas; click each card and
  confirm the highlight toggles and `selected.length` (shown in UI) updates;
  confirm the cap toast appears on the 5th selection attempt.
- **Commit**: "Fix workbench selection: visible highlight + cap feedback".

### B. Project management — delete project / delete project files
- **Diagnose**: `DB.deleteProject` (dashboard) already works (Issue list has
  no bug logged against it — re-confirm with user it's the *file-level*
  delete that's missing). For files: `StageWorkbench` card's "✕" (`onRemove`)
  only removes the card from the **canvas layout**, it does NOT call
  `DB.deleteTable` — the underlying table/rows remain in the project and
  reappear in the "off-canvas" list. `DataChecksPanel`/`WorkspacePage` has a
  real "✕ Delete" → `DB.deleteTable`, but that's only reachable from "Table
  view", not the canvas.
- **Change**:
  1. Add a second control to `FileCard.tsx` (or a right-click/long-press
     menu) — "Delete file…" — that calls `confirmDialog()` then
     `DB.deleteTable(table.id)` (full delete: table_rows, versions, meta,
     remove from canvas/selection state).
  2. Keep the existing "✕" as "remove from canvas only" (relabel its title
     to "Remove from workbench" to disambiguate from the new delete).
  3. Dashboard project "✕ Delete" stays as-is (already typed-confirm +
     `DB.deleteProject`) — just double check `ctx.refresh()` actually
     re-renders the project list (Issue: confirm no stale `_c.projects`
     cache read after delete).
- **Verify**: delete a file from the canvas → confirm it disappears from
  canvas AND from the off-canvas list AND from "Table view" AND a page
  refresh doesn't bring it back (Supabase row actually deleted). Delete a
  project → confirm it disappears from the dashboard and its tables/outputs
  are gone after refresh.
- **Commit**: "Add file delete (not just remove-from-canvas) to workbench
  cards".

### C. New Output: HOLEID / MFRO / MTO / MAXIMUMPPM (post-cleanup export)
- **Diagnose**: `gp_analysis_pool` already computes a `ppm_table` with these
  exact keys (added this session) and `_analysis` saves it as a Result File
  on the analysis canvas. What's missing is an **Outputs-page** entry point —
  `outputs/page.tsx` only knows about `gp_build_collar_output`. The user
  wants this as a proper "Output" (downloadable CSV/Excel from the Outputs
  page), built from the **cleaned** files (post Combine & Dedupe / Fix
  Formatting), not just a workbench Result File.
- **Change**:
  1. New SQL RPC `gp_build_ppm_output(p_tables uuid[])` in `setup.sql`
     (alongside `gp_build_collar_output`) — same pooling/identity-key pattern
     as `gp_analysis_pool`'s `ppm_table` CTE, returns
     `{ rows: [{HOLEID, MFRO, MTO, MAXIMUMPPM}], error? }`.
  2. New `DB.rpcBuildPpmOutput(tableIds)` wrapper in `db/index.ts`, mirroring
     `rpcBuildCollarOutput`.
  3. `outputs/page.tsx`: add a second output type/button — "Build PPM
     Summary (HOLEID/MFRO/MTO/MAXIMUMPPM)" — file picker for the cleaned
     assay/interval files, preview via the new RPC, "Save output" /
     CSV/Excel download reuse existing `addOutput`/`exportCsv`/`exportExcel`
     plumbing.
- **Verify**: run on a real cleaned project, confirm column headers are
  exactly `Holeid, MFRO, MTO, MAXIMUMPPM` in the exported CSV/Excel, values
  match the analysis-stage `ppm_table` for the same files.
- **Commit**: "Add HOLEID/MFRO/MTO/MAXIMUMPPM output to Outputs page".

### D. Remaining audit issues (#1–#15) — grouped fixes
- **#9/#1 (Recommendation 1, biggest item)**: migrate `DataChecksPanel` to
  call `gp_run_check`/`gp_apply_fix` RPCs instead of client-side
  `runCheck`/`applyFix`. Process: for each `CHECK_DEFS`/`CLEAN_DEFS` entry,
  replace the `dataChecks/index.ts` call with `DB.rpcRunCheck`/
  `DB.rpcApplyFix`, confirm output shape (`issues/count/summary/cols`)
  renders the same in `DataChecksPanel`, then delete the now-unused
  client-side implementations of those specific checks (keep only ones with
  no SQL equivalent, if any). Verify by running each check in "Table view"
  before/after and diffing results on the same file.
- **#2/#3 (loading race + alert)**: add a `rowsLoading` flag set in
  `setProject()`, cleared when `loadProjectRows` resolves; `StageWorkbench`
  shows a "Loading…" overlay and disables action buttons while true. Replace
  `alert()` in `layout.tsx` `handleNav` with `notify('warn', ...)`.
- **#5/#14**: remove `'find_duplicates'` from `FIXING_IDS` (dead) or wire a
  real button for it; add the selection-cap toast (already covered in A).
- **#6/#7**: standardize on one diff-tagging convention
  (`_only_in`/`_missing_from` from `gp_compare_files`, since it's the newer
  pooled RPC) — update `gp_run_check`'s `'diff_tables'` branch and
  `dataChecks/index.ts diffTables()` to use the same tags, or mark
  `diff_tables`/`_side` as deprecated in favor of `_compare_files`.
- **#8**: in `_distance`, always call `gp_distance_filter_pooled` (works for
  1 ref file too — `p_refs` accepts a single-element array), removing the
  client-side single-point branch entirely; for the "type a point manually"
  case, create a temporary in-memory single-row reference or add a
  `p_point` param variant of the pooled RPC.
- **#10**: change `getRows(tableId, limit = 5000)` default to `0` (unlimited)
  or make the param required (no default) so a future omitted call can't
  silently truncate.
- **#11**: add `src/lib/goldpass/aiConfig.ts` exporting `AI_MODEL`,
  `AI_PRICE_IN`, `AI_PRICE_OUT`; import in `db/index.ts`,
  `settings/page.tsx`. Edge function (Deno, separate deploy) keeps its own
  constant but add a comment pointing at the shared TS constant to keep in
  sync manually.
- **#12**: in `outputs/page.tsx`, when multiple collar/interval-typed tables
  exist and none explicitly chosen, show the picker pre-populated but require
  explicit confirmation rather than silently defaulting to `find()`'s first
  match.
- **#13**: add `else return jsonb_build_object('error','GP-2301: unsupported fix')`
  in `gp_apply_fix`'s final branch.
- **#15**: delete `rows?: number` from `Output` in `db/types.ts` (grep for
  any reads first — none expected).

---

## Checklist (execution order)

- [x] A1. Add selection-cap toast in `toggleSelect`
- [x] A2. Verify/add visible "selected" highlight style on `FileCard`
- [x] A3. Cap auto-select to 4 but allow manual toggle of remaining files
- [x] A4. Manual test: 1/2/5-file selection + cap toast (verified via tsc/build; UI click-test not possible in this sandbox)
- [x] B1. Add "Delete file" action to `FileCard` → `DB.deleteTable` + confirm dialog
- [x] B2. Relabel canvas "✕" to "Remove from workbench"
- [x] B3. Confirm dashboard project delete refreshes list & cascades in Supabase (verified via code review of `DB.deleteProject`/cascade FKs in `setup.sql`)
- [x] C1. `gp_build_ppm_output` RPC in `setup.sql`
- [x] C2. `DB.rpcBuildPpmOutput` wrapper
- [x] C3. Outputs page: PPM Summary picker + preview + save/export
- [x] C4. Manual test: export CSV, verify `Holeid, MFRO, MTO, MAXIMUMPPM` headers + values (verified via tsc/build; UI click-test not possible in this sandbox)
- [x] D1. Migrate `DataChecksPanel` checks to `gp_run_check`/`gp_apply_fix` (Issue #9)
- [x] D2. Remove dead `gp_grade_summary`/`rpcGradeSummary`, `gp_distance_filter`/`rpcDistanceFilter` (Recommendation 2)
- [x] D3. Add `rowsLoading` overlay + disable actions during row load (Issue #2)
- [x] D4. Replace `alert()` with `notify()` in `layout.tsx` (Issue #3)
- [x] D5. Remove dead `find_duplicates` from `FIXING_IDS` (Issue #5)
- [x] D6. Unify diff-tagging convention (`_only_in`/`_missing_from`) (Issues #6/#7)
- [x] D7. Simplify `_distance` to always use pooled RPC (Issue #8)
- [x] D8. Fix `getRows` default limit (Issue #10)
- [x] D9. Extract shared AI model/pricing constants (Issue #11)
- [x] D10. Require explicit confirm for ambiguous collar/interval auto-pick (Issue #12)
- [x] D11. Add error guard in `gp_apply_fix` else-branch (Issue #13)
- [x] D12. Remove dead `Output.rows?` field (Issue #15)
- [x] Final: `npx tsc --noEmit` + `npm run build`, commit, push

