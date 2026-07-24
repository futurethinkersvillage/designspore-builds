"""Turn an image into a layered relief / shadowbox design.json.

    python engine/import_image.py photo.jpg --layers 6 --width 300
    python engine/import_image.py scene.png --invert         # dark = deepest
    python engine/import_image.py art.png --depthmap depth.png   # true depth map

By default, brightness = depth: bright areas are cut through more layers, so a
backlight glows through them (correct for luminous scenes like the reference
forest). Use --invert if the subject is dark on a light background. If you have
a real monocular-depth map (e.g. from Depth-Anything), pass it with --depthmap
and it is used directly instead of brightness.

Writes design.json with mode "relief"; then run engine/generate.py.
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("image", help="source image (PNG/JPG/…)")
    ap.add_argument("--out", default=str(ROOT / "design.json"))
    ap.add_argument("--layers", type=int, default=6)
    ap.add_argument("--width", type=float, default=300.0, help="face width, mm")
    ap.add_argument("--height", type=float, default=0.0,
                    help="face height, mm (0 = keep image aspect)")
    ap.add_argument("--material", default="ply3mm")
    ap.add_argument("--spacer", type=float, default=3.0, help="gap between layers, mm")
    ap.add_argument("--border", type=float, default=0.0, help="frame border, mm (0=auto)")
    ap.add_argument("--invert", action="store_true", help="dark = deepest")
    ap.add_argument("--blur", type=float, default=1.5, help="pre-blur, softens speckle")
    ap.add_argument("--depthmap", default=None,
                    help="use this depth image instead of brightness")
    ap.add_argument("--backlight", action="store_true", default=True)
    ap.add_argument("--no-backlight", dest="backlight", action="store_false")
    args = ap.parse_args()

    src = Path(args.image)
    if not src.exists():
        raise SystemExit(f"not found: {src}")

    from PIL import Image
    w_px, h_px = Image.open(src).size
    height = args.height or (args.width * h_px / w_px)
    border = args.border or max(10.0, args.width * 0.05)

    design = {
        "mode": "relief",
        "seed": 1,
        "size_mm": {"width": round(args.width, 1), "height": round(height, 1)},
        "material": args.material,
        "machine": "laser",
        "resolution": 300,
        "relief": {
            "layers": args.layers,
            "spacer_mm": args.spacer,
            "source": "image",
            "border_mm": round(border, 1),
            "backlight": args.backlight,
            "image": {
                "path": str(src.resolve()),
                "invert": args.invert,
                "blur": args.blur,
            },
        },
    }
    if args.depthmap:
        dp = Path(args.depthmap)
        design["relief"]["image"]["depthmap"] = str(dp.resolve())

    Path(args.out).write_text(json.dumps(design, indent=2), encoding="utf-8")
    print(f"{src.name}: {w_px}x{h_px}px -> relief "
          f"{args.width:.0f}x{height:.0f}mm, {args.layers} layers")
    print(f"wrote {args.out}")
    print("now run: python engine/generate.py")


if __name__ == "__main__":
    main()
