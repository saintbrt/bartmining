import type { Slide } from '../types'
import { CANVAS } from '../brand'
import { Photo, TextBlock } from './parts'

/** Text-led slide: quotes, team posts without a portrait. Optional photo behind, shaded in the bottom third. */
export function CoverDark({ slide }: { slide: Slide }) {
  return (
    <div className="slide slide-dark slide-solid">
      {slide.image && (
        <>
          <Photo slide={slide} frame={CANVAS} className="slide-photo" />
          <div className="slide-shade" />
        </>
      )}
      {slide.mark && <div className="mark">{slide.mark}</div>}
      <TextBlock slide={slide} />
    </div>
  )
}
