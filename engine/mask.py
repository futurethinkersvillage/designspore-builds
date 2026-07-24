"""Wearable mask mode: a face-fit dome shell deconstructed into stacked
topographic layers (v1 output; egg-crate + rotary solid come next).

The mask is a heightfield Z(x,y) in mm over the face plane: an egg-shaped
superellipse dome sized from real face measurements, plus a nose ridge so the
shell clears the wearer's nose. Openings (eyes, mouth vents, strap slots) are
punched to Z=0 and therefore pass through every layer.

Stacked construction: layer k spans z in [k*t, (k+1)*t). Its outline is the
dome contour at the layer's mid-height; each layer is then hollowed to a ring
of in-plane width `wall_mm` (erosion of its own outline), so the stack glues
into a hollow shell the face fits behind. Layers whose erosion vanishes (the
nose cap) stay solid. Every boundary — outer edge and every opening — keeps
`wall_mm` of material by construction.

Anthropometry anchors (fractions of brow->chin height, from the chin):
eyes 0.57 up, nose tip 0.38, mouth 0.25. Pupillary distance positions the eye
openings; the nose ridge is a vertical gaussian bump between eye and nose-tip
lines with amplitude chosen to reach `nose_clearance_mm`.
"""
import numpy as np
from shapely.geometry import MultiPolygon, Point, Polygon

from geometry import drop_small, field_to_polygons, make_part
from relief import WALL_QUAT


# fractions of face height measured up from the chin line
EYE_LINE = 0.57
NOSE_TIP = 0.38
MOUTH_LINE = 0.25


def _face_frame(spec):
    """Resolve measurements into the working frame (all mm).

    Returns dict with the plane extents and anatomical y positions in the
    engine's v axis (v=0 at plane centre, +v toward the brow)."""
    face = spec.get("face", {})
    fw = float(face.get("width_mm", 160.0))
    fh = float(face.get("height_mm", 220.0))
    margin = float(face.get("margin_mm", 18.0))
    W = fw + 2 * margin
    H = fh + 2 * margin

    def face_y(frac_from_chin):
        # chin sits at -fh/2 on the v axis (margin extends beyond it)
        return -fh / 2 + frac_from_chin * fh

    return {
        "face_w": fw, "face_h": fh, "margin": margin, "W": W, "H": H,
        "pd": float(face.get("pd_mm", 63.0)),
        "eye_w": float(face.get("eye_w_mm", 42.0)),
        "eye_h": float(face.get("eye_h_mm", 22.0)),
        "nose_clearance": float(face.get("nose_clearance_mm", 45.0)),
        "mouth_vents": bool(face.get("mouth_vents", True)),
        "vent_rows": int(face.get("vent_rows", 2)),
        "eye_y": face_y(EYE_LINE),
        "nose_y": face_y(NOSE_TIP),
        "mouth_y": face_y(MOUTH_LINE),
    }


def _silhouette(U, V, fr, chin_taper, brow_flat):
    """Radial face-shape parameter s: s<1 inside the mask outline, 1 at edge.

    Egg profile: half-width shrinks toward the chin (chin_taper) and slightly
    toward the crown (brow_flat keeps the top fuller but still rounded)."""
    a0 = fr["W"] / 2
    b0 = fr["H"] / 2
    vn = np.clip(V / b0, -1.2, 1.2)                     # -1 chin .. +1 brow
    lower = np.clip(-vn, 0, None)                        # 0 above centre
    upper = np.clip(vn, 0, None)
    width = a0 * (1 - chin_taper * lower ** 1.7) * (1 - 0.5 * brow_flat * upper ** 2.2)
    s = np.sqrt((U / np.maximum(width, 1e-6)) ** 2 + vn ** 2)
    return s


