# SculptGen Roadmap — Slicer parity + beyond

## Strategic context

**Slicer for Fusion 360 is deprecated.** Autodesk no longer maintains or supports it;
it's been pulled from the app store and doesn't run reliably on current systems. The
technique vocabulary it established (stacked / interlocked / curve / radial / folded /
3D slices) is still the reference standard for sheet-based fabrication — but there is
no maintained tool that does it. That's the gap SculptGen fills, and we go further:
Slicer only *deconstructs* models you already have. We **generate** them too.

---

# Part 1 — Slicer for Fusion 360 feature inventory & parity status

Legend: ✅ done · 🔶 partial · ❌ missing

## 1.1 Construction techniques (the core six)

| # | Technique | Geometry | Status |
|---|---|---|---|
| 1 | **Stacked Slices** | horizontal cross-sections stacked, dowel-aligned | ✅ |
| 2 | **Interlocked Slices** | two orthogonal slotted slice sets (egg-crate) | ✅ |
| 3 | **Radial Slices** | slices radiating from a central axis + hub discs | ✅ |
| 4 | **Curve** | slices perpendicular to a guide curve (ribs on a spine) | ❌ |
| 5 | **Folded Panels** | triangulated shell unfolded to fold-up 2D panels | ❌ |
| 6 | **3D Slices** | thick slabs whose faces conform to the surface (no stepping) | ❌ |

Beyond Slicer, we already have a 7th: **printed** (3D-printed connector/pedestal parts,
3MF export) — Slicer has no 3D-printing path at all.

## 1.2 Model preparation

| Feature | Slicer | Us | Notes |
|---|---|---|---|
| Mesh import (STL/OBJ/…) | ✅ | ❌ | **the** big parity gap — unlocks existing 3D files |
| Object size X/Y/Z | ✅ | 🔶 | we set height only; widths follow the form |
| Units (mm/cm/in/ft) | ✅ | ❌ | mm only |
| Uniform scale / fit-to-material | ✅ | ❌ | "make it fit N sheets" |
| Model orientation / rotation | ✅ | ❌ | we're Z-up only |
| Slice direction plane widget | ✅ | ❌ | arbitrary slicing axis |
| Modify form: **hollow** | ✅ | ❌ | shell out the interior — big material saver |
| Modify form: **thicken** | ✅ | ❌ | fatten thin features to fabricable width |
| Modify form: **shrinkwrap** | ✅ | ❌ | simplify/close messy imported meshes |

## 1.3 Manufacturing settings

| Feature | Slicer | Us | Notes |
|---|---|---|---|
| Sheet size (L×W×thickness) | ✅ | ✅ | `--bed`, materials.json |
| Material thickness drives slots | ✅ | ✅ | slot = thickness + fit tolerance |
| Kerf compensation | 🔶 | ✅ | we do it at export; Slicer barely addressed it |
| Slice count per axis | ✅ | ✅ | |
| Slice distribution (uniform / count / by thickness) | ✅ | 🔶 | ours derives from thickness |
| Multiple machine profiles | ❌ | ❌ | neither — worth adding |

## 1.4 Assembly features

| Feature | Slicer | Us | Notes |
|---|---|---|---|
| Dowels for stacked slices | ✅ | ✅ | with common-core validation (better than Slicer) |
| Dowel slot orientation (horiz/vert) | ✅ | ❌ | open-slot vs closed-hole option |
| Slots/notches sized to material | ✅ | ✅ | |
| Folded-panel joints (10 types) | ✅ | ❌ | Tab, Tongue, Diamond, Gear, Laced, Multitab, Puzzle, Rivet, Seam, Ticked |
| Auto part numbering + etched labels | ✅ | ✅ | |
| **Assembly Steps view** | ✅ | ❌ | step-by-step build order |
| Assembly animation | ✅ | 🔶 | we have an exploded slider |
| Inter-region designed joints | ❌ | ✅ | **we're ahead** — Slicer can't mix techniques |

## 1.5 Layout & nesting

