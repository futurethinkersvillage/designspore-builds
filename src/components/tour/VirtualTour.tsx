"use client";

import React, { useEffect, useRef } from "react";

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
  /** Property boundary polygon — array of [yaw, pitch] in degrees */
  boundary?: [number, number][];
  links: HotspotLink[];
}

interface VirtualTourProps {
  scenes: TourScene[];
  startSceneId?: string;
  className?: string;
  onSceneChange?: (sceneId: string) => void;
  /** Called every time the viewer position or zoom changes */
  onPositionChange?: (pos: { yaw: number; pitch: number; zoom: number }) => void;
  /** Called when the user clicks the panorama (not on a marker). Coords in degrees. */
  onViewerClick?: (pos: { yaw: number; pitch: number }) => void;
  /** Show draggable vertex handles on the boundary polygon */
  showVertexHandles?: boolean;
  /** Index of the currently selected vertex (highlighted in blue) */
  selectedVertexIndex?: number;
  /** Called when a non-nav marker is clicked (e.g. a vertex handle) */
  onMarkerClick?: (id: string, data: unknown) => void;
  debug?: boolean;
}

type VTPType = {
  addEventListener: (event: string, cb: (e: { node: { id: string } }) => void) => void;
  setCurrentNode: (id: string) => void;
};

type MPType = {
  clearMarkers: () => void;
  addMarker: (m: object) => void;
  updateMarker: (m: object) => void;
  removeMarker: (id: string) => void;
  getMarker: (id: string) => object | null;
  addEventListener: (event: string, cb: (e: { marker: { id: string; data?: Record<string, unknown> } }) => void) => void;
};

type ViewerType = {
  destroy: () => void;
  getPlugin: (p: unknown) => unknown;
  getPosition: () => { yaw: number; pitch: number };
  getZoomLevel: () => number;
  rotate: (position: { yaw: string; pitch: string }) => void;
  zoom: (level: number) => void;
  addEventListener: (event: string, cb: (e: unknown) => void) => void;
};

