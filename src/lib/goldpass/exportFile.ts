'use client'

/* Generic client-side file export (CSV + Excel). Extracted from the old drill
   db/helpers so operations pages keep working after the drill module is removed. */

export function exportCsv(rows: Record<string, unknown>[], filename: string) {
  if (!rows?.length) return
  const headers = Object.keys(rows[0])
  const esc = (v: unknown) => '"' + String(v ?? '').replace(/"/g, '""') + '"'
  const csv = [headers.map(esc).join(','), ...rows.map(r => headers.map(h => esc(r[h])).join(','))].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
}

/* Excel export via SheetJS (lazy-loaded; same data shape as exportCsv). */
export async function exportExcel(rows: Record<string, unknown>[], filename: string) {
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : filename + '.xlsx')
}
