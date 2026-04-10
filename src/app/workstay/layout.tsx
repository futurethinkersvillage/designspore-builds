import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work-Stay Program 2026",
  description: "Live and build at Portal.Place for a season. The Village Builder program is a contribution-based residency — hands-on work in exchange for accommodation and community.",
  openGraph: {
    title: "Work-Stay Program 2026 — Portal.Place",
    description: "Live and build at Portal.Place for a season.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
