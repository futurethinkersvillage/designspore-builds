import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans, Outfit } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['300', '400', '700'],
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Wells Gray Golf & RV Resort — Clearwater, BC',
    template: '%s | Wells Gray Resort',
  },
  description:
    'Creekside camping, glamping domes, forest cabins, 9-hole golf, wood-fired sauna, and a private lake — inside Wells Gray Provincial Park. 2 hours north of Kamloops, BC.',
  keywords: [
    'Wells Gray Resort',
    'glamping BC',
    'camping Clearwater BC',
    'RV park Wells Gray Provincial Park',
    'golf resort BC interior',
    'seasonal village BC',
    'weddings venue Clearwater',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://wellsgrayresort.ca',
    siteName: 'Wells Gray Golf & RV Resort',
    images: [
      {
        url: 'https://wellsgrayresort.designspore.co/images/PXL_20230621_022025523.MP-EDIT-scaled.jpg',
        width: 1200,
        height: 630,
        alt: 'Wells Gray Resort — aerial view of the resort inside Wells Gray Provincial Park',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakarta.variable} ${outfit.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
