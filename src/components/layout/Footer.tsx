import Link from 'next/link'
import { EAST_AFRICA, SOUTHERN_AFRICA } from '@/data/regions'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: 'var(--slate)', color: 'rgba(255,255,255,.75)', paddingTop: 72, paddingBottom: 40 }}>
      <div className="px-site">
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 40, paddingBottom: 56, borderBottom: '1px solid rgba(255,255,255,.07)' }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(145deg,#2c353b,#161b1e)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 13, height: 13, background: 'linear-gradient(145deg,var(--gold-hi),var(--gold))', transform: 'rotate(45deg)', boxShadow: '0 0 10px var(--glow-gold)' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>Bart Mining</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)' }}>Consultancy</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,.5)', maxWidth: 240 }}>
              Principal-led mining consultancy and equipment supply across East &amp; Southern Africa.
            </p>
            <a href="mailto:hello@bartmining.com" style={{ display: 'inline-block', marginTop: 18, fontSize: 13.5, color: 'var(--gold-2)', fontWeight: 600 }}>
              hello@bartmining.com
            </a>
          </div>

          {/* Pages */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 18 }}>Pages</div>
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/services', label: 'Services' },
              { href: '/products', label: 'Products' },
              { href: '/sustainability', label: 'Sustainability' },
              { href: '/insights', label: 'Insights' },
              { href: '/contact', label: 'Contact' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,.6)', marginBottom: 10, transition: 'color .2s' }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* East Africa */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 18 }}>East Africa</div>
            {EAST_AFRICA.map(r => (
              <div key={r.c} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.55)', marginBottom: 2 }}>{r.c}</div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.3)', lineHeight: 1.7 }}>{r.cities.join(' · ')}</div>
              </div>
            ))}
          </div>

          {/* Southern Africa */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 18 }}>Southern Africa</div>
            {SOUTHERN_AFRICA.slice(0, 8).map(r => (
              <div key={r.c} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.55)', marginBottom: 2 }}>{r.c}</div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.3)', lineHeight: 1.7 }}>{r.cities.join(' · ')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.3)' }}>
            &copy; {year} Bart Mining Consultancy Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms'].map(l => (
              <span key={l} style={{ fontSize: 12.5, color: 'rgba(255,255,255,.3)' }}>{l}</span>
            ))}
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
