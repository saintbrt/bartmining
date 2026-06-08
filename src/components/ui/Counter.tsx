'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  target: number
  suffix?: string
  className?: string
}

export default function Counter({ target, suffix = '', className = '' }: Props) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
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
