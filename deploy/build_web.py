"""Build the published SculptGen gallery into the mikegilliland.ca repo.

For each preset in deploy/presets/*.json:
  - run the engine  -> sculptures/<id>.json  (the viewer's data)
  - run export_svg  -> files/<id>/sheet-NN.svg (downloadable cut sheets)
  - run export_3mf  -> files/<id>/printed_parts.3mf (if the design has printed parts)

Then copies the viewer (index.html, js/, vendor/) and injects a static manifest
so the app runs with NO Python backend. Asset paths stay RELATIVE so everything
resolves under the /projects/sculptgen/ subpath.

Target follows the site's convention: public/projects/<name>/ served at
https://mikegilliland.ca/projects/sculptgen/

Run:  python deploy/build_web.py
Then: cd mikegilliland-site && npm run build
      && git add public/projects/sculptgen && git commit && git push origin mikegilliland
      && Coolify redeploy (uuid fkgif45z3j1g83dhi8bup74o) — deploys are MANUAL
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
APP = ROOT / "app"
PRESETS = Path(__file__).parent / "presets"
DST = Path(r"C:\Users\miken\Projects\mikegilliland-site\public\projects\sculptgen")
PYTHON = sys.executable
BED = "600x400"
KERF = "0.15"

# order shown in the gallery
ORDER = ["mushroom", "totem", "coral", "lantern"]


def run(args, **kw):
    p = subprocess.run(args, capture_output=True, text=True, timeout=600, **kw)
    if p.returncode != 0:
        raise SystemExit(f"FAILED: {' '.join(map(str, args))}\n{p.stdout}\n{p.stderr}")
    return p.stdout.strip()


def main():
    if DST.exists():
        shutil.rmtree(DST)
    (DST / "sculptures").mkdir(parents=True)
    (DST / "files").mkdir()

    # ---- viewer shell
    for d in ("js", "vendor"):
        shutil.copytree(APP / d, DST / d)
    html = (APP / "index.html").read_text(encoding="utf-8")

    preset_files = sorted(PRESETS.glob("*.json"),
                          key=lambda p: ORDER.index(p.stem) if p.stem in ORDER else 99)
    manifest = []
    tmp_parts = ROOT / "deploy" / "_tmp_parts.json"

    for pf in preset_files:
        pid = pf.stem
        design = json.loads(pf.read_text(encoding="utf-8"))
        print(f"-- {pid}")
        run([PYTHON, str(ROOT / "engine" / "generate.py"),
             "--design", str(pf), "--out", str(tmp_parts)])
        data = json.loads(tmp_parts.read_text(encoding="utf-8"))
        if data.get("error"):
            raise SystemExit(f"{pid}: engine error\n{data['error']}")
        if data.get("issues"):
            print(f"   issues: {data['issues']}")

        # viewer data (drop the mesh-free duplicates nothing needs)
        (DST / "sculptures" / f"{pid}.json").write_text(json.dumps(data),
                                                        encoding="utf-8")

        # downloadable cut files
        fdir = DST / "files" / pid
        fdir.mkdir(parents=True)
        run([PYTHON, str(ROOT / "engine" / "export_svg.py"),
             "--parts", str(tmp_parts), "--out", str(fdir),
             "--bed", BED, "--kerf", KERF])
        sheets = sorted(f"files/{pid}/{p.name}" for p in fdir.glob("sheet-*.svg"))
        printed = None
        if any("mesh" in part for part in data["parts"]):
            run([PYTHON, str(ROOT / "engine" / "export_3mf.py"),
                 "--parts", str(tmp_parts), "--out", str(fdir)])
            if (fdir / "printed_parts.3mf").exists():
                printed = f"files/{pid}/printed_parts.3mf"

        manifest.append({
            "id": pid,
            "name": design.get("_name", pid.title()),
            "blurb": design.get("_blurb", ""),
            "parts": data["stats"]["part_count"],
            "sheets": sheets,
            "printed": printed,
        })
        print(f"   {data['stats']['part_count']} parts · {len(sheets)} sheets"
              f"{' · 3mf' if printed else ''}")

    tmp_parts.unlink(missing_ok=True)

    # ---- inject static manifest + gallery markup
    inject = ("<script>window.SCULPTGEN_STATIC = "
              + json.dumps({"sculptures": manifest}) + ";</script>\n")
    html = html.replace('<script type="importmap">', inject + '<script type="importmap">')

    # swap the server-only controls card for gallery + downloads
    old_view = html[html.index('  <div class="card">\n    <h2>View</h2>'):
                    html.index('  <div class="card">\n    <h2>Issues</h2>')]
    new_view = """  <div class="card">
    <h2>Gallery</h2>
    <div id="gallery"></div>
  </div>
  <div class="card">
    <h2>View</h2>
    <label class="hint">Exploded view</label>
    <input type="range" id="explode" min="0" max="1" step="0.01" value="0">
  </div>
  <div class="card">
    <h2>Cut files</h2>
    <div id="downloads"></div>
  </div>
