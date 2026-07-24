# design.json — the sculpture document

Edit this file and the running app (http://localhost:8643) regenerates within ~1s.
The engine only speaks this schema, so anything expressible here is fabricable by
construction. All coordinates are normalized: z 0→1 bottom→top; x/y ≈ [-0.5, 0.5].

```jsonc
{
  "seed": 42,                  // integer; reshuffles noise/blob randomness
  "size_mm": {"height": 300},  // physical height; widths scale with it
  "material": "ply3mm",        // key into engine/materials.json (ply3mm/ply6mm/mdf3mm/mdf6mm/card2mm/acrylic3mm)
  "machine": "laser",          // laser | cnc (cnc adds dogbones — planned)
  "resolution": 200,           // sampling grid; 150 fast, 260 fine
  "fit_tolerance_mm": 0.2,     // extra slot width beyond material thickness

  "form": {                    // the overall solid, before deconstruction
    "base": "column",          // column | superellipsoid | torus | blob | tree | mushroom
    "base_params": {},         // per-base, see below
    "modifiers": [             // applied in order
      {"type": "twist",  "amount": 0.6},   // 0–2; rotations over full height (×π)
      {"type": "taper",  "amount": 0.4},   // -1–1; + narrows toward top
      {"type": "bend",   "amount": 0.3},   // 0–1; banana lean
      {"type": "bulge",  "amount": 0.4},   // 0–1; midriff swell
      {"type": "ripple", "amount": 0.5},   // 0–1; horizontal corrugations
      {"type": "noise",  "amount": 0.5}    // 0–1; organic lumpiness (seeded)
    ],
    "symmetry": {"radial": 6, "mirror": "x"}  // optional; radial folds the form n ways
  },

  "regions": [                 // z-bands, each deconstructed by one technique
    {"id": "base", "bounds": {"z": [0.0, 0.16]},
     "technique": "stacked",   // stacked | radial | auto  (more coming)
     "params": {"dowels": 3, "dowel_diameter": 6}},
    {"id": "body", "bounds": {"z": [0.16, 1.0]},
     "technique": "radial",
     "params": {"ribs": 12,                  // 3–24; more = smoother, heavier
                "hub_fracs": [0.22, 0.55, 0.85],  // disc heights, fraction of band
                "hub_radius": 0}}            // mm; 0 = auto-fit
  ],

  "connections": [{"between": ["base", "body"], "joint": "dowel-plate"}],  // planned
  "surface": {"pattern": "none"}   // voronoi | flowfield | rings — planned
}
```

## Base params

- `column`: `radius` (0.15–0.4), `waist` (0–0.8 profile swing), `lobes` (1–5 undulations)
- `superellipsoid`: `exponent` (1 diamond → 2 sphere → 6 box), `rx`, `ry`
- `torus`: `major` (0.2–0.4), `minor` (0.05–0.2)
- `blob`: `count` (3–10 spheres), `spread` (0.1–0.3), `rmin`/`rmax`
- `tree`: `trunk_radius`, `count`, `spread` (blobby canopy over a trunk)
- `mushroom`: `cap_radius`, `cap_height`, `cap_center`, `cap_underside`,
  `stem_radius`, `flare`, `stem_wobble`

## Technique guidance (which region gets what)

- **stacked** — squat/wide bands, plinths, dense masses. Physically: one layer per
  material thickness, aligned by dowels. A 50mm band in 3mm ply = 17 layers.
- **radial** — tall bands with roughly rotational form: trunks, vases, towers.
  Ribs + slotted hub discs (half-lap, lamp-style). Noise/twist makes each rib unique —
  that's fine and looks great.
- **interlocked** — egg-crate volumes: two orthogonal slotted slice sets
  (`x_slices`, `y_slices`, 2–8 each). A-slices slot from the top, B from the
  bottom. Slices are placed in the band's persistent core so all run full height.
- **printed** — 3D-printed pedestal platform (params: `radius_mm` 0=auto,
  `socket_depth`). If an interlocked region sits directly on top, the platform
  gets matching sockets so the slice grid plugs in. Export: `engine/export_3mf.py`
  → `out/printed_parts.3mf`.
- **auto** — engine measures the band (squat→stacked, tall+symmetric→radial).
- Planned: `curve` (ribs along a spine), `relief` (layered shadowbox wall art),
  `folded` (fold-up panels), `3dslices` (CNC slabs).

## Vibe → parameter cheat-sheet

- "more organic / coral-like" → noise 0.6–0.9, blob or tree base, more ribs
- "twisted / helical" → twist 0.8–1.6
- "calmer / architectural" → noise ≤0.2, superellipsoid, symmetry radial 4–8
- "airier / lighter" → fewer ribs, radial over stacked
- "chunkier / heavier" → stacked regions, ply6mm
- Keep stacked bands ≤ 0.25 of height unless a massive look is wanted (part counts!)

## Layered relief / shadowbox (wall art)

A different `mode` — N flat panels stacked face-on, each cut deeper, so the stack
reads as depth. Optional LED backlight gap. Two depth sources:

```jsonc
{
  "mode": "relief",
  "size_mm": {"width": 300, "height": 300},
  "material": "ply3mm",
  "relief": {
    "layers": 6,               // number of stacked panels
    "spacer_mm": 3,            // gap between layers (LED channel); 0 = glued flush
    "border_mm": 16,          // solid frame that every layer shares (registration)
    "backlight": true,
    "source": "mandala",       // "mandala" (generative) | "image"
    "mandala": {"symmetry": 8, "rings": 5, "seed": 7,
                "spoke_width": 0.28, "ring_width": 0.16, "center_depth": 0.0},
    "image":   {"path": "photo.png", "invert": false, "blur": 1.5,
                "depthmap": "optional_depth.png"}
  }
}
```
Depth D(x,y)∈[0,1]: material is in layers 0..round(D·N)-1, so D=1 → all layers
(frame/front), D=0 → a through-hole. **mandala** builds a connected spoke+ring web
(nothing floats). **image** uses brightness as depth (bright = cut through more →
backlight glows through; use `invert` for dark-subject-on-light). Isolated bright
features (a moon, glow spots) become **glue-on accent pieces** — reported in
`region_meta.relief.accent_pieces`.

Scaffold from an image:
```bash
python engine/import_image.py scene.png --layers 7 --width 300 --spacer 3
python engine/generate.py
```

## Wearable mask (`mode: "mask"`)

A face-fit dome shell built as stacked topographic rings (hollow — the face fits
behind it). Openings punch through every layer; every boundary keeps `wall_mm`
of material by construction. Layer count = dome depth / material thickness.

```jsonc
{
  "mode": "mask",
  "material": "ply6mm",
  "mask": {
    "face": {
      "width_mm": 160, "height_mm": 220,   // cheek width, brow->chin
      "pd_mm": 63,                          // pupillary distance
      "eye_w_mm": 42, "eye_h_mm": 22,
      "nose_clearance_mm": 45,              // shell is guaranteed to clear this
      "mouth_vents": true, "vent_rows": 2,
      "margin_mm": 18                       // shell extends past the face
    },
    "depth_mm": 80,        // overall dome depth (nose ridge tops it up)
    "wall_mm": 10,         // in-plane ring width (glue area)
    "chin_taper": 0.35,    // 0-1 egg-shape narrowing toward the chin
    "brow_flat": 0.15,     // 0-1 fullness at the crown
    "strap": "slots",      // slots | none  (temple strap slots)
    "dowels": 2,           // alignment pins through the lower stack
    "output": "stacked"    // stacked  (planned: eggcrate, rotary solid)
  }
}
```

Anthropometry anchors (fractions of face height from the chin): eyes 0.57,
nose tip 0.38, mouth 0.25. `region_meta.mask` reports layers, achieved depth,
dowel sites + how many layers each pin crosses (upper stack aligns by eye —
contours shrink too fast for a straight pin).

## Importing a 3D model (STL / OBJ / GLB / PLY / 3MF)

```bash
python engine/import_mesh.py model.stl --height 300      # writes design.json
python engine/import_mesh.py model.glb --up y            # if the file is Y-up
python engine/import_mesh.py model.obj --techniques stacked   # force one technique
python engine/generate.py                                 # then generate as usual
```
Inspects the mesh, normalizes it (height → your `size_mm.height`, centred, base on
z=0), and picks regions/techniques from its proportions: wide → stacked, tall+slim →
stacked foot + radial body, chunky → stacked foot + interlocked body. Edit the written
design.json to override anything.

In the schema this is just another base:
```jsonc
"form": {"base": "mesh",
         "base_params": {"path": "…/model.stl", "up": "z", "voxel_res": 160}}
```
`voxel_res` (default 160) trades detail for speed. Non-watertight meshes are filled
heuristically and raise an issue — repair them first for best results. Modifiers
(twist/noise/…) and symmetry still apply on top of an imported mesh.

## Calibration (do this once per machine + material)

Slot-together parts only fit if the kerf and material thickness are real numbers,
not nominal ones ("3mm" ply is usually 2.7–3.2mm).

```bash
python engine/calibrate.py coupon --material ply3mm --machine laser
```
Cut `out/calibration_ply3mm.svg` (~190×73mm), then measure three things: the 40mm
square's actual width, your material's thickness, and the lowest-numbered slot the
material slides into snugly. Then:
```bash
python engine/calibrate.py apply --material ply3mm --machine laser \
    --kerf-square 39.82 --thickness 2.94 --best-slot 3.10
```
Stored in `machines.json` (kerf) + `materials.json` (thickness, fit tolerance) and
used automatically from then on. `calibrate.py show` prints current state; the engine
raises an issue while a material is still uncalibrated.

## Outputs

- `parts.json` — every flat part (2D polygon + 3D placement) + assembly metadata + issues
- `out/sheet-NN.svg` — laser-ready cut sheets (red = cut, blue = engraved part numbers,
  kerf-compensated): `python engine/export_svg.py --bed 600x400 --kerf 0.15`
- Check `issues` in parts.json / the app panel after every change — the engine tells you
  when something isn't fabricable (dropped thin pieces, no dowel core, hub failures).
