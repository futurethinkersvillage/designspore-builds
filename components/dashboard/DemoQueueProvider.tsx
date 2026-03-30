"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { QueueEntry } from "@/lib/queue";

const STORAGE_KEY = "ds_demo_queue";

interface QueueContextValue {
  entries: QueueEntry[];
  addToQueue: (moduleId: string) => void;
  removeFromQueue: (moduleId: string) => void;
  reorderQueue: (entries: QueueEntry[]) => void;
  isQueued: (moduleId: string) => boolean;
  clear: () => void;
}

const QueueContext = createContext<QueueContextValue | null>(null);

export function DemoQueueProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  function persist(next: QueueEntry[]) {
    setEntries(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }

  const addToQueue = useCallback((moduleId: string) => {
    setEntries((prev) => {
      if (prev.some((e) => e.moduleId === moduleId)) return prev;
      const next = [...prev, { moduleId, addedAt: new Date().toISOString() }];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const removeFromQueue = useCallback((moduleId: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.moduleId !== moduleId);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const isQueued = useCallback(
    (moduleId: string) => entries.some((e) => e.moduleId === moduleId),
    [entries]
  );

  const reorderQueue = useCallback((next: QueueEntry[]) => {
    persist(next);
  }, []);

  const clear = useCallback(() => {
    persist([]);
  }, []);

  return (
    <QueueContext.Provider value={{ entries, addToQueue, removeFromQueue, reorderQueue, isQueued, clear }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useDemoQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error("useDemoQueue must be used inside DemoQueueProvider");
  return ctx;
}
