import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import { SITE } from '@/lib/seo'

/**
 * Terms of use for the website.
 *
 * Covers the site itself, not client engagements or equipment sales, which
 * are governed by their own written proposals and contracts.
 *
 * NOTE FOR REVIEW: have this checked by a Tanzanian lawyer before relying on
 * it, particularly the liability and governing law sections.
 */

const UPDATED = '15 September 2026'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms for using bartmining.com: information is general guidance, not advice or a quotation; indicative specs and prices; third-party data and links.',
  alternates: { canonical: `${SITE.url}/terms` },
}

export default function Terms() {
  return (
    <>
      <section className="subhero" style={{ paddingBottom: 40 }}>
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>Terms</span></div></Reveal>
          <Reveal delay={1}><h1>Terms of use</h1></Reveal>
          <Reveal delay={2}><p className="lead">Last updated {UPDATED}. By using bartmining.com you agree to these terms. If you do not agree, please do not use the site.</p></Reveal>
        </div>
      </section>

      <section className="sec-gap" style={{ paddingTop: 30 }}>
        <div className="px-site">
          <article className="legal-body">
            <h2>About these terms</h2>
            <p>bartmining.com is operated by {SITE.legalName}, {SITE.city}, Tanzania. These terms cover your use of the website. Consulting engagements, equipment supply and any other services are governed by their own written proposals, quotations and contracts, which take priority over anything on this site.</p>

            <h2>Information on this site is general guidance</h2>
            <p>Our guides, articles, specifications and tools are published to help you understand mining equipment, processing and regulation. They are general information, not professional, engineering, legal, tax or investment advice for your situation. Decisions about a specific project should be based on test work, site assessment and advice from qualified professionals.</p>

            <h2>Specifications and prices are indicative</h2>
            <ul>
              <li>Equipment specifications describe typical ranges for a class of equipment, not a guaranteed figure for a particular model or unit.</li>
              <li>Prices, cost bands and worked examples are planning estimates. They are not quotations or offers. A price is only binding when we confirm it in a written quotation.</li>
              <li>Regulations, royalties, fees and procedures change. Confirm current requirements with the Mining Commission, TRA or another relevant authority.</li>
            </ul>

            <h2>Gold prices and third-party data</h2>
            <p>Gold prices on this site are calculated from third-party spot price and exchange rate sources and refreshed periodically. They are for reference only, may be delayed or unavailable, and are not the official indicative price set by the Mining Commission or a price anyone is obliged to pay. Do not rely on them for a transaction.</p>

            <h2>Links to other websites</h2>
            <p>We link to government, industry and other third-party websites for convenience. We do not control those sites and are not responsible for their content or availability.</p>

            <h2>Intellectual property</h2>
            <p>The text, diagrams, tables and design of this site belong to Bart Mining or are used with permission. You may read, print and share pages for your own reference with a link back to the source. You may not republish substantial parts of the site, or present it as your own, without our written permission. Stock photographs are used under their providers&apos; licences.</p>

            <h2>Acceptable use</h2>
            <p>Do not misuse the site: no attempts to disrupt it, gain unauthorised access to any part of it (including the staff-only administration area), or send spam or malicious content through the contact form.</p>

            <h2>Liability</h2>
            <p>We work to keep the site accurate and available, but we provide it &ldquo;as is&rdquo; without guarantees. To the extent the law allows, Bart Mining is not liable for any loss arising from reliance on information on this site or from the site being unavailable. Nothing in these terms limits liability that cannot be limited by law.</p>

            <h2>Privacy</h2>
            <p>How we handle personal information is explained in our <Link href="/privacy">privacy policy</Link>.</p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of the United Republic of Tanzania.</p>

            <h2>Changes and contact</h2>
            <p>We may update these terms, and the date at the top will change when we do. Questions about these terms: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
          </article>
        </div>
      </section>

      <style>{`
        .legal-body { max-width: 760px; }
        .legal-body h2 { font-size: clamp(20px,2.2vw,26px); font-weight: 700; margin: 40px 0 12px; color: var(--ink); }
        .legal-body h2:first-child { margin-top: 0; }
        .legal-body p, .legal-body li { font-size: 16px; line-height: 1.75; color: var(--ink-2); }
        .legal-body p { margin-bottom: 16px; }
        .legal-body ul { padding-left: 22px; margin-bottom: 16px; }
        .legal-body a { color: var(--gold-deep); text-decoration: underline; text-decoration-color: var(--line); }
      `}</style>
    </>
  )
}
