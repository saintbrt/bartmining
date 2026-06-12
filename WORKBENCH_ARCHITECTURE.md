# GoldPass Visual Workbench — Architecture & Build Checklist

## 1. Core aim (revised)

GoldPass exists so that a geologist — **without deep computer knowledge** —
can take raw drill-data files (collar, survey, assay, lithology), visually
clean and prepare them across multiple files at once, and produce final
collar files ready for map drawing and mine planning.

Everything in the app serves that aim:

- **Visual, not technical.** Files are cards on a canvas, relationships
  are lines you can see, actions are plain-English buttons. No SQL
  knowledge, no spreadsheets gymnastics required.
- **Multi-file by design.** Real work involves 2-4 related files for the
  same location (e.g. three survey files). The workbench lets you put
  them side by side, see how they connect (matching Hole IDs, matching
  coordinates), and work on them together.
- **AI as an assistant, not a requirement.** Type what you want in plain
  language ("find the best holes among these three files", "remove holes
  with duplicate values", "show all locations within 5 miles of X") and
  the AI builds and runs the query. Every AI result appears as a new
  visual file card — nothing happens invisibly.
- **Stage-by-stage workflow stays.** Validation → Cleaning → Analysis →
  Outputs remain separate pages, each one powered by its own visual
  workbench canvas tuned to that stage's job.

## 2. The four stage workbenches

Each stage keeps its own page and gating (a stage unlocks when the
previous one is approved), but every stage page is now a **visual canvas**
instead of a linear file list:

| Stage | Canvas purpose | Typical actions |
|---|---|---|
| **Validation** | Drop newly imported files on the canvas; see auto-drawn connection lines confirming files belong together (matching Hole IDs / coordinates); spot files that don't connect | Check Required Columns, Find Missing Values, Check Coordinates Are Valid |
| **Cleaning** | Work on 1-4 connected files together; remove bad data; merge duplicates | Remove Duplicate Holes, Remove Empty Rows, Fix Column Names, Merge Matching Files |
| **Analysis** | Combine cleaned files; run comparisons and AI queries; build derived files | Compare Files, Find Best Holes, Ask AI (plain-language query box) |
| **Outputs** | Assemble the final collar file from child files; export | Build Final Collar File, Export CSV/Excel |

The canvas behaviour (drag files on, see connection lines, select 1-4,
act on them, child files appear with animation) is identical across all
four pages — one shared component set, four stage configurations.

## 3. Plain-language naming (no jargon)

The old internal "QC" naming misses the point — users aren't running
"QC functions", they're **checking and fixing their data**. All
user-facing actions use plain English verbs:

| Old internal name | New user-facing name |
|---|---|
| QC / QCPanel | **Data Checks** panel |
| `qc.crossFileValidation` | **Check Files Match** |
| `qc.duplicateDetection` | **Find Duplicate Holes** |
| `qc.missingValueScan` | **Find Missing Values** |
| `qc.coordinateRangeCheck` | **Check Coordinates Are Valid** |
| dedupe | **Remove Duplicate Holes** |
| drop-empty | **Remove Empty Rows** |
| merge | **Merge Matching Files** |
| AI workbench / NL→SQL | **Ask AI** |
| child table | **Result File** |
| lineage | **Made From** (shown on a result file: "Made from Survey-A + Survey-B") |

Code-level: rename `src/lib/goldpass/qc/` → `src/lib/goldpass/dataChecks/`
with descriptive function names (`checkFilesMatch`, `findDuplicateHoles`,
`findMissingValues`, `checkCoordinates`, …). Every button, toast, and
panel title uses the plain-language names above.

## 4. Appearance: dark + light mode

- Dark mode stays as the default look (current design is approved).
- Add a small **Dark/Light toggle button** in the top bar, **replacing
  the "Internal · Live" label**.
- Implement via a `data-theme` attribute on `.gp-root` and a light
  variant of the existing CSS variables in `admin.css`; persist choice
  in `localStorage` (cosmetic preference only — allowed exception to the
  no-localStorage rule which applies to data/state).

## 5. Current architecture (what stays)

- `supabase/setup.sql` schema unchanged for v1 (`tables_meta.parent_ids`
  already supports result-file lineage). Optional: add `canvas_x/canvas_y`
  to persist card positions.
- `src/lib/goldpass/sqlEngine.ts` — reused for all operations and AI
  queries.
- `src/lib/goldpass/db/index.ts` — `DB.*` API — extended, not replaced.
- `supabase/functions/gold-ai/index.ts` — extended for multi-file context.
- Auth, middleware, GP-XXXX error codes, toasts, stage gating — unchanged.

## 6. New components / files

| File | Purpose |
|---|---|
| `src/components/goldpass/workbench/Canvas.tsx` | Pan/zoom canvas (CSS transforms + SVG, no new dependency) |
| `src/components/goldpass/workbench/FileCard.tsx` | File card: name, type badge, column list with anchors for connection lines |
| `src/components/goldpass/workbench/ConnectionLines.tsx` | SVG overlay drawing lines between matching columns of cards on canvas |
| `src/components/goldpass/workbench/findConnections.ts` | Pure function detecting matching columns between files (semantic type match + name similarity + value-overlap sampling) |
| `src/components/goldpass/workbench/ActionBar.tsx` | Plain-English action buttons for the current stage, enabled when 1-4 cards selected |
| `src/components/goldpass/workbench/AskAi.tsx` | Plain-language prompt box → gold-ai → SQL → run → Result File card |
| `src/components/goldpass/workbench/ResultFileAnimation.tsx` | Entry animation for new Result File cards + "Made From" lines |
| `src/components/goldpass/workbench/StageWorkbench.tsx` | Wrapper that configures Canvas + ActionBar per stage (validation/cleaning/analysis/outputs) |
| `src/components/goldpass/ThemeToggle.tsx` | Dark/Light button for the top bar |

The four existing stage pages (`validation/cleaning/analysis/outputs/page.tsx`)
are each rewritten to render `<StageWorkbench stage="…" />`.

## 7. Connection detection logic (`findConnections.ts`)

1. Use `tables_meta.columns` semantic mapping (HOLEID → hole_id,
   EAST → utm_e, …).
2. Same semantic type in two files → high-confidence connection line
   (e.g. hole_id ↔ hole_id).
3. Coordinate columns without exact mapping → sample first 200 rows of
   each file, compare values (exact for IDs, tolerance for numeric
   coordinates); overlap above ~30% → medium-confidence line.
4. No matches → **no lines** (independent files sit unconnected).
5. Lines render as SVG beziers from column row to column row, colored by
   confidence, matching the ER-diagram reference image.

## 8. AI integration ("Ask AI")

Request to `gold-ai`:

```ts
{ projectId, sourceTableIds: string[] /* 1-4 selected cards */, prompt: string }
```

Edge function builds a prompt from all selected files' schemas + detected
connections, returns SQL limited to the `sqlEngine.ts` dialect; the app
runs it and saves the result via `DB.insertTable(..., parent_ids:
sourceTableIds)`. The Result File card animates onto the canvas with
"Made From" lines to its parents. All failures surface as GP-XXXX toasts.

## 9. Execution checklist

- [ ] **Step 0 — Safety snapshot**: `git tag pre-workbench-v1` (done).
- [ ] **Step 1 — `findConnections.ts`**: implement + manual test with
  sample collar/survey column sets.
- [ ] **Step 2 — `Canvas.tsx` + `FileCard.tsx`**: drag files from project
  file list onto canvas, render as cards.
- [ ] **Step 3 — `ConnectionLines.tsx`**: live connection lines, recompute
  on card move/add/remove.
- [ ] **Step 4 — Rename `qc/` → `dataChecks/`** with plain-language
  function names; update all imports and UI strings.
- [ ] **Step 5 — `ActionBar.tsx`**: stage-specific plain-English actions
  on 1-4 selected cards (Remove Duplicate Holes, Remove Empty Rows, …).
- [ ] **Step 6 — `AskAi.tsx` + gold-ai update**: multi-file plain-language
  queries → Result File.
- [ ] **Step 7 — `ResultFileAnimation.tsx`**: entry animation + "Made
  From" lines.
- [ ] **Step 8 — `StageWorkbench.tsx`** + rewrite the four stage pages to
  use it; keep stage gating/approval flow intact.
- [ ] **Step 9 — `ThemeToggle.tsx`**: replace "Internal · Live" with the
  Dark/Light button; add light-theme CSS variables.
- [ ] **Step 10 — Outputs integration**: Build Final Collar File action →
  `DB.saveOutput` → Outputs/Visualization unchanged downstream.
- [ ] **Step 11 — Regression check**: `npx tsc --noEmit`; verify
  `tsconfig.json` exclude (`node_modules`, `goldpass`,
  `supabase/functions`) untouched; verify login, stage gating, uploads
  (CSV + Excel), outputs, visualization all still work.
- [ ] **Step 12 — Docs**: update `ARCHITECTURE.md` with the workbench
  section and the plain-language naming table.

## 10. Decisions locked in

1. Workbench powers **all four stages on their existing separate pages**
   (not a separate nav item, not a replacement of the staged flow).
2. Canvas built with **plain CSS transforms + SVG** — no new dependency.
3. UI must be usable by **non-technical users**: plain-English action
   names, visible results, no jargon (no "QC", no "SQL", no "query" in
   user-facing text — the AI box is just "Ask AI").
4. Dark mode default + light mode toggle in the top bar.
