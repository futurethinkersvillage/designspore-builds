import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wells Gray Village",
  description: "A seasonal Smart Village on 400 acres near Wells Gray Provincial Park, BC. Sauna, makerspace, glamping, golf, forest school, and a community of builders and families.",
  openGraph: {
    title: "Wells Gray Village — Portal.Place",
    description: "A seasonal Smart Village on 400 acres near Wells Gray Provincial Park, BC.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
