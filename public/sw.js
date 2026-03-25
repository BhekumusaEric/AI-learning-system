const CACHE = 'saaio-v1';

const APP_SHELL = [
  '/',
  '/dip/login',
  '/wrp/login',
  '/supervisor/login',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install — cache app shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', (e) => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!e.request.url.startsWith(self.location.origin)) return;

  // Skip API routes — always go to network
  if (e.request.url.includes('/api/')) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache successful responses for pages and static assets
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => {
        // Network failed — try cache
        return caches.match(e.request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, return the login page as fallback
          if (e.request.mode === 'navigate') {
            return caches.match('/dip/login');
          }
        });
      })
  );
});
