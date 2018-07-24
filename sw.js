setInterval(function(){
	const CACHE = 'offline-fallback-v1';

	self.addEventListener('install', (event) => {
	    event.waitUntil(
		caches
		    .open(CACHE)
		    .then((cache) => cache.addAll(['/MaksOn/css/style.css', '/MaksOn/news.html']))
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
	    '<script>console.log(\"Блин. Чувак. У тебя инета нет((\");</script>\n' + 
	    '<link rel="stylesheet" type="text/css" href="/MaksOn/css/style.css">\n' +
	    '<div id=\"off\">\n' +
	    '    <h1>Хей. Молодец!)<h1>\n' +
	    '    <h3>Тебе наверно интересно как это все работает, да?) Что же. Я дам тебе исходники))<h3><p><p>\n' +
	    '    <p><p><h5>Исходники, кншн, на GitHub: https://github.com/MaksimOS123/testSW<h5>\n' +
	    '	 <p><a href=\"/MaksOn/news.html\">Haha, clasic</a>\n' +
	    '</div>';

	const Error404 =
	      '<html\n' +
	      '	<head>\n' +
	      '	 <title>404. Страница не найдена</title>\n' +
	      '	 <link rel=\"stylesheet\" type=\"text/css\" href=\"/MaksOn/css/error.css\">\n' +
	      '  <link rel=\"stylesheet\" type=\"text/css\" href=\"/MaksOn/css/style.css\">\n' +
	      '  <meta http-equiv=\"content-type\" content=\"text/html\" charset=\"utf-8\">\n' +
	      '  <script async src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script>\n' +
	      ' </head>\n' +
	      ' <body>\n' +
	      '  <div id =\"header\">\n' +
	      '   <div id =\"header-zglv\">\n' +
	      '    <h1><a href="/MaksOn/" class="home">ЧТО ЭТО, ЕПТ?</a></h1>\n' +
	      '   </div>\n' +
	      '  </div>\n' +
	      '   <table>\n' +
	      '    <td>\n' +
	      '     <th>\n' +
	      '      <blockquote><blockquote></blockquote></blockquote>\n' +
	      '     </th><th>\n' +
	      '      <h2><b>Страница не найдена</b></h2><p><blockquote><h5>Неправильно набран адрес, или такой страницы больше не существует, а возможно, никогда<br>и не существовало.</h5></blockquote><blockquote><h5><b>Проверьте адрес</b> или <a href="/MaksOn/">перейдите на главную страницу</a>.</h5></blockquote>' +
	      '	    </th><th><img src="/MaksOn/image/error404.jpg" align=top></th></td></table></html>';

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
}, 1000);
