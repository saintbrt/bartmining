import type { Slide } from '../types'
import { CANVAS } from '../brand'
import { Photo, TextBlock } from './parts'

/** A figure in a hairline box + headline. Optional photo behind, shaded in the bottom third. */
export function StatSlide({ slide }: { slide: Slide }) {
  return (
    <div className="slide slide-dark slide-solid">
      {slide.image && (
        <>
          <Photo slide={slide} frame={CANVAS} className="slide-photo" />
          <div className="slide-shade" />
        </>
      )}
      <TextBlock slide={slide} before={slide.stat && <div className="stat">{slide.stat}</div>} />
    </div>
  )
}
