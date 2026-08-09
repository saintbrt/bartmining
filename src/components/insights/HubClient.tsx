'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArticleMeta } from '@/data/insights'

const FILTERS = [
  { label: 'All articles', value: 'all' },
  { label: 'Exploration', value: 'exploration' },
  { label: 'Drilling', value: 'drilling' },
  { label: 'Geophysics', value: 'geophysics' },
  { label: 'East Africa', value: 'east-africa' },
  { label: 'Southern Africa', value: 'southern-africa' },
  { label: 'Environmental', value: 'environment' },
  { label: 'Consulting', value: 'consulting' },
]

export default function HubClient({ articles }: { articles: ArticleMeta[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const visible = articles.filter(a => {
    const matchFilter = filter === 'all' || a.tags.includes(filter)
    const q = search.toLowerCase().trim()
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.tags.some(t => t.includes(q))
    return matchFilter && matchSearch
  })

  return (
    <>
      {/* Search */}
      <div style={{ background: 'var(--paper)', padding: '120px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'none', pointerEvents: 'none' }} />
        <div className="px-site" style={{ position: 'relative', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 16 }}>KNOWLEDGE CENTER</p>
          <h1 style={{ color: 'var(--ink)', fontSize: 'clamp(32px,4.5vw,54px)', marginBottom: 16 }}>Mining Expertise<br />Across Africa</h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 17, maxWidth: 560, margin: '0 auto 36px' }}>
            In-depth guides on exploration services, drilling, geophysics, environmental compliance and mineral markets, written by field geologists with decades of experience.
          </p>
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles, regions, minerals…"
              style={{
                width: '100%', padding: '14px 20px 14px 48px',
                borderRadius: 'var(--r-sm)', border: '1px solid var(--line)',
                background: 'var(--bg)', color: 'var(--ink)',
                fontSize: 15, outline: 'none',
                fontFamily: 'var(--font-manrope)',
                boxShadow: 'var(--shadow-sm)',
              }}
            />
            <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)', fontSize: 18 }}>&#8981;</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-site" style={{ paddingTop: 32, paddingBottom: 8 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '.08em',
                padding: '7px 16px', borderRadius: 'var(--r-sm)', cursor: 'pointer', transition: '.2s',
                background: filter === f.value ? 'var(--gold)' : 'transparent',
                color: filter === f.value ? '#fff' : 'var(--ink-2)',
                border: `1px solid ${filter === f.value ? 'var(--gold)' : 'var(--line)'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-site" style={{ paddingTop: 32, paddingBottom: 80 }}>
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-3)' }}>
            No articles match your search. <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>Ask our team directly &rarr;</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="hub-grid-responsive">
            {visible.map(a => (
              <Link key={a.slug} href={`/insights/${a.slug}`} style={{
                display: 'flex', flexDirection: 'column',
                borderRadius: 'var(--r-lg)', overflow: 'hidden',
                border: '1px solid var(--line)', background: 'var(--bg-3)',
                textDecoration: 'none',
                transition: 'border-color .2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink-3)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)' }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <Image src={a.image} alt={a.imageAlt} fill style={{ objectFit: 'cover' }} sizes="(max-width: 860px) 100vw, 33vw" />
                </div>
                <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 10 }}>{a.category}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, color: 'var(--ink)', marginBottom: 10, flex: 1 }}>{a.title}</h3>
                  <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 14 }}>{a.description}</p>
                  <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
                    <span>{a.date}</span><span>·</span><span>{a.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .hub-grid-responsive { grid-template-columns: repeat(3,1fr) !important; }
        @media (max-width: 860px) { .hub-grid-responsive { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .hub-grid-responsive { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
