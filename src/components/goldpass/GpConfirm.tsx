'use client'

import { useEffect, useState } from 'react'
import { onConfirmRequest, type ConfirmRequest } from '@/lib/goldpass/confirm'

export default function GpConfirm() {
  const [req, setReq] = useState<ConfirmRequest | null>(null)

  useEffect(() => onConfirmRequest(r => setReq(r)), [])

  if (!req) return null

  function answer(ok: boolean) {
    req!.resolve(ok)
    setReq(null)
  }

  return (
    <div className="gp-confirm-backdrop" onClick={() => answer(false)}>
      <div className="gp-confirm-box" onClick={e => e.stopPropagation()}>
        <div className="gp-confirm-msg">{req.message}</div>
        <div className="gp-confirm-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => answer(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={() => answer(true)}>OK</button>
        </div>
      </div>
    </div>
  )
}
