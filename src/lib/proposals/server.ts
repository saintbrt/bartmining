import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient, User } from '@supabase/supabase-js'

/* Server helpers for the Projects tab: who is asking, PDFs and email.
   Every route runs as the signed-in admin (their cookies), so RLS applies
   exactly as it does in the browser; no service key is involved. */

export interface AdminContext { sb: SupabaseClient; user: User }

/** The signed-in user, if they are an admin. Anything else gets null. */
export async function requireAdmin(req: NextRequest): Promise<AdminContext | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON
  if (!url || !key) return null
  const sb = createServerClient(url, key, {
    cookies: { getAll: () => req.cookies.getAll(), setAll: () => {} },
  })
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null
  const { data: admin } = await sb.rpc('is_admin')
  return admin ? { sb, user } : null
}

// ── PDF ─────────────────────────────────────────────────────────────────────

const LOCAL_CHROME: Record<string, string> = {
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  linux: '/usr/bin/google-chrome',
  win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
}

async function launch() {
  const { default: puppeteer } = await import('puppeteer-core')
  // On Vercel the bundled serverless Chromium; on a laptop the installed Chrome.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const { default: chromium } = await import('@sparticuz/chromium')
    return puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true })
  }
  const executablePath = process.env.CHROME_PATH || LOCAL_CHROME[process.platform]
  return puppeteer.launch({ executablePath, headless: true })
}

/**
 * Prints an admin print page (/admin/print/...) to PDF. The page is opened
 * with the caller's own session cookies, so it loads exactly what they see,
 * and the PDF is what Chrome's print engine makes of it: the same file the
 * Download button gives and the email attaches.
 */
export async function renderPdf(req: NextRequest, path: string): Promise<Buffer> {
  const origin = process.env.BM_PRINT_ORIGIN || req.nextUrl.origin
  const target = new URL(path, origin)
  const browser = await launch()
  try {
    const cookies = req.cookies.getAll().map(c => ({
      name: c.name,
      value: c.value,
      domain: target.hostname,
      path: '/',
      secure: target.protocol === 'https:',
      httpOnly: false,
    }))
    if (cookies.length) await browser.setCookie(...cookies)
    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 1600 })
    await page.goto(target.toString(), { waitUntil: 'networkidle0', timeout: 45000 })
    await page.waitForSelector('[data-print-ready]', { timeout: 30000 })
    await page.evaluate(() => document.fonts.ready.then(() => true))
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true })
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}

// ── Email ───────────────────────────────────────────────────────────────────

/** Sender for proposals and pro formas. Replies go to the admin who sent it. */
export const MAIL_FROM = process.env.BM_MAIL_FROM || 'Bart Mining <hello@bartmining.com>'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Plain text written in the composer, set in a simple branded layout. */
export function emailHtml(body: string, siteUrl: string) {
  const paras = esc(body.trim()).split(/\n{2,}/).map(p => `<p style="margin:0 0 14px;">${p.replace(/\n/g, '<br>')}</p>`).join('')
  return `<!doctype html><html><body style="margin:0;background:#f6f7f7;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f7;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e4e9eb;">
<tr><td style="padding:22px 28px;border-bottom:1px solid #e4e9eb;">
<table role="presentation" cellspacing="0" cellpadding="0"><tr>
<td><img src="${siteUrl}/favicon-180.png" width="36" height="36" alt="" style="display:block;border-radius:8px;"></td>
<td style="padding-left:12px;font:700 17px Helvetica,Arial,sans-serif;color:#14181a;">Bart Mining</td>
</tr></table>
</td></tr>
<tr><td style="padding:26px 28px 12px;font:15px/1.6 Helvetica,Arial,sans-serif;color:#14181a;">${paras}</td></tr>
<tr><td style="padding:16px 28px 22px;border-top:1px solid #e4e9eb;font:12px/1.6 Helvetica,Arial,sans-serif;color:#8c969b;">
Bart Mining · Dar es Salaam, Tanzania · +255 759 141 705 · <a href="${siteUrl}" style="color:#8a6c36;text-decoration:none;">bartmining.com</a>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

/** Splits "a@x.com, b@y.com; c@z.com" and keeps only plausible addresses. */
export function emailList(v: unknown): string[] {
  const raw = Array.isArray(v) ? v.join(',') : typeof v === 'string' ? v : ''
  return raw.split(/[,;\s]+/).map(s => s.trim()).filter(s => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)).slice(0, 20)
}

export const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim()

export function safeFileName(s: string) {
  return s.replace(/[^\w.\- ]+/g, '').replace(/\s+/g, ' ').trim().slice(0, 120) || 'document'
}
