// Maps a funding tier ($M) to a build-status + phase label for investor clarity.

export interface NodeStatus {
  label: string; // Built / In progress / Planned / Vision
  phase: string; // Near-term / Phase 2 / Phase 3 / Network
  color: string;
}

export function statusForTier(tier: number): NodeStatus {
  if (tier <= 3) return { label: "Built", phase: "Near-term", color: "#86a86d" };
  if (tier <= 6) return { label: "In progress", phase: "Phase 2", color: "#ea824e" };
  if (tier <= 20) return { label: "Planned", phase: "Phase 3", color: "#7c93c6" };
  return { label: "Vision", phase: "Network", color: "#b97fa8" };
}

/** Phase label for a funding-slider tier value. */
export function phaseLabelForTier(tier: number): string {
  return statusForTier(tier).phase;
}
