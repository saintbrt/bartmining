import { permanentRedirect } from 'next/navigation'

/** Legacy partial overview; district pages beneath this path remain available. */
export default function LegacyEquipmentOverview() {
  permanentRedirect('/equipments-swahili')
}