export default function VirtualTour({
  scenes,
  startSceneId,
  className = "",
  onSceneChange,
  onPositionChange,
  onViewerClick,
  showVertexHandles = false,
  selectedVertexIndex,
  onMarkerClick,
  debug = false,
}: VirtualTourProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ViewerType | null>(null);
  const vtpRef = useRef<VTPType | null>(null);
  const scenesRef = useRef(scenes);
  const currentSceneIdRef = useRef(startSceneId);
  const setSceneMarkersRef = useRef<((sceneId: string) => void) | null>(null);
  const onViewerClickRef = useRef(onViewerClick);
  const onMarkerClickRef = useRef(onMarkerClick);
  const showVertexHandlesRef = useRef(showVertexHandles);
  const selectedVertexIndexRef = useRef(selectedVertexIndex);

  useEffect(() => { scenesRef.current = scenes; }, [scenes]);
  useEffect(() => { onViewerClickRef.current = onViewerClick; }, [onViewerClick]);
  useEffect(() => { onMarkerClickRef.current = onMarkerClick; }, [onMarkerClick]);
  useEffect(() => {
    showVertexHandlesRef.current = showVertexHandles;
    selectedVertexIndexRef.current = selectedVertexIndex;
    if (setSceneMarkersRef.current && currentSceneIdRef.current) {
      setSceneMarkersRef.current(currentSceneIdRef.current);
    }
  }, [showVertexHandles, selectedVertexIndex]);

  // Re-draw markers (including boundary polygon) when scenes prop changes (e.g. live drawing preview)
  useEffect(() => {
    if (setSceneMarkersRef.current && currentSceneIdRef.current) {
      setSceneMarkersRef.current(currentSceneIdRef.current);
    }
  }, [scenes]);

  const [error, setError] = React.useState<string | null>(null);
  const [debugPos, setDebugPos] = React.useState<{ yaw: number; pitch: number } | null>(null);
  const [flatScene, setFlatScene] = React.useState<{ image: string; links: HotspotLink[] } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;

    async function init() {
      try {
        const { Viewer } = await import("@photo-sphere-viewer/core");
        const { VirtualTourPlugin } = await import("@photo-sphere-viewer/virtual-tour-plugin");
        const { MarkersPlugin } = await import("@photo-sphere-viewer/markers-plugin");

        if (destroyed || !containerRef.current) return;

        const startScene = scenesRef.current.find((s) => s.id === startSceneId) ?? scenesRef.current[0];

        const nodes = scenesRef.current.map((scene) => ({
          id: scene.id,
          panorama: scene.image,
          name: scene.title,
          links: [],
        }));

        const viewer = new Viewer({
          container: containerRef.current!,
          ...(startScene.initialYaw !== undefined && { defaultYaw: `${startScene.initialYaw}deg` }),
          ...(startScene.initialPitch !== undefined && { defaultPitch: `${startScene.initialPitch}deg` }),
          defaultZoomLvl: startScene.initialZoom ?? 50,
          navbar: ["autorotate", "zoom", "caption", "fullscreen"],
          plugins: [
            [VirtualTourPlugin, { nodes, startNodeId: startScene.id, renderMode: "3d" }],
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
          const scene = scenesRef.current.find((s) => s.id === sceneId);
          if (!scene) return;
          mp.clearMarkers();

          // Navigation pins
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

          // Property boundary polygon
          if (scene.boundary && scene.boundary.length >= 3) {
            mp.addMarker({
              id: "property-boundary",
              polygon: scene.boundary.map(([y, p]) => [`${y}deg`, `${p}deg`]),
              svgStyle: {
                fill: "none",
                stroke: "rgba(234,130,78,0.85)",
                strokeWidth: "2px",
                strokeDasharray: "6 3",
              },
            });

            // Vertex handles (only in admin/edit mode)
            if (showVertexHandlesRef.current) {
              scene.boundary.forEach(([y, p], i) => {
                const isSelected = selectedVertexIndexRef.current === i;
                mp.addMarker({
                  id: `vertex-${i}`,
                  position: { yaw: `${y}deg`, pitch: `${p}deg` },
                  circle: 7,
                  svgStyle: {
                    fill: isSelected ? "#60a5fa" : "rgba(234,130,78,0.9)",
                    stroke: "#fff",
                    strokeWidth: "1.5px",
                  },
                  data: { isVertex: true, vertexIndex: i },
                  zIndex: 10,
                });
              });
            }
          }
        }

        setSceneMarkersRef.current = setSceneMarkers;

        if (vtp) {
          vtp.addEventListener("node-changed", ({ node }: { node: { id: string } }) => {
            currentSceneIdRef.current = node.id;
            onSceneChange?.(node.id);
            const scene = scenesRef.current.find((s) => s.id === node.id);

            if (scene?.type === "flat") {
              setFlatScene({ image: scene.image, links: scene.links });
              if (mp) mp.clearMarkers();
            } else {
              setFlatScene(null);
              const yaw = scene?.initialYaw ?? 0;
              const pitch = scene?.initialPitch ?? 0;
              const zoom = scene?.initialZoom ?? 50;
              (viewer as unknown as ViewerType).rotate({ yaw: `${yaw}deg`, pitch: `${pitch}deg` });
              (viewer as unknown as ViewerType).zoom(zoom);
              setSceneMarkers(node.id);
            }
          });
        }

        if (mp) {
          mp.addEventListener("select-marker", ({ marker }) => {
            const data = (marker.data ?? {}) as { nodeId?: string; externalUrl?: string; isVertex?: boolean };
            if (data.externalUrl) window.open(data.externalUrl, "_blank", "noopener,noreferrer");
            else if (data.nodeId && vtp) vtp.setCurrentNode(data.nodeId);
            else onMarkerClickRef.current?.(marker.id, marker.data);
          });
        }

        // Click on the sphere (not on a marker) → draw mode
        (viewer as unknown as ViewerType).addEventListener("click", (e: unknown) => {
          const data = (e as { data: { rightclick: boolean; yaw: number; pitch: number; marker?: unknown } }).data;
          if (data.rightclick || data.marker) return;
          const toDeg = (r: number) => Math.round(r * 180 / Math.PI * 100) / 100;
          onViewerClickRef.current?.({ yaw: toDeg(data.yaw), pitch: toDeg(data.pitch) });
        });

        // Position/zoom → callbacks
        const emitPosition = () => {
          const pos = (viewer as unknown as ViewerType).getPosition();
          const toDeg = (r: number) => Math.round(r * 180 / Math.PI * 100) / 100;
          const zoom = Math.round((viewer as unknown as ViewerType).getZoomLevel());
          const deg = { yaw: toDeg(pos.yaw), pitch: toDeg(pos.pitch), zoom };
          if (debug) setDebugPos({ yaw: deg.yaw, pitch: deg.pitch });
          onPositionChange?.(deg);
        };
        (viewer as unknown as ViewerType).addEventListener("position-updated", emitPosition);
        (viewer as unknown as ViewerType).addEventListener("zoom-updated", emitPosition);

        if (startScene.type === "flat") {
          setFlatScene({ image: startScene.image, links: startScene.links });
        } else {
          currentSceneIdRef.current = startScene.id;
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
      setSceneMarkersRef.current = null;
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          <a href="/videos" className="text-amber text-sm underline underline-offset-2">Watch video walkthroughs instead →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={containerRef}
        className={className}
        style={{ width: "100%", height: "100%", visibility: flatScene ? "hidden" : "visible" }}
      />

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

      {debug && debugPos && (
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 100,
          background: "rgba(0,0,0,0.75)", color: "#fff", fontFamily: "monospace",
          fontSize: 13, padding: "8px 12px", borderRadius: 6, pointerEvents: "none", lineHeight: 1.6,
        }}>
          <div>yaw: <b>{debugPos.yaw}°</b></div>
          <div>pitch: <b>{debugPos.pitch}°</b></div>
          <div style={{ marginTop: 4, fontSize: 11, opacity: 0.6 }}>drag to calibrate hotspots</div>
        </div>
      )}
    </div>
  );
}
