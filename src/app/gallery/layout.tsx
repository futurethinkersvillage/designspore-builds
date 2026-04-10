import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Wells Gray Village — land, infrastructure, community, and seasons. 400 acres in Interior BC.",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
