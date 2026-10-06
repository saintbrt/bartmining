/* Copy for the call cards (src/components/ui/CallCard.tsx) on equipment and
   supply pages. Other pages pass their own copy to the card. The card adds
   the greeting in front of each WhatsApp message. */

export type CallCardLang = 'en' | 'sw'

export interface CallCardCopy {
  eyebrow: string
  title: string
  body: string
  /** WhatsApp message after the greeting. */
  message: string
}

export const CALL_CARD_UI = {
  en: { button: 'Chat with us on WhatsApp', enquiry: 'Or send us an enquiry', defaultMessage: "I'd like to talk to you about my project." },
  sw: { button: 'Ongea nasi WhatsApp', enquiry: 'Au tutumie maombi', defaultMessage: 'ningependa kuzungumza nanyi kuhusu mradi wangu.' },
} as const

export const GREETING = { en: 'Hello Bart Mining,', sw: 'Habari Bart Mining,' } as const

/** Removes a greeting already written into a page's WhatsApp message, so the card can add its own greeting. */
export function stripGreeting(message: string): string {
  return message.replace(/^(Hello|Hi|Habari|Hujambo)\s+Bart Mining,?\s*/i, '')
}

export function equipmentCallCard(lang: CallCardLang, name: string): CallCardCopy {
  return lang === 'en'
    ? {
        eyebrow: 'Get a price',
        title: "Let's Find the Right Machine for You",
        body: "Tell us a little about your site and the work ahead. We'll listen, help you choose what truly fits, and send you a clear price you can plan around.",
        message: `I'd like a price for the ${name}.`,
      }
    : {
        eyebrow: 'Pata bei',
        title: 'Tukusaidie Kupata Mashine Inayokufaa',
        body: 'Tueleze kidogo kuhusu eneo lako na kazi unayopanga. Tutakusikiliza, tukusaidie kuchagua kinachokufaa kweli, kisha tukutumie bei iliyo wazi ya kupangia.',
        message: `ningependa kupata bei ya ${name}.`,
      }
}

export function supplyCallCard(lang: CallCardLang, city: string): CallCardCopy {
  return lang === 'en'
    ? {
        eyebrow: 'Get a price',
        title: `Delivered to ${city}, Priced in Full`,
        body: `We price your equipment delivered to ${city}, so there are no surprises when it arrives. Send us a message and we'll take care of the rest.`,
        message: `I'd like a price for equipment delivered to ${city}.`,
      }
    : {
        eyebrow: 'Pata bei',
        title: `Imefikishwa ${city}, Bei Kamili`,
        body: `Tunakupa bei ya vifaa vikiwa vimefika ${city}, ili usipate mshangao vikifika. Tutumie ujumbe na sisi tutashughulikia mengine.`,
        message: `ningependa kupata bei ya vifaa vikifikishwa ${city}.`,
      }
}
