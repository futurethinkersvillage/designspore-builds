import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founding Membership — Wells Gray Village",
  description: "Become one of 60 founding families at Wells Gray Village — 400 acres bordering Wells Gray Provincial Park. Two guaranteed weeks, the cabins, and a place in a growing network. An access membership.",
  openGraph: {
    title: "Founding Membership — Wells Gray Village",
    description: "60 founding families. Two guaranteed weeks, the cabins, and a place in a growing network at Wells Gray Village, BC.",
  },
  twitter: {
    title: "Founding Membership — Wells Gray Village",
    description: "60 founding families. Two guaranteed weeks, the cabins, and a place in a growing network at Wells Gray Village, BC.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
