import type { Slide } from '../types'
import { CARD_BOX, CONTACT } from '../brand'
import { Photo, TextBlock } from './parts'

/** Photo framed in a card that it fills edge to edge (portraits, small product shots). */
export function LightCard({ slide }: { slide: Slide }) {
  return (
    <div className="slide slide-light">
      {slide.image && <div className="card">
        <Photo slide={slide} frame={CARD_BOX} className="card-photo" />
      </div>}
      <TextBlock slide={slide} after={slide.id === 'cta' ? (
        <dl className="contact">
          <dt>WhatsApp</dt><dd>{CONTACT.whatsapp}</dd>
          <dt>Web</dt><dd>{CONTACT.web}</dd>
          <dt>Email</dt><dd>{CONTACT.email}</dd>
        </dl>
      ) : undefined} />
    </div>
  )
}
