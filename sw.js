const CACHE = 'im-dashboard-v1';
const ASSETS = [
  '/ironman-dashboard/',
  '/ironman-dashboard/index.html',
  '/ironman-dashboard/manifest.json',
  '/ironman-dashboard/icon-192.svg',
  '/ironman-dashboard/icon-512.svg',
  'https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always go to network for Strava API calls
  if (e.request.url.includes('strava.com')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
