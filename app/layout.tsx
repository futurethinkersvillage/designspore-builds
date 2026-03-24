import type { Metadata } from "next";
import {
  Archivo,
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
import "./globals.css";
import demoConfig from "@/demo-config.json";
import type { DemoConfig } from "@/lib/demo-config";
import DemoBar from "@/components/demo/DemoBar";
import ChatbotWidget from "@/components/demo/ChatbotWidget";
import GuidedTour from "@/components/demo/GuidedTour";
import { fontGroups } from "@/lib/font-groups";

const config = demoConfig as DemoConfig;

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], display: "swap", weight: ["400","500","600","700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });
const dmSerif = DM_Serif_Display({ variable: "--font-dm-serif", subsets: ["latin"], display: "swap", weight: "400" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const crimsonPro = Crimson_Pro({ variable: "--font-crimson-pro", subsets: ["latin"], display: "swap" });
const libreBaskerville = Libre_Baskerville({ variable: "--font-libre-baskerville", subsets: ["latin"], display: "swap", weight: ["400","700"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap" });

const fontVars = [archivo, geistMono, cormorant, inter, playfair, dmSans, dmSerif, fraunces, jakarta, spaceGrotesk, sora, crimsonPro, libreBaskerville, outfit]
  .map(f => f.variable)
  .join(" ");

// Resolve selected font pairing from preset
const selectedFont = fontGroups.find(g => g.id === config.fontPreset) ?? fontGroups[0];

export const metadata: Metadata = {
  title: config.businessName,
  description: config.subtagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Accent color CSS variables injected into :root at SSR time
  const accentStyles = `
    :root {
      --accent: ${config.accentColor};
      --accent-light: ${config.accentColorLight};
      --accent-dark: ${config.accentColorDark};
      --font-display-active: ${selectedFont.display};
      --font-body-active: ${selectedFont.body};
    }
  `;

  return (
    <html lang="en" className={fontVars}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: accentStyles }} />
      </head>
      <body className="min-h-screen flex flex-col bg-dark text-white antialiased" style={{ backgroundColor: "#14191F" }}>
        <div className="grain-overlay" aria-hidden="true" />

        {/* Design Spore branded demo bar — always at the very top */}
        <DemoBar
          businessName={config.businessName}
          bookingUrl={config.bookingUrl}
          tourSteps={config.tourSteps}
        />

        <main className="flex-1">{children}</main>

        {/* Floating chatbot widget */}
        <ChatbotWidget
          businessName={config.businessName}
          industry={config.industry}
        />

        {/* Guided tour — triggered by DemoBar */}
        <GuidedTour steps={config.tourSteps} />
      </body>
    </html>
  );
}
