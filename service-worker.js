const cacheName = "weather-app-v1";
const assetsToCache = [
  "/weatherapp/styles.css",
  "/weatherapp/app.js",
  "/weatherapp/manifest.json",
  "/weatherapp/icons/icon-192x192.png",
  "/weatherapp/icons/icon-512x512.png",
  "/weatherapp/index.html",
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
