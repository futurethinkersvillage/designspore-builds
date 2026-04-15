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
  /** Pass true (or add ?debug=1 to URL) to show live yaw/pitch overlay for calibrating hotspot positions */
  debug?: boolean;
}

type VTPType = {
  addEventListener: (event: string, cb: (e: { node: { id: string } }) => void) => void;
  setCurrentNode: (id: string) => void;
};

type MPType = {
  clearMarkers: () => void;
  addMarker: (m: object) => void;
  addEventListener: (event: string, cb: (e: { marker: { id: string; data?: Record<string, unknown> } }) => void) => void;
};

type ViewerType = {
  destroy: () => void;
  getPlugin: (p: unknown) => unknown;
  getPosition: () => { yaw: number; pitch: number };
  rotate: (position: { yaw: string; pitch: string }) => void;
  addEventListener: (event: string, cb: () => void) => void;
};

export default function VirtualTour({
  scenes,
  startSceneId,
  className = "",
  onSceneChange,
  debug = false,
}: VirtualTourProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ViewerType | null>(null);
  const vtpRef = useRef<VTPType | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [debugPos, setDebugPos] = React.useState<{ yaw: number; pitch: number } | null>(null);

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

      // For flat (non-360) photos, tell PSV to treat the image as covering ~100°
      // of horizontal FOV rather than wrapping it around the full sphere.
      const flatPanoData = (image: HTMLImageElement) => {
        const hFovDeg = 100;
        const fullWidth = Math.round(image.naturalWidth * (360 / hFovDeg));
        const fullHeight = Math.round(fullWidth / 2); // equirectangular is always 2:1
        return {
          fullWidth,
          fullHeight,
          croppedWidth: image.naturalWidth,
          croppedHeight: image.naturalHeight,
          croppedX: Math.round((fullWidth - image.naturalWidth) / 2),
          croppedY: Math.round((fullHeight - image.naturalHeight) / 2),
        };
      };

      const nodes = scenes.map((scene) => ({
        id: scene.id,
        panorama: scene.image,
        name: scene.title,
        panoData: scene.type === "flat" ? flatPanoData : undefined,
        // No built-in arrows — all hotspots rendered as pin markers via MarkersPlugin
        links: [],
      }));

      const viewer = new Viewer({
        container: containerRef.current!,
        // No panorama here — VirtualTourPlugin owns the initial load via startNodeId.
        // Passing panorama AND startNodeId causes a double-load race that stalls the loader.
        ...(startScene.initialYaw !== undefined && { defaultYaw: `${startScene.initialYaw}deg` }),
        ...(startScene.initialPitch !== undefined && { defaultPitch: `${startScene.initialPitch}deg` }),
        defaultZoomLvl: 50,
        navbar: ["autorotate", "zoom", "caption", "fullscreen"],
        plugins: [
          [
            VirtualTourPlugin,
            {
              nodes,
              startNodeId: startScene.id,
              renderMode: "3d",
            },
          ],
          [MarkersPlugin, { markers: [] }],
        ],
        touchmoveTwoFingers: false,
        mousewheelCtrlKey: false,
      });

      viewerRef.current = viewer as unknown as ViewerType;

      const vtp = viewer.getPlugin(VirtualTourPlugin) as unknown as VTPType | null;
      vtpRef.current = vtp ?? null;

      const mp = viewer.getPlugin(MarkersPlugin) as unknown as MPType | null;

      function setSceneMarkers(sceneId: string) {
        if (!mp) return;
        const scene = scenes.find((s) => s.id === sceneId);
        if (!scene) return;
        mp.clearMarkers();
        scene.links.forEach((link) => {
          const isExternal = !!link.externalUrl;
          mp.addMarker({
            id: `nav-${link.nodeId ?? link.title}`,
            position: { yaw: `${link.yaw}deg`, pitch: `${link.pitch}deg` },
            html: `<div class="tour-pin${isExternal ? " tour-pin--ext" : ""}">
              <div class="tour-pin__dot"></div>
              <span class="tour-pin__label">${link.title}${isExternal ? " ↗" : ""}</span>
            </div>`,
            data: { nodeId: link.nodeId, externalUrl: link.externalUrl },
          });
        });
      }

      if (vtp) {
        vtp.addEventListener("node-changed", ({ node }: { node: { id: string } }) => {
          onSceneChange?.(node.id);
          const scene = scenes.find((s) => s.id === node.id);
          if (scene?.initialYaw !== undefined && scene?.initialPitch !== undefined) {
            (viewer as unknown as ViewerType).rotate({
              yaw: `${scene.initialYaw}deg`,
              pitch: `${scene.initialPitch}deg`,
            });
          }
          setSceneMarkers(node.id);
        });
      }

      if (mp) {
        mp.addEventListener("select-marker", ({ marker }) => {
          const { nodeId, externalUrl } = (marker.data ?? {}) as { nodeId?: string; externalUrl?: string };
          if (externalUrl) {
            window.open(externalUrl, "_blank", "noopener,noreferrer");
          } else if (nodeId && vtp) {
            vtp.setCurrentNode(nodeId);
          }
        });
      }

      // Populate markers for the initial scene once it loads
      if (vtp) {
        // node-changed fires on first load too, but set eagerly in case timing differs
        setSceneMarkers(startScene.id);
      }

      // Debug overlay: update yaw/pitch on every position change
      if (debug) {
        (viewer as unknown as ViewerType).addEventListener("position-updated", () => {
          const pos = (viewer as unknown as ViewerType).getPosition();
          const toDeg = (r: number) => Math.round((r * 180) / Math.PI * 100) / 100;
          setDebugPos({ yaw: toDeg(pos.yaw), pitch: toDeg(pos.pitch) });
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
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={containerRef}
        className={className}
        style={{ width: "100%", height: "100%" }}
      />
      {debug && debugPos && (
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 100,
          background: "rgba(0,0,0,0.75)", color: "#fff", fontFamily: "monospace",
          fontSize: 13, padding: "8px 12px", borderRadius: 6, pointerEvents: "none",
          lineHeight: 1.6,
        }}>
          <div>yaw: <b>{debugPos.yaw}°</b></div>
          <div>pitch: <b>{debugPos.pitch}°</b></div>
          <div style={{ marginTop: 4, fontSize: 11, opacity: 0.6 }}>drag to calibrate hotspots</div>
        </div>
      )}
    </div>
  );
}
