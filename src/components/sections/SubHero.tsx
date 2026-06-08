import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

interface MetaItem { num: string; lbl: string }

interface Props {
  crumb: string
  heading: React.ReactNode
  lead: string
  meta?: MetaItem[]
}

export default function SubHero({ crumb, heading, lead, meta }: Props) {
  return (
    <section className="subhero">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="px-site">
        <Reveal>
          <div className="crumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>{crumb}</span>
          </div>
        </Reveal>
        <Reveal delay={1}><h1>{heading}</h1></Reveal>
        <Reveal delay={2}><p className="lead">{lead}</p></Reveal>
        {meta && (
          <Reveal delay={3}>
            <div className="subhero-meta">
              {meta.map((m, i) => (
                <>
                  {i > 0 && <div key={`div-${i}`} className="div" />}
                  <div key={m.num}>
                    <div className="num">{m.num}</div>
                    <div className="lbl">{m.lbl}</div>
                  </div>
                </>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
