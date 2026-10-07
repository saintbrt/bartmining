import Image from 'next/image'

const COPY = {
  en: {
    alt: 'Six agitated gold-processing tanks connected by pipes, with overhead motors, an access walkway and slurry pumps',
    caption: 'Agitated tanks in a gold-processing circuit. The calculator estimates their working volume; tank dimensions, agitators and the number of stages need a process design based on your test results.',
  },
  sw: {
    alt: 'Matanki sita ya kuchakata dhahabu yenye vichanganyio, mabomba yanayoyaunganisha, mota za juu, njia ya kufikia matanki na pampu za tope',
    caption: 'Matanki yenye vichanganyio kwenye mzunguko wa kuchakata dhahabu. Kikokotoo hukadiria ujazo wa kazi; vipimo vya matanki, vichanganyio na idadi ya hatua vinahitaji usanifu wa mchakato kutokana na matokeo ya majaribio yako.',
  },
}

export default function LeachTankPlantIllustration({ lang = 'en' }: { lang?: 'en' | 'sw' }) {
  return (
    <figure className="equipment-hero leach-tank-illustration" style={{ marginTop: 32 }}>
      <div className="equipment-hero-frame" style={{ width: '100%', maxHeight: 380 }}>
        <Image src="/tools/cil-cip-tank-train.webp" alt={COPY[lang].alt}
          fill sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1240px) calc(100vw - 64px), 1176px"
          quality={85} priority style={{ objectFit: 'contain' }} />
      </div>
      <figcaption>{COPY[lang].caption}</figcaption>
    </figure>
  )
}
