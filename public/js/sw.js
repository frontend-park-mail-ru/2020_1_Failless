const CACHE_NAME = 'eventum-v1.0.0';
const CACHE_PREFIX = 'eventum';

const CACHE_URLS = [
	'bundle.js',
	'/',
	'/login',
	'/signup',
	'/feed/users',
	'/feed/events',
	'/my/profile'
];

const CACHE_IMG = [
	'https://eventum.s3.eu-north-1.amazonaws.com/events/default.png',
	'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Andrey.jpg',
	'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Egor.jpg',
	'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Lisa.jpg',
	'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Vova.jpg',
	'https://eventum.s3.eu-north-1.amazonaws.com/app/creators/Sergey.jpeg'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
			console.log('Install some cache');
            return cache.addAll(CACHE_URLS);
        }).then(function() {
			return self.skipWaiting();
		}).catch(function(err) {
			console.log('Error with cache open ', err);
		})
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        }).then(() => {
			return self.clients.claim();
		})
    );
});

self.addEventListener('fetch', function(event) {
	if (event.request.url.includes("/api/")) {
		// response to API requests, Cache Update Refresh strategy
		event.respondWith(
			fetch(event.request).then(function(response) {
				if (!response.ok) {
					throw Error('response status ' + response.status);
				}

				if (event.request.method === 'GET') {
					let responseToCache = response.clone();
					
					caches.open(CACHE_NAME).then(function(cache) {
						console.warn('Put some cache:');
						console.log(event.request);
						console.log(responseToCache);
						cache.put(event.request, responseToCache);
					});
				}

				return response;
			}).catch(function(error) {
				caches.match(event.request).then(function(response) {
					// Cache hit - return response
					if (response) {
						console.warn('Found cache!', response);
						return response;
					}
				})
				.catch(function() {
					console.warn('Constructing a fallback response, due to an error while fetching the real response:', error);
					const fallbackResponse = {message: "You are out of network! Play Chrome Dino... oh no! Sorry we are Progressive App!", status: 228};
					return new Response(JSON.stringify(fallbackResponse), {
						headers: {'Content-Type': 'application/json'}
					});
				})
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
				
							caches.open(CACHE_NAME).then(function(cache) {
								console.log(`Save request ${event.request} with response ${responseToCache}`);
								cache.put(event.request, responseToCache);
							});
				
							return response;
						}
					);
			})
		);
	}
});