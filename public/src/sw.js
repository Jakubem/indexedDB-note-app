let CACHE = 'example';

self.addEventListener('install', (event) => {
  console.log('The service worker is being installed.');
  event.waitUntil(precache());
});

self.addEventListener('fetch', (event) => {
  console.log('Serving assets...');
  event.respondWith(fromCache(event.request));
  event.waitUntil(update(event.request));
})

function precache() {
  return caches.open(CACHE).then((cache) => {
    return cache.addAll([
      '/',
      '/index.html',
      '/main.js'
    ]);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then((cache) => {
    return cache.match(request).then((matching) => {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  return caches.open(CACHE).then((cache) => {
    return fetch(request).then((response) => {
      return cache.put(request, response);
    });
  });
}