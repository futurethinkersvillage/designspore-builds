import {
  House, ChartLine, Scales, Briefcase, Kanban, Backpack,
  UsersThree, CalendarBlank, Crown, Plant, GlobeHemisphereWest,
  Lightning, Heartbeat, ChatTeardrop, Storefront, GearSix, Robot, Scroll
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; weight?: "light" | "regular" | "bold" | "fill"; className?: string }>;
  /** Demo notification badge count */
  badge?: number;
}

export const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: House },
  { label: "Fundraising", href: "/fundraising", icon: ChartLine },
  { label: "Governance", href: "/governance", icon: Scales, badge: 5 },
  { label: "Operations", href: "/operations", icon: Briefcase },
  { label: "Tasks", href: "/tasks", icon: Kanban, badge: 3 },
  { label: "Work-Stay", href: "/workstay", icon: Backpack },
  { label: "Members", href: "/members", icon: UsersThree },
  { label: "Events", href: "/events", icon: CalendarBlank, badge: 2 },
  { label: "Membership", href: "/membership", icon: Crown },
  { label: "Farm & IoT", href: "/farm", icon: Plant, badge: 1 },
  { label: "Network Map", href: "/map", icon: GlobeHemisphereWest },
  { label: "Energy", href: "/energy", icon: Lightning },
  { label: "Wellness", href: "/wellness", icon: Heartbeat },
  { label: "Comms", href: "/communications", icon: ChatTeardrop, badge: 4 },
  { label: "Marketplace", href: "/marketplace", icon: Storefront },
  { label: "Village Soul", href: "/soul", icon: Scroll },
  { label: "Agents", href: "/agents", icon: Robot },
  { label: "Settings", href: "/settings", icon: GearSix },
];
