import type { Slide } from '../types'
import { CANVAS, CONTACT } from '../brand'
import { Photo, TextBlock } from './parts'

/** Same end slide on every post: one line + how to reach us. */
export function CtaSlide({ slide }: { slide: Slide }) {
  return (
    <div className="slide slide-dark slide-solid">
      {slide.image && (
        <>
          <Photo slide={slide} frame={CANVAS} className="slide-photo" />
          <div className="slide-shade" />
        </>
      )}
      <TextBlock
        slide={slide}
        after={
          <dl className="contact">
            <dt>WhatsApp</dt><dd>{CONTACT.whatsapp}</dd>
            <dt>Web</dt><dd>{CONTACT.web}</dd>
            <dt>Email</dt><dd>{CONTACT.email}</dd>
          </dl>
        }
      />
    </div>
  )
}
