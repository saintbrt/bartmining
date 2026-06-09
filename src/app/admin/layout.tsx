import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'GoldPass · Bart Mining',
  description: 'Internal drill data management platform.',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gp-root">
      {children}
    </div>
  )
}
