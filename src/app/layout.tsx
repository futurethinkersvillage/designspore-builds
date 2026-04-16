import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Cormorant } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/ui/ChatWidget";
import { BackToTop } from "@/components/ui/BackToTop";
import { RefTracker } from "@/components/analytics/RefTracker";
import { Suspense } from "react";
import { headers } from "next/headers";
import "./globals.css";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Portal.Place — Smart Village Network",
    template: "%s | Portal.Place",
  },
  description:
    "A seasonal Smart Village near Wells Gray, BC. Visit, join as a member, or invest in the future of human living.",
  metadataBase: new URL("https://portal.place"),
  openGraph: {
    type: "website",
    siteName: "Portal.Place",
    title: "Portal.Place — Smart Village Network",
    description: "A seasonal Smart Village near Wells Gray, BC. Visit, join as a member, or invest in the future of human living.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Portal.Place — Smart Village in Wells Gray, BC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portal.Place — Smart Village Network",
    description: "A seasonal Smart Village near Wells Gray, BC. Visit, join as a member, or invest in the future of human living.",
    images: ["/images/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const isDashboard = headersList.get("x-is-dashboard") === "1";

  return (
    <html lang="en" className={`${geist.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Suspense fallback={null}><RefTracker /></Suspense>
        {!isDashboard && <Nav />}
        <main className="flex-1">{children}</main>
        {!isDashboard && <Footer />}
        {!isDashboard && <ChatWidget />}
        {!isDashboard && <BackToTop />}
      </body>
    </html>
  );
}
