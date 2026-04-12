"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import projects from "@/content/projects.json";

const statusColors: Record<string, string> = {
  live: "text-green-500",
  active: "text-amber-500",
  shipped: "text-green-500",
  ongoing: "text-blue-400",
  building: "text-amber-400",
  planning: "text-neutral-500",
};

const businessOrder = [
  "Design Spore",
  "Portal.Place",
  "Wells Gray Resort",
  "Future Thinkers",
];

export default function Projects() {
  const grouped = businessOrder.map((biz) => ({
    business: biz,
    items: projects.filter((p) => p.business === biz),
  }));

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-12 font-mono text-sm tracking-widest text-amber-600/80 uppercase"
      >
        Projects
      </motion.h2>

      <div className="space-y-16">
        {grouped.map((group) => (
          <div key={group.business}>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4 }}
              className="mb-6 font-mono text-xs tracking-widest text-neutral-500 uppercase"
            >
              {group.business}
            </motion.h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {group.items.map((project, i) => {
                const isLink = !!project.url;
                const Card = isLink ? "a" : "div";
                const linkProps = isLink
                  ? {
                      href: project.url as string,
                      target: "_blank" as const,
                      rel: "noopener noreferrer",
                    }
                  : {};

                return (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <Card
                      {...linkProps}
                      className="group block overflow-hidden rounded-lg border border-neutral-800 transition-colors hover:border-neutral-700"
                    >
                      {project.image && (
                        <div className="relative h-40 w-full overflow-hidden bg-neutral-900">
                          <Image
                            src={project.image}
                            alt={project.name}
                            fill
                            className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-mono text-sm font-semibold text-neutral-100">
                            {project.name}
                          </h4>
                          <span
                            className={`font-mono text-[10px] uppercase tracking-wider ${statusColors[project.status] || "text-neutral-500"}`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                          {project.oneLiner}
                        </p>
                        {project.url && (
                          <p className="mt-2 font-mono text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">
                            {project.url.replace("https://", "")} &rarr;
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-sm bg-neutral-800/60 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
