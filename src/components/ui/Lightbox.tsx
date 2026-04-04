"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight } from "@phosphor-icons/react";

interface LightboxProps {
  images: { src: string; alt: string }[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const total = images.length;

  useEffect(() => {
    if (index === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % total);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + total) % total);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, total, onClose, onNavigate]);

  // Prevent body scroll when open
  useEffect(() => {
    if (index !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [index]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9900] flex items-center justify-center bg-black/92"
          onClick={onClose}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 pointer-events-none">
            <span className="font-mono text-xs text-white/40">
              {index + 1} / {total}
            </span>
            <button
              className="pointer-events-auto text-white/50 hover:text-white transition-colors p-1"
              onClick={onClose}
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          {/* Prev arrow */}
          {total > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
              onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + total) % total); }}
            >
              <ArrowLeft size={18} weight="bold" />
            </button>
          )}

          {/* Image */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="relative w-[90vw] h-[82vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index].src}
              alt={images[index].alt}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </motion.div>

          {/* Next arrow */}
          {total > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
              onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % total); }}
            >
              <ArrowRight size={18} weight="bold" />
            </button>
          )}

          {/* Caption */}
          {images[index].alt && (
            <div className="absolute bottom-6 left-0 right-0 text-center px-16">
              <span className="text-xs text-white/35">{images[index].alt}</span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
