"""Region handling: defaults, normalization, and technique auto-suggestion."""
import numpy as np


def normalize_regions(design):
    """Return a clean, ordered, non-overlapping list of z-band regions."""
    regions = design.get("regions") or [
        {"id": "whole", "bounds": {"z": [0.0, 1.0]}, "technique": "auto", "params": {}}
    ]
    out = []
    for i, r in enumerate(regions):
        z = r.get("bounds", {}).get("z", [0.0, 1.0])
        z0, z1 = max(0.0, float(min(z))), min(1.0, float(max(z)))
        if z1 - z0 < 1e-3:
            continue
        out.append({
            "id": r.get("id", f"region{i}"),
            "bounds": {"z": [z0, z1]},
            "technique": r.get("technique", "auto"),
            "params": r.get("params", {}) or {},
        })
    out.sort(key=lambda r: r["bounds"]["z"][0])
    return out


def suggest_technique(field, region, scale_mm):
    """Heuristic technique choice for technique='auto' regions.

    Measures the region's slab of the field:
    - squat band (wider than tall)            -> stacked
    - tall + roughly rotationally symmetric   -> radial
    - fallback                                -> stacked
    """
    z0, z1 = region["bounds"]["z"]
    zs = np.linspace(z0 + 0.05 * (z1 - z0), z1 - 0.05 * (z1 - z0), 5)
    # radial profile at 12 angles x 5 heights: outermost solid radius
    radii = np.linspace(0.01, 0.75, 60)
    angles = np.linspace(0, 2 * np.pi, 12, endpoint=False)
    extents = np.zeros((len(zs), len(angles)))
    for zi, z in enumerate(zs):
        for ai, a in enumerate(angles):
            pts = np.column_stack([radii * np.cos(a), radii * np.sin(a),
                                   np.full(len(radii), z)])
            inside = field(pts) < 0
            extents[zi, ai] = radii[inside].max() if inside.any() else 0.0
    mean_r = extents.mean()
    if mean_r <= 0:
        return "stacked"
    height = (z1 - z0)
    width = 2 * mean_r
    # asymmetry: how much the outline varies around each ring
    asym = float(np.mean(extents.std(axis=1) / (extents.mean(axis=1) + 1e-9)))
    if height < 0.8 * width:
        return "stacked"
    if asym < 0.35:
        return "radial"
    return "stacked"
