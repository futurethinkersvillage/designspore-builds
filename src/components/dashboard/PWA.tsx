"use client";

import { useEffect, useState } from "react";
import { DownloadSimple, X } from "@phosphor-icons/react";

// Minimal shape of the (non-standard) beforeinstallprompt event.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Makes the Village Dashboard installable:
 *  - emits the manifest link + theme/apple meta tags (React 19 hoists these to <head>)
 *  - registers the service worker
 *  - surfaces a mobile "Install app" button when the browser offers one
 */
export default function PWA() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => console.warn("SW registration failed:", err));
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setDismissed(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  const showButton = deferred && !dismissed;

  return (
    <>
      {/* PWA head tags — hoisted to <head> by React 19 */}
      <link rel="manifest" href="/manifest.webmanifest" />
      <meta name="theme-color" content="#1A1720" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Village" />
      <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />

      {/* Install affordance — mobile only, sits just above the bottom tab bar */}
      {showButton && (
        <div
          className="lg:hidden fixed inset-x-0 z-40 px-3"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 4.25rem)" }}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-amber/30 bg-warm-dark/95 backdrop-blur-xl px-4 py-3 shadow-lg shadow-black/40">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white leading-tight">
                Install Village
              </p>
              <p className="text-[11px] text-white/45 leading-tight mt-0.5">
                Add to your home screen
              </p>
            </div>
            <button
              onClick={install}
              className="flex items-center gap-1.5 rounded-xl bg-amber px-3.5 py-2 text-[13px] font-semibold text-warm-dark transition-transform active:scale-95"
            >
              <DownloadSimple size={16} weight="bold" />
              Install
            </button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="p-1 text-white/35 hover:text-white/70 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