def _dome(U, V, s, fr, depth):
    """Height field Z(x,y) in mm: smooth dome + nose ridge."""
    core = np.clip(1 - s ** 2, 0, 1) ** 0.75
    Z = depth * core

    # nose ridge: vertical gaussian blade from between the eyes to below the
    # nose tip; amplitude tops the dome up to nose clearance at the tip.
    ridge_c = (fr["eye_y"] + fr["nose_y"]) / 2
    ridge_len = max(fr["eye_y"] - fr["nose_y"], 20.0)
    g = (np.exp(-((U / (0.16 * fr["face_w"])) ** 2))
         * np.exp(-(((V - ridge_c) / (0.85 * ridge_len)) ** 2)))
    at_tip = float(np.exp(-(((fr["nose_y"] - ridge_c) / (0.85 * ridge_len)) ** 2)))
    dome_at_tip = depth * float(
        np.clip(1 - (abs(fr["nose_y"]) / (fr["H"] / 2)) ** 2, 0, 1) ** 0.75)
    want = fr["nose_clearance"] + 6.0                    # shell clears the nose
    amp = max(0.0, (want - dome_at_tip) / max(at_tip, 1e-6))
    return Z + amp * g


def _decoration(U, V, s, Z, spec, fr, issues):
    """Carve an artwork depth-map into the dome surface.

    spec: {"image": path, "strength_mm": 12, "blur": 1.5, "mode": "carve"}
    The image is sampled over the face plane; brightness B in [0,1] maps to
    relief: carve mode removes (1-B)*strength from the surface, emboss adds
    B*strength. The effect fades toward the rim (core^0.5) so the silhouette
    and the glue walls stay intact, and never cuts deeper than 60% of the
    local dome height (the shell must stay a shell)."""
    path = spec.get("image")
    if not path:
        return Z
    from pathlib import Path
    from PIL import Image, ImageFilter
    p = Path(path)
    if not p.is_absolute():
        p = (Path(__file__).parent.parent / path).resolve()
    if not p.exists():
        issues.append(f"mask decoration image missing: {p}")
        return Z
    im = Image.open(p).convert("L")
    im = im.resize((U.shape[1], U.shape[0]))
    blur = float(spec.get("blur", 1.5))
    if blur > 0:
        im = im.filter(ImageFilter.GaussianBlur(blur))
    B = np.asarray(im, dtype=float) / 255.0
    if bool(spec.get("invert", False)):
        B = 1.0 - B
    strength = float(spec.get("strength_mm", 12.0))
    fade = np.clip(1 - s ** 2, 0, 1) ** 0.5
    if spec.get("mode", "carve") == "emboss":
        return Z + strength * B * fade
    cut = strength * (1.0 - B) * fade
    return Z - np.minimum(cut, 0.6 * np.maximum(Z, 0))


def _openings(U, V, fr, strap):
    """Boolean grid of punched-through regions (True = hole)."""
    holes = np.zeros(U.shape, dtype=bool)

    def ellipse(cx, cy, rx, ry):
        return ((U - cx) / rx) ** 2 + ((V - cy) / ry) ** 2 <= 1.0

    # eyes
    for sx in (-1, 1):
        holes |= ellipse(sx * fr["pd"] / 2, fr["eye_y"],
                         fr["eye_w"] / 2, fr["eye_h"] / 2)
    # mouth vents: rows of rounded slots
    if fr["mouth_vents"]:
        slot_w, slot_h, gap = 26.0, 5.0, 8.0
        for row in range(fr["vent_rows"]):
            cy = fr["mouth_y"] - row * (slot_h + gap)
            for col in (-1, 0, 1):
                cx = col * (slot_w + gap)
                holes |= ((np.abs(U - cx) <= slot_w / 2)
                          & (np.abs(V - cy) <= slot_h / 2))
    # strap slots near the temples
    if strap == "slots":
        sw, sh = 5.0, 24.0
        sx_pos = fr["face_w"] / 2 + fr["margin"] * 0.15
        for sx in (-1, 1):
            holes |= ((np.abs(U - sx * sx_pos) <= sw / 2)
                      & (np.abs(V - fr["eye_y"] + 6) <= sh / 2))
    return holes


from geometry import quat_from_basis

