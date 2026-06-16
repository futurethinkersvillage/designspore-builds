/**
 * /map — full-screen interactive development map.
 *
 * The map itself is a self-contained Leaflet app served as a static asset at
 * /landmap/index.html (public/landmap/), embedded here via a full-bleed iframe.
 * This keeps the mapping stack (Leaflet + GeoJSON) fully isolated from the
 * Next.js/React render tree. The middleware tags /map as a full-screen route so
 * the global Nav/Footer/Chat are not rendered around it.
 */
export default function MapPage() {
  return (
    <iframe
      src="/landmap/index.html"
      title="Wells Gray Golf & RV Resort — Development Map"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
}
