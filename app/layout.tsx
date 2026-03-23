import type { Metadata } from "next";
import {
  Archivo,
  Montserrat,
  Geist_Mono,
  Cormorant_Garamond,
  Inter,
  Playfair_Display,
  DM_Sans,
  DM_Serif_Display,
  Fraunces,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Sora,
  Crimson_Pro,
  Libre_Baskerville,
  Outfit,
} from "next/font/google";
import "./globals-v2.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Design Spore — AI Systems & Launch Studio",
    template: "%s | Design Spore",
  },
  description:
    "AI systems, websites, and automations for real businesses. Based in Clearwater, BC. Serving trades, tourism, hospitality, and service businesses across Canada.",
  metadataBase: new URL("https://designspore.co"),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    siteName: "Design Spore",
    type: "website",
    locale: "en_CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${montserrat.variable} ${geistMono.variable} ${cormorant.variable} ${inter.variable} ${playfair.variable} ${dmSans.variable} ${dmSerif.variable} ${fraunces.variable} ${jakarta.variable} ${spaceGrotesk.variable} ${sora.variable} ${crimsonPro.variable} ${libreBaskerville.variable} ${outfit.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-dark text-white antialiased" style={{ backgroundColor: '#14191F', color: '#FFFFFF' }}>
        {/* Grain texture — premium tactile overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
