# GoldPass Workbench — Function Workflows

Every function on the workbench, end to end: inputs, flow, console
messages, error handling, and how each behaves with 1, 2, 3 or 4 files
selected. Console messages are prefixed `[GoldPass]` so they're easy to
filter in the browser DevTools console.

---

## 1. Ask AI (the question box at the bottom)

### Preconditions (why the button may look "dead")
- The button is **disabled until at least one file card is selected**
  (click a card → blue border). Selected files define which data the AI
  is allowed to use.
- It is also disabled while a previous question is still running (shows `…`).

### Full pipeline

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. USER                                                              │
│    Selects 1-4 file cards → types question → Enter or [Ask AI]       │
└──────────────┬───────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 2. APP (StageWorkbench.askAi)                                        │
│    console.info('[GoldPass] Ask AI', {files, question})              │
│    Builds scoped question:                                           │
│    "Using only these files: Survey-A, Survey-B. <user question>"     │
└──────────────┬───────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 3. APP (DB.goldAI)                                                   │
│    - checks env vars (else GP-2314)                                  │
│    - gets the user's session token (auth proof)                      │
│    - collects ALL project file schemas: name, type, row count,       │
│      columns + their meaning (hole_id, au, easting…) — NO ROW DATA   │
│    - POST https://<project>.supabase.co/functions/v1/gold-ai         │
│      { project_id, question, schemas }                               │
└──────────────┬───────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 4. EDGE FUNCTION (supabase/functions/gold-ai)                        │
│    - rejects if no auth header (401, GP-2401)                        │
│    - rejects if ANTHROPIC_API_KEY secret missing (GP-2403)           │
│    - sends system prompt (the engine's SQL dialect rules) + schemas  │
│      + question to Claude (claude-sonnet-4-6)                        │
│    - Claude answers {"sql":"SELECT …","note":"plain-English summary"}│
│    - returns { sql, note } — or { error, code } if unusable          │
└──────────────┬───────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 5. APP runs the SQL LOCALLY (sqlEngine.executeSQL)                   │
│    The SQL never touches the real database — it runs in the browser  │
│    on the rows already loaded, in a parser that only understands     │
│    SELECT/DELETE (no joins/DDL — nothing dangerous can execute).     │
│    console.info('[GoldPass] AI SQL', sql)                            │
└──────────────┬───────────────────────────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────────────────────────┐
│ 6. OUTPUT                                                            │
│    rows > 0  → DB.createChildTable(name:"AI · <question>",           │
│                parent_ids: selected file ids)                        │
│              → Result File card animates onto the canvas with        │
│                dashed gold "Made From" lines to its parents          │
│              → saved to Supabase in the background (a new file,      │
│                downloadable/reusable like any other)                 │
│    rows = 0  → message "Nothing matched that request"                │
│    DELETE    → refused: "use the cleaning actions for removals"      │
└──────────────────────────────────────────────────────────────────────┘
```

### Multi-file behaviour
The schemas of **all** project files are sent (so the AI knows the
project), but the scoped question instructs it to use only the selected
ones, and the Result File's `parent_ids` records exactly which files it
was made from. 1 file → single-table query; 2-4 files → the AI lists
them all in `FROM` (the engine concatenates their rows).

### Error handling (every step has a coded failure path)
| Step | Failure | Code | What the user sees |
|---|---|---|---|
| 2 | No files selected | — | Message: "Select 1-4 files, then describe what you want." |
| 3 | Env vars missing | GP-2314 | Toast: Supabase is not connected |
| 3/4 | Edge function unreachable / not deployed | GP-2401 | Toast + message with HTTP status |
| 4 | ANTHROPIC_API_KEY secret not set | GP-2403 | Toast: AI key missing on server |
| 4 | AI answer unusable / not expressible in dialect | GP-2402 | Message with the AI's reason |
| 5 | SQL invalid for the engine | GP-23xx from engine | Toast + message with the engine error |
| 6 | Save fails (network/RLS) | GP-2202 | Toast: derived table save failed |

Console trail for debugging: open DevTools → Console and filter
`[GoldPass]` — you'll see the question, the selected files, the SQL that
came back, and the row count or the exact failing step.

---

## 2. Connection lines (automatic, no button)

```
Files added/moved/changed on canvas
   ▼
findConnections(files on canvas, first 200 rows of each)
   ▼
For every PAIR of files (2 files → 1 pair, 3 → 3 pairs, 4 → 6 pairs):
   1. same column meaning on both sides? (hole_id, easting, northing,
      from, to…)  → line. hole_id additionally value-checked: ≥30% of
      sampled IDs must appear in both files → green (high confidence),
      otherwise teal (medium)
   2. identical raw column NAME + ≥30% value overlap → teal line
   3. nothing shared → NO line (independent files)
   ▼
SVG lines drawn from the matching column row in card A to the matching
column row in card B, labelled with the shared meaning. Recomputed live
while dragging cards.
```
No errors possible — pure in-browser computation. Dashed **gold** lines
are different: they show lineage ("Made From") between a Result File and
its parents.

---

## 3. Stage actions (the buttons above the Ask AI box)

All actions share one frame:

```
Select 1-4 cards → click action
   ▼
For EACH selected file (the function re-runs per file, so 3 files = 3 runs):
   1. load all of that file's rows from the in-app cache
   2. run the check on those rows
   3a. CHECK-type action → show summary message
       issues found → offer "Save these rows as a Result File?"
       → yes → new child card on canvas, parent line to the source
   3b. FIX-type action → show what will change + ask to confirm
       → confirmed → DB.replaceRows (a VERSION is recorded first —
         nothing is ever lost) → success toast
   ▼
Background save to Supabase; any failure → GP-22xx toast
```

Two-file actions (Check Files Match, Compare Files, Merge) instead take
the selection **as a set**.

### Validation stage
| Button | Files | What it does |
|---|---|---|
| **Find Missing Hole IDs** | 1-4, each | Lists rows whose Hole ID is empty. Offer to save as Result File. |
| **Find Missing Values** | 1-4, each | Finds disguised blanks: N/A, -, -99, 9999, NULL… |
| **Check Coordinates** | 1-4, each | Collar rows missing easting/northing/elevation. |
| **Check Files Match** | exactly 2 | Row-by-row diff: rows only in A, rows only in B. 0 differences → "files are identical". Differences → offer to save them as a Result File (each row tagged `only in A` / `only in B`). |

### Cleaning stage (these CHANGE data — always confirm first, always versioned)
| Button | Files | What it does |
|---|---|---|
| **Remove Duplicate Rows** | 1-4, each | Finds rows identical in every column; keeps the first of each. |
| **Remove Empty Rows** | 1-4, each | Deletes rows where every column is blank. |
| **Fix Hole ID Format** | 1-4, each | Uppercases Hole IDs and strips internal spaces (DDH 12 → DDH12). |
| **Trim Extra Spaces** | 1-4, each | Removes leading/trailing spaces from every text cell. |
| **Merge Matching Files** | 2-4, as a set | Asks for a name → builds one file containing every column seen in any source and every row from all of them → new card on canvas. |

### Analysis stage
| Button | Files | What it does |
|---|---|---|
| **Find Best Holes** | 1-4, each | Best grade × thickness intercept per hole, sorted best-first. Offer to save as Result File. |
| **Rank Holes by Grade** | 1-4, each | Every hole ranked by its peak grade. |
| **Compare Files** | exactly 2 | Same diff as Check Files Match, framed for analysis. |

### Per-function error handling
- Required column not mapped (e.g. no Hole ID column) → the check returns
  a plain message ("Both tables need a Hole ID column mapped.") — no crash.
- Fewer files selected than the action needs → button is disabled, with a
  tooltip saying how many files it needs.
- Nothing found → info toast ("No duplicate rows found.") — no Result File.
- Save/persistence failures → GP-2202/2203 toast with the file name.

---

## 4. Other workbench functions

**Add to workbench (file tray)** — click a file in the left tray → card
appears on the canvas in the next free grid slot. Already-placed files
leave the tray.

**Drag card** — hold the card and move. Lines follow live. Releasing on
a button (Open/✕) never triggers a drag.

**Select card** — click toggles selection (blue border), max 4; clicking
empty canvas clears the selection.

**Open** — opens the file in the table editor (rename columns, change
file type, view all rows, version history).

**✕ (remove from workbench)** — removes the CARD from the canvas only.
The file itself is untouched and returns to the tray.

**Table view** — switches to the previous list-style workspace (full data
table, Checks panel, manual Ask AI with visible SQL) for row-level work.

**Upload** — accepts CSV and Excel (.xlsx/.xls). Excel is converted to
rows in the browser (first sheet). Each file gets a type (collar, assay,
survey, lithology) and appears in the tray. Parse failures show inline
per-file errors.

**Approve & Continue** — marks the stage done (saved to the database,
not the browser) and unlocks the next stage.

**Dark/Light toggle** — instant theme switch, remembered on this device.
