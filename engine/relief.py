"""Layered relief / shadowbox: a wall piece built from N flat panels stacked
face-on, each cut differently so the stack reads as depth. Optionally lit from
behind (LED gap between layers).

Two depth sources:
  - "mandala"  : generative radial-symmetric fretwork (no image needed)
  - "image"    : brightness of an image -> depth (bright = cut through more
                 layers, so backlight glows through) ; optional true monocular
                 depth if a depth map is provided.

Depth field D(x,y) in [0,1]:  material is present in layers 0..L-1 where
L = round(D*N). So D=1 -> all N layers (the frame / frontmost surface),
D=0 -> a through-hole. Layer k is present where D > k/N, which makes each
forward layer a subset of the one behind it (true stepped relief).

Coordinates: the art face spans local u (width) x v (height). Layers stack
along the piece's depth axis; generate.py places them standing up as wall art.
"""
import numpy as np
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union
from skimage import measure

from geometry import make_part, quat_from_basis, drop_small

# stand the art up: local X->engine X (width), local Y->engine Z (height).
# local Z (extrude/depth) must be X cross Y = [0,-1,0] for a right-handed
# rotation (a +Y here gives det -1 = a reflection = a broken quaternion), so
# depth runs along engine -Y and layers are stacked along -Y in build().
WALL_QUAT = quat_from_basis(np.array([1.0, 0, 0]),
                            np.array([0, 0, 1.0]),
                            np.array([0, -1.0, 0]))


# ---------------- depth sources ----------------

def depth_mandala(spec, W, H, res):
    """Radial-symmetric depth map in [0,1] on a (res_v x res_u) grid.

    Built as a CONNECTED WEB (radial spokes + concentric rings at full depth)
    with graded petal cells sunk between them. Because the web is full depth it
    survives on every layer, so nothing floats: rings stay tied to the frame
    through the spokes.
    """
    from scipy import ndimage
    seed = int(spec.get("seed", 1))
    sym = max(3, int(spec.get("symmetry", 8)))
    rings = max(2, int(spec.get("rings", 5)))
    spoke_w = float(spec.get("spoke_width", 0.28))   # fraction of a wedge
    ring_w = float(spec.get("ring_width", 0.16))     # fraction of ring spacing
    base = float(spec.get("center_depth", 0.0))      # petal-centre depth (0=holes)
    rng = np.random.default_rng(seed)
    ph = rng.uniform(0, 2 * np.pi)

    nu = max(96, int(res))
    nv = max(96, int(res * H / W))
    xs = np.linspace(-1, 1, nu)
    ys = np.linspace(-1, 1, nv) * (H / W)
    X, Y = np.meshgrid(xs, ys)
    r = np.sqrt(X ** 2 + Y ** 2)
    a = np.arctan2(Y, X) + ph
    r_norm = np.clip(r / 1.0, 0, 1.2)

    # radial spokes: fold angle into one wedge, high near the wedge centre line
    wedge = 2 * np.pi / sym
    af = ((a % wedge) - wedge / 2) / (wedge / 2)      # -1..1 across a wedge
    spoke = np.clip(1 - np.abs(af) / max(spoke_w, 1e-3), 0, 1)

    # concentric rings at r_j, high near each ring
    ring = np.zeros_like(r)
    spacing = 1.0 / rings
    for j in range(rings):
        r_j = (j + 0.6) * spacing
        ring = np.maximum(ring, np.clip(1 - np.abs(r_norm - r_j) / (ring_w * spacing), 0, 1))

    web = np.maximum(spoke, ring)
    # soften the web so petals step gently rather than as hard walls
    soft = ndimage.gaussian_filter(web, sigma=max(1.0, nu / 220))
    d = base + (1 - base) * np.clip(soft, 0, 1)

    # Explicit full-depth spoke bars of a fixed real width, so the connection
    # from centre boss out to the frame survives on EVERY layer and never
    # narrows below the min-feature width (a thin blurred spoke would be
    # filtered out and float the rings/centre).
    px_per_mm = nu / W
    bar_half = max(2.0, 1.6) * px_per_mm            # ~3.2mm wide bars
    dist_to_spoke = np.abs(af) * (wedge / 2) * r    # arc distance to spoke, norm units
    dist_mm = dist_to_spoke * (W / 2)
    d = np.where(dist_mm < (bar_half / px_per_mm), 1.0, d)

    # solid centre boss and solid outer frame keep the whole web anchored
    d = np.where(r_norm < 0.14, 1.0, d)
    d = np.where(r_norm > 1.05, 1.0, d)
    return np.clip(d, 0, 1), xs, ys


