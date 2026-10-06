import CallCard from '@/components/ui/CallCard'
import { stripGreeting } from '@/data/call-cards'

interface Props {
  lang?: 'en' | 'sw'
  eyebrow?: string
  heading: React.ReactNode
  body: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}

/** End-of-page call to action, shown as the site's call card (CallCard.tsx). */
export default function CtaSection({ lang = 'en', eyebrow = "Let's talk", heading, body, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: Props) {
  // A WhatsApp link keeps its own message; the card adds the greeting.
  const wa = primaryHref.startsWith('https://wa.me/')
  const text = wa ? new URL(primaryHref).searchParams.get('text') : null
  return (
    <section style={{ padding: '64px 0 96px', background: 'var(--bg)' }}>
      <div className="px-site">
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <CallCard
            lang={lang}
            placement="banner"
            eyebrow={eyebrow}
            title={heading}
            body={body}
            message={text ? stripGreeting(text) : undefined}
            primary={wa ? undefined : { label: primaryLabel, href: primaryHref }}
            secondary={secondaryLabel && secondaryHref ? { label: secondaryLabel, href: secondaryHref } : undefined}
          />
        </div>
      </div>
    </section>
  )
}
