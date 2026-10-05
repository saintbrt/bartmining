'use client'

import { useEffect, useState, type RefObject } from 'react'

/** True once everything inside `ref` has rendered and every image has loaded (or failed). */
export function useImagesReady(ref: RefObject<HTMLElement | null>, rendered: boolean) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!rendered || !ref.current) return
    let alive = true
    const imgs = Array.from(ref.current.querySelectorAll('img'))
    Promise.all([
      document.fonts.ready,
      ...imgs.map(img => (img.complete ? Promise.resolve() : new Promise<void>(r => { img.onload = () => r(); img.onerror = () => r() }))),
    ]).then(() => { if (alive) setReady(true) })
    return () => { alive = false }
  }, [ref, rendered])
  return ready
}
