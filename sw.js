const CACHE = 'offline-fallback-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
	caches
	    .open(CACHE)
	    .then((cache) => cache.addAll(['/MaksOn/css/style.css', '/MaksOn/offline.html', '/MaksOn/css/mn.css', '/MaksOn/images/fire.jpg', '/MaksOn/2202/IJ/LULR/pashalka.html']))
	    .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
    event.respondWith(networkOrCache(event.request)
	.catch(() => useFallback()));
});

function networkOrCache(request) {
    return fetch(request)
	.then((response) => response.ok ? response : fromCache(request))
	.catch(() => fromCache(request));
}

const FALLBACK =
    '<script type=\'text/javascript\'>\n' +
    '  location.href=\'/MaksOn/offline.html\'\n' +
    '</script>';

// const Error404 =
//     '<script type=\'text/javascript\'>\n' +
//     '  location.href=\'/MaksOn/404.html\'\n' +
//     '</script>';

function useFallback() {
//     if (!navigator.onLine) {
    	return Promise.resolve(new Response(FALLBACK, { headers: {
    	    'Content-Type': 'text/html; charset=utf-8'
    	}}));
//     } else {
//     	return Promise.resolve(new Response(Error404, { headers: {
//     	    'Content-Type': 'text/html; charset=utf-8'
//     	}}));
//     }
}

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
	cache.match(request).then((matching) =>
	    matching || Promise.reject('no-match')
	));
}
