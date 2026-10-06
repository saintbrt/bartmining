import { ARTICLES, type ArticleMeta } from './insights'

export interface LibraryArticle extends ArticleMeta {
  language: 'en' | 'sw'
  path: string
  /** A true translation, rather than a related product or service page. */
  englishSlug?: string
}

export const SWAHILI_ARTICLES: LibraryArticle[] = [
  {
    slug: 'bei-ya-vifaa-vya-uchimbaji', path: '/insights-swahili/bei-ya-vifaa-vya-uchimbaji', language: 'sw', englishSlug: 'mining-equipment-cost-tanzania',
    title: 'Bei ya vifaa na gharama za kuanzisha plant ya dhahabu Tanzania',
    description: 'Bei za alluvial za Chunya, makadirio ya awali ya vifaa na usafirishaji wa mawe magumu, na mifano ya gharama za kuendesha plant ya dhahabu.',
    cta: { title: 'Andaa bajeti ya plant yako', body: 'Tutumie eneo, taarifa za malighafi, matokeo ya sampuli na majaribio, uwezo unaolengwa na taarifa za maji na umeme. Tutajadili wigo wa vifaa, kufikisha na kazi za eneo.' },
    category: 'Gharama · Tanzania', tags: ['cost', 'equipment', 'gold', 'processing', 'tanzania', 'bei', 'gharama', 'vifaa'],
    date: 'August 2026', updated: 'October 2026', updatedDate: '2026-10-05', readTime: 'Dakika 12 za kusoma',
    image: '/equipment/alluvial-gold-wash-plant.jpg', imageAlt: 'Vifaa vya kuosha na kutenganisha dhahabu ya alluvial kwenye katalogi ya Bart Mining',
    imageCaption: 'Picha ya rejea kutoka kwenye katalogi; si picha ya plant iliyofungwa Chunya.',
    related: ['gharama-ya-plant-ya-dhahabu', 'bei-ya-mashine-ya-kusaga-mawe'],
  },
  {
    slug: 'gharama-ya-plant-ya-dhahabu', path: '/insights-swahili/gharama-ya-plant-ya-dhahabu', language: 'sw', englishSlug: 'gold-plant-setup-cost',
    title: 'Gharama ya kuanzisha plant ya dhahabu Tanzania',
    description: 'Kutoka sampuli hadi uzalishaji: bajeti za Chunya, vifaa, ujenzi, maji, umeme, commissioning na fedha za miezi ya kwanza.',
    cta: { title: 'Panga kazi za kufungua plant', body: 'Eleza eneo, malighafi, miundombinu iliyopo na wigo unaotaka kwenye pendekezo. Tutajadili maandalizi, ufungaji na commissioning pamoja na majukumu yako.' },
    category: 'Gharama · Uchakataji', tags: ['cost', 'gold', 'processing', 'tanzania', 'gharama', 'dhahabu'],
    date: 'August 2026', updated: 'October 2026', updatedDate: '2026-10-05', readTime: 'Dakika 9 za kusoma',
    image: '/equipment/modular-gold-plant.jpg', imageAlt: 'Plant ya modular kwenye katalogi ya Bart Mining',
    imageCaption: 'Picha ya rejea kutoka kwenye katalogi, si ushahidi wa plant iliyojengwa Chunya.',
    related: ['bei-ya-vifaa-vya-uchimbaji', 'bei-ya-mashine-ya-kusaga-mawe'],
  },
  {
    slug: 'bei-ya-mashine-ya-kusaga-mawe', path: '/insights-swahili/bei-ya-mashine-ya-kusaga-mawe', language: 'sw',
    title: 'Bei ya mashine ya kusaga mawe ya dhahabu',
    description: 'Jinsi ya kuchagua ball mill au hammer mill, kuomba bei yenye wigo wazi na kupanga umeme, media na matengenezo.',
    cta: { title: 'Andaa taarifa za kuomba bei ya kinu', body: 'Tutumie eneo, tani kwa siku, saa za kazi, vipimo vya malighafi na ulaini unaolengwa, pamoja na taarifa za umeme na majaribio ya mawe.' },
    category: 'Vifaa · Kusaga', tags: ['cost', 'equipment', 'processing', 'tanzania', 'bei', 'vifaa', 'kusaga'],
    date: 'September 2026', updated: 'October 2026', updatedDate: '2026-10-06', readTime: 'Dakika 4 za kusoma',
    image: '/equipment/ball-mill-gold-ore.jpg', imageAlt: 'Ball mill kwenye katalogi ya Bart Mining',
    imageCaption: 'Picha ya rejea ya ball mill kutoka kwenye katalogi yetu.',
    related: ['bei-ya-vifaa-vya-uchimbaji', 'gharama-ya-plant-ya-dhahabu'],
  },
  {
    slug: 'jinsi-ya-kupata-leseni-ya-pml', path: '/insights-swahili/jinsi-ya-kupata-leseni-ya-pml', language: 'sw',
    title: 'Jinsi ya kupata leseni ya uchimbaji mdogo (PML)',
    description: 'Maandalizi ya eneo, ustahiki, nyaraka na hatua za kuomba PML, pamoja na kazi za kupanga kabla ya kuanza kuchimba.',
    category: 'Leseni · Tanzania', tags: ['compliance', 'regulation', 'pml', 'tanzania', 'leseni', 'uchimbaji'],
    date: 'September 2026', updated: 'October 2026', updatedDate: '2026-10-06', readTime: 'Dakika 5 za kusoma',
    image: '/equipment/rc-drilling-rig.jpg', imageAlt: 'Kifaa cha kuchimba sampuli kwenye katalogi ya Bart Mining',
    imageCaption: 'Picha ya rejea ya vifaa; haiwakilishi leseni au kibali cha mradi.',
    related: ['mrabaha-na-kodi-za-dhahabu', 'gharama-ya-plant-ya-dhahabu'],
  },
  {
    slug: 'mrabaha-na-kodi-za-dhahabu', path: '/insights-swahili/mrabaha-na-kodi-za-dhahabu', language: 'sw',
    title: 'Mrabaha na makato kwenye mauzo ya dhahabu Tanzania',
    description: 'Jinsi ya kuthibitisha mrabaha na makato, kulinganisha njia za kuuza na kuhifadhi hesabu na stakabadhi za mauzo.',
    category: 'Mauzo · Tanzania', tags: ['trading', 'royalty', 'compliance', 'gold', 'tanzania', 'mrabaha', 'kodi', 'dhahabu'],
    date: 'September 2026', updated: 'October 2026', updatedDate: '2026-10-06', readTime: 'Dakika 5 za kusoma',
    image: '/equipment/shaking-table-gold.jpg', imageAlt: 'Meza ya kutenganisha dhahabu kwenye katalogi ya Bart Mining',
    imageCaption: 'Picha ya rejea kutoka kwenye katalogi, si ushahidi wa mauzo ya dhahabu.',
    related: ['jinsi-ya-kupata-leseni-ya-pml', 'bei-ya-vifaa-vya-uchimbaji'],
  },
]

export const ENGLISH_ARTICLES: LibraryArticle[] = ARTICLES.map(article => ({ ...article, language: 'en' as const, path: `/insights/${article.slug}` }))

/** Combined inventory for sitemap and auditing; each hub renders only its own language. */
export const ARTICLE_LIBRARY: LibraryArticle[] = [
  ...SWAHILI_ARTICLES,
  ...ENGLISH_ARTICLES,
]
