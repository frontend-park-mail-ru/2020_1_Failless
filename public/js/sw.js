const CACHE_NAME = 'eventum-v1.0.0';
const CACHE_PREFIX = 'eventum';

const CACHE_URLS = [
	'bundle.js',
	'/',
	'/login'
];

this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
			console.log('Install some cache');
            return cache.addAll(CACHE_URLS);
        }).catch(function(err) {
			console.log('Error with cache open ', err);
		})
    );
});

this.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

this.addEventListener('fetch', function(event) {
	if (event.request.url.includes("/api/")) {
		// response to API requests, Cache Update Refresh strategy
		event.respondWith(
			fetch(event.request).then(function(response) {
				if (!response.ok) {
					throw Error('response status ' + response.status);
				}
				return response;
			}).catch(function(error) {
				console.warn('Constructing a fallback response, due to an error while fetching the real response:', error);
				const fallbackResponse = {message: "You are out of network! Play Chrome Dino... oh no! Sorry we are Progressive App!", status: 228};
				return new Response(JSON.stringify(fallbackResponse), {
					headers: {'Content-Type': 'application/json'}
				});
			})
		);
	} else {		
		event.respondWith(
			caches.match(event.request)
				.then(function(response) {
					// Cache hit - return response
					if (response) {
						return response;
					}
					return fetch(event.request).then(
						function(response) {
							// Check if we received a valid response
							if(!response || response.status !== 200 || response.type !== 'basic') {
								return response;
							}
				
							// IMPORTANT: Clone the response. A response is a stream
							// and because we want the browser to consume the response
							// as well as the cache consuming the response, we need
							// to clone it so we have two streams.
							let responseToCache = response.clone();
				
							caches.open(CACHE_NAME)
								.then(function(cache) {
								cache.put(event.request, responseToCache);
								});
				
							return response;
						}
					);
			})
		);
	}
});

// this.addEventListener('fetch', function(event) {
// 	event.respondWith(
// 		console.log('TEST0')
// 	);

	// event.respondWith(caches.match(event.request).then(function(response) {
	// 	console.log('TEST1')

	// 	// ресурс есть в кеше
	// 	if (response && !navigator.onLine) {
	// 		return response;
	// 	}

	// 	/* Важно: клонируем запрос. Запрос - это поток, может быть обработан только раз. Если мы хотим использовать объект request несколько раз, его нужно клонировать */
	// 	let fetchRequest = event.request.clone();

	// 	return fetch(fetchRequest).then(function(response) {

	// 		// проверяем, что получен корректный ответ
	// 		if (!response || response.status !== 200 || response.type !== 'basic') {
	// 			return response;
	// 		}

	// 		/* ВАЖНО: Клонируем ответ. Объект response также является потоком. */
	// 		let responseToCache = response.clone();
	// 		console.log('responseToCache1', responseToCache);

	// 		caches.open(CACHE_NAME).then(function(cache) {
	// 			cache.put(event.request, responseToCache);
	// 		});

	// 		return response;
	// 	});
	// }));
// });