/**
 * /map-editor — full-screen Leaflet/Geoman editor for the Land Map.
 *
 * The editor UI is a self-contained static app at /map-editor/index.html
 * (public/map-editor/), embedded here via a full-bleed iframe. It reads/writes
 * the PostGIS source of truth through /api/landmap/features (writes require the
 * editor secret). Middleware tags /map-editor as full-screen (no nav/footer).
 */
export default function MapEditorPage() {
  return (
    <iframe
      src="/map-editor/index.html"
      title="Land Map Editor"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
}
