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

1. Reads the `gp-auth` cookie (a Supabase access token / JWT).
2. Fetches your project's **public** signing keys from `${SUPABASE_URL}/auth/v1/jwks`
   (cached 10 min) and verifies the token's ES256/RS256 signature with the Web
   Crypto API, then checks it isn't expired and belongs to an authenticated user.
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
In **Vercel → Project → Settings → Environment Variables**, add both:

| Name | Value | Where to find it |
|---|---|---|
| `SUPABASE_URL` | https://your-project.supabase.co | Supabase → Settings → API → **Project URL** |
| `SUPABASE_ANON_KEY` | your anon/public key | Supabase → Settings → API → **anon public** |

> No JWT secret is required. This project uses Supabase's new asymmetric
> JWT Signing Keys (ECC / ES256), so the login gate verifies tokens against
> the project's **public** JWKS endpoint (`/auth/v1/jwks`) — there is no
> shared secret to store. The middleware derives the JWKS URL from
> `SUPABASE_URL`.

### How the keys reach the app (no hardcoding)
The Supabase URL + anon key are **no longer in source**. At deploy time Vercel runs
`build-env.js` (set as the Build Command in `vercel.json`), which reads
`SUPABASE_URL` / `SUPABASE_ANON_KEY` from the environment and writes
`admin/env.js`. Both `admin/index.html` and `admin/login.html` load
`<script src="env.js">`. The generated `env.js` is gitignored, so the keys never
touch the repository.

- **Vercel Build Command:** `node build-env.js` (already in `vercel.json`)
- **Local dev:** `admin/env.js` holds placeholders → app shows "Backend not configured" until real env vars are set on Vercel.
- The anon key is public by design; RLS protects the data. `service_role` +
  `ANTHROPIC_API_KEY` live ONLY in the Supabase edge functions, never in the client.

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
