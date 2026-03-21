import type { Metadata } from "next";
import { Bangers, Archivo, Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

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

export const metadata: Metadata = {
  title: {
    default: "Design Spore — AI Systems & Launch Studio",
    template: "%s | Design Spore",
  },
  description:
    "AI systems, websites, and automations for real businesses. Based in Clearwater, BC. Serving trades, tourism, hospitality, and service businesses across Canada.",
  metadataBase: new URL("https://designspore.co"),
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
      className={`${bangers.variable} ${archivo.variable} ${montserrat.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-dark text-white antialiased" style={{ backgroundColor: '#14191F', color: '#FFFFFF' }}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
