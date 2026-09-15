import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

/** Where contact-form enquiries are delivered (set by Allan, Sep 2026). */
const ENQUIRY_INBOX = 'allanbartinc@gmail.com'

/** Upper bounds per field, so the form cannot be used to send huge payloads. */
const LIMITS = { name: 120, email: 254, org: 160, type: 60, interest: 120, location: 160, message: 5000 } as const
type Field = keyof typeof LIMITS

/**
 * Visitor input is untrusted. Every value is escaped before it is placed in
 * the notification email's HTML, otherwise a submission could inject links,
 * images or hidden markup into the inbox.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Accept only strings, trimmed and capped; anything else becomes empty. */
function field(body: Record<string, unknown>, key: Field): string {
  const v = body[key]
  return typeof v === 'string' ? v.trim().slice(0, LIMITS[key]) : ''
}

/** Subject lines must stay on one line (no header injection via CR/LF). */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ')

const row = (label: string, value: string, first = false) =>
  `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#8C857A;font-size:13px;${first ? 'width:140px;' : ''}">${label}</td><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#1C1A16;font-size:14px;">${value}</td></tr>`

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = (await req.json()) as Record<string, unknown>
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const name = field(body, 'name')
    const email = field(body, 'email')
    const org = field(body, 'org')
    const type = field(body, 'type')
    const interest = field(body, 'interest')
    const location = field(body, 'location')
    const message = field(body, 'message')

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and project details are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const e = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      org: escapeHtml(org),
      type: escapeHtml(type),
      interest: escapeHtml(interest),
      location: escapeHtml(location),
      message: escapeHtml(message),
    }

    await resend.emails.send({
      from: 'Bart Mining <noreply@bartmining.com>',
      to: ENQUIRY_INBOX,
      reply_to: email,
      subject: oneLine(`New enquiry from ${name}${org ? ` (${org})` : ''}`),
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#F7F6F3;border-radius:12px;">
          <h2 style="font-size:22px;color:#1C1A16;margin:0 0 24px;">New project enquiry</h2>
          <table style="width:100%;border-collapse:collapse;">
            ${row('Name', e.name, true)}
            ${row('Email', `<a href="mailto:${encodeURIComponent(email)}" style="color:#AE8A4C;">${e.email}</a>`)}
            ${org ? row('Organisation', e.org) : ''}
            ${type ? row('Client type', e.type) : ''}
            ${interest ? row('Interested in', e.interest) : ''}
            ${location ? row('Project location', e.location) : ''}
          </table>
          <div style="margin-top:24px;padding:18px 20px;background:#fff;border-radius:8px;border:1px solid rgba(28,26,22,.09);">
            <div style="color:#8C857A;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">Project details</div>
            <p style="color:#1C1A16;font-size:15px;line-height:1.7;white-space:pre-wrap;margin:0;">${e.message}</p>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#8C857A;">Sent from bartmining.com contact form</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send. Please WhatsApp +255 759 141 705 directly.' }, { status: 500 })
  }
}
