'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { articleDateLabel } from '@/lib/article-dates'
import type { LibraryArticle } from '@/data/article-library'

export type HubEntry = Pick<LibraryArticle, 'language' | 'path' | 'title' | 'description' | 'tags' | 'category' | 'image' | 'imageAlt'> &
  Partial<Pick<LibraryArticle, 'date' | 'updated' | 'updatedDate' | 'readTime'>>

const FILTERS = [
  { label: 'All articles', value: 'all' },
  { label: 'Gold processing', value: 'processing' },
  { label: 'Equipment & costs', value: 'cost' },
  { label: 'Licences & compliance', value: 'compliance' },
  { label: 'Gold sales', value: 'trading' },
  { label: 'Exploration', value: 'exploration' },
  { label: 'Drilling', value: 'drilling' },
  { label: 'Geophysics', value: 'geophysics' },
  { label: 'East Africa', value: 'east-africa' },
  { label: 'Southern Africa', value: 'southern-africa' },
  { label: 'Environmental', value: 'environment' },
  { label: 'Consulting', value: 'consulting' },
]

export default function HubClient({ articles, language = 'en', directory = false }: { articles: HubEntry[]; language?: 'en' | 'sw'; directory?: boolean }) {
  const sw = language === 'sw'
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const filters = sw && directory ? [
    ...FILTERS.slice(0, 5),
    { label: 'Maeneo ya uchimbaji', value: 'locations' },
    { label: 'Huduma', value: 'services' },
    { label: 'Katalogi ya vifaa', value: 'catalogue' },
  ] : FILTERS

  const visible = articles.filter(a => {
    const matchFilter = filter === 'all' || a.tags.includes(filter)
    const q = search.toLowerCase().trim()
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.tags.some(t => t.includes(q))
    return matchFilter && matchSearch
  })

  return (
    <div lang={language}>
      {/* Search */}
      <div style={{ background: 'var(--paper)', padding: '120px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'none', pointerEvents: 'none' }} />
        <div className="px-site" style={{ position: 'relative', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 16 }}>{sw ? 'MAARIFA YA UCHIMBAJI' : 'KNOWLEDGE CENTER'}</p>
          <h1 style={{ color: 'var(--ink)', fontSize: 'clamp(32px,4.5vw,54px)', marginBottom: 16 }}>{sw ? directory ? 'Maarifa na huduma kwa Kiswahili' : 'Makala za uchimbaji' : 'Mining guides'}</h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 17, maxWidth: 560, margin: '0 auto 36px' }}>
            {sw ? directory ? 'Anza hapa kupata miongozo ya gharama, leseni na mauzo, maelezo ya masoko na usambazaji kwa maeneo, bei ya dhahabu na huduma za jenereta. Unaweza pia kufungua katalogi kamili ya vifaa kwa Kiswahili.' : 'Maelezo ya uchakataji wa dhahabu, vifaa, gharama, leseni na mauzo. Soma mifano na hatua zinazokusaidia kupanga mradi wako na kufanya maamuzi yenye msingi.' : 'Practical explanations of gold processing, equipment, costs, exploration and mining requirements, with examples that help you plan your next decision.'}
          </p>
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <input
              type="search"
              aria-label={sw ? directory ? 'Tafuta kurasa kwa Kiswahili' : 'Tafuta makala' : 'Search articles'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={sw ? directory ? 'Tafuta mwongozo, eneo au huduma…' : 'Tafuta makala, vifaa au gharama…' : 'Search articles, regions, minerals…'}
              style={{
                width: '100%', padding: '14px 20px 14px 48px',
                borderRadius: 'var(--r-sm)', border: '1px solid var(--line)',
                background: 'var(--bg)', color: 'var(--ink)',
                fontSize: 15,
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
          {filters.filter(f => !sw || f.value === 'all' || articles.some(a => a.tags.includes(f.value))).map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '.08em',
                padding: '7px 16px', borderRadius: 'var(--r-sm)', cursor: 'pointer', transition: '.2s',
                background: filter === f.value ? 'var(--gold)' : 'transparent',
                color: filter === f.value ? '#fff' : 'var(--ink-2)',
                border: `1px solid ${filter === f.value ? 'var(--gold)' : 'var(--line)'}`,
              }}
            >
              {sw ? ({ all: directory ? 'Kurasa zote' : 'Makala zote', processing: 'Uchakataji wa dhahabu', cost: 'Vifaa na gharama', compliance: 'Leseni na masharti', trading: 'Mauzo ya dhahabu' } as Record<string, string>)[f.value] ?? f.label : f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-site" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <p role="status" aria-live="polite" style={{ marginBottom: 24, fontSize: 14, color: 'var(--ink-3)' }}>{visible.length} {sw ? directory ? 'kurasa' : 'makala' : 'articles'}{sw ? ' kwa Kiswahili' : ''}</p>
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-3)' }}>
            {sw ? directory ? 'Hakuna ukurasa unaolingana na utafutaji huu.' : 'Hakuna makala inayolingana na utafutaji huu.' : 'No articles match your search.'} <button onClick={() => { setSearch(''); setFilter('all') }} className="hub-reset">{sw ? directory ? 'Onyesha kurasa zote' : 'Onyesha makala zote' : 'Show all articles'}</button> <a href="https://wa.me/255759141705" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>{sw ? 'Wasiliana na timu yetu' : 'Ask our team directly'} &rarr;</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="hub-grid-responsive">
            {visible.map(a => (
              <Link key={a.path} href={a.path} lang={a.language} data-article-language={a.language} style={{
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
                  <span className="hub-language-label">{a.language === 'sw' ? 'Kiswahili' : 'English'}</span>
                  <h2 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.4, color: 'var(--ink)', marginBottom: 10, flex: 1 }}>{a.title}</h2>
                  <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 14 }}>{a.description}</p>
                  {(a.date || a.readTime) && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
                    {a.date && <span>{articleDateLabel({ date: a.date, updated: a.updated, updatedDate: a.updatedDate }, language)}</span>}{a.date && a.readTime && <span>·</span>}{a.readTime && <span>{a.readTime}</span>}
                  </div>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .hub-language-label { font-size: 12px; color: var(--ink-3); margin-bottom: 8px; }
        .hub-reset { color: var(--gold-deep); font: inherit; text-decoration: underline; border: 0; background: none; cursor: pointer; margin-right: 8px; }
        .hub-reset:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
        .hub-grid-responsive { grid-template-columns: repeat(3,1fr) !important; }
        @media (max-width: 860px) { .hub-grid-responsive { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .hub-grid-responsive { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
