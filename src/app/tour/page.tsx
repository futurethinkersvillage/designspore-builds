"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { TourScene } from "@/components/tour/VirtualTour";

const VirtualTour = dynamic(() => import("@/components/tour/VirtualTour"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-warm-dark">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" />
        <p className="text-sm text-white/40">Loading tour…</p>
      </div>
    </div>
  ),
});

const BASE = "/images/tour";

const SCENE_INFO: Record<string, string> = {
  "top-view":       "Drone view of the full 400-acre property. Click hotspots to explore.",
  "sauna":          "Cedar barrel sauna with cold plunge in the creek nearby. Open to members daily.",
  "cabin-3":        "One of three on-site cabins available for stays. Rustic and cozy.",
  "shower-house":   "Shared shower and washroom facilities for campers and guests.",
  "Gazebo":         "The main community gazebo — gatherings, workshops, and campfires happen here.",
  "trophy-mountain":"Trophy Mountain rises behind the village. Over 2,600m with year-round snow.",
  "Winter":         "The village in winter. The property operates year-round in a quieter mode.",
  "Dome-Interior":  "Interior of the geodesic dome — used for events, workshops, and community gatherings.",
  "Lake-and-Field": "The swimming lake and open field adjacent to the dome structure.",
  "Campsite":       "Creekside campsites with picnic areas. RV hookups and tenting available.",
};

const SCENES: TourScene[] = [
  {
    id: "top-view",
    title: "Top View",
    type: "sphere",
    image: `${BASE}/Golf-Course-Above2.jpg`,
    initialYaw: 288.20, initialPitch: -90,
    links: [
      { nodeId: "sauna",           yaw: 159.168, pitch: -78.029, title: "Sauna" },
      { nodeId: "cabin-3",         yaw: 165.606, pitch: -72.546, title: "Cabin 3" },
      { nodeId: "shower-house",    yaw: 349.615, pitch: -83.672, title: "Shower House" },
      { nodeId: "Gazebo",          yaw: 214.472, pitch: -42.721, title: "Gazebo" },
      { nodeId: "trophy-mountain", yaw: 111.920, pitch:   3.885, title: "Trophy Mountain" },
      { nodeId: "Winter",          yaw: 101.804, pitch: -73.602, title: "Winter" },
      { nodeId: "Dome-Interior",   yaw: 174.684, pitch: -69.166, title: "Dome Interior" },
      { nodeId: "Lake-and-Field",  yaw: 156.072, pitch: -62.175, title: "Lake & Field" },
      { nodeId: "Campsite",        yaw:   4.597, pitch: -70.377, title: "Campsite" },
      {
        nodeId: "dev-concept",
        yaw: 349.507, pitch: -54.865,
        title: "Development Concept ↗",
        externalUrl: "https://marble.worldlabs.ai/world/d5d9bd70-302a-400c-a34f-693aa2783895",
      },
    ],
  },
  {
    id: "sauna",
    title: "Sauna",
    type: "sphere",
    image: `${BASE}/Sauna-1_PANO_0001-Sauna-1_PANO_0035_blended_fused.jpg`,
    initialYaw: 41.44, initialPitch: -15.35,
    links: [
      { nodeId: "top-view",     yaw:  94.762, pitch:  25.730, title: "Top View" },
      { nodeId: "cabin-3",      yaw: 153.744, pitch:   3.274, title: "Cabin 3" },
      { nodeId: "shower-house", yaw: 310.208, pitch:   7.800, title: "Shower House" },
      { nodeId: "Gazebo",       yaw: 195.835, pitch:  -1.610, title: "Gazebo" },
    ],
  },
  {
    id: "cabin-3",
    title: "Cabin 3",
    type: "sphere",
    image: `${BASE}/Cabin-3.2_PANO_0001-Cabin-3-2-1.jpg`,
    initialYaw: 0, initialPitch: 0,
    links: [
      { nodeId: "sauna",          yaw: 161.403, pitch:  -3.069, title: "Sauna" },
      { nodeId: "top-view",       yaw: 168.277, pitch:  33.080, title: "Top View" },
      { nodeId: "Dome-Interior",  yaw: 343.828, pitch:  -6.512, title: "Dome Interior" },
      { nodeId: "Lake-and-Field", yaw: 281.192, pitch:  -1.945, title: "Lake & Field" },
    ],
  },
  {
    id: "shower-house",
    title: "Shower House",
    type: "sphere",
    image: `${BASE}/Shower-House-1_PANO_0001-Shower-House-1_PANO_0035_blended_fused-2-1.jpg`,
    initialYaw: 319.11, initialPitch: -15.69,
    links: [
      { nodeId: "top-view", yaw: 286.829, pitch: 26.504, title: "Top View" },
    ],
  },
  {
    id: "Gazebo",
    title: "Gazebo",
    type: "sphere",
    image: `${BASE}/Gazebo-5_PANO_0001-Gazebo-5_PANO_0035_blended_fused-2-1.jpg`,
    initialYaw: 222.49, initialPitch: -30.83,
    links: [
      { nodeId: "top-view", yaw: 246.296, pitch: -18.953, title: "Top View" },
    ],
  },
  {
    id: "trophy-mountain",
    title: "Trophy Mountain",
    type: "sphere",
    image: `${BASE}/TrophyMountain_blended_fused-2-1.jpg`,
    initialYaw: 0, initialPitch: 0,
    links: [
      { nodeId: "top-view", yaw: 303.520, pitch: -9.052, title: "Wells Gray Resort" },
    ],
  },
  {
    id: "Winter",
    title: "Winter",
    type: "sphere",
    image: `${BASE}/Winter15-2-1.jpg`,
    initialYaw: 259.13, initialPitch: -81.42,
    links: [
      { nodeId: "top-view", yaw: 156.515, pitch: -63.088, title: "Summer View" },
    ],
  },
  {
    id: "Dome-Interior",
    title: "Dome Interior",
    type: "flat",
    image: `${BASE}/Dome-Interior-1.jpg`,
    links: [
      { nodeId: "top-view", yaw: 0, pitch: 0, title: "Top View" },
    ],
  },
  {
    id: "Lake-and-Field",
    title: "Lake and Field",
    type: "sphere",
    image: `${BASE}/DomeLake1_blended_fused-2-1.jpg`,
    initialYaw: 35.59, initialPitch: -11.86,
    links: [
      { nodeId: "top-view",      yaw:  43.562, pitch:  26.857, title: "Top View" },
      { nodeId: "cabin-3",       yaw: 249.368, pitch:  -2.696, title: "Cabin 3" },
      { nodeId: "Dome-Interior", yaw: 216.402, pitch: -44.013, title: "Dome Interior" },
    ],
  },
  {
    id: "Campsite",
    title: "Campsite",
    type: "flat",
    image: `${BASE}/Picnic-Tables-at-the-Creek.jpg`,
    links: [
      { nodeId: "top-view", yaw: 0, pitch: 0, title: "Top View" },
    ],
  },
];

