"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { useMapStore } from "@/lib/mindmap/store";

export function VideoModal() {
  const video = useMapStore((s) => s.video);
  const close = useMapStore((s) => s.closeVideo);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <button
            onClick={close}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 hover:bg-white/10"
            aria-label="Close"
          >
            <X size={20} weight="bold" />
          </button>
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-[min(1100px,90vw)] flex-col gap-3"
          >
            {video.title && (
              <div className="font-display text-xl text-[#faf8f4]">{video.title}</div>
            )}
            <div className="relative w-full overflow-hidden rounded-xl border border-[#ea824e]/20 shadow-2xl" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                src={video.url}
                title={video.title ?? "Video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
