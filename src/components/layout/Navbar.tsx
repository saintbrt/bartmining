'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/about',          label: 'About' },
  { href: '/services',       label: 'Services' },
  { href: '/equipment',      label: 'Equipment' },
  { href: '/sustainability',  label: 'Sustainability' },
  { href: '/insights',       label: 'Insights' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  const navText = 'var(--ink)'
  const navTextMuted = 'var(--ink-2)'

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
        background: '#FFFFFF',
        borderBottom: '1px solid var(--line)',
        transition: 'padding .3s var(--ease), background .3s',
      }}
    >
      <div className="px-site" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 'var(--r-sm)', flexShrink: 0,
            background: 'var(--slate)',
            display: 'grid', placeItems: 'center',
          }}>
            <div style={{
              width: 15, height: 15,
              background: 'var(--gold-2)',
              transform: 'rotate(45deg)',
            }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap', color: navText, transition: 'color .4s' }}>
              Bart Mining
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: '16px', fontWeight: 500,
              color: pathname === l.href ? navText : navTextMuted,
              padding: '9px 15px', borderRadius: 'var(--r-sm)',
              background: pathname === l.href ? 'var(--paper)' : 'transparent',
              transition: 'color .4s, background .25s',
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="nav-desktop">
          <Link href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: 15.5, padding: '10px 20px' }}>
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
        maxHeight: open ? 480 : 0,
        transition: 'max-height .35s var(--ease)',
        background: '#FFFFFF',
        borderTop: open ? '1px solid var(--line)' : 'none',
      }}>
        <div className="px-site" style={{ paddingTop: 12, paddingBottom: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: '15px 4px', fontSize: 17, fontWeight: 500, color: 'var(--ink)',
              borderBottom: '1px solid var(--line-2)',
            }}>
              {l.label}
            </Link>
          ))}
          <Link href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ marginTop: 16, justifyContent: 'center' }}>
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
