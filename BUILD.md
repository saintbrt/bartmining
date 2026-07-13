# Bart Mining GoldPass: Build Reference

Authoritative guide for the mine operations platform. This replaces the old
AUDIT_REPORT.md (which described the retired drill/exploration app). Everything
below reflects the slimmed codebase after the exploration module was removed.

Writing rule for this repo: no em dashes anywhere, in code, comments, UI copy,
or docs. Use commas, colons, parentheses, or "to".

---

## 1. What this system is

A visual operations and decision system for a working gold mine. It combines:

- Operations (pits, machinery, fuel).
- Chemical processing plant (leaching tanks, rounds, color tests, elution, ball mill).
- General expenditure (payments to groups and individuals, tools, chemicals, kitchen, roads).
- Revenue (gold sales).
- Decision support (end of month projections, cost suggestions, fault flags, expansion headroom).

Two apps, one database:

| Surface | Role |
|---|---|
| GoldPass mobile (goldpass-field, iOS/Android) | Data collection at the point of work. Stays the collection endpoint. |
| GoldPass web admin (`/admin` in this repo) | Viewing the whole picture and making strategic decisions. |
| Public marketing site (this repo) | Clients and investors. Unrelated to operations. |

Data flows: field managers record payments and activity on mobile, admins approve
where approval is genuinely needed, the web app aggregates everything for strategy.

---

## 2. The spine: how everything stays connected

The database already has a unified cost ledger. This is the rule that guarantees
no item is ever disconnected:

**Anything that costs money writes exactly one `cost_events` row, tagged with a
`cost_centre_id` (and a date). Everything rolls up from there.**

- `cost_events`: event_type, cost_centre_id (required), equipment_id, project_id,
  amount_tsh, event_date, source_table, source_id. Polymorphic: source_table +
  source_id point back to the origin record.
- `cost_centres`: the roll-up buckets (a pit, the plant, an overhead line).
- `projects`: the mining project. Pits connect to it. Costs can reference it.
  (Kept deliberately: `cost_events.project_id` and `expense_entries.project_id`
  both reference it.)

Design gate for every new field: if it cannot name its date and its cost centre,
it is an orphan and must be redesigned before it ships.

Note: the monthly summary RPC (`get_operations_financial_summary`) currently reads
per-domain views, not the ledger. A future improvement is to point it at
`cost_events` so revenue, expenses, payroll, procurement, fuel and chemicals all
aggregate in one place.

---

## 3. Locked design decisions

1. Pits: many pits per location, all connected to one project. A pit is a
   `cost_centre` so its costs auto roll up. Path: pit to mine_location to project.
2. Leaching periods: no cost centre per cycle. A `leaching_periods` table just
   bounds start and end dates. Period costs come from date filtering the ledger.
   Cycles are variable and cross month boundaries, so monthly figures pro rate a
   period across the months it spans.
3. Gold recovered: `elution_batches` holds physical recovery, `sales` holds money.
   The two are reconciled, never conflated.
4. Drilling and exploration: removed entirely (code done, backend functions dropped).

---

## 4. Domains and data model

Existing tables are reused, not rebuilt. New tables are marked NEW.

### 4.1 Expenditure and payments (exists)
- `expense_entries` to `expense_categories`, `cost_centres`, `cost_events`.
- Workers are part time and names change: keep the current payment format, add
  categories to differentiate worker types, write the worker names in the
  description field. No per person record.
- Papers are entered and paid manually: a category, not a special entry type.
- Admin approval stays where it is genuinely needed. It was removed from sales
  (admins enter sales, so approving your own entry was pointless).

### 4.2 Revenue and sales (exists)
- `sales` to `customers`, surfaced by `v_sales_register`.
- Revenue counts every recorded sale (no approval gate). `get_operations_financial_summary`
  now sums `price_tsh` straight from the base `sales` table.

### 4.3 Labour and payroll (exists)
- `employees`, `payroll_runs`, `payroll_lines`, `attendance_records`, all wired to
  `cost_centres`. Currently unused (0 rows) but structurally ready.

### 4.4 Inventory (exists)
- `inventory_items`, movements, alerts, warehouses, `get_stock_levels`. Full
  available inventory list plus minimums.

