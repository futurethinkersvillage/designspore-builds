"""Stacked-slices technique: horizontal cross-sections, one per material
thickness, with alignment dowel holes through the common core."""
import numpy as np
from shapely.geometry import Point, MultiPolygon
from shapely.ops import unary_union

from geometry import (sample_plane, field_to_polygons, drop_small,
                      make_part, spread_points, IDENTITY_QUAT)


def build(field, region, ctx):
    """ctx: dict with scale_mm, thickness, res, issues, next_label()."""
    S = ctx["scale_mm"]
    t = ctx["thickness"]
    issues = ctx["issues"]
    params = region.get("params", {})
    z0n, z1n = region["bounds"]["z"]
    z0, z1 = z0n * S, z1n * S
    n_layers = max(1, int(round((z1 - z0) / t)))
    dowel_count = int(params.get("dowels", 3))
    dowel_d = float(params.get("dowel_diameter", 6.0))
    half = float(ctx.get("xy_half", 0.62)) * S
    res = ctx["res"]
    u = np.linspace(-half, half, res)
    v = np.linspace(-half, half, res)

    layers = []          # (z_mid_mm, MultiPolygon in world XY mm)
    for i in range(n_layers):
        z_mid = z0 + (i + 0.5) * t
        zn = z_mid / S

        def plane(U, V, zn=zn):
            return np.column_stack([U / S, V / S, np.full(len(U), zn)])

        vals = sample_plane(field, plane, u, v)
        mp = field_to_polygons(vals, u, v)
        mp = drop_small(mp, issues=issues, ctx=f"{region['id']} layer {i}")
        if mp.is_empty:
            continue
        layers.append((z_mid, mp))

    parts = []
    if not layers:
        issues.append(f"{region['id']}: no material in region band")
        return parts, {}

    # dowel positions: through the intersection of every layer's footprint
    core = layers[0][1]
    for _, mp in layers[1:]:
        core = core.intersection(mp)
    core = core.buffer(-(dowel_d / 2 + 3.0))
    dowels = []
    if dowel_count > 0 and not core.is_empty:
        biggest = max(core.geoms, key=lambda g: g.area) if isinstance(core, MultiPolygon) else core
        dowels = spread_points(biggest, dowel_count, min_gap=dowel_d * 3)
    if dowel_count > 0 and not dowels:
        issues.append(f"{region['id']}: no common core for dowels — layers unaligned "
                      f"(glue-only assembly)")

    hole_circles = unary_union([Point(x, y).buffer(dowel_d / 2, resolution=16)
                                for x, y in dowels]) if dowels else None

    for li, (z_mid, mp) in enumerate(layers):
        cut = mp.difference(hole_circles) if hole_circles is not None else mp
        cut = cut if isinstance(cut, MultiPolygon) else MultiPolygon([cut])
        cut = drop_small(cut, issues=issues, ctx=f"{region['id']} L{li:03d} (holes)")
        for gi, g in enumerate(cut.geoms):
            label = ctx["next_label"]()
            parts.append(make_part(
                pid=f"{region['id']}-L{li:03d}{chr(97 + gi) if len(cut.geoms) > 1 else ''}",
                region=region["id"], technique="stacked",
                polygon=g, thickness=t,
                pos=[0.0, 0.0, z_mid], quat=IDENTITY_QUAT, label=label))

    meta = {"layers": len(layers), "dowels": [[round(x, 1), round(y, 1)] for x, y in dowels],
            "dowel_diameter": dowel_d, "dowel_length_mm": round(len(layers) * t, 1)}
    return parts, meta
