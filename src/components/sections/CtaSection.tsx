import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

interface Props {
  eyebrow?: string
  heading: React.ReactNode
  body: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}

export default function CtaSection({ eyebrow = "Let's talk", heading, body, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: Props) {
  return (
    <section style={{ padding: '64px 0 96px', background: 'var(--bg)' }}>
      <div className="px-site">
        <Reveal>
          <div className="cta-block">
            <div className="oc1 orb-cta" />
            <div className="oc2 orb-cta" />
            <span className="eyebrow center" style={{ color: 'var(--gold-2)', justifyContent: 'center', position: 'relative' }}>{eyebrow}</span>
            <h2>{heading}</h2>
            <p>{body}</p>
            <div className="cta-actions">
              <Link href={primaryHref} className="btn btn-gold">
                {primaryLabel}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 16, height: 16 }}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              {secondaryLabel && secondaryHref && (
                <Link href={secondaryHref} className="btn btn-ghost">{secondaryLabel}</Link>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
