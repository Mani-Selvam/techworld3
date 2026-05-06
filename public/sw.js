// TechARA Service Worker
// Smart multi-strategy caching for fast repeat visits + always-fresh HTML
// Bump CACHE_VERSION whenever you deploy and want to force-refresh the cache.
const CACHE_VERSION = "techara-v3";
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Install event — take control immediately
self.addEventListener("install", (event) => {
    self.skipWaiting();
});

// Activate event — clean up any old cache versions
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter((key) => !key.startsWith(CACHE_VERSION))
                    .map((key) => caches.delete(key)),
            );
            await self.clients.claim();
        })(),
    );
});

// Helper: limit cache size so we don't fill up phone storage
async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
        await cache.delete(keys[0]);
        await trimCache(cacheName, maxItems);
    }
}

// Network-first strategy: try network, fall back to cache (good for HTML)
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) return cached;
        // Last resort for navigations: serve cached index.html
        if (request.mode === "navigate") {
            const fallback = await cache.match("/index.html");
            if (fallback) return fallback;
        }
        throw err;
    }
}

// Cache-first strategy: serve from cache, fall back to network (good for hashed assets)
async function cacheFirst(request, cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
        if (maxItems) trimCache(cacheName, maxItems);
    }
    return networkResponse;
}

// Stale-while-revalidate: serve from cache instantly, update in background (good for images)
async function staleWhileRevalidate(request, cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const networkPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
                if (maxItems) trimCache(cacheName, maxItems);
            }
            return networkResponse;
        })
        .catch(() => cached);
    return cached || networkPromise;
}

self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Only handle GET requests
    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // Never cache cross-origin requests (fonts, third-party scripts) — let the browser handle them
    if (url.origin !== self.location.origin) return;

    // Never cache API or auth endpoints — they must always be fresh
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) {
        return;
    }

    // Never cache the service worker itself or the manifest
    if (url.pathname === "/sw.js" || url.pathname === "/manifest.json") return;

    // Strategy 1: HTML / navigation requests → network-first (always try fresh)
    if (request.mode === "navigate" || request.destination === "document") {
        event.respondWith(networkFirst(request, RUNTIME_CACHE));
        return;
    }

    // Strategy 2: hashed JS/CSS bundles → cache-first (they have content hashes, so safe forever)
    if (
        url.pathname.startsWith("/assets/") &&
        (url.pathname.endsWith(".js") || url.pathname.endsWith(".css"))
    ) {
        event.respondWith(cacheFirst(request, ASSET_CACHE, 80));
        return;
    }

    // Strategy 3: images and media → stale-while-revalidate (fast + eventually fresh)
    if (
        request.destination === "image" ||
        /\.(png|jpe?g|webp|gif|svg|ico|avif)$/i.test(url.pathname)
    ) {
        event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE, 60));
        return;
    }

    // Strategy 4: fonts → cache-first
    if (
        request.destination === "font" ||
        /\.(woff2?|ttf|otf|eot)$/i.test(url.pathname)
    ) {
        event.respondWith(cacheFirst(request, ASSET_CACHE, 30));
        return;
    }

    // Default: stale-while-revalidate for anything else same-origin
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, 50));
});

// Allow the page to trigger an immediate update
self.addEventListener("message", (event) => {
    if (event.data === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
