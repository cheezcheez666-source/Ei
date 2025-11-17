const CACHE_NAME='gptking-cache-v1';
const urlsToCache=['index.html','app.js','behavior.js','emotion.js','markov.js','styles.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)))});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
