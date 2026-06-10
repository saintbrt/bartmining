'use client'

import { useEffect, useState } from 'react'
import { onToast, type Toast } from '@/lib/goldpass/notify'

const KIND_COLOR: Record<string, string> = {
  info: 'var(--blue)', success: 'var(--green)', warn: 'var(--orange)', error: 'var(--red)',
}
const KIND_ICON: Record<string, string> = { info: 'ℹ', success: '✓', warn: '⚠', error: '✕' }

export default function GpToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => onToast(t => {
    setToasts(prev => [...prev, t])
    const ttl = t.kind === 'error' ? 9000 : 5000
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), ttl)
  }), [])

  if (toasts.length === 0) return null
  return (
    <div className="gp-toasts">
      {toasts.map(t => (
        <div key={t.id} className="gp-toast" style={{ borderLeftColor: KIND_COLOR[t.kind] }}
          onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
          <span className="gp-toast-ico" style={{ color: KIND_COLOR[t.kind] }}>{KIND_ICON[t.kind]}</span>
          <div style={{ flex: 1 }}>
            <div className="gp-toast-msg">{t.msg}</div>
            {t.code && <div className="gp-toast-code">{t.code}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
