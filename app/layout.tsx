import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pelican Power Wash | Professional Exterior Cleaning',
  description:
    'Professional power washing and exterior cleaning services for residential and commercial properties. Get a free quote today!',
  keywords: [
    'power washing',
    'pressure washing',
    'exterior cleaning',
    'property cleaning',
    'commercial cleaning',
  ],
  authors: [{ name: 'Pelican Power Wash' }],
  creator: 'Pelican Power Wash',
  publisher: 'Pelican Power Wash',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'Pelican Power Wash',
    description:
      'Professional power washing and exterior cleaning services for residential and commercial properties.',
    images: [
      {
        url: '/logos/pelican-logo.png',
        width: 1200,
        height: 630,
        alt: 'Pelican Power Wash mascot and logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pelican Power Wash',
    description:
      'Professional power washing and exterior cleaning for residential and commercial properties.',
  },
  icons: {
    icon: '/logos/pelican-logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0D1B24',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-neutral-950">
      <body className={`${geistSans.className} antialiased bg-neutral-950 text-white`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
