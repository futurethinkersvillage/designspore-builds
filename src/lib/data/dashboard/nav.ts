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
  { label: "Overview", href: "/", icon: House },
  { label: "Fundraising", href: "/fundraising", icon: ChartLine },
  { label: "Governance", href: "/governance", icon: Scales },
  { label: "Operations", href: "/operations", icon: Briefcase },
  { label: "Tasks", href: "/tasks", icon: Kanban },
  { label: "Work-Stay", href: "/workstay", icon: Backpack },
  { label: "Members", href: "/members", icon: UsersThree },
  { label: "Events", href: "/events", icon: CalendarBlank },
  { label: "Membership", href: "/membership", icon: Crown },
  { label: "Farm & IoT", href: "/farm", icon: Plant },
  { label: "Village Map", href: "/map", icon: GlobeHemisphereWest },
  { label: "Energy", href: "/energy", icon: Lightning },
  { label: "Wellness", href: "/wellness", icon: Heartbeat },
  { label: "Comms", href: "/communications", icon: ChatTeardrop },
  { label: "Marketplace", href: "/marketplace", icon: Storefront },
  { label: "Settings", href: "/settings", icon: GearSix },
];
