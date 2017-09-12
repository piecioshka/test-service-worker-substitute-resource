const map = new Map();
map.set('images/heart.png', 'images/warning.png');

self.addEventListener('install', (evt) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (evt) => {
    const url = evt.request.url;

    if (map.has(url)) {
        evt.respondWith(fetch(map.get(url)));
    }
});