| Feature | Slicer | Us | Notes |
|---|---|---|---|
| Auto-nest onto sheets | ✅ | ✅ | shelf-pack |
| Sheet count + material usage | ✅ | ✅ | |
| Part rotation when nesting | ✅ | ❌ | big utilization win |
| True-shape (not bbox) nesting | 🔶 | ❌ | |
| Manual part arrangement | ✅ | ❌ | drag parts between sheets |
| In-app 2D sheet layout view | ✅ | ❌ | we only write SVG files |

## 1.6 Export

| Format | Slicer | Us |
|---|---|---|
| DXF (with unit selection) | ✅ | ❌ |
| EPS | ✅ | ❌ |
| PDF | ✅ | ❌ |
| SVG | ❌ | ✅ |
| 3MF / STL (3D print) | ❌ | ✅ |
| Interactive web model | ❌ | ✅ (live at mikegilliland.ca/projects/sculptgen/) |

## 1.7 Parity work packages (recommended order)

1. **P1 — Mesh import** (STL/OBJ/GLB → voxelize/SDF → existing technique backends).
   Single highest-value gap: makes SculptGen a drop-in Slicer replacement and unlocks
   every 3D file Mike already owns.
2. **P2 — Remaining three techniques**: `curve` (spine ribs) → `3dslices` (CNC slabs,
   pairs with the incoming CNC) → `folded` (unfold + joint library, biggest subproject).
3. **P3 — Modify form**: hollow / thicken / shrinkwrap. Hollow alone can halve material.
4. **P4 — Export + nesting**: DXF and PDF; part rotation and true-shape nesting;
   in-app sheet layout view.
5. **P5 — Assembly steps**: ordered build sequence, printable booklet, animation.
6. **P6 — Orientation & units**: arbitrary slice axis, model rotation, unit switching,
   fit-to-material scaling.

---

# Part 2 — New functionality brainstorm (beyond Slicer)

## A. Generative & creative — our real differentiator

1. **Conversational design refinement** — already live via Claude editing design.json;
   extend to multi-turn ("now flare the base, keep everything else").
2. **Variation grid** — render 6–12 seed/param mutations as thumbnails; click to adopt.
3. **Genetic breeding** — pick two designs as parents, generate offspring that blend
   their parameters. Evolution as a design interface.
4. **Design morphing** — interpolate between two designs and scrub a slider; freeze
   any frame as a new piece. Great for series/editions.
5. **Constraint-solved generation** — "make something cool that fits exactly 2 sheets
   of 3mm ply and stands 400mm" → engine searches parameter space backwards.
6. **Grammar-based forms** — L-systems, recursive branching, fractal subdivision for
   genuinely elaborate structures (trees, corals, dendritic growth).
7. **Style vocabulary library** — named aesthetics ("brutalist", "art nouveau",
   "biomorphic", "deco") that map to parameter clusters.
8. **Series generator** — a family of N related pieces sharing DNA (gallery shows,
   product lines, numbered editions).

## B. Fabrication intelligence

9. **Kerf & fit calibration wizard** ⭐ — generate a test comb of slots at stepped
   widths, cut it, see which fits, app sets your tolerance permanently. This is the
   single biggest determinant of whether slot-together pieces actually assemble.
10. **Cut time & cost estimator** — total cut length → laser minutes; sheets → $;
    per-machine feed rates.
11. **Grain direction awareness** — orient parts so plywood grain runs along thin necks
    (strength), flag parts that would snap.
12. **Cut-order optimization** — inner features before outer contour, minimize travel,
    avoid cutting a part free before its holes are done.
13. **Micro-tabs / bridges** — hold parts in the sheet so they don't drop or shift.
14. **Common-line cutting** — shared edges cut once; less time, less material.
15. **Multi-material assignment** — cap in acrylic, stem in ply, base printed; per-region
    material with correct thickness math.
16. **Machine profile library** — switch between your laser, incoming CNC, and a cut
    service (SendCutSend etc.) with their real constraints.
17. **Offcut/scrap awareness** — nest into remnants you already have.

## C. Structural & physical validation

18. **Stability / tip-over analysis** — center of mass vs. footprint; warn or auto-widen.
19. **Weak-neck detection (FEA-lite)** — find where the piece will snap under its own
    weight or handling; suggest thickening.
20. **Insertion-path checking** — can each part physically be slid into place given the
    ones already assembled? Catches "impossible" interlocks before you cut.
