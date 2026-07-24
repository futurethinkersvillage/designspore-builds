"""SculptGen dev server.

- static app from app/
- GET  /design.json      -> current design document
- GET  /api/version      -> {design_mtime, parts_mtime}
- GET  /api/parts        -> parts.json, regenerating first if design changed
                            (add ?force=1 to always regenerate)
- POST /api/design       -> replace design.json with request body (validated JSON)
- POST /snap             -> save posted canvas dataURL to snapshot.jpg
"""
import json
import base64
import subprocess
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).parent
APP = ROOT / "app"
DESIGN = ROOT / "design.json"
PARTS = ROOT / "parts.json"
SNAP = ROOT / "snapshot.jpg"
PYTHON = sys.executable
LOCK = threading.Lock()


def regen():
    proc = subprocess.run(
        [PYTHON, str(ROOT / "engine" / "generate.py"),
         "--design", str(DESIGN), "--out", str(PARTS)],
        capture_output=True, text=True, timeout=300)
    return proc


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
        if self.path == "/design.json":
            self._json(json.loads(DESIGN.read_text()))
        elif self.path == "/api/version":
            self._json({
                "design_mtime": DESIGN.stat().st_mtime if DESIGN.exists() else 0,
                "parts_mtime": PARTS.stat().st_mtime if PARTS.exists() else 0,
            })
        elif self.path.startswith("/api/parts"):
            force = "force=1" in self.path
            with LOCK:
                stale = (not PARTS.exists() or not DESIGN.exists()
                         or DESIGN.stat().st_mtime > PARTS.stat().st_mtime)
                if force or stale:
                    proc = regen()
                    if proc.returncode != 0 and not PARTS.exists():
                        self._json({"error": proc.stderr[-4000:], "parts": []})
                        return
            self._json(json.loads(PARTS.read_text()))
        else:
            super().do_GET()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        data = self.rfile.read(length).decode()
        if self.path == "/api/design":
            try:
                design = json.loads(data)
            except Exception as e:
                self._json({"error": f"invalid JSON: {e}"}, 400)
                return
            DESIGN.write_text(json.dumps(design, indent=2))
            self._json({"ok": True})
        elif self.path == "/snap":
            b64 = data.split(",", 1)[1] if "," in data else data
            SNAP.write_bytes(base64.b64decode(b64))
            self._json({"saved": str(SNAP)})
        else:
            self.send_error(404)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    print("sculptgen serving on http://127.0.0.1:8643")
    ThreadingHTTPServer(("127.0.0.1", 8643), Handler).serve_forever()
