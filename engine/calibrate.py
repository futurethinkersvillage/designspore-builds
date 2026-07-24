"""Kerf & fit calibration wizard.

Slot-together parts only assemble if two numbers are right for YOUR machine and
YOUR material: the beam/tool kerf, and the clearance a snug joint needs. Nominal
"3mm" plywood is routinely 2.7-3.2mm, so guessing loses either way — too tight
won't go together, too loose falls apart.

    Step 1   python engine/calibrate.py coupon --material ply3mm --machine laser
             -> out/calibration_ply3mm.svg     (cut it, ~130 x 75 mm)

    Step 2   Measure with calipers:
               a) the 40mm square's actual width
               b) your material's actual thickness
               c) find the lowest-numbered slot your material slides into snugly

    Step 3   python engine/calibrate.py apply --material ply3mm --machine laser \\
                 --kerf-square 39.82 --thickness 2.94 --best-slot 3.10
             -> writes kerf to machines.json, thickness + fit tolerance to materials.json

THE MATH (why the coupon is drawn with NO kerf compensation)
  The beam removes kerf/2 from each side of the path it follows, so:
    outer edges shrink   -> measured_square = 40.00 - kerf
                            => kerf = 40.00 - measured_square
    openings grow        -> actual_slot_opening = drawn_slot + kerf
  The slot that fits snugly therefore has a real opening of
    best_slot + kerf, which by definition is thickness + fit_tolerance:
                            => fit_tolerance = (best_slot + kerf) - thickness

  Afterwards the engine draws slots at (thickness + fit_tolerance) and the
  exporter shrinks openings by kerf/2 per side, so the cut opening lands exactly
  on thickness + fit_tolerance. Kerf cancels out by design — which is why it must
  be measured on an UNCOMPENSATED coupon.
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
ENGINE = Path(__file__).parent
SQUARE_MM = 40.0
SLOT_LEN = 18.0
SLOT_PITCH = 11.0
SLOT_STEPS = 11          # slots drawn from thickness-0.20 in +0.05 increments
SLOT_START_DELTA = -0.20
SLOT_STEP = 0.05


def load(name):
    return json.loads((ENGINE / name).read_text(encoding="utf-8"))


def save(name, data):
    (ENGINE / name).write_text(json.dumps(data, indent=2), encoding="utf-8")


# ---------------- coupon ----------------

def coupon(material_key, machine_key, out_dir):
    materials = load("materials.json")
    if material_key not in materials:
        raise SystemExit(f"unknown material '{material_key}'. "
                         f"have: {sorted(materials)}")
    mat = materials[material_key]
    t = float(mat.get("measured_thickness") or mat["thickness"])

    cut, eng = [], []

    def rect(x, y, w, h):
        cut.append(f'<rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" '
                   f'height="{h:.3f}" fill="none" stroke="#ff0000" '
                   f'stroke-width="0.1"/>')

    def label(x, y, text, size=3.2, anchor="middle"):
        eng.append(f'<text x="{x:.2f}" y="{y:.2f}" font-size="{size}" '
                   f'font-family="monospace" fill="none" stroke="#0000ff" '
                   f'stroke-width="0.08" text-anchor="{anchor}">{text}</text>')

    m = 8.0
    label(m, m + 3, f"SCULPTGEN CALIBRATION  {material_key} / {machine_key}",
          size=4.0, anchor="start")
    label(m, m + 8.5, "drawn WITHOUT kerf compensation - measure as cut",
          size=2.6, anchor="start")

    # --- kerf square
    sq_y = m + 13
    rect(m, sq_y, SQUARE_MM, SQUARE_MM)
    label(m + SQUARE_MM / 2, sq_y + SQUARE_MM / 2 - 1, "KERF", size=4)
    label(m + SQUARE_MM / 2, sq_y + SQUARE_MM / 2 + 4, f"{SQUARE_MM:.2f}", size=4)
    label(m + SQUARE_MM / 2, sq_y + SQUARE_MM + 5,
          "measure outside width", size=2.6)

    # --- slot ladder: insert the material edge-on into each slot
    lx = m + SQUARE_MM + 14
    ly = sq_y + 2
    label(lx, ly - 4, "SLOT LADDER - find the snuggest slot that accepts your material",
          size=2.8, anchor="start")
    widths = []
    for i in range(SLOT_STEPS):
        w = t + SLOT_START_DELTA + i * SLOT_STEP
        widths.append(w)
        x = lx + i * SLOT_PITCH
        rect(x, ly, w, SLOT_LEN)
        label(x + w / 2, ly + SLOT_LEN + 4.5, f"{w:.2f}", size=2.8)
        label(x + w / 2, ly + SLOT_LEN + 8.0, f"#{i + 1}", size=2.4)

    width_total = lx + SLOT_STEPS * SLOT_PITCH + m
    height_total = sq_y + SQUARE_MM + 12

    label(m, height_total - 2.5,
          f"nominal thickness {mat['thickness']}mm  |  slots "
          f"{widths[0]:.2f}-{widths[-1]:.2f}mm  |  cut me, then run: calibrate.py apply",
          size=2.5, anchor="start")

    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width_total:.1f}mm" '
           f'height="{height_total:.1f}mm" '
           f'viewBox="0 0 {width_total:.1f} {height_total:.1f}">\n'
           f'<title>SculptGen calibration coupon - {material_key}</title>\n'
           + "\n".join(cut) + "\n" + "\n".join(eng) + "\n</svg>\n")

    out = Path(out_dir)
    out.mkdir(exist_ok=True)
    f = out / f"calibration_{material_key}.svg"
    f.write_text(svg, encoding="utf-8")
    print(f"OK coupon -> {f}")
    print(f"   {width_total:.0f} x {height_total:.0f} mm, "
          f"{SLOT_STEPS} slots {widths[0]:.2f}-{widths[-1]:.2f}mm")
    print(f"   cut it, then measure the square, your material, and the best slot")
    return str(f)


# ---------------- apply ----------------

def apply(material_key, machine_key, kerf_square, thickness, best_slot):
    materials = load("materials.json")
    machines = load("machines.json")
    if material_key not in materials:
        raise SystemExit(f"unknown material '{material_key}'")
    if machine_key not in machines:
        raise SystemExit(f"unknown machine '{machine_key}'")

    kerf = SQUARE_MM - float(kerf_square)
    if kerf < 0:
        raise SystemExit(
            f"measured square ({kerf_square}) is LARGER than the drawn {SQUARE_MM} "
            f"— that means negative kerf, which is impossible. Re-measure, or check "
            f"you measured the square and not the sheet.")
    if kerf > 1.5:
        raise SystemExit(f"kerf of {kerf:.2f}mm is implausibly large — re-measure "
                         f"(a laser is typically 0.05-0.40mm, a CNC 0 with the "
                         f"cutter diameter handled separately).")

    fit = (float(best_slot) + kerf) - float(thickness)
    if fit < 0:
        print(f"!! computed fit tolerance is negative ({fit:.3f}mm) — the chosen slot "
              f"is tighter than the material. Using 0.0 (press fit); if parts won't "
              f"go together, re-run with a higher-numbered slot.")
        fit = 0.0
    if fit > 1.0:
        print(f"!! fit tolerance {fit:.2f}mm is very loose — joints will wobble. "
              f"Consider a lower-numbered slot.")

    machines[machine_key]["kerf_mm"] = round(kerf, 3)
    machines[machine_key]["kerf_calibrated"] = True
    materials[material_key]["measured_thickness"] = round(float(thickness), 3)
    materials[material_key]["fit_tolerance"] = round(fit, 3)
    materials[material_key]["calibrated_on"] = machine_key
    save("machines.json", machines)
    save("materials.json", materials)

    print("Calibration stored:")
    print(f"  machine {machine_key:8s} kerf            = {kerf:.3f} mm")
    print(f"  material {material_key:7s} thickness      = {float(thickness):.3f} mm "
          f"(nominal {materials[material_key]['thickness']})")
    print(f"  material {material_key:7s} fit tolerance  = {fit:.3f} mm")
    print(f"  -> slots will now be cut at {float(thickness) + fit:.3f} mm")
    print("These are used automatically by generate.py and export_svg.py.")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("coupon", help="generate the calibration coupon SVG")
    c.add_argument("--material", default="ply3mm")
    c.add_argument("--machine", default="laser")
    c.add_argument("--out", default=str(ROOT / "out"))

    a = sub.add_parser("apply", help="store measured calibration results")
    a.add_argument("--material", default="ply3mm")
    a.add_argument("--machine", default="laser")
    a.add_argument("--kerf-square", type=float, required=True,
                   help=f"measured width of the {SQUARE_MM}mm square, mm")
    a.add_argument("--thickness", type=float, required=True,
                   help="measured material thickness, mm")
    a.add_argument("--best-slot", type=float, required=True,
                   help="drawn width of the snuggest slot that fit (engraved on it)")

    s = sub.add_parser("show", help="print current calibration")

    args = ap.parse_args()
    if args.cmd == "coupon":
        coupon(args.material, args.machine, args.out)
    elif args.cmd == "apply":
        apply(args.material, args.machine, args.kerf_square,
              args.thickness, args.best_slot)
    else:
        machines, materials = load("machines.json"), load("materials.json")
        print("machines:")
        for k, v in machines.items():
            flag = "calibrated" if v.get("kerf_calibrated") else "DEFAULT (uncalibrated)"
            print(f"  {k:8s} kerf {v['kerf_mm']:.3f}mm  [{flag}]")
        print("materials:")
        for k, v in materials.items():
            th = v.get("measured_thickness")
            print(f"  {k:12s} nominal {v['thickness']:.2f}mm"
                  + (f"  measured {th:.3f}mm  fit {v['fit_tolerance']:.3f}mm"
                     if th else "  [uncalibrated]"))


if __name__ == "__main__":
    main()