"""
    html = html.replace(old_view, new_view)

    # issues card is engine-diagnostics; replace with an about card
    old_issues = html[html.index('  <div class="card">\n    <h2>Issues</h2>'):
                      html.index('  <div class="hint">')]
    html = html.replace(old_issues, """  <div class="card">
    <h2>How it works</h2>
    <div class="sub" style="line-height:1.5">
      Each sculpture starts as a mathematical form field, then gets deconstructed
      region by region into flat parts using real construction techniques —
      <b>stacked</b> layers, <b>radial</b> ribs with slotted hubs,
      <b>interlocked</b> egg-crate grids, and <b>3D-printed</b> connectors.
      Every part you see is a real cut piece: the 3D view is built from the
      same polygons as the downloadable cut sheets.
    </div>
  </div>
""")
    html = html.replace(
        """  <div class="hint">
    Edit <b>design.json</b> (e.g. with Claude Code) — the view updates
    automatically. Middle-drag pan · Shift+middle orbit · wheel zoom.
  </div>""",
        """  <div class="hint">
    Drag to orbit · wheel to zoom · hover a part for its number.
    Built by <a href="https://mikegilliland.ca" style="color:#e8a84c">Mike Gilliland</a>.
  </div>""")

    # gallery button styling
    html = html.replace("  .hint { color: var(--dim); font-size: 11px; }", """  .hint { color: var(--dim); font-size: 11px; }
  button.gal { display: block; width: 100%; text-align: left; margin-bottom: 6px;
               padding: 8px 10px; }
  button.gal b { display: block; font-size: 13px; }
  button.gal span { display: block; color: var(--dim); font-size: 11px; margin-top: 2px; }
  button.gal.on { border-color: var(--accent); background: #2e2519; }
  #downloads a { display: block; color: var(--accent); font-size: 12px;
                 text-decoration: none; padding: 2px 0; }
  #downloads a:hover { text-decoration: underline; }""")

    # The clean URL /projects/sculptgen (no trailing slash) would otherwise
    # resolve relative assets against /projects/. A base tag pins them.
    html = html.replace('<meta charset="utf-8">',
                        '<meta charset="utf-8">\n<base href="/projects/sculptgen/">')

    html = html.replace("<title>SculptGen</title>",
                        "<title>SculptGen — generative fabrication artwork</title>\n"
                        '<meta name="description" content="Generative sculpture that '
                        'compiles into real laser/CNC cut files and 3D-printed parts.">')

    (DST / "index.html").write_text(html, encoding="utf-8")

    n = sum(1 for p in DST.rglob("*") if p.is_file())
    total = sum(p.stat().st_size for p in DST.rglob("*") if p.is_file())
    print(f"\nBuilt {DST}")
    print(f"  {len(manifest)} sculptures · {n} files · {total/1024:.0f} KB")


if __name__ == "__main__":
    main()
