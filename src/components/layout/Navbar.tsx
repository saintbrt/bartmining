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

/** Kiswahili commercial pages: the least competitive, highest-intent inventory. */
const SW_LINKS = [
  { href: '/vifaa-vya-uchimbaji',           label: 'Vifaa vya uchimbaji' },
  { href: '/bei-ya-vifaa-vya-uchimbaji',    label: 'Bei ya vifaa' },
  { href: '/bei-ya-dhahabu-leo',            label: 'Bei ya dhahabu leo' },
  { href: '/jinsi-ya-kupata-leseni-ya-pml', label: 'Leseni ya PML' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [swOpen, setSwOpen] = useState(false)
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

  useEffect(() => { setOpen(false); setSwOpen(false) }, [pathname])

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
          {/* Kiswahili menu. The links are always in the HTML (hidden until
              opened) so crawlers see them without running the toggle. */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setSwOpen(true)}
            onMouseLeave={() => setSwOpen(false)}
          >
            <button
              type="button"
              onClick={() => setSwOpen(o => !o)}
              aria-expanded={swOpen}
              aria-controls="nav-sw-menu"
              style={{
                fontSize: '16px', fontWeight: 500, color: navTextMuted,
                padding: '9px 15px', borderRadius: 'var(--r-sm)',
                background: swOpen ? 'var(--paper)' : 'transparent',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              Kiswahili
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{ width: 14, height: 14, transform: swOpen ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }}><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div
              id="nav-sw-menu"
              lang="sw"
              style={{
                position: 'absolute', top: '100%', left: 0, minWidth: 230,
                paddingTop: 8,
                visibility: swOpen ? 'visible' : 'hidden',
                opacity: swOpen ? 1 : 0,
                transition: 'opacity .2s, visibility .2s',
              }}
            >
              <div style={{ background: '#FFFFFF', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', padding: 6, boxShadow: '0 12px 32px rgba(0,0,0,.08)' }}>
                {SW_LINKS.map(l => (
                  <Link key={l.href} href={l.href} hrefLang="sw" style={{
                    display: 'block', fontSize: 15.5, padding: '10px 12px', borderRadius: 'var(--r-sm)',
                    color: pathname === l.href ? navText : navTextMuted,
                    background: pathname === l.href ? 'var(--paper)' : 'transparent',
                  }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
        maxHeight: open ? 800 : 0,
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginTop: 16, padding: '0 4px' }}>
            Kiswahili
          </div>
          <div lang="sw" style={{ display: 'flex', flexDirection: 'column' }}>
            {SW_LINKS.map(l => (
              <Link key={l.href} href={l.href} hrefLang="sw" style={{
                padding: '13px 4px', fontSize: 16, fontWeight: 500, color: 'var(--ink-2)',
                borderBottom: '1px solid var(--line-2)',
              }}>
                {l.label}
              </Link>
            ))}
          </div>
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