### 4.5 Equipment and fuel (exists, extend)
- `equipment` and `equipment_events` (fuel event_type already present), surfaced by
  `v_equipment_utilization` (fuel litres and breakdowns per 30 days).
- Fuel is entered monthly at first from mobile input. Prediction (fuel vs usage vs
  factors) comes later once 1 to 2 months of data exist. Not urgent.

### 4.6 Operations and pits (NEW, on top of existing structure)
- `pits` NEW: id, mine_location_id, project_id, name, active. Each pit is registered
  as a `cost_centre` so pit costs land in the ledger with no extra plumbing.
- `pit_machinery` NEW: which machines (generators, winches, lorries, excavators)
  are assigned to a pit, and the team in charge.
- Machinery baseline (approximate, to confirm with Matius on operations costs):
  usually 1 lorry and 1 excavator, sometimes 3 lorries and 1 excavator, with a
  per day fuel usage during operations.
- No trackable machine schedule yet. Fuel cost is monthly from mobile input first,
  predicted later.

### 4.7 Chemical plant (NEW, the core of this build)
This is a carbon in leach (CIL) circuit. Ore is milled, leached across tank lines,
pooled, then gold is trapped on carbon before the barren solution leaves.

New tables:
- `tanks` NEW: the 15 tanks (see section 5). tank_code, line (A/B/C), volume_m3,
  ref_load_cost_tsh, ref_offload_cost_tsh. Load and offload costs are reference
  values only; the real charge changes per round and is captured as cost_events.
- `leaching_periods` NEW: period_start, period_end (nullable while open), status
  (open/closed), closed_by, notes. Closed manually by the chemicals manager.
- `color_tests` NEW: test_date, tank_id, result (black/grey/clear), notes. Logged
  on no fixed schedule (sometimes every 2 days, sometimes every 4). Meaning:
  black = gold still in the ore (start), grey = some gold left with resistance,
  continue, clear = fully extracted.
- `elution_batches` NEW: batch_date, gold_recovered_g, carbon stage notes. This is
  the physical recovery source of truth, reconciled against sales.
- `chemical_usage` NEW: usage_date, chemical, quantity, unit, cost link. Daily
  updatable, not a monthly expense.
- Ball mill: one unit, 8 m3, 168 tonnes per week (average assumption). A small
  config plus an optional daily feed log.

Process model (for the visual map and the state machine):

```
ore -> ball mill (8 m3, ~168 t/week)
     -> tank lines, leaching rounds 1..5 or 1..3 by ore quality
        Line A: ATK1..ATK4     (4 tanks)
        Line B: BTK1..BTK5     (5 tanks)
        Line C: CTK1..CTK6     (6 tanks)
     -> single collection tank (pools all tanks)
     -> carbon tail 1  (carbon traps gold, chemicals pass through)
     -> carbon tail 2  (carbon traps remaining gold)
     -> barren solution leaves the circuit (gold stays trapped on carbon)
     -> elution (carbon stripped, gold recovered) -> elution_batches
```

### 4.8 Analytics and decisioning (web only, read side)
- Roll every cost to a cost_centre, into the monthly summary, into projections and
  the expansion signal.
- Efficiency: price vs operation cost vs worker cost. Numbers to compute later:
  expected gold mass, recovery rate, specific gravity and density. These fine tune
  decisions and are additive, not required day one.
- Expansion signal: when the cost ratio or cash headroom crosses a threshold (rate
  to be defined), the dashboard suggests there is room to expand.
- Fault flags: start with one (for example a round taking too long, or chemical
  overuse); the rest arrive as data accumulates.

---

## 5. Tank reference data (15 tanks)

Load and offload costs are reference values; actual per round charges are recorded
as cost_events.

| Tank | Line | Volume (m3) | Ref cost (TSh) |
|---|---|---|---|
| ATK1 | A | 17.25 | 44,000 |
| ATK2 | A | 21.01 | 48,000 |
| ATK3 | A | 16.90 | 44,000 |
| ATK4 | A | 18.04 | 44,000 |
| BTK1 | B | 11.63 | 40,000 |
| BTK2 | B | 15.83 | 44,000 |
| BTK3 | B | 13.68 | 40,000 |
| BTK4 | B | 16.23 | 44,000 |
| BTK5 | B | 12.37 | 40,000 |
| CTK1 | C | 10.50 | 24,000 |
| CTK2 | C | 12.78 | 30,000 |
| CTK3 | C | 11.03 | 24,000 |
| CTK4 | C | 13.18 | 30,000 |
| CTK5 | C | 12.21 | 30,000 |
| CTK6 | C | 12.65 | 30,000 |

