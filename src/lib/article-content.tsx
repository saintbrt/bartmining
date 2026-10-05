import { Children, cloneElement, isValidElement, type ReactNode } from 'react'

export interface ArticleHeading { id: string; text: string; level: number }

function plainText(node: ReactNode): string {
  return Children.toArray(node).map(child => {
    if (typeof child === 'string' || typeof child === 'number') return String(child)
    return isValidElement<{ children?: ReactNode }>(child) ? plainText(child.props.children) : ''
  }).join('')
}

function decodeText(text: string): string {
  const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’' }
  return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity: string) => {
    if (entity.startsWith('#')) {
      const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10)
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match
    }
    return entities[entity] ?? match
  })
}

function headingId(text: string, used: Set<string>, existing?: string): string {
  const base = existing || text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section'
  let id = base
  let suffix = 2
  while (used.has(id)) id = `${base}-${suffix++}`
  used.add(id)
  return id
}

/** Assign anchors on the server so links work before hydration as well. */
export function prepareArticleHtml(html: string) {
  const headings: ArticleHeading[] = []
  const used = new Set<string>()
  const content = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, level: string, attrs: string, inner: string) => {
    const text = decodeText(inner.replace(/<[^>]+>/g, ''))
    const existing = attrs.match(/\bid\s*=\s*["']([^"']*)["']/i)?.[1]
    const id = headingId(text, used, existing)
    headings.push({ id, text, level: Number(level) })
    return `<h${level}${attrs.replace(/\s+id\s*=\s*["'][^"']*["']/i, '')} id="${id}">${inner}</h${level}>`
  })
  return { content, headings }
}

/** The JSX guides and HTML insights use the same anchor and contents rules. */
export function prepareArticleNodes(nodes: ReactNode) {
  const headings: ArticleHeading[] = []
  const used = new Set<string>()
  function visit(children: ReactNode): ReactNode {
    return Children.map(children, child => {
      if (!isValidElement<{ children?: ReactNode; id?: string }>(child)) return child
      const props: { children?: ReactNode; id?: string } = {}
      if (child.type === 'h2' || child.type === 'h3') {
        const text = plainText(child.props.children)
        props.id = headingId(text, used, child.props.id)
        headings.push({ id: props.id, text, level: child.type === 'h2' ? 2 : 3 })
      }
      if (child.props.children !== undefined) props.children = visit(child.props.children)
      return cloneElement(child, props)
    })
  }
  const content = visit(nodes)
  return { content, headings }
}
