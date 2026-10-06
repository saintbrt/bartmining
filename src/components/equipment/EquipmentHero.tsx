import Image from 'next/image'
import { equipmentImageAlt, equipmentImageCaption, resolveEquipmentPhoto } from '@/lib/equipment-photos'

/** Same complete-product framing and machine descriptions in both languages. */
export default function EquipmentHero({ slug, name, fallback, language = 'en' }: {
  slug: string
  name: string
  fallback: string
  language?: 'en' | 'sw'
}) {
  const caption = equipmentImageCaption(slug, name, language)

  return (
    <figure className="equipment-hero">
      <div className="equipment-hero-frame">
        <Image src={resolveEquipmentPhoto(slug) ?? fallback} alt={equipmentImageAlt(slug, name, language)}
          fill sizes="(max-width: 1240px) calc(100vw - 64px), 1176px" quality={85} priority
          style={{ objectFit: 'contain', objectPosition: 'center' }} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
