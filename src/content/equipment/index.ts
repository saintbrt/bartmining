/**
 * Optional long-form guide sections for individual equipment pages.
 *
 * Most product pages are fully described by the structured catalogue data
 * (specs, applications, maintenance, FAQs). Pages that Search Console shows
 * ranking for explanatory queries ("gold elution process", "cip plant
 * design") get extra sections here, rendered above the specification table
 * and listed in the page's "On this page" navigation.
 *
 * HTML is trusted, authored in this repo. Use `eq-tablewrap` / `eq-table`
 * for tables so they match the spec tables and scroll on narrow screens.
 */

import { sections as elution } from './gold-elution-electrowinning-plant'
import { sections as cilCip } from './cil-cip-plant'
import { sections as detector } from './gold-metal-detector'
import { sections as concentrator } from './centrifugal-gold-concentrator'

export interface GuideSection {
  /** Anchor id, also used in the "On this page" navigation. */
  id: string
  /** Rendered as the section H2. */
  title: string
  html: string
}

export const EQUIPMENT_GUIDES: Record<string, GuideSection[]> = {
  'gold-elution-electrowinning-plant': elution,
  'cil-cip-plant': cilCip,
  'gold-metal-detector': detector,
  'centrifugal-gold-concentrator': concentrator,
}
