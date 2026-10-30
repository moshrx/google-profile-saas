// Service Worker for ListedPEI
// Provides caching for offline support and faster repeat visits

const CACHE_NAME = 'listedpei-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.log('Cache installation failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip Google Analytics and tracking requests
  if (event.request.url.includes('googletagmanager.com') || 
      event.request.url.includes('google-analytics.com') ||
      event.request.url.includes('cookiebot.com')) {
    return;
  }

  event.respondWith(
    // Navigations are network-first so new deployments are visible immediately.
    (event.request.mode === 'navigate'
      ? fetch(event.request).catch(() => caches.match('/index.html'))
      : caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request)))
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response to cache it
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            // Only cache versioned static assets.
            if (event.request.url.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2)$/)) {
              cache.put(event.request, responseToCache);
            }
          });

          return response;
        })
        .catch(() => {
          // Return offline fallback if available
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        })
  );
});
