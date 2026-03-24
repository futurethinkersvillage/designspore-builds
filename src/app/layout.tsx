import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Cormorant } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { VariantSwitcher } from "@/components/ui/VariantSwitcher";
import "./globals.css";

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
    "A Smart Village in Wells Gray, BC. Visit, join as a member, or invest in the future of human living.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <VariantSwitcher />
      </body>
    </html>
  );
}
