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
  /** Called every time the viewer position changes (yaw/pitch in degrees) */
  onPositionChange?: (pos: { yaw: number; pitch: number }) => void;
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
  onPositionChange,
  debug = false,
}: VirtualTourProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ViewerType | null>(null);
  const vtpRef = useRef<VTPType | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [debugPos, setDebugPos] = React.useState<{ yaw: number; pitch: number } | null>(null);
  // When non-null, the active scene is a flat photo — PSV is hidden, we show a plain img
  const [flatScene, setFlatScene] = React.useState<{ image: string; links: HotspotLink[] } | null>(null);

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
        // No built-in arrows — all hotspots rendered as pin markers via MarkersPlugin
        links: [],
      }));

      const viewer = new Viewer({
        container: containerRef.current!,
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

          if (scene?.type === "flat") {
            // Hide PSV, show plain image overlay — no sphere projection
            setFlatScene({ image: scene.image, links: scene.links });
            if (mp) mp.clearMarkers();
          } else {
            setFlatScene(null);
            // Restore to the scene's preferred starting angle (or equator if unset)
            const yaw = scene?.initialYaw ?? 0;
            const pitch = scene?.initialPitch ?? 0;
            (viewer as unknown as ViewerType).rotate({
              yaw: `${yaw}deg`,
              pitch: `${pitch}deg`,
            });
            setSceneMarkers(node.id);
          }
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

      // Position change: feed debug overlay + parent callback
      (viewer as unknown as ViewerType).addEventListener("position-updated", () => {
        const pos = (viewer as unknown as ViewerType).getPosition();
        const toDeg = (r: number) => Math.round((r * 180) / Math.PI * 100) / 100;
        const deg = { yaw: toDeg(pos.yaw), pitch: toDeg(pos.pitch) };
        if (debug) setDebugPos(deg);
        onPositionChange?.(deg);
      });

      // Set initial flat scene if startScene is flat
      if (startScene.type === "flat") {
        setFlatScene({ image: startScene.image, links: startScene.links });
      } else {
        setSceneMarkers(startScene.id);
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
      {/* PSV container — hidden (not unmounted) when showing a flat photo */}
      <div
        ref={containerRef}
        className={className}
        style={{ width: "100%", height: "100%", visibility: flatScene ? "hidden" : "visible" }}
      />

      {/* Flat photo overlay — rendered outside PSV so there's zero sphere projection */}
      {flatScene && (
        <div className="flat-scene-overlay">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={flatScene.image} alt="" className="flat-scene-img" />
          <div className="flat-scene-pins">
            {flatScene.links.map((link) => (
              <button
                key={link.nodeId ?? link.title}
                className={`tour-pin${link.externalUrl ? " tour-pin--ext" : ""}`}
                onClick={() => {
                  if (link.externalUrl) window.open(link.externalUrl, "_blank", "noopener,noreferrer");
                  else vtpRef.current?.setCurrentNode(link.nodeId);
                }}
              >
                <div className="tour-pin__dot" />
                <span className="tour-pin__label">{link.title}{link.externalUrl ? " ↗" : ""}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Debug overlay */}
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
