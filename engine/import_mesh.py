"""Import a 3D model and scaffold a design.json for it.

    python engine/import_mesh.py bunny.stl
    python engine/import_mesh.py model.glb --up y --height 300 --out design.json
    python engine/import_mesh.py model.obj --techniques stacked      # single region

Inspects the mesh, picks sensible regions/techniques for its proportions, and
writes a design the normal pipeline can generate. Nothing about the rest of the
toolchain changes — an imported mesh is just another form source.
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import meshsrc

ROOT = Path(__file__).parent.parent


def suggest_regions(info, forced=None):
    """Pick regions/techniques from the model's proportions."""
    if forced:
        return [{"id": "whole", "bounds": {"z": [0.0, 1.0]},
                 "technique": forced, "params": {}}]
    aspect = info.get("aspect_wh") or 1.0
    if aspect > 1.6:
        # much wider than tall — a stack of layers reads best and is stable
        return [{"id": "whole", "bounds": {"z": [0.0, 1.0]},
                 "technique": "stacked", "params": {"dowels": 3}}]
    if aspect < 0.75:
        # tall and slim — ribs around the axis
        return [
            {"id": "foot", "bounds": {"z": [0.0, 0.12]}, "technique": "stacked",
             "params": {"dowels": 3}},
            {"id": "body", "bounds": {"z": [0.12, 1.0]}, "technique": "radial",
             "params": {"ribs": 14}},
        ]
    # chunky/blocky — egg-crate keeps it light and reads well
    return [
        {"id": "foot", "bounds": {"z": [0.0, 0.1]}, "technique": "stacked",
         "params": {"dowels": 3}},
        {"id": "body", "bounds": {"z": [0.1, 1.0]}, "technique": "interlocked",
         "params": {"x_slices": 5, "y_slices": 5}},
    ]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mesh", help="STL / OBJ / GLB / PLY / 3MF file")
    ap.add_argument("--out", default=str(ROOT / "design.json"))
    ap.add_argument("--height", type=float, default=300.0, help="finished height, mm")
    ap.add_argument("--material", default="ply3mm")
    ap.add_argument("--up", default="z", choices=["z", "y", "x", "-z"],
                    help="which axis is up in the source file")
    ap.add_argument("--voxel-res", type=int, default=meshsrc.DEFAULT_VOXEL_RES)
    ap.add_argument("--techniques", default=None,
                    help="force one technique for the whole model")
    args = ap.parse_args()

    src = Path(args.mesh)
    if not src.exists():
        raise SystemExit(f"not found: {src}")

    info = meshsrc.describe(src, args.up)
    print(f"{src.name}: {info['faces']} faces, "
          f"{'watertight' if info['watertight'] else 'NOT watertight'}, "
          f"size {info['size']}, width/height {info['aspect_wh']}")
    if not info["watertight"]:
        print("  note: non-watertight meshes are filled heuristically — "
              "check the result, or repair the mesh first")

    design = {
        "seed": 1,
        "size_mm": {"height": args.height},
        "material": args.material,
        "machine": "laser",
        "resolution": 200,
        "form": {
            "base": "mesh",
            "base_params": {
                "path": str(src.resolve()),
                "up": args.up,
                "voxel_res": args.voxel_res,
            },
            "modifiers": [],
            "symmetry": {},
        },
        "regions": suggest_regions(info, args.techniques),
        "surface": {"pattern": "none"},
    }
    Path(args.out).write_text(json.dumps(design, indent=2), encoding="utf-8")
    techs = ", ".join(r["technique"] for r in design["regions"])
    print(f"wrote {args.out}  (regions: {techs})")
    print("now run: python engine/generate.py")


if __name__ == "__main__":
    main()
