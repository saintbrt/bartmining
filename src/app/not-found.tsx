import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <section
        style={{
          minHeight: '82vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          background: 'var(--bg)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 560 }}>

          <div style={{
            width: 48, height: 3,
            background: 'linear-gradient(90deg, var(--gold), var(--gold-2))',
            borderRadius: 2, margin: '0 auto 32px',
          }} />

          <div style={{
            fontFamily: 'var(--font-sora), system-ui, sans-serif',
            fontSize: 'clamp(80px, 16vw, 140px)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-2) 60%, var(--gold-hi) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 24,
          }}>
            404
          </div>

          <h1 style={{
            fontFamily: 'var(--font-sora), system-ui, sans-serif',
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 700,
            color: 'var(--ink)',
            letterSpacing: '-0.035em',
            marginBottom: 16,
          }}>
            Page not found
          </h1>

          <p style={{
            fontSize: 16, color: 'var(--ink-3)',
            lineHeight: 1.7, marginBottom: 40,
          }}>
            The page you are looking for may have moved, been renamed, or no longer exists.
            Use the links below to find what you need.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn-gold">Back to home</Link>
            <Link href="/contact" className="btn btn-ghost">Contact us</Link>
          </div>

          <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--line)' }}>
            <p style={{ fontSize: 12, color: 'var(--ink-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 20 }}>
              Quick links
            </p>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Services', href: '/services' },
                { label: 'Products', href: '/products' },
                { label: 'About', href: '/about' },
                { label: 'Insights', href: '/insights' },
                { label: 'Sustainability', href: '/sustainability' },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="nf-link">{label}</Link>
              ))}
            </div>
          </div>

        </div>
      </section>
      <style>{`
        .nf-link { font-size: 14px; color: var(--ink-3); font-weight: 500; transition: color .15s; }
        .nf-link:hover { color: var(--gold); }
      `}</style>
    </>
  )
}