21. **Joint fit classes** — press fit / slip fit / glue gap as named tolerances.
22. **Overhang check for printed parts** — flag unprintable geometry, suggest orientation.
23. **Load rating** — "this shelf holds ~X kg" for functional pieces.

## D. Assembly & documentation

24. **Assembly steps + animation** (Slicer parity, done better) — ordered, interactive.
25. **Printable assembly booklet** — exploded diagrams, part maps, hardware list, PDF.
26. **Etched QR codes** on parts → open the assembly step for that piece on your phone.
27. **Interactive web assembly guide** — the published viewer, but step-by-step.
28. **Bill of materials** — sheets, dowel rod lengths, glue, LEDs, fasteners.
29. **AR assembly overlay** — phone camera shows the next part's position.

## E. Aesthetics & surface

30. **Surface pattern engine** — voronoi, flow fields, reaction-diffusion, Islamic
    geometric tilings, topographic contours; engrave or pierce.
31. **Photo engraving** — dither/halftone an image onto part faces.
32. **Layered relief / shadowbox** ⭐ — the mandala wall-art form from your reference
    image: N flat fretwork layers with spacers, optional LED backlight gap and frame.
33. **Edge-lit acrylic + LED channels** — designed light paths, diffuser layers, wire
    routing cavities. Pairs with #32.
34. **Living hinge generator** — kerf patterns that let flat stock curve.
35. **Inlay / marquetry** — multi-tone materials cut to nest into each other.
36. **Typography as structure** — words/names that *are* the ribs.
37. **Finish plan** — per-layer stain/paint scheme previewed in 3D.

## F. Input modes

38. **Image → depth layers** ⭐ — monocular depth (Depth-Anything, local on your 4060)
    → quantized bands → per-layer fretwork. The direct path to your shadowbox reference.
39. **Image → silhouette/relief** — simpler, no AI: threshold → extrude/revolve/carve.
40. **Image → full 3D** — TripoSR-class local model → mesh → deconstruction.
41. **Mesh import** — STL/OBJ/GLB (also Slicer parity, P1).
42. **SVG/vector import** — logos, profiles, custom outlines as form inputs.
43. **Sketch → form** — rough hand drawing as a silhouette or spine curve.
44. **Math/equation input** — parametric surfaces, minimal surfaces (gyroid, Schwarz).
45. **Data physicalization** — elevation/terrain, audio waveforms, personal data as
    sculpture. (Your QGIS setup could feed real terrain straight in.)
46. **3D scan / photogrammetry** input.

## G. Output & production

47. **DXF / PDF / EPS export** (parity).
48. **Direct G-code / toolpaths** — not just outlines: real CNC pocketing, tabs, depths.
49. **LightBurn & Fusion CAM project export** — land in your existing tools ready to run.
50. **Turntable render / video export** — marketing content for each piece.
51. **One-click order to a cut service** — upload nested sheets, get a quote.
52. **Print-and-cut registration marks** for hybrid printed/cut workflows.

## H. Workflow & platform

53. **Design lineage tree** — every generation branches; browse and revert visually.
54. **Batch overnight generation** — wake up to 50 candidates, curate the good ones.
55. **Public gallery + remix** — extend what we just shipped: let visitors tweak
    parameters live in the browser and download their own cut files.
56. **Physical build log** — photograph the finished piece against its model; a record
    of what actually worked.

---

## Recommended next moves (highest leverage first)

| Rank | Item | Why |
|---|---|---|
| 1 | **Kerf/fit calibration wizard** (#9) | Nothing else matters if parts don't fit. One afternoon of work, permanent payoff. |
| 2 | **Mesh import** (#41 / P1) | Biggest Slicer parity gap; unlocks every model you own. |
| 3 | **Layered relief + image→depth** (#32, #38) | Directly delivers your shadowbox reference — and it's the most sellable output. |
| 4 | **Curve + 3D slices techniques** (P2) | Completes the technique vocabulary; 3D slices pairs with the incoming CNC. |
| 5 | **Assembly steps + booklet** (#24, #25) | Turns "25 mystery parts" into a buildable kit. |
| 6 | **DXF export + nesting with rotation** (P4) | Real production quality; less wasted material. |
