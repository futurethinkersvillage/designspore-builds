import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founding Membership — Wells Gray Village",
  description: "A founding stake in a 400-acre village bordering Wells Gray Provincial Park — free weeks every season, for life. 50 founding spots, reserved with a fully refundable deposit.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
