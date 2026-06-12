'use client'

import { useEffect, useState } from 'react'

/* Dark mode is the default. The choice is a cosmetic preference, stored in
   localStorage (data/state still lives in the database). */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem('gp-theme')) as 'dark' | 'light' | null
    if (saved === 'light') apply('light')
  }, [])

  function apply(next: 'dark' | 'light') {
    setTheme(next)
    document.querySelector('.gp-root')?.setAttribute('data-theme', next)
    try { window.localStorage.setItem('gp-theme', next) } catch {}
  }

  return (
    <button className="btn-icon" style={{ fontSize: 11, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
      onClick={() => apply(theme === 'dark' ? 'light' : 'dark')}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      {theme === 'dark' ? '☀ Light' : '☾ Dark'}
    </button>
  )
}
