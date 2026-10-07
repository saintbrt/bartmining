import type { Slide } from '../types'
import { CANVAS } from '../brand'
import { Photo, TextBlock } from './parts'

/** Reference look: full-bleed photo, black gradient, headline bottom-left. */
export function PhotoOverlay({ slide }: { slide: Slide }) {
  return (
    <div className="slide slide-dark">
      <Photo slide={slide} frame={CANVAS} className="slide-photo" />
      <div className="slide-shade" />
      <TextBlock slide={slide} />
    </div>
  )
}
