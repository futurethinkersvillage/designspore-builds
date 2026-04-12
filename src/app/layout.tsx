import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mike Gilliland — Builder, Founder, AI Practitioner",
  description:
    "Building AI systems, communities, and businesses from Clearwater, BC. Founder of Design Spore, co-creator of Future Thinkers podcast.",
  openGraph: {
    title: "Mike Gilliland",
    description:
      "Building AI systems, communities, and businesses from a small town in the BC interior.",
    url: "https://mikegilliland.ca",
    siteName: "Mike Gilliland",
    type: "website",
    images: [
      {
        url: "https://mikegilliland.ca/mike.jpg",
        width: 400,
        height: 533,
        alt: "Mike Gilliland",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Mike Gilliland",
    description: "Building AI systems, communities, and businesses from a small town in the BC interior.",
    images: ["https://mikegilliland.ca/mike.jpg"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0a0a0a] text-neutral-200 font-sans">
        {children}
      </body>
    </html>
  );
}
