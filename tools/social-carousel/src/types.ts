export interface Crop {
  x: number
  y: number
  zoom: number
}

export const DEFAULT_CROP: Crop = { x: 50, y: 50, zoom: 1 }

export type Template = 'photo-overlay' | 'light-card' | 'cover-dark' | 'stat' | 'cta'

export interface Slide {
  id: string
  template: Template
  eyebrow?: string
  headline: string
  sub?: string
  /** Library key: `equipment/<file>`, `team/<file>` or `social/<file>`. */
  image?: string
  /** Describe the visible subject without implying a real reported event. */
  imageAlt?: string
  /** Composition inside the frame: focus point in % (0–100) and zoom (1 = just fills the frame). */
  crop?: Crop
  /** Big figure on the `stat` template. */
  stat?: string
  /** Initials mark on `cover-dark` (team posts without a portrait). */
  mark?: string
  /** Designer / sourcing note. Shown in the editor, never rendered. */
  note?: string
}

export type Pillar = 'edu' | 'compare' | 'product' | 'team' | 'news'

export interface Post {
  /** 'IG-01'. Used in filenames and internal post organisation. */
  id: string
  title: string
  pillar: Pillar
  /** draft = outline only; review = copy written, needs sign-off; approved = ready to post. */
  status: 'draft' | 'review' | 'approved'
  signOff: 'allan' | 'bartholomew'
  sourceInsight?: string
  slides: Slide[]
  caption: string
  hashtags: string[]
}
