import ModelGallery from "./ModelGallery";
import { getVisibleModels, adminEnabled } from "@/lib/models.server";

export const metadata = {
  title: "3D Modeling — Mike Gilliland",
  description:
    "3D modeling work by Mike Gilliland — Fusion 360 designs, functional prints, and fabrication experiments, viewable in the browser.",
};

// Read runtime hide/show state on each request; hidden models are stripped
// server-side so they never reach a non-admin visitor.
export const dynamic = "force-dynamic";

export default function ThreeDPage() {
  return (
    <ModelGallery
      initialModels={getVisibleModels()}
      adminAvailable={adminEnabled()}
    />
  );
}
