"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ModelViewer from "@/components/three/ModelViewer";

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
  hidden?: boolean;
}

type ViewMode = "detailed" | "gallery";

const BATCH: Record<ViewMode, number> = { detailed: 4, gallery: 9 };
const KEY_STORAGE = "admin3dKey";
const VIEW_STORAGE = "view3dMode";

export default function ModelGallery({
  initialModels,
  adminAvailable,
}: {
  initialModels: ModelEntry[];
  adminAvailable: boolean;
}) {
  const [models, setModels] = useState<ModelEntry[]>(initialModels);
  const [admin, setAdmin] = useState(false);
  const [view, setView] = useState<ViewMode>("detailed");
  const [count, setCount] = useState(BATCH.detailed);
  const [busy, setBusy] = useState<string | null>(null);

  // Restore saved view preference.
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_STORAGE) as ViewMode | null;
    if (saved === "gallery" || saved === "detailed") {
      setView(saved);
      setCount(BATCH[saved]);
    }
  }, []);

  const enterAdmin = useCallback(async (key: string) => {
    const res = await fetch("/api/3d/models", {
      headers: { "x-admin-key": key },
      cache: "no-store",
    });
    if (!res.ok) {
      localStorage.removeItem(KEY_STORAGE);
      alert("Admin key rejected.");
      return;
    }
    const data = (await res.json()) as { models: ModelEntry[] };
    localStorage.setItem(KEY_STORAGE, key);
    setModels(data.models);
    setAdmin(true);
  }, []);

  // Deep-link ?admin activates the admin controls (prompts for the key once).
  useEffect(() => {
    if (!adminAvailable) return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has("admin")) return;
    const key = localStorage.getItem(KEY_STORAGE) || window.prompt("Admin key:");
    if (key) void enterAdmin(key);
  }, [adminAvailable, enterAdmin]);

  const setViewMode = (mode: ViewMode) => {
    setView(mode);
    setCount((c) => Math.max(c, BATCH[mode]));
    localStorage.setItem(VIEW_STORAGE, mode);
  };

  const toggleHidden = async (slug: string, hidden: boolean) => {
    setBusy(slug);
    try {
      const key = localStorage.getItem(KEY_STORAGE) || "";
      const res = await fetch("/api/3d/hidden", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ slug, hidden }),
      });
      if (!res.ok) {
        alert("Update failed.");
        return;
      }
      const data = (await res.json()) as { models: ModelEntry[] };
      setModels(data.models);
    } finally {
      setBusy(null);
    }
  };

  // Admins see every model (hidden ones dimmed); visitors see only visible ones.
  const list = admin ? models : models.filter((m) => !m.hidden);
  const shown = list.slice(0, count);
  const hasMore = count < list.length;

  // Infinite scroll: pull the next batch when the sentinel nears the viewport.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => c + BATCH[view]);
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, view, shown.length]);

  const hiddenCount = admin ? models.filter((m) => m.hidden).length : 0;

  return (
    <main>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-950/95 px-6 py-3 backdrop-blur">
        <a
          href="/"
          className="font-mono text-xs text-neutral-500 transition hover:text-neutral-300"
        >
          ← mikegilliland.ca
        </a>
        <div className="flex items-center gap-3">
          {admin && (
            <span className="rounded-sm bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-400">
              admin · {hiddenCount} hidden
            </span>
          )}
          <div className="flex overflow-hidden rounded-md border border-neutral-800 font-mono text-[10px] uppercase tracking-wider">
            <button
              onClick={() => setViewMode("detailed")}
              className={`px-2.5 py-1 transition-colors ${
                view === "detailed"
                  ? "bg-neutral-800 text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Detailed
            </button>
            <button
              onClick={() => setViewMode("gallery")}
              className={`px-2.5 py-1 transition-colors ${
                view === "gallery"
                  ? "bg-neutral-800 text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Gallery
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-24">
        <header className="py-16">
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
        </header>

        {view === "gallery" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((m) => (
              <GalleryCard
                key={m.slug}
                m={m}
                admin={admin}
                busy={busy === m.slug}
                onToggle={toggleHidden}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-20">
            {shown.map((m, i) => (
              <DetailCard
                key={m.slug}
                m={m}
                index={i}
                admin={admin}
                busy={busy === m.slug}
                onToggle={toggleHidden}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div ref={sentinelRef} className="flex justify-center py-12">
            <button
              onClick={() => setCount((c) => c + BATCH[view])}
              className="rounded-md border border-neutral-800 px-4 py-2 font-mono text-xs text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200"
            >
              Load more ({list.length - count} left)
            </button>
          </div>
        )}

        <footer className="mt-16 border-t border-neutral-800 pt-8">
          <p className="text-sm text-neutral-500">
            More models coming as they get exported from Fusion 360. Related:{" "}
            <a
              href="/projects"
              className="text-neutral-400 underline decoration-neutral-700 underline-offset-2 hover:text-neutral-200"
            >
              all projects
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}

function HideButton({
  m,
  busy,
  onToggle,
}: {
  m: ModelEntry;
  busy: boolean;
  onToggle: (slug: string, hidden: boolean) => void;
}) {
  return (
    <button
      disabled={busy}
      onClick={() => onToggle(m.slug, !m.hidden)}
      className={`rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50 ${
        m.hidden
          ? "border-green-700/50 text-green-400 hover:border-green-600"
          : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
      }`}
    >
      {busy ? "…" : m.hidden ? "Show" : "Hide"}
    </button>
  );
}

function DetailCard({
  m,
  index,
  admin,
  busy,
  onToggle,
}: {
  m: ModelEntry;
  index: number;
  admin: boolean;
  busy: boolean;
  onToggle: (slug: string, hidden: boolean) => void;
}) {
  return (
    <motion.article
      id={m.slug}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.2) }}
      className={m.hidden ? "opacity-50" : ""}
    >
      <ModelViewer
        src={m.model.src}
        format={m.model.format}
        className="aspect-[16/10] w-full"
      />

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="font-mono text-lg font-semibold text-neutral-100">
            {m.name}
          </h2>
          {admin && m.hidden && (
            <span className="rounded-sm bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              hidden
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-neutral-600">
            {m.software} · {m.date}
          </span>
          {admin && <HideButton m={m} busy={busy} onToggle={onToggle} />}
        </div>
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
  );
}

function GalleryCard({
  m,
  admin,
  busy,
  onToggle,
}: {
  m: ModelEntry;
  admin: boolean;
  busy: boolean;
  onToggle: (slug: string, hidden: boolean) => void;
}) {
  return (
    <motion.article
      id={m.slug}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className={`rounded-lg border border-neutral-800 p-3 ${m.hidden ? "opacity-50" : ""}`}
    >
      <ModelViewer
        src={m.model.src}
        format={m.model.format}
        className="aspect-square w-full"
      />
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate font-mono text-sm font-semibold text-neutral-100">
            {m.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-400">
            {m.oneLiner}
          </p>
        </div>
        {admin && (
          <div className="shrink-0">
            <HideButton m={m} busy={busy} onToggle={onToggle} />
          </div>
        )}
      </div>
    </motion.article>
  );
}
