import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await req.json()
    const { name, email, org, type, interest, location, message } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email and project details are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Bart Mining <noreply@bartmining.com>',
      to: 'hello@bartmining.com',
      reply_to: email,
      subject: `New enquiry from ${name}${org ? ` (${org})` : ''}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#F7F6F3;border-radius:12px;">
          <h2 style="font-size:22px;color:#1C1A16;margin:0 0 24px;">New project enquiry</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#8C857A;font-size:13px;width:140px;">Name</td><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#1C1A16;font-size:14px;">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#8C857A;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#1C1A16;font-size:14px;"><a href="mailto:${email}" style="color:#AE8A4C;">${email}</a></td></tr>
            ${org ? `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#8C857A;font-size:13px;">Organisation</td><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#1C1A16;font-size:14px;">${org}</td></tr>` : ''}
            ${type ? `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#8C857A;font-size:13px;">Client type</td><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#1C1A16;font-size:14px;">${type}</td></tr>` : ''}
            ${interest ? `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#8C857A;font-size:13px;">Interested in</td><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#1C1A16;font-size:14px;">${interest}</td></tr>` : ''}
            ${location ? `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#8C857A;font-size:13px;">Project location</td><td style="padding:10px 0;border-bottom:1px solid rgba(28,26,22,.08);color:#1C1A16;font-size:14px;">${location}</td></tr>` : ''}
          </table>
          <div style="margin-top:24px;padding:18px 20px;background:#fff;border-radius:8px;border:1px solid rgba(28,26,22,.09);">
            <div style="color:#8C857A;font-size:12px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">Project details</div>
            <p style="color:#1C1A16;font-size:15px;line-height:1.7;white-space:pre-wrap;margin:0;">${message}</p>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#8C857A;">Sent from bartmining.com contact form</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send. Please email hello@bartmining.com directly.' }, { status: 500 })
  }
}
