/* Shared AI model id + pricing, used by db/index.ts (usage cost calc + fallback
   model name) and settings/page.tsx (label). The gold-ai edge function (Deno,
   deployed separately) hardcodes the same model id — keep in sync manually. */
export const AI_MODEL = 'claude-sonnet-4-6'
export const AI_PRICE_IN_PER_1M = 3
export const AI_PRICE_OUT_PER_1M = 15
