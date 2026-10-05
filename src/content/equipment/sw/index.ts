import type { GuideSection } from '../index'
import { sections as elution } from './gold-elution-electrowinning-plant'
import { sections as cilCip } from './cil-cip-plant'
import { sections as detector } from './gold-metal-detector'
import { sections as concentrator } from './centrifugal-gold-concentrator'

export const EQUIPMENT_GUIDES: Record<string, GuideSection[]> = {
  'gold-elution-electrowinning-plant': elution,
  'cil-cip-plant': cilCip,
  'gold-metal-detector': detector,
  'centrifugal-gold-concentrator': concentrator,
}
