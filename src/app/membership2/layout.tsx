import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founders Membership — Wells Gray Village",
  description: "Your family's summer home for life. 400 acres bordering Wells Gray Provincial Park — non-voting equity stake, free seasonal cabin stays, lifetime access. 50 founding spots.",
  openGraph: {
    title: "Founders Membership — Wells Gray Village",
    description: "50 founding spots. Equity stake + free cabin stays every season for life. Wells Gray Village, BC.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
