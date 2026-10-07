/**
 * Filter facets for the equipment directories (/equipment and
 * /equipment-swahili). Stage comes from each product's category; these sets
 * add the two facets the category cannot express.
 *
 * GOLD_SPECIFIC: equipment made for, or mainly sold into, gold recovery.
 * SMALL_SCALE: equipment commonly bought by primary mining licence (PML)
 * and other small-scale operations, based on each product page's own
 * description of its typical users. Review when products are added.
 */

export const GOLD_SPECIFIC = new Set([
  'wet-pan-mill', 'sluice-box-gold-jig', 'alluvial-gold-wash-plant', 'centrifugal-gold-concentrator',
  'gold-elution-electrowinning-plant', 'cil-cip-plant', 'leaching-tank', 'modular-gold-plant',
  'ball-mill-gold-ore', 'shaking-table-gold', 'gold-metal-detector',
])

export const SMALL_SCALE = new Set([
  'hammer-mill', 'wet-pan-mill', 'trommel-screen', 'rotary-scrubber', 'sluice-box-gold-jig',
  'alluvial-gold-wash-plant', 'jaw-crusher', 'centrifugal-gold-concentrator', 'shaking-table-gold',
  '1-ton-winch', '2-ton-winch', 'wire-rope-slings-lifting-tackle', 'pneumatic-rock-drill',
  'gold-metal-detector', 'slurry-pump', 'submersible-dewatering-pump', 'diesel-generator-mining',
  'air-compressor-mining', 'mining-safety-helmet-cap-lamp', 'self-contained-self-rescuer',
  'gas-detection-monitor', 'fall-arrest-harness', 'mine-ventilation-fan', 'backhoe-loader',
  'spiral-classifier', 'magnetic-separator',
])
