"""parts.json -> laser-ready SVG cut sheets (out/sheet-NN.svg).

- CUT paths: red, 0.1mm stroke, kerf-compensated (+kerf/2 buffer so the
  finished part comes out on-dimension after the beam eats its width).
- ENGRAVE: blue part-number labels.
- Shelf-packed onto bed-sized sheets with margins.

Usage: python engine/export_svg.py [--parts parts.json] [--out out]
                                   [--bed 600x400] [--kerf 0.15]
"""
import argparse
import json
from pathlib import Path

from shapely.geometry import Polygon
from shapely import affinity

ROOT = Path(__file__).parent.parent
MARGIN = 6.0
GAP = 4.0


def part_polygon(part, kerf):
    p = Polygon(part["polygon"]["outer"], part["polygon"]["holes"])
    if kerf > 0:
        p = p.buffer(kerf / 2, join_style=2)
        if p.geom_type == "MultiPolygon":
            p = max(p.geoms, key=lambda g: g.area)
    return p


def shelf_pack(polys, bed_w, bed_h):
    """Greedy shelf packing. Returns list of sheets; each sheet is a list of
    (poly_translated, part). Polys are normalized to their bbox origin first."""
    items = []
    for poly, part in polys:
        minx, miny, maxx, maxy = poly.bounds
        w, h = maxx - minx, maxy - miny
        items.append((h, w, poly, part, minx, miny))
    items.sort(key=lambda it: -it[0])

    sheets = []
    cur, x, y, shelf_h = [], MARGIN, MARGIN, 0.0
    for h, w, poly, part, minx, miny in items:
        if w > bed_w - 2 * MARGIN or h > bed_h - 2 * MARGIN:
            # part exceeds the bed; place alone on its own oversize sheet
            sheets.append([(affinity.translate(poly, MARGIN - minx, MARGIN - miny), part)])
            continue
        if x + w > bed_w - MARGIN:
            x = MARGIN
            y += shelf_h + GAP
            shelf_h = 0.0
        if y + h > bed_h - MARGIN:
            sheets.append(cur)
            cur, x, y, shelf_h = [], MARGIN, MARGIN, 0.0
        cur.append((affinity.translate(poly, x - minx, y - miny), part))
        x += w + GAP
        shelf_h = max(shelf_h, h)
    if cur:
        sheets.append(cur)
    return sheets


def ring_path(coords):
    d = "M " + " L ".join(f"{x:.3f},{y:.3f}" for x, y in coords)
    return d + " Z"


def sheet_svg(placed, bed_w, bed_h, title):
    cut_paths = []
    labels = []
    for poly, part in placed:
        d = ring_path(poly.exterior.coords)
        for ring in poly.interiors:
            d += " " + ring_path(ring.coords)
        cut_paths.append(f'<path d="{d}" fill="none" stroke="#ff0000" '
                         f'stroke-width="0.1" fill-rule="evenodd"/>')
        c = poly.representative_point()
        labels.append(f'<text x="{c.x:.2f}" y="{c.y:.2f}" font-size="6" '
                      f'fill="none" stroke="#0000ff" stroke-width="0.1" '
                      f'text-anchor="middle">{part["label"]}</text>')
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{bed_w}mm" '
            f'height="{bed_h}mm" viewBox="0 0 {bed_w} {bed_h}">\n'
            f'<title>{title}</title>\n'
            f'<rect x="0" y="0" width="{bed_w}" height="{bed_h}" fill="none" '
            f'stroke="#cccccc" stroke-width="0.1"/>\n'
            + "\n".join(cut_paths) + "\n" + "\n".join(labels) + "\n</svg>\n")


def export(parts_path, out_dir, bed_w, bed_h, kerf):
    data = json.loads(Path(parts_path).read_text(encoding="utf-8"))
    if data.get("error"):
        raise SystemExit("parts.json holds an engine error; regenerate first")
    out = Path(out_dir)
    out.mkdir(exist_ok=True)
    for old in out.glob("sheet-*.svg"):
        old.unlink()
    flat_parts = [p for p in data["parts"] if "polygon" in p]
    polys = [(part_polygon(p, kerf), p) for p in flat_parts]
    sheets = shelf_pack(polys, bed_w, bed_h)
    files = []
    for i, placed in enumerate(sheets, 1):
        f = out / f"sheet-{i:02d}.svg"
        f.write_text(sheet_svg(placed, bed_w, bed_h,
                               f"SculptGen sheet {i}/{len(sheets)} — "
                               f"{data['material']['name']} — kerf {kerf}mm"),
                     encoding="utf-8")
        files.append(str(f))
    manifest = {
        "sheets": files,
        "bed_mm": [bed_w, bed_h],
        "kerf_mm": kerf,
        "material": data["material"],
        "part_count": len(flat_parts),
        "printed_parts_skipped": len(data["parts"]) - len(flat_parts),
        "assembly": {
            "region_meta": data.get("region_meta", {}),
            "note": "assemble by ascending part number; labels are engraved in blue",
        },
    }
    (out / "cut_manifest.json").write_text(json.dumps(manifest, indent=2))
    return manifest


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--parts", default=str(ROOT / "parts.json"))
    ap.add_argument("--out", default=str(ROOT / "out"))
    ap.add_argument("--machine", default="laser",
                    help="machine profile supplying bed size + calibrated kerf")
    ap.add_argument("--bed", default=None, help="override, e.g. 600x400")
    ap.add_argument("--kerf", type=float, default=None, help="override, mm")
    args = ap.parse_args()

    machines = json.loads((Path(__file__).parent / "machines.json")
                          .read_text(encoding="utf-8"))
    prof = machines.get(args.machine, machines["laser"])
    bw, bh = prof["bed_mm"]
    if args.bed:
        bw, bh = (float(v) for v in args.bed.lower().split("x"))
    kerf = prof["kerf_mm"] if args.kerf is None else args.kerf
    if not prof.get("kerf_calibrated") and args.kerf is None:
        print(f"note: '{args.machine}' kerf is UNCALIBRATED (using {kerf}mm). "
              f"Run: python engine/calibrate.py coupon")

    m = export(args.parts, args.out, bw, bh, kerf)
    print(f"OK {len(m['sheets'])} sheets -> {args.out}  "
          f"(bed {bw:.0f}x{bh:.0f}mm, kerf {kerf}mm)")


if __name__ == "__main__":
    main()
