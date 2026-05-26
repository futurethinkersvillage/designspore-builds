import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate — Future Thinkers Foundation",
  description:
    "Support the Future Thinkers Foundation with a crypto donation. Bitcoin and Ethereum addresses for donations to our non-profit supporting Smart Village education and community development.",
  openGraph: {
    title: "Donate — Future Thinkers Foundation",
    description:
      "Support the Future Thinkers Foundation with a crypto donation. Non-profit arm of Portal.Place.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
