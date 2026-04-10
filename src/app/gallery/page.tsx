"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

type Category = "all" | "land" | "infrastructure" | "community" | "seasons";

interface Photo {
  src: string;
  alt: string;
  category: Exclude<Category, "all">;
}

const PHOTOS: Photo[] = [
  // Land & Nature
  { src: "/images/swimming-lake-scaled.jpg", alt: "Private swimming lake", category: "land" },
  { src: "/images/horses-in-field-scaled.jpg", alt: "Horses in the fields", category: "land" },
  { src: "/images/creek-view-1-scaled.jpg", alt: "Clearwater Creek", category: "land" },
  { src: "/images/creek-view-2-scaled.jpg", alt: "Creek at dusk", category: "land" },
  { src: "/images/the-creek-scaled.jpg", alt: "The village creek", category: "land" },
  { src: "/images/moose-at-lake-scaled.jpg", alt: "Moose at the lake", category: "land" },
  { src: "/images/bear-scaled.jpg", alt: "Local wildlife", category: "land" },
  { src: "/images/gazebo-rainbow-scaled.jpg", alt: "Rainbow over the gazebo", category: "land" },
  { src: "/images/golf-course-3.jpg", alt: "Aerial view of the property", category: "land" },
  // Infrastructure
  { src: "/images/dome-at-night-scaled.jpg", alt: "Geodesic dome at night", category: "infrastructure" },
  { src: "/images/dome-interior-scaled.jpg", alt: "Inside the geodesic dome", category: "infrastructure" },
  { src: "/images/gazebo-interior-scaled.jpg", alt: "Community gazebo interior", category: "infrastructure" },
  { src: "/images/gazebo-view-scaled.jpg", alt: "Gazebo from outside", category: "infrastructure" },
  { src: "/images/cabin-scaled.jpg", alt: "Village cabin", category: "infrastructure" },
  { src: "/images/cabins-scaled.jpg", alt: "Cabins at the village", category: "infrastructure" },
  { src: "/images/rv-in-campsite-scaled.jpg", alt: "RV in campsite", category: "infrastructure" },
  { src: "/images/rv-interior.jpg", alt: "RV interior", category: "infrastructure" },
  { src: "/images/shower-house-scaled.jpg", alt: "Shower house", category: "infrastructure" },
  { src: "/images/picnic-tables-creek.jpg", alt: "Creekside picnic area", category: "infrastructure" },
  // Community
  { src: "/images/gazebo-community-meetup-scaled.jpg", alt: "Community gathering at the gazebo", category: "community" },
  { src: "/images/disc-golf-tournament-scaled.jpg", alt: "Disc golf tournament", category: "community" },
  { src: "/images/gazebo-disc-golf-tournament-scaled.jpg", alt: "Tournament gathering", category: "community" },
  { src: "/images/canada-day-meetup-scaled.jpg", alt: "Canada Day celebration", category: "community" },
  { src: "/images/kids-on-trampoline-scaled.jpg", alt: "Kids playing", category: "community" },
  { src: "/images/kids-playing-golf-scaled.jpg", alt: "Kids on the golf course", category: "community" },
  { src: "/images/meditation-group.jpg", alt: "Morning meditation group", category: "community" },
  { src: "/images/dome-movie-watching.jpg", alt: "Movie night in the dome", category: "community" },
  { src: "/images/campfire-in-gazebo-scaled.jpg", alt: "Campfire evening", category: "community" },
  { src: "/images/76747423_10163561173205725_3017674924459294720_n-1024x577.jpg", alt: "Mike and Euvie at the village", category: "community" },
  // Seasons
  { src: "/images/buildings-in-winter-scaled.jpg", alt: "Village in winter", category: "seasons" },
  { src: "/images/sauna-in-winter-scaled.jpg", alt: "Cedar sauna in winter", category: "seasons" },
  { src: "/images/aurora-at-night-scaled.jpg", alt: "Aurora borealis over the property", category: "seasons" },
  { src: "/images/camper-at-night-scaled.jpg", alt: "Camper under the stars", category: "seasons" },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "land", label: "Land & Nature" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "community", label: "Community" },
  { id: "seasons", label: "Seasons" },
];

export default function GalleryPage() {
  const [active, setActive] = useState<Category>("all");
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const filtered = active === "all" ? PHOTOS : PHOTOS.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-warm-dark">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-12 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber mb-4">Gallery</p>
        <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[0.95] tracking-tighter text-white mb-6">
          Wells Gray<br />
          <span className="italic">Village</span>
        </h1>
        <p className="text-base text-white/60 max-w-[52ch] mb-10">
          400 acres in Interior BC — land, water, wildlife, and a community
          building something worth returning to.
        </p>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                active === cat.id
                  ? "bg-amber text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photo grid */}
      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 xl:columns-4">
          {filtered.map((photo) => (
            <button
              key={photo.src}
              onClick={() => setLightbox(photo)}
              className="group relative mb-3 block w-full overflow-hidden rounded-lg bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
              aria-label={`View ${photo.alt}`}
            >
              <div className="relative w-full" style={{ paddingBottom: "66%" }}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              </div>
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
                <p className="text-xs text-white/80">{photo.alt}</p>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 border-t border-white/10 pt-12 text-center">
          <p className="text-sm text-white/50 mb-6">Want to see it in person?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tour"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-amber/90 active:scale-[0.98]"
            >
              Take the virtual tour <ArrowRight size={14} weight="bold" />
            </Link>
            <a
              href="https://wellsgrayresort.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              Book a stay <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div
            className="relative max-h-[90vh] max-w-5xl w-full overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ paddingBottom: "66%" }}>
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1024px"
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
              <p className="text-sm text-white/80">{lightbox.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
