# Bart Mining — Deployment & Security

## Structure (what Vercel serves)

```
/                     → public marketing site (index, products, services, …)
/admin/               → GoldPass internal app — GATED (login required)
/admin/login          → the only public page under /admin
middleware.js         → Edge gate: blocks every /admin/* file unless authenticated
package.json          → declares @vercel/edge (for the middleware)
.vercelignore         → keeps the backend + docs OUT of the public deploy
goldpass/  (ignored)  → Supabase SQL + edge functions + build docs (not served)
uploads/   (ignored)  → internal handoff docs (not served)
```

## The security model — read this

There are **two** layers, and it's important to understand what each does:

### 1. Your DATA — protected by Supabase RLS (already done)
Every row in the database is guarded by Row Level Security. Even though the
**anon key is public** (it's *designed* to be — it ships in every Supabase web
app), it grants **zero** access to any row without a valid logged-in session.
Nobody can read or write a single record without authenticating as a real user.
This was already true before today.

> The `.jsx`/`.css` files are just UI code. They contain **no secrets and no
> data** — only the layout and logic of the screens. In *any* web app these are
> downloadable by the browser; that is normal and not a vulnerability.

### 2. The APP ITSELF — now gated by Edge Middleware (added today)
You asked that nobody can even *reach* the admin files unless logged in.
`middleware.js` runs on Vercel's edge **before any file is served**. For every
request to `/admin/*` it:

1. Reads the `gp-auth` cookie (a signed Supabase JWT).
2. Verifies the signature with `SUPABASE_JWT_SECRET` (HMAC-SHA256) and checks
   it isn't expired and belongs to an authenticated user.
3. If valid → serves the file. If missing/tampered/expired → **302 redirect to
   `/admin/login`**.

So `bartmining.com/admin/db-supabase.jsx` (or any other file) returns the login
redirect for anyone who isn't signed in. The cookie can't be forged because it's
signature-verified against a secret that never leaves the server.

The login page (`/admin/login`) is the only public entry. On success it sets the
verified cookie and redirects into the app; the running app keeps the cookie in
sync as the token refreshes, and clears it on sign-out.

## One-time setup on Vercel

### Environment variable (required for the gate)
In **Vercel → Project → Settings → Environment Variables**, add:

| Name | Value | Where to find it |
|---|---|---|
| `SUPABASE_JWT_SECRET` | your project's JWT secret | Supabase → Settings → API → JWT Settings → **JWT Secret** |

### Two config spots (paste your project URL + anon key)
Both must match. They only contain the **public** URL + anon key:
- `admin/index.html` — the `window.SUPABASE_URL` / `window.SUPABASE_ANON_KEY` block
- `admin/login.html` — the `SUPABASE_URL` / `SUPABASE_ANON_KEY` constants

### Database + functions (from `goldpass/supabase/`)
1. Run `INSTALL_ALL.sql` in the Supabase SQL editor.
2. Deploy the edge functions:
   ```bash
   supabase functions deploy gold-ai
   supabase functions deploy build-collar-output
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Create your users in Supabase → Auth → Users.

That's the whole cutover. After it: visiting `/admin` with no session →
login; after login → the app loads live from Postgres; every file under
`/admin` is unreachable without a verified session.

## Optional: belt-and-braces
For an extra hard wall you can ALSO turn on **Vercel → Settings → Deployment
Protection → Password Protection** — but note that protects the *entire*
deployment including the public marketing site, so only use it for a staging
URL, not production.
