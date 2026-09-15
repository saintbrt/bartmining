'use client'

import { useEffect, useRef, ReactNode, CSSProperties, ElementType } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  style?: CSSProperties
  className?: string
  as?: ElementType
  /** Anchor target, e.g. /about#allan-bartholomew. */
  id?: string
}

export default function Reveal({ children, delay = 0, style, className = '', as: Tag = 'div', id }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('in'); obs.disconnect() } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${className}`}
      style={{ transitionDelay: delay ? `${delay * 0.1}s` : undefined, ...style }}
    >
      {children}
    </Tag>
  )
}
