import type { HubEntry } from '@/components/insights/HubClient'
import { SWAHILI_ARTICLES } from './article-library'
import { LOCATIONS_SW } from './locations-sw'
import { MARKETS } from './markets'
import { resolveEquipmentPhoto } from '@/lib/equipment-photos'

/** Every non-product Kiswahili page, plus the complete equipment catalogue. */
export const SWAHILI_DIRECTORY: HubEntry[] = [
  ...SWAHILI_ARTICLES,
  {
    path: '/insights-swahili/bei-ya-dhahabu-leo', language: 'sw',
    title: 'Bei ya dhahabu leo Tanzania',
    description: 'Angalia bei ya dunia iliyobadilishwa kuwa shilingi na uelewe tofauti kati ya rejea hiyo na kiasi utakacholipwa kwa dhahabu yako.',
    category: 'Bei ya dhahabu', tags: ['trading', 'dhahabu', 'bei'],
    image: resolveEquipmentPhoto('shaking-table-gold')!, imageAlt: 'Meza ya kutenganisha dhahabu kutoka kwenye katalogi ya Bart Mining',
  },
  {
    path: '/insights-swahili/jenereta-za-kukodi', language: 'sw',
    title: 'Jenereta za kukodi Tanzania',
    description: 'Linganisha ukubwa wa jenereta, tumia kikokotoo cha mzigo na uandae taarifa za eneo na muda wa kukodi ili kuomba bei.',
    category: 'Huduma za umeme', tags: ['services', 'jenereta', 'umeme', 'kukodi'],
    image: resolveEquipmentPhoto('diesel-generator-mining')!, imageAlt: 'Jenereta ya dizeli kutoka kwenye katalogi ya Bart Mining',
  },
  ...LOCATIONS_SW.map(l => ({
    path: `/insights-swahili/vifaa-vya-uchimbaji/${l.slug}`, language: 'sw' as const,
    title: `Vifaa vya uchimbaji ${l.town}`, description: l.description,
    category: 'Usambazaji kwa maeneo', tags: ['locations', 'vifaa', 'usambazaji', l.town.toLowerCase()],
    image: resolveEquipmentPhoto('hydraulic-excavator')!, imageAlt: 'Excavator kutoka kwenye katalogi ya Bart Mining',
  })),
  ...MARKETS.map(m => ({
    path: `/insights-swahili/soko-la-madini/${m.slug}`, language: 'sw' as const,
    title: `Soko la madini ${m.town}`, description: m.description,
    category: 'Masoko ya madini', tags: ['trading', 'locations', 'soko', 'dhahabu', m.town.toLowerCase()],
    image: resolveEquipmentPhoto('shaking-table-gold')!, imageAlt: 'Meza ya kutenganisha dhahabu kutoka kwenye katalogi ya Bart Mining',
  })),
  {
    path: '/equipment-swahili', language: 'sw',
    title: 'Katalogi kamili ya vifaa kwa Kiswahili',
    description: 'Fungua maelezo ya vifaa 50, yakiwemo crushers, ball mills, pampu, winchi na vifaa vya usalama, pamoja na vipimo, matumizi na matengenezo.',
    category: 'Katalogi ya vifaa', tags: ['catalogue', 'vifaa', 'equipment', 'crusher', 'ball mill', 'pampu', 'winchi'],
    image: resolveEquipmentPhoto('ball-mill-gold-ore')!, imageAlt: 'Ball mill kutoka kwenye katalogi ya Bart Mining',
  },
]
