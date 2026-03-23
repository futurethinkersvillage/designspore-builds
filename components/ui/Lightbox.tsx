"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { XIcon, ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";

interface LightboxProps {
  images: string[];
  alt: string;
}

export default function Lightbox({ images, alt }: LightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, prev, next, close]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Image grid — natural aspect ratio, no cropping */}
      <div className={`grid gap-4 mb-6 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setOpen(true); }}
            className="block w-full rounded-xl overflow-hidden bg-raised hover:opacity-90 transition-opacity cursor-zoom-in"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} — image ${i + 1}`}
              className="w-full h-auto block"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 backdrop-blur-sm"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <XIcon size={22} weight="bold" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous"
            >
              <ArrowLeftIcon size={20} weight="bold" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index]}
              alt={`${alt} — image ${index + 1}`}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg"
            />
            {images.length > 1 && (
              <p className="text-center text-white/40 text-xs mt-3">
                {index + 1} / {images.length}
              </p>
            )}
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next"
            >
              <ArrowRightIcon size={20} weight="bold" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
