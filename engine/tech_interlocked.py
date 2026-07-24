"""Interlocked-slices technique (egg-crate): two orthogonal sets of vertical
slices with half-lap slots at every crossing. A-slices (perpendicular to Y)
slot from the TOP down to the crossing midpoint; B-slices (perpendicular to X)
slot from the BOTTOM up — set A drops onto set B.

A-slice local coords: X = world X, Y = height above band base.
B-slice local coords: X = world Y, Y = height above band base.
Bottom-edge segments are reported into ctx["interlocked_bottom_edges"] so a
printed platform below can cut matching sockets.
"""
import numpy as np
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union

from geometry import (sample_plane, field_to_polygons, drop_small,
                      make_part, quat_from_basis)

A_QUAT = quat_from_basis(np.array([1.0, 0, 0]), np.array([0, 0, 1.0]),
                         np.array([0, -1.0, 0]))
B_QUAT = quat_from_basis(np.array([0, 1.0, 0]), np.array([0, 0, 1.0]),
                         np.array([1.0, 0, 0]))


def _solid_run(field, x, y, z0, z1, S, n=120):
    """Longest contiguous solid interval along z at plan position (x, y), mm."""
    zs = np.linspace(z0, z1, n)
    pts = np.column_stack([np.full(n, x / S), np.full(n, y / S), zs / S])
    inside = field(pts) < 0
    best, cur_start, best_lo, best_hi = 0.0, None, None, None
    for i, flag in enumerate(inside):
        if flag and cur_start is None:
            cur_start = i
        if (not flag or i == n - 1) and cur_start is not None:
            end = i if flag else i - 1
            length = zs[end] - zs[cur_start]
            if length > best:
                best, best_lo, best_hi = length, zs[cur_start], zs[end]
            cur_start = None
    return (best_lo, best_hi) if best_lo is not None else None


def _material_extent(field, z0, z1, S, xy_half=0.62, res=80):
    """Plan-view extent (mm) of the band's PERSISTENT core: the intersection
    of cross-section bounding boxes across the band, so every slice placed
    inside it runs the full height and genuinely interlocks. Falls back to
    the union extent when sections never overlap."""
    half = xy_half * S
    g = np.linspace(-half, half, res)
    zs = np.linspace(z0 + 0.03 * (z1 - z0), z1 - 0.03 * (z1 - z0), 9)
    X, Y = np.meshgrid(g, g)
    core = None
    union = None
    for z in zs:
        pts = np.column_stack([X.ravel() / S, Y.ravel() / S,
                               np.full(X.size, z / S)])
        solid = (field(pts) < 0).reshape(X.shape)
        if not solid.any():
            continue
        bb = (X[solid].min(), Y[solid].min(), X[solid].max(), Y[solid].max())
        union = bb if union is None else (min(union[0], bb[0]), min(union[1], bb[1]),
                                          max(union[2], bb[2]), max(union[3], bb[3]))
        core = bb if core is None else (max(core[0], bb[0]), max(core[1], bb[1]),
                                        min(core[2], bb[2]), min(core[3], bb[3]))
    if union is None:
        return None
    if core is None or core[2] - core[0] < 10 or core[3] - core[1] < 10:
        return union
    return core