# egg-crate part orientations (mask standing: face toward -Y, chin at z=0).
# A: horizontal plates — local X = face width u, local Y = depth (toward -Y)
A_EGG_QUAT = quat_from_basis(np.array([1.0, 0, 0]), np.array([0, -1.0, 0]),
                             np.array([0, 0, -1.0]))
# B: vertical profiles — local X = face height v (up), local Y = depth
B_EGG_QUAT = quat_from_basis(np.array([0, 0, 1.0]), np.array([0, -1.0, 0]),
                             np.array([1.0, 0, 0]))


def _build_eggcrate(spec, ctx, fr, Z, u, v, peak):
    """Egg-crate lattice built directly on the mask heightfield.

    B-slices are vertical profiles (fixed x, spread across the face width);
    A-slices are horizontal profiles (fixed y, spread across the face height).
    Each slice's outline is the dome section under its line. Half-lap slots at
    every crossing deep enough (>= 4t): A slots from the FRONT surface to the
    mid-depth, B from the back plane up — the horizontal set drops onto the
    vertical set face-first. Slices span the whole face; edge crossings that
    are too shallow simply get no slot (glue there instead)."""
    from shapely.geometry import box
    from shapely.ops import unary_union
    issues = ctx["issues"]
    t = ctx["thickness"]
    slot_w = t + float(ctx.get("fit_tolerance", 0.2))
    n_b = max(3, int(spec.get("x_slices", 7)))    # vertical, across width
    n_a = max(3, int(spec.get("y_slices", 8)))    # horizontal, across height
    H = fr["H"]

    du = u[1] - u[0]
    dv = v[1] - v[0]

    def col(x):
        j = int(np.clip(round((x - u[0]) / du), 0, len(u) - 1))
        return Z[:, j]                            # profile along v

    def rowp(y):
        i = int(np.clip(round((y - v[0]) / dv), 0, len(v) - 1))
        return Z[i, :]                            # profile along u

    def z_at(x, y):
        i = int(np.clip(round((y - v[0]) / dv), 0, len(v) - 1))
        j = int(np.clip(round((x - u[0]) / du), 0, len(u) - 1))
        return float(Z[i, j])

    def profile_poly(axis_vals, prof):
        """Polygon under a height profile: (axis, z) with z in [0, prof]."""
        grid_z = np.linspace(-1.0, peak + 1.0, 96)
        _, Gz = np.meshgrid(axis_vals, grid_z)
        P = np.tile(prof, (len(grid_z), 1))
        vals = np.where((Gz >= 0) & (Gz <= P) & (P > 0.5), -1.0, 1.0)
        mp = field_to_polygons(vals, axis_vals, grid_z)
        return drop_small(mp, min_area_mm2=200.0,
                          min_feature_mm=ctx.get("min_feature_mm", 1.5),
                          issues=issues, ctx="mask eggcrate slice")

    # slice positions avoid the outermost margin where the dome is a sliver
    xs = np.linspace(-fr["face_w"] / 2 * 0.86, fr["face_w"] / 2 * 0.86, n_b)
    ys = np.linspace(-fr["face_h"] / 2 * 0.82, fr["face_h"] / 2 * 0.78, n_a)

    b_polys = [profile_poly(v, col(x)) for x in xs]
    a_polys = [profile_poly(u, rowp(y)) for y in ys]

    # slots at deep-enough crossings
    a_slots = [[] for _ in ys]
    b_slots = [[] for _ in xs]
    crossings = 0
    for i, y in enumerate(ys):
        for j, x in enumerate(xs):
            zf = z_at(x, y)
            if zf < 4 * t:
                continue
            mid = zf / 2
            a_slots[i].append(box(x - slot_w / 2, mid, x + slot_w / 2, zf + 2))
            b_slots[j].append(box(y - slot_w / 2, -2.0, y + slot_w / 2, mid))
            crossings += 1
    if crossings == 0:
        issues.append("mask eggcrate: no crossings deep enough for slots — "
                      "increase depth or reduce slice counts")

    parts = []

    def emit(polys, slots, coords, tag):
        for k, (mp, sl, coord) in enumerate(zip(polys, slots, coords)):
            if mp.is_empty:
                continue
            cut = mp.difference(unary_union(sl)) if sl else mp
            if isinstance(cut, Polygon):
                cut = MultiPolygon([cut])
            cut = drop_small(cut, issues=issues,
                             ctx=f"mask eggcrate {tag}{k:02d} (slot cut)")
            for gi, g in enumerate(cut.geoms):
                label = ctx["next_label"]()
                # local plane: A (horizontal, fixed y): X=u, Y=depth-z
                # B (vertical, fixed x): X=v, Y=depth-z. Both stood up so the
                # face points -Y and the chin sits at world z=0.
                if tag == "A":
                    pos = [0.0, 0.0, coord + H / 2]
                    quat = A_EGG_QUAT
                else:
                    pos = [coord, 0.0, H / 2]
                    quat = B_EGG_QUAT
                parts.append(make_part(
                    pid=f"mask-{tag}{k:02d}"
                        f"{chr(97 + gi) if len(cut.geoms) > 1 else ''}",
                    region="mask", technique="mask-eggcrate",
                    polygon=g, thickness=t, pos=pos, quat=quat, label=label))

    emit(a_polys, a_slots, ys, "A")
    emit(b_polys, b_slots, xs, "B")

    meta = {"output": "eggcrate",
            "a_slices": n_a, "b_slices": n_b, "crossings": crossings,
            "slot_width": round(slot_w, 2),
            "depth_mm": round(peak, 1),
            "face_mm": [round(fr["face_w"], 1), round(fr["face_h"], 1)],
            "plane_mm": [round(fr["W"], 1), round(fr["H"], 1)],
            "note": "horizontal set slots on from the front; glue shallow "
                    "crossings that have no slot"}
    return parts, meta


