"""parts.json -> binary STL (out/mask.stl) for mesh parts (rotary/solid).

Merges every mesh part into one binary STL via trimesh, reports whether the
result is watertight (CAM wants closed solids).

Usage: python engine/export_stl.py [--parts parts.json] [--out out]
"""
import argparse
import json
from pathlib import Path

import numpy as np
import trimesh

ROOT = Path(__file__).parent.parent


def export(parts_path, out_dir, name="mask.stl"):
    out = Path(out_dir)
    out.mkdir(exist_ok=True)
    data = json.loads(Path(parts_path).read_text(encoding="utf-8"))
    meshes = []
    for p in data["parts"]:
        if "mesh" not in p:
            continue
        m = trimesh.Trimesh(vertices=np.asarray(p["mesh"]["vertices"], float),
                            faces=np.asarray(p["mesh"]["faces"], int),
                            process=True, validate=True)
        meshes.append(m)
    if not meshes:
        return None
    merged = trimesh.util.concatenate(meshes)
    merged.export(out / name)
    return {"file": str(out / name), "triangles": int(len(merged.faces)),
            "watertight": bool(merged.is_watertight),
            "bounds_mm": [[round(float(c), 1) for c in row]
                          for row in merged.bounds.tolist()]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--parts", default=str(ROOT / "parts.json"))
    ap.add_argument("--out", default=str(ROOT / "out"))
    args = ap.parse_args()
    info = export(args.parts, args.out)
    if info is None:
        print("no mesh parts — nothing to export")
        return
    print(f"OK {info['file']}  {info['triangles']} tris  "
          f"watertight={info['watertight']}")


if __name__ == "__main__":
    main()
