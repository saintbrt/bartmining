import type { Metadata } from 'next'
import { Sora, Manrope, Space_Mono } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/layout/SiteChrome'

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bartmining.com'),
  title: {
    default: 'Bart Mining',
    template: '%s | Bart Mining',
  },
  description:
    'Bart Mining is a principal-led mining consultancy and equipment supplier in Dar es Salaam, Tanzania. Mineral exploration, geological survey, mine planning, gold processing plants and safety equipment across East & Southern Africa.',
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/favicon-180.png', sizes: '180x180' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
