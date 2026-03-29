"use client";

import { useDemoQueue } from "./DemoQueueProvider";
import { getModuleById, creditsForModule } from "@/lib/modules";
import AllocationMeter from "./AllocationMeter";

export default function DemoTopbarCredits({ creditsTotal }: { creditsTotal: number }) {
  const { entries } = useDemoQueue();
  const creditsUsed = entries.reduce((sum, e) => {
    const mod = getModuleById(e.moduleId);
    return sum + (mod ? creditsForModule(mod) : 0);
  }, 0);
  return <AllocationMeter creditsUsed={creditsUsed} creditsTotal={creditsTotal} compact />;
}
