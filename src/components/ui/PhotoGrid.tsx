"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "./Lightbox";

export interface Photo {
  src: string;
  alt: string;
}

interface PhotoGridProps {
  photos: Photo[];
  /** Tailwind grid-cols classes, e.g. "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" */
  cols?: string;
  /** Tailwind gap class, e.g. "gap-2" */
  gap?: string;
  /** Next.js Image sizes hint */
  sizes?: string;
  className?: string;
  /** Aspect ratio class for each cell, e.g. "aspect-square" or "aspect-video" */
  aspect?: string;
  /** Tailwind rounded class for cells */
  rounded?: string;
  /** Stagger animation modulo (number of columns) */
  staggerMod?: number;
}

export default function PhotoGrid({
  photos,
  cols = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  gap = "gap-2",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className,
  aspect = "aspect-square",
  rounded = "rounded-lg",
  staggerMod = 4,
}: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className={`grid ${cols} ${gap} ${className ?? ""}`}>
        {photos.map((photo, i) => (
          <motion.button
            key={`${photo.src}-${i}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: (i % staggerMod) * 0.05, duration: 0.4 }}
            className={`relative ${aspect} overflow-hidden ${rounded} cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-amber`}
            onClick={() => setLightboxIndex(i)}
            aria-label={`View ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={sizes}
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.button>
        ))}
      </div>

      <Lightbox
        images={photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
