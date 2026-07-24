"""Shared geometry: field slicing -> shapely polygons, and part records.

All part polygons are 2D in the part's LOCAL XY plane, in millimetres.
A part is extruded along local +Z by `thickness`, centered on its mid-plane
(local z in [-t/2, +t/2]), then placed with `pos` (mm, world Z-up) + `quat`.
"""
import numpy as np
from shapely.geometry import Point, Polygon, MultiPolygon
from shapely.ops import unary_union
from skimage import measure

BIG_OUTSIDE = 1e6


def sample_plane(field, plane_fn, u, v):
    """Evaluate field on the grid of (u x v); returns array shape (len(v), len(u)).
    plane_fn(U, V) -> (N,3) world points; U/V are flat arrays."""
    U, V = np.meshgrid(u, v)
    pts = plane_fn(U.ravel(), V.ravel())
    vals = field(pts).reshape(V.shape[0], U.shape[1])
    return vals


def field_to_polygons(vals, u, v, simplify_tol=0.35):
    """Marching squares at level 0 on a padded field -> MultiPolygon in (u,v)
    coords (same units as u/v arrays — call with mm grids). Negative = solid."""
    padded = np.full((vals.shape[0] + 2, vals.shape[1] + 2), BIG_OUTSIDE)
    padded[1:-1, 1:-1] = vals
    contours = measure.find_contours(padded, 0.0)
    du = u[1] - u[0]
    dv = v[1] - v[0]
    rings = []
    for c in contours:
        # rows -> v, cols -> u; subtract padding offset
        pts = np.column_stack([u[0] + (c[:, 1] - 1) * du,
                               v[0] + (c[:, 0] - 1) * dv])
        if len(pts) >= 4:
            ring = Polygon(pts)
            if ring.is_valid and ring.area > 1e-6:
                rings.append(ring)
    if not rings:
        return MultiPolygon([])
    # even-odd nesting: depth = number of other rings strictly containing it
    rings.sort(key=lambda r: r.area, reverse=True)
    depths = []
    for i, r in enumerate(rings):
        pt = r.representative_point()
        depth = sum(1 for j, other in enumerate(rings)
                    if j != i and other.area > r.area and other.contains(pt))
        depths.append(depth)
    shells = [(r, i) for i, r in enumerate(rings) if depths[i] % 2 == 0]
    polys = []
    for shell, si in shells:
        holes = []
        for i, r in enumerate(rings):
            if depths[i] == depths[si] + 1:
                if shell.contains(r.representative_point()):
                    holes.append(list(r.exterior.coords))
        p = Polygon(list(shell.exterior.coords), holes)
        if not p.is_valid:
            p = p.buffer(0)
        if not p.is_empty:
            polys.append(p)
    merged = unary_union(polys)
    if simplify_tol:
        merged = merged.simplify(simplify_tol, preserve_topology=True)
    if merged.is_empty:
        return MultiPolygon([])
    if isinstance(merged, Polygon):
        return MultiPolygon([merged])
    if isinstance(merged, MultiPolygon):
        return merged
    return MultiPolygon([g for g in getattr(merged, "geoms", []) if isinstance(g, Polygon)])


def drop_small(mp, min_area_mm2=60.0, min_feature_mm=2.0, issues=None, ctx=""):
    """Remove dust islands and pieces thinner than min_feature everywhere."""
    kept = []
    for g in mp.geoms:
        if g.area < min_area_mm2:
            continue
        if g.buffer(-min_feature_mm / 2).is_empty:
            if issues is not None:
                issues.append(f"{ctx}: dropped piece thinner than {min_feature_mm}mm everywhere")
            continue
        kept.append(g)
    return MultiPolygon(kept)


