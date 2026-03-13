// Network-first service worker v2 — clears all caches, never serves stale data
const SW_VERSION = "v2";

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Always go to network; never cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // For navigation requests, always go to network
  event.respondWith(
    fetch(event.request).catch(() => {
      // If offline and navigating, show a simple offline message
      if (event.request.mode === 'navigate') {
        return new Response('<h1>Offline</h1><p>Please check your internet connection.</p>', {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      return new Response('', { status: 503 });
    })
  );
});
