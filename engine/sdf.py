"""Signed-ish scalar field for sculpture forms.

Convention: field(pts) < 0 inside the solid, > 0 outside. pts is an (N, 3)
float array in normalized sculpture space: z in [0, 1] bottom->top,
x/y roughly in [-0.5, 0.5]. Values need not be true distances — only the
zero level set matters (contours are extracted with marching squares).
"""
import numpy as np


# ---------- seeded helpers ----------

def _rng(seed, salt):
    return np.random.default_rng((int(seed) * 1_000_003 + salt) % (2**63))


def value_noise(seed, octaves=4):
    """Cheap band-limited 3D noise: sum of seeded sinusoid gratings.
    Returns f(pts)->(N,) roughly in [-1, 1]."""
    rng = _rng(seed, 7)
    n = 3 * max(1, int(octaves))
    dirs = rng.normal(size=(n, 3))
    dirs /= np.linalg.norm(dirs, axis=1, keepdims=True)
    freqs = 2.0 * (1.7 ** rng.integers(0, octaves, size=n)) * np.pi
    phases = rng.uniform(0, 2 * np.pi, size=n)
    amps = 1.0 / (1.0 + np.arange(n) * 0.35)
    amps /= amps.sum()

    def f(pts):
        acc = np.zeros(len(pts))
        for d, fr, ph, a in zip(dirs, freqs, phases, amps):
            acc += a * np.sin(fr * (pts @ d) + ph)
        return acc
    return f


def smooth_min(a, b, k=0.08):
    """Polynomial smooth union of two fields (k = blend radius)."""
    h = np.clip(0.5 + 0.5 * (b - a) / max(k, 1e-6), 0.0, 1.0)
    return b * (1 - h) + a * h - k * h * (1 - h)


# ---------- base shapes (all centered on the z axis, z in [0,1]) ----------

def _base_superellipsoid(p, params):
    e = float(params.get("exponent", 2.5))
    rx = float(params.get("rx", 0.38))
    ry = float(params.get("ry", 0.38))
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    zc = (z - 0.5) / 0.5
    return (np.abs(x / rx) ** e + np.abs(y / ry) ** e + np.abs(zc) ** e) - 1.0


def _base_torus(p, params):
    R = float(params.get("major", 0.3))
    r = float(params.get("minor", 0.12))
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    q = np.sqrt(x * x + y * y) - R
    return np.sqrt(q * q + ((z - 0.5) * 1.0) ** 2) - r


def _base_column(p, params):
    """Vertical column whose radius follows a seeded wobble profile."""
    r0 = float(params.get("radius", 0.28))
    waist = float(params.get("waist", 0.35))     # how much the profile swings
    lobes = float(params.get("lobes", 2.5))      # vertical undulations
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    r = np.sqrt(x * x + y * y)
    profile = r0 * (1.0 - waist * 0.5 + waist * 0.5 * np.sin(lobes * np.pi * z + 1.1))
    d = r - profile
    # cap top and bottom
    return np.maximum(d, np.maximum(-z, z - 1.0))


def _base_blob(p, params, seed):
    """Smooth union of K seeded spheres — organic lumpy mass."""
    k = int(params.get("count", 6))
    spread = float(params.get("spread", 0.22))
    rmin = float(params.get("rmin", 0.14))
    rmax = float(params.get("rmax", 0.26))
    rng = _rng(seed, 13)
    centers = rng.uniform(-spread, spread, size=(k, 3))
    centers[:, 2] = rng.uniform(0.25, 0.75, size=k)
    radii = rng.uniform(rmin, rmax, size=k)
    d = None
    for c, r in zip(centers, radii):
        di = np.linalg.norm(p - c, axis=1) - r
        d = di if d is None else smooth_min(d, di, k=0.09)
    return d


def _base_mushroom(p, params, seed):
    """Classic mushroom: flared stem + domed cap with a flat underside."""
    cap_r = float(params.get("cap_radius", 0.42))
    cap_h = float(params.get("cap_height", 0.20))
    cap_z = float(params.get("cap_center", 0.80))
    cap_under = float(params.get("cap_underside", 0.62))
    stem_r = float(params.get("stem_radius", 0.13))
    flare = float(params.get("flare", 0.5))
    wobble = float(params.get("stem_wobble", 0.15))
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    r = np.sqrt(x * x + y * y)
    # stem: radius profile with a bottom flare and gentle wobble
    prof = stem_r * (1.0
                     + flare * np.clip((0.22 - z) / 0.22, 0, None) ** 1.6
                     + wobble * 0.3 * np.sin(3.1 * np.pi * z + 0.7))
    stem = np.maximum(r - prof, np.maximum(-z, z - (cap_z + 0.02)))
    # cap: squashed ellipsoid, cut flat underneath (where the gills live)
    cap = np.sqrt((r / cap_r) ** 2 + ((z - cap_z) / cap_h) ** 2) - 1.0
    cap = np.maximum(cap, cap_under - z)
    return smooth_min(stem, cap * 0.25, k=0.06)


