import {
  House, ChartLine, Scales, Briefcase, Kanban, Backpack,
  UsersThree, CalendarBlank, Crown, Plant, GlobeHemisphereWest,
  Lightning, Heartbeat, ChatTeardrop, Storefront, GearSix
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }>;
}

export const navItems: NavItem[] = [
  { label: "Overview", href: "/village-dashboard", icon: House },
  { label: "Fundraising", href: "/village-dashboard/fundraising", icon: ChartLine },
  { label: "Governance", href: "/village-dashboard/governance", icon: Scales },
  { label: "Operations", href: "/village-dashboard/operations", icon: Briefcase },
  { label: "Tasks", href: "/village-dashboard/tasks", icon: Kanban },
  { label: "Work-Stay", href: "/village-dashboard/workstay", icon: Backpack },
  { label: "Members", href: "/village-dashboard/members", icon: UsersThree },
  { label: "Events", href: "/village-dashboard/events", icon: CalendarBlank },
  { label: "Membership", href: "/village-dashboard/membership", icon: Crown },
  { label: "Farm & IoT", href: "/village-dashboard/farm", icon: Plant },
  { label: "Village Map", href: "/village-dashboard/map", icon: GlobeHemisphereWest },
  { label: "Energy", href: "/village-dashboard/energy", icon: Lightning },
  { label: "Wellness", href: "/village-dashboard/wellness", icon: Heartbeat },
  { label: "Comms", href: "/village-dashboard/communications", icon: ChatTeardrop },
  { label: "Marketplace", href: "/village-dashboard/marketplace", icon: Storefront },
  { label: "Settings", href: "/village-dashboard/settings", icon: GearSix },
];
