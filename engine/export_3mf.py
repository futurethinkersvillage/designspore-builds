"""parts.json -> out/printed_parts.3mf (all mesh-type parts, print-ready).

Each printed part is written as its own body, laid flat on the build plate.
Usage: python engine/export_3mf.py [--parts parts.json] [--out out]
"""
import argparse
import json
from pathlib import Path

import numpy as np
import trimesh

ROOT = Path(__file__).parent.parent


def export(parts_path, out_dir):
    data = json.loads(Path(parts_path).read_text(encoding="utf-8"))
    if data.get("error"):
        raise SystemExit("parts.json holds an engine error; regenerate first")
    printed = [p for p in data["parts"] if "mesh" in p]
    if not printed:
        print("no printed parts in this design")
        return None
    out = Path(out_dir)
    out.mkdir(exist_ok=True)
    scene = trimesh.Scene()
    x_cursor = 0.0
    for p in printed:
        m = trimesh.Trimesh(vertices=np.array(p["mesh"]["vertices"]),
                            faces=np.array(p["mesh"]["faces"]))
        m.rezero()                       # sit on the plate at origin
        m.apply_translation([x_cursor - m.bounds[0][0], 0, 0])
        x_cursor = m.bounds[1][0] + 10.0
        scene.add_geometry(m, node_name=p["id"])
    f = out / "printed_parts.3mf"
    f.write_bytes(scene.export(file_type="3mf"))
    print(f"OK {len(printed)} printed part(s) -> {f}")
    return str(f)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--parts", default=str(ROOT / "parts.json"))
    ap.add_argument("--out", default=str(ROOT / "out"))
    args = ap.parse_args()
    export(args.parts, args.out)


if __name__ == "__main__":
    main()
