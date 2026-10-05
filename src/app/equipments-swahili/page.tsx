import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import RegionsSection from '@/components/sections/RegionsSection'
import CtaSection from '@/components/sections/CtaSection'
import EquipmentThumb from '@/components/equipment/EquipmentThumb'
import { EQUIPMENT, equipmentByCategory } from '@/data/equipment-catalogue-sw'
import { LOCATIONS_SW } from '@/data/locations-sw'
import { SITE, SERVICE_AREAS, itemListSchema, breadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'

/** Kiswahili copy of the English directory, preserving its catalogue format. */

export const metadata: Metadata = {
  title: 'Vifaa vya uchimbaji Tanzania: vipimo na matumizi',
  description:
    'Vifaa vya uchimbaji na ujenzi Tanzania: mitambo ya kuchimba, crushers, vinu, matanki, pampu na vifaa vya usalama, pamoja na vipimo na matumizi.',
  alternates: {
    canonical: `${SITE.url}/equipments-swahili`,
    languages: { en: `${SITE.url}/equipment`, 'sw-TZ': `${SITE.url}/equipments-swahili`, 'x-default': `${SITE.url}/equipment` },
  },
  openGraph: {
    locale: 'sw_TZ',
    title: 'Vifaa vya uchimbaji Tanzania: vipimo na matumizi',
    description: `Maelezo, vipimo, matumizi na matengenezo ya vifaa ${EQUIPMENT.length} vya uchimbaji vinavyosambazwa Tanzania.`,
    url: `${SITE.url}/equipments-swahili`,
  },
}

export default function EquipmentHub() {
  const groups = equipmentByCategory()

  return (
    <div lang="sw">
      <JsonLd
        data={[
          itemListSchema(EQUIPMENT.map(e => ({ name: e.name, path: `/equipments-swahili/${e.slug}` }))),
          breadcrumbSchema([
            { name: 'Mwanzo', path: '/' },
            { name: 'Kurasa kwa Kiswahili', path: '/insights-swahili' },
            { name: 'Vifaa vya uchimbaji', path: '/equipments-swahili' },
          ]),
        ]}
      />

      <section className="subhero" style={{ paddingBottom: 32 }}>
        <div className="px-site">
          <Reveal>
            <nav className="crumb" aria-label="Njia ya ukurasa">
              <Link href="/">Mwanzo</Link><span className="sep">/</span><Link href="/insights-swahili">Kurasa kwa Kiswahili</Link><span className="sep">/</span><span>Vifaa vya uchimbaji</span>
            </nav>
          </Reveal>
          <Reveal delay={1}><h1 style={{ marginTop: 14 }}>Mitambo na vifaa vya uchimbaji, uchakataji na usalama</h1></Reveal>
          <Reveal delay={2}>
            <p className="lead">
              Katalogi hii ina mitambo ya kuchimba na kusafirisha mawe, vifaa vya
              kuchakata dhahabu, pampu, taa na vifaa vya usalama. Bart Mining husaidia
              kuchagua, kununua, kusafirisha na kusimika vifaa kulingana na mahitaji ya
              mradi wako. Fungua kifaa unachotafuta ili kuelewa matumizi, vipimo na
              matengenezo yake kabla ya kuandaa maombi ya bei.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="subhero-meta">
              <div><div className="num">Uchaguzi</div><div className="lbl">Kulingana na mahitaji ya mradi</div></div>
              <div className="div" />
              <div><div className="num">Usambazaji</div><div className="lbl">Ununuzi na usafirishaji</div></div>
              <div className="div" />
              <div><div className="num">Kuanza kazi</div><div className="lbl">Ufungaji, majaribio na kukabidhi</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Kwa nini uchague vifaa kupitia Bart Mining. Carried over from the former /products page. */}
      <section className="sec-gap-sm">
        <div className="px-site">
          <div className="split2">
            <Reveal>
              <div className="about-img">
                <Image
                  src="https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Picha ya kumbukumbu ya vifaa vya kuchakata madini"
                  fill style={{ objectFit: 'cover' }} sizes="(max-width: 860px) 100vw, 50vw"
                />
              </div>
            </Reveal>
            <Reveal delay={1}>
              <span className="eyebrow">Kwa nini uchague vifaa kupitia Bart Mining</span>
              <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', marginTop: 16 }}>
                Chagua mtambo unaofaa madini na hali ya eneo lako
              </h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 17, marginTop: 18, lineHeight: 1.7 }}>
                Uwezo unaotajwa kwenye katalogi pekee hauonyeshi jinsi mashine itakavyofanya
                kazi kwenye eneo lako. Uchaguzi unahitaji kuangalia majaribio ya madini,
                kiasi cha kuchakata, umeme, maji na njia ya kufikisha vifaa. Tunasaidia
                kupanga vipimo na ununuzi, kisha ufungaji na majaribio kulingana na
                wigo wa mradi uliokubaliwa, ili timu yako ijue namna ya kuanza kazi.
              </p>
              <div className="src-grid">
                {[
                  { n: '01', t: 'Vipimo na uwezo', b: 'Hupangwa kwa madini, kiasi cha kuchakata na matokeo yanayolengwa.' },
                  { n: '02', t: 'Ufungaji na majaribio', b: 'Vifaa huunganishwa, kupimwa na kukabidhiwa kwa waendeshaji kwa wigo uliokubaliwa.' },
                ].map(v => (
                  <div key={v.n} className="src-card">
                    <div className="src-n">{v.n}</div>
                    <h3>{v.t}</h3>
                    <p>{v.b}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <div className="px-site" style={{ paddingBottom: 72 }}>
        {groups.map((group, gi) => (
          <section key={group.category} style={{ marginTop: gi === 0 ? 8 : 56 }}>
            <div className="eq-grouphead">
              <h2>{group.label}</h2>
              <span>{group.items.length} vifaa</span>
            </div>
            <div className="eq-grid">
              {group.items.map((item, i) => (
                <Link key={item.slug} href={`/equipments-swahili/${item.slug}`} className="eq-card">
                  <EquipmentThumb
                    slug={item.slug}
                    language="sw"
                    alt={item.name}
                    category={item.category}
                    sizes="(max-width: 640px) 50vw, (max-width: 1080px) 33vw, 25vw"
                    priority={gi === 0 && i < 2}
                  />
                  <div className="eq-cardbody">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="eq-more">Tazama vipimo &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section style={{ marginTop: 56 }}>
          <div className="eq-grouphead"><h2>Usambazaji kwa maeneo</h2></div>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 680, marginBottom: 18, lineHeight: 1.7 }}>
            Soma kuhusu njia za kufikisha vifaa, hali ya miamba na mahitaji
            yanayojitokeza katika maeneo mbalimbali ya uchimbaji wa dhahabu.
          </p>
          <div className="dist-row">
            {LOCATIONS_SW.map(l => (
              <Link key={l.slug} href={`/insights-swahili/vifaa-vya-uchimbaji/${l.slug}`} className="dist-card">
                <span className="dist-region">{l.region}</span>
                <span className="dist-city">{l.town}</span>
                <span className="eq-more">Maelezo ya usambazaji &rarr;</span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 56 }}>
          <div className="eq-grouphead"><h2>Maeneo tunayohudumia</h2></div>
          <p style={{ color: 'var(--ink-2)', fontSize: 16, maxWidth: 680, marginBottom: 18, lineHeight: 1.7 }}>
            Tunapanga kufikisha vifaa kutoka Dar es Salaam kwenda maeneo mbalimbali
            nchini, yakiwemo maeneo ya uchimbaji wa dhahabu katika Kanda ya Ziwa.
            Njia, muda na gharama hutegemea ukubwa wa mzigo na hali ya eneo.
          </p>
          <div className="region-chips">
            {SERVICE_AREAS.map(r => <span key={r} className="region-chip">{r}</span>)}
          </div>
          <p style={{ marginTop: 22, fontSize: 16, color: 'var(--ink-2)' }} lang="en">
            Prefer English?{' '}
            <Link href="/equipment" style={{ color: 'var(--gold)', fontWeight: 600 }}>
              View the equipment catalogue in English
            </Link>
          </p>
        </section>
      </div>

      <RegionsSection language="sw" />

      <CtaSection
        eyebrow="Panga vifaa vya mradi"
        heading={<>Tuambie kuhusu <span className="grad">madini na uwezo unaohitaji</span></>}
        body="Tuma eneo la mradi, aina ya madini au kazi, kiasi kinacholengwa na umeme na maji yaliyopo. Tutasaidia kupanga vifaa na wigo wa makadirio ya bei."
        primaryLabel="Omba bei"
        primaryHref="https://wa.me/255759141705"
        secondaryLabel="Wasiliana nasi"
        secondaryHref="/contact"
      />

      <style>{`
        .eq-grouphead { display: flex; align-items: baseline; justify-content: space-between;
          gap: 16px; padding-bottom: 14px; margin-bottom: 22px; border-bottom: 1px solid var(--line); }
        .eq-grouphead h2 { font-size: clamp(19px,2vw,24px); }
        .eq-grouphead span { font-family: var(--font-mono); font-size: 12px; letter-spacing: .1em;
          text-transform: uppercase; color: var(--ink-3); flex-shrink: 0; }

        .eq-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .eq-card { display: flex; flex-direction: column; border: 1px solid var(--line);
          border-radius: var(--r-lg); overflow: hidden; background: var(--bg-3);
          transition: border-color .2s; }
        .eq-card:hover { border-color: var(--ink-3); }
        .eq-card:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .eq-cardbody { padding: 16px 16px 18px; display: flex; flex-direction: column; flex: 1; }
        .eq-card h3 { font-size: 16.5px; margin-bottom: 7px; color: var(--ink); line-height: 1.3; }
        .eq-card p { font-size: 15px; color: var(--ink-2); line-height: 1.55; margin-bottom: 14px; flex: 1; }
        .eq-more { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em;
          text-transform: uppercase; color: var(--gold); }

        /* Thumbnail slot. Fixed ratio so the grid stays even whether a real
           photo has been uploaded or the drawn placeholder is showing. */
        .eq-thumb { position: relative; aspect-ratio: 4 / 3; width: 100%;
          border-bottom: 1px solid var(--line); background: var(--paper); }

        /* Empty state. The faint hatch is what does the work here: category
           marks repeat across a row, and without it four identical icons
           read as a rendering fault rather than as slots awaiting a photo. */
        .eq-thumb-empty { display: grid; place-items: center;
          background-image: repeating-linear-gradient(
            45deg, transparent 0 7px, rgba(94,104,109,.055) 7px 8px); }
        .eq-thumb-empty svg { width: 42%; max-width: 84px; height: auto;
          color: var(--ink-3); opacity: .45; }

        .src-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; }
        .src-card { background: var(--bg-3); border: 1px solid var(--line);
          border-radius: var(--r-md); padding: 20px 18px; }
        .src-n { font-family: var(--font-mono); font-size: 13px; color: var(--gold); margin-bottom: 8px; }
        .src-card h3 { font-size: 16px; margin-bottom: 6px; }
        .src-card p { color: var(--ink-2); font-size: 15px; line-height: 1.6; }

        .dist-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .dist-card { display: flex; flex-direction: column; gap: 6px; border: 1px solid var(--line);
          border-radius: var(--r-lg); padding: 20px 18px; background: var(--bg-3); transition: border-color .2s; }
        .dist-card:hover { border-color: var(--ink-3); }
        .dist-region { font-family: var(--font-mono); font-size: 12px; letter-spacing: .08em;
          text-transform: uppercase; color: var(--gold); }
        .dist-city { font-size: 19px; font-weight: 700; color: var(--ink); font-family: var(--font-sora); }
        @media (max-width: 700px) { .dist-row { grid-template-columns: 1fr; } }

        .region-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .region-chip { font-family: var(--font-mono); font-size: 12px; letter-spacing: .06em;
          padding: 5px 12px; border-radius: var(--r-sm); background: var(--bg-3);
          border: 1px solid var(--line); color: var(--ink-2); }

        @media (max-width: 1080px) { .eq-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 860px)  { .eq-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  {
          .eq-grid { gap: 14px; }
          .src-grid { grid-template-columns: 1fr; }
          .eq-card h3 { font-size: 16px; }
          .eq-card p { font-size: 14.5px; }
        }
      `}</style>
    </div>
  )
}
