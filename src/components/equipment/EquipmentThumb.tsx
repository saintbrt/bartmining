import Image from 'next/image'
import type { EquipCategory } from '@/data/equipment-catalogue'
import { resolveEquipmentPhoto } from '@/lib/equipment-photos'

/**
 * Product thumbnail for the catalogue grid.
 *
 * Renders the uploaded photo when one exists in public/equipment/, otherwise
 * a drawn placeholder carrying a line mark for the product's category. The
 * placeholder is deliberate artwork rather than a grey box, so the grid reads
 * as a catalogue even before any photography has been supplied, and so the
 * page does not look broken if a product never gets a photo.
 */

const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.25, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function CategoryMark({ category }: { category: EquipCategory }) {
  switch (category) {
    case 'hoisting': // drum, rope and hook
      return (
        <g {...STROKE}>
          <rect x="12" y="14" width="24" height="15" rx="1.5" />
          <line x1="18" y1="14" x2="18" y2="29" /><line x1="24" y1="14" x2="24" y2="29" /><line x1="30" y1="14" x2="30" y2="29" />
          <path d="M36 18h6v20" /><path d="M42 38a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
        </g>
      )
    case 'processing': // tank with agitator and outflow
      return (
        <g {...STROKE}>
          <path d="M13 16h22v18a6 6 0 0 1-6 6H19a6 6 0 0 1-6-6z" />
          <line x1="24" y1="10" x2="24" y2="34" /><line x1="19" y1="30" x2="29" y2="30" />
          <path d="M35 24h8v14" />
        </g>
      )
    case 'exploration': // drill mast over strata
      return (
        <g {...STROKE}>
          <path d="M20 8h8v20h-8z" /><line x1="24" y1="28" x2="24" y2="38" />
          <path d="M21 38h6l-3 5z" />
          <line x1="8" y1="44" x2="44" y2="44" /><line x1="8" y1="48" x2="44" y2="48" />
        </g>
      )
    case 'pumping': // volute pump with pipework
      return (
        <g {...STROKE}>
          <circle cx="24" cy="28" r="10" /><circle cx="24" cy="28" r="3.5" />
          <path d="M24 18V10h10" /><path d="M34 28h10" />
          <line x1="14" y1="42" x2="34" y2="42" />
        </g>
      )
    case 'safety': // helmet with lamp
      return (
        <g {...STROKE}>
          <path d="M11 34a13 13 0 0 1 26 0" /><line x1="8" y1="34" x2="40" y2="34" />
          <path d="M20 21a5 5 0 0 1 8 0" /><circle cx="24" cy="26" r="2.5" />
        </g>
      )
    case 'software': // window with chart
      return (
        <g {...STROKE}>
          <rect x="9" y="12" width="30" height="24" rx="2" /><line x1="9" y1="19" x2="39" y2="19" />
          <path d="M15 31l5-6 4 4 6-8" />
          <line x1="19" y1="42" x2="29" y2="42" /><line x1="24" y1="36" x2="24" y2="42" />
        </g>
      )
    case 'power': // generator block with bolt
      return (
        <g {...STROKE}>
          <rect x="10" y="18" width="28" height="18" rx="2" />
          <path d="M25 21l-4 7h5l-3 6" />
          <line x1="15" y1="36" x2="15" y2="40" /><line x1="33" y1="36" x2="33" y2="40" />
        </g>
      )
  }
}

export default function EquipmentThumb({
  slug, alt, category, sizes = '(max-width: 640px) 100vw, 33vw', priority = false,
}: {
  slug: string
  alt: string
  category: EquipCategory
  sizes?: string
  priority?: boolean
}) {
  const photo = resolveEquipmentPhoto(slug)

  if (photo) {
    return (
      <div className="eq-thumb">
        <Image src={photo} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} />
      </div>
    )
  }

  return (
    <div className="eq-thumb eq-thumb-empty" role="img" aria-label={`${alt}. Photograph to follow`}>
      <svg viewBox="0 0 48 56" aria-hidden="true" focusable="false">
        <CategoryMark category={category} />
      </svg>
    </div>
  )
}
