"""SculptGen engine entry point: design.json -> parts.json.

Usage: python engine/generate.py [--design design.json] [--out parts.json]
"""
import argparse
import json
import sys
import time
import traceback
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from sdf import make_field
from regions import normalize_regions, suggest_technique
import tech_stacked
import tech_radial
import tech_interlocked
import tech_printed

ROOT = Path(__file__).parent.parent
BACKENDS = {"stacked": tech_stacked.build, "radial": tech_radial.build,
            "interlocked": tech_interlocked.build, "printed": tech_printed.build}


def generate(design):
    t_start = time.time()
    issues = []
    S = float(design.get("size_mm", {}).get("height", 300.0))
    material_key = design.get("material", "ply3mm")
    materials = json.loads((Path(__file__).parent / "materials.json")
                           .read_text(encoding="utf-8"))
    mat = materials.get(material_key, materials["ply3mm"])
    # prefer calibrated values (engine/calibrate.py) over nominal ones
    thickness = float(design.get("thickness_mm", 0)
                      or mat.get("measured_thickness")
                      or mat["thickness"])

    label_counter = {"n": 0}

    def next_label():
        label_counter["n"] += 1
        return label_counter["n"]

    ctx = {
        "scale_mm": S,
        "thickness": thickness,
        "res": int(design.get("resolution", 200)),
        "fit_tolerance": float(design.get("fit_tolerance_mm", 0)
                               or mat.get("fit_tolerance", 0) or 0.2),
        "min_feature_mm": float(design.get("min_feature_mm", 1.5)),
        "issues": issues,
        "next_label": next_label,
    }

    mode = design.get("mode", "sculpture")
    if mode == "relief":
        import relief
        parts, rmeta = relief.build(design, ctx)
        region_meta = {"relief": rmeta}
        regions = [{"id": "relief", "technique": "relief", "bounds": {"z": [0, 1]}}]
        return _finish(design, parts, regions, region_meta, mat, material_key,
                       thickness, ctx, issues, t_start)
    if mode == "mask":
        import mask
        parts, mmeta = mask.build(design, ctx)
        region_meta = {"mask": mmeta}
        regions = [{"id": "mask", "technique": "mask", "bounds": {"z": [0, 1]}}]
        return _finish(design, parts, regions, region_meta, mat, material_key,
                       thickness, ctx, issues, t_start)

    field = make_field(design, issues)
    ctx["xy_half"] = float(getattr(field, "xy_half", 0.62))

    regions = normalize_regions(design)
    parts = []
    region_meta = {}
    # printed regions run last so they can pick up joint info (e.g. the
    # bottom edges of an interlocked region that needs platform sockets)
    ordered = ([r for r in regions if r["technique"] != "printed"]
               + [r for r in regions if r["technique"] == "printed"])
    for region in ordered:
        tech = region["technique"]
        if tech in ("auto", None, ""):
            tech = suggest_technique(field, region, S)
            region["technique"] = tech
            issues.append(f"{region['id']}: technique auto-selected -> {tech}")
        backend = BACKENDS.get(tech)
        if backend is None:
            issues.append(f"{region['id']}: technique '{tech}' not implemented yet "
                          f"(available: {sorted(BACKENDS)}) — skipped")
            continue
        p, meta = backend(field, region, ctx)
        parts.extend(p)
        region_meta[region["id"]] = {"technique": tech, "parts": len(p), **meta}

    return _finish(design, parts, regions, region_meta, mat, material_key,
                   thickness, ctx, issues, t_start)


def _finish(design, parts, regions, region_meta, mat, material_key,
            thickness, ctx, issues, t_start):
    if not mat.get("measured_thickness"):
        issues.append(f"material '{material_key}' is uncalibrated — using nominal "
                      f"{mat['thickness']}mm and a {ctx['fit_tolerance']}mm guess. "
                      f"Run: python engine/calibrate.py coupon --material {material_key}")

    total_area = sum(p.get("area_mm2", 0) for p in parts)
    S = float(design.get("size_mm", {}).get("height", 300.0))
    return {
        "units": "mm",
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "mode": design.get("mode", "sculpture"),
        "material": {"key": material_key, "name": mat["name"], "thickness": thickness,
                     "calibrated": bool(mat.get("measured_thickness"))},
        "size_mm": {"height": S},
        "seed": design.get("seed"),
        "regions": [{"id": r["id"], "technique": r["technique"],
                     "z": r["bounds"]["z"]} for r in regions],
        "region_meta": region_meta,
        "parts": parts,
        "stats": {
            "part_count": len(parts),
            "total_cut_area_mm2": round(total_area, 0),
            "est_sheet_area_m2": round(total_area / 0.72 / 1e6, 3),
            "build_seconds": round(time.time() - t_start, 2),
        },
        "issues": issues,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--design", default=str(ROOT / "design.json"))
    ap.add_argument("--out", default=str(ROOT / "parts.json"))
    args = ap.parse_args()
    try:
        design = json.loads(Path(args.design).read_text(encoding="utf-8"))
    except Exception as e:
        Path(args.out).write_text(json.dumps(
            {"error": f"design.json unreadable: {e}", "parts": []}))
        print(f"ERROR reading design: {e}", file=sys.stderr)
        sys.exit(2)
    try:
        result = generate(design)
    except Exception:
        tb = traceback.format_exc()
        Path(args.out).write_text(json.dumps({"error": tb, "parts": []}))
        print(tb, file=sys.stderr)
        sys.exit(1)
    Path(args.out).write_text(json.dumps(result))
    print(f"OK {result['stats']['part_count']} parts "
          f"in {result['stats']['build_seconds']}s; "
          f"{len(result['issues'])} issues")


if __name__ == "__main__":
    main()
