import Link from 'next/link'
import type { ReactNode } from 'react'
import { CALL_CARD_UI, GREETING, type CallCardLang } from '@/data/call-cards'

/* The site's call card: a dark card with a moving gold, amber and teal
   border, used on every page that asks the reader to get in touch.
     side    the vertical sidebar card (desktop only on equipment pages)
     banner  the wide card at the end of an article or page (every screen) */

type Placement = 'side' | 'banner'
interface LinkTarget { label: string; href: string }

const WHATSAPP = '255759141705'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.2Z" />
    </svg>
  )
}

export default function CallCard({
  lang, placement = 'banner', eyebrow, title, body, message, primary, secondary,
}: {
  lang: CallCardLang
  placement?: Placement
  eyebrow: string
  title: ReactNode
  body: ReactNode
  /** WhatsApp message after the greeting. Defaults to a general enquiry. */
  message?: string
  /** Sends the main button somewhere other than WhatsApp, such as the contact page. */
  primary?: LinkTarget
  /** The small link under the button. Defaults to the enquiry form; null hides it. */
  secondary?: LinkTarget | null
}) {
  const ui = CALL_CARD_UI[lang]
  const text = `${GREETING[lang]} ${message ?? ui.defaultMessage}`
  const second = secondary === undefined ? { label: ui.enquiry, href: '/contact' } : secondary

  return (
    <div className={`pc pc-${placement}`}>
      <div className="pc-in">
        <div className="pc-row">
          <div className="pc-txt">
            <p className="pc-eyebrow"><span className="pc-dot" />{eyebrow}</p>
            <h3 className="pc-title">{title}</h3>
            <p className="pc-body">{body}</p>
          </div>
          <div className="pc-act">
            {primary ? (
              <Link className="pc-btn" href={primary.href}>
                <span>{primary.label}</span>
                <span className="pc-arr" aria-hidden="true">&rarr;</span>
              </Link>
            ) : (
              <a className="pc-btn" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                <span>{ui.button}</span>
                <span className="pc-arr" aria-hidden="true">&rarr;</span>
              </a>
            )}
            <span className="pc-num">+255 759 141 705</span>
            {second && <Link className="pc-enq" href={second.href}>{second.label}</Link>}
          </div>
        </div>
      </div>
    </div>
  )
}
