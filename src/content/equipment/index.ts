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
import { sections as leachingTank } from './leaching-tank'
import { sections as winchSelection } from './winch-selection'
import { sections as scsr } from './self-contained-self-rescuer'
import { sections as rockDrill } from './pneumatic-rock-drill'
import { sections as filterPress } from './filter-press'
import { sections as generator } from './diesel-generator-mining'
import { MAKITA_GUIDES_EN } from './makita'

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
  'leaching-tank': leachingTank,
  '1-ton-winch': winchSelection,
  '2-ton-winch': winchSelection,
  '5-ton-mine-winch': winchSelection,
  'self-contained-self-rescuer': scsr,
  'pneumatic-rock-drill': rockDrill,
  'filter-press': filterPress,
  'diesel-generator-mining': generator,
  ...MAKITA_GUIDES_EN,
}
