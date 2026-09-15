import Link from 'next/link'
import { LOCATIONS } from '@/data/locations'

const SW_LINKS = [
  { href: '/vifaa-vya-uchimbaji', label: 'Vifaa vya uchimbaji' },
  { href: '/bei-ya-vifaa-vya-uchimbaji', label: 'Bei ya vifaa' },
  { href: '/bei-ya-dhahabu-leo', label: 'Bei ya dhahabu leo' },
  { href: '/jinsi-ya-kupata-leseni-ya-pml', label: 'Leseni ya PML' },
  { href: '/gharama-ya-plant-ya-dhahabu', label: 'Gharama ya plant' },
  { href: '/mrabaha-na-kodi-za-dhahabu', label: 'Mrabaha na kodi' },
]

const COVERAGE = ['Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'DRC', 'Zambia', 'Zimbabwe', 'Mozambique', 'South Africa', 'Namibia', 'Botswana', 'Ethiopia']

const headStyle = { fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.62)', marginBottom: 18 } as const
const linkStyle = { display: 'block', fontSize: 15, color: 'rgba(255,255,255,.75)', marginBottom: 9, transition: 'color .2s' } as const

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: 'var(--slate)', color: 'rgba(255,255,255,.75)', paddingTop: 72, paddingBottom: 40 }}>
      <div className="px-site">
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 40, paddingBottom: 56, borderBottom: '1px solid rgba(255,255,255,.14)' }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--slate-2)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 13, height: 13, background: 'var(--gold-2)', transform: 'rotate(45deg)' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>Bart Mining</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.62)' }}>Consultancy</div>
              </div>
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'rgba(255,255,255,.70)', maxWidth: 240 }}>
              Principal-led mining consultancy and equipment supply across East &amp; Southern Africa.
            </p>
            <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 18, fontSize: 15, color: 'var(--gold-2)', fontWeight: 600 }}>
              +255 759 141 705
            </a>
          </div>

          {/* Pages */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.62)', marginBottom: 18 }}>Pages</div>
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/services', label: 'Services' },
              { href: '/equipment', label: 'Equipment' },
              { href: '/sustainability', label: 'Sustainability' },
              { href: '/insights', label: 'Insights' },
              { href: '/contact', label: 'Contact' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: 15.5, color: 'rgba(255,255,255,.75)', marginBottom: 10, transition: 'color .2s' }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Equipment supply by town. Every name links to a real district
              page; plain city lists read as a keyword block. */}
          <div>
            <div style={headStyle}>Equipment supply, Tanzania</div>
            <div style={{ columnCount: 2, columnGap: 16 }}>
              {LOCATIONS.map(l => (
                <Link key={l.slug} href={`/equipment/supply/${l.slug}`} style={linkStyle}>
                  {l.city}
                </Link>
              ))}
            </div>
          </div>

          {/* Kiswahili */}
          <div lang="sw">
            <div style={headStyle}>Kwa Kiswahili</div>
            {SW_LINKS.map(l => (
              <Link key={l.href} href={l.href} hrefLang="sw" style={linkStyle}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.62)', display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <span>&copy; {year} Bart Mining Consultancy Ltd. All rights reserved.</span>
            <Link href="/privacy" style={{ color: 'rgba(255,255,255,.75)' }}>Privacy</Link>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,.75)' }}>Terms</Link>
          </div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.62)' }}>
            Working across {COVERAGE.join(' · ')}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