export default function TourPage() {
  const [activeSceneId, setActiveSceneId] = useState("top-view");
  const [showHint, setShowHint] = useState(true);
  const searchParams = useSearchParams();
  const debugMode = searchParams.get("debug") === "1";

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    const dismiss = () => { setShowHint(false); clearTimeout(timer); };
    window.addEventListener("pointerdown", dismiss, { once: true });
    return () => { clearTimeout(timer); window.removeEventListener("pointerdown", dismiss); };
  }, []);

  const activeScene = SCENES.find((s) => s.id === activeSceneId);

  return (
    <div className="fixed inset-0 flex flex-col bg-warm-dark">
      {/* Tour viewer */}
      <div className="relative flex-1 overflow-hidden">
        <VirtualTour
          scenes={SCENES}
          startSceneId={activeSceneId}
          onSceneChange={setActiveSceneId}
          className="h-full w-full"
          debug={debugMode}
        />

        {/* Scene label + description overlay */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 p-4 pt-20 max-w-xs">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            Wells Gray Village
          </p>
          <p className="mt-0.5 text-sm font-medium text-white">
            {activeScene?.title ?? "Virtual Tour"}
          </p>
          {activeSceneId && SCENE_INFO[activeSceneId] && (
            <p className="mt-1.5 text-xs leading-relaxed text-white/45">
              {SCENE_INFO[activeSceneId]}
            </p>
          )}
        </div>

        {/* Keyboard / drag hint */}
        {showHint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 flex justify-center">
            <div className="rounded-full bg-black/60 px-4 py-2 text-xs text-white/60 backdrop-blur-sm">
              Drag to look around · Click markers to navigate
            </div>
          </div>
        )}
      </div>

      {/* Scene thumbnail strip */}
      <div className="flex h-20 shrink-0 items-center gap-2 overflow-x-auto border-t border-white/10 bg-black/60 px-4 backdrop-blur-sm">
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setActiveSceneId(scene.id)}
            className={`group relative h-14 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg border transition-all ${
              activeSceneId === scene.id
                ? "border-amber ring-1 ring-amber/40"
                : "border-white/10 hover:border-white/30"
            }`}
            aria-label={`Go to ${scene.title}`}
            aria-pressed={activeSceneId === scene.id}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={scene.image}
              alt={scene.title}
              className="h-full w-full object-cover brightness-75 transition-all group-hover:brightness-90"
            />
            <span className="absolute inset-x-0 bottom-0 line-clamp-1 bg-black/60 px-1.5 py-1 text-[10px] leading-tight text-white/80">
              {scene.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
