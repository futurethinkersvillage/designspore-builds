# Adding models to mikegilliland.ca/3d

The 3D section is driven by `src/content/models.json`. Each entry pairs a mesh in
`public/3d/<slug>/` with a writeup, optional video, and download links. The viewer
(`src/components/three/ModelViewer.tsx`) renders STL, GLB, or 3MF in the browser.

## 1. Export from Fusion 360

For each design you want on the site:

- **STL** (required — this is what the viewer displays): right-click the body/component
  → *Save as Mesh* → STL, binary, refinement Medium or High.
- Optional extra downloads: STEP (File → Export → .step) if you want to share editable
  geometry, or extra STLs for multi-part designs.
- Drop everything into `incoming-3d/<model name>/` in this repo (folder is gitignored).

## 2. Drop in a video (optional)

If you filmed a walkthrough of the model, put the video file in the same
`incoming-3d/<model name>/` folder (any format — mp4/mov/mkv). If it's on YouTube
instead, just note the YouTube ID in a `notes.txt` there.

## 3. Ask Claude to publish it

Say something like *"add the models in incoming-3d to the 3D section."* Claude then:

1. Copies the mesh(es) to `public/3d/<slug>/` and adds a `models.json` entry.
2. If there's a video: transcribes it locally with Whisper (`/transcribe`, runs on the
   RTX 4060, nothing uploaded), writes the writeup from the transcript, and either
   embeds the YouTube ID or copies the mp4 to `public/3d/<slug>/video.mp4`.
   Keep self-hosted videos under ~50 MB — re-encode bigger ones
   (`ffmpeg -i in.mov -crf 28 -preset slow -vf scale=1280:-2 out.mp4`).
3. If there's no video: drafts a short writeup from the geometry + anything you tell it;
   you review the wording before deploy.
4. Verifies the page locally, commits, pushes to the `mikegilliland` branch, and
   triggers the Coolify redeploy (see memory: deploys are manual, not on-push).

## models.json entry shape

```json
{
  "slug": "kebab-case-id",
  "name": "Display Name",
  "oneLiner": "One sentence for cards/teasers.",
  "status": "draft | published",
  "date": "YYYY-MM",
  "software": "Fusion 360",
  "tags": ["fusion-360", "3d-print"],
  "model": { "src": "/3d/<slug>/model.stl", "format": "stl" },
  "downloads": [{ "label": "STL", "href": "/3d/<slug>/model.stl" }],
  "video": null,
  "writeup": ["Paragraph 1.", "Paragraph 2."]
}
```

`video` is either `{ "youtubeId": "..." }` or `{ "src": "/3d/<slug>/video.mp4" }`.
