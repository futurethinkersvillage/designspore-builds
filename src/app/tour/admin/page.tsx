"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import type { TourScene } from "@/components/tour/VirtualTour";

const VirtualTour = dynamic(() => import("@/components/tour/VirtualTour"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-warm-dark">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" />
    </div>
  ),
});

const BASE = "/images/tour";

const DEFAULT_SCENES: TourScene[] = [
  {
    id: "top-view", title: "Top View", type: "sphere",
    image: `${BASE}/Golf-Course-Above2.jpg`,
    initialYaw: 288.20, initialPitch: -90, initialZoom: 50,
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
      { nodeId: "dev-concept", yaw: 349.507, pitch: -54.865, title: "Development Concept ↗",
        externalUrl: "https://marble.worldlabs.ai/world/d5d9bd70-302a-400c-a34f-693aa2783895" },
    ],
  },
  {
    id: "sauna", title: "Sauna", type: "sphere",
    image: `${BASE}/Sauna-1_PANO_0001-Sauna-1_PANO_0035_blended_fused.jpg`,
    initialYaw: 41.44, initialPitch: -15.35, initialZoom: 50,
    links: [
      { nodeId: "top-view",     yaw:  94.762, pitch:  25.730, title: "Top View" },
      { nodeId: "cabin-3",      yaw: 153.744, pitch:   3.274, title: "Cabin 3" },
      { nodeId: "shower-house", yaw: 310.208, pitch:   7.800, title: "Shower House" },
      { nodeId: "Gazebo",       yaw: 195.835, pitch:  -1.610, title: "Gazebo" },
    ],
  },
  {
    id: "cabin-3", title: "Cabin 3", type: "sphere",
    image: `${BASE}/Cabin-3.2_PANO_0001-Cabin-3-2-1.jpg`,
    initialYaw: 0, initialPitch: 0, initialZoom: 50,
    links: [
      { nodeId: "sauna",          yaw: 161.403, pitch:  -3.069, title: "Sauna" },
      { nodeId: "top-view",       yaw: 168.277, pitch:  33.080, title: "Top View" },
      { nodeId: "Dome-Interior",  yaw: 343.828, pitch:  -6.512, title: "Dome Interior" },
      { nodeId: "Lake-and-Field", yaw: 281.192, pitch:  -1.945, title: "Lake & Field" },
    ],
  },
  {
    id: "shower-house", title: "Shower House", type: "sphere",
    image: `${BASE}/Shower-House-1_PANO_0001-Shower-House-1_PANO_0035_blended_fused-2-1.jpg`,
    initialYaw: 319.11, initialPitch: -15.69, initialZoom: 50,
    links: [{ nodeId: "top-view", yaw: 286.829, pitch: 26.504, title: "Top View" }],
  },
  {
    id: "Gazebo", title: "Gazebo", type: "sphere",
    image: `${BASE}/Gazebo-5_PANO_0001-Gazebo-5_PANO_0035_blended_fused-2-1.jpg`,
    initialYaw: 222.49, initialPitch: -30.83, initialZoom: 50,
    links: [{ nodeId: "top-view", yaw: 246.296, pitch: -18.953, title: "Top View" }],
  },
  {
    id: "trophy-mountain", title: "Trophy Mountain", type: "sphere",
    image: `${BASE}/TrophyMountain_blended_fused-2-1.jpg`,
    initialYaw: 0, initialPitch: 0, initialZoom: 50,
    links: [{ nodeId: "top-view", yaw: 303.520, pitch: -9.052, title: "Wells Gray Resort" }],
  },
  {
    id: "Winter", title: "Winter", type: "sphere",
    image: `${BASE}/Winter15-2-1.jpg`,
    initialYaw: 259.13, initialPitch: -81.42, initialZoom: 50,
    links: [{ nodeId: "top-view", yaw: 156.515, pitch: -63.088, title: "Summer View" }],
  },
  {
    id: "Dome-Interior", title: "Dome Interior", type: "flat",
    image: `${BASE}/Dome-Interior-1.jpg`,
    links: [{ nodeId: "top-view", yaw: 0, pitch: 0, title: "Top View" }],
  },
  {
    id: "Lake-and-Field", title: "Lake and Field", type: "sphere",
    image: `${BASE}/DomeLake1_blended_fused-2-1.jpg`,
    initialYaw: 35.59, initialPitch: -11.86, initialZoom: 50,
    links: [
      { nodeId: "top-view",      yaw:  43.562, pitch:  26.857, title: "Top View" },
      { nodeId: "cabin-3",       yaw: 249.368, pitch:  -2.696, title: "Cabin 3" },
      { nodeId: "Dome-Interior", yaw: 216.402, pitch: -44.013, title: "Dome Interior" },
    ],
  },
  {
    id: "Campsite", title: "Campsite", type: "flat",
    image: `${BASE}/Picnic-Tables-at-the-Creek.jpg`,
    links: [{ nodeId: "top-view", yaw: 0, pitch: 0, title: "Top View" }],
  },
];

