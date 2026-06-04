# GoldPass — Production Build TODO (resumable guide)

> Internal mining data tool for Bart Mining. This file is the source of truth for the
> production hardening sprint. If work is interrupted, resume from the first unchecked item.

## Context
- App lives in `goldpass/app/` — React + Babel (in-browser), loaded via `index.html`.
- Going LIVE in 2 days with Supabase backend. No mock data in production.
- Two real users only (admin@bartmining.com, bart@bartmining.com) — expand via Supabase Auth.

## File map (`goldpass/app/`)
- `index.html` — script load order (db → qc → auth → dashboard → upload-modal → workspace → table-editor → outputs → visualization → settings → main)
- `db.jsx` — MOCK data layer (localStorage). To be replaced by `db-supabase.jsx`.
- `db-supabase.jsx` — REAL Supabase data layer (same method signatures as db.jsx).
- `qc.jsx` — QC engine (10 functions, all client-side, work on row arrays).
- `auth.jsx` — login screen.
- `dashboard.jsx` — homepage (dark Mining Command Center).
- `upload-modal.jsx` — multi-file upload + column mapping.
- `workspace.jsx` — canvas workbench, Functions/Clean/SQL/Gold AI panels, connection lines.
- `table-editor.jsx` — full-page row editor.
- `outputs.jsx` — exports list.
- `visualization.jsx` — 2D map + 3D drill trace.
- `settings.jsx` — preferences.
- `main.jsx` — app shell, sidebar, routing.

## Supabase package (`goldpass/supabase/`)
- `schema.sql` — tables: profiles, projects, project_members, tables_meta, table_rows, versions, audit_log, outputs.
- `rls.sql` — Row Level Security policies (membership-based isolation).
- `security.sql` — hardening: revoke anon, function search_path, input limits.
- `functions/build-collar-output/index.ts` — edge function (row data stays server-side).
- `functions/gold-ai/index.ts` — Claude SQL generation (schema-only, never row data).
- `functions/run-safe-sql/index.ts` — parameterised SELECT-only execution.
- `README.md` — deploy steps + env vars.

---

## TASKS

### A. Quick fixes
- [x] A1. Dashboard title must always read "Dashboard" — never inherit project name. (main.jsx Topbar)
- [x] A2. Functions/Clean/Gold-AI side panels must scroll — lower items were clipped. (.side-panel-body overflow + qc-panel height)

### B. Dashboard redesign (dark Mining Command Center)
- [x] B1. Dark theme tokens scoped to `.dash-dark` (do NOT touch sidebar / global theme).
- [x] B2. Fixed header "DASHBOARD" + subtitle.
- [x] B3. KPI cards: Active Projects, Imported Tables, Total Records, Latest Upload, AI Insights, Pending Reviews — animated counters, trend chips.
- [x] B4. Centerpiece: 3D open-pit mine hero (canvas, orbit, benches, drill collars, ore zone, haul roads, atmospheric light).
- [x] B5. Right rail: AI Insights timeline cards.
- [x] B6. Premium project cards (status, sparkline, quick actions, gold accents).
- [x] B7. Recent activity feed (from audit log).
- [x] B8. Background: low-opacity contour/grid texture, subtle particles. Desktop-only.

### C. Supabase backend (production)
- [x] C1. schema.sql — all tables + indexes on hole_id / project_id.
- [x] C2. rls.sql — every table membership-gated; user A cannot reach user B's data.
- [x] C3. security.sql — revoke public, lock function search_path, size/row limits, no dynamic SQL from client.
- [x] C4. edge: build-collar-output (RPC, row data never leaves DB).
- [x] C5. edge: gold-ai (Claude gets schema only; SQL validated SELECT-only before run).
- [x] C6. edge: run-safe-sql (allowlist SELECT, block ;/DDL/DML, statement timeout).
- [x] C7. db-supabase.jsx — real data layer mirroring db.jsx signatures.
- [x] C8. README with deploy + env var steps.

### D. Security audit (every line)
- [x] D1. No secrets in client bundle (anon key only; service_role + ANTHROPIC server-side).
- [x] D2. All SQL parameterised; no string concatenation of user input.
- [x] D3. Upload: size cap (50MB), type allowlist, parse-as-string (no Excel coercion), row cap.
- [x] D4. XSS: never dangerouslySetInnerHTML with user data; escape rendered cells.
- [x] D5. Auth gate on every route; session checked server-side via RLS.
- [x] D6. Audit log immutable (no update/delete policy).
- [x] D7. CSP meta + noindex on app.

### E. Delivery
- [x] E1. Verify app loads clean.
- [ ] E2. Package zip of goldpass/ for download.

---

## Security model (reference)
- **Isolation:** RLS on project_members. Every query joins membership. No app-layer trust.
- **Claude:** receives column names + types ONLY. Never row values. Enforced in edge function.
- **SQL:** client never sends raw SQL to DB. Gold AI → edge validates SELECT-only, single statement, no DDL/DML, appends LIMIT, statement_timeout. 
- **Keys:** anon key in client (RLS-protected). service_role + ANTHROPIC_API_KEY only in edge function env.
- **Uploads:** size + type checked client AND server; rows parsed as text; capped.
- **Audit:** insert-only; no update/delete grant to authenticated.
