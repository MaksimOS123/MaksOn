//Тут тоже ничего нет. Совсем. Все файлы, которые подключены к этому сайту не хранят ничего. Только текст о том, что здесь ничего нет...









































































































































































































const CACHE = 'offline-fallback-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
	caches
	    .open(CACHE)
	    .then((cache) => cache.addAll(['/MaksOn/css/style.css', '/MaksOn/offline.html']))
	    .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    console.log('Активирован\n');
});

self.addEventListener('fetch', function(event) {
    console.log('Происходит запрос на сервер');
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

const Error404 =
    '<script type=\'text/javascript\'>\n' +
    '  location.href=\'/MaksOn/404.html\'\n' +
    '</script>';

function useFallback() {
    if (!navigator.onLine) {
	    console.log('Невозможно подключится к серверу. Выдаю сохраненные данные.');
	return Promise.resolve(new Response(FALLBACK, { headers: {
	    'Content-Type': 'text/html; charset=utf-8'
	}}));
    } else {
	return Promise.resolve(new Response(Error404, { headers: {
	    'Content-Type': 'text/html; charset=utf-8'
	}}));
    }
}

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
	cache.match(request).then((matching) =>
	    matching || Promise.reject('no-match')
	));
}