type SceneCalibration = { yaw: number; pitch: number; zoom: number; boundary?: [number, number][] };
type Calibrations = Record<string, SceneCalibration>;

async function fetchCalibrations(): Promise<Calibrations> {
  try {
    const res = await fetch("/api/tour-config");
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

async function saveCalibrations(data: Calibrations): Promise<boolean> {
  try {
    const res = await fetch("/api/tour-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default function TourAdminPage() {
  const [activeSceneId, setActiveSceneId] = useState("top-view");
  const [livePos, setLivePos] = useState<{ yaw: number; pitch: number; zoom: number } | null>(null);
  const [calibrations, setCalibrations] = useState<Calibrations>({});
  const [calibrationsReady, setCalibrationsReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [vertices, setVertices] = useState<[number, number][]>([]);
  const [selectedVertex, setSelectedVertex] = useState<number | null>(null);

  useEffect(() => {
    fetchCalibrations().then((data) => {
      setCalibrations(data);
      setCalibrationsReady(true);
    });
  }, []);

  const activeScene = DEFAULT_SCENES.find((s) => s.id === activeSceneId);
  const savedForScene = calibrations[activeSceneId];

  async function captureView() {
    if (!livePos) return;
    setSaving(true);
    const next: Calibrations = {
      ...calibrations,
      [activeSceneId]: { yaw: livePos.yaw, pitch: livePos.pitch, zoom: livePos.zoom },
    };
    const ok = await saveCalibrations(next);
    if (ok) {
      setCalibrations(next);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }
    setSaving(false);
  }

  async function clearScene() {
    setSaving(true);
    const next = { ...calibrations };
    delete next[activeSceneId];
    const ok = await saveCalibrations(next);
    if (ok) setCalibrations(next);
    setSaving(false);
  }

  function handleViewerClick(pos: { yaw: number; pitch: number }) {
    if (!drawMode) return;
    if (selectedVertex !== null) {
      setVertices((v) => v.map((pt, i) => i === selectedVertex ? [pos.yaw, pos.pitch] : pt));
      setSelectedVertex(null);
    } else {
      setVertices((v) => [...v, [pos.yaw, pos.pitch]]);
    }
  }

  function handleMarkerClick(_id: string, data: unknown) {
    const d = data as { isVertex?: boolean; vertexIndex?: number };
    if (d?.isVertex && d.vertexIndex !== undefined) {
      setSelectedVertex((v) => v === d.vertexIndex ? null : d.vertexIndex!);
    }
  }

  async function saveBoundary() {
    if (vertices.length < 3) return;
    setSaving(true);
    const existing = calibrations[activeSceneId] ?? { yaw: 0, pitch: 0, zoom: 50 };
    const next: Calibrations = { ...calibrations, [activeSceneId]: { ...existing, boundary: vertices } };
    const ok = await saveCalibrations(next);
    if (ok) {
      setCalibrations(next);
      setVertices([]);
      setDrawMode(false);
      setSelectedVertex(null);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }
    setSaving(false);
  }

  async function deleteBoundary() {
    setSaving(true);
    const existing = calibrations[activeSceneId];
    if (!existing) { setSaving(false); return; }
    const { boundary: _b, ...rest } = existing;
    const next: Calibrations = { ...calibrations, [activeSceneId]: rest as SceneCalibration };
    const ok = await saveCalibrations(next);
    if (ok) setCalibrations(next);
    setSaving(false);
  }

  // Merge calibrations into scenes for the live viewer
  // While drawing, overlay the live vertices as the boundary on the active scene
  const scenes = DEFAULT_SCENES.map((scene) => {
    const cal = calibrations[scene.id];
    const isActive = scene.id === activeSceneId;
    const liveBoundary = drawMode && isActive && vertices.length >= 3 ? vertices : undefined;
    const savedBoundary = cal?.boundary;
    const boundary = liveBoundary ?? savedBoundary;
    if (!cal && !boundary) return scene;
    if (scene.type === "flat") return boundary ? { ...scene, boundary } : scene;
    return {
      ...scene,
      ...(cal && { initialYaw: cal.yaw, initialPitch: cal.pitch, initialZoom: cal.zoom }),
      ...(boundary && { boundary }),
    };
  });

  return (
    <div className="fixed inset-0 flex bg-warm-dark">
      {/* Tour viewer */}
      <div className="relative flex-1 overflow-hidden">
        {drawMode && (
          <div style={{
            position: "absolute", top: 12, left: 12, zIndex: 50,
            background: selectedVertex !== null ? "rgba(96,165,250,0.9)" : "rgba(234,130,78,0.9)",
            color: "#fff",
            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            pointerEvents: "none",
          }}>
            {selectedVertex !== null
              ? `Vertex ${selectedVertex + 1} selected — click sphere to move`
              : `Draw mode — click to place vertices (${vertices.length} placed)`}
          </div>
        )}
        {calibrationsReady && (
          <VirtualTour
            scenes={scenes}
            startSceneId={activeSceneId}
            onSceneChange={(id) => { setActiveSceneId(id); setVertices([]); setDrawMode(false); setSelectedVertex(null); }}
            onPositionChange={setLivePos}
            onViewerClick={handleViewerClick}
            onMarkerClick={handleMarkerClick}
            showVertexHandles={drawMode}
            selectedVertexIndex={selectedVertex ?? undefined}
            className="h-full w-full"
          />
        )}
      </div>

      {/* Admin sidebar */}
      <div className="flex w-72 shrink-0 flex-col gap-4 overflow-y-auto border-l border-white/10 bg-black/80 p-4 backdrop-blur-sm">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">Tour Calibration</p>
          <p className="mt-0.5 text-sm font-semibold text-white">{activeScene?.title ?? "—"}</p>
          <p className="text-xs text-white/40">{activeScene?.type}</p>
        </div>

        {/* Live position */}
        <div className="rounded-lg bg-white/5 p-3 font-mono text-xs">
          <p className="mb-1 text-white/40">Current camera</p>
          {livePos ? (
            <>
              <p className="text-white">yaw: <span className="text-amber">{livePos.yaw}°</span></p>
              <p className="text-white">pitch: <span className="text-amber">{livePos.pitch}°</span></p>
              <p className="text-white">zoom: <span className="text-amber">{livePos.zoom}</span></p>
            </>
          ) : (
            <p className="text-white/30">
              {activeScene?.type === "flat" ? "flat photo — no camera" : "drag to update"}
            </p>
          )}
        </div>

        {/* Saved for this scene */}
        {savedForScene && (
          <div className="rounded-lg border border-amber/30 bg-amber/5 p-3 font-mono text-xs">
            <p className="mb-1 text-amber/60">Saved initial view</p>
            <p className="text-white">yaw: {savedForScene.yaw}°</p>
            <p className="text-white">pitch: {savedForScene.pitch}°</p>
            <p className="text-white">zoom: {savedForScene.zoom}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          {activeScene?.type === "sphere" && (
            <button
              onClick={captureView}
              disabled={!livePos || saving}
              className="rounded-lg bg-amber px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-amber/80 transition-colors"
            >
              {saving ? "Saving…" : savedFlash ? "Saved ✓" : "Set current view as initial"}
            </button>
          )}
          {savedForScene && (
            <button
              onClick={clearScene}
              disabled={saving}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-white/30 hover:text-white transition-colors disabled:opacity-40"
            >
              Reset to default
            </button>
          )}
        </div>

        <hr className="border-white/10" />

        {/* Boundary drawing */}
        {activeScene?.type === "sphere" && (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">Property boundary</p>

            {!drawMode ? (
              <>
                <button
                  onClick={() => { setDrawMode(true); setVertices([]); setSelectedVertex(null); }}
                  className="rounded-lg border border-amber/40 px-4 py-2 text-sm text-amber hover:bg-amber/10 transition-colors"
                >
                  {calibrations[activeSceneId]?.boundary ? "Redraw boundary" : "Draw boundary"}
                </button>
                {calibrations[activeSceneId]?.boundary && (
                  <>
                    <button
                      onClick={() => {
                        const saved = calibrations[activeSceneId]?.boundary;
                        if (saved) { setVertices(saved); setDrawMode(true); setSelectedVertex(null); }
                      }}
                      className="rounded-lg border border-amber/20 px-4 py-2 text-sm text-amber/70 hover:bg-amber/10 transition-colors"
                    >
                      Edit boundary
                    </button>
                    <button
                      onClick={deleteBoundary}
                      disabled={saving}
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 hover:border-white/30 hover:text-white/80 transition-colors disabled:opacity-40"
                    >
                      Delete boundary
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {selectedVertex !== null ? (
                  <p className="text-xs font-medium text-amber">
                    Vertex {selectedVertex + 1} selected — click sphere to relocate
                  </p>
                ) : (
                  <p className="text-xs text-white/40">
                    Click panorama to place vertices. Click a dot to select and move it. Need ≥ 3 to save.
                  </p>
                )}
                {selectedVertex !== null && (
                  <button
                    onClick={() => {
                      setVertices((v) => v.filter((_, i) => i !== selectedVertex));
                      setSelectedVertex(null);
                    }}
                    className="rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Delete vertex {selectedVertex + 1}
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setVertices((v) => v.slice(0, -1)); setSelectedVertex(null); }}
                    disabled={vertices.length === 0}
                    className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 hover:border-white/30 transition-colors disabled:opacity-30"
                  >
                    Undo
                  </button>
                  <button
                    onClick={() => { setDrawMode(false); setVertices([]); setSelectedVertex(null); }}
                    className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 hover:border-white/30 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <button
                  onClick={saveBoundary}
                  disabled={vertices.length < 3 || saving}
                  className="rounded-lg bg-amber px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-amber/80 transition-colors"
                >
                  {saving ? "Saving…" : savedFlash ? "Saved ✓" : `Save boundary (${vertices.length} pts)`}
                </button>
              </>
            )}
          </div>
        )}

        <hr className="border-white/10" />

        {/* Scene list */}
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-white/40">All scenes</p>
          <div className="flex flex-col gap-1">
            {DEFAULT_SCENES.map((scene) => {
              const cal = calibrations[scene.id];
              const isActive = scene.id === activeSceneId;
              return (
                <button
                  key={scene.id}
                  onClick={() => setActiveSceneId(scene.id)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <span>{scene.title}</span>
                  <span className={`shrink-0 text-[10px] ${cal ? "text-amber" : "text-white/20"}`}>
                    {scene.type === "flat" ? "flat" : cal ? "calibrated" : "default"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
