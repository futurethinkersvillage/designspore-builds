# SculptGen — generative laser/CNC sculpture app

Generates fabricable sculptural artwork: a form field (SDF) is deconstructed
region-by-region into flat parts using real construction techniques (Slicer for
Fusion 360 taxonomy). The 3D view shows the actual cut parts — never a fantasy mesh.

## You (Claude) are the prompt engine

When Mike asks for a sculpture change ("make it more coral-like", "taller and
twisted"), **edit `design.json`** per `SCHEMA.md` (read it first). The running app
at http://localhost:8643 picks up the file change within ~1s and regenerates.
Then check the result: `parts.json` → `stats` and `issues` (must stay empty), and
`snapshot.jpg` (the app auto-saves a render after each rebuild — Read it to see
what Mike sees).

## Run / verify

- Server: launch config `sculptgen` (port 8643) or
  `C:\Users\miken\AppData\Local\Programs\Python\Python313\python.exe serve.py`
- Engine only: `...python.exe engine/generate.py` → writes `parts.json`
- Cut sheets: `...python.exe engine/export_svg.py --bed 600x400 --kerf 0.15` → `out/`
- ALWAYS use the full Python 3.13 path above; plain `python` is Inkscape's.
- Browser-pane screenshots are unreliable → use `snapshot.jpg` (POST /snap, auto).
- rAF is throttled in background tabs — after driving the page via JS, call
  `window.__dbg.render()` then `window.__dbg.snap()` explicitly.

## Layout

- `design.json` — THE document (schema in SCHEMA.md)
- `engine/` — sdf.py (form field) · regions.py · tech_stacked.py · tech_radial.py ·
  generate.py (design→parts) · export_svg.py (parts→cut sheets) · materials.json ·
  mask.py (mode "mask": face-fit wearable mask, stacked topo rings)
- `app/` — Three.js viewer (vendored three), Fusion-style controls
- `parts.json` / `out/` / `snapshot.jpg` — generated; don't hand-edit

## Rules

- Parts must stay physically buildable: never bypass engine validation; if `issues`
  appear, fix the design (or engine) rather than ignoring them.
- Slot widths = thickness + fit_tolerance; kerf is applied only at export.
- New techniques go in `engine/tech_<name>.py` with
  `build(field, region, ctx) -> (parts, meta)` and register in generate.py BACKENDS.
- Roadmap + decisions: `C:\Users\miken\.claude\plans\i-want-to-do-woolly-hammock.md`
  (M2: interlocked + curve ribs + inter-region joints; M3: DXF/nesting/validation+;
  M4: in-app `claude -p` prompt box; later: relief shadowbox from Mike's reference
  image, image→depth layers, mesh import).
