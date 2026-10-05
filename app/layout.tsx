import { Archivo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { MobileActionBar } from '@/components/layout/MobileActionBar'
import { business, serviceCategories, serviceTowns } from '@/data/site'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const title = 'Pelican Power Wash | Pressure Washing in St. Mary\'s County, MD'
const description =
  'Soft washing and pressure washing for homes and businesses in St. Mary\'s, Calvert and Charles counties. House washes, driveways, decks and roofs. Free quotes, replies within 24 hours.'

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title,
  description,
  keywords: [
    'pressure washing St. Mary\'s County',
    'power washing Leonardtown',
    'soft wash Southern Maryland',
    'house washing Lexington Park',
    'driveway cleaning',
    'roof cleaning',
    'commercial pressure washing',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: business.name,
    title,
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  icons: {
    icon: '/pelican/logo.png',
    apple: '/pelican/logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f7f9' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1626' },
  ],
  width: 'device-width',
  initialScale: 1,
}

// Local business structured data, which feeds Google's business details.
// Review ratings are left out on purpose: Google ignores self-published ones.
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: business.name,
  url: business.url,
  logo: `${business.url}/pelican/logo.png`,
  image: `${business.url}/pelican/logo.png`,
  telephone: business.phone.e164,
  email: business.email,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'MD',
    addressCountry: 'US',
  },
  areaServed: serviceTowns.map((group) => ({
    '@type': 'AdministrativeArea',
    name: `${group.county}, MD`,
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Exterior cleaning services',
    itemListElement: serviceCategories.flatMap((category) =>
      category.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.name },
      }))
    ),
  },
  sameAs: Object.values(business.socials).filter(Boolean),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <MobileActionBar />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
