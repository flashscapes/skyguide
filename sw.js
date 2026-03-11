const CACHE = 'roadguide-v5';

const CORE = [
  '/skyguide/',
  '/skyguide/index.html',
  '/skyguide/landmarks.js',
  '/skyguide/landmarks_south.js',
  '/skyguide/landmarks_topup.js',
  '/skyguide/manifest.json',
  '/skyguide/icon-192.png',
  '/skyguide/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {

      if (cached) return cached;

      return fetch(e.request).then(res => {

        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }

        return res;

      }).catch(() => cached || new Response('Offline', {status:503}));

    })
  );
});
