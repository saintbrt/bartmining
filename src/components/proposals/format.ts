// Small display helpers for the Projects tab.

export const money = (n: number, currency = 'USD') =>
  currency === 'USD' ? `$${Math.round(n).toLocaleString('en-US')}` : `${currency} ${Math.round(n).toLocaleString('en-US')}`

export const moneyShort = (n: number) => {
  const a = Math.abs(n)
  if (a >= 1e6) return `$${(n / 1e6).toFixed(a >= 1e7 ? 1 : 2)}M`
  if (a >= 1e4) return `$${Math.round(n / 1e3)}k`
  return money(n)
}

export function shortDate(iso: string | null | undefined) {
  if (!iso) return '–'
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 90) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)} min ago`
  if (s < 86400) return `${Math.round(s / 3600)} h ago`
  const d = Math.round(s / 86400)
  return d === 1 ? 'yesterday' : d < 30 ? `${d} days ago` : shortDate(iso)
}

export const STATE_BADGE: Record<string, string> = {
  draft: 'badge-gray',
  sent: 'badge-blue',
  confirmed: 'badge-purple',
  part_paid: 'badge-orange',
  paid: 'badge-green',
  overdue: 'badge-red',
  cancelled: 'badge-gray',
  quoted: 'badge-purple',
  declined: 'badge-red',
  accepted: 'badge-green',
  superseded: 'badge-gray',
  expired: 'badge-gray',
  failed: 'badge-red',
}
