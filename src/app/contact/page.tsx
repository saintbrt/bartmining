import type { Metadata } from 'next'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import ContactForm from '@/components/sections/ContactForm'
import { SITE } from '@/lib/seo'

export const metadata: Metadata = {
  // absolute: the brand already leads, so skip the '%s | Bart Mining' template.
  title: { absolute: 'Contact Bart Mining | Mining Consultancy & Equipment, Dar es Salaam' },
  description: 'Contact Bart Mining in Dar es Salaam for mining consultancy, gold processing plants and mining equipment across East Africa. WhatsApp +255 759 141 705.',
  alternates: { canonical: `${SITE.url}/contact` },
}

export default function Contact() {
  return (
    <>
      {/* Subhero */}
      <section className="subhero" style={{ paddingBottom: 46 }}>
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>Contact</span></div></Reveal>
          <Reveal delay={1}><h1>Let&apos;s build something <span className="grad">worth leaving behind</span></h1></Reveal>
          <Reveal delay={2}><p className="lead">Whether you&apos;re proving a deposit, planning a mine, sourcing a processing plant or evaluating a project, start with a conversation directly with the principal.</p></Reveal>
        </div>
      </section>

      {/* Contact grid */}
      <section className="sec-gap" style={{ paddingTop: 30 }}>
        <div className="px-site">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }} className="contact-grid-responsive">
            <Reveal><ContactForm /></Reveal>

            {/* Aside */}
            <Reveal delay={1} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Dark info card */}
              <div className="on-dark" style={{ background: 'var(--slate)', borderRadius: 'var(--r-lg)', padding: '28px 26px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'none', pointerEvents: 'none' }} />
                {[
                  { label: 'General enquiries', value: <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-2)' }}>+255 759 141 705</a> },
                  { label: 'Headquarters', value: 'Dar es Salaam, Tanzania' },
                  { label: 'Reach', value: '12+ countries · 6 continents' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 4 }}>{row.label}</div>
                      <div style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>{row.value}</div>
                    </div>
                  </div>
                ))}
                <div style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)', marginBottom: 4 }}>Status</div>
                  <div style={{ fontSize: 15, color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 7, height: 7, background: '#2E6A4F', flexShrink: 0, display: 'inline-block' }} />
                    Currently advising 3 projects
                  </div>
                </div>
              </div>

              {/* Who we work with */}
              <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', padding: '24px 26px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 16 }}>Who we work with</div>
                {['Mining companies', 'Governments & regulators', 'Investors & funds'].map(c => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--line-2)', fontSize: 15.5, color: 'var(--ink-2)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                    {c}
                  </div>
                ))}
                <p style={{ color: 'var(--ink-2)', fontSize: 15.5, marginTop: 16, lineHeight: 1.6 }}>
                  Prefer to talk? Reach the principal directly on WhatsApp and we&apos;ll set up a conversation about your project, stage and location.
                </p>
                <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ marginTop: 14, width: '100%', justifyContent: 'center', display: 'flex' }}>
                  WhatsApp +255 759 141 705
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What to send. Gives the page real substance and gets enquiries that
          can be quoted on the first reply. No hours or response-time promises
          here until the team confirms them. */}
      <section className="sec-gap" style={{ background: 'var(--paper)' }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">Before you write</span>
            <h2>What to send us</h2>
            <p>The more of this you include, the more useful our first reply will be.</p>
          </Reveal>
          <div className="contact-send-grid">
            {[
              {
                t: 'Equipment and plant quotes',
                items: [
                  'The equipment or plant you need, and the job it has to do',
                  'Throughput (tonnes per day or hour), shaft depth or load, as relevant',
                  'Ore type and any test work or assay results you have',
                  'Power available: TANESCO grid, generator size, or none yet',
                  'Delivery site: town, district and road access',
                ],
                link: { href: '/equipment', label: 'Browse the equipment catalogue' },
              },
              {
                t: 'Consulting and technical studies',
                items: [
                  'Project stage: exploration, resource definition, study, construction or operation',
                  'Commodity, location and licence type (PML, ML or SML)',
                  'The decision the work has to support, and who it is for (board, investor, lender, regulator)',
                  'Data available: drilling, assays, geological model, previous reports',
                  'Timeline you are working to',
                ],
                link: { href: '/insights/mining-consulting-africa', label: 'About our technical consulting' },
              },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i} style={{ background: 'var(--bg-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '26px 24px' }}>
                <h3 style={{ fontSize: 19, marginBottom: 14 }}>{c.t}</h3>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {c.items.map(x => <li key={x} style={{ fontSize: 15.5, color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: 6 }}>{x}</li>)}
                </ul>
                <Link href={c.link.href} style={{ display: 'inline-block', marginTop: 14, fontSize: 15, fontWeight: 600, color: 'var(--gold)' }}>{c.link.label} &rarr;</Link>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 28 }}>
            <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.7, maxWidth: 760 }}>
              Prefer email? Write to <a href={`mailto:${SITE.email}`} style={{ color: 'var(--gold)', fontWeight: 600 }}>{SITE.email}</a>. For quick questions, WhatsApp <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', fontWeight: 600 }}>+255 759 141 705</a> works best. We supply and advise across Tanzania from Dar es Salaam, including <Link href="/equipment/supply/geita" style={{ color: 'var(--gold)' }}>Geita</Link>, <Link href="/equipment/supply/mwanza" style={{ color: 'var(--gold)' }}>Mwanza</Link>, <Link href="/equipment/supply/kahama" style={{ color: 'var(--gold)' }}>Kahama</Link> and <Link href="/equipment/supply/chunya" style={{ color: 'var(--gold)' }}>Chunya</Link>. Kwa Kiswahili, tazama <Link href="/vifaa-vya-uchimbaji" hrefLang="sw" style={{ color: 'var(--gold)' }}>vifaa vya uchimbaji</Link>.
            </p>
          </Reveal>
        </div>
      </section>

      <style>{`
        .contact-send-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 18px; }
        @media (max-width: 760px) { .contact-send-grid { grid-template-columns: 1fr; } }
        .contact-grid-responsive { grid-template-columns: 1fr 380px !important; }
        @media (max-width: 860px) { .contact-grid-responsive { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
