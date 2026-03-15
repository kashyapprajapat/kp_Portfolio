const CACHE_NAME = 'kp-portfolio-v14';

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
  '/manifest.webmanifest'
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

// Fetch: Cache-First + Network Fallback ensuring valid response for PWA install check
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache valid responses dynamically
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for offline mode if the request is HTML
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/');
        }
      });
    })
  );
});
