import demoConfigRaw from "@/demo-config.json";
import type { DemoConfig } from "@/lib/demo-config";
import DemoHeader from "@/components/layout/DemoHeader";
import ChatbotWidget from "@/components/demo/ChatbotWidget";
import VariantSwitcher from "@/components/demo/VariantSwitcher";

const config = demoConfigRaw as DemoConfig & { address?: string; portalDemoUrl?: string; heroImageUrl?: string };

export default function HomePage() {
  return (
    <>
      <DemoHeader />
      <VariantSwitcher config={config} />
      <ChatbotWidget config={config} />
    </>
  );
}
