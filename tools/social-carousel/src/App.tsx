import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_CROP, type Crop, type Post, type Slide, type Template } from './types'
import { POSTS, POST_FOLDERS } from './data/posts'
import { withSharedCta, withoutPostCode } from './data/cta'
import { migratePostImageNames } from './data/file-names'
import { IMAGE_LIBRARY, resolveImage } from './images'
import { CANVAS, CARD_BOX, MAX_HEADLINE_LINES, MAX_UPSCALE } from './brand'
import { SlideView } from './templates'
import { downloadAll, downloadSlide, slideFilename } from './export/downloadPng'

const STORAGE_KEY = 'bm-social-edits-v1'
const PREVIEW_SCALE = 0.5
const THUMB_SCALE = 0.14
const TEMPLATES: Template[] = ['photo-overlay', 'light-card', 'cover-dark', 'stat', 'cta']
const PLACEHOLDER = /\[[^\]]*\]/

const captionWithHashtags = (post: Post) =>
  `${post.caption}${post.hashtags.length ? `\n\n${post.hashtags.join(' ')}` : ''}`

function splitCaption(text: string): Pick<Post, 'caption' | 'hashtags'> {
  const tags = text.match(/(?:^|\n)[ \t]*((?:#[^\s#]+[ \t\n]*)+)$/u)
  return tags
    ? { caption: text.slice(0, tags.index).trimEnd(), hashtags: tags[1].trim().split(/\s+/) }
    : { caption: text, hashtags: [] }
}

// Edits live in this browser only. "Copy post as code" is how they get back
// into posts.ts for good. Each edit remembers the posts.ts version it started
// from; if that post has since changed in the file, the stale edit is dropped
// so it can't hide the new copy. A filename-only change migrates the saved
// base and edit together, preserving text, crops and other browser work.
type StoredEdit = { base: string; post: Post }
const baseOf = (id: string) => JSON.stringify(POSTS.find(p => p.id === id))

function loadEdits(): Record<string, Post> {
  try {
    const stored: Record<string, StoredEdit> = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return Object.fromEntries(Object.entries(stored).flatMap(([id, edit]) => {
      if (!edit?.base || !edit.post) return []
      try {
        const base = JSON.stringify(migratePostImageNames(JSON.parse(edit.base)))
        return base === baseOf(id) ? [[id, migratePostImageNames(edit.post)]] : []
      } catch { return [] }
    }))
  } catch { return {} }
}
function saveEdits(edits: Record<string, Post>) {
  const stored = Object.fromEntries(Object.entries(edits).map(([id, post]) => [id, { base: baseOf(id), post }]))
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stored)) } catch { /* private mode */ }
}

// A new image file makes Vite reload the page; remember where we were.
const POSITION_KEY = 'bm-social-position'
function loadPosition(): { postId: string; index: number } {
  try {
    const p = JSON.parse(sessionStorage.getItem(POSITION_KEY) ?? 'null')
    if (p && POSTS.some(x => x.id === p.postId)) return p
  } catch { /* ignore */ }
  return { postId: POSTS[0].id, index: 0 }
}

/** Saves the file into tools/social-carousel/images/ and returns its library key. */
async function uploadImage(file: File, name: string): Promise<string | null> {
  const send = (overwrite: boolean) =>
    fetch(`/api/upload?name=${encodeURIComponent(name)}${overwrite ? '&overwrite=1' : ''}`, { method: 'POST', body: file })
  let res = await send(false)
  if (res.status === 409) {
    const { name: existing } = await res.json()
    if (!confirm(`images/${existing} already exists. Replace it?`)) return null
    res = await send(true)
  }
  const body = await res.json()
  if (!res.ok) { alert(body.error ?? 'Upload failed.'); return null }
  return body.key
}

type Size = { w: number; h: number }

