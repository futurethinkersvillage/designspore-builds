# Trillium Plans Studio

An interactive working copy of the Trillium Domes plan bundle: every dome and
zome in the bundle, a 3D model you can pull apart panel by panel, the builders
method rewritten for clarity, and an audit that cross-checks every printed
dimension.

Plans © Golden Trillium Geodesics LLC. Licensed to Mike Gilliland for personal
use. This is a private prototype built for a collaboration conversation with
Trillium Domes — it is not for distribution.

Lives at **/projects/trillium-plans** on mikegilliland.ca, alongside the dome
generator it shares a geometry engine with.

## Run it

No build step. Serve the site's `public/` folder so the `<base href>` resolves:

```bash
npx serve -l 3610 ../../..
```

Then open http://localhost:3610/projects/trillium-plans/. The passphrase is in
`js/app.js`.

Serving this folder directly will 404 on every asset — `index.html` carries
`<base href="/projects/trillium-plans/">` because the site strips the trailing
slash from the URL.

## What's here

```
index.html          shell: gate, model list, tabs — carries the base href
js/geometry.js      the geometry engine (shared with the Fusion add-in)
js/viewer.js        three.js panel viewer — explode, isolate, skin toggle
js/app.js           model loading, tab rendering, CSV export
js/plan.js          plan-data helpers (edge expansion, unit formatting)
data/registry.json  the 16 models and their engine parameters
data/models/*.json  one transcribed plan per model
data/method-*.json  the rewritten builders method, dome and zome variants
scripts/audit.mjs   the plan checker — see below
```

## The plan check

```bash
node scripts/audit.mjs
```

Every printed dimension is tested twice: against the plan's own internal
geometry (a triangle's corner angles must total 180°, a rhombus's miter must
follow from its side and mid-width) and against the model the engine generates
from the same parameters. The same report drives the **Plan Check** tab.

It currently finds 18 places where a plan contradicts itself — the clearest
being the 20 ft pent panel, printed as 33.4° in the imperial edition and 35.4°
in the metric one, where solving the triangle gives 35.38°.

Two rules when adding a model:

- Transcribe what is printed. Never round, never quietly correct, never compute
  a number the plan doesn't state. If the plan is wrong, the audit's job is to
  say so.
- Where the imperial and metric editions disagree, record both. That
  disagreement is usually the evidence for which one is the typo.

## 4V models

The 4V plans (23 ft, 26 ft, 30 ft, 40 ft) use Trillium's own four-strut-length
breakdown; the engine generates a standard Class I breakdown. The shape is
right, the generated dimensions differ slightly, and those models are flagged
`approx` in the registry so the UI says to build from the printed schedule.

## Related

`C:\Users\miken\Projects\trillium-fusion` is the Fusion 360 add-in — same
geometry engine, ported to Python, with a parity test that keeps the two from
drifting apart. Run that test after editing `js/geometry.js` here.
