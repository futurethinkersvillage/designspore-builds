import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panorama Tour",
  description: "Explore Wells Gray Village in 360°. Panoramic tours of the sauna, cabins, gazebo, lake, and more — all on 400 acres near Wells Gray Provincial Park.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
