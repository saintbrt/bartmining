/* ============================================================
   build-env.js — runs on Vercel at deploy time
   Generates admin/env.js from environment variables so the
   Supabase URL + anon key are NEVER hardcoded in source.

   Set these in Vercel → Settings → Environment Variables:
     SUPABASE_URL        = https://your-project.supabase.co
     SUPABASE_ANON_KEY   = your-anon-key
   (The anon key is safe in the browser — Row Level Security
    protects the data. service_role + ANTHROPIC keys live ONLY
    in the Supabase edge functions, never here.)
   ============================================================ */
const fs = require("fs");

const url = process.env.SUPABASE_URL || "";
const key = process.env.SUPABASE_ANON_KEY || "";

if (!url || !key) {
  console.warn("[build-env] WARNING: SUPABASE_URL / SUPABASE_ANON_KEY not set. " +
    "Writing empty env.js — the app will show 'Backend not configured'.");
}

const out =
  "/* Auto-generated at deploy time from Vercel env vars. Do not edit or commit. */\n" +
  "window.SUPABASE_URL=" + JSON.stringify(url) + ";\n" +
  "window.SUPABASE_ANON_KEY=" + JSON.stringify(key) + ";\n";

fs.writeFileSync("admin/env.js", out);
console.log("[build-env] Wrote admin/env.js (url " + (url ? "set" : "MISSING") +
  ", anon key " + (key ? "set" : "MISSING") + ").");
