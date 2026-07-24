"""Radial-ribs technique: N vertical half-plane ribs fanned around the z axis,
carried by horizontal slotted hub discs (half-lap joints, lamp-style).

Rib local coords: X = radial distance u (mm), Y = height above region base (mm),
extruded along local Z (plate normal).
"""
import numpy as np
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union

from geometry import (sample_plane, field_to_polygons, drop_small,
                      make_part, quat_from_basis, IDENTITY_QUAT)


def _rib_basis(theta):
    x_axis = np.array([np.cos(theta), np.sin(theta), 0.0])   # local X -> radial
    y_axis = np.array([0.0, 0.0, 1.0])                        # local Y -> world up
    z_axis = np.cross(x_axis, y_axis)                         # plate normal
    return quat_from_basis(x_axis, y_axis, z_axis)


def build(field, region, ctx):
    S = ctx["scale_mm"]
    t = ctx["thickness"]
    issues = ctx["issues"]
    params = region.get("params", {})
    n_ribs = max(3, int(params.get("ribs", 12)))
    z0n, z1n = region["bounds"]["z"]
    z0, z1 = z0n * S, z1n * S
    height = z1 - z0
    fit = float(ctx.get("fit_tolerance", 0.2))
    slot_w = t + fit

    # ribs can't all meet at the axis — leave a clear core
    r_inner = (t / 2) / np.tan(np.pi / n_ribs) + 1.0

    # radial reach: a rib runs from the axis outward, so it needs the model's
    # full corner distance, not just its half-width
    u_max = float(ctx.get("xy_half", 0.62)) * 1.42 * S
    res = ctx["res"]
    u = np.linspace(0.0, u_max, res)
    v = np.linspace(0.0, height, max(48, int(res * height / (u_max + 1e-9))))

    thetas = [k * 2 * np.pi / n_ribs for k in range(n_ribs)]
    rib_polys = []   # per rib: MultiPolygon in (u, h) mm
    for theta in thetas:
        ct, st = np.cos(theta), np.sin(theta)

        def plane(U, V, ct=ct, st=st):
            return np.column_stack([U * ct / S, U * st / S, (z0 + V) / S])

        vals = sample_plane(field, plane, u, v)
        mp = field_to_polygons(vals, u, v)
        # keep only the outboard side of the clear core
        mp = mp.intersection(box(r_inner, -1e3, u_max + 10, 1e3))
        if not isinstance(mp, MultiPolygon):
            mp = MultiPolygon([mp]) if isinstance(mp, Polygon) else MultiPolygon([])
        mp = drop_small(mp, issues=issues, ctx=f"{region['id']} rib@{np.degrees(theta):.0f}")
        rib_polys.append(mp)

    if all(mp.is_empty for mp in rib_polys):
        issues.append(f"{region['id']}: no material in region band")
        return [], {}

    # ---- hub discs: pick z positions where every rib has solid material
    # from r_inner outward for at least 4t of radial run and 3t of height
    hub_fracs = params.get("hub_fracs", [0.22, 0.55, 0.85])
    r_hub_max = float(params.get("hub_radius", 0.0))  # 0 = auto
    hubs = []    # (h_local_mm, r_hub_mm)
    for frac in hub_fracs:
        h = frac * height
        band = box(r_inner, h - 1.5 * t, u_max + 10, h + 1.5 * t)
        reach = []
        ok = True
        for mp in rib_polys:
            seg = mp.intersection(band)
            if seg.is_empty:
                ok = False
                break
            minx = seg.bounds[0]
            maxx = seg.bounds[2]
            if minx > r_inner + 1.5 or maxx - r_inner < 4 * t:
                ok = False
                break
            reach.append(maxx)
        if not ok:
            continue
        r_hub = 0.75 * min(reach)
        if r_hub_max > 0:
            r_hub = min(r_hub, r_hub_max)
        if r_hub < r_inner + 4 * t:
            continue
        hubs.append((h, r_hub))
    if not hubs:
        issues.append(f"{region['id']}: no valid hub disc position found — "
                      f"ribs have no common solid band (assembly needs glue jig)")

    parts = []
    quats = {}

    # ---- rib parts (with slots for each hub disc)
    for k, (theta, mp) in enumerate(zip(thetas, rib_polys)):
        slots = []
        for h, r_hub in hubs:
            r_mid = (r_inner + r_hub) / 2
            # rib slot: from inner edge outward to r_mid, disc slides in
            slots.append(box(r_inner - 2.0, h - slot_w / 2, r_mid, h + slot_w / 2))
        cut_mp = mp.difference(unary_union(slots)) if slots else mp
        if not isinstance(cut_mp, MultiPolygon):
            cut_mp = MultiPolygon([cut_mp]) if isinstance(cut_mp, Polygon) else MultiPolygon([])
        cut_mp = drop_small(cut_mp, issues=issues,
                            ctx=f"{region['id']} R{k:02d} (slot cut)")
        quat = _rib_basis(theta)
        for gi, g in enumerate(cut_mp.geoms):
            label = ctx["next_label"]()
            parts.append(make_part(
                pid=f"{region['id']}-R{k:02d}{chr(97 + gi) if len(cut_mp.geoms) > 1 else ''}",
                region=region["id"], technique="radial",
                polygon=g, thickness=t,
                pos=[0.0, 0.0, z0], quat=quat, label=label))

    # ---- hub disc parts (horizontal, slotted from rim inward to r_mid)
    for hi, (h, r_hub) in enumerate(hubs):
        r_mid = (r_inner + r_hub) / 2
        disc = Polygon([(r_hub * np.cos(a), r_hub * np.sin(a))
                        for a in np.linspace(0, 2 * np.pi, 96, endpoint=False)])
        cuts = []
        for theta in thetas:
            d = np.array([np.cos(theta), np.sin(theta)])
            n = np.array([-d[1], d[0]]) * (slot_w / 2)
            a = d * r_mid
            b = d * (r_hub + 2.0)
            cuts.append(Polygon([tuple(a + n), tuple(b + n), tuple(b - n), tuple(a - n)]))
        disc_cut = disc.difference(unary_union(cuts))
        if disc_cut.is_empty or disc_cut.buffer(-1.0).is_empty:
            issues.append(f"{region['id']}: hub disc {hi} disintegrated by slots — "
                          f"reduce ribs or enlarge hub_radius")
            continue
        biggest = (max(disc_cut.geoms, key=lambda g: g.area)
                   if isinstance(disc_cut, MultiPolygon) else disc_cut)
        label = ctx["next_label"]()
        parts.append(make_part(
            pid=f"{region['id']}-H{hi}", region=region["id"], technique="radial",
            polygon=biggest, thickness=t,
            pos=[0.0, 0.0, z0 + h], quat=IDENTITY_QUAT, label=label))

    meta = {"ribs": n_ribs, "hubs": [[round(z0 + h, 1), round(r, 1)] for h, r in hubs],
            "r_inner": round(r_inner, 1), "slot_width": round(slot_w, 2)}
    return parts, meta
