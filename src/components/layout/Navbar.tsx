'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/about',          label: 'About' },
  { href: '/services',       label: 'Services' },
  { href: '/products',       label: 'Products' },
  { href: '/sustainability',  label: 'Sustainability' },
  { href: '/insights',       label: 'Insights' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  // Pages whose top hero is dark — navbar text needs to be white until scrolled
  const darkHero = !scrolled && (pathname === '/' || pathname === '/insights')
  const navText = darkHero ? '#fff' : 'var(--ink)'
  const navTextMuted = darkHero ? 'rgba(255,255,255,.72)' : 'var(--ink-2)'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '13px 0' : '22px 0',
        background: scrolled ? 'rgba(246,244,239,.72)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px) saturate(1.4)' : undefined,
        WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(1.4)' : undefined,
        borderBottom: scrolled ? '1px solid var(--line-2)' : '1px solid transparent',
        boxShadow: scrolled ? '0 8px 30px -20px rgba(27,24,19,.4)' : undefined,
        transition: 'padding .4s var(--ease), background .4s, box-shadow .4s, border-color .4s',
      }}
    >
      <div className="px-site" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: 'linear-gradient(145deg, var(--slate), #161b1e)',
            display: 'grid', placeItems: 'center',
            boxShadow: 'var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,.06)',
          }}>
            <div style={{
              width: 15, height: 15,
              background: 'linear-gradient(145deg, var(--gold-hi), var(--gold))',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 16px var(--glow-gold)',
            }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap', color: navText, transition: 'color .4s' }}>
              Bart Mining
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '0.24em', color: navTextMuted, textTransform: 'uppercase', transition: 'color .4s' }}>
              Consultancy
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: '14.5px', fontWeight: 500,
              color: pathname === l.href ? navText : navTextMuted,
              padding: '9px 15px', borderRadius: 100,
              background: pathname === l.href
                ? (darkHero ? 'rgba(255,255,255,.12)' : 'rgba(27,24,19,.06)')
                : 'transparent',
              transition: 'color .4s, background .25s',
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="nav-desktop">
          <Link href="/contact" className="btn btn-gold" style={{ fontSize: 14, padding: '10px 20px' }}>
            Get in touch
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-toggle"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8,
          }}
        >
          <span style={{ display: 'block', width: 22, height: 2, background: navText, margin: '4px 0', borderRadius: 2, transition: 'background .4s, transform .3s', transform: open ? 'rotate(45deg) translate(4px,4px)' : undefined }} />
          <span style={{ display: 'block', width: 22, height: 2, background: navText, margin: '4px 0', borderRadius: 2, transition: 'background .4s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: 22, height: 2, background: navText, margin: '4px 0', borderRadius: 2, transition: 'background .4s, transform .3s', transform: open ? 'rotate(-45deg) translate(4px,-4px)' : undefined }} />
        </button>
      </div>

      {/* Mobile menu */}
      <div ref={menuRef} style={{
        overflow: 'hidden',
        maxHeight: open ? 400 : 0,
        transition: 'max-height .35s var(--ease)',
        background: 'rgba(246,244,239,.97)',
        backdropFilter: 'blur(18px)',
      }}>
        <div className="px-site" style={{ paddingTop: 12, paddingBottom: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: '11px 4px', fontSize: 16, fontWeight: 500, color: 'var(--ink-2)',
              borderBottom: '1px solid var(--line-2)',
            }}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-gold" style={{ marginTop: 16, justifyContent: 'center' }}>
            Get in touch
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .nav-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
