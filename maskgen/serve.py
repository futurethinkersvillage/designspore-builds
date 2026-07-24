"""MaskGen service: static app + stateless generation API + AI endpoints.

Endpoints
  GET  /                      -> maskgen/app/ static files
  GET  /api/health            -> {ok, ai: {fal, claude}}
  POST /api/generate          -> body = mask design JSON; runs the engine +
                                 SVG/DXF exports into workspaces/<hash>/ and
                                 returns {id, result, files:[...]} (cached by
                                 design hash)
  POST /api/artwork           -> {prompt, seed?} -> fal.ai image -> grayscale
                                 depth PNG in workspaces/art/; returns
                                 {image_id, url, cost_usd}
  POST /api/stylize           -> {vibe} -> Claude Haiku -> mask param patch
  GET  /files/<ws>/<name>     -> workspace downloads (svg/dxf/json/png)

Keys: FAL_KEY + ANTHROPIC_API_KEY from the environment or maskgen/.env
(KEY=value lines). Never committed.

Run: python maskgen/serve.py   (port 8710)
"""
import hashlib
import io
import json
import os
import subprocess
import sys
import threading
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parent
APP = HERE / "app"
WORK = HERE / "workspaces"
ART = WORK / "art"
PYTHON = sys.executable
LOCK = threading.Lock()
PORT = int(os.environ.get("PORT", 8710))

FAL_MODEL = "fal-ai/flux/schnell"
FAL_COST = 0.003          # USD per image, order-of-magnitude for the UI
CLAUDE_MODEL = "claude-haiku-4-5-20251001"
CLAUDE_COST = 0.005

ART_PROMPT = ("flat ornamental relief carving pattern for a ceremonial mask, "
              "front view, bilaterally symmetric, engraved linework, "
              "high contrast grayscale, white raised areas on dark recessed "
              "background, no text, no watermark, fills the frame — {prompt}")


def _load_env():
    envf = HERE / ".env"
    if envf.exists():
        for line in envf.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip())


def _keys():
    return os.environ.get("FAL_KEY", ""), os.environ.get("ANTHROPIC_API_KEY", "")


def _http_json(url, payload, headers, timeout=120):
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json", **headers})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        detail = ""
        try:
            detail = e.read().decode()[:300]
        except Exception:
            pass
        raise RuntimeError(f"{url.split('/')[2]} {e.code}: {detail}")


def _design_hash(design):
    return hashlib.sha1(
        json.dumps(design, sort_keys=True).encode()).hexdigest()[:16]


def run_generate(design):
    """Engine + exports into workspaces/<hash>; returns (id, result, files)."""
    # resolve AI artwork references to their stored files
    deco = (design.get("mask") or {}).get("decoration") or {}
    if deco.get("image_id"):
        art = ART / f"{deco['image_id']}.png"
        if not art.exists():
            raise RuntimeError(f"artwork {deco['image_id']} not found — "
                               f"generate it again")
        deco["image"] = str(art)
    wid = _design_hash(design)
    ws = WORK / wid
    result_f = ws / "parts.json"
    if result_f.exists():
        result = json.loads(result_f.read_text(encoding="utf-8"))
        files = sorted(f.name for f in ws.iterdir()
                       if f.suffix in (".svg", ".dxf", ".json", ".stl"))
        return wid, result, files
    ws.mkdir(parents=True, exist_ok=True)
    (ws / "design.json").write_text(json.dumps(design, indent=1),
                                    encoding="utf-8")
    proc = subprocess.run(
        [PYTHON, str(ROOT / "engine" / "generate.py"),
         "--design", str(ws / "design.json"), "--out", str(result_f)],
        capture_output=True, text=True, timeout=300)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr[-3000:])
    result = json.loads(result_f.read_text(encoding="utf-8"))
    has_flat = any("polygon" in p for p in result.get("parts", []))
    has_mesh = any("mesh" in p for p in result.get("parts", []))
    bed = design.get("bed", "800x400")
    kerf = str(design.get("kerf_mm", 0.15))
    if has_flat:
        for script in ("export_svg.py", "export_dxf.py"):
            subprocess.run(
                [PYTHON, str(ROOT / "engine" / script), "--parts",
                 str(result_f), "--out", str(ws), "--bed", bed,
                 "--kerf", kerf],
                capture_output=True, text=True, timeout=300)
    if has_mesh:
        subprocess.run(
            [PYTHON, str(ROOT / "engine" / "export_stl.py"),
             "--parts", str(result_f), "--out", str(ws)],
            capture_output=True, text=True, timeout=300)
    files = sorted(f.name for f in ws.iterdir()
                   if f.suffix in (".svg", ".dxf", ".json", ".stl"))
    return wid, result, files


