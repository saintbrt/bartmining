/* ============================================================
   Vercel Edge Middleware — gates EVERY file under /admin/*
   ------------------------------------------------------------
   No file in /admin (index.html, *.jsx, *.css …) is served unless
   the request carries a VALID, UNEXPIRED Supabase session token in
   the `gp-auth` cookie.

   This project uses Supabase's NEW asymmetric JWT Signing Keys
   (ECC / ES256, or RSA / RS256). Tokens are therefore verified
   against the project's PUBLIC keys, fetched from the JWKS endpoint:
       https://<project>.supabase.co/auth/v1/jwks
   No shared secret is needed (and none should be stored).

   Required env var (already set for the app in build-env.js):
       SUPABASE_URL = https://<project>.supabase.co

   The only public path under /admin is the login page itself.
   ============================================================ */
import { next } from "@vercel/edge";

export const config = { matcher: ["/admin", "/admin/:path*"] };

const SUPABASE_URL = process.env.SUPABASE_URL || "";

/* base64url → bytes */
function b64urlBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64urlJSON(s) {
  try { return JSON.parse(new TextDecoder().decode(b64urlBytes(s))); }
  catch { return null; }
}

/* ── JWKS cache (per edge instance) ───────────────────────── */
let _jwks = null;
let _jwksAt = 0;
const JWKS_TTL = 10 * 60 * 1000; // 10 min

async function getKeys() {
  const now = Date.now();
  if (_jwks && now - _jwksAt < JWKS_TTL) return _jwks;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/jwks`);
  if (!res.ok) throw new Error("JWKS fetch failed: " + res.status);
  const data = await res.json();
  _jwks = data.keys || [];
  _jwksAt = now;
  return _jwks;
}

/* import a JWK (EC or RSA) as a Web Crypto verify key */
async function importKey(jwk) {
  if (jwk.kty === "EC") {
    return crypto.subtle.importKey(
      "jwk",
      { kty: "EC", crv: jwk.crv, x: jwk.x, y: jwk.y, ext: true },
      { name: "ECDSA", namedCurve: jwk.crv || "P-256" },
      false, ["verify"]
    );
  }
  if (jwk.kty === "RSA") {
    return crypto.subtle.importKey(
      "jwk",
      { kty: "RSA", n: jwk.n, e: jwk.e, ext: true },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false, ["verify"]
    );
  }
  throw new Error("Unsupported key type: " + jwk.kty);
}

function verifyParams(alg) {
  if (alg === "ES256") return { name: "ECDSA", hash: "SHA-256" };
  if (alg === "ES384") return { name: "ECDSA", hash: "SHA-384" };
  if (alg === "RS256") return { name: "RSASSA-PKCS1-v1_5" };
  return null;
}

/* verify a Supabase asymmetric JWT against the project JWKS.
   Returns the payload, or null if invalid/expired/not authenticated. */
async function verifyJWT(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, sig] = parts;

  const header = b64urlJSON(h);
  const payload = b64urlJSON(p);
  if (!header || !payload) return null;

  // basic claim checks first (cheap)
  if (payload.exp && Date.now() / 1000 > payload.exp) return null;  // expired
  if (payload.role !== "authenticated") return null;                // must be a real user

  const vparams = verifyParams(header.alg);
  if (!vparams) return null;

  let keys;
  try { keys = await getKeys(); } catch { return null; }
  // match by kid, else try all keys of the right type
  const candidates = header.kid
    ? keys.filter(k => k.kid === header.kid)
    : keys;
  if (!candidates.length) return null;

  const enc = new TextEncoder();
  const data = enc.encode(h + "." + p);
  const sigBytes = b64urlBytes(sig);

  for (const jwk of candidates) {
    try {
      const key = await importKey(jwk);
      const ok = await crypto.subtle.verify(vparams, key, sigBytes, data);
      if (ok) return payload;
    } catch { /* try next key */ }
  }
  return null;
}

function getCookie(req, name) {
  const raw = req.headers.get("cookie") || "";
  const m = raw.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Normalise the bare /admin to /admin/ so relative assets resolve.
  if (path === "/admin") return Response.redirect(new URL("/admin/", url.origin), 308);

  // The login page (and its bare path) is the only public entry.
  if (path === "/admin/login" || path === "/admin/login.html") return next();

  const token = getCookie(request, "gp-auth");
  if (token && SUPABASE_URL) {
    const payload = await verifyJWT(token);
    if (payload) return next();   // ✅ authenticated — serve the file
  }

  // ❌ not authenticated — bounce to login
  return Response.redirect(new URL("/admin/login", url.origin), 302);
}
