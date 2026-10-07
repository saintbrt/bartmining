import { useEffect, useState } from 'react'
import { DEFAULT_CROP, type Slide } from '../types'
import { resolveImage } from '../images'

// Natural sizes, shared by every slide instance so re-renders don't flash.
const natural = new Map<string, { w: number; h: number }>()

/**
 * Photo filling a frame, or a striped "image needed" block naming the file.
 *
 * Positioned with explicit pixel sizes rather than object-position + transform:
 * Chrome (and so html-to-image) renders that combination inconsistently at
 * small preview scales, so thumbnails and exports showed a different crop.
 */
export function Photo({ slide, frame, className }: { slide: Slide; frame: { width: number; height: number }; className: string }) {
  const url = resolveImage(slide.image)
  const [size, setSize] = useState(() => (url ? natural.get(url) : undefined))
  useEffect(() => { setSize(url ? natural.get(url) : undefined) }, [url])

  if (!url) {
    return (
      <div className={`${className} photo-missing`}>
        <span>{slide.image ? 'Image needed' : 'No image set'}</span>
        {slide.image && <code>{slide.image}</code>}
      </div>
    )
  }

  const { x, y, zoom } = slide.crop ?? DEFAULT_CROP
  let style: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' }
  if (size) {
    // Scale to just cover the frame, apply zoom, then place the overflow by x/y %.
    const scale = Math.max(frame.width / size.w, frame.height / size.h) * zoom
    const w = size.w * scale
    const h = size.h * scale
    style = {
      position: 'absolute',
      width: w,
      height: h,
      left: (frame.width - w) * (x / 100),
      top: (frame.height - h) * (y / 100),
      maxWidth: 'none',
    }
  }

  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <img
        src={url}
        alt={slide.imageAlt ?? ''}
        draggable={false}
        style={style}
        onLoad={e => {
          const n = { w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight }
          natural.set(url, n)
          setSize(n)
        }}
      />
    </div>
  )
}

// Numbers with their range and unit ("85–98%", "10–16 mm", "2 mm") must not
// break across lines.
const KEEP_TOGETHER = /(\d[\d.,]*(?:\s?[–-]\s?\d[\d.,]*)?(?:\s?(?:%|mm|m³|km|kg|t))?)/

function keepTogether(text: string) {
  return text.split(KEEP_TOGETHER).map((part, i) =>
    i % 2 ? <span key={i} style={{ whiteSpace: 'nowrap' }}>{part}</span> : part,
  )
}

export function TextBlock({ slide, before, after }: { slide: Slide; before?: React.ReactNode; after?: React.ReactNode }) {
  return (
    <div className="slide-text">
      {before}
      {slide.eyebrow && <div className="slide-eyebrow">{slide.eyebrow}</div>}
      <h1 className="slide-headline" data-headline>{keepTogether(slide.headline)}</h1>
      {slide.sub && <p className="slide-sub">{keepTogether(slide.sub)}</p>}
      {after}
    </div>
  )
}
