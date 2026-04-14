"use client";

import React, { useEffect, useRef } from "react";

// Scene types matching iPanorama data
export type SceneType = "sphere" | "flat";

export interface HotspotLink {
  nodeId: string;
  yaw: number;
  pitch: number;
  title: string;
  externalUrl?: string;
}

export interface TourScene {
  id: string;
  title: string;
  type: SceneType;
  image: string;
  initialYaw?: number;
  initialPitch?: number;
  initialZoom?: number;
  links: HotspotLink[];
}

interface VirtualTourProps {
  scenes: TourScene[];
  startSceneId?: string;
  className?: string;
  onSceneChange?: (sceneId: string) => void;
}

type VTPType = {
  addEventListener: (event: string, cb: (e: { node: { id: string } }) => void) => void;
  setCurrentNode: (id: string) => void;
};

type MPType = {
  clearMarkers: () => void;
  addMarker: (m: object) => void;
};

export default function VirtualTour({
  scenes,
  startSceneId,
  className = "",
  onSceneChange,
}: VirtualTourProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<{ destroy: () => void; getPlugin: (p: unknown) => unknown } | null>(null);
  const vtpRef = useRef<VTPType | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Initial viewer creation
  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    async function init() {
      try {
      const { Viewer } = await import("@photo-sphere-viewer/core");
      const { VirtualTourPlugin } = await import("@photo-sphere-viewer/virtual-tour-plugin");
      const { MarkersPlugin } = await import("@photo-sphere-viewer/markers-plugin");

      if (destroyed || !containerRef.current) return;

      const startScene = scenes.find((s) => s.id === startSceneId) ?? scenes[0];

      const nodes = scenes.map((scene) => ({
        id: scene.id,
        panorama: scene.image,
        name: scene.title,
        panoData: scene.type === "flat" ? { isEquirectangular: false } : undefined,
        links: scene.links
          .filter((l) => !l.externalUrl)
          .map((link) => ({
            nodeId: link.nodeId,
            position: { yaw: `${link.yaw}deg`, pitch: `${link.pitch}deg` },
            name: link.title,
          })),
      }));

      const viewer = new Viewer({
        container: containerRef.current!,
        panorama: startScene.image,
        defaultYaw: startScene.initialYaw ? `${startScene.initialYaw}deg` : undefined,
        defaultPitch: startScene.initialPitch ? `${startScene.initialPitch}deg` : undefined,
        defaultZoomLvl: 50,
        navbar: ["autorotate", "zoom", "caption", "fullscreen"],
        plugins: [
          [
            VirtualTourPlugin,
            {
              nodes,
              startNodeId: startScene.id,
              renderMode: "3d",
              arrowsPosition: { minPitch: -90 },
            },
          ],
          [MarkersPlugin, { markers: [] }],
        ],
        touchmoveTwoFingers: false,
        mousewheelCtrlKey: false,
      });

      viewerRef.current = viewer as typeof viewerRef.current;

      const vtp = viewer.getPlugin(VirtualTourPlugin) as unknown as VTPType | null;
      vtpRef.current = vtp ?? null;

      if (vtp) {
        vtp.addEventListener("node-changed", ({ node }: { node: { id: string } }) => {
          onSceneChange?.(node.id);

          const scene = scenes.find((s) => s.id === node.id);
          if (!scene) return;
          const mp = viewer.getPlugin(MarkersPlugin) as unknown as MPType | null;
          if (!mp) return;
          mp.clearMarkers();
          scene.links
            .filter((l) => l.externalUrl)
            .forEach((link) => {
              mp.addMarker({
                id: `ext-${link.title}`,
                position: { yaw: `${link.yaw}deg`, pitch: `${link.pitch}deg` },
                html: `<div class="psv-ext-marker">${link.title} ↗</div>`,
                data: { externalUrl: link.externalUrl },
              });
            });
        });
      }
      } catch (err) {
        if (!destroyed) {
          console.error("VirtualTour init failed:", err);
          setError("The 360° viewer couldn't load. Your browser may not support WebGL.");
        }
      }
    }

    init();

    return () => {
      destroyed = true;
      vtpRef.current = null;
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate to a new scene when startSceneId changes (after mount)
  // MUST be before any conditional return to satisfy React hooks rules
  const prevSceneId = useRef(startSceneId);
  useEffect(() => {
    if (startSceneId && startSceneId !== prevSceneId.current && vtpRef.current) {
      vtpRef.current.setCurrentNode(startSceneId);
    }
    prevSceneId.current = startSceneId;
  }, [startSceneId]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-warm-dark`} style={{ width: "100%", height: "100%" }}>
        <div className="text-center px-6 max-w-sm">
          <p className="text-white/60 text-sm mb-4">{error}</p>
          <a href="/videos" className="text-amber text-sm underline underline-offset-2">
            Watch video walkthroughs instead →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
