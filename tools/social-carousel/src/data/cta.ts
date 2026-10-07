import type { Slide } from '../types'
import { CONTACT } from '../brand'

/** Shared closing-slide design. Change this once to update every post. */
export const CTA_DESIGN = {
  template: 'photo-overlay',
  eyebrow: 'Talk to us',
  image: 'social/bart-mining-final.jpeg',
  crop: { x: 34.73496048538773, y: 50.10788811577691, zoom: 1 },
} satisfies Partial<Slide>

/** Also applies to older browser edits that still contain a post-code request. */
export const withoutPostCode = (text: string) =>
  text.replace(/\s+and mention IG-\d+/gi, '')

export const withSharedCta = (slide: Slide): Slide => {
  if (slide.id !== 'cta') return slide
  const sub = withoutPostCode(slide.sub ?? '').trim()
  return {
    ...slide,
    ...CTA_DESIGN,
    sub: sub.includes(CONTACT.whatsapp)
      ? sub
      : `${sub}${sub ? ' ' : ''}WhatsApp ${CONTACT.whatsapp}.`,
  }
}

export const cta = (headline: string, sub?: string): Slide =>
  withSharedCta({ id: 'cta', template: 'cta', headline, sub })
