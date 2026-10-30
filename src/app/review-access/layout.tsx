import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function ReviewAccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
