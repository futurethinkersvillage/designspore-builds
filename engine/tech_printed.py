"""3D-printed technique: solid pedestal platform for the sculpture.

Builds a chamfered disc pedestal as a mesh (exported to 3MF via export_3mf.py).
If an interlocked region sits directly on top, the pedestal's top face gets
through-socket slots in a raised collar so the slice grid plugs in.

Runs AFTER cut-sheet techniques (generate.py orders printed regions last) so it
can read ctx["interlocked_bottom_edges"].
"""
import numpy as np
from shapely.geometry import Polygon, box
from shapely.ops import unary_union
from shapely import affinity

from geometry import make_mesh_part

try:
    import trimesh
except Exception:            # engine still works without trimesh (no printed parts)
    trimesh = None


def _circle(r, n=96):
    a = np.linspace(0, 2 * np.pi, n, endpoint=False)
    return Polygon(np.column_stack([r * np.cos(a), r * np.sin(a)]))


def build(field, region, ctx):
    issues = ctx["issues"]
    if trimesh is None:
        issues.append(f"{region['id']}: trimesh unavailable — printed part skipped")
        return [], {}
    S = ctx["scale_mm"]
    t = ctx["thickness"]
    params = region.get("params", {})
    z0n, z1n = region["bounds"]["z"]
    z0, z1 = z0n * S, z1n * S
    height = z1 - z0
    socket_depth = min(float(params.get("socket_depth", 6.0)), max(3.0, height - 3.0))
    slot_ease = 0.15

    # sockets: bottom edges of an interlocked region resting on this band's top
    edges = [e for e in ctx.get("interlocked_bottom_edges", [])
             if abs(e["z0_mm"] - z1) < 1.0]
    slot_w = t + float(ctx.get("fit_tolerance", 0.2)) + slot_ease

    # pedestal radius: cover the sockets (or the form's footprint) + margin
    reach = 0.0
    for e in edges:
        lo, hi = e["range"]
        reach = max(reach, abs(lo), abs(hi), abs(e["coord"]))
    r_ped = float(params.get("radius_mm", 0)) or max(reach + 10.0, 0.12 * S)

    base_h = height - socket_depth
    collar = _circle(r_ped)
    cuts = []
    for e in edges:
        lo, hi = e["range"][0] - 1.0, e["range"][1] + 1.0
        if e["axis"] == "x":     # slice runs along X at y = coord
            cuts.append(box(lo, e["coord"] - slot_w / 2, hi, e["coord"] + slot_w / 2))
        else:
            cuts.append(box(e["coord"] - slot_w / 2, lo, e["coord"] + slot_w / 2, hi))
    if cuts:
        collar = collar.difference(unary_union(cuts))
        if collar.is_empty:
            issues.append(f"{region['id']}: sockets destroyed the collar — "
                          f"enlarge radius_mm")
            collar = _circle(r_ped)
            cuts = []

    meshes = []
    # solid base with a slight chamfer look (two stacked discs)
    if base_h > 2.0:
        meshes.append(trimesh.creation.extrude_polygon(
            _circle(r_ped * 1.06), height=min(3.0, base_h / 2)))
        m2 = trimesh.creation.extrude_polygon(
            _circle(r_ped), height=base_h - min(3.0, base_h / 2))
        m2.apply_translation([0, 0, min(3.0, base_h / 2)])
        meshes.append(m2)
    # collar layer with sockets
    polys = list(collar.geoms) if collar.geom_type == "MultiPolygon" else [collar]
    for p in polys:
        mc = trimesh.creation.extrude_polygon(p, height=socket_depth)
        mc.apply_translation([0, 0, base_h])
        meshes.append(mc)

    mesh = trimesh.util.concatenate(meshes)
    label = ctx["next_label"]()
    part = make_mesh_part(
        pid=f"{region['id']}-P0", region=region["id"], technique="printed",
        vertices=mesh.vertices, faces=mesh.faces,
        pos=[0.0, 0.0, z0], label=label)
    meta = {"radius_mm": round(r_ped, 1), "sockets": len(cuts),
            "socket_depth": round(socket_depth, 1),
            "print_height_mm": round(height, 1)}
    if not edges:
        issues.append(f"{region['id']}: no interlocked region found on top — "
                      f"plain pedestal, sculpture sits unfixed")
    return [part], meta
