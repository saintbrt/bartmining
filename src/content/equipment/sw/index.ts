import type { GuideSection } from '../index'
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
}
