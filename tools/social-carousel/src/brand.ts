export const CANVAS = { width: 1080, height: 1350 }

export const CONTACT = {
  whatsapp: '+255 759 141 705',
  web: 'bartmining.com',
  email: 'hello@bartmining.com',
}

/** Headline wraps beyond this are flagged in the editor. */
export const MAX_HEADLINE_LINES = 3

/** How far a photo may be upscaled before it is flagged as soft. */
export const MAX_UPSCALE = { fullBleed: 1.25, card: 1.5 }

/** Light-card photo frame, used for the upscale check. */
export const CARD_BOX = { width: 860, height: 750 } // Full borderless image frame