def depth_image(path, W, H, res, invert=False, blur=1.0, depthmap=None):
    """Brightness (or a supplied depth map) -> depth in [0,1]."""
    from PIL import Image, ImageFilter
    src = depthmap or path
    im = Image.open(src).convert("L")
    nu = max(64, int(res))
    nv = max(64, int(res * H / W))
    im = im.resize((nu, nv))
    if blur > 0:
        im = im.filter(ImageFilter.GaussianBlur(blur))
    d = np.asarray(im, dtype=float) / 255.0
    if invert:
        d = 1.0 - d
    xs = np.linspace(-1, 1, nu)
    ys = np.linspace(-1, 1, nv) * (H / W)
    return d, xs, ys


# ---------------- slicing ----------------

def _contour_polys(mask, xs, ys, W):
    """Marching-squares a boolean mask into shapely polygons in mm."""
    padded = np.zeros((mask.shape[0] + 2, mask.shape[1] + 2))
    padded[1:-1, 1:-1] = mask.astype(float)
    contours = measure.find_contours(padded, 0.5)
    sx = (W / 2)
    du = xs[1] - xs[0]
    dv = ys[1] - ys[0]
    rings = []
    for c in contours:
        u = (xs[0] + (c[:, 1] - 1) * du) * sx
        v = (ys[0] + (c[:, 0] - 1) * dv) * sx
        if len(u) >= 4:
            p = Polygon(np.column_stack([u, v]))
            if p.is_valid and p.area > 1:
                rings.append(p)
    if not rings:
        return MultiPolygon([])
    rings.sort(key=lambda r: r.area, reverse=True)
    depths = []
    for i, rp in enumerate(rings):
        pt = rp.representative_point()
        depths.append(sum(1 for j, o in enumerate(rings)
                          if j != i and o.area > rp.area and o.contains(pt)))
    polys = []
    for i, rp in enumerate(rings):
        if depths[i] % 2 == 0:
            holes = [list(r2.exterior.coords) for j, r2 in enumerate(rings)
                     if depths[j] == depths[i] + 1 and rp.contains(r2.representative_point())]
            p = Polygon(list(rp.exterior.coords), holes)
            if not p.is_valid:
                p = p.buffer(0)
            if not p.is_empty:
                polys.append(p)
    merged = unary_union(polys)
    if isinstance(merged, Polygon):
        return MultiPolygon([merged])
    if isinstance(merged, MultiPolygon):
        return merged
    return MultiPolygon([g for g in getattr(merged, "geoms", []) if isinstance(g, Polygon)])


