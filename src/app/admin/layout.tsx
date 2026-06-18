import type { Metadata } from 'next'
import GpToasts from '@/components/goldpass/GpToasts'
import GpConfirm from '@/components/goldpass/GpConfirm'
import './admin.css'

export const metadata: Metadata = {
  title: 'GoldPass',
  description: 'Internal drill data management platform.',
  robots: { index: false, follow: false },
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
