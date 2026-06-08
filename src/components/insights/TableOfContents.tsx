'use client'

import { useEffect, useState } from 'react'

interface Heading { id: string; text: string; level: number }

export default function TableOfContents({ html }: { html: string }) {
  const [active, setActive] = useState('')

  const headings: Heading[] = []
  const re = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    headings.push({ level: parseInt(m[1]), id: m[2], text: m[3].replace(/<[^>]+>/g, '') })
  }

  // Also extract headings without ids using text slugification
  const re2 = /<h([23])[^>]*>(.*?)<\/h[23]>/gi
  const withoutId: Heading[] = []
  while ((m = re2.exec(html)) !== null) {
    if (!m[0].includes('id="')) {
      const text = m[2].replace(/<[^>]+>/g, '')
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      withoutId.push({ level: parseInt(m[1]), id, text })
    }
  }

  const allHeadings = headings.length > 0 ? headings : withoutId

  useEffect(() => {
    if (allHeadings.length === 0) return
    const els = allHeadings.map(h => document.getElementById(h.id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  if (allHeadings.length === 0) return null

  return (
    <nav>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>Contents</div>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {allHeadings.map(h => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? 12 : 0 }}>
            <a
              href={`#${h.id}`}
              style={{
                fontSize: 13, color: active === h.id ? 'var(--gold-deep)' : 'var(--ink-2)',
                textDecoration: 'none', display: 'block', padding: '4px 0',
                borderLeft: `2px solid ${active === h.id ? 'var(--gold)' : 'transparent'}`,
                paddingLeft: h.level === 3 ? 10 : 8,
                transition: 'color .15s',
                lineHeight: 1.4,
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