def run_artwork(prompt, seed=None):
    fal_key, _ = _keys()
    if not fal_key:
        raise RuntimeError("FAL_KEY not configured")
    payload = {"prompt": ART_PROMPT.format(prompt=prompt.strip()),
               "image_size": "square_hd", "num_images": 1,
               "enable_safety_checker": True}
    if seed is not None:
        payload["seed"] = int(seed)
    out = _http_json(f"https://fal.run/{FAL_MODEL}", payload,
                     {"Authorization": f"Key {fal_key}"})
    url = out["images"][0]["url"]
    with urllib.request.urlopen(url, timeout=120) as r:
        raw = r.read()
    from PIL import Image
    im = Image.open(io.BytesIO(raw)).convert("L")
    iid = hashlib.sha1(raw).hexdigest()[:16]
    ART.mkdir(parents=True, exist_ok=True)
    im.save(ART / f"{iid}.png")
    return {"image_id": iid, "url": f"/files/art/{iid}.png",
            "seed": out.get("seed"), "cost_usd": FAL_COST}


STYLIZE_SYS = (
    "You translate a vibe description into parameters for a generative CNC "
    "mask. Reply with ONLY a JSON object; any of these keys: chin_taper "
    "(0-0.6), brow_flat (0-0.4), depth_mm (55-110), wall_mm (7-14), "
    "strength_mm (6-20, decoration carve depth), art_prompt (a short image "
    "prompt capturing the vibe as carved ornament, e.g. 'owl feathers and "
    "moon phases'), mode ('carve'|'emboss'). Choose values that express the "
    "vibe physically: sharp/angular vibes -> deeper carve + more taper; "
    "soft/round -> shallow emboss, fuller brow.")


def _stylize_fallback(vibe):
    """Keyword heuristic when the LLM is unavailable — keeps the button alive."""
    v = vibe.lower()
    p = {"art_prompt": vibe, "mode": "carve"}
    sharp = any(w in v for w in ("sharp", "angular", "fierce", "imposing",
                                 "warrior", "demon", "edgy"))
    soft = any(w in v for w in ("soft", "gentle", "round", "calm", "kind",
                                "serene", "flowing"))
    if sharp:
        p.update(chin_taper=0.48, strength_mm=16, depth_mm=92)
    elif soft:
        p.update(chin_taper=0.22, brow_flat=0.3, strength_mm=8,
                 mode="emboss", depth_mm=70)
    return p


def run_stylize(vibe):
    _, akey = _keys()
    if not akey:
        return {"params": _stylize_fallback(vibe), "fallback": True,
                "cost_usd": 0}
    try:
        out = _http_json(
            "https://api.anthropic.com/v1/messages",
            {"model": CLAUDE_MODEL, "max_tokens": 300,
             "system": STYLIZE_SYS,
             "messages": [{"role": "user", "content": vibe.strip()[:500]}]},
            {"x-api-key": akey, "anthropic-version": "2023-06-01"})
        text = "".join(b.get("text", "") for b in out.get("content", []))
        start, end = text.find("{"), text.rfind("}")
        params = json.loads(text[start:end + 1])
        return {"params": params, "cost_usd": CLAUDE_COST}
    except RuntimeError as e:
        # e.g. out of API credits — degrade to the heuristic, tell the client
        return {"params": _stylize_fallback(vibe), "fallback": True,
                "note": str(e)[:200], "cost_usd": 0}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(APP), **kw)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def _json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/health":
            fal, akey = _keys()
            self._json({"ok": True, "ai": {"fal": bool(fal),
                                           "claude": bool(akey)}})
        elif self.path.startswith("/files/"):
            rel = self.path[len("/files/"):].split("?")[0]
            target = (WORK / rel).resolve()
            if not str(target).startswith(str(WORK.resolve())) \
                    or not target.is_file():
                self.send_error(404)
                return
            ctype = {"svg": "image/svg+xml", "dxf": "application/dxf",
                     "json": "application/json", "png": "image/png",
                     "stl": "model/stl"}.get(target.suffix[1:],
                                             "application/octet-stream")
            data = target.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Disposition",
                             f'attachment; filename="{target.name}"')
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        else:
            super().do_GET()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        try:
            body = json.loads(self.rfile.read(length).decode() or "{}")
        except Exception as e:
            self._json({"error": f"invalid JSON: {e}"}, 400)
            return
        try:
            if self.path == "/api/generate":
                with LOCK:
                    wid, result, files = run_generate(body)
                self._json({"id": wid, "result": result,
                            "files": [f"/files/{wid}/{n}" for n in files]})
            elif self.path == "/api/artwork":
                self._json(run_artwork(body.get("prompt", "ornate patterns"),
                                       body.get("seed")))
            elif self.path == "/api/stylize":
                self._json(run_stylize(body.get("vibe", "")))
            else:
                self.send_error(404)
        except Exception as e:
            self._json({"error": str(e)[-2000:]}, 500)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    _load_env()
    WORK.mkdir(exist_ok=True)
    fal, akey = _keys()
    print(f"maskgen serving on http://127.0.0.1:{PORT}  "
          f"(fal={'yes' if fal else 'NO'}, claude={'yes' if akey else 'NO'})")
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
