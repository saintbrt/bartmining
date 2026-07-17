'use client'

import { useEffect } from 'react'

/* Generic form-hosting overlay, generalizing GpConfirm's backdrop pattern
   for wider content (a form, not just a yes/no message). Every "button
   opens a small form" interaction on the Plant subtabs uses this instead
   of a permanently-stacked card. */
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="gp-modal-backdrop" onClick={onClose}>
      <div className="gp-modal-box" onClick={e => e.stopPropagation()}>
        <div className="gp-modal-head">
          <div className="gp-modal-title">{title}</div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="gp-modal-body">{children}</div>
      </div>
    </div>
  )
}
