const CACHED_NAME = 'test-service-worker-substitute-resource';
const PRECACHED_FILES = [
    './',
    './images/warning.png'
];

const map = new Map();
map.set('/images/heart.png', '/images/warning.png');

self.addEventListener('install', async (evt) => {
    const cache = await caches.open(CACHED_NAME);
    await cache.addAll(PRECACHED_FILES);
    return await self.skipWaiting();
});

self.addEventListener('fetch', (evt) => {
    evt.respondWith(handleFetch(evt));
});

async function handleFetch(evt) {
    const request = evt.request;
    const url = new URL(request.url);
    const status = map.has(url.pathname);
    const isOffline = !navigator.onLine;

    if (status && isOffline) {
        const cache = await caches.open(CACHED_NAME);
        const resource = await cache.match(map.get(url.pathname));
        return resource.clone();
    } else {
        return fetch(request);
    }
}
