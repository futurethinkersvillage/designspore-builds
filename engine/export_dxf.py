"""parts.json -> DXF R12 cut sheets (out/sheet-NN.dxf) for CNC/CAM import.

Same packing + kerf compensation as export_svg.py (imported from it), written
as minimal hand-rolled DXF R12: closed POLYLINE entities on layer CUT, part
numbers as TEXT on layer LABEL. R12 polylines import cleanly into VCarve,
Fusion 360, Carveco, LightBurn, etc. No third-party DXF dependency.

Usage: python engine/export_dxf.py [--parts parts.json] [--out out]
                                   [--bed 800x400] [--kerf 0.15]
"""
import argparse
import json
from pathlib import Path

from export_svg import part_polygon, shelf_pack

ROOT = Path(__file__).parent.parent


def _polyline(coords, layer):
    out = ["0", "POLYLINE", "8", layer, "66", "1", "70", "1"]  # 70=1 closed
    for x, y in coords:
        out += ["0", "VERTEX", "8", layer,
                "10", f"{x:.4f}", "20", f"{y:.4f}", "30", "0.0"]
    out += ["0", "SEQEND"]
    return out


def _text(x, y, h, s, layer):
    return ["0", "TEXT", "8", layer, "10", f"{x:.3f}", "20", f"{y:.3f}",
            "30", "0.0", "40", f"{h:.2f}", "1", str(s), "72", "1",
            "11", f"{x:.3f}", "21", f"{y:.3f}", "31", "0.0"]


def sheet_dxf(placed, bed_h):
    """DXF body for one packed sheet. SVG's y grows downward; DXF's grows up,
    so flip about the bed height to keep the same visual layout."""
    lines = ["0", "SECTION", "2", "HEADER",
             "9", "$INSUNITS", "70", "4",          # units: millimetres
             "0", "ENDSEC",
             "0", "SECTION", "2", "TABLES",
             "0", "TABLE", "2", "LAYER", "70", "2",
             "0", "LAYER", "2", "CUT", "70", "0", "62", "1", "6", "CONTINUOUS",
             "0", "LAYER", "2", "LABEL", "70", "0", "62", "5", "6", "CONTINUOUS",
             "0", "ENDTAB", "0", "ENDSEC",
             "0", "SECTION", "2", "ENTITIES"]
    for poly, part in placed:
        ext = [(x, bed_h - y) for x, y in poly.exterior.coords]
        lines += _polyline(ext, "CUT")
        for ring in poly.interiors:
            lines += _polyline([(x, bed_h - y) for x, y in ring.coords], "CUT")
        c = poly.representative_point()
        lines += _text(c.x, bed_h - c.y, 6.0, part["label"], "LABEL")
    lines += ["0", "ENDSEC", "0", "EOF"]
    return "\n".join(lines) + "\n"


def export(parts_path, out_dir, bed_w, bed_h, kerf):
    out = Path(out_dir)
    out.mkdir(exist_ok=True)
    data = json.loads(Path(parts_path).read_text(encoding="utf-8"))
    for old in out.glob("sheet-*.dxf"):
        old.unlink()
    flat_parts = [p for p in data["parts"] if "polygon" in p]
    polys = [(part_polygon(p, kerf), p) for p in flat_parts]
    sheets = shelf_pack(polys, bed_w, bed_h)
    files = []
    for i, placed in enumerate(sheets, 1):
        f = out / f"sheet-{i:02d}.dxf"
        f.write_text(sheet_dxf(placed, bed_h), encoding="utf-8")
        files.append(str(f))
    return {"sheets": files, "bed_mm": [bed_w, bed_h], "kerf_mm": kerf,
            "part_count": len(flat_parts)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--parts", default=str(ROOT / "parts.json"))
    ap.add_argument("--out", default=str(ROOT / "out"))
    ap.add_argument("--bed", default="800x400")
    ap.add_argument("--kerf", type=float, default=0.15)
    args = ap.parse_args()
    bw, bh = (float(v) for v in args.bed.lower().split("x"))
    m = export(args.parts, args.out, bw, bh, args.kerf)
    print(f"OK {len(m['sheets'])} DXF sheets -> {args.out}  "
          f"(bed {bw:g}x{bh:g}mm, kerf {args.kerf}mm)")


if __name__ == "__main__":
    main()
