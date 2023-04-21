const CACHE_NAME = "pxn-2023.04.21.02";
const APP_SHELL = [
  "/pxn/",
  "/pxn/index.html",
  "/pxn/app/pause.html"
];
const APP_CONTENT = [

];
const APP_CACHE = APP_SHELL.concat(APP_CONTENT);

self.addEventListener("install", (e) => {
  //console.debug("[Service Worker] Install");

  e.waitUntil(
    (async () => {
      const CACHE = await caches.open(CACHE_NAME);
      //console.debug("[Service Worker] Caching all: app shell and content");
      await CACHE.addAll(APP_CACHE);
    })()
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const CACHED_RESOURCE = await caches.match(e.request);
      //console.debug(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (CACHED_RESOURCE) {
        return CACHED_RESOURCE;
      }
      const NEW_RESOURCE = await fetch(e.request);
      const CACHE = await caches.open(CACHE_NAME);
      //console.debug(`[Service Worker] Caching new resource: ${e.request.url}`);
      CACHE.put(e.request, NEW_RESOURCE.clone());
      return NEW_RESOURCE;
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((key_list) => {
      return Promise.all(
        key_list.map((key) => {
          if (key === CACHE_NAME) {
            return;
          }
          return caches.delete(key);
        })
      );
    })
  );
});
