import Reveal from '@/components/ui/Reveal'
import { HIRE_TERMS, INCLUDED, PHONE_DISPLAY, PHONE_HREF, SIZE_BANDS, whatsappLink, type Faq } from '@/data/generator-rental'

/** Blocks shared by /generator-rental and its town pages. */

export function RentalContact({ message, center }: { message: string; center?: boolean }) {
  return (
    <div className="gr-contact" style={center ? { justifyContent: 'center' } : undefined}>
      <a className="btn btn-gold" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">WhatsApp for a quote</a>
      <a className="btn btn-ghost" href={PHONE_HREF}>Call {PHONE_DISPLAY}</a>
    </div>
  )
}

export function SizeBands() {
  return (
    <div className="gr-table-wrap">
      <table className="gr-table">
        <thead><tr><th>Size</th><th>Typically powers</th><th>Good to know</th></tr></thead>
        <tbody>
          {SIZE_BANDS.map(b => (
            <tr key={b.range}><td className="gr-strong">{b.range}</td><td>{b.typical}</td><td>{b.note}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Included() {
  return (
    <>
    <div className="gr-grid4">
      {INCLUDED.map((x, i) => (
        <Reveal key={x.title} delay={i % 3} className="gr-card">
          <h3>{x.title}</h3>
          <p>{x.text}</p>
        </Reveal>
      ))}
    </div>
    <dl className="gr-terms">
      {HIRE_TERMS.map(x => <div key={x.title}><dt>{x.title}</dt><dd>{x.text}</dd></div>)}
    </dl>
    </>
  )
}

export function QuoteSteps() {
  const steps = [
    { n: '01', t: 'Tell us the load', d: 'The size you need, or your load list: each motor’s kW and how it starts. The calculator above gives a first figure.' },
    { n: '02', t: 'Tell us the site and dates', d: 'Where the generator goes, road access, the start date, how long you need it (minimum one week, or two days for events) and how many hours a day it runs.' },
    { n: '03', t: 'Get a quote', d: 'We confirm the size and come back with a price for the whole hire, including delivery, installation, operator and servicing. Fuel is supplied by you.' },
  ]
  return (
    <ol className="gr-steps">
      {steps.map(s => (
        <li key={s.n}><span className="gr-step-n">{s.n}</span><h3>{s.t}</h3><p>{s.d}</p></li>
      ))}
    </ol>
  )
}

export function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <div style={{ maxWidth: 760 }}>
      {faqs.map(f => (
        <Reveal key={f.q} style={{ borderTop: '1px solid var(--line-2)', padding: '20px 0' }}>
          <h3 style={{ fontSize: 17, marginBottom: 8 }}>{f.q}</h3>
          <p style={{ color: 'var(--ink-2)', fontSize: 15.5, lineHeight: 1.7 }}>{f.a}</p>
        </Reveal>
      ))}
    </div>
  )
}
