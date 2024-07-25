const CACHE_NAME = 'farbig-cache-int-v0.1.2'
const EXTERNAL_CACHE_NAME = 'farbig-cache-ext-v0.0.1'

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.svg',
  '/box.js',
  '/random.js',
  '/match.js',
  '/mouse.js',
  '/score.js',
  '/explode.js',
  '/colors.js',
  '/menu.js',
  '/version.json',
]

const EXTERNAL_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE)
      }),
      caches.open(EXTERNAL_CACHE_NAME).then((cache) => {
        return cache.addAll(EXTERNAL_ASSETS)
      })
    ])
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (EXTERNAL_ASSETS.includes(url.href)) {
    event.respondWith(
      caches.open(EXTERNAL_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((response) => {
            cache.put(event.request, response.clone())
            return response
          });
        });
      })
    );
  } else {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cached) => {
          const live = fetch(event.request).then((response) => {
            cache.put(event.request, response.clone())
            return response
          })

          return cached || live
        })
      })
    )
  }
})

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, EXTERNAL_CACHE_NAME]
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      }),
    ])
  )
})

const updateIfNecessary = async () => {
  console.log('Checking for updates ...')

  const url = new URL('/version.json', location.href)

  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(url)
  const { version: cachedVersion } = cached ? await cached.json() : {}

  const clients = await self.clients.matchAll()

  if (cached) {
    console.log('Current version ' + cachedVersion)
    clients.forEach(client => {
      client.postMessage({
        type: 'CURRENT_VERSION_RETRIEVED',
        version: cachedVersion,
      })
    })
  }

  const response = await fetch(url)
  const { version } = await response.json()

  if (cachedVersion !== version) {
    console.log('Update required, updating in the background ...')
    await cache.addAll(ASSETS_TO_CACHE)
    console.log('Updated to ' + version)

    clients.forEach(client => {
      client.postMessage({
        type: 'ASSETS_UPDATED',
        version,
      })
    })
  } else {
    console.log('Client is already up to date')
  }
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CHECK_FOR_UPDATES') {
    updateIfNecessary()
  }
})