def _base_tree(p, params, seed):
    """Column trunk blended into a blobby canopy."""
    trunk = _base_column(p, {"radius": params.get("trunk_radius", 0.12),
                             "waist": 0.25, "lobes": 1.5})
    canopy_params = {"count": params.get("count", 7),
                     "spread": params.get("spread", 0.24),
                     "rmin": 0.13, "rmax": 0.24}
    q = p.copy()
    q[:, 2] = (q[:, 2] - 0.45) / 0.55 * 0.5 + 0.5   # canopy lives in upper part
    canopy = _base_blob(q, canopy_params, seed + 1)
    canopy = np.where(p[:, 2] < 0.35, canopy + (0.35 - p[:, 2]) * 2.0, canopy)
    return smooth_min(trunk, canopy, k=0.1)


# ---------- coordinate modifiers (applied to points before base eval) ----------

def _mod_twist(p, amount, axis):
    ang = amount * np.pi * p[:, 2]
    c, s = np.cos(ang), np.sin(ang)
    q = p.copy()
    q[:, 0] = c * p[:, 0] - s * p[:, 1]
    q[:, 1] = s * p[:, 0] + c * p[:, 1]
    return q


def _mod_taper(p, amount, axis):
    s = 1.0 / np.clip(1.0 - amount * p[:, 2], 0.25, 4.0)
    q = p.copy()
    q[:, 0] *= s
    q[:, 1] *= s
    return q


def _mod_bend(p, amount, axis):
    q = p.copy()
    q[:, 0] = p[:, 0] - amount * (p[:, 2] - 0.5) ** 2 * 2.0
    return q


def _mod_ripple(p, amount, axis):
    r = np.sqrt(p[:, 0] ** 2 + p[:, 1] ** 2) + 1e-9
    scale = 1.0 + amount * 0.15 * np.sin(10.0 * np.pi * p[:, 2])
    q = p.copy()
    q[:, 0] *= scale
    q[:, 1] *= scale
    return q


_COORD_MODS = {"twist": _mod_twist, "taper": _mod_taper,
               "bend": _mod_bend, "ripple": _mod_ripple}


# ---------- field assembly ----------

def _apply_symmetry(p, symmetry):
    if not symmetry:
        return p
    q = p.copy()
    if symmetry.get("mirror") == "x":
        q[:, 0] = np.abs(q[:, 0])
    if symmetry.get("mirror") == "y":
        q[:, 1] = np.abs(q[:, 1])
    n = int(symmetry.get("radial", 0) or 0)
    if n >= 2:
        ang = np.arctan2(q[:, 1], q[:, 0])
        r = np.sqrt(q[:, 0] ** 2 + q[:, 1] ** 2)
        wedge = np.pi / n
        ang = np.abs(((ang + wedge) % (2 * wedge)) - wedge)  # fold into wedge
        q[:, 0] = r * np.cos(ang)
        q[:, 1] = r * np.sin(ang)
    return q


def make_field(design, issues=None):
    """Build field(pts:(N,3))->(N,) from a design dict. Negative = inside.

    The returned function carries `.xy_half`: the form's XY half-extent in
    normalized units, so samplers can size their window to the actual model
    (procedural bases stay at the historical 0.62)."""
    form = design.get("form", {})
    seed = int(design.get("seed", 1))
    base_kind = form.get("base", "column")
    base_params = form.get("base_params", {})
    modifiers = form.get("modifiers", [])
    symmetry = form.get("symmetry", {})

    noise_amt = 0.0
    bulge_amt = 0.0
    coord_mods = []
    for m in modifiers:
        t = m.get("type")
        amt = float(m.get("amount", 0.5))
        if t == "noise":
            noise_amt = amt
        elif t == "bulge":
            bulge_amt = amt
        elif t in _COORD_MODS:
            coord_mods.append((t, amt, m.get("axis", "z")))

    noise_f = value_noise(seed) if noise_amt else None

    mesh_fn = None
    mesh_xy_half = None
    if base_kind == "mesh":
        from meshsrc import mesh_field
        mesh_fn, mesh_xy_half = mesh_field(base_params,
                                           issues if issues is not None else [])

    def field(pts):
        p = np.asarray(pts, dtype=float)
        p = _apply_symmetry(p, symmetry)
        for t, amt, axis in coord_mods:
            p = _COORD_MODS[t](p, amt, axis)
        if base_kind == "superellipsoid":
            d = _base_superellipsoid(p, base_params)
        elif base_kind == "torus":
            d = _base_torus(p, base_params)
        elif base_kind == "blob":
            d = _base_blob(p, base_params, seed)
        elif base_kind == "tree":
            d = _base_tree(p, base_params, seed)
        elif base_kind == "mushroom":
            d = _base_mushroom(p, base_params, seed)
        elif base_kind == "mesh":
            d = mesh_fn(p)
        else:
            d = _base_column(p, base_params)
        if bulge_amt:
            d = d - bulge_amt * 0.2 * np.sin(np.pi * np.clip(p[:, 2], 0, 1))
        if noise_f is not None:
            d = d + noise_amt * 0.13 * noise_f(np.asarray(pts, dtype=float))
        return d

    # sampling window: procedural bases live within ±0.62; an imported mesh can
    # be much wider than tall, so report its real extent (plus a margin).
    field.xy_half = 0.62 if mesh_xy_half is None else max(0.62, mesh_xy_half * 1.08)
    return field