def _build_rotary(spec, ctx, fr, Z, u, v, peak):
    """Watertight solid mesh of the mask for 4th-axis rotary carving (or any
    CAM). Exported as a mesh part; export_stl.py writes the STL."""
    from skimage import measure as sk_measure
    from geometry import make_mesh_part
    issues = ctx["issues"]
    shell = float(spec.get("rotary_shell_mm", 0.0))

    # downsample the height grid so step_size can stay 1 (larger steps crack
    # the marching-cubes mesh); target ~170 columns
    ds = max(1, int(np.ceil(Z.shape[1] / 170)))
    Zs = Z[::ds, ::ds].copy()
    us = u[::ds]
    vs = v[::ds]
    # the downsample can drop the zero-height boundary rows/cols — force the
    # border empty so the marching-cubes surface closes
    Zs[0, :] = Zs[-1, :] = 0.0
    Zs[:, 0] = Zs[:, -1] = 0.0

    # signed volume over (v, u, z): negative inside, smooth values so the
    # marching-cubes surface interpolates instead of voxel-stepping
    nz = max(48, min(90, int(peak / 1.4)))
    zs = np.linspace(-1.0, peak + 1.0, nz)
    vol = np.empty((Zs.shape[0], Zs.shape[1], nz), dtype=np.float32)
    for k, z in enumerate(zs):
        d = np.maximum(z - Zs, -z)
        if shell > 0:
            d = np.maximum(d, np.maximum(Zs - shell, 0.0) - z)
        vol[:, :, k] = d
    if not (vol < 0).any():
        issues.append("mask rotary: empty volume")
        return [], {}
    dv = vs[1] - vs[0]
    du = us[1] - us[0]
    dz = zs[1] - zs[0]
    # level slightly inside the material: at the rim the surface meets the
    # base plane in a degenerate zero-sheet. Remaining saddle pinches are
    # repaired in export_stl.py (validate=True).
    verts, faces, _, _ = sk_measure.marching_cubes(
        vol, -0.05, spacing=(dv, du, dz))
    # verts come back as (v_idx, u_idx, z) spacings -> map to mm coords
    vy = verts[:, 0] + vs[0]
    vx = verts[:, 1] + us[0]
    vz = verts[:, 2] + zs[0]
    H = fr["H"]
    # stand it up like the other outputs: face toward -Y, chin at z=0
    world = np.column_stack([vx, -vz, vy + H / 2])
    parts = [make_mesh_part("mask-solid", "mask", "mask-rotary",
                            world, faces, [0.0, 0.0, 0.0],
                            ctx["next_label"]())]
    # rotary stock: axis along the mask's height; radial extent from the axis
    axis_off = peak / 2.0
    r = np.sqrt(vx ** 2 + (vz - axis_off) ** 2)
    stock_d = float(2 * r.max() + 6.0)
    meta = {"output": "rotary", "triangles": int(len(faces)),
            "depth_mm": round(peak, 1),
            "face_mm": [round(fr["face_w"], 1), round(fr["face_h"], 1)],
            "stock": {"type": "cylinder", "diameter_mm": round(stock_d, 1),
                      "length_mm": round(fr["H"] + 10, 1),
                      "axis": "through the mask vertically, centred "
                              f"{axis_off:.0f}mm in front of the back plane"},
            "note": "import mask.stl into your CAM (Fusion/Carveco) for "
                    "rotary or two-sided 3-axis toolpaths"}
    if shell > 0:
        meta["shell_mm"] = shell
    return parts, meta


