import type { ArticleMeta } from '@/data/insights'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** Source metadata records publication months, so use the first day in schema. */
export function articlePublishedDate(label: string): string {
  const [month, year] = label.split(' ')
  const m = MONTHS.indexOf(month)
  return m >= 0 && /^\d{4}$/.test(year) ? `${year}-${String(m + 1).padStart(2, '0')}-01` : label
}

export function articleDateLabel(article: Pick<ArticleMeta, 'date' | 'updated' | 'updatedDate'>, lang: 'en' | 'sw'): string {
  if (lang === 'en') return article.updated ? `Updated ${article.updated}` : article.date
  const date = article.updatedDate ?? articlePublishedDate(article.updated ?? article.date)
  const label = new Intl.DateTimeFormat('sw-TZ', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date))
  return article.updated ? `Imesasishwa ${label}` : label
}
