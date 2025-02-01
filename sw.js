const CACHE_NAME = 'taydot-v1';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([
    '/',
    '/index.html',
    '/styles.css',
    '/app.js'
  ])));
});
