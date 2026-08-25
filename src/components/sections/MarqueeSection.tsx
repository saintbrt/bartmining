const ITEMS = ['Resolute Mine', 'Barrick Gold', 'Brazil', 'Liberia', 'DRC', 'Australia', 'Canada', 'Tanzania']

export default function MarqueeSection() {
  const loop = [...ITEMS, ...ITEMS]
  return (
    <div style={{ borderTop: '1px solid var(--line-2)', borderBottom: '1px solid var(--line-2)', padding: '22px 0', overflow: 'hidden', background: 'var(--bg-2)' }}>
      <div className="px-site" style={{ marginBottom: 10 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--ink-3)', textAlign: 'center' }}>
          Leadership experience across the world&apos;s major operators
        </p>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div className="marquee-track">
          {loop.map((item, i) => (
            <span key={`${item}-${i}`} style={{ display: 'contents' }}>
              <span>{item}</span>
              <span aria-hidden style={{ color: 'var(--gold)' }}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
