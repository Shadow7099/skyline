// Service worker SOLO para la app de la puerta (scope /puerta).
// No controla ni toca ninguna otra página del sitio.
const CACHE = "puerta-skyline-v4";
const FILES = ["/puerta.html", "/puerta.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("puerta-skyline-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero intenta la red (para recibir actualizaciones); sin señal, usa la copia guardada.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith("/puerta")) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(url.pathname === "/puerta" ? "/puerta.html" : url.pathname, copy));
        }
        return res;
      })
      .catch(() => caches.match(url.pathname === "/puerta" ? "/puerta.html" : url.pathname, { ignoreSearch: true }))
  );
});
