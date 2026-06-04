# GoldPass — Supabase Backend (production)

Everything needed to take GoldPass live. Run the SQL in order, deploy the
edge functions, set env vars, then swap the data layer in the app.

## 1. Create the database

In the Supabase SQL editor, run **in this exact order**:

1. `schema.sql`   — tables, indexes, triggers
2. `rls.sql`      — Row Level Security (data isolation)
3. `security.sql` — hardening + safe RPC functions

## 2. Deploy edge functions

```bash
supabase functions deploy gold-ai
supabase functions deploy build-collar-output
```

## 3. Set secrets (NEVER put these in the browser)

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically
# to edge functions by Supabase.
```

## 4. Create the two users

In Supabase Auth → Users → Add user (email + password):
- admin@bartmining.com
- bart@bartmining.com

The `on_auth_user_created` trigger auto-creates their profile rows.

## 5. Connect the app (ALREADY WIRED — just add your keys)

The app now runs **fully on Supabase** — the mock layer has been removed.
`db-supabase.jsx` is already in `goldpass/app/` and loaded by `index.html`.
The only thing left is to paste your project values. In
`goldpass/app/index.html`, edit the config block near the top:

```html
<script>
  window.SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";   // <-- your URL
  window.SUPABASE_ANON_KEY = "YOUR-ANON-KEY";                  // <-- your anon key
</script>
```

That's it. On load the app restores the Supabase session, hydrates its
cache from your tables, and every read/write goes to Postgres under RLS.
The anon key is safe in the client; RLS does the real protection.

## Security guarantees

| Concern | How it's handled |
|---|---|
| Project isolation | RLS on `project_members`; every query membership-gated. User A can't read User B's data even with a crafted request. |
| Claude sees no row data | `gold-ai` builds a schema-only string (column names + types). Row values never sent. |
| SQL injection | App never sends raw SQL to the DB. Gold AI SQL is validated SELECT-only, single-statement, no DDL/DML, in `run_safe_select` with a 5s timeout + 1000-row cap. |
| Secret keys | Only the anon key is in the client. `service_role` + `ANTHROPIC_API_KEY` live only in edge function env. |
| Audit immutability | `audit_log` has insert+select policies only — no update/delete grant. |
| Upload abuse | Client caps file at 50 MB, allowlists CSV/XLSX, parses all cells as strings (no Excel coercion). Add a server size check if exposing uploads via storage. |
| XSS | All rendered cell values go through React text nodes (auto-escaped). No `dangerouslySetInnerHTML` with user data. |

## Files

```
supabase/
  schema.sql
  rls.sql
  security.sql
  db-supabase.jsx
  functions/
    gold-ai/index.ts
    build-collar-output/index.ts
  README.md
```
