import type { Slide } from '../types'
import { PhotoOverlay } from './PhotoOverlay'
import { LightCard } from './LightCard'
import { CoverDark } from './CoverDark'
import { StatSlide } from './StatSlide'
import { CtaSlide } from './CtaSlide'

export function SlideView({ slide }: { slide: Slide }) {
  switch (slide.template) {
    case 'photo-overlay': return <PhotoOverlay slide={slide} />
    case 'light-card': return <LightCard slide={slide} />
    case 'cover-dark': return <CoverDark slide={slide} />
    case 'stat': return <StatSlide slide={slide} />
    case 'cta': return <CtaSlide slide={slide} />
  }
}
