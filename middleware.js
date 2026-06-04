/* ============================================================
   Vercel Edge Middleware — gates EVERY file under /admin/*
   ------------------------------------------------------------
   No file in /admin (index.html, *.jsx, *.css …) is served unless
   the request carries a VALID, UNEXPIRED Supabase session token in
   the `gp-auth` cookie. The token's HMAC-SHA256 signature is verified
   against SUPABASE_JWT_SECRET (set as a Vercel env var). Anything
   unsigned, tampered, expired, or missing → redirected to the login.

   The only public path under /admin is the login page itself.
   ============================================================ */
import { next } from "@vercel/edge";

export const config = { matcher: ["/admin", "/admin/:path*"] };

/* base64url → bytes */
function b64urlBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/* verify a Supabase HS256 JWT; returns payload or null */
async function verifyJWT(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, sig] = parts;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
  );
  const ok = await crypto.subtle.verify("HMAC", key, b64urlBytes(sig), enc.encode(h + "." + p));
  if (!ok) return null;
  let payload;
  try { payload = JSON.parse(new TextDecoder().decode(b64urlBytes(p))); }
  catch { return null; }
  if (payload.exp && Date.now() / 1000 > payload.exp) return null;   // expired
  if (payload.role !== "authenticated") return null;                 // must be a real user
  return payload;
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
  const secret = process.env.SUPABASE_JWT_SECRET;

  if (token && secret) {
    const payload = await verifyJWT(token, secret);
    if (payload) return next();   // ✅ authenticated — serve the file
  }

  // ❌ not authenticated — bounce to login
  return Response.redirect(new URL("/admin/login", url.origin), 302);
}
