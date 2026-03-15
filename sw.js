const CACHE_NAME = 'kp-portfolio-v5';

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/script.js',
  '/assets/js/app.js',
  '/assets/js/particles.min.js',
  '/assets/images/Hero4.png',
  '/assets/images/Proflile1.png',
  '/assets/images/Faviconv2.png',
  '/assets/images/contact1.png',
  '/assets/images/icons/icon-192x192.png',
  '/assets/images/icons/icon-512x512.png',
  '/manifest.json'
];

// Install: precache key assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (CDN scripts, external APIs)
  if (!request.url.startsWith(self.location.origin)) return;

  // HTML pages: network-first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((response) => {
          // Cache valid responses
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
      .catch(() => {
        // Optionally return a fallback for images
        if (request.destination === 'image') {
          return new Response('', { status: 404 });
        }
      })
  );
});
