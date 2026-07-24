"""Mesh import: STL/OBJ/GLB/PLY/3MF -> the same scalar field the generators use.

An imported mesh becomes `form.base = "mesh"`, so every existing technique
backend (stacked / radial / interlocked / printed) works on it unchanged.

Pipeline: load -> orient -> normalize (height = 1.0, centred in XY, base at z=0)
-> voxelize + fill -> signed distance transform -> trilinear sampler.

We use a voxel SDF rather than mesh.contains() because the techniques sample
hundreds of thousands of points; ray-casting each one is orders of magnitude
slower, and a distance field gives smoother, more robust contours on messy
real-world meshes.
"""
import hashlib
from pathlib import Path

import numpy as np
from scipy import ndimage

try:
    import trimesh
except Exception:
    trimesh = None

_CACHE = {}
DEFAULT_VOXEL_RES = 160


def _orient(mesh, up):
    """Rotate so the model's up axis becomes +Z (our convention)."""
    if up == "y":
        mesh.apply_transform(trimesh.transformations.rotation_matrix(
            np.pi / 2, [1, 0, 0]))
    elif up == "-z":
        mesh.apply_transform(trimesh.transformations.rotation_matrix(
            np.pi, [1, 0, 0]))
    elif up == "x":
        mesh.apply_transform(trimesh.transformations.rotation_matrix(
            -np.pi / 2, [0, 1, 0]))
    return mesh


def _normalize(mesh):
    """Height -> 1.0, centred in XY, base sitting on z = 0."""
    lo, hi = mesh.bounds
    height = float(hi[2] - lo[2])
    if height <= 0:
        raise ValueError("mesh has zero height after orientation")
    scale = 1.0 / height
    mesh.apply_translation([-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -lo[2]])
    mesh.apply_scale(scale)
    return mesh


def _build_sdf(mesh, res, issues):
    """Voxelize, fill, and convert to a signed distance field (negative inside)."""
    pitch = 1.0 / float(res)
    vg = mesh.voxelized(pitch=pitch)
    filled = False
    try:
        vg = vg.fill()
        filled = True
    except Exception:
        pass
    mat = np.asarray(vg.matrix, dtype=bool)
    if filled and not mat.any():
        filled = False
    if not filled or mat.sum() < 8:
        # non-watertight mesh: fall back to closing the shell ourselves
        mat = np.asarray(vg.matrix, dtype=bool)
        mat = ndimage.binary_closing(mat, iterations=2)
        mat = ndimage.binary_fill_holes(mat)
        issues.append("mesh is not watertight — interior filled heuristically; "
                      "check the sliced result, or repair the mesh first")
    if not mat.any():
        raise ValueError("voxelization produced no solid cells")

    # Pad with empty cells. Voxelization bounds the mesh tightly, so without
    # this the boundary cells sit ON the surface and read as ~0 (i.e. solid);
    # any sample beyond the grid then clamps to them and the model appears to
    # extend forever.
    pad = 4
    mat = np.pad(mat, pad, mode="constant", constant_values=False)

    # signed distance in normalized units (negative inside)
    d_out = ndimage.distance_transform_edt(~mat)
    d_in = ndimage.distance_transform_edt(mat)
    sdf = (d_out - d_in) * pitch

    T = np.asarray(vg.transform, dtype=float)   # voxel index -> world
    # padding shifted every index by +pad, so move the origin back to match
    T = T.copy()
    T[:3, 3] -= T[:3, :3] @ np.full(3, float(pad))
    return sdf, np.linalg.inv(T), pitch


def _cache_key(path, params):
    p = Path(path)
    stat = p.stat()
    raw = f"{p.resolve()}|{stat.st_mtime_ns}|{stat.st_size}|{params}"
    return hashlib.sha1(raw.encode()).hexdigest()


def mesh_field(params, issues):
    """Return (field_fn, xy_half) for a mesh-backed form.

    field_fn(pts:(N,3)) -> (N,) negative inside; pts in normalized space.
    xy_half is the model's XY half-extent (normalized), so callers can widen
    their sampling window for models wider than they are tall.
    """
    if trimesh is None:
        raise SystemExit("trimesh is required for mesh import — pip install trimesh")
    path = params.get("path")
    if not path:
        raise SystemExit("form.base_params.path is required for base 'mesh'")
    p = Path(path)
    if not p.is_absolute():
        p = (Path(__file__).parent.parent / path).resolve()
    if not p.exists():
        raise SystemExit(f"mesh not found: {p}")

    res = int(params.get("voxel_res", DEFAULT_VOXEL_RES))
    up = params.get("up", "z")
    key = _cache_key(p, f"{res}|{up}")
    if key in _CACHE:
        return _CACHE[key]

    mesh = trimesh.load(str(p), force="mesh")
    if mesh.is_empty or len(mesh.faces) == 0:
        raise SystemExit(f"mesh loaded but contains no faces: {p}")
    mesh = _orient(mesh, up)
    mesh = _normalize(mesh)

    lo, hi = mesh.bounds
    xy_half = float(max(abs(lo[0]), abs(hi[0]), abs(lo[1]), abs(hi[1])))

    sdf, Tinv, pitch = _build_sdf(mesh, res, issues)
    max_idx = np.array(sdf.shape, dtype=float) - 1.0

    def field(pts):
        pts = np.asarray(pts, dtype=float)
        h = np.column_stack([pts, np.ones(len(pts))])
        idx = (h @ Tinv.T)[:, :3]
        # Sample inside the grid with trilinear interpolation. Points beyond it
        # are clamped to the (padded, therefore outside) border and get their
        # true overshoot distance added, so the field keeps growing outward
        # instead of smearing the border value across all of space.
        clamped = np.clip(idx, 0.0, max_idx)
        overshoot = np.linalg.norm((idx - clamped) * pitch, axis=1)
        val = ndimage.map_coordinates(sdf, clamped.T, order=1, mode="nearest")
        return val + overshoot

    result = (field, xy_half)
    _CACHE[key] = result
    return result


def describe(path, up="z"):
    """Human-readable summary of an importable mesh (used by the CLI)."""
    mesh = trimesh.load(str(path), force="mesh")
    mesh = _orient(mesh, up)
    lo, hi = mesh.bounds
    return {
        "faces": int(len(mesh.faces)),
        "vertices": int(len(mesh.vertices)),
        "watertight": bool(mesh.is_watertight),
        "size": [round(float(hi[i] - lo[i]), 3) for i in range(3)],
        "aspect_wh": round(float(max(hi[0] - lo[0], hi[1] - lo[1]) / (hi[2] - lo[2])), 3)
        if hi[2] > lo[2] else None,
    }
