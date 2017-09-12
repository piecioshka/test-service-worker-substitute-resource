const CACHED_NAME = 'test-service-worker-substitute-resource';
const PRECACHED_FILES = [
    './',
    './images/warning.png'
];

const map = new Map();
map.set('/images/heart.png', '/images/warning.png');

self.addEventListener('install', async (evt) => {
    console.log('Event: install', { evt });
    const cache = await caches.open(CACHED_NAME);
    await cache.addAll(PRECACHED_FILES);
    return self.skipWaiting();
});

self.addEventListener('fetch', (evt) => {
    console.log('Event: fetch', evt.request.url);
    evt.respondWith(handleFetch(evt));
});

async function handleFetch(evt) {
    const request = evt.request;
    const url = new URL(request.url);
    const isOffline = !navigator.onLine;

    const cache = await caches.open(CACHED_NAME);

    let newRequest = null;

    if (map.has(url.pathname) && isOffline) {
        newRequest = new Request(map.get(url.pathname));
    } else {
        newRequest = request.clone();
    }

    const resource = await cache.match(newRequest);

    if (resource) {
        console.log(' => Hit cache', newRequest.url);
        return resource;
    }

    const response = await fetch(newRequest);
    console.log(' => Download fresh resource', newRequest.url);
    await cache.put(request, response.clone());
    return response;

}