/** Natural sizes of every image used, for the "will look soft" check. */
function useImageSizes(urls: string[]) {
  const [sizes, setSizes] = useState<Record<string, Size>>({})
  useEffect(() => {
    for (const url of urls) {
      if (sizes[url]) continue
      const img = new Image()
      img.onload = () => setSizes(s => ({ ...s, [url]: { w: img.naturalWidth, h: img.naturalHeight } }))
      img.src = url
    }
  }, [urls.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps
  return sizes
}

function upscaleFor(slide: Slide, size: Size) {
  const box = slide.template === 'light-card' ? CARD_BOX : CANVAS
  return Math.max(box.width / size.w, box.height / size.h) * (slide.crop?.zoom ?? 1)
}

function slideIssues(slide: Slide, lines: number | undefined, sizes: Record<string, Size>) {
  const issues: string[] = []
  if (lines && lines > MAX_HEADLINE_LINES) issues.push(`Headline runs to ${lines} lines (max ${MAX_HEADLINE_LINES}).`)
  if ([slide.eyebrow, slide.headline, slide.sub, slide.stat].some(t => t && PLACEHOLDER.test(t))) {
    issues.push('Placeholder [text] still on the slide.')
  }
  // Light cards can intentionally be text-only, including product CTAs.
  const usesImage = slide.template === 'photo-overlay' || !!slide.image
  if (usesImage) {
    const url = resolveImage(slide.image)
    if (!slide.image) issues.push('No image set.')
    else if (!url) issues.push(`Image needed: drop "${slide.image.replace(/^social\//, '')}" into tools/social-carousel/images/.`)
    else if (sizes[url]) {
      const scale = upscaleFor(slide, sizes[url])
      const limit = slide.template === 'light-card' ? MAX_UPSCALE.card : MAX_UPSCALE.fullBleed
      if (scale > limit) {
        issues.push(`Image is ${sizes[url].w}×${sizes[url].h} and gets upscaled ${scale.toFixed(1)}×, so it will look soft. Find a bigger one.`)
      }
    }
  }
  return issues
}

/** A full-size slide shown scaled down. Export captures the inner node at native size. */
function Scaled({ slide, scale, nodeRef }: { slide: Slide; scale: number; nodeRef?: (el: HTMLDivElement | null) => void }) {
  return (
    <div className="scaled" style={{ width: CANVAS.width * scale, height: CANVAS.height * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <div ref={nodeRef}><SlideView slide={slide} /></div>
      </div>
    </div>
  )
}

const FOLDERS_KEY = 'bm-carousel-folders'

export function App() {
  const [edits, setEdits] = useState<Record<string, Post>>(loadEdits)
  const posts = useMemo(() => POSTS.map(p => {
    const post = edits[p.id] ?? p
    return { ...post, caption: withoutPostCode(post.caption), slides: post.slides.map(withSharedCta) }
  }), [edits])
  const [postId, setPostId] = useState(() => loadPosition().postId)
  const [index, setIndex] = useState(() => loadPosition().index)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [captionDraft, setCaptionDraft] = useState<{ id: string; text: string; base: string }>()
  const [toast, setToast] = useState('')
  const [lines, setLines] = useState<number[]>([])
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(FOLDERS_KEY) ?? '{}') } catch { return {} }
  })
  const toggleFolder = (id: string, open: boolean) => setOpenFolders(prev => {
    if (prev[id] === open || (prev[id] === undefined && open)) return prev
    const next = { ...prev, [id]: open }
    try { localStorage.setItem(FOLDERS_KEY, JSON.stringify(next)) } catch { /* private mode */ }
    return next
  })

  const post = posts.find(p => p.id === postId)!
  const combinedCaption = captionWithHashtags(post)
  const captionText = captionDraft?.id === post.id && captionDraft.base === combinedCaption
    ? captionDraft.text : combinedCaption
  const slide = post.slides[Math.min(index, post.slides.length - 1)]
  const thumbs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => saveEdits(edits), [edits])
  useEffect(() => {
    try { sessionStorage.setItem(POSITION_KEY, JSON.stringify({ postId, index })) } catch { /* ignore */ }
  }, [postId, index])

  const sizes = useImageSizes(
    useMemo(() => posts.flatMap(p => p.slides.map(s => resolveImage(s.image)).filter(Boolean) as string[]), [posts]),
  )

  // Count headline lines on the full-size thumbnail nodes (transforms don't affect layout size).
  const measure = useCallback(() => {
    setLines(post.slides.map((_, i) => {
      const el = thumbs.current[i]?.querySelector<HTMLElement>('[data-headline]')
      if (!el) return 0
      return Math.round(el.offsetHeight / parseFloat(getComputedStyle(el).lineHeight))
    }))
  }, [post])
  useLayoutEffect(measure, [measure])
  useEffect(() => { document.fonts.ready.then(measure) }, [measure])

  const issues = post.slides.map((s, i) => slideIssues(s, lines[i], sizes))
  const captionIssues = [
    PLACEHOLDER.test(post.caption) && 'Caption is still a placeholder.',
    (post.hashtags.length < 3 || post.hashtags.length > 5) && `${post.hashtags.length} hashtags (use 3–5).`,
  ].filter(Boolean) as string[]
  const issueCount = issues.flat().length + captionIssues.length

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2200) }

  const updatePost = (patch: Partial<Post>) => setEdits(e => ({ ...e, [post.id]: { ...post, ...patch } }))
  const updateSlide = (patch: Partial<Slide>) =>
    updatePost({ slides: post.slides.map(s => (s === slide ? { ...s, ...patch } : s)) })

  const selectPost = (id: string) => { setPostId(id); setIndex(0) }

  const crop = slide.crop ?? DEFAULT_CROP
  const setCrop = (patch: Partial<Crop>) => {
    const next = { ...crop, ...patch }
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    updateSlide({ crop: { x: clamp(next.x, 0, 100), y: clamp(next.y, 0, 100), zoom: clamp(next.zoom, 1, 3) } })
  }
  const hasPhoto = !!resolveImage(slide.image)

  // Drag the preview to move the photo: dragging right reveals more of the left side.
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (!hasPhoto) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { px: e.clientX, py: e.clientY, x: crop.x, y: crop.y }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const speed = 100 / (CANVAS.width * PREVIEW_SCALE)
    setCrop({ x: d.x - (e.clientX - d.px) * speed, y: d.y - (e.clientY - d.py) * speed })
  }
  const onPointerUp = () => { drag.current = null }

  // If the slide is waiting on a named social/ image, the upload takes that
  // name so it fills the gap; otherwise it keeps the file's own name.
  const upload = async (file?: File) => {
    if (!file) return
    const wanted = slide.image?.startsWith('social/') && !resolveImage(slide.image) ? slide.image.slice(7) : null
    const name = wanted ? `${wanted.replace(/\.[^.]+$/, '')}.${file.name.split('.').pop()}` : file.name
    setBusy(true)
    try {
      const key = await uploadImage(file, name)
      if (key) { updateSlide({ image: key, imageAlt: undefined }); flash(`Saved to images/${key.slice(7)}`) }
    } finally { setBusy(false) }
  }

  const okToExport = () =>
    issueCount === 0 || confirm(`This post has ${issueCount} open issue(s). Export anyway?`)

  const exportOne = async () => {
    const node = thumbs.current[index]
    if (!node || !okToExport()) return
    setBusy(true)
    try { await downloadSlide(node, slideFilename(post.id, index)) } finally { setBusy(false) }
  }
  const exportAll = async () => {
    const nodes = thumbs.current.slice(0, post.slides.length).filter(Boolean) as HTMLElement[]
    if (!okToExport()) return
    setBusy(true)
    try { await downloadAll(nodes, post.id) } finally { setBusy(false) }
  }

  const copy = async (text: string, msg: string) => {
    await navigator.clipboard.writeText(text)
    flash(msg)
  }

  const imageOptions = IMAGE_LIBRARY.map(i => i.key)
  if (slide.image && !imageOptions.includes(slide.image)) imageOptions.unshift(slide.image)

  return (
    <div className="app">
      <aside className="posts">
        <h2>Posts <span className="muted">· publishing order</span></h2>
        {POST_FOLDERS.map(folder => {
          const items = posts.filter(p => folder.postIds.includes(p.id))
          const groups = folder.sections
            ? folder.sections.map(s => ({ label: s.label, items: items.filter(p => s.pillars.includes(p.pillar)) }))
            : [{ label: '', items }]
          return (
            <details
              key={folder.id}
              className="folder"
              open={openFolders[folder.id] ?? true}
              onToggle={e => toggleFolder(folder.id, (e.currentTarget as HTMLDetailsElement).open)}
            >
              <summary>{folder.label} <span className="muted">({items.length})</span></summary>
              {groups.filter(g => g.items.length).map(g => (
                <div key={g.label} className="folder-group">
                  {g.label && <h4>{g.label}</h4>}
                  {g.items.map(p => (
                    <button key={p.id} className={`post ${p.id === postId ? 'active' : ''}`} onClick={() => selectPost(p.id)}>
                      <span className="post-id">{p.id}{edits[p.id] && <i title="Edited in this browser"> •</i>}</span>
                      <span className="post-title">{p.title}</span>
                      <span className={`badge ${p.status}`}>{p.status}</span>
                    </button>
                  ))}
                </div>
              ))}
            </details>
          )
        })}
      </aside>

      <main className="stage">
        <div className="stage-head">
          <div>
            <h1>{post.id} · {post.title}</h1>
            <p className="muted">
              Slide {index + 1} of {post.slides.length} · {slide.template}
              {post.sourceInsight && <> · source: <code>{post.sourceInsight}</code></>}
              {' '}· sign-off: {post.signOff === 'allan' ? 'Allan' : 'Bartholomew'}
            </p>
          </div>
          <div className="nav">
            <button disabled={index === 0} onClick={() => setIndex(i => i - 1)}>←</button>
            <button disabled={index >= post.slides.length - 1} onClick={() => setIndex(i => i + 1)}>→</button>
          </div>
        </div>

        <div
          className={hasPhoto ? 'pan' : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          title={hasPhoto ? 'Drag to reposition the photo' : undefined}
        >
          <Scaled slide={slide} scale={PREVIEW_SCALE} />
        </div>

        <div className="strip">
          {post.slides.map((s, i) => (
            <button
              key={s.id}
              className={`thumb ${i === index ? 'active' : ''} ${issues[i].length ? 'has-issue' : ''}`}
              onClick={() => setIndex(i)}
              title={issues[i].join('\n') || 'No issues'}
            >
              <Scaled slide={s} scale={THUMB_SCALE} nodeRef={el => { thumbs.current[i] = el }} />
              <span className="thumb-label">{String(i + 1).padStart(2, '0')}{issues[i].length > 0 && ' ⚠'}</span>
            </button>
          ))}
        </div>
      </main>

      <aside className="panel">
        <section>
          <h3>Slide {index + 1}</h3>
          {slide.note && <p className="note">{slide.note}</p>}

          <label>Template
            <select disabled={slide.id === 'cta'} value={slide.template} onChange={e => updateSlide({ template: e.target.value as Template })}>
              {TEMPLATES.map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Eyebrow
            <input disabled={slide.id === 'cta'} value={slide.eyebrow ?? ''} onChange={e => updateSlide({ eyebrow: e.target.value || undefined })} />
          </label>
          {slide.template === 'stat' && (
            <label>Stat
              <input value={slide.stat ?? ''} onChange={e => updateSlide({ stat: e.target.value || undefined })} />
            </label>
          )}
          <label>Headline <span className={`muted ${(lines[index] ?? 0) > MAX_HEADLINE_LINES ? 'bad' : ''}`}>{lines[index] ?? 0} / {MAX_HEADLINE_LINES} lines</span>
            <textarea rows={3} value={slide.headline} onChange={e => updateSlide({ headline: e.target.value })} />
          </label>
          <label>Sub line
            <input value={slide.sub ?? ''} onChange={e => updateSlide({ sub: e.target.value || undefined })} />
          </label>
          {slide.template === 'cover-dark' && (
            <label>Initials mark
              <input value={slide.mark ?? ''} onChange={e => updateSlide({ mark: e.target.value || undefined })} />
            </label>
          )}
          {slide.id === 'cta' ? (
            <p className="note">This closing slide uses the shared CTA design for every post. Its headline and sub line remain editable.</p>
          ) : <>
              <label>Image
                <select value={slide.image ?? ''} onChange={e => updateSlide({ image: e.target.value || undefined, imageAlt: undefined })}>
                  <option value="">None</option>
                  {imageOptions.map(k => <option key={k} value={k}>{resolveImage(k) ? k : `${k} (missing)`}</option>)}
                </select>
              </label>
              {hasPhoto && (
                <label>Image description
                  <input value={slide.imageAlt ?? ''} onChange={e => updateSlide({ imageAlt: e.target.value || undefined })} />
                </label>
              )}
              <label
                className={`drop ${dragging ? 'over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files[0]) }}
              >
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={e => { upload(e.target.files?.[0]); e.target.value = '' }} />
                <strong>Upload image</strong>
                <span className="muted">Drop a file here or click. It is saved into the repo at tools/social-carousel/images/.</span>
              </label>
              {hasPhoto && (
                <fieldset className="crop">
                  <legend>Composition <span className="muted">or drag the photo in the preview</span></legend>
                  <label>Zoom <span className="muted">{crop.zoom.toFixed(2)}×</span>
                    <input type="range" min={1} max={3} step={0.01} value={crop.zoom} onChange={e => setCrop({ zoom: +e.target.value })} />
                  </label>
                  <label>Left / right
                    <input type="range" min={0} max={100} step={0.5} value={crop.x} onChange={e => setCrop({ x: +e.target.value })} />
                  </label>
                  <label>Up / down
                    <input type="range" min={0} max={100} step={0.5} value={crop.y} onChange={e => setCrop({ y: +e.target.value })} />
                  </label>
                  <button type="button" onClick={() => updateSlide({ crop: undefined })}>Reset</button>
                </fieldset>
              )}
          </>}

          {issues[index].length > 0 && (
            <ul className="issues">{issues[index].map(m => <li key={m}>{m}</li>)}</ul>
          )}
        </section>

        <section className="actions">
          <button className="primary" disabled={busy} onClick={exportOne}>Download slide</button>
          <button disabled={busy} onClick={exportAll}>Download all {post.slides.length}</button>
          {busy && <span className="muted">Rendering…</span>}
        </section>

        <section>
          <h3>Caption and hashtags</h3>
          <textarea aria-label="Caption and hashtags" rows={12} value={captionText} onChange={e => {
            const text = e.target.value
            const fields = splitCaption(text)
            setCaptionDraft({ id: post.id, text, base: captionWithHashtags({ ...post, ...fields }) })
            updatePost(fields)
          }} />
          {captionIssues.length > 0 && <ul className="issues">{captionIssues.map(m => <li key={m}>{m}</li>)}</ul>}
          <button onClick={() => copy(captionText, 'Caption and hashtags copied')}>Copy caption and hashtags</button>
        </section>

        <section className="actions">
          <button onClick={() => copy(JSON.stringify(post, null, 2), 'Post copied: paste it into posts.ts')}>Copy post as code</button>
          {edits[post.id] && (
            <button onClick={() => { if (confirm('Discard your edits to this post?')) setEdits(({ [post.id]: _, ...rest }) => rest) }}>
              Reset edits
            </button>
          )}
        </section>
      </aside>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
