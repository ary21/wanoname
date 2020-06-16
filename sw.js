var CACHE_NAME = 'my-site-cache-v2';
var urlsToCache = [
  '/',
  '/fallback.json',
  '/css/style.css',
  '/css/bootstrap.min.css',
  '/js/main.js',
  '/js/bootstrap.min.js',
  '/js/jquery-3.4.1.min.js',
  '/img/picture.jpg',
  '/img/icons.png',
  '/img/apple.png',
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName != CACHE_NAME
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  let request = event.request
  let url = new URL(request.url)

  // for check data API or static
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(function(response) {
        // Cache hit - return response
        return response || fetch(request);
      })
    ); 
  } 
  else {
    event.respondWith(
      caches.open('people-cache').then(function(cache) {
        return fetch(request).then(function(liveRespon) {
          cache.put(request, liveRespon.clone())
          return liveRespon
        }).catch(function(){
          return caches.match(request).then(function(response) {
            if (response) return response
            return caches.match('/fallback.json')
          })
        })
      })
    )
  }
});