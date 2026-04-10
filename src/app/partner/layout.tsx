import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner & Invest",
  description: "Invest in the first Smart Village prototype in BC. $3M bridge round open. Secured by land, 5 years operating, led by proven founders.",
  openGraph: {
    title: "Partner & Invest — Portal.Place",
    description: "Invest in the first Smart Village prototype in BC.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
