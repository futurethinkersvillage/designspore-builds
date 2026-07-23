import fs from "node:fs";
import path from "node:path";
import gallery from "@/content/projects-gallery.json";

export const metadata = {
  title: "Projects — Mike Gilliland",
  description:
    "Interactive projects and experiments by Mike Gilliland — generative fabrication, configurators, LED sculptures, and 3D modeling.",
};

interface GalleryEntry {
  slug: string;
  href: string;
  title: string;
  description: string;
  order: number;
}

interface Override {
  title?: string;
  description?: string;
  order?: number;
}

function extractTag(html: string, re: RegExp): string | undefined {
  const m = html.match(re);
  return m ? m[1].trim() : undefined;
}

function discoverProjects(): GalleryEntry[] {
  const dir = path.join(process.cwd(), "public", "projects");
  const overrides = gallery.overrides as Record<string, Override>;
  const entries: GalleryEntry[] = [];

  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    let slug: string;
    let htmlPath: string;
    let href: string;
    if (item.isDirectory()) {
      slug = item.name;
      htmlPath = path.join(dir, item.name, "index.html");
      href = `/projects/${item.name}`;
      if (!fs.existsSync(htmlPath)) continue;
    } else if (item.name.endsWith(".html")) {
      slug = item.name.replace(/\.html$/, "");
      htmlPath = path.join(dir, item.name);
      href = `/projects/${item.name}`;
    } else {
      continue;
    }

    const html = fs.readFileSync(htmlPath, "utf8");
    const o = overrides[slug] ?? {};
    entries.push({
      slug,
      href,
      title:
        o.title ??
        extractTag(html, /<title>([^<]*)<\/title>/i) ??
        slug.replace(/-/g, " "),
      description:
        o.description ??
        extractTag(html, /<meta\s+name="description"\s+content="([^"]*)"/i) ??
        "",
      order: o.order ?? 99,
    });
  }

  for (const extra of gallery.extras as GalleryEntry[]) {
    entries.push({ ...extra, order: extra.order ?? 99 });
  }

  return entries.sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title)
  );
}

export default function ProjectsIndex() {
  const projects = discoverProjects();

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
          {projects.length} project{projects.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-24">
        <header className="py-16">
          <p className="font-mono text-sm tracking-widest text-amber-600/80 uppercase">
            Projects
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-neutral-100">
            Interactive experiments
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-neutral-400">
            Self-contained tools and toys that run entirely in your browser —
            generative fabrication, configurators, wiring maps, and 3D models.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <a
              key={p.slug}
              href={p.href}
              className="group block rounded-lg border border-neutral-800 p-5 transition-colors hover:border-neutral-700"
            >
              <h2 className="font-mono text-sm font-semibold text-neutral-100">
                {p.title}
              </h2>
              {p.description && (
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {p.description}
                </p>
              )}
              <p className="mt-3 font-mono text-xs text-neutral-600 transition-colors group-hover:text-neutral-400">
                {p.href} &rarr;
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
