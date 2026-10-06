import Image from 'next/image'
import { equipmentImageAlt, equipmentImageKind, resolveEquipmentPhoto } from '@/lib/equipment-photos'

/** Same complete-product framing and image disclosure in both languages. */
export default function EquipmentHero({ slug, name, fallback, language = 'en' }: {
  slug: string
  name: string
  fallback: string
  language?: 'en' | 'sw'
}) {
  const illustration = equipmentImageKind(slug) === 'illustration'
  const caption = language === 'sw'
    ? illustration
      ? 'Mchoro wa mfano uliotengenezwa kwa AI; hauonyeshi modeli maalumu au mtambo wa mteja. Thibitisha kifaa kinachotolewa kwenye ofa.'
      : 'Picha ya rejea ya katalogi. Thibitisha modeli na mpangilio wa kifaa kinachotolewa kwenye ofa.'
    : illustration
      ? 'AI-generated equipment-class illustration; it does not show an exact supplied model or customer installation. Confirm the offered equipment in your quotation.'
      : 'Catalogue reference image. Confirm the offered model and configuration in your quotation.'

  return (
    <figure className="equipment-hero" data-image-kind={illustration ? 'illustration' : 'reference'}>
      <div className="equipment-hero-frame">
        <Image src={resolveEquipmentPhoto(slug) ?? fallback} alt={equipmentImageAlt(slug, name, language)}
          fill sizes="(max-width: 1240px) calc(100vw - 64px), 1176px" quality={85} priority
          style={{ objectFit: 'contain', objectPosition: 'center' }} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