def quat_from_basis(x_axis, y_axis, z_axis):
    """Quaternion [x,y,z,w] from orthonormal basis columns (world = R @ local)."""
    m = np.column_stack([x_axis, y_axis, z_axis])
    t = np.trace(m)
    if t > 0:
        s = 0.5 / np.sqrt(t + 1.0)
        w = 0.25 / s
        x = (m[2, 1] - m[1, 2]) * s
        y = (m[0, 2] - m[2, 0]) * s
        z = (m[1, 0] - m[0, 1]) * s
    else:
        i = int(np.argmax([m[0, 0], m[1, 1], m[2, 2]]))
        if i == 0:
            s = 2.0 * np.sqrt(1.0 + m[0, 0] - m[1, 1] - m[2, 2])
            w = (m[2, 1] - m[1, 2]) / s
            x = 0.25 * s
            y = (m[0, 1] + m[1, 0]) / s
            z = (m[0, 2] + m[2, 0]) / s
        elif i == 1:
            s = 2.0 * np.sqrt(1.0 + m[1, 1] - m[0, 0] - m[2, 2])
            w = (m[0, 2] - m[2, 0]) / s
            x = (m[0, 1] + m[1, 0]) / s
            y = 0.25 * s
            z = (m[1, 2] + m[2, 1]) / s
        else:
            s = 2.0 * np.sqrt(1.0 + m[2, 2] - m[0, 0] - m[1, 1])
            w = (m[1, 0] - m[0, 1]) / s
            x = (m[0, 2] + m[2, 0]) / s
            y = (m[1, 2] + m[2, 1]) / s
            z = 0.25 * s
    return [float(x), float(y), float(z), float(w)]


IDENTITY_QUAT = [0.0, 0.0, 0.0, 1.0]


def poly_to_json(p: Polygon):
    return {
        "outer": [[round(x, 3), round(y, 3)] for x, y in p.exterior.coords],
        "holes": [[[round(x, 3), round(y, 3)] for x, y in ring.coords]
                  for ring in p.interiors],
    }


def make_part(pid, region, technique, polygon, thickness, pos, quat, label):
    return {
        "id": pid,
        "region": region,
        "technique": technique,
        "polygon": poly_to_json(polygon),
        "thickness": round(float(thickness), 3),
        "pos": [round(float(c), 3) for c in pos],
        "quat": [round(float(c), 6) for c in quat],
        "label": str(label),
        "area_mm2": round(polygon.area, 1),
    }


def make_mesh_part(pid, region, technique, vertices, faces, pos, label,
                   quat=None):
    """Part carried as a triangle mesh (e.g. 3D-printed pieces)."""
    v = np.asarray(vertices, dtype=float)
    f = np.asarray(faces, dtype=int)
    return {
        "id": pid,
        "region": region,
        "technique": technique,
        "mesh": {
            "vertices": [[round(float(c), 3) for c in row] for row in v],
            "faces": [[int(c) for c in row] for row in f],
        },
        "pos": [round(float(c), 3) for c in pos],
        "quat": [round(float(c), 6) for c in (quat or IDENTITY_QUAT)],
        "label": str(label),
        "area_mm2": 0.0,
    }


def spread_points(region_poly, n, min_gap):
    """Pick up to n well-separated interior points (greedy max-min)."""
    if region_poly.is_empty:
        return []
    minx, miny, maxx, maxy = region_poly.bounds
    xs = np.linspace(minx, maxx, 24)
    ys = np.linspace(miny, maxy, 24)
    cands = [(x, y) for x in xs for y in ys if region_poly.contains(Point(x, y))]
    if not cands:
        rp = region_poly.representative_point()
        return [(rp.x, rp.y)]
    picked = [max(cands, key=lambda c: region_poly.boundary.distance(Point(c)))]
    while len(picked) < n and cands:
        best, bestd = None, -1
        for c in cands:
            d = min((c[0] - p[0]) ** 2 + (c[1] - p[1]) ** 2 for p in picked)
            if d > bestd:
                best, bestd = c, d
        if best is None or np.sqrt(bestd) < min_gap:
            break
        picked.append(best)
        cands.remove(best)
    return picked
