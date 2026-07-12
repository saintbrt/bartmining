import type { Metadata, Viewport } from 'next'
import GpToasts from '@/components/goldpass/GpToasts'
import GpConfirm from '@/components/goldpass/GpConfirm'
import './admin.css'

export const metadata: Metadata = {
  title: 'GoldPass',
  description: 'Internal drill data management platform.',
  robots: { index: false, follow: false },
}

// Explicit for the mobile-responsive admin shell (matches the Next.js default).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gp-root">
      {children}
      <GpToasts />
      <GpConfirm />
    </div>
  )
}
