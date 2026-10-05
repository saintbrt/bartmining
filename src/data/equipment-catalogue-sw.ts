import { EQUIPMENT as ENGLISH_EQUIPMENT, equipmentByCategory as englishGroups } from './equipment-catalogue'
import type { Equipment, EquipCategory } from './equipment-catalogue'
import translations from './equipment-catalogue-sw.json'

/** Complete Kiswahili copy of the catalogue; identities and photographs stay shared. */
interface Translation {
  name: string
  h1: string
  description: string
  summary: string
  specs: string[][]
  applications: string[]
  maintenance: string[][]
  faqs: string[][]
  imageAlt: string
}

const content: Record<string, Translation> = translations

export const CATEGORY_LABELS_SW: Record<EquipCategory, string> = {
  earthmoving: 'Mitambo ya kuchimba na ujenzi',
  hoisting: 'Vifaa vya kuinua na kupandisha mizigo',
  processing: 'Uchakataji na utenganishaji wa dhahabu',
  exploration: 'Utafiti wa madini na uchimbaji wa sampuli',
  pumping: 'Pampu na utoaji wa maji',
  safety: 'Vifaa vya usalama migodini',
  software: 'Programu za usimamizi wa migodi',
  power: 'Umeme na hewa iliyobanwa',
}

export const EQUIPMENT: Equipment[] = ENGLISH_EQUIPMENT.map(original => {
  const sw = content[original.slug]
  if (!sw) throw new Error(`Missing Kiswahili equipment: ${original.slug}`)
  return {
    ...original,
    name: sw.name,
    h1: sw.h1,
    title: `${sw.name} | Tanzania`,
    description: sw.description,
    summary: sw.summary,
    categoryLabel: CATEGORY_LABELS_SW[original.category],
    searchTerms: [sw.name, sw.h1, ...original.searchTerms],
    specs: sw.specs.map(([label, value]) => ({ label, value })),
    applications: sw.applications,
    maintenance: sw.maintenance.map(([interval, task]) => ({ interval, task })),
    faqs: sw.faqs.map(([q, a]) => ({ q, a })),
    imageAlt: sw.imageAlt,
    updated: '2026-10-05',
    readTime: `Dakika ${Math.ceil([sw.summary, ...sw.applications, ...sw.specs.flat(), ...sw.maintenance.flat(), ...sw.faqs.flat()].join(' ').split(/\s+/).length / 200)} za kusoma`,
  }
})

export const EQUIPMENT_BY_SLUG = new Map(EQUIPMENT.map(item => [item.slug, item]))

export function equipmentByCategory(): { category: EquipCategory; label: string; items: Equipment[] }[] {
  return englishGroups().map(group => ({
    category: group.category,
    label: CATEGORY_LABELS_SW[group.category],
    items: EQUIPMENT.filter(item => item.category === group.category),
  }))
}
