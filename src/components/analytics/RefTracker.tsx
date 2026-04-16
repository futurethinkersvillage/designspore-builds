"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureUrlParams, trackEvent } from "@/lib/tracking";

const PATH_EVENT_MAP: Record<string, string> = {
  "/": "home_viewed",
  "/about": "about_viewed",
  "/videos": "video_page_viewed",
  "/one-pager": "one_pager_viewed",
  "/deck": "deck_viewed",
  "/investor-print": "investor_print_viewed",
  "/investor-login": "investor_login_viewed",
  "/membership": "membership_viewed",
  "/host": "host_viewed",
  "/partner": "partner_viewed",
  "/rhythm": "rhythm_viewed",
  "/immersion": "immersion_viewed",
  "/consulting": "consulting_viewed",
  "/media-kit": "media_kit_viewed",
  "/workstay": "workstay_viewed",
  "/gallery": "gallery_viewed",
  "/roadmap": "roadmap_viewed",
  "/contact": "contact_viewed",
  "/village": "village_viewed",
  "/village-ai": "village_ai_viewed",
};

function eventTypeFor(path: string): string {
  if (PATH_EVENT_MAP[path]) return PATH_EVENT_MAP[path];
  if (path.startsWith("/tour")) return "tour_viewed";
  if (path.startsWith("/village-dashboard")) return "dashboard_viewed";
  return "page_viewed";
}

export function RefTracker() {
  const pathname = usePathname();

  useEffect(() => { captureUrlParams(); }, []);

  useEffect(() => {
    if (!pathname) return;
    trackEvent(eventTypeFor(pathname), { path: pathname });
  }, [pathname]);

  return null;
}
