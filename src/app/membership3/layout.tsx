import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founders Membership — Wells Gray Village",
  description: "50 founding spots. Non-voting equity stake + free seasonal stays at Wells Gray Village, BC. Break ground at 30 committed. Benefits begin 2027.",
  openGraph: {
    title: "Founders Membership — Wells Gray Village",
    description: "50 founding spots. Equity stake + free stays. Break ground at 30 committed. Benefits begin 2027.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
