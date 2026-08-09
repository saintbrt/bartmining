const LS = String.fromCharCode(0x2028)
const PS = String.fromCharCode(0x2029)

/**
 * Emits one or more JSON-LD graphs as <script type="application/ld+json">.
 *
 * Rendered server-side inside the page body. Google, Bing and the AI
 * crawlers all parse ld+json from the served HTML, so this must never be
 * gated behind client-side hydration.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const graphs = Array.isArray(data) ? data : [data]
  return (
    <>
      {graphs.map((g, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Escape the sequences that can terminate or corrupt a <script>
          // element: "<" (guards against a literal </script> inside a string)
          // and the raw line separators U+2028/U+2029, which are valid JSON
          // but invalid inside a JavaScript string literal.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(g)
              .replace(/</g, '\\u003c')
              .split(LS).join('\\u2028')
              .split(PS).join('\\u2029'),
          }}
        />
      ))}
    </>
  )
}
