import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Mike Gilliland and Euvie Ivanova — the founders of Portal.Place. A decade of Future Thinkers, 5 years operating Wells Gray Resort, now building the first Smart Village prototype.",
  openGraph: {
    title: "About — Portal.Place",
    description: "The founders and story behind Portal.Place.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
