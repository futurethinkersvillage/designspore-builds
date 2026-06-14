"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Campfire } from "@phosphor-icons/react";

/** Brief branded intro overlay on first load. */
export function Loader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="app-bg fixed inset-0 z-[90] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, #f2a878, #ea824e 60%, rgba(175,105,94,0.55))",
              boxShadow: "0 0 60px rgba(234,130,78,0.55)",
            }}
          >
            <Campfire size={36} weight="duotone" color="#1a1720" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-5 font-display text-3xl font-medium text-[#faf8f4]"
          >
            The <em className="italic text-[#f2a878]">Portal.Place</em> Vision
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ea824e]/80"
          >
            Loading the map…
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
