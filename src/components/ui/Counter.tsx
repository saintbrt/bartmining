'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  target: number
  suffix?: string
  className?: string
}

/**
 * Server HTML carries the real number, so crawlers and no-JS readers never see
 * "0+". The count-up only runs for counters that start below the fold; one
 * already on screen at mount keeps its value rather than flashing back to 0.
 */
export default function Counter({ target, suffix = '', className = '' }: Props) {
  const [val, setVal] = useState(target)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return
    setVal(0)
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let start: number | null = null
        const dur = 1200
        const step = (t: number) => {
          if (!start) start = t
          const p = Math.min((t - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(target * eased))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref} className={className}>{val}{suffix}</span>
}
