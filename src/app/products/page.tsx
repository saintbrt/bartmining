import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import EquipGrid from '@/components/sections/EquipGrid'
import RegionsSection from '@/components/sections/RegionsSection'
import CtaSection from '@/components/sections/CtaSection'

export const metadata: Metadata = {
  title: 'Gold Processing Plants & Mining Equipment Supply | Tanzania & Africa',
  description: 'Supply & commissioning of gold processing plants and mining equipment across East & Southern Africa: centrifugal concentrators, CIL/CIP systems, elution & electrowinning, modular gold plants, HPGR, thickeners and tailings filters.',
  alternates: { canonical: 'https://www.bartmining.com/products' },
}

export default function Products() {
  return (
    <>
      {/* Subhero */}
      <section className="subhero">
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="px-site">
          <Reveal><div className="crumb"><Link href="/">Home</Link><span className="sep">/</span><span>Products</span></div></Reveal>
          <Reveal delay={1}><h1>Machinery &amp; <span className="grad">processing plants.</span></h1></Reveal>
          <Reveal delay={2}><p className="lead">From exploration support equipment to complete gold-recovery systems, we source, specify, supply and commission specialised mining and mineral-processing machinery - tailored to your ore characteristics, throughput and site conditions.</p></Reveal>
          <Reveal delay={3}>
            <div className="subhero-meta">
              <div><div className="num">Source</div><div className="lbl">Vendor-neutral selection</div></div>
              <div className="div" />
              <div><div className="num">Supply</div><div className="lbl">Procurement &amp; logistics</div></div>
              <div className="div" />
              <div><div className="num">Commission</div><div className="lbl">Install &amp; handover</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured split */}
      <section className="sec-gap" style={{ paddingBottom: 50 }}>
        <div className="px-site">
          <div className="split2">
            <Reveal>
              <div className="about-img">
                <Image src="https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Mining processing equipment on site" fill style={{ objectFit: 'cover' }} sizes="(max-width: 860px) 100vw, 50vw" />
              </div>
            </Reveal>
            <Reveal delay={1}>
              <span className="eyebrow">Why source through us</span>
              <h2 style={{ fontSize: 'clamp(28px,3.4vw,40px)', marginTop: 16 }}>The right plant for the orebody - not the catalogue.</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 18 }}>Equipment decisions made on a spreadsheet fail in the field. We size and select against real metallurgy, grade and remoteness, manage procurement and logistics, then stand the plant up and hand it to a trained crew. Vendor-neutral, accountable to you.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 28 }}>
                {[
                  { n: '01', t: 'Spec & size', b: 'Matched to ore, throughput and recovery targets.' },
                  { n: '02', t: 'Commission', b: 'Installed, tuned and handed over to your operators.' },
                ].map(v => (
                  <div key={v.n} style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-md)', border: '1px solid var(--line-2)', padding: '20px 18px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold-2)', marginBottom: 8, opacity: .7 }}>{v.n}</div>
                    <h4 style={{ fontSize: 15, marginBottom: 6 }}>{v.t}</h4>
                    <p style={{ color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.6 }}>{v.b}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Equipment grid */}
      <section className="sec-gap" style={{ paddingTop: 30 }}>
        <div className="px-site">
          <Reveal className="sec-head">
            <span className="eyebrow">The range</span>
            <h2>Specialist mining &amp; mineral-processing equipment.</h2>
            <p>Recognisable, serious gear for gold recovery and beyond - supplied and commissioned to site.</p>
          </Reveal>
        </div>
      </section>
      <EquipGrid variant="light" showLink={false} />

      <RegionsSection />

      <CtaSection
        eyebrow="Spec a plant"
        heading={<>Tell us your <span className="grad">throughput &amp; grade.</span></>}
        body="We'll come back with a recommended configuration, indicative budget and a commissioning plan."
        primaryLabel="Request a quote"
        primaryHref="/contact"
        secondaryLabel="Browse the range"
        secondaryHref="#"
      />
    </>
  )
}
