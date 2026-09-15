import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import { SITE } from '@/lib/seo'

/**
 * Privacy policy.
 *
 * Every statement here describes what the site actually does (checked Sep
 * 2026): the contact form emails the enquiry via Resend and does not store it
 * in a database; there are no analytics, advertising or tracking cookies on
 * public pages; the only cookies are Supabase login cookies on /admin, which
 * is staff-only (see middleware.ts). If analytics or any new data collection
 * is added, update this page in the same change.
 *
 * NOTE FOR REVIEW: have this checked against the Personal Data Protection
 * Act, 2022 (Tanzania) by a lawyer before relying on it.
 */

const UPDATED = '15 September 2026'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Bart Mining handles personal information: what the contact form collects, who processes it, cookies, retention and your rights.',
  alternates: { canonical: `${SITE.url}/privacy` },
}

export default function Privacy() {
  return (
    <>
      <section className="subhero" style={{ paddingBottom: 40 }}>
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>Privacy</span></div></Reveal>
          <Reveal delay={1}><h1>Privacy policy</h1></Reveal>
          <Reveal delay={2}><p className="lead">Last updated {UPDATED}. This page explains what personal information bartmining.com collects, why, and what you can ask us to do with it.</p></Reveal>
        </div>
      </section>

      <section className="sec-gap" style={{ paddingTop: 30 }}>
        <div className="px-site">
          <article className="legal-body">
            <h2>Who we are</h2>
            <p>{SITE.legalName} (&ldquo;Bart Mining&rdquo;, &ldquo;we&rdquo;) operates bartmining.com and is based in {SITE.city}, Tanzania. We are responsible for the personal information described on this page. Contact us about privacy at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>

            <h2>What we collect</h2>
            <h3>When you use the contact form</h3>
            <p>The form asks for your name, email address and project details, and optionally your organisation, client type, area of interest and project location. We use this only to reply to your enquiry and, if you become a client, to provide our services.</p>
            <h3>When you contact us directly</h3>
            <p>If you email or message us on WhatsApp, we receive whatever you send, including your phone number or email address. WhatsApp messages are also subject to WhatsApp&apos;s own privacy policy.</p>
            <h3>When you browse the site</h3>
            <p>Like any website, our hosting provider automatically processes technical information such as your IP address, browser type and the pages requested, to deliver the site and protect it from abuse. We do not use this to identify you.</p>

            <h2>What we do not do</h2>
            <ul>
              <li>We do not use analytics, advertising or tracking cookies on the public site.</li>
              <li>We do not sell, rent or trade personal information.</li>
              <li>We do not add you to a mailing list from a contact-form enquiry.</li>
            </ul>

            <h2>Cookies</h2>
            <p>Public pages of bartmining.com do not set cookies. The staff-only administration area uses strictly necessary login cookies to keep authorised users signed in.</p>

            <h2>Who processes your information</h2>
            <ul>
              <li><strong>Resend</strong> delivers contact-form submissions to our inbox by email. Submissions are not stored in a website database.</li>
              <li><strong>Vercel</strong> hosts the website and processes the technical request data described above.</li>
              <li><strong>Email and messaging providers</strong> we use to read and reply to your enquiry.</li>
            </ul>
            <p>Some of these providers operate outside Tanzania, so your information may be processed in other countries. We use established providers with their own security and data protection commitments.</p>

            <h2>How long we keep it</h2>
            <p>We keep enquiries for as long as needed to respond and, where you become a client, for as long as needed for the engagement and our business and legal records. You can ask us to delete an enquiry at any time.</p>

            <h2>Your rights</h2>
            <p>You can ask us to tell you what personal information we hold about you, to correct it, or to delete it, and you can object to how we use it. Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we will respond. We aim to handle personal information in line with Tanzania&apos;s Personal Data Protection Act, 2022.</p>

            <h2>Security</h2>
            <p>The site is served only over HTTPS, and contact-form input is validated and escaped before it is emailed to us. No method of transmission or storage is completely secure, so please do not send passwords or payment details through the form.</p>

            <h2>Changes to this policy</h2>
            <p>If we change how we handle personal information, we will update this page and the date at the top. See also our <Link href="/terms">terms of use</Link>.</p>
          </article>
        </div>
      </section>

      <style>{`
        .legal-body { max-width: 760px; }
        .legal-body h2 { font-size: clamp(20px,2.2vw,26px); font-weight: 700; margin: 40px 0 12px; color: var(--ink); }
        .legal-body h2:first-child { margin-top: 0; }
        .legal-body h3 { font-size: 17px; font-weight: 700; margin: 22px 0 8px; color: var(--ink); }
        .legal-body p, .legal-body li { font-size: 16px; line-height: 1.75; color: var(--ink-2); }
        .legal-body p { margin-bottom: 16px; }
        .legal-body ul { padding-left: 22px; margin-bottom: 16px; }
        .legal-body a { color: var(--gold-deep); text-decoration: underline; text-decoration-color: var(--line); }
        .legal-body strong { color: var(--ink); }
      `}</style>
    </>
  )
}
