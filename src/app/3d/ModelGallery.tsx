"use client";

import { motion } from "framer-motion";
import ModelViewer from "@/components/three/ModelViewer";
import models from "@/content/models.json";

interface ModelEntry {
  slug: string;
  name: string;
  oneLiner: string;
  status: string;
  date: string;
  software: string;
  tags: string[];
  model: { src: string; format: "stl" | "glb" | "3mf" };
  downloads: { label: string; href: string }[];
  video: { youtubeId?: string; src?: string } | null;
  writeup: string[];
}

export default function ModelGallery() {
  const items = models as ModelEntry[];

  return (
    <main>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/95 px-6 py-3 backdrop-blur">
        <a
          href="/"
          className="font-mono text-xs text-neutral-500 transition hover:text-neutral-300"
        >
          ← mikegilliland.ca
        </a>
        <span className="font-mono text-xs text-neutral-600">
          {items.length} model{items.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-24">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-16"
        >
          <p className="font-mono text-sm tracking-widest text-amber-600/80 uppercase">
            3D Modeling
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-neutral-100">
            Things I&apos;ve designed in CAD
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-neutral-400">
            Functional parts, brand pieces, and fabrication experiments —
            mostly modeled in Fusion 360, printed and used in the real world.
            Every model here is interactive: drag to rotate, scroll to zoom.
          </p>
        </motion.header>

        <div className="space-y-20">
          {items.map((m, i) => (
            <motion.article
              key={m.slug}
              id={m.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.2) }}
            >
              <ModelViewer
                src={m.model.src}
                format={m.model.format}
                className="aspect-[16/10] w-full"
              />

              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-mono text-lg font-semibold text-neutral-100">
                  {m.name}
                </h2>
                <span className="font-mono text-xs text-neutral-600">
                  {m.software} · {m.date}
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {m.writeup.map((para, j) => (
                  <p key={j} className="leading-relaxed text-neutral-400">
                    {para}
                  </p>
                ))}
              </div>

              {m.video?.youtubeId && (
                <div className="mt-5 aspect-video overflow-hidden rounded-lg border border-neutral-800">
                  <iframe
                    src={`https://www.youtube.com/embed/${m.video.youtubeId}`}
                    title={`${m.name} — video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              )}
              {m.video?.src && (
                <video
                  controls
                  preload="metadata"
                  className="mt-5 w-full rounded-lg border border-neutral-800"
                  src={m.video.src}
                />
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {m.downloads.map((d) => (
                  <a
                    key={d.href}
                    href={d.href}
                    download
                    className="rounded-sm border border-neutral-800 px-2.5 py-1 font-mono text-xs text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200"
                  >
                    ↓ {d.label}
                  </a>
                ))}
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm bg-neutral-800/60 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <footer className="mt-24 border-t border-neutral-800 pt-8">
          <p className="text-sm text-neutral-500">
            More models coming as they get exported from Fusion 360. Related:{" "}
            <a
              href="/projects/sculptgen/"
              className="text-neutral-400 underline decoration-neutral-700 underline-offset-2 hover:text-neutral-200"
            >
              SculptGen
            </a>{" "}
            and the{" "}
            <a
              href="/projects/wikihouse-configurator/"
              className="text-neutral-400 underline decoration-neutral-700 underline-offset-2 hover:text-neutral-200"
            >
              WikiHouse configurator
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}
