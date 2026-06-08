import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GoldPass · Bart Mining',
  description: 'Internal drill data management platform.',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