---

## 6. Visual plant map

A simple top view of the plant, following the current design system.

- Three rows: Line A on one row, Line B on one, Line C on one (matches the tank codes).
- Each tank is a cell showing its code and volume.
- Tank state drives the fill, driven by the latest color test:
  - black = gold still processing (start of a round).
  - grey = partly extracted, resistance, still running.
  - clear = fully extracted, ready to offload.
  - empty / idle = no active round.
- Below the lines: the collection tank, then carbon tail 1, then carbon tail 2,
  then barren out, then elution. This shows the flow end to end.
- Pits get a separate rough visual (about 10 pits, with room to add more). We cannot
  track pit internals precisely, so this is an indicative map with assigned
  machinery and team per pit.
- Color usage follows the minimum color rule (section 7): the tank state colors are
  the meaningful signal; everything else stays neutral ink.

---

## 7. Design system

- Minimum color. Numbers wear ink (`--label-1`), not decorative hues. Color is
  reserved for status (good/bad), one brand accent (gold), and validated chart
  series only.
- Charts: Recharts 3. Reusable components live in `src/components/goldpass/charts.tsx`
  (`LineTrendChart`, `MultiLineChart`, `BarCompareChart`, `StatTile`, `Meter`).
  Line and multiline are the primary, most understandable forms; add other types
  only after these.
- Chart tokens and the validated colorblind safe series palette live in `admin.css`.
- Responsive: mobile drawer sidebar, collapsing grids (`grid-kpi`/`grid-3`/`grid-2`),
  card tables (`tbl-card`). Verified 360 to desktop.
- First code edit when the plant build starts: remove all em dashes across the app.

---

## 8. Modularity rules

The system grows as data is collected daily, weekly and monthly. Do not build hard
rules that break on irregular input.

- Color tests are irregular (2 to 4 days). Never require a daily test.
- Expenses arrive every 1 to 2 days.
- Some workers are paid daily, some weekly, all part time.
- Chemicals are updated when used, not monthly.
- Every new module is additive: we can add and improve pieces without touching the rest.

---

## 9. Phased build plan

Each phase is shippable on its own and connects to the spine.

- Phase 0: em dash cleanup across the app (first edit).
- Phase A: Plant master data and the visual tank map. `tanks` table seeded with the
  15 tanks, the top view map, tank state from `color_tests`.
- Phase B: Leaching periods and color tests. Open and close a period, log color
  tests, show period costs by date filtering the ledger, pro rated to months.
- Phase C: Pits and machinery. `pits` as cost_centres, machinery assignment, fuel
  logging via existing `equipment_events`.
- Phase D: Elution and recovery. `elution_batches`, reconcile physical recovery
  against sales.
- Phase E: Decisioning. End of month projections, expansion signal, first fault flag.
- Phase F: Excel export. Match the existing report workbook (analyze the file first,
  template fill with ExcelJS if formulas must be preserved).

---

## 10. Open questions to resolve as we build

- Operations fuel costs and machine baseline: confirm with Matius.
- Expansion signal: the exact ratio or headroom threshold that triggers a suggestion.
- First fault to predict: pick one to start.
- Excel report: share the existing workbook so the export matches its model.
- Recovery reconciliation: tolerance between elution physical gold and sold gold.

---

## 11. Backend status

- Drill functions dropped in Supabase (the `gp_*`, `build_collar_output`,
  `run_safe_select` set). `projects` kept (mining project entity).
- Migrations to run in Supabase SQL Editor when applied:
  - `0014_operations_financial_summary.sql` (revenue from actual sales).
  - `0015_admin_only_pc_access.sql` (admin only PC access, `is_admin`).
- New plant and pit tables will ship as numbered SQL files in `supabase/`, same
  pattern, run manually.
