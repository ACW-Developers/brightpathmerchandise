// Network-first service worker — never serve stale data
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});
// Always go to network; never cache API or dynamic content
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