def _ring(poly, wall):
    """Hollow a layer outline to a ring of in-plane width `wall`. Solid caps
    (erosion vanishes) come back unchanged."""
    inner = poly.buffer(-wall)
    if inner.is_empty:
        return [poly]
    out = poly.difference(inner)
    if isinstance(out, Polygon):
        return [out]
    if isinstance(out, MultiPolygon):
        return list(out.geoms)
    return [poly]


def build(design, ctx):
    """Return (parts, meta) for a mask. ctx as in generate.py."""
    issues = ctx["issues"]
    spec = design.get("mask", {})
    fr = _face_frame(spec)
    depth = float(spec.get("depth_mm", 80.0))
    wall = float(spec.get("wall_mm", 10.0))
    chin_taper = float(spec.get("chin_taper", 0.35))
    brow_flat = float(spec.get("brow_flat", 0.15))
    strap = spec.get("strap", "slots")
    n_dowels = int(spec.get("dowels", 2))
    dowel_d = float(spec.get("dowel_diameter", 4.0))
    t = ctx["thickness"]
    res = int(design.get("resolution", 240))

    W, H = fr["W"], fr["H"]
    nu = max(128, res)
    nv = max(128, int(res * H / W))
    u = np.linspace(-W / 2, W / 2, nu)
    v = np.linspace(-H / 2, H / 2, nv)
    U, V = np.meshgrid(u, v)

    s = _silhouette(U, V, fr, chin_taper, brow_flat)
    Z = _dome(U, V, s, fr, depth)
    deco = spec.get("decoration") or {}
    if deco:
        Z = _decoration(U, V, s, Z, deco, fr, issues)
    Z[s >= 1.0] = 0.0
    peak = float(Z.max())
    holes = _openings(U, V, fr, strap)
    Z[holes] = 0.0

    if peak < fr["nose_clearance"] + t:
        issues.append(f"mask: dome peak {peak:.0f}mm can't clear the nose "
                      f"({fr['nose_clearance']:.0f}mm) — raise depth_mm")

    output = spec.get("output", "stacked")
    if output == "eggcrate":
        return _build_eggcrate(spec, ctx, fr, Z, u, v, peak)
    if output == "rotary":
        return _build_rotary(spec, ctx, fr, Z, u, v, peak)

    n_layers = int(np.ceil(peak / t))
    if n_layers > 60:
        issues.append(f"mask: {n_layers} layers of {t}mm — consider a thicker "
                      f"material or a smaller depth_mm")

    # pass 1: layer outlines -> hollow rings
    layer_geoms = []                                      # [(k, [Polygon,...])]
    for k in range(n_layers):
        z_mid = (k + 0.5) * t
        vals = z_mid - Z                                  # negative = solid
        mp = field_to_polygons(vals, u, v)
        mp = drop_small(mp, min_area_mm2=40.0,
                        min_feature_mm=ctx.get("min_feature_mm", 1.5),
                        issues=issues, ctx=f"mask layer {k}")
        if mp.is_empty:
            continue
        geoms = []
        for g in mp.geoms:
            geoms.extend(_ring(g, wall))
        layer_geoms.append((k, geoms))

    # dowel sites: on the BACK layer's actual wall band at temple height, so
    # alignment holes run through as much of the lower stack as possible
    dowel_pts = []
    if n_dowels > 0 and layer_geoms:
        from shapely.geometry import LineString
        from shapely.ops import unary_union
        y_d = fr["eye_y"] - 14.0
        # aim for the overlap of the first few rings so the pin crosses as many
        # layers as the shrinking contours allow; fall back to fewer layers
        back = unary_union(layer_geoms[0][1])
        for depth_n in (4, 3, 2):
            cand = back
            for _, gs in layer_geoms[1:depth_n]:
                cand = cand.intersection(unary_union(gs))
            if not cand.is_empty and cand.area > dowel_d ** 2 * 4:
                back = cand
                break
        cut = back.intersection(LineString([(-W / 2, y_d), (W / 2, y_d)]))
        segs = ([cut] if cut.geom_type == "LineString"
                else list(getattr(cut, "geoms", [])))
        segs = [g for g in segs if g.geom_type == "LineString" and g.length > dowel_d * 2]
        if segs:
            left = min(segs, key=lambda g: g.centroid.x)
            right = max(segs, key=lambda g: g.centroid.x)
            picks = [left] if n_dowels == 1 or left is right else [left, right]
            dowel_pts = [(g.centroid.x, y_d) for g in picks]
        else:
            issues.append("mask: no wall band at dowel height — dowels skipped")

    parts = []
    dowel_hits = [0] * len(dowel_pts)
    layer_count = len(layer_geoms)
    for k, geoms in layer_geoms:
        # alignment holes wherever a dowel site lands inside a piece
        punched = []
        for g in geoms:
            for di, (dx, dy) in enumerate(dowel_pts):
                probe = Point(dx, dy)
                if g.contains(probe) and g.boundary.distance(probe) > dowel_d * 0.75:
                    g = g.difference(probe.buffer(dowel_d / 2, resolution=16))
                    dowel_hits[di] += 1
            if isinstance(g, MultiPolygon):
                punched.extend(g.geoms)
            else:
                punched.append(g)
        depth_pos = -k * t          # stack toward the viewer, back layer at 0
        for gi, g in enumerate(punched):
            label = ctx["next_label"]()
            parts.append(make_part(
                pid=f"mask-L{k:02d}{chr(97 + gi) if len(punched) > 1 else ''}",
                region="mask", technique="mask",
                polygon=g, thickness=t,
                pos=[0.0, depth_pos, H / 2], quat=WALL_QUAT, label=label))

    meta = {
        "layers": layer_count,
        "depth_mm": round(peak, 1),
        "face_mm": [round(fr["face_w"], 1), round(fr["face_h"], 1)],
        "plane_mm": [round(W, 1), round(H, 1)],
        "wall_mm": wall,
        "nose_clearance_mm": fr["nose_clearance"],
        "openings": {
            "eyes": {"pd_mm": fr["pd"], "size_mm": [fr["eye_w"], fr["eye_h"]]},
            "mouth_vents": fr["mouth_vents"],
            "strap": strap,
        },
        "dowels": [{"pos_mm": [round(x, 1), round(y, 1)],
                    "layers_through": dowel_hits[i]}
                   for i, (x, y) in enumerate(dowel_pts)],
    }
    if dowel_pts and min(dowel_hits) < max(2, layer_count // 4):
        issues.append("mask: a dowel passes through very few layers — the "
                      "upper stack aligns by eye (see assembly guide)")
    return parts, meta
