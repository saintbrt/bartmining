import { useId } from 'react'

/**
 * The Bart Mining mark (public/logo.png) redrawn as a vector, so it stays
 * sharp in print: a gold diamond with a soft glow on a charcoal tile.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#353C40" />
          <stop offset="1" stopColor="#1A1F22" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0.2" y1="0.1" x2="0.8" y2="0.9">
          <stop offset="0" stopColor="#F3E2B4" />
          <stop offset="1" stopColor="#D2A650" />
        </linearGradient>
        <radialGradient id={`${id}h`}>
          <stop offset="0.45" stopColor="#E8C878" stopOpacity="0.55" />
          <stop offset="1" stopColor="#E8C878" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${id}t)`} />
      <circle cx="32" cy="32" r="25" fill={`url(#${id}h)`} />
      <path d="M32 14.5 49.5 32 32 49.5 14.5 32Z" fill={`url(#${id}g)`} />
    </svg>
  )
}