def build(field, region, ctx):
    S = ctx["scale_mm"]
    t = ctx["thickness"]
    issues = ctx["issues"]
    params = region.get("params", {})
    z0n, z1n = region["bounds"]["z"]
    z0, z1 = z0n * S, z1n * S
    height = z1 - z0
    slot_w = t + float(ctx.get("fit_tolerance", 0.2))
    n_a = max(2, int(params.get("y_slices", 4)))   # A: perpendicular to Y
    n_b = max(2, int(params.get("x_slices", 4)))   # B: perpendicular to X

    xy_half = float(ctx.get("xy_half", 0.62))
    ext = _material_extent(field, z0, z1, S, xy_half)
    if ext is None:
        issues.append(f"{region['id']}: no material in region band")
        return [], {}
    minx, miny, maxx, maxy = ext
    pad = 2.0
    ys = np.linspace(miny + pad + (maxy - miny) * 0.08, maxy - pad - (maxy - miny) * 0.08, n_a)
    xs = np.linspace(minx + pad + (maxx - minx) * 0.08, maxx - pad - (maxx - minx) * 0.08, n_b)

    res = ctx["res"]
    half = xy_half * S
    u = np.linspace(-half, half, res)
    v = np.linspace(0.0, height, max(48, int(res * height / (2 * half))))

    def slice_polys(coord, is_a):
        def plane(U, V):
            if is_a:
                return np.column_stack([U / S, np.full(len(U), coord / S), (z0 + V) / S])
            return np.column_stack([np.full(len(U), coord / S), U / S, (z0 + V) / S])
        vals = sample_plane(field, plane, u, v)
        mp = field_to_polygons(vals, u, v)
        return drop_small(mp, issues=issues,
                          ctx=f"{region['id']} {'A' if is_a else 'B'}@{coord:.0f}mm")

    a_polys = [slice_polys(y, True) for y in ys]
    b_polys = [slice_polys(x, False) for x in xs]

    # slots at each crossing: half-lap around the midpoint of the solid run
    a_slots = [[] for _ in ys]
    b_slots = [[] for _ in xs]
    crossings = 0
    for i, y in enumerate(ys):
        for j, x in enumerate(xs):
            run = _solid_run(field, x, y, z0, z1, S)
            if run is None:
                continue
            zlo, zhi = run
            if zhi - zlo < 4 * t:
                continue
            mid = (zlo + zhi) / 2 - z0
            top = zhi - z0
            lo = zlo - z0
            a_slots[i].append(box(x - slot_w / 2, mid, x + slot_w / 2, top + 2.0))
            b_slots[j].append(box(y - slot_w / 2, lo - 2.0, y + slot_w / 2, mid))
            crossings += 1
    if crossings == 0:
        issues.append(f"{region['id']}: slice sets never cross inside material — "
                      f"reduce slice counts or check the form")

    parts = []
    bottom_edges = ctx.setdefault("interlocked_bottom_edges", [])

    def emit(polys_list, slots_list, coords, is_a):
        tag = "A" if is_a else "B"
        for k, (mp, slots, coord) in enumerate(zip(polys_list, slots_list, coords)):
            if mp.is_empty:
                continue
            span = mp.bounds[3] - mp.bounds[1]
            if span < 0.5 * height:
                issues.append(f"{region['id']} {tag}{k:02d}: slice spans only "
                              f"{span:.0f}mm of {height:.0f}mm band — dropped "
                              f"(would not interlock)")
                continue
            cut = mp.difference(unary_union(slots)) if slots else mp
            if not isinstance(cut, MultiPolygon):
                cut = MultiPolygon([cut]) if isinstance(cut, Polygon) else MultiPolygon([])
            cut = drop_small(cut, issues=issues,
                             ctx=f"{region['id']} {tag}{k:02d} (slot cut)")
            pos = [0.0, coord, z0] if is_a else [coord, 0.0, z0]
            for gi, g in enumerate(cut.geoms):
                label = ctx["next_label"]()
                parts.append(make_part(
                    pid=f"{region['id']}-{tag}{k:02d}"
                        f"{chr(97 + gi) if len(cut.geoms) > 1 else ''}",
                    region=region["id"], technique="interlocked",
                    polygon=g, thickness=t, pos=pos,
                    quat=A_QUAT if is_a else B_QUAT, label=label))
                # bottom edge (within 1.5mm of band base) -> platform sockets
                bb = g.bounds
                if bb[1] < 1.5:
                    seg = g.intersection(box(bb[0] - 1, -0.1, bb[2] + 1, 1.2))
                    if not seg.is_empty:
                        sb = seg.bounds
                        bottom_edges.append({
                            "axis": "x" if is_a else "y", "coord": round(coord, 2),
                            "range": [round(sb[0], 2), round(sb[2], 2)],
                            "z0_mm": round(z0, 2), "region": region["id"],
                        })

    emit(a_polys, a_slots, ys, True)
    emit(b_polys, b_slots, xs, False)

    meta = {"a_slices": n_a, "b_slices": n_b, "crossings": crossings,
            "slot_width": round(slot_w, 2),
            "footprint": [round(c, 1) for c in ext]}
    return parts, meta
