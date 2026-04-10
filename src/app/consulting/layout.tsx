import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consulting",
  description: "Smart village design, community systems, investor narratives, and AI strategy with Mike Gilliland — founder of Future Thinkers (10M+ downloads) and Portal.Place.",
  openGraph: {
    title: "Consulting — Portal.Place",
    description: "Smart village consulting with Mike Gilliland.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
