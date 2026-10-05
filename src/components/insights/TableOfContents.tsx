'use client'

import { useEffect, useState } from 'react'
import type { ArticleHeading } from '@/lib/article-content'

export default function TableOfContents({ headings, lang = 'en' }: { headings: ArticleHeading[]; lang?: 'en' | 'sw' }) {
  const [active, setActive] = useState('')
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(e => e.isIntersecting)
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-15% 0px -65% 0px' })
    headings.filter(h => h.level === 2).forEach(h => {
      const element = document.getElementById(h.id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [headings])

  const sections = headings.filter(h => h.level === 2)
  if (sections.length === 0) return null
  return <nav aria-label={lang === 'sw' ? 'Yaliyomo' : 'Contents'} className="article-contents">
    <p>{lang === 'sw' ? 'Yaliyomo' : 'Contents'}</p>
    <ol>{sections.map(h => <li key={h.id}><a href={`#${h.id}`} aria-current={active === h.id ? 'location' : undefined}>{h.text}</a></li>)}</ol>
  </nav>
}