def build(design, ctx):
    """Return (parts, meta) for a relief piece. ctx as in generate.py."""
    issues = ctx["issues"]
    spec = design.get("relief", {})
    size = design.get("size_mm", {})
    W = float(size.get("width", size.get("height", 300)))
    H = float(size.get("height", W))
    N = max(2, int(spec.get("layers", 6)))
    t = ctx["thickness"]
    spacer = float(spec.get("spacer_mm", 0.0))
    res = int(design.get("resolution", 240))
    border = float(spec.get("border_mm", max(10.0, W * 0.05)))

    source = spec.get("source", "mandala")
    # mandala can be made fully connected, so drop stray islands; a photo will
    # always have isolated bright features (a moon, glowing accents) — those are
    # legitimate glue-on accent pieces in layered shadowbox art, so keep them.
    keep_islands = bool(spec.get("keep_islands", source == "image"))
    if source == "image":
        img = spec.get("image", {})
        path = img.get("path")
        if not path:
            raise SystemExit("relief source 'image' needs relief.image.path")
        from pathlib import Path
        p = Path(path)
        if not p.is_absolute():
            p = (Path(__file__).parent.parent / path).resolve()
        d, xs, ys = depth_image(str(p), W, H, res,
                                invert=bool(img.get("invert", False)),
                                blur=float(img.get("blur", 1.0)),
                                depthmap=img.get("depthmap"))
    else:
        d, xs, ys = depth_mandala(spec.get("mandala", {}), W, H, res)

    d = np.clip(d, 0.0, 1.0)

    # frame: force the outer border to full depth so every layer shares it
    # (this is the registration + structural ring that holds the fretwork)
    sx = W / 2
    U = xs[None, :] * sx
    V = ys[:, None] * sx
    edge = (np.abs(U) > (W / 2 - border)) | (np.abs(V) > (H / 2 - border))
    frame_shape = None

    parts = []
    layer_shapes = []
    accent_total = [0]
    for k in range(N):
        thresh = k / N
        mask = (d > thresh) | edge
        # smooth tiny speckle
        mask = _despeckle(mask)
        polys = _contour_polys(mask, xs, ys, W)
        polys = drop_small(polys, min_area_mm2=max(30.0, (W * 0.01) ** 2),
                           min_feature_mm=ctx.get("min_feature_mm", 1.5),
                           issues=issues, ctx=f"relief layer {k}")
        if polys.is_empty:
            issues.append(f"relief layer {k}: empty after cleanup")
            continue
        polys, n_accent = _partition_islands(polys, W, H, border, keep_islands)
        if n_accent and not keep_islands:
            issues.append(f"relief layer {k}: {n_accent} floating island(s) dropped "
                          f"(would need glue) — raise symmetry or lower layer count")
        else:
            accent_total[0] += n_accent
        layer_shapes.append(polys)
        # stack along -Y so the frontmost layer (k=N-1) is at the most negative
        # Y and the back layer sits against the wall at Y=0
        depth_pos = -k * (t + spacer)
        for gi, g in enumerate(polys.geoms):
            label = ctx["next_label"]()
            parts.append(make_part(
                pid=f"relief-L{k:02d}{chr(97 + gi) if len(polys.geoms) > 1 else ''}",
                region="relief", technique="relief",
                polygon=g, thickness=t,
                # lift so the whole face sits above ground (art centred at H/2)
                pos=[0.0, depth_pos, H / 2], quat=WALL_QUAT, label=label))

    total_depth = (N - 1) * (t + spacer) + t
    meta = {"layers": len(layer_shapes), "spacer_mm": spacer,
            "total_depth_mm": round(total_depth, 1),
            "face_mm": [round(W, 1), round(H, 1)],
            "backlight": bool(spec.get("backlight", False)),
            "accent_pieces": accent_total[0],
            "source": source}
    if accent_total[0]:
        meta["accent_note"] = (f"{accent_total[0]} detached accent piece(s) — "
                               f"glue these onto their layer (isolated bright "
                               f"features like a moon or glow spots)")
    if spec.get("backlight"):
        meta["note"] = ("leave the rear layer solid or add a diffuser; "
                        "route LEDs in the spacer gap")
    return parts, meta


def _despeckle(mask):
    from scipy import ndimage
    m = ndimage.binary_opening(mask, iterations=1)
    m = ndimage.binary_closing(m, iterations=1)
    return m | mask if m.sum() < mask.sum() * 0.3 else m


def _partition_islands(polys, W, H, border, keep_islands):
    """Split pieces into frame-connected and floating. Returns (result_polys,
    n_floating). If keep_islands, floaters are kept (glue-on accents); else
    they're dropped."""
    ring = box(-W / 2, -H / 2, W / 2, H / 2).difference(
        box(-W / 2 + border, -H / 2 + border, W / 2 - border, H / 2 - border))
    connected, floating = [], []
    for g in polys.geoms:
        (connected if g.intersects(ring) else floating).append(g)
    if keep_islands:
        return MultiPolygon(connected + floating), len(floating)
    return (MultiPolygon(connected) if connected else polys), len(floating)
