/* Village Dashboard service worker — enables install (WebAPK) + offline demo use.
   Strategy: cache-first for hashed static assets, network-first for everything
   else with a cached fallback so the app still opens with no signal. */
const CACHE = "village-dashboard-v1";

// Precache the app shell entry so a cold offline launch still renders something.
const PRECACHE = ["/", "/?source=pwa"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // don't touch cross-origin

  // Immutable hashed assets + images → cache-first.
  const cacheFirst =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    /\.(?:js|css|woff2?|png|jpg|jpeg|svg|webp|avif|ico)$/.test(url.pathname);

  if (cacheFirst) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  // Pages / data → network-first, fall back to cache (then app shell).
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() =>
        caches.match(request).then((hit) => hit || caches.match("/"))
      )
  );
});
