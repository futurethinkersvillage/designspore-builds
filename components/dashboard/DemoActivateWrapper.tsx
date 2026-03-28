"use client";

import { useDemoQueue } from "./DemoQueueProvider";
import ActivateButton from "./ActivateButton";
import type { ModuleTier } from "@/lib/modules";

interface Props {
  moduleId: string;
  moduleName: string;
  tier: ModuleTier;
  creditsNeeded: number;
}

export default function DemoActivateWrapper({ moduleId, moduleName, tier, creditsNeeded }: Props) {
  const { addToQueue, removeFromQueue, isQueued } = useDemoQueue();

  return (
    <ActivateButton
      moduleId={moduleId}
      moduleName={moduleName}
      tier={tier}
      creditsNeeded={creditsNeeded}
      isActivated={false}
      isDemo
      isQueued={isQueued(moduleId)}
      onDemoAdd={() => addToQueue(moduleId)}
      onDemoRemove={() => removeFromQueue(moduleId)}
    />
  );
}
