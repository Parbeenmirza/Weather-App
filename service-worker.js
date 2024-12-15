const cacheName = "weather-app-v1";
const assetsToCache = [
  "/Parbeenmirza/Weather-App/index.html",
  "/Parbeenmir/Weather-App/styles.css",
  "/Parbeenmirza/Weather-App/app.js",
  "/Parbeenmirza/Weather-App/manifest.json",
  "/Parbeenmirza/Weather-App/icons/icon-192x192.png",
  "/Parbeenmirza/Weather-App/icons/icon-512x512.png",
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
